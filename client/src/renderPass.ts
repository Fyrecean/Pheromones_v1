import shaderCode from "./shaders/render.wgsl"

export class RenderPass {
    device: GPUDevice;
    bindGroup: GPUBindGroup;
    pipeline: GPURenderPipeline;
    sampler: GPUSampler;

    constructor(device: GPUDevice, textureFormat: GPUTextureFormat) {
        this.device = device;
        this.sampler = device.createSampler({
            minFilter: "linear",
            magFilter: "linear",
        });
        const renderBindGroupLayout = device.createBindGroupLayout({
            label: "Render Bind Group Layout",
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        format: textureFormat,
                        access: "read-only",
                        
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: this.sampler,
                }
            ] as GPUBindGroupLayoutEntry[],
        });
        const renderShaderModule = device.createShaderModule({
            code: shaderCode
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
                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ] as GPURenderPassColorAttachment[],
            timestampWrites
        };

        // TODO - is recreating the bind group with a texture swap faster than copying texture data back and forth?
        this.bindGroup = this.device.createBindGroup({
            label: "Render Bind Group",
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: pheromoneTexture.createView(),
                },
                {
                    binding: 1,
                    resource: this.sampler,
                }
            ],
        });

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, this.bindGroup);
        passEncoder.draw(6);
        passEncoder.end();
    }
}