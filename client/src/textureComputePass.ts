import { Mat3, mat3 } from "wgpu-matrix";
import { ISimulationParameters } from "./simulationConfig";
import shaderCode from "./shaders/gaussian.wgsl";

const WORKGROUP_SIZE = 64;

export class TexturePass {
    device: GPUDevice;
    pheromoneTextureIn: GPUTexture;
    pheromoneTextureOut: GPUTexture;

    workgroups: number[];
    bindGroup: GPUBindGroup;
    uniformBuffer: GPUBuffer;
    pipeline: GPUComputePipeline;
    
    simulationParamters: ISimulationParameters;
    prevGaussianStdDev: number;
    kernel: Mat3;

    constructor(device: GPUDevice, simulationParameters: ISimulationParameters, pheromoneTextureFormat: GPUTextureFormat) {

        this.device = device;
        this.workgroups = [Math.ceil(simulationParameters.width / 8), Math.ceil(simulationParameters.height / 8)];

        this.simulationParamters = simulationParameters;
        this.prevGaussianStdDev = simulationParameters.gaussianStdDev;
        this.kernel = generateGaussianKernel(simulationParameters.gaussianStdDev, 3);
        this.uniformBuffer = device.createBuffer({
            size: this.kernel.byteLength + 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.device.queue.writeBuffer(
            this.uniformBuffer,
            0,
            this.kernel.buffer,
            this.kernel.byteOffset,
            this.kernel.byteLength,
        );
        this.device.queue.writeBuffer(
            this.uniformBuffer,
            this.kernel.byteLength,
            new Float32Array([this.simulationParamters.passiveAttenuation]),
            0,
            1
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
        if (this.simulationParamters.gaussianStdDev != this.prevGaussianStdDev) {
            this.kernel = generateGaussianKernel(this.simulationParamters.gaussianStdDev, 3);
            this.device.queue.writeBuffer(
                this.uniformBuffer,
                0,
                this.kernel.buffer,
                this.kernel.byteOffset,
                this.kernel.byteLength,
            );
        }

        // Write floats
        const floats = new Float32Array([this.simulationParamters.passiveAttenuation])
        this.device.queue.writeBuffer(
            this.uniformBuffer,
            this.kernel.byteLength,
            floats,
            0,
            floats.length
        );
        // Write ints
        const ints = new Uint32Array([1]); // Wrap
        this.device.queue.writeBuffer(
            this.uniformBuffer,
            this.kernel.byteLength + floats.byteLength,
            ints,
            0,
            ints.length
        )
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

function generateGaussianKernel(stdDev: number, size: number): Mat3 {
    if (size % 2 != 1) {
        throw (new Error("Gaussian Kernel size must be an odd number"));
    }
    const kernel = [];
    const offset = Math.floor(size / 2);
    const TAU = Math.PI;
    const stdDevSqr = (stdDev+.3) ** 2;
    let sum = 0;
    for (let i = 0; i < size; i++) {
        const xSqr = (i - offset) ** 2;
        for (let j = 0; j < size; j++) {
            const index = i * size + j;
            const ySqr = (j - offset) ** 2;
            kernel[index] = (1 / (2 * Math.PI * stdDevSqr)) * Math.exp(-(xSqr + ySqr) / (2 * stdDevSqr));
            sum += kernel[index];
        }

    }
    // Normalize the kernel
    let newSum = 0;
    for (let i = 0; i < kernel.length; i++) {
        kernel[i] /= sum;
        newSum += kernel[i];
    }
    // Ensure the kernel sums to 1
    kernel[offset * size + offset] += 1 - newSum;
    return mat3.create(kernel[0], kernel[1], kernel[2], kernel[3], kernel[4], kernel[5], kernel[6], kernel[7], kernel[8]);
}