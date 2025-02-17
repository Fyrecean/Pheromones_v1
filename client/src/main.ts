import { handleTranslate, handleZoom } from "./userInput";
import { camera, Camera2D } from "./camera";
import { RenderPass } from "./renderPass";
import { simulationParameters } from "./simulationConfig";
import { ANT_STRUCT_SIZE, SimulationPass, getAgentsArray } from "./simulationPass";
import { TexturePass } from "./textureComputePass";
import { debugMetrics, initalizeDebug, refreshDebug } from "./debugMenu";

const NUMBER_OF_PASSES = 2;
let latestFrameHandle = 0;
let frame: () => void | undefined = undefined;
export async function start(): Promise<void> {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth - 30;
    canvas.height = window.innerHeight - 30;

    canvas.addEventListener("mousewheel", handleZoom);
    canvas.addEventListener("mousemove", handleTranslate);

    if (!navigator.gpu) {
        const body = document.querySelector("body");
        body.prepend(document.createTextNode("Your browser does not support Web GPU, the thing that makes this whole website work. Try using Chrome, Microsoft Edge, or Opera. Hopefully Firefox and Safari will get it soon!"));
        return;
    }
    const adapter = await navigator.gpu.requestAdapter();
    const hasTimestampQuery = adapter.features.has("timestamp-query");
    const device = await adapter.requestDevice({
        requiredFeatures: hasTimestampQuery ? ["timestamp-query"] as GPUFeatureName[]: [],
    });
    device.pushErrorScope("internal");

    // Performance Statistics Document Setup
    const perfDisplayContainer = document.createElement('div');
    // perfDisplayContainer.hidden = true;
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
    const agentsOutputBuffers: GPUBuffer[] = [];
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
        size: Float32Array.BYTES_PER_ELEMENT * ANT_STRUCT_SIZE * simulationParameters.agentCount,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        mappedAtCreation: true,
    });
    new Float32Array(agentsBuffer.getMappedRange()).set(getAgentsArray(simulationParameters));
    agentsBuffer.unmap();

    const texturePass = new TexturePass(device, simulationParameters, pheromoneTextures[0].format)

    const simulationPass = new SimulationPass(device, simulationParameters, pheromoneTextures[0].format, agentsBuffer);

    const renderPass = new RenderPass(device, pheromoneTextures[0].format, camera);

    let pheromoneIndex = 0;
    frame = () => {
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
        // let agentsOutputBuffer: GPUBuffer | undefined = undefined;
        // agentsOutputBuffer = agentsOutputBuffers.pop() || 
        //     device.createBuffer({
        //         size: Float32Array.BYTES_PER_ELEMENT * ANT_STRUCT_SIZE * simulationParameters.agentCount,
        //         usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        //     });
        // commandEncoder.copyBufferToBuffer(agentsBuffer, 0, agentsOutputBuffer, 0, agentsBuffer.size);
        device.queue.submit([commandEncoder.finish()]);


        // agentsOutputBuffer.mapAsync(GPUMapMode.READ).then(() => {
        //     const agents = new Float32Array(agentsOutputBuffer.getMappedRange());
        //     console.log(agents.length, agents);
        //     agentsOutputBuffer.unmap();
        //     agentsOutputBuffers.push(agentsOutputBuffer);
        // });
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
        refreshDebug();
        latestFrameHandle = requestAnimationFrame(frame);
    };
    initalizeDebug();
    latestFrameHandle = requestAnimationFrame(frame);
}

export function togglePause(): boolean {
    if (latestFrameHandle != 0) {
        cancelAnimationFrame(latestFrameHandle);
        latestFrameHandle = 0;
        return false;
    } else {
        latestFrameHandle = requestAnimationFrame(frame);
        return true;
    }
}

export function reset() {
    cancelAnimationFrame(latestFrameHandle);
    start();
}