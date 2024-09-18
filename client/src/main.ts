const WORKGROUP_SIZE = 8;
const NUMBER_OF_AGENTS = 1000;

const computeShader = `

// Hash function from H. Schechter & R. Bridson, goo.gl/RXiKaH
fn Hash(p: u32) -> u32
{
    var s = p; 
    s ^= 2747636419u;
    s *= 2654435769u;
    s ^= s >> 16;
    s *= 2654435769u;
    s ^= s >> 16;
    s *= 2654435769u;
    return s;
}

fn Random(seed: u32) -> f32
{
    return f32(Hash(seed)) / 4294967295.0; // 2^32-1
}

@group(0) @binding(0) var textureOut: texture_storage_2d<r32float, read_write>;
@group(0) @binding(1) var<storage, read_write> agents: array<vec4f, ${NUMBER_OF_AGENTS}>;

@compute @workgroup_size(8, 8)
fn attenuate(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let current = textureLoad(textureOut, global_id.xy);
    textureStore(textureOut, global_id.xy, max(vec4(0.), current - 0.1));
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let index = global_id.x;
  agents[index].x += agents[index].z + (Random(u32(agents[index].y)) - .5);
  agents[index].y += agents[index].w + (Random(u32(agents[index].x)) - .5);
  let pixel = vec2<u32>(agents[index].xy);
  textureStore(textureOut, pixel, vec4(1.));
}`;

const renderShader = `
@group(0) @binding(0) var textureIn: texture_storage_2d<r32float, read>;
@group(0) @binding(1) var samplerIn: sampler;

struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) uv : vec2f,
}

@vertex
fn vertex_main(@builtin(vertex_index) VertexIndex: u32) -> VertexOut
{
  var vertices = array<vec2f, 6>(
    vec2(-1, -1),
    vec2(1, -1),
    vec2(-1, 1),
    vec2(1, 1),
    vec2(1, -1),
    vec2(-1, 1),
  );
  var uvs = array<vec2f, 6> (
    vec2(0, 0),
    vec2(1, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),
    vec2(0, 1),
 );
  var output : VertexOut;
  output.position = vec4(vertices[VertexIndex], 0, 1);
  output.uv = uvs[VertexIndex];
  
  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  return vec4(textureSample(textureIn, samplerIn, fragData.uv).xyz, 1);
}`;

async function go(): Promise<void> {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const adapter = await navigator.gpu.requestAdapter();
    const hasTimestampQuery = adapter.features.has("timestamp-query");
    const device = await adapter.requestDevice({
        requiredFeatures: hasTimestampQuery ? ["timestamp-query"] as GPUFeatureName[]: [],
    });

    // Performance Statistics Document Setup
    const perfDisplayContainer = document.createElement('div');
    perfDisplayContainer.style.color = 'white';
    perfDisplayContainer.style.backdropFilter = 'blur(10px)';
    perfDisplayContainer.style.position = 'absolute';
    perfDisplayContainer.style.bottom = '10px';
    perfDisplayContainer.style.left = '10px';
    perfDisplayContainer.style.textAlign = 'left';
    const perfDisplay = document.createElement('pre');
    perfDisplay.style.margin = '.5em';
    perfDisplayContainer.appendChild(perfDisplay);
    canvas.parentNode.appendChild(perfDisplayContainer);

    const context = canvas.getContext('webgpu') as GPUCanvasContext;
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    // Adjust canvas size to accomodate hi-res displays
    const devicePixelRatio = window.devicePixelRatio;
    // canvas.width = canvas.clientWidth * devicePixelRatio;
    // canvas.height = canvas.clientHeight * devicePixelRatio;

    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied'
    });

    /*
    Create a texture which is bound to by a compute pipeline and a render pipeline.
    The compute pipline will write pheromone values to the texture
    The render pipeline will sample the pheromone texture on a quad.
    */

    const texture = device.createTexture({
        size: [canvas.width, canvas.height],
        format:  'r32float',
        usage: 
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.STORAGE_BINDING
    });

    const agentsArray = new Array(4 * NUMBER_OF_AGENTS);
    for (let i = 0; i < NUMBER_OF_AGENTS; i += 4) {
        agentsArray[i] = 128;
        agentsArray[i+1] = 256;
        agentsArray[i+2] = Math.random() - .5;
        agentsArray[i+3] = Math.random() - .5;
    }

    const agentsBuffer = device.createBuffer({
        size: 16 * NUMBER_OF_AGENTS,
        usage: GPUBufferUsage.STORAGE,
        mappedAtCreation: true,
    });
    new Float32Array(agentsBuffer.getMappedRange()).set(agentsArray);
    
    agentsBuffer.unmap();

    const computeBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture: {
                    format: "r32float",
                    access: "read-write",
                    
                }
            },
            {
                binding: 1,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                  type: "storage",
                },
            },
        ] as GPUBindGroupLayoutEntry[]
    });

    const computeBindGroup = device.createBindGroup({
        layout: computeBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: texture.createView(),
            },
            {
                binding: 1,
                resource:{ buffer: agentsBuffer }, 
            }
        ] as GPUBindGroupEntry[]
    });

    const computeShaderModule = device.createShaderModule({ code: computeShader });

    const computePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [computeBindGroupLayout],
        }),
        compute: {
            module: computeShaderModule,
            entryPoint: 'simulate'
        }
    });

    const attenuatePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [computeBindGroupLayout],
        }),
        compute: {
            module: computeShaderModule,
            entryPoint: 'attenuate',
        },
    });


    const sampler = device.createSampler({
    });
    
    const renderShaderModule = device.createShaderModule({
        code: renderShader
    });

    const renderBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                storageTexture: {
                    format: "r32float",
                    access: "read-write",
                    
                }
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {
                    type: "non-filtering",
                },
            }
        ] as GPUBindGroupLayoutEntry[],
    });

    const renderPipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [renderBindGroupLayout],
        }),
        vertex: {
            module: renderShaderModule,
        },
        fragment: {
            module: renderShaderModule,
            targets: [
                {
                    format: presentationFormat,
                },
            ],
        },
        primitive: {
            topology: 'triangle-list',
        }
    });

    const renderBindGroup = device.createBindGroup({
        label: "Render Bind Group",
        layout: renderPipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: texture.createView(),
            },
            {
                binding: 1,
                resource: sampler,
            }
        ],
    });

    const frame = () => {
        const commandEncoder = device.createCommandEncoder();
        const canvasTextureView = context.getCurrentTexture().createView();

        const attenuatePass = commandEncoder.beginComputePass();
        attenuatePass.setPipeline(attenuatePipeline);
        attenuatePass.setBindGroup(0, computeBindGroup);
        attenuatePass.dispatchWorkgroups(Math.floor(canvas.width / 8), Math.floor(canvas.height / 8));
        attenuatePass.end();
        

        const simulatePass = commandEncoder.beginComputePass();
        simulatePass.setPipeline(computePipeline);
        simulatePass.setBindGroup(0, computeBindGroup);
        simulatePass.dispatchWorkgroups(WORKGROUP_SIZE);
        simulatePass.end();

        const renderPassDescriptor: GPURenderPassDescriptor  = {
            colorAttachments: [
                {
                    view: canvasTextureView,
                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ] as GPURenderPassColorAttachment[],
        };
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(renderPipeline);
        passEncoder.setBindGroup(0, renderBindGroup);
        passEncoder.draw(6);
        passEncoder.end();

        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

go();