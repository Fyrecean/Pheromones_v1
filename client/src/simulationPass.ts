import { ISimulationParameters } from "./simulationConfig";

const WORKGROUP_SIZE = 64;

export class SimulationPass {
    device: GPUDevice;
    pheromoneTexture: GPUTexture;
    agentsBuffer: GPUBuffer;

    bindGroup: GPUBindGroup;
    uniformBuffer: GPUBuffer;
    pipeline: GPUComputePipeline;

    constructor(device: GPUDevice, simulationParameters: ISimulationParameters, pheromoneTexture: GPUTexture, agentsBuffer: GPUBuffer) {
        const shaderCode = `
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

        struct Uniforms {
            time: u32
        }

        @group(0) @binding(0) var<uniform> uniforms: Uniforms;

        @group(0) @binding(1) var textureOut: texture_storage_2d<${pheromoneTexture.format}, write>;
        @group(0) @binding(2) var<storage, read_write> agents: array<vec4f, ${simulationParameters.agentCount}>;

        @compute @workgroup_size(${WORKGROUP_SIZE})
        fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let index = global_id.x;
        // Trim off the excess if agentCount % WORKGROUP_SIZE != 0
        if (index >= ${simulationParameters.agentCount}) {
            return;
        }

        var agent = agents[index];

        agent.x += agent.z;
        agent.y += agent.w;

        if (agent.x >= ${simulationParameters.width} || agent.x < 0) {
            agent.z = -agent.z;
        }
        if (agent.y >= ${simulationParameters.height} || agent.y < 0) {
            agent.w = -agent.w;
        }

        let randomDirChange = .1 * vec2(Random(uniforms.time + u32(agent.x)) - .5, Random(uniforms.time + u32(agent.y)) - .5);
        let velocity = normalize(agent.zw + randomDirChange);

        agent.z = velocity.x;
        agent.w = velocity.y;

        let pixel = vec2<u32>(agent.xy);
        textureStore(textureOut, pixel, vec4(1.));
        agents[index] = agent;
        }`;

        this.device = device;
        this.pheromoneTexture = pheromoneTexture;
        this.agentsBuffer = agentsBuffer;

        this.uniformBuffer = device.createBuffer({
            size: 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

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
                        format: pheromoneTexture.format,
                        access: "write-only",
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                      type: "storage",
                    },
                },
            ] as GPUBindGroupLayoutEntry[]
        });

        this.bindGroup = device.createBindGroup({
            label: "Simulation Bind Group",
            layout: computeBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.uniformBuffer },
                },
                {
                    binding: 1,
                    resource: pheromoneTexture.createView(),
                },
                {
                    binding: 2,
                    resource:{ buffer: agentsBuffer }, 
                }
            ] as GPUBindGroupEntry[]
        });

        this.pipeline = device.createComputePipeline({
            label: "Simulation Pipeline",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [computeBindGroupLayout],
            }),
            compute: {
                module: device.createShaderModule({code: shaderCode}),
                entryPoint: 'simulate'
            }
        });
    }

    addPass(commandEncoder: GPUCommandEncoder): void {
        const uniformData = new Uint32Array([new Date().getMilliseconds()]);

        this.device.queue.writeBuffer(
            this.uniformBuffer,
            0,
            uniformData,
            0,
            uniformData.length,
        )

        const simulatePass = commandEncoder.beginComputePass();
        simulatePass.setPipeline(this.pipeline);
        simulatePass.setBindGroup(0, this.bindGroup);
        simulatePass.dispatchWorkgroups(1);
        simulatePass.end();
    }
}