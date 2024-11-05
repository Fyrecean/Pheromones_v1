/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shaders/gaussian.wgsl":
/*!***********************************!*\
  !*** ./src/shaders/gaussian.wgsl ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("struct Uniforms {\r\n    blurKernel: mat3x3<f32>,\r\n    passiveAttenuation: f32,\r\n    wrap: u32,\r\n    width: u32,\r\n    height: u32,\r\n}\r\n@group(0) @binding(0) var<uniform> uniforms: Uniforms;\r\n\r\n@group(0) @binding(1) var pheromonesIn: texture_storage_2d<rgba8unorm, read>;\r\n@group(0) @binding(2) var pheromonesOut: texture_storage_2d<rgba8unorm, write>;\r\n\r\n@compute @workgroup_size(8, 8)\r\nfn attenuate(@builtin(global_invocation_id) global_id: vec3<u32>) {\r\n    let size = textureDimensions(pheromonesIn);\r\n    if (global_id.x >= size.x || global_id.y >= size.y) {\r\n        return;\r\n    }\r\n    \r\n    let pixel = global_id.xy;\r\n    var colorSum = vec3(0.);\r\n\r\n    // Loop through neighboring pixels (3x3 kernel)\r\n    for (var i: i32 = -1; i <= 1; i++) {\r\n        for (var j: i32 = -1; j <= 1; j++) {\r\n            var samplePixel= vec2(i32(global_id.x) + i, i32(global_id.y) + j);\r\n            if (uniforms.wrap == 1) {\r\n                if (samplePixel.x < 0) {\r\n                    samplePixel.x += size.x;\r\n                } else if (samplePixel.x >= size.x) {\r\n                    samplePixel.x -= size.x;\r\n                }\r\n                if (samplePixel.y < 0) {\r\n                    samplePixel.y += size.y;\r\n                } else if (samplePixel.y >= size.y) {\r\n                    samplePixel.y -= size.y;\r\n                }\r\n            } else {\r\n                    if (samplePixel.x < 0) {\r\n                    samplePixel.x = 0;\r\n                } else if (samplePixel.x >= size.x) {\r\n                    samplePixel.x = size.x - 1;\r\n                }\r\n                if (samplePixel.y < 0) {\r\n                    samplePixel.y = 0;\r\n                } else if (samplePixel.y >= size.y) {\r\n                    samplePixel.y = size.y - 1;\r\n                }\r\n            }\r\n\r\n            let sampleColor = textureLoad(pheromonesIn, samplePixel).xyz; // Load neighboring pixel color\r\n            let kernelIndex = (i+1) * 3 + (j+1);\r\n            colorSum += sampleColor * uniforms.blurKernel[i+1][j+1]; // Apply Gaussian kernel\r\n        }\r\n    }\r\n\r\n    colorSum = max(vec3(0.), colorSum - vec3(uniforms.passiveAttenuation));\r\n\r\n    textureStore(pheromonesOut, pixel, vec4(colorSum, 1.0)); // Store blurred color\r\n}");

/***/ }),

/***/ "./src/shaders/render.wgsl":
/*!*********************************!*\
  !*** ./src/shaders/render.wgsl ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("@group(0) @binding(0) var textureIn: texture_2d<f32>;\r\n@group(0) @binding(1) var samplerIn: sampler;\r\n\r\nstruct VertexOut {\r\n    @builtin(position) position : vec4f,\r\n    @location(0) uv : vec2f,\r\n}\r\n\r\n@vertex\r\nfn vertex_main(@builtin(vertex_index) VertexIndex: u32) -> VertexOut\r\n{\r\n    var vertices = array<vec2f, 6>(\r\n    vec2(-1, -1),\r\n    vec2(1, -1),\r\n    vec2(-1, 1),\r\n    vec2(1, 1),\r\n    vec2(1, -1),\r\n    vec2(-1, 1),\r\n    );\r\n    var uvs = array<vec2f, 6> (\r\n    vec2(0, 0),\r\n    vec2(1, 0),\r\n    vec2(0, 1),\r\n    vec2(1, 1),\r\n    vec2(1, 0),\r\n    vec2(0, 1),\r\n    );\r\n    var output : VertexOut;\r\n    output.position = vec4(vertices[VertexIndex], 0, 1);\r\n    output.uv = uvs[VertexIndex];\r\n    \r\n    return output;\r\n}\r\n\r\n@fragment\r\nfn fragment_main(fragData: VertexOut) -> @location(0) vec4f\r\n{\r\n    // let color1 = vec3(0.39, 0.82, 0.06);\r\n    // let color1 = vec3(0.34, 0.8, 0.32);\r\n    let color1 = vec3(1.);\r\n    let color2 = vec3(0, 0.49, 0.77);\r\n    // let color2 = vec3(.1, 0.3, .3);\r\n    // let color2 = vec3(0.3, 0.77, 0.67);\r\n    let black = vec3(0.);\r\n    let sample = textureSample(textureIn, samplerIn, fragData.uv).x;\r\n    var outColor: vec3<f32>;\r\n    if (sample >= .5) {\r\n        outColor = mix(color2, color1, (sample - .5) * 2);\r\n    } else {\r\n        outColor = mix(black, color2, sample * 2);\r\n    }\r\n\r\n    return vec4(outColor, 1);\r\n}");

/***/ }),

/***/ "./src/shaders/simulation.wgsl":
/*!*************************************!*\
  !*** ./src/shaders/simulation.wgsl ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Hash function from H. Schechter & R. Bridson, goo.gl/RXiKaH\r\nfn Hash(p: u32) -> u32\r\n{\r\n    var s = p; \r\n    s ^= 2747636419u;\r\n    s *= 2654435769u;\r\n    s ^= s >> 16;\r\n    s *= 2654435769u;\r\n    s ^= s >> 16;\r\n    s *= 2654435769u;\r\n    return s;\r\n}\r\n\r\nfn Random(seed: u32) -> f32\r\n{\r\n    return f32(Hash(seed)) / 4294967295.0; // 2^32-1\r\n}\r\n\r\nstruct Uniforms {\r\n    width: u32,\r\n    height: u32,\r\n    agentCount: u32,\r\n    time: u32,\r\n    sampleDistance: u32,\r\n    wrap: u32,\r\n    turnJitter: f32,\r\n    steerFactor: f32,\r\n    acceleration: f32,\r\n    cosSampleAngle: f32,\r\n    sinSampleAngle: f32,\r\n    speed: f32,\r\n}\r\n\r\nstruct Ant {\r\n    position: vec2f,\r\n    direction: vec2f,\r\n    pheromoneChannel: u32,\r\n}\r\n\r\n@group(0) @binding(0) var<uniform> uniforms: Uniforms;\r\n\r\n@group(0) @binding(1) var<storage, read_write> agents: array<vec4f>;\r\n@group(0) @binding(2) var pheromonesIn: texture_storage_2d<rgba8unorm, read>;\r\n@group(0) @binding(3) var pheromonesOut: texture_storage_2d<rgba8unorm, write>;\r\n\r\nfn samplePheromone(position: vec2<f32>, direction: vec2<f32>, steps: u32) -> f32 {\r\n    let sampleStart = position + direction * 2;\r\n    var sum = 0.;\r\n    let fSteps = f32(steps);\r\n    for (var i = 0.; i < fSteps; i += 1.) {\r\n        var samplePixel = vec2<i32>(round(sampleStart + i * direction));\r\n        if (uniforms.wrap == 1) {\r\n            if (samplePixel.x < 0) {\r\n                samplePixel.x += uniforms.width;\r\n            } else if (samplePixel.x >= uniforms.width) {\r\n                samplePixel.x -= uniforms.width; \r\n            }\r\n            if (samplePixel.y < 0) {\r\n                samplePixel.y += uniforms.height;\r\n            } else if (samplePixel.y >= uniforms.height) {\r\n                samplePixel.y -= uniforms.height; \r\n            }\r\n        }\r\n        sum += textureLoad(pheromonesIn, samplePixel).x;\r\n    }\r\n    return sum;\r\n}\r\n\r\n@compute @workgroup_size(64)\r\nfn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {\r\n    let index = global_id.x;\r\n    // Trim off the excess if agentCount % WORKGROUP_SIZE != 0\r\n    if (index >= uniforms.agentCount) {\r\n        return;\r\n    }\r\n\r\n    var agent = agents[index];\r\n\r\n    agent.x += agent.z;\r\n    agent.y += agent.w;\r\n\r\n    if (uniforms.wrap == 1) {\r\n        if (agent.x < 0.) {\r\n            agent.x += uniforms.width;\r\n        } else if (agent.x >= uniforms.width) {\r\n            agent.x -= uniforms.width; \r\n        }\r\n        if (agent.y < 0.) {\r\n            agent.y += uniforms.height;\r\n        } else if (agent.y >= uniforms.height) {\r\n            agent.y -= uniforms.height; \r\n        }\r\n    } else {\r\n        if (agent.x >= uniforms.width || agent.x < 0) {\r\n            agent.z = -agent.z;\r\n        }\r\n        if (agent.y >= unifroms.height || agent.y < 0) {\r\n            agent.w = -agent.w;\r\n        }\r\n    }\r\n    let randomDirChange = uniforms.turnJitter * vec2(Random(uniforms.time + global_id.x) - .5, Random(uniforms.time + global_id.x + uniforms.height) - .5);\r\n    var velocity = normalize(agent.zw + randomDirChange);\r\n\r\n    let leftSampleMatrix =  mat2x2(uniforms.cosSampleAngle, uniforms.sinSampleAngle, -uniforms.sinSampleAngle, uniforms.cosSampleAngle);\r\n    let rightSampleMatrix = mat2x2(uniforms.cosSampleAngle, -uniforms.sinSampleAngle, uniforms.sinSampleAngle, uniforms.cosSampleAngle);\r\n\r\n    // Take pheromone samples\r\n    let rightSampleDir = rightSampleMatrix * velocity;\r\n    let rightSamplePixel = vec2<i32>(round(agent.xy + 3 * rightSampleDir));\r\n\r\n    let forwardSamplePixel = vec2<i32>(round(agent.xy + 3 * velocity));\r\n\r\n\r\n    let leftSampleDir = leftSampleMatrix * velocity;\r\n\r\n    let rightSample = samplePheromone(agent.xy, rightSampleDir, uniforms.sampleDistance);\r\n    let forwardSample = samplePheromone(agent.xy, velocity, uniforms.sampleDistance);\r\n    let leftSample = samplePheromone(agent.xy, leftSampleDir, uniforms.sampleDistance);\r\n\r\n    var maxSample = 0.;\r\n    if (forwardSample < rightSample || forwardSample < leftSample) {\r\n        if (rightSample > leftSample) {\r\n            velocity += uniforms.steerFactor * rightSampleDir;\r\n            maxSample = rightSample;\r\n        } else {\r\n            velocity += uniforms.steerFactor * leftSampleDir;\r\n            maxSample = leftSample; \r\n        }\r\n        velocity = normalize(velocity);\r\n    } else {\r\n        maxSample = forwardSample;\r\n    }\r\n\r\n    velocity *= uniforms.speed + (uniforms.acceleration * maxSample / f32(uniforms.sampleDistance));\r\n\r\n    let pixel = vec2<i32>(round(agent.xy));\r\n    let red = vec3(1., 0., 0.);\r\n    textureStore(pheromonesOut, pixel, vec4(red, 1.));\r\n\r\n    agent.z = velocity.x;\r\n    agent.w = velocity.y;\r\n    agents[index] = agent;\r\n}");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reset: () => (/* binding */ reset),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   togglePause: () => (/* binding */ togglePause)
/* harmony export */ });
/* harmony import */ var _renderPass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderPass */ "./src/renderPass.ts");
/* harmony import */ var _simulationConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./simulationConfig */ "./src/simulationConfig.ts");
/* harmony import */ var _simulationPass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./simulationPass */ "./src/simulationPass.ts");
/* harmony import */ var _textureComputePass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./textureComputePass */ "./src/textureComputePass.ts");




const NUMBER_OF_PASSES = 2;
let latestFrameHandle = 0;
let frame = undefined;
async function start() {
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth - 30;
    canvas.height = window.innerHeight - 30;
    if (!navigator.gpu) {
        const body = document.querySelector("body");
        body.prepend(document.createTextNode("Your browser does not support Web GPU, the thing that makes this whole website work. Try using Chrome, Microsoft Edge, or Opera. Hopefully Firefox and Safari will get it soon!"));
        return;
    }
    const adapter = await navigator.gpu.requestAdapter();
    const hasTimestampQuery = adapter.features.has("timestamp-query");
    const device = await adapter.requestDevice({
        requiredFeatures: hasTimestampQuery ? ["timestamp-query"] : [],
    });
    // Performance Statistics Document Setup
    const perfDisplayContainer = document.createElement('div');
    perfDisplayContainer.hidden = true;
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
    const sparePerfTimeBuffers = [];
    let querySet = undefined;
    let perfResolveBuffer = undefined;
    let simulationPerfTimeStampWrites = undefined;
    let renderPerfTimeStampWrites = undefined;
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
    _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters.width = canvas.width;
    _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters.height = canvas.height;
    const context = canvas.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied'
    });
    const pheromoneTextures = [
        device.createTexture({
            size: [canvas.width, canvas.height],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING
        }),
        device.createTexture({
            size: [canvas.width, canvas.height],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING
        }),
    ];
    const agentsBuffer = device.createBuffer({
        label: "agents",
        size: 16 * _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters.agentCount,
        usage: GPUBufferUsage.STORAGE,
        mappedAtCreation: true,
    });
    new Float32Array(agentsBuffer.getMappedRange()).set((0,_simulationConfig__WEBPACK_IMPORTED_MODULE_1__.getAgentsArray)(_simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters));
    agentsBuffer.unmap();
    const texturePass = new _textureComputePass__WEBPACK_IMPORTED_MODULE_3__.TexturePass(device, _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters, pheromoneTextures[0].format);
    const simulationPass = new _simulationPass__WEBPACK_IMPORTED_MODULE_2__.SimulationPass(device, _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters, pheromoneTextures[0].format, agentsBuffer);
    const renderPass = new _renderPass__WEBPACK_IMPORTED_MODULE_0__.RenderPass(device, pheromoneTextures[0].format);
    let pheromoneIndex = 0;
    frame = () => {
        const commandEncoder = device.createCommandEncoder();
        const textureInIndex = pheromoneIndex;
        const textureOutIndex = (pheromoneIndex + 1) % 2;
        texturePass.addPass(commandEncoder, pheromoneTextures[textureInIndex], pheromoneTextures[textureOutIndex]);
        simulationPass.addPass(commandEncoder, pheromoneTextures[textureInIndex], pheromoneTextures[textureOutIndex], simulationPerfTimeStampWrites);
        const canvasTextureView = context.getCurrentTexture().createView();
        renderPass.addPass(commandEncoder, pheromoneTextures[pheromoneIndex], canvasTextureView, renderPerfTimeStampWrites);
        pheromoneIndex = textureOutIndex;
        let resultBuffer = undefined;
        if (hasTimestampQuery) {
            resultBuffer = sparePerfTimeBuffers.pop() ||
                device.createBuffer({
                    size: 4 * BigInt64Array.BYTES_PER_ELEMENT * NUMBER_OF_PASSES,
                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
                });
            commandEncoder.resolveQuerySet(querySet, 0, 2 * NUMBER_OF_PASSES, perfResolveBuffer, 0);
            commandEncoder.copyBufferToBuffer(perfResolveBuffer, 0, resultBuffer, 0, resultBuffer.size);
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
                    const avgSimulationMicroseconds = Math.round(simulationDurationSum / timerSamples / 1000);
                    const avgRenderMicroseconds = Math.round(renderDurationSum / timerSamples / 1000);
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
        latestFrameHandle = requestAnimationFrame(frame);
    };
    latestFrameHandle = requestAnimationFrame(frame);
}
function togglePause() {
    if (latestFrameHandle != 0) {
        cancelAnimationFrame(latestFrameHandle);
        latestFrameHandle = 0;
        return false;
    }
    else {
        latestFrameHandle = requestAnimationFrame(frame);
        return true;
    }
}
function reset() {
    cancelAnimationFrame(latestFrameHandle);
    start();
}


/***/ }),

/***/ "./src/renderPass.ts":
/*!***************************!*\
  !*** ./src/renderPass.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RenderPass: () => (/* binding */ RenderPass)
/* harmony export */ });
/* harmony import */ var _shaders_render_wgsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaders/render.wgsl */ "./src/shaders/render.wgsl");

class RenderPass {
    device;
    bindGroup;
    pipeline;
    sampler;
    constructor(device, textureFormat) {
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
            ],
        });
        const renderShaderModule = device.createShaderModule({
            code: _shaders_render_wgsl__WEBPACK_IMPORTED_MODULE_0__["default"]
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
    addPass(commandEncoder, pheromoneTexture, targetView, timestampWrites) {
        const renderPassDescriptor = {
            colorAttachments: [
                {
                    view: targetView,
                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
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


/***/ }),

/***/ "./src/simulationConfig.ts":
/*!*********************************!*\
  !*** ./src/simulationConfig.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAgentsArray: () => (/* binding */ getAgentsArray),
/* harmony export */   simulationParameters: () => (/* binding */ simulationParameters)
/* harmony export */ });
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ "./src/main.ts");

let simulationParameters = {
    agentCount: 100_000,
    height: 0,
    width: 0,
    turnJitter: .6,
    steerFactor: .6,
    speed: .8,
    acceleration: .3,
    sampleDistance: 17,
    sampleAngle: .4,
    passiveAttenuation: 0.01,
    gaussianStdDev: .4,
    wrap: true,
    pheromone_layers: []
};
const defaultParams = structuredClone(simulationParameters);
const animalNames = [
    "Tiger",
    "Spider",
    "Bear",
    "Lion",
    "Elephant",
    "Giraffe",
    "Wolf",
    "Fox",
    "Rabbit",
    "Kangaroo",
    "Zebra",
    "Deer",
    "Leopard",
    "Panther",
    "Cheetah",
    "Eagle",
    "Falcon",
    "Hawk",
    "Owl",
    "Penguin",
    "Beetle",
    "Dolphin",
    "Shark",
    "Whale",
    "Octopus",
    "Lobster",
    "Crab",
    "Horse",
    "Cow",
    "Goat",
    "Sheep",
    "Chicken",
    "Duck",
    "Goose",
    "Turkey",
    "Peacock",
    "Bat",
    "Rat",
    "Mouse",
    "Squirrel",
    "Chipmunk",
    "Moose",
    "Bison",
    "Antelope",
    "Crocodile",
    "Alligator",
    "Tortoise",
    "Frog",
    "Toad",
    "Snake",
    "Lizard",
    "Ant"
];
let configTable;
let showConfig = false;
let savedCookies = {};
function loadCookie() {
    const cookies = document.cookie.split("; ");
    cookies.forEach(cookie => {
        if (cookie.startsWith("savedConfigs")) {
            savedCookies = JSON.parse(cookie.split("savedConfigs: ")[1]);
        }
    });
}
function saveCookie() {
    document.cookie = "savedConfigs: " + JSON.stringify(savedCookies);
}
document.addEventListener("DOMContentLoaded", () => {
    configTable = document.getElementById("configTable");
    let saveButton = document.getElementById("saveConfig");
    loadCookie();
    const configOptions = document.getElementById("savedConfigs");
    const configName = document.getElementById("configName");
    configOptions.addEventListener("input", () => {
        if (configOptions.value == "+Create New") {
            let randomAnimal = animalNames[Math.floor(Math.random() * animalNames.length)];
            while (savedCookies[randomAnimal] != undefined) {
                randomAnimal = animalNames[Math.floor(Math.random() * animalNames.length)];
            }
            configOptions.prepend(new Option(randomAnimal));
            savedCookies[randomAnimal] = structuredClone(simulationParameters);
            configOptions.selectedIndex = 0;
        }
        else if (configOptions.value == "Default") {
            setSimulationParams(defaultParams);
        }
        else {
            setSimulationParams(savedCookies[configOptions.value]);
        }
        configName.value = configOptions.value;
        switch (configName.value) {
            case "Default":
            case "+Create New": {
                saveButton.setAttribute("disabled", "");
                configName.setAttribute("disabled", "");
            }
            default: {
                saveButton.removeAttribute("disabled");
                configName.removeAttribute("disabled");
            }
        }
    });
    for (let cookieName in savedCookies) {
        configOptions.appendChild(new Option(cookieName));
    }
    if (Object.keys(savedCookies).length < animalNames.length) {
        configOptions.appendChild(new Option("+Create New"));
    }
    saveButton.addEventListener("click", () => {
        let name = configName.value;
        switch (name) {
            case "Default":
            case "+Create New": {
                return;
            }
        }
        let selected = configOptions.value;
        if (configOptions.value != name) {
            savedCookies[name] = structuredClone(simulationParameters);
            configOptions.options.item(configOptions.selectedIndex).innerText = name;
            delete savedCookies[selected];
        }
        savedCookies[name] = structuredClone(simulationParameters);
        saveCookie();
    });
    let showButton = document.getElementById("show");
    let configFlyout = document.getElementById("configFlyout");
    showButton.addEventListener("click", () => {
        if (showConfig) {
            showConfig = false;
            showButton.innerText = "Hide Config";
            configFlyout.style.display = "";
        }
        else {
            showConfig = true;
            showButton.innerText = "Show Config";
            configFlyout.style.display = "none";
        }
    });
    addSlider("Jitter", "turnJitter", 0, 1.5, .05, "How much do ants randomly change direction");
    addSlider("Steering", "steerFactor", -1, 1, .05, "How much do ants steer towards detected pheromones");
    addSlider("Speed", "speed", .1, 2, .1, "How fast they go");
    addSlider("Acceleration", "acceleration", -1, 2, .1, "How much do ants speed up when they detect pheromones in front of them");
    addSlider("Detection Distance", "sampleDistance", 1, 75, 1, "How many pixels away can ants detect pheromones");
    addSlider("Detection Angle", "sampleAngle", 0.1, 2, .1, "Angle away from center to sample for pheromones in radians");
    addSlider("Pheromone Blur", "gaussianStdDev", 0, .5, .005, "How quickly pheromones diffuse by changing the std deviation of a gaussian distribution");
    addSlider("Pheromone Fade", "passiveAttenuation", 0.002, .05, .001, "Amount by which all pheromones are decreased each frame");
    addCheckbox("Wrap Around", "wrap", "Whether ants bounce off the edges or wrap around to the other side");
    document.getElementById("reset").addEventListener("click", _main__WEBPACK_IMPORTED_MODULE_0__.reset);
    let pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", () => {
        let isPlaying = (0,_main__WEBPACK_IMPORTED_MODULE_0__.togglePause)();
        pauseButton.innerText = isPlaying ? "Pause" : "Unpause";
    });
    (0,_main__WEBPACK_IMPORTED_MODULE_0__.start)();
});
const controls = [];
function setSimulationParams(newParameters) {
    Object.assign(simulationParameters, newParameters);
    controls.forEach(control => control.updater(simulationParameters[control.key]));
}
function addSlider(name, configKey, min, max, step, tooltip) {
    const sliderLabel = document.createElement("label");
    sliderLabel.setAttribute("for", name);
    sliderLabel.setAttribute("title", tooltip);
    sliderLabel.innerText = name;
    const sliderInput = document.createElement("input");
    sliderInput.setAttribute("id", name);
    sliderInput.setAttribute("type", "range");
    sliderInput.setAttribute("min", String(min));
    sliderInput.setAttribute("max", String(max));
    sliderInput.setAttribute("step", String(step));
    sliderInput.setAttribute("value", String(simulationParameters[configKey]));
    const sliderDisplay = document.createElement("span");
    const tableRow = document.createElement("tr");
    tableRow.append(document.createElement("td").appendChild(sliderLabel).parentElement, document.createElement("td").appendChild(sliderInput).parentElement, document.createElement("td").appendChild(sliderDisplay).parentElement);
    configTable.appendChild(tableRow);
    const onUpdate = () => {
        simulationParameters[configKey] = Number(sliderInput.value);
        sliderDisplay.innerText = sliderInput.value;
    };
    onUpdate();
    sliderInput.addEventListener("input", onUpdate);
    controls.push({ key: configKey, updater: (value) => {
            sliderInput.value = String(value);
            sliderDisplay.innerText = sliderInput.value;
        } });
}
function addCheckbox(name, configKey, tooltip) {
    const label = document.createElement("label");
    label.setAttribute("for", name);
    label.setAttribute("title", tooltip);
    label.innerText = name;
    const input = document.createElement("input");
    input.setAttribute("id", name);
    input.setAttribute("type", "checkbox");
    input.checked = simulationParameters[configKey];
    const tableRow = document.createElement("tr");
    tableRow.append(document.createElement("td").appendChild(label).parentElement, document.createElement("td").appendChild(input).parentElement);
    configTable.appendChild(tableRow);
    const onUpdate = () => {
        simulationParameters[configKey] = input.checked;
    };
    onUpdate();
    input.addEventListener("input", onUpdate);
    controls.push({ key: configKey, updater: (value) => {
            input.checked = value;
        } });
}
function getAgentsArray(parameters) {
    const agentsArray = new Array(4 * parameters.agentCount);
    for (let i = 0; i < parameters.agentCount * 4; i += 4) {
        agentsArray[i] = parameters.width / 2;
        agentsArray[i + 1] = parameters.height / 2;
        agentsArray[i + 2] = Math.random() - .5;
        agentsArray[i + 3] = Math.random() - .5;
    }
    return agentsArray;
}


/***/ }),

/***/ "./src/simulationPass.ts":
/*!*******************************!*\
  !*** ./src/simulationPass.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SimulationPass: () => (/* binding */ SimulationPass)
/* harmony export */ });
/* harmony import */ var _shaders_simulation_wgsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaders/simulation.wgsl */ "./src/shaders/simulation.wgsl");

const WORKGROUP_SIZE = 64;
class SimulationPass {
    device;
    pheromoneTexture;
    agentsBuffer;
    simulationParameters;
    workgroups;
    bindGroup;
    uniformBuffer;
    pipeline;
    constructor(device, simulationParameters, textureFormat, agentsBuffer) {
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
            ]
        });
        this.pipeline = device.createComputePipeline({
            label: "Simulation Pipeline",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [computeBindGroupLayout],
            }),
            compute: {
                module: device.createShaderModule({ code: _shaders_simulation_wgsl__WEBPACK_IMPORTED_MODULE_0__["default"] }),
                entryPoint: 'simulate'
            }
        });
        this.uniformBuffer = device.createBuffer({
            size: 36,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
    addPass(commandEncoder, textureIn, textureOut, timestampWrites) {
        const uniformInts = new Uint32Array([
            this.simulationParameters.width,
            this.simulationParameters.height,
            this.simulationParameters.agentCount,
            window.performance.now() * 10,
            this.simulationParameters.sampleDistance,
            this.simulationParameters.wrap ? 1 : 0,
        ]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformInts, 0, uniformInts.length);
        const uniformFloats = new Float32Array([
            this.simulationParameters.turnJitter,
            this.simulationParameters.steerFactor,
            this.simulationParameters.acceleration,
            Math.cos(this.simulationParameters.sampleAngle),
            Math.sin(this.simulationParameters.sampleAngle),
            this.simulationParameters.speed,
        ]);
        this.device.queue.writeBuffer(this.uniformBuffer, uniformInts.byteLength, uniformFloats, 0, uniformFloats.length);
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
                    resource: { buffer: this.agentsBuffer },
                },
                {
                    binding: 2,
                    resource: textureIn.createView(),
                },
                {
                    binding: 3,
                    resource: textureOut.createView(),
                },
            ]
        });
        const simulatePass = commandEncoder.beginComputePass(passDescriptor);
        simulatePass.setPipeline(this.pipeline);
        simulatePass.setBindGroup(0, this.bindGroup);
        simulatePass.dispatchWorkgroups(this.workgroups);
        simulatePass.end();
    }
}


/***/ }),

/***/ "./src/textureComputePass.ts":
/*!***********************************!*\
  !*** ./src/textureComputePass.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TexturePass: () => (/* binding */ TexturePass)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wgpu-matrix */ "./node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _shaders_gaussian_wgsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaders/gaussian.wgsl */ "./src/shaders/gaussian.wgsl");


const WORKGROUP_SIZE = 64;
class TexturePass {
    device;
    pheromoneTextureIn;
    pheromoneTextureOut;
    workgroups;
    bindGroup;
    uniformBuffer;
    pipeline;
    simulationParamters;
    prevGaussianStdDev;
    kernel;
    constructor(device, simulationParameters, pheromoneTextureFormat) {
        this.device = device;
        this.workgroups = [Math.ceil(simulationParameters.width / 8), Math.ceil(simulationParameters.height / 8)];
        this.simulationParamters = simulationParameters;
        this.prevGaussianStdDev = simulationParameters.gaussianStdDev;
        this.kernel = generateGaussianKernel(simulationParameters.gaussianStdDev, 3);
        this.uniformBuffer = device.createBuffer({
            size: this.kernel.byteLength + 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        this.device.queue.writeBuffer(this.uniformBuffer, 0, this.kernel.buffer, this.kernel.byteOffset, this.kernel.byteLength);
        this.device.queue.writeBuffer(this.uniformBuffer, this.kernel.byteLength, new Float32Array([this.simulationParamters.passiveAttenuation]), 0, 1);
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
            ]
        });
        this.pipeline = device.createComputePipeline({
            label: "Simulation Pipeline",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [computeBindGroupLayout],
            }),
            compute: {
                module: device.createShaderModule({ code: _shaders_gaussian_wgsl__WEBPACK_IMPORTED_MODULE_0__["default"] }),
                entryPoint: 'attenuate'
            }
        });
    }
    addPass(commandEncoder, textureIn, textureOut, timestampWrites) {
        if (this.simulationParamters.gaussianStdDev != this.prevGaussianStdDev) {
            this.kernel = generateGaussianKernel(this.simulationParamters.gaussianStdDev, 3);
            this.device.queue.writeBuffer(this.uniformBuffer, 0, this.kernel.buffer, this.kernel.byteOffset, this.kernel.byteLength);
        }
        // Write floats
        const floats = new Float32Array([this.simulationParamters.passiveAttenuation]);
        this.device.queue.writeBuffer(this.uniformBuffer, this.kernel.byteLength, floats, 0, floats.length);
        // Write ints
        const ints = new Uint32Array([this.simulationParamters.wrap ? 1 : 0]);
        this.device.queue.writeBuffer(this.uniformBuffer, this.kernel.byteLength + floats.byteLength, ints, 0, ints.length);
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
                    resource: textureIn.createView(),
                },
                {
                    binding: 2,
                    resource: textureOut.createView(),
                }
            ]
        });
        const simulatePass = commandEncoder.beginComputePass(passDescriptor);
        simulatePass.setPipeline(this.pipeline);
        simulatePass.setBindGroup(0, this.bindGroup);
        simulatePass.dispatchWorkgroups(this.workgroups[0], this.workgroups[1]);
        simulatePass.end();
    }
}
function generateGaussianKernel(stdDev, size) {
    if (size % 2 != 1) {
        throw (new Error("Gaussian Kernel size must be an odd number"));
    }
    const kernel = [];
    const offset = Math.floor(size / 2);
    const TAU = Math.PI;
    const stdDevSqr = (stdDev + .3) ** 2;
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
    return wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.mat3.create(kernel[0], kernel[1], kernel[2], kernel[3], kernel[4], kernel[5], kernel[6], kernel[7], kernel[8]);
    // return mat3.create(0, 0, 0,
    //                    0, 0, 0, 
    //                    0, 0, 0);
}


/***/ }),

/***/ "./node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js":
/*!*****************************************************************!*\
  !*** ./node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mat3: () => (/* binding */ mat3),
/* harmony export */   mat3d: () => (/* binding */ mat3d),
/* harmony export */   mat3n: () => (/* binding */ mat3n),
/* harmony export */   mat4: () => (/* binding */ mat4),
/* harmony export */   mat4d: () => (/* binding */ mat4d),
/* harmony export */   mat4n: () => (/* binding */ mat4n),
/* harmony export */   quat: () => (/* binding */ quat),
/* harmony export */   quatd: () => (/* binding */ quatd),
/* harmony export */   quatn: () => (/* binding */ quatn),
/* harmony export */   utils: () => (/* binding */ utils),
/* harmony export */   vec2: () => (/* binding */ vec2),
/* harmony export */   vec2d: () => (/* binding */ vec2d),
/* harmony export */   vec2n: () => (/* binding */ vec2n),
/* harmony export */   vec3: () => (/* binding */ vec3),
/* harmony export */   vec3d: () => (/* binding */ vec3d),
/* harmony export */   vec3n: () => (/* binding */ vec3n),
/* harmony export */   vec4: () => (/* binding */ vec4),
/* harmony export */   vec4d: () => (/* binding */ vec4d),
/* harmony export */   vec4n: () => (/* binding */ vec4n)
/* harmony export */ });
/* wgpu-matrix@3.2.0, license MIT */
function wrapConstructor(OriginalConstructor, modifier) {
    return class extends OriginalConstructor {
        constructor(...args) {
            super(...args);
            modifier(this);
        }
    }; // Type assertion is necessary here
}
const ZeroArray = wrapConstructor((Array), a => a.fill(0));

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
let EPSILON = 0.000001;
/**
 * Set the value for EPSILON for various checks
 * @param v - Value to use for EPSILON.
 * @returns previous value of EPSILON;
 */
function setEpsilon(v) {
    const old = EPSILON;
    EPSILON = v;
    return old;
}
/**
 * Convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns angle converted to radians
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
/**
 * Convert radians to degrees
 * @param radians - Angle in radians
 * @returns angle converted to degrees
 */
function radToDeg(radians) {
    return radians * 180 / Math.PI;
}
/**
 * Lerps between a and b via t
 * @param a - starting value
 * @param b - ending value
 * @param t - value where 0 = a and 1 = b
 * @returns a + (b - a) * t
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}
/**
 * Compute the opposite of lerp. Given a and b and a value between
 * a and b returns a value between 0 and 1. 0 if a, 1 if b.
 * Note: no clamping is done.
 * @param a - start value
 * @param b - end value
 * @param v - value between a and b
 * @returns (v - a) / (b - a)
 */
function inverseLerp(a, b, v) {
    const d = b - a;
    return (Math.abs(b - a) < EPSILON)
        ? a
        : (v - a) / d;
}
/**
 * Compute the euclidean modulo
 *
 * ```
 * // table for n / 3
 * -5, -4, -3, -2, -1,  0,  1,  2,  3,  4,  5   <- n
 * ------------------------------------
 * -2  -1  -0  -2  -1   0,  1,  2,  0,  1,  2   <- n % 3
 *  1   2   0   1   2   0,  1,  2,  0,  1,  2   <- euclideanModule(n, 3)
 * ```
 *
 * @param n - dividend
 * @param m - divisor
 * @returns the euclidean modulo of n / m
 */
function euclideanModulo(n, m) {
    return ((n % m) + m) % m;
}

var utils = {
    __proto__: null,
    get EPSILON () { return EPSILON; },
    degToRad: degToRad,
    euclideanModulo: euclideanModulo,
    inverseLerp: inverseLerp,
    lerp: lerp,
    radToDeg: radToDeg,
    setEpsilon: setEpsilon
};

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates am typed API for Vec3
 */
function getAPIImpl$5(Ctor) {
    /**
     * Creates a Vec2; may be called with x, y, z to set initial values.
     *
     * Note: Since passing in a raw JavaScript array
     * is valid in all circumstances, if you want to
     * force a JavaScript array into a Vec2's specified type
     * it would be faster to use
     *
     * ```
     * const v = vec2.clone(someJSArray);
     * ```
     *
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @returns the created vector
     */
    function create(x = 0, y = 0) {
        const newDst = new Ctor(2);
        if (x !== undefined) {
            newDst[0] = x;
            if (y !== undefined) {
                newDst[1] = y;
            }
        }
        return newDst;
    }
    /**
     * Creates a Vec2; may be called with x, y, z to set initial values. (same as create)
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @returns the created vector
     */
    const fromValues = create;
    /**
     * Sets the values of a Vec2
     * Also see {@link vec2.create} and {@link vec2.copy}
     *
     * @param x first value
     * @param y second value
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector with its elements set.
     */
    function set(x, y, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = x;
        newDst[1] = y;
        return newDst;
    }
    /**
     * Applies Math.ceil to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the ceil of each element of v.
     */
    function ceil(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.ceil(v[0]);
        newDst[1] = Math.ceil(v[1]);
        return newDst;
    }
    /**
     * Applies Math.floor to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the floor of each element of v.
     */
    function floor(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.floor(v[0]);
        newDst[1] = Math.floor(v[1]);
        return newDst;
    }
    /**
     * Applies Math.round to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the round of each element of v.
     */
    function round(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.round(v[0]);
        newDst[1] = Math.round(v[1]);
        return newDst;
    }
    /**
     * Clamp each element of vector between min and max
     * @param v - Operand vector.
     * @param max - Min value, default 0
     * @param min - Max value, default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that the clamped value of each element of v.
     */
    function clamp(v, min = 0, max = 1, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.min(max, Math.max(min, v[0]));
        newDst[1] = Math.min(max, Math.max(min, v[1]));
        return newDst;
    }
    /**
     * Adds two vectors; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a and b.
     */
    function add(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] + b[0];
        newDst[1] = a[1] + b[1];
        return newDst;
    }
    /**
     * Adds two vectors, scaling the 2nd; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param scale - Amount to scale b
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a + b * scale.
     */
    function addScaled(a, b, scale, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] + b[0] * scale;
        newDst[1] = a[1] + b[1] * scale;
        return newDst;
    }
    /**
     * Returns the angle in radians between two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns The angle in radians between the 2 vectors.
     */
    function angle(a, b) {
        const ax = a[0];
        const ay = a[1];
        const bx = b[0];
        const by = b[1];
        const mag1 = Math.sqrt(ax * ax + ay * ay);
        const mag2 = Math.sqrt(bx * bx + by * by);
        const mag = mag1 * mag2;
        const cosine = mag && dot(a, b) / mag;
        return Math.acos(cosine);
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    function subtract(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] - b[0];
        newDst[1] = a[1] - b[1];
        return newDst;
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    const sub = subtract;
    /**
     * Check if 2 vectors are approximately equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON;
    }
    /**
     * Check if 2 vectors are exactly equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] && a[1] === b[1];
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficient.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The linear interpolated result.
     */
    function lerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] + t * (b[0] - a[0]);
        newDst[1] = a[1] + t * (b[1] - a[1]);
        return newDst;
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient vector t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficients vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns the linear interpolated result.
     */
    function lerpV(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] + t[0] * (b[0] - a[0]);
        newDst[1] = a[1] + t[1] * (b[1] - a[1]);
        return newDst;
    }
    /**
     * Return max values of two vectors.
     * Given vectors a and b returns
     * [max(a[0], b[0]), max(a[1], b[1]), max(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The max components vector.
     */
    function max(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.max(a[0], b[0]);
        newDst[1] = Math.max(a[1], b[1]);
        return newDst;
    }
    /**
     * Return min values of two vectors.
     * Given vectors a and b returns
     * [min(a[0], b[0]), min(a[1], b[1]), min(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The min components vector.
     */
    function min(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.min(a[0], b[0]);
        newDst[1] = Math.min(a[1], b[1]);
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function mulScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = v[0] * k;
        newDst[1] = v[1] * k;
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar. (same as mulScalar)
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    const scale = mulScalar;
    /**
     * Divides a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function divScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = v[0] / k;
        newDst[1] = v[1] / k;
        return newDst;
    }
    /**
     * Inverse a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    function inverse(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = 1 / v[0];
        newDst[1] = 1 / v[1];
        return newDst;
    }
    /**
     * Invert a vector. (same as inverse)
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    const invert = inverse;
    /**
     * Computes the cross product of two vectors; assumes both vectors have
     * three entries.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of a cross b.
     */
    function cross(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        const z = a[0] * b[1] - a[1] * b[0];
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = z;
        return newDst;
    }
    /**
     * Computes the dot product of two vectors; assumes both vectors have
     * three entries.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns dot product
     */
    function dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }
    /**
     * Computes the length of vector
     * @param v - vector.
     * @returns length of vector.
     */
    function length(v) {
        const v0 = v[0];
        const v1 = v[1];
        return Math.sqrt(v0 * v0 + v1 * v1);
    }
    /**
     * Computes the length of vector (same as length)
     * @param v - vector.
     * @returns length of vector.
     */
    const len = length;
    /**
     * Computes the square of the length of vector
     * @param v - vector.
     * @returns square of the length of vector.
     */
    function lengthSq(v) {
        const v0 = v[0];
        const v1 = v[1];
        return v0 * v0 + v1 * v1;
    }
    /**
     * Computes the square of the length of vector (same as lengthSq)
     * @param v - vector.
     * @returns square of the length of vector.
     */
    const lenSq = lengthSq;
    /**
     * Computes the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    function distance(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Computes the distance between 2 points (same as distance)
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    const dist = distance;
    /**
     * Computes the square of the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    function distanceSq(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return dx * dx + dy * dy;
    }
    /**
     * Computes the square of the distance between 2 points (same as distanceSq)
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    const distSq = distanceSq;
    /**
     * Divides a vector by its Euclidean length and returns the quotient.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The normalized vector.
     */
    function normalize(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        const v0 = v[0];
        const v1 = v[1];
        const len = Math.sqrt(v0 * v0 + v1 * v1);
        if (len > 0.00001) {
            newDst[0] = v0 / len;
            newDst[1] = v1 / len;
        }
        else {
            newDst[0] = 0;
            newDst[1] = 0;
        }
        return newDst;
    }
    /**
     * Negates a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns -v.
     */
    function negate(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = -v[0];
        newDst[1] = -v[1];
        return newDst;
    }
    /**
     * Copies a vector. (same as {@link vec2.clone})
     * Also see {@link vec2.create} and {@link vec2.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    function copy(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = v[0];
        newDst[1] = v[1];
        return newDst;
    }
    /**
     * Clones a vector. (same as {@link vec2.copy})
     * Also see {@link vec2.create} and {@link vec2.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    const clone = copy;
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] * b[0];
        newDst[1] = a[1] * b[1];
        return newDst;
    }
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as mul)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    const mul = multiply;
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    function divide(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] / b[0];
        newDst[1] = a[1] / b[1];
        return newDst;
    }
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as divide)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    const div = divide;
    /**
     * Creates a random unit vector * scale
     * @param scale - Default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The random vector.
     */
    function random(scale = 1, dst) {
        const newDst = (dst ?? new Ctor(2));
        const angle = Math.random() * 2 * Math.PI;
        newDst[0] = Math.cos(angle) * scale;
        newDst[1] = Math.sin(angle) * scale;
        return newDst;
    }
    /**
     * Zero's a vector
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The zeroed vector.
     */
    function zero(dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = 0;
        newDst[1] = 0;
        return newDst;
    }
    /**
     * transform Vec2 by 4x4 matrix
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional Vec2 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat4(v, m, dst) {
        const newDst = (dst ?? new Ctor(2));
        const x = v[0];
        const y = v[1];
        newDst[0] = x * m[0] + y * m[4] + m[12];
        newDst[1] = x * m[1] + y * m[5] + m[13];
        return newDst;
    }
    /**
     * Transforms vec4 by 3x3 matrix
     *
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional Vec2 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat3(v, m, dst) {
        const newDst = (dst ?? new Ctor(2));
        const x = v[0];
        const y = v[1];
        newDst[0] = m[0] * x + m[4] * y + m[8];
        newDst[1] = m[1] * x + m[5] * y + m[9];
        return newDst;
    }
    /**
     * Rotate a 2D vector
     *
     * @param a The vec2 point to rotate
     * @param b The origin of the rotation
     * @param rad The angle of rotation in radians
     * @returns the rotated vector
     */
    function rotate(a, b, rad, dst) {
        const newDst = (dst ?? new Ctor(2));
        // Translate point to the origin
        const p0 = a[0] - b[0];
        const p1 = a[1] - b[1];
        const sinC = Math.sin(rad);
        const cosC = Math.cos(rad);
        //perform rotation and translate to correct position
        newDst[0] = p0 * cosC - p1 * sinC + b[0];
        newDst[1] = p0 * sinC + p1 * cosC + b[1];
        return newDst;
    }
    /**
     * Treat a 2D vector as a direction and set it's length
     *
     * @param a The vec2 to lengthen
     * @param len The length of the resulting vector
     * @returns The lengthened vector
     */
    function setLength(a, len, dst) {
        const newDst = (dst ?? new Ctor(2));
        normalize(a, newDst);
        return mulScalar(newDst, len, newDst);
    }
    /**
     * Ensure a vector is not longer than a max length
     *
     * @param a The vec2 to limit
     * @param maxLen The longest length of the resulting vector
     * @returns The vector, shortened to maxLen if it's too long
     */
    function truncate(a, maxLen, dst) {
        const newDst = (dst ?? new Ctor(2));
        if (length(a) > maxLen) {
            return setLength(a, maxLen, newDst);
        }
        return copy(a, newDst);
    }
    /**
     * Return the vector exactly between 2 endpoint vectors
     *
     * @param a Endpoint 1
     * @param b Endpoint 2
     * @returns The vector exactly residing between endpoints 1 and 2
     */
    function midpoint(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        return lerp(a, b, 0.5, newDst);
    }
    return {
        create,
        fromValues,
        set,
        ceil,
        floor,
        round,
        clamp,
        add,
        addScaled,
        angle,
        subtract,
        sub,
        equalsApproximately,
        equals,
        lerp,
        lerpV,
        max,
        min,
        mulScalar,
        scale,
        divScalar,
        inverse,
        invert,
        cross,
        dot,
        length,
        len,
        lengthSq,
        lenSq,
        distance,
        dist,
        distanceSq,
        distSq,
        normalize,
        negate,
        copy,
        clone,
        multiply,
        mul,
        divide,
        div,
        random,
        zero,
        transformMat4,
        transformMat3,
        rotate,
        setLength,
        truncate,
        midpoint,
    };
}
const cache$5 = new Map();
function getAPI$5(Ctor) {
    let api = cache$5.get(Ctor);
    if (!api) {
        api = getAPIImpl$5(Ctor);
        cache$5.set(Ctor, api);
    }
    return api;
}

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates am typed API for Vec3
 * */
function getAPIImpl$4(Ctor) {
    /**
     * Creates a vec3; may be called with x, y, z to set initial values.
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @returns the created vector
     */
    function create(x, y, z) {
        const newDst = new Ctor(3);
        if (x !== undefined) {
            newDst[0] = x;
            if (y !== undefined) {
                newDst[1] = y;
                if (z !== undefined) {
                    newDst[2] = z;
                }
            }
        }
        return newDst;
    }
    /**
     * Creates a vec3; may be called with x, y, z to set initial values. (same as create)
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @returns the created vector
     */
    const fromValues = create;
    /**
     * Sets the values of a Vec3
     * Also see {@link vec3.create} and {@link vec3.copy}
     *
     * @param x first value
     * @param y second value
     * @param z third value
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector with its elements set.
     */
    function set(x, y, z, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = x;
        newDst[1] = y;
        newDst[2] = z;
        return newDst;
    }
    /**
     * Applies Math.ceil to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the ceil of each element of v.
     */
    function ceil(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.ceil(v[0]);
        newDst[1] = Math.ceil(v[1]);
        newDst[2] = Math.ceil(v[2]);
        return newDst;
    }
    /**
     * Applies Math.floor to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the floor of each element of v.
     */
    function floor(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.floor(v[0]);
        newDst[1] = Math.floor(v[1]);
        newDst[2] = Math.floor(v[2]);
        return newDst;
    }
    /**
     * Applies Math.round to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the round of each element of v.
     */
    function round(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.round(v[0]);
        newDst[1] = Math.round(v[1]);
        newDst[2] = Math.round(v[2]);
        return newDst;
    }
    /**
     * Clamp each element of vector between min and max
     * @param v - Operand vector.
     * @param max - Min value, default 0
     * @param min - Max value, default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that the clamped value of each element of v.
     */
    function clamp(v, min = 0, max = 1, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.min(max, Math.max(min, v[0]));
        newDst[1] = Math.min(max, Math.max(min, v[1]));
        newDst[2] = Math.min(max, Math.max(min, v[2]));
        return newDst;
    }
    /**
     * Adds two vectors; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a and b.
     */
    function add(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] + b[0];
        newDst[1] = a[1] + b[1];
        newDst[2] = a[2] + b[2];
        return newDst;
    }
    /**
     * Adds two vectors, scaling the 2nd; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param scale - Amount to scale b
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a + b * scale.
     */
    function addScaled(a, b, scale, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] + b[0] * scale;
        newDst[1] = a[1] + b[1] * scale;
        newDst[2] = a[2] + b[2] * scale;
        return newDst;
    }
    /**
     * Returns the angle in radians between two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns The angle in radians between the 2 vectors.
     */
    function angle(a, b) {
        const ax = a[0];
        const ay = a[1];
        const az = a[2];
        const bx = b[0];
        const by = b[1];
        const bz = b[2];
        const mag1 = Math.sqrt(ax * ax + ay * ay + az * az);
        const mag2 = Math.sqrt(bx * bx + by * by + bz * bz);
        const mag = mag1 * mag2;
        const cosine = mag && dot(a, b) / mag;
        return Math.acos(cosine);
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    function subtract(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] - b[0];
        newDst[1] = a[1] - b[1];
        newDst[2] = a[2] - b[2];
        return newDst;
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    const sub = subtract;
    /**
     * Check if 2 vectors are approximately equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON;
    }
    /**
     * Check if 2 vectors are exactly equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficient.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The linear interpolated result.
     */
    function lerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] + t * (b[0] - a[0]);
        newDst[1] = a[1] + t * (b[1] - a[1]);
        newDst[2] = a[2] + t * (b[2] - a[2]);
        return newDst;
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient vector t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficients vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns the linear interpolated result.
     */
    function lerpV(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] + t[0] * (b[0] - a[0]);
        newDst[1] = a[1] + t[1] * (b[1] - a[1]);
        newDst[2] = a[2] + t[2] * (b[2] - a[2]);
        return newDst;
    }
    /**
     * Return max values of two vectors.
     * Given vectors a and b returns
     * [max(a[0], b[0]), max(a[1], b[1]), max(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The max components vector.
     */
    function max(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.max(a[0], b[0]);
        newDst[1] = Math.max(a[1], b[1]);
        newDst[2] = Math.max(a[2], b[2]);
        return newDst;
    }
    /**
     * Return min values of two vectors.
     * Given vectors a and b returns
     * [min(a[0], b[0]), min(a[1], b[1]), min(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The min components vector.
     */
    function min(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.min(a[0], b[0]);
        newDst[1] = Math.min(a[1], b[1]);
        newDst[2] = Math.min(a[2], b[2]);
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function mulScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = v[0] * k;
        newDst[1] = v[1] * k;
        newDst[2] = v[2] * k;
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar. (same as mulScalar)
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    const scale = mulScalar;
    /**
     * Divides a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function divScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = v[0] / k;
        newDst[1] = v[1] / k;
        newDst[2] = v[2] / k;
        return newDst;
    }
    /**
     * Inverse a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    function inverse(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = 1 / v[0];
        newDst[1] = 1 / v[1];
        newDst[2] = 1 / v[2];
        return newDst;
    }
    /**
     * Invert a vector. (same as inverse)
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    const invert = inverse;
    /**
     * Computes the cross product of two vectors; assumes both vectors have
     * three entries.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of a cross b.
     */
    function cross(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        const t1 = a[2] * b[0] - a[0] * b[2];
        const t2 = a[0] * b[1] - a[1] * b[0];
        newDst[0] = a[1] * b[2] - a[2] * b[1];
        newDst[1] = t1;
        newDst[2] = t2;
        return newDst;
    }
    /**
     * Computes the dot product of two vectors; assumes both vectors have
     * three entries.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns dot product
     */
    function dot(a, b) {
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
    }
    /**
     * Computes the length of vector
     * @param v - vector.
     * @returns length of vector.
     */
    function length(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);
    }
    /**
     * Computes the length of vector (same as length)
     * @param v - vector.
     * @returns length of vector.
     */
    const len = length;
    /**
     * Computes the square of the length of vector
     * @param v - vector.
     * @returns square of the length of vector.
     */
    function lengthSq(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        return v0 * v0 + v1 * v1 + v2 * v2;
    }
    /**
     * Computes the square of the length of vector (same as lengthSq)
     * @param v - vector.
     * @returns square of the length of vector.
     */
    const lenSq = lengthSq;
    /**
     * Computes the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    function distance(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    /**
     * Computes the distance between 2 points (same as distance)
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    const dist = distance;
    /**
     * Computes the square of the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    function distanceSq(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return dx * dx + dy * dy + dz * dz;
    }
    /**
     * Computes the square of the distance between 2 points (same as distanceSq)
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    const distSq = distanceSq;
    /**
     * Divides a vector by its Euclidean length and returns the quotient.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The normalized vector.
     */
    function normalize(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const len = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);
        if (len > 0.00001) {
            newDst[0] = v0 / len;
            newDst[1] = v1 / len;
            newDst[2] = v2 / len;
        }
        else {
            newDst[0] = 0;
            newDst[1] = 0;
            newDst[2] = 0;
        }
        return newDst;
    }
    /**
     * Negates a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns -v.
     */
    function negate(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = -v[0];
        newDst[1] = -v[1];
        newDst[2] = -v[2];
        return newDst;
    }
    /**
     * Copies a vector. (same as {@link vec3.clone})
     * Also see {@link vec3.create} and {@link vec3.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    function copy(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = v[0];
        newDst[1] = v[1];
        newDst[2] = v[2];
        return newDst;
    }
    /**
     * Clones a vector. (same as {@link vec3.copy})
     * Also see {@link vec3.create} and {@link vec3.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    const clone = copy;
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] * b[0];
        newDst[1] = a[1] * b[1];
        newDst[2] = a[2] * b[2];
        return newDst;
    }
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as mul)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    const mul = multiply;
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    function divide(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] / b[0];
        newDst[1] = a[1] / b[1];
        newDst[2] = a[2] / b[2];
        return newDst;
    }
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as divide)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    const div = divide;
    /**
     * Creates a random vector
     * @param scale - Default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The random vector.
     */
    function random(scale = 1, dst) {
        const newDst = (dst ?? new Ctor(3));
        const angle = Math.random() * 2 * Math.PI;
        const z = Math.random() * 2 - 1;
        const zScale = Math.sqrt(1 - z * z) * scale;
        newDst[0] = Math.cos(angle) * zScale;
        newDst[1] = Math.sin(angle) * zScale;
        newDst[2] = z * scale;
        return newDst;
    }
    /**
     * Zero's a vector
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The zeroed vector.
     */
    function zero(dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
        return newDst;
    }
    /**
     * transform vec3 by 4x4 matrix
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional vec3 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat4(v, m, dst) {
        const newDst = (dst ?? new Ctor(3));
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const w = (m[3] * x + m[7] * y + m[11] * z + m[15]) || 1;
        newDst[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
        newDst[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
        newDst[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
        return newDst;
    }
    /**
     * Transform vec3 by upper 3x3 matrix inside 4x4 matrix.
     * @param v - The direction.
     * @param m - The matrix.
     * @param dst - optional vec3 to store result. If not passed a new one is created.
     * @returns The transformed vector.
     */
    function transformMat4Upper3x3(v, m, dst) {
        const newDst = (dst ?? new Ctor(3));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        newDst[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0];
        newDst[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1];
        newDst[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2];
        return newDst;
    }
    /**
     * Transforms vec3 by 3x3 matrix
     *
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional vec3 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat3(v, m, dst) {
        const newDst = (dst ?? new Ctor(3));
        const x = v[0];
        const y = v[1];
        const z = v[2];
        newDst[0] = x * m[0] + y * m[4] + z * m[8];
        newDst[1] = x * m[1] + y * m[5] + z * m[9];
        newDst[2] = x * m[2] + y * m[6] + z * m[10];
        return newDst;
    }
    /**
     * Transforms vec3 by Quaternion
     * @param v - the vector to transform
     * @param q - the quaternion to transform by
     * @param dst - optional vec3 to store result. If not passed a new one is created.
     * @returns the transformed
     */
    function transformQuat(v, q, dst) {
        const newDst = (dst ?? new Ctor(3));
        const qx = q[0];
        const qy = q[1];
        const qz = q[2];
        const w2 = q[3] * 2;
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const uvX = qy * z - qz * y;
        const uvY = qz * x - qx * z;
        const uvZ = qx * y - qy * x;
        newDst[0] = x + uvX * w2 + (qy * uvZ - qz * uvY) * 2;
        newDst[1] = y + uvY * w2 + (qz * uvX - qx * uvZ) * 2;
        newDst[2] = z + uvZ * w2 + (qx * uvY - qy * uvX) * 2;
        return newDst;
    }
    /**
     * Returns the translation component of a 4-by-4 matrix as a vector with 3
     * entries.
     * @param m - The matrix.
     * @param dst - vector to hold result. If not passed a new one is created.
     * @returns The translation component of m.
     */
    function getTranslation(m, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = m[12];
        newDst[1] = m[13];
        newDst[2] = m[14];
        return newDst;
    }
    /**
     * Returns an axis of a 4x4 matrix as a vector with 3 entries
     * @param m - The matrix.
     * @param axis - The axis 0 = x, 1 = y, 2 = z;
     * @returns The axis component of m.
     */
    function getAxis(m, axis, dst) {
        const newDst = (dst ?? new Ctor(3));
        const off = axis * 4;
        newDst[0] = m[off + 0];
        newDst[1] = m[off + 1];
        newDst[2] = m[off + 2];
        return newDst;
    }
    /**
     * Returns the scaling component of the matrix
     * @param m - The Matrix
     * @param dst - The vector to set. If not passed a new one is created.
     */
    function getScaling(m, dst) {
        const newDst = (dst ?? new Ctor(3));
        const xx = m[0];
        const xy = m[1];
        const xz = m[2];
        const yx = m[4];
        const yy = m[5];
        const yz = m[6];
        const zx = m[8];
        const zy = m[9];
        const zz = m[10];
        newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
        newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
        newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
        return newDst;
    }
    /**
     * Rotate a 3D vector around the x-axis
     *
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @param dst - The vector to set. If not passed a new one is created.
     * @returns the rotated vector
     */
    function rotateX(a, b, rad, dst) {
        const newDst = (dst ?? new Ctor(3));
        const p = [];
        const r = [];
        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
        //perform rotation
        r[0] = p[0];
        r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
        r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
        //translate to correct position
        newDst[0] = r[0] + b[0];
        newDst[1] = r[1] + b[1];
        newDst[2] = r[2] + b[2];
        return newDst;
    }
    /**
     * Rotate a 3D vector around the y-axis
     *
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @param dst - The vector to set. If not passed a new one is created.
     * @returns the rotated vector
     */
    function rotateY(a, b, rad, dst) {
        const newDst = (dst ?? new Ctor(3));
        const p = [];
        const r = [];
        // translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
        // perform rotation
        r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
        r[1] = p[1];
        r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
        // translate to correct position
        newDst[0] = r[0] + b[0];
        newDst[1] = r[1] + b[1];
        newDst[2] = r[2] + b[2];
        return newDst;
    }
    /**
     * Rotate a 3D vector around the z-axis
     *
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @param dst - The vector to set. If not passed a new one is created.
     * @returns {vec3} out
     */
    function rotateZ(a, b, rad, dst) {
        const newDst = (dst ?? new Ctor(3));
        const p = [];
        const r = [];
        // translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
        // perform rotation
        r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
        r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
        r[2] = p[2];
        // translate to correct position
        newDst[0] = r[0] + b[0];
        newDst[1] = r[1] + b[1];
        newDst[2] = r[2] + b[2];
        return newDst;
    }
    /**
     * Treat a 3D vector as a direction and set it's length
     *
     * @param a The vec3 to lengthen
     * @param len The length of the resulting vector
     * @returns The lengthened vector
     */
    function setLength(a, len, dst) {
        const newDst = (dst ?? new Ctor(3));
        normalize(a, newDst);
        return mulScalar(newDst, len, newDst);
    }
    /**
     * Ensure a vector is not longer than a max length
     *
     * @param a The vec3 to limit
     * @param maxLen The longest length of the resulting vector
     * @returns The vector, shortened to maxLen if it's too long
     */
    function truncate(a, maxLen, dst) {
        const newDst = (dst ?? new Ctor(3));
        if (length(a) > maxLen) {
            return setLength(a, maxLen, newDst);
        }
        return copy(a, newDst);
    }
    /**
     * Return the vector exactly between 2 endpoint vectors
     *
     * @param a Endpoint 1
     * @param b Endpoint 2
     * @returns The vector exactly residing between endpoints 1 and 2
     */
    function midpoint(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        return lerp(a, b, 0.5, newDst);
    }
    return {
        create,
        fromValues,
        set,
        ceil,
        floor,
        round,
        clamp,
        add,
        addScaled,
        angle,
        subtract,
        sub,
        equalsApproximately,
        equals,
        lerp,
        lerpV,
        max,
        min,
        mulScalar,
        scale,
        divScalar,
        inverse,
        invert,
        cross,
        dot,
        length,
        len,
        lengthSq,
        lenSq,
        distance,
        dist,
        distanceSq,
        distSq,
        normalize,
        negate,
        copy,
        clone,
        multiply,
        mul,
        divide,
        div,
        random,
        zero,
        transformMat4,
        transformMat4Upper3x3,
        transformMat3,
        transformQuat,
        getTranslation,
        getAxis,
        getScaling,
        rotateX,
        rotateY,
        rotateZ,
        setLength,
        truncate,
        midpoint,
    };
}
const cache$4 = new Map();
function getAPI$4(Ctor) {
    let api = cache$4.get(Ctor);
    if (!api) {
        api = getAPIImpl$4(Ctor);
        cache$4.set(Ctor, api);
    }
    return api;
}

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates a typed API for Mat3
 * */
function getAPIImpl$3(Ctor) {
    const vec2 = getAPI$5(Ctor);
    const vec3 = getAPI$4(Ctor);
    /**
     * Create a Mat3 from values
     *
     * Note: Since passing in a raw JavaScript array
     * is valid in all circumstances, if you want to
     * force a JavaScript array into a Mat3's specified type
     * it would be faster to use
     *
     * ```
     * const m = mat3.clone(someJSArray);
     * ```
     *
     * @param v0 - value for element 0
     * @param v1 - value for element 1
     * @param v2 - value for element 2
     * @param v3 - value for element 3
     * @param v4 - value for element 4
     * @param v5 - value for element 5
     * @param v6 - value for element 6
     * @param v7 - value for element 7
     * @param v8 - value for element 8
     * @returns matrix created from values.
     */
    function create(v0, v1, v2, v3, v4, v5, v6, v7, v8) {
        const newDst = new Ctor(12);
        // to make the array homogenous
        newDst[3] = 0;
        newDst[7] = 0;
        newDst[11] = 0;
        if (v0 !== undefined) {
            newDst[0] = v0;
            if (v1 !== undefined) {
                newDst[1] = v1;
                if (v2 !== undefined) {
                    newDst[2] = v2;
                    if (v3 !== undefined) {
                        newDst[4] = v3;
                        if (v4 !== undefined) {
                            newDst[5] = v4;
                            if (v5 !== undefined) {
                                newDst[6] = v5;
                                if (v6 !== undefined) {
                                    newDst[8] = v6;
                                    if (v7 !== undefined) {
                                        newDst[9] = v7;
                                        if (v8 !== undefined) {
                                            newDst[10] = v8;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return newDst;
    }
    /**
     * Sets the values of a Mat3
     * Also see {@link mat3.create} and {@link mat3.copy}
     *
     * @param v0 - value for element 0
     * @param v1 - value for element 1
     * @param v2 - value for element 2
     * @param v3 - value for element 3
     * @param v4 - value for element 4
     * @param v5 - value for element 5
     * @param v6 - value for element 6
     * @param v7 - value for element 7
     * @param v8 - value for element 8
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat3 set from values.
     */
    function set(v0, v1, v2, v3, v4, v5, v6, v7, v8, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = v0;
        newDst[1] = v1;
        newDst[2] = v2;
        newDst[3] = 0;
        newDst[4] = v3;
        newDst[5] = v4;
        newDst[6] = v5;
        newDst[7] = 0;
        newDst[8] = v6;
        newDst[9] = v7;
        newDst[10] = v8;
        newDst[11] = 0;
        return newDst;
    }
    /**
     * Creates a Mat3 from the upper left 3x3 part of a Mat4
     * @param m4 - source matrix
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat3 made from m4
     */
    function fromMat4(m4, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = m4[0];
        newDst[1] = m4[1];
        newDst[2] = m4[2];
        newDst[3] = 0;
        newDst[4] = m4[4];
        newDst[5] = m4[5];
        newDst[6] = m4[6];
        newDst[7] = 0;
        newDst[8] = m4[8];
        newDst[9] = m4[9];
        newDst[10] = m4[10];
        newDst[11] = 0;
        return newDst;
    }
    /**
     * Creates a Mat3 rotation matrix from a quaternion
     * @param q - quaternion to create matrix from
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat3 made from q
     */
    function fromQuat(q, dst) {
        const newDst = (dst ?? new Ctor(12));
        const x = q[0];
        const y = q[1];
        const z = q[2];
        const w = q[3];
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        newDst[0] = 1 - yy - zz;
        newDst[1] = yx + wz;
        newDst[2] = zx - wy;
        newDst[3] = 0;
        newDst[4] = yx - wz;
        newDst[5] = 1 - xx - zz;
        newDst[6] = zy + wx;
        newDst[7] = 0;
        newDst[8] = zx + wy;
        newDst[9] = zy - wx;
        newDst[10] = 1 - xx - yy;
        newDst[11] = 0;
        return newDst;
    }
    /**
     * Negates a matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns -m.
     */
    function negate(m, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = -m[0];
        newDst[1] = -m[1];
        newDst[2] = -m[2];
        newDst[4] = -m[4];
        newDst[5] = -m[5];
        newDst[6] = -m[6];
        newDst[8] = -m[8];
        newDst[9] = -m[9];
        newDst[10] = -m[10];
        return newDst;
    }
    /**
     * Copies a matrix. (same as {@link mat3.clone})
     * Also see {@link mat3.create} and {@link mat3.set}
     * @param m - The matrix.
     * @param dst - The matrix. If not passed a new one is created.
     * @returns A copy of m.
     */
    function copy(m, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = m[0];
        newDst[1] = m[1];
        newDst[2] = m[2];
        newDst[4] = m[4];
        newDst[5] = m[5];
        newDst[6] = m[6];
        newDst[8] = m[8];
        newDst[9] = m[9];
        newDst[10] = m[10];
        return newDst;
    }
    /**
     * Copies a matrix (same as {@link mat3.copy})
     * Also see {@link mat3.create} and {@link mat3.set}
     * @param m - The matrix.
     * @param dst - The matrix. If not passed a new one is created.
     * @returns A copy of m.
     */
    const clone = copy;
    /**
     * Check if 2 matrices are approximately equal
     * @param a Operand matrix.
     * @param b Operand matrix.
     * @returns true if matrices are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON &&
            Math.abs(a[4] - b[4]) < EPSILON &&
            Math.abs(a[5] - b[5]) < EPSILON &&
            Math.abs(a[6] - b[6]) < EPSILON &&
            Math.abs(a[8] - b[8]) < EPSILON &&
            Math.abs(a[9] - b[9]) < EPSILON &&
            Math.abs(a[10] - b[10]) < EPSILON;
    }
    /**
     * Check if 2 matrices are exactly equal
     * @param a Operand matrix.
     * @param b Operand matrix.
     * @returns true if matrices are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] &&
            a[1] === b[1] &&
            a[2] === b[2] &&
            a[4] === b[4] &&
            a[5] === b[5] &&
            a[6] === b[6] &&
            a[8] === b[8] &&
            a[9] === b[9] &&
            a[10] === b[10];
    }
    /**
     * Creates a 3-by-3 identity matrix.
     *
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns A 3-by-3 identity matrix.
     */
    function identity(dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Takes the transpose of a matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The transpose of m.
     */
    function transpose(m, dst) {
        const newDst = (dst ?? new Ctor(12));
        if (newDst === m) {
            let t;
            // 0 1 2
            // 4 5 6
            // 8 9 10
            t = m[1];
            m[1] = m[4];
            m[4] = t;
            t = m[2];
            m[2] = m[8];
            m[8] = t;
            t = m[6];
            m[6] = m[9];
            m[9] = t;
            return newDst;
        }
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        newDst[0] = m00;
        newDst[1] = m10;
        newDst[2] = m20;
        newDst[4] = m01;
        newDst[5] = m11;
        newDst[6] = m21;
        newDst[8] = m02;
        newDst[9] = m12;
        newDst[10] = m22;
        return newDst;
    }
    /**
     * Computes the inverse of a 3-by-3 matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The inverse of m.
     */
    function inverse(m, dst) {
        const newDst = (dst ?? new Ctor(12));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const b01 = m22 * m11 - m12 * m21;
        const b11 = -m22 * m10 + m12 * m20;
        const b21 = m21 * m10 - m11 * m20;
        const invDet = 1 / (m00 * b01 + m01 * b11 + m02 * b21);
        newDst[0] = b01 * invDet;
        newDst[1] = (-m22 * m01 + m02 * m21) * invDet;
        newDst[2] = (m12 * m01 - m02 * m11) * invDet;
        newDst[4] = b11 * invDet;
        newDst[5] = (m22 * m00 - m02 * m20) * invDet;
        newDst[6] = (-m12 * m00 + m02 * m10) * invDet;
        newDst[8] = b21 * invDet;
        newDst[9] = (-m21 * m00 + m01 * m20) * invDet;
        newDst[10] = (m11 * m00 - m01 * m10) * invDet;
        return newDst;
    }
    /**
     * Compute the determinant of a matrix
     * @param m - the matrix
     * @returns the determinant
     */
    function determinant(m) {
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        return m00 * (m11 * m22 - m21 * m12) -
            m10 * (m01 * m22 - m21 * m02) +
            m20 * (m01 * m12 - m11 * m02);
    }
    /**
     * Computes the inverse of a 3-by-3 matrix. (same as inverse)
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The inverse of m.
     */
    const invert = inverse;
    /**
     * Multiplies two 3-by-3 matrices with a on the left and b on the right
     * @param a - The matrix on the left.
     * @param b - The matrix on the right.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix product of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(12));
        const a00 = a[0];
        const a01 = a[1];
        const a02 = a[2];
        const a10 = a[4 + 0];
        const a11 = a[4 + 1];
        const a12 = a[4 + 2];
        const a20 = a[8 + 0];
        const a21 = a[8 + 1];
        const a22 = a[8 + 2];
        const b00 = b[0];
        const b01 = b[1];
        const b02 = b[2];
        const b10 = b[4 + 0];
        const b11 = b[4 + 1];
        const b12 = b[4 + 2];
        const b20 = b[8 + 0];
        const b21 = b[8 + 1];
        const b22 = b[8 + 2];
        newDst[0] = a00 * b00 + a10 * b01 + a20 * b02;
        newDst[1] = a01 * b00 + a11 * b01 + a21 * b02;
        newDst[2] = a02 * b00 + a12 * b01 + a22 * b02;
        newDst[4] = a00 * b10 + a10 * b11 + a20 * b12;
        newDst[5] = a01 * b10 + a11 * b11 + a21 * b12;
        newDst[6] = a02 * b10 + a12 * b11 + a22 * b12;
        newDst[8] = a00 * b20 + a10 * b21 + a20 * b22;
        newDst[9] = a01 * b20 + a11 * b21 + a21 * b22;
        newDst[10] = a02 * b20 + a12 * b21 + a22 * b22;
        return newDst;
    }
    /**
     * Multiplies two 3-by-3 matrices with a on the left and b on the right (same as multiply)
     * @param a - The matrix on the left.
     * @param b - The matrix on the right.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix product of a and b.
     */
    const mul = multiply;
    /**
     * Sets the translation component of a 3-by-3 matrix to the given
     * vector.
     * @param a - The matrix.
     * @param v - The vector.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix with translation set.
     */
    function setTranslation(a, v, dst) {
        const newDst = (dst ?? identity());
        if (a !== newDst) {
            newDst[0] = a[0];
            newDst[1] = a[1];
            newDst[2] = a[2];
            newDst[4] = a[4];
            newDst[5] = a[5];
            newDst[6] = a[6];
        }
        newDst[8] = v[0];
        newDst[9] = v[1];
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Returns the translation component of a 3-by-3 matrix as a vector with 3
     * entries.
     * @param m - The matrix.
     * @param dst - vector to hold result. If not passed a new one is created.
     * @returns The translation component of m.
     */
    function getTranslation(m, dst) {
        const newDst = (dst ?? vec2.create());
        newDst[0] = m[8];
        newDst[1] = m[9];
        return newDst;
    }
    /**
     * Returns an axis of a 3x3 matrix as a vector with 2 entries
     * @param m - The matrix.
     * @param axis - The axis 0 = x, 1 = y,
     * @returns The axis component of m.
     */
    function getAxis(m, axis, dst) {
        const newDst = (dst ?? vec2.create());
        const off = axis * 4;
        newDst[0] = m[off + 0];
        newDst[1] = m[off + 1];
        return newDst;
    }
    /**
     * Sets an axis of a 3x3 matrix as a vector with 2 entries
     * @param m - The matrix.
     * @param v - the axis vector
     * @param axis - The axis  0 = x, 1 = y;
     * @param dst - The matrix to set. If not passed a new one is created.
     * @returns The matrix with axis set.
     */
    function setAxis(m, v, axis, dst) {
        const newDst = (dst === m ? m : copy(m, dst));
        const off = axis * 4;
        newDst[off + 0] = v[0];
        newDst[off + 1] = v[1];
        return newDst;
    }
    /**
     * Returns the "2d" scaling component of the matrix
     * @param m - The Matrix
     * @param dst - The vector to set. If not passed a new one is created.
     */
    function getScaling(m, dst) {
        const newDst = (dst ?? vec2.create());
        const xx = m[0];
        const xy = m[1];
        const yx = m[4];
        const yy = m[5];
        newDst[0] = Math.sqrt(xx * xx + xy * xy);
        newDst[1] = Math.sqrt(yx * yx + yy * yy);
        return newDst;
    }
    /**
     * Returns the "3d" scaling component of the matrix
     * @param m - The Matrix
     * @param dst - The vector to set. If not passed a new one is created.
     */
    function get3DScaling(m, dst) {
        const newDst = (dst ?? vec3.create());
        const xx = m[0];
        const xy = m[1];
        const xz = m[2];
        const yx = m[4];
        const yy = m[5];
        const yz = m[6];
        const zx = m[8];
        const zy = m[9];
        const zz = m[10];
        newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
        newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
        newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which translates by the given vector v.
     * @param v - The vector by which to translate.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The translation matrix.
     */
    function translation(v, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[8] = v[0];
        newDst[9] = v[1];
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Translates the given 3-by-3 matrix by the given vector v.
     * @param m - The matrix.
     * @param v - The vector by which to translate.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The translated matrix.
     */
    function translate(m, v, dst) {
        const newDst = (dst ?? new Ctor(12));
        const v0 = v[0];
        const v1 = v[1];
        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        if (m !== newDst) {
            newDst[0] = m00;
            newDst[1] = m01;
            newDst[2] = m02;
            newDst[4] = m10;
            newDst[5] = m11;
            newDst[6] = m12;
        }
        newDst[8] = m00 * v0 + m10 * v1 + m20;
        newDst[9] = m01 * v0 + m11 * v1 + m21;
        newDst[10] = m02 * v0 + m12 * v1 + m22;
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which rotates  by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotation(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(12));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c;
        newDst[1] = s;
        newDst[2] = 0;
        newDst[4] = -s;
        newDst[5] = c;
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Rotates the given 3-by-3 matrix  by the given angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotate(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(12));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c * m00 + s * m10;
        newDst[1] = c * m01 + s * m11;
        newDst[2] = c * m02 + s * m12;
        newDst[4] = c * m10 - s * m00;
        newDst[5] = c * m11 - s * m01;
        newDst[6] = c * m12 - s * m02;
        if (m !== newDst) {
            newDst[8] = m[8];
            newDst[9] = m[9];
            newDst[10] = m[10];
        }
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which rotates around the x-axis by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotationX(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(12));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = c;
        newDst[6] = s;
        newDst[8] = 0;
        newDst[9] = -s;
        newDst[10] = c;
        return newDst;
    }
    /**
     * Rotates the given 3-by-3 matrix around the x-axis by the given
     * angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotateX(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(12));
        const m10 = m[4];
        const m11 = m[5];
        const m12 = m[6];
        const m20 = m[8];
        const m21 = m[9];
        const m22 = m[10];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[4] = c * m10 + s * m20;
        newDst[5] = c * m11 + s * m21;
        newDst[6] = c * m12 + s * m22;
        newDst[8] = c * m20 - s * m10;
        newDst[9] = c * m21 - s * m11;
        newDst[10] = c * m22 - s * m12;
        if (m !== newDst) {
            newDst[0] = m[0];
            newDst[1] = m[1];
            newDst[2] = m[2];
        }
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which rotates around the y-axis by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotationY(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(12));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c;
        newDst[1] = 0;
        newDst[2] = -s;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[8] = s;
        newDst[9] = 0;
        newDst[10] = c;
        return newDst;
    }
    /**
     * Rotates the given 3-by-3 matrix around the y-axis by the given
     * angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotateY(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(12));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c * m00 - s * m20;
        newDst[1] = c * m01 - s * m21;
        newDst[2] = c * m02 - s * m22;
        newDst[8] = c * m20 + s * m00;
        newDst[9] = c * m21 + s * m01;
        newDst[10] = c * m22 + s * m02;
        if (m !== newDst) {
            newDst[4] = m[4];
            newDst[5] = m[5];
            newDst[6] = m[6];
        }
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which rotates around the z-axis by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    const rotationZ = rotation;
    /**
     * Rotates the given 3-by-3 matrix around the z-axis by the given
     * angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    const rotateZ = rotate;
    /**
     * Creates a 3-by-3 matrix which scales in each dimension by an amount given by
     * the corresponding entry in the given vector; assumes the vector has two
     * entries.
     * @param v - A vector of
     *     2 entries specifying the factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function scaling(v, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = v[0];
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = v[1];
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Scales the given 3-by-3 matrix in each dimension by an amount
     * given by the corresponding entry in the given vector; assumes the vector has
     * two entries.
     * @param m - The matrix to be modified.
     * @param v - A vector of 2 entries specifying the
     *     factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function scale(m, v, dst) {
        const newDst = (dst ?? new Ctor(12));
        const v0 = v[0];
        const v1 = v[1];
        newDst[0] = v0 * m[0 * 4 + 0];
        newDst[1] = v0 * m[0 * 4 + 1];
        newDst[2] = v0 * m[0 * 4 + 2];
        newDst[4] = v1 * m[1 * 4 + 0];
        newDst[5] = v1 * m[1 * 4 + 1];
        newDst[6] = v1 * m[1 * 4 + 2];
        if (m !== newDst) {
            newDst[8] = m[8];
            newDst[9] = m[9];
            newDst[10] = m[10];
        }
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which scales in each dimension by an amount given by
     * the corresponding entry in the given vector; assumes the vector has three
     * entries.
     * @param v - A vector of
     *     3 entries specifying the factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function scaling3D(v, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = v[0];
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = v[1];
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = v[2];
        return newDst;
    }
    /**
     * Scales the given 3-by-3 matrix in each dimension by an amount
     * given by the corresponding entry in the given vector; assumes the vector has
     * three entries.
     * @param m - The matrix to be modified.
     * @param v - A vector of 3 entries specifying the
     *     factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function scale3D(m, v, dst) {
        const newDst = (dst ?? new Ctor(12));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        newDst[0] = v0 * m[0 * 4 + 0];
        newDst[1] = v0 * m[0 * 4 + 1];
        newDst[2] = v0 * m[0 * 4 + 2];
        newDst[4] = v1 * m[1 * 4 + 0];
        newDst[5] = v1 * m[1 * 4 + 1];
        newDst[6] = v1 * m[1 * 4 + 2];
        newDst[8] = v2 * m[2 * 4 + 0];
        newDst[9] = v2 * m[2 * 4 + 1];
        newDst[10] = v2 * m[2 * 4 + 2];
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which scales uniformly in the X and Y dimensions
     * @param s - Amount to scale
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function uniformScaling(s, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = s;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = s;
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Scales the given 3-by-3 matrix in the X and Y dimension by an amount
     * given.
     * @param m - The matrix to be modified.
     * @param s - Amount to scale.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function uniformScale(m, s, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = s * m[0 * 4 + 0];
        newDst[1] = s * m[0 * 4 + 1];
        newDst[2] = s * m[0 * 4 + 2];
        newDst[4] = s * m[1 * 4 + 0];
        newDst[5] = s * m[1 * 4 + 1];
        newDst[6] = s * m[1 * 4 + 2];
        if (m !== newDst) {
            newDst[8] = m[8];
            newDst[9] = m[9];
            newDst[10] = m[10];
        }
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which scales uniformly in each dimension
     * @param s - Amount to scale
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function uniformScaling3D(s, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = s;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = s;
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = s;
        return newDst;
    }
    /**
     * Scales the given 3-by-3 matrix in each dimension by an amount
     * given.
     * @param m - The matrix to be modified.
     * @param s - Amount to scale.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function uniformScale3D(m, s, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = s * m[0 * 4 + 0];
        newDst[1] = s * m[0 * 4 + 1];
        newDst[2] = s * m[0 * 4 + 2];
        newDst[4] = s * m[1 * 4 + 0];
        newDst[5] = s * m[1 * 4 + 1];
        newDst[6] = s * m[1 * 4 + 2];
        newDst[8] = s * m[2 * 4 + 0];
        newDst[9] = s * m[2 * 4 + 1];
        newDst[10] = s * m[2 * 4 + 2];
        return newDst;
    }
    return {
        clone,
        create,
        set,
        fromMat4,
        fromQuat,
        negate,
        copy,
        equalsApproximately,
        equals,
        identity,
        transpose,
        inverse,
        invert,
        determinant,
        mul,
        multiply,
        setTranslation,
        getTranslation,
        getAxis,
        setAxis,
        getScaling,
        get3DScaling,
        translation,
        translate,
        rotation,
        rotate,
        rotationX,
        rotateX,
        rotationY,
        rotateY,
        rotationZ,
        rotateZ,
        scaling,
        scale,
        uniformScaling,
        uniformScale,
        scaling3D,
        scale3D,
        uniformScaling3D,
        uniformScale3D,
    };
}
const cache$3 = new Map();
function getAPI$3(Ctor) {
    let api = cache$3.get(Ctor);
    if (!api) {
        api = getAPIImpl$3(Ctor);
        cache$3.set(Ctor, api);
    }
    return api;
}

/**
 * Generates a typed API for Mat4
 * */
function getAPIImpl$2(Ctor) {
    const vec3 = getAPI$4(Ctor);
    /**
     * 4x4 Matrix math math functions.
     *
     * Almost all functions take an optional `newDst` argument. If it is not passed in the
     * functions will create a new matrix. In other words you can do this
     *
     *     const mat = mat4.translation([1, 2, 3]);  // Creates a new translation matrix
     *
     * or
     *
     *     const mat = mat4.create();
     *     mat4.translation([1, 2, 3], mat);  // Puts translation matrix in mat.
     *
     * The first style is often easier but depending on where it's used it generates garbage where
     * as there is almost never allocation with the second style.
     *
     * It is always save to pass any matrix as the destination. So for example
     *
     *     const mat = mat4.identity();
     *     const trans = mat4.translation([1, 2, 3]);
     *     mat4.multiply(mat, trans, mat);  // Multiplies mat * trans and puts result in mat.
     *
     */
    /**
     * Create a Mat4 from values
     *
     * Note: Since passing in a raw JavaScript array
     * is valid in all circumstances, if you want to
     * force a JavaScript array into a Mat4's specified type
     * it would be faster to use
     *
     * ```
     * const m = mat4.clone(someJSArray);
     * ```
     *
     * @param v0 - value for element 0
     * @param v1 - value for element 1
     * @param v2 - value for element 2
     * @param v3 - value for element 3
     * @param v4 - value for element 4
     * @param v5 - value for element 5
     * @param v6 - value for element 6
     * @param v7 - value for element 7
     * @param v8 - value for element 8
     * @param v9 - value for element 9
     * @param v10 - value for element 10
     * @param v11 - value for element 11
     * @param v12 - value for element 12
     * @param v13 - value for element 13
     * @param v14 - value for element 14
     * @param v15 - value for element 15
     * @returns created from values.
     */
    function create(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15) {
        const newDst = new Ctor(16);
        if (v0 !== undefined) {
            newDst[0] = v0;
            if (v1 !== undefined) {
                newDst[1] = v1;
                if (v2 !== undefined) {
                    newDst[2] = v2;
                    if (v3 !== undefined) {
                        newDst[3] = v3;
                        if (v4 !== undefined) {
                            newDst[4] = v4;
                            if (v5 !== undefined) {
                                newDst[5] = v5;
                                if (v6 !== undefined) {
                                    newDst[6] = v6;
                                    if (v7 !== undefined) {
                                        newDst[7] = v7;
                                        if (v8 !== undefined) {
                                            newDst[8] = v8;
                                            if (v9 !== undefined) {
                                                newDst[9] = v9;
                                                if (v10 !== undefined) {
                                                    newDst[10] = v10;
                                                    if (v11 !== undefined) {
                                                        newDst[11] = v11;
                                                        if (v12 !== undefined) {
                                                            newDst[12] = v12;
                                                            if (v13 !== undefined) {
                                                                newDst[13] = v13;
                                                                if (v14 !== undefined) {
                                                                    newDst[14] = v14;
                                                                    if (v15 !== undefined) {
                                                                        newDst[15] = v15;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return newDst;
    }
    /**
     * Sets the values of a Mat4
     * Also see {@link mat4.create} and {@link mat4.copy}
     *
     * @param v0 - value for element 0
     * @param v1 - value for element 1
     * @param v2 - value for element 2
     * @param v3 - value for element 3
     * @param v4 - value for element 4
     * @param v5 - value for element 5
     * @param v6 - value for element 6
     * @param v7 - value for element 7
     * @param v8 - value for element 8
     * @param v9 - value for element 9
     * @param v10 - value for element 10
     * @param v11 - value for element 11
     * @param v12 - value for element 12
     * @param v13 - value for element 13
     * @param v14 - value for element 14
     * @param v15 - value for element 15
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat4 created from values.
     */
    function set(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = v0;
        newDst[1] = v1;
        newDst[2] = v2;
        newDst[3] = v3;
        newDst[4] = v4;
        newDst[5] = v5;
        newDst[6] = v6;
        newDst[7] = v7;
        newDst[8] = v8;
        newDst[9] = v9;
        newDst[10] = v10;
        newDst[11] = v11;
        newDst[12] = v12;
        newDst[13] = v13;
        newDst[14] = v14;
        newDst[15] = v15;
        return newDst;
    }
    /**
     * Creates a Mat4 from a Mat3
     * @param m3 - source matrix
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat4 made from m3
     */
    function fromMat3(m3, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = m3[0];
        newDst[1] = m3[1];
        newDst[2] = m3[2];
        newDst[3] = 0;
        newDst[4] = m3[4];
        newDst[5] = m3[5];
        newDst[6] = m3[6];
        newDst[7] = 0;
        newDst[8] = m3[8];
        newDst[9] = m3[9];
        newDst[10] = m3[10];
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Creates a Mat4 rotation matrix from a quaternion
     * @param q - quaternion to create matrix from
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat4 made from q
     */
    function fromQuat(q, dst) {
        const newDst = (dst ?? new Ctor(16));
        const x = q[0];
        const y = q[1];
        const z = q[2];
        const w = q[3];
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        newDst[0] = 1 - yy - zz;
        newDst[1] = yx + wz;
        newDst[2] = zx - wy;
        newDst[3] = 0;
        newDst[4] = yx - wz;
        newDst[5] = 1 - xx - zz;
        newDst[6] = zy + wx;
        newDst[7] = 0;
        newDst[8] = zx + wy;
        newDst[9] = zy - wx;
        newDst[10] = 1 - xx - yy;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Negates a matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns -m.
     */
    function negate(m, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = -m[0];
        newDst[1] = -m[1];
        newDst[2] = -m[2];
        newDst[3] = -m[3];
        newDst[4] = -m[4];
        newDst[5] = -m[5];
        newDst[6] = -m[6];
        newDst[7] = -m[7];
        newDst[8] = -m[8];
        newDst[9] = -m[9];
        newDst[10] = -m[10];
        newDst[11] = -m[11];
        newDst[12] = -m[12];
        newDst[13] = -m[13];
        newDst[14] = -m[14];
        newDst[15] = -m[15];
        return newDst;
    }
    /**
     * Copies a matrix. (same as {@link mat4.clone})
     * Also see {@link mat4.create} and {@link mat4.set}
     * @param m - The matrix.
     * @param dst - The matrix. If not passed a new one is created.
     * @returns A copy of m.
     */
    function copy(m, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = m[0];
        newDst[1] = m[1];
        newDst[2] = m[2];
        newDst[3] = m[3];
        newDst[4] = m[4];
        newDst[5] = m[5];
        newDst[6] = m[6];
        newDst[7] = m[7];
        newDst[8] = m[8];
        newDst[9] = m[9];
        newDst[10] = m[10];
        newDst[11] = m[11];
        newDst[12] = m[12];
        newDst[13] = m[13];
        newDst[14] = m[14];
        newDst[15] = m[15];
        return newDst;
    }
    /**
     * Copies a matrix (same as {@link mat4.copy})
     * Also see {@link mat4.create} and {@link mat4.set}
     * @param m - The matrix.
     * @param dst - The matrix. If not passed a new one is created.
     * @returns A copy of m.
     */
    const clone = copy;
    /**
     * Check if 2 matrices are approximately equal
     * @param a - Operand matrix.
     * @param b - Operand matrix.
     * @returns true if matrices are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON &&
            Math.abs(a[3] - b[3]) < EPSILON &&
            Math.abs(a[4] - b[4]) < EPSILON &&
            Math.abs(a[5] - b[5]) < EPSILON &&
            Math.abs(a[6] - b[6]) < EPSILON &&
            Math.abs(a[7] - b[7]) < EPSILON &&
            Math.abs(a[8] - b[8]) < EPSILON &&
            Math.abs(a[9] - b[9]) < EPSILON &&
            Math.abs(a[10] - b[10]) < EPSILON &&
            Math.abs(a[11] - b[11]) < EPSILON &&
            Math.abs(a[12] - b[12]) < EPSILON &&
            Math.abs(a[13] - b[13]) < EPSILON &&
            Math.abs(a[14] - b[14]) < EPSILON &&
            Math.abs(a[15] - b[15]) < EPSILON;
    }
    /**
     * Check if 2 matrices are exactly equal
     * @param a - Operand matrix.
     * @param b - Operand matrix.
     * @returns true if matrices are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] &&
            a[1] === b[1] &&
            a[2] === b[2] &&
            a[3] === b[3] &&
            a[4] === b[4] &&
            a[5] === b[5] &&
            a[6] === b[6] &&
            a[7] === b[7] &&
            a[8] === b[8] &&
            a[9] === b[9] &&
            a[10] === b[10] &&
            a[11] === b[11] &&
            a[12] === b[12] &&
            a[13] === b[13] &&
            a[14] === b[14] &&
            a[15] === b[15];
    }
    /**
     * Creates a 4-by-4 identity matrix.
     *
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns A 4-by-4 identity matrix.
     */
    function identity(dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Takes the transpose of a matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The transpose of m.
     */
    function transpose(m, dst) {
        const newDst = (dst ?? new Ctor(16));
        if (newDst === m) {
            let t;
            t = m[1];
            m[1] = m[4];
            m[4] = t;
            t = m[2];
            m[2] = m[8];
            m[8] = t;
            t = m[3];
            m[3] = m[12];
            m[12] = t;
            t = m[6];
            m[6] = m[9];
            m[9] = t;
            t = m[7];
            m[7] = m[13];
            m[13] = t;
            t = m[11];
            m[11] = m[14];
            m[14] = t;
            return newDst;
        }
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        newDst[0] = m00;
        newDst[1] = m10;
        newDst[2] = m20;
        newDst[3] = m30;
        newDst[4] = m01;
        newDst[5] = m11;
        newDst[6] = m21;
        newDst[7] = m31;
        newDst[8] = m02;
        newDst[9] = m12;
        newDst[10] = m22;
        newDst[11] = m32;
        newDst[12] = m03;
        newDst[13] = m13;
        newDst[14] = m23;
        newDst[15] = m33;
        return newDst;
    }
    /**
     * Computes the inverse of a 4-by-4 matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The inverse of m.
     */
    function inverse(m, dst) {
        const newDst = (dst ?? new Ctor(16));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        const tmp0 = m22 * m33;
        const tmp1 = m32 * m23;
        const tmp2 = m12 * m33;
        const tmp3 = m32 * m13;
        const tmp4 = m12 * m23;
        const tmp5 = m22 * m13;
        const tmp6 = m02 * m33;
        const tmp7 = m32 * m03;
        const tmp8 = m02 * m23;
        const tmp9 = m22 * m03;
        const tmp10 = m02 * m13;
        const tmp11 = m12 * m03;
        const tmp12 = m20 * m31;
        const tmp13 = m30 * m21;
        const tmp14 = m10 * m31;
        const tmp15 = m30 * m11;
        const tmp16 = m10 * m21;
        const tmp17 = m20 * m11;
        const tmp18 = m00 * m31;
        const tmp19 = m30 * m01;
        const tmp20 = m00 * m21;
        const tmp21 = m20 * m01;
        const tmp22 = m00 * m11;
        const tmp23 = m10 * m01;
        const t0 = (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
            (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
        const t1 = (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
            (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
        const t2 = (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
            (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
        const t3 = (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
            (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
        const d = 1 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
        newDst[0] = d * t0;
        newDst[1] = d * t1;
        newDst[2] = d * t2;
        newDst[3] = d * t3;
        newDst[4] = d * ((tmp1 * m10 + tmp2 * m20 + tmp5 * m30) -
            (tmp0 * m10 + tmp3 * m20 + tmp4 * m30));
        newDst[5] = d * ((tmp0 * m00 + tmp7 * m20 + tmp8 * m30) -
            (tmp1 * m00 + tmp6 * m20 + tmp9 * m30));
        newDst[6] = d * ((tmp3 * m00 + tmp6 * m10 + tmp11 * m30) -
            (tmp2 * m00 + tmp7 * m10 + tmp10 * m30));
        newDst[7] = d * ((tmp4 * m00 + tmp9 * m10 + tmp10 * m20) -
            (tmp5 * m00 + tmp8 * m10 + tmp11 * m20));
        newDst[8] = d * ((tmp12 * m13 + tmp15 * m23 + tmp16 * m33) -
            (tmp13 * m13 + tmp14 * m23 + tmp17 * m33));
        newDst[9] = d * ((tmp13 * m03 + tmp18 * m23 + tmp21 * m33) -
            (tmp12 * m03 + tmp19 * m23 + tmp20 * m33));
        newDst[10] = d * ((tmp14 * m03 + tmp19 * m13 + tmp22 * m33) -
            (tmp15 * m03 + tmp18 * m13 + tmp23 * m33));
        newDst[11] = d * ((tmp17 * m03 + tmp20 * m13 + tmp23 * m23) -
            (tmp16 * m03 + tmp21 * m13 + tmp22 * m23));
        newDst[12] = d * ((tmp14 * m22 + tmp17 * m32 + tmp13 * m12) -
            (tmp16 * m32 + tmp12 * m12 + tmp15 * m22));
        newDst[13] = d * ((tmp20 * m32 + tmp12 * m02 + tmp19 * m22) -
            (tmp18 * m22 + tmp21 * m32 + tmp13 * m02));
        newDst[14] = d * ((tmp18 * m12 + tmp23 * m32 + tmp15 * m02) -
            (tmp22 * m32 + tmp14 * m02 + tmp19 * m12));
        newDst[15] = d * ((tmp22 * m22 + tmp16 * m02 + tmp21 * m12) -
            (tmp20 * m12 + tmp23 * m22 + tmp17 * m02));
        return newDst;
    }
    /**
     * Compute the determinant of a matrix
     * @param m - the matrix
     * @returns the determinant
     */
    function determinant(m) {
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        const tmp0 = m22 * m33;
        const tmp1 = m32 * m23;
        const tmp2 = m12 * m33;
        const tmp3 = m32 * m13;
        const tmp4 = m12 * m23;
        const tmp5 = m22 * m13;
        const tmp6 = m02 * m33;
        const tmp7 = m32 * m03;
        const tmp8 = m02 * m23;
        const tmp9 = m22 * m03;
        const tmp10 = m02 * m13;
        const tmp11 = m12 * m03;
        const t0 = (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
            (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
        const t1 = (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
            (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
        const t2 = (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
            (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
        const t3 = (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
            (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
        return m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3;
    }
    /**
     * Computes the inverse of a 4-by-4 matrix. (same as inverse)
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The inverse of m.
     */
    const invert = inverse;
    /**
     * Multiplies two 4-by-4 matrices with a on the left and b on the right
     * @param a - The matrix on the left.
     * @param b - The matrix on the right.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix product of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(16));
        const a00 = a[0];
        const a01 = a[1];
        const a02 = a[2];
        const a03 = a[3];
        const a10 = a[4 + 0];
        const a11 = a[4 + 1];
        const a12 = a[4 + 2];
        const a13 = a[4 + 3];
        const a20 = a[8 + 0];
        const a21 = a[8 + 1];
        const a22 = a[8 + 2];
        const a23 = a[8 + 3];
        const a30 = a[12 + 0];
        const a31 = a[12 + 1];
        const a32 = a[12 + 2];
        const a33 = a[12 + 3];
        const b00 = b[0];
        const b01 = b[1];
        const b02 = b[2];
        const b03 = b[3];
        const b10 = b[4 + 0];
        const b11 = b[4 + 1];
        const b12 = b[4 + 2];
        const b13 = b[4 + 3];
        const b20 = b[8 + 0];
        const b21 = b[8 + 1];
        const b22 = b[8 + 2];
        const b23 = b[8 + 3];
        const b30 = b[12 + 0];
        const b31 = b[12 + 1];
        const b32 = b[12 + 2];
        const b33 = b[12 + 3];
        newDst[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
        newDst[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
        newDst[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
        newDst[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
        newDst[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
        newDst[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
        newDst[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
        newDst[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
        newDst[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
        newDst[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
        newDst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
        newDst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
        newDst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
        newDst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
        newDst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
        newDst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
        return newDst;
    }
    /**
     * Multiplies two 4-by-4 matrices with a on the left and b on the right (same as multiply)
     * @param a - The matrix on the left.
     * @param b - The matrix on the right.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix product of a and b.
     */
    const mul = multiply;
    /**
     * Sets the translation component of a 4-by-4 matrix to the given
     * vector.
     * @param a - The matrix.
     * @param v - The vector.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix with translation set.
     */
    function setTranslation(a, v, dst) {
        const newDst = (dst ?? identity());
        if (a !== newDst) {
            newDst[0] = a[0];
            newDst[1] = a[1];
            newDst[2] = a[2];
            newDst[3] = a[3];
            newDst[4] = a[4];
            newDst[5] = a[5];
            newDst[6] = a[6];
            newDst[7] = a[7];
            newDst[8] = a[8];
            newDst[9] = a[9];
            newDst[10] = a[10];
            newDst[11] = a[11];
        }
        newDst[12] = v[0];
        newDst[13] = v[1];
        newDst[14] = v[2];
        newDst[15] = 1;
        return newDst;
    }
    ///**
    // * Returns the translation component of a 4-by-4 matrix as a vector with 3
    // * entries.
    // * @param m - The matrix.
    // * @param dst - vector to hold result. If not passed a new one is created.
    // * @returns The translation component of m.
    // */
    function getTranslation(m, dst) {
        const newDst = (dst ?? vec3.create());
        newDst[0] = m[12];
        newDst[1] = m[13];
        newDst[2] = m[14];
        return newDst;
    }
    /**
     * Returns an axis of a 4x4 matrix as a vector with 3 entries
     * @param m - The matrix.
     * @param axis - The axis 0 = x, 1 = y, 2 = z;
     * @returns The axis component of m.
     */
    function getAxis(m, axis, dst) {
        const newDst = (dst ?? vec3.create());
        const off = axis * 4;
        newDst[0] = m[off + 0];
        newDst[1] = m[off + 1];
        newDst[2] = m[off + 2];
        return newDst;
    }
    /**
     * Sets an axis of a 4x4 matrix as a vector with 3 entries
     * @param m - The matrix.
     * @param v - the axis vector
     * @param axis - The axis  0 = x, 1 = y, 2 = z;
     * @param dst - The matrix to set. If not passed a new one is created.
     * @returns The matrix with axis set.
     */
    function setAxis(m, v, axis, dst) {
        const newDst = (dst === m) ? dst : copy(m, dst);
        const off = axis * 4;
        newDst[off + 0] = v[0];
        newDst[off + 1] = v[1];
        newDst[off + 2] = v[2];
        return newDst;
    }
    /**
     * Returns the "3d" scaling component of the matrix
     * @param m - The Matrix
     * @param dst - The vector to set. If not passed a new one is created.
     */
    function getScaling(m, dst) {
        const newDst = (dst ?? vec3.create());
        const xx = m[0];
        const xy = m[1];
        const xz = m[2];
        const yx = m[4];
        const yy = m[5];
        const yz = m[6];
        const zx = m[8];
        const zy = m[9];
        const zz = m[10];
        newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
        newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
        newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
        return newDst;
    }
    /**
     * Computes a 4-by-4 perspective transformation matrix given the angular height
     * of the frustum, the aspect ratio, and the near and far clipping planes.  The
     * arguments define a frustum extending in the negative z direction.  The given
     * angle is the vertical angle of the frustum, and the horizontal angle is
     * determined to produce the given aspect ratio.  The arguments near and far are
     * the distances to the near and far clipping planes.  Note that near and far
     * are not z coordinates, but rather they are distances along the negative
     * z-axis.  The matrix generated sends the viewing frustum to the unit box.
     * We assume a unit box extending from -1 to 1 in the x and y dimensions and
     * from 0 to 1 in the z dimension.
     *
     * Note: If you pass `Infinity` for zFar then it will produce a projection matrix
     * returns -Infinity for Z when transforming coordinates with Z <= 0 and +Infinity for Z
     * otherwise.
     *
     * @param fieldOfViewYInRadians - The camera angle from top to bottom (in radians).
     * @param aspect - The aspect ratio width / height.
     * @param zNear - The depth (negative z coordinate)
     *     of the near clipping plane.
     * @param zFar - The depth (negative z coordinate)
     *     of the far clipping plane.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The perspective matrix.
     */
    function perspective(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
        const newDst = (dst ?? new Ctor(16));
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
        newDst[0] = f / aspect;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = f;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[11] = -1;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[15] = 0;
        if (Number.isFinite(zFar)) {
            const rangeInv = 1 / (zNear - zFar);
            newDst[10] = zFar * rangeInv;
            newDst[14] = zFar * zNear * rangeInv;
        }
        else {
            newDst[10] = -1;
            newDst[14] = -zNear;
        }
        return newDst;
    }
    /**
     * Computes a 4-by-4 reverse-z perspective transformation matrix given the angular height
     * of the frustum, the aspect ratio, and the near and far clipping planes.  The
     * arguments define a frustum extending in the negative z direction.  The given
     * angle is the vertical angle of the frustum, and the horizontal angle is
     * determined to produce the given aspect ratio.  The arguments near and far are
     * the distances to the near and far clipping planes.  Note that near and far
     * are not z coordinates, but rather they are distances along the negative
     * z-axis.  The matrix generated sends the viewing frustum to the unit box.
     * We assume a unit box extending from -1 to 1 in the x and y dimensions and
     * from 1 (at -zNear) to 0 (at -zFar) in the z dimension.
     *
     * @param fieldOfViewYInRadians - The camera angle from top to bottom (in radians).
     * @param aspect - The aspect ratio width / height.
     * @param zNear - The depth (negative z coordinate)
     *     of the near clipping plane.
     * @param zFar - The depth (negative z coordinate)
     *     of the far clipping plane. (default = Infinity)
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The perspective matrix.
     */ function perspectiveReverseZ(fieldOfViewYInRadians, aspect, zNear, zFar = Infinity, dst) {
        const newDst = (dst ?? new Ctor(16));
        const f = 1 / Math.tan(fieldOfViewYInRadians * 0.5);
        newDst[0] = f / aspect;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = f;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[11] = -1;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[15] = 0;
        if (zFar === Infinity) {
            newDst[10] = 0;
            newDst[14] = zNear;
        }
        else {
            const rangeInv = 1 / (zFar - zNear);
            newDst[10] = zNear * rangeInv;
            newDst[14] = zFar * zNear * rangeInv;
        }
        return newDst;
    }
    /**
     * Computes a 4-by-4 orthogonal transformation matrix that transforms from
     * the given the left, right, bottom, and top dimensions to -1 +1 in x, and y
     * and 0 to +1 in z.
     * @param left - Left side of the near clipping plane viewport.
     * @param right - Right side of the near clipping plane viewport.
     * @param bottom - Bottom of the near clipping plane viewport.
     * @param top - Top of the near clipping plane viewport.
     * @param near - The depth (negative z coordinate)
     *     of the near clipping plane.
     * @param far - The depth (negative z coordinate)
     *     of the far clipping plane.
     * @param dst - Output matrix. If not passed a new one is created.
     * @returns The orthographic projection matrix.
     */
    function ortho(left, right, bottom, top, near, far, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = 2 / (right - left);
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 2 / (top - bottom);
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1 / (near - far);
        newDst[11] = 0;
        newDst[12] = (right + left) / (left - right);
        newDst[13] = (top + bottom) / (bottom - top);
        newDst[14] = near / (near - far);
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Computes a 4-by-4 perspective transformation matrix given the left, right,
     * top, bottom, near and far clipping planes. The arguments define a frustum
     * extending in the negative z direction. The arguments near and far are the
     * distances to the near and far clipping planes. Note that near and far are not
     * z coordinates, but rather they are distances along the negative z-axis. The
     * matrix generated sends the viewing frustum to the unit box. We assume a unit
     * box extending from -1 to 1 in the x and y dimensions and from 0 to 1 in the z
     * dimension.
     * @param left - The x coordinate of the left plane of the box.
     * @param right - The x coordinate of the right plane of the box.
     * @param bottom - The y coordinate of the bottom plane of the box.
     * @param top - The y coordinate of the right plane of the box.
     * @param near - The negative z coordinate of the near plane of the box.
     * @param far - The negative z coordinate of the far plane of the box.
     * @param dst - Output matrix. If not passed a new one is created.
     * @returns The perspective projection matrix.
     */
    function frustum(left, right, bottom, top, near, far, dst) {
        const newDst = (dst ?? new Ctor(16));
        const dx = (right - left);
        const dy = (top - bottom);
        const dz = (near - far);
        newDst[0] = 2 * near / dx;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 2 * near / dy;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = (left + right) / dx;
        newDst[9] = (top + bottom) / dy;
        newDst[10] = far / dz;
        newDst[11] = -1;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = near * far / dz;
        newDst[15] = 0;
        return newDst;
    }
    /**
     * Computes a 4-by-4 reverse-z perspective transformation matrix given the left, right,
     * top, bottom, near and far clipping planes. The arguments define a frustum
     * extending in the negative z direction. The arguments near and far are the
     * distances to the near and far clipping planes. Note that near and far are not
     * z coordinates, but rather they are distances along the negative z-axis. The
     * matrix generated sends the viewing frustum to the unit box. We assume a unit
     * box extending from -1 to 1 in the x and y dimensions and from 1 (-near) to 0 (-far) in the z
     * dimension.
     * @param left - The x coordinate of the left plane of the box.
     * @param right - The x coordinate of the right plane of the box.
     * @param bottom - The y coordinate of the bottom plane of the box.
     * @param top - The y coordinate of the right plane of the box.
     * @param near - The negative z coordinate of the near plane of the box.
     * @param far - The negative z coordinate of the far plane of the box.
     * @param dst - Output matrix. If not passed a new one is created.
     * @returns The perspective projection matrix.
     */
    function frustumReverseZ(left, right, bottom, top, near, far = Infinity, dst) {
        const newDst = (dst ?? new Ctor(16));
        const dx = (right - left);
        const dy = (top - bottom);
        newDst[0] = 2 * near / dx;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 2 * near / dy;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = (left + right) / dx;
        newDst[9] = (top + bottom) / dy;
        newDst[11] = -1;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[15] = 0;
        if (far === Infinity) {
            newDst[10] = 0;
            newDst[14] = near;
        }
        else {
            const rangeInv = 1 / (far - near);
            newDst[10] = near * rangeInv;
            newDst[14] = far * near * rangeInv;
        }
        return newDst;
    }
    const xAxis = vec3.create();
    const yAxis = vec3.create();
    const zAxis = vec3.create();
    /**
     * Computes a 4-by-4 aim transformation.
     *
     * This is a matrix which positions an object aiming down positive Z.
     * toward the target.
     *
     * Note: this is **NOT** the inverse of lookAt as lookAt looks at negative Z.
     *
     * @param position - The position of the object.
     * @param target - The position meant to be aimed at.
     * @param up - A vector pointing up.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The aim matrix.
     */
    function aim(position, target, up, dst) {
        const newDst = (dst ?? new Ctor(16));
        vec3.normalize(vec3.subtract(target, position, zAxis), zAxis);
        vec3.normalize(vec3.cross(up, zAxis, xAxis), xAxis);
        vec3.normalize(vec3.cross(zAxis, xAxis, yAxis), yAxis);
        newDst[0] = xAxis[0];
        newDst[1] = xAxis[1];
        newDst[2] = xAxis[2];
        newDst[3] = 0;
        newDst[4] = yAxis[0];
        newDst[5] = yAxis[1];
        newDst[6] = yAxis[2];
        newDst[7] = 0;
        newDst[8] = zAxis[0];
        newDst[9] = zAxis[1];
        newDst[10] = zAxis[2];
        newDst[11] = 0;
        newDst[12] = position[0];
        newDst[13] = position[1];
        newDst[14] = position[2];
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Computes a 4-by-4 camera aim transformation.
     *
     * This is a matrix which positions an object aiming down negative Z.
     * toward the target.
     *
     * Note: this is the inverse of `lookAt`
     *
     * @param eye - The position of the object.
     * @param target - The position meant to be aimed at.
     * @param up - A vector pointing up.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The aim matrix.
     */
    function cameraAim(eye, target, up, dst) {
        const newDst = (dst ?? new Ctor(16));
        vec3.normalize(vec3.subtract(eye, target, zAxis), zAxis);
        vec3.normalize(vec3.cross(up, zAxis, xAxis), xAxis);
        vec3.normalize(vec3.cross(zAxis, xAxis, yAxis), yAxis);
        newDst[0] = xAxis[0];
        newDst[1] = xAxis[1];
        newDst[2] = xAxis[2];
        newDst[3] = 0;
        newDst[4] = yAxis[0];
        newDst[5] = yAxis[1];
        newDst[6] = yAxis[2];
        newDst[7] = 0;
        newDst[8] = zAxis[0];
        newDst[9] = zAxis[1];
        newDst[10] = zAxis[2];
        newDst[11] = 0;
        newDst[12] = eye[0];
        newDst[13] = eye[1];
        newDst[14] = eye[2];
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Computes a 4-by-4 view transformation.
     *
     * This is a view matrix which transforms all other objects
     * to be in the space of the view defined by the parameters.
     *
     * @param eye - The position of the object.
     * @param target - The position meant to be aimed at.
     * @param up - A vector pointing up.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The look-at matrix.
     */
    function lookAt(eye, target, up, dst) {
        const newDst = (dst ?? new Ctor(16));
        vec3.normalize(vec3.subtract(eye, target, zAxis), zAxis);
        vec3.normalize(vec3.cross(up, zAxis, xAxis), xAxis);
        vec3.normalize(vec3.cross(zAxis, xAxis, yAxis), yAxis);
        newDst[0] = xAxis[0];
        newDst[1] = yAxis[0];
        newDst[2] = zAxis[0];
        newDst[3] = 0;
        newDst[4] = xAxis[1];
        newDst[5] = yAxis[1];
        newDst[6] = zAxis[1];
        newDst[7] = 0;
        newDst[8] = xAxis[2];
        newDst[9] = yAxis[2];
        newDst[10] = zAxis[2];
        newDst[11] = 0;
        newDst[12] = -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]);
        newDst[13] = -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]);
        newDst[14] = -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2]);
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which translates by the given vector v.
     * @param v - The vector by
     *     which to translate.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The translation matrix.
     */
    function translation(v, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        newDst[11] = 0;
        newDst[12] = v[0];
        newDst[13] = v[1];
        newDst[14] = v[2];
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Translates the given 4-by-4 matrix by the given vector v.
     * @param m - The matrix.
     * @param v - The vector by
     *     which to translate.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The translated matrix.
     */
    function translate(m, v, dst) {
        const newDst = (dst ?? new Ctor(16));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m03 = m[3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        if (m !== newDst) {
            newDst[0] = m00;
            newDst[1] = m01;
            newDst[2] = m02;
            newDst[3] = m03;
            newDst[4] = m10;
            newDst[5] = m11;
            newDst[6] = m12;
            newDst[7] = m13;
            newDst[8] = m20;
            newDst[9] = m21;
            newDst[10] = m22;
            newDst[11] = m23;
        }
        newDst[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
        newDst[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
        newDst[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
        newDst[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the x-axis by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotationX(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = c;
        newDst[6] = s;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = -s;
        newDst[10] = c;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Rotates the given 4-by-4 matrix around the x-axis by the given
     * angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotateX(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const m10 = m[4];
        const m11 = m[5];
        const m12 = m[6];
        const m13 = m[7];
        const m20 = m[8];
        const m21 = m[9];
        const m22 = m[10];
        const m23 = m[11];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[4] = c * m10 + s * m20;
        newDst[5] = c * m11 + s * m21;
        newDst[6] = c * m12 + s * m22;
        newDst[7] = c * m13 + s * m23;
        newDst[8] = c * m20 - s * m10;
        newDst[9] = c * m21 - s * m11;
        newDst[10] = c * m22 - s * m12;
        newDst[11] = c * m23 - s * m13;
        if (m !== newDst) {
            newDst[0] = m[0];
            newDst[1] = m[1];
            newDst[2] = m[2];
            newDst[3] = m[3];
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the y-axis by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotationY(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c;
        newDst[1] = 0;
        newDst[2] = -s;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = s;
        newDst[9] = 0;
        newDst[10] = c;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Rotates the given 4-by-4 matrix around the y-axis by the given
     * angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotateY(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c * m00 - s * m20;
        newDst[1] = c * m01 - s * m21;
        newDst[2] = c * m02 - s * m22;
        newDst[3] = c * m03 - s * m23;
        newDst[8] = c * m20 + s * m00;
        newDst[9] = c * m21 + s * m01;
        newDst[10] = c * m22 + s * m02;
        newDst[11] = c * m23 + s * m03;
        if (m !== newDst) {
            newDst[4] = m[4];
            newDst[5] = m[5];
            newDst[6] = m[6];
            newDst[7] = m[7];
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the z-axis by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotationZ(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c;
        newDst[1] = s;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = -s;
        newDst[5] = c;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Rotates the given 4-by-4 matrix around the z-axis by the given
     * angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotateZ(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c * m00 + s * m10;
        newDst[1] = c * m01 + s * m11;
        newDst[2] = c * m02 + s * m12;
        newDst[3] = c * m03 + s * m13;
        newDst[4] = c * m10 - s * m00;
        newDst[5] = c * m11 - s * m01;
        newDst[6] = c * m12 - s * m02;
        newDst[7] = c * m13 - s * m03;
        if (m !== newDst) {
            newDst[8] = m[8];
            newDst[9] = m[9];
            newDst[10] = m[10];
            newDst[11] = m[11];
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the given axis by the given
     * angle.
     * @param axis - The axis
     *     about which to rotate.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns A matrix which rotates angle radians
     *     around the axis.
     */
    function axisRotation(axis, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        const n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;
        const xx = x * x;
        const yy = y * y;
        const zz = z * z;
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        const oneMinusCosine = 1 - c;
        newDst[0] = xx + (1 - xx) * c;
        newDst[1] = x * y * oneMinusCosine + z * s;
        newDst[2] = x * z * oneMinusCosine - y * s;
        newDst[3] = 0;
        newDst[4] = x * y * oneMinusCosine - z * s;
        newDst[5] = yy + (1 - yy) * c;
        newDst[6] = y * z * oneMinusCosine + x * s;
        newDst[7] = 0;
        newDst[8] = x * z * oneMinusCosine + y * s;
        newDst[9] = y * z * oneMinusCosine - x * s;
        newDst[10] = zz + (1 - zz) * c;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the given axis by the given
     * angle. (same as axisRotation)
     * @param axis - The axis
     *     about which to rotate.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns A matrix which rotates angle radians
     *     around the axis.
     */
    const rotation = axisRotation;
    /**
     * Rotates the given 4-by-4 matrix around the given axis by the
     * given angle.
     * @param m - The matrix.
     * @param axis - The axis
     *     about which to rotate.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function axisRotate(m, axis, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        const n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;
        const xx = x * x;
        const yy = y * y;
        const zz = z * z;
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        const oneMinusCosine = 1 - c;
        const r00 = xx + (1 - xx) * c;
        const r01 = x * y * oneMinusCosine + z * s;
        const r02 = x * z * oneMinusCosine - y * s;
        const r10 = x * y * oneMinusCosine - z * s;
        const r11 = yy + (1 - yy) * c;
        const r12 = y * z * oneMinusCosine + x * s;
        const r20 = x * z * oneMinusCosine + y * s;
        const r21 = y * z * oneMinusCosine - x * s;
        const r22 = zz + (1 - zz) * c;
        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m03 = m[3];
        const m10 = m[4];
        const m11 = m[5];
        const m12 = m[6];
        const m13 = m[7];
        const m20 = m[8];
        const m21 = m[9];
        const m22 = m[10];
        const m23 = m[11];
        newDst[0] = r00 * m00 + r01 * m10 + r02 * m20;
        newDst[1] = r00 * m01 + r01 * m11 + r02 * m21;
        newDst[2] = r00 * m02 + r01 * m12 + r02 * m22;
        newDst[3] = r00 * m03 + r01 * m13 + r02 * m23;
        newDst[4] = r10 * m00 + r11 * m10 + r12 * m20;
        newDst[5] = r10 * m01 + r11 * m11 + r12 * m21;
        newDst[6] = r10 * m02 + r11 * m12 + r12 * m22;
        newDst[7] = r10 * m03 + r11 * m13 + r12 * m23;
        newDst[8] = r20 * m00 + r21 * m10 + r22 * m20;
        newDst[9] = r20 * m01 + r21 * m11 + r22 * m21;
        newDst[10] = r20 * m02 + r21 * m12 + r22 * m22;
        newDst[11] = r20 * m03 + r21 * m13 + r22 * m23;
        if (m !== newDst) {
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Rotates the given 4-by-4 matrix around the given axis by the
     * given angle. (same as rotate)
     * @param m - The matrix.
     * @param axis - The axis
     *     about which to rotate.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    const rotate = axisRotate;
    /**
     * Creates a 4-by-4 matrix which scales in each dimension by an amount given by
     * the corresponding entry in the given vector; assumes the vector has three
     * entries.
     * @param v - A vector of
     *     three entries specifying the factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function scaling(v, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = v[0];
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = v[1];
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = v[2];
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Scales the given 4-by-4 matrix in each dimension by an amount
     * given by the corresponding entry in the given vector; assumes the vector has
     * three entries.
     * @param m - The matrix to be modified.
     * @param v - A vector of three entries specifying the
     *     factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function scale(m, v, dst) {
        const newDst = (dst ?? new Ctor(16));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        newDst[0] = v0 * m[0 * 4 + 0];
        newDst[1] = v0 * m[0 * 4 + 1];
        newDst[2] = v0 * m[0 * 4 + 2];
        newDst[3] = v0 * m[0 * 4 + 3];
        newDst[4] = v1 * m[1 * 4 + 0];
        newDst[5] = v1 * m[1 * 4 + 1];
        newDst[6] = v1 * m[1 * 4 + 2];
        newDst[7] = v1 * m[1 * 4 + 3];
        newDst[8] = v2 * m[2 * 4 + 0];
        newDst[9] = v2 * m[2 * 4 + 1];
        newDst[10] = v2 * m[2 * 4 + 2];
        newDst[11] = v2 * m[2 * 4 + 3];
        if (m !== newDst) {
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which scales a uniform amount in each dimension.
     * @param s - the amount to scale
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function uniformScaling(s, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = s;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = s;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = s;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Scales the given 4-by-4 matrix in each dimension by a uniform scale.
     * @param m - The matrix to be modified.
     * @param s - The amount to scale.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function uniformScale(m, s, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = s * m[0 * 4 + 0];
        newDst[1] = s * m[0 * 4 + 1];
        newDst[2] = s * m[0 * 4 + 2];
        newDst[3] = s * m[0 * 4 + 3];
        newDst[4] = s * m[1 * 4 + 0];
        newDst[5] = s * m[1 * 4 + 1];
        newDst[6] = s * m[1 * 4 + 2];
        newDst[7] = s * m[1 * 4 + 3];
        newDst[8] = s * m[2 * 4 + 0];
        newDst[9] = s * m[2 * 4 + 1];
        newDst[10] = s * m[2 * 4 + 2];
        newDst[11] = s * m[2 * 4 + 3];
        if (m !== newDst) {
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    return {
        create,
        set,
        fromMat3,
        fromQuat,
        negate,
        copy,
        clone,
        equalsApproximately,
        equals,
        identity,
        transpose,
        inverse,
        determinant,
        invert,
        multiply,
        mul,
        setTranslation,
        getTranslation,
        getAxis,
        setAxis,
        getScaling,
        perspective,
        perspectiveReverseZ,
        ortho,
        frustum,
        frustumReverseZ,
        aim,
        cameraAim,
        lookAt,
        translation,
        translate,
        rotationX,
        rotateX,
        rotationY,
        rotateY,
        rotationZ,
        rotateZ,
        axisRotation,
        rotation,
        axisRotate,
        rotate,
        scaling,
        scale,
        uniformScaling,
        uniformScale,
    };
}
const cache$2 = new Map();
function getAPI$2(Ctor) {
    let api = cache$2.get(Ctor);
    if (!api) {
        api = getAPIImpl$2(Ctor);
        cache$2.set(Ctor, api);
    }
    return api;
}

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates am typed API for Qud
 * */
function getAPIImpl$1(Ctor) {
    const vec3 = getAPI$4(Ctor);
    /**
     * Creates a quat4; may be called with x, y, z to set initial values.
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @param w - Initial w value.
     * @returns the created vector
     */
    function create(x, y, z, w) {
        const newDst = new Ctor(4);
        if (x !== undefined) {
            newDst[0] = x;
            if (y !== undefined) {
                newDst[1] = y;
                if (z !== undefined) {
                    newDst[2] = z;
                    if (w !== undefined) {
                        newDst[3] = w;
                    }
                }
            }
        }
        return newDst;
    }
    /**
     * Creates a Quat; may be called with x, y, z to set initial values. (same as create)
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @param z - Initial w value.
     * @returns the created vector
     */
    const fromValues = create;
    /**
     * Sets the values of a Quat
     * Also see {@link quat.create} and {@link quat.copy}
     *
     * @param x first value
     * @param y second value
     * @param z third value
     * @param w fourth value
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector with its elements set.
     */
    function set(x, y, z, w, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = x;
        newDst[1] = y;
        newDst[2] = z;
        newDst[3] = w;
        return newDst;
    }
    /**
     * Sets a quaternion from the given angle and  axis,
     * then returns it.
     *
     * @param axis - the axis to rotate around
     * @param angleInRadians - the angle
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The quaternion that represents the given axis and angle
     **/
    function fromAxisAngle(axis, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(4));
        const halfAngle = angleInRadians * 0.5;
        const s = Math.sin(halfAngle);
        newDst[0] = s * axis[0];
        newDst[1] = s * axis[1];
        newDst[2] = s * axis[2];
        newDst[3] = Math.cos(halfAngle);
        return newDst;
    }
    /**
     * Gets the rotation axis and angle
     * @param q - quaternion to compute from
     * @param dst - Vec3 to hold result. If not passed in a new one is created.
     * @return angle and axis
     */
    function toAxisAngle(q, dst) {
        const newDst = (dst ?? vec3.create(3));
        const angle = Math.acos(q[3]) * 2;
        const s = Math.sin(angle * 0.5);
        if (s > EPSILON) {
            newDst[0] = q[0] / s;
            newDst[1] = q[1] / s;
            newDst[2] = q[2] / s;
        }
        else {
            newDst[0] = 1;
            newDst[1] = 0;
            newDst[2] = 0;
        }
        return { angle, axis: newDst };
    }
    /**
     * Returns the angle in degrees between two rotations a and b.
     * @param a - quaternion a
     * @param b - quaternion b
     * @return angle in radians between the two quaternions
     */
    function angle(a, b) {
        const d = dot(a, b);
        return Math.acos(2 * d * d - 1);
    }
    /**
     * Multiplies two quaternions
     *
     * @param a - the first quaternion
     * @param b - the second quaternion
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        const ax = a[0];
        const ay = a[1];
        const az = a[2];
        const aw = a[3];
        const bx = b[0];
        const by = b[1];
        const bz = b[2];
        const bw = b[3];
        newDst[0] = ax * bw + aw * bx + ay * bz - az * by;
        newDst[1] = ay * bw + aw * by + az * bx - ax * bz;
        newDst[2] = az * bw + aw * bz + ax * by - ay * bx;
        newDst[3] = aw * bw - ax * bx - ay * by - az * bz;
        return newDst;
    }
    /**
     * Multiplies two quaternions
     *
     * @param a - the first quaternion
     * @param b - the second quaternion
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    const mul = multiply;
    /**
     * Rotates the given quaternion around the X axis by the given angle.
     * @param q - quaternion to rotate
     * @param angleInRadians - The angle by which to rotate
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function rotateX(q, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(4));
        const halfAngle = angleInRadians * 0.5;
        const qx = q[0];
        const qy = q[1];
        const qz = q[2];
        const qw = q[3];
        const bx = Math.sin(halfAngle);
        const bw = Math.cos(halfAngle);
        newDst[0] = qx * bw + qw * bx;
        newDst[1] = qy * bw + qz * bx;
        newDst[2] = qz * bw - qy * bx;
        newDst[3] = qw * bw - qx * bx;
        return newDst;
    }
    /**
     * Rotates the given quaternion around the Y axis by the given angle.
     * @param q - quaternion to rotate
     * @param angleInRadians - The angle by which to rotate
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function rotateY(q, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(4));
        const halfAngle = angleInRadians * 0.5;
        const qx = q[0];
        const qy = q[1];
        const qz = q[2];
        const qw = q[3];
        const by = Math.sin(halfAngle);
        const bw = Math.cos(halfAngle);
        newDst[0] = qx * bw - qz * by;
        newDst[1] = qy * bw + qw * by;
        newDst[2] = qz * bw + qx * by;
        newDst[3] = qw * bw - qy * by;
        return newDst;
    }
    /**
     * Rotates the given quaternion around the Z axis by the given angle.
     * @param q - quaternion to rotate
     * @param angleInRadians - The angle by which to rotate
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function rotateZ(q, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(4));
        const halfAngle = angleInRadians * 0.5;
        const qx = q[0];
        const qy = q[1];
        const qz = q[2];
        const qw = q[3];
        const bz = Math.sin(halfAngle);
        const bw = Math.cos(halfAngle);
        newDst[0] = qx * bw + qy * bz;
        newDst[1] = qy * bw - qx * bz;
        newDst[2] = qz * bw + qw * bz;
        newDst[3] = qw * bw - qz * bz;
        return newDst;
    }
    /**
     * Spherically linear interpolate between two quaternions
     *
     * @param a - starting value
     * @param b - ending value
     * @param t - value where 0 = a and 1 = b
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function slerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        const ax = a[0];
        const ay = a[1];
        const az = a[2];
        const aw = a[3];
        let bx = b[0];
        let by = b[1];
        let bz = b[2];
        let bw = b[3];
        let cosOmega = ax * bx + ay * by + az * bz + aw * bw;
        if (cosOmega < 0) {
            cosOmega = -cosOmega;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        let scale0;
        let scale1;
        if (1.0 - cosOmega > EPSILON) {
            const omega = Math.acos(cosOmega);
            const sinOmega = Math.sin(omega);
            scale0 = Math.sin((1 - t) * omega) / sinOmega;
            scale1 = Math.sin(t * omega) / sinOmega;
        }
        else {
            scale0 = 1.0 - t;
            scale1 = t;
        }
        newDst[0] = scale0 * ax + scale1 * bx;
        newDst[1] = scale0 * ay + scale1 * by;
        newDst[2] = scale0 * az + scale1 * bz;
        newDst[3] = scale0 * aw + scale1 * bw;
        return newDst;
    }
    /**
     * Compute the inverse of a quaternion
     *
     * @param q - quaternion to compute the inverse of
     * @returns A quaternion that is the result of a * b
     */
    function inverse(q, dst) {
        const newDst = (dst ?? new Ctor(4));
        const a0 = q[0];
        const a1 = q[1];
        const a2 = q[2];
        const a3 = q[3];
        const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        const invDot = dot ? 1 / dot : 0;
        newDst[0] = -a0 * invDot;
        newDst[1] = -a1 * invDot;
        newDst[2] = -a2 * invDot;
        newDst[3] = a3 * invDot;
        return newDst;
    }
    /**
     * Compute the conjugate of a quaternion
     * For quaternions with a magnitude of 1 (a unit quaternion)
     * this returns the same as the inverse but is faster to calculate.
     *
     * @param q - quaternion to compute the conjugate of.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The conjugate of q
     */
    function conjugate(q, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = -q[0];
        newDst[1] = -q[1];
        newDst[2] = -q[2];
        newDst[3] = q[3];
        return newDst;
    }
    /**
     * Creates a quaternion from the given rotation matrix.
     *
     * The created quaternion is not normalized.
     *
     * @param m - rotation matrix
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns the result
     */
    function fromMat(m, dst) {
        const newDst = (dst ?? new Ctor(4));
        /*
        0 1 2
        3 4 5
        6 7 8
      
        0 1 2
        4 5 6
        8 9 10
         */
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        const trace = m[0] + m[5] + m[10];
        if (trace > 0.0) {
            // |w| > 1/2, may as well choose w > 1/2
            const root = Math.sqrt(trace + 1); // 2w
            newDst[3] = 0.5 * root;
            const invRoot = 0.5 / root; // 1/(4w)
            newDst[0] = (m[6] - m[9]) * invRoot;
            newDst[1] = (m[8] - m[2]) * invRoot;
            newDst[2] = (m[1] - m[4]) * invRoot;
        }
        else {
            // |w| <= 1/2
            let i = 0;
            if (m[5] > m[0]) {
                i = 1;
            }
            if (m[10] > m[i * 4 + i]) {
                i = 2;
            }
            const j = (i + 1) % 3;
            const k = (i + 2) % 3;
            const root = Math.sqrt(m[i * 4 + i] - m[j * 4 + j] - m[k * 4 + k] + 1.0);
            newDst[i] = 0.5 * root;
            const invRoot = 0.5 / root;
            newDst[3] = (m[j * 4 + k] - m[k * 4 + j]) * invRoot;
            newDst[j] = (m[j * 4 + i] + m[i * 4 + j]) * invRoot;
            newDst[k] = (m[k * 4 + i] + m[i * 4 + k]) * invRoot;
        }
        return newDst;
    }
    /**
     * Creates a quaternion from the given euler angle x, y, z using the provided intrinsic order for the conversion.
     *
     * @param xAngleInRadians - angle to rotate around X axis in radians.
     * @param yAngleInRadians - angle to rotate around Y axis in radians.
     * @param zAngleInRadians - angle to rotate around Z axis in radians.
     * @param order - order to apply euler angles
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion representing the same rotation as the euler angles applied in the given order
     */
    function fromEuler(xAngleInRadians, yAngleInRadians, zAngleInRadians, order, dst) {
        const newDst = (dst ?? new Ctor(4));
        const xHalfAngle = xAngleInRadians * 0.5;
        const yHalfAngle = yAngleInRadians * 0.5;
        const zHalfAngle = zAngleInRadians * 0.5;
        const sx = Math.sin(xHalfAngle);
        const cx = Math.cos(xHalfAngle);
        const sy = Math.sin(yHalfAngle);
        const cy = Math.cos(yHalfAngle);
        const sz = Math.sin(zHalfAngle);
        const cz = Math.cos(zHalfAngle);
        switch (order) {
            case 'xyz':
                newDst[0] = sx * cy * cz + cx * sy * sz;
                newDst[1] = cx * sy * cz - sx * cy * sz;
                newDst[2] = cx * cy * sz + sx * sy * cz;
                newDst[3] = cx * cy * cz - sx * sy * sz;
                break;
            case 'xzy':
                newDst[0] = sx * cy * cz - cx * sy * sz;
                newDst[1] = cx * sy * cz - sx * cy * sz;
                newDst[2] = cx * cy * sz + sx * sy * cz;
                newDst[3] = cx * cy * cz + sx * sy * sz;
                break;
            case 'yxz':
                newDst[0] = sx * cy * cz + cx * sy * sz;
                newDst[1] = cx * sy * cz - sx * cy * sz;
                newDst[2] = cx * cy * sz - sx * sy * cz;
                newDst[3] = cx * cy * cz + sx * sy * sz;
                break;
            case 'yzx':
                newDst[0] = sx * cy * cz + cx * sy * sz;
                newDst[1] = cx * sy * cz + sx * cy * sz;
                newDst[2] = cx * cy * sz - sx * sy * cz;
                newDst[3] = cx * cy * cz - sx * sy * sz;
                break;
            case 'zxy':
                newDst[0] = sx * cy * cz - cx * sy * sz;
                newDst[1] = cx * sy * cz + sx * cy * sz;
                newDst[2] = cx * cy * sz + sx * sy * cz;
                newDst[3] = cx * cy * cz - sx * sy * sz;
                break;
            case 'zyx':
                newDst[0] = sx * cy * cz - cx * sy * sz;
                newDst[1] = cx * sy * cz + sx * cy * sz;
                newDst[2] = cx * cy * sz - sx * sy * cz;
                newDst[3] = cx * cy * cz + sx * sy * sz;
                break;
            default:
                throw new Error(`Unknown rotation order: ${order}`);
        }
        return newDst;
    }
    /**
     * Copies a quaternion. (same as {@link quat.clone})
     * Also see {@link quat.create} and {@link quat.set}
     * @param q - The quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is a copy of q
     */
    function copy(q, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = q[0];
        newDst[1] = q[1];
        newDst[2] = q[2];
        newDst[3] = q[3];
        return newDst;
    }
    /**
     * Clones a quaternion. (same as {@link quat.copy})
     * Also see {@link quat.create} and {@link quat.set}
     * @param q - The quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A copy of q.
     */
    const clone = copy;
    /**
     * Adds two quaternions; assumes a and b have the same dimension.
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the sum of a and b.
     */
    function add(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + b[0];
        newDst[1] = a[1] + b[1];
        newDst[2] = a[2] + b[2];
        newDst[3] = a[3] + b[3];
        return newDst;
    }
    /**
     * Subtracts two quaternions.
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the difference of a and b.
     */
    function subtract(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] - b[0];
        newDst[1] = a[1] - b[1];
        newDst[2] = a[2] - b[2];
        newDst[3] = a[3] - b[3];
        return newDst;
    }
    /**
     * Subtracts two quaternions.
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the difference of a and b.
     */
    const sub = subtract;
    /**
     * Multiplies a quaternion by a scalar.
     * @param v - The quaternion.
     * @param k - The scalar.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The scaled quaternion.
     */
    function mulScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0] * k;
        newDst[1] = v[1] * k;
        newDst[2] = v[2] * k;
        newDst[3] = v[3] * k;
        return newDst;
    }
    /**
     * Multiplies a quaternion by a scalar. (same as mulScalar)
     * @param v - The quaternion.
     * @param k - The scalar.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The scaled quaternion.
     */
    const scale = mulScalar;
    /**
     * Divides a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The scaled quaternion.
     */
    function divScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0] / k;
        newDst[1] = v[1] / k;
        newDst[2] = v[2] / k;
        newDst[3] = v[3] / k;
        return newDst;
    }
    /**
     * Computes the dot product of two quaternions
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @returns dot product
     */
    function dot(a, b) {
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]) + (a[3] * b[3]);
    }
    /**
     * Performs linear interpolation on two quaternions.
     * Given quaternions a and b and interpolation coefficient t, returns
     * a + t * (b - a).
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @param t - Interpolation coefficient.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The linear interpolated result.
     */
    function lerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + t * (b[0] - a[0]);
        newDst[1] = a[1] + t * (b[1] - a[1]);
        newDst[2] = a[2] + t * (b[2] - a[2]);
        newDst[3] = a[3] + t * (b[3] - a[3]);
        return newDst;
    }
    /**
     * Computes the length of quaternion
     * @param v - quaternion.
     * @returns length of quaternion.
     */
    function length(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
    }
    /**
     * Computes the length of quaternion (same as length)
     * @param v - quaternion.
     * @returns length of quaternion.
     */
    const len = length;
    /**
     * Computes the square of the length of quaternion
     * @param v - quaternion.
     * @returns square of the length of quaternion.
     */
    function lengthSq(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        return v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3;
    }
    /**
     * Computes the square of the length of quaternion (same as lengthSq)
     * @param v - quaternion.
     * @returns square of the length of quaternion.
     */
    const lenSq = lengthSq;
    /**
     * Divides a quaternion by its Euclidean length and returns the quotient.
     * @param v - The quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The normalized quaternion.
     */
    function normalize(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        const len = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
        if (len > 0.00001) {
            newDst[0] = v0 / len;
            newDst[1] = v1 / len;
            newDst[2] = v2 / len;
            newDst[3] = v3 / len;
        }
        else {
            newDst[0] = 0;
            newDst[1] = 0;
            newDst[2] = 0;
            newDst[3] = 1;
        }
        return newDst;
    }
    /**
     * Check if 2 quaternions are approximately equal
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @returns true if quaternions are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON &&
            Math.abs(a[3] - b[3]) < EPSILON;
    }
    /**
     * Check if 2 quaternions are exactly equal
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @returns true if quaternions are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    /**
     * Creates an identity quaternion
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns an identity quaternion
     */
    function identity(dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 1;
        return newDst;
    }
    const tempVec3 = vec3.create();
    const xUnitVec3 = vec3.create();
    const yUnitVec3 = vec3.create();
    /**
     * Computes a quaternion to represent the shortest rotation from one vector to another.
     *
     * @param aUnit - the start vector
     * @param bUnit - the end vector
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns the result
     */
    function rotationTo(aUnit, bUnit, dst) {
        const newDst = (dst ?? new Ctor(4));
        const dot = vec3.dot(aUnit, bUnit);
        if (dot < -0.999999) {
            vec3.cross(xUnitVec3, aUnit, tempVec3);
            if (vec3.len(tempVec3) < 0.000001) {
                vec3.cross(yUnitVec3, aUnit, tempVec3);
            }
            vec3.normalize(tempVec3, tempVec3);
            fromAxisAngle(tempVec3, Math.PI, newDst);
            return newDst;
        }
        else if (dot > 0.999999) {
            newDst[0] = 0;
            newDst[1] = 0;
            newDst[2] = 0;
            newDst[3] = 1;
            return newDst;
        }
        else {
            vec3.cross(aUnit, bUnit, tempVec3);
            newDst[0] = tempVec3[0];
            newDst[1] = tempVec3[1];
            newDst[2] = tempVec3[2];
            newDst[3] = 1 + dot;
            return normalize(newDst, newDst);
        }
    }
    const tempQuat1 = new Ctor(4);
    const tempQuat2 = new Ctor(4);
    /**
     * Performs a spherical linear interpolation with two control points
     *
     * @param a - the first quaternion
     * @param b - the second quaternion
     * @param c - the third quaternion
     * @param d - the fourth quaternion
     * @param t - Interpolation coefficient 0 to 1
     * @returns result
     */
    function sqlerp(a, b, c, d, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        slerp(a, d, t, tempQuat1);
        slerp(b, c, t, tempQuat2);
        slerp(tempQuat1, tempQuat2, 2 * t * (1 - t), newDst);
        return newDst;
    }
    return {
        create,
        fromValues,
        set,
        fromAxisAngle,
        toAxisAngle,
        angle,
        multiply,
        mul,
        rotateX,
        rotateY,
        rotateZ,
        slerp,
        inverse,
        conjugate,
        fromMat,
        fromEuler,
        copy,
        clone,
        add,
        subtract,
        sub,
        mulScalar,
        scale,
        divScalar,
        dot,
        lerp,
        length,
        len,
        lengthSq,
        lenSq,
        normalize,
        equalsApproximately,
        equals,
        identity,
        rotationTo,
        sqlerp,
    };
}
const cache$1 = new Map();
/**
 *
 * Quat4 math functions.
 *
 * Almost all functions take an optional `newDst` argument. If it is not passed in the
 * functions will create a new `Quat4`. In other words you can do this
 *
 *     const v = quat4.cross(v1, v2);  // Creates a new Quat4 with the cross product of v1 x v2.
 *
 * or
 *
 *     const v = quat4.create();
 *     quat4.cross(v1, v2, v);  // Puts the cross product of v1 x v2 in v
 *
 * The first style is often easier but depending on where it's used it generates garbage where
 * as there is almost never allocation with the second style.
 *
 * It is always safe to pass any vector as the destination. So for example
 *
 *     quat4.cross(v1, v2, v1);  // Puts the cross product of v1 x v2 in v1
 *
 */
function getAPI$1(Ctor) {
    let api = cache$1.get(Ctor);
    if (!api) {
        api = getAPIImpl$1(Ctor);
        cache$1.set(Ctor, api);
    }
    return api;
}

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates am typed API for Vec4
 * */
function getAPIImpl(Ctor) {
    /**
     * Creates a vec4; may be called with x, y, z to set initial values.
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @param w - Initial w value.
     * @returns the created vector
     */
    function create(x, y, z, w) {
        const newDst = new Ctor(4);
        if (x !== undefined) {
            newDst[0] = x;
            if (y !== undefined) {
                newDst[1] = y;
                if (z !== undefined) {
                    newDst[2] = z;
                    if (w !== undefined) {
                        newDst[3] = w;
                    }
                }
            }
        }
        return newDst;
    }
    /**
     * Creates a vec4; may be called with x, y, z to set initial values. (same as create)
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @param z - Initial w value.
     * @returns the created vector
     */
    const fromValues = create;
    /**
     * Sets the values of a Vec4
     * Also see {@link vec4.create} and {@link vec4.copy}
     *
     * @param x first value
     * @param y second value
     * @param z third value
     * @param w fourth value
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector with its elements set.
     */
    function set(x, y, z, w, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = x;
        newDst[1] = y;
        newDst[2] = z;
        newDst[3] = w;
        return newDst;
    }
    /**
     * Applies Math.ceil to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the ceil of each element of v.
     */
    function ceil(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.ceil(v[0]);
        newDst[1] = Math.ceil(v[1]);
        newDst[2] = Math.ceil(v[2]);
        newDst[3] = Math.ceil(v[3]);
        return newDst;
    }
    /**
     * Applies Math.floor to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the floor of each element of v.
     */
    function floor(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.floor(v[0]);
        newDst[1] = Math.floor(v[1]);
        newDst[2] = Math.floor(v[2]);
        newDst[3] = Math.floor(v[3]);
        return newDst;
    }
    /**
     * Applies Math.round to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the round of each element of v.
     */
    function round(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.round(v[0]);
        newDst[1] = Math.round(v[1]);
        newDst[2] = Math.round(v[2]);
        newDst[3] = Math.round(v[3]);
        return newDst;
    }
    /**
     * Clamp each element of vector between min and max
     * @param v - Operand vector.
     * @param max - Min value, default 0
     * @param min - Max value, default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that the clamped value of each element of v.
     */
    function clamp(v, min = 0, max = 1, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.min(max, Math.max(min, v[0]));
        newDst[1] = Math.min(max, Math.max(min, v[1]));
        newDst[2] = Math.min(max, Math.max(min, v[2]));
        newDst[3] = Math.min(max, Math.max(min, v[3]));
        return newDst;
    }
    /**
     * Adds two vectors; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a and b.
     */
    function add(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + b[0];
        newDst[1] = a[1] + b[1];
        newDst[2] = a[2] + b[2];
        newDst[3] = a[3] + b[3];
        return newDst;
    }
    /**
     * Adds two vectors, scaling the 2nd; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param scale - Amount to scale b
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a + b * scale.
     */
    function addScaled(a, b, scale, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + b[0] * scale;
        newDst[1] = a[1] + b[1] * scale;
        newDst[2] = a[2] + b[2] * scale;
        newDst[3] = a[3] + b[3] * scale;
        return newDst;
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    function subtract(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] - b[0];
        newDst[1] = a[1] - b[1];
        newDst[2] = a[2] - b[2];
        newDst[3] = a[3] - b[3];
        return newDst;
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    const sub = subtract;
    /**
     * Check if 2 vectors are approximately equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON &&
            Math.abs(a[3] - b[3]) < EPSILON;
    }
    /**
     * Check if 2 vectors are exactly equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficient.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The linear interpolated result.
     */
    function lerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + t * (b[0] - a[0]);
        newDst[1] = a[1] + t * (b[1] - a[1]);
        newDst[2] = a[2] + t * (b[2] - a[2]);
        newDst[3] = a[3] + t * (b[3] - a[3]);
        return newDst;
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient vector t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficients vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns the linear interpolated result.
     */
    function lerpV(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + t[0] * (b[0] - a[0]);
        newDst[1] = a[1] + t[1] * (b[1] - a[1]);
        newDst[2] = a[2] + t[2] * (b[2] - a[2]);
        newDst[3] = a[3] + t[3] * (b[3] - a[3]);
        return newDst;
    }
    /**
     * Return max values of two vectors.
     * Given vectors a and b returns
     * [max(a[0], b[0]), max(a[1], b[1]), max(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The max components vector.
     */
    function max(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.max(a[0], b[0]);
        newDst[1] = Math.max(a[1], b[1]);
        newDst[2] = Math.max(a[2], b[2]);
        newDst[3] = Math.max(a[3], b[3]);
        return newDst;
    }
    /**
     * Return min values of two vectors.
     * Given vectors a and b returns
     * [min(a[0], b[0]), min(a[1], b[1]), min(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The min components vector.
     */
    function min(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.min(a[0], b[0]);
        newDst[1] = Math.min(a[1], b[1]);
        newDst[2] = Math.min(a[2], b[2]);
        newDst[3] = Math.min(a[3], b[3]);
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function mulScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0] * k;
        newDst[1] = v[1] * k;
        newDst[2] = v[2] * k;
        newDst[3] = v[3] * k;
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar. (same as mulScalar)
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    const scale = mulScalar;
    /**
     * Divides a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function divScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0] / k;
        newDst[1] = v[1] / k;
        newDst[2] = v[2] / k;
        newDst[3] = v[3] / k;
        return newDst;
    }
    /**
     * Inverse a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    function inverse(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = 1 / v[0];
        newDst[1] = 1 / v[1];
        newDst[2] = 1 / v[2];
        newDst[3] = 1 / v[3];
        return newDst;
    }
    /**
     * Invert a vector. (same as inverse)
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    const invert = inverse;
    /**
     * Computes the dot product of two vectors
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns dot product
     */
    function dot(a, b) {
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]) + (a[3] * b[3]);
    }
    /**
     * Computes the length of vector
     * @param v - vector.
     * @returns length of vector.
     */
    function length(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
    }
    /**
     * Computes the length of vector (same as length)
     * @param v - vector.
     * @returns length of vector.
     */
    const len = length;
    /**
     * Computes the square of the length of vector
     * @param v - vector.
     * @returns square of the length of vector.
     */
    function lengthSq(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        return v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3;
    }
    /**
     * Computes the square of the length of vector (same as lengthSq)
     * @param v - vector.
     * @returns square of the length of vector.
     */
    const lenSq = lengthSq;
    /**
     * Computes the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    function distance(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        const dw = a[3] - b[3];
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    }
    /**
     * Computes the distance between 2 points (same as distance)
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    const dist = distance;
    /**
     * Computes the square of the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    function distanceSq(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        const dw = a[3] - b[3];
        return dx * dx + dy * dy + dz * dz + dw * dw;
    }
    /**
     * Computes the square of the distance between 2 points (same as distanceSq)
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    const distSq = distanceSq;
    /**
     * Divides a vector by its Euclidean length and returns the quotient.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The normalized vector.
     */
    function normalize(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        const len = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
        if (len > 0.00001) {
            newDst[0] = v0 / len;
            newDst[1] = v1 / len;
            newDst[2] = v2 / len;
            newDst[3] = v3 / len;
        }
        else {
            newDst[0] = 0;
            newDst[1] = 0;
            newDst[2] = 0;
            newDst[3] = 0;
        }
        return newDst;
    }
    /**
     * Negates a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns -v.
     */
    function negate(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = -v[0];
        newDst[1] = -v[1];
        newDst[2] = -v[2];
        newDst[3] = -v[3];
        return newDst;
    }
    /**
     * Copies a vector. (same as {@link vec4.clone})
     * Also see {@link vec4.create} and {@link vec4.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    function copy(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0];
        newDst[1] = v[1];
        newDst[2] = v[2];
        newDst[3] = v[3];
        return newDst;
    }
    /**
     * Clones a vector. (same as {@link vec4.copy})
     * Also see {@link vec4.create} and {@link vec4.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    const clone = copy;
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] * b[0];
        newDst[1] = a[1] * b[1];
        newDst[2] = a[2] * b[2];
        newDst[3] = a[3] * b[3];
        return newDst;
    }
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as mul)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    const mul = multiply;
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    function divide(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] / b[0];
        newDst[1] = a[1] / b[1];
        newDst[2] = a[2] / b[2];
        newDst[3] = a[3] / b[3];
        return newDst;
    }
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as divide)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    const div = divide;
    /**
     * Zero's a vector
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The zeroed vector.
     */
    function zero(dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        return newDst;
    }
    /**
     * transform vec4 by 4x4 matrix
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional vec4 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat4(v, m, dst) {
        const newDst = (dst ?? new Ctor(4));
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const w = v[3];
        newDst[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        newDst[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        newDst[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        newDst[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
        return newDst;
    }
    /**
     * Treat a 4D vector as a direction and set it's length
     *
     * @param a The vec4 to lengthen
     * @param len The length of the resulting vector
     * @returns The lengthened vector
     */
    function setLength(a, len, dst) {
        const newDst = (dst ?? new Ctor(4));
        normalize(a, newDst);
        return mulScalar(newDst, len, newDst);
    }
    /**
     * Ensure a vector is not longer than a max length
     *
     * @param a The vec4 to limit
     * @param maxLen The longest length of the resulting vector
     * @returns The vector, shortened to maxLen if it's too long
     */
    function truncate(a, maxLen, dst) {
        const newDst = (dst ?? new Ctor(4));
        if (length(a) > maxLen) {
            return setLength(a, maxLen, newDst);
        }
        return copy(a, newDst);
    }
    /**
     * Return the vector exactly between 2 endpoint vectors
     *
     * @param a Endpoint 1
     * @param b Endpoint 2
     * @returns The vector exactly residing between endpoints 1 and 2
     */
    function midpoint(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        return lerp(a, b, 0.5, newDst);
    }
    return {
        create,
        fromValues,
        set,
        ceil,
        floor,
        round,
        clamp,
        add,
        addScaled,
        subtract,
        sub,
        equalsApproximately,
        equals,
        lerp,
        lerpV,
        max,
        min,
        mulScalar,
        scale,
        divScalar,
        inverse,
        invert,
        dot,
        length,
        len,
        lengthSq,
        lenSq,
        distance,
        dist,
        distanceSq,
        distSq,
        normalize,
        negate,
        copy,
        clone,
        multiply,
        mul,
        divide,
        div,
        zero,
        transformMat4,
        setLength,
        truncate,
        midpoint,
    };
}
const cache = new Map();
/**
 *
 * Vec4 math functions.
 *
 * Almost all functions take an optional `newDst` argument. If it is not passed in the
 * functions will create a new `Vec4`. In other words you can do this
 *
 *     const v = vec4.cross(v1, v2);  // Creates a new Vec4 with the cross product of v1 x v2.
 *
 * or
 *
 *     const v = vec4.create();
 *     vec4.cross(v1, v2, v);  // Puts the cross product of v1 x v2 in v
 *
 * The first style is often easier but depending on where it's used it generates garbage where
 * as there is almost never allocation with the second style.
 *
 * It is always safe to pass any vector as the destination. So for example
 *
 *     vec4.cross(v1, v2, v1);  // Puts the cross product of v1 x v2 in v1
 *
 */
function getAPI(Ctor) {
    let api = cache.get(Ctor);
    if (!api) {
        api = getAPIImpl(Ctor);
        cache.set(Ctor, api);
    }
    return api;
}

/**
 * Some docs
 * @namespace wgpu-matrix
 */
/**
 * Generate wgpu-matrix API for type
 */
function wgpuMatrixAPI(Mat3Ctor, Mat4Ctor, QuatCtor, Vec2Ctor, Vec3Ctor, Vec4Ctor) {
    return {
        /** @namespace mat3 */
        mat3: getAPI$3(Mat3Ctor),
        /** @namespace mat4 */
        mat4: getAPI$2(Mat4Ctor),
        /** @namespace quat */
        quat: getAPI$1(QuatCtor),
        /** @namespace vec2 */
        vec2: getAPI$5(Vec2Ctor),
        /** @namespace vec3 */
        vec3: getAPI$4(Vec3Ctor),
        /** @namespace vec4 */
        vec4: getAPI(Vec4Ctor),
    };
}
const { 
/**
 * 3x3 Matrix functions that default to returning `Float32Array`
 * @namespace
 */
mat3, 
/**
 * 4x4 Matrix functions that default to returning `Float32Array`
 * @namespace
 */
mat4, 
/**
 * Quaternion functions that default to returning `Float32Array`
 * @namespace
 */
quat, 
/**
 * Vec2 functions that default to returning `Float32Array`
 * @namespace
 */
vec2, 
/**
 * Vec3 functions that default to returning `Float32Array`
 * @namespace
 */
vec3, 
/**
 * Vec3 functions that default to returning `Float32Array`
 * @namespace
 */
vec4, } = wgpuMatrixAPI(Float32Array, Float32Array, Float32Array, Float32Array, Float32Array, Float32Array);
const { 
/**
 * 3x3 Matrix functions that default to returning `Float64Array`
 * @namespace
 */
mat3: mat3d, 
/**
 * 4x4 Matrix functions that default to returning `Float64Array`
 * @namespace
 */
mat4: mat4d, 
/**
 * Quaternion functions that default to returning `Float64Array`
 * @namespace
 */
quat: quatd, 
/**
 * Vec2 functions that default to returning `Float64Array`
 * @namespace
 */
vec2: vec2d, 
/**
 * Vec3 functions that default to returning `Float64Array`
 * @namespace
 */
vec3: vec3d, 
/**
 * Vec3 functions that default to returning `Float64Array`
 * @namespace
 */
vec4: vec4d, } = wgpuMatrixAPI(Float64Array, Float64Array, Float64Array, Float64Array, Float64Array, Float64Array);
const { 
/**
 * 3x3 Matrix functions that default to returning `number[]`
 * @namespace
 */
mat3: mat3n, 
/**
 * 4x4 Matrix functions that default to returning `number[]`
 * @namespace
 */
mat4: mat4n, 
/**
 * Quaternion functions that default to returning `number[]`
 * @namespace
 */
quat: quatn, 
/**
 * Vec2 functions that default to returning `number[]`
 * @namespace
 */
vec2: vec2n, 
/**
 * Vec3 functions that default to returning `number[]`
 * @namespace
 */
vec3: vec3n, 
/**
 * Vec3 functions that default to returning `number[]`
 * @namespace
 */
vec4: vec4n, } = wgpuMatrixAPI(ZeroArray, Array, Array, Array, Array, Array);


//# sourceMappingURL=wgpu-matrix.module.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsaUJBQWlCO0FBQ25ELGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGdCQUFnQjtBQUNsRCxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxpQkFBaUI7QUFDbkQsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxnQkFBZ0I7QUFDbEQsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRDtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxjQUFjO0FBQzdCLGVBQWUsY0FBYztBQUM3QixlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxjQUFjO0FBQzdCLGVBQWUsY0FBYztBQUM3QixlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxjQUFjO0FBQzdCLGVBQWUsY0FBYztBQUM3QixlQUFlLFFBQVE7QUFDdkI7QUFDQSxpQkFBaUIsTUFBTTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsaUJBQWlCO0FBQ25ELGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsZ0JBQWdCO0FBQ2pELGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxpQkFBaUI7QUFDbkQsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGdCQUFnQjtBQUNqRCxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQztBQUMvQztBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELE1BQU07QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsaUJBQWlCO0FBQ3ZELGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxnQkFBZ0I7QUFDdEQsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxpQkFBaUI7QUFDbkQsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGdCQUFnQjtBQUNsRCxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRDtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOztBQUUwSDtBQUN6STs7Ozs7OztVQ3B3TEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvc2hhZGVycy9nYXVzc2lhbi53Z3NsIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3JlbmRlci53Z3NsIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXVsYXRpb24ud2dzbCIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVuZGVyUGFzcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvbkNvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvblBhc3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RleHR1cmVDb21wdXRlUGFzcy50cyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2dwdS1tYXRyaXgvZGlzdC8zLngvd2dwdS1tYXRyaXgubW9kdWxlLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcInN0cnVjdCBVbmlmb3JtcyB7XFxyXFxuICAgIGJsdXJLZXJuZWw6IG1hdDN4MzxmMzI+LFxcclxcbiAgICBwYXNzaXZlQXR0ZW51YXRpb246IGYzMixcXHJcXG4gICAgd3JhcDogdTMyLFxcclxcbiAgICB3aWR0aDogdTMyLFxcclxcbiAgICBoZWlnaHQ6IHUzMixcXHJcXG59XFxyXFxuQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhcjx1bmlmb3JtPiB1bmlmb3JtczogVW5pZm9ybXM7XFxyXFxuXFxyXFxuQGdyb3VwKDApIEBiaW5kaW5nKDEpIHZhciBwaGVyb21vbmVzSW46IHRleHR1cmVfc3RvcmFnZV8yZDxyZ2JhOHVub3JtLCByZWFkPjtcXHJcXG5AZ3JvdXAoMCkgQGJpbmRpbmcoMikgdmFyIHBoZXJvbW9uZXNPdXQ6IHRleHR1cmVfc3RvcmFnZV8yZDxyZ2JhOHVub3JtLCB3cml0ZT47XFxyXFxuXFxyXFxuQGNvbXB1dGUgQHdvcmtncm91cF9zaXplKDgsIDgpXFxyXFxuZm4gYXR0ZW51YXRlKEBidWlsdGluKGdsb2JhbF9pbnZvY2F0aW9uX2lkKSBnbG9iYWxfaWQ6IHZlYzM8dTMyPikge1xcclxcbiAgICBsZXQgc2l6ZSA9IHRleHR1cmVEaW1lbnNpb25zKHBoZXJvbW9uZXNJbik7XFxyXFxuICAgIGlmIChnbG9iYWxfaWQueCA+PSBzaXplLnggfHwgZ2xvYmFsX2lkLnkgPj0gc2l6ZS55KSB7XFxyXFxuICAgICAgICByZXR1cm47XFxyXFxuICAgIH1cXHJcXG4gICAgXFxyXFxuICAgIGxldCBwaXhlbCA9IGdsb2JhbF9pZC54eTtcXHJcXG4gICAgdmFyIGNvbG9yU3VtID0gdmVjMygwLik7XFxyXFxuXFxyXFxuICAgIC8vIExvb3AgdGhyb3VnaCBuZWlnaGJvcmluZyBwaXhlbHMgKDN4MyBrZXJuZWwpXFxyXFxuICAgIGZvciAodmFyIGk6IGkzMiA9IC0xOyBpIDw9IDE7IGkrKykge1xcclxcbiAgICAgICAgZm9yICh2YXIgajogaTMyID0gLTE7IGogPD0gMTsgaisrKSB7XFxyXFxuICAgICAgICAgICAgdmFyIHNhbXBsZVBpeGVsPSB2ZWMyKGkzMihnbG9iYWxfaWQueCkgKyBpLCBpMzIoZ2xvYmFsX2lkLnkpICsgaik7XFxyXFxuICAgICAgICAgICAgaWYgKHVuaWZvcm1zLndyYXAgPT0gMSkge1xcclxcbiAgICAgICAgICAgICAgICBpZiAoc2FtcGxlUGl4ZWwueCA8IDApIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHNhbXBsZVBpeGVsLnggKz0gc2l6ZS54O1xcclxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNhbXBsZVBpeGVsLnggPj0gc2l6ZS54KSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICBzYW1wbGVQaXhlbC54IC09IHNpemUueDtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgICAgICBpZiAoc2FtcGxlUGl4ZWwueSA8IDApIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHNhbXBsZVBpeGVsLnkgKz0gc2l6ZS55O1xcclxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNhbXBsZVBpeGVsLnkgPj0gc2l6ZS55KSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICBzYW1wbGVQaXhlbC55IC09IHNpemUueTtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgIH0gZWxzZSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2FtcGxlUGl4ZWwueCA8IDApIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHNhbXBsZVBpeGVsLnggPSAwO1xcclxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNhbXBsZVBpeGVsLnggPj0gc2l6ZS54KSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICBzYW1wbGVQaXhlbC54ID0gc2l6ZS54IC0gMTtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgICAgICBpZiAoc2FtcGxlUGl4ZWwueSA8IDApIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHNhbXBsZVBpeGVsLnkgPSAwO1xcclxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNhbXBsZVBpeGVsLnkgPj0gc2l6ZS55KSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICBzYW1wbGVQaXhlbC55ID0gc2l6ZS55IC0gMTtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICAgICBsZXQgc2FtcGxlQ29sb3IgPSB0ZXh0dXJlTG9hZChwaGVyb21vbmVzSW4sIHNhbXBsZVBpeGVsKS54eXo7IC8vIExvYWQgbmVpZ2hib3JpbmcgcGl4ZWwgY29sb3JcXHJcXG4gICAgICAgICAgICBsZXQga2VybmVsSW5kZXggPSAoaSsxKSAqIDMgKyAoaisxKTtcXHJcXG4gICAgICAgICAgICBjb2xvclN1bSArPSBzYW1wbGVDb2xvciAqIHVuaWZvcm1zLmJsdXJLZXJuZWxbaSsxXVtqKzFdOyAvLyBBcHBseSBHYXVzc2lhbiBrZXJuZWxcXHJcXG4gICAgICAgIH1cXHJcXG4gICAgfVxcclxcblxcclxcbiAgICBjb2xvclN1bSA9IG1heCh2ZWMzKDAuKSwgY29sb3JTdW0gLSB2ZWMzKHVuaWZvcm1zLnBhc3NpdmVBdHRlbnVhdGlvbikpO1xcclxcblxcclxcbiAgICB0ZXh0dXJlU3RvcmUocGhlcm9tb25lc091dCwgcGl4ZWwsIHZlYzQoY29sb3JTdW0sIDEuMCkpOyAvLyBTdG9yZSBibHVycmVkIGNvbG9yXFxyXFxufVwiOyIsImV4cG9ydCBkZWZhdWx0IFwiQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhciB0ZXh0dXJlSW46IHRleHR1cmVfMmQ8ZjMyPjtcXHJcXG5AZ3JvdXAoMCkgQGJpbmRpbmcoMSkgdmFyIHNhbXBsZXJJbjogc2FtcGxlcjtcXHJcXG5cXHJcXG5zdHJ1Y3QgVmVydGV4T3V0IHtcXHJcXG4gICAgQGJ1aWx0aW4ocG9zaXRpb24pIHBvc2l0aW9uIDogdmVjNGYsXFxyXFxuICAgIEBsb2NhdGlvbigwKSB1diA6IHZlYzJmLFxcclxcbn1cXHJcXG5cXHJcXG5AdmVydGV4XFxyXFxuZm4gdmVydGV4X21haW4oQGJ1aWx0aW4odmVydGV4X2luZGV4KSBWZXJ0ZXhJbmRleDogdTMyKSAtPiBWZXJ0ZXhPdXRcXHJcXG57XFxyXFxuICAgIHZhciB2ZXJ0aWNlcyA9IGFycmF5PHZlYzJmLCA2PihcXHJcXG4gICAgdmVjMigtMSwgLTEpLFxcclxcbiAgICB2ZWMyKDEsIC0xKSxcXHJcXG4gICAgdmVjMigtMSwgMSksXFxyXFxuICAgIHZlYzIoMSwgMSksXFxyXFxuICAgIHZlYzIoMSwgLTEpLFxcclxcbiAgICB2ZWMyKC0xLCAxKSxcXHJcXG4gICAgKTtcXHJcXG4gICAgdmFyIHV2cyA9IGFycmF5PHZlYzJmLCA2PiAoXFxyXFxuICAgIHZlYzIoMCwgMCksXFxyXFxuICAgIHZlYzIoMSwgMCksXFxyXFxuICAgIHZlYzIoMCwgMSksXFxyXFxuICAgIHZlYzIoMSwgMSksXFxyXFxuICAgIHZlYzIoMSwgMCksXFxyXFxuICAgIHZlYzIoMCwgMSksXFxyXFxuICAgICk7XFxyXFxuICAgIHZhciBvdXRwdXQgOiBWZXJ0ZXhPdXQ7XFxyXFxuICAgIG91dHB1dC5wb3NpdGlvbiA9IHZlYzQodmVydGljZXNbVmVydGV4SW5kZXhdLCAwLCAxKTtcXHJcXG4gICAgb3V0cHV0LnV2ID0gdXZzW1ZlcnRleEluZGV4XTtcXHJcXG4gICAgXFxyXFxuICAgIHJldHVybiBvdXRwdXQ7XFxyXFxufVxcclxcblxcclxcbkBmcmFnbWVudFxcclxcbmZuIGZyYWdtZW50X21haW4oZnJhZ0RhdGE6IFZlcnRleE91dCkgLT4gQGxvY2F0aW9uKDApIHZlYzRmXFxyXFxue1xcclxcbiAgICAvLyBsZXQgY29sb3IxID0gdmVjMygwLjM5LCAwLjgyLCAwLjA2KTtcXHJcXG4gICAgLy8gbGV0IGNvbG9yMSA9IHZlYzMoMC4zNCwgMC44LCAwLjMyKTtcXHJcXG4gICAgbGV0IGNvbG9yMSA9IHZlYzMoMS4pO1xcclxcbiAgICBsZXQgY29sb3IyID0gdmVjMygwLCAwLjQ5LCAwLjc3KTtcXHJcXG4gICAgLy8gbGV0IGNvbG9yMiA9IHZlYzMoLjEsIDAuMywgLjMpO1xcclxcbiAgICAvLyBsZXQgY29sb3IyID0gdmVjMygwLjMsIDAuNzcsIDAuNjcpO1xcclxcbiAgICBsZXQgYmxhY2sgPSB2ZWMzKDAuKTtcXHJcXG4gICAgbGV0IHNhbXBsZSA9IHRleHR1cmVTYW1wbGUodGV4dHVyZUluLCBzYW1wbGVySW4sIGZyYWdEYXRhLnV2KS54O1xcclxcbiAgICB2YXIgb3V0Q29sb3I6IHZlYzM8ZjMyPjtcXHJcXG4gICAgaWYgKHNhbXBsZSA+PSAuNSkge1xcclxcbiAgICAgICAgb3V0Q29sb3IgPSBtaXgoY29sb3IyLCBjb2xvcjEsIChzYW1wbGUgLSAuNSkgKiAyKTtcXHJcXG4gICAgfSBlbHNlIHtcXHJcXG4gICAgICAgIG91dENvbG9yID0gbWl4KGJsYWNrLCBjb2xvcjIsIHNhbXBsZSAqIDIpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIHJldHVybiB2ZWM0KG91dENvbG9yLCAxKTtcXHJcXG59XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCIvLyBIYXNoIGZ1bmN0aW9uIGZyb20gSC4gU2NoZWNodGVyICYgUi4gQnJpZHNvbiwgZ29vLmdsL1JYaUthSFxcclxcbmZuIEhhc2gocDogdTMyKSAtPiB1MzJcXHJcXG57XFxyXFxuICAgIHZhciBzID0gcDsgXFxyXFxuICAgIHMgXj0gMjc0NzYzNjQxOXU7XFxyXFxuICAgIHMgKj0gMjY1NDQzNTc2OXU7XFxyXFxuICAgIHMgXj0gcyA+PiAxNjtcXHJcXG4gICAgcyAqPSAyNjU0NDM1NzY5dTtcXHJcXG4gICAgcyBePSBzID4+IDE2O1xcclxcbiAgICBzICo9IDI2NTQ0MzU3Njl1O1xcclxcbiAgICByZXR1cm4gcztcXHJcXG59XFxyXFxuXFxyXFxuZm4gUmFuZG9tKHNlZWQ6IHUzMikgLT4gZjMyXFxyXFxue1xcclxcbiAgICByZXR1cm4gZjMyKEhhc2goc2VlZCkpIC8gNDI5NDk2NzI5NS4wOyAvLyAyXjMyLTFcXHJcXG59XFxyXFxuXFxyXFxuc3RydWN0IFVuaWZvcm1zIHtcXHJcXG4gICAgd2lkdGg6IHUzMixcXHJcXG4gICAgaGVpZ2h0OiB1MzIsXFxyXFxuICAgIGFnZW50Q291bnQ6IHUzMixcXHJcXG4gICAgdGltZTogdTMyLFxcclxcbiAgICBzYW1wbGVEaXN0YW5jZTogdTMyLFxcclxcbiAgICB3cmFwOiB1MzIsXFxyXFxuICAgIHR1cm5KaXR0ZXI6IGYzMixcXHJcXG4gICAgc3RlZXJGYWN0b3I6IGYzMixcXHJcXG4gICAgYWNjZWxlcmF0aW9uOiBmMzIsXFxyXFxuICAgIGNvc1NhbXBsZUFuZ2xlOiBmMzIsXFxyXFxuICAgIHNpblNhbXBsZUFuZ2xlOiBmMzIsXFxyXFxuICAgIHNwZWVkOiBmMzIsXFxyXFxufVxcclxcblxcclxcbnN0cnVjdCBBbnQge1xcclxcbiAgICBwb3NpdGlvbjogdmVjMmYsXFxyXFxuICAgIGRpcmVjdGlvbjogdmVjMmYsXFxyXFxuICAgIHBoZXJvbW9uZUNoYW5uZWw6IHUzMixcXHJcXG59XFxyXFxuXFxyXFxuQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhcjx1bmlmb3JtPiB1bmlmb3JtczogVW5pZm9ybXM7XFxyXFxuXFxyXFxuQGdyb3VwKDApIEBiaW5kaW5nKDEpIHZhcjxzdG9yYWdlLCByZWFkX3dyaXRlPiBhZ2VudHM6IGFycmF5PHZlYzRmPjtcXHJcXG5AZ3JvdXAoMCkgQGJpbmRpbmcoMikgdmFyIHBoZXJvbW9uZXNJbjogdGV4dHVyZV9zdG9yYWdlXzJkPHJnYmE4dW5vcm0sIHJlYWQ+O1xcclxcbkBncm91cCgwKSBAYmluZGluZygzKSB2YXIgcGhlcm9tb25lc091dDogdGV4dHVyZV9zdG9yYWdlXzJkPHJnYmE4dW5vcm0sIHdyaXRlPjtcXHJcXG5cXHJcXG5mbiBzYW1wbGVQaGVyb21vbmUocG9zaXRpb246IHZlYzI8ZjMyPiwgZGlyZWN0aW9uOiB2ZWMyPGYzMj4sIHN0ZXBzOiB1MzIpIC0+IGYzMiB7XFxyXFxuICAgIGxldCBzYW1wbGVTdGFydCA9IHBvc2l0aW9uICsgZGlyZWN0aW9uICogMjtcXHJcXG4gICAgdmFyIHN1bSA9IDAuO1xcclxcbiAgICBsZXQgZlN0ZXBzID0gZjMyKHN0ZXBzKTtcXHJcXG4gICAgZm9yICh2YXIgaSA9IDAuOyBpIDwgZlN0ZXBzOyBpICs9IDEuKSB7XFxyXFxuICAgICAgICB2YXIgc2FtcGxlUGl4ZWwgPSB2ZWMyPGkzMj4ocm91bmQoc2FtcGxlU3RhcnQgKyBpICogZGlyZWN0aW9uKSk7XFxyXFxuICAgICAgICBpZiAodW5pZm9ybXMud3JhcCA9PSAxKSB7XFxyXFxuICAgICAgICAgICAgaWYgKHNhbXBsZVBpeGVsLnggPCAwKSB7XFxyXFxuICAgICAgICAgICAgICAgIHNhbXBsZVBpeGVsLnggKz0gdW5pZm9ybXMud2lkdGg7XFxyXFxuICAgICAgICAgICAgfSBlbHNlIGlmIChzYW1wbGVQaXhlbC54ID49IHVuaWZvcm1zLndpZHRoKSB7XFxyXFxuICAgICAgICAgICAgICAgIHNhbXBsZVBpeGVsLnggLT0gdW5pZm9ybXMud2lkdGg7IFxcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICBpZiAoc2FtcGxlUGl4ZWwueSA8IDApIHtcXHJcXG4gICAgICAgICAgICAgICAgc2FtcGxlUGl4ZWwueSArPSB1bmlmb3Jtcy5oZWlnaHQ7XFxyXFxuICAgICAgICAgICAgfSBlbHNlIGlmIChzYW1wbGVQaXhlbC55ID49IHVuaWZvcm1zLmhlaWdodCkge1xcclxcbiAgICAgICAgICAgICAgICBzYW1wbGVQaXhlbC55IC09IHVuaWZvcm1zLmhlaWdodDsgXFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcbiAgICAgICAgc3VtICs9IHRleHR1cmVMb2FkKHBoZXJvbW9uZXNJbiwgc2FtcGxlUGl4ZWwpLng7XFxyXFxuICAgIH1cXHJcXG4gICAgcmV0dXJuIHN1bTtcXHJcXG59XFxyXFxuXFxyXFxuQGNvbXB1dGUgQHdvcmtncm91cF9zaXplKDY0KVxcclxcbmZuIHNpbXVsYXRlKEBidWlsdGluKGdsb2JhbF9pbnZvY2F0aW9uX2lkKSBnbG9iYWxfaWQ6IHZlYzM8dTMyPikge1xcclxcbiAgICBsZXQgaW5kZXggPSBnbG9iYWxfaWQueDtcXHJcXG4gICAgLy8gVHJpbSBvZmYgdGhlIGV4Y2VzcyBpZiBhZ2VudENvdW50ICUgV09SS0dST1VQX1NJWkUgIT0gMFxcclxcbiAgICBpZiAoaW5kZXggPj0gdW5pZm9ybXMuYWdlbnRDb3VudCkge1xcclxcbiAgICAgICAgcmV0dXJuO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIHZhciBhZ2VudCA9IGFnZW50c1tpbmRleF07XFxyXFxuXFxyXFxuICAgIGFnZW50LnggKz0gYWdlbnQuejtcXHJcXG4gICAgYWdlbnQueSArPSBhZ2VudC53O1xcclxcblxcclxcbiAgICBpZiAodW5pZm9ybXMud3JhcCA9PSAxKSB7XFxyXFxuICAgICAgICBpZiAoYWdlbnQueCA8IDAuKSB7XFxyXFxuICAgICAgICAgICAgYWdlbnQueCArPSB1bmlmb3Jtcy53aWR0aDtcXHJcXG4gICAgICAgIH0gZWxzZSBpZiAoYWdlbnQueCA+PSB1bmlmb3Jtcy53aWR0aCkge1xcclxcbiAgICAgICAgICAgIGFnZW50LnggLT0gdW5pZm9ybXMud2lkdGg7IFxcclxcbiAgICAgICAgfVxcclxcbiAgICAgICAgaWYgKGFnZW50LnkgPCAwLikge1xcclxcbiAgICAgICAgICAgIGFnZW50LnkgKz0gdW5pZm9ybXMuaGVpZ2h0O1xcclxcbiAgICAgICAgfSBlbHNlIGlmIChhZ2VudC55ID49IHVuaWZvcm1zLmhlaWdodCkge1xcclxcbiAgICAgICAgICAgIGFnZW50LnkgLT0gdW5pZm9ybXMuaGVpZ2h0OyBcXHJcXG4gICAgICAgIH1cXHJcXG4gICAgfSBlbHNlIHtcXHJcXG4gICAgICAgIGlmIChhZ2VudC54ID49IHVuaWZvcm1zLndpZHRoIHx8IGFnZW50LnggPCAwKSB7XFxyXFxuICAgICAgICAgICAgYWdlbnQueiA9IC1hZ2VudC56O1xcclxcbiAgICAgICAgfVxcclxcbiAgICAgICAgaWYgKGFnZW50LnkgPj0gdW5pZnJvbXMuaGVpZ2h0IHx8IGFnZW50LnkgPCAwKSB7XFxyXFxuICAgICAgICAgICAgYWdlbnQudyA9IC1hZ2VudC53O1xcclxcbiAgICAgICAgfVxcclxcbiAgICB9XFxyXFxuICAgIGxldCByYW5kb21EaXJDaGFuZ2UgPSB1bmlmb3Jtcy50dXJuSml0dGVyICogdmVjMihSYW5kb20odW5pZm9ybXMudGltZSArIGdsb2JhbF9pZC54KSAtIC41LCBSYW5kb20odW5pZm9ybXMudGltZSArIGdsb2JhbF9pZC54ICsgdW5pZm9ybXMuaGVpZ2h0KSAtIC41KTtcXHJcXG4gICAgdmFyIHZlbG9jaXR5ID0gbm9ybWFsaXplKGFnZW50Lnp3ICsgcmFuZG9tRGlyQ2hhbmdlKTtcXHJcXG5cXHJcXG4gICAgbGV0IGxlZnRTYW1wbGVNYXRyaXggPSAgbWF0MngyKHVuaWZvcm1zLmNvc1NhbXBsZUFuZ2xlLCB1bmlmb3Jtcy5zaW5TYW1wbGVBbmdsZSwgLXVuaWZvcm1zLnNpblNhbXBsZUFuZ2xlLCB1bmlmb3Jtcy5jb3NTYW1wbGVBbmdsZSk7XFxyXFxuICAgIGxldCByaWdodFNhbXBsZU1hdHJpeCA9IG1hdDJ4Mih1bmlmb3Jtcy5jb3NTYW1wbGVBbmdsZSwgLXVuaWZvcm1zLnNpblNhbXBsZUFuZ2xlLCB1bmlmb3Jtcy5zaW5TYW1wbGVBbmdsZSwgdW5pZm9ybXMuY29zU2FtcGxlQW5nbGUpO1xcclxcblxcclxcbiAgICAvLyBUYWtlIHBoZXJvbW9uZSBzYW1wbGVzXFxyXFxuICAgIGxldCByaWdodFNhbXBsZURpciA9IHJpZ2h0U2FtcGxlTWF0cml4ICogdmVsb2NpdHk7XFxyXFxuICAgIGxldCByaWdodFNhbXBsZVBpeGVsID0gdmVjMjxpMzI+KHJvdW5kKGFnZW50Lnh5ICsgMyAqIHJpZ2h0U2FtcGxlRGlyKSk7XFxyXFxuXFxyXFxuICAgIGxldCBmb3J3YXJkU2FtcGxlUGl4ZWwgPSB2ZWMyPGkzMj4ocm91bmQoYWdlbnQueHkgKyAzICogdmVsb2NpdHkpKTtcXHJcXG5cXHJcXG5cXHJcXG4gICAgbGV0IGxlZnRTYW1wbGVEaXIgPSBsZWZ0U2FtcGxlTWF0cml4ICogdmVsb2NpdHk7XFxyXFxuXFxyXFxuICAgIGxldCByaWdodFNhbXBsZSA9IHNhbXBsZVBoZXJvbW9uZShhZ2VudC54eSwgcmlnaHRTYW1wbGVEaXIsIHVuaWZvcm1zLnNhbXBsZURpc3RhbmNlKTtcXHJcXG4gICAgbGV0IGZvcndhcmRTYW1wbGUgPSBzYW1wbGVQaGVyb21vbmUoYWdlbnQueHksIHZlbG9jaXR5LCB1bmlmb3Jtcy5zYW1wbGVEaXN0YW5jZSk7XFxyXFxuICAgIGxldCBsZWZ0U2FtcGxlID0gc2FtcGxlUGhlcm9tb25lKGFnZW50Lnh5LCBsZWZ0U2FtcGxlRGlyLCB1bmlmb3Jtcy5zYW1wbGVEaXN0YW5jZSk7XFxyXFxuXFxyXFxuICAgIHZhciBtYXhTYW1wbGUgPSAwLjtcXHJcXG4gICAgaWYgKGZvcndhcmRTYW1wbGUgPCByaWdodFNhbXBsZSB8fCBmb3J3YXJkU2FtcGxlIDwgbGVmdFNhbXBsZSkge1xcclxcbiAgICAgICAgaWYgKHJpZ2h0U2FtcGxlID4gbGVmdFNhbXBsZSkge1xcclxcbiAgICAgICAgICAgIHZlbG9jaXR5ICs9IHVuaWZvcm1zLnN0ZWVyRmFjdG9yICogcmlnaHRTYW1wbGVEaXI7XFxyXFxuICAgICAgICAgICAgbWF4U2FtcGxlID0gcmlnaHRTYW1wbGU7XFxyXFxuICAgICAgICB9IGVsc2Uge1xcclxcbiAgICAgICAgICAgIHZlbG9jaXR5ICs9IHVuaWZvcm1zLnN0ZWVyRmFjdG9yICogbGVmdFNhbXBsZURpcjtcXHJcXG4gICAgICAgICAgICBtYXhTYW1wbGUgPSBsZWZ0U2FtcGxlOyBcXHJcXG4gICAgICAgIH1cXHJcXG4gICAgICAgIHZlbG9jaXR5ID0gbm9ybWFsaXplKHZlbG9jaXR5KTtcXHJcXG4gICAgfSBlbHNlIHtcXHJcXG4gICAgICAgIG1heFNhbXBsZSA9IGZvcndhcmRTYW1wbGU7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgdmVsb2NpdHkgKj0gdW5pZm9ybXMuc3BlZWQgKyAodW5pZm9ybXMuYWNjZWxlcmF0aW9uICogbWF4U2FtcGxlIC8gZjMyKHVuaWZvcm1zLnNhbXBsZURpc3RhbmNlKSk7XFxyXFxuXFxyXFxuICAgIGxldCBwaXhlbCA9IHZlYzI8aTMyPihyb3VuZChhZ2VudC54eSkpO1xcclxcbiAgICBsZXQgcmVkID0gdmVjMygxLiwgMC4sIDAuKTtcXHJcXG4gICAgdGV4dHVyZVN0b3JlKHBoZXJvbW9uZXNPdXQsIHBpeGVsLCB2ZWM0KHJlZCwgMS4pKTtcXHJcXG5cXHJcXG4gICAgYWdlbnQueiA9IHZlbG9jaXR5Lng7XFxyXFxuICAgIGFnZW50LncgPSB2ZWxvY2l0eS55O1xcclxcbiAgICBhZ2VudHNbaW5kZXhdID0gYWdlbnQ7XFxyXFxufVwiOyIsImltcG9ydCB7IFJlbmRlclBhc3MgfSBmcm9tIFwiLi9yZW5kZXJQYXNzXCI7XHJcbmltcG9ydCB7IGdldEFnZW50c0FycmF5LCBzaW11bGF0aW9uUGFyYW1ldGVycyB9IGZyb20gXCIuL3NpbXVsYXRpb25Db25maWdcIjtcclxuaW1wb3J0IHsgU2ltdWxhdGlvblBhc3MgfSBmcm9tIFwiLi9zaW11bGF0aW9uUGFzc1wiO1xyXG5pbXBvcnQgeyBUZXh0dXJlUGFzcyB9IGZyb20gXCIuL3RleHR1cmVDb21wdXRlUGFzc1wiO1xyXG5cclxuY29uc3QgTlVNQkVSX09GX1BBU1NFUyA9IDI7XHJcbmxldCBsYXRlc3RGcmFtZUhhbmRsZSA9IDA7XHJcbmxldCBmcmFtZTogKCkgPT4gdm9pZCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDMwO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDMwO1xyXG4gICAgaWYgKCFuYXZpZ2F0b3IuZ3B1KSB7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xyXG4gICAgICAgIGJvZHkucHJlcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIllvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFdlYiBHUFUsIHRoZSB0aGluZyB0aGF0IG1ha2VzIHRoaXMgd2hvbGUgd2Vic2l0ZSB3b3JrLiBUcnkgdXNpbmcgQ2hyb21lLCBNaWNyb3NvZnQgRWRnZSwgb3IgT3BlcmEuIEhvcGVmdWxseSBGaXJlZm94IGFuZCBTYWZhcmkgd2lsbCBnZXQgaXQgc29vbiFcIikpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGFkYXB0ZXIgPSBhd2FpdCBuYXZpZ2F0b3IuZ3B1LnJlcXVlc3RBZGFwdGVyKCk7XHJcbiAgICBjb25zdCBoYXNUaW1lc3RhbXBRdWVyeSA9IGFkYXB0ZXIuZmVhdHVyZXMuaGFzKFwidGltZXN0YW1wLXF1ZXJ5XCIpO1xyXG4gICAgY29uc3QgZGV2aWNlID0gYXdhaXQgYWRhcHRlci5yZXF1ZXN0RGV2aWNlKHtcclxuICAgICAgICByZXF1aXJlZEZlYXR1cmVzOiBoYXNUaW1lc3RhbXBRdWVyeSA/IFtcInRpbWVzdGFtcC1xdWVyeVwiXSBhcyBHUFVGZWF0dXJlTmFtZVtdOiBbXSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFBlcmZvcm1hbmNlIFN0YXRpc3RpY3MgRG9jdW1lbnQgU2V0dXBcclxuICAgIGNvbnN0IHBlcmZEaXNwbGF5Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5oaWRkZW4gPSB0cnVlO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUuYmFja2Ryb3BGaWx0ZXIgPSAnYmx1cigxMHB4KSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5ib3R0b20gPSAnMTBweCc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gJzEwcHgnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUudGV4dEFsaWduID0gJ2xlZnQnO1xyXG4gICAgY29uc3QgcGVyZkRpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKTtcclxuICAgIHBlcmZEaXNwbGF5LnN0eWxlLm1hcmdpbiA9ICcuNWVtJztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLmFwcGVuZENoaWxkKHBlcmZEaXNwbGF5KTtcclxuICAgIGNhbnZhcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHBlcmZEaXNwbGF5Q29udGFpbmVyKTtcclxuICAgIGxldCBzaW11bGF0aW9uRHVyYXRpb25TdW0gPSAwO1xyXG4gICAgbGV0IHJlbmRlckR1cmF0aW9uU3VtID0gMDtcclxuICAgIGxldCB0aW1lclNhbXBsZXMgPSAwO1xyXG5cclxuICAgIGNvbnN0IHNwYXJlUGVyZlRpbWVCdWZmZXJzOiBHUFVCdWZmZXJbXSA9IFtdO1xyXG4gICAgbGV0IHF1ZXJ5U2V0OiBHUFVRdWVyeVNldCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIGxldCBwZXJmUmVzb2x2ZUJ1ZmZlcjogR1BVQnVmZmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgbGV0IHNpbXVsYXRpb25QZXJmVGltZVN0YW1wV3JpdGVzOiBHUFVDb21wdXRlUGFzc1RpbWVzdGFtcFdyaXRlcyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIGxldCByZW5kZXJQZXJmVGltZVN0YW1wV3JpdGVzOiBHUFVSZW5kZXJQYXNzVGltZXN0YW1wV3JpdGVzIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgaWYgKGhhc1RpbWVzdGFtcFF1ZXJ5KSB7XHJcbiAgICAgICAgcGVyZkRpc3BsYXkudGV4dENvbnRlbnQgPSBgXFxcclxuYXZnIHNpbXVsYXRpb24gZHVyYXRpb246IOKAlCDCtXNcclxuYXZnIHJlbmRlciBkdXJhdGlvbjogIOKAlCDCtXNcclxuc3BhcmUgcGVyZiBidWZmZXJzOiAgICDigJRgO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBxdWVyeVNldCA9IGRldmljZS5jcmVhdGVRdWVyeVNldCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwidGltZXN0YW1wXCIsXHJcbiAgICAgICAgICAgIGNvdW50OiAyICogTlVNQkVSX09GX1BBU1NFUyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBwZXJmUmVzb2x2ZUJ1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJwZXJmUmVzb2x2ZVwiLFxyXG4gICAgICAgICAgICBzaXplOiA0ICogQmlnSW50NjRBcnJheS5CWVRFU19QRVJfRUxFTUVOVCAqIE5VTUJFUl9PRl9QQVNTRVMsXHJcbiAgICAgICAgICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZS5RVUVSWV9SRVNPTFZFIHwgR1BVQnVmZmVyVXNhZ2UuQ09QWV9TUkMsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2ltdWxhdGlvblBlcmZUaW1lU3RhbXBXcml0ZXMgPSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5U2V0LFxyXG4gICAgICAgICAgICBiZWdpbm5pbmdPZlBhc3NXcml0ZUluZGV4OiAwLFxyXG4gICAgICAgICAgICBlbmRPZlBhc3NXcml0ZUluZGV4OiAxLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJlbmRlclBlcmZUaW1lU3RhbXBXcml0ZXMgPSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5U2V0LFxyXG4gICAgICAgICAgICBiZWdpbm5pbmdPZlBhc3NXcml0ZUluZGV4OiAyLFxyXG4gICAgICAgICAgICBlbmRPZlBhc3NXcml0ZUluZGV4OiAzLFxyXG4gICAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzaW11bGF0aW9uUGFyYW1ldGVycy53aWR0aCA9IGNhbnZhcy53aWR0aDtcclxuICAgIHNpbXVsYXRpb25QYXJhbWV0ZXJzLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XHJcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdwdScpIGFzIHVua25vd24gYXMgR1BVQ2FudmFzQ29udGV4dDtcclxuICAgIGNvbnN0IHByZXNlbnRhdGlvbkZvcm1hdCA9IG5hdmlnYXRvci5ncHUuZ2V0UHJlZmVycmVkQ2FudmFzRm9ybWF0KCk7XHJcbiAgICBjb250ZXh0LmNvbmZpZ3VyZSh7XHJcbiAgICAgICAgZGV2aWNlLFxyXG4gICAgICAgIGZvcm1hdDogcHJlc2VudGF0aW9uRm9ybWF0LFxyXG4gICAgICAgIGFscGhhTW9kZTogJ3ByZW11bHRpcGxpZWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwaGVyb21vbmVUZXh0dXJlcyA9IFtcclxuICAgICAgICBkZXZpY2UuY3JlYXRlVGV4dHVyZSh7XHJcbiAgICAgICAgICAgIHNpemU6IFtjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHRdLFxyXG4gICAgICAgICAgICBmb3JtYXQ6ICAncmdiYTh1bm9ybScsXHJcbiAgICAgICAgICAgIHVzYWdlOiBcclxuICAgICAgICAgICAgICAgIEdQVVRleHR1cmVVc2FnZS5URVhUVVJFX0JJTkRJTkcgfFxyXG4gICAgICAgICAgICAgICAgR1BVVGV4dHVyZVVzYWdlLlNUT1JBR0VfQklORElOR1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGRldmljZS5jcmVhdGVUZXh0dXJlKHtcclxuICAgICAgICAgICAgc2l6ZTogW2NhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodF0sXHJcbiAgICAgICAgICAgIGZvcm1hdDogICdyZ2JhOHVub3JtJyxcclxuICAgICAgICAgICAgdXNhZ2U6IFxyXG4gICAgICAgICAgICAgICAgR1BVVGV4dHVyZVVzYWdlLlRFWFRVUkVfQklORElORyB8XHJcbiAgICAgICAgICAgICAgICBHUFVUZXh0dXJlVXNhZ2UuU1RPUkFHRV9CSU5ESU5HXHJcbiAgICAgICAgfSksXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IGFnZW50c0J1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgIGxhYmVsOiBcImFnZW50c1wiLFxyXG4gICAgICAgIHNpemU6IDE2ICogc2ltdWxhdGlvblBhcmFtZXRlcnMuYWdlbnRDb3VudCxcclxuICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuU1RPUkFHRSxcclxuICAgICAgICBtYXBwZWRBdENyZWF0aW9uOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICBuZXcgRmxvYXQzMkFycmF5KGFnZW50c0J1ZmZlci5nZXRNYXBwZWRSYW5nZSgpKS5zZXQoZ2V0QWdlbnRzQXJyYXkoc2ltdWxhdGlvblBhcmFtZXRlcnMpKTtcclxuICAgIGFnZW50c0J1ZmZlci51bm1hcCgpO1xyXG5cclxuICAgIGNvbnN0IHRleHR1cmVQYXNzID0gbmV3IFRleHR1cmVQYXNzKGRldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnMsIHBoZXJvbW9uZVRleHR1cmVzWzBdLmZvcm1hdClcclxuXHJcbiAgICBjb25zdCBzaW11bGF0aW9uUGFzcyA9IG5ldyBTaW11bGF0aW9uUGFzcyhkZXZpY2UsIHNpbXVsYXRpb25QYXJhbWV0ZXJzLCBwaGVyb21vbmVUZXh0dXJlc1swXS5mb3JtYXQsIGFnZW50c0J1ZmZlcik7XHJcblxyXG4gICAgY29uc3QgcmVuZGVyUGFzcyA9IG5ldyBSZW5kZXJQYXNzKGRldmljZSwgcGhlcm9tb25lVGV4dHVyZXNbMF0uZm9ybWF0KTtcclxuXHJcbiAgICBsZXQgcGhlcm9tb25lSW5kZXggPSAwO1xyXG4gICAgZnJhbWUgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZEVuY29kZXIgPSBkZXZpY2UuY3JlYXRlQ29tbWFuZEVuY29kZXIoKTtcclxuICAgICAgICBjb25zdCB0ZXh0dXJlSW5JbmRleCA9IHBoZXJvbW9uZUluZGV4O1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmVPdXRJbmRleCA9IChwaGVyb21vbmVJbmRleCArIDEpICUgMlxyXG4gICAgICAgIFxyXG4gICAgICAgIHRleHR1cmVQYXNzLmFkZFBhc3MoY29tbWFuZEVuY29kZXIsIHBoZXJvbW9uZVRleHR1cmVzW3RleHR1cmVJbkluZGV4XSwgcGhlcm9tb25lVGV4dHVyZXNbdGV4dHVyZU91dEluZGV4XSlcclxuXHJcbiAgICAgICAgc2ltdWxhdGlvblBhc3MuYWRkUGFzcyhjb21tYW5kRW5jb2RlciwgcGhlcm9tb25lVGV4dHVyZXNbdGV4dHVyZUluSW5kZXhdLCBwaGVyb21vbmVUZXh0dXJlc1t0ZXh0dXJlT3V0SW5kZXhdLCBzaW11bGF0aW9uUGVyZlRpbWVTdGFtcFdyaXRlcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbnZhc1RleHR1cmVWaWV3ID0gY29udGV4dC5nZXRDdXJyZW50VGV4dHVyZSgpLmNyZWF0ZVZpZXcoKTtcclxuICAgICAgICByZW5kZXJQYXNzLmFkZFBhc3MoY29tbWFuZEVuY29kZXIsIHBoZXJvbW9uZVRleHR1cmVzW3BoZXJvbW9uZUluZGV4XSwgY2FudmFzVGV4dHVyZVZpZXcsIHJlbmRlclBlcmZUaW1lU3RhbXBXcml0ZXMpO1xyXG4gICAgICAgIHBoZXJvbW9uZUluZGV4ID0gdGV4dHVyZU91dEluZGV4O1xyXG5cclxuICAgICAgICBsZXQgcmVzdWx0QnVmZmVyOiBHUFVCdWZmZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKGhhc1RpbWVzdGFtcFF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdEJ1ZmZlciA9IHNwYXJlUGVyZlRpbWVCdWZmZXJzLnBvcCgpIHx8IFxyXG4gICAgICAgICAgICAgICAgZGV2aWNlLmNyZWF0ZUJ1ZmZlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogNCAqIEJpZ0ludDY0QXJyYXkuQllURVNfUEVSX0VMRU1FTlQgKiBOVU1CRVJfT0ZfUEFTU0VTLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZS5DT1BZX0RTVCB8IEdQVUJ1ZmZlclVzYWdlLk1BUF9SRUFELFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbW1hbmRFbmNvZGVyLnJlc29sdmVRdWVyeVNldChxdWVyeVNldCwgMCwgMiAqIE5VTUJFUl9PRl9QQVNTRVMsIHBlcmZSZXNvbHZlQnVmZmVyLCAwKTtcclxuICAgICAgICAgICAgY29tbWFuZEVuY29kZXIuY29weUJ1ZmZlclRvQnVmZmVyKFxyXG4gICAgICAgICAgICAgICAgcGVyZlJlc29sdmVCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0QnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIHJlc3VsdEJ1ZmZlci5zaXplXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZXZpY2UucXVldWUuc3VibWl0KFtjb21tYW5kRW5jb2Rlci5maW5pc2goKV0pO1xyXG5cclxuICAgICAgICBpZiAoaGFzVGltZXN0YW1wUXVlcnkpIHtcclxuICAgICAgICAgICAgcmVzdWx0QnVmZmVyLm1hcEFzeW5jKEdQVU1hcE1vZGUuUkVBRCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lcyA9IG5ldyBCaWdJbnQ2NEFycmF5KHJlc3VsdEJ1ZmZlci5nZXRNYXBwZWRSYW5nZSgpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNpbXVsYXRpb25EdXJhdGlvbiA9IE51bWJlcih0aW1lc1sxXSAtIHRpbWVzWzBdKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbmRlckR1cmF0aW9uID0gTnVtYmVyKHRpbWVzWzNdIC0gdGltZXNbMl0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpbXVsYXRpb25EdXJhdGlvbiA+IDAgJiYgcmVuZGVyRHVyYXRpb24gPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2ltdWxhdGlvbkR1cmF0aW9uU3VtICs9IHNpbXVsYXRpb25EdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXJEdXJhdGlvblN1bSArPSByZW5kZXJEdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lclNhbXBsZXMrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdEJ1ZmZlci51bm1hcCgpO1xyXG4gICAgICAgICAgICAgICAgc3BhcmVQZXJmVGltZUJ1ZmZlcnMucHVzaChyZXN1bHRCdWZmZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGtOdW1UaW1lclNhbXBsZXNQZXJVcGRhdGUgPSAxMDA7XHJcbiAgICAgICAgICAgICAgICBpZiAodGltZXJTYW1wbGVzID49IGtOdW1UaW1lclNhbXBsZXNQZXJVcGRhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdmdTaW11bGF0aW9uTWljcm9zZWNvbmRzID0gTWF0aC5yb3VuZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2ltdWxhdGlvbkR1cmF0aW9uU3VtIC8gdGltZXJTYW1wbGVzIC8gMTAwMFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXZnUmVuZGVyTWljcm9zZWNvbmRzID0gTWF0aC5yb3VuZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyRHVyYXRpb25TdW0gLyB0aW1lclNhbXBsZXMgLyAxMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBwZXJmRGlzcGxheS50ZXh0Q29udGVudCA9IGBcXFxyXG5hdmcgc2ltdWxhdGlvbiBkdXJhdGlvbjogJHthdmdTaW11bGF0aW9uTWljcm9zZWNvbmRzfcK1c1xyXG5hdmcgcmVuZGVyIGR1cmF0aW9uOiAgJHthdmdSZW5kZXJNaWNyb3NlY29uZHN9wrVzXHJcbnNwYXJlIHBlcmYgYnVmZmVyczogICAgJHtzcGFyZVBlcmZUaW1lQnVmZmVycy5sZW5ndGh9YDtcclxuICAgICAgICAgICAgICAgICAgICBzaW11bGF0aW9uRHVyYXRpb25TdW0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckR1cmF0aW9uU3VtID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lclNhbXBsZXMgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhdGVzdEZyYW1lSGFuZGxlID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcclxuICAgIH07XHJcbiAgICBsYXRlc3RGcmFtZUhhbmRsZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVQYXVzZSgpOiBib29sZWFuIHtcclxuICAgIGlmIChsYXRlc3RGcmFtZUhhbmRsZSAhPSAwKSB7XHJcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUobGF0ZXN0RnJhbWVIYW5kbGUpO1xyXG4gICAgICAgIGxhdGVzdEZyYW1lSGFuZGxlID0gMDtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxhdGVzdEZyYW1lSGFuZGxlID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0KCkge1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUobGF0ZXN0RnJhbWVIYW5kbGUpO1xyXG4gICAgc3RhcnQoKTtcclxufSIsImltcG9ydCBzaGFkZXJDb2RlIGZyb20gXCIuL3NoYWRlcnMvcmVuZGVyLndnc2xcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFJlbmRlclBhc3Mge1xyXG4gICAgZGV2aWNlOiBHUFVEZXZpY2U7XHJcbiAgICBiaW5kR3JvdXA6IEdQVUJpbmRHcm91cDtcclxuICAgIHBpcGVsaW5lOiBHUFVSZW5kZXJQaXBlbGluZTtcclxuICAgIHNhbXBsZXI6IEdQVVNhbXBsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGV2aWNlOiBHUFVEZXZpY2UsIHRleHR1cmVGb3JtYXQ6IEdQVVRleHR1cmVGb3JtYXQpIHtcclxuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcclxuICAgICAgICB0aGlzLnNhbXBsZXIgPSBkZXZpY2UuY3JlYXRlU2FtcGxlcih7XHJcbiAgICAgICAgICAgIG1pbkZpbHRlcjogXCJsaW5lYXJcIixcclxuICAgICAgICAgICAgbWFnRmlsdGVyOiBcImxpbmVhclwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlckJpbmRHcm91cExheW91dCA9IGRldmljZS5jcmVhdGVCaW5kR3JvdXBMYXlvdXQoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJSZW5kZXIgQmluZCBHcm91cCBMYXlvdXRcIixcclxuICAgICAgICAgICAgZW50cmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuRlJBR01FTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJyZWFkLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkZSQUdNRU5ULFxyXG4gICAgICAgICAgICAgICAgICAgIHNhbXBsZXI6IHRoaXMuc2FtcGxlcixcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSBhcyBHUFVCaW5kR3JvdXBMYXlvdXRFbnRyeVtdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclNoYWRlck1vZHVsZSA9IGRldmljZS5jcmVhdGVTaGFkZXJNb2R1bGUoe1xyXG4gICAgICAgICAgICBjb2RlOiBzaGFkZXJDb2RlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBkZXZpY2UuY3JlYXRlUmVuZGVyUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJSZW5kZXIgUGlwZWxpbmVcIixcclxuICAgICAgICAgICAgbGF5b3V0OiBkZXZpY2UuY3JlYXRlUGlwZWxpbmVMYXlvdXQoe1xyXG4gICAgICAgICAgICAgICAgYmluZEdyb3VwTGF5b3V0czogW3JlbmRlckJpbmRHcm91cExheW91dF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB2ZXJ0ZXg6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogcmVuZGVyU2hhZGVyTW9kdWxlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmcmFnbWVudDoge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiByZW5kZXJTaGFkZXJNb2R1bGUsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IG5hdmlnYXRvci5ncHUuZ2V0UHJlZmVycmVkQ2FudmFzRm9ybWF0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByaW1pdGl2ZToge1xyXG4gICAgICAgICAgICAgICAgdG9wb2xvZ3k6ICd0cmlhbmdsZS1saXN0JyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhc3MoY29tbWFuZEVuY29kZXI6IEdQVUNvbW1hbmRFbmNvZGVyLCBwaGVyb21vbmVUZXh0dXJlOiBHUFVUZXh0dXJlLCB0YXJnZXRWaWV3OiBHUFVUZXh0dXJlVmlldywgdGltZXN0YW1wV3JpdGVzPzogR1BVUmVuZGVyUGFzc1RpbWVzdGFtcFdyaXRlcyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclBhc3NEZXNjcmlwdG9yOiBHUFVSZW5kZXJQYXNzRGVzY3JpcHRvciA9IHtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50czogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IHRhcmdldFZpZXcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJWYWx1ZTogWzAsIDAsIDAsIDFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRPcDogJ2NsZWFyJyxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZU9wOiAnc3RvcmUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSBhcyBHUFVSZW5kZXJQYXNzQ29sb3JBdHRhY2htZW50W10sXHJcbiAgICAgICAgICAgIHRpbWVzdGFtcFdyaXRlc1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFRPRE8gLSBpcyByZWNyZWF0aW5nIHRoZSBiaW5kIGdyb3VwIHdpdGggYSB0ZXh0dXJlIHN3YXAgZmFzdGVyIHRoYW4gY29weWluZyB0ZXh0dXJlIGRhdGEgYmFjayBhbmQgZm9ydGg/XHJcbiAgICAgICAgdGhpcy5iaW5kR3JvdXAgPSB0aGlzLmRldmljZS5jcmVhdGVCaW5kR3JvdXAoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJSZW5kZXIgQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMucGlwZWxpbmUuZ2V0QmluZEdyb3VwTGF5b3V0KDApLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogcGhlcm9tb25lVGV4dHVyZS5jcmVhdGVWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHRoaXMuc2FtcGxlcixcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgcGFzc0VuY29kZXIgPSBjb21tYW5kRW5jb2Rlci5iZWdpblJlbmRlclBhc3MocmVuZGVyUGFzc0Rlc2NyaXB0b3IpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLnNldFBpcGVsaW5lKHRoaXMucGlwZWxpbmUpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLnNldEJpbmRHcm91cCgwLCB0aGlzLmJpbmRHcm91cCk7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuZHJhdyg2KTtcclxuICAgICAgICBwYXNzRW5jb2Rlci5lbmQoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlYzMgfSBmcm9tIFwid2dwdS1tYXRyaXhcIjtcclxuaW1wb3J0IHsgdG9nZ2xlUGF1c2UsIHJlc2V0LCBzdGFydCB9IGZyb20gXCIuL21haW5cIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBoZXJvbW9uZUxheWVyIHtcclxuICAgIGNvbG9yOiBWZWMzXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNpbXVsYXRpb25QYXJhbWV0ZXJzIHtcclxuICAgIGFnZW50Q291bnQ6IG51bWJlclxyXG4gICAgd2lkdGg6IG51bWJlcixcclxuICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgdHVybkppdHRlcjogbnVtYmVyLFxyXG4gICAgc3RlZXJGYWN0b3I6IG51bWJlcixcclxuICAgIHNwZWVkOiBudW1iZXIsXHJcbiAgICBhY2NlbGVyYXRpb246IG51bWJlcixcclxuICAgIHNhbXBsZURpc3RhbmNlOiBudW1iZXIsXHJcbiAgICBzYW1wbGVBbmdsZTogbnVtYmVyLFxyXG4gICAgcGFzc2l2ZUF0dGVudWF0aW9uOiBudW1iZXIsXHJcbiAgICBnYXVzc2lhblN0ZERldjogbnVtYmVyLFxyXG4gICAgd3JhcDogYm9vbGVhbixcclxuICAgIHBoZXJvbW9uZV9sYXllcnM6IElQaGVyb21vbmVMYXllcltdXHJcbn1cclxuXHJcblxyXG5leHBvcnQgbGV0IHNpbXVsYXRpb25QYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnMgPSB7XHJcbiAgICBhZ2VudENvdW50OiAxMDBfMDAwLFxyXG4gICAgaGVpZ2h0OiAwLFxyXG4gICAgd2lkdGg6IDAsXHJcblxyXG4gICAgdHVybkppdHRlcjogLjYsXHJcbiAgICBzdGVlckZhY3RvcjogLjYsXHJcbiAgICBzcGVlZDogLjgsXHJcbiAgICBhY2NlbGVyYXRpb246IC4zLFxyXG4gICAgc2FtcGxlRGlzdGFuY2U6IDE3LFxyXG4gICAgc2FtcGxlQW5nbGU6IC40LFxyXG4gICAgcGFzc2l2ZUF0dGVudWF0aW9uOiAwLjAxLFxyXG4gICAgZ2F1c3NpYW5TdGREZXY6IC40LFxyXG4gICAgd3JhcDogdHJ1ZSxcclxuICAgIHBoZXJvbW9uZV9sYXllcnM6IFtdXHJcbn1cclxuY29uc3QgZGVmYXVsdFBhcmFtcyA9IHN0cnVjdHVyZWRDbG9uZShzaW11bGF0aW9uUGFyYW1ldGVycyk7XHJcblxyXG5jb25zdCBhbmltYWxOYW1lczogc3RyaW5nW10gPSBbXHJcbiAgICBcIlRpZ2VyXCIsXHJcbiAgICBcIlNwaWRlclwiLFxyXG4gICAgXCJCZWFyXCIsXHJcbiAgICBcIkxpb25cIixcclxuICAgIFwiRWxlcGhhbnRcIixcclxuICAgIFwiR2lyYWZmZVwiLFxyXG4gICAgXCJXb2xmXCIsXHJcbiAgICBcIkZveFwiLFxyXG4gICAgXCJSYWJiaXRcIixcclxuICAgIFwiS2FuZ2Fyb29cIixcclxuICAgIFwiWmVicmFcIixcclxuICAgIFwiRGVlclwiLFxyXG4gICAgXCJMZW9wYXJkXCIsXHJcbiAgICBcIlBhbnRoZXJcIixcclxuICAgIFwiQ2hlZXRhaFwiLFxyXG4gICAgXCJFYWdsZVwiLFxyXG4gICAgXCJGYWxjb25cIixcclxuICAgIFwiSGF3a1wiLFxyXG4gICAgXCJPd2xcIixcclxuICAgIFwiUGVuZ3VpblwiLFxyXG4gICAgXCJCZWV0bGVcIixcclxuICAgIFwiRG9scGhpblwiLFxyXG4gICAgXCJTaGFya1wiLFxyXG4gICAgXCJXaGFsZVwiLFxyXG4gICAgXCJPY3RvcHVzXCIsXHJcbiAgICBcIkxvYnN0ZXJcIixcclxuICAgIFwiQ3JhYlwiLFxyXG4gICAgXCJIb3JzZVwiLFxyXG4gICAgXCJDb3dcIixcclxuICAgIFwiR29hdFwiLFxyXG4gICAgXCJTaGVlcFwiLFxyXG4gICAgXCJDaGlja2VuXCIsXHJcbiAgICBcIkR1Y2tcIixcclxuICAgIFwiR29vc2VcIixcclxuICAgIFwiVHVya2V5XCIsXHJcbiAgICBcIlBlYWNvY2tcIixcclxuICAgIFwiQmF0XCIsXHJcbiAgICBcIlJhdFwiLFxyXG4gICAgXCJNb3VzZVwiLFxyXG4gICAgXCJTcXVpcnJlbFwiLFxyXG4gICAgXCJDaGlwbXVua1wiLFxyXG4gICAgXCJNb29zZVwiLFxyXG4gICAgXCJCaXNvblwiLFxyXG4gICAgXCJBbnRlbG9wZVwiLFxyXG4gICAgXCJDcm9jb2RpbGVcIixcclxuICAgIFwiQWxsaWdhdG9yXCIsXHJcbiAgICBcIlRvcnRvaXNlXCIsXHJcbiAgICBcIkZyb2dcIixcclxuICAgIFwiVG9hZFwiLFxyXG4gICAgXCJTbmFrZVwiLFxyXG4gICAgXCJMaXphcmRcIixcclxuICAgIFwiQW50XCJcclxuXTsgIFxyXG5cclxubGV0IGNvbmZpZ1RhYmxlOiBIVE1MVGFibGVFbGVtZW50O1xyXG5sZXQgc2hvd0NvbmZpZyA9IGZhbHNlO1xyXG5cclxudHlwZSBjb29raWVUeXBlID0ge1tOYW1lOiBzdHJpbmddOiBJU2ltdWxhdGlvblBhcmFtZXRlcnN9O1xyXG5cclxubGV0IHNhdmVkQ29va2llczogY29va2llVHlwZSA9IHt9O1xyXG5cclxuZnVuY3Rpb24gbG9hZENvb2tpZSgpIHtcclxuICAgIGNvbnN0IGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoXCI7IFwiKTtcclxuICAgIGNvb2tpZXMuZm9yRWFjaChjb29raWUgPT4ge1xyXG4gICAgICAgIGlmIChjb29raWUuc3RhcnRzV2l0aChcInNhdmVkQ29uZmlnc1wiKSkge1xyXG4gICAgICAgICAgICBzYXZlZENvb2tpZXMgPSBKU09OLnBhcnNlKGNvb2tpZS5zcGxpdChcInNhdmVkQ29uZmlnczogXCIpWzFdKSBhcyBjb29raWVUeXBlO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlQ29va2llKCkge1xyXG4gICAgZG9jdW1lbnQuY29va2llID0gXCJzYXZlZENvbmZpZ3M6IFwiK0pTT04uc3RyaW5naWZ5KHNhdmVkQ29va2llcyk7XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuICAgIGNvbmZpZ1RhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25maWdUYWJsZVwiKSBhcyBIVE1MVGFibGVFbGVtZW50O1xyXG4gICAgbGV0IHNhdmVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmVDb25maWdcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBsb2FkQ29va2llKCk7XHJcbiAgICBjb25zdCBjb25maWdPcHRpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlZENvbmZpZ3NcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgICBjb25zdCBjb25maWdOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25maWdOYW1lXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBjb25maWdPcHRpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGNvbmZpZ09wdGlvbnMudmFsdWUgPT0gXCIrQ3JlYXRlIE5ld1wiKSB7XHJcbiAgICAgICAgICAgIGxldCByYW5kb21BbmltYWwgPSBhbmltYWxOYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhbmltYWxOYW1lcy5sZW5ndGgpXTtcclxuICAgICAgICAgICAgd2hpbGUgKHNhdmVkQ29va2llc1tyYW5kb21BbmltYWxdICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmFuZG9tQW5pbWFsID0gYW5pbWFsTmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYW5pbWFsTmFtZXMubGVuZ3RoKV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uZmlnT3B0aW9ucy5wcmVwZW5kKG5ldyBPcHRpb24ocmFuZG9tQW5pbWFsKSk7XHJcbiAgICAgICAgICAgIHNhdmVkQ29va2llc1tyYW5kb21BbmltYWxdID0gc3RydWN0dXJlZENsb25lKHNpbXVsYXRpb25QYXJhbWV0ZXJzKTtcclxuICAgICAgICAgICAgY29uZmlnT3B0aW9ucy5zZWxlY3RlZEluZGV4ID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZ09wdGlvbnMudmFsdWUgPT0gXCJEZWZhdWx0XCIpIHtcclxuICAgICAgICAgICAgc2V0U2ltdWxhdGlvblBhcmFtcyhkZWZhdWx0UGFyYW1zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRTaW11bGF0aW9uUGFyYW1zKHNhdmVkQ29va2llc1tjb25maWdPcHRpb25zLnZhbHVlXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbmZpZ05hbWUudmFsdWUgPSBjb25maWdPcHRpb25zLnZhbHVlO1xyXG4gICAgICAgIHN3aXRjaCAoY29uZmlnTmFtZS52YWx1ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVmYXVsdFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiK0NyZWF0ZSBOZXdcIjoge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ05hbWUuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ05hbWUucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmb3IgKGxldCBjb29raWVOYW1lIGluIHNhdmVkQ29va2llcykge1xyXG4gICAgICAgIGNvbmZpZ09wdGlvbnMuYXBwZW5kQ2hpbGQobmV3IE9wdGlvbihjb29raWVOYW1lKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHNhdmVkQ29va2llcykubGVuZ3RoIDwgYW5pbWFsTmFtZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uZmlnT3B0aW9ucy5hcHBlbmRDaGlsZChuZXcgT3B0aW9uKFwiK0NyZWF0ZSBOZXdcIikpOyAgIFxyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxuICAgIHNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBsZXQgbmFtZSA9IGNvbmZpZ05hbWUudmFsdWU7XHJcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZWZhdWx0XCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCIrQ3JlYXRlIE5ld1wiOiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkID0gY29uZmlnT3B0aW9ucy52YWx1ZTtcclxuICAgICAgICBpZiAoY29uZmlnT3B0aW9ucy52YWx1ZSAhPSBuYW1lKSB7XHJcbiAgICAgICAgICAgIHNhdmVkQ29va2llc1tuYW1lXSA9IHN0cnVjdHVyZWRDbG9uZShzaW11bGF0aW9uUGFyYW1ldGVycyk7XHJcbiAgICAgICAgICAgIGNvbmZpZ09wdGlvbnMub3B0aW9ucy5pdGVtKGNvbmZpZ09wdGlvbnMuc2VsZWN0ZWRJbmRleCkuaW5uZXJUZXh0ID0gbmFtZTtcclxuICAgICAgICAgICAgZGVsZXRlIHNhdmVkQ29va2llc1tzZWxlY3RlZF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNhdmVkQ29va2llc1tuYW1lXSA9IHN0cnVjdHVyZWRDbG9uZShzaW11bGF0aW9uUGFyYW1ldGVycyk7XHJcbiAgICAgICAgc2F2ZUNvb2tpZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IHNob3dCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dcIik7XHJcbiAgICBsZXQgY29uZmlnRmx5b3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25maWdGbHlvdXRcIik7XHJcbiAgICBzaG93QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHNob3dDb25maWcpIHtcclxuICAgICAgICAgICAgc2hvd0NvbmZpZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzaG93QnV0dG9uLmlubmVyVGV4dCA9IFwiSGlkZSBDb25maWdcIjtcclxuICAgICAgICAgICAgY29uZmlnRmx5b3V0LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNob3dDb25maWcgPSB0cnVlO1xyXG4gICAgICAgICAgICBzaG93QnV0dG9uLmlubmVyVGV4dCA9IFwiU2hvdyBDb25maWdcIjtcclxuICAgICAgICAgICAgY29uZmlnRmx5b3V0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGFkZFNsaWRlcihcIkppdHRlclwiLCBcInR1cm5KaXR0ZXJcIiwgMCwgMS41LCAuMDUsXHJcbiAgICAgICAgXCJIb3cgbXVjaCBkbyBhbnRzIHJhbmRvbWx5IGNoYW5nZSBkaXJlY3Rpb25cIlxyXG4gICAgKTtcclxuICAgIGFkZFNsaWRlcihcIlN0ZWVyaW5nXCIsIFwic3RlZXJGYWN0b3JcIiwgLTEsIDEsIC4wNSwgXHJcbiAgICAgICAgXCJIb3cgbXVjaCBkbyBhbnRzIHN0ZWVyIHRvd2FyZHMgZGV0ZWN0ZWQgcGhlcm9tb25lc1wiXHJcbiAgICApO1xyXG4gICAgYWRkU2xpZGVyKFwiU3BlZWRcIiwgXCJzcGVlZFwiLCAuMSwgMiwgLjEsIFxyXG4gICAgICAgIFwiSG93IGZhc3QgdGhleSBnb1wiXHJcbiAgICApO1xyXG4gICAgYWRkU2xpZGVyKFwiQWNjZWxlcmF0aW9uXCIsIFwiYWNjZWxlcmF0aW9uXCIsIC0xLCAyLCAuMSxcclxuICAgICAgICBcIkhvdyBtdWNoIGRvIGFudHMgc3BlZWQgdXAgd2hlbiB0aGV5IGRldGVjdCBwaGVyb21vbmVzIGluIGZyb250IG9mIHRoZW1cIlxyXG4gICAgKTsgIFxyXG4gICAgYWRkU2xpZGVyKFwiRGV0ZWN0aW9uIERpc3RhbmNlXCIsIFwic2FtcGxlRGlzdGFuY2VcIiwgMSwgNzUsIDEsXHJcbiAgICAgICAgXCJIb3cgbWFueSBwaXhlbHMgYXdheSBjYW4gYW50cyBkZXRlY3QgcGhlcm9tb25lc1wiXHJcbiAgICApOyAgXHJcbiAgICBhZGRTbGlkZXIoXCJEZXRlY3Rpb24gQW5nbGVcIiwgXCJzYW1wbGVBbmdsZVwiLCAwLjEsIDIsIC4xLFxyXG4gICAgICAgIFwiQW5nbGUgYXdheSBmcm9tIGNlbnRlciB0byBzYW1wbGUgZm9yIHBoZXJvbW9uZXMgaW4gcmFkaWFuc1wiXHJcbiAgICApOyAgXHJcbiAgICBhZGRTbGlkZXIoXCJQaGVyb21vbmUgQmx1clwiLCBcImdhdXNzaWFuU3RkRGV2XCIsIDAsIC41LCAuMDA1LFxyXG4gICAgICAgIFwiSG93IHF1aWNrbHkgcGhlcm9tb25lcyBkaWZmdXNlIGJ5IGNoYW5naW5nIHRoZSBzdGQgZGV2aWF0aW9uIG9mIGEgZ2F1c3NpYW4gZGlzdHJpYnV0aW9uXCJcclxuICAgICk7XHJcbiAgICBhZGRTbGlkZXIoXCJQaGVyb21vbmUgRmFkZVwiLCBcInBhc3NpdmVBdHRlbnVhdGlvblwiLCAwLjAwMiwgLjA1LCAuMDAxLFxyXG4gICAgICAgIFwiQW1vdW50IGJ5IHdoaWNoIGFsbCBwaGVyb21vbmVzIGFyZSBkZWNyZWFzZWQgZWFjaCBmcmFtZVwiXHJcbiAgICApO1xyXG4gICAgYWRkQ2hlY2tib3goXCJXcmFwIEFyb3VuZFwiLCBcIndyYXBcIixcclxuICAgICAgICBcIldoZXRoZXIgYW50cyBib3VuY2Ugb2ZmIHRoZSBlZGdlcyBvciB3cmFwIGFyb3VuZCB0byB0aGUgb3RoZXIgc2lkZVwiXHJcbiAgICApO1xyXG4gICAgXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc2V0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZXNldCk7XHJcbiAgICBsZXQgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdXNlXCIpO1xyXG4gICAgcGF1c2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBsZXQgaXNQbGF5aW5nID0gdG9nZ2xlUGF1c2UoKTtcclxuICAgICAgICBwYXVzZUJ1dHRvbi5pbm5lclRleHQgPSBpc1BsYXlpbmcgPyBcIlBhdXNlXCIgOiBcIlVucGF1c2VcIjtcclxuICAgIH0pO1xyXG5cclxuICAgIHN0YXJ0KCk7XHJcbn0pOyBcclxuXHJcbmludGVyZmFjZSBJU2ltQ29udHJvbDxUPiB7XHJcbiAgICBrZXk6IGtleW9mIElTaW11bGF0aW9uUGFyYW1ldGVycyxcclxuICAgIHVwZGF0ZXI6ICh2YWx1ZTogVCkgPT4gdm9pZFxyXG59XHJcbmNvbnN0IGNvbnRyb2xzOiBJU2ltQ29udHJvbDx1bmtub3duPltdID0gW11cclxuXHJcbmZ1bmN0aW9uIHNldFNpbXVsYXRpb25QYXJhbXMobmV3UGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzKSB7XHJcbiAgICBPYmplY3QuYXNzaWduKHNpbXVsYXRpb25QYXJhbWV0ZXJzLCBuZXdQYXJhbWV0ZXJzKTtcclxuICAgIGNvbnRyb2xzLmZvckVhY2goY29udHJvbCA9PiBjb250cm9sLnVwZGF0ZXIoc2ltdWxhdGlvblBhcmFtZXRlcnNbY29udHJvbC5rZXldKSk7XHJcbn1cclxuXHJcbnR5cGUgVHlwZWRLZXlzPFQsIFY+ID0ge1xyXG4gICAgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBWID8gSyA6IG5ldmVyO1xyXG59W2tleW9mIFRdXHJcblxyXG5mdW5jdGlvbiBhZGRTbGlkZXIobmFtZTogc3RyaW5nLCBjb25maWdLZXk6IFR5cGVkS2V5czxJU2ltdWxhdGlvblBhcmFtZXRlcnMsIG51bWJlcj4sIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlciwgc3RlcDogbnVtYmVyLCB0b29sdGlwOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNsaWRlckxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgc2xpZGVyTGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIG5hbWUpO1xyXG4gICAgc2xpZGVyTGFiZWwuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgdG9vbHRpcCk7XHJcbiAgICBzbGlkZXJMYWJlbC5pbm5lclRleHQgPSBuYW1lO1xyXG4gICAgY29uc3Qgc2xpZGVySW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBzbGlkZXJJbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBuYW1lKTtcclxuICAgIHNsaWRlcklucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJyYW5nZVwiKTtcclxuICAgIHNsaWRlcklucHV0LnNldEF0dHJpYnV0ZShcIm1pblwiLCBTdHJpbmcobWluKSk7XHJcbiAgICBzbGlkZXJJbnB1dC5zZXRBdHRyaWJ1dGUoXCJtYXhcIiwgU3RyaW5nKG1heCkpO1xyXG4gICAgc2xpZGVySW5wdXQuc2V0QXR0cmlidXRlKFwic3RlcFwiLCBTdHJpbmcoc3RlcCkpO1xyXG4gICAgc2xpZGVySW5wdXQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgU3RyaW5nKHNpbXVsYXRpb25QYXJhbWV0ZXJzW2NvbmZpZ0tleV0pKTtcclxuICAgIGNvbnN0IHNsaWRlckRpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICAgIHRhYmxlUm93LmFwcGVuZChcclxuICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIikuYXBwZW5kQ2hpbGQoc2xpZGVyTGFiZWwpLnBhcmVudEVsZW1lbnQsXHJcbiAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpLmFwcGVuZENoaWxkKHNsaWRlcklucHV0KS5wYXJlbnRFbGVtZW50LFxyXG4gICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKS5hcHBlbmRDaGlsZChzbGlkZXJEaXNwbGF5KS5wYXJlbnRFbGVtZW50LFxyXG4gICAgKTtcclxuICAgIGNvbmZpZ1RhYmxlLmFwcGVuZENoaWxkKHRhYmxlUm93KTtcclxuXHJcbiAgICBjb25zdCBvblVwZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBzaW11bGF0aW9uUGFyYW1ldGVyc1tjb25maWdLZXldID0gTnVtYmVyKHNsaWRlcklucHV0LnZhbHVlKTtcclxuICAgICAgICBzbGlkZXJEaXNwbGF5LmlubmVyVGV4dCA9IHNsaWRlcklucHV0LnZhbHVlO1xyXG4gICAgfTtcclxuICAgIG9uVXBkYXRlKCk7XHJcbiAgICBzbGlkZXJJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgb25VcGRhdGUpO1xyXG4gICAgY29udHJvbHMucHVzaCh7a2V5OiBjb25maWdLZXksIHVwZGF0ZXI6ICh2YWx1ZTogTnVtYmVyKSA9PiB7XHJcbiAgICAgICAgc2xpZGVySW5wdXQudmFsdWUgPSBTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgIHNsaWRlckRpc3BsYXkuaW5uZXJUZXh0ID0gc2xpZGVySW5wdXQudmFsdWUgXHJcbiAgICB9fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZENoZWNrYm94KG5hbWU6IHN0cmluZywgY29uZmlnS2V5OiBUeXBlZEtleXM8SVNpbXVsYXRpb25QYXJhbWV0ZXJzLCBib29sZWFuPiwgdG9vbHRpcDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGxhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBuYW1lKTtcclxuICAgIGxhYmVsLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIHRvb2x0aXApO1xyXG4gICAgbGFiZWwuaW5uZXJUZXh0ID0gbmFtZTtcclxuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgbmFtZSk7XHJcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiY2hlY2tib3hcIik7XHJcbiAgICBpbnB1dC5jaGVja2VkID0gc2ltdWxhdGlvblBhcmFtZXRlcnNbY29uZmlnS2V5XTtcclxuXHJcbiAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICAgIHRhYmxlUm93LmFwcGVuZChcclxuICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIikuYXBwZW5kQ2hpbGQobGFiZWwpLnBhcmVudEVsZW1lbnQsXHJcbiAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpLmFwcGVuZENoaWxkKGlucHV0KS5wYXJlbnRFbGVtZW50LFxyXG4gICAgKTtcclxuICAgIGNvbmZpZ1RhYmxlLmFwcGVuZENoaWxkKHRhYmxlUm93KTtcclxuXHJcbiAgICBjb25zdCBvblVwZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBzaW11bGF0aW9uUGFyYW1ldGVyc1tjb25maWdLZXldID0gaW5wdXQuY2hlY2tlZDtcclxuICAgIH07XHJcbiAgICBvblVwZGF0ZSgpO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIG9uVXBkYXRlKTtcclxuICAgIGNvbnRyb2xzLnB1c2goe2tleTogY29uZmlnS2V5LCB1cGRhdGVyOiAodmFsdWU6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICBpbnB1dC5jaGVja2VkID0gdmFsdWU7XHJcbiAgICB9fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBZ2VudHNBcnJheShwYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnMpOiBudW1iZXJbXSB7XHJcbiAgICBjb25zdCBhZ2VudHNBcnJheSA9IG5ldyBBcnJheSg0ICogcGFyYW1ldGVycy5hZ2VudENvdW50KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1ldGVycy5hZ2VudENvdW50ICogNDsgaSArPSA0KSB7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaV0gPSBwYXJhbWV0ZXJzLndpZHRoIC8gMjtcclxuICAgICAgICBhZ2VudHNBcnJheVtpKzFdID0gcGFyYW1ldGVycy5oZWlnaHQgLyAyO1xyXG4gICAgICAgIGFnZW50c0FycmF5W2krMl0gPSBNYXRoLnJhbmRvbSgpLS41O1xyXG4gICAgICAgIGFnZW50c0FycmF5W2krM10gPSBNYXRoLnJhbmRvbSgpLS41IDtcclxuICAgIH1cclxuICAgIHJldHVybiBhZ2VudHNBcnJheTtcclxufSIsImltcG9ydCB7IElTaW11bGF0aW9uUGFyYW1ldGVycyB9IGZyb20gXCIuL3NpbXVsYXRpb25Db25maWdcIjtcclxuaW1wb3J0IHNoYWRlckNvZGUgZnJvbSBcIi4vc2hhZGVycy9zaW11bGF0aW9uLndnc2xcIlxyXG5cclxuY29uc3QgV09SS0dST1VQX1NJWkUgPSA2NDtcclxuXHJcbmV4cG9ydCBjbGFzcyBTaW11bGF0aW9uUGFzcyB7XHJcbiAgICBkZXZpY2U6IEdQVURldmljZTtcclxuICAgIHBoZXJvbW9uZVRleHR1cmU6IEdQVVRleHR1cmU7XHJcbiAgICBhZ2VudHNCdWZmZXI6IEdQVUJ1ZmZlcjtcclxuICAgIHNpbXVsYXRpb25QYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnM7XHJcblxyXG4gICAgd29ya2dyb3VwczogbnVtYmVyO1xyXG4gICAgYmluZEdyb3VwOiBHUFVCaW5kR3JvdXA7XHJcbiAgICB1bmlmb3JtQnVmZmVyOiBHUFVCdWZmZXI7XHJcbiAgICBwaXBlbGluZTogR1BVQ29tcHV0ZVBpcGVsaW5lOyBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2U6IEdQVURldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycywgdGV4dHVyZUZvcm1hdDogR1BVVGV4dHVyZUZvcm1hdCwgYWdlbnRzQnVmZmVyOiBHUFVCdWZmZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICAgICAgdGhpcy5hZ2VudHNCdWZmZXIgPSBhZ2VudHNCdWZmZXI7XHJcbiAgICAgICAgdGhpcy53b3JrZ3JvdXBzID0gTWF0aC5jZWlsKHNpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnQgLyBXT1JLR1JPVVBfU0laRSk7XHJcbiAgICAgICAgdGhpcy5zaW11bGF0aW9uUGFyYW1ldGVycyA9IHNpbXVsYXRpb25QYXJhbWV0ZXJzO1xyXG5cclxuICAgICAgICBjb25zdCBjb21wdXRlQmluZEdyb3VwTGF5b3V0ID0gZGV2aWNlLmNyZWF0ZUJpbmRHcm91cExheW91dCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cCBMYXlvdXRcIixcclxuICAgICAgICAgICAgZW50cmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ1bmlmb3JtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN0b3JhZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZVRleHR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiB0ZXh0dXJlRm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3M6IFwicmVhZC1vbmx5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMyxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JhZ2VUZXh0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogdGV4dHVyZUZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBcIndyaXRlLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSBhcyBHUFVCaW5kR3JvdXBMYXlvdXRFbnRyeVtdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBkZXZpY2UuY3JlYXRlQ29tcHV0ZVBpcGVsaW5lKHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBQaXBlbGluZVwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IGRldmljZS5jcmVhdGVQaXBlbGluZUxheW91dCh7XHJcbiAgICAgICAgICAgICAgICBiaW5kR3JvdXBMYXlvdXRzOiBbY29tcHV0ZUJpbmRHcm91cExheW91dF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjb21wdXRlOiB7XHJcbiAgICAgICAgICAgICAgICBtb2R1bGU6IGRldmljZS5jcmVhdGVTaGFkZXJNb2R1bGUoe2NvZGU6IHNoYWRlckNvZGV9KSxcclxuICAgICAgICAgICAgICAgIGVudHJ5UG9pbnQ6ICdzaW11bGF0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgc2l6ZTogMzYsXHJcbiAgICAgICAgICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZS5VTklGT1JNIHwgR1BVQnVmZmVyVXNhZ2UuQ09QWV9EU1RcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQYXNzKGNvbW1hbmRFbmNvZGVyOiBHUFVDb21tYW5kRW5jb2RlciwgdGV4dHVyZUluOiBHUFVUZXh0dXJlLCB0ZXh0dXJlT3V0OiBHUFVUZXh0dXJlLCB0aW1lc3RhbXBXcml0ZXM/OiBHUFVSZW5kZXJQYXNzVGltZXN0YW1wV3JpdGVzKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdW5pZm9ybUludHMgPSBuZXcgVWludDMyQXJyYXkoW1xyXG4gICAgICAgICAgICB0aGlzLnNpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnNpbXVsYXRpb25QYXJhbWV0ZXJzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5zaW11bGF0aW9uUGFyYW1ldGVycy5hZ2VudENvdW50LFxyXG4gICAgICAgICAgICB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgKiAxMCxcclxuICAgICAgICAgICAgdGhpcy5zaW11bGF0aW9uUGFyYW1ldGVycy5zYW1wbGVEaXN0YW5jZSxcclxuICAgICAgICAgICAgdGhpcy5zaW11bGF0aW9uUGFyYW1ldGVycy53cmFwID8gMSA6IDAsXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHVuaWZvcm1JbnRzLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtSW50cy5sZW5ndGgsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCB1bmlmb3JtRmxvYXRzID0gbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgICAgIHRoaXMuc2ltdWxhdGlvblBhcmFtZXRlcnMudHVybkppdHRlcixcclxuICAgICAgICAgICAgdGhpcy5zaW11bGF0aW9uUGFyYW1ldGVycy5zdGVlckZhY3RvcixcclxuICAgICAgICAgICAgdGhpcy5zaW11bGF0aW9uUGFyYW1ldGVycy5hY2NlbGVyYXRpb24sXHJcbiAgICAgICAgICAgIE1hdGguY29zKHRoaXMuc2ltdWxhdGlvblBhcmFtZXRlcnMuc2FtcGxlQW5nbGUpLFxyXG4gICAgICAgICAgICBNYXRoLnNpbih0aGlzLnNpbXVsYXRpb25QYXJhbWV0ZXJzLnNhbXBsZUFuZ2xlKSxcclxuICAgICAgICAgICAgdGhpcy5zaW11bGF0aW9uUGFyYW1ldGVycy5zcGVlZCxcclxuICAgICAgICBdKVxyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIHVuaWZvcm1JbnRzLmJ5dGVMZW5ndGgsXHJcbiAgICAgICAgICAgIHVuaWZvcm1GbG9hdHMsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHVuaWZvcm1GbG9hdHMubGVuZ3RoLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXBXcml0ZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMucGlwZWxpbmUuZ2V0QmluZEdyb3VwTGF5b3V0KDApLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogeyBidWZmZXI6IHRoaXMudW5pZm9ybUJ1ZmZlciB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOnsgYnVmZmVyOiB0aGlzLmFnZW50c0J1ZmZlciB9LCBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMixcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogdGV4dHVyZUluLmNyZWF0ZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMyxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogdGV4dHVyZU91dC5jcmVhdGVWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2ltdWxhdGVQYXNzID0gY29tbWFuZEVuY29kZXIuYmVnaW5Db21wdXRlUGFzcyhwYXNzRGVzY3JpcHRvcik7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLnNldFBpcGVsaW5lKHRoaXMucGlwZWxpbmUpO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5zZXRCaW5kR3JvdXAoMCwgdGhpcy5iaW5kR3JvdXApO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5kaXNwYXRjaFdvcmtncm91cHModGhpcy53b3JrZ3JvdXBzKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3MuZW5kKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNYXQzLCBtYXQzIH0gZnJvbSBcIndncHUtbWF0cml4XCI7XHJcbmltcG9ydCB7IElTaW11bGF0aW9uUGFyYW1ldGVycyB9IGZyb20gXCIuL3NpbXVsYXRpb25Db25maWdcIjtcclxuaW1wb3J0IHNoYWRlckNvZGUgZnJvbSBcIi4vc2hhZGVycy9nYXVzc2lhbi53Z3NsXCI7XHJcblxyXG5jb25zdCBXT1JLR1JPVVBfU0laRSA9IDY0O1xyXG5cclxuZXhwb3J0IGNsYXNzIFRleHR1cmVQYXNzIHtcclxuICAgIGRldmljZTogR1BVRGV2aWNlO1xyXG4gICAgcGhlcm9tb25lVGV4dHVyZUluOiBHUFVUZXh0dXJlO1xyXG4gICAgcGhlcm9tb25lVGV4dHVyZU91dDogR1BVVGV4dHVyZTtcclxuXHJcbiAgICB3b3JrZ3JvdXBzOiBudW1iZXJbXTtcclxuICAgIGJpbmRHcm91cDogR1BVQmluZEdyb3VwO1xyXG4gICAgdW5pZm9ybUJ1ZmZlcjogR1BVQnVmZmVyO1xyXG4gICAgcGlwZWxpbmU6IEdQVUNvbXB1dGVQaXBlbGluZTtcclxuICAgIFxyXG4gICAgc2ltdWxhdGlvblBhcmFtdGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzO1xyXG4gICAgcHJldkdhdXNzaWFuU3RkRGV2OiBudW1iZXI7XHJcbiAgICBrZXJuZWw6IE1hdDM7XHJcbiAgICBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2U6IEdQVURldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycywgcGhlcm9tb25lVGV4dHVyZUZvcm1hdDogR1BVVGV4dHVyZUZvcm1hdCkge1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcclxuICAgICAgICB0aGlzLndvcmtncm91cHMgPSBbTWF0aC5jZWlsKHNpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRoIC8gOCksIE1hdGguY2VpbChzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHQgLyA4KV07XHJcblxyXG4gICAgICAgIHRoaXMuc2ltdWxhdGlvblBhcmFtdGVycyA9IHNpbXVsYXRpb25QYXJhbWV0ZXJzO1xyXG4gICAgICAgIHRoaXMucHJldkdhdXNzaWFuU3RkRGV2ID0gc2ltdWxhdGlvblBhcmFtZXRlcnMuZ2F1c3NpYW5TdGREZXY7XHJcbiAgICAgICAgdGhpcy5rZXJuZWwgPSBnZW5lcmF0ZUdhdXNzaWFuS2VybmVsKHNpbXVsYXRpb25QYXJhbWV0ZXJzLmdhdXNzaWFuU3RkRGV2LCAzKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgc2l6ZTogdGhpcy5rZXJuZWwuYnl0ZUxlbmd0aCArIDE2LFxyXG4gICAgICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuVU5JRk9STSB8IEdQVUJ1ZmZlclVzYWdlLkNPUFlfRFNUXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMua2VybmVsLmJ1ZmZlcixcclxuICAgICAgICAgICAgdGhpcy5rZXJuZWwuYnl0ZU9mZnNldCxcclxuICAgICAgICAgICAgdGhpcy5rZXJuZWwuYnl0ZUxlbmd0aCxcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIHRoaXMua2VybmVsLmJ5dGVMZW5ndGgsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW3RoaXMuc2ltdWxhdGlvblBhcmFtdGVycy5wYXNzaXZlQXR0ZW51YXRpb25dKSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVCaW5kR3JvdXBMYXlvdXQgPSBkZXZpY2UuY3JlYXRlQmluZEdyb3VwTGF5b3V0KHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInVuaWZvcm1cIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHBoZXJvbW9uZVRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJyZWFkLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZVRleHR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBwaGVyb21vbmVUZXh0dXJlRm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3M6IFwid3JpdGUtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVDb21wdXRlUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIFBpcGVsaW5lXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogZGV2aWNlLmNyZWF0ZVBpcGVsaW5lTGF5b3V0KHtcclxuICAgICAgICAgICAgICAgIGJpbmRHcm91cExheW91dHM6IFtjb21wdXRlQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNvbXB1dGU6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7Y29kZTogc2hhZGVyQ29kZX0pLFxyXG4gICAgICAgICAgICAgICAgZW50cnlQb2ludDogJ2F0dGVudWF0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhc3MoY29tbWFuZEVuY29kZXI6IEdQVUNvbW1hbmRFbmNvZGVyLCB0ZXh0dXJlSW46IEdQVVRleHR1cmUsIHRleHR1cmVPdXQ6IEdQVVRleHR1cmUsIHRpbWVzdGFtcFdyaXRlcz86IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zaW11bGF0aW9uUGFyYW10ZXJzLmdhdXNzaWFuU3RkRGV2ICE9IHRoaXMucHJldkdhdXNzaWFuU3RkRGV2KSB7XHJcbiAgICAgICAgICAgIHRoaXMua2VybmVsID0gZ2VuZXJhdGVHYXVzc2lhbktlcm5lbCh0aGlzLnNpbXVsYXRpb25QYXJhbXRlcnMuZ2F1c3NpYW5TdGREZXYsIDMpO1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgICAgIHRoaXMudW5pZm9ybUJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmtlcm5lbC5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmtlcm5lbC5ieXRlT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5rZXJuZWwuYnl0ZUxlbmd0aCxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdyaXRlIGZsb2F0c1xyXG4gICAgICAgIGNvbnN0IGZsb2F0cyA9IG5ldyBGbG9hdDMyQXJyYXkoW3RoaXMuc2ltdWxhdGlvblBhcmFtdGVycy5wYXNzaXZlQXR0ZW51YXRpb25dKVxyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIHRoaXMua2VybmVsLmJ5dGVMZW5ndGgsXHJcbiAgICAgICAgICAgIGZsb2F0cyxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgZmxvYXRzLmxlbmd0aFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gV3JpdGUgaW50c1xyXG4gICAgICAgIGNvbnN0IGludHMgPSBuZXcgVWludDMyQXJyYXkoW3RoaXMuc2ltdWxhdGlvblBhcmFtdGVycy53cmFwID8gMSA6IDBdKTtcclxuICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyLFxyXG4gICAgICAgICAgICB0aGlzLmtlcm5lbC5ieXRlTGVuZ3RoICsgZmxvYXRzLmJ5dGVMZW5ndGgsXHJcbiAgICAgICAgICAgIGludHMsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGludHMubGVuZ3RoXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGNvbnN0IHBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXBXcml0ZXNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYmluZEdyb3VwID0gdGhpcy5kZXZpY2UuY3JlYXRlQmluZEdyb3VwKHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBCaW5kIEdyb3VwXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogdGhpcy5waXBlbGluZS5nZXRCaW5kR3JvdXBMYXlvdXQoMCksXHJcbiAgICAgICAgICAgIGVudHJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7IGJ1ZmZlcjogdGhpcy51bmlmb3JtQnVmZmVyIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHRleHR1cmVJbi5jcmVhdGVWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHRleHR1cmVPdXQuY3JlYXRlVmlldygpLCBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSBhcyBHUFVCaW5kR3JvdXBFbnRyeVtdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNpbXVsYXRlUGFzcyA9IGNvbW1hbmRFbmNvZGVyLmJlZ2luQ29tcHV0ZVBhc3MocGFzc0Rlc2NyaXB0b3IpO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5zZXRQaXBlbGluZSh0aGlzLnBpcGVsaW5lKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3Muc2V0QmluZEdyb3VwKDAsIHRoaXMuYmluZEdyb3VwKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3MuZGlzcGF0Y2hXb3JrZ3JvdXBzKHRoaXMud29ya2dyb3Vwc1swXSwgdGhpcy53b3JrZ3JvdXBzWzFdKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3MuZW5kKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlR2F1c3NpYW5LZXJuZWwoc3RkRGV2OiBudW1iZXIsIHNpemU6IG51bWJlcik6IE1hdDMge1xyXG4gICAgaWYgKHNpemUgJSAyICE9IDEpIHtcclxuICAgICAgICB0aHJvdyAobmV3IEVycm9yKFwiR2F1c3NpYW4gS2VybmVsIHNpemUgbXVzdCBiZSBhbiBvZGQgbnVtYmVyXCIpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGtlcm5lbCA9IFtdO1xyXG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5mbG9vcihzaXplIC8gMik7XHJcbiAgICBjb25zdCBUQVUgPSBNYXRoLlBJO1xyXG4gICAgY29uc3Qgc3RkRGV2U3FyID0gKHN0ZERldisuMykgKiogMjtcclxuICAgIGxldCBzdW0gPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcclxuICAgICAgICBjb25zdCB4U3FyID0gKGkgLSBvZmZzZXQpICoqIDI7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBpICogc2l6ZSArIGo7XHJcbiAgICAgICAgICAgIGNvbnN0IHlTcXIgPSAoaiAtIG9mZnNldCkgKiogMjtcclxuICAgICAgICAgICAga2VybmVsW2luZGV4XSA9ICgxIC8gKDIgKiBNYXRoLlBJICogc3RkRGV2U3FyKSkgKiBNYXRoLmV4cCgtKHhTcXIgKyB5U3FyKSAvICgyICogc3RkRGV2U3FyKSk7XHJcbiAgICAgICAgICAgIHN1bSArPSBrZXJuZWxbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICAvLyBOb3JtYWxpemUgdGhlIGtlcm5lbFxyXG4gICAgbGV0IG5ld1N1bSA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtlcm5lbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGtlcm5lbFtpXSAvPSBzdW07XHJcbiAgICAgICAgbmV3U3VtICs9IGtlcm5lbFtpXTtcclxuICAgIH1cclxuICAgIC8vIEVuc3VyZSB0aGUga2VybmVsIHN1bXMgdG8gMVxyXG4gICAga2VybmVsW29mZnNldCAqIHNpemUgKyBvZmZzZXRdICs9IDEgLSBuZXdTdW07XHJcbiAgICAvLyBjb25zb2xlLmxvZyhzdW0sIG5ld1N1bSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhgJHtrZXJuZWxbMF0udG9GaXhlZCg1KX0sICR7a2VybmVsWzFdLnRvRml4ZWQoNSl9LCAke2tlcm5lbFsyXS50b0ZpeGVkKDUpfVxcbmAsIFxyXG4gICAgLy8gICAgICAgICAgICAgYCR7a2VybmVsWzNdLnRvRml4ZWQoNSl9LCAke2tlcm5lbFs0XS50b0ZpeGVkKDUpfSwgJHtrZXJuZWxbNV0udG9GaXhlZCg1KX1cXG5gLCBcclxuICAgIC8vICAgICAgICAgICAgIGAke2tlcm5lbFs2XS50b0ZpeGVkKDUpfSwgJHtrZXJuZWxbN10udG9GaXhlZCg1KX0sICR7a2VybmVsWzhdLnRvRml4ZWQoNSl9YCk7XHJcbiAgICByZXR1cm4gbWF0My5jcmVhdGUoa2VybmVsWzBdLCBrZXJuZWxbMV0sIGtlcm5lbFsyXSwga2VybmVsWzNdLCBrZXJuZWxbNF0sIGtlcm5lbFs1XSwga2VybmVsWzZdLCBrZXJuZWxbN10sIGtlcm5lbFs4XSk7XHJcbiAgICAvLyByZXR1cm4gbWF0My5jcmVhdGUoMCwgMCwgMCxcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCBcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAwLCAwLCAwKTtcclxufSIsIi8qIHdncHUtbWF0cml4QDMuMi4wLCBsaWNlbnNlIE1JVCAqL1xuZnVuY3Rpb24gd3JhcENvbnN0cnVjdG9yKE9yaWdpbmFsQ29uc3RydWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgT3JpZ2luYWxDb25zdHJ1Y3RvciB7XG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICAgICAgbW9kaWZpZXIodGhpcyk7XG4gICAgICAgIH1cbiAgICB9OyAvLyBUeXBlIGFzc2VydGlvbiBpcyBuZWNlc3NhcnkgaGVyZVxufVxuY29uc3QgWmVyb0FycmF5ID0gd3JhcENvbnN0cnVjdG9yKChBcnJheSksIGEgPT4gYS5maWxsKDApKTtcblxuLypcbiAqIENvcHlyaWdodCAyMDIyIEdyZWdnIFRhdmFyZXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICogY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuICogdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuICogdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xubGV0IEVQU0lMT04gPSAwLjAwMDAwMTtcbi8qKlxuICogU2V0IHRoZSB2YWx1ZSBmb3IgRVBTSUxPTiBmb3IgdmFyaW91cyBjaGVja3NcbiAqIEBwYXJhbSB2IC0gVmFsdWUgdG8gdXNlIGZvciBFUFNJTE9OLlxuICogQHJldHVybnMgcHJldmlvdXMgdmFsdWUgb2YgRVBTSUxPTjtcbiAqL1xuZnVuY3Rpb24gc2V0RXBzaWxvbih2KSB7XG4gICAgY29uc3Qgb2xkID0gRVBTSUxPTjtcbiAgICBFUFNJTE9OID0gdjtcbiAgICByZXR1cm4gb2xkO1xufVxuLyoqXG4gKiBDb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFuc1xuICogQHBhcmFtIGRlZ3JlZXMgLSBBbmdsZSBpbiBkZWdyZWVzXG4gKiBAcmV0dXJucyBhbmdsZSBjb252ZXJ0ZWQgdG8gcmFkaWFuc1xuICovXG5mdW5jdGlvbiBkZWdUb1JhZChkZWdyZWVzKSB7XG4gICAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xufVxuLyoqXG4gKiBDb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlc1xuICogQHBhcmFtIHJhZGlhbnMgLSBBbmdsZSBpbiByYWRpYW5zXG4gKiBAcmV0dXJucyBhbmdsZSBjb252ZXJ0ZWQgdG8gZGVncmVlc1xuICovXG5mdW5jdGlvbiByYWRUb0RlZyhyYWRpYW5zKSB7XG4gICAgcmV0dXJuIHJhZGlhbnMgKiAxODAgLyBNYXRoLlBJO1xufVxuLyoqXG4gKiBMZXJwcyBiZXR3ZWVuIGEgYW5kIGIgdmlhIHRcbiAqIEBwYXJhbSBhIC0gc3RhcnRpbmcgdmFsdWVcbiAqIEBwYXJhbSBiIC0gZW5kaW5nIHZhbHVlXG4gKiBAcGFyYW0gdCAtIHZhbHVlIHdoZXJlIDAgPSBhIGFuZCAxID0gYlxuICogQHJldHVybnMgYSArIChiIC0gYSkgKiB0XG4gKi9cbmZ1bmN0aW9uIGxlcnAoYSwgYiwgdCkge1xuICAgIHJldHVybiBhICsgKGIgLSBhKSAqIHQ7XG59XG4vKipcbiAqIENvbXB1dGUgdGhlIG9wcG9zaXRlIG9mIGxlcnAuIEdpdmVuIGEgYW5kIGIgYW5kIGEgdmFsdWUgYmV0d2VlblxuICogYSBhbmQgYiByZXR1cm5zIGEgdmFsdWUgYmV0d2VlbiAwIGFuZCAxLiAwIGlmIGEsIDEgaWYgYi5cbiAqIE5vdGU6IG5vIGNsYW1waW5nIGlzIGRvbmUuXG4gKiBAcGFyYW0gYSAtIHN0YXJ0IHZhbHVlXG4gKiBAcGFyYW0gYiAtIGVuZCB2YWx1ZVxuICogQHBhcmFtIHYgLSB2YWx1ZSBiZXR3ZWVuIGEgYW5kIGJcbiAqIEByZXR1cm5zICh2IC0gYSkgLyAoYiAtIGEpXG4gKi9cbmZ1bmN0aW9uIGludmVyc2VMZXJwKGEsIGIsIHYpIHtcbiAgICBjb25zdCBkID0gYiAtIGE7XG4gICAgcmV0dXJuIChNYXRoLmFicyhiIC0gYSkgPCBFUFNJTE9OKVxuICAgICAgICA/IGFcbiAgICAgICAgOiAodiAtIGEpIC8gZDtcbn1cbi8qKlxuICogQ29tcHV0ZSB0aGUgZXVjbGlkZWFuIG1vZHVsb1xuICpcbiAqIGBgYFxuICogLy8gdGFibGUgZm9yIG4gLyAzXG4gKiAtNSwgLTQsIC0zLCAtMiwgLTEsICAwLCAgMSwgIDIsICAzLCAgNCwgIDUgICA8LSBuXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIC0yICAtMSAgLTAgIC0yICAtMSAgIDAsICAxLCAgMiwgIDAsICAxLCAgMiAgIDwtIG4gJSAzXG4gKiAgMSAgIDIgICAwICAgMSAgIDIgICAwLCAgMSwgIDIsICAwLCAgMSwgIDIgICA8LSBldWNsaWRlYW5Nb2R1bGUobiwgMylcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBuIC0gZGl2aWRlbmRcbiAqIEBwYXJhbSBtIC0gZGl2aXNvclxuICogQHJldHVybnMgdGhlIGV1Y2xpZGVhbiBtb2R1bG8gb2YgbiAvIG1cbiAqL1xuZnVuY3Rpb24gZXVjbGlkZWFuTW9kdWxvKG4sIG0pIHtcbiAgICByZXR1cm4gKChuICUgbSkgKyBtKSAlIG07XG59XG5cbnZhciB1dGlscyA9IHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgZ2V0IEVQU0lMT04gKCkgeyByZXR1cm4gRVBTSUxPTjsgfSxcbiAgICBkZWdUb1JhZDogZGVnVG9SYWQsXG4gICAgZXVjbGlkZWFuTW9kdWxvOiBldWNsaWRlYW5Nb2R1bG8sXG4gICAgaW52ZXJzZUxlcnA6IGludmVyc2VMZXJwLFxuICAgIGxlcnA6IGxlcnAsXG4gICAgcmFkVG9EZWc6IHJhZFRvRGVnLFxuICAgIHNldEVwc2lsb246IHNldEVwc2lsb25cbn07XG5cbi8qXG4gKiBDb3B5cmlnaHQgMjAyMiBHcmVnZyBUYXZhcmVzXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbiAqIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbiAqIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbiAqIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLFxuICogYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4gKiBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTFxuICogVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG4gKiBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSXG4gKiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cbi8qKlxuICogR2VuZXJhdGVzIGFtIHR5cGVkIEFQSSBmb3IgVmVjM1xuICovXG5mdW5jdGlvbiBnZXRBUElJbXBsJDUoQ3Rvcikge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBWZWMyOyBtYXkgYmUgY2FsbGVkIHdpdGggeCwgeSwgeiB0byBzZXQgaW5pdGlhbCB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBOb3RlOiBTaW5jZSBwYXNzaW5nIGluIGEgcmF3IEphdmFTY3JpcHQgYXJyYXlcbiAgICAgKiBpcyB2YWxpZCBpbiBhbGwgY2lyY3Vtc3RhbmNlcywgaWYgeW91IHdhbnQgdG9cbiAgICAgKiBmb3JjZSBhIEphdmFTY3JpcHQgYXJyYXkgaW50byBhIFZlYzIncyBzcGVjaWZpZWQgdHlwZVxuICAgICAqIGl0IHdvdWxkIGJlIGZhc3RlciB0byB1c2VcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGNvbnN0IHYgPSB2ZWMyLmNsb25lKHNvbWVKU0FycmF5KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IC0gSW5pdGlhbCB4IHZhbHVlLlxuICAgICAqIEBwYXJhbSB5IC0gSW5pdGlhbCB5IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHRoZSBjcmVhdGVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZSh4ID0gMCwgeSA9IDApIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gbmV3IEN0b3IoMik7XG4gICAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IHg7XG4gICAgICAgICAgICBpZiAoeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzFdID0geTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgVmVjMjsgbWF5IGJlIGNhbGxlZCB3aXRoIHgsIHksIHogdG8gc2V0IGluaXRpYWwgdmFsdWVzLiAoc2FtZSBhcyBjcmVhdGUpXG4gICAgICogQHBhcmFtIHggLSBJbml0aWFsIHggdmFsdWUuXG4gICAgICogQHBhcmFtIHkgLSBJbml0aWFsIHkgdmFsdWUuXG4gICAgICogQHJldHVybnMgdGhlIGNyZWF0ZWQgdmVjdG9yXG4gICAgICovXG4gICAgY29uc3QgZnJvbVZhbHVlcyA9IGNyZWF0ZTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZXMgb2YgYSBWZWMyXG4gICAgICogQWxzbyBzZWUge0BsaW5rIHZlYzIuY3JlYXRlfSBhbmQge0BsaW5rIHZlYzIuY29weX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IGZpcnN0IHZhbHVlXG4gICAgICogQHBhcmFtIHkgc2Vjb25kIHZhbHVlXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB3aXRoIGl0cyBlbGVtZW50cyBzZXQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0KHgsIHksIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0geDtcbiAgICAgICAgbmV3RHN0WzFdID0geTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXBwbGllcyBNYXRoLmNlaWwgdG8gZWFjaCBlbGVtZW50IG9mIHZlY3RvclxuICAgICAqIEBwYXJhbSB2IC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBjZWlsIG9mIGVhY2ggZWxlbWVudCBvZiB2LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNlaWwodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLmNlaWwodlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGguY2VpbCh2WzFdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXBwbGllcyBNYXRoLmZsb29yIHRvIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgZmxvb3Igb2YgZWFjaCBlbGVtZW50IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmxvb3IodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLmZsb29yKHZbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLmZsb29yKHZbMV0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIE1hdGgucm91bmQgdG8gZWFjaCBlbGVtZW50IG9mIHZlY3RvclxuICAgICAqIEBwYXJhbSB2IC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSByb3VuZCBvZiBlYWNoIGVsZW1lbnQgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3VuZCh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGgucm91bmQodlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgucm91bmQodlsxXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsYW1wIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3IgYmV0d2VlbiBtaW4gYW5kIG1heFxuICAgICAqIEBwYXJhbSB2IC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIG1heCAtIE1pbiB2YWx1ZSwgZGVmYXVsdCAwXG4gICAgICogQHBhcmFtIG1pbiAtIE1heCB2YWx1ZSwgZGVmYXVsdCAxXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IHRoZSBjbGFtcGVkIHZhbHVlIG9mIGVhY2ggZWxlbWVudCBvZiB2LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsYW1wKHYsIG1pbiA9IDAsIG1heCA9IDEsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZbMF0pKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZbMV0pKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyB0d28gdmVjdG9yczsgYXNzdW1lcyBhIGFuZCBiIGhhdmUgdGhlIHNhbWUgZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIHN1bSBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZChhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICsgYlsxXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyB0d28gdmVjdG9ycywgc2NhbGluZyB0aGUgMm5kOyBhc3N1bWVzIGEgYW5kIGIgaGF2ZSB0aGUgc2FtZSBkaW1lbnNpb24uXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBzY2FsZSAtIEFtb3VudCB0byBzY2FsZSBiXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBzdW0gb2YgYSArIGIgKiBzY2FsZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRTY2FsZWQoYSwgYiwgc2NhbGUsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSArIGJbMF0gKiBzY2FsZTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSArIGJbMV0gKiBzY2FsZTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHR3byB2ZWN0b3JzLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBUaGUgYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHRoZSAyIHZlY3RvcnMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYW5nbGUoYSwgYikge1xuICAgICAgICBjb25zdCBheCA9IGFbMF07XG4gICAgICAgIGNvbnN0IGF5ID0gYVsxXTtcbiAgICAgICAgY29uc3QgYnggPSBiWzBdO1xuICAgICAgICBjb25zdCBieSA9IGJbMV07XG4gICAgICAgIGNvbnN0IG1hZzEgPSBNYXRoLnNxcnQoYXggKiBheCArIGF5ICogYXkpO1xuICAgICAgICBjb25zdCBtYWcyID0gTWF0aC5zcXJ0KGJ4ICogYnggKyBieSAqIGJ5KTtcbiAgICAgICAgY29uc3QgbWFnID0gbWFnMSAqIG1hZzI7XG4gICAgICAgIGNvbnN0IGNvc2luZSA9IG1hZyAmJiBkb3QoYSwgYikgLyBtYWc7XG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoY29zaW5lKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIHR3byB2ZWN0b3JzLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIGRpZmZlcmVuY2Ugb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdWJ0cmFjdChhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gLSBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIHR3byB2ZWN0b3JzLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIGRpZmZlcmVuY2Ugb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBjb25zdCBzdWIgPSBzdWJ0cmFjdDtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIHZlY3RvcnMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWxcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB2ZWN0b3JzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzQXBwcm94aW1hdGVseShhLCBiKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhWzBdIC0gYlswXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzFdIC0gYlsxXSkgPCBFUFNJTE9OO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIHZlY3RvcnMgYXJlIGV4YWN0bHkgZXF1YWxcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB2ZWN0b3JzIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGFbMF0gPT09IGJbMF0gJiYgYVsxXSA9PT0gYlsxXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgbGluZWFyIGludGVycG9sYXRpb24gb24gdHdvIHZlY3RvcnMuXG4gICAgICogR2l2ZW4gdmVjdG9ycyBhIGFuZCBiIGFuZCBpbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50IHQsIHJldHVybnNcbiAgICAgKiBhICsgdCAqIChiIC0gYSkuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB0IC0gSW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBsaW5lYXIgaW50ZXJwb2xhdGVkIHJlc3VsdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsZXJwKGEsIGIsIHQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSArIHQgKiAoYlswXSAtIGFbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICsgdCAqIChiWzFdIC0gYVsxXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGxpbmVhciBpbnRlcnBvbGF0aW9uIG9uIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiBhbmQgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudCB2ZWN0b3IgdCwgcmV0dXJuc1xuICAgICAqIGEgKyB0ICogKGIgLSBhKS5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHQgLSBJbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50cyB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgbGluZWFyIGludGVycG9sYXRlZCByZXN1bHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVycFYoYSwgYiwgdCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgdFswXSAqIChiWzBdIC0gYVswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyB0WzFdICogKGJbMV0gLSBhWzFdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIG1heCB2YWx1ZXMgb2YgdHdvIHZlY3RvcnMuXG4gICAgICogR2l2ZW4gdmVjdG9ycyBhIGFuZCBiIHJldHVybnNcbiAgICAgKiBbbWF4KGFbMF0sIGJbMF0pLCBtYXgoYVsxXSwgYlsxXSksIG1heChhWzJdLCBiWzJdKV0uXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1heCBjb21wb25lbnRzIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYXgoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLm1heChhWzBdLCBiWzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5tYXgoYVsxXSwgYlsxXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBtaW4gdmFsdWVzIG9mIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiByZXR1cm5zXG4gICAgICogW21pbihhWzBdLCBiWzBdKSwgbWluKGFbMV0sIGJbMV0pLCBtaW4oYVsyXSwgYlsyXSldLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBtaW4gY29tcG9uZW50cyB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWluKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5taW4oYVswXSwgYlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgubWluKGFbMV0sIGJbMV0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gayAtIFRoZSBzY2FsYXIuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtdWxTY2FsYXIodiwgaywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSB2WzBdICogaztcbiAgICAgICAgbmV3RHN0WzFdID0gdlsxXSAqIGs7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIuIChzYW1lIGFzIG11bFNjYWxhcilcbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgY29uc3Qgc2NhbGUgPSBtdWxTY2FsYXI7XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2U2NhbGFyKHYsIGssIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXSAvIGs7XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV0gLyBrO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnZlcnNlIGEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBpbnZlcnRlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52ZXJzZSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDEgLyB2WzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSAxIC8gdlsxXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW52ZXJ0IGEgdmVjdG9yLiAoc2FtZSBhcyBpbnZlcnNlKVxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBpbnZlcnRlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgY29uc3QgaW52ZXJ0ID0gaW52ZXJzZTtcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9yczsgYXNzdW1lcyBib3RoIHZlY3RvcnMgaGF2ZVxuICAgICAqIHRocmVlIGVudHJpZXMuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBhIGNyb3NzIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3Jvc3MoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBjb25zdCB6ID0gYVswXSAqIGJbMV0gLSBhWzFdICogYlswXTtcbiAgICAgICAgbmV3RHN0WzBdID0gMDtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gejtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzOyBhc3N1bWVzIGJvdGggdmVjdG9ycyBoYXZlXG4gICAgICogdGhyZWUgZW50cmllcy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgZG90IHByb2R1Y3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkb3QoYSwgYikge1xuICAgICAgICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGxlbmd0aCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBsZW5ndGggb2YgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlbmd0aCh2KSB7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHYwICogdjAgKyB2MSAqIHYxKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGxlbmd0aCBvZiB2ZWN0b3IgKHNhbWUgYXMgbGVuZ3RoKVxuICAgICAqIEBwYXJhbSB2IC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGxlbmd0aCBvZiB2ZWN0b3IuXG4gICAgICovXG4gICAgY29uc3QgbGVuID0gbGVuZ3RoO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVuZ3RoU3Eodikge1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgcmV0dXJuIHYwICogdjAgKyB2MSAqIHYxO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgdmVjdG9yIChzYW1lIGFzIGxlbmd0aFNxKVxuICAgICAqIEBwYXJhbSB2IC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHZlY3Rvci5cbiAgICAgKi9cbiAgICBjb25zdCBsZW5TcSA9IGxlbmd0aFNxO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGlzdGFuY2UoYSwgYikge1xuICAgICAgICBjb25zdCBkeCA9IGFbMF0gLSBiWzBdO1xuICAgICAgICBjb25zdCBkeSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHMgKHNhbWUgYXMgZGlzdGFuY2UpXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gICAgICovXG4gICAgY29uc3QgZGlzdCA9IGRpc3RhbmNlO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHNcbiAgICAgKiBAcGFyYW0gYSAtIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpc3RhbmNlU3EoYSwgYikge1xuICAgICAgICBjb25zdCBkeCA9IGFbMF0gLSBiWzBdO1xuICAgICAgICBjb25zdCBkeSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHMgKHNhbWUgYXMgZGlzdGFuY2VTcSlcbiAgICAgKiBAcGFyYW0gYSAtIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGNvbnN0IGRpc3RTcSA9IGRpc3RhbmNlU3E7XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBpdHMgRXVjbGlkZWFuIGxlbmd0aCBhbmQgcmV0dXJucyB0aGUgcXVvdGllbnQuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG5vcm1hbGl6ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCBsZW4gPSBNYXRoLnNxcnQodjAgKiB2MCArIHYxICogdjEpO1xuICAgICAgICBpZiAobGVuID4gMC4wMDAwMSkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gdjAgLyBsZW47XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSB2MSAvIGxlbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE5lZ2F0ZXMgYSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgLXYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbmVnYXRlKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gLXZbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IC12WzFdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgYSB2ZWN0b3IuIChzYW1lIGFzIHtAbGluayB2ZWMyLmNsb25lfSlcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgdmVjMi5jcmVhdGV9IGFuZCB7QGxpbmsgdmVjMi5zZXR9XG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBjb3B5IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29weSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsb25lcyBhIHZlY3Rvci4gKHNhbWUgYXMge0BsaW5rIHZlYzIuY29weX0pXG4gICAgICogQWxzbyBzZWUge0BsaW5rIHZlYzIuY3JlYXRlfSBhbmQge0BsaW5rIHZlYzIuc2V0fVxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgY29weSBvZiB2LlxuICAgICAqL1xuICAgIGNvbnN0IGNsb25lID0gY29weTtcbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGFub3RoZXIgdmVjdG9yIChjb21wb25lbnQtd2lzZSk7IGFzc3VtZXMgYSBhbmRcbiAgICAgKiBiIGhhdmUgdGhlIHNhbWUgbGVuZ3RoLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3Igb2YgcHJvZHVjdHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSAqIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKiBiWzFdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGFub3RoZXIgdmVjdG9yIChjb21wb25lbnQtd2lzZSk7IGFzc3VtZXMgYSBhbmRcbiAgICAgKiBiIGhhdmUgdGhlIHNhbWUgbGVuZ3RoLiAoc2FtZSBhcyBtdWwpXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBwcm9kdWN0cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3QgbXVsID0gbXVsdGlwbHk7XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIG9mIHF1b3RpZW50cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2aWRlKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSAvIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gLyBiWzFdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIGEgdmVjdG9yIGJ5IGFub3RoZXIgdmVjdG9yIChjb21wb25lbnQtd2lzZSk7IGFzc3VtZXMgYSBhbmRcbiAgICAgKiBiIGhhdmUgdGhlIHNhbWUgbGVuZ3RoLiAoc2FtZSBhcyBkaXZpZGUpXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBxdW90aWVudHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGNvbnN0IGRpdiA9IGRpdmlkZTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgcmFuZG9tIHVuaXQgdmVjdG9yICogc2NhbGVcbiAgICAgKiBAcGFyYW0gc2NhbGUgLSBEZWZhdWx0IDFcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByYW5kb20gdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJhbmRvbShzY2FsZSA9IDEsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGguY29zKGFuZ2xlKSAqIHNjYWxlO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLnNpbihhbmdsZSkgKiBzY2FsZTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogWmVybydzIGEgdmVjdG9yXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgemVyb2VkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB6ZXJvKGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gMDtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogdHJhbnNmb3JtIFZlYzIgYnkgNHg0IG1hdHJpeFxuICAgICAqIEBwYXJhbSB2IC0gdGhlIHZlY3RvclxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gb3B0aW9uYWwgVmVjMiB0byBzdG9yZSByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybU1hdDQodiwgbSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBjb25zdCB4ID0gdlswXTtcbiAgICAgICAgY29uc3QgeSA9IHZbMV07XG4gICAgICAgIG5ld0RzdFswXSA9IHggKiBtWzBdICsgeSAqIG1bNF0gKyBtWzEyXTtcbiAgICAgICAgbmV3RHN0WzFdID0geCAqIG1bMV0gKyB5ICogbVs1XSArIG1bMTNdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmFuc2Zvcm1zIHZlYzQgYnkgM3gzIG1hdHJpeFxuICAgICAqXG4gICAgICogQHBhcmFtIHYgLSB0aGUgdmVjdG9yXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBvcHRpb25hbCBWZWMyIHRvIHN0b3JlIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgdmVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtTWF0Myh2LCBtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIGNvbnN0IHggPSB2WzBdO1xuICAgICAgICBjb25zdCB5ID0gdlsxXTtcbiAgICAgICAgbmV3RHN0WzBdID0gbVswXSAqIHggKyBtWzRdICogeSArIG1bOF07XG4gICAgICAgIG5ld0RzdFsxXSA9IG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWzldO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGUgYSAyRCB2ZWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIFRoZSB2ZWMyIHBvaW50IHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSBiIFRoZSBvcmlnaW4gb2YgdGhlIHJvdGF0aW9uXG4gICAgICogQHBhcmFtIHJhZCBUaGUgYW5nbGUgb2Ygcm90YXRpb24gaW4gcmFkaWFuc1xuICAgICAqIEByZXR1cm5zIHRoZSByb3RhdGVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0ZShhLCBiLCByYWQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgLy8gVHJhbnNsYXRlIHBvaW50IHRvIHRoZSBvcmlnaW5cbiAgICAgICAgY29uc3QgcDAgPSBhWzBdIC0gYlswXTtcbiAgICAgICAgY29uc3QgcDEgPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgY29uc3Qgc2luQyA9IE1hdGguc2luKHJhZCk7XG4gICAgICAgIGNvbnN0IGNvc0MgPSBNYXRoLmNvcyhyYWQpO1xuICAgICAgICAvL3BlcmZvcm0gcm90YXRpb24gYW5kIHRyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG4gICAgICAgIG5ld0RzdFswXSA9IHAwICogY29zQyAtIHAxICogc2luQyArIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHAwICogc2luQyArIHAxICogY29zQyArIGJbMV07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyZWF0IGEgMkQgdmVjdG9yIGFzIGEgZGlyZWN0aW9uIGFuZCBzZXQgaXQncyBsZW5ndGhcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIFRoZSB2ZWMyIHRvIGxlbmd0aGVuXG4gICAgICogQHBhcmFtIGxlbiBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgdmVjdG9yXG4gICAgICogQHJldHVybnMgVGhlIGxlbmd0aGVuZWQgdmVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0TGVuZ3RoKGEsIGxlbiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBub3JtYWxpemUoYSwgbmV3RHN0KTtcbiAgICAgICAgcmV0dXJuIG11bFNjYWxhcihuZXdEc3QsIGxlbiwgbmV3RHN0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW5zdXJlIGEgdmVjdG9yIGlzIG5vdCBsb25nZXIgdGhhbiBhIG1heCBsZW5ndGhcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIFRoZSB2ZWMyIHRvIGxpbWl0XG4gICAgICogQHBhcmFtIG1heExlbiBUaGUgbG9uZ2VzdCBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyB2ZWN0b3JcbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yLCBzaG9ydGVuZWQgdG8gbWF4TGVuIGlmIGl0J3MgdG9vIGxvbmdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cnVuY2F0ZShhLCBtYXhMZW4sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgaWYgKGxlbmd0aChhKSA+IG1heExlbikge1xuICAgICAgICAgICAgcmV0dXJuIHNldExlbmd0aChhLCBtYXhMZW4sIG5ld0RzdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcHkoYSwgbmV3RHN0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSB2ZWN0b3IgZXhhY3RseSBiZXR3ZWVuIDIgZW5kcG9pbnQgdmVjdG9yc1xuICAgICAqXG4gICAgICogQHBhcmFtIGEgRW5kcG9pbnQgMVxuICAgICAqIEBwYXJhbSBiIEVuZHBvaW50IDJcbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIGV4YWN0bHkgcmVzaWRpbmcgYmV0d2VlbiBlbmRwb2ludHMgMSBhbmQgMlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1pZHBvaW50KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgcmV0dXJuIGxlcnAoYSwgYiwgMC41LCBuZXdEc3QpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGUsXG4gICAgICAgIGZyb21WYWx1ZXMsXG4gICAgICAgIHNldCxcbiAgICAgICAgY2VpbCxcbiAgICAgICAgZmxvb3IsXG4gICAgICAgIHJvdW5kLFxuICAgICAgICBjbGFtcCxcbiAgICAgICAgYWRkLFxuICAgICAgICBhZGRTY2FsZWQsXG4gICAgICAgIGFuZ2xlLFxuICAgICAgICBzdWJ0cmFjdCxcbiAgICAgICAgc3ViLFxuICAgICAgICBlcXVhbHNBcHByb3hpbWF0ZWx5LFxuICAgICAgICBlcXVhbHMsXG4gICAgICAgIGxlcnAsXG4gICAgICAgIGxlcnBWLFxuICAgICAgICBtYXgsXG4gICAgICAgIG1pbixcbiAgICAgICAgbXVsU2NhbGFyLFxuICAgICAgICBzY2FsZSxcbiAgICAgICAgZGl2U2NhbGFyLFxuICAgICAgICBpbnZlcnNlLFxuICAgICAgICBpbnZlcnQsXG4gICAgICAgIGNyb3NzLFxuICAgICAgICBkb3QsXG4gICAgICAgIGxlbmd0aCxcbiAgICAgICAgbGVuLFxuICAgICAgICBsZW5ndGhTcSxcbiAgICAgICAgbGVuU3EsXG4gICAgICAgIGRpc3RhbmNlLFxuICAgICAgICBkaXN0LFxuICAgICAgICBkaXN0YW5jZVNxLFxuICAgICAgICBkaXN0U3EsXG4gICAgICAgIG5vcm1hbGl6ZSxcbiAgICAgICAgbmVnYXRlLFxuICAgICAgICBjb3B5LFxuICAgICAgICBjbG9uZSxcbiAgICAgICAgbXVsdGlwbHksXG4gICAgICAgIG11bCxcbiAgICAgICAgZGl2aWRlLFxuICAgICAgICBkaXYsXG4gICAgICAgIHJhbmRvbSxcbiAgICAgICAgemVybyxcbiAgICAgICAgdHJhbnNmb3JtTWF0NCxcbiAgICAgICAgdHJhbnNmb3JtTWF0MyxcbiAgICAgICAgcm90YXRlLFxuICAgICAgICBzZXRMZW5ndGgsXG4gICAgICAgIHRydW5jYXRlLFxuICAgICAgICBtaWRwb2ludCxcbiAgICB9O1xufVxuY29uc3QgY2FjaGUkNSA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldEFQSSQ1KEN0b3IpIHtcbiAgICBsZXQgYXBpID0gY2FjaGUkNS5nZXQoQ3Rvcik7XG4gICAgaWYgKCFhcGkpIHtcbiAgICAgICAgYXBpID0gZ2V0QVBJSW1wbCQ1KEN0b3IpO1xuICAgICAgICBjYWNoZSQ1LnNldChDdG9yLCBhcGkpO1xuICAgIH1cbiAgICByZXR1cm4gYXBpO1xufVxuXG4vKlxuICogQ29weXJpZ2h0IDIwMjIgR3JlZ2cgVGF2YXJlc1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4gKiBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksXG4gKiB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4gKiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSxcbiAqIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuICogU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTExcbiAqIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICogRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuICogREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4vKipcbiAqIEdlbmVyYXRlcyBhbSB0eXBlZCBBUEkgZm9yIFZlYzNcbiAqICovXG5mdW5jdGlvbiBnZXRBUElJbXBsJDQoQ3Rvcikge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSB2ZWMzOyBtYXkgYmUgY2FsbGVkIHdpdGggeCwgeSwgeiB0byBzZXQgaW5pdGlhbCB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHggLSBJbml0aWFsIHggdmFsdWUuXG4gICAgICogQHBhcmFtIHkgLSBJbml0aWFsIHkgdmFsdWUuXG4gICAgICogQHBhcmFtIHogLSBJbml0aWFsIHogdmFsdWUuXG4gICAgICogQHJldHVybnMgdGhlIGNyZWF0ZWQgdmVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlKHgsIHksIHopIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gbmV3IEN0b3IoMyk7XG4gICAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IHg7XG4gICAgICAgICAgICBpZiAoeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzFdID0geTtcbiAgICAgICAgICAgICAgICBpZiAoeiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0RzdFsyXSA9IHo7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSB2ZWMzOyBtYXkgYmUgY2FsbGVkIHdpdGggeCwgeSwgeiB0byBzZXQgaW5pdGlhbCB2YWx1ZXMuIChzYW1lIGFzIGNyZWF0ZSlcbiAgICAgKiBAcGFyYW0geCAtIEluaXRpYWwgeCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geSAtIEluaXRpYWwgeSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geiAtIEluaXRpYWwgeiB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyB0aGUgY3JlYXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBjb25zdCBmcm9tVmFsdWVzID0gY3JlYXRlO1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBhIFZlYzNcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgdmVjMy5jcmVhdGV9IGFuZCB7QGxpbmsgdmVjMy5jb3B5fVxuICAgICAqXG4gICAgICogQHBhcmFtIHggZmlyc3QgdmFsdWVcbiAgICAgKiBAcGFyYW0geSBzZWNvbmQgdmFsdWVcbiAgICAgKiBAcGFyYW0geiB0aGlyZCB2YWx1ZVxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3Igd2l0aCBpdHMgZWxlbWVudHMgc2V0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldCh4LCB5LCB6LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHg7XG4gICAgICAgIG5ld0RzdFsxXSA9IHk7XG4gICAgICAgIG5ld0RzdFsyXSA9IHo7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgTWF0aC5jZWlsIHRvIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgY2VpbCBvZiBlYWNoIGVsZW1lbnQgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjZWlsKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5jZWlsKHZbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLmNlaWwodlsxXSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGguY2VpbCh2WzJdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXBwbGllcyBNYXRoLmZsb29yIHRvIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgZmxvb3Igb2YgZWFjaCBlbGVtZW50IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmxvb3IodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLmZsb29yKHZbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLmZsb29yKHZbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLmZsb29yKHZbMl0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIE1hdGgucm91bmQgdG8gZWFjaCBlbGVtZW50IG9mIHZlY3RvclxuICAgICAqIEBwYXJhbSB2IC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSByb3VuZCBvZiBlYWNoIGVsZW1lbnQgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3VuZCh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGgucm91bmQodlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgucm91bmQodlsxXSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGgucm91bmQodlsyXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsYW1wIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3IgYmV0d2VlbiBtaW4gYW5kIG1heFxuICAgICAqIEBwYXJhbSB2IC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIG1heCAtIE1pbiB2YWx1ZSwgZGVmYXVsdCAwXG4gICAgICogQHBhcmFtIG1pbiAtIE1heCB2YWx1ZSwgZGVmYXVsdCAxXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IHRoZSBjbGFtcGVkIHZhbHVlIG9mIGVhY2ggZWxlbWVudCBvZiB2LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsYW1wKHYsIG1pbiA9IDAsIG1heCA9IDEsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZbMF0pKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZbMV0pKTtcbiAgICAgICAgbmV3RHN0WzJdID0gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZbMl0pKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyB0d28gdmVjdG9yczsgYXNzdW1lcyBhIGFuZCBiIGhhdmUgdGhlIHNhbWUgZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIHN1bSBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZChhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICsgYlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSArIGJbMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgdHdvIHZlY3RvcnMsIHNjYWxpbmcgdGhlIDJuZDsgYXNzdW1lcyBhIGFuZCBiIGhhdmUgdGhlIHNhbWUgZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gc2NhbGUgLSBBbW91bnQgdG8gc2NhbGUgYlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgc3VtIG9mIGEgKyBiICogc2NhbGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU2NhbGVkKGEsIGIsIHNjYWxlLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyBiWzBdICogc2NhbGU7XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyBiWzFdICogc2NhbGU7XG4gICAgICAgIG5ld0RzdFsyXSA9IGFbMl0gKyBiWzJdICogc2NhbGU7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGFuZ2xlIGluIHJhZGlhbnMgYmV0d2VlbiB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgVGhlIGFuZ2xlIGluIHJhZGlhbnMgYmV0d2VlbiB0aGUgMiB2ZWN0b3JzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFuZ2xlKGEsIGIpIHtcbiAgICAgICAgY29uc3QgYXggPSBhWzBdO1xuICAgICAgICBjb25zdCBheSA9IGFbMV07XG4gICAgICAgIGNvbnN0IGF6ID0gYVsyXTtcbiAgICAgICAgY29uc3QgYnggPSBiWzBdO1xuICAgICAgICBjb25zdCBieSA9IGJbMV07XG4gICAgICAgIGNvbnN0IGJ6ID0gYlsyXTtcbiAgICAgICAgY29uc3QgbWFnMSA9IE1hdGguc3FydChheCAqIGF4ICsgYXkgKiBheSArIGF6ICogYXopO1xuICAgICAgICBjb25zdCBtYWcyID0gTWF0aC5zcXJ0KGJ4ICogYnggKyBieSAqIGJ5ICsgYnogKiBieik7XG4gICAgICAgIGNvbnN0IG1hZyA9IG1hZzEgKiBtYWcyO1xuICAgICAgICBjb25zdCBjb3NpbmUgPSBtYWcgJiYgZG90KGEsIGIpIC8gbWFnO1xuICAgICAgICByZXR1cm4gTWF0aC5hY29zKGNvc2luZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBkaWZmZXJlbmNlIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdIC0gYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IGFbMl0gLSBiWzJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgZGlmZmVyZW5jZSBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGNvbnN0IHN1YiA9IHN1YnRyYWN0O1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIDIgdmVjdG9ycyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbFxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHZlY3RvcnMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlcXVhbHNBcHByb3hpbWF0ZWx5KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGFbMF0gLSBiWzBdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMV0gLSBiWzFdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMl0gLSBiWzJdKSA8IEVQU0lMT047XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIDIgdmVjdG9ycyBhcmUgZXhhY3RseSBlcXVhbFxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHZlY3RvcnMgYXJlIGV4YWN0bHkgZXF1YWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICAgICAgICByZXR1cm4gYVswXSA9PT0gYlswXSAmJiBhWzFdID09PSBiWzFdICYmIGFbMl0gPT09IGJbMl07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGxpbmVhciBpbnRlcnBvbGF0aW9uIG9uIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiBhbmQgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudCB0LCByZXR1cm5zXG4gICAgICogYSArIHQgKiAoYiAtIGEpLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gdCAtIEludGVycG9sYXRpb24gY29lZmZpY2llbnQuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbGluZWFyIGludGVycG9sYXRlZCByZXN1bHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVycChhLCBiLCB0LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyB0ICogKGJbMF0gLSBhWzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSArIHQgKiAoYlsxXSAtIGFbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdICsgdCAqIChiWzJdIC0gYVsyXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGxpbmVhciBpbnRlcnBvbGF0aW9uIG9uIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiBhbmQgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudCB2ZWN0b3IgdCwgcmV0dXJuc1xuICAgICAqIGEgKyB0ICogKGIgLSBhKS5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHQgLSBJbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50cyB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgbGluZWFyIGludGVycG9sYXRlZCByZXN1bHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVycFYoYSwgYiwgdCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgdFswXSAqIChiWzBdIC0gYVswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyB0WzFdICogKGJbMV0gLSBhWzFdKTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSArIHRbMl0gKiAoYlsyXSAtIGFbMl0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gbWF4IHZhbHVlcyBvZiB0d28gdmVjdG9ycy5cbiAgICAgKiBHaXZlbiB2ZWN0b3JzIGEgYW5kIGIgcmV0dXJuc1xuICAgICAqIFttYXgoYVswXSwgYlswXSksIG1heChhWzFdLCBiWzFdKSwgbWF4KGFbMl0sIGJbMl0pXS5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbWF4IGNvbXBvbmVudHMgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1heChhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGgubWF4KGFbMF0sIGJbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLm1heChhWzFdLCBiWzFdKTtcbiAgICAgICAgbmV3RHN0WzJdID0gTWF0aC5tYXgoYVsyXSwgYlsyXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBtaW4gdmFsdWVzIG9mIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiByZXR1cm5zXG4gICAgICogW21pbihhWzBdLCBiWzBdKSwgbWluKGFbMV0sIGJbMV0pLCBtaW4oYVsyXSwgYlsyXSldLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBtaW4gY29tcG9uZW50cyB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWluKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5taW4oYVswXSwgYlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgubWluKGFbMV0sIGJbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLm1pbihhWzJdLCBiWzJdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsU2NhbGFyKHYsIGssIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXSAqIGs7XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV0gKiBrO1xuICAgICAgICBuZXdEc3RbMl0gPSB2WzJdICogaztcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhIHNjYWxhci4gKHNhbWUgYXMgbXVsU2NhbGFyKVxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gayAtIFRoZSBzY2FsYXIuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBjb25zdCBzY2FsZSA9IG11bFNjYWxhcjtcbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIGEgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gayAtIFRoZSBzY2FsYXIuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXZTY2FsYXIodiwgaywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSB2WzBdIC8gaztcbiAgICAgICAgbmV3RHN0WzFdID0gdlsxXSAvIGs7XG4gICAgICAgIG5ld0RzdFsyXSA9IHZbMl0gLyBrO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnZlcnNlIGEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBpbnZlcnRlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52ZXJzZSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDEgLyB2WzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSAxIC8gdlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gMSAvIHZbMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludmVydCBhIHZlY3Rvci4gKHNhbWUgYXMgaW52ZXJzZSlcbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgaW52ZXJ0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGNvbnN0IGludmVydCA9IGludmVyc2U7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnM7IGFzc3VtZXMgYm90aCB2ZWN0b3JzIGhhdmVcbiAgICAgKiB0aHJlZSBlbnRyaWVzLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3Igb2YgYSBjcm9zcyBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyb3NzKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgdDEgPSBhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdO1xuICAgICAgICBjb25zdCB0MiA9IGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF07XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMV0gKiBiWzJdIC0gYVsyXSAqIGJbMV07XG4gICAgICAgIG5ld0RzdFsxXSA9IHQxO1xuICAgICAgICBuZXdEc3RbMl0gPSB0MjtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzOyBhc3N1bWVzIGJvdGggdmVjdG9ycyBoYXZlXG4gICAgICogdGhyZWUgZW50cmllcy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgZG90IHByb2R1Y3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkb3QoYSwgYikge1xuICAgICAgICByZXR1cm4gKGFbMF0gKiBiWzBdKSArIChhWzFdICogYlsxXSkgKyAoYVsyXSAqIGJbMl0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgbGVuZ3RoIG9mIHZlY3RvclxuICAgICAqIEBwYXJhbSB2IC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGxlbmd0aCBvZiB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVuZ3RoKHYpIHtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHYyID0gdlsyXTtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh2MCAqIHYwICsgdjEgKiB2MSArIHYyICogdjIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgbGVuZ3RoIG9mIHZlY3RvciAoc2FtZSBhcyBsZW5ndGgpXG4gICAgICogQHBhcmFtIHYgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgbGVuZ3RoIG9mIHZlY3Rvci5cbiAgICAgKi9cbiAgICBjb25zdCBsZW4gPSBsZW5ndGg7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHZlY3RvclxuICAgICAqIEBwYXJhbSB2IC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsZW5ndGhTcSh2KSB7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIHJldHVybiB2MCAqIHYwICsgdjEgKiB2MSArIHYyICogdjI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiB2ZWN0b3IgKHNhbWUgYXMgbGVuZ3RoU3EpXG4gICAgICogQHBhcmFtIHYgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgdmVjdG9yLlxuICAgICAqL1xuICAgIGNvbnN0IGxlblNxID0gbGVuZ3RoU3E7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHNcbiAgICAgKiBAcGFyYW0gYSAtIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXN0YW5jZShhLCBiKSB7XG4gICAgICAgIGNvbnN0IGR4ID0gYVswXSAtIGJbMF07XG4gICAgICAgIGNvbnN0IGR5ID0gYVsxXSAtIGJbMV07XG4gICAgICAgIGNvbnN0IGR6ID0gYVsyXSAtIGJbMl07XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkgKyBkeiAqIGR6KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHMgKHNhbWUgYXMgZGlzdGFuY2UpXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gICAgICovXG4gICAgY29uc3QgZGlzdCA9IGRpc3RhbmNlO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHNcbiAgICAgKiBAcGFyYW0gYSAtIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpc3RhbmNlU3EoYSwgYikge1xuICAgICAgICBjb25zdCBkeCA9IGFbMF0gLSBiWzBdO1xuICAgICAgICBjb25zdCBkeSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICBjb25zdCBkeiA9IGFbMl0gLSBiWzJdO1xuICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHkgKyBkeiAqIGR6O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzIChzYW1lIGFzIGRpc3RhbmNlU3EpXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAgICAgKi9cbiAgICBjb25zdCBkaXN0U3EgPSBkaXN0YW5jZVNxO1xuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgaXRzIEV1Y2xpZGVhbiBsZW5ndGggYW5kIHJldHVybnMgdGhlIHF1b3RpZW50LlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBub3JtYWxpemVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBub3JtYWxpemUodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgY29uc3QgdjIgPSB2WzJdO1xuICAgICAgICBjb25zdCBsZW4gPSBNYXRoLnNxcnQodjAgKiB2MCArIHYxICogdjEgKyB2MiAqIHYyKTtcbiAgICAgICAgaWYgKGxlbiA+IDAuMDAwMDEpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IHYwIC8gbGVuO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gdjEgLyBsZW47XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSB2MiAvIGxlbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBOZWdhdGVzIGEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIC12LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5lZ2F0ZSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IC12WzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSAtdlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gLXZbMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvcGllcyBhIHZlY3Rvci4gKHNhbWUgYXMge0BsaW5rIHZlYzMuY2xvbmV9KVxuICAgICAqIEFsc28gc2VlIHtAbGluayB2ZWMzLmNyZWF0ZX0gYW5kIHtAbGluayB2ZWMzLnNldH1cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIGNvcHkgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb3B5KHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gdlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gdlsyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvbmVzIGEgdmVjdG9yLiAoc2FtZSBhcyB7QGxpbmsgdmVjMy5jb3B5fSlcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgdmVjMy5jcmVhdGV9IGFuZCB7QGxpbmsgdmVjMy5zZXR9XG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBjb3B5IG9mIHYuXG4gICAgICovXG4gICAgY29uc3QgY2xvbmUgPSBjb3B5O1xuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgYSB2ZWN0b3IgYnkgYW5vdGhlciB2ZWN0b3IgKGNvbXBvbmVudC13aXNlKTsgYXNzdW1lcyBhIGFuZFxuICAgICAqIGIgaGF2ZSB0aGUgc2FtZSBsZW5ndGguXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBwcm9kdWN0cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsdGlwbHkoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICogYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSAqIGJbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IGFbMl0gKiBiWzJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGFub3RoZXIgdmVjdG9yIChjb21wb25lbnQtd2lzZSk7IGFzc3VtZXMgYSBhbmRcbiAgICAgKiBiIGhhdmUgdGhlIHNhbWUgbGVuZ3RoLiAoc2FtZSBhcyBtdWwpXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBwcm9kdWN0cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3QgbXVsID0gbXVsdGlwbHk7XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIG9mIHF1b3RpZW50cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2aWRlKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSAvIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gLyBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdIC8gYlsyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC4gKHNhbWUgYXMgZGl2aWRlKVxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3Igb2YgcXVvdGllbnRzIG9mIGVudHJpZXMgb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBjb25zdCBkaXYgPSBkaXZpZGU7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHJhbmRvbSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gc2NhbGUgLSBEZWZhdWx0IDFcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByYW5kb20gdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJhbmRvbShzY2FsZSA9IDEsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgICAgIGNvbnN0IHogPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XG4gICAgICAgIGNvbnN0IHpTY2FsZSA9IE1hdGguc3FydCgxIC0geiAqIHopICogc2NhbGU7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGguY29zKGFuZ2xlKSAqIHpTY2FsZTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5zaW4oYW5nbGUpICogelNjYWxlO1xuICAgICAgICBuZXdEc3RbMl0gPSB6ICogc2NhbGU7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFplcm8ncyBhIHZlY3RvclxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHplcm9lZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gemVybyhkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHRyYW5zZm9ybSB2ZWMzIGJ5IDR4NCBtYXRyaXhcbiAgICAgKiBAcGFyYW0gdiAtIHRoZSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG9wdGlvbmFsIHZlYzMgdG8gc3RvcmUgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1NYXQ0KHYsIG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgeCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHkgPSB2WzFdO1xuICAgICAgICBjb25zdCB6ID0gdlsyXTtcbiAgICAgICAgY29uc3QgdyA9IChtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0pIHx8IDE7XG4gICAgICAgIG5ld0RzdFswXSA9IChtWzBdICogeCArIG1bNF0gKiB5ICsgbVs4XSAqIHogKyBtWzEyXSkgLyB3O1xuICAgICAgICBuZXdEc3RbMV0gPSAobVsxXSAqIHggKyBtWzVdICogeSArIG1bOV0gKiB6ICsgbVsxM10pIC8gdztcbiAgICAgICAgbmV3RHN0WzJdID0gKG1bMl0gKiB4ICsgbVs2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XSkgLyB3O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmFuc2Zvcm0gdmVjMyBieSB1cHBlciAzeDMgbWF0cml4IGluc2lkZSA0eDQgbWF0cml4LlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIGRpcmVjdGlvbi5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG9wdGlvbmFsIHZlYzMgdG8gc3RvcmUgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB0cmFuc2Zvcm1lZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtTWF0NFVwcGVyM3gzKHYsIG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHYyID0gdlsyXTtcbiAgICAgICAgbmV3RHN0WzBdID0gdjAgKiBtWzAgKiA0ICsgMF0gKyB2MSAqIG1bMSAqIDQgKyAwXSArIHYyICogbVsyICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbMV0gPSB2MCAqIG1bMCAqIDQgKyAxXSArIHYxICogbVsxICogNCArIDFdICsgdjIgKiBtWzIgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHYwICogbVswICogNCArIDJdICsgdjEgKiBtWzEgKiA0ICsgMl0gKyB2MiAqIG1bMiAqIDQgKyAyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNmb3JtcyB2ZWMzIGJ5IDN4MyBtYXRyaXhcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2IC0gdGhlIHZlY3RvclxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gb3B0aW9uYWwgdmVjMyB0byBzdG9yZSByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybU1hdDModiwgbSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBjb25zdCB4ID0gdlswXTtcbiAgICAgICAgY29uc3QgeSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHogPSB2WzJdO1xuICAgICAgICBuZXdEc3RbMF0gPSB4ICogbVswXSArIHkgKiBtWzRdICsgeiAqIG1bOF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHggKiBtWzFdICsgeSAqIG1bNV0gKyB6ICogbVs5XTtcbiAgICAgICAgbmV3RHN0WzJdID0geCAqIG1bMl0gKyB5ICogbVs2XSArIHogKiBtWzEwXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNmb3JtcyB2ZWMzIGJ5IFF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0gdiAtIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHEgLSB0aGUgcXVhdGVybmlvbiB0byB0cmFuc2Zvcm0gYnlcbiAgICAgKiBAcGFyYW0gZHN0IC0gb3B0aW9uYWwgdmVjMyB0byBzdG9yZSByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIHRyYW5zZm9ybWVkXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtUXVhdCh2LCBxLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIGNvbnN0IHF4ID0gcVswXTtcbiAgICAgICAgY29uc3QgcXkgPSBxWzFdO1xuICAgICAgICBjb25zdCBxeiA9IHFbMl07XG4gICAgICAgIGNvbnN0IHcyID0gcVszXSAqIDI7XG4gICAgICAgIGNvbnN0IHggPSB2WzBdO1xuICAgICAgICBjb25zdCB5ID0gdlsxXTtcbiAgICAgICAgY29uc3QgeiA9IHZbMl07XG4gICAgICAgIGNvbnN0IHV2WCA9IHF5ICogeiAtIHF6ICogeTtcbiAgICAgICAgY29uc3QgdXZZID0gcXogKiB4IC0gcXggKiB6O1xuICAgICAgICBjb25zdCB1dlogPSBxeCAqIHkgLSBxeSAqIHg7XG4gICAgICAgIG5ld0RzdFswXSA9IHggKyB1dlggKiB3MiArIChxeSAqIHV2WiAtIHF6ICogdXZZKSAqIDI7XG4gICAgICAgIG5ld0RzdFsxXSA9IHkgKyB1dlkgKiB3MiArIChxeiAqIHV2WCAtIHF4ICogdXZaKSAqIDI7XG4gICAgICAgIG5ld0RzdFsyXSA9IHogKyB1dlogKiB3MiArIChxeCAqIHV2WSAtIHF5ICogdXZYKSAqIDI7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHRyYW5zbGF0aW9uIGNvbXBvbmVudCBvZiBhIDQtYnktNCBtYXRyaXggYXMgYSB2ZWN0b3Igd2l0aCAzXG4gICAgICogZW50cmllcy5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdHJhbnNsYXRpb24gY29tcG9uZW50IG9mIG0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VHJhbnNsYXRpb24obSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBtWzEyXTtcbiAgICAgICAgbmV3RHN0WzFdID0gbVsxM107XG4gICAgICAgIG5ld0RzdFsyXSA9IG1bMTRdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGF4aXMgb2YgYSA0eDQgbWF0cml4IGFzIGEgdmVjdG9yIHdpdGggMyBlbnRyaWVzXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBheGlzIC0gVGhlIGF4aXMgMCA9IHgsIDEgPSB5LCAyID0gejtcbiAgICAgKiBAcmV0dXJucyBUaGUgYXhpcyBjb21wb25lbnQgb2YgbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRBeGlzKG0sIGF4aXMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3Qgb2ZmID0gYXhpcyAqIDQ7XG4gICAgICAgIG5ld0RzdFswXSA9IG1bb2ZmICsgMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IG1bb2ZmICsgMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IG1bb2ZmICsgMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNjYWxpbmcgY29tcG9uZW50IG9mIHRoZSBtYXRyaXhcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBNYXRyaXhcbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIHZlY3RvciB0byBzZXQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0U2NhbGluZyhtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIGNvbnN0IHh4ID0gbVswXTtcbiAgICAgICAgY29uc3QgeHkgPSBtWzFdO1xuICAgICAgICBjb25zdCB4eiA9IG1bMl07XG4gICAgICAgIGNvbnN0IHl4ID0gbVs0XTtcbiAgICAgICAgY29uc3QgeXkgPSBtWzVdO1xuICAgICAgICBjb25zdCB5eiA9IG1bNl07XG4gICAgICAgIGNvbnN0IHp4ID0gbVs4XTtcbiAgICAgICAgY29uc3QgenkgPSBtWzldO1xuICAgICAgICBjb25zdCB6eiA9IG1bMTBdO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLnNxcnQoeHggKiB4eCArIHh5ICogeHkgKyB4eiAqIHh6KTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5zcXJ0KHl4ICogeXggKyB5eSAqIHl5ICsgeXogKiB5eik7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGguc3FydCh6eCAqIHp4ICsgenkgKiB6eSArIHp6ICogenopO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGUgYSAzRCB2ZWN0b3IgYXJvdW5kIHRoZSB4LWF4aXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBhIFRoZSB2ZWMzIHBvaW50IHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBiIFRoZSBvcmlnaW4gb2YgdGhlIHJvdGF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCBUaGUgYW5nbGUgb2Ygcm90YXRpb24gaW4gcmFkaWFuc1xuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgdmVjdG9yIHRvIHNldC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgcm90YXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGVYKGEsIGIsIHJhZCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBjb25zdCBwID0gW107XG4gICAgICAgIGNvbnN0IHIgPSBbXTtcbiAgICAgICAgLy9UcmFuc2xhdGUgcG9pbnQgdG8gdGhlIG9yaWdpblxuICAgICAgICBwWzBdID0gYVswXSAtIGJbMF07XG4gICAgICAgIHBbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgcFsyXSA9IGFbMl0gLSBiWzJdO1xuICAgICAgICAvL3BlcmZvcm0gcm90YXRpb25cbiAgICAgICAgclswXSA9IHBbMF07XG4gICAgICAgIHJbMV0gPSBwWzFdICogTWF0aC5jb3MocmFkKSAtIHBbMl0gKiBNYXRoLnNpbihyYWQpO1xuICAgICAgICByWzJdID0gcFsxXSAqIE1hdGguc2luKHJhZCkgKyBwWzJdICogTWF0aC5jb3MocmFkKTtcbiAgICAgICAgLy90cmFuc2xhdGUgdG8gY29ycmVjdCBwb3NpdGlvblxuICAgICAgICBuZXdEc3RbMF0gPSByWzBdICsgYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gclsxXSArIGJbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHJbMl0gKyBiWzJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGUgYSAzRCB2ZWN0b3IgYXJvdW5kIHRoZSB5LWF4aXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBhIFRoZSB2ZWMzIHBvaW50IHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBiIFRoZSBvcmlnaW4gb2YgdGhlIHJvdGF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCBUaGUgYW5nbGUgb2Ygcm90YXRpb24gaW4gcmFkaWFuc1xuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgdmVjdG9yIHRvIHNldC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgcm90YXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGVZKGEsIGIsIHJhZCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBjb25zdCBwID0gW107XG4gICAgICAgIGNvbnN0IHIgPSBbXTtcbiAgICAgICAgLy8gdHJhbnNsYXRlIHBvaW50IHRvIHRoZSBvcmlnaW5cbiAgICAgICAgcFswXSA9IGFbMF0gLSBiWzBdO1xuICAgICAgICBwWzFdID0gYVsxXSAtIGJbMV07XG4gICAgICAgIHBbMl0gPSBhWzJdIC0gYlsyXTtcbiAgICAgICAgLy8gcGVyZm9ybSByb3RhdGlvblxuICAgICAgICByWzBdID0gcFsyXSAqIE1hdGguc2luKHJhZCkgKyBwWzBdICogTWF0aC5jb3MocmFkKTtcbiAgICAgICAgclsxXSA9IHBbMV07XG4gICAgICAgIHJbMl0gPSBwWzJdICogTWF0aC5jb3MocmFkKSAtIHBbMF0gKiBNYXRoLnNpbihyYWQpO1xuICAgICAgICAvLyB0cmFuc2xhdGUgdG8gY29ycmVjdCBwb3NpdGlvblxuICAgICAgICBuZXdEc3RbMF0gPSByWzBdICsgYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gclsxXSArIGJbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHJbMl0gKyBiWzJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGUgYSAzRCB2ZWN0b3IgYXJvdW5kIHRoZSB6LWF4aXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBhIFRoZSB2ZWMzIHBvaW50IHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBiIFRoZSBvcmlnaW4gb2YgdGhlIHJvdGF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCBUaGUgYW5nbGUgb2Ygcm90YXRpb24gaW4gcmFkaWFuc1xuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgdmVjdG9yIHRvIHNldC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlWihhLCBiLCByYWQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgcCA9IFtdO1xuICAgICAgICBjb25zdCByID0gW107XG4gICAgICAgIC8vIHRyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gICAgICAgIHBbMF0gPSBhWzBdIC0gYlswXTtcbiAgICAgICAgcFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICBwWzJdID0gYVsyXSAtIGJbMl07XG4gICAgICAgIC8vIHBlcmZvcm0gcm90YXRpb25cbiAgICAgICAgclswXSA9IHBbMF0gKiBNYXRoLmNvcyhyYWQpIC0gcFsxXSAqIE1hdGguc2luKHJhZCk7XG4gICAgICAgIHJbMV0gPSBwWzBdICogTWF0aC5zaW4ocmFkKSArIHBbMV0gKiBNYXRoLmNvcyhyYWQpO1xuICAgICAgICByWzJdID0gcFsyXTtcbiAgICAgICAgLy8gdHJhbnNsYXRlIHRvIGNvcnJlY3QgcG9zaXRpb25cbiAgICAgICAgbmV3RHN0WzBdID0gclswXSArIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHJbMV0gKyBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSByWzJdICsgYlsyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJlYXQgYSAzRCB2ZWN0b3IgYXMgYSBkaXJlY3Rpb24gYW5kIHNldCBpdCdzIGxlbmd0aFxuICAgICAqXG4gICAgICogQHBhcmFtIGEgVGhlIHZlYzMgdG8gbGVuZ3RoZW5cbiAgICAgKiBAcGFyYW0gbGVuIFRoZSBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyB2ZWN0b3JcbiAgICAgKiBAcmV0dXJucyBUaGUgbGVuZ3RoZW5lZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRMZW5ndGgoYSwgbGVuLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5vcm1hbGl6ZShhLCBuZXdEc3QpO1xuICAgICAgICByZXR1cm4gbXVsU2NhbGFyKG5ld0RzdCwgbGVuLCBuZXdEc3QpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbnN1cmUgYSB2ZWN0b3IgaXMgbm90IGxvbmdlciB0aGFuIGEgbWF4IGxlbmd0aFxuICAgICAqXG4gICAgICogQHBhcmFtIGEgVGhlIHZlYzMgdG8gbGltaXRcbiAgICAgKiBAcGFyYW0gbWF4TGVuIFRoZSBsb25nZXN0IGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHZlY3RvclxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3IsIHNob3J0ZW5lZCB0byBtYXhMZW4gaWYgaXQncyB0b28gbG9uZ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRydW5jYXRlKGEsIG1heExlbiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBpZiAobGVuZ3RoKGEpID4gbWF4TGVuKSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0TGVuZ3RoKGEsIG1heExlbiwgbmV3RHN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weShhLCBuZXdEc3QpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIHZlY3RvciBleGFjdGx5IGJldHdlZW4gMiBlbmRwb2ludCB2ZWN0b3JzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYSBFbmRwb2ludCAxXG4gICAgICogQHBhcmFtIGIgRW5kcG9pbnQgMlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3IgZXhhY3RseSByZXNpZGluZyBiZXR3ZWVuIGVuZHBvaW50cyAxIGFuZCAyXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWlkcG9pbnQoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICByZXR1cm4gbGVycChhLCBiLCAwLjUsIG5ld0RzdCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZSxcbiAgICAgICAgZnJvbVZhbHVlcyxcbiAgICAgICAgc2V0LFxuICAgICAgICBjZWlsLFxuICAgICAgICBmbG9vcixcbiAgICAgICAgcm91bmQsXG4gICAgICAgIGNsYW1wLFxuICAgICAgICBhZGQsXG4gICAgICAgIGFkZFNjYWxlZCxcbiAgICAgICAgYW5nbGUsXG4gICAgICAgIHN1YnRyYWN0LFxuICAgICAgICBzdWIsXG4gICAgICAgIGVxdWFsc0FwcHJveGltYXRlbHksXG4gICAgICAgIGVxdWFscyxcbiAgICAgICAgbGVycCxcbiAgICAgICAgbGVycFYsXG4gICAgICAgIG1heCxcbiAgICAgICAgbWluLFxuICAgICAgICBtdWxTY2FsYXIsXG4gICAgICAgIHNjYWxlLFxuICAgICAgICBkaXZTY2FsYXIsXG4gICAgICAgIGludmVyc2UsXG4gICAgICAgIGludmVydCxcbiAgICAgICAgY3Jvc3MsXG4gICAgICAgIGRvdCxcbiAgICAgICAgbGVuZ3RoLFxuICAgICAgICBsZW4sXG4gICAgICAgIGxlbmd0aFNxLFxuICAgICAgICBsZW5TcSxcbiAgICAgICAgZGlzdGFuY2UsXG4gICAgICAgIGRpc3QsXG4gICAgICAgIGRpc3RhbmNlU3EsXG4gICAgICAgIGRpc3RTcSxcbiAgICAgICAgbm9ybWFsaXplLFxuICAgICAgICBuZWdhdGUsXG4gICAgICAgIGNvcHksXG4gICAgICAgIGNsb25lLFxuICAgICAgICBtdWx0aXBseSxcbiAgICAgICAgbXVsLFxuICAgICAgICBkaXZpZGUsXG4gICAgICAgIGRpdixcbiAgICAgICAgcmFuZG9tLFxuICAgICAgICB6ZXJvLFxuICAgICAgICB0cmFuc2Zvcm1NYXQ0LFxuICAgICAgICB0cmFuc2Zvcm1NYXQ0VXBwZXIzeDMsXG4gICAgICAgIHRyYW5zZm9ybU1hdDMsXG4gICAgICAgIHRyYW5zZm9ybVF1YXQsXG4gICAgICAgIGdldFRyYW5zbGF0aW9uLFxuICAgICAgICBnZXRBeGlzLFxuICAgICAgICBnZXRTY2FsaW5nLFxuICAgICAgICByb3RhdGVYLFxuICAgICAgICByb3RhdGVZLFxuICAgICAgICByb3RhdGVaLFxuICAgICAgICBzZXRMZW5ndGgsXG4gICAgICAgIHRydW5jYXRlLFxuICAgICAgICBtaWRwb2ludCxcbiAgICB9O1xufVxuY29uc3QgY2FjaGUkNCA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldEFQSSQ0KEN0b3IpIHtcbiAgICBsZXQgYXBpID0gY2FjaGUkNC5nZXQoQ3Rvcik7XG4gICAgaWYgKCFhcGkpIHtcbiAgICAgICAgYXBpID0gZ2V0QVBJSW1wbCQ0KEN0b3IpO1xuICAgICAgICBjYWNoZSQ0LnNldChDdG9yLCBhcGkpO1xuICAgIH1cbiAgICByZXR1cm4gYXBpO1xufVxuXG4vKlxuICogQ29weXJpZ2h0IDIwMjIgR3JlZ2cgVGF2YXJlc1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4gKiBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksXG4gKiB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4gKiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSxcbiAqIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuICogU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTExcbiAqIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICogRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuICogREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4vKipcbiAqIEdlbmVyYXRlcyBhIHR5cGVkIEFQSSBmb3IgTWF0M1xuICogKi9cbmZ1bmN0aW9uIGdldEFQSUltcGwkMyhDdG9yKSB7XG4gICAgY29uc3QgdmVjMiA9IGdldEFQSSQ1KEN0b3IpO1xuICAgIGNvbnN0IHZlYzMgPSBnZXRBUEkkNChDdG9yKTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBNYXQzIGZyb20gdmFsdWVzXG4gICAgICpcbiAgICAgKiBOb3RlOiBTaW5jZSBwYXNzaW5nIGluIGEgcmF3IEphdmFTY3JpcHQgYXJyYXlcbiAgICAgKiBpcyB2YWxpZCBpbiBhbGwgY2lyY3Vtc3RhbmNlcywgaWYgeW91IHdhbnQgdG9cbiAgICAgKiBmb3JjZSBhIEphdmFTY3JpcHQgYXJyYXkgaW50byBhIE1hdDMncyBzcGVjaWZpZWQgdHlwZVxuICAgICAqIGl0IHdvdWxkIGJlIGZhc3RlciB0byB1c2VcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGNvbnN0IG0gPSBtYXQzLmNsb25lKHNvbWVKU0FycmF5KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2MCAtIHZhbHVlIGZvciBlbGVtZW50IDBcbiAgICAgKiBAcGFyYW0gdjEgLSB2YWx1ZSBmb3IgZWxlbWVudCAxXG4gICAgICogQHBhcmFtIHYyIC0gdmFsdWUgZm9yIGVsZW1lbnQgMlxuICAgICAqIEBwYXJhbSB2MyAtIHZhbHVlIGZvciBlbGVtZW50IDNcbiAgICAgKiBAcGFyYW0gdjQgLSB2YWx1ZSBmb3IgZWxlbWVudCA0XG4gICAgICogQHBhcmFtIHY1IC0gdmFsdWUgZm9yIGVsZW1lbnQgNVxuICAgICAqIEBwYXJhbSB2NiAtIHZhbHVlIGZvciBlbGVtZW50IDZcbiAgICAgKiBAcGFyYW0gdjcgLSB2YWx1ZSBmb3IgZWxlbWVudCA3XG4gICAgICogQHBhcmFtIHY4IC0gdmFsdWUgZm9yIGVsZW1lbnQgOFxuICAgICAqIEByZXR1cm5zIG1hdHJpeCBjcmVhdGVkIGZyb20gdmFsdWVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZSh2MCwgdjEsIHYyLCB2MywgdjQsIHY1LCB2NiwgdjcsIHY4KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IG5ldyBDdG9yKDEyKTtcbiAgICAgICAgLy8gdG8gbWFrZSB0aGUgYXJyYXkgaG9tb2dlbm91c1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgaWYgKHYwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IHYwO1xuICAgICAgICAgICAgaWYgKHYxICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMV0gPSB2MTtcbiAgICAgICAgICAgICAgICBpZiAodjIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdEc3RbMl0gPSB2MjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RzdFs0XSA9IHYzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbNV0gPSB2NDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodjUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbNl0gPSB2NTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RzdFs4XSA9IHY2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY3ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbOV0gPSB2NztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodjggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbMTBdID0gdjg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBhIE1hdDNcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgbWF0My5jcmVhdGV9IGFuZCB7QGxpbmsgbWF0My5jb3B5fVxuICAgICAqXG4gICAgICogQHBhcmFtIHYwIC0gdmFsdWUgZm9yIGVsZW1lbnQgMFxuICAgICAqIEBwYXJhbSB2MSAtIHZhbHVlIGZvciBlbGVtZW50IDFcbiAgICAgKiBAcGFyYW0gdjIgLSB2YWx1ZSBmb3IgZWxlbWVudCAyXG4gICAgICogQHBhcmFtIHYzIC0gdmFsdWUgZm9yIGVsZW1lbnQgM1xuICAgICAqIEBwYXJhbSB2NCAtIHZhbHVlIGZvciBlbGVtZW50IDRcbiAgICAgKiBAcGFyYW0gdjUgLSB2YWx1ZSBmb3IgZWxlbWVudCA1XG4gICAgICogQHBhcmFtIHY2IC0gdmFsdWUgZm9yIGVsZW1lbnQgNlxuICAgICAqIEBwYXJhbSB2NyAtIHZhbHVlIGZvciBlbGVtZW50IDdcbiAgICAgKiBAcGFyYW0gdjggLSB2YWx1ZSBmb3IgZWxlbWVudCA4XG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBNYXQzIHNldCBmcm9tIHZhbHVlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQodjAsIHYxLCB2MiwgdjMsIHY0LCB2NSwgdjYsIHY3LCB2OCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdjA7XG4gICAgICAgIG5ld0RzdFsxXSA9IHYxO1xuICAgICAgICBuZXdEc3RbMl0gPSB2MjtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gdjM7XG4gICAgICAgIG5ld0RzdFs1XSA9IHY0O1xuICAgICAgICBuZXdEc3RbNl0gPSB2NTtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gdjY7XG4gICAgICAgIG5ld0RzdFs5XSA9IHY3O1xuICAgICAgICBuZXdEc3RbMTBdID0gdjg7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgTWF0MyBmcm9tIHRoZSB1cHBlciBsZWZ0IDN4MyBwYXJ0IG9mIGEgTWF0NFxuICAgICAqIEBwYXJhbSBtNCAtIHNvdXJjZSBtYXRyaXhcbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIE1hdDMgbWFkZSBmcm9tIG00XG4gICAgICovXG4gICAgZnVuY3Rpb24gZnJvbU1hdDQobTQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IG00WzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtNFsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gbTRbMl07XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IG00WzRdO1xuICAgICAgICBuZXdEc3RbNV0gPSBtNFs1XTtcbiAgICAgICAgbmV3RHN0WzZdID0gbTRbNl07XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IG00WzhdO1xuICAgICAgICBuZXdEc3RbOV0gPSBtNFs5XTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IG00WzEwXTtcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBNYXQzIHJvdGF0aW9uIG1hdHJpeCBmcm9tIGEgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSBxIC0gcXVhdGVybmlvbiB0byBjcmVhdGUgbWF0cml4IGZyb21cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIE1hdDMgbWFkZSBmcm9tIHFcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmcm9tUXVhdChxLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCB4ID0gcVswXTtcbiAgICAgICAgY29uc3QgeSA9IHFbMV07XG4gICAgICAgIGNvbnN0IHogPSBxWzJdO1xuICAgICAgICBjb25zdCB3ID0gcVszXTtcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcbiAgICAgICAgY29uc3QgeHggPSB4ICogeDI7XG4gICAgICAgIGNvbnN0IHl4ID0geSAqIHgyO1xuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcbiAgICAgICAgY29uc3QgenggPSB6ICogeDI7XG4gICAgICAgIGNvbnN0IHp5ID0geiAqIHkyO1xuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcbiAgICAgICAgY29uc3Qgd3ggPSB3ICogeDI7XG4gICAgICAgIGNvbnN0IHd5ID0gdyAqIHkyO1xuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcbiAgICAgICAgbmV3RHN0WzBdID0gMSAtIHl5IC0geno7XG4gICAgICAgIG5ld0RzdFsxXSA9IHl4ICsgd3o7XG4gICAgICAgIG5ld0RzdFsyXSA9IHp4IC0gd3k7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IHl4IC0gd3o7XG4gICAgICAgIG5ld0RzdFs1XSA9IDEgLSB4eCAtIHp6O1xuICAgICAgICBuZXdEc3RbNl0gPSB6eSArIHd4O1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSB6eCArIHd5O1xuICAgICAgICBuZXdEc3RbOV0gPSB6eSAtIHd4O1xuICAgICAgICBuZXdEc3RbMTBdID0gMSAtIHh4IC0geXk7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBOZWdhdGVzIGEgbWF0cml4LlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIC1tLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5lZ2F0ZShtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSAtbVswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gLW1bMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IC1tWzJdO1xuICAgICAgICBuZXdEc3RbNF0gPSAtbVs0XTtcbiAgICAgICAgbmV3RHN0WzVdID0gLW1bNV07XG4gICAgICAgIG5ld0RzdFs2XSA9IC1tWzZdO1xuICAgICAgICBuZXdEc3RbOF0gPSAtbVs4XTtcbiAgICAgICAgbmV3RHN0WzldID0gLW1bOV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSAtbVsxMF07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvcGllcyBhIG1hdHJpeC4gKHNhbWUgYXMge0BsaW5rIG1hdDMuY2xvbmV9KVxuICAgICAqIEFsc28gc2VlIHtAbGluayBtYXQzLmNyZWF0ZX0gYW5kIHtAbGluayBtYXQzLnNldH1cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIFRoZSBtYXRyaXguIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBjb3B5IG9mIG0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29weShtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBtWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBtWzJdO1xuICAgICAgICBuZXdEc3RbNF0gPSBtWzRdO1xuICAgICAgICBuZXdEc3RbNV0gPSBtWzVdO1xuICAgICAgICBuZXdEc3RbNl0gPSBtWzZdO1xuICAgICAgICBuZXdEc3RbOF0gPSBtWzhdO1xuICAgICAgICBuZXdEc3RbOV0gPSBtWzldO1xuICAgICAgICBuZXdEc3RbMTBdID0gbVsxMF07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvcGllcyBhIG1hdHJpeCAoc2FtZSBhcyB7QGxpbmsgbWF0My5jb3B5fSlcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgbWF0My5jcmVhdGV9IGFuZCB7QGxpbmsgbWF0My5zZXR9XG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgbWF0cml4LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgY29weSBvZiBtLlxuICAgICAqL1xuICAgIGNvbnN0IGNsb25lID0gY29weTtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIG1hdHJpY2VzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsXG4gICAgICogQHBhcmFtIGEgT3BlcmFuZCBtYXRyaXguXG4gICAgICogQHBhcmFtIGIgT3BlcmFuZCBtYXRyaXguXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiBtYXRyaWNlcyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVxdWFsc0FwcHJveGltYXRlbHkoYSwgYikge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYVswXSAtIGJbMF0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsxXSAtIGJbMV0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsyXSAtIGJbMl0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs0XSAtIGJbNF0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs1XSAtIGJbNV0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs2XSAtIGJbNl0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs4XSAtIGJbOF0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs5XSAtIGJbOV0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsxMF0gLSBiWzEwXSkgPCBFUFNJTE9OO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIG1hdHJpY2VzIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICogQHBhcmFtIGEgT3BlcmFuZCBtYXRyaXguXG4gICAgICogQHBhcmFtIGIgT3BlcmFuZCBtYXRyaXguXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiBtYXRyaWNlcyBhcmUgZXhhY3RseSBlcXVhbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gICAgICAgIHJldHVybiBhWzBdID09PSBiWzBdICYmXG4gICAgICAgICAgICBhWzFdID09PSBiWzFdICYmXG4gICAgICAgICAgICBhWzJdID09PSBiWzJdICYmXG4gICAgICAgICAgICBhWzRdID09PSBiWzRdICYmXG4gICAgICAgICAgICBhWzVdID09PSBiWzVdICYmXG4gICAgICAgICAgICBhWzZdID09PSBiWzZdICYmXG4gICAgICAgICAgICBhWzhdID09PSBiWzhdICYmXG4gICAgICAgICAgICBhWzldID09PSBiWzldICYmXG4gICAgICAgICAgICBhWzEwXSA9PT0gYlsxMF07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSAzLWJ5LTMgaWRlbnRpdHkgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIDMtYnktMyBpZGVudGl0eSBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gaWRlbnRpdHkoZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gMTtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gMTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRha2VzIHRoZSB0cmFuc3Bvc2Ugb2YgYSBtYXRyaXguXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHRyYW5zcG9zZSBvZiBtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zcG9zZShtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBpZiAobmV3RHN0ID09PSBtKSB7XG4gICAgICAgICAgICBsZXQgdDtcbiAgICAgICAgICAgIC8vIDAgMSAyXG4gICAgICAgICAgICAvLyA0IDUgNlxuICAgICAgICAgICAgLy8gOCA5IDEwXG4gICAgICAgICAgICB0ID0gbVsxXTtcbiAgICAgICAgICAgIG1bMV0gPSBtWzRdO1xuICAgICAgICAgICAgbVs0XSA9IHQ7XG4gICAgICAgICAgICB0ID0gbVsyXTtcbiAgICAgICAgICAgIG1bMl0gPSBtWzhdO1xuICAgICAgICAgICAgbVs4XSA9IHQ7XG4gICAgICAgICAgICB0ID0gbVs2XTtcbiAgICAgICAgICAgIG1bNl0gPSBtWzldO1xuICAgICAgICAgICAgbVs5XSA9IHQ7XG4gICAgICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG0wMCA9IG1bMCAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTAxID0gbVswICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtWzAgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0xMCA9IG1bMSAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTExID0gbVsxICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMTIgPSBtWzEgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bMiAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTIxID0gbVsyICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMjIgPSBtWzIgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFswXSA9IG0wMDtcbiAgICAgICAgbmV3RHN0WzFdID0gbTEwO1xuICAgICAgICBuZXdEc3RbMl0gPSBtMjA7XG4gICAgICAgIG5ld0RzdFs0XSA9IG0wMTtcbiAgICAgICAgbmV3RHN0WzVdID0gbTExO1xuICAgICAgICBuZXdEc3RbNl0gPSBtMjE7XG4gICAgICAgIG5ld0RzdFs4XSA9IG0wMjtcbiAgICAgICAgbmV3RHN0WzldID0gbTEyO1xuICAgICAgICBuZXdEc3RbMTBdID0gbTIyO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgaW52ZXJzZSBvZiBhIDMtYnktMyBtYXRyaXguXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGludmVyc2Ugb2YgbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnZlcnNlKG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIGNvbnN0IG0wMCA9IG1bMCAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTAxID0gbVswICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtWzAgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0xMCA9IG1bMSAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTExID0gbVsxICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMTIgPSBtWzEgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bMiAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTIxID0gbVsyICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMjIgPSBtWzIgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IGIwMSA9IG0yMiAqIG0xMSAtIG0xMiAqIG0yMTtcbiAgICAgICAgY29uc3QgYjExID0gLW0yMiAqIG0xMCArIG0xMiAqIG0yMDtcbiAgICAgICAgY29uc3QgYjIxID0gbTIxICogbTEwIC0gbTExICogbTIwO1xuICAgICAgICBjb25zdCBpbnZEZXQgPSAxIC8gKG0wMCAqIGIwMSArIG0wMSAqIGIxMSArIG0wMiAqIGIyMSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGIwMSAqIGludkRldDtcbiAgICAgICAgbmV3RHN0WzFdID0gKC1tMjIgKiBtMDEgKyBtMDIgKiBtMjEpICogaW52RGV0O1xuICAgICAgICBuZXdEc3RbMl0gPSAobTEyICogbTAxIC0gbTAyICogbTExKSAqIGludkRldDtcbiAgICAgICAgbmV3RHN0WzRdID0gYjExICogaW52RGV0O1xuICAgICAgICBuZXdEc3RbNV0gPSAobTIyICogbTAwIC0gbTAyICogbTIwKSAqIGludkRldDtcbiAgICAgICAgbmV3RHN0WzZdID0gKC1tMTIgKiBtMDAgKyBtMDIgKiBtMTApICogaW52RGV0O1xuICAgICAgICBuZXdEc3RbOF0gPSBiMjEgKiBpbnZEZXQ7XG4gICAgICAgIG5ld0RzdFs5XSA9ICgtbTIxICogbTAwICsgbTAxICogbTIwKSAqIGludkRldDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IChtMTEgKiBtMDAgLSBtMDEgKiBtMTApICogaW52RGV0O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIHRoZSBkZXRlcm1pbmFudCBvZiBhIG1hdHJpeFxuICAgICAqIEBwYXJhbSBtIC0gdGhlIG1hdHJpeFxuICAgICAqIEByZXR1cm5zIHRoZSBkZXRlcm1pbmFudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRldGVybWluYW50KG0pIHtcbiAgICAgICAgY29uc3QgbTAwID0gbVswICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMDEgPSBtWzAgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0wMiA9IG1bMCAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTEwID0gbVsxICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMTEgPSBtWzEgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0xMiA9IG1bMSAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTIwID0gbVsyICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMjEgPSBtWzIgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0yMiA9IG1bMiAqIDQgKyAyXTtcbiAgICAgICAgcmV0dXJuIG0wMCAqIChtMTEgKiBtMjIgLSBtMjEgKiBtMTIpIC1cbiAgICAgICAgICAgIG0xMCAqIChtMDEgKiBtMjIgLSBtMjEgKiBtMDIpICtcbiAgICAgICAgICAgIG0yMCAqIChtMDEgKiBtMTIgLSBtMTEgKiBtMDIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgaW52ZXJzZSBvZiBhIDMtYnktMyBtYXRyaXguIChzYW1lIGFzIGludmVyc2UpXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGludmVyc2Ugb2YgbS5cbiAgICAgKi9cbiAgICBjb25zdCBpbnZlcnQgPSBpbnZlcnNlO1xuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgdHdvIDMtYnktMyBtYXRyaWNlcyB3aXRoIGEgb24gdGhlIGxlZnQgYW5kIGIgb24gdGhlIHJpZ2h0XG4gICAgICogQHBhcmFtIGEgLSBUaGUgbWF0cml4IG9uIHRoZSBsZWZ0LlxuICAgICAqIEBwYXJhbSBiIC0gVGhlIG1hdHJpeCBvbiB0aGUgcmlnaHQuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbWF0cml4IHByb2R1Y3Qgb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtdWx0aXBseShhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCBhMDAgPSBhWzBdO1xuICAgICAgICBjb25zdCBhMDEgPSBhWzFdO1xuICAgICAgICBjb25zdCBhMDIgPSBhWzJdO1xuICAgICAgICBjb25zdCBhMTAgPSBhWzQgKyAwXTtcbiAgICAgICAgY29uc3QgYTExID0gYVs0ICsgMV07XG4gICAgICAgIGNvbnN0IGExMiA9IGFbNCArIDJdO1xuICAgICAgICBjb25zdCBhMjAgPSBhWzggKyAwXTtcbiAgICAgICAgY29uc3QgYTIxID0gYVs4ICsgMV07XG4gICAgICAgIGNvbnN0IGEyMiA9IGFbOCArIDJdO1xuICAgICAgICBjb25zdCBiMDAgPSBiWzBdO1xuICAgICAgICBjb25zdCBiMDEgPSBiWzFdO1xuICAgICAgICBjb25zdCBiMDIgPSBiWzJdO1xuICAgICAgICBjb25zdCBiMTAgPSBiWzQgKyAwXTtcbiAgICAgICAgY29uc3QgYjExID0gYls0ICsgMV07XG4gICAgICAgIGNvbnN0IGIxMiA9IGJbNCArIDJdO1xuICAgICAgICBjb25zdCBiMjAgPSBiWzggKyAwXTtcbiAgICAgICAgY29uc3QgYjIxID0gYls4ICsgMV07XG4gICAgICAgIGNvbnN0IGIyMiA9IGJbOCArIDJdO1xuICAgICAgICBuZXdEc3RbMF0gPSBhMDAgKiBiMDAgKyBhMTAgKiBiMDEgKyBhMjAgKiBiMDI7XG4gICAgICAgIG5ld0RzdFsxXSA9IGEwMSAqIGIwMCArIGExMSAqIGIwMSArIGEyMSAqIGIwMjtcbiAgICAgICAgbmV3RHN0WzJdID0gYTAyICogYjAwICsgYTEyICogYjAxICsgYTIyICogYjAyO1xuICAgICAgICBuZXdEc3RbNF0gPSBhMDAgKiBiMTAgKyBhMTAgKiBiMTEgKyBhMjAgKiBiMTI7XG4gICAgICAgIG5ld0RzdFs1XSA9IGEwMSAqIGIxMCArIGExMSAqIGIxMSArIGEyMSAqIGIxMjtcbiAgICAgICAgbmV3RHN0WzZdID0gYTAyICogYjEwICsgYTEyICogYjExICsgYTIyICogYjEyO1xuICAgICAgICBuZXdEc3RbOF0gPSBhMDAgKiBiMjAgKyBhMTAgKiBiMjEgKyBhMjAgKiBiMjI7XG4gICAgICAgIG5ld0RzdFs5XSA9IGEwMSAqIGIyMCArIGExMSAqIGIyMSArIGEyMSAqIGIyMjtcbiAgICAgICAgbmV3RHN0WzEwXSA9IGEwMiAqIGIyMCArIGExMiAqIGIyMSArIGEyMiAqIGIyMjtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyB0d28gMy1ieS0zIG1hdHJpY2VzIHdpdGggYSBvbiB0aGUgbGVmdCBhbmQgYiBvbiB0aGUgcmlnaHQgKHNhbWUgYXMgbXVsdGlwbHkpXG4gICAgICogQHBhcmFtIGEgLSBUaGUgbWF0cml4IG9uIHRoZSBsZWZ0LlxuICAgICAqIEBwYXJhbSBiIC0gVGhlIG1hdHJpeCBvbiB0aGUgcmlnaHQuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbWF0cml4IHByb2R1Y3Qgb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBjb25zdCBtdWwgPSBtdWx0aXBseTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB0cmFuc2xhdGlvbiBjb21wb25lbnQgb2YgYSAzLWJ5LTMgbWF0cml4IHRvIHRoZSBnaXZlblxuICAgICAqIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1hdHJpeCB3aXRoIHRyYW5zbGF0aW9uIHNldC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRUcmFuc2xhdGlvbihhLCB2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBpZGVudGl0eSgpKTtcbiAgICAgICAgaWYgKGEgIT09IG5ld0RzdCkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gYVswXTtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IGFbMV07XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSBhWzJdO1xuICAgICAgICAgICAgbmV3RHN0WzRdID0gYVs0XTtcbiAgICAgICAgICAgIG5ld0RzdFs1XSA9IGFbNV07XG4gICAgICAgICAgICBuZXdEc3RbNl0gPSBhWzZdO1xuICAgICAgICB9XG4gICAgICAgIG5ld0RzdFs4XSA9IHZbMF07XG4gICAgICAgIG5ld0RzdFs5XSA9IHZbMV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2xhdGlvbiBjb21wb25lbnQgb2YgYSAzLWJ5LTMgbWF0cml4IGFzIGEgdmVjdG9yIHdpdGggM1xuICAgICAqIGVudHJpZXMuXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHRyYW5zbGF0aW9uIGNvbXBvbmVudCBvZiBtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFRyYW5zbGF0aW9uKG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IHZlYzIuY3JlYXRlKCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBtWzhdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtWzldO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGF4aXMgb2YgYSAzeDMgbWF0cml4IGFzIGEgdmVjdG9yIHdpdGggMiBlbnRyaWVzXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBheGlzIC0gVGhlIGF4aXMgMCA9IHgsIDEgPSB5LFxuICAgICAqIEByZXR1cm5zIFRoZSBheGlzIGNvbXBvbmVudCBvZiBtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEF4aXMobSwgYXhpcywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gdmVjMi5jcmVhdGUoKSk7XG4gICAgICAgIGNvbnN0IG9mZiA9IGF4aXMgKiA0O1xuICAgICAgICBuZXdEc3RbMF0gPSBtW29mZiArIDBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtW29mZiArIDFdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGFuIGF4aXMgb2YgYSAzeDMgbWF0cml4IGFzIGEgdmVjdG9yIHdpdGggMiBlbnRyaWVzXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSB2IC0gdGhlIGF4aXMgdmVjdG9yXG4gICAgICogQHBhcmFtIGF4aXMgLSBUaGUgYXhpcyAgMCA9IHgsIDEgPSB5O1xuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgbWF0cml4IHRvIHNldC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbWF0cml4IHdpdGggYXhpcyBzZXQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0QXhpcyhtLCB2LCBheGlzLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA9PT0gbSA/IG0gOiBjb3B5KG0sIGRzdCkpO1xuICAgICAgICBjb25zdCBvZmYgPSBheGlzICogNDtcbiAgICAgICAgbmV3RHN0W29mZiArIDBdID0gdlswXTtcbiAgICAgICAgbmV3RHN0W29mZiArIDFdID0gdlsxXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgXCIyZFwiIHNjYWxpbmcgY29tcG9uZW50IG9mIHRoZSBtYXRyaXhcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBNYXRyaXhcbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIHZlY3RvciB0byBzZXQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0U2NhbGluZyhtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyB2ZWMyLmNyZWF0ZSgpKTtcbiAgICAgICAgY29uc3QgeHggPSBtWzBdO1xuICAgICAgICBjb25zdCB4eSA9IG1bMV07XG4gICAgICAgIGNvbnN0IHl4ID0gbVs0XTtcbiAgICAgICAgY29uc3QgeXkgPSBtWzVdO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLnNxcnQoeHggKiB4eCArIHh5ICogeHkpO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLnNxcnQoeXggKiB5eCArIHl5ICogeXkpO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBcIjNkXCIgc2NhbGluZyBjb21wb25lbnQgb2YgdGhlIG1hdHJpeFxuICAgICAqIEBwYXJhbSBtIC0gVGhlIE1hdHJpeFxuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgdmVjdG9yIHRvIHNldC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXQzRFNjYWxpbmcobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gdmVjMy5jcmVhdGUoKSk7XG4gICAgICAgIGNvbnN0IHh4ID0gbVswXTtcbiAgICAgICAgY29uc3QgeHkgPSBtWzFdO1xuICAgICAgICBjb25zdCB4eiA9IG1bMl07XG4gICAgICAgIGNvbnN0IHl4ID0gbVs0XTtcbiAgICAgICAgY29uc3QgeXkgPSBtWzVdO1xuICAgICAgICBjb25zdCB5eiA9IG1bNl07XG4gICAgICAgIGNvbnN0IHp4ID0gbVs4XTtcbiAgICAgICAgY29uc3QgenkgPSBtWzldO1xuICAgICAgICBjb25zdCB6eiA9IG1bMTBdO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLnNxcnQoeHggKiB4eCArIHh5ICogeHkgKyB4eiAqIHh6KTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5zcXJ0KHl4ICogeXggKyB5eSAqIHl5ICsgeXogKiB5eik7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGguc3FydCh6eCAqIHp4ICsgenkgKiB6eSArIHp6ICogenopO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgMy1ieS0zIG1hdHJpeCB3aGljaCB0cmFuc2xhdGVzIGJ5IHRoZSBnaXZlbiB2ZWN0b3Igdi5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IgYnkgd2hpY2ggdG8gdHJhbnNsYXRlLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHRyYW5zbGF0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGlvbih2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSAxO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSAxO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSB2WzBdO1xuICAgICAgICBuZXdEc3RbOV0gPSB2WzFdO1xuICAgICAgICBuZXdEc3RbMTBdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gMy1ieS0zIG1hdHJpeCBieSB0aGUgZ2l2ZW4gdmVjdG9yIHYuXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3RvciBieSB3aGljaCB0byB0cmFuc2xhdGUuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdHJhbnNsYXRlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKG0sIHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCBtMDAgPSBtWzBdO1xuICAgICAgICBjb25zdCBtMDEgPSBtWzFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtWzJdO1xuICAgICAgICBjb25zdCBtMTAgPSBtWzEgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bMSAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTEyID0gbVsxICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMjAgPSBtWzIgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0yMSA9IG1bMiAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsyICogNCArIDJdO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSBtMDA7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSBtMDE7XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSBtMDI7XG4gICAgICAgICAgICBuZXdEc3RbNF0gPSBtMTA7XG4gICAgICAgICAgICBuZXdEc3RbNV0gPSBtMTE7XG4gICAgICAgICAgICBuZXdEc3RbNl0gPSBtMTI7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RHN0WzhdID0gbTAwICogdjAgKyBtMTAgKiB2MSArIG0yMDtcbiAgICAgICAgbmV3RHN0WzldID0gbTAxICogdjAgKyBtMTEgKiB2MSArIG0yMTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IG0wMiAqIHYwICsgbTEyICogdjEgKyBtMjI7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSAzLWJ5LTMgbWF0cml4IHdoaWNoIHJvdGF0ZXMgIGJ5IHRoZSBnaXZlbiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGlvbiBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRpb24oYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFswXSA9IGM7XG4gICAgICAgIG5ld0RzdFsxXSA9IHM7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IC1zO1xuICAgICAgICBuZXdEc3RbNV0gPSBjO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTBdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gMy1ieS0zIG1hdHJpeCAgYnkgdGhlIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGUobSwgYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIGNvbnN0IG0wMCA9IG1bMCAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTAxID0gbVswICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtWzAgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0xMCA9IG1bMSAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTExID0gbVsxICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMTIgPSBtWzEgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFswXSA9IGMgKiBtMDAgKyBzICogbTEwO1xuICAgICAgICBuZXdEc3RbMV0gPSBjICogbTAxICsgcyAqIG0xMTtcbiAgICAgICAgbmV3RHN0WzJdID0gYyAqIG0wMiArIHMgKiBtMTI7XG4gICAgICAgIG5ld0RzdFs0XSA9IGMgKiBtMTAgLSBzICogbTAwO1xuICAgICAgICBuZXdEc3RbNV0gPSBjICogbTExIC0gcyAqIG0wMTtcbiAgICAgICAgbmV3RHN0WzZdID0gYyAqIG0xMiAtIHMgKiBtMDI7XG4gICAgICAgIGlmIChtICE9PSBuZXdEc3QpIHtcbiAgICAgICAgICAgIG5ld0RzdFs4XSA9IG1bOF07XG4gICAgICAgICAgICBuZXdEc3RbOV0gPSBtWzldO1xuICAgICAgICAgICAgbmV3RHN0WzEwXSA9IG1bMTBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSAzLWJ5LTMgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYXJvdW5kIHRoZSB4LWF4aXMgYnkgdGhlIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHJvdGF0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGlvblgoYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFswXSA9IDE7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IGM7XG4gICAgICAgIG5ld0RzdFs2XSA9IHM7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IC1zO1xuICAgICAgICBuZXdEc3RbMTBdID0gYztcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gMy1ieS0zIG1hdHJpeCBhcm91bmQgdGhlIHgtYXhpcyBieSB0aGUgZ2l2ZW5cbiAgICAgKiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlWChtLCBhbmdsZUluUmFkaWFucywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgY29uc3QgbTEwID0gbVs0XTtcbiAgICAgICAgY29uc3QgbTExID0gbVs1XTtcbiAgICAgICAgY29uc3QgbTEyID0gbVs2XTtcbiAgICAgICAgY29uc3QgbTIwID0gbVs4XTtcbiAgICAgICAgY29uc3QgbTIxID0gbVs5XTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsxMF07XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFs0XSA9IGMgKiBtMTAgKyBzICogbTIwO1xuICAgICAgICBuZXdEc3RbNV0gPSBjICogbTExICsgcyAqIG0yMTtcbiAgICAgICAgbmV3RHN0WzZdID0gYyAqIG0xMiArIHMgKiBtMjI7XG4gICAgICAgIG5ld0RzdFs4XSA9IGMgKiBtMjAgLSBzICogbTEwO1xuICAgICAgICBuZXdEc3RbOV0gPSBjICogbTIxIC0gcyAqIG0xMTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IGMgKiBtMjIgLSBzICogbTEyO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSBtWzBdO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gbVsxXTtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IG1bMl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDMtYnktMyBtYXRyaXggd2hpY2ggcm90YXRlcyBhcm91bmQgdGhlIHktYXhpcyBieSB0aGUgZ2l2ZW4gYW5nbGUuXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRpb24gbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0aW9uWShhbmdsZUluUmFkaWFucywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYztcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gLXM7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IDE7XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IHM7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBjO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIHRoZSBnaXZlbiAzLWJ5LTMgbWF0cml4IGFyb3VuZCB0aGUgeS1heGlzIGJ5IHRoZSBnaXZlblxuICAgICAqIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGVZKG0sIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCBtMDAgPSBtWzAgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG1bMCAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbVswICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMjAgPSBtWzIgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0yMSA9IG1bMiAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsyICogNCArIDJdO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbMF0gPSBjICogbTAwIC0gcyAqIG0yMDtcbiAgICAgICAgbmV3RHN0WzFdID0gYyAqIG0wMSAtIHMgKiBtMjE7XG4gICAgICAgIG5ld0RzdFsyXSA9IGMgKiBtMDIgLSBzICogbTIyO1xuICAgICAgICBuZXdEc3RbOF0gPSBjICogbTIwICsgcyAqIG0wMDtcbiAgICAgICAgbmV3RHN0WzldID0gYyAqIG0yMSArIHMgKiBtMDE7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBjICogbTIyICsgcyAqIG0wMjtcbiAgICAgICAgaWYgKG0gIT09IG5ld0RzdCkge1xuICAgICAgICAgICAgbmV3RHN0WzRdID0gbVs0XTtcbiAgICAgICAgICAgIG5ld0RzdFs1XSA9IG1bNV07XG4gICAgICAgICAgICBuZXdEc3RbNl0gPSBtWzZdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSAzLWJ5LTMgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYXJvdW5kIHRoZSB6LWF4aXMgYnkgdGhlIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHJvdGF0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBjb25zdCByb3RhdGlvblogPSByb3RhdGlvbjtcbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIHRoZSBnaXZlbiAzLWJ5LTMgbWF0cml4IGFyb3VuZCB0aGUgei1heGlzIGJ5IHRoZSBnaXZlblxuICAgICAqIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBjb25zdCByb3RhdGVaID0gcm90YXRlO1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSAzLWJ5LTMgbWF0cml4IHdoaWNoIHNjYWxlcyBpbiBlYWNoIGRpbWVuc2lvbiBieSBhbiBhbW91bnQgZ2l2ZW4gYnlcbiAgICAgKiB0aGUgY29ycmVzcG9uZGluZyBlbnRyeSBpbiB0aGUgZ2l2ZW4gdmVjdG9yOyBhc3N1bWVzIHRoZSB2ZWN0b3IgaGFzIHR3b1xuICAgICAqIGVudHJpZXMuXG4gICAgICogQHBhcmFtIHYgLSBBIHZlY3RvciBvZlxuICAgICAqICAgICAyIGVudHJpZXMgc3BlY2lmeWluZyB0aGUgZmFjdG9yIGJ5IHdoaWNoIHRvIHNjYWxlIGluIGVhY2ggZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxpbmcgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNjYWxpbmcodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gdlsxXTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNjYWxlcyB0aGUgZ2l2ZW4gMy1ieS0zIG1hdHJpeCBpbiBlYWNoIGRpbWVuc2lvbiBieSBhbiBhbW91bnRcbiAgICAgKiBnaXZlbiBieSB0aGUgY29ycmVzcG9uZGluZyBlbnRyeSBpbiB0aGUgZ2l2ZW4gdmVjdG9yOyBhc3N1bWVzIHRoZSB2ZWN0b3IgaGFzXG4gICAgICogdHdvIGVudHJpZXMuXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4IHRvIGJlIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSB2IC0gQSB2ZWN0b3Igb2YgMiBlbnRyaWVzIHNwZWNpZnlpbmcgdGhlXG4gICAgICogICAgIGZhY3RvciBieSB3aGljaCB0byBzY2FsZSBpbiBlYWNoIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNjYWxlKG0sIHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBuZXdEc3RbMF0gPSB2MCAqIG1bMCAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzFdID0gdjAgKiBtWzAgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHYwICogbVswICogNCArIDJdO1xuICAgICAgICBuZXdEc3RbNF0gPSB2MSAqIG1bMSAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzVdID0gdjEgKiBtWzEgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFs2XSA9IHYxICogbVsxICogNCArIDJdO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbOF0gPSBtWzhdO1xuICAgICAgICAgICAgbmV3RHN0WzldID0gbVs5XTtcbiAgICAgICAgICAgIG5ld0RzdFsxMF0gPSBtWzEwXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgMy1ieS0zIG1hdHJpeCB3aGljaCBzY2FsZXMgaW4gZWFjaCBkaW1lbnNpb24gYnkgYW4gYW1vdW50IGdpdmVuIGJ5XG4gICAgICogdGhlIGNvcnJlc3BvbmRpbmcgZW50cnkgaW4gdGhlIGdpdmVuIHZlY3RvcjsgYXNzdW1lcyB0aGUgdmVjdG9yIGhhcyB0aHJlZVxuICAgICAqIGVudHJpZXMuXG4gICAgICogQHBhcmFtIHYgLSBBIHZlY3RvciBvZlxuICAgICAqICAgICAzIGVudHJpZXMgc3BlY2lmeWluZyB0aGUgZmFjdG9yIGJ5IHdoaWNoIHRvIHNjYWxlIGluIGVhY2ggZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxpbmcgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNjYWxpbmczRCh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSB2WzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSB2WzFdO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTBdID0gdlsyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2NhbGVzIHRoZSBnaXZlbiAzLWJ5LTMgbWF0cml4IGluIGVhY2ggZGltZW5zaW9uIGJ5IGFuIGFtb3VudFxuICAgICAqIGdpdmVuIGJ5IHRoZSBjb3JyZXNwb25kaW5nIGVudHJ5IGluIHRoZSBnaXZlbiB2ZWN0b3I7IGFzc3VtZXMgdGhlIHZlY3RvciBoYXNcbiAgICAgKiB0aHJlZSBlbnRyaWVzLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeCB0byBiZSBtb2RpZmllZC5cbiAgICAgKiBAcGFyYW0gdiAtIEEgdmVjdG9yIG9mIDMgZW50cmllcyBzcGVjaWZ5aW5nIHRoZVxuICAgICAqICAgICBmYWN0b3IgYnkgd2hpY2ggdG8gc2NhbGUgaW4gZWFjaCBkaW1lbnNpb24uXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzY2FsZTNEKG0sIHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIG5ld0RzdFswXSA9IHYwICogbVswICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbMV0gPSB2MCAqIG1bMCAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gdjAgKiBtWzAgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFs0XSA9IHYxICogbVsxICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbNV0gPSB2MSAqIG1bMSAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzZdID0gdjEgKiBtWzEgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFs4XSA9IHYyICogbVsyICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbOV0gPSB2MiAqIG1bMiAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IHYyICogbVsyICogNCArIDJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgMy1ieS0zIG1hdHJpeCB3aGljaCBzY2FsZXMgdW5pZm9ybWx5IGluIHRoZSBYIGFuZCBZIGRpbWVuc2lvbnNcbiAgICAgKiBAcGFyYW0gcyAtIEFtb3VudCB0byBzY2FsZVxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxpbmcgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVuaWZvcm1TY2FsaW5nKHMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHM7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IHM7XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTY2FsZXMgdGhlIGdpdmVuIDMtYnktMyBtYXRyaXggaW4gdGhlIFggYW5kIFkgZGltZW5zaW9uIGJ5IGFuIGFtb3VudFxuICAgICAqIGdpdmVuLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeCB0byBiZSBtb2RpZmllZC5cbiAgICAgKiBAcGFyYW0gcyAtIEFtb3VudCB0byBzY2FsZS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVuaWZvcm1TY2FsZShtLCBzLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBzICogbVswICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBzICogbVswICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBzICogbVswICogNCArIDJdO1xuICAgICAgICBuZXdEc3RbNF0gPSBzICogbVsxICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbNV0gPSBzICogbVsxICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbNl0gPSBzICogbVsxICogNCArIDJdO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbOF0gPSBtWzhdO1xuICAgICAgICAgICAgbmV3RHN0WzldID0gbVs5XTtcbiAgICAgICAgICAgIG5ld0RzdFsxMF0gPSBtWzEwXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgMy1ieS0zIG1hdHJpeCB3aGljaCBzY2FsZXMgdW5pZm9ybWx5IGluIGVhY2ggZGltZW5zaW9uXG4gICAgICogQHBhcmFtIHMgLSBBbW91bnQgdG8gc2NhbGVcbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsaW5nIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmlmb3JtU2NhbGluZzNEKHMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHM7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IHM7XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBzO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTY2FsZXMgdGhlIGdpdmVuIDMtYnktMyBtYXRyaXggaW4gZWFjaCBkaW1lbnNpb24gYnkgYW4gYW1vdW50XG4gICAgICogZ2l2ZW4uXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4IHRvIGJlIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSBzIC0gQW1vdW50IHRvIHNjYWxlLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5pZm9ybVNjYWxlM0QobSwgcywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gcyAqIG1bMCAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzFdID0gcyAqIG1bMCAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gcyAqIG1bMCAqIDQgKyAyXTtcbiAgICAgICAgbmV3RHN0WzRdID0gcyAqIG1bMSAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzVdID0gcyAqIG1bMSAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzZdID0gcyAqIG1bMSAqIDQgKyAyXTtcbiAgICAgICAgbmV3RHN0WzhdID0gcyAqIG1bMiAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzldID0gcyAqIG1bMiAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IHMgKiBtWzIgKiA0ICsgMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNsb25lLFxuICAgICAgICBjcmVhdGUsXG4gICAgICAgIHNldCxcbiAgICAgICAgZnJvbU1hdDQsXG4gICAgICAgIGZyb21RdWF0LFxuICAgICAgICBuZWdhdGUsXG4gICAgICAgIGNvcHksXG4gICAgICAgIGVxdWFsc0FwcHJveGltYXRlbHksXG4gICAgICAgIGVxdWFscyxcbiAgICAgICAgaWRlbnRpdHksXG4gICAgICAgIHRyYW5zcG9zZSxcbiAgICAgICAgaW52ZXJzZSxcbiAgICAgICAgaW52ZXJ0LFxuICAgICAgICBkZXRlcm1pbmFudCxcbiAgICAgICAgbXVsLFxuICAgICAgICBtdWx0aXBseSxcbiAgICAgICAgc2V0VHJhbnNsYXRpb24sXG4gICAgICAgIGdldFRyYW5zbGF0aW9uLFxuICAgICAgICBnZXRBeGlzLFxuICAgICAgICBzZXRBeGlzLFxuICAgICAgICBnZXRTY2FsaW5nLFxuICAgICAgICBnZXQzRFNjYWxpbmcsXG4gICAgICAgIHRyYW5zbGF0aW9uLFxuICAgICAgICB0cmFuc2xhdGUsXG4gICAgICAgIHJvdGF0aW9uLFxuICAgICAgICByb3RhdGUsXG4gICAgICAgIHJvdGF0aW9uWCxcbiAgICAgICAgcm90YXRlWCxcbiAgICAgICAgcm90YXRpb25ZLFxuICAgICAgICByb3RhdGVZLFxuICAgICAgICByb3RhdGlvblosXG4gICAgICAgIHJvdGF0ZVosXG4gICAgICAgIHNjYWxpbmcsXG4gICAgICAgIHNjYWxlLFxuICAgICAgICB1bmlmb3JtU2NhbGluZyxcbiAgICAgICAgdW5pZm9ybVNjYWxlLFxuICAgICAgICBzY2FsaW5nM0QsXG4gICAgICAgIHNjYWxlM0QsXG4gICAgICAgIHVuaWZvcm1TY2FsaW5nM0QsXG4gICAgICAgIHVuaWZvcm1TY2FsZTNELFxuICAgIH07XG59XG5jb25zdCBjYWNoZSQzID0gbmV3IE1hcCgpO1xuZnVuY3Rpb24gZ2V0QVBJJDMoQ3Rvcikge1xuICAgIGxldCBhcGkgPSBjYWNoZSQzLmdldChDdG9yKTtcbiAgICBpZiAoIWFwaSkge1xuICAgICAgICBhcGkgPSBnZXRBUElJbXBsJDMoQ3Rvcik7XG4gICAgICAgIGNhY2hlJDMuc2V0KEN0b3IsIGFwaSk7XG4gICAgfVxuICAgIHJldHVybiBhcGk7XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdHlwZWQgQVBJIGZvciBNYXQ0XG4gKiAqL1xuZnVuY3Rpb24gZ2V0QVBJSW1wbCQyKEN0b3IpIHtcbiAgICBjb25zdCB2ZWMzID0gZ2V0QVBJJDQoQ3Rvcik7XG4gICAgLyoqXG4gICAgICogNHg0IE1hdHJpeCBtYXRoIG1hdGggZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQWxtb3N0IGFsbCBmdW5jdGlvbnMgdGFrZSBhbiBvcHRpb25hbCBgbmV3RHN0YCBhcmd1bWVudC4gSWYgaXQgaXMgbm90IHBhc3NlZCBpbiB0aGVcbiAgICAgKiBmdW5jdGlvbnMgd2lsbCBjcmVhdGUgYSBuZXcgbWF0cml4LiBJbiBvdGhlciB3b3JkcyB5b3UgY2FuIGRvIHRoaXNcbiAgICAgKlxuICAgICAqICAgICBjb25zdCBtYXQgPSBtYXQ0LnRyYW5zbGF0aW9uKFsxLCAyLCAzXSk7ICAvLyBDcmVhdGVzIGEgbmV3IHRyYW5zbGF0aW9uIG1hdHJpeFxuICAgICAqXG4gICAgICogb3JcbiAgICAgKlxuICAgICAqICAgICBjb25zdCBtYXQgPSBtYXQ0LmNyZWF0ZSgpO1xuICAgICAqICAgICBtYXQ0LnRyYW5zbGF0aW9uKFsxLCAyLCAzXSwgbWF0KTsgIC8vIFB1dHMgdHJhbnNsYXRpb24gbWF0cml4IGluIG1hdC5cbiAgICAgKlxuICAgICAqIFRoZSBmaXJzdCBzdHlsZSBpcyBvZnRlbiBlYXNpZXIgYnV0IGRlcGVuZGluZyBvbiB3aGVyZSBpdCdzIHVzZWQgaXQgZ2VuZXJhdGVzIGdhcmJhZ2Ugd2hlcmVcbiAgICAgKiBhcyB0aGVyZSBpcyBhbG1vc3QgbmV2ZXIgYWxsb2NhdGlvbiB3aXRoIHRoZSBzZWNvbmQgc3R5bGUuXG4gICAgICpcbiAgICAgKiBJdCBpcyBhbHdheXMgc2F2ZSB0byBwYXNzIGFueSBtYXRyaXggYXMgdGhlIGRlc3RpbmF0aW9uLiBTbyBmb3IgZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgIGNvbnN0IG1hdCA9IG1hdDQuaWRlbnRpdHkoKTtcbiAgICAgKiAgICAgY29uc3QgdHJhbnMgPSBtYXQ0LnRyYW5zbGF0aW9uKFsxLCAyLCAzXSk7XG4gICAgICogICAgIG1hdDQubXVsdGlwbHkobWF0LCB0cmFucywgbWF0KTsgIC8vIE11bHRpcGxpZXMgbWF0ICogdHJhbnMgYW5kIHB1dHMgcmVzdWx0IGluIG1hdC5cbiAgICAgKlxuICAgICAqL1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIE1hdDQgZnJvbSB2YWx1ZXNcbiAgICAgKlxuICAgICAqIE5vdGU6IFNpbmNlIHBhc3NpbmcgaW4gYSByYXcgSmF2YVNjcmlwdCBhcnJheVxuICAgICAqIGlzIHZhbGlkIGluIGFsbCBjaXJjdW1zdGFuY2VzLCBpZiB5b3Ugd2FudCB0b1xuICAgICAqIGZvcmNlIGEgSmF2YVNjcmlwdCBhcnJheSBpbnRvIGEgTWF0NCdzIHNwZWNpZmllZCB0eXBlXG4gICAgICogaXQgd291bGQgYmUgZmFzdGVyIHRvIHVzZVxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogY29uc3QgbSA9IG1hdDQuY2xvbmUoc29tZUpTQXJyYXkpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHYwIC0gdmFsdWUgZm9yIGVsZW1lbnQgMFxuICAgICAqIEBwYXJhbSB2MSAtIHZhbHVlIGZvciBlbGVtZW50IDFcbiAgICAgKiBAcGFyYW0gdjIgLSB2YWx1ZSBmb3IgZWxlbWVudCAyXG4gICAgICogQHBhcmFtIHYzIC0gdmFsdWUgZm9yIGVsZW1lbnQgM1xuICAgICAqIEBwYXJhbSB2NCAtIHZhbHVlIGZvciBlbGVtZW50IDRcbiAgICAgKiBAcGFyYW0gdjUgLSB2YWx1ZSBmb3IgZWxlbWVudCA1XG4gICAgICogQHBhcmFtIHY2IC0gdmFsdWUgZm9yIGVsZW1lbnQgNlxuICAgICAqIEBwYXJhbSB2NyAtIHZhbHVlIGZvciBlbGVtZW50IDdcbiAgICAgKiBAcGFyYW0gdjggLSB2YWx1ZSBmb3IgZWxlbWVudCA4XG4gICAgICogQHBhcmFtIHY5IC0gdmFsdWUgZm9yIGVsZW1lbnQgOVxuICAgICAqIEBwYXJhbSB2MTAgLSB2YWx1ZSBmb3IgZWxlbWVudCAxMFxuICAgICAqIEBwYXJhbSB2MTEgLSB2YWx1ZSBmb3IgZWxlbWVudCAxMVxuICAgICAqIEBwYXJhbSB2MTIgLSB2YWx1ZSBmb3IgZWxlbWVudCAxMlxuICAgICAqIEBwYXJhbSB2MTMgLSB2YWx1ZSBmb3IgZWxlbWVudCAxM1xuICAgICAqIEBwYXJhbSB2MTQgLSB2YWx1ZSBmb3IgZWxlbWVudCAxNFxuICAgICAqIEBwYXJhbSB2MTUgLSB2YWx1ZSBmb3IgZWxlbWVudCAxNVxuICAgICAqIEByZXR1cm5zIGNyZWF0ZWQgZnJvbSB2YWx1ZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlKHYwLCB2MSwgdjIsIHYzLCB2NCwgdjUsIHY2LCB2NywgdjgsIHY5LCB2MTAsIHYxMSwgdjEyLCB2MTMsIHYxNCwgdjE1KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IG5ldyBDdG9yKDE2KTtcbiAgICAgICAgaWYgKHYwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IHYwO1xuICAgICAgICAgICAgaWYgKHYxICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMV0gPSB2MTtcbiAgICAgICAgICAgICAgICBpZiAodjIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdEc3RbMl0gPSB2MjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RzdFszXSA9IHYzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbNF0gPSB2NDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodjUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbNV0gPSB2NTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RzdFs2XSA9IHY2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY3ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbN10gPSB2NztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodjggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbOF0gPSB2ODtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RzdFs5XSA9IHY5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYxMCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzEwXSA9IHYxMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodjExICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzExXSA9IHYxMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYxMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbMTJdID0gdjEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYxMyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzEzXSA9IHYxMztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodjE0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzE0XSA9IHYxNDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYxNSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbMTVdID0gdjE1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBhIE1hdDRcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgbWF0NC5jcmVhdGV9IGFuZCB7QGxpbmsgbWF0NC5jb3B5fVxuICAgICAqXG4gICAgICogQHBhcmFtIHYwIC0gdmFsdWUgZm9yIGVsZW1lbnQgMFxuICAgICAqIEBwYXJhbSB2MSAtIHZhbHVlIGZvciBlbGVtZW50IDFcbiAgICAgKiBAcGFyYW0gdjIgLSB2YWx1ZSBmb3IgZWxlbWVudCAyXG4gICAgICogQHBhcmFtIHYzIC0gdmFsdWUgZm9yIGVsZW1lbnQgM1xuICAgICAqIEBwYXJhbSB2NCAtIHZhbHVlIGZvciBlbGVtZW50IDRcbiAgICAgKiBAcGFyYW0gdjUgLSB2YWx1ZSBmb3IgZWxlbWVudCA1XG4gICAgICogQHBhcmFtIHY2IC0gdmFsdWUgZm9yIGVsZW1lbnQgNlxuICAgICAqIEBwYXJhbSB2NyAtIHZhbHVlIGZvciBlbGVtZW50IDdcbiAgICAgKiBAcGFyYW0gdjggLSB2YWx1ZSBmb3IgZWxlbWVudCA4XG4gICAgICogQHBhcmFtIHY5IC0gdmFsdWUgZm9yIGVsZW1lbnQgOVxuICAgICAqIEBwYXJhbSB2MTAgLSB2YWx1ZSBmb3IgZWxlbWVudCAxMFxuICAgICAqIEBwYXJhbSB2MTEgLSB2YWx1ZSBmb3IgZWxlbWVudCAxMVxuICAgICAqIEBwYXJhbSB2MTIgLSB2YWx1ZSBmb3IgZWxlbWVudCAxMlxuICAgICAqIEBwYXJhbSB2MTMgLSB2YWx1ZSBmb3IgZWxlbWVudCAxM1xuICAgICAqIEBwYXJhbSB2MTQgLSB2YWx1ZSBmb3IgZWxlbWVudCAxNFxuICAgICAqIEBwYXJhbSB2MTUgLSB2YWx1ZSBmb3IgZWxlbWVudCAxNVxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgTWF0NCBjcmVhdGVkIGZyb20gdmFsdWVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldCh2MCwgdjEsIHYyLCB2MywgdjQsIHY1LCB2NiwgdjcsIHY4LCB2OSwgdjEwLCB2MTEsIHYxMiwgdjEzLCB2MTQsIHYxNSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdjA7XG4gICAgICAgIG5ld0RzdFsxXSA9IHYxO1xuICAgICAgICBuZXdEc3RbMl0gPSB2MjtcbiAgICAgICAgbmV3RHN0WzNdID0gdjM7XG4gICAgICAgIG5ld0RzdFs0XSA9IHY0O1xuICAgICAgICBuZXdEc3RbNV0gPSB2NTtcbiAgICAgICAgbmV3RHN0WzZdID0gdjY7XG4gICAgICAgIG5ld0RzdFs3XSA9IHY3O1xuICAgICAgICBuZXdEc3RbOF0gPSB2ODtcbiAgICAgICAgbmV3RHN0WzldID0gdjk7XG4gICAgICAgIG5ld0RzdFsxMF0gPSB2MTA7XG4gICAgICAgIG5ld0RzdFsxMV0gPSB2MTE7XG4gICAgICAgIG5ld0RzdFsxMl0gPSB2MTI7XG4gICAgICAgIG5ld0RzdFsxM10gPSB2MTM7XG4gICAgICAgIG5ld0RzdFsxNF0gPSB2MTQ7XG4gICAgICAgIG5ld0RzdFsxNV0gPSB2MTU7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBNYXQ0IGZyb20gYSBNYXQzXG4gICAgICogQHBhcmFtIG0zIC0gc291cmNlIG1hdHJpeFxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgTWF0NCBtYWRlIGZyb20gbTNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmcm9tTWF0MyhtMywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gbTNbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IG0zWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBtM1syXTtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gbTNbNF07XG4gICAgICAgIG5ld0RzdFs1XSA9IG0zWzVdO1xuICAgICAgICBuZXdEc3RbNl0gPSBtM1s2XTtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gbTNbOF07XG4gICAgICAgIG5ld0RzdFs5XSA9IG0zWzldO1xuICAgICAgICBuZXdEc3RbMTBdID0gbTNbMTBdO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxM10gPSAwO1xuICAgICAgICBuZXdEc3RbMTRdID0gMDtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBNYXQ0IHJvdGF0aW9uIG1hdHJpeCBmcm9tIGEgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSBxIC0gcXVhdGVybmlvbiB0byBjcmVhdGUgbWF0cml4IGZyb21cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIE1hdDQgbWFkZSBmcm9tIHFcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmcm9tUXVhdChxLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCB4ID0gcVswXTtcbiAgICAgICAgY29uc3QgeSA9IHFbMV07XG4gICAgICAgIGNvbnN0IHogPSBxWzJdO1xuICAgICAgICBjb25zdCB3ID0gcVszXTtcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcbiAgICAgICAgY29uc3QgeHggPSB4ICogeDI7XG4gICAgICAgIGNvbnN0IHl4ID0geSAqIHgyO1xuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcbiAgICAgICAgY29uc3QgenggPSB6ICogeDI7XG4gICAgICAgIGNvbnN0IHp5ID0geiAqIHkyO1xuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcbiAgICAgICAgY29uc3Qgd3ggPSB3ICogeDI7XG4gICAgICAgIGNvbnN0IHd5ID0gdyAqIHkyO1xuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcbiAgICAgICAgbmV3RHN0WzBdID0gMSAtIHl5IC0geno7XG4gICAgICAgIG5ld0RzdFsxXSA9IHl4ICsgd3o7XG4gICAgICAgIG5ld0RzdFsyXSA9IHp4IC0gd3k7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IHl4IC0gd3o7XG4gICAgICAgIG5ld0RzdFs1XSA9IDEgLSB4eCAtIHp6O1xuICAgICAgICBuZXdEc3RbNl0gPSB6eSArIHd4O1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSB6eCArIHd5O1xuICAgICAgICBuZXdEc3RbOV0gPSB6eSAtIHd4O1xuICAgICAgICBuZXdEc3RbMTBdID0gMSAtIHh4IC0geXk7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNF0gPSAwO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTmVnYXRlcyBhIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyAtbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBuZWdhdGUobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gLW1bMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IC1tWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSAtbVsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gLW1bM107XG4gICAgICAgIG5ld0RzdFs0XSA9IC1tWzRdO1xuICAgICAgICBuZXdEc3RbNV0gPSAtbVs1XTtcbiAgICAgICAgbmV3RHN0WzZdID0gLW1bNl07XG4gICAgICAgIG5ld0RzdFs3XSA9IC1tWzddO1xuICAgICAgICBuZXdEc3RbOF0gPSAtbVs4XTtcbiAgICAgICAgbmV3RHN0WzldID0gLW1bOV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSAtbVsxMF07XG4gICAgICAgIG5ld0RzdFsxMV0gPSAtbVsxMV07XG4gICAgICAgIG5ld0RzdFsxMl0gPSAtbVsxMl07XG4gICAgICAgIG5ld0RzdFsxM10gPSAtbVsxM107XG4gICAgICAgIG5ld0RzdFsxNF0gPSAtbVsxNF07XG4gICAgICAgIG5ld0RzdFsxNV0gPSAtbVsxNV07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvcGllcyBhIG1hdHJpeC4gKHNhbWUgYXMge0BsaW5rIG1hdDQuY2xvbmV9KVxuICAgICAqIEFsc28gc2VlIHtAbGluayBtYXQ0LmNyZWF0ZX0gYW5kIHtAbGluayBtYXQ0LnNldH1cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIFRoZSBtYXRyaXguIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBjb3B5IG9mIG0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29weShtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBtWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBtWzJdO1xuICAgICAgICBuZXdEc3RbM10gPSBtWzNdO1xuICAgICAgICBuZXdEc3RbNF0gPSBtWzRdO1xuICAgICAgICBuZXdEc3RbNV0gPSBtWzVdO1xuICAgICAgICBuZXdEc3RbNl0gPSBtWzZdO1xuICAgICAgICBuZXdEc3RbN10gPSBtWzddO1xuICAgICAgICBuZXdEc3RbOF0gPSBtWzhdO1xuICAgICAgICBuZXdEc3RbOV0gPSBtWzldO1xuICAgICAgICBuZXdEc3RbMTBdID0gbVsxMF07XG4gICAgICAgIG5ld0RzdFsxMV0gPSBtWzExXTtcbiAgICAgICAgbmV3RHN0WzEyXSA9IG1bMTJdO1xuICAgICAgICBuZXdEc3RbMTNdID0gbVsxM107XG4gICAgICAgIG5ld0RzdFsxNF0gPSBtWzE0XTtcbiAgICAgICAgbmV3RHN0WzE1XSA9IG1bMTVdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgYSBtYXRyaXggKHNhbWUgYXMge0BsaW5rIG1hdDQuY29weX0pXG4gICAgICogQWxzbyBzZWUge0BsaW5rIG1hdDQuY3JlYXRlfSBhbmQge0BsaW5rIG1hdDQuc2V0fVxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIG1hdHJpeC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIGNvcHkgb2YgbS5cbiAgICAgKi9cbiAgICBjb25zdCBjbG9uZSA9IGNvcHk7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgMiBtYXRyaWNlcyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbFxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCBtYXRyaXguXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIG1hdHJpeC5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIG1hdHJpY2VzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzQXBwcm94aW1hdGVseShhLCBiKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhWzBdIC0gYlswXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzFdIC0gYlsxXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzJdIC0gYlsyXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzNdIC0gYlszXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzRdIC0gYls0XSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzVdIC0gYls1XSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzZdIC0gYls2XSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzddIC0gYls3XSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzhdIC0gYls4XSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzldIC0gYls5XSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzEwXSAtIGJbMTBdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMTFdIC0gYlsxMV0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsxMl0gLSBiWzEyXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzEzXSAtIGJbMTNdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMTRdIC0gYlsxNF0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsxNV0gLSBiWzE1XSkgPCBFUFNJTE9OO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIG1hdHJpY2VzIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgbWF0cml4LlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgbWF0cmljZXMgYXJlIGV4YWN0bHkgZXF1YWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICAgICAgICByZXR1cm4gYVswXSA9PT0gYlswXSAmJlxuICAgICAgICAgICAgYVsxXSA9PT0gYlsxXSAmJlxuICAgICAgICAgICAgYVsyXSA9PT0gYlsyXSAmJlxuICAgICAgICAgICAgYVszXSA9PT0gYlszXSAmJlxuICAgICAgICAgICAgYVs0XSA9PT0gYls0XSAmJlxuICAgICAgICAgICAgYVs1XSA9PT0gYls1XSAmJlxuICAgICAgICAgICAgYVs2XSA9PT0gYls2XSAmJlxuICAgICAgICAgICAgYVs3XSA9PT0gYls3XSAmJlxuICAgICAgICAgICAgYVs4XSA9PT0gYls4XSAmJlxuICAgICAgICAgICAgYVs5XSA9PT0gYls5XSAmJlxuICAgICAgICAgICAgYVsxMF0gPT09IGJbMTBdICYmXG4gICAgICAgICAgICBhWzExXSA9PT0gYlsxMV0gJiZcbiAgICAgICAgICAgIGFbMTJdID09PSBiWzEyXSAmJlxuICAgICAgICAgICAgYVsxM10gPT09IGJbMTNdICYmXG4gICAgICAgICAgICBhWzE0XSA9PT0gYlsxNF0gJiZcbiAgICAgICAgICAgIGFbMTVdID09PSBiWzE1XTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDQtYnktNCBpZGVudGl0eSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgNC1ieS00IGlkZW50aXR5IG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpZGVudGl0eShkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBuZXdEc3RbMF0gPSAxO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSAxO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTBdID0gMTtcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMl0gPSAwO1xuICAgICAgICBuZXdEc3RbMTNdID0gMDtcbiAgICAgICAgbmV3RHN0WzE0XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUYWtlcyB0aGUgdHJhbnNwb3NlIG9mIGEgbWF0cml4LlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB0cmFuc3Bvc2Ugb2YgbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cmFuc3Bvc2UobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgaWYgKG5ld0RzdCA9PT0gbSkge1xuICAgICAgICAgICAgbGV0IHQ7XG4gICAgICAgICAgICB0ID0gbVsxXTtcbiAgICAgICAgICAgIG1bMV0gPSBtWzRdO1xuICAgICAgICAgICAgbVs0XSA9IHQ7XG4gICAgICAgICAgICB0ID0gbVsyXTtcbiAgICAgICAgICAgIG1bMl0gPSBtWzhdO1xuICAgICAgICAgICAgbVs4XSA9IHQ7XG4gICAgICAgICAgICB0ID0gbVszXTtcbiAgICAgICAgICAgIG1bM10gPSBtWzEyXTtcbiAgICAgICAgICAgIG1bMTJdID0gdDtcbiAgICAgICAgICAgIHQgPSBtWzZdO1xuICAgICAgICAgICAgbVs2XSA9IG1bOV07XG4gICAgICAgICAgICBtWzldID0gdDtcbiAgICAgICAgICAgIHQgPSBtWzddO1xuICAgICAgICAgICAgbVs3XSA9IG1bMTNdO1xuICAgICAgICAgICAgbVsxM10gPSB0O1xuICAgICAgICAgICAgdCA9IG1bMTFdO1xuICAgICAgICAgICAgbVsxMV0gPSBtWzE0XTtcbiAgICAgICAgICAgIG1bMTRdID0gdDtcbiAgICAgICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbTAwID0gbVswICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMDEgPSBtWzAgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0wMiA9IG1bMCAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTAzID0gbVswICogNCArIDNdO1xuICAgICAgICBjb25zdCBtMTAgPSBtWzEgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bMSAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTEyID0gbVsxICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMTMgPSBtWzEgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bMiAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTIxID0gbVsyICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMjIgPSBtWzIgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0yMyA9IG1bMiAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgbTMwID0gbVszICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMzEgPSBtWzMgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0zMiA9IG1bMyAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTMzID0gbVszICogNCArIDNdO1xuICAgICAgICBuZXdEc3RbMF0gPSBtMDA7XG4gICAgICAgIG5ld0RzdFsxXSA9IG0xMDtcbiAgICAgICAgbmV3RHN0WzJdID0gbTIwO1xuICAgICAgICBuZXdEc3RbM10gPSBtMzA7XG4gICAgICAgIG5ld0RzdFs0XSA9IG0wMTtcbiAgICAgICAgbmV3RHN0WzVdID0gbTExO1xuICAgICAgICBuZXdEc3RbNl0gPSBtMjE7XG4gICAgICAgIG5ld0RzdFs3XSA9IG0zMTtcbiAgICAgICAgbmV3RHN0WzhdID0gbTAyO1xuICAgICAgICBuZXdEc3RbOV0gPSBtMTI7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBtMjI7XG4gICAgICAgIG5ld0RzdFsxMV0gPSBtMzI7XG4gICAgICAgIG5ld0RzdFsxMl0gPSBtMDM7XG4gICAgICAgIG5ld0RzdFsxM10gPSBtMTM7XG4gICAgICAgIG5ld0RzdFsxNF0gPSBtMjM7XG4gICAgICAgIG5ld0RzdFsxNV0gPSBtMzM7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBpbnZlcnNlIG9mIGEgNC1ieS00IG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgaW52ZXJzZSBvZiBtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludmVyc2UobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgY29uc3QgbTAwID0gbVswICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMDEgPSBtWzAgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0wMiA9IG1bMCAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTAzID0gbVswICogNCArIDNdO1xuICAgICAgICBjb25zdCBtMTAgPSBtWzEgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bMSAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTEyID0gbVsxICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMTMgPSBtWzEgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bMiAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTIxID0gbVsyICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMjIgPSBtWzIgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0yMyA9IG1bMiAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgbTMwID0gbVszICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMzEgPSBtWzMgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0zMiA9IG1bMyAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTMzID0gbVszICogNCArIDNdO1xuICAgICAgICBjb25zdCB0bXAwID0gbTIyICogbTMzO1xuICAgICAgICBjb25zdCB0bXAxID0gbTMyICogbTIzO1xuICAgICAgICBjb25zdCB0bXAyID0gbTEyICogbTMzO1xuICAgICAgICBjb25zdCB0bXAzID0gbTMyICogbTEzO1xuICAgICAgICBjb25zdCB0bXA0ID0gbTEyICogbTIzO1xuICAgICAgICBjb25zdCB0bXA1ID0gbTIyICogbTEzO1xuICAgICAgICBjb25zdCB0bXA2ID0gbTAyICogbTMzO1xuICAgICAgICBjb25zdCB0bXA3ID0gbTMyICogbTAzO1xuICAgICAgICBjb25zdCB0bXA4ID0gbTAyICogbTIzO1xuICAgICAgICBjb25zdCB0bXA5ID0gbTIyICogbTAzO1xuICAgICAgICBjb25zdCB0bXAxMCA9IG0wMiAqIG0xMztcbiAgICAgICAgY29uc3QgdG1wMTEgPSBtMTIgKiBtMDM7XG4gICAgICAgIGNvbnN0IHRtcDEyID0gbTIwICogbTMxO1xuICAgICAgICBjb25zdCB0bXAxMyA9IG0zMCAqIG0yMTtcbiAgICAgICAgY29uc3QgdG1wMTQgPSBtMTAgKiBtMzE7XG4gICAgICAgIGNvbnN0IHRtcDE1ID0gbTMwICogbTExO1xuICAgICAgICBjb25zdCB0bXAxNiA9IG0xMCAqIG0yMTtcbiAgICAgICAgY29uc3QgdG1wMTcgPSBtMjAgKiBtMTE7XG4gICAgICAgIGNvbnN0IHRtcDE4ID0gbTAwICogbTMxO1xuICAgICAgICBjb25zdCB0bXAxOSA9IG0zMCAqIG0wMTtcbiAgICAgICAgY29uc3QgdG1wMjAgPSBtMDAgKiBtMjE7XG4gICAgICAgIGNvbnN0IHRtcDIxID0gbTIwICogbTAxO1xuICAgICAgICBjb25zdCB0bXAyMiA9IG0wMCAqIG0xMTtcbiAgICAgICAgY29uc3QgdG1wMjMgPSBtMTAgKiBtMDE7XG4gICAgICAgIGNvbnN0IHQwID0gKHRtcDAgKiBtMTEgKyB0bXAzICogbTIxICsgdG1wNCAqIG0zMSkgLVxuICAgICAgICAgICAgKHRtcDEgKiBtMTEgKyB0bXAyICogbTIxICsgdG1wNSAqIG0zMSk7XG4gICAgICAgIGNvbnN0IHQxID0gKHRtcDEgKiBtMDEgKyB0bXA2ICogbTIxICsgdG1wOSAqIG0zMSkgLVxuICAgICAgICAgICAgKHRtcDAgKiBtMDEgKyB0bXA3ICogbTIxICsgdG1wOCAqIG0zMSk7XG4gICAgICAgIGNvbnN0IHQyID0gKHRtcDIgKiBtMDEgKyB0bXA3ICogbTExICsgdG1wMTAgKiBtMzEpIC1cbiAgICAgICAgICAgICh0bXAzICogbTAxICsgdG1wNiAqIG0xMSArIHRtcDExICogbTMxKTtcbiAgICAgICAgY29uc3QgdDMgPSAodG1wNSAqIG0wMSArIHRtcDggKiBtMTEgKyB0bXAxMSAqIG0yMSkgLVxuICAgICAgICAgICAgKHRtcDQgKiBtMDEgKyB0bXA5ICogbTExICsgdG1wMTAgKiBtMjEpO1xuICAgICAgICBjb25zdCBkID0gMSAvIChtMDAgKiB0MCArIG0xMCAqIHQxICsgbTIwICogdDIgKyBtMzAgKiB0Myk7XG4gICAgICAgIG5ld0RzdFswXSA9IGQgKiB0MDtcbiAgICAgICAgbmV3RHN0WzFdID0gZCAqIHQxO1xuICAgICAgICBuZXdEc3RbMl0gPSBkICogdDI7XG4gICAgICAgIG5ld0RzdFszXSA9IGQgKiB0MztcbiAgICAgICAgbmV3RHN0WzRdID0gZCAqICgodG1wMSAqIG0xMCArIHRtcDIgKiBtMjAgKyB0bXA1ICogbTMwKSAtXG4gICAgICAgICAgICAodG1wMCAqIG0xMCArIHRtcDMgKiBtMjAgKyB0bXA0ICogbTMwKSk7XG4gICAgICAgIG5ld0RzdFs1XSA9IGQgKiAoKHRtcDAgKiBtMDAgKyB0bXA3ICogbTIwICsgdG1wOCAqIG0zMCkgLVxuICAgICAgICAgICAgKHRtcDEgKiBtMDAgKyB0bXA2ICogbTIwICsgdG1wOSAqIG0zMCkpO1xuICAgICAgICBuZXdEc3RbNl0gPSBkICogKCh0bXAzICogbTAwICsgdG1wNiAqIG0xMCArIHRtcDExICogbTMwKSAtXG4gICAgICAgICAgICAodG1wMiAqIG0wMCArIHRtcDcgKiBtMTAgKyB0bXAxMCAqIG0zMCkpO1xuICAgICAgICBuZXdEc3RbN10gPSBkICogKCh0bXA0ICogbTAwICsgdG1wOSAqIG0xMCArIHRtcDEwICogbTIwKSAtXG4gICAgICAgICAgICAodG1wNSAqIG0wMCArIHRtcDggKiBtMTAgKyB0bXAxMSAqIG0yMCkpO1xuICAgICAgICBuZXdEc3RbOF0gPSBkICogKCh0bXAxMiAqIG0xMyArIHRtcDE1ICogbTIzICsgdG1wMTYgKiBtMzMpIC1cbiAgICAgICAgICAgICh0bXAxMyAqIG0xMyArIHRtcDE0ICogbTIzICsgdG1wMTcgKiBtMzMpKTtcbiAgICAgICAgbmV3RHN0WzldID0gZCAqICgodG1wMTMgKiBtMDMgKyB0bXAxOCAqIG0yMyArIHRtcDIxICogbTMzKSAtXG4gICAgICAgICAgICAodG1wMTIgKiBtMDMgKyB0bXAxOSAqIG0yMyArIHRtcDIwICogbTMzKSk7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBkICogKCh0bXAxNCAqIG0wMyArIHRtcDE5ICogbTEzICsgdG1wMjIgKiBtMzMpIC1cbiAgICAgICAgICAgICh0bXAxNSAqIG0wMyArIHRtcDE4ICogbTEzICsgdG1wMjMgKiBtMzMpKTtcbiAgICAgICAgbmV3RHN0WzExXSA9IGQgKiAoKHRtcDE3ICogbTAzICsgdG1wMjAgKiBtMTMgKyB0bXAyMyAqIG0yMykgLVxuICAgICAgICAgICAgKHRtcDE2ICogbTAzICsgdG1wMjEgKiBtMTMgKyB0bXAyMiAqIG0yMykpO1xuICAgICAgICBuZXdEc3RbMTJdID0gZCAqICgodG1wMTQgKiBtMjIgKyB0bXAxNyAqIG0zMiArIHRtcDEzICogbTEyKSAtXG4gICAgICAgICAgICAodG1wMTYgKiBtMzIgKyB0bXAxMiAqIG0xMiArIHRtcDE1ICogbTIyKSk7XG4gICAgICAgIG5ld0RzdFsxM10gPSBkICogKCh0bXAyMCAqIG0zMiArIHRtcDEyICogbTAyICsgdG1wMTkgKiBtMjIpIC1cbiAgICAgICAgICAgICh0bXAxOCAqIG0yMiArIHRtcDIxICogbTMyICsgdG1wMTMgKiBtMDIpKTtcbiAgICAgICAgbmV3RHN0WzE0XSA9IGQgKiAoKHRtcDE4ICogbTEyICsgdG1wMjMgKiBtMzIgKyB0bXAxNSAqIG0wMikgLVxuICAgICAgICAgICAgKHRtcDIyICogbTMyICsgdG1wMTQgKiBtMDIgKyB0bXAxOSAqIG0xMikpO1xuICAgICAgICBuZXdEc3RbMTVdID0gZCAqICgodG1wMjIgKiBtMjIgKyB0bXAxNiAqIG0wMiArIHRtcDIxICogbTEyKSAtXG4gICAgICAgICAgICAodG1wMjAgKiBtMTIgKyB0bXAyMyAqIG0yMiArIHRtcDE3ICogbTAyKSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgdGhlIGRldGVybWluYW50IG9mIGEgbWF0cml4XG4gICAgICogQHBhcmFtIG0gLSB0aGUgbWF0cml4XG4gICAgICogQHJldHVybnMgdGhlIGRldGVybWluYW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gZGV0ZXJtaW5hbnQobSkge1xuICAgICAgICBjb25zdCBtMDAgPSBtWzAgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG1bMCAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbVswICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMDMgPSBtWzAgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IG0xMCA9IG1bMSAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTExID0gbVsxICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMTIgPSBtWzEgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0xMyA9IG1bMSAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgbTIwID0gbVsyICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMjEgPSBtWzIgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0yMiA9IG1bMiAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTIzID0gbVsyICogNCArIDNdO1xuICAgICAgICBjb25zdCBtMzAgPSBtWzMgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0zMSA9IG1bMyAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTMyID0gbVszICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMzMgPSBtWzMgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IHRtcDAgPSBtMjIgKiBtMzM7XG4gICAgICAgIGNvbnN0IHRtcDEgPSBtMzIgKiBtMjM7XG4gICAgICAgIGNvbnN0IHRtcDIgPSBtMTIgKiBtMzM7XG4gICAgICAgIGNvbnN0IHRtcDMgPSBtMzIgKiBtMTM7XG4gICAgICAgIGNvbnN0IHRtcDQgPSBtMTIgKiBtMjM7XG4gICAgICAgIGNvbnN0IHRtcDUgPSBtMjIgKiBtMTM7XG4gICAgICAgIGNvbnN0IHRtcDYgPSBtMDIgKiBtMzM7XG4gICAgICAgIGNvbnN0IHRtcDcgPSBtMzIgKiBtMDM7XG4gICAgICAgIGNvbnN0IHRtcDggPSBtMDIgKiBtMjM7XG4gICAgICAgIGNvbnN0IHRtcDkgPSBtMjIgKiBtMDM7XG4gICAgICAgIGNvbnN0IHRtcDEwID0gbTAyICogbTEzO1xuICAgICAgICBjb25zdCB0bXAxMSA9IG0xMiAqIG0wMztcbiAgICAgICAgY29uc3QgdDAgPSAodG1wMCAqIG0xMSArIHRtcDMgKiBtMjEgKyB0bXA0ICogbTMxKSAtXG4gICAgICAgICAgICAodG1wMSAqIG0xMSArIHRtcDIgKiBtMjEgKyB0bXA1ICogbTMxKTtcbiAgICAgICAgY29uc3QgdDEgPSAodG1wMSAqIG0wMSArIHRtcDYgKiBtMjEgKyB0bXA5ICogbTMxKSAtXG4gICAgICAgICAgICAodG1wMCAqIG0wMSArIHRtcDcgKiBtMjEgKyB0bXA4ICogbTMxKTtcbiAgICAgICAgY29uc3QgdDIgPSAodG1wMiAqIG0wMSArIHRtcDcgKiBtMTEgKyB0bXAxMCAqIG0zMSkgLVxuICAgICAgICAgICAgKHRtcDMgKiBtMDEgKyB0bXA2ICogbTExICsgdG1wMTEgKiBtMzEpO1xuICAgICAgICBjb25zdCB0MyA9ICh0bXA1ICogbTAxICsgdG1wOCAqIG0xMSArIHRtcDExICogbTIxKSAtXG4gICAgICAgICAgICAodG1wNCAqIG0wMSArIHRtcDkgKiBtMTEgKyB0bXAxMCAqIG0yMSk7XG4gICAgICAgIHJldHVybiBtMDAgKiB0MCArIG0xMCAqIHQxICsgbTIwICogdDIgKyBtMzAgKiB0MztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGludmVyc2Ugb2YgYSA0LWJ5LTQgbWF0cml4LiAoc2FtZSBhcyBpbnZlcnNlKVxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBpbnZlcnNlIG9mIG0uXG4gICAgICovXG4gICAgY29uc3QgaW52ZXJ0ID0gaW52ZXJzZTtcbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIHR3byA0LWJ5LTQgbWF0cmljZXMgd2l0aCBhIG9uIHRoZSBsZWZ0IGFuZCBiIG9uIHRoZSByaWdodFxuICAgICAqIEBwYXJhbSBhIC0gVGhlIG1hdHJpeCBvbiB0aGUgbGVmdC5cbiAgICAgKiBAcGFyYW0gYiAtIFRoZSBtYXRyaXggb24gdGhlIHJpZ2h0LlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1hdHJpeCBwcm9kdWN0IG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsdGlwbHkoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgY29uc3QgYTAwID0gYVswXTtcbiAgICAgICAgY29uc3QgYTAxID0gYVsxXTtcbiAgICAgICAgY29uc3QgYTAyID0gYVsyXTtcbiAgICAgICAgY29uc3QgYTAzID0gYVszXTtcbiAgICAgICAgY29uc3QgYTEwID0gYVs0ICsgMF07XG4gICAgICAgIGNvbnN0IGExMSA9IGFbNCArIDFdO1xuICAgICAgICBjb25zdCBhMTIgPSBhWzQgKyAyXTtcbiAgICAgICAgY29uc3QgYTEzID0gYVs0ICsgM107XG4gICAgICAgIGNvbnN0IGEyMCA9IGFbOCArIDBdO1xuICAgICAgICBjb25zdCBhMjEgPSBhWzggKyAxXTtcbiAgICAgICAgY29uc3QgYTIyID0gYVs4ICsgMl07XG4gICAgICAgIGNvbnN0IGEyMyA9IGFbOCArIDNdO1xuICAgICAgICBjb25zdCBhMzAgPSBhWzEyICsgMF07XG4gICAgICAgIGNvbnN0IGEzMSA9IGFbMTIgKyAxXTtcbiAgICAgICAgY29uc3QgYTMyID0gYVsxMiArIDJdO1xuICAgICAgICBjb25zdCBhMzMgPSBhWzEyICsgM107XG4gICAgICAgIGNvbnN0IGIwMCA9IGJbMF07XG4gICAgICAgIGNvbnN0IGIwMSA9IGJbMV07XG4gICAgICAgIGNvbnN0IGIwMiA9IGJbMl07XG4gICAgICAgIGNvbnN0IGIwMyA9IGJbM107XG4gICAgICAgIGNvbnN0IGIxMCA9IGJbNCArIDBdO1xuICAgICAgICBjb25zdCBiMTEgPSBiWzQgKyAxXTtcbiAgICAgICAgY29uc3QgYjEyID0gYls0ICsgMl07XG4gICAgICAgIGNvbnN0IGIxMyA9IGJbNCArIDNdO1xuICAgICAgICBjb25zdCBiMjAgPSBiWzggKyAwXTtcbiAgICAgICAgY29uc3QgYjIxID0gYls4ICsgMV07XG4gICAgICAgIGNvbnN0IGIyMiA9IGJbOCArIDJdO1xuICAgICAgICBjb25zdCBiMjMgPSBiWzggKyAzXTtcbiAgICAgICAgY29uc3QgYjMwID0gYlsxMiArIDBdO1xuICAgICAgICBjb25zdCBiMzEgPSBiWzEyICsgMV07XG4gICAgICAgIGNvbnN0IGIzMiA9IGJbMTIgKyAyXTtcbiAgICAgICAgY29uc3QgYjMzID0gYlsxMiArIDNdO1xuICAgICAgICBuZXdEc3RbMF0gPSBhMDAgKiBiMDAgKyBhMTAgKiBiMDEgKyBhMjAgKiBiMDIgKyBhMzAgKiBiMDM7XG4gICAgICAgIG5ld0RzdFsxXSA9IGEwMSAqIGIwMCArIGExMSAqIGIwMSArIGEyMSAqIGIwMiArIGEzMSAqIGIwMztcbiAgICAgICAgbmV3RHN0WzJdID0gYTAyICogYjAwICsgYTEyICogYjAxICsgYTIyICogYjAyICsgYTMyICogYjAzO1xuICAgICAgICBuZXdEc3RbM10gPSBhMDMgKiBiMDAgKyBhMTMgKiBiMDEgKyBhMjMgKiBiMDIgKyBhMzMgKiBiMDM7XG4gICAgICAgIG5ld0RzdFs0XSA9IGEwMCAqIGIxMCArIGExMCAqIGIxMSArIGEyMCAqIGIxMiArIGEzMCAqIGIxMztcbiAgICAgICAgbmV3RHN0WzVdID0gYTAxICogYjEwICsgYTExICogYjExICsgYTIxICogYjEyICsgYTMxICogYjEzO1xuICAgICAgICBuZXdEc3RbNl0gPSBhMDIgKiBiMTAgKyBhMTIgKiBiMTEgKyBhMjIgKiBiMTIgKyBhMzIgKiBiMTM7XG4gICAgICAgIG5ld0RzdFs3XSA9IGEwMyAqIGIxMCArIGExMyAqIGIxMSArIGEyMyAqIGIxMiArIGEzMyAqIGIxMztcbiAgICAgICAgbmV3RHN0WzhdID0gYTAwICogYjIwICsgYTEwICogYjIxICsgYTIwICogYjIyICsgYTMwICogYjIzO1xuICAgICAgICBuZXdEc3RbOV0gPSBhMDEgKiBiMjAgKyBhMTEgKiBiMjEgKyBhMjEgKiBiMjIgKyBhMzEgKiBiMjM7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBhMDIgKiBiMjAgKyBhMTIgKiBiMjEgKyBhMjIgKiBiMjIgKyBhMzIgKiBiMjM7XG4gICAgICAgIG5ld0RzdFsxMV0gPSBhMDMgKiBiMjAgKyBhMTMgKiBiMjEgKyBhMjMgKiBiMjIgKyBhMzMgKiBiMjM7XG4gICAgICAgIG5ld0RzdFsxMl0gPSBhMDAgKiBiMzAgKyBhMTAgKiBiMzEgKyBhMjAgKiBiMzIgKyBhMzAgKiBiMzM7XG4gICAgICAgIG5ld0RzdFsxM10gPSBhMDEgKiBiMzAgKyBhMTEgKiBiMzEgKyBhMjEgKiBiMzIgKyBhMzEgKiBiMzM7XG4gICAgICAgIG5ld0RzdFsxNF0gPSBhMDIgKiBiMzAgKyBhMTIgKiBiMzEgKyBhMjIgKiBiMzIgKyBhMzIgKiBiMzM7XG4gICAgICAgIG5ld0RzdFsxNV0gPSBhMDMgKiBiMzAgKyBhMTMgKiBiMzEgKyBhMjMgKiBiMzIgKyBhMzMgKiBiMzM7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgdHdvIDQtYnktNCBtYXRyaWNlcyB3aXRoIGEgb24gdGhlIGxlZnQgYW5kIGIgb24gdGhlIHJpZ2h0IChzYW1lIGFzIG11bHRpcGx5KVxuICAgICAqIEBwYXJhbSBhIC0gVGhlIG1hdHJpeCBvbiB0aGUgbGVmdC5cbiAgICAgKiBAcGFyYW0gYiAtIFRoZSBtYXRyaXggb24gdGhlIHJpZ2h0LlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1hdHJpeCBwcm9kdWN0IG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3QgbXVsID0gbXVsdGlwbHk7XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdHJhbnNsYXRpb24gY29tcG9uZW50IG9mIGEgNC1ieS00IG1hdHJpeCB0byB0aGUgZ2l2ZW5cbiAgICAgKiB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGEgLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBtYXRyaXggd2l0aCB0cmFuc2xhdGlvbiBzZXQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0VHJhbnNsYXRpb24oYSwgdiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gaWRlbnRpdHkoKSk7XG4gICAgICAgIGlmIChhICE9PSBuZXdEc3QpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IGFbMF07XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSBhWzFdO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gYVsyXTtcbiAgICAgICAgICAgIG5ld0RzdFszXSA9IGFbM107XG4gICAgICAgICAgICBuZXdEc3RbNF0gPSBhWzRdO1xuICAgICAgICAgICAgbmV3RHN0WzVdID0gYVs1XTtcbiAgICAgICAgICAgIG5ld0RzdFs2XSA9IGFbNl07XG4gICAgICAgICAgICBuZXdEc3RbN10gPSBhWzddO1xuICAgICAgICAgICAgbmV3RHN0WzhdID0gYVs4XTtcbiAgICAgICAgICAgIG5ld0RzdFs5XSA9IGFbOV07XG4gICAgICAgICAgICBuZXdEc3RbMTBdID0gYVsxMF07XG4gICAgICAgICAgICBuZXdEc3RbMTFdID0gYVsxMV07XG4gICAgICAgIH1cbiAgICAgICAgbmV3RHN0WzEyXSA9IHZbMF07XG4gICAgICAgIG5ld0RzdFsxM10gPSB2WzFdO1xuICAgICAgICBuZXdEc3RbMTRdID0gdlsyXTtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8vLyoqXG4gICAgLy8gKiBSZXR1cm5zIHRoZSB0cmFuc2xhdGlvbiBjb21wb25lbnQgb2YgYSA0LWJ5LTQgbWF0cml4IGFzIGEgdmVjdG9yIHdpdGggM1xuICAgIC8vICogZW50cmllcy5cbiAgICAvLyAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAvLyAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgLy8gKiBAcmV0dXJucyBUaGUgdHJhbnNsYXRpb24gY29tcG9uZW50IG9mIG0uXG4gICAgLy8gKi9cbiAgICBmdW5jdGlvbiBnZXRUcmFuc2xhdGlvbihtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyB2ZWMzLmNyZWF0ZSgpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gbVsxMl07XG4gICAgICAgIG5ld0RzdFsxXSA9IG1bMTNdO1xuICAgICAgICBuZXdEc3RbMl0gPSBtWzE0XTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBheGlzIG9mIGEgNHg0IG1hdHJpeCBhcyBhIHZlY3RvciB3aXRoIDMgZW50cmllc1xuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYXhpcyAtIFRoZSBheGlzIDAgPSB4LCAxID0geSwgMiA9IHo7XG4gICAgICogQHJldHVybnMgVGhlIGF4aXMgY29tcG9uZW50IG9mIG0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QXhpcyhtLCBheGlzLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyB2ZWMzLmNyZWF0ZSgpKTtcbiAgICAgICAgY29uc3Qgb2ZmID0gYXhpcyAqIDQ7XG4gICAgICAgIG5ld0RzdFswXSA9IG1bb2ZmICsgMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IG1bb2ZmICsgMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IG1bb2ZmICsgMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYW4gYXhpcyBvZiBhIDR4NCBtYXRyaXggYXMgYSB2ZWN0b3Igd2l0aCAzIGVudHJpZXNcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIHYgLSB0aGUgYXhpcyB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gYXhpcyAtIFRoZSBheGlzICAwID0geCwgMSA9IHksIDIgPSB6O1xuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgbWF0cml4IHRvIHNldC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbWF0cml4IHdpdGggYXhpcyBzZXQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0QXhpcyhtLCB2LCBheGlzLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA9PT0gbSkgPyBkc3QgOiBjb3B5KG0sIGRzdCk7XG4gICAgICAgIGNvbnN0IG9mZiA9IGF4aXMgKiA0O1xuICAgICAgICBuZXdEc3Rbb2ZmICsgMF0gPSB2WzBdO1xuICAgICAgICBuZXdEc3Rbb2ZmICsgMV0gPSB2WzFdO1xuICAgICAgICBuZXdEc3Rbb2ZmICsgMl0gPSB2WzJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBcIjNkXCIgc2NhbGluZyBjb21wb25lbnQgb2YgdGhlIG1hdHJpeFxuICAgICAqIEBwYXJhbSBtIC0gVGhlIE1hdHJpeFxuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgdmVjdG9yIHRvIHNldC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTY2FsaW5nKG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IHZlYzMuY3JlYXRlKCkpO1xuICAgICAgICBjb25zdCB4eCA9IG1bMF07XG4gICAgICAgIGNvbnN0IHh5ID0gbVsxXTtcbiAgICAgICAgY29uc3QgeHogPSBtWzJdO1xuICAgICAgICBjb25zdCB5eCA9IG1bNF07XG4gICAgICAgIGNvbnN0IHl5ID0gbVs1XTtcbiAgICAgICAgY29uc3QgeXogPSBtWzZdO1xuICAgICAgICBjb25zdCB6eCA9IG1bOF07XG4gICAgICAgIGNvbnN0IHp5ID0gbVs5XTtcbiAgICAgICAgY29uc3QgenogPSBtWzEwXTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5zcXJ0KHh4ICogeHggKyB4eSAqIHh5ICsgeHogKiB4eik7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGguc3FydCh5eCAqIHl4ICsgeXkgKiB5eSArIHl6ICogeXopO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLnNxcnQoenggKiB6eCArIHp5ICogenkgKyB6eiAqIHp6KTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgYSA0LWJ5LTQgcGVyc3BlY3RpdmUgdHJhbnNmb3JtYXRpb24gbWF0cml4IGdpdmVuIHRoZSBhbmd1bGFyIGhlaWdodFxuICAgICAqIG9mIHRoZSBmcnVzdHVtLCB0aGUgYXNwZWN0IHJhdGlvLCBhbmQgdGhlIG5lYXIgYW5kIGZhciBjbGlwcGluZyBwbGFuZXMuICBUaGVcbiAgICAgKiBhcmd1bWVudHMgZGVmaW5lIGEgZnJ1c3R1bSBleHRlbmRpbmcgaW4gdGhlIG5lZ2F0aXZlIHogZGlyZWN0aW9uLiAgVGhlIGdpdmVuXG4gICAgICogYW5nbGUgaXMgdGhlIHZlcnRpY2FsIGFuZ2xlIG9mIHRoZSBmcnVzdHVtLCBhbmQgdGhlIGhvcml6b250YWwgYW5nbGUgaXNcbiAgICAgKiBkZXRlcm1pbmVkIHRvIHByb2R1Y2UgdGhlIGdpdmVuIGFzcGVjdCByYXRpby4gIFRoZSBhcmd1bWVudHMgbmVhciBhbmQgZmFyIGFyZVxuICAgICAqIHRoZSBkaXN0YW5jZXMgdG8gdGhlIG5lYXIgYW5kIGZhciBjbGlwcGluZyBwbGFuZXMuICBOb3RlIHRoYXQgbmVhciBhbmQgZmFyXG4gICAgICogYXJlIG5vdCB6IGNvb3JkaW5hdGVzLCBidXQgcmF0aGVyIHRoZXkgYXJlIGRpc3RhbmNlcyBhbG9uZyB0aGUgbmVnYXRpdmVcbiAgICAgKiB6LWF4aXMuICBUaGUgbWF0cml4IGdlbmVyYXRlZCBzZW5kcyB0aGUgdmlld2luZyBmcnVzdHVtIHRvIHRoZSB1bml0IGJveC5cbiAgICAgKiBXZSBhc3N1bWUgYSB1bml0IGJveCBleHRlbmRpbmcgZnJvbSAtMSB0byAxIGluIHRoZSB4IGFuZCB5IGRpbWVuc2lvbnMgYW5kXG4gICAgICogZnJvbSAwIHRvIDEgaW4gdGhlIHogZGltZW5zaW9uLlxuICAgICAqXG4gICAgICogTm90ZTogSWYgeW91IHBhc3MgYEluZmluaXR5YCBmb3IgekZhciB0aGVuIGl0IHdpbGwgcHJvZHVjZSBhIHByb2plY3Rpb24gbWF0cml4XG4gICAgICogcmV0dXJucyAtSW5maW5pdHkgZm9yIFogd2hlbiB0cmFuc2Zvcm1pbmcgY29vcmRpbmF0ZXMgd2l0aCBaIDw9IDAgYW5kICtJbmZpbml0eSBmb3IgWlxuICAgICAqIG90aGVyd2lzZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWVsZE9mVmlld1lJblJhZGlhbnMgLSBUaGUgY2FtZXJhIGFuZ2xlIGZyb20gdG9wIHRvIGJvdHRvbSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGFzcGVjdCAtIFRoZSBhc3BlY3QgcmF0aW8gd2lkdGggLyBoZWlnaHQuXG4gICAgICogQHBhcmFtIHpOZWFyIC0gVGhlIGRlcHRoIChuZWdhdGl2ZSB6IGNvb3JkaW5hdGUpXG4gICAgICogICAgIG9mIHRoZSBuZWFyIGNsaXBwaW5nIHBsYW5lLlxuICAgICAqIEBwYXJhbSB6RmFyIC0gVGhlIGRlcHRoIChuZWdhdGl2ZSB6IGNvb3JkaW5hdGUpXG4gICAgICogICAgIG9mIHRoZSBmYXIgY2xpcHBpbmcgcGxhbmUuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcGVyc3BlY3RpdmUgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBlcnNwZWN0aXZlKGZpZWxkT2ZWaWV3WUluUmFkaWFucywgYXNwZWN0LCB6TmVhciwgekZhciwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgY29uc3QgZiA9IE1hdGgudGFuKE1hdGguUEkgKiAwLjUgLSAwLjUgKiBmaWVsZE9mVmlld1lJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbMF0gPSBmIC8gYXNwZWN0O1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSBmO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTFdID0gLTE7XG4gICAgICAgIG5ld0RzdFsxMl0gPSAwO1xuICAgICAgICBuZXdEc3RbMTNdID0gMDtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDA7XG4gICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoekZhcikpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmdlSW52ID0gMSAvICh6TmVhciAtIHpGYXIpO1xuICAgICAgICAgICAgbmV3RHN0WzEwXSA9IHpGYXIgKiByYW5nZUludjtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSB6RmFyICogek5lYXIgKiByYW5nZUludjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0RzdFsxMF0gPSAtMTtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSAtek5lYXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgYSA0LWJ5LTQgcmV2ZXJzZS16IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBnaXZlbiB0aGUgYW5ndWxhciBoZWlnaHRcbiAgICAgKiBvZiB0aGUgZnJ1c3R1bSwgdGhlIGFzcGVjdCByYXRpbywgYW5kIHRoZSBuZWFyIGFuZCBmYXIgY2xpcHBpbmcgcGxhbmVzLiAgVGhlXG4gICAgICogYXJndW1lbnRzIGRlZmluZSBhIGZydXN0dW0gZXh0ZW5kaW5nIGluIHRoZSBuZWdhdGl2ZSB6IGRpcmVjdGlvbi4gIFRoZSBnaXZlblxuICAgICAqIGFuZ2xlIGlzIHRoZSB2ZXJ0aWNhbCBhbmdsZSBvZiB0aGUgZnJ1c3R1bSwgYW5kIHRoZSBob3Jpem9udGFsIGFuZ2xlIGlzXG4gICAgICogZGV0ZXJtaW5lZCB0byBwcm9kdWNlIHRoZSBnaXZlbiBhc3BlY3QgcmF0aW8uICBUaGUgYXJndW1lbnRzIG5lYXIgYW5kIGZhciBhcmVcbiAgICAgKiB0aGUgZGlzdGFuY2VzIHRvIHRoZSBuZWFyIGFuZCBmYXIgY2xpcHBpbmcgcGxhbmVzLiAgTm90ZSB0aGF0IG5lYXIgYW5kIGZhclxuICAgICAqIGFyZSBub3QgeiBjb29yZGluYXRlcywgYnV0IHJhdGhlciB0aGV5IGFyZSBkaXN0YW5jZXMgYWxvbmcgdGhlIG5lZ2F0aXZlXG4gICAgICogei1heGlzLiAgVGhlIG1hdHJpeCBnZW5lcmF0ZWQgc2VuZHMgdGhlIHZpZXdpbmcgZnJ1c3R1bSB0byB0aGUgdW5pdCBib3guXG4gICAgICogV2UgYXNzdW1lIGEgdW5pdCBib3ggZXh0ZW5kaW5nIGZyb20gLTEgdG8gMSBpbiB0aGUgeCBhbmQgeSBkaW1lbnNpb25zIGFuZFxuICAgICAqIGZyb20gMSAoYXQgLXpOZWFyKSB0byAwIChhdCAtekZhcikgaW4gdGhlIHogZGltZW5zaW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGZpZWxkT2ZWaWV3WUluUmFkaWFucyAtIFRoZSBjYW1lcmEgYW5nbGUgZnJvbSB0b3AgdG8gYm90dG9tIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gYXNwZWN0IC0gVGhlIGFzcGVjdCByYXRpbyB3aWR0aCAvIGhlaWdodC5cbiAgICAgKiBAcGFyYW0gek5lYXIgLSBUaGUgZGVwdGggKG5lZ2F0aXZlIHogY29vcmRpbmF0ZSlcbiAgICAgKiAgICAgb2YgdGhlIG5lYXIgY2xpcHBpbmcgcGxhbmUuXG4gICAgICogQHBhcmFtIHpGYXIgLSBUaGUgZGVwdGggKG5lZ2F0aXZlIHogY29vcmRpbmF0ZSlcbiAgICAgKiAgICAgb2YgdGhlIGZhciBjbGlwcGluZyBwbGFuZS4gKGRlZmF1bHQgPSBJbmZpbml0eSlcbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBwZXJzcGVjdGl2ZSBtYXRyaXguXG4gICAgICovIGZ1bmN0aW9uIHBlcnNwZWN0aXZlUmV2ZXJzZVooZmllbGRPZlZpZXdZSW5SYWRpYW5zLCBhc3BlY3QsIHpOZWFyLCB6RmFyID0gSW5maW5pdHksIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IGYgPSAxIC8gTWF0aC50YW4oZmllbGRPZlZpZXdZSW5SYWRpYW5zICogMC41KTtcbiAgICAgICAgbmV3RHN0WzBdID0gZiAvIGFzcGVjdDtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gZjtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzExXSA9IC0xO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNV0gPSAwO1xuICAgICAgICBpZiAoekZhciA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIG5ld0RzdFsxMF0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzE0XSA9IHpOZWFyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmFuZ2VJbnYgPSAxIC8gKHpGYXIgLSB6TmVhcik7XG4gICAgICAgICAgICBuZXdEc3RbMTBdID0gek5lYXIgKiByYW5nZUludjtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSB6RmFyICogek5lYXIgKiByYW5nZUludjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyBhIDQtYnktNCBvcnRob2dvbmFsIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCB0aGF0IHRyYW5zZm9ybXMgZnJvbVxuICAgICAqIHRoZSBnaXZlbiB0aGUgbGVmdCwgcmlnaHQsIGJvdHRvbSwgYW5kIHRvcCBkaW1lbnNpb25zIHRvIC0xICsxIGluIHgsIGFuZCB5XG4gICAgICogYW5kIDAgdG8gKzEgaW4gei5cbiAgICAgKiBAcGFyYW0gbGVmdCAtIExlZnQgc2lkZSBvZiB0aGUgbmVhciBjbGlwcGluZyBwbGFuZSB2aWV3cG9ydC5cbiAgICAgKiBAcGFyYW0gcmlnaHQgLSBSaWdodCBzaWRlIG9mIHRoZSBuZWFyIGNsaXBwaW5nIHBsYW5lIHZpZXdwb3J0LlxuICAgICAqIEBwYXJhbSBib3R0b20gLSBCb3R0b20gb2YgdGhlIG5lYXIgY2xpcHBpbmcgcGxhbmUgdmlld3BvcnQuXG4gICAgICogQHBhcmFtIHRvcCAtIFRvcCBvZiB0aGUgbmVhciBjbGlwcGluZyBwbGFuZSB2aWV3cG9ydC5cbiAgICAgKiBAcGFyYW0gbmVhciAtIFRoZSBkZXB0aCAobmVnYXRpdmUgeiBjb29yZGluYXRlKVxuICAgICAqICAgICBvZiB0aGUgbmVhciBjbGlwcGluZyBwbGFuZS5cbiAgICAgKiBAcGFyYW0gZmFyIC0gVGhlIGRlcHRoIChuZWdhdGl2ZSB6IGNvb3JkaW5hdGUpXG4gICAgICogICAgIG9mIHRoZSBmYXIgY2xpcHBpbmcgcGxhbmUuXG4gICAgICogQHBhcmFtIGRzdCAtIE91dHB1dCBtYXRyaXguIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG9ydGhvZ3JhcGhpYyBwcm9qZWN0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvcnRobyhsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhciwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gMiAvIChyaWdodCAtIGxlZnQpO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSAyIC8gKHRvcCAtIGJvdHRvbSk7XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IChyaWdodCArIGxlZnQpIC8gKGxlZnQgLSByaWdodCk7XG4gICAgICAgIG5ld0RzdFsxM10gPSAodG9wICsgYm90dG9tKSAvIChib3R0b20gLSB0b3ApO1xuICAgICAgICBuZXdEc3RbMTRdID0gbmVhciAvIChuZWFyIC0gZmFyKTtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIGEgNC1ieS00IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBnaXZlbiB0aGUgbGVmdCwgcmlnaHQsXG4gICAgICogdG9wLCBib3R0b20sIG5lYXIgYW5kIGZhciBjbGlwcGluZyBwbGFuZXMuIFRoZSBhcmd1bWVudHMgZGVmaW5lIGEgZnJ1c3R1bVxuICAgICAqIGV4dGVuZGluZyBpbiB0aGUgbmVnYXRpdmUgeiBkaXJlY3Rpb24uIFRoZSBhcmd1bWVudHMgbmVhciBhbmQgZmFyIGFyZSB0aGVcbiAgICAgKiBkaXN0YW5jZXMgdG8gdGhlIG5lYXIgYW5kIGZhciBjbGlwcGluZyBwbGFuZXMuIE5vdGUgdGhhdCBuZWFyIGFuZCBmYXIgYXJlIG5vdFxuICAgICAqIHogY29vcmRpbmF0ZXMsIGJ1dCByYXRoZXIgdGhleSBhcmUgZGlzdGFuY2VzIGFsb25nIHRoZSBuZWdhdGl2ZSB6LWF4aXMuIFRoZVxuICAgICAqIG1hdHJpeCBnZW5lcmF0ZWQgc2VuZHMgdGhlIHZpZXdpbmcgZnJ1c3R1bSB0byB0aGUgdW5pdCBib3guIFdlIGFzc3VtZSBhIHVuaXRcbiAgICAgKiBib3ggZXh0ZW5kaW5nIGZyb20gLTEgdG8gMSBpbiB0aGUgeCBhbmQgeSBkaW1lbnNpb25zIGFuZCBmcm9tIDAgdG8gMSBpbiB0aGUgelxuICAgICAqIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gbGVmdCAtIFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGxlZnQgcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gcmlnaHQgLSBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSByaWdodCBwbGFuZSBvZiB0aGUgYm94LlxuICAgICAqIEBwYXJhbSBib3R0b20gLSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBib3R0b20gcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gdG9wIC0gVGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgcmlnaHQgcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gbmVhciAtIFRoZSBuZWdhdGl2ZSB6IGNvb3JkaW5hdGUgb2YgdGhlIG5lYXIgcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gZmFyIC0gVGhlIG5lZ2F0aXZlIHogY29vcmRpbmF0ZSBvZiB0aGUgZmFyIHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIGRzdCAtIE91dHB1dCBtYXRyaXguIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHBlcnNwZWN0aXZlIHByb2plY3Rpb24gbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZydXN0dW0obGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IGR4ID0gKHJpZ2h0IC0gbGVmdCk7XG4gICAgICAgIGNvbnN0IGR5ID0gKHRvcCAtIGJvdHRvbSk7XG4gICAgICAgIGNvbnN0IGR6ID0gKG5lYXIgLSBmYXIpO1xuICAgICAgICBuZXdEc3RbMF0gPSAyICogbmVhciAvIGR4O1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSAyICogbmVhciAvIGR5O1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAobGVmdCArIHJpZ2h0KSAvIGR4O1xuICAgICAgICBuZXdEc3RbOV0gPSAodG9wICsgYm90dG9tKSAvIGR5O1xuICAgICAgICBuZXdEc3RbMTBdID0gZmFyIC8gZHo7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAtMTtcbiAgICAgICAgbmV3RHN0WzEyXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxM10gPSAwO1xuICAgICAgICBuZXdEc3RbMTRdID0gbmVhciAqIGZhciAvIGR6O1xuICAgICAgICBuZXdEc3RbMTVdID0gMDtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgYSA0LWJ5LTQgcmV2ZXJzZS16IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBnaXZlbiB0aGUgbGVmdCwgcmlnaHQsXG4gICAgICogdG9wLCBib3R0b20sIG5lYXIgYW5kIGZhciBjbGlwcGluZyBwbGFuZXMuIFRoZSBhcmd1bWVudHMgZGVmaW5lIGEgZnJ1c3R1bVxuICAgICAqIGV4dGVuZGluZyBpbiB0aGUgbmVnYXRpdmUgeiBkaXJlY3Rpb24uIFRoZSBhcmd1bWVudHMgbmVhciBhbmQgZmFyIGFyZSB0aGVcbiAgICAgKiBkaXN0YW5jZXMgdG8gdGhlIG5lYXIgYW5kIGZhciBjbGlwcGluZyBwbGFuZXMuIE5vdGUgdGhhdCBuZWFyIGFuZCBmYXIgYXJlIG5vdFxuICAgICAqIHogY29vcmRpbmF0ZXMsIGJ1dCByYXRoZXIgdGhleSBhcmUgZGlzdGFuY2VzIGFsb25nIHRoZSBuZWdhdGl2ZSB6LWF4aXMuIFRoZVxuICAgICAqIG1hdHJpeCBnZW5lcmF0ZWQgc2VuZHMgdGhlIHZpZXdpbmcgZnJ1c3R1bSB0byB0aGUgdW5pdCBib3guIFdlIGFzc3VtZSBhIHVuaXRcbiAgICAgKiBib3ggZXh0ZW5kaW5nIGZyb20gLTEgdG8gMSBpbiB0aGUgeCBhbmQgeSBkaW1lbnNpb25zIGFuZCBmcm9tIDEgKC1uZWFyKSB0byAwICgtZmFyKSBpbiB0aGUgelxuICAgICAqIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gbGVmdCAtIFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGxlZnQgcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gcmlnaHQgLSBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSByaWdodCBwbGFuZSBvZiB0aGUgYm94LlxuICAgICAqIEBwYXJhbSBib3R0b20gLSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBib3R0b20gcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gdG9wIC0gVGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgcmlnaHQgcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gbmVhciAtIFRoZSBuZWdhdGl2ZSB6IGNvb3JkaW5hdGUgb2YgdGhlIG5lYXIgcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gZmFyIC0gVGhlIG5lZ2F0aXZlIHogY29vcmRpbmF0ZSBvZiB0aGUgZmFyIHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIGRzdCAtIE91dHB1dCBtYXRyaXguIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHBlcnNwZWN0aXZlIHByb2plY3Rpb24gbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZydXN0dW1SZXZlcnNlWihsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhciA9IEluZmluaXR5LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCBkeCA9IChyaWdodCAtIGxlZnQpO1xuICAgICAgICBjb25zdCBkeSA9ICh0b3AgLSBib3R0b20pO1xuICAgICAgICBuZXdEc3RbMF0gPSAyICogbmVhciAvIGR4O1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSAyICogbmVhciAvIGR5O1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAobGVmdCArIHJpZ2h0KSAvIGR4O1xuICAgICAgICBuZXdEc3RbOV0gPSAodG9wICsgYm90dG9tKSAvIGR5O1xuICAgICAgICBuZXdEc3RbMTFdID0gLTE7XG4gICAgICAgIG5ld0RzdFsxMl0gPSAwO1xuICAgICAgICBuZXdEc3RbMTNdID0gMDtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDA7XG4gICAgICAgIGlmIChmYXIgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICBuZXdEc3RbMTBdID0gMDtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSBuZWFyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmFuZ2VJbnYgPSAxIC8gKGZhciAtIG5lYXIpO1xuICAgICAgICAgICAgbmV3RHN0WzEwXSA9IG5lYXIgKiByYW5nZUludjtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSBmYXIgKiBuZWFyICogcmFuZ2VJbnY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgY29uc3QgeEF4aXMgPSB2ZWMzLmNyZWF0ZSgpO1xuICAgIGNvbnN0IHlBeGlzID0gdmVjMy5jcmVhdGUoKTtcbiAgICBjb25zdCB6QXhpcyA9IHZlYzMuY3JlYXRlKCk7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgYSA0LWJ5LTQgYWltIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqXG4gICAgICogVGhpcyBpcyBhIG1hdHJpeCB3aGljaCBwb3NpdGlvbnMgYW4gb2JqZWN0IGFpbWluZyBkb3duIHBvc2l0aXZlIFouXG4gICAgICogdG93YXJkIHRoZSB0YXJnZXQuXG4gICAgICpcbiAgICAgKiBOb3RlOiB0aGlzIGlzICoqTk9UKiogdGhlIGludmVyc2Ugb2YgbG9va0F0IGFzIGxvb2tBdCBsb29rcyBhdCBuZWdhdGl2ZSBaLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSBwb3NpdGlvbiBtZWFudCB0byBiZSBhaW1lZCBhdC5cbiAgICAgKiBAcGFyYW0gdXAgLSBBIHZlY3RvciBwb2ludGluZyB1cC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBhaW0gbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFpbShwb3NpdGlvbiwgdGFyZ2V0LCB1cCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgdmVjMy5ub3JtYWxpemUodmVjMy5zdWJ0cmFjdCh0YXJnZXQsIHBvc2l0aW9uLCB6QXhpcyksIHpBeGlzKTtcbiAgICAgICAgdmVjMy5ub3JtYWxpemUodmVjMy5jcm9zcyh1cCwgekF4aXMsIHhBeGlzKSwgeEF4aXMpO1xuICAgICAgICB2ZWMzLm5vcm1hbGl6ZSh2ZWMzLmNyb3NzKHpBeGlzLCB4QXhpcywgeUF4aXMpLCB5QXhpcyk7XG4gICAgICAgIG5ld0RzdFswXSA9IHhBeGlzWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSB4QXhpc1sxXTtcbiAgICAgICAgbmV3RHN0WzJdID0geEF4aXNbMl07XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IHlBeGlzWzBdO1xuICAgICAgICBuZXdEc3RbNV0gPSB5QXhpc1sxXTtcbiAgICAgICAgbmV3RHN0WzZdID0geUF4aXNbMl07XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IHpBeGlzWzBdO1xuICAgICAgICBuZXdEc3RbOV0gPSB6QXhpc1sxXTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IHpBeGlzWzJdO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IHBvc2l0aW9uWzBdO1xuICAgICAgICBuZXdEc3RbMTNdID0gcG9zaXRpb25bMV07XG4gICAgICAgIG5ld0RzdFsxNF0gPSBwb3NpdGlvblsyXTtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIGEgNC1ieS00IGNhbWVyYSBhaW0gdHJhbnNmb3JtYXRpb24uXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIGEgbWF0cml4IHdoaWNoIHBvc2l0aW9ucyBhbiBvYmplY3QgYWltaW5nIGRvd24gbmVnYXRpdmUgWi5cbiAgICAgKiB0b3dhcmQgdGhlIHRhcmdldC5cbiAgICAgKlxuICAgICAqIE5vdGU6IHRoaXMgaXMgdGhlIGludmVyc2Ugb2YgYGxvb2tBdGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSBleWUgLSBUaGUgcG9zaXRpb24gb2YgdGhlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIHBvc2l0aW9uIG1lYW50IHRvIGJlIGFpbWVkIGF0LlxuICAgICAqIEBwYXJhbSB1cCAtIEEgdmVjdG9yIHBvaW50aW5nIHVwLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGFpbSBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2FtZXJhQWltKGV5ZSwgdGFyZ2V0LCB1cCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgdmVjMy5ub3JtYWxpemUodmVjMy5zdWJ0cmFjdChleWUsIHRhcmdldCwgekF4aXMpLCB6QXhpcyk7XG4gICAgICAgIHZlYzMubm9ybWFsaXplKHZlYzMuY3Jvc3ModXAsIHpBeGlzLCB4QXhpcyksIHhBeGlzKTtcbiAgICAgICAgdmVjMy5ub3JtYWxpemUodmVjMy5jcm9zcyh6QXhpcywgeEF4aXMsIHlBeGlzKSwgeUF4aXMpO1xuICAgICAgICBuZXdEc3RbMF0gPSB4QXhpc1swXTtcbiAgICAgICAgbmV3RHN0WzFdID0geEF4aXNbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHhBeGlzWzJdO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSB5QXhpc1swXTtcbiAgICAgICAgbmV3RHN0WzVdID0geUF4aXNbMV07XG4gICAgICAgIG5ld0RzdFs2XSA9IHlBeGlzWzJdO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSB6QXhpc1swXTtcbiAgICAgICAgbmV3RHN0WzldID0gekF4aXNbMV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSB6QXhpc1syXTtcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMl0gPSBleWVbMF07XG4gICAgICAgIG5ld0RzdFsxM10gPSBleWVbMV07XG4gICAgICAgIG5ld0RzdFsxNF0gPSBleWVbMl07XG4gICAgICAgIG5ld0RzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyBhIDQtYnktNCB2aWV3IHRyYW5zZm9ybWF0aW9uLlxuICAgICAqXG4gICAgICogVGhpcyBpcyBhIHZpZXcgbWF0cml4IHdoaWNoIHRyYW5zZm9ybXMgYWxsIG90aGVyIG9iamVjdHNcbiAgICAgKiB0byBiZSBpbiB0aGUgc3BhY2Ugb2YgdGhlIHZpZXcgZGVmaW5lZCBieSB0aGUgcGFyYW1ldGVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBleWUgLSBUaGUgcG9zaXRpb24gb2YgdGhlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIHBvc2l0aW9uIG1lYW50IHRvIGJlIGFpbWVkIGF0LlxuICAgICAqIEBwYXJhbSB1cCAtIEEgdmVjdG9yIHBvaW50aW5nIHVwLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGxvb2stYXQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvb2tBdChleWUsIHRhcmdldCwgdXAsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIHZlYzMubm9ybWFsaXplKHZlYzMuc3VidHJhY3QoZXllLCB0YXJnZXQsIHpBeGlzKSwgekF4aXMpO1xuICAgICAgICB2ZWMzLm5vcm1hbGl6ZSh2ZWMzLmNyb3NzKHVwLCB6QXhpcywgeEF4aXMpLCB4QXhpcyk7XG4gICAgICAgIHZlYzMubm9ybWFsaXplKHZlYzMuY3Jvc3MoekF4aXMsIHhBeGlzLCB5QXhpcyksIHlBeGlzKTtcbiAgICAgICAgbmV3RHN0WzBdID0geEF4aXNbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHlBeGlzWzBdO1xuICAgICAgICBuZXdEc3RbMl0gPSB6QXhpc1swXTtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0geEF4aXNbMV07XG4gICAgICAgIG5ld0RzdFs1XSA9IHlBeGlzWzFdO1xuICAgICAgICBuZXdEc3RbNl0gPSB6QXhpc1sxXTtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0geEF4aXNbMl07XG4gICAgICAgIG5ld0RzdFs5XSA9IHlBeGlzWzJdO1xuICAgICAgICBuZXdEc3RbMTBdID0gekF4aXNbMl07XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gLSh4QXhpc1swXSAqIGV5ZVswXSArIHhBeGlzWzFdICogZXllWzFdICsgeEF4aXNbMl0gKiBleWVbMl0pO1xuICAgICAgICBuZXdEc3RbMTNdID0gLSh5QXhpc1swXSAqIGV5ZVswXSArIHlBeGlzWzFdICogZXllWzFdICsgeUF4aXNbMl0gKiBleWVbMl0pO1xuICAgICAgICBuZXdEc3RbMTRdID0gLSh6QXhpc1swXSAqIGV5ZVswXSArIHpBeGlzWzFdICogZXllWzFdICsgekF4aXNbMl0gKiBleWVbMl0pO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDQtYnktNCBtYXRyaXggd2hpY2ggdHJhbnNsYXRlcyBieSB0aGUgZ2l2ZW4gdmVjdG9yIHYuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yIGJ5XG4gICAgICogICAgIHdoaWNoIHRvIHRyYW5zbGF0ZS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB0cmFuc2xhdGlvbiBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRpb24odiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gMTtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gMTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IDE7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gdlswXTtcbiAgICAgICAgbmV3RHN0WzEzXSA9IHZbMV07XG4gICAgICAgIG5ld0RzdFsxNF0gPSB2WzJdO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gNC1ieS00IG1hdHJpeCBieSB0aGUgZ2l2ZW4gdmVjdG9yIHYuXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3RvciBieVxuICAgICAqICAgICB3aGljaCB0byB0cmFuc2xhdGUuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdHJhbnNsYXRlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKG0sIHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIGNvbnN0IG0wMCA9IG1bMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG1bMV07XG4gICAgICAgIGNvbnN0IG0wMiA9IG1bMl07XG4gICAgICAgIGNvbnN0IG0wMyA9IG1bM107XG4gICAgICAgIGNvbnN0IG0xMCA9IG1bMSAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTExID0gbVsxICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMTIgPSBtWzEgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0xMyA9IG1bMSAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgbTIwID0gbVsyICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMjEgPSBtWzIgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0yMiA9IG1bMiAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTIzID0gbVsyICogNCArIDNdO1xuICAgICAgICBjb25zdCBtMzAgPSBtWzMgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0zMSA9IG1bMyAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTMyID0gbVszICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMzMgPSBtWzMgKiA0ICsgM107XG4gICAgICAgIGlmIChtICE9PSBuZXdEc3QpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IG0wMDtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IG0wMTtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IG0wMjtcbiAgICAgICAgICAgIG5ld0RzdFszXSA9IG0wMztcbiAgICAgICAgICAgIG5ld0RzdFs0XSA9IG0xMDtcbiAgICAgICAgICAgIG5ld0RzdFs1XSA9IG0xMTtcbiAgICAgICAgICAgIG5ld0RzdFs2XSA9IG0xMjtcbiAgICAgICAgICAgIG5ld0RzdFs3XSA9IG0xMztcbiAgICAgICAgICAgIG5ld0RzdFs4XSA9IG0yMDtcbiAgICAgICAgICAgIG5ld0RzdFs5XSA9IG0yMTtcbiAgICAgICAgICAgIG5ld0RzdFsxMF0gPSBtMjI7XG4gICAgICAgICAgICBuZXdEc3RbMTFdID0gbTIzO1xuICAgICAgICB9XG4gICAgICAgIG5ld0RzdFsxMl0gPSBtMDAgKiB2MCArIG0xMCAqIHYxICsgbTIwICogdjIgKyBtMzA7XG4gICAgICAgIG5ld0RzdFsxM10gPSBtMDEgKiB2MCArIG0xMSAqIHYxICsgbTIxICogdjIgKyBtMzE7XG4gICAgICAgIG5ld0RzdFsxNF0gPSBtMDIgKiB2MCArIG0xMiAqIHYxICsgbTIyICogdjIgKyBtMzI7XG4gICAgICAgIG5ld0RzdFsxNV0gPSBtMDMgKiB2MCArIG0xMyAqIHYxICsgbTIzICogdjIgKyBtMzM7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSA0LWJ5LTQgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYXJvdW5kIHRoZSB4LWF4aXMgYnkgdGhlIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHJvdGF0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGlvblgoYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFswXSA9IDE7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IGM7XG4gICAgICAgIG5ld0RzdFs2XSA9IHM7XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IC1zO1xuICAgICAgICBuZXdEc3RbMTBdID0gYztcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMl0gPSAwO1xuICAgICAgICBuZXdEc3RbMTNdID0gMDtcbiAgICAgICAgbmV3RHN0WzE0XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIHRoZSBnaXZlbiA0LWJ5LTQgbWF0cml4IGFyb3VuZCB0aGUgeC1heGlzIGJ5IHRoZSBnaXZlblxuICAgICAqIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGVYKG0sIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCBtMTAgPSBtWzRdO1xuICAgICAgICBjb25zdCBtMTEgPSBtWzVdO1xuICAgICAgICBjb25zdCBtMTIgPSBtWzZdO1xuICAgICAgICBjb25zdCBtMTMgPSBtWzddO1xuICAgICAgICBjb25zdCBtMjAgPSBtWzhdO1xuICAgICAgICBjb25zdCBtMjEgPSBtWzldO1xuICAgICAgICBjb25zdCBtMjIgPSBtWzEwXTtcbiAgICAgICAgY29uc3QgbTIzID0gbVsxMV07XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFs0XSA9IGMgKiBtMTAgKyBzICogbTIwO1xuICAgICAgICBuZXdEc3RbNV0gPSBjICogbTExICsgcyAqIG0yMTtcbiAgICAgICAgbmV3RHN0WzZdID0gYyAqIG0xMiArIHMgKiBtMjI7XG4gICAgICAgIG5ld0RzdFs3XSA9IGMgKiBtMTMgKyBzICogbTIzO1xuICAgICAgICBuZXdEc3RbOF0gPSBjICogbTIwIC0gcyAqIG0xMDtcbiAgICAgICAgbmV3RHN0WzldID0gYyAqIG0yMSAtIHMgKiBtMTE7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBjICogbTIyIC0gcyAqIG0xMjtcbiAgICAgICAgbmV3RHN0WzExXSA9IGMgKiBtMjMgLSBzICogbTEzO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSBtWzBdO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gbVsxXTtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IG1bMl07XG4gICAgICAgICAgICBuZXdEc3RbM10gPSBtWzNdO1xuICAgICAgICAgICAgbmV3RHN0WzEyXSA9IG1bMTJdO1xuICAgICAgICAgICAgbmV3RHN0WzEzXSA9IG1bMTNdO1xuICAgICAgICAgICAgbmV3RHN0WzE0XSA9IG1bMTRdO1xuICAgICAgICAgICAgbmV3RHN0WzE1XSA9IG1bMTVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSA0LWJ5LTQgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYXJvdW5kIHRoZSB5LWF4aXMgYnkgdGhlIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHJvdGF0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGlvblkoYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFswXSA9IGM7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IC1zO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSAxO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSBzO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTBdID0gYztcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMl0gPSAwO1xuICAgICAgICBuZXdEc3RbMTNdID0gMDtcbiAgICAgICAgbmV3RHN0WzE0XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIHRoZSBnaXZlbiA0LWJ5LTQgbWF0cml4IGFyb3VuZCB0aGUgeS1heGlzIGJ5IHRoZSBnaXZlblxuICAgICAqIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGVZKG0sIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCBtMDAgPSBtWzAgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG1bMCAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbVswICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMDMgPSBtWzAgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bMiAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTIxID0gbVsyICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMjIgPSBtWzIgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0yMyA9IG1bMiAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYyAqIG0wMCAtIHMgKiBtMjA7XG4gICAgICAgIG5ld0RzdFsxXSA9IGMgKiBtMDEgLSBzICogbTIxO1xuICAgICAgICBuZXdEc3RbMl0gPSBjICogbTAyIC0gcyAqIG0yMjtcbiAgICAgICAgbmV3RHN0WzNdID0gYyAqIG0wMyAtIHMgKiBtMjM7XG4gICAgICAgIG5ld0RzdFs4XSA9IGMgKiBtMjAgKyBzICogbTAwO1xuICAgICAgICBuZXdEc3RbOV0gPSBjICogbTIxICsgcyAqIG0wMTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IGMgKiBtMjIgKyBzICogbTAyO1xuICAgICAgICBuZXdEc3RbMTFdID0gYyAqIG0yMyArIHMgKiBtMDM7XG4gICAgICAgIGlmIChtICE9PSBuZXdEc3QpIHtcbiAgICAgICAgICAgIG5ld0RzdFs0XSA9IG1bNF07XG4gICAgICAgICAgICBuZXdEc3RbNV0gPSBtWzVdO1xuICAgICAgICAgICAgbmV3RHN0WzZdID0gbVs2XTtcbiAgICAgICAgICAgIG5ld0RzdFs3XSA9IG1bN107XG4gICAgICAgICAgICBuZXdEc3RbMTJdID0gbVsxMl07XG4gICAgICAgICAgICBuZXdEc3RbMTNdID0gbVsxM107XG4gICAgICAgICAgICBuZXdEc3RbMTRdID0gbVsxNF07XG4gICAgICAgICAgICBuZXdEc3RbMTVdID0gbVsxNV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDQtYnktNCBtYXRyaXggd2hpY2ggcm90YXRlcyBhcm91bmQgdGhlIHotYXhpcyBieSB0aGUgZ2l2ZW4gYW5nbGUuXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRpb24gbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0aW9uWihhbmdsZUluUmFkaWFucywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYztcbiAgICAgICAgbmV3RHN0WzFdID0gcztcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gLXM7XG4gICAgICAgIG5ld0RzdFs1XSA9IGM7XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSAxO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxM10gPSAwO1xuICAgICAgICBuZXdEc3RbMTRdID0gMDtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJvdGF0ZXMgdGhlIGdpdmVuIDQtYnktNCBtYXRyaXggYXJvdW5kIHRoZSB6LWF4aXMgYnkgdGhlIGdpdmVuXG4gICAgICogYW5nbGUuXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHJvdGF0ZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0ZVoobSwgYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IG0wMCA9IG1bMCAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTAxID0gbVswICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtWzAgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0wMyA9IG1bMCAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgbTEwID0gbVsxICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMTEgPSBtWzEgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0xMiA9IG1bMSAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTEzID0gbVsxICogNCArIDNdO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbMF0gPSBjICogbTAwICsgcyAqIG0xMDtcbiAgICAgICAgbmV3RHN0WzFdID0gYyAqIG0wMSArIHMgKiBtMTE7XG4gICAgICAgIG5ld0RzdFsyXSA9IGMgKiBtMDIgKyBzICogbTEyO1xuICAgICAgICBuZXdEc3RbM10gPSBjICogbTAzICsgcyAqIG0xMztcbiAgICAgICAgbmV3RHN0WzRdID0gYyAqIG0xMCAtIHMgKiBtMDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IGMgKiBtMTEgLSBzICogbTAxO1xuICAgICAgICBuZXdEc3RbNl0gPSBjICogbTEyIC0gcyAqIG0wMjtcbiAgICAgICAgbmV3RHN0WzddID0gYyAqIG0xMyAtIHMgKiBtMDM7XG4gICAgICAgIGlmIChtICE9PSBuZXdEc3QpIHtcbiAgICAgICAgICAgIG5ld0RzdFs4XSA9IG1bOF07XG4gICAgICAgICAgICBuZXdEc3RbOV0gPSBtWzldO1xuICAgICAgICAgICAgbmV3RHN0WzEwXSA9IG1bMTBdO1xuICAgICAgICAgICAgbmV3RHN0WzExXSA9IG1bMTFdO1xuICAgICAgICAgICAgbmV3RHN0WzEyXSA9IG1bMTJdO1xuICAgICAgICAgICAgbmV3RHN0WzEzXSA9IG1bMTNdO1xuICAgICAgICAgICAgbmV3RHN0WzE0XSA9IG1bMTRdO1xuICAgICAgICAgICAgbmV3RHN0WzE1XSA9IG1bMTVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSA0LWJ5LTQgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYXJvdW5kIHRoZSBnaXZlbiBheGlzIGJ5IHRoZSBnaXZlblxuICAgICAqIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBheGlzIC0gVGhlIGF4aXNcbiAgICAgKiAgICAgYWJvdXQgd2hpY2ggdG8gcm90YXRlLlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBtYXRyaXggd2hpY2ggcm90YXRlcyBhbmdsZSByYWRpYW5zXG4gICAgICogICAgIGFyb3VuZCB0aGUgYXhpcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBheGlzUm90YXRpb24oYXhpcywgYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGxldCB4ID0gYXhpc1swXTtcbiAgICAgICAgbGV0IHkgPSBheGlzWzFdO1xuICAgICAgICBsZXQgeiA9IGF4aXNbMl07XG4gICAgICAgIGNvbnN0IG4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcbiAgICAgICAgeCAvPSBuO1xuICAgICAgICB5IC89IG47XG4gICAgICAgIHogLz0gbjtcbiAgICAgICAgY29uc3QgeHggPSB4ICogeDtcbiAgICAgICAgY29uc3QgeXkgPSB5ICogeTtcbiAgICAgICAgY29uc3QgenogPSB6ICogejtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgY29uc3Qgb25lTWludXNDb3NpbmUgPSAxIC0gYztcbiAgICAgICAgbmV3RHN0WzBdID0geHggKyAoMSAtIHh4KSAqIGM7XG4gICAgICAgIG5ld0RzdFsxXSA9IHggKiB5ICogb25lTWludXNDb3NpbmUgKyB6ICogcztcbiAgICAgICAgbmV3RHN0WzJdID0geCAqIHogKiBvbmVNaW51c0Nvc2luZSAtIHkgKiBzO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSB4ICogeSAqIG9uZU1pbnVzQ29zaW5lIC0geiAqIHM7XG4gICAgICAgIG5ld0RzdFs1XSA9IHl5ICsgKDEgLSB5eSkgKiBjO1xuICAgICAgICBuZXdEc3RbNl0gPSB5ICogeiAqIG9uZU1pbnVzQ29zaW5lICsgeCAqIHM7XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IHggKiB6ICogb25lTWludXNDb3NpbmUgKyB5ICogcztcbiAgICAgICAgbmV3RHN0WzldID0geSAqIHogKiBvbmVNaW51c0Nvc2luZSAtIHggKiBzO1xuICAgICAgICBuZXdEc3RbMTBdID0genogKyAoMSAtIHp6KSAqIGM7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNF0gPSAwO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDQtYnktNCBtYXRyaXggd2hpY2ggcm90YXRlcyBhcm91bmQgdGhlIGdpdmVuIGF4aXMgYnkgdGhlIGdpdmVuXG4gICAgICogYW5nbGUuIChzYW1lIGFzIGF4aXNSb3RhdGlvbilcbiAgICAgKiBAcGFyYW0gYXhpcyAtIFRoZSBheGlzXG4gICAgICogICAgIGFib3V0IHdoaWNoIHRvIHJvdGF0ZS5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYW5nbGUgcmFkaWFuc1xuICAgICAqICAgICBhcm91bmQgdGhlIGF4aXMuXG4gICAgICovXG4gICAgY29uc3Qgcm90YXRpb24gPSBheGlzUm90YXRpb247XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gNC1ieS00IG1hdHJpeCBhcm91bmQgdGhlIGdpdmVuIGF4aXMgYnkgdGhlXG4gICAgICogZ2l2ZW4gYW5nbGUuXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBheGlzIC0gVGhlIGF4aXNcbiAgICAgKiAgICAgYWJvdXQgd2hpY2ggdG8gcm90YXRlLlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHJvdGF0ZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGF4aXNSb3RhdGUobSwgYXhpcywgYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGxldCB4ID0gYXhpc1swXTtcbiAgICAgICAgbGV0IHkgPSBheGlzWzFdO1xuICAgICAgICBsZXQgeiA9IGF4aXNbMl07XG4gICAgICAgIGNvbnN0IG4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcbiAgICAgICAgeCAvPSBuO1xuICAgICAgICB5IC89IG47XG4gICAgICAgIHogLz0gbjtcbiAgICAgICAgY29uc3QgeHggPSB4ICogeDtcbiAgICAgICAgY29uc3QgeXkgPSB5ICogeTtcbiAgICAgICAgY29uc3QgenogPSB6ICogejtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgY29uc3Qgb25lTWludXNDb3NpbmUgPSAxIC0gYztcbiAgICAgICAgY29uc3QgcjAwID0geHggKyAoMSAtIHh4KSAqIGM7XG4gICAgICAgIGNvbnN0IHIwMSA9IHggKiB5ICogb25lTWludXNDb3NpbmUgKyB6ICogcztcbiAgICAgICAgY29uc3QgcjAyID0geCAqIHogKiBvbmVNaW51c0Nvc2luZSAtIHkgKiBzO1xuICAgICAgICBjb25zdCByMTAgPSB4ICogeSAqIG9uZU1pbnVzQ29zaW5lIC0geiAqIHM7XG4gICAgICAgIGNvbnN0IHIxMSA9IHl5ICsgKDEgLSB5eSkgKiBjO1xuICAgICAgICBjb25zdCByMTIgPSB5ICogeiAqIG9uZU1pbnVzQ29zaW5lICsgeCAqIHM7XG4gICAgICAgIGNvbnN0IHIyMCA9IHggKiB6ICogb25lTWludXNDb3NpbmUgKyB5ICogcztcbiAgICAgICAgY29uc3QgcjIxID0geSAqIHogKiBvbmVNaW51c0Nvc2luZSAtIHggKiBzO1xuICAgICAgICBjb25zdCByMjIgPSB6eiArICgxIC0genopICogYztcbiAgICAgICAgY29uc3QgbTAwID0gbVswXTtcbiAgICAgICAgY29uc3QgbTAxID0gbVsxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbVsyXTtcbiAgICAgICAgY29uc3QgbTAzID0gbVszXTtcbiAgICAgICAgY29uc3QgbTEwID0gbVs0XTtcbiAgICAgICAgY29uc3QgbTExID0gbVs1XTtcbiAgICAgICAgY29uc3QgbTEyID0gbVs2XTtcbiAgICAgICAgY29uc3QgbTEzID0gbVs3XTtcbiAgICAgICAgY29uc3QgbTIwID0gbVs4XTtcbiAgICAgICAgY29uc3QgbTIxID0gbVs5XTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsxMF07XG4gICAgICAgIGNvbnN0IG0yMyA9IG1bMTFdO1xuICAgICAgICBuZXdEc3RbMF0gPSByMDAgKiBtMDAgKyByMDEgKiBtMTAgKyByMDIgKiBtMjA7XG4gICAgICAgIG5ld0RzdFsxXSA9IHIwMCAqIG0wMSArIHIwMSAqIG0xMSArIHIwMiAqIG0yMTtcbiAgICAgICAgbmV3RHN0WzJdID0gcjAwICogbTAyICsgcjAxICogbTEyICsgcjAyICogbTIyO1xuICAgICAgICBuZXdEc3RbM10gPSByMDAgKiBtMDMgKyByMDEgKiBtMTMgKyByMDIgKiBtMjM7XG4gICAgICAgIG5ld0RzdFs0XSA9IHIxMCAqIG0wMCArIHIxMSAqIG0xMCArIHIxMiAqIG0yMDtcbiAgICAgICAgbmV3RHN0WzVdID0gcjEwICogbTAxICsgcjExICogbTExICsgcjEyICogbTIxO1xuICAgICAgICBuZXdEc3RbNl0gPSByMTAgKiBtMDIgKyByMTEgKiBtMTIgKyByMTIgKiBtMjI7XG4gICAgICAgIG5ld0RzdFs3XSA9IHIxMCAqIG0wMyArIHIxMSAqIG0xMyArIHIxMiAqIG0yMztcbiAgICAgICAgbmV3RHN0WzhdID0gcjIwICogbTAwICsgcjIxICogbTEwICsgcjIyICogbTIwO1xuICAgICAgICBuZXdEc3RbOV0gPSByMjAgKiBtMDEgKyByMjEgKiBtMTEgKyByMjIgKiBtMjE7XG4gICAgICAgIG5ld0RzdFsxMF0gPSByMjAgKiBtMDIgKyByMjEgKiBtMTIgKyByMjIgKiBtMjI7XG4gICAgICAgIG5ld0RzdFsxMV0gPSByMjAgKiBtMDMgKyByMjEgKiBtMTMgKyByMjIgKiBtMjM7XG4gICAgICAgIGlmIChtICE9PSBuZXdEc3QpIHtcbiAgICAgICAgICAgIG5ld0RzdFsxMl0gPSBtWzEyXTtcbiAgICAgICAgICAgIG5ld0RzdFsxM10gPSBtWzEzXTtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSBtWzE0XTtcbiAgICAgICAgICAgIG5ld0RzdFsxNV0gPSBtWzE1XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIHRoZSBnaXZlbiA0LWJ5LTQgbWF0cml4IGFyb3VuZCB0aGUgZ2l2ZW4gYXhpcyBieSB0aGVcbiAgICAgKiBnaXZlbiBhbmdsZS4gKHNhbWUgYXMgcm90YXRlKVxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYXhpcyAtIFRoZSBheGlzXG4gICAgICogICAgIGFib3V0IHdoaWNoIHRvIHJvdGF0ZS5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBjb25zdCByb3RhdGUgPSBheGlzUm90YXRlO1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSA0LWJ5LTQgbWF0cml4IHdoaWNoIHNjYWxlcyBpbiBlYWNoIGRpbWVuc2lvbiBieSBhbiBhbW91bnQgZ2l2ZW4gYnlcbiAgICAgKiB0aGUgY29ycmVzcG9uZGluZyBlbnRyeSBpbiB0aGUgZ2l2ZW4gdmVjdG9yOyBhc3N1bWVzIHRoZSB2ZWN0b3IgaGFzIHRocmVlXG4gICAgICogZW50cmllcy5cbiAgICAgKiBAcGFyYW0gdiAtIEEgdmVjdG9yIG9mXG4gICAgICogICAgIHRocmVlIGVudHJpZXMgc3BlY2lmeWluZyB0aGUgZmFjdG9yIGJ5IHdoaWNoIHRvIHNjYWxlIGluIGVhY2ggZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxpbmcgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNjYWxpbmcodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gdlsxXTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IHZbMl07XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNF0gPSAwO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2NhbGVzIHRoZSBnaXZlbiA0LWJ5LTQgbWF0cml4IGluIGVhY2ggZGltZW5zaW9uIGJ5IGFuIGFtb3VudFxuICAgICAqIGdpdmVuIGJ5IHRoZSBjb3JyZXNwb25kaW5nIGVudHJ5IGluIHRoZSBnaXZlbiB2ZWN0b3I7IGFzc3VtZXMgdGhlIHZlY3RvciBoYXNcbiAgICAgKiB0aHJlZSBlbnRyaWVzLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeCB0byBiZSBtb2RpZmllZC5cbiAgICAgKiBAcGFyYW0gdiAtIEEgdmVjdG9yIG9mIHRocmVlIGVudHJpZXMgc3BlY2lmeWluZyB0aGVcbiAgICAgKiAgICAgZmFjdG9yIGJ5IHdoaWNoIHRvIHNjYWxlIGluIGVhY2ggZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2NhbGUobSwgdiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHYyID0gdlsyXTtcbiAgICAgICAgbmV3RHN0WzBdID0gdjAgKiBtWzAgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHYwICogbVswICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbMl0gPSB2MCAqIG1bMCAqIDQgKyAyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gdjAgKiBtWzAgKiA0ICsgM107XG4gICAgICAgIG5ld0RzdFs0XSA9IHYxICogbVsxICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbNV0gPSB2MSAqIG1bMSAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzZdID0gdjEgKiBtWzEgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFs3XSA9IHYxICogbVsxICogNCArIDNdO1xuICAgICAgICBuZXdEc3RbOF0gPSB2MiAqIG1bMiAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzldID0gdjIgKiBtWzIgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSB2MiAqIG1bMiAqIDQgKyAyXTtcbiAgICAgICAgbmV3RHN0WzExXSA9IHYyICogbVsyICogNCArIDNdO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbMTJdID0gbVsxMl07XG4gICAgICAgICAgICBuZXdEc3RbMTNdID0gbVsxM107XG4gICAgICAgICAgICBuZXdEc3RbMTRdID0gbVsxNF07XG4gICAgICAgICAgICBuZXdEc3RbMTVdID0gbVsxNV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDQtYnktNCBtYXRyaXggd2hpY2ggc2NhbGVzIGEgdW5pZm9ybSBhbW91bnQgaW4gZWFjaCBkaW1lbnNpb24uXG4gICAgICogQHBhcmFtIHMgLSB0aGUgYW1vdW50IHRvIHNjYWxlXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGluZyBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5pZm9ybVNjYWxpbmcocywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gcztcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gcztcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IHM7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNF0gPSAwO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2NhbGVzIHRoZSBnaXZlbiA0LWJ5LTQgbWF0cml4IGluIGVhY2ggZGltZW5zaW9uIGJ5IGEgdW5pZm9ybSBzY2FsZS5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXggdG8gYmUgbW9kaWZpZWQuXG4gICAgICogQHBhcmFtIHMgLSBUaGUgYW1vdW50IHRvIHNjYWxlLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5pZm9ybVNjYWxlKG0sIHMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHMgKiBtWzAgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHMgKiBtWzAgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHMgKiBtWzAgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFszXSA9IHMgKiBtWzAgKiA0ICsgM107XG4gICAgICAgIG5ld0RzdFs0XSA9IHMgKiBtWzEgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFs1XSA9IHMgKiBtWzEgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFs2XSA9IHMgKiBtWzEgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFs3XSA9IHMgKiBtWzEgKiA0ICsgM107XG4gICAgICAgIG5ld0RzdFs4XSA9IHMgKiBtWzIgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFs5XSA9IHMgKiBtWzIgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSBzICogbVsyICogNCArIDJdO1xuICAgICAgICBuZXdEc3RbMTFdID0gcyAqIG1bMiAqIDQgKyAzXTtcbiAgICAgICAgaWYgKG0gIT09IG5ld0RzdCkge1xuICAgICAgICAgICAgbmV3RHN0WzEyXSA9IG1bMTJdO1xuICAgICAgICAgICAgbmV3RHN0WzEzXSA9IG1bMTNdO1xuICAgICAgICAgICAgbmV3RHN0WzE0XSA9IG1bMTRdO1xuICAgICAgICAgICAgbmV3RHN0WzE1XSA9IG1bMTVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZSxcbiAgICAgICAgc2V0LFxuICAgICAgICBmcm9tTWF0MyxcbiAgICAgICAgZnJvbVF1YXQsXG4gICAgICAgIG5lZ2F0ZSxcbiAgICAgICAgY29weSxcbiAgICAgICAgY2xvbmUsXG4gICAgICAgIGVxdWFsc0FwcHJveGltYXRlbHksXG4gICAgICAgIGVxdWFscyxcbiAgICAgICAgaWRlbnRpdHksXG4gICAgICAgIHRyYW5zcG9zZSxcbiAgICAgICAgaW52ZXJzZSxcbiAgICAgICAgZGV0ZXJtaW5hbnQsXG4gICAgICAgIGludmVydCxcbiAgICAgICAgbXVsdGlwbHksXG4gICAgICAgIG11bCxcbiAgICAgICAgc2V0VHJhbnNsYXRpb24sXG4gICAgICAgIGdldFRyYW5zbGF0aW9uLFxuICAgICAgICBnZXRBeGlzLFxuICAgICAgICBzZXRBeGlzLFxuICAgICAgICBnZXRTY2FsaW5nLFxuICAgICAgICBwZXJzcGVjdGl2ZSxcbiAgICAgICAgcGVyc3BlY3RpdmVSZXZlcnNlWixcbiAgICAgICAgb3J0aG8sXG4gICAgICAgIGZydXN0dW0sXG4gICAgICAgIGZydXN0dW1SZXZlcnNlWixcbiAgICAgICAgYWltLFxuICAgICAgICBjYW1lcmFBaW0sXG4gICAgICAgIGxvb2tBdCxcbiAgICAgICAgdHJhbnNsYXRpb24sXG4gICAgICAgIHRyYW5zbGF0ZSxcbiAgICAgICAgcm90YXRpb25YLFxuICAgICAgICByb3RhdGVYLFxuICAgICAgICByb3RhdGlvblksXG4gICAgICAgIHJvdGF0ZVksXG4gICAgICAgIHJvdGF0aW9uWixcbiAgICAgICAgcm90YXRlWixcbiAgICAgICAgYXhpc1JvdGF0aW9uLFxuICAgICAgICByb3RhdGlvbixcbiAgICAgICAgYXhpc1JvdGF0ZSxcbiAgICAgICAgcm90YXRlLFxuICAgICAgICBzY2FsaW5nLFxuICAgICAgICBzY2FsZSxcbiAgICAgICAgdW5pZm9ybVNjYWxpbmcsXG4gICAgICAgIHVuaWZvcm1TY2FsZSxcbiAgICB9O1xufVxuY29uc3QgY2FjaGUkMiA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldEFQSSQyKEN0b3IpIHtcbiAgICBsZXQgYXBpID0gY2FjaGUkMi5nZXQoQ3Rvcik7XG4gICAgaWYgKCFhcGkpIHtcbiAgICAgICAgYXBpID0gZ2V0QVBJSW1wbCQyKEN0b3IpO1xuICAgICAgICBjYWNoZSQyLnNldChDdG9yLCBhcGkpO1xuICAgIH1cbiAgICByZXR1cm4gYXBpO1xufVxuXG4vKlxuICogQ29weXJpZ2h0IDIwMjIgR3JlZ2cgVGF2YXJlc1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4gKiBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksXG4gKiB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4gKiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSxcbiAqIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuICogU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTExcbiAqIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICogRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuICogREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4vKipcbiAqIEdlbmVyYXRlcyBhbSB0eXBlZCBBUEkgZm9yIFF1ZFxuICogKi9cbmZ1bmN0aW9uIGdldEFQSUltcGwkMShDdG9yKSB7XG4gICAgY29uc3QgdmVjMyA9IGdldEFQSSQ0KEN0b3IpO1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBxdWF0NDsgbWF5IGJlIGNhbGxlZCB3aXRoIHgsIHksIHogdG8gc2V0IGluaXRpYWwgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB4IC0gSW5pdGlhbCB4IHZhbHVlLlxuICAgICAqIEBwYXJhbSB5IC0gSW5pdGlhbCB5IHZhbHVlLlxuICAgICAqIEBwYXJhbSB6IC0gSW5pdGlhbCB6IHZhbHVlLlxuICAgICAqIEBwYXJhbSB3IC0gSW5pdGlhbCB3IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHRoZSBjcmVhdGVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZSh4LCB5LCB6LCB3KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IG5ldyBDdG9yKDQpO1xuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSB4O1xuICAgICAgICAgICAgaWYgKHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5ld0RzdFsxXSA9IHk7XG4gICAgICAgICAgICAgICAgaWYgKHogIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdEc3RbMl0gPSB6O1xuICAgICAgICAgICAgICAgICAgICBpZiAodyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbM10gPSB3O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBRdWF0OyBtYXkgYmUgY2FsbGVkIHdpdGggeCwgeSwgeiB0byBzZXQgaW5pdGlhbCB2YWx1ZXMuIChzYW1lIGFzIGNyZWF0ZSlcbiAgICAgKiBAcGFyYW0geCAtIEluaXRpYWwgeCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geSAtIEluaXRpYWwgeSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geiAtIEluaXRpYWwgeiB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geiAtIEluaXRpYWwgdyB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyB0aGUgY3JlYXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBjb25zdCBmcm9tVmFsdWVzID0gY3JlYXRlO1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBhIFF1YXRcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgcXVhdC5jcmVhdGV9IGFuZCB7QGxpbmsgcXVhdC5jb3B5fVxuICAgICAqXG4gICAgICogQHBhcmFtIHggZmlyc3QgdmFsdWVcbiAgICAgKiBAcGFyYW0geSBzZWNvbmQgdmFsdWVcbiAgICAgKiBAcGFyYW0geiB0aGlyZCB2YWx1ZVxuICAgICAqIEBwYXJhbSB3IGZvdXJ0aCB2YWx1ZVxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3Igd2l0aCBpdHMgZWxlbWVudHMgc2V0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldCh4LCB5LCB6LCB3LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHg7XG4gICAgICAgIG5ld0RzdFsxXSA9IHk7XG4gICAgICAgIG5ld0RzdFsyXSA9IHo7XG4gICAgICAgIG5ld0RzdFszXSA9IHc7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSBxdWF0ZXJuaW9uIGZyb20gdGhlIGdpdmVuIGFuZ2xlIGFuZCAgYXhpcyxcbiAgICAgKiB0aGVuIHJldHVybnMgaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXhpcyAtIHRoZSBheGlzIHRvIHJvdGF0ZSBhcm91bmRcbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSB0aGUgYW5nbGVcbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcXVhdGVybmlvbiB0aGF0IHJlcHJlc2VudHMgdGhlIGdpdmVuIGF4aXMgYW5kIGFuZ2xlXG4gICAgICoqL1xuICAgIGZ1bmN0aW9uIGZyb21BeGlzQW5nbGUoYXhpcywgYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgY29uc3QgaGFsZkFuZ2xlID0gYW5nbGVJblJhZGlhbnMgKiAwLjU7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihoYWxmQW5nbGUpO1xuICAgICAgICBuZXdEc3RbMF0gPSBzICogYXhpc1swXTtcbiAgICAgICAgbmV3RHN0WzFdID0gcyAqIGF4aXNbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHMgKiBheGlzWzJdO1xuICAgICAgICBuZXdEc3RbM10gPSBNYXRoLmNvcyhoYWxmQW5nbGUpO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSByb3RhdGlvbiBheGlzIGFuZCBhbmdsZVxuICAgICAqIEBwYXJhbSBxIC0gcXVhdGVybmlvbiB0byBjb21wdXRlIGZyb21cbiAgICAgKiBAcGFyYW0gZHN0IC0gVmVjMyB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJuIGFuZ2xlIGFuZCBheGlzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG9BeGlzQW5nbGUocSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gdmVjMy5jcmVhdGUoMykpO1xuICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYWNvcyhxWzNdKSAqIDI7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZSAqIDAuNSk7XG4gICAgICAgIGlmIChzID4gRVBTSUxPTikge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gcVswXSAvIHM7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSBxWzFdIC8gcztcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IHFbMl0gLyBzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gMTtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGFuZ2xlLCBheGlzOiBuZXdEc3QgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYW5nbGUgaW4gZGVncmVlcyBiZXR3ZWVuIHR3byByb3RhdGlvbnMgYSBhbmQgYi5cbiAgICAgKiBAcGFyYW0gYSAtIHF1YXRlcm5pb24gYVxuICAgICAqIEBwYXJhbSBiIC0gcXVhdGVybmlvbiBiXG4gICAgICogQHJldHVybiBhbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdGhlIHR3byBxdWF0ZXJuaW9uc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFuZ2xlKGEsIGIpIHtcbiAgICAgICAgY29uc3QgZCA9IGRvdChhLCBiKTtcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcygyICogZCAqIGQgLSAxKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyB0d28gcXVhdGVybmlvbnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIC0gdGhlIGZpcnN0IHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0gYiAtIHRoZSBzZWNvbmQgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgcXVhdGVybmlvbiB0aGF0IGlzIHRoZSByZXN1bHQgb2YgYSAqIGJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtdWx0aXBseShhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IGF4ID0gYVswXTtcbiAgICAgICAgY29uc3QgYXkgPSBhWzFdO1xuICAgICAgICBjb25zdCBheiA9IGFbMl07XG4gICAgICAgIGNvbnN0IGF3ID0gYVszXTtcbiAgICAgICAgY29uc3QgYnggPSBiWzBdO1xuICAgICAgICBjb25zdCBieSA9IGJbMV07XG4gICAgICAgIGNvbnN0IGJ6ID0gYlsyXTtcbiAgICAgICAgY29uc3QgYncgPSBiWzNdO1xuICAgICAgICBuZXdEc3RbMF0gPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5O1xuICAgICAgICBuZXdEc3RbMV0gPSBheSAqIGJ3ICsgYXcgKiBieSArIGF6ICogYnggLSBheCAqIGJ6O1xuICAgICAgICBuZXdEc3RbMl0gPSBheiAqIGJ3ICsgYXcgKiBieiArIGF4ICogYnkgLSBheSAqIGJ4O1xuICAgICAgICBuZXdEc3RbM10gPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIHR3byBxdWF0ZXJuaW9uc1xuICAgICAqXG4gICAgICogQHBhcmFtIGEgLSB0aGUgZmlyc3QgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSBiIC0gdGhlIHNlY29uZCBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBxdWF0ZXJuaW9uIHRoYXQgaXMgdGhlIHJlc3VsdCBvZiBhICogYlxuICAgICAqL1xuICAgIGNvbnN0IG11bCA9IG11bHRpcGx5O1xuICAgIC8qKlxuICAgICAqIFJvdGF0ZXMgdGhlIGdpdmVuIHF1YXRlcm5pb24gYXJvdW5kIHRoZSBYIGF4aXMgYnkgdGhlIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBxIC0gcXVhdGVybmlvbiB0byByb3RhdGVcbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBxdWF0ZXJuaW9uIHRoYXQgaXMgdGhlIHJlc3VsdCBvZiBhICogYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0ZVgocSwgYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgY29uc3QgaGFsZkFuZ2xlID0gYW5nbGVJblJhZGlhbnMgKiAwLjU7XG4gICAgICAgIGNvbnN0IHF4ID0gcVswXTtcbiAgICAgICAgY29uc3QgcXkgPSBxWzFdO1xuICAgICAgICBjb25zdCBxeiA9IHFbMl07XG4gICAgICAgIGNvbnN0IHF3ID0gcVszXTtcbiAgICAgICAgY29uc3QgYnggPSBNYXRoLnNpbihoYWxmQW5nbGUpO1xuICAgICAgICBjb25zdCBidyA9IE1hdGguY29zKGhhbGZBbmdsZSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHF4ICogYncgKyBxdyAqIGJ4O1xuICAgICAgICBuZXdEc3RbMV0gPSBxeSAqIGJ3ICsgcXogKiBieDtcbiAgICAgICAgbmV3RHN0WzJdID0gcXogKiBidyAtIHF5ICogYng7XG4gICAgICAgIG5ld0RzdFszXSA9IHF3ICogYncgLSBxeCAqIGJ4O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIHRoZSBnaXZlbiBxdWF0ZXJuaW9uIGFyb3VuZCB0aGUgWSBheGlzIGJ5IHRoZSBnaXZlbiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gcSAtIHF1YXRlcm5pb24gdG8gcm90YXRlXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgcXVhdGVybmlvbiB0aGF0IGlzIHRoZSByZXN1bHQgb2YgYSAqIGJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGVZKHEsIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IGhhbGZBbmdsZSA9IGFuZ2xlSW5SYWRpYW5zICogMC41O1xuICAgICAgICBjb25zdCBxeCA9IHFbMF07XG4gICAgICAgIGNvbnN0IHF5ID0gcVsxXTtcbiAgICAgICAgY29uc3QgcXogPSBxWzJdO1xuICAgICAgICBjb25zdCBxdyA9IHFbM107XG4gICAgICAgIGNvbnN0IGJ5ID0gTWF0aC5zaW4oaGFsZkFuZ2xlKTtcbiAgICAgICAgY29uc3QgYncgPSBNYXRoLmNvcyhoYWxmQW5nbGUpO1xuICAgICAgICBuZXdEc3RbMF0gPSBxeCAqIGJ3IC0gcXogKiBieTtcbiAgICAgICAgbmV3RHN0WzFdID0gcXkgKiBidyArIHF3ICogYnk7XG4gICAgICAgIG5ld0RzdFsyXSA9IHF6ICogYncgKyBxeCAqIGJ5O1xuICAgICAgICBuZXdEc3RbM10gPSBxdyAqIGJ3IC0gcXkgKiBieTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gcXVhdGVybmlvbiBhcm91bmQgdGhlIFogYXhpcyBieSB0aGUgZ2l2ZW4gYW5nbGUuXG4gICAgICogQHBhcmFtIHEgLSBxdWF0ZXJuaW9uIHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGVcbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHF1YXRlcm5pb24gdGhhdCBpcyB0aGUgcmVzdWx0IG9mIGEgKiBiXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlWihxLCBhbmdsZUluUmFkaWFucywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBjb25zdCBoYWxmQW5nbGUgPSBhbmdsZUluUmFkaWFucyAqIDAuNTtcbiAgICAgICAgY29uc3QgcXggPSBxWzBdO1xuICAgICAgICBjb25zdCBxeSA9IHFbMV07XG4gICAgICAgIGNvbnN0IHF6ID0gcVsyXTtcbiAgICAgICAgY29uc3QgcXcgPSBxWzNdO1xuICAgICAgICBjb25zdCBieiA9IE1hdGguc2luKGhhbGZBbmdsZSk7XG4gICAgICAgIGNvbnN0IGJ3ID0gTWF0aC5jb3MoaGFsZkFuZ2xlKTtcbiAgICAgICAgbmV3RHN0WzBdID0gcXggKiBidyArIHF5ICogYno7XG4gICAgICAgIG5ld0RzdFsxXSA9IHF5ICogYncgLSBxeCAqIGJ6O1xuICAgICAgICBuZXdEc3RbMl0gPSBxeiAqIGJ3ICsgcXcgKiBiejtcbiAgICAgICAgbmV3RHN0WzNdID0gcXcgKiBidyAtIHF6ICogYno7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNwaGVyaWNhbGx5IGxpbmVhciBpbnRlcnBvbGF0ZSBiZXR3ZWVuIHR3byBxdWF0ZXJuaW9uc1xuICAgICAqXG4gICAgICogQHBhcmFtIGEgLSBzdGFydGluZyB2YWx1ZVxuICAgICAqIEBwYXJhbSBiIC0gZW5kaW5nIHZhbHVlXG4gICAgICogQHBhcmFtIHQgLSB2YWx1ZSB3aGVyZSAwID0gYSBhbmQgMSA9IGJcbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHF1YXRlcm5pb24gdGhhdCBpcyB0aGUgcmVzdWx0IG9mIGEgKiBiXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2xlcnAoYSwgYiwgdCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBjb25zdCBheCA9IGFbMF07XG4gICAgICAgIGNvbnN0IGF5ID0gYVsxXTtcbiAgICAgICAgY29uc3QgYXogPSBhWzJdO1xuICAgICAgICBjb25zdCBhdyA9IGFbM107XG4gICAgICAgIGxldCBieCA9IGJbMF07XG4gICAgICAgIGxldCBieSA9IGJbMV07XG4gICAgICAgIGxldCBieiA9IGJbMl07XG4gICAgICAgIGxldCBidyA9IGJbM107XG4gICAgICAgIGxldCBjb3NPbWVnYSA9IGF4ICogYnggKyBheSAqIGJ5ICsgYXogKiBieiArIGF3ICogYnc7XG4gICAgICAgIGlmIChjb3NPbWVnYSA8IDApIHtcbiAgICAgICAgICAgIGNvc09tZWdhID0gLWNvc09tZWdhO1xuICAgICAgICAgICAgYnggPSAtYng7XG4gICAgICAgICAgICBieSA9IC1ieTtcbiAgICAgICAgICAgIGJ6ID0gLWJ6O1xuICAgICAgICAgICAgYncgPSAtYnc7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNjYWxlMDtcbiAgICAgICAgbGV0IHNjYWxlMTtcbiAgICAgICAgaWYgKDEuMCAtIGNvc09tZWdhID4gRVBTSUxPTikge1xuICAgICAgICAgICAgY29uc3Qgb21lZ2EgPSBNYXRoLmFjb3MoY29zT21lZ2EpO1xuICAgICAgICAgICAgY29uc3Qgc2luT21lZ2EgPSBNYXRoLnNpbihvbWVnYSk7XG4gICAgICAgICAgICBzY2FsZTAgPSBNYXRoLnNpbigoMSAtIHQpICogb21lZ2EpIC8gc2luT21lZ2E7XG4gICAgICAgICAgICBzY2FsZTEgPSBNYXRoLnNpbih0ICogb21lZ2EpIC8gc2luT21lZ2E7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzY2FsZTAgPSAxLjAgLSB0O1xuICAgICAgICAgICAgc2NhbGUxID0gdDtcbiAgICAgICAgfVxuICAgICAgICBuZXdEc3RbMF0gPSBzY2FsZTAgKiBheCArIHNjYWxlMSAqIGJ4O1xuICAgICAgICBuZXdEc3RbMV0gPSBzY2FsZTAgKiBheSArIHNjYWxlMSAqIGJ5O1xuICAgICAgICBuZXdEc3RbMl0gPSBzY2FsZTAgKiBheiArIHNjYWxlMSAqIGJ6O1xuICAgICAgICBuZXdEc3RbM10gPSBzY2FsZTAgKiBhdyArIHNjYWxlMSAqIGJ3O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIHRoZSBpbnZlcnNlIG9mIGEgcXVhdGVybmlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHEgLSBxdWF0ZXJuaW9uIHRvIGNvbXB1dGUgdGhlIGludmVyc2Ugb2ZcbiAgICAgKiBAcmV0dXJucyBBIHF1YXRlcm5pb24gdGhhdCBpcyB0aGUgcmVzdWx0IG9mIGEgKiBiXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52ZXJzZShxLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IGEwID0gcVswXTtcbiAgICAgICAgY29uc3QgYTEgPSBxWzFdO1xuICAgICAgICBjb25zdCBhMiA9IHFbMl07XG4gICAgICAgIGNvbnN0IGEzID0gcVszXTtcbiAgICAgICAgY29uc3QgZG90ID0gYTAgKiBhMCArIGExICogYTEgKyBhMiAqIGEyICsgYTMgKiBhMztcbiAgICAgICAgY29uc3QgaW52RG90ID0gZG90ID8gMSAvIGRvdCA6IDA7XG4gICAgICAgIG5ld0RzdFswXSA9IC1hMCAqIGludkRvdDtcbiAgICAgICAgbmV3RHN0WzFdID0gLWExICogaW52RG90O1xuICAgICAgICBuZXdEc3RbMl0gPSAtYTIgKiBpbnZEb3Q7XG4gICAgICAgIG5ld0RzdFszXSA9IGEzICogaW52RG90O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIHRoZSBjb25qdWdhdGUgb2YgYSBxdWF0ZXJuaW9uXG4gICAgICogRm9yIHF1YXRlcm5pb25zIHdpdGggYSBtYWduaXR1ZGUgb2YgMSAoYSB1bml0IHF1YXRlcm5pb24pXG4gICAgICogdGhpcyByZXR1cm5zIHRoZSBzYW1lIGFzIHRoZSBpbnZlcnNlIGJ1dCBpcyBmYXN0ZXIgdG8gY2FsY3VsYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHEgLSBxdWF0ZXJuaW9uIHRvIGNvbXB1dGUgdGhlIGNvbmp1Z2F0ZSBvZi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgY29uanVnYXRlIG9mIHFcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb25qdWdhdGUocSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSAtcVswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gLXFbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IC1xWzJdO1xuICAgICAgICBuZXdEc3RbM10gPSBxWzNdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgcXVhdGVybmlvbiBmcm9tIHRoZSBnaXZlbiByb3RhdGlvbiBtYXRyaXguXG4gICAgICpcbiAgICAgKiBUaGUgY3JlYXRlZCBxdWF0ZXJuaW9uIGlzIG5vdCBub3JtYWxpemVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIG0gLSByb3RhdGlvbiBtYXRyaXhcbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZnJvbU1hdChtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIC8qXG4gICAgICAgIDAgMSAyXG4gICAgICAgIDMgNCA1XG4gICAgICAgIDYgNyA4XG4gICAgICBcbiAgICAgICAgMCAxIDJcbiAgICAgICAgNCA1IDZcbiAgICAgICAgOCA5IDEwXG4gICAgICAgICAqL1xuICAgICAgICAvLyBBbGdvcml0aG0gaW4gS2VuIFNob2VtYWtlJ3MgYXJ0aWNsZSBpbiAxOTg3IFNJR0dSQVBIIGNvdXJzZSBub3Rlc1xuICAgICAgICAvLyBhcnRpY2xlIFwiUXVhdGVybmlvbiBDYWxjdWx1cyBhbmQgRmFzdCBBbmltYXRpb25cIi5cbiAgICAgICAgY29uc3QgdHJhY2UgPSBtWzBdICsgbVs1XSArIG1bMTBdO1xuICAgICAgICBpZiAodHJhY2UgPiAwLjApIHtcbiAgICAgICAgICAgIC8vIHx3fCA+IDEvMiwgbWF5IGFzIHdlbGwgY2hvb3NlIHcgPiAxLzJcbiAgICAgICAgICAgIGNvbnN0IHJvb3QgPSBNYXRoLnNxcnQodHJhY2UgKyAxKTsgLy8gMndcbiAgICAgICAgICAgIG5ld0RzdFszXSA9IDAuNSAqIHJvb3Q7XG4gICAgICAgICAgICBjb25zdCBpbnZSb290ID0gMC41IC8gcm9vdDsgLy8gMS8oNHcpXG4gICAgICAgICAgICBuZXdEc3RbMF0gPSAobVs2XSAtIG1bOV0pICogaW52Um9vdDtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IChtWzhdIC0gbVsyXSkgKiBpbnZSb290O1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gKG1bMV0gLSBtWzRdKSAqIGludlJvb3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB8d3wgPD0gMS8yXG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBpZiAobVs1XSA+IG1bMF0pIHtcbiAgICAgICAgICAgICAgICBpID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtWzEwXSA+IG1baSAqIDQgKyBpXSkge1xuICAgICAgICAgICAgICAgIGkgPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaiA9IChpICsgMSkgJSAzO1xuICAgICAgICAgICAgY29uc3QgayA9IChpICsgMikgJSAzO1xuICAgICAgICAgICAgY29uc3Qgcm9vdCA9IE1hdGguc3FydChtW2kgKiA0ICsgaV0gLSBtW2ogKiA0ICsgal0gLSBtW2sgKiA0ICsga10gKyAxLjApO1xuICAgICAgICAgICAgbmV3RHN0W2ldID0gMC41ICogcm9vdDtcbiAgICAgICAgICAgIGNvbnN0IGludlJvb3QgPSAwLjUgLyByb290O1xuICAgICAgICAgICAgbmV3RHN0WzNdID0gKG1baiAqIDQgKyBrXSAtIG1bayAqIDQgKyBqXSkgKiBpbnZSb290O1xuICAgICAgICAgICAgbmV3RHN0W2pdID0gKG1baiAqIDQgKyBpXSArIG1baSAqIDQgKyBqXSkgKiBpbnZSb290O1xuICAgICAgICAgICAgbmV3RHN0W2tdID0gKG1bayAqIDQgKyBpXSArIG1baSAqIDQgKyBrXSkgKiBpbnZSb290O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBxdWF0ZXJuaW9uIGZyb20gdGhlIGdpdmVuIGV1bGVyIGFuZ2xlIHgsIHksIHogdXNpbmcgdGhlIHByb3ZpZGVkIGludHJpbnNpYyBvcmRlciBmb3IgdGhlIGNvbnZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0geEFuZ2xlSW5SYWRpYW5zIC0gYW5nbGUgdG8gcm90YXRlIGFyb3VuZCBYIGF4aXMgaW4gcmFkaWFucy5cbiAgICAgKiBAcGFyYW0geUFuZ2xlSW5SYWRpYW5zIC0gYW5nbGUgdG8gcm90YXRlIGFyb3VuZCBZIGF4aXMgaW4gcmFkaWFucy5cbiAgICAgKiBAcGFyYW0gekFuZ2xlSW5SYWRpYW5zIC0gYW5nbGUgdG8gcm90YXRlIGFyb3VuZCBaIGF4aXMgaW4gcmFkaWFucy5cbiAgICAgKiBAcGFyYW0gb3JkZXIgLSBvcmRlciB0byBhcHBseSBldWxlciBhbmdsZXNcbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSBzYW1lIHJvdGF0aW9uIGFzIHRoZSBldWxlciBhbmdsZXMgYXBwbGllZCBpbiB0aGUgZ2l2ZW4gb3JkZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmcm9tRXVsZXIoeEFuZ2xlSW5SYWRpYW5zLCB5QW5nbGVJblJhZGlhbnMsIHpBbmdsZUluUmFkaWFucywgb3JkZXIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgY29uc3QgeEhhbGZBbmdsZSA9IHhBbmdsZUluUmFkaWFucyAqIDAuNTtcbiAgICAgICAgY29uc3QgeUhhbGZBbmdsZSA9IHlBbmdsZUluUmFkaWFucyAqIDAuNTtcbiAgICAgICAgY29uc3QgekhhbGZBbmdsZSA9IHpBbmdsZUluUmFkaWFucyAqIDAuNTtcbiAgICAgICAgY29uc3Qgc3ggPSBNYXRoLnNpbih4SGFsZkFuZ2xlKTtcbiAgICAgICAgY29uc3QgY3ggPSBNYXRoLmNvcyh4SGFsZkFuZ2xlKTtcbiAgICAgICAgY29uc3Qgc3kgPSBNYXRoLnNpbih5SGFsZkFuZ2xlKTtcbiAgICAgICAgY29uc3QgY3kgPSBNYXRoLmNvcyh5SGFsZkFuZ2xlKTtcbiAgICAgICAgY29uc3Qgc3ogPSBNYXRoLnNpbih6SGFsZkFuZ2xlKTtcbiAgICAgICAgY29uc3QgY3ogPSBNYXRoLmNvcyh6SGFsZkFuZ2xlKTtcbiAgICAgICAgc3dpdGNoIChvcmRlcikge1xuICAgICAgICAgICAgY2FzZSAneHl6JzpcbiAgICAgICAgICAgICAgICBuZXdEc3RbMF0gPSBzeCAqIGN5ICogY3ogKyBjeCAqIHN5ICogc3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzFdID0gY3ggKiBzeSAqIGN6IC0gc3ggKiBjeSAqIHN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFsyXSA9IGN4ICogY3kgKiBzeiArIHN4ICogc3kgKiBjejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbM10gPSBjeCAqIGN5ICogY3ogLSBzeCAqIHN5ICogc3o7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd4enknOlxuICAgICAgICAgICAgICAgIG5ld0RzdFswXSA9IHN4ICogY3kgKiBjeiAtIGN4ICogc3kgKiBzejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMV0gPSBjeCAqIHN5ICogY3ogLSBzeCAqIGN5ICogc3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzJdID0gY3ggKiBjeSAqIHN6ICsgc3ggKiBzeSAqIGN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFszXSA9IGN4ICogY3kgKiBjeiArIHN4ICogc3kgKiBzejtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3l4eic6XG4gICAgICAgICAgICAgICAgbmV3RHN0WzBdID0gc3ggKiBjeSAqIGN6ICsgY3ggKiBzeSAqIHN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFsxXSA9IGN4ICogc3kgKiBjeiAtIHN4ICogY3kgKiBzejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMl0gPSBjeCAqIGN5ICogc3ogLSBzeCAqIHN5ICogY3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzNdID0gY3ggKiBjeSAqIGN6ICsgc3ggKiBzeSAqIHN6O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAneXp4JzpcbiAgICAgICAgICAgICAgICBuZXdEc3RbMF0gPSBzeCAqIGN5ICogY3ogKyBjeCAqIHN5ICogc3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzFdID0gY3ggKiBzeSAqIGN6ICsgc3ggKiBjeSAqIHN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFsyXSA9IGN4ICogY3kgKiBzeiAtIHN4ICogc3kgKiBjejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbM10gPSBjeCAqIGN5ICogY3ogLSBzeCAqIHN5ICogc3o7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd6eHknOlxuICAgICAgICAgICAgICAgIG5ld0RzdFswXSA9IHN4ICogY3kgKiBjeiAtIGN4ICogc3kgKiBzejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMV0gPSBjeCAqIHN5ICogY3ogKyBzeCAqIGN5ICogc3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzJdID0gY3ggKiBjeSAqIHN6ICsgc3ggKiBzeSAqIGN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFszXSA9IGN4ICogY3kgKiBjeiAtIHN4ICogc3kgKiBzejtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3p5eCc6XG4gICAgICAgICAgICAgICAgbmV3RHN0WzBdID0gc3ggKiBjeSAqIGN6IC0gY3ggKiBzeSAqIHN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFsxXSA9IGN4ICogc3kgKiBjeiArIHN4ICogY3kgKiBzejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMl0gPSBjeCAqIGN5ICogc3ogLSBzeCAqIHN5ICogY3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzNdID0gY3ggKiBjeSAqIGN6ICsgc3ggKiBzeSAqIHN6O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcm90YXRpb24gb3JkZXI6ICR7b3JkZXJ9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29waWVzIGEgcXVhdGVybmlvbi4gKHNhbWUgYXMge0BsaW5rIHF1YXQuY2xvbmV9KVxuICAgICAqIEFsc28gc2VlIHtAbGluayBxdWF0LmNyZWF0ZX0gYW5kIHtAbGluayBxdWF0LnNldH1cbiAgICAgKiBAcGFyYW0gcSAtIFRoZSBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgcXVhdGVybmlvbiB0aGF0IGlzIGEgY29weSBvZiBxXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29weShxLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHFbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHFbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHFbMl07XG4gICAgICAgIG5ld0RzdFszXSA9IHFbM107XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsb25lcyBhIHF1YXRlcm5pb24uIChzYW1lIGFzIHtAbGluayBxdWF0LmNvcHl9KVxuICAgICAqIEFsc28gc2VlIHtAbGluayBxdWF0LmNyZWF0ZX0gYW5kIHtAbGluayBxdWF0LnNldH1cbiAgICAgKiBAcGFyYW0gcSAtIFRoZSBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgY29weSBvZiBxLlxuICAgICAqL1xuICAgIGNvbnN0IGNsb25lID0gY29weTtcbiAgICAvKipcbiAgICAgKiBBZGRzIHR3byBxdWF0ZXJuaW9uczsgYXNzdW1lcyBhIGFuZCBiIGhhdmUgdGhlIHNhbWUgZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgcXVhdGVybmlvbiB0aGF0IGlzIHRoZSBzdW0gb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGQoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSArIGJbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IGFbMl0gKyBiWzJdO1xuICAgICAgICBuZXdEc3RbM10gPSBhWzNdICsgYlszXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIHR3byBxdWF0ZXJuaW9ucy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHF1YXRlcm5pb24gdGhhdCBpcyB0aGUgZGlmZmVyZW5jZSBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSAtIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdIC0gYlsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gYVszXSAtIGJbM107XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0d28gcXVhdGVybmlvbnMuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHF1YXRlcm5pb24uXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHF1YXRlcm5pb24uXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBxdWF0ZXJuaW9uIHRoYXQgaXMgdGhlIGRpZmZlcmVuY2Ugb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBjb25zdCBzdWIgPSBzdWJ0cmFjdDtcbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgcXVhdGVybmlvbiBieSBhIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBrIC0gVGhlIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGVkIHF1YXRlcm5pb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsU2NhbGFyKHYsIGssIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXSAqIGs7XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV0gKiBrO1xuICAgICAgICBuZXdEc3RbMl0gPSB2WzJdICogaztcbiAgICAgICAgbmV3RHN0WzNdID0gdlszXSAqIGs7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgYSBxdWF0ZXJuaW9uIGJ5IGEgc2NhbGFyLiAoc2FtZSBhcyBtdWxTY2FsYXIpXG4gICAgICogQHBhcmFtIHYgLSBUaGUgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gayAtIFRoZSBzY2FsYXIuXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCBxdWF0ZXJuaW9uLlxuICAgICAqL1xuICAgIGNvbnN0IHNjYWxlID0gbXVsU2NhbGFyO1xuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBrIC0gVGhlIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGVkIHF1YXRlcm5pb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2U2NhbGFyKHYsIGssIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXSAvIGs7XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV0gLyBrO1xuICAgICAgICBuZXdEc3RbMl0gPSB2WzJdIC8gaztcbiAgICAgICAgbmV3RHN0WzNdID0gdlszXSAvIGs7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gcXVhdGVybmlvbnNcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcmV0dXJucyBkb3QgcHJvZHVjdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvdChhLCBiKSB7XG4gICAgICAgIHJldHVybiAoYVswXSAqIGJbMF0pICsgKGFbMV0gKiBiWzFdKSArIChhWzJdICogYlsyXSkgKyAoYVszXSAqIGJbM10pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBsaW5lYXIgaW50ZXJwb2xhdGlvbiBvbiB0d28gcXVhdGVybmlvbnMuXG4gICAgICogR2l2ZW4gcXVhdGVybmlvbnMgYSBhbmQgYiBhbmQgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudCB0LCByZXR1cm5zXG4gICAgICogYSArIHQgKiAoYiAtIGEpLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSB0IC0gSW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbGluZWFyIGludGVycG9sYXRlZCByZXN1bHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVycChhLCBiLCB0LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyB0ICogKGJbMF0gLSBhWzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSArIHQgKiAoYlsxXSAtIGFbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdICsgdCAqIChiWzJdIC0gYVsyXSk7XG4gICAgICAgIG5ld0RzdFszXSA9IGFbM10gKyB0ICogKGJbM10gLSBhWzNdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGxlbmd0aCBvZiBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIHYgLSBxdWF0ZXJuaW9uLlxuICAgICAqIEByZXR1cm5zIGxlbmd0aCBvZiBxdWF0ZXJuaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlbmd0aCh2KSB7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIGNvbnN0IHYzID0gdlszXTtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh2MCAqIHYwICsgdjEgKiB2MSArIHYyICogdjIgKyB2MyAqIHYzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGxlbmd0aCBvZiBxdWF0ZXJuaW9uIChzYW1lIGFzIGxlbmd0aClcbiAgICAgKiBAcGFyYW0gdiAtIHF1YXRlcm5pb24uXG4gICAgICogQHJldHVybnMgbGVuZ3RoIG9mIHF1YXRlcm5pb24uXG4gICAgICovXG4gICAgY29uc3QgbGVuID0gbGVuZ3RoO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIHYgLSBxdWF0ZXJuaW9uLlxuICAgICAqIEByZXR1cm5zIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHF1YXRlcm5pb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVuZ3RoU3Eodikge1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgY29uc3QgdjIgPSB2WzJdO1xuICAgICAgICBjb25zdCB2MyA9IHZbM107XG4gICAgICAgIHJldHVybiB2MCAqIHYwICsgdjEgKiB2MSArIHYyICogdjIgKyB2MyAqIHYzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgcXVhdGVybmlvbiAoc2FtZSBhcyBsZW5ndGhTcSlcbiAgICAgKiBAcGFyYW0gdiAtIHF1YXRlcm5pb24uXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgcXVhdGVybmlvbi5cbiAgICAgKi9cbiAgICBjb25zdCBsZW5TcSA9IGxlbmd0aFNxO1xuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSBxdWF0ZXJuaW9uIGJ5IGl0cyBFdWNsaWRlYW4gbGVuZ3RoIGFuZCByZXR1cm5zIHRoZSBxdW90aWVudC5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBub3JtYWxpemVkIHF1YXRlcm5pb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHYyID0gdlsyXTtcbiAgICAgICAgY29uc3QgdjMgPSB2WzNdO1xuICAgICAgICBjb25zdCBsZW4gPSBNYXRoLnNxcnQodjAgKiB2MCArIHYxICogdjEgKyB2MiAqIHYyICsgdjMgKiB2Myk7XG4gICAgICAgIGlmIChsZW4gPiAwLjAwMDAxKSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSB2MCAvIGxlbjtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IHYxIC8gbGVuO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gdjIgLyBsZW47XG4gICAgICAgICAgICBuZXdEc3RbM10gPSB2MyAvIGxlbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgICAgIG5ld0RzdFszXSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgMiBxdWF0ZXJuaW9ucyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbFxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCBxdWF0ZXJuaW9uLlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgcXVhdGVybmlvbnMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlcXVhbHNBcHByb3hpbWF0ZWx5KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGFbMF0gLSBiWzBdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMV0gLSBiWzFdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMl0gLSBiWzJdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbM10gLSBiWzNdKSA8IEVQU0lMT047XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIDIgcXVhdGVybmlvbnMgYXJlIGV4YWN0bHkgZXF1YWxcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHF1YXRlcm5pb25zIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGFbMF0gPT09IGJbMF0gJiYgYVsxXSA9PT0gYlsxXSAmJiBhWzJdID09PSBiWzJdICYmIGFbM10gPT09IGJbM107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaWRlbnRpdHkgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIGFuIGlkZW50aXR5IHF1YXRlcm5pb25cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpZGVudGl0eShkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFszXSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIGNvbnN0IHRlbXBWZWMzID0gdmVjMy5jcmVhdGUoKTtcbiAgICBjb25zdCB4VW5pdFZlYzMgPSB2ZWMzLmNyZWF0ZSgpO1xuICAgIGNvbnN0IHlVbml0VmVjMyA9IHZlYzMuY3JlYXRlKCk7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgYSBxdWF0ZXJuaW9uIHRvIHJlcHJlc2VudCB0aGUgc2hvcnRlc3Qgcm90YXRpb24gZnJvbSBvbmUgdmVjdG9yIHRvIGFub3RoZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYVVuaXQgLSB0aGUgc3RhcnQgdmVjdG9yXG4gICAgICogQHBhcmFtIGJVbml0IC0gdGhlIGVuZCB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRpb25UbyhhVW5pdCwgYlVuaXQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgY29uc3QgZG90ID0gdmVjMy5kb3QoYVVuaXQsIGJVbml0KTtcbiAgICAgICAgaWYgKGRvdCA8IC0wLjk5OTk5OSkge1xuICAgICAgICAgICAgdmVjMy5jcm9zcyh4VW5pdFZlYzMsIGFVbml0LCB0ZW1wVmVjMyk7XG4gICAgICAgICAgICBpZiAodmVjMy5sZW4odGVtcFZlYzMpIDwgMC4wMDAwMDEpIHtcbiAgICAgICAgICAgICAgICB2ZWMzLmNyb3NzKHlVbml0VmVjMywgYVVuaXQsIHRlbXBWZWMzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZlYzMubm9ybWFsaXplKHRlbXBWZWMzLCB0ZW1wVmVjMyk7XG4gICAgICAgICAgICBmcm9tQXhpc0FuZ2xlKHRlbXBWZWMzLCBNYXRoLlBJLCBuZXdEc3QpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkb3QgPiAwLjk5OTk5OSkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gMDtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzNdID0gMTtcbiAgICAgICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2ZWMzLmNyb3NzKGFVbml0LCBiVW5pdCwgdGVtcFZlYzMpO1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gdGVtcFZlYzNbMF07XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSB0ZW1wVmVjM1sxXTtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IHRlbXBWZWMzWzJdO1xuICAgICAgICAgICAgbmV3RHN0WzNdID0gMSArIGRvdDtcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxpemUobmV3RHN0LCBuZXdEc3QpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHRlbXBRdWF0MSA9IG5ldyBDdG9yKDQpO1xuICAgIGNvbnN0IHRlbXBRdWF0MiA9IG5ldyBDdG9yKDQpO1xuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGEgc3BoZXJpY2FsIGxpbmVhciBpbnRlcnBvbGF0aW9uIHdpdGggdHdvIGNvbnRyb2wgcG9pbnRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYSAtIHRoZSBmaXJzdCBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIGIgLSB0aGUgc2Vjb25kIHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0gYyAtIHRoZSB0aGlyZCBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIGQgLSB0aGUgZm91cnRoIHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0gdCAtIEludGVycG9sYXRpb24gY29lZmZpY2llbnQgMCB0byAxXG4gICAgICogQHJldHVybnMgcmVzdWx0XG4gICAgICovXG4gICAgZnVuY3Rpb24gc3FsZXJwKGEsIGIsIGMsIGQsIHQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgc2xlcnAoYSwgZCwgdCwgdGVtcFF1YXQxKTtcbiAgICAgICAgc2xlcnAoYiwgYywgdCwgdGVtcFF1YXQyKTtcbiAgICAgICAgc2xlcnAodGVtcFF1YXQxLCB0ZW1wUXVhdDIsIDIgKiB0ICogKDEgLSB0KSwgbmV3RHN0KTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlLFxuICAgICAgICBmcm9tVmFsdWVzLFxuICAgICAgICBzZXQsXG4gICAgICAgIGZyb21BeGlzQW5nbGUsXG4gICAgICAgIHRvQXhpc0FuZ2xlLFxuICAgICAgICBhbmdsZSxcbiAgICAgICAgbXVsdGlwbHksXG4gICAgICAgIG11bCxcbiAgICAgICAgcm90YXRlWCxcbiAgICAgICAgcm90YXRlWSxcbiAgICAgICAgcm90YXRlWixcbiAgICAgICAgc2xlcnAsXG4gICAgICAgIGludmVyc2UsXG4gICAgICAgIGNvbmp1Z2F0ZSxcbiAgICAgICAgZnJvbU1hdCxcbiAgICAgICAgZnJvbUV1bGVyLFxuICAgICAgICBjb3B5LFxuICAgICAgICBjbG9uZSxcbiAgICAgICAgYWRkLFxuICAgICAgICBzdWJ0cmFjdCxcbiAgICAgICAgc3ViLFxuICAgICAgICBtdWxTY2FsYXIsXG4gICAgICAgIHNjYWxlLFxuICAgICAgICBkaXZTY2FsYXIsXG4gICAgICAgIGRvdCxcbiAgICAgICAgbGVycCxcbiAgICAgICAgbGVuZ3RoLFxuICAgICAgICBsZW4sXG4gICAgICAgIGxlbmd0aFNxLFxuICAgICAgICBsZW5TcSxcbiAgICAgICAgbm9ybWFsaXplLFxuICAgICAgICBlcXVhbHNBcHByb3hpbWF0ZWx5LFxuICAgICAgICBlcXVhbHMsXG4gICAgICAgIGlkZW50aXR5LFxuICAgICAgICByb3RhdGlvblRvLFxuICAgICAgICBzcWxlcnAsXG4gICAgfTtcbn1cbmNvbnN0IGNhY2hlJDEgPSBuZXcgTWFwKCk7XG4vKipcbiAqXG4gKiBRdWF0NCBtYXRoIGZ1bmN0aW9ucy5cbiAqXG4gKiBBbG1vc3QgYWxsIGZ1bmN0aW9ucyB0YWtlIGFuIG9wdGlvbmFsIGBuZXdEc3RgIGFyZ3VtZW50LiBJZiBpdCBpcyBub3QgcGFzc2VkIGluIHRoZVxuICogZnVuY3Rpb25zIHdpbGwgY3JlYXRlIGEgbmV3IGBRdWF0NGAuIEluIG90aGVyIHdvcmRzIHlvdSBjYW4gZG8gdGhpc1xuICpcbiAqICAgICBjb25zdCB2ID0gcXVhdDQuY3Jvc3ModjEsIHYyKTsgIC8vIENyZWF0ZXMgYSBuZXcgUXVhdDQgd2l0aCB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB2MSB4IHYyLlxuICpcbiAqIG9yXG4gKlxuICogICAgIGNvbnN0IHYgPSBxdWF0NC5jcmVhdGUoKTtcbiAqICAgICBxdWF0NC5jcm9zcyh2MSwgdjIsIHYpOyAgLy8gUHV0cyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB2MSB4IHYyIGluIHZcbiAqXG4gKiBUaGUgZmlyc3Qgc3R5bGUgaXMgb2Z0ZW4gZWFzaWVyIGJ1dCBkZXBlbmRpbmcgb24gd2hlcmUgaXQncyB1c2VkIGl0IGdlbmVyYXRlcyBnYXJiYWdlIHdoZXJlXG4gKiBhcyB0aGVyZSBpcyBhbG1vc3QgbmV2ZXIgYWxsb2NhdGlvbiB3aXRoIHRoZSBzZWNvbmQgc3R5bGUuXG4gKlxuICogSXQgaXMgYWx3YXlzIHNhZmUgdG8gcGFzcyBhbnkgdmVjdG9yIGFzIHRoZSBkZXN0aW5hdGlvbi4gU28gZm9yIGV4YW1wbGVcbiAqXG4gKiAgICAgcXVhdDQuY3Jvc3ModjEsIHYyLCB2MSk7ICAvLyBQdXRzIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHYxIHggdjIgaW4gdjFcbiAqXG4gKi9cbmZ1bmN0aW9uIGdldEFQSSQxKEN0b3IpIHtcbiAgICBsZXQgYXBpID0gY2FjaGUkMS5nZXQoQ3Rvcik7XG4gICAgaWYgKCFhcGkpIHtcbiAgICAgICAgYXBpID0gZ2V0QVBJSW1wbCQxKEN0b3IpO1xuICAgICAgICBjYWNoZSQxLnNldChDdG9yLCBhcGkpO1xuICAgIH1cbiAgICByZXR1cm4gYXBpO1xufVxuXG4vKlxuICogQ29weXJpZ2h0IDIwMjIgR3JlZ2cgVGF2YXJlc1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4gKiBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksXG4gKiB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4gKiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSxcbiAqIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuICogU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTExcbiAqIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICogRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuICogREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4vKipcbiAqIEdlbmVyYXRlcyBhbSB0eXBlZCBBUEkgZm9yIFZlYzRcbiAqICovXG5mdW5jdGlvbiBnZXRBUElJbXBsKEN0b3IpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgdmVjNDsgbWF5IGJlIGNhbGxlZCB3aXRoIHgsIHksIHogdG8gc2V0IGluaXRpYWwgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB4IC0gSW5pdGlhbCB4IHZhbHVlLlxuICAgICAqIEBwYXJhbSB5IC0gSW5pdGlhbCB5IHZhbHVlLlxuICAgICAqIEBwYXJhbSB6IC0gSW5pdGlhbCB6IHZhbHVlLlxuICAgICAqIEBwYXJhbSB3IC0gSW5pdGlhbCB3IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHRoZSBjcmVhdGVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZSh4LCB5LCB6LCB3KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IG5ldyBDdG9yKDQpO1xuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSB4O1xuICAgICAgICAgICAgaWYgKHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5ld0RzdFsxXSA9IHk7XG4gICAgICAgICAgICAgICAgaWYgKHogIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdEc3RbMl0gPSB6O1xuICAgICAgICAgICAgICAgICAgICBpZiAodyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbM10gPSB3O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSB2ZWM0OyBtYXkgYmUgY2FsbGVkIHdpdGggeCwgeSwgeiB0byBzZXQgaW5pdGlhbCB2YWx1ZXMuIChzYW1lIGFzIGNyZWF0ZSlcbiAgICAgKiBAcGFyYW0geCAtIEluaXRpYWwgeCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geSAtIEluaXRpYWwgeSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geiAtIEluaXRpYWwgeiB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geiAtIEluaXRpYWwgdyB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyB0aGUgY3JlYXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBjb25zdCBmcm9tVmFsdWVzID0gY3JlYXRlO1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBhIFZlYzRcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgdmVjNC5jcmVhdGV9IGFuZCB7QGxpbmsgdmVjNC5jb3B5fVxuICAgICAqXG4gICAgICogQHBhcmFtIHggZmlyc3QgdmFsdWVcbiAgICAgKiBAcGFyYW0geSBzZWNvbmQgdmFsdWVcbiAgICAgKiBAcGFyYW0geiB0aGlyZCB2YWx1ZVxuICAgICAqIEBwYXJhbSB3IGZvdXJ0aCB2YWx1ZVxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3Igd2l0aCBpdHMgZWxlbWVudHMgc2V0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldCh4LCB5LCB6LCB3LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHg7XG4gICAgICAgIG5ld0RzdFsxXSA9IHk7XG4gICAgICAgIG5ld0RzdFsyXSA9IHo7XG4gICAgICAgIG5ld0RzdFszXSA9IHc7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgTWF0aC5jZWlsIHRvIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgY2VpbCBvZiBlYWNoIGVsZW1lbnQgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjZWlsKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5jZWlsKHZbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLmNlaWwodlsxXSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGguY2VpbCh2WzJdKTtcbiAgICAgICAgbmV3RHN0WzNdID0gTWF0aC5jZWlsKHZbM10pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIE1hdGguZmxvb3IgdG8gZWFjaCBlbGVtZW50IG9mIHZlY3RvclxuICAgICAqIEBwYXJhbSB2IC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBmbG9vciBvZiBlYWNoIGVsZW1lbnQgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmbG9vcih2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGguZmxvb3IodlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGguZmxvb3IodlsxXSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGguZmxvb3IodlsyXSk7XG4gICAgICAgIG5ld0RzdFszXSA9IE1hdGguZmxvb3IodlszXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgTWF0aC5yb3VuZCB0byBlYWNoIGVsZW1lbnQgb2YgdmVjdG9yXG4gICAgICogQHBhcmFtIHYgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIHJvdW5kIG9mIGVhY2ggZWxlbWVudCBvZiB2LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdW5kKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5yb3VuZCh2WzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5yb3VuZCh2WzFdKTtcbiAgICAgICAgbmV3RHN0WzJdID0gTWF0aC5yb3VuZCh2WzJdKTtcbiAgICAgICAgbmV3RHN0WzNdID0gTWF0aC5yb3VuZCh2WzNdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xhbXAgZWFjaCBlbGVtZW50IG9mIHZlY3RvciBiZXR3ZWVuIG1pbiBhbmQgbWF4XG4gICAgICogQHBhcmFtIHYgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gbWF4IC0gTWluIHZhbHVlLCBkZWZhdWx0IDBcbiAgICAgKiBAcGFyYW0gbWluIC0gTWF4IHZhbHVlLCBkZWZhdWx0IDFcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgdGhlIGNsYW1wZWQgdmFsdWUgb2YgZWFjaCBlbGVtZW50IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xhbXAodiwgbWluID0gMCwgbWF4ID0gMSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgdlswXSkpO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgdlsxXSkpO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgdlsyXSkpO1xuICAgICAgICBuZXdEc3RbM10gPSBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgdlszXSkpO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIHR3byB2ZWN0b3JzOyBhc3N1bWVzIGEgYW5kIGIgaGF2ZSB0aGUgc2FtZSBkaW1lbnNpb24uXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgc3VtIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSArIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdICsgYlsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gYVszXSArIGJbM107XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgdHdvIHZlY3RvcnMsIHNjYWxpbmcgdGhlIDJuZDsgYXNzdW1lcyBhIGFuZCBiIGhhdmUgdGhlIHNhbWUgZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gc2NhbGUgLSBBbW91bnQgdG8gc2NhbGUgYlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgc3VtIG9mIGEgKyBiICogc2NhbGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU2NhbGVkKGEsIGIsIHNjYWxlLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyBiWzBdICogc2NhbGU7XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyBiWzFdICogc2NhbGU7XG4gICAgICAgIG5ld0RzdFsyXSA9IGFbMl0gKyBiWzJdICogc2NhbGU7XG4gICAgICAgIG5ld0RzdFszXSA9IGFbM10gKyBiWzNdICogc2NhbGU7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBkaWZmZXJlbmNlIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdIC0gYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IGFbMl0gLSBiWzJdO1xuICAgICAgICBuZXdEc3RbM10gPSBhWzNdIC0gYlszXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIHR3byB2ZWN0b3JzLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIGRpZmZlcmVuY2Ugb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBjb25zdCBzdWIgPSBzdWJ0cmFjdDtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIHZlY3RvcnMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWxcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB2ZWN0b3JzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzQXBwcm94aW1hdGVseShhLCBiKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhWzBdIC0gYlswXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzFdIC0gYlsxXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzJdIC0gYlsyXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzNdIC0gYlszXSkgPCBFUFNJTE9OO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIHZlY3RvcnMgYXJlIGV4YWN0bHkgZXF1YWxcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB2ZWN0b3JzIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGFbMF0gPT09IGJbMF0gJiYgYVsxXSA9PT0gYlsxXSAmJiBhWzJdID09PSBiWzJdICYmIGFbM10gPT09IGJbM107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGxpbmVhciBpbnRlcnBvbGF0aW9uIG9uIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiBhbmQgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudCB0LCByZXR1cm5zXG4gICAgICogYSArIHQgKiAoYiAtIGEpLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gdCAtIEludGVycG9sYXRpb24gY29lZmZpY2llbnQuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbGluZWFyIGludGVycG9sYXRlZCByZXN1bHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVycChhLCBiLCB0LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyB0ICogKGJbMF0gLSBhWzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSArIHQgKiAoYlsxXSAtIGFbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdICsgdCAqIChiWzJdIC0gYVsyXSk7XG4gICAgICAgIG5ld0RzdFszXSA9IGFbM10gKyB0ICogKGJbM10gLSBhWzNdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgbGluZWFyIGludGVycG9sYXRpb24gb24gdHdvIHZlY3RvcnMuXG4gICAgICogR2l2ZW4gdmVjdG9ycyBhIGFuZCBiIGFuZCBpbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50IHZlY3RvciB0LCByZXR1cm5zXG4gICAgICogYSArIHQgKiAoYiAtIGEpLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gdCAtIEludGVycG9sYXRpb24gY29lZmZpY2llbnRzIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHRoZSBsaW5lYXIgaW50ZXJwb2xhdGVkIHJlc3VsdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsZXJwVihhLCBiLCB0LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyB0WzBdICogKGJbMF0gLSBhWzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSArIHRbMV0gKiAoYlsxXSAtIGFbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdICsgdFsyXSAqIChiWzJdIC0gYVsyXSk7XG4gICAgICAgIG5ld0RzdFszXSA9IGFbM10gKyB0WzNdICogKGJbM10gLSBhWzNdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIG1heCB2YWx1ZXMgb2YgdHdvIHZlY3RvcnMuXG4gICAgICogR2l2ZW4gdmVjdG9ycyBhIGFuZCBiIHJldHVybnNcbiAgICAgKiBbbWF4KGFbMF0sIGJbMF0pLCBtYXgoYVsxXSwgYlsxXSksIG1heChhWzJdLCBiWzJdKV0uXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1heCBjb21wb25lbnRzIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYXgoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLm1heChhWzBdLCBiWzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5tYXgoYVsxXSwgYlsxXSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGgubWF4KGFbMl0sIGJbMl0pO1xuICAgICAgICBuZXdEc3RbM10gPSBNYXRoLm1heChhWzNdLCBiWzNdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIG1pbiB2YWx1ZXMgb2YgdHdvIHZlY3RvcnMuXG4gICAgICogR2l2ZW4gdmVjdG9ycyBhIGFuZCBiIHJldHVybnNcbiAgICAgKiBbbWluKGFbMF0sIGJbMF0pLCBtaW4oYVsxXSwgYlsxXSksIG1pbihhWzJdLCBiWzJdKV0uXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1pbiBjb21wb25lbnRzIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtaW4oYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLm1pbihhWzBdLCBiWzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5taW4oYVsxXSwgYlsxXSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGgubWluKGFbMl0sIGJbMl0pO1xuICAgICAgICBuZXdEc3RbM10gPSBNYXRoLm1pbihhWzNdLCBiWzNdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsU2NhbGFyKHYsIGssIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXSAqIGs7XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV0gKiBrO1xuICAgICAgICBuZXdEc3RbMl0gPSB2WzJdICogaztcbiAgICAgICAgbmV3RHN0WzNdID0gdlszXSAqIGs7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIuIChzYW1lIGFzIG11bFNjYWxhcilcbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgY29uc3Qgc2NhbGUgPSBtdWxTY2FsYXI7XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2U2NhbGFyKHYsIGssIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXSAvIGs7XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV0gLyBrO1xuICAgICAgICBuZXdEc3RbMl0gPSB2WzJdIC8gaztcbiAgICAgICAgbmV3RHN0WzNdID0gdlszXSAvIGs7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludmVyc2UgYSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGludmVydGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnZlcnNlKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gMSAvIHZbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IDEgLyB2WzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSAxIC8gdlsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gMSAvIHZbM107XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludmVydCBhIHZlY3Rvci4gKHNhbWUgYXMgaW52ZXJzZSlcbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgaW52ZXJ0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGNvbnN0IGludmVydCA9IGludmVyc2U7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGRvdCBwcm9kdWN0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZG90KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIChhWzBdICogYlswXSkgKyAoYVsxXSAqIGJbMV0pICsgKGFbMl0gKiBiWzJdKSArIChhWzNdICogYlszXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBsZW5ndGggb2YgdmVjdG9yXG4gICAgICogQHBhcmFtIHYgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgbGVuZ3RoIG9mIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsZW5ndGgodikge1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgY29uc3QgdjIgPSB2WzJdO1xuICAgICAgICBjb25zdCB2MyA9IHZbM107XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodjAgKiB2MCArIHYxICogdjEgKyB2MiAqIHYyICsgdjMgKiB2Myk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBsZW5ndGggb2YgdmVjdG9yIChzYW1lIGFzIGxlbmd0aClcbiAgICAgKiBAcGFyYW0gdiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBsZW5ndGggb2YgdmVjdG9yLlxuICAgICAqL1xuICAgIGNvbnN0IGxlbiA9IGxlbmd0aDtcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgdmVjdG9yXG4gICAgICogQHBhcmFtIHYgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlbmd0aFNxKHYpIHtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHYyID0gdlsyXTtcbiAgICAgICAgY29uc3QgdjMgPSB2WzNdO1xuICAgICAgICByZXR1cm4gdjAgKiB2MCArIHYxICogdjEgKyB2MiAqIHYyICsgdjMgKiB2MztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHZlY3RvciAoc2FtZSBhcyBsZW5ndGhTcSlcbiAgICAgKiBAcGFyYW0gdiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiB2ZWN0b3IuXG4gICAgICovXG4gICAgY29uc3QgbGVuU3EgPSBsZW5ndGhTcTtcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgZGlzdGFuY2UgYmV0d2VlbiAyIHBvaW50c1xuICAgICAqIEBwYXJhbSBhIC0gdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpc3RhbmNlKGEsIGIpIHtcbiAgICAgICAgY29uc3QgZHggPSBhWzBdIC0gYlswXTtcbiAgICAgICAgY29uc3QgZHkgPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgY29uc3QgZHogPSBhWzJdIC0gYlsyXTtcbiAgICAgICAgY29uc3QgZHcgPSBhWzNdIC0gYlszXTtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSArIGR6ICogZHogKyBkdyAqIGR3KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHMgKHNhbWUgYXMgZGlzdGFuY2UpXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gICAgICovXG4gICAgY29uc3QgZGlzdCA9IGRpc3RhbmNlO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHNcbiAgICAgKiBAcGFyYW0gYSAtIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpc3RhbmNlU3EoYSwgYikge1xuICAgICAgICBjb25zdCBkeCA9IGFbMF0gLSBiWzBdO1xuICAgICAgICBjb25zdCBkeSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICBjb25zdCBkeiA9IGFbMl0gLSBiWzJdO1xuICAgICAgICBjb25zdCBkdyA9IGFbM10gLSBiWzNdO1xuICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHkgKyBkeiAqIGR6ICsgZHcgKiBkdztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIHNxdWFyZSBvZiB0aGUgZGlzdGFuY2UgYmV0d2VlbiAyIHBvaW50cyAoc2FtZSBhcyBkaXN0YW5jZVNxKVxuICAgICAqIEBwYXJhbSBhIC0gdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHNxdWFyZSBvZiB0aGUgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gICAgICovXG4gICAgY29uc3QgZGlzdFNxID0gZGlzdGFuY2VTcTtcbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIGEgdmVjdG9yIGJ5IGl0cyBFdWNsaWRlYW4gbGVuZ3RoIGFuZCByZXR1cm5zIHRoZSBxdW90aWVudC5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbm9ybWFsaXplZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHYyID0gdlsyXTtcbiAgICAgICAgY29uc3QgdjMgPSB2WzNdO1xuICAgICAgICBjb25zdCBsZW4gPSBNYXRoLnNxcnQodjAgKiB2MCArIHYxICogdjEgKyB2MiAqIHYyICsgdjMgKiB2Myk7XG4gICAgICAgIGlmIChsZW4gPiAwLjAwMDAxKSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSB2MCAvIGxlbjtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IHYxIC8gbGVuO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gdjIgLyBsZW47XG4gICAgICAgICAgICBuZXdEc3RbM10gPSB2MyAvIGxlbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTmVnYXRlcyBhIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyAtdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBuZWdhdGUodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSAtdlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gLXZbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IC12WzJdO1xuICAgICAgICBuZXdEc3RbM10gPSAtdlszXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29waWVzIGEgdmVjdG9yLiAoc2FtZSBhcyB7QGxpbmsgdmVjNC5jbG9uZX0pXG4gICAgICogQWxzbyBzZWUge0BsaW5rIHZlYzQuY3JlYXRlfSBhbmQge0BsaW5rIHZlYzQuc2V0fVxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgY29weSBvZiB2LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcHkodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSB2WzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSB2WzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSB2WzJdO1xuICAgICAgICBuZXdEc3RbM10gPSB2WzNdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9uZXMgYSB2ZWN0b3IuIChzYW1lIGFzIHtAbGluayB2ZWM0LmNvcHl9KVxuICAgICAqIEFsc28gc2VlIHtAbGluayB2ZWM0LmNyZWF0ZX0gYW5kIHtAbGluayB2ZWM0LnNldH1cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIGNvcHkgb2Ygdi5cbiAgICAgKi9cbiAgICBjb25zdCBjbG9uZSA9IGNvcHk7XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIG9mIHByb2R1Y3RzIG9mIGVudHJpZXMgb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtdWx0aXBseShhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKiBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICogYlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSAqIGJbMl07XG4gICAgICAgIG5ld0RzdFszXSA9IGFbM10gKiBiWzNdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGFub3RoZXIgdmVjdG9yIChjb21wb25lbnQtd2lzZSk7IGFzc3VtZXMgYSBhbmRcbiAgICAgKiBiIGhhdmUgdGhlIHNhbWUgbGVuZ3RoLiAoc2FtZSBhcyBtdWwpXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBwcm9kdWN0cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3QgbXVsID0gbXVsdGlwbHk7XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIG9mIHF1b3RpZW50cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2aWRlKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSAvIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gLyBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdIC8gYlsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gYVszXSAvIGJbM107XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYW5vdGhlciB2ZWN0b3IgKGNvbXBvbmVudC13aXNlKTsgYXNzdW1lcyBhIGFuZFxuICAgICAqIGIgaGF2ZSB0aGUgc2FtZSBsZW5ndGguIChzYW1lIGFzIGRpdmlkZSlcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIG9mIHF1b3RpZW50cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3QgZGl2ID0gZGl2aWRlO1xuICAgIC8qKlxuICAgICAqIFplcm8ncyBhIHZlY3RvclxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHplcm9lZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gemVybyhkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHRyYW5zZm9ybSB2ZWM0IGJ5IDR4NCBtYXRyaXhcbiAgICAgKiBAcGFyYW0gdiAtIHRoZSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG9wdGlvbmFsIHZlYzQgdG8gc3RvcmUgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1NYXQ0KHYsIG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgY29uc3QgeCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHkgPSB2WzFdO1xuICAgICAgICBjb25zdCB6ID0gdlsyXTtcbiAgICAgICAgY29uc3QgdyA9IHZbM107XG4gICAgICAgIG5ld0RzdFswXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWzhdICogeiArIG1bMTJdICogdztcbiAgICAgICAgbmV3RHN0WzFdID0gbVsxXSAqIHggKyBtWzVdICogeSArIG1bOV0gKiB6ICsgbVsxM10gKiB3O1xuICAgICAgICBuZXdEc3RbMl0gPSBtWzJdICogeCArIG1bNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0gKiB3O1xuICAgICAgICBuZXdEc3RbM10gPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmVhdCBhIDREIHZlY3RvciBhcyBhIGRpcmVjdGlvbiBhbmQgc2V0IGl0J3MgbGVuZ3RoXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYSBUaGUgdmVjNCB0byBsZW5ndGhlblxuICAgICAqIEBwYXJhbSBsZW4gVGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHZlY3RvclxuICAgICAqIEByZXR1cm5zIFRoZSBsZW5ndGhlbmVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldExlbmd0aChhLCBsZW4sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbm9ybWFsaXplKGEsIG5ld0RzdCk7XG4gICAgICAgIHJldHVybiBtdWxTY2FsYXIobmV3RHN0LCBsZW4sIG5ld0RzdCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVuc3VyZSBhIHZlY3RvciBpcyBub3QgbG9uZ2VyIHRoYW4gYSBtYXggbGVuZ3RoXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYSBUaGUgdmVjNCB0byBsaW1pdFxuICAgICAqIEBwYXJhbSBtYXhMZW4gVGhlIGxvbmdlc3QgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgdmVjdG9yXG4gICAgICogQHJldHVybnMgVGhlIHZlY3Rvciwgc2hvcnRlbmVkIHRvIG1heExlbiBpZiBpdCdzIHRvbyBsb25nXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJ1bmNhdGUoYSwgbWF4TGVuLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGlmIChsZW5ndGgoYSkgPiBtYXhMZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBzZXRMZW5ndGgoYSwgbWF4TGVuLCBuZXdEc3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3B5KGEsIG5ld0RzdCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgdmVjdG9yIGV4YWN0bHkgYmV0d2VlbiAyIGVuZHBvaW50IHZlY3RvcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIEVuZHBvaW50IDFcbiAgICAgKiBAcGFyYW0gYiBFbmRwb2ludCAyXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBleGFjdGx5IHJlc2lkaW5nIGJldHdlZW4gZW5kcG9pbnRzIDEgYW5kIDJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtaWRwb2ludChhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIHJldHVybiBsZXJwKGEsIGIsIDAuNSwgbmV3RHN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlLFxuICAgICAgICBmcm9tVmFsdWVzLFxuICAgICAgICBzZXQsXG4gICAgICAgIGNlaWwsXG4gICAgICAgIGZsb29yLFxuICAgICAgICByb3VuZCxcbiAgICAgICAgY2xhbXAsXG4gICAgICAgIGFkZCxcbiAgICAgICAgYWRkU2NhbGVkLFxuICAgICAgICBzdWJ0cmFjdCxcbiAgICAgICAgc3ViLFxuICAgICAgICBlcXVhbHNBcHByb3hpbWF0ZWx5LFxuICAgICAgICBlcXVhbHMsXG4gICAgICAgIGxlcnAsXG4gICAgICAgIGxlcnBWLFxuICAgICAgICBtYXgsXG4gICAgICAgIG1pbixcbiAgICAgICAgbXVsU2NhbGFyLFxuICAgICAgICBzY2FsZSxcbiAgICAgICAgZGl2U2NhbGFyLFxuICAgICAgICBpbnZlcnNlLFxuICAgICAgICBpbnZlcnQsXG4gICAgICAgIGRvdCxcbiAgICAgICAgbGVuZ3RoLFxuICAgICAgICBsZW4sXG4gICAgICAgIGxlbmd0aFNxLFxuICAgICAgICBsZW5TcSxcbiAgICAgICAgZGlzdGFuY2UsXG4gICAgICAgIGRpc3QsXG4gICAgICAgIGRpc3RhbmNlU3EsXG4gICAgICAgIGRpc3RTcSxcbiAgICAgICAgbm9ybWFsaXplLFxuICAgICAgICBuZWdhdGUsXG4gICAgICAgIGNvcHksXG4gICAgICAgIGNsb25lLFxuICAgICAgICBtdWx0aXBseSxcbiAgICAgICAgbXVsLFxuICAgICAgICBkaXZpZGUsXG4gICAgICAgIGRpdixcbiAgICAgICAgemVybyxcbiAgICAgICAgdHJhbnNmb3JtTWF0NCxcbiAgICAgICAgc2V0TGVuZ3RoLFxuICAgICAgICB0cnVuY2F0ZSxcbiAgICAgICAgbWlkcG9pbnQsXG4gICAgfTtcbn1cbmNvbnN0IGNhY2hlID0gbmV3IE1hcCgpO1xuLyoqXG4gKlxuICogVmVjNCBtYXRoIGZ1bmN0aW9ucy5cbiAqXG4gKiBBbG1vc3QgYWxsIGZ1bmN0aW9ucyB0YWtlIGFuIG9wdGlvbmFsIGBuZXdEc3RgIGFyZ3VtZW50LiBJZiBpdCBpcyBub3QgcGFzc2VkIGluIHRoZVxuICogZnVuY3Rpb25zIHdpbGwgY3JlYXRlIGEgbmV3IGBWZWM0YC4gSW4gb3RoZXIgd29yZHMgeW91IGNhbiBkbyB0aGlzXG4gKlxuICogICAgIGNvbnN0IHYgPSB2ZWM0LmNyb3NzKHYxLCB2Mik7ICAvLyBDcmVhdGVzIGEgbmV3IFZlYzQgd2l0aCB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB2MSB4IHYyLlxuICpcbiAqIG9yXG4gKlxuICogICAgIGNvbnN0IHYgPSB2ZWM0LmNyZWF0ZSgpO1xuICogICAgIHZlYzQuY3Jvc3ModjEsIHYyLCB2KTsgIC8vIFB1dHMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdjEgeCB2MiBpbiB2XG4gKlxuICogVGhlIGZpcnN0IHN0eWxlIGlzIG9mdGVuIGVhc2llciBidXQgZGVwZW5kaW5nIG9uIHdoZXJlIGl0J3MgdXNlZCBpdCBnZW5lcmF0ZXMgZ2FyYmFnZSB3aGVyZVxuICogYXMgdGhlcmUgaXMgYWxtb3N0IG5ldmVyIGFsbG9jYXRpb24gd2l0aCB0aGUgc2Vjb25kIHN0eWxlLlxuICpcbiAqIEl0IGlzIGFsd2F5cyBzYWZlIHRvIHBhc3MgYW55IHZlY3RvciBhcyB0aGUgZGVzdGluYXRpb24uIFNvIGZvciBleGFtcGxlXG4gKlxuICogICAgIHZlYzQuY3Jvc3ModjEsIHYyLCB2MSk7ICAvLyBQdXRzIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHYxIHggdjIgaW4gdjFcbiAqXG4gKi9cbmZ1bmN0aW9uIGdldEFQSShDdG9yKSB7XG4gICAgbGV0IGFwaSA9IGNhY2hlLmdldChDdG9yKTtcbiAgICBpZiAoIWFwaSkge1xuICAgICAgICBhcGkgPSBnZXRBUElJbXBsKEN0b3IpO1xuICAgICAgICBjYWNoZS5zZXQoQ3RvciwgYXBpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwaTtcbn1cblxuLyoqXG4gKiBTb21lIGRvY3NcbiAqIEBuYW1lc3BhY2Ugd2dwdS1tYXRyaXhcbiAqL1xuLyoqXG4gKiBHZW5lcmF0ZSB3Z3B1LW1hdHJpeCBBUEkgZm9yIHR5cGVcbiAqL1xuZnVuY3Rpb24gd2dwdU1hdHJpeEFQSShNYXQzQ3RvciwgTWF0NEN0b3IsIFF1YXRDdG9yLCBWZWMyQ3RvciwgVmVjM0N0b3IsIFZlYzRDdG9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqIEBuYW1lc3BhY2UgbWF0MyAqL1xuICAgICAgICBtYXQzOiBnZXRBUEkkMyhNYXQzQ3RvciksXG4gICAgICAgIC8qKiBAbmFtZXNwYWNlIG1hdDQgKi9cbiAgICAgICAgbWF0NDogZ2V0QVBJJDIoTWF0NEN0b3IpLFxuICAgICAgICAvKiogQG5hbWVzcGFjZSBxdWF0ICovXG4gICAgICAgIHF1YXQ6IGdldEFQSSQxKFF1YXRDdG9yKSxcbiAgICAgICAgLyoqIEBuYW1lc3BhY2UgdmVjMiAqL1xuICAgICAgICB2ZWMyOiBnZXRBUEkkNShWZWMyQ3RvciksXG4gICAgICAgIC8qKiBAbmFtZXNwYWNlIHZlYzMgKi9cbiAgICAgICAgdmVjMzogZ2V0QVBJJDQoVmVjM0N0b3IpLFxuICAgICAgICAvKiogQG5hbWVzcGFjZSB2ZWM0ICovXG4gICAgICAgIHZlYzQ6IGdldEFQSShWZWM0Q3RvciksXG4gICAgfTtcbn1cbmNvbnN0IHsgXG4vKipcbiAqIDN4MyBNYXRyaXggZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0MzJBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xubWF0MywgXG4vKipcbiAqIDR4NCBNYXRyaXggZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0MzJBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xubWF0NCwgXG4vKipcbiAqIFF1YXRlcm5pb24gZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0MzJBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xucXVhdCwgXG4vKipcbiAqIFZlYzIgZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0MzJBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xudmVjMiwgXG4vKipcbiAqIFZlYzMgZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0MzJBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xudmVjMywgXG4vKipcbiAqIFZlYzMgZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0MzJBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xudmVjNCwgfSA9IHdncHVNYXRyaXhBUEkoRmxvYXQzMkFycmF5LCBGbG9hdDMyQXJyYXksIEZsb2F0MzJBcnJheSwgRmxvYXQzMkFycmF5LCBGbG9hdDMyQXJyYXksIEZsb2F0MzJBcnJheSk7XG5jb25zdCB7IFxuLyoqXG4gKiAzeDMgTWF0cml4IGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDY0QXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbm1hdDM6IG1hdDNkLCBcbi8qKlxuICogNHg0IE1hdHJpeCBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgRmxvYXQ2NEFycmF5YFxuICogQG5hbWVzcGFjZVxuICovXG5tYXQ0OiBtYXQ0ZCwgXG4vKipcbiAqIFF1YXRlcm5pb24gZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0NjRBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xucXVhdDogcXVhdGQsIFxuLyoqXG4gKiBWZWMyIGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDY0QXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnZlYzI6IHZlYzJkLCBcbi8qKlxuICogVmVjMyBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgRmxvYXQ2NEFycmF5YFxuICogQG5hbWVzcGFjZVxuICovXG52ZWMzOiB2ZWMzZCwgXG4vKipcbiAqIFZlYzMgZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0NjRBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xudmVjNDogdmVjNGQsIH0gPSB3Z3B1TWF0cml4QVBJKEZsb2F0NjRBcnJheSwgRmxvYXQ2NEFycmF5LCBGbG9hdDY0QXJyYXksIEZsb2F0NjRBcnJheSwgRmxvYXQ2NEFycmF5LCBGbG9hdDY0QXJyYXkpO1xuY29uc3QgeyBcbi8qKlxuICogM3gzIE1hdHJpeCBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgbnVtYmVyW11gXG4gKiBAbmFtZXNwYWNlXG4gKi9cbm1hdDM6IG1hdDNuLCBcbi8qKlxuICogNHg0IE1hdHJpeCBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgbnVtYmVyW11gXG4gKiBAbmFtZXNwYWNlXG4gKi9cbm1hdDQ6IG1hdDRuLCBcbi8qKlxuICogUXVhdGVybmlvbiBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgbnVtYmVyW11gXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnF1YXQ6IHF1YXRuLCBcbi8qKlxuICogVmVjMiBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgbnVtYmVyW11gXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnZlYzI6IHZlYzJuLCBcbi8qKlxuICogVmVjMyBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgbnVtYmVyW11gXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnZlYzM6IHZlYzNuLCBcbi8qKlxuICogVmVjMyBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgbnVtYmVyW11gXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnZlYzQ6IHZlYzRuLCB9ID0gd2dwdU1hdHJpeEFQSShaZXJvQXJyYXksIEFycmF5LCBBcnJheSwgQXJyYXksIEFycmF5LCBBcnJheSk7XG5cbmV4cG9ydCB7IG1hdDMsIG1hdDNkLCBtYXQzbiwgbWF0NCwgbWF0NGQsIG1hdDRuLCBxdWF0LCBxdWF0ZCwgcXVhdG4sIHV0aWxzLCB2ZWMyLCB2ZWMyZCwgdmVjMm4sIHZlYzMsIHZlYzNkLCB2ZWMzbiwgdmVjNCwgdmVjNGQsIHZlYzRuIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD13Z3B1LW1hdHJpeC5tb2R1bGUuanMubWFwXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=