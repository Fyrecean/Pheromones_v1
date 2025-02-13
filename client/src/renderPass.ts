import { Camera2D } from "camera";
import shaderCode from "./shaders/render_environment.wgsl"
import typesShader from "./shaders/types.wgsl";

export class RenderPass {
    device: GPUDevice;
    bindGroup: GPUBindGroup;
    pipeline: GPURenderPipeline;
    sampler: GPUSampler;

    uniformBuffer: GPUBuffer;
    camera: Camera2D;

    constructor(device: GPUDevice, textureFormat: GPUTextureFormat, camera: Camera2D) {
        this.device = device;
        this.sampler = device.createSampler({
            minFilter: "linear",
            magFilter: "linear",
        });
        this.camera = camera;
        this.uniformBuffer = device.createBuffer({
            size: this.camera.viewMatrix.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
        const renderBindGroupLayout = device.createBindGroupLayout({
            label: "Render Bind Group Layout",
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
                    buffer: {
                        type: "uniform"
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: this.sampler,
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        format: textureFormat,
                        access: "read-only",
                        
                    }
                },
            ] as GPUBindGroupLayoutEntry[],
        });
        const renderShaderModule = device.createShaderModule({
            code: `${typesShader}\n${shaderCode}`
        });

        this.pipeline = device.createRenderPipeline({
            label: "Render Pipeline",
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
                        format: navigator.gpu.getPreferredCanvasFormat(),
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
            }
        });
    }

    addPass(commandEncoder: GPUCommandEncoder, pheromoneTexture: GPUTexture, targetView: GPUTextureView, timestampWrites?: GPURenderPassTimestampWrites): void {
        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: targetView,
                    clearValue: [0.12, 0.12, 0.11,1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ] as GPURenderPassColorAttachment[],
            timestampWrites
        };

        this.device.queue.writeBuffer(this.uniformBuffer,
            0,
            this.camera.viewMatrix,
            0,
            this.camera.viewMatrix.length,
        );

        // TODO - is recreating the bind group with a texture swap faster than copying texture data back and forth?
        this.bindGroup = this.device.createBindGroup({
            label: "Render Bind Group",
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer,
                    },
                },
                {
                    binding: 1,
                    resource: this.sampler,
                },
                {
                    binding: 2,
                    resource: pheromoneTexture.createView(),
                },
            ] as GPUBindGroupEntry[],
        });

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, this.bindGroup);
        passEncoder.draw(6);
        passEncoder.end();
    }
}