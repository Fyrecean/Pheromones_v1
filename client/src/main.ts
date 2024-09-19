import { RenderPass } from "./renderPass";
import { getAgentsArray, ISimulationParameters } from "./simulationConfig";
import { SimulationPass } from "./simulationPass";

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

    const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied'
    });

    const simulationParameters: ISimulationParameters = {
        agentCount: 1,
        height: canvas.height,
        width: canvas.width,
    }

    const pheromoneTexture = device.createTexture({
        size: [canvas.width, canvas.height],
        format:  'rgba8unorm',
        usage: 
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.STORAGE_BINDING
    });

    const agentsBuffer = device.createBuffer({
        size: 16 * simulationParameters.agentCount,
        usage: GPUBufferUsage.STORAGE,
        mappedAtCreation: true,
    });
    new Float32Array(agentsBuffer.getMappedRange()).set(getAgentsArray(simulationParameters));
    agentsBuffer.unmap();

    const simulationPass = new SimulationPass(device, simulationParameters, pheromoneTexture, agentsBuffer);

    const renderPass = new RenderPass(device, pheromoneTexture);

    const frame = () => {
        const commandEncoder = device.createCommandEncoder();
        
        simulationPass.addPass(commandEncoder);

        const canvasTextureView = context.getCurrentTexture().createView();
        renderPass.addPass(commandEncoder, canvasTextureView);

        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

go();