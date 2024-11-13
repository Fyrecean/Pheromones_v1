import { ISimulationParameters } from "./simulationConfig";
import simulationShader from "./shaders/simulation.wgsl";
import typesShader from "./shaders/types.wgsl";

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
                    buffer: {
                      type: "storage",
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        format: textureFormat,
                        access: "read-only",
                    },
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        format: textureFormat,
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
                module: device.createShaderModule({code: `${typesShader}\n${simulationShader}`}),
                entryPoint: 'simulate'
            }
        });

        this.uniformBuffer = device.createBuffer({
            size: 50,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }

    addPass(commandEncoder: GPUCommandEncoder, textureIn: GPUTexture, textureOut: GPUTexture, timestampWrites?: GPURenderPassTimestampWrites): void {
        const uniformInts = new Uint32Array([
            this.simulationParameters.width,
            this.simulationParameters.height,
            this.simulationParameters.agentCount,
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
            this.simulationParameters.steerFactor,
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
                    resource:{ buffer: this.agentsBuffer }, 
                },
                {
                    binding: 2,
                    resource: textureIn.createView(),
                },
                {
                    binding: 3,
                    resource: textureOut.createView(),
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