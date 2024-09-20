import { RenderPass } from "./renderPass";
import { getAgentsArray, ISimulationParameters } from "./simulationConfig";
import { SimulationPass } from "./simulationPass";
import { TexturePass } from "./textureComputePass";

const NUMBER_OF_PASSES = 2;

const simulationParameters: ISimulationParameters = {
    agentCount: 100000,
    height: 0,
    width: 0,
    turnJitter: .6,
    steerFactor: 0.3,
    sampleDistance: 10,
    passiveAttenuation: .002,
}

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
    let simulationDurationSum = 0;
    let renderDurationSum = 0;
    let timerSamples = 0;

    const sparePerfTimeBuffers: GPUBuffer[] = [];
    let querySet: GPUQuerySet | undefined = undefined;
    let perfResolveBuffer: GPUBuffer | undefined = undefined;
    let simulationPerfTimeStampWrites: GPUComputePassTimestampWrites | undefined = undefined;
    let renderPerfTimeStampWrites: GPURenderPassTimestampWrites | undefined = undefined;
    if (hasTimestampQuery) {
        perfDisplay.textContent = `\
avg simulation duration: — µs
avg render duration:  — µs
spare perf buffers:    —`;
        

        querySet = device.createQuerySet({
            type: "timestamp",
            count: 2 * NUMBER_OF_PASSES,
        });
        perfResolveBuffer = device.createBuffer({
            label: "perfResolve",
            size: 4 * BigInt64Array.BYTES_PER_ELEMENT * NUMBER_OF_PASSES,
            usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
        });
        simulationPerfTimeStampWrites = {
            querySet,
            beginningOfPassWriteIndex: 0,
            endOfPassWriteIndex: 1,
          };
          renderPerfTimeStampWrites = {
            querySet,
            beginningOfPassWriteIndex: 2,
            endOfPassWriteIndex: 3,
          };
    }

    simulationParameters.width = canvas.width;
    simulationParameters.height = canvas.height;
    const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied'
    });

    const pheromoneTextures = [
        device.createTexture({
            size: [canvas.width, canvas.height],
            format:  'rgba8unorm',
            usage: 
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING
        }),
        device.createTexture({
            size: [canvas.width, canvas.height],
            format:  'rgba8unorm',
            usage: 
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING
        }),
    ];

    const agentsBuffer = device.createBuffer({
        label: "agents",
        size: 16 * simulationParameters.agentCount,
        usage: GPUBufferUsage.STORAGE,
        mappedAtCreation: true,
    });
    new Float32Array(agentsBuffer.getMappedRange()).set(getAgentsArray(simulationParameters));
    agentsBuffer.unmap();

    const texturePass = new TexturePass(device, simulationParameters, pheromoneTextures[0].format)

    const simulationPass = new SimulationPass(device, simulationParameters, pheromoneTextures[0].format, agentsBuffer);

    const renderPass = new RenderPass(device, pheromoneTextures[0].format);

    let pheromoneIndex = 0;
    const frame = () => {
        const commandEncoder = device.createCommandEncoder();
        const textureInIndex = pheromoneIndex;
        const textureOutIndex = (pheromoneIndex + 1) % 2
        
        texturePass.addPass(commandEncoder, pheromoneTextures[textureInIndex], pheromoneTextures[textureOutIndex])

        simulationPass.addPass(commandEncoder, pheromoneTextures[textureInIndex], pheromoneTextures[textureOutIndex], simulationPerfTimeStampWrites);

        const canvasTextureView = context.getCurrentTexture().createView();
        renderPass.addPass(commandEncoder, pheromoneTextures[pheromoneIndex], canvasTextureView, renderPerfTimeStampWrites);
        pheromoneIndex = textureOutIndex;

        let resultBuffer: GPUBuffer | undefined = undefined;
        if (hasTimestampQuery) {
            resultBuffer = sparePerfTimeBuffers.pop() || 
                device.createBuffer({
                    size: 4 * BigInt64Array.BYTES_PER_ELEMENT * NUMBER_OF_PASSES,
                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
                });
            commandEncoder.resolveQuerySet(querySet, 0, 2 * NUMBER_OF_PASSES, perfResolveBuffer, 0);
            commandEncoder.copyBufferToBuffer(
                perfResolveBuffer,
                0,
                resultBuffer,
                0,
                resultBuffer.size
            );
        }

        device.queue.submit([commandEncoder.finish()]);

        if (hasTimestampQuery) {
            resultBuffer.mapAsync(GPUMapMode.READ).then(() => {
                const times = new BigInt64Array(resultBuffer.getMappedRange());
                const simulationDuration = Number(times[1] - times[0]);
                const renderDuration = Number(times[3] - times[2]);
                if (simulationDuration > 0 && renderDuration > 0) {
                    simulationDurationSum += simulationDuration;
                    renderDurationSum += renderDuration;
                    timerSamples++;
                }
                resultBuffer.unmap();
                sparePerfTimeBuffers.push(resultBuffer);

                const kNumTimerSamplesPerUpdate = 100;
                if (timerSamples >= kNumTimerSamplesPerUpdate) {
                    const avgSimulationMicroseconds = Math.round(
                        simulationDurationSum / timerSamples / 1000
                    );
                    const avgRenderMicroseconds = Math.round(
                        renderDurationSum / timerSamples / 1000
                    );
                    perfDisplay.textContent = `\
avg simulation duration: ${avgSimulationMicroseconds}µs
avg render duration:  ${avgRenderMicroseconds}µs
spare perf buffers:    ${sparePerfTimeBuffers.length}`;
                    simulationDurationSum = 0;
                    renderDurationSum = 0;
                    timerSamples = 0;

                }
            });
        }
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

go();