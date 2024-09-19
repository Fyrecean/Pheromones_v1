import { ISimulationParameters } from "./simulationConfig";

const WORKGROUP_SIZE = 64;

export class TexturePass {
    device: GPUDevice;
    pheromoneTextureIn: GPUTexture;
    pheromoneTextureOut: GPUTexture;

    workgroups: number[];
    bindGroup: GPUBindGroup;
    uniformBuffer: GPUBuffer;
    pipeline: GPUComputePipeline;

    constructor(device: GPUDevice, simulationParameters: ISimulationParameters, pheromoneTextureFormat: GPUTextureFormat) {
        // TODO - Remove Uniform?
        const shaderCode = `
        struct Uniforms {
            color: vec4<f32>
        }
        @group(0) @binding(0) var<uniform> uniforms: Uniforms;

        @group(0) @binding(1) var textureIn: texture_storage_2d<${pheromoneTextureFormat}, read>;
        @group(0) @binding(2) var textureOut: texture_storage_2d<${pheromoneTextureFormat}, write>;

        @compute @workgroup_size(8, 8)
        fn attenuate(@builtin(global_invocation_id) global_id: vec3<u32>) {
            if (global_id.x >= ${simulationParameters.width} || global_id.y >= ${simulationParameters.height}) {
                return;
            }
            
            let pixel = global_id.xy;

            // Define Gaussian kernel (3x3)
            let ortho = .09;
            let diag = .01;
            let kernel: array<array<f32, 3>, 3> = array<array<f32, 3>, 3>(
                array<f32, 3>(diag, ortho, diag),
                array<f32, 3>(ortho,  .6,  ortho),
                array<f32, 3>(diag, ortho, diag)
            );

            var colorSum = 0.0;

            // Loop through neighboring pixels (3x3 kernel)
            for (var i: i32 = -1; i <= 1; i = i + 1) {
                for (var j: i32 = -1; j <= 1; j = j + 1) {
                    let samplePixel= vec2(i32(global_id.x) + i, i32(global_id.y) + j);

                    // Ensure we don't sample out of bounds
                    if (samplePixel.x < ${simulationParameters.width} && samplePixel.y < ${simulationParameters.height}) {
                        let sampleColor = textureLoad(textureIn, samplePixel).x; // Load neighboring pixel color
                        colorSum += sampleColor * kernel[i + 1][j + 1]; // Apply Gaussian kernel
                    }
                }
            }

            colorSum = max(0., colorSum - .002);

            textureStore(textureOut, pixel, vec4(vec3(colorSum), 1.0)); // Store blurred color
        }

            `;

        this.device = device;
        this.workgroups = [Math.ceil(simulationParameters.width / 8), Math.ceil(simulationParameters.height / 8)];

        this.uniformBuffer = device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        // Color
        const uniformData = new Uint32Array([
            0.,
            1.,
            1.,
            1.,
        ]);

        this.device.queue.writeBuffer(
            this.uniformBuffer,
            0,
            uniformData,
            0,
            uniformData.length,
        );

        const computeBindGroupLayout = device.createBindGroupLayout({
            label: "Simulation Bind Group Layout",
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "uniform",
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        format: pheromoneTextureFormat,
                        access: "read-only",
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        format: pheromoneTextureFormat,
                        access: "write-only",
                    },
                },
            ] as GPUBindGroupLayoutEntry[]
        });

        this.pipeline = device.createComputePipeline({
            label: "Simulation Pipeline",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [computeBindGroupLayout],
            }),
            compute: {
                module: device.createShaderModule({code: shaderCode}),
                entryPoint: 'attenuate'
            }
        });
    }

    addPass(commandEncoder: GPUCommandEncoder, textureIn: GPUTexture, textureOut: GPUTexture, timestampWrites?: GPURenderPassTimestampWrites): void {
        const passDescriptor = {
            timestampWrites
        }

        this.bindGroup = this.device.createBindGroup({
            label: "Simulation Bind Group",
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.uniformBuffer },
                },
                {
                    binding: 1,
                    resource: textureIn.createView(),
                },
                {
                    binding: 2,
                    resource: textureOut.createView(), 
                }
            ] as GPUBindGroupEntry[]
        });

        const simulatePass = commandEncoder.beginComputePass(passDescriptor);
        simulatePass.setPipeline(this.pipeline);
        simulatePass.setBindGroup(0, this.bindGroup);
        simulatePass.dispatchWorkgroups(this.workgroups[0], this.workgroups[1]);
        simulatePass.end();
    }
}