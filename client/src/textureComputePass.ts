// import { mat3, Mat3 } from "wgpu-matrix";
import { Mat3, mat3 } from "wgpu-matrix";
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
    
    simulationParamters: ISimulationParameters;
    prevGaussianStdDev: number;
    kernel: Mat3;
    

    constructor(device: GPUDevice, simulationParameters: ISimulationParameters, pheromoneTextureFormat: GPUTextureFormat) {
        const shaderCode = `
        struct Uniforms {
            blurKernel: mat3x3<f32>,
            passiveAttenuation: f32,
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
            var colorSum = vec3(0.);

            // Loop through neighboring pixels (3x3 kernel)
            for (var i: i32 = -1; i <= 1; i++) {
                for (var j: i32 = -1; j <= 1; j++) {
                    let samplePixel= vec2(i32(global_id.x) + i, i32(global_id.y) + j);

                    // Ensure we don't sample out of bounds
                    if (samplePixel.x < ${simulationParameters.width} && samplePixel.y < ${simulationParameters.height}) {
                        let sampleColor = textureLoad(textureIn, samplePixel).xyz; // Load neighboring pixel color
                        let kernelIndex = (i+1) * 3 + (j+1);
                        colorSum += sampleColor * uniforms.blurKernel[i+1][j+1]; // Apply Gaussian kernel
                    }
                }
            }

            colorSum = max(vec3(0.), colorSum - vec3(uniforms.passiveAttenuation));

            textureStore(textureOut, pixel, vec4(colorSum, 1.0)); // Store blurred color
        }

            `;

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
        this.device.queue.writeBuffer(
            this.uniformBuffer,
            this.kernel.byteLength,
            new Float32Array([this.simulationParamters.passiveAttenuation]),
            0,
            1
        );
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
    // console.log(sum, newSum);
    // console.log(`${kernel[0].toFixed(5)}, ${kernel[1].toFixed(5)}, ${kernel[2].toFixed(5)}\n`, 
    //             `${kernel[3].toFixed(5)}, ${kernel[4].toFixed(5)}, ${kernel[5].toFixed(5)}\n`, 
    //             `${kernel[6].toFixed(5)}, ${kernel[7].toFixed(5)}, ${kernel[8].toFixed(5)}`);
    return mat3.create(kernel[0], kernel[1], kernel[2], kernel[3], kernel[4], kernel[5], kernel[6], kernel[7], kernel[8]);
    // return mat3.create(0, 0, 0,
    //                    0, 0, 0, 
    //                    0, 0, 0);
}