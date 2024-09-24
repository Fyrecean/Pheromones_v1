import { ISimulationParameters } from "./simulationConfig";

const WORKGROUP_SIZE = 64;

export class SimulationPass {
    device: GPUDevice;
    pheromoneTexture: GPUTexture;
    agentsBuffer: GPUBuffer;
    simulationParameters: ISimulationParameters;

    workgroups: number;
    bindGroup: GPUBindGroup;
    uniformBuffer: GPUBuffer;
    pipeline: GPUComputePipeline;

    constructor(device: GPUDevice, simulationParameters: ISimulationParameters, textureFormat: GPUTextureFormat, agentsBuffer: GPUBuffer) {
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
            time: u32,
            sampleDistance: u32,
            turnJitter: f32,
            steerFactor: f32,
        }

        @group(0) @binding(0) var<uniform> uniforms: Uniforms;

        @group(0) @binding(1) var textureOut: texture_storage_2d<${textureFormat}, write>;
        @group(0) @binding(2) var<storage, read_write> agents: array<vec4f, ${simulationParameters.agentCount}>;
        @group(0) @binding(3) var textureIn: texture_storage_2d<${textureFormat}, read>;

        const leftSampleMatrix =  mat2x2(0.866025, 0.5, -0.5, 0.866025);
        const rightSampleMatrix = mat2x2(0.866025, -0.5, 0.5, 0.866025);
        fn samplePheromone(position: vec2<f32>, direction: vec2<f32>, steps: u32) -> vec3<f32> {
            let sampleStart = position + direction * 2;
            var sum = vec3(0.);
            let fSteps = f32(steps);
            for (var i = 0.; i < fSteps; i += 1.) {
                sum += textureLoad(textureIn, vec2<i32>(round(sampleStart + i * direction))).xyz;
            }
            return sum;
        }

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

        let randomDirChange = uniforms.turnJitter * vec2(Random(uniforms.time + global_id.x) - .5, Random(uniforms.time + global_id.x + ${simulationParameters.height}) - .5);
        var velocity = normalize(agent.zw + randomDirChange);

        // Take pheromone samples
        let rightSampleDir = rightSampleMatrix * velocity;
        let rightSamplePixel = vec2<i32>(round(agent.xy + 3 * rightSampleDir));
        
        let forwardSamplePixel = vec2<i32>(round(agent.xy + 3 * velocity));

        
        let leftSampleDir = leftSampleMatrix * velocity;

        let rightSample = samplePheromone(agent.xy, rightSampleDir, uniforms.sampleDistance).x;
        let forwardSample = samplePheromone(agent.xy, velocity, uniforms.sampleDistance).x;
        let leftSample = samplePheromone(agent.xy, leftSampleDir, uniforms.sampleDistance).x;
        
        if (forwardSample < rightSample || forwardSample < leftSample) {
            if (rightSample > leftSample) {
                velocity += uniforms.steerFactor * rightSampleDir;
            } else {
                velocity += uniforms.steerFactor * leftSampleDir;
             }
            velocity = normalize(velocity);
        }

        let pixel = vec2<i32>(round(agent.xy));
        textureStore(textureOut, pixel, vec4(1., 0., 0., 1.));
        
        agent.z = velocity.x;
        agent.w = velocity.y;
        agents[index] = agent;
        }`;

        this.device = device;
        this.agentsBuffer = agentsBuffer;
        this.workgroups = Math.ceil(simulationParameters.agentCount / WORKGROUP_SIZE);
        this.simulationParameters = simulationParameters;

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
                        format: textureFormat,
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
                {
                    binding: 3,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        format: textureFormat,
                        access: "read-only",
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
                entryPoint: 'simulate'
            }
        });

        this.uniformBuffer = device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }

    addPass(commandEncoder: GPUCommandEncoder, textureIn: GPUTexture, textureOut: GPUTexture, timestampWrites?: GPURenderPassTimestampWrites): void {
        const uniformInts = new Uint32Array([
            window.performance.now() * 10,
            this.simulationParameters.sampleDistance,
        ]);

        this.device.queue.writeBuffer(
            this.uniformBuffer,
            0,
            uniformInts,
            0,
            uniformInts.length,
        );
        const uniformFloats = new Float32Array([
            this.simulationParameters.turnJitter,
            this.simulationParameters.steerFactor
        ])
        this.device.queue.writeBuffer(
            this.uniformBuffer,
            uniformInts.byteLength,
            uniformFloats,
            0,
            uniformFloats.length,
        );

        const passDescriptor = {
            timestampWrites
        };

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
                    resource: textureOut.createView(),
                },
                {
                    binding: 2,
                    resource:{ buffer: this.agentsBuffer }, 
                },
                {
                    binding: 3,
                    resource: textureIn.createView(),
                },
            ] as GPUBindGroupEntry[]
        });

        const simulatePass = commandEncoder.beginComputePass(passDescriptor);
        simulatePass.setPipeline(this.pipeline);
        simulatePass.setBindGroup(0, this.bindGroup);
        simulatePass.dispatchWorkgroups(this.workgroups);
        simulatePass.end();
    }
}