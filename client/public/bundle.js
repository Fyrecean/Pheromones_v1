/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var NUMBER_OF_PASSES = 2;
var latestFrameHandle = 0;
var frame = undefined;
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, adapter, hasTimestampQuery, device, perfDisplayContainer, perfDisplay, simulationDurationSum, renderDurationSum, timerSamples, sparePerfTimeBuffers, querySet, perfResolveBuffer, simulationPerfTimeStampWrites, renderPerfTimeStampWrites, context, presentationFormat, pheromoneTextures, agentsBuffer, texturePass, simulationPass, renderPass, pheromoneIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvas = document.querySelector('canvas');
                    canvas.width = window.innerWidth - 30;
                    canvas.height = window.innerHeight - 30;
                    return [4 /*yield*/, navigator.gpu.requestAdapter()];
                case 1:
                    adapter = _a.sent();
                    hasTimestampQuery = adapter.features.has("timestamp-query");
                    return [4 /*yield*/, adapter.requestDevice({
                            requiredFeatures: hasTimestampQuery ? ["timestamp-query"] : [],
                        })];
                case 2:
                    device = _a.sent();
                    perfDisplayContainer = document.createElement('div');
                    perfDisplayContainer.hidden = true;
                    perfDisplayContainer.style.color = 'white';
                    perfDisplayContainer.style.backdropFilter = 'blur(10px)';
                    perfDisplayContainer.style.position = 'absolute';
                    perfDisplayContainer.style.bottom = '10px';
                    perfDisplayContainer.style.left = '10px';
                    perfDisplayContainer.style.textAlign = 'left';
                    perfDisplay = document.createElement('pre');
                    perfDisplay.style.margin = '.5em';
                    perfDisplayContainer.appendChild(perfDisplay);
                    canvas.parentNode.appendChild(perfDisplayContainer);
                    simulationDurationSum = 0;
                    renderDurationSum = 0;
                    timerSamples = 0;
                    sparePerfTimeBuffers = [];
                    querySet = undefined;
                    perfResolveBuffer = undefined;
                    simulationPerfTimeStampWrites = undefined;
                    renderPerfTimeStampWrites = undefined;
                    if (hasTimestampQuery) {
                        perfDisplay.textContent = "avg simulation duration: \u2014 \u00B5s\navg render duration:  \u2014 \u00B5s\nspare perf buffers:    \u2014";
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
                            querySet: querySet,
                            beginningOfPassWriteIndex: 0,
                            endOfPassWriteIndex: 1,
                        };
                        renderPerfTimeStampWrites = {
                            querySet: querySet,
                            beginningOfPassWriteIndex: 2,
                            endOfPassWriteIndex: 3,
                        };
                    }
                    _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters.width = canvas.width;
                    _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters.height = canvas.height;
                    context = canvas.getContext('webgpu');
                    presentationFormat = navigator.gpu.getPreferredCanvasFormat();
                    context.configure({
                        device: device,
                        format: presentationFormat,
                        alphaMode: 'premultiplied'
                    });
                    pheromoneTextures = [
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
                    agentsBuffer = device.createBuffer({
                        label: "agents",
                        size: 16 * _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters.agentCount,
                        usage: GPUBufferUsage.STORAGE,
                        mappedAtCreation: true,
                    });
                    new Float32Array(agentsBuffer.getMappedRange()).set((0,_simulationConfig__WEBPACK_IMPORTED_MODULE_1__.getAgentsArray)(_simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters));
                    agentsBuffer.unmap();
                    texturePass = new _textureComputePass__WEBPACK_IMPORTED_MODULE_3__.TexturePass(device, _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters, pheromoneTextures[0].format);
                    simulationPass = new _simulationPass__WEBPACK_IMPORTED_MODULE_2__.SimulationPass(device, _simulationConfig__WEBPACK_IMPORTED_MODULE_1__.simulationParameters, pheromoneTextures[0].format, agentsBuffer);
                    renderPass = new _renderPass__WEBPACK_IMPORTED_MODULE_0__.RenderPass(device, pheromoneTextures[0].format);
                    pheromoneIndex = 0;
                    frame = function () {
                        var commandEncoder = device.createCommandEncoder();
                        var textureInIndex = pheromoneIndex;
                        var textureOutIndex = (pheromoneIndex + 1) % 2;
                        texturePass.addPass(commandEncoder, pheromoneTextures[textureInIndex], pheromoneTextures[textureOutIndex]);
                        simulationPass.addPass(commandEncoder, pheromoneTextures[textureInIndex], pheromoneTextures[textureOutIndex], simulationPerfTimeStampWrites);
                        var canvasTextureView = context.getCurrentTexture().createView();
                        renderPass.addPass(commandEncoder, pheromoneTextures[pheromoneIndex], canvasTextureView, renderPerfTimeStampWrites);
                        pheromoneIndex = textureOutIndex;
                        var resultBuffer = undefined;
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
                            resultBuffer.mapAsync(GPUMapMode.READ).then(function () {
                                var times = new BigInt64Array(resultBuffer.getMappedRange());
                                var simulationDuration = Number(times[1] - times[0]);
                                var renderDuration = Number(times[3] - times[2]);
                                if (simulationDuration > 0 && renderDuration > 0) {
                                    simulationDurationSum += simulationDuration;
                                    renderDurationSum += renderDuration;
                                    timerSamples++;
                                }
                                resultBuffer.unmap();
                                sparePerfTimeBuffers.push(resultBuffer);
                                var kNumTimerSamplesPerUpdate = 100;
                                if (timerSamples >= kNumTimerSamplesPerUpdate) {
                                    var avgSimulationMicroseconds = Math.round(simulationDurationSum / timerSamples / 1000);
                                    var avgRenderMicroseconds = Math.round(renderDurationSum / timerSamples / 1000);
                                    perfDisplay.textContent = "avg simulation duration: ".concat(avgSimulationMicroseconds, "\u00B5s\navg render duration:  ").concat(avgRenderMicroseconds, "\u00B5s\nspare perf buffers:    ").concat(sparePerfTimeBuffers.length);
                                    simulationDurationSum = 0;
                                    renderDurationSum = 0;
                                    timerSamples = 0;
                                }
                            });
                        }
                        latestFrameHandle = requestAnimationFrame(frame);
                    };
                    latestFrameHandle = requestAnimationFrame(frame);
                    return [2 /*return*/];
            }
        });
    });
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
var RenderPass = /** @class */ (function () {
    function RenderPass(device, textureFormat) {
        var shaderCode = "\n@group(0) @binding(0) var textureIn: texture_2d<f32>;\n@group(0) @binding(1) var samplerIn: sampler;\n\nstruct VertexOut {\n    @builtin(position) position : vec4f,\n    @location(0) uv : vec2f,\n}\n\n@vertex\nfn vertex_main(@builtin(vertex_index) VertexIndex: u32) -> VertexOut\n{\n    var vertices = array<vec2f, 6>(\n    vec2(-1, -1),\n    vec2(1, -1),\n    vec2(-1, 1),\n    vec2(1, 1),\n    vec2(1, -1),\n    vec2(-1, 1),\n    );\n    var uvs = array<vec2f, 6> (\n    vec2(0, 0),\n    vec2(1, 0),\n    vec2(0, 1),\n    vec2(1, 1),\n    vec2(1, 0),\n    vec2(0, 1),\n    );\n    var output : VertexOut;\n    output.position = vec4(vertices[VertexIndex], 0, 1);\n    output.uv = uvs[VertexIndex];\n    \n    return output;\n}\n\n@fragment\nfn fragment_main(fragData: VertexOut) -> @location(0) vec4f\n{\n    return vec4(textureSample(textureIn, samplerIn, fragData.uv).xyz, 1);\n}";
        this.device = device;
        this.sampler = device.createSampler({
            minFilter: "linear",
            magFilter: "linear",
        });
        var renderBindGroupLayout = device.createBindGroupLayout({
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
        var renderShaderModule = device.createShaderModule({
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
    RenderPass.prototype.addPass = function (commandEncoder, pheromoneTexture, targetView, timestampWrites) {
        var renderPassDescriptor = {
            colorAttachments: [
                {
                    view: targetView,
                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            timestampWrites: timestampWrites
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
        var passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, this.bindGroup);
        passEncoder.draw(6);
        passEncoder.end();
    };
    return RenderPass;
}());



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

var simulationParameters = {
    agentCount: 100000,
    height: 0,
    width: 0,
    turnJitter: 0,
    steerFactor: .5,
    sampleDistance: 5,
    passiveAttenuation: 0.001,
    gaussianStdDev: 0.4,
};
var configTable = document.getElementById("configTable");
var showConfig = false;
document.addEventListener("DOMContentLoaded", function () {
    var showButton = document.getElementById("show");
    showButton.addEventListener("click", function () {
        if (showConfig) {
            showConfig = false;
            configTable.hidden = false;
        }
        else {
            showConfig = true;
            configTable.hidden = true;
        }
    });
    addSlider("Jitter", "turnJitter", .5, 0, 1.5, .01);
    addSlider("Steering", "steerFactor", 0.25, 0, 1, .01);
    addSlider("Seeing Distance", "sampleDistance", 10, 1, 100, 1);
    addSlider("Pheromone Blur", "gaussianStdDev", 0.05, 0, .5, .005);
    addSlider("Pheromone Fade", "passiveAttenuation", .008, 0.002, .05, .001);
    document.getElementById("reset").addEventListener("click", _main__WEBPACK_IMPORTED_MODULE_0__.reset);
    var pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", function () {
        var isPlaying = (0,_main__WEBPACK_IMPORTED_MODULE_0__.togglePause)();
        pauseButton.innerText = isPlaying ? "Pause" : "Unpause";
    });
    (0,_main__WEBPACK_IMPORTED_MODULE_0__.start)();
});
function addSlider(name, configKey, initialValue, min, max, step, onUpdate) {
    var sliderLabel = document.createElement("label");
    sliderLabel.setAttribute("for", name);
    sliderLabel.innerText = name;
    var sliderInput = document.createElement("input");
    sliderInput.setAttribute("id", name);
    sliderInput.setAttribute("type", "range");
    sliderInput.setAttribute("min", String(min));
    sliderInput.setAttribute("max", String(max));
    sliderInput.setAttribute("step", String(step));
    sliderInput.setAttribute("value", String(initialValue));
    var sliderDisplay = document.createElement("span");
    var tableRow = document.createElement("tr");
    tableRow.append(document.createElement("td").appendChild(sliderLabel).parentElement, document.createElement("td").appendChild(sliderInput).parentElement, document.createElement("td").appendChild(sliderDisplay).parentElement);
    configTable.appendChild(tableRow);
    if (onUpdate) {
    }
    else {
    }
    onUpdate = function () {
        simulationParameters[configKey] = Number(sliderInput.value);
        sliderDisplay.innerText = sliderInput.value;
    };
    onUpdate();
    sliderInput.addEventListener("input", onUpdate);
}
function getAgentsArray(parameters) {
    var agentsArray = new Array(4 * parameters.agentCount);
    for (var i = 0; i < parameters.agentCount * 4; i += 4) {
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
var WORKGROUP_SIZE = 64;
var SimulationPass = /** @class */ (function () {
    function SimulationPass(device, simulationParameters, textureFormat, agentsBuffer) {
        var shaderCode = "\n        // Hash function from H. Schechter & R. Bridson, goo.gl/RXiKaH\n        fn Hash(p: u32) -> u32\n        {\n            var s = p; \n            s ^= 2747636419u;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            return s;\n        }\n\n        fn Random(seed: u32) -> f32\n        {\n            return f32(Hash(seed)) / 4294967295.0; // 2^32-1\n        }\n\n        struct Uniforms {\n            time: u32,\n            sampleDistance: u32,\n            turnJitter: f32,\n            steerFactor: f32,\n        }\n\n        @group(0) @binding(0) var<uniform> uniforms: Uniforms;\n\n        @group(0) @binding(1) var textureOut: texture_storage_2d<".concat(textureFormat, ", write>;\n        @group(0) @binding(2) var<storage, read_write> agents: array<vec4f, ").concat(simulationParameters.agentCount, ">;\n        @group(0) @binding(3) var textureIn: texture_storage_2d<").concat(textureFormat, ", read>;\n\n        const leftSampleMatrix =  mat2x2(0.866025, 0.5, -0.5, 0.866025);\n        const rightSampleMatrix = mat2x2(0.866025, -0.5, 0.5, 0.866025);\n        fn samplePheromone(position: vec2<f32>, direction: vec2<f32>, steps: u32) -> vec3<f32> {\n            let sampleStart = position + direction * 2;\n            var sum = vec3(0.);\n            let fSteps = f32(steps);\n            for (var i = 0.; i < fSteps; i += 1.) {\n                sum += textureLoad(textureIn, vec2<i32>(round(sampleStart + i * direction))).xyz;\n            }\n            return sum;\n        }\n\n        @compute @workgroup_size(").concat(WORKGROUP_SIZE, ")\n        fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {\n        let index = global_id.x;\n        // Trim off the excess if agentCount % WORKGROUP_SIZE != 0\n        if (index >= ").concat(simulationParameters.agentCount, ") {\n            return;\n        }\n\n        var agent = agents[index];\n\n        agent.x += agent.z;\n        agent.y += agent.w;\n\n        if (agent.x >= ").concat(simulationParameters.width, " || agent.x < 0) {\n            agent.z = -agent.z;\n        }\n        if (agent.y >= ").concat(simulationParameters.height, " || agent.y < 0) {\n            agent.w = -agent.w;\n        }\n\n        let randomDirChange = uniforms.turnJitter * vec2(Random(uniforms.time + global_id.x) - .5, Random(uniforms.time + global_id.x + ").concat(simulationParameters.height, ") - .5);\n        var velocity = normalize(agent.zw + randomDirChange);\n\n        // Take pheromone samples\n        let rightSampleDir = rightSampleMatrix * velocity;\n        let rightSamplePixel = vec2<i32>(round(agent.xy + 3 * rightSampleDir));\n        \n        let forwardSamplePixel = vec2<i32>(round(agent.xy + 3 * velocity));\n\n        \n        let leftSampleDir = leftSampleMatrix * velocity;\n\n        let rightSample = samplePheromone(agent.xy, rightSampleDir, uniforms.sampleDistance).x;\n        let forwardSample = samplePheromone(agent.xy, velocity, uniforms.sampleDistance).x;\n        let leftSample = samplePheromone(agent.xy, leftSampleDir, uniforms.sampleDistance).x;\n        \n        if (forwardSample < rightSample || forwardSample < leftSample) {\n            if (rightSample > leftSample) {\n                velocity += uniforms.steerFactor * rightSampleDir;\n            } else {\n                velocity += uniforms.steerFactor * leftSampleDir;\n             }\n            velocity = normalize(velocity);\n        }\n\n        let pixel = vec2<i32>(round(agent.xy));\n        let color = vec3(0.39, 0.82, 0.06);\n        textureStore(textureOut, pixel, vec4(color, 1.));\n        \n        agent.z = velocity.x;\n        agent.w = velocity.y;\n        agents[index] = agent;\n        }");
        this.device = device;
        this.agentsBuffer = agentsBuffer;
        this.workgroups = Math.ceil(simulationParameters.agentCount / WORKGROUP_SIZE);
        this.simulationParameters = simulationParameters;
        var computeBindGroupLayout = device.createBindGroupLayout({
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
            ]
        });
        this.pipeline = device.createComputePipeline({
            label: "Simulation Pipeline",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [computeBindGroupLayout],
            }),
            compute: {
                module: device.createShaderModule({ code: shaderCode }),
                entryPoint: 'simulate'
            }
        });
        this.uniformBuffer = device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
    SimulationPass.prototype.addPass = function (commandEncoder, textureIn, textureOut, timestampWrites) {
        var uniformInts = new Uint32Array([
            window.performance.now() * 10,
            this.simulationParameters.sampleDistance,
        ]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformInts, 0, uniformInts.length);
        var uniformFloats = new Float32Array([
            this.simulationParameters.turnJitter,
            this.simulationParameters.steerFactor
        ]);
        this.device.queue.writeBuffer(this.uniformBuffer, uniformInts.byteLength, uniformFloats, 0, uniformFloats.length);
        var passDescriptor = {
            timestampWrites: timestampWrites
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
                    resource: { buffer: this.agentsBuffer },
                },
                {
                    binding: 3,
                    resource: textureIn.createView(),
                },
            ]
        });
        var simulatePass = commandEncoder.beginComputePass(passDescriptor);
        simulatePass.setPipeline(this.pipeline);
        simulatePass.setBindGroup(0, this.bindGroup);
        simulatePass.dispatchWorkgroups(this.workgroups);
        simulatePass.end();
    };
    return SimulationPass;
}());



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
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wgpu-matrix */ "./node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
// import { mat3, Mat3 } from "wgpu-matrix";

var WORKGROUP_SIZE = 64;
var TexturePass = /** @class */ (function () {
    function TexturePass(device, simulationParameters, pheromoneTextureFormat) {
        var shaderCode = "\n        struct Uniforms {\n            blurKernel: mat3x3<f32>,\n            passiveAttenuation: f32,\n        }\n        @group(0) @binding(0) var<uniform> uniforms: Uniforms;\n\n        @group(0) @binding(1) var textureIn: texture_storage_2d<".concat(pheromoneTextureFormat, ", read>;\n        @group(0) @binding(2) var textureOut: texture_storage_2d<").concat(pheromoneTextureFormat, ", write>;\n\n        @compute @workgroup_size(8, 8)\n        fn attenuate(@builtin(global_invocation_id) global_id: vec3<u32>) {\n            if (global_id.x >= ").concat(simulationParameters.width, " || global_id.y >= ").concat(simulationParameters.height, ") {\n                return;\n            }\n            \n            let pixel = global_id.xy;\n            var colorSum = vec3(0.);\n\n            // Loop through neighboring pixels (3x3 kernel)\n            for (var i: i32 = -1; i <= 1; i++) {\n                for (var j: i32 = -1; j <= 1; j++) {\n                    let samplePixel= vec2(i32(global_id.x) + i, i32(global_id.y) + j);\n\n                    // Ensure we don't sample out of bounds\n                    if (samplePixel.x < ").concat(simulationParameters.width, " && samplePixel.y < ").concat(simulationParameters.height, ") {\n                        let sampleColor = textureLoad(textureIn, samplePixel).xyz; // Load neighboring pixel color\n                        let kernelIndex = (i+1) * 3 + (j+1);\n                        colorSum += sampleColor * uniforms.blurKernel[i+1][j+1]; // Apply Gaussian kernel\n                    }\n                }\n            }\n\n            colorSum = max(vec3(0.), colorSum - vec3(uniforms.passiveAttenuation));\n\n            textureStore(textureOut, pixel, vec4(colorSum, 1.0)); // Store blurred color\n        }\n\n            ");
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
        var computeBindGroupLayout = device.createBindGroupLayout({
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
                module: device.createShaderModule({ code: shaderCode }),
                entryPoint: 'attenuate'
            }
        });
    }
    TexturePass.prototype.addPass = function (commandEncoder, textureIn, textureOut, timestampWrites) {
        if (this.simulationParamters.gaussianStdDev != this.prevGaussianStdDev) {
            this.kernel = generateGaussianKernel(this.simulationParamters.gaussianStdDev, 3);
            this.device.queue.writeBuffer(this.uniformBuffer, 0, this.kernel.buffer, this.kernel.byteOffset, this.kernel.byteLength);
        }
        this.device.queue.writeBuffer(this.uniformBuffer, this.kernel.byteLength, new Float32Array([this.simulationParamters.passiveAttenuation]), 0, 1);
        var passDescriptor = {
            timestampWrites: timestampWrites
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
        var simulatePass = commandEncoder.beginComputePass(passDescriptor);
        simulatePass.setPipeline(this.pipeline);
        simulatePass.setBindGroup(0, this.bindGroup);
        simulatePass.dispatchWorkgroups(this.workgroups[0], this.workgroups[1]);
        simulatePass.end();
    };
    return TexturePass;
}());

function generateGaussianKernel(stdDev, size) {
    if (size % 2 != 1) {
        throw (new Error("Gaussian Kernel size must be an odd number"));
    }
    var kernel = [];
    var offset = Math.floor(size / 2);
    var TAU = Math.PI;
    var stdDevSqr = Math.pow((stdDev + .3), 2);
    var sum = 0;
    for (var i = 0; i < size; i++) {
        var xSqr = Math.pow((i - offset), 2);
        for (var j = 0; j < size; j++) {
            var index = i * size + j;
            var ySqr = Math.pow((j - offset), 2);
            kernel[index] = (1 / (2 * Math.PI * stdDevSqr)) * Math.exp(-(xSqr + ySqr) / (2 * stdDevSqr));
            sum += kernel[index];
        }
    }
    // Normalize the kernel
    var newSum = 0;
    for (var i = 0; i < kernel.length; i++) {
        kernel[i] /= sum;
        newSum += kernel[i];
    }
    // Ensure the kernel sums to 1
    kernel[offset * size + offset] += 1 - newSum;
    // console.log(sum, newSum);
    // console.log(`${kernel[0].toFixed(5)}, ${kernel[1].toFixed(5)}, ${kernel[2].toFixed(5)}\n`, 
    //             `${kernel[3].toFixed(5)}, ${kernel[4].toFixed(5)}, ${kernel[5].toFixed(5)}\n`, 
    //             `${kernel[6].toFixed(5)}, ${kernel[7].toFixed(5)}, ${kernel[8].toFixed(5)}`);
    return wgpu_matrix__WEBPACK_IMPORTED_MODULE_0__.mat3.create(kernel[0], kernel[1], kernel[2], kernel[3], kernel[4], kernel[5], kernel[6], kernel[7], kernel[8]);
    // return mat3.create(0, 0, 0,
    //                    0, 0, 0, 
    //                    0, 0, 0);
}


/***/ }),

/***/ "./node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js":
/*!*****************************************************************!*\
  !*** ./node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLGlCQUFpQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxpQkFBaUI7QUFDbkQsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsZ0JBQWdCO0FBQ2xELGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGlCQUFpQjtBQUNuRCxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGdCQUFnQjtBQUNsRCxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGNBQWM7QUFDN0IsZUFBZSxjQUFjO0FBQzdCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGNBQWM7QUFDN0IsZUFBZSxjQUFjO0FBQzdCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGNBQWM7QUFDN0IsZUFBZSxjQUFjO0FBQzdCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGlCQUFpQixNQUFNO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxpQkFBaUI7QUFDbkQsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxnQkFBZ0I7QUFDakQsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGlCQUFpQjtBQUNuRCxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsZ0JBQWdCO0FBQ2pELGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RDtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsTUFBTTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxpQkFBaUI7QUFDdkQsaUJBQWlCLG1CQUFtQixLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLGdCQUFnQjtBQUN0RCxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGlCQUFpQjtBQUNuRCxpQkFBaUIsbUJBQW1CLEtBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsZ0JBQWdCO0FBQ2xELGlCQUFpQixtQkFBbUIsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7O0FBRTBIO0FBQ3pJOzs7Ozs7O1VDcHdMQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9yZW5kZXJQYXNzLnRzIiwid2VicGFjazovLy8uL3NyYy9zaW11bGF0aW9uQ29uZmlnLnRzIiwid2VicGFjazovLy8uL3NyYy9zaW11bGF0aW9uUGFzcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGV4dHVyZUNvbXB1dGVQYXNzLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93Z3B1LW1hdHJpeC9kaXN0LzMueC93Z3B1LW1hdHJpeC5tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbmRlclBhc3MgfSBmcm9tIFwiLi9yZW5kZXJQYXNzXCI7XHJcbmltcG9ydCB7IGdldEFnZW50c0FycmF5LCBzaW11bGF0aW9uUGFyYW1ldGVycyB9IGZyb20gXCIuL3NpbXVsYXRpb25Db25maWdcIjtcclxuaW1wb3J0IHsgU2ltdWxhdGlvblBhc3MgfSBmcm9tIFwiLi9zaW11bGF0aW9uUGFzc1wiO1xyXG5pbXBvcnQgeyBUZXh0dXJlUGFzcyB9IGZyb20gXCIuL3RleHR1cmVDb21wdXRlUGFzc1wiO1xyXG5cclxuY29uc3QgTlVNQkVSX09GX1BBU1NFUyA9IDI7XHJcbmxldCBsYXRlc3RGcmFtZUhhbmRsZSA9IDA7XHJcbmxldCBmcmFtZTogKCkgPT4gdm9pZCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDMwO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDMwO1xyXG4gICAgY29uc3QgYWRhcHRlciA9IGF3YWl0IG5hdmlnYXRvci5ncHUucmVxdWVzdEFkYXB0ZXIoKTtcclxuICAgIGNvbnN0IGhhc1RpbWVzdGFtcFF1ZXJ5ID0gYWRhcHRlci5mZWF0dXJlcy5oYXMoXCJ0aW1lc3RhbXAtcXVlcnlcIik7XHJcbiAgICBjb25zdCBkZXZpY2UgPSBhd2FpdCBhZGFwdGVyLnJlcXVlc3REZXZpY2Uoe1xyXG4gICAgICAgIHJlcXVpcmVkRmVhdHVyZXM6IGhhc1RpbWVzdGFtcFF1ZXJ5ID8gW1widGltZXN0YW1wLXF1ZXJ5XCJdIGFzIEdQVUZlYXR1cmVOYW1lW106IFtdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUGVyZm9ybWFuY2UgU3RhdGlzdGljcyBEb2N1bWVudCBTZXR1cFxyXG4gICAgY29uc3QgcGVyZkRpc3BsYXlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLmhpZGRlbiA9IHRydWU7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5iYWNrZHJvcEZpbHRlciA9ICdibHVyKDEwcHgpJztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLmJvdHRvbSA9ICcxMHB4JztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLmxlZnQgPSAnMTBweCc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS50ZXh0QWxpZ24gPSAnbGVmdCc7XHJcbiAgICBjb25zdCBwZXJmRGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ByZScpO1xyXG4gICAgcGVyZkRpc3BsYXkuc3R5bGUubWFyZ2luID0gJy41ZW0nO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuYXBwZW5kQ2hpbGQocGVyZkRpc3BsYXkpO1xyXG4gICAgY2FudmFzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQocGVyZkRpc3BsYXlDb250YWluZXIpO1xyXG4gICAgbGV0IHNpbXVsYXRpb25EdXJhdGlvblN1bSA9IDA7XHJcbiAgICBsZXQgcmVuZGVyRHVyYXRpb25TdW0gPSAwO1xyXG4gICAgbGV0IHRpbWVyU2FtcGxlcyA9IDA7XHJcblxyXG4gICAgY29uc3Qgc3BhcmVQZXJmVGltZUJ1ZmZlcnM6IEdQVUJ1ZmZlcltdID0gW107XHJcbiAgICBsZXQgcXVlcnlTZXQ6IEdQVVF1ZXJ5U2V0IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgbGV0IHBlcmZSZXNvbHZlQnVmZmVyOiBHUFVCdWZmZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICBsZXQgc2ltdWxhdGlvblBlcmZUaW1lU3RhbXBXcml0ZXM6IEdQVUNvbXB1dGVQYXNzVGltZXN0YW1wV3JpdGVzIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgbGV0IHJlbmRlclBlcmZUaW1lU3RhbXBXcml0ZXM6IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICBpZiAoaGFzVGltZXN0YW1wUXVlcnkpIHtcclxuICAgICAgICBwZXJmRGlzcGxheS50ZXh0Q29udGVudCA9IGBcXFxyXG5hdmcgc2ltdWxhdGlvbiBkdXJhdGlvbjog4oCUIMK1c1xyXG5hdmcgcmVuZGVyIGR1cmF0aW9uOiAg4oCUIMK1c1xyXG5zcGFyZSBwZXJmIGJ1ZmZlcnM6ICAgIOKAlGA7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHF1ZXJ5U2V0ID0gZGV2aWNlLmNyZWF0ZVF1ZXJ5U2V0KHtcclxuICAgICAgICAgICAgdHlwZTogXCJ0aW1lc3RhbXBcIixcclxuICAgICAgICAgICAgY291bnQ6IDIgKiBOVU1CRVJfT0ZfUEFTU0VTLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBlcmZSZXNvbHZlQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcih7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcInBlcmZSZXNvbHZlXCIsXHJcbiAgICAgICAgICAgIHNpemU6IDQgKiBCaWdJbnQ2NEFycmF5LkJZVEVTX1BFUl9FTEVNRU5UICogTlVNQkVSX09GX1BBU1NFUyxcclxuICAgICAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLlFVRVJZX1JFU09MVkUgfCBHUFVCdWZmZXJVc2FnZS5DT1BZX1NSQyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBzaW11bGF0aW9uUGVyZlRpbWVTdGFtcFdyaXRlcyA9IHtcclxuICAgICAgICAgICAgcXVlcnlTZXQsXHJcbiAgICAgICAgICAgIGJlZ2lubmluZ09mUGFzc1dyaXRlSW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGVuZE9mUGFzc1dyaXRlSW5kZXg6IDEsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgcmVuZGVyUGVyZlRpbWVTdGFtcFdyaXRlcyA9IHtcclxuICAgICAgICAgICAgcXVlcnlTZXQsXHJcbiAgICAgICAgICAgIGJlZ2lubmluZ09mUGFzc1dyaXRlSW5kZXg6IDIsXHJcbiAgICAgICAgICAgIGVuZE9mUGFzc1dyaXRlSW5kZXg6IDMsXHJcbiAgICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICAgc2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ3B1JykgYXMgdW5rbm93biBhcyBHUFVDYW52YXNDb250ZXh0O1xyXG4gICAgY29uc3QgcHJlc2VudGF0aW9uRm9ybWF0ID0gbmF2aWdhdG9yLmdwdS5nZXRQcmVmZXJyZWRDYW52YXNGb3JtYXQoKTtcclxuICAgIGNvbnRleHQuY29uZmlndXJlKHtcclxuICAgICAgICBkZXZpY2UsXHJcbiAgICAgICAgZm9ybWF0OiBwcmVzZW50YXRpb25Gb3JtYXQsXHJcbiAgICAgICAgYWxwaGFNb2RlOiAncHJlbXVsdGlwbGllZCdcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHBoZXJvbW9uZVRleHR1cmVzID0gW1xyXG4gICAgICAgIGRldmljZS5jcmVhdGVUZXh0dXJlKHtcclxuICAgICAgICAgICAgc2l6ZTogW2NhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodF0sXHJcbiAgICAgICAgICAgIGZvcm1hdDogICdyZ2JhOHVub3JtJyxcclxuICAgICAgICAgICAgdXNhZ2U6IFxyXG4gICAgICAgICAgICAgICAgR1BVVGV4dHVyZVVzYWdlLlRFWFRVUkVfQklORElORyB8XHJcbiAgICAgICAgICAgICAgICBHUFVUZXh0dXJlVXNhZ2UuU1RPUkFHRV9CSU5ESU5HXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZGV2aWNlLmNyZWF0ZVRleHR1cmUoe1xyXG4gICAgICAgICAgICBzaXplOiBbY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0XSxcclxuICAgICAgICAgICAgZm9ybWF0OiAgJ3JnYmE4dW5vcm0nLFxyXG4gICAgICAgICAgICB1c2FnZTogXHJcbiAgICAgICAgICAgICAgICBHUFVUZXh0dXJlVXNhZ2UuVEVYVFVSRV9CSU5ESU5HIHxcclxuICAgICAgICAgICAgICAgIEdQVVRleHR1cmVVc2FnZS5TVE9SQUdFX0JJTkRJTkdcclxuICAgICAgICB9KSxcclxuICAgIF07XHJcblxyXG4gICAgY29uc3QgYWdlbnRzQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcih7XHJcbiAgICAgICAgbGFiZWw6IFwiYWdlbnRzXCIsXHJcbiAgICAgICAgc2l6ZTogMTYgKiBzaW11bGF0aW9uUGFyYW1ldGVycy5hZ2VudENvdW50LFxyXG4gICAgICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZS5TVE9SQUdFLFxyXG4gICAgICAgIG1hcHBlZEF0Q3JlYXRpb246IHRydWUsXHJcbiAgICB9KTtcclxuICAgIG5ldyBGbG9hdDMyQXJyYXkoYWdlbnRzQnVmZmVyLmdldE1hcHBlZFJhbmdlKCkpLnNldChnZXRBZ2VudHNBcnJheShzaW11bGF0aW9uUGFyYW1ldGVycykpO1xyXG4gICAgYWdlbnRzQnVmZmVyLnVubWFwKCk7XHJcblxyXG4gICAgY29uc3QgdGV4dHVyZVBhc3MgPSBuZXcgVGV4dHVyZVBhc3MoZGV2aWNlLCBzaW11bGF0aW9uUGFyYW1ldGVycywgcGhlcm9tb25lVGV4dHVyZXNbMF0uZm9ybWF0KVxyXG5cclxuICAgIGNvbnN0IHNpbXVsYXRpb25QYXNzID0gbmV3IFNpbXVsYXRpb25QYXNzKGRldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnMsIHBoZXJvbW9uZVRleHR1cmVzWzBdLmZvcm1hdCwgYWdlbnRzQnVmZmVyKTtcclxuXHJcbiAgICBjb25zdCByZW5kZXJQYXNzID0gbmV3IFJlbmRlclBhc3MoZGV2aWNlLCBwaGVyb21vbmVUZXh0dXJlc1swXS5mb3JtYXQpO1xyXG5cclxuICAgIGxldCBwaGVyb21vbmVJbmRleCA9IDA7XHJcbiAgICBmcmFtZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBjb21tYW5kRW5jb2RlciA9IGRldmljZS5jcmVhdGVDb21tYW5kRW5jb2RlcigpO1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmVJbkluZGV4ID0gcGhlcm9tb25lSW5kZXg7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZU91dEluZGV4ID0gKHBoZXJvbW9uZUluZGV4ICsgMSkgJSAyXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZVBhc3MuYWRkUGFzcyhjb21tYW5kRW5jb2RlciwgcGhlcm9tb25lVGV4dHVyZXNbdGV4dHVyZUluSW5kZXhdLCBwaGVyb21vbmVUZXh0dXJlc1t0ZXh0dXJlT3V0SW5kZXhdKVxyXG5cclxuICAgICAgICBzaW11bGF0aW9uUGFzcy5hZGRQYXNzKGNvbW1hbmRFbmNvZGVyLCBwaGVyb21vbmVUZXh0dXJlc1t0ZXh0dXJlSW5JbmRleF0sIHBoZXJvbW9uZVRleHR1cmVzW3RleHR1cmVPdXRJbmRleF0sIHNpbXVsYXRpb25QZXJmVGltZVN0YW1wV3JpdGVzKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FudmFzVGV4dHVyZVZpZXcgPSBjb250ZXh0LmdldEN1cnJlbnRUZXh0dXJlKCkuY3JlYXRlVmlldygpO1xyXG4gICAgICAgIHJlbmRlclBhc3MuYWRkUGFzcyhjb21tYW5kRW5jb2RlciwgcGhlcm9tb25lVGV4dHVyZXNbcGhlcm9tb25lSW5kZXhdLCBjYW52YXNUZXh0dXJlVmlldywgcmVuZGVyUGVyZlRpbWVTdGFtcFdyaXRlcyk7XHJcbiAgICAgICAgcGhlcm9tb25lSW5kZXggPSB0ZXh0dXJlT3V0SW5kZXg7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHRCdWZmZXI6IEdQVUJ1ZmZlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoaGFzVGltZXN0YW1wUXVlcnkpIHtcclxuICAgICAgICAgICAgcmVzdWx0QnVmZmVyID0gc3BhcmVQZXJmVGltZUJ1ZmZlcnMucG9wKCkgfHwgXHJcbiAgICAgICAgICAgICAgICBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiA0ICogQmlnSW50NjRBcnJheS5CWVRFU19QRVJfRUxFTUVOVCAqIE5VTUJFUl9PRl9QQVNTRVMsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLkNPUFlfRFNUIHwgR1BVQnVmZmVyVXNhZ2UuTUFQX1JFQUQsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29tbWFuZEVuY29kZXIucmVzb2x2ZVF1ZXJ5U2V0KHF1ZXJ5U2V0LCAwLCAyICogTlVNQkVSX09GX1BBU1NFUywgcGVyZlJlc29sdmVCdWZmZXIsIDApO1xyXG4gICAgICAgICAgICBjb21tYW5kRW5jb2Rlci5jb3B5QnVmZmVyVG9CdWZmZXIoXHJcbiAgICAgICAgICAgICAgICBwZXJmUmVzb2x2ZUJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0QnVmZmVyLnNpemVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRldmljZS5xdWV1ZS5zdWJtaXQoW2NvbW1hbmRFbmNvZGVyLmZpbmlzaCgpXSk7XHJcblxyXG4gICAgICAgIGlmIChoYXNUaW1lc3RhbXBRdWVyeSkge1xyXG4gICAgICAgICAgICByZXN1bHRCdWZmZXIubWFwQXN5bmMoR1BVTWFwTW9kZS5SRUFEKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVzID0gbmV3IEJpZ0ludDY0QXJyYXkocmVzdWx0QnVmZmVyLmdldE1hcHBlZFJhbmdlKCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2ltdWxhdGlvbkR1cmF0aW9uID0gTnVtYmVyKHRpbWVzWzFdIC0gdGltZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyRHVyYXRpb24gPSBOdW1iZXIodGltZXNbM10gLSB0aW1lc1syXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2ltdWxhdGlvbkR1cmF0aW9uID4gMCAmJiByZW5kZXJEdXJhdGlvbiA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzaW11bGF0aW9uRHVyYXRpb25TdW0gKz0gc2ltdWxhdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckR1cmF0aW9uU3VtICs9IHJlbmRlckR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyU2FtcGxlcysrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0QnVmZmVyLnVubWFwKCk7XHJcbiAgICAgICAgICAgICAgICBzcGFyZVBlcmZUaW1lQnVmZmVycy5wdXNoKHJlc3VsdEJ1ZmZlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qga051bVRpbWVyU2FtcGxlc1BlclVwZGF0ZSA9IDEwMDtcclxuICAgICAgICAgICAgICAgIGlmICh0aW1lclNhbXBsZXMgPj0ga051bVRpbWVyU2FtcGxlc1BlclVwZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF2Z1NpbXVsYXRpb25NaWNyb3NlY29uZHMgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaW11bGF0aW9uRHVyYXRpb25TdW0gLyB0aW1lclNhbXBsZXMgLyAxMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdmdSZW5kZXJNaWNyb3NlY29uZHMgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJEdXJhdGlvblN1bSAvIHRpbWVyU2FtcGxlcyAvIDEwMDBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcmZEaXNwbGF5LnRleHRDb250ZW50ID0gYFxcXHJcbmF2ZyBzaW11bGF0aW9uIGR1cmF0aW9uOiAke2F2Z1NpbXVsYXRpb25NaWNyb3NlY29uZHN9wrVzXHJcbmF2ZyByZW5kZXIgZHVyYXRpb246ICAke2F2Z1JlbmRlck1pY3Jvc2Vjb25kc33CtXNcclxuc3BhcmUgcGVyZiBidWZmZXJzOiAgICAke3NwYXJlUGVyZlRpbWVCdWZmZXJzLmxlbmd0aH1gO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbXVsYXRpb25EdXJhdGlvblN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRHVyYXRpb25TdW0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyU2FtcGxlcyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGF0ZXN0RnJhbWVIYW5kbGUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xyXG4gICAgfTtcclxuICAgIGxhdGVzdEZyYW1lSGFuZGxlID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZVBhdXNlKCk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKGxhdGVzdEZyYW1lSGFuZGxlICE9IDApIHtcclxuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShsYXRlc3RGcmFtZUhhbmRsZSk7XHJcbiAgICAgICAgbGF0ZXN0RnJhbWVIYW5kbGUgPSAwO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGF0ZXN0RnJhbWVIYW5kbGUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShsYXRlc3RGcmFtZUhhbmRsZSk7XHJcbiAgICBzdGFydCgpO1xyXG59IiwiXHJcblxyXG5leHBvcnQgY2xhc3MgUmVuZGVyUGFzcyB7XHJcbiAgICBkZXZpY2U6IEdQVURldmljZTtcclxuICAgIGJpbmRHcm91cDogR1BVQmluZEdyb3VwO1xyXG4gICAgcGlwZWxpbmU6IEdQVVJlbmRlclBpcGVsaW5lO1xyXG4gICAgc2FtcGxlcjogR1BVU2FtcGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2U6IEdQVURldmljZSwgdGV4dHVyZUZvcm1hdDogR1BVVGV4dHVyZUZvcm1hdCkge1xyXG4gICAgICAgIGNvbnN0IHNoYWRlckNvZGUgPSBgXHJcbkBncm91cCgwKSBAYmluZGluZygwKSB2YXIgdGV4dHVyZUluOiB0ZXh0dXJlXzJkPGYzMj47XHJcbkBncm91cCgwKSBAYmluZGluZygxKSB2YXIgc2FtcGxlckluOiBzYW1wbGVyO1xyXG5cclxuc3RydWN0IFZlcnRleE91dCB7XHJcbiAgICBAYnVpbHRpbihwb3NpdGlvbikgcG9zaXRpb24gOiB2ZWM0ZixcclxuICAgIEBsb2NhdGlvbigwKSB1diA6IHZlYzJmLFxyXG59XHJcblxyXG5AdmVydGV4XHJcbmZuIHZlcnRleF9tYWluKEBidWlsdGluKHZlcnRleF9pbmRleCkgVmVydGV4SW5kZXg6IHUzMikgLT4gVmVydGV4T3V0XHJcbntcclxuICAgIHZhciB2ZXJ0aWNlcyA9IGFycmF5PHZlYzJmLCA2PihcclxuICAgIHZlYzIoLTEsIC0xKSxcclxuICAgIHZlYzIoMSwgLTEpLFxyXG4gICAgdmVjMigtMSwgMSksXHJcbiAgICB2ZWMyKDEsIDEpLFxyXG4gICAgdmVjMigxLCAtMSksXHJcbiAgICB2ZWMyKC0xLCAxKSxcclxuICAgICk7XHJcbiAgICB2YXIgdXZzID0gYXJyYXk8dmVjMmYsIDY+IChcclxuICAgIHZlYzIoMCwgMCksXHJcbiAgICB2ZWMyKDEsIDApLFxyXG4gICAgdmVjMigwLCAxKSxcclxuICAgIHZlYzIoMSwgMSksXHJcbiAgICB2ZWMyKDEsIDApLFxyXG4gICAgdmVjMigwLCAxKSxcclxuICAgICk7XHJcbiAgICB2YXIgb3V0cHV0IDogVmVydGV4T3V0O1xyXG4gICAgb3V0cHV0LnBvc2l0aW9uID0gdmVjNCh2ZXJ0aWNlc1tWZXJ0ZXhJbmRleF0sIDAsIDEpO1xyXG4gICAgb3V0cHV0LnV2ID0gdXZzW1ZlcnRleEluZGV4XTtcclxuICAgIFxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxufVxyXG5cclxuQGZyYWdtZW50XHJcbmZuIGZyYWdtZW50X21haW4oZnJhZ0RhdGE6IFZlcnRleE91dCkgLT4gQGxvY2F0aW9uKDApIHZlYzRmXHJcbntcclxuICAgIHJldHVybiB2ZWM0KHRleHR1cmVTYW1wbGUodGV4dHVyZUluLCBzYW1wbGVySW4sIGZyYWdEYXRhLnV2KS54eXosIDEpO1xyXG59YDtcclxuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcclxuICAgICAgICB0aGlzLnNhbXBsZXIgPSBkZXZpY2UuY3JlYXRlU2FtcGxlcih7XHJcbiAgICAgICAgICAgIG1pbkZpbHRlcjogXCJsaW5lYXJcIixcclxuICAgICAgICAgICAgbWFnRmlsdGVyOiBcImxpbmVhclwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlckJpbmRHcm91cExheW91dCA9IGRldmljZS5jcmVhdGVCaW5kR3JvdXBMYXlvdXQoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJSZW5kZXIgQmluZCBHcm91cCBMYXlvdXRcIixcclxuICAgICAgICAgICAgZW50cmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuRlJBR01FTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJyZWFkLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkZSQUdNRU5ULFxyXG4gICAgICAgICAgICAgICAgICAgIHNhbXBsZXI6IHRoaXMuc2FtcGxlcixcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSBhcyBHUFVCaW5kR3JvdXBMYXlvdXRFbnRyeVtdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclNoYWRlck1vZHVsZSA9IGRldmljZS5jcmVhdGVTaGFkZXJNb2R1bGUoe1xyXG4gICAgICAgICAgICBjb2RlOiBzaGFkZXJDb2RlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBkZXZpY2UuY3JlYXRlUmVuZGVyUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJSZW5kZXIgUGlwZWxpbmVcIixcclxuICAgICAgICAgICAgbGF5b3V0OiBkZXZpY2UuY3JlYXRlUGlwZWxpbmVMYXlvdXQoe1xyXG4gICAgICAgICAgICAgICAgYmluZEdyb3VwTGF5b3V0czogW3JlbmRlckJpbmRHcm91cExheW91dF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB2ZXJ0ZXg6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogcmVuZGVyU2hhZGVyTW9kdWxlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmcmFnbWVudDoge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiByZW5kZXJTaGFkZXJNb2R1bGUsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IG5hdmlnYXRvci5ncHUuZ2V0UHJlZmVycmVkQ2FudmFzRm9ybWF0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByaW1pdGl2ZToge1xyXG4gICAgICAgICAgICAgICAgdG9wb2xvZ3k6ICd0cmlhbmdsZS1saXN0JyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhc3MoY29tbWFuZEVuY29kZXI6IEdQVUNvbW1hbmRFbmNvZGVyLCBwaGVyb21vbmVUZXh0dXJlOiBHUFVUZXh0dXJlLCB0YXJnZXRWaWV3OiBHUFVUZXh0dXJlVmlldywgdGltZXN0YW1wV3JpdGVzPzogR1BVUmVuZGVyUGFzc1RpbWVzdGFtcFdyaXRlcyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclBhc3NEZXNjcmlwdG9yOiBHUFVSZW5kZXJQYXNzRGVzY3JpcHRvciA9IHtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50czogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IHRhcmdldFZpZXcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJWYWx1ZTogWzAsIDAsIDAsIDFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRPcDogJ2NsZWFyJyxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZU9wOiAnc3RvcmUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSBhcyBHUFVSZW5kZXJQYXNzQ29sb3JBdHRhY2htZW50W10sXHJcbiAgICAgICAgICAgIHRpbWVzdGFtcFdyaXRlc1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFRPRE8gLSBpcyByZWNyZWF0aW5nIHRoZSBiaW5kIGdyb3VwIHdpdGggYSB0ZXh0dXJlIHN3YXAgZmFzdGVyIHRoYW4gY29weWluZyB0ZXh0dXJlIGRhdGEgYmFjayBhbmQgZm9ydGg/XHJcbiAgICAgICAgdGhpcy5iaW5kR3JvdXAgPSB0aGlzLmRldmljZS5jcmVhdGVCaW5kR3JvdXAoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJSZW5kZXIgQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMucGlwZWxpbmUuZ2V0QmluZEdyb3VwTGF5b3V0KDApLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogcGhlcm9tb25lVGV4dHVyZS5jcmVhdGVWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHRoaXMuc2FtcGxlcixcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgcGFzc0VuY29kZXIgPSBjb21tYW5kRW5jb2Rlci5iZWdpblJlbmRlclBhc3MocmVuZGVyUGFzc0Rlc2NyaXB0b3IpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLnNldFBpcGVsaW5lKHRoaXMucGlwZWxpbmUpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLnNldEJpbmRHcm91cCgwLCB0aGlzLmJpbmRHcm91cCk7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuZHJhdyg2KTtcclxuICAgICAgICBwYXNzRW5jb2Rlci5lbmQoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGNvbmZpZyB9IGZyb20gXCIuLi9ub2RlX21vZHVsZXMvd2VicGFjay90eXBlc1wiO1xyXG5pbXBvcnQgeyB0b2dnbGVQYXVzZSwgcmVzZXQsIHN0YXJ0IH0gZnJvbSBcIi4vbWFpblwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2ltdWxhdGlvblBhcmFtZXRlcnMge1xyXG4gICAgYWdlbnRDb3VudDogbnVtYmVyXHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICB0dXJuSml0dGVyOiBudW1iZXIsXHJcbiAgICBzdGVlckZhY3RvcjogbnVtYmVyLFxyXG4gICAgc2FtcGxlRGlzdGFuY2U6IG51bWJlcixcclxuICAgIHBhc3NpdmVBdHRlbnVhdGlvbjogbnVtYmVyLFxyXG4gICAgZ2F1c3NpYW5TdGREZXY6IG51bWJlcixcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNpbXVsYXRpb25QYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnMgPSB7XHJcbiAgICBhZ2VudENvdW50OiAxMDBfMDAwLFxyXG4gICAgaGVpZ2h0OiAwLFxyXG4gICAgd2lkdGg6IDAsXHJcbiAgICB0dXJuSml0dGVyOiAwLFxyXG4gICAgc3RlZXJGYWN0b3I6IC41LFxyXG4gICAgc2FtcGxlRGlzdGFuY2U6IDUsXHJcbiAgICBwYXNzaXZlQXR0ZW51YXRpb246IDAuMDAxLFxyXG4gICAgZ2F1c3NpYW5TdGREZXY6IDAuNCxcclxufVxyXG5cclxuY29uc3QgY29uZmlnVGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbmZpZ1RhYmxlXCIpO1xyXG5sZXQgc2hvd0NvbmZpZyA9IGZhbHNlO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XHJcbiAgICBsZXQgc2hvd0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd1wiKTtcclxuICAgIHNob3dCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBpZiAoc2hvd0NvbmZpZykge1xyXG4gICAgICAgICAgICBzaG93Q29uZmlnID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbmZpZ1RhYmxlLmhpZGRlbiA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNob3dDb25maWcgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25maWdUYWJsZS5oaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgYWRkU2xpZGVyKFwiSml0dGVyXCIsIFwidHVybkppdHRlclwiLCAuNSwgMCwgMS41LCAuMDEpO1xyXG4gICAgYWRkU2xpZGVyKFwiU3RlZXJpbmdcIiwgXCJzdGVlckZhY3RvclwiLCAwLjI1LCAwLCAxLCAuMDEpO1xyXG4gICAgYWRkU2xpZGVyKFwiU2VlaW5nIERpc3RhbmNlXCIsIFwic2FtcGxlRGlzdGFuY2VcIiwgMTAsIDEsIDEwMCwgMSk7ICBcclxuICAgIGFkZFNsaWRlcihcIlBoZXJvbW9uZSBCbHVyXCIsIFwiZ2F1c3NpYW5TdGREZXZcIiwgMC4wNSwgMCwgLjUsIC4wMDUpO1xyXG4gICAgYWRkU2xpZGVyKFwiUGhlcm9tb25lIEZhZGVcIiwgXCJwYXNzaXZlQXR0ZW51YXRpb25cIiwgLjAwOCwgMC4wMDIsIC4wNSwgLjAwMSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXNldFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVzZXQpO1xyXG4gICAgbGV0IHBhdXNlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZVwiKTtcclxuICAgIHBhdXNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGlzUGxheWluZyA9IHRvZ2dsZVBhdXNlKCk7XHJcbiAgICAgICAgcGF1c2VCdXR0b24uaW5uZXJUZXh0ID0gaXNQbGF5aW5nID8gXCJQYXVzZVwiIDogXCJVbnBhdXNlXCI7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzdGFydCgpO1xyXG59KTsgXHJcblxyXG5mdW5jdGlvbiBhZGRTbGlkZXIobmFtZTogc3RyaW5nLCBjb25maWdLZXk6IGtleW9mKElTaW11bGF0aW9uUGFyYW1ldGVycyksaW5pdGlhbFZhbHVlOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlciwgc3RlcDogbnVtYmVyLCBvblVwZGF0ZT86ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNsaWRlckxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgc2xpZGVyTGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIG5hbWUpO1xyXG4gICAgc2xpZGVyTGFiZWwuaW5uZXJUZXh0ID0gbmFtZTtcclxuICAgIGNvbnN0IHNsaWRlcklucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgc2xpZGVySW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgbmFtZSk7XHJcbiAgICBzbGlkZXJJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicmFuZ2VcIik7XHJcbiAgICBzbGlkZXJJbnB1dC5zZXRBdHRyaWJ1dGUoXCJtaW5cIiwgU3RyaW5nKG1pbikpO1xyXG4gICAgc2xpZGVySW5wdXQuc2V0QXR0cmlidXRlKFwibWF4XCIsIFN0cmluZyhtYXgpKTtcclxuICAgIHNsaWRlcklucHV0LnNldEF0dHJpYnV0ZShcInN0ZXBcIiwgU3RyaW5nKHN0ZXApKTtcclxuICAgIHNsaWRlcklucHV0LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIFN0cmluZyhpbml0aWFsVmFsdWUpKTtcclxuICAgIGNvbnN0IHNsaWRlckRpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICAgIHRhYmxlUm93LmFwcGVuZChcclxuICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIikuYXBwZW5kQ2hpbGQoc2xpZGVyTGFiZWwpLnBhcmVudEVsZW1lbnQsXHJcbiAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpLmFwcGVuZENoaWxkKHNsaWRlcklucHV0KS5wYXJlbnRFbGVtZW50LFxyXG4gICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKS5hcHBlbmRDaGlsZChzbGlkZXJEaXNwbGF5KS5wYXJlbnRFbGVtZW50LFxyXG4gICAgKTtcclxuICAgIGNvbmZpZ1RhYmxlLmFwcGVuZENoaWxkKHRhYmxlUm93KTtcclxuXHJcbiAgICBpZiAob25VcGRhdGUpIHtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgIH1cclxuICAgIG9uVXBkYXRlID0gKCkgPT4ge1xyXG4gICAgICAgIHNpbXVsYXRpb25QYXJhbWV0ZXJzW2NvbmZpZ0tleV0gPSBOdW1iZXIoc2xpZGVySW5wdXQudmFsdWUpO1xyXG4gICAgICAgIHNsaWRlckRpc3BsYXkuaW5uZXJUZXh0ID0gc2xpZGVySW5wdXQudmFsdWU7XHJcbiAgICB9O1xyXG4gICAgb25VcGRhdGUoKTtcclxuICAgIHNsaWRlcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBvblVwZGF0ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBZ2VudHNBcnJheShwYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnMpOiBudW1iZXJbXSB7XHJcbiAgICBjb25zdCBhZ2VudHNBcnJheSA9IG5ldyBBcnJheSg0ICogcGFyYW1ldGVycy5hZ2VudENvdW50KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1ldGVycy5hZ2VudENvdW50ICogNDsgaSArPSA0KSB7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaV0gPSBwYXJhbWV0ZXJzLndpZHRoIC8gMjtcclxuICAgICAgICBhZ2VudHNBcnJheVtpKzFdID0gcGFyYW1ldGVycy5oZWlnaHQgLyAyO1xyXG4gICAgICAgIGFnZW50c0FycmF5W2krMl0gPSBNYXRoLnJhbmRvbSgpIC0gLjU7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaSszXSA9IE1hdGgucmFuZG9tKCkgLSAuNTtcclxuICAgIH1cclxuICAgIHJldHVybiBhZ2VudHNBcnJheTtcclxufSIsImltcG9ydCB7IElTaW11bGF0aW9uUGFyYW1ldGVycyB9IGZyb20gXCIuL3NpbXVsYXRpb25Db25maWdcIjtcclxuXHJcbmNvbnN0IFdPUktHUk9VUF9TSVpFID0gNjQ7XHJcblxyXG5leHBvcnQgY2xhc3MgU2ltdWxhdGlvblBhc3Mge1xyXG4gICAgZGV2aWNlOiBHUFVEZXZpY2U7XHJcbiAgICBwaGVyb21vbmVUZXh0dXJlOiBHUFVUZXh0dXJlO1xyXG4gICAgYWdlbnRzQnVmZmVyOiBHUFVCdWZmZXI7XHJcbiAgICBzaW11bGF0aW9uUGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzO1xyXG5cclxuICAgIHdvcmtncm91cHM6IG51bWJlcjtcclxuICAgIGJpbmRHcm91cDogR1BVQmluZEdyb3VwO1xyXG4gICAgdW5pZm9ybUJ1ZmZlcjogR1BVQnVmZmVyO1xyXG4gICAgcGlwZWxpbmU6IEdQVUNvbXB1dGVQaXBlbGluZTsgXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGV2aWNlOiBHUFVEZXZpY2UsIHNpbXVsYXRpb25QYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnMsIHRleHR1cmVGb3JtYXQ6IEdQVVRleHR1cmVGb3JtYXQsIGFnZW50c0J1ZmZlcjogR1BVQnVmZmVyKSB7XHJcbiAgICAgICAgY29uc3Qgc2hhZGVyQ29kZSA9IGBcclxuICAgICAgICAvLyBIYXNoIGZ1bmN0aW9uIGZyb20gSC4gU2NoZWNodGVyICYgUi4gQnJpZHNvbiwgZ29vLmdsL1JYaUthSFxyXG4gICAgICAgIGZuIEhhc2gocDogdTMyKSAtPiB1MzJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBzID0gcDsgXHJcbiAgICAgICAgICAgIHMgXj0gMjc0NzYzNjQxOXU7XHJcbiAgICAgICAgICAgIHMgKj0gMjY1NDQzNTc2OXU7XHJcbiAgICAgICAgICAgIHMgXj0gcyA+PiAxNjtcclxuICAgICAgICAgICAgcyAqPSAyNjU0NDM1NzY5dTtcclxuICAgICAgICAgICAgcyBePSBzID4+IDE2O1xyXG4gICAgICAgICAgICBzICo9IDI2NTQ0MzU3Njl1O1xyXG4gICAgICAgICAgICByZXR1cm4gcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZuIFJhbmRvbShzZWVkOiB1MzIpIC0+IGYzMlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGYzMihIYXNoKHNlZWQpKSAvIDQyOTQ5NjcyOTUuMDsgLy8gMl4zMi0xXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHJ1Y3QgVW5pZm9ybXMge1xyXG4gICAgICAgICAgICB0aW1lOiB1MzIsXHJcbiAgICAgICAgICAgIHNhbXBsZURpc3RhbmNlOiB1MzIsXHJcbiAgICAgICAgICAgIHR1cm5KaXR0ZXI6IGYzMixcclxuICAgICAgICAgICAgc3RlZXJGYWN0b3I6IGYzMixcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBncm91cCgwKSBAYmluZGluZygwKSB2YXI8dW5pZm9ybT4gdW5pZm9ybXM6IFVuaWZvcm1zO1xyXG5cclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMSkgdmFyIHRleHR1cmVPdXQ6IHRleHR1cmVfc3RvcmFnZV8yZDwke3RleHR1cmVGb3JtYXR9LCB3cml0ZT47XHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDIpIHZhcjxzdG9yYWdlLCByZWFkX3dyaXRlPiBhZ2VudHM6IGFycmF5PHZlYzRmLCAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnR9PjtcclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMykgdmFyIHRleHR1cmVJbjogdGV4dHVyZV9zdG9yYWdlXzJkPCR7dGV4dHVyZUZvcm1hdH0sIHJlYWQ+O1xyXG5cclxuICAgICAgICBjb25zdCBsZWZ0U2FtcGxlTWF0cml4ID0gIG1hdDJ4MigwLjg2NjAyNSwgMC41LCAtMC41LCAwLjg2NjAyNSk7XHJcbiAgICAgICAgY29uc3QgcmlnaHRTYW1wbGVNYXRyaXggPSBtYXQyeDIoMC44NjYwMjUsIC0wLjUsIDAuNSwgMC44NjYwMjUpO1xyXG4gICAgICAgIGZuIHNhbXBsZVBoZXJvbW9uZShwb3NpdGlvbjogdmVjMjxmMzI+LCBkaXJlY3Rpb246IHZlYzI8ZjMyPiwgc3RlcHM6IHUzMikgLT4gdmVjMzxmMzI+IHtcclxuICAgICAgICAgICAgbGV0IHNhbXBsZVN0YXJ0ID0gcG9zaXRpb24gKyBkaXJlY3Rpb24gKiAyO1xyXG4gICAgICAgICAgICB2YXIgc3VtID0gdmVjMygwLik7XHJcbiAgICAgICAgICAgIGxldCBmU3RlcHMgPSBmMzIoc3RlcHMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMC47IGkgPCBmU3RlcHM7IGkgKz0gMS4pIHtcclxuICAgICAgICAgICAgICAgIHN1bSArPSB0ZXh0dXJlTG9hZCh0ZXh0dXJlSW4sIHZlYzI8aTMyPihyb3VuZChzYW1wbGVTdGFydCArIGkgKiBkaXJlY3Rpb24pKSkueHl6O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAY29tcHV0ZSBAd29ya2dyb3VwX3NpemUoJHtXT1JLR1JPVVBfU0laRX0pXHJcbiAgICAgICAgZm4gc2ltdWxhdGUoQGJ1aWx0aW4oZ2xvYmFsX2ludm9jYXRpb25faWQpIGdsb2JhbF9pZDogdmVjMzx1MzI+KSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gZ2xvYmFsX2lkLng7XHJcbiAgICAgICAgLy8gVHJpbSBvZmYgdGhlIGV4Y2VzcyBpZiBhZ2VudENvdW50ICUgV09SS0dST1VQX1NJWkUgIT0gMFxyXG4gICAgICAgIGlmIChpbmRleCA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnR9KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhZ2VudCA9IGFnZW50c1tpbmRleF07XHJcblxyXG4gICAgICAgIGFnZW50LnggKz0gYWdlbnQuejtcclxuICAgICAgICBhZ2VudC55ICs9IGFnZW50Lnc7XHJcblxyXG4gICAgICAgIGlmIChhZ2VudC54ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGh9IHx8IGFnZW50LnggPCAwKSB7XHJcbiAgICAgICAgICAgIGFnZW50LnogPSAtYWdlbnQuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFnZW50LnkgPj0gJHtzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHR9IHx8IGFnZW50LnkgPCAwKSB7XHJcbiAgICAgICAgICAgIGFnZW50LncgPSAtYWdlbnQudztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYW5kb21EaXJDaGFuZ2UgPSB1bmlmb3Jtcy50dXJuSml0dGVyICogdmVjMihSYW5kb20odW5pZm9ybXMudGltZSArIGdsb2JhbF9pZC54KSAtIC41LCBSYW5kb20odW5pZm9ybXMudGltZSArIGdsb2JhbF9pZC54ICsgJHtzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHR9KSAtIC41KTtcclxuICAgICAgICB2YXIgdmVsb2NpdHkgPSBub3JtYWxpemUoYWdlbnQuencgKyByYW5kb21EaXJDaGFuZ2UpO1xyXG5cclxuICAgICAgICAvLyBUYWtlIHBoZXJvbW9uZSBzYW1wbGVzXHJcbiAgICAgICAgbGV0IHJpZ2h0U2FtcGxlRGlyID0gcmlnaHRTYW1wbGVNYXRyaXggKiB2ZWxvY2l0eTtcclxuICAgICAgICBsZXQgcmlnaHRTYW1wbGVQaXhlbCA9IHZlYzI8aTMyPihyb3VuZChhZ2VudC54eSArIDMgKiByaWdodFNhbXBsZURpcikpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmb3J3YXJkU2FtcGxlUGl4ZWwgPSB2ZWMyPGkzMj4ocm91bmQoYWdlbnQueHkgKyAzICogdmVsb2NpdHkpKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGxlZnRTYW1wbGVEaXIgPSBsZWZ0U2FtcGxlTWF0cml4ICogdmVsb2NpdHk7XHJcblxyXG4gICAgICAgIGxldCByaWdodFNhbXBsZSA9IHNhbXBsZVBoZXJvbW9uZShhZ2VudC54eSwgcmlnaHRTYW1wbGVEaXIsIHVuaWZvcm1zLnNhbXBsZURpc3RhbmNlKS54O1xyXG4gICAgICAgIGxldCBmb3J3YXJkU2FtcGxlID0gc2FtcGxlUGhlcm9tb25lKGFnZW50Lnh5LCB2ZWxvY2l0eSwgdW5pZm9ybXMuc2FtcGxlRGlzdGFuY2UpLng7XHJcbiAgICAgICAgbGV0IGxlZnRTYW1wbGUgPSBzYW1wbGVQaGVyb21vbmUoYWdlbnQueHksIGxlZnRTYW1wbGVEaXIsIHVuaWZvcm1zLnNhbXBsZURpc3RhbmNlKS54O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChmb3J3YXJkU2FtcGxlIDwgcmlnaHRTYW1wbGUgfHwgZm9yd2FyZFNhbXBsZSA8IGxlZnRTYW1wbGUpIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0U2FtcGxlID4gbGVmdFNhbXBsZSkge1xyXG4gICAgICAgICAgICAgICAgdmVsb2NpdHkgKz0gdW5pZm9ybXMuc3RlZXJGYWN0b3IgKiByaWdodFNhbXBsZURpcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZlbG9jaXR5ICs9IHVuaWZvcm1zLnN0ZWVyRmFjdG9yICogbGVmdFNhbXBsZURpcjtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmVsb2NpdHkgPSBub3JtYWxpemUodmVsb2NpdHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHBpeGVsID0gdmVjMjxpMzI+KHJvdW5kKGFnZW50Lnh5KSk7XHJcbiAgICAgICAgbGV0IGNvbG9yID0gdmVjMygwLjM5LCAwLjgyLCAwLjA2KTtcclxuICAgICAgICB0ZXh0dXJlU3RvcmUodGV4dHVyZU91dCwgcGl4ZWwsIHZlYzQoY29sb3IsIDEuKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYWdlbnQueiA9IHZlbG9jaXR5Lng7XHJcbiAgICAgICAgYWdlbnQudyA9IHZlbG9jaXR5Lnk7XHJcbiAgICAgICAgYWdlbnRzW2luZGV4XSA9IGFnZW50O1xyXG4gICAgICAgIH1gO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcclxuICAgICAgICB0aGlzLmFnZW50c0J1ZmZlciA9IGFnZW50c0J1ZmZlcjtcclxuICAgICAgICB0aGlzLndvcmtncm91cHMgPSBNYXRoLmNlaWwoc2ltdWxhdGlvblBhcmFtZXRlcnMuYWdlbnRDb3VudCAvIFdPUktHUk9VUF9TSVpFKTtcclxuICAgICAgICB0aGlzLnNpbXVsYXRpb25QYXJhbWV0ZXJzID0gc2ltdWxhdGlvblBhcmFtZXRlcnM7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVCaW5kR3JvdXBMYXlvdXQgPSBkZXZpY2UuY3JlYXRlQmluZEdyb3VwTGF5b3V0KHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInVuaWZvcm1cIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJ3cml0ZS1vbmx5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMixcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdG9yYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMyxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JhZ2VUZXh0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogdGV4dHVyZUZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBcInJlYWQtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVDb21wdXRlUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIFBpcGVsaW5lXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogZGV2aWNlLmNyZWF0ZVBpcGVsaW5lTGF5b3V0KHtcclxuICAgICAgICAgICAgICAgIGJpbmRHcm91cExheW91dHM6IFtjb21wdXRlQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNvbXB1dGU6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7Y29kZTogc2hhZGVyQ29kZX0pLFxyXG4gICAgICAgICAgICAgICAgZW50cnlQb2ludDogJ3NpbXVsYXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudW5pZm9ybUJ1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgICAgICBzaXplOiAxNixcclxuICAgICAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLlVOSUZPUk0gfCBHUFVCdWZmZXJVc2FnZS5DT1BZX0RTVFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhc3MoY29tbWFuZEVuY29kZXI6IEdQVUNvbW1hbmRFbmNvZGVyLCB0ZXh0dXJlSW46IEdQVVRleHR1cmUsIHRleHR1cmVPdXQ6IEdQVVRleHR1cmUsIHRpbWVzdGFtcFdyaXRlcz86IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB1bmlmb3JtSW50cyA9IG5ldyBVaW50MzJBcnJheShbXHJcbiAgICAgICAgICAgIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAqIDEwLFxyXG4gICAgICAgICAgICB0aGlzLnNpbXVsYXRpb25QYXJhbWV0ZXJzLnNhbXBsZURpc3RhbmNlLFxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtSW50cyxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdW5pZm9ybUludHMubGVuZ3RoLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgdW5pZm9ybUZsb2F0cyA9IG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICB0aGlzLnNpbXVsYXRpb25QYXJhbWV0ZXJzLnR1cm5KaXR0ZXIsXHJcbiAgICAgICAgICAgIHRoaXMuc2ltdWxhdGlvblBhcmFtZXRlcnMuc3RlZXJGYWN0b3JcclxuICAgICAgICBdKVxyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIHVuaWZvcm1JbnRzLmJ5dGVMZW5ndGgsXHJcbiAgICAgICAgICAgIHVuaWZvcm1GbG9hdHMsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHVuaWZvcm1GbG9hdHMubGVuZ3RoLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXBXcml0ZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMucGlwZWxpbmUuZ2V0QmluZEdyb3VwTGF5b3V0KDApLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogeyBidWZmZXI6IHRoaXMudW5pZm9ybUJ1ZmZlciB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0ZXh0dXJlT3V0LmNyZWF0ZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMixcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTp7IGJ1ZmZlcjogdGhpcy5hZ2VudHNCdWZmZXIgfSwgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHRleHR1cmVJbi5jcmVhdGVWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2ltdWxhdGVQYXNzID0gY29tbWFuZEVuY29kZXIuYmVnaW5Db21wdXRlUGFzcyhwYXNzRGVzY3JpcHRvcik7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLnNldFBpcGVsaW5lKHRoaXMucGlwZWxpbmUpO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5zZXRCaW5kR3JvdXAoMCwgdGhpcy5iaW5kR3JvdXApO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5kaXNwYXRjaFdvcmtncm91cHModGhpcy53b3JrZ3JvdXBzKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3MuZW5kKCk7XHJcbiAgICB9XHJcbn0iLCIvLyBpbXBvcnQgeyBtYXQzLCBNYXQzIH0gZnJvbSBcIndncHUtbWF0cml4XCI7XHJcbmltcG9ydCB7IE1hdDMsIG1hdDMgfSBmcm9tIFwid2dwdS1tYXRyaXhcIjtcclxuaW1wb3J0IHsgSVNpbXVsYXRpb25QYXJhbWV0ZXJzIH0gZnJvbSBcIi4vc2ltdWxhdGlvbkNvbmZpZ1wiO1xyXG5cclxuY29uc3QgV09SS0dST1VQX1NJWkUgPSA2NDtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXh0dXJlUGFzcyB7XHJcbiAgICBkZXZpY2U6IEdQVURldmljZTtcclxuICAgIHBoZXJvbW9uZVRleHR1cmVJbjogR1BVVGV4dHVyZTtcclxuICAgIHBoZXJvbW9uZVRleHR1cmVPdXQ6IEdQVVRleHR1cmU7XHJcblxyXG4gICAgd29ya2dyb3VwczogbnVtYmVyW107XHJcbiAgICBiaW5kR3JvdXA6IEdQVUJpbmRHcm91cDtcclxuICAgIHVuaWZvcm1CdWZmZXI6IEdQVUJ1ZmZlcjtcclxuICAgIHBpcGVsaW5lOiBHUFVDb21wdXRlUGlwZWxpbmU7XHJcbiAgICBcclxuICAgIHNpbXVsYXRpb25QYXJhbXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycztcclxuICAgIHByZXZHYXVzc2lhblN0ZERldjogbnVtYmVyO1xyXG4gICAga2VybmVsOiBNYXQzO1xyXG4gICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGV2aWNlOiBHUFVEZXZpY2UsIHNpbXVsYXRpb25QYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnMsIHBoZXJvbW9uZVRleHR1cmVGb3JtYXQ6IEdQVVRleHR1cmVGb3JtYXQpIHtcclxuICAgICAgICBjb25zdCBzaGFkZXJDb2RlID0gYFxyXG4gICAgICAgIHN0cnVjdCBVbmlmb3JtcyB7XHJcbiAgICAgICAgICAgIGJsdXJLZXJuZWw6IG1hdDN4MzxmMzI+LFxyXG4gICAgICAgICAgICBwYXNzaXZlQXR0ZW51YXRpb246IGYzMixcclxuICAgICAgICB9XHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhcjx1bmlmb3JtPiB1bmlmb3JtczogVW5pZm9ybXM7XHJcblxyXG4gICAgICAgIEBncm91cCgwKSBAYmluZGluZygxKSB2YXIgdGV4dHVyZUluOiB0ZXh0dXJlX3N0b3JhZ2VfMmQ8JHtwaGVyb21vbmVUZXh0dXJlRm9ybWF0fSwgcmVhZD47XHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDIpIHZhciB0ZXh0dXJlT3V0OiB0ZXh0dXJlX3N0b3JhZ2VfMmQ8JHtwaGVyb21vbmVUZXh0dXJlRm9ybWF0fSwgd3JpdGU+O1xyXG5cclxuICAgICAgICBAY29tcHV0ZSBAd29ya2dyb3VwX3NpemUoOCwgOClcclxuICAgICAgICBmbiBhdHRlbnVhdGUoQGJ1aWx0aW4oZ2xvYmFsX2ludm9jYXRpb25faWQpIGdsb2JhbF9pZDogdmVjMzx1MzI+KSB7XHJcbiAgICAgICAgICAgIGlmIChnbG9iYWxfaWQueCA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRofSB8fCBnbG9iYWxfaWQueSA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmhlaWdodH0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHBpeGVsID0gZ2xvYmFsX2lkLnh5O1xyXG4gICAgICAgICAgICB2YXIgY29sb3JTdW0gPSB2ZWMzKDAuKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBuZWlnaGJvcmluZyBwaXhlbHMgKDN4MyBrZXJuZWwpXHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IGkzMiA9IC0xOyBpIDw9IDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgajogaTMyID0gLTE7IGogPD0gMTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNhbXBsZVBpeGVsPSB2ZWMyKGkzMihnbG9iYWxfaWQueCkgKyBpLCBpMzIoZ2xvYmFsX2lkLnkpICsgaik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVuc3VyZSB3ZSBkb24ndCBzYW1wbGUgb3V0IG9mIGJvdW5kc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzYW1wbGVQaXhlbC54IDwgJHtzaW11bGF0aW9uUGFyYW1ldGVycy53aWR0aH0gJiYgc2FtcGxlUGl4ZWwueSA8ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0fSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2FtcGxlQ29sb3IgPSB0ZXh0dXJlTG9hZCh0ZXh0dXJlSW4sIHNhbXBsZVBpeGVsKS54eXo7IC8vIExvYWQgbmVpZ2hib3JpbmcgcGl4ZWwgY29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtlcm5lbEluZGV4ID0gKGkrMSkgKiAzICsgKGorMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yU3VtICs9IHNhbXBsZUNvbG9yICogdW5pZm9ybXMuYmx1cktlcm5lbFtpKzFdW2orMV07IC8vIEFwcGx5IEdhdXNzaWFuIGtlcm5lbFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29sb3JTdW0gPSBtYXgodmVjMygwLiksIGNvbG9yU3VtIC0gdmVjMyh1bmlmb3Jtcy5wYXNzaXZlQXR0ZW51YXRpb24pKTtcclxuXHJcbiAgICAgICAgICAgIHRleHR1cmVTdG9yZSh0ZXh0dXJlT3V0LCBwaXhlbCwgdmVjNChjb2xvclN1bSwgMS4wKSk7IC8vIFN0b3JlIGJsdXJyZWQgY29sb3JcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBgO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcclxuICAgICAgICB0aGlzLndvcmtncm91cHMgPSBbTWF0aC5jZWlsKHNpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRoIC8gOCksIE1hdGguY2VpbChzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHQgLyA4KV07XHJcblxyXG4gICAgICAgIHRoaXMuc2ltdWxhdGlvblBhcmFtdGVycyA9IHNpbXVsYXRpb25QYXJhbWV0ZXJzO1xyXG4gICAgICAgIHRoaXMucHJldkdhdXNzaWFuU3RkRGV2ID0gc2ltdWxhdGlvblBhcmFtZXRlcnMuZ2F1c3NpYW5TdGREZXY7XHJcbiAgICAgICAgdGhpcy5rZXJuZWwgPSBnZW5lcmF0ZUdhdXNzaWFuS2VybmVsKHNpbXVsYXRpb25QYXJhbWV0ZXJzLmdhdXNzaWFuU3RkRGV2LCAzKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgc2l6ZTogdGhpcy5rZXJuZWwuYnl0ZUxlbmd0aCArIDE2LFxyXG4gICAgICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuVU5JRk9STSB8IEdQVUJ1ZmZlclVzYWdlLkNPUFlfRFNUXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMua2VybmVsLmJ1ZmZlcixcclxuICAgICAgICAgICAgdGhpcy5rZXJuZWwuYnl0ZU9mZnNldCxcclxuICAgICAgICAgICAgdGhpcy5rZXJuZWwuYnl0ZUxlbmd0aCxcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIHRoaXMua2VybmVsLmJ5dGVMZW5ndGgsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW3RoaXMuc2ltdWxhdGlvblBhcmFtdGVycy5wYXNzaXZlQXR0ZW51YXRpb25dKSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVCaW5kR3JvdXBMYXlvdXQgPSBkZXZpY2UuY3JlYXRlQmluZEdyb3VwTGF5b3V0KHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInVuaWZvcm1cIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHBoZXJvbW9uZVRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJyZWFkLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZVRleHR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBwaGVyb21vbmVUZXh0dXJlRm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3M6IFwid3JpdGUtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVDb21wdXRlUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIFBpcGVsaW5lXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogZGV2aWNlLmNyZWF0ZVBpcGVsaW5lTGF5b3V0KHtcclxuICAgICAgICAgICAgICAgIGJpbmRHcm91cExheW91dHM6IFtjb21wdXRlQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNvbXB1dGU6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7Y29kZTogc2hhZGVyQ29kZX0pLFxyXG4gICAgICAgICAgICAgICAgZW50cnlQb2ludDogJ2F0dGVudWF0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhc3MoY29tbWFuZEVuY29kZXI6IEdQVUNvbW1hbmRFbmNvZGVyLCB0ZXh0dXJlSW46IEdQVVRleHR1cmUsIHRleHR1cmVPdXQ6IEdQVVRleHR1cmUsIHRpbWVzdGFtcFdyaXRlcz86IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zaW11bGF0aW9uUGFyYW10ZXJzLmdhdXNzaWFuU3RkRGV2ICE9IHRoaXMucHJldkdhdXNzaWFuU3RkRGV2KSB7XHJcbiAgICAgICAgICAgIHRoaXMua2VybmVsID0gZ2VuZXJhdGVHYXVzc2lhbktlcm5lbCh0aGlzLnNpbXVsYXRpb25QYXJhbXRlcnMuZ2F1c3NpYW5TdGREZXYsIDMpO1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgICAgIHRoaXMudW5pZm9ybUJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmtlcm5lbC5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmtlcm5lbC5ieXRlT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5rZXJuZWwuYnl0ZUxlbmd0aCxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kZXZpY2UucXVldWUud3JpdGVCdWZmZXIoXHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybUJ1ZmZlcixcclxuICAgICAgICAgICAgdGhpcy5rZXJuZWwuYnl0ZUxlbmd0aCxcclxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShbdGhpcy5zaW11bGF0aW9uUGFyYW10ZXJzLnBhc3NpdmVBdHRlbnVhdGlvbl0pLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAxXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBwYXNzRGVzY3JpcHRvciA9IHtcclxuICAgICAgICAgICAgdGltZXN0YW1wV3JpdGVzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMucGlwZWxpbmUuZ2V0QmluZEdyb3VwTGF5b3V0KDApLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogeyBidWZmZXI6IHRoaXMudW5pZm9ybUJ1ZmZlciB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0ZXh0dXJlSW4uY3JlYXRlVmlldygpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0ZXh0dXJlT3V0LmNyZWF0ZVZpZXcoKSwgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0gYXMgR1BVQmluZEdyb3VwRW50cnlbXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBzaW11bGF0ZVBhc3MgPSBjb21tYW5kRW5jb2Rlci5iZWdpbkNvbXB1dGVQYXNzKHBhc3NEZXNjcmlwdG9yKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3Muc2V0UGlwZWxpbmUodGhpcy5waXBlbGluZSk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLnNldEJpbmRHcm91cCgwLCB0aGlzLmJpbmRHcm91cCk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmRpc3BhdGNoV29ya2dyb3Vwcyh0aGlzLndvcmtncm91cHNbMF0sIHRoaXMud29ya2dyb3Vwc1sxXSk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmVuZCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZUdhdXNzaWFuS2VybmVsKHN0ZERldjogbnVtYmVyLCBzaXplOiBudW1iZXIpOiBNYXQzIHtcclxuICAgIGlmIChzaXplICUgMiAhPSAxKSB7XHJcbiAgICAgICAgdGhyb3cgKG5ldyBFcnJvcihcIkdhdXNzaWFuIEtlcm5lbCBzaXplIG11c3QgYmUgYW4gb2RkIG51bWJlclwiKSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBrZXJuZWwgPSBbXTtcclxuICAgIGNvbnN0IG9mZnNldCA9IE1hdGguZmxvb3Ioc2l6ZSAvIDIpO1xyXG4gICAgY29uc3QgVEFVID0gTWF0aC5QSTtcclxuICAgIGNvbnN0IHN0ZERldlNxciA9IChzdGREZXYrLjMpICoqIDI7XHJcbiAgICBsZXQgc3VtID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgeFNxciA9IChpIC0gb2Zmc2V0KSAqKiAyO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaSAqIHNpemUgKyBqO1xyXG4gICAgICAgICAgICBjb25zdCB5U3FyID0gKGogLSBvZmZzZXQpICoqIDI7XHJcbiAgICAgICAgICAgIGtlcm5lbFtpbmRleF0gPSAoMSAvICgyICogTWF0aC5QSSAqIHN0ZERldlNxcikpICogTWF0aC5leHAoLSh4U3FyICsgeVNxcikgLyAoMiAqIHN0ZERldlNxcikpO1xyXG4gICAgICAgICAgICBzdW0gKz0ga2VybmVsW2luZGV4XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgLy8gTm9ybWFsaXplIHRoZSBrZXJuZWxcclxuICAgIGxldCBuZXdTdW0gPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXJuZWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBrZXJuZWxbaV0gLz0gc3VtO1xyXG4gICAgICAgIG5ld1N1bSArPSBrZXJuZWxbaV07XHJcbiAgICB9XHJcbiAgICAvLyBFbnN1cmUgdGhlIGtlcm5lbCBzdW1zIHRvIDFcclxuICAgIGtlcm5lbFtvZmZzZXQgKiBzaXplICsgb2Zmc2V0XSArPSAxIC0gbmV3U3VtO1xyXG4gICAgLy8gY29uc29sZS5sb2coc3VtLCBuZXdTdW0pO1xyXG4gICAgLy8gY29uc29sZS5sb2coYCR7a2VybmVsWzBdLnRvRml4ZWQoNSl9LCAke2tlcm5lbFsxXS50b0ZpeGVkKDUpfSwgJHtrZXJuZWxbMl0udG9GaXhlZCg1KX1cXG5gLCBcclxuICAgIC8vICAgICAgICAgICAgIGAke2tlcm5lbFszXS50b0ZpeGVkKDUpfSwgJHtrZXJuZWxbNF0udG9GaXhlZCg1KX0sICR7a2VybmVsWzVdLnRvRml4ZWQoNSl9XFxuYCwgXHJcbiAgICAvLyAgICAgICAgICAgICBgJHtrZXJuZWxbNl0udG9GaXhlZCg1KX0sICR7a2VybmVsWzddLnRvRml4ZWQoNSl9LCAke2tlcm5lbFs4XS50b0ZpeGVkKDUpfWApO1xyXG4gICAgcmV0dXJuIG1hdDMuY3JlYXRlKGtlcm5lbFswXSwga2VybmVsWzFdLCBrZXJuZWxbMl0sIGtlcm5lbFszXSwga2VybmVsWzRdLCBrZXJuZWxbNV0sIGtlcm5lbFs2XSwga2VybmVsWzddLCBrZXJuZWxbOF0pO1xyXG4gICAgLy8gcmV0dXJuIG1hdDMuY3JlYXRlKDAsIDAsIDAsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCwgXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCk7XHJcbn0iLCIvKiB3Z3B1LW1hdHJpeEAzLjIuMCwgbGljZW5zZSBNSVQgKi9cbmZ1bmN0aW9uIHdyYXBDb25zdHJ1Y3RvcihPcmlnaW5hbENvbnN0cnVjdG9yLCBtb2RpZmllcikge1xuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIE9yaWdpbmFsQ29uc3RydWN0b3Ige1xuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgICAgIG1vZGlmaWVyKHRoaXMpO1xuICAgICAgICB9XG4gICAgfTsgLy8gVHlwZSBhc3NlcnRpb24gaXMgbmVjZXNzYXJ5IGhlcmVcbn1cbmNvbnN0IFplcm9BcnJheSA9IHdyYXBDb25zdHJ1Y3RvcigoQXJyYXkpLCBhID0+IGEuZmlsbCgwKSk7XG5cbi8qXG4gKiBDb3B5cmlnaHQgMjAyMiBHcmVnZyBUYXZhcmVzXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbiAqIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbiAqIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbiAqIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLFxuICogYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4gKiBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTFxuICogVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG4gKiBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSXG4gKiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cbmxldCBFUFNJTE9OID0gMC4wMDAwMDE7XG4vKipcbiAqIFNldCB0aGUgdmFsdWUgZm9yIEVQU0lMT04gZm9yIHZhcmlvdXMgY2hlY2tzXG4gKiBAcGFyYW0gdiAtIFZhbHVlIHRvIHVzZSBmb3IgRVBTSUxPTi5cbiAqIEByZXR1cm5zIHByZXZpb3VzIHZhbHVlIG9mIEVQU0lMT047XG4gKi9cbmZ1bmN0aW9uIHNldEVwc2lsb24odikge1xuICAgIGNvbnN0IG9sZCA9IEVQU0lMT047XG4gICAgRVBTSUxPTiA9IHY7XG4gICAgcmV0dXJuIG9sZDtcbn1cbi8qKlxuICogQ29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnNcbiAqIEBwYXJhbSBkZWdyZWVzIC0gQW5nbGUgaW4gZGVncmVlc1xuICogQHJldHVybnMgYW5nbGUgY29udmVydGVkIHRvIHJhZGlhbnNcbiAqL1xuZnVuY3Rpb24gZGVnVG9SYWQoZGVncmVlcykge1xuICAgIHJldHVybiBkZWdyZWVzICogTWF0aC5QSSAvIDE4MDtcbn1cbi8qKlxuICogQ29udmVydCByYWRpYW5zIHRvIGRlZ3JlZXNcbiAqIEBwYXJhbSByYWRpYW5zIC0gQW5nbGUgaW4gcmFkaWFuc1xuICogQHJldHVybnMgYW5nbGUgY29udmVydGVkIHRvIGRlZ3JlZXNcbiAqL1xuZnVuY3Rpb24gcmFkVG9EZWcocmFkaWFucykge1xuICAgIHJldHVybiByYWRpYW5zICogMTgwIC8gTWF0aC5QSTtcbn1cbi8qKlxuICogTGVycHMgYmV0d2VlbiBhIGFuZCBiIHZpYSB0XG4gKiBAcGFyYW0gYSAtIHN0YXJ0aW5nIHZhbHVlXG4gKiBAcGFyYW0gYiAtIGVuZGluZyB2YWx1ZVxuICogQHBhcmFtIHQgLSB2YWx1ZSB3aGVyZSAwID0gYSBhbmQgMSA9IGJcbiAqIEByZXR1cm5zIGEgKyAoYiAtIGEpICogdFxuICovXG5mdW5jdGlvbiBsZXJwKGEsIGIsIHQpIHtcbiAgICByZXR1cm4gYSArIChiIC0gYSkgKiB0O1xufVxuLyoqXG4gKiBDb21wdXRlIHRoZSBvcHBvc2l0ZSBvZiBsZXJwLiBHaXZlbiBhIGFuZCBiIGFuZCBhIHZhbHVlIGJldHdlZW5cbiAqIGEgYW5kIGIgcmV0dXJucyBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMS4gMCBpZiBhLCAxIGlmIGIuXG4gKiBOb3RlOiBubyBjbGFtcGluZyBpcyBkb25lLlxuICogQHBhcmFtIGEgLSBzdGFydCB2YWx1ZVxuICogQHBhcmFtIGIgLSBlbmQgdmFsdWVcbiAqIEBwYXJhbSB2IC0gdmFsdWUgYmV0d2VlbiBhIGFuZCBiXG4gKiBAcmV0dXJucyAodiAtIGEpIC8gKGIgLSBhKVxuICovXG5mdW5jdGlvbiBpbnZlcnNlTGVycChhLCBiLCB2KSB7XG4gICAgY29uc3QgZCA9IGIgLSBhO1xuICAgIHJldHVybiAoTWF0aC5hYnMoYiAtIGEpIDwgRVBTSUxPTilcbiAgICAgICAgPyBhXG4gICAgICAgIDogKHYgLSBhKSAvIGQ7XG59XG4vKipcbiAqIENvbXB1dGUgdGhlIGV1Y2xpZGVhbiBtb2R1bG9cbiAqXG4gKiBgYGBcbiAqIC8vIHRhYmxlIGZvciBuIC8gM1xuICogLTUsIC00LCAtMywgLTIsIC0xLCAgMCwgIDEsICAyLCAgMywgIDQsICA1ICAgPC0gblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAtMiAgLTEgIC0wICAtMiAgLTEgICAwLCAgMSwgIDIsICAwLCAgMSwgIDIgICA8LSBuICUgM1xuICogIDEgICAyICAgMCAgIDEgICAyICAgMCwgIDEsICAyLCAgMCwgIDEsICAyICAgPC0gZXVjbGlkZWFuTW9kdWxlKG4sIDMpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gbiAtIGRpdmlkZW5kXG4gKiBAcGFyYW0gbSAtIGRpdmlzb3JcbiAqIEByZXR1cm5zIHRoZSBldWNsaWRlYW4gbW9kdWxvIG9mIG4gLyBtXG4gKi9cbmZ1bmN0aW9uIGV1Y2xpZGVhbk1vZHVsbyhuLCBtKSB7XG4gICAgcmV0dXJuICgobiAlIG0pICsgbSkgJSBtO1xufVxuXG52YXIgdXRpbHMgPSB7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIGdldCBFUFNJTE9OICgpIHsgcmV0dXJuIEVQU0lMT047IH0sXG4gICAgZGVnVG9SYWQ6IGRlZ1RvUmFkLFxuICAgIGV1Y2xpZGVhbk1vZHVsbzogZXVjbGlkZWFuTW9kdWxvLFxuICAgIGludmVyc2VMZXJwOiBpbnZlcnNlTGVycCxcbiAgICBsZXJwOiBsZXJwLFxuICAgIHJhZFRvRGVnOiByYWRUb0RlZyxcbiAgICBzZXRFcHNpbG9uOiBzZXRFcHNpbG9uXG59O1xuXG4vKlxuICogQ29weXJpZ2h0IDIwMjIgR3JlZ2cgVGF2YXJlc1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4gKiBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksXG4gKiB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4gKiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSxcbiAqIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuICogU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTExcbiAqIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICogRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuICogREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4vKipcbiAqIEdlbmVyYXRlcyBhbSB0eXBlZCBBUEkgZm9yIFZlYzNcbiAqL1xuZnVuY3Rpb24gZ2V0QVBJSW1wbCQ1KEN0b3IpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgVmVjMjsgbWF5IGJlIGNhbGxlZCB3aXRoIHgsIHksIHogdG8gc2V0IGluaXRpYWwgdmFsdWVzLlxuICAgICAqXG4gICAgICogTm90ZTogU2luY2UgcGFzc2luZyBpbiBhIHJhdyBKYXZhU2NyaXB0IGFycmF5XG4gICAgICogaXMgdmFsaWQgaW4gYWxsIGNpcmN1bXN0YW5jZXMsIGlmIHlvdSB3YW50IHRvXG4gICAgICogZm9yY2UgYSBKYXZhU2NyaXB0IGFycmF5IGludG8gYSBWZWMyJ3Mgc3BlY2lmaWVkIHR5cGVcbiAgICAgKiBpdCB3b3VsZCBiZSBmYXN0ZXIgdG8gdXNlXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBjb25zdCB2ID0gdmVjMi5jbG9uZShzb21lSlNBcnJheSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0geCAtIEluaXRpYWwgeCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geSAtIEluaXRpYWwgeSB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyB0aGUgY3JlYXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGUoeCA9IDAsIHkgPSAwKSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IG5ldyBDdG9yKDIpO1xuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSB4O1xuICAgICAgICAgICAgaWYgKHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5ld0RzdFsxXSA9IHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIFZlYzI7IG1heSBiZSBjYWxsZWQgd2l0aCB4LCB5LCB6IHRvIHNldCBpbml0aWFsIHZhbHVlcy4gKHNhbWUgYXMgY3JlYXRlKVxuICAgICAqIEBwYXJhbSB4IC0gSW5pdGlhbCB4IHZhbHVlLlxuICAgICAqIEBwYXJhbSB5IC0gSW5pdGlhbCB5IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHRoZSBjcmVhdGVkIHZlY3RvclxuICAgICAqL1xuICAgIGNvbnN0IGZyb21WYWx1ZXMgPSBjcmVhdGU7XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWVzIG9mIGEgVmVjMlxuICAgICAqIEFsc28gc2VlIHtAbGluayB2ZWMyLmNyZWF0ZX0gYW5kIHtAbGluayB2ZWMyLmNvcHl9XG4gICAgICpcbiAgICAgKiBAcGFyYW0geCBmaXJzdCB2YWx1ZVxuICAgICAqIEBwYXJhbSB5IHNlY29uZCB2YWx1ZVxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3Igd2l0aCBpdHMgZWxlbWVudHMgc2V0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldCh4LCB5LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHg7XG4gICAgICAgIG5ld0RzdFsxXSA9IHk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgTWF0aC5jZWlsIHRvIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgY2VpbCBvZiBlYWNoIGVsZW1lbnQgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjZWlsKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5jZWlsKHZbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLmNlaWwodlsxXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgTWF0aC5mbG9vciB0byBlYWNoIGVsZW1lbnQgb2YgdmVjdG9yXG4gICAgICogQHBhcmFtIHYgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIGZsb29yIG9mIGVhY2ggZWxlbWVudCBvZiB2LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZsb29yKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5mbG9vcih2WzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5mbG9vcih2WzFdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXBwbGllcyBNYXRoLnJvdW5kIHRvIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgcm91bmQgb2YgZWFjaCBlbGVtZW50IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm91bmQodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLnJvdW5kKHZbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLnJvdW5kKHZbMV0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbGFtcCBlYWNoIGVsZW1lbnQgb2YgdmVjdG9yIGJldHdlZW4gbWluIGFuZCBtYXhcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBtYXggLSBNaW4gdmFsdWUsIGRlZmF1bHQgMFxuICAgICAqIEBwYXJhbSBtaW4gLSBNYXggdmFsdWUsIGRlZmF1bHQgMVxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCB0aGUgY2xhbXBlZCB2YWx1ZSBvZiBlYWNoIGVsZW1lbnQgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbGFtcCh2LCBtaW4gPSAwLCBtYXggPSAxLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCB2WzBdKSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCB2WzFdKSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgdHdvIHZlY3RvcnM7IGFzc3VtZXMgYSBhbmQgYiBoYXZlIHRoZSBzYW1lIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBzdW0gb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGQoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSArIGJbMV07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgdHdvIHZlY3RvcnMsIHNjYWxpbmcgdGhlIDJuZDsgYXNzdW1lcyBhIGFuZCBiIGhhdmUgdGhlIHNhbWUgZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gc2NhbGUgLSBBbW91bnQgdG8gc2NhbGUgYlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgc3VtIG9mIGEgKyBiICogc2NhbGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU2NhbGVkKGEsIGIsIHNjYWxlLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyBiWzBdICogc2NhbGU7XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyBiWzFdICogc2NhbGU7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGFuZ2xlIGluIHJhZGlhbnMgYmV0d2VlbiB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgVGhlIGFuZ2xlIGluIHJhZGlhbnMgYmV0d2VlbiB0aGUgMiB2ZWN0b3JzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFuZ2xlKGEsIGIpIHtcbiAgICAgICAgY29uc3QgYXggPSBhWzBdO1xuICAgICAgICBjb25zdCBheSA9IGFbMV07XG4gICAgICAgIGNvbnN0IGJ4ID0gYlswXTtcbiAgICAgICAgY29uc3QgYnkgPSBiWzFdO1xuICAgICAgICBjb25zdCBtYWcxID0gTWF0aC5zcXJ0KGF4ICogYXggKyBheSAqIGF5KTtcbiAgICAgICAgY29uc3QgbWFnMiA9IE1hdGguc3FydChieCAqIGJ4ICsgYnkgKiBieSk7XG4gICAgICAgIGNvbnN0IG1hZyA9IG1hZzEgKiBtYWcyO1xuICAgICAgICBjb25zdCBjb3NpbmUgPSBtYWcgJiYgZG90KGEsIGIpIC8gbWFnO1xuICAgICAgICByZXR1cm4gTWF0aC5hY29zKGNvc2luZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBkaWZmZXJlbmNlIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdIC0gYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBkaWZmZXJlbmNlIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3Qgc3ViID0gc3VidHJhY3Q7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgMiB2ZWN0b3JzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdmVjdG9ycyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVxdWFsc0FwcHJveGltYXRlbHkoYSwgYikge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYVswXSAtIGJbMF0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsxXSAtIGJbMV0pIDwgRVBTSUxPTjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgMiB2ZWN0b3JzIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdmVjdG9ycyBhcmUgZXhhY3RseSBlcXVhbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gICAgICAgIHJldHVybiBhWzBdID09PSBiWzBdICYmIGFbMV0gPT09IGJbMV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGxpbmVhciBpbnRlcnBvbGF0aW9uIG9uIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiBhbmQgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudCB0LCByZXR1cm5zXG4gICAgICogYSArIHQgKiAoYiAtIGEpLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gdCAtIEludGVycG9sYXRpb24gY29lZmZpY2llbnQuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbGluZWFyIGludGVycG9sYXRlZCByZXN1bHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVycChhLCBiLCB0LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyB0ICogKGJbMF0gLSBhWzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSArIHQgKiAoYlsxXSAtIGFbMV0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBsaW5lYXIgaW50ZXJwb2xhdGlvbiBvbiB0d28gdmVjdG9ycy5cbiAgICAgKiBHaXZlbiB2ZWN0b3JzIGEgYW5kIGIgYW5kIGludGVycG9sYXRpb24gY29lZmZpY2llbnQgdmVjdG9yIHQsIHJldHVybnNcbiAgICAgKiBhICsgdCAqIChiIC0gYSkuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB0IC0gSW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudHMgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIGxpbmVhciBpbnRlcnBvbGF0ZWQgcmVzdWx0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlcnBWKGEsIGIsIHQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSArIHRbMF0gKiAoYlswXSAtIGFbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICsgdFsxXSAqIChiWzFdIC0gYVsxXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBtYXggdmFsdWVzIG9mIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiByZXR1cm5zXG4gICAgICogW21heChhWzBdLCBiWzBdKSwgbWF4KGFbMV0sIGJbMV0pLCBtYXgoYVsyXSwgYlsyXSldLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBtYXggY29tcG9uZW50cyB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWF4KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5tYXgoYVswXSwgYlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgubWF4KGFbMV0sIGJbMV0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gbWluIHZhbHVlcyBvZiB0d28gdmVjdG9ycy5cbiAgICAgKiBHaXZlbiB2ZWN0b3JzIGEgYW5kIGIgcmV0dXJuc1xuICAgICAqIFttaW4oYVswXSwgYlswXSksIG1pbihhWzFdLCBiWzFdKSwgbWluKGFbMl0sIGJbMl0pXS5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbWluIGNvbXBvbmVudHMgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1pbihhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGgubWluKGFbMF0sIGJbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLm1pbihhWzFdLCBiWzFdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsU2NhbGFyKHYsIGssIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXSAqIGs7XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV0gKiBrO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGEgc2NhbGFyLiAoc2FtZSBhcyBtdWxTY2FsYXIpXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBrIC0gVGhlIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGNvbnN0IHNjYWxlID0gbXVsU2NhbGFyO1xuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBrIC0gVGhlIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdlNjYWxhcih2LCBrLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF0gLyBrO1xuICAgICAgICBuZXdEc3RbMV0gPSB2WzFdIC8gaztcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW52ZXJzZSBhIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgaW52ZXJ0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludmVyc2UodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSAxIC8gdlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gMSAvIHZbMV07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludmVydCBhIHZlY3Rvci4gKHNhbWUgYXMgaW52ZXJzZSlcbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgaW52ZXJ0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGNvbnN0IGludmVydCA9IGludmVyc2U7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnM7IGFzc3VtZXMgYm90aCB2ZWN0b3JzIGhhdmVcbiAgICAgKiB0aHJlZSBlbnRyaWVzLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3Igb2YgYSBjcm9zcyBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyb3NzKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgeiA9IGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF07XG4gICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IHo7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjdG9yczsgYXNzdW1lcyBib3RoIHZlY3RvcnMgaGF2ZVxuICAgICAqIHRocmVlIGVudHJpZXMuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGRvdCBwcm9kdWN0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZG90KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBsZW5ndGggb2YgdmVjdG9yXG4gICAgICogQHBhcmFtIHYgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgbGVuZ3RoIG9mIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsZW5ndGgodikge1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh2MCAqIHYwICsgdjEgKiB2MSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBsZW5ndGggb2YgdmVjdG9yIChzYW1lIGFzIGxlbmd0aClcbiAgICAgKiBAcGFyYW0gdiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBsZW5ndGggb2YgdmVjdG9yLlxuICAgICAqL1xuICAgIGNvbnN0IGxlbiA9IGxlbmd0aDtcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgdmVjdG9yXG4gICAgICogQHBhcmFtIHYgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlbmd0aFNxKHYpIHtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIHJldHVybiB2MCAqIHYwICsgdjEgKiB2MTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHZlY3RvciAoc2FtZSBhcyBsZW5ndGhTcSlcbiAgICAgKiBAcGFyYW0gdiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiB2ZWN0b3IuXG4gICAgICovXG4gICAgY29uc3QgbGVuU3EgPSBsZW5ndGhTcTtcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgZGlzdGFuY2UgYmV0d2VlbiAyIHBvaW50c1xuICAgICAqIEBwYXJhbSBhIC0gdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpc3RhbmNlKGEsIGIpIHtcbiAgICAgICAgY29uc3QgZHggPSBhWzBdIC0gYlswXTtcbiAgICAgICAgY29uc3QgZHkgPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzIChzYW1lIGFzIGRpc3RhbmNlKVxuICAgICAqIEBwYXJhbSBhIC0gdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGNvbnN0IGRpc3QgPSBkaXN0YW5jZTtcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXN0YW5jZVNxKGEsIGIpIHtcbiAgICAgICAgY29uc3QgZHggPSBhWzBdIC0gYlswXTtcbiAgICAgICAgY29uc3QgZHkgPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzIChzYW1lIGFzIGRpc3RhbmNlU3EpXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAgICAgKi9cbiAgICBjb25zdCBkaXN0U3EgPSBkaXN0YW5jZVNxO1xuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgaXRzIEV1Y2xpZGVhbiBsZW5ndGggYW5kIHJldHVybnMgdGhlIHF1b3RpZW50LlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBub3JtYWxpemVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBub3JtYWxpemUodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgY29uc3QgbGVuID0gTWF0aC5zcXJ0KHYwICogdjAgKyB2MSAqIHYxKTtcbiAgICAgICAgaWYgKGxlbiA+IDAuMDAwMDEpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IHYwIC8gbGVuO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gdjEgLyBsZW47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBOZWdhdGVzIGEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIC12LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5lZ2F0ZSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IC12WzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSAtdlsxXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29waWVzIGEgdmVjdG9yLiAoc2FtZSBhcyB7QGxpbmsgdmVjMi5jbG9uZX0pXG4gICAgICogQWxzbyBzZWUge0BsaW5rIHZlYzIuY3JlYXRlfSBhbmQge0BsaW5rIHZlYzIuc2V0fVxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgY29weSBvZiB2LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcHkodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSB2WzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSB2WzFdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9uZXMgYSB2ZWN0b3IuIChzYW1lIGFzIHtAbGluayB2ZWMyLmNvcHl9KVxuICAgICAqIEFsc28gc2VlIHtAbGluayB2ZWMyLmNyZWF0ZX0gYW5kIHtAbGluayB2ZWMyLnNldH1cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIGNvcHkgb2Ygdi5cbiAgICAgKi9cbiAgICBjb25zdCBjbG9uZSA9IGNvcHk7XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIG9mIHByb2R1Y3RzIG9mIGVudHJpZXMgb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtdWx0aXBseShhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKiBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICogYlsxXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC4gKHNhbWUgYXMgbXVsKVxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3Igb2YgcHJvZHVjdHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGNvbnN0IG11bCA9IG11bHRpcGx5O1xuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYW5vdGhlciB2ZWN0b3IgKGNvbXBvbmVudC13aXNlKTsgYXNzdW1lcyBhIGFuZFxuICAgICAqIGIgaGF2ZSB0aGUgc2FtZSBsZW5ndGguXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBxdW90aWVudHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdmlkZShhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gLyBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdIC8gYlsxXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC4gKHNhbWUgYXMgZGl2aWRlKVxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3Igb2YgcXVvdGllbnRzIG9mIGVudHJpZXMgb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBjb25zdCBkaXYgPSBkaXZpZGU7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHJhbmRvbSB1bml0IHZlY3RvciAqIHNjYWxlXG4gICAgICogQHBhcmFtIHNjYWxlIC0gRGVmYXVsdCAxXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcmFuZG9tIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByYW5kb20oc2NhbGUgPSAxLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLmNvcyhhbmdsZSkgKiBzY2FsZTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5zaW4oYW5nbGUpICogc2NhbGU7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFplcm8ncyBhIHZlY3RvclxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHplcm9lZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gemVybyhkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHRyYW5zZm9ybSBWZWMyIGJ5IDR4NCBtYXRyaXhcbiAgICAgKiBAcGFyYW0gdiAtIHRoZSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG9wdGlvbmFsIFZlYzIgdG8gc3RvcmUgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1NYXQ0KHYsIG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgY29uc3QgeCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHkgPSB2WzFdO1xuICAgICAgICBuZXdEc3RbMF0gPSB4ICogbVswXSArIHkgKiBtWzRdICsgbVsxMl07XG4gICAgICAgIG5ld0RzdFsxXSA9IHggKiBtWzFdICsgeSAqIG1bNV0gKyBtWzEzXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNmb3JtcyB2ZWM0IGJ5IDN4MyBtYXRyaXhcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2IC0gdGhlIHZlY3RvclxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gb3B0aW9uYWwgVmVjMiB0byBzdG9yZSByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybU1hdDModiwgbSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMikpO1xuICAgICAgICBjb25zdCB4ID0gdlswXTtcbiAgICAgICAgY29uc3QgeSA9IHZbMV07XG4gICAgICAgIG5ld0RzdFswXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWzhdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVs5XTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlIGEgMkQgdmVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYSBUaGUgdmVjMiBwb2ludCB0byByb3RhdGVcbiAgICAgKiBAcGFyYW0gYiBUaGUgb3JpZ2luIG9mIHRoZSByb3RhdGlvblxuICAgICAqIEBwYXJhbSByYWQgVGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGluIHJhZGlhbnNcbiAgICAgKiBAcmV0dXJucyB0aGUgcm90YXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGUoYSwgYiwgcmFkLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIC8vIFRyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gICAgICAgIGNvbnN0IHAwID0gYVswXSAtIGJbMF07XG4gICAgICAgIGNvbnN0IHAxID0gYVsxXSAtIGJbMV07XG4gICAgICAgIGNvbnN0IHNpbkMgPSBNYXRoLnNpbihyYWQpO1xuICAgICAgICBjb25zdCBjb3NDID0gTWF0aC5jb3MocmFkKTtcbiAgICAgICAgLy9wZXJmb3JtIHJvdGF0aW9uIGFuZCB0cmFuc2xhdGUgdG8gY29ycmVjdCBwb3NpdGlvblxuICAgICAgICBuZXdEc3RbMF0gPSBwMCAqIGNvc0MgLSBwMSAqIHNpbkMgKyBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBwMCAqIHNpbkMgKyBwMSAqIGNvc0MgKyBiWzFdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmVhdCBhIDJEIHZlY3RvciBhcyBhIGRpcmVjdGlvbiBhbmQgc2V0IGl0J3MgbGVuZ3RoXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYSBUaGUgdmVjMiB0byBsZW5ndGhlblxuICAgICAqIEBwYXJhbSBsZW4gVGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHZlY3RvclxuICAgICAqIEByZXR1cm5zIFRoZSBsZW5ndGhlbmVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldExlbmd0aChhLCBsZW4sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDIpKTtcbiAgICAgICAgbm9ybWFsaXplKGEsIG5ld0RzdCk7XG4gICAgICAgIHJldHVybiBtdWxTY2FsYXIobmV3RHN0LCBsZW4sIG5ld0RzdCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVuc3VyZSBhIHZlY3RvciBpcyBub3QgbG9uZ2VyIHRoYW4gYSBtYXggbGVuZ3RoXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYSBUaGUgdmVjMiB0byBsaW1pdFxuICAgICAqIEBwYXJhbSBtYXhMZW4gVGhlIGxvbmdlc3QgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgdmVjdG9yXG4gICAgICogQHJldHVybnMgVGhlIHZlY3Rvciwgc2hvcnRlbmVkIHRvIG1heExlbiBpZiBpdCdzIHRvbyBsb25nXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJ1bmNhdGUoYSwgbWF4TGVuLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIGlmIChsZW5ndGgoYSkgPiBtYXhMZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBzZXRMZW5ndGgoYSwgbWF4TGVuLCBuZXdEc3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3B5KGEsIG5ld0RzdCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgdmVjdG9yIGV4YWN0bHkgYmV0d2VlbiAyIGVuZHBvaW50IHZlY3RvcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIEVuZHBvaW50IDFcbiAgICAgKiBAcGFyYW0gYiBFbmRwb2ludCAyXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBleGFjdGx5IHJlc2lkaW5nIGJldHdlZW4gZW5kcG9pbnRzIDEgYW5kIDJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtaWRwb2ludChhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigyKSk7XG4gICAgICAgIHJldHVybiBsZXJwKGEsIGIsIDAuNSwgbmV3RHN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlLFxuICAgICAgICBmcm9tVmFsdWVzLFxuICAgICAgICBzZXQsXG4gICAgICAgIGNlaWwsXG4gICAgICAgIGZsb29yLFxuICAgICAgICByb3VuZCxcbiAgICAgICAgY2xhbXAsXG4gICAgICAgIGFkZCxcbiAgICAgICAgYWRkU2NhbGVkLFxuICAgICAgICBhbmdsZSxcbiAgICAgICAgc3VidHJhY3QsXG4gICAgICAgIHN1YixcbiAgICAgICAgZXF1YWxzQXBwcm94aW1hdGVseSxcbiAgICAgICAgZXF1YWxzLFxuICAgICAgICBsZXJwLFxuICAgICAgICBsZXJwVixcbiAgICAgICAgbWF4LFxuICAgICAgICBtaW4sXG4gICAgICAgIG11bFNjYWxhcixcbiAgICAgICAgc2NhbGUsXG4gICAgICAgIGRpdlNjYWxhcixcbiAgICAgICAgaW52ZXJzZSxcbiAgICAgICAgaW52ZXJ0LFxuICAgICAgICBjcm9zcyxcbiAgICAgICAgZG90LFxuICAgICAgICBsZW5ndGgsXG4gICAgICAgIGxlbixcbiAgICAgICAgbGVuZ3RoU3EsXG4gICAgICAgIGxlblNxLFxuICAgICAgICBkaXN0YW5jZSxcbiAgICAgICAgZGlzdCxcbiAgICAgICAgZGlzdGFuY2VTcSxcbiAgICAgICAgZGlzdFNxLFxuICAgICAgICBub3JtYWxpemUsXG4gICAgICAgIG5lZ2F0ZSxcbiAgICAgICAgY29weSxcbiAgICAgICAgY2xvbmUsXG4gICAgICAgIG11bHRpcGx5LFxuICAgICAgICBtdWwsXG4gICAgICAgIGRpdmlkZSxcbiAgICAgICAgZGl2LFxuICAgICAgICByYW5kb20sXG4gICAgICAgIHplcm8sXG4gICAgICAgIHRyYW5zZm9ybU1hdDQsXG4gICAgICAgIHRyYW5zZm9ybU1hdDMsXG4gICAgICAgIHJvdGF0ZSxcbiAgICAgICAgc2V0TGVuZ3RoLFxuICAgICAgICB0cnVuY2F0ZSxcbiAgICAgICAgbWlkcG9pbnQsXG4gICAgfTtcbn1cbmNvbnN0IGNhY2hlJDUgPSBuZXcgTWFwKCk7XG5mdW5jdGlvbiBnZXRBUEkkNShDdG9yKSB7XG4gICAgbGV0IGFwaSA9IGNhY2hlJDUuZ2V0KEN0b3IpO1xuICAgIGlmICghYXBpKSB7XG4gICAgICAgIGFwaSA9IGdldEFQSUltcGwkNShDdG9yKTtcbiAgICAgICAgY2FjaGUkNS5zZXQoQ3RvciwgYXBpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwaTtcbn1cblxuLypcbiAqIENvcHlyaWdodCAyMDIyIEdyZWdnIFRhdmFyZXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICogY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuICogdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuICogdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuLyoqXG4gKiBHZW5lcmF0ZXMgYW0gdHlwZWQgQVBJIGZvciBWZWMzXG4gKiAqL1xuZnVuY3Rpb24gZ2V0QVBJSW1wbCQ0KEN0b3IpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgdmVjMzsgbWF5IGJlIGNhbGxlZCB3aXRoIHgsIHksIHogdG8gc2V0IGluaXRpYWwgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB4IC0gSW5pdGlhbCB4IHZhbHVlLlxuICAgICAqIEBwYXJhbSB5IC0gSW5pdGlhbCB5IHZhbHVlLlxuICAgICAqIEBwYXJhbSB6IC0gSW5pdGlhbCB6IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHRoZSBjcmVhdGVkIHZlY3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZSh4LCB5LCB6KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IG5ldyBDdG9yKDMpO1xuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSB4O1xuICAgICAgICAgICAgaWYgKHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5ld0RzdFsxXSA9IHk7XG4gICAgICAgICAgICAgICAgaWYgKHogIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdEc3RbMl0gPSB6O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgdmVjMzsgbWF5IGJlIGNhbGxlZCB3aXRoIHgsIHksIHogdG8gc2V0IGluaXRpYWwgdmFsdWVzLiAoc2FtZSBhcyBjcmVhdGUpXG4gICAgICogQHBhcmFtIHggLSBJbml0aWFsIHggdmFsdWUuXG4gICAgICogQHBhcmFtIHkgLSBJbml0aWFsIHkgdmFsdWUuXG4gICAgICogQHBhcmFtIHogLSBJbml0aWFsIHogdmFsdWUuXG4gICAgICogQHJldHVybnMgdGhlIGNyZWF0ZWQgdmVjdG9yXG4gICAgICovXG4gICAgY29uc3QgZnJvbVZhbHVlcyA9IGNyZWF0ZTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZXMgb2YgYSBWZWMzXG4gICAgICogQWxzbyBzZWUge0BsaW5rIHZlYzMuY3JlYXRlfSBhbmQge0BsaW5rIHZlYzMuY29weX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IGZpcnN0IHZhbHVlXG4gICAgICogQHBhcmFtIHkgc2Vjb25kIHZhbHVlXG4gICAgICogQHBhcmFtIHogdGhpcmQgdmFsdWVcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHdpdGggaXRzIGVsZW1lbnRzIHNldC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQoeCwgeSwgeiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSB4O1xuICAgICAgICBuZXdEc3RbMV0gPSB5O1xuICAgICAgICBuZXdEc3RbMl0gPSB6O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIE1hdGguY2VpbCB0byBlYWNoIGVsZW1lbnQgb2YgdmVjdG9yXG4gICAgICogQHBhcmFtIHYgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIGNlaWwgb2YgZWFjaCBlbGVtZW50IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2VpbCh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGguY2VpbCh2WzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5jZWlsKHZbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLmNlaWwodlsyXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgTWF0aC5mbG9vciB0byBlYWNoIGVsZW1lbnQgb2YgdmVjdG9yXG4gICAgICogQHBhcmFtIHYgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIGZsb29yIG9mIGVhY2ggZWxlbWVudCBvZiB2LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZsb29yKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5mbG9vcih2WzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5mbG9vcih2WzFdKTtcbiAgICAgICAgbmV3RHN0WzJdID0gTWF0aC5mbG9vcih2WzJdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXBwbGllcyBNYXRoLnJvdW5kIHRvIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgcm91bmQgb2YgZWFjaCBlbGVtZW50IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm91bmQodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLnJvdW5kKHZbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLnJvdW5kKHZbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLnJvdW5kKHZbMl0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbGFtcCBlYWNoIGVsZW1lbnQgb2YgdmVjdG9yIGJldHdlZW4gbWluIGFuZCBtYXhcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBtYXggLSBNaW4gdmFsdWUsIGRlZmF1bHQgMFxuICAgICAqIEBwYXJhbSBtaW4gLSBNYXggdmFsdWUsIGRlZmF1bHQgMVxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCB0aGUgY2xhbXBlZCB2YWx1ZSBvZiBlYWNoIGVsZW1lbnQgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbGFtcCh2LCBtaW4gPSAwLCBtYXggPSAxLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCB2WzBdKSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCB2WzFdKSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCB2WzJdKSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgdHdvIHZlY3RvcnM7IGFzc3VtZXMgYSBhbmQgYiBoYXZlIHRoZSBzYW1lIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBzdW0gb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGQoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSArIGJbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IGFbMl0gKyBiWzJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIHR3byB2ZWN0b3JzLCBzY2FsaW5nIHRoZSAybmQ7IGFzc3VtZXMgYSBhbmQgYiBoYXZlIHRoZSBzYW1lIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHNjYWxlIC0gQW1vdW50IHRvIHNjYWxlIGJcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIHN1bSBvZiBhICsgYiAqIHNjYWxlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFNjYWxlZChhLCBiLCBzY2FsZSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgYlswXSAqIHNjYWxlO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICsgYlsxXSAqIHNjYWxlO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdICsgYlsyXSAqIHNjYWxlO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBhbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIFRoZSBhbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdGhlIDIgdmVjdG9ycy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbmdsZShhLCBiKSB7XG4gICAgICAgIGNvbnN0IGF4ID0gYVswXTtcbiAgICAgICAgY29uc3QgYXkgPSBhWzFdO1xuICAgICAgICBjb25zdCBheiA9IGFbMl07XG4gICAgICAgIGNvbnN0IGJ4ID0gYlswXTtcbiAgICAgICAgY29uc3QgYnkgPSBiWzFdO1xuICAgICAgICBjb25zdCBieiA9IGJbMl07XG4gICAgICAgIGNvbnN0IG1hZzEgPSBNYXRoLnNxcnQoYXggKiBheCArIGF5ICogYXkgKyBheiAqIGF6KTtcbiAgICAgICAgY29uc3QgbWFnMiA9IE1hdGguc3FydChieCAqIGJ4ICsgYnkgKiBieSArIGJ6ICogYnopO1xuICAgICAgICBjb25zdCBtYWcgPSBtYWcxICogbWFnMjtcbiAgICAgICAgY29uc3QgY29zaW5lID0gbWFnICYmIGRvdChhLCBiKSAvIG1hZztcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhjb3NpbmUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgZGlmZmVyZW5jZSBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSAtIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdIC0gYlsyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIHR3byB2ZWN0b3JzLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIGRpZmZlcmVuY2Ugb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBjb25zdCBzdWIgPSBzdWJ0cmFjdDtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIHZlY3RvcnMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWxcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB2ZWN0b3JzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzQXBwcm94aW1hdGVseShhLCBiKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhWzBdIC0gYlswXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzFdIC0gYlsxXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzJdIC0gYlsyXSkgPCBFUFNJTE9OO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIHZlY3RvcnMgYXJlIGV4YWN0bHkgZXF1YWxcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB2ZWN0b3JzIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGFbMF0gPT09IGJbMF0gJiYgYVsxXSA9PT0gYlsxXSAmJiBhWzJdID09PSBiWzJdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBsaW5lYXIgaW50ZXJwb2xhdGlvbiBvbiB0d28gdmVjdG9ycy5cbiAgICAgKiBHaXZlbiB2ZWN0b3JzIGEgYW5kIGIgYW5kIGludGVycG9sYXRpb24gY29lZmZpY2llbnQgdCwgcmV0dXJuc1xuICAgICAqIGEgKyB0ICogKGIgLSBhKS5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHQgLSBJbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50LlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGxpbmVhciBpbnRlcnBvbGF0ZWQgcmVzdWx0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlcnAoYSwgYiwgdCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgdCAqIChiWzBdIC0gYVswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyB0ICogKGJbMV0gLSBhWzFdKTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSArIHQgKiAoYlsyXSAtIGFbMl0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBsaW5lYXIgaW50ZXJwb2xhdGlvbiBvbiB0d28gdmVjdG9ycy5cbiAgICAgKiBHaXZlbiB2ZWN0b3JzIGEgYW5kIGIgYW5kIGludGVycG9sYXRpb24gY29lZmZpY2llbnQgdmVjdG9yIHQsIHJldHVybnNcbiAgICAgKiBhICsgdCAqIChiIC0gYSkuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB0IC0gSW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudHMgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIGxpbmVhciBpbnRlcnBvbGF0ZWQgcmVzdWx0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlcnBWKGEsIGIsIHQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSArIHRbMF0gKiAoYlswXSAtIGFbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICsgdFsxXSAqIChiWzFdIC0gYVsxXSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IGFbMl0gKyB0WzJdICogKGJbMl0gLSBhWzJdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIG1heCB2YWx1ZXMgb2YgdHdvIHZlY3RvcnMuXG4gICAgICogR2l2ZW4gdmVjdG9ycyBhIGFuZCBiIHJldHVybnNcbiAgICAgKiBbbWF4KGFbMF0sIGJbMF0pLCBtYXgoYVsxXSwgYlsxXSksIG1heChhWzJdLCBiWzJdKV0uXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1heCBjb21wb25lbnRzIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYXgoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLm1heChhWzBdLCBiWzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5tYXgoYVsxXSwgYlsxXSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGgubWF4KGFbMl0sIGJbMl0pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gbWluIHZhbHVlcyBvZiB0d28gdmVjdG9ycy5cbiAgICAgKiBHaXZlbiB2ZWN0b3JzIGEgYW5kIGIgcmV0dXJuc1xuICAgICAqIFttaW4oYVswXSwgYlswXSksIG1pbihhWzFdLCBiWzFdKSwgbWluKGFbMl0sIGJbMl0pXS5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbWluIGNvbXBvbmVudHMgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1pbihhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGgubWluKGFbMF0sIGJbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLm1pbihhWzFdLCBiWzFdKTtcbiAgICAgICAgbmV3RHN0WzJdID0gTWF0aC5taW4oYVsyXSwgYlsyXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBrIC0gVGhlIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG11bFNjYWxhcih2LCBrLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF0gKiBrO1xuICAgICAgICBuZXdEc3RbMV0gPSB2WzFdICogaztcbiAgICAgICAgbmV3RHN0WzJdID0gdlsyXSAqIGs7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIuIChzYW1lIGFzIG11bFNjYWxhcilcbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgY29uc3Qgc2NhbGUgPSBtdWxTY2FsYXI7XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2U2NhbGFyKHYsIGssIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXSAvIGs7XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV0gLyBrO1xuICAgICAgICBuZXdEc3RbMl0gPSB2WzJdIC8gaztcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW52ZXJzZSBhIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgaW52ZXJ0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludmVyc2UodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSAxIC8gdlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gMSAvIHZbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IDEgLyB2WzJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnZlcnQgYSB2ZWN0b3IuIChzYW1lIGFzIGludmVyc2UpXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGludmVydGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBjb25zdCBpbnZlcnQgPSBpbnZlcnNlO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzOyBhc3N1bWVzIGJvdGggdmVjdG9ycyBoYXZlXG4gICAgICogdGhyZWUgZW50cmllcy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIG9mIGEgY3Jvc3MgYi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcm9zcyhhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIGNvbnN0IHQxID0gYVsyXSAqIGJbMF0gLSBhWzBdICogYlsyXTtcbiAgICAgICAgY29uc3QgdDIgPSBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzFdICogYlsyXSAtIGFbMl0gKiBiWzFdO1xuICAgICAgICBuZXdEc3RbMV0gPSB0MTtcbiAgICAgICAgbmV3RHN0WzJdID0gdDI7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjdG9yczsgYXNzdW1lcyBib3RoIHZlY3RvcnMgaGF2ZVxuICAgICAqIHRocmVlIGVudHJpZXMuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGRvdCBwcm9kdWN0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZG90KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIChhWzBdICogYlswXSkgKyAoYVsxXSAqIGJbMV0pICsgKGFbMl0gKiBiWzJdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGxlbmd0aCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBsZW5ndGggb2YgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlbmd0aCh2KSB7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodjAgKiB2MCArIHYxICogdjEgKyB2MiAqIHYyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGxlbmd0aCBvZiB2ZWN0b3IgKHNhbWUgYXMgbGVuZ3RoKVxuICAgICAqIEBwYXJhbSB2IC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGxlbmd0aCBvZiB2ZWN0b3IuXG4gICAgICovXG4gICAgY29uc3QgbGVuID0gbGVuZ3RoO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVuZ3RoU3Eodikge1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgY29uc3QgdjIgPSB2WzJdO1xuICAgICAgICByZXR1cm4gdjAgKiB2MCArIHYxICogdjEgKyB2MiAqIHYyO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgdmVjdG9yIChzYW1lIGFzIGxlbmd0aFNxKVxuICAgICAqIEBwYXJhbSB2IC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHZlY3Rvci5cbiAgICAgKi9cbiAgICBjb25zdCBsZW5TcSA9IGxlbmd0aFNxO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGlzdGFuY2UoYSwgYikge1xuICAgICAgICBjb25zdCBkeCA9IGFbMF0gLSBiWzBdO1xuICAgICAgICBjb25zdCBkeSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICBjb25zdCBkeiA9IGFbMl0gLSBiWzJdO1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5ICsgZHogKiBkeik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzIChzYW1lIGFzIGRpc3RhbmNlKVxuICAgICAqIEBwYXJhbSBhIC0gdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGNvbnN0IGRpc3QgPSBkaXN0YW5jZTtcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXN0YW5jZVNxKGEsIGIpIHtcbiAgICAgICAgY29uc3QgZHggPSBhWzBdIC0gYlswXTtcbiAgICAgICAgY29uc3QgZHkgPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgY29uc3QgZHogPSBhWzJdIC0gYlsyXTtcbiAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5ICsgZHogKiBkejtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIHNxdWFyZSBvZiB0aGUgZGlzdGFuY2UgYmV0d2VlbiAyIHBvaW50cyAoc2FtZSBhcyBkaXN0YW5jZVNxKVxuICAgICAqIEBwYXJhbSBhIC0gdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHNxdWFyZSBvZiB0aGUgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gICAgICovXG4gICAgY29uc3QgZGlzdFNxID0gZGlzdGFuY2VTcTtcbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIGEgdmVjdG9yIGJ5IGl0cyBFdWNsaWRlYW4gbGVuZ3RoIGFuZCByZXR1cm5zIHRoZSBxdW90aWVudC5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbm9ybWFsaXplZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHYyID0gdlsyXTtcbiAgICAgICAgY29uc3QgbGVuID0gTWF0aC5zcXJ0KHYwICogdjAgKyB2MSAqIHYxICsgdjIgKiB2Mik7XG4gICAgICAgIGlmIChsZW4gPiAwLjAwMDAxKSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSB2MCAvIGxlbjtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IHYxIC8gbGVuO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gdjIgLyBsZW47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTmVnYXRlcyBhIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyAtdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBuZWdhdGUodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSAtdlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gLXZbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IC12WzJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgYSB2ZWN0b3IuIChzYW1lIGFzIHtAbGluayB2ZWMzLmNsb25lfSlcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgdmVjMy5jcmVhdGV9IGFuZCB7QGxpbmsgdmVjMy5zZXR9XG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBjb3B5IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29weSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHZbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHZbMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsb25lcyBhIHZlY3Rvci4gKHNhbWUgYXMge0BsaW5rIHZlYzMuY29weX0pXG4gICAgICogQWxzbyBzZWUge0BsaW5rIHZlYzMuY3JlYXRlfSBhbmQge0BsaW5rIHZlYzMuc2V0fVxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgY29weSBvZiB2LlxuICAgICAqL1xuICAgIGNvbnN0IGNsb25lID0gY29weTtcbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGFub3RoZXIgdmVjdG9yIChjb21wb25lbnQtd2lzZSk7IGFzc3VtZXMgYSBhbmRcbiAgICAgKiBiIGhhdmUgdGhlIHNhbWUgbGVuZ3RoLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3Igb2YgcHJvZHVjdHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSAqIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKiBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdICogYlsyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC4gKHNhbWUgYXMgbXVsKVxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3Igb2YgcHJvZHVjdHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGNvbnN0IG11bCA9IG11bHRpcGx5O1xuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYW5vdGhlciB2ZWN0b3IgKGNvbXBvbmVudC13aXNlKTsgYXNzdW1lcyBhIGFuZFxuICAgICAqIGIgaGF2ZSB0aGUgc2FtZSBsZW5ndGguXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBxdW90aWVudHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdmlkZShhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gLyBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdIC8gYlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSAvIGJbMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYW5vdGhlciB2ZWN0b3IgKGNvbXBvbmVudC13aXNlKTsgYXNzdW1lcyBhIGFuZFxuICAgICAqIGIgaGF2ZSB0aGUgc2FtZSBsZW5ndGguIChzYW1lIGFzIGRpdmlkZSlcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIG9mIHF1b3RpZW50cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3QgZGl2ID0gZGl2aWRlO1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSByYW5kb20gdmVjdG9yXG4gICAgICogQHBhcmFtIHNjYWxlIC0gRGVmYXVsdCAxXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcmFuZG9tIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByYW5kb20oc2NhbGUgPSAxLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgICAgICBjb25zdCB6ID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xuICAgICAgICBjb25zdCB6U2NhbGUgPSBNYXRoLnNxcnQoMSAtIHogKiB6KSAqIHNjYWxlO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLmNvcyhhbmdsZSkgKiB6U2NhbGU7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGguc2luKGFuZ2xlKSAqIHpTY2FsZTtcbiAgICAgICAgbmV3RHN0WzJdID0geiAqIHNjYWxlO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBaZXJvJ3MgYSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB6ZXJvZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHplcm8oZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBuZXdEc3RbMF0gPSAwO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB0cmFuc2Zvcm0gdmVjMyBieSA0eDQgbWF0cml4XG4gICAgICogQHBhcmFtIHYgLSB0aGUgdmVjdG9yXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBvcHRpb25hbCB2ZWMzIHRvIHN0b3JlIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgdmVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtTWF0NCh2LCBtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIGNvbnN0IHggPSB2WzBdO1xuICAgICAgICBjb25zdCB5ID0gdlsxXTtcbiAgICAgICAgY29uc3QgeiA9IHZbMl07XG4gICAgICAgIGNvbnN0IHcgPSAobVszXSAqIHggKyBtWzddICogeSArIG1bMTFdICogeiArIG1bMTVdKSB8fCAxO1xuICAgICAgICBuZXdEc3RbMF0gPSAobVswXSAqIHggKyBtWzRdICogeSArIG1bOF0gKiB6ICsgbVsxMl0pIC8gdztcbiAgICAgICAgbmV3RHN0WzFdID0gKG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWzldICogeiArIG1bMTNdKSAvIHc7XG4gICAgICAgIG5ld0RzdFsyXSA9IChtWzJdICogeCArIG1bNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0pIC8gdztcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNmb3JtIHZlYzMgYnkgdXBwZXIgM3gzIG1hdHJpeCBpbnNpZGUgNHg0IG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSBkaXJlY3Rpb24uXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBvcHRpb25hbCB2ZWMzIHRvIHN0b3JlIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdHJhbnNmb3JtZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybU1hdDRVcHBlcjN4Myh2LCBtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIG5ld0RzdFswXSA9IHYwICogbVswICogNCArIDBdICsgdjEgKiBtWzEgKiA0ICsgMF0gKyB2MiAqIG1bMiAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzFdID0gdjAgKiBtWzAgKiA0ICsgMV0gKyB2MSAqIG1bMSAqIDQgKyAxXSArIHYyICogbVsyICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbMl0gPSB2MCAqIG1bMCAqIDQgKyAyXSArIHYxICogbVsxICogNCArIDJdICsgdjIgKiBtWzIgKiA0ICsgMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgdmVjMyBieSAzeDMgbWF0cml4XG4gICAgICpcbiAgICAgKiBAcGFyYW0gdiAtIHRoZSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG9wdGlvbmFsIHZlYzMgdG8gc3RvcmUgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1NYXQzKHYsIG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgeCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHkgPSB2WzFdO1xuICAgICAgICBjb25zdCB6ID0gdlsyXTtcbiAgICAgICAgbmV3RHN0WzBdID0geCAqIG1bMF0gKyB5ICogbVs0XSArIHogKiBtWzhdO1xuICAgICAgICBuZXdEc3RbMV0gPSB4ICogbVsxXSArIHkgKiBtWzVdICsgeiAqIG1bOV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHggKiBtWzJdICsgeSAqIG1bNl0gKyB6ICogbVsxMF07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgdmVjMyBieSBRdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIHYgLSB0aGUgdmVjdG9yIHRvIHRyYW5zZm9ybVxuICAgICAqIEBwYXJhbSBxIC0gdGhlIHF1YXRlcm5pb24gdG8gdHJhbnNmb3JtIGJ5XG4gICAgICogQHBhcmFtIGRzdCAtIG9wdGlvbmFsIHZlYzMgdG8gc3RvcmUgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybVF1YXQodiwgcSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBjb25zdCBxeCA9IHFbMF07XG4gICAgICAgIGNvbnN0IHF5ID0gcVsxXTtcbiAgICAgICAgY29uc3QgcXogPSBxWzJdO1xuICAgICAgICBjb25zdCB3MiA9IHFbM10gKiAyO1xuICAgICAgICBjb25zdCB4ID0gdlswXTtcbiAgICAgICAgY29uc3QgeSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHogPSB2WzJdO1xuICAgICAgICBjb25zdCB1dlggPSBxeSAqIHogLSBxeiAqIHk7XG4gICAgICAgIGNvbnN0IHV2WSA9IHF6ICogeCAtIHF4ICogejtcbiAgICAgICAgY29uc3QgdXZaID0gcXggKiB5IC0gcXkgKiB4O1xuICAgICAgICBuZXdEc3RbMF0gPSB4ICsgdXZYICogdzIgKyAocXkgKiB1dlogLSBxeiAqIHV2WSkgKiAyO1xuICAgICAgICBuZXdEc3RbMV0gPSB5ICsgdXZZICogdzIgKyAocXogKiB1dlggLSBxeCAqIHV2WikgKiAyO1xuICAgICAgICBuZXdEc3RbMl0gPSB6ICsgdXZaICogdzIgKyAocXggKiB1dlkgLSBxeSAqIHV2WCkgKiAyO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2xhdGlvbiBjb21wb25lbnQgb2YgYSA0LWJ5LTQgbWF0cml4IGFzIGEgdmVjdG9yIHdpdGggM1xuICAgICAqIGVudHJpZXMuXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHRyYW5zbGF0aW9uIGNvbXBvbmVudCBvZiBtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFRyYW5zbGF0aW9uKG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gbVsxMl07XG4gICAgICAgIG5ld0RzdFsxXSA9IG1bMTNdO1xuICAgICAgICBuZXdEc3RbMl0gPSBtWzE0XTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBheGlzIG9mIGEgNHg0IG1hdHJpeCBhcyBhIHZlY3RvciB3aXRoIDMgZW50cmllc1xuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYXhpcyAtIFRoZSBheGlzIDAgPSB4LCAxID0geSwgMiA9IHo7XG4gICAgICogQHJldHVybnMgVGhlIGF4aXMgY29tcG9uZW50IG9mIG0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QXhpcyhtLCBheGlzLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIGNvbnN0IG9mZiA9IGF4aXMgKiA0O1xuICAgICAgICBuZXdEc3RbMF0gPSBtW29mZiArIDBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtW29mZiArIDFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBtW29mZiArIDJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzY2FsaW5nIGNvbXBvbmVudCBvZiB0aGUgbWF0cml4XG4gICAgICogQHBhcmFtIG0gLSBUaGUgTWF0cml4XG4gICAgICogQHBhcmFtIGRzdCAtIFRoZSB2ZWN0b3IgdG8gc2V0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFNjYWxpbmcobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBjb25zdCB4eCA9IG1bMF07XG4gICAgICAgIGNvbnN0IHh5ID0gbVsxXTtcbiAgICAgICAgY29uc3QgeHogPSBtWzJdO1xuICAgICAgICBjb25zdCB5eCA9IG1bNF07XG4gICAgICAgIGNvbnN0IHl5ID0gbVs1XTtcbiAgICAgICAgY29uc3QgeXogPSBtWzZdO1xuICAgICAgICBjb25zdCB6eCA9IG1bOF07XG4gICAgICAgIGNvbnN0IHp5ID0gbVs5XTtcbiAgICAgICAgY29uc3QgenogPSBtWzEwXTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5zcXJ0KHh4ICogeHggKyB4eSAqIHh5ICsgeHogKiB4eik7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGguc3FydCh5eCAqIHl4ICsgeXkgKiB5eSArIHl6ICogeXopO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLnNxcnQoenggKiB6eCArIHp5ICogenkgKyB6eiAqIHp6KTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlIGEgM0QgdmVjdG9yIGFyb3VuZCB0aGUgeC1heGlzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gYSBUaGUgdmVjMyBwb2ludCB0byByb3RhdGVcbiAgICAgKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gYiBUaGUgb3JpZ2luIG9mIHRoZSByb3RhdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgVGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIHZlY3RvciB0byBzZXQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIHJvdGF0ZWQgdmVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlWChhLCBiLCByYWQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgcCA9IFtdO1xuICAgICAgICBjb25zdCByID0gW107XG4gICAgICAgIC8vVHJhbnNsYXRlIHBvaW50IHRvIHRoZSBvcmlnaW5cbiAgICAgICAgcFswXSA9IGFbMF0gLSBiWzBdO1xuICAgICAgICBwWzFdID0gYVsxXSAtIGJbMV07XG4gICAgICAgIHBbMl0gPSBhWzJdIC0gYlsyXTtcbiAgICAgICAgLy9wZXJmb3JtIHJvdGF0aW9uXG4gICAgICAgIHJbMF0gPSBwWzBdO1xuICAgICAgICByWzFdID0gcFsxXSAqIE1hdGguY29zKHJhZCkgLSBwWzJdICogTWF0aC5zaW4ocmFkKTtcbiAgICAgICAgclsyXSA9IHBbMV0gKiBNYXRoLnNpbihyYWQpICsgcFsyXSAqIE1hdGguY29zKHJhZCk7XG4gICAgICAgIC8vdHJhbnNsYXRlIHRvIGNvcnJlY3QgcG9zaXRpb25cbiAgICAgICAgbmV3RHN0WzBdID0gclswXSArIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHJbMV0gKyBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSByWzJdICsgYlsyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlIGEgM0QgdmVjdG9yIGFyb3VuZCB0aGUgeS1heGlzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gYSBUaGUgdmVjMyBwb2ludCB0byByb3RhdGVcbiAgICAgKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gYiBUaGUgb3JpZ2luIG9mIHRoZSByb3RhdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgVGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIHZlY3RvciB0byBzZXQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIHJvdGF0ZWQgdmVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlWShhLCBiLCByYWQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgY29uc3QgcCA9IFtdO1xuICAgICAgICBjb25zdCByID0gW107XG4gICAgICAgIC8vIHRyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gICAgICAgIHBbMF0gPSBhWzBdIC0gYlswXTtcbiAgICAgICAgcFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICBwWzJdID0gYVsyXSAtIGJbMl07XG4gICAgICAgIC8vIHBlcmZvcm0gcm90YXRpb25cbiAgICAgICAgclswXSA9IHBbMl0gKiBNYXRoLnNpbihyYWQpICsgcFswXSAqIE1hdGguY29zKHJhZCk7XG4gICAgICAgIHJbMV0gPSBwWzFdO1xuICAgICAgICByWzJdID0gcFsyXSAqIE1hdGguY29zKHJhZCkgLSBwWzBdICogTWF0aC5zaW4ocmFkKTtcbiAgICAgICAgLy8gdHJhbnNsYXRlIHRvIGNvcnJlY3QgcG9zaXRpb25cbiAgICAgICAgbmV3RHN0WzBdID0gclswXSArIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHJbMV0gKyBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSByWzJdICsgYlsyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlIGEgM0QgdmVjdG9yIGFyb3VuZCB0aGUgei1heGlzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gYSBUaGUgdmVjMyBwb2ludCB0byByb3RhdGVcbiAgICAgKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gYiBUaGUgb3JpZ2luIG9mIHRoZSByb3RhdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgVGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIHZlY3RvciB0byBzZXQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0ZVooYSwgYiwgcmFkLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigzKSk7XG4gICAgICAgIGNvbnN0IHAgPSBbXTtcbiAgICAgICAgY29uc3QgciA9IFtdO1xuICAgICAgICAvLyB0cmFuc2xhdGUgcG9pbnQgdG8gdGhlIG9yaWdpblxuICAgICAgICBwWzBdID0gYVswXSAtIGJbMF07XG4gICAgICAgIHBbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgcFsyXSA9IGFbMl0gLSBiWzJdO1xuICAgICAgICAvLyBwZXJmb3JtIHJvdGF0aW9uXG4gICAgICAgIHJbMF0gPSBwWzBdICogTWF0aC5jb3MocmFkKSAtIHBbMV0gKiBNYXRoLnNpbihyYWQpO1xuICAgICAgICByWzFdID0gcFswXSAqIE1hdGguc2luKHJhZCkgKyBwWzFdICogTWF0aC5jb3MocmFkKTtcbiAgICAgICAgclsyXSA9IHBbMl07XG4gICAgICAgIC8vIHRyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG4gICAgICAgIG5ld0RzdFswXSA9IHJbMF0gKyBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSByWzFdICsgYlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gclsyXSArIGJbMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyZWF0IGEgM0QgdmVjdG9yIGFzIGEgZGlyZWN0aW9uIGFuZCBzZXQgaXQncyBsZW5ndGhcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIFRoZSB2ZWMzIHRvIGxlbmd0aGVuXG4gICAgICogQHBhcmFtIGxlbiBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgdmVjdG9yXG4gICAgICogQHJldHVybnMgVGhlIGxlbmd0aGVuZWQgdmVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0TGVuZ3RoKGEsIGxlbiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMykpO1xuICAgICAgICBub3JtYWxpemUoYSwgbmV3RHN0KTtcbiAgICAgICAgcmV0dXJuIG11bFNjYWxhcihuZXdEc3QsIGxlbiwgbmV3RHN0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW5zdXJlIGEgdmVjdG9yIGlzIG5vdCBsb25nZXIgdGhhbiBhIG1heCBsZW5ndGhcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIFRoZSB2ZWMzIHRvIGxpbWl0XG4gICAgICogQHBhcmFtIG1heExlbiBUaGUgbG9uZ2VzdCBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyB2ZWN0b3JcbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yLCBzaG9ydGVuZWQgdG8gbWF4TGVuIGlmIGl0J3MgdG9vIGxvbmdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cnVuY2F0ZShhLCBtYXhMZW4sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgaWYgKGxlbmd0aChhKSA+IG1heExlbikge1xuICAgICAgICAgICAgcmV0dXJuIHNldExlbmd0aChhLCBtYXhMZW4sIG5ld0RzdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcHkoYSwgbmV3RHN0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSB2ZWN0b3IgZXhhY3RseSBiZXR3ZWVuIDIgZW5kcG9pbnQgdmVjdG9yc1xuICAgICAqXG4gICAgICogQHBhcmFtIGEgRW5kcG9pbnQgMVxuICAgICAqIEBwYXJhbSBiIEVuZHBvaW50IDJcbiAgICAgKiBAcmV0dXJucyBUaGUgdmVjdG9yIGV4YWN0bHkgcmVzaWRpbmcgYmV0d2VlbiBlbmRwb2ludHMgMSBhbmQgMlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1pZHBvaW50KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDMpKTtcbiAgICAgICAgcmV0dXJuIGxlcnAoYSwgYiwgMC41LCBuZXdEc3QpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGUsXG4gICAgICAgIGZyb21WYWx1ZXMsXG4gICAgICAgIHNldCxcbiAgICAgICAgY2VpbCxcbiAgICAgICAgZmxvb3IsXG4gICAgICAgIHJvdW5kLFxuICAgICAgICBjbGFtcCxcbiAgICAgICAgYWRkLFxuICAgICAgICBhZGRTY2FsZWQsXG4gICAgICAgIGFuZ2xlLFxuICAgICAgICBzdWJ0cmFjdCxcbiAgICAgICAgc3ViLFxuICAgICAgICBlcXVhbHNBcHByb3hpbWF0ZWx5LFxuICAgICAgICBlcXVhbHMsXG4gICAgICAgIGxlcnAsXG4gICAgICAgIGxlcnBWLFxuICAgICAgICBtYXgsXG4gICAgICAgIG1pbixcbiAgICAgICAgbXVsU2NhbGFyLFxuICAgICAgICBzY2FsZSxcbiAgICAgICAgZGl2U2NhbGFyLFxuICAgICAgICBpbnZlcnNlLFxuICAgICAgICBpbnZlcnQsXG4gICAgICAgIGNyb3NzLFxuICAgICAgICBkb3QsXG4gICAgICAgIGxlbmd0aCxcbiAgICAgICAgbGVuLFxuICAgICAgICBsZW5ndGhTcSxcbiAgICAgICAgbGVuU3EsXG4gICAgICAgIGRpc3RhbmNlLFxuICAgICAgICBkaXN0LFxuICAgICAgICBkaXN0YW5jZVNxLFxuICAgICAgICBkaXN0U3EsXG4gICAgICAgIG5vcm1hbGl6ZSxcbiAgICAgICAgbmVnYXRlLFxuICAgICAgICBjb3B5LFxuICAgICAgICBjbG9uZSxcbiAgICAgICAgbXVsdGlwbHksXG4gICAgICAgIG11bCxcbiAgICAgICAgZGl2aWRlLFxuICAgICAgICBkaXYsXG4gICAgICAgIHJhbmRvbSxcbiAgICAgICAgemVybyxcbiAgICAgICAgdHJhbnNmb3JtTWF0NCxcbiAgICAgICAgdHJhbnNmb3JtTWF0NFVwcGVyM3gzLFxuICAgICAgICB0cmFuc2Zvcm1NYXQzLFxuICAgICAgICB0cmFuc2Zvcm1RdWF0LFxuICAgICAgICBnZXRUcmFuc2xhdGlvbixcbiAgICAgICAgZ2V0QXhpcyxcbiAgICAgICAgZ2V0U2NhbGluZyxcbiAgICAgICAgcm90YXRlWCxcbiAgICAgICAgcm90YXRlWSxcbiAgICAgICAgcm90YXRlWixcbiAgICAgICAgc2V0TGVuZ3RoLFxuICAgICAgICB0cnVuY2F0ZSxcbiAgICAgICAgbWlkcG9pbnQsXG4gICAgfTtcbn1cbmNvbnN0IGNhY2hlJDQgPSBuZXcgTWFwKCk7XG5mdW5jdGlvbiBnZXRBUEkkNChDdG9yKSB7XG4gICAgbGV0IGFwaSA9IGNhY2hlJDQuZ2V0KEN0b3IpO1xuICAgIGlmICghYXBpKSB7XG4gICAgICAgIGFwaSA9IGdldEFQSUltcGwkNChDdG9yKTtcbiAgICAgICAgY2FjaGUkNC5zZXQoQ3RvciwgYXBpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwaTtcbn1cblxuLypcbiAqIENvcHlyaWdodCAyMDIyIEdyZWdnIFRhdmFyZXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICogY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuICogdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuICogdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuLyoqXG4gKiBHZW5lcmF0ZXMgYSB0eXBlZCBBUEkgZm9yIE1hdDNcbiAqICovXG5mdW5jdGlvbiBnZXRBUElJbXBsJDMoQ3Rvcikge1xuICAgIGNvbnN0IHZlYzIgPSBnZXRBUEkkNShDdG9yKTtcbiAgICBjb25zdCB2ZWMzID0gZ2V0QVBJJDQoQ3Rvcik7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgTWF0MyBmcm9tIHZhbHVlc1xuICAgICAqXG4gICAgICogTm90ZTogU2luY2UgcGFzc2luZyBpbiBhIHJhdyBKYXZhU2NyaXB0IGFycmF5XG4gICAgICogaXMgdmFsaWQgaW4gYWxsIGNpcmN1bXN0YW5jZXMsIGlmIHlvdSB3YW50IHRvXG4gICAgICogZm9yY2UgYSBKYXZhU2NyaXB0IGFycmF5IGludG8gYSBNYXQzJ3Mgc3BlY2lmaWVkIHR5cGVcbiAgICAgKiBpdCB3b3VsZCBiZSBmYXN0ZXIgdG8gdXNlXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBjb25zdCBtID0gbWF0My5jbG9uZShzb21lSlNBcnJheSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdjAgLSB2YWx1ZSBmb3IgZWxlbWVudCAwXG4gICAgICogQHBhcmFtIHYxIC0gdmFsdWUgZm9yIGVsZW1lbnQgMVxuICAgICAqIEBwYXJhbSB2MiAtIHZhbHVlIGZvciBlbGVtZW50IDJcbiAgICAgKiBAcGFyYW0gdjMgLSB2YWx1ZSBmb3IgZWxlbWVudCAzXG4gICAgICogQHBhcmFtIHY0IC0gdmFsdWUgZm9yIGVsZW1lbnQgNFxuICAgICAqIEBwYXJhbSB2NSAtIHZhbHVlIGZvciBlbGVtZW50IDVcbiAgICAgKiBAcGFyYW0gdjYgLSB2YWx1ZSBmb3IgZWxlbWVudCA2XG4gICAgICogQHBhcmFtIHY3IC0gdmFsdWUgZm9yIGVsZW1lbnQgN1xuICAgICAqIEBwYXJhbSB2OCAtIHZhbHVlIGZvciBlbGVtZW50IDhcbiAgICAgKiBAcmV0dXJucyBtYXRyaXggY3JlYXRlZCBmcm9tIHZhbHVlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGUodjAsIHYxLCB2MiwgdjMsIHY0LCB2NSwgdjYsIHY3LCB2OCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSBuZXcgQ3RvcigxMik7XG4gICAgICAgIC8vIHRvIG1ha2UgdGhlIGFycmF5IGhvbW9nZW5vdXNcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIGlmICh2MCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSB2MDtcbiAgICAgICAgICAgIGlmICh2MSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzFdID0gdjE7XG4gICAgICAgICAgICAgICAgaWYgKHYyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzJdID0gdjI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2MyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbNF0gPSB2MztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2NCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzVdID0gdjQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY1ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzZdID0gdjU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2NiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbOF0gPSB2NjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2NyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzldID0gdjc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzEwXSA9IHY4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZXMgb2YgYSBNYXQzXG4gICAgICogQWxzbyBzZWUge0BsaW5rIG1hdDMuY3JlYXRlfSBhbmQge0BsaW5rIG1hdDMuY29weX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2MCAtIHZhbHVlIGZvciBlbGVtZW50IDBcbiAgICAgKiBAcGFyYW0gdjEgLSB2YWx1ZSBmb3IgZWxlbWVudCAxXG4gICAgICogQHBhcmFtIHYyIC0gdmFsdWUgZm9yIGVsZW1lbnQgMlxuICAgICAqIEBwYXJhbSB2MyAtIHZhbHVlIGZvciBlbGVtZW50IDNcbiAgICAgKiBAcGFyYW0gdjQgLSB2YWx1ZSBmb3IgZWxlbWVudCA0XG4gICAgICogQHBhcmFtIHY1IC0gdmFsdWUgZm9yIGVsZW1lbnQgNVxuICAgICAqIEBwYXJhbSB2NiAtIHZhbHVlIGZvciBlbGVtZW50IDZcbiAgICAgKiBAcGFyYW0gdjcgLSB2YWx1ZSBmb3IgZWxlbWVudCA3XG4gICAgICogQHBhcmFtIHY4IC0gdmFsdWUgZm9yIGVsZW1lbnQgOFxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgTWF0MyBzZXQgZnJvbSB2YWx1ZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0KHYwLCB2MSwgdjIsIHYzLCB2NCwgdjUsIHY2LCB2NywgdjgsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHYwO1xuICAgICAgICBuZXdEc3RbMV0gPSB2MTtcbiAgICAgICAgbmV3RHN0WzJdID0gdjI7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IHYzO1xuICAgICAgICBuZXdEc3RbNV0gPSB2NDtcbiAgICAgICAgbmV3RHN0WzZdID0gdjU7XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IHY2O1xuICAgICAgICBuZXdEc3RbOV0gPSB2NztcbiAgICAgICAgbmV3RHN0WzEwXSA9IHY4O1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIE1hdDMgZnJvbSB0aGUgdXBwZXIgbGVmdCAzeDMgcGFydCBvZiBhIE1hdDRcbiAgICAgKiBAcGFyYW0gbTQgLSBzb3VyY2UgbWF0cml4XG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBNYXQzIG1hZGUgZnJvbSBtNFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZyb21NYXQ0KG00LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBtNFswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gbTRbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IG00WzJdO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSBtNFs0XTtcbiAgICAgICAgbmV3RHN0WzVdID0gbTRbNV07XG4gICAgICAgIG5ld0RzdFs2XSA9IG00WzZdO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSBtNFs4XTtcbiAgICAgICAgbmV3RHN0WzldID0gbTRbOV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSBtNFsxMF07XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgTWF0MyByb3RhdGlvbiBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0gcSAtIHF1YXRlcm5pb24gdG8gY3JlYXRlIG1hdHJpeCBmcm9tXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBNYXQzIG1hZGUgZnJvbSBxXG4gICAgICovXG4gICAgZnVuY3Rpb24gZnJvbVF1YXQocSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgY29uc3QgeCA9IHFbMF07XG4gICAgICAgIGNvbnN0IHkgPSBxWzFdO1xuICAgICAgICBjb25zdCB6ID0gcVsyXTtcbiAgICAgICAgY29uc3QgdyA9IHFbM107XG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XG4gICAgICAgIGNvbnN0IHkyID0geSArIHk7XG4gICAgICAgIGNvbnN0IHoyID0geiArIHo7XG4gICAgICAgIGNvbnN0IHh4ID0geCAqIHgyO1xuICAgICAgICBjb25zdCB5eCA9IHkgKiB4MjtcbiAgICAgICAgY29uc3QgeXkgPSB5ICogeTI7XG4gICAgICAgIGNvbnN0IHp4ID0geiAqIHgyO1xuICAgICAgICBjb25zdCB6eSA9IHogKiB5MjtcbiAgICAgICAgY29uc3QgenogPSB6ICogejI7XG4gICAgICAgIGNvbnN0IHd4ID0gdyAqIHgyO1xuICAgICAgICBjb25zdCB3eSA9IHcgKiB5MjtcbiAgICAgICAgY29uc3Qgd3ogPSB3ICogejI7XG4gICAgICAgIG5ld0RzdFswXSA9IDEgLSB5eSAtIHp6O1xuICAgICAgICBuZXdEc3RbMV0gPSB5eCArIHd6O1xuICAgICAgICBuZXdEc3RbMl0gPSB6eCAtIHd5O1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSB5eCAtIHd6O1xuICAgICAgICBuZXdEc3RbNV0gPSAxIC0geHggLSB6ejtcbiAgICAgICAgbmV3RHN0WzZdID0genkgKyB3eDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0genggKyB3eTtcbiAgICAgICAgbmV3RHN0WzldID0genkgLSB3eDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IDEgLSB4eCAtIHl5O1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTmVnYXRlcyBhIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyAtbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBuZWdhdGUobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gLW1bMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IC1tWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSAtbVsyXTtcbiAgICAgICAgbmV3RHN0WzRdID0gLW1bNF07XG4gICAgICAgIG5ld0RzdFs1XSA9IC1tWzVdO1xuICAgICAgICBuZXdEc3RbNl0gPSAtbVs2XTtcbiAgICAgICAgbmV3RHN0WzhdID0gLW1bOF07XG4gICAgICAgIG5ld0RzdFs5XSA9IC1tWzldO1xuICAgICAgICBuZXdEc3RbMTBdID0gLW1bMTBdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgYSBtYXRyaXguIChzYW1lIGFzIHtAbGluayBtYXQzLmNsb25lfSlcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgbWF0My5jcmVhdGV9IGFuZCB7QGxpbmsgbWF0My5zZXR9XG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgbWF0cml4LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgY29weSBvZiBtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcHkobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gbVswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gbVsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gbVsyXTtcbiAgICAgICAgbmV3RHN0WzRdID0gbVs0XTtcbiAgICAgICAgbmV3RHN0WzVdID0gbVs1XTtcbiAgICAgICAgbmV3RHN0WzZdID0gbVs2XTtcbiAgICAgICAgbmV3RHN0WzhdID0gbVs4XTtcbiAgICAgICAgbmV3RHN0WzldID0gbVs5XTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IG1bMTBdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgYSBtYXRyaXggKHNhbWUgYXMge0BsaW5rIG1hdDMuY29weX0pXG4gICAgICogQWxzbyBzZWUge0BsaW5rIG1hdDMuY3JlYXRlfSBhbmQge0BsaW5rIG1hdDMuc2V0fVxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIG1hdHJpeC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIGNvcHkgb2YgbS5cbiAgICAgKi9cbiAgICBjb25zdCBjbG9uZSA9IGNvcHk7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgMiBtYXRyaWNlcyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbFxuICAgICAqIEBwYXJhbSBhIE9wZXJhbmQgbWF0cml4LlxuICAgICAqIEBwYXJhbSBiIE9wZXJhbmQgbWF0cml4LlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgbWF0cmljZXMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlcXVhbHNBcHByb3hpbWF0ZWx5KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGFbMF0gLSBiWzBdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMV0gLSBiWzFdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMl0gLSBiWzJdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbNF0gLSBiWzRdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbNV0gLSBiWzVdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbNl0gLSBiWzZdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbOF0gLSBiWzhdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbOV0gLSBiWzldKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMTBdIC0gYlsxMF0pIDwgRVBTSUxPTjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgMiBtYXRyaWNlcyBhcmUgZXhhY3RseSBlcXVhbFxuICAgICAqIEBwYXJhbSBhIE9wZXJhbmQgbWF0cml4LlxuICAgICAqIEBwYXJhbSBiIE9wZXJhbmQgbWF0cml4LlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgbWF0cmljZXMgYXJlIGV4YWN0bHkgZXF1YWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICAgICAgICByZXR1cm4gYVswXSA9PT0gYlswXSAmJlxuICAgICAgICAgICAgYVsxXSA9PT0gYlsxXSAmJlxuICAgICAgICAgICAgYVsyXSA9PT0gYlsyXSAmJlxuICAgICAgICAgICAgYVs0XSA9PT0gYls0XSAmJlxuICAgICAgICAgICAgYVs1XSA9PT0gYls1XSAmJlxuICAgICAgICAgICAgYVs2XSA9PT0gYls2XSAmJlxuICAgICAgICAgICAgYVs4XSA9PT0gYls4XSAmJlxuICAgICAgICAgICAgYVs5XSA9PT0gYls5XSAmJlxuICAgICAgICAgICAgYVsxMF0gPT09IGJbMTBdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgMy1ieS0zIGlkZW50aXR5IG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSAzLWJ5LTMgaWRlbnRpdHkgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlkZW50aXR5KGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDE7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IDE7XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUYWtlcyB0aGUgdHJhbnNwb3NlIG9mIGEgbWF0cml4LlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB0cmFuc3Bvc2Ugb2YgbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cmFuc3Bvc2UobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgaWYgKG5ld0RzdCA9PT0gbSkge1xuICAgICAgICAgICAgbGV0IHQ7XG4gICAgICAgICAgICAvLyAwIDEgMlxuICAgICAgICAgICAgLy8gNCA1IDZcbiAgICAgICAgICAgIC8vIDggOSAxMFxuICAgICAgICAgICAgdCA9IG1bMV07XG4gICAgICAgICAgICBtWzFdID0gbVs0XTtcbiAgICAgICAgICAgIG1bNF0gPSB0O1xuICAgICAgICAgICAgdCA9IG1bMl07XG4gICAgICAgICAgICBtWzJdID0gbVs4XTtcbiAgICAgICAgICAgIG1bOF0gPSB0O1xuICAgICAgICAgICAgdCA9IG1bNl07XG4gICAgICAgICAgICBtWzZdID0gbVs5XTtcbiAgICAgICAgICAgIG1bOV0gPSB0O1xuICAgICAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtMDAgPSBtWzAgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG1bMCAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbVswICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMTAgPSBtWzEgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bMSAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTEyID0gbVsxICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMjAgPSBtWzIgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0yMSA9IG1bMiAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsyICogNCArIDJdO1xuICAgICAgICBuZXdEc3RbMF0gPSBtMDA7XG4gICAgICAgIG5ld0RzdFsxXSA9IG0xMDtcbiAgICAgICAgbmV3RHN0WzJdID0gbTIwO1xuICAgICAgICBuZXdEc3RbNF0gPSBtMDE7XG4gICAgICAgIG5ld0RzdFs1XSA9IG0xMTtcbiAgICAgICAgbmV3RHN0WzZdID0gbTIxO1xuICAgICAgICBuZXdEc3RbOF0gPSBtMDI7XG4gICAgICAgIG5ld0RzdFs5XSA9IG0xMjtcbiAgICAgICAgbmV3RHN0WzEwXSA9IG0yMjtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGludmVyc2Ugb2YgYSAzLWJ5LTMgbWF0cml4LlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBpbnZlcnNlIG9mIG0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52ZXJzZShtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCBtMDAgPSBtWzAgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG1bMCAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbVswICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMTAgPSBtWzEgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bMSAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTEyID0gbVsxICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMjAgPSBtWzIgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0yMSA9IG1bMiAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsyICogNCArIDJdO1xuICAgICAgICBjb25zdCBiMDEgPSBtMjIgKiBtMTEgLSBtMTIgKiBtMjE7XG4gICAgICAgIGNvbnN0IGIxMSA9IC1tMjIgKiBtMTAgKyBtMTIgKiBtMjA7XG4gICAgICAgIGNvbnN0IGIyMSA9IG0yMSAqIG0xMCAtIG0xMSAqIG0yMDtcbiAgICAgICAgY29uc3QgaW52RGV0ID0gMSAvIChtMDAgKiBiMDEgKyBtMDEgKiBiMTEgKyBtMDIgKiBiMjEpO1xuICAgICAgICBuZXdEc3RbMF0gPSBiMDEgKiBpbnZEZXQ7XG4gICAgICAgIG5ld0RzdFsxXSA9ICgtbTIyICogbTAxICsgbTAyICogbTIxKSAqIGludkRldDtcbiAgICAgICAgbmV3RHN0WzJdID0gKG0xMiAqIG0wMSAtIG0wMiAqIG0xMSkgKiBpbnZEZXQ7XG4gICAgICAgIG5ld0RzdFs0XSA9IGIxMSAqIGludkRldDtcbiAgICAgICAgbmV3RHN0WzVdID0gKG0yMiAqIG0wMCAtIG0wMiAqIG0yMCkgKiBpbnZEZXQ7XG4gICAgICAgIG5ld0RzdFs2XSA9ICgtbTEyICogbTAwICsgbTAyICogbTEwKSAqIGludkRldDtcbiAgICAgICAgbmV3RHN0WzhdID0gYjIxICogaW52RGV0O1xuICAgICAgICBuZXdEc3RbOV0gPSAoLW0yMSAqIG0wMCArIG0wMSAqIG0yMCkgKiBpbnZEZXQ7XG4gICAgICAgIG5ld0RzdFsxMF0gPSAobTExICogbTAwIC0gbTAxICogbTEwKSAqIGludkRldDtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSB0aGUgZGV0ZXJtaW5hbnQgb2YgYSBtYXRyaXhcbiAgICAgKiBAcGFyYW0gbSAtIHRoZSBtYXRyaXhcbiAgICAgKiBAcmV0dXJucyB0aGUgZGV0ZXJtaW5hbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZXRlcm1pbmFudChtKSB7XG4gICAgICAgIGNvbnN0IG0wMCA9IG1bMCAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTAxID0gbVswICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtWzAgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0xMCA9IG1bMSAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTExID0gbVsxICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMTIgPSBtWzEgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bMiAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTIxID0gbVsyICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMjIgPSBtWzIgKiA0ICsgMl07XG4gICAgICAgIHJldHVybiBtMDAgKiAobTExICogbTIyIC0gbTIxICogbTEyKSAtXG4gICAgICAgICAgICBtMTAgKiAobTAxICogbTIyIC0gbTIxICogbTAyKSArXG4gICAgICAgICAgICBtMjAgKiAobTAxICogbTEyIC0gbTExICogbTAyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGludmVyc2Ugb2YgYSAzLWJ5LTMgbWF0cml4LiAoc2FtZSBhcyBpbnZlcnNlKVxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBpbnZlcnNlIG9mIG0uXG4gICAgICovXG4gICAgY29uc3QgaW52ZXJ0ID0gaW52ZXJzZTtcbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIHR3byAzLWJ5LTMgbWF0cmljZXMgd2l0aCBhIG9uIHRoZSBsZWZ0IGFuZCBiIG9uIHRoZSByaWdodFxuICAgICAqIEBwYXJhbSBhIC0gVGhlIG1hdHJpeCBvbiB0aGUgbGVmdC5cbiAgICAgKiBAcGFyYW0gYiAtIFRoZSBtYXRyaXggb24gdGhlIHJpZ2h0LlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1hdHJpeCBwcm9kdWN0IG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsdGlwbHkoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgY29uc3QgYTAwID0gYVswXTtcbiAgICAgICAgY29uc3QgYTAxID0gYVsxXTtcbiAgICAgICAgY29uc3QgYTAyID0gYVsyXTtcbiAgICAgICAgY29uc3QgYTEwID0gYVs0ICsgMF07XG4gICAgICAgIGNvbnN0IGExMSA9IGFbNCArIDFdO1xuICAgICAgICBjb25zdCBhMTIgPSBhWzQgKyAyXTtcbiAgICAgICAgY29uc3QgYTIwID0gYVs4ICsgMF07XG4gICAgICAgIGNvbnN0IGEyMSA9IGFbOCArIDFdO1xuICAgICAgICBjb25zdCBhMjIgPSBhWzggKyAyXTtcbiAgICAgICAgY29uc3QgYjAwID0gYlswXTtcbiAgICAgICAgY29uc3QgYjAxID0gYlsxXTtcbiAgICAgICAgY29uc3QgYjAyID0gYlsyXTtcbiAgICAgICAgY29uc3QgYjEwID0gYls0ICsgMF07XG4gICAgICAgIGNvbnN0IGIxMSA9IGJbNCArIDFdO1xuICAgICAgICBjb25zdCBiMTIgPSBiWzQgKyAyXTtcbiAgICAgICAgY29uc3QgYjIwID0gYls4ICsgMF07XG4gICAgICAgIGNvbnN0IGIyMSA9IGJbOCArIDFdO1xuICAgICAgICBjb25zdCBiMjIgPSBiWzggKyAyXTtcbiAgICAgICAgbmV3RHN0WzBdID0gYTAwICogYjAwICsgYTEwICogYjAxICsgYTIwICogYjAyO1xuICAgICAgICBuZXdEc3RbMV0gPSBhMDEgKiBiMDAgKyBhMTEgKiBiMDEgKyBhMjEgKiBiMDI7XG4gICAgICAgIG5ld0RzdFsyXSA9IGEwMiAqIGIwMCArIGExMiAqIGIwMSArIGEyMiAqIGIwMjtcbiAgICAgICAgbmV3RHN0WzRdID0gYTAwICogYjEwICsgYTEwICogYjExICsgYTIwICogYjEyO1xuICAgICAgICBuZXdEc3RbNV0gPSBhMDEgKiBiMTAgKyBhMTEgKiBiMTEgKyBhMjEgKiBiMTI7XG4gICAgICAgIG5ld0RzdFs2XSA9IGEwMiAqIGIxMCArIGExMiAqIGIxMSArIGEyMiAqIGIxMjtcbiAgICAgICAgbmV3RHN0WzhdID0gYTAwICogYjIwICsgYTEwICogYjIxICsgYTIwICogYjIyO1xuICAgICAgICBuZXdEc3RbOV0gPSBhMDEgKiBiMjAgKyBhMTEgKiBiMjEgKyBhMjEgKiBiMjI7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBhMDIgKiBiMjAgKyBhMTIgKiBiMjEgKyBhMjIgKiBiMjI7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgdHdvIDMtYnktMyBtYXRyaWNlcyB3aXRoIGEgb24gdGhlIGxlZnQgYW5kIGIgb24gdGhlIHJpZ2h0IChzYW1lIGFzIG11bHRpcGx5KVxuICAgICAqIEBwYXJhbSBhIC0gVGhlIG1hdHJpeCBvbiB0aGUgbGVmdC5cbiAgICAgKiBAcGFyYW0gYiAtIFRoZSBtYXRyaXggb24gdGhlIHJpZ2h0LlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1hdHJpeCBwcm9kdWN0IG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3QgbXVsID0gbXVsdGlwbHk7XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdHJhbnNsYXRpb24gY29tcG9uZW50IG9mIGEgMy1ieS0zIG1hdHJpeCB0byB0aGUgZ2l2ZW5cbiAgICAgKiB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGEgLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBtYXRyaXggd2l0aCB0cmFuc2xhdGlvbiBzZXQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0VHJhbnNsYXRpb24oYSwgdiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gaWRlbnRpdHkoKSk7XG4gICAgICAgIGlmIChhICE9PSBuZXdEc3QpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IGFbMF07XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSBhWzFdO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gYVsyXTtcbiAgICAgICAgICAgIG5ld0RzdFs0XSA9IGFbNF07XG4gICAgICAgICAgICBuZXdEc3RbNV0gPSBhWzVdO1xuICAgICAgICAgICAgbmV3RHN0WzZdID0gYVs2XTtcbiAgICAgICAgfVxuICAgICAgICBuZXdEc3RbOF0gPSB2WzBdO1xuICAgICAgICBuZXdEc3RbOV0gPSB2WzFdO1xuICAgICAgICBuZXdEc3RbMTBdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdHJhbnNsYXRpb24gY29tcG9uZW50IG9mIGEgMy1ieS0zIG1hdHJpeCBhcyBhIHZlY3RvciB3aXRoIDNcbiAgICAgKiBlbnRyaWVzLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB0cmFuc2xhdGlvbiBjb21wb25lbnQgb2YgbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRUcmFuc2xhdGlvbihtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyB2ZWMyLmNyZWF0ZSgpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gbVs4XTtcbiAgICAgICAgbmV3RHN0WzFdID0gbVs5XTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBheGlzIG9mIGEgM3gzIG1hdHJpeCBhcyBhIHZlY3RvciB3aXRoIDIgZW50cmllc1xuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYXhpcyAtIFRoZSBheGlzIDAgPSB4LCAxID0geSxcbiAgICAgKiBAcmV0dXJucyBUaGUgYXhpcyBjb21wb25lbnQgb2YgbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRBeGlzKG0sIGF4aXMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IHZlYzIuY3JlYXRlKCkpO1xuICAgICAgICBjb25zdCBvZmYgPSBheGlzICogNDtcbiAgICAgICAgbmV3RHN0WzBdID0gbVtvZmYgKyAwXTtcbiAgICAgICAgbmV3RHN0WzFdID0gbVtvZmYgKyAxXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhbiBheGlzIG9mIGEgM3gzIG1hdHJpeCBhcyBhIHZlY3RvciB3aXRoIDIgZW50cmllc1xuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gdiAtIHRoZSBheGlzIHZlY3RvclxuICAgICAqIEBwYXJhbSBheGlzIC0gVGhlIGF4aXMgIDAgPSB4LCAxID0geTtcbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIG1hdHJpeCB0byBzZXQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1hdHJpeCB3aXRoIGF4aXMgc2V0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldEF4aXMobSwgdiwgYXhpcywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPT09IG0gPyBtIDogY29weShtLCBkc3QpKTtcbiAgICAgICAgY29uc3Qgb2ZmID0gYXhpcyAqIDQ7XG4gICAgICAgIG5ld0RzdFtvZmYgKyAwXSA9IHZbMF07XG4gICAgICAgIG5ld0RzdFtvZmYgKyAxXSA9IHZbMV07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIFwiMmRcIiBzY2FsaW5nIGNvbXBvbmVudCBvZiB0aGUgbWF0cml4XG4gICAgICogQHBhcmFtIG0gLSBUaGUgTWF0cml4XG4gICAgICogQHBhcmFtIGRzdCAtIFRoZSB2ZWN0b3IgdG8gc2V0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFNjYWxpbmcobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gdmVjMi5jcmVhdGUoKSk7XG4gICAgICAgIGNvbnN0IHh4ID0gbVswXTtcbiAgICAgICAgY29uc3QgeHkgPSBtWzFdO1xuICAgICAgICBjb25zdCB5eCA9IG1bNF07XG4gICAgICAgIGNvbnN0IHl5ID0gbVs1XTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5zcXJ0KHh4ICogeHggKyB4eSAqIHh5KTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5zcXJ0KHl4ICogeXggKyB5eSAqIHl5KTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgXCIzZFwiIHNjYWxpbmcgY29tcG9uZW50IG9mIHRoZSBtYXRyaXhcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBNYXRyaXhcbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIHZlY3RvciB0byBzZXQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0M0RTY2FsaW5nKG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IHZlYzMuY3JlYXRlKCkpO1xuICAgICAgICBjb25zdCB4eCA9IG1bMF07XG4gICAgICAgIGNvbnN0IHh5ID0gbVsxXTtcbiAgICAgICAgY29uc3QgeHogPSBtWzJdO1xuICAgICAgICBjb25zdCB5eCA9IG1bNF07XG4gICAgICAgIGNvbnN0IHl5ID0gbVs1XTtcbiAgICAgICAgY29uc3QgeXogPSBtWzZdO1xuICAgICAgICBjb25zdCB6eCA9IG1bOF07XG4gICAgICAgIGNvbnN0IHp5ID0gbVs5XTtcbiAgICAgICAgY29uc3QgenogPSBtWzEwXTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5zcXJ0KHh4ICogeHggKyB4eSAqIHh5ICsgeHogKiB4eik7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGguc3FydCh5eCAqIHl4ICsgeXkgKiB5eSArIHl6ICogeXopO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLnNxcnQoenggKiB6eCArIHp5ICogenkgKyB6eiAqIHp6KTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDMtYnktMyBtYXRyaXggd2hpY2ggdHJhbnNsYXRlcyBieSB0aGUgZ2l2ZW4gdmVjdG9yIHYuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yIGJ5IHdoaWNoIHRvIHRyYW5zbGF0ZS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB0cmFuc2xhdGlvbiBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRpb24odiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gMTtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gMTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gdlswXTtcbiAgICAgICAgbmV3RHN0WzldID0gdlsxXTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZXMgdGhlIGdpdmVuIDMtYnktMyBtYXRyaXggYnkgdGhlIGdpdmVuIHZlY3RvciB2LlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IgYnkgd2hpY2ggdG8gdHJhbnNsYXRlLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHRyYW5zbGF0ZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZShtLCB2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgY29uc3QgbTAwID0gbVswXTtcbiAgICAgICAgY29uc3QgbTAxID0gbVsxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbVsyXTtcbiAgICAgICAgY29uc3QgbTEwID0gbVsxICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMTEgPSBtWzEgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0xMiA9IG1bMSAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTIwID0gbVsyICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMjEgPSBtWzIgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0yMiA9IG1bMiAqIDQgKyAyXTtcbiAgICAgICAgaWYgKG0gIT09IG5ld0RzdCkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gbTAwO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gbTAxO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gbTAyO1xuICAgICAgICAgICAgbmV3RHN0WzRdID0gbTEwO1xuICAgICAgICAgICAgbmV3RHN0WzVdID0gbTExO1xuICAgICAgICAgICAgbmV3RHN0WzZdID0gbTEyO1xuICAgICAgICB9XG4gICAgICAgIG5ld0RzdFs4XSA9IG0wMCAqIHYwICsgbTEwICogdjEgKyBtMjA7XG4gICAgICAgIG5ld0RzdFs5XSA9IG0wMSAqIHYwICsgbTExICogdjEgKyBtMjE7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBtMDIgKiB2MCArIG0xMiAqIHYxICsgbTIyO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgMy1ieS0zIG1hdHJpeCB3aGljaCByb3RhdGVzICBieSB0aGUgZ2l2ZW4gYW5nbGUuXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRpb24gbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbMF0gPSBjO1xuICAgICAgICBuZXdEc3RbMV0gPSBzO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAtcztcbiAgICAgICAgbmV3RHN0WzVdID0gYztcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJvdGF0ZXMgdGhlIGdpdmVuIDMtYnktMyBtYXRyaXggIGJ5IHRoZSBnaXZlbiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlKG0sIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCBtMDAgPSBtWzAgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG1bMCAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbVswICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMTAgPSBtWzEgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bMSAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTEyID0gbVsxICogNCArIDJdO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbMF0gPSBjICogbTAwICsgcyAqIG0xMDtcbiAgICAgICAgbmV3RHN0WzFdID0gYyAqIG0wMSArIHMgKiBtMTE7XG4gICAgICAgIG5ld0RzdFsyXSA9IGMgKiBtMDIgKyBzICogbTEyO1xuICAgICAgICBuZXdEc3RbNF0gPSBjICogbTEwIC0gcyAqIG0wMDtcbiAgICAgICAgbmV3RHN0WzVdID0gYyAqIG0xMSAtIHMgKiBtMDE7XG4gICAgICAgIG5ld0RzdFs2XSA9IGMgKiBtMTIgLSBzICogbTAyO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbOF0gPSBtWzhdO1xuICAgICAgICAgICAgbmV3RHN0WzldID0gbVs5XTtcbiAgICAgICAgICAgIG5ld0RzdFsxMF0gPSBtWzEwXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgMy1ieS0zIG1hdHJpeCB3aGljaCByb3RhdGVzIGFyb3VuZCB0aGUgeC1heGlzIGJ5IHRoZSBnaXZlbiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGlvbiBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRpb25YKGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbMF0gPSAxO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSBjO1xuICAgICAgICBuZXdEc3RbNl0gPSBzO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAtcztcbiAgICAgICAgbmV3RHN0WzEwXSA9IGM7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJvdGF0ZXMgdGhlIGdpdmVuIDMtYnktMyBtYXRyaXggYXJvdW5kIHRoZSB4LWF4aXMgYnkgdGhlIGdpdmVuXG4gICAgICogYW5nbGUuXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHJvdGF0ZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0ZVgobSwgYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIGNvbnN0IG0xMCA9IG1bNF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bNV07XG4gICAgICAgIGNvbnN0IG0xMiA9IG1bNl07XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bOF07XG4gICAgICAgIGNvbnN0IG0yMSA9IG1bOV07XG4gICAgICAgIGNvbnN0IG0yMiA9IG1bMTBdO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbNF0gPSBjICogbTEwICsgcyAqIG0yMDtcbiAgICAgICAgbmV3RHN0WzVdID0gYyAqIG0xMSArIHMgKiBtMjE7XG4gICAgICAgIG5ld0RzdFs2XSA9IGMgKiBtMTIgKyBzICogbTIyO1xuICAgICAgICBuZXdEc3RbOF0gPSBjICogbTIwIC0gcyAqIG0xMDtcbiAgICAgICAgbmV3RHN0WzldID0gYyAqIG0yMSAtIHMgKiBtMTE7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBjICogbTIyIC0gcyAqIG0xMjtcbiAgICAgICAgaWYgKG0gIT09IG5ld0RzdCkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gbVswXTtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IG1bMV07XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSBtWzJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSAzLWJ5LTMgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYXJvdW5kIHRoZSB5LWF4aXMgYnkgdGhlIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHJvdGF0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGlvblkoYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFswXSA9IGM7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IC1zO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSAxO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSBzO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTBdID0gYztcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gMy1ieS0zIG1hdHJpeCBhcm91bmQgdGhlIHktYXhpcyBieSB0aGUgZ2l2ZW5cbiAgICAgKiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlWShtLCBhbmdsZUluUmFkaWFucywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgY29uc3QgbTAwID0gbVswICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMDEgPSBtWzAgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0wMiA9IG1bMCAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTIwID0gbVsyICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMjEgPSBtWzIgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0yMiA9IG1bMiAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYyAqIG0wMCAtIHMgKiBtMjA7XG4gICAgICAgIG5ld0RzdFsxXSA9IGMgKiBtMDEgLSBzICogbTIxO1xuICAgICAgICBuZXdEc3RbMl0gPSBjICogbTAyIC0gcyAqIG0yMjtcbiAgICAgICAgbmV3RHN0WzhdID0gYyAqIG0yMCArIHMgKiBtMDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IGMgKiBtMjEgKyBzICogbTAxO1xuICAgICAgICBuZXdEc3RbMTBdID0gYyAqIG0yMiArIHMgKiBtMDI7XG4gICAgICAgIGlmIChtICE9PSBuZXdEc3QpIHtcbiAgICAgICAgICAgIG5ld0RzdFs0XSA9IG1bNF07XG4gICAgICAgICAgICBuZXdEc3RbNV0gPSBtWzVdO1xuICAgICAgICAgICAgbmV3RHN0WzZdID0gbVs2XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgMy1ieS0zIG1hdHJpeCB3aGljaCByb3RhdGVzIGFyb3VuZCB0aGUgei1heGlzIGJ5IHRoZSBnaXZlbiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGlvbiBtYXRyaXguXG4gICAgICovXG4gICAgY29uc3Qgcm90YXRpb25aID0gcm90YXRpb247XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gMy1ieS0zIG1hdHJpeCBhcm91bmQgdGhlIHotYXhpcyBieSB0aGUgZ2l2ZW5cbiAgICAgKiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRlZCBtYXRyaXguXG4gICAgICovXG4gICAgY29uc3Qgcm90YXRlWiA9IHJvdGF0ZTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgMy1ieS0zIG1hdHJpeCB3aGljaCBzY2FsZXMgaW4gZWFjaCBkaW1lbnNpb24gYnkgYW4gYW1vdW50IGdpdmVuIGJ5XG4gICAgICogdGhlIGNvcnJlc3BvbmRpbmcgZW50cnkgaW4gdGhlIGdpdmVuIHZlY3RvcjsgYXNzdW1lcyB0aGUgdmVjdG9yIGhhcyB0d29cbiAgICAgKiBlbnRyaWVzLlxuICAgICAqIEBwYXJhbSB2IC0gQSB2ZWN0b3Igb2ZcbiAgICAgKiAgICAgMiBlbnRyaWVzIHNwZWNpZnlpbmcgdGhlIGZhY3RvciBieSB3aGljaCB0byBzY2FsZSBpbiBlYWNoIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsaW5nIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzY2FsaW5nKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IHZbMV07XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTY2FsZXMgdGhlIGdpdmVuIDMtYnktMyBtYXRyaXggaW4gZWFjaCBkaW1lbnNpb24gYnkgYW4gYW1vdW50XG4gICAgICogZ2l2ZW4gYnkgdGhlIGNvcnJlc3BvbmRpbmcgZW50cnkgaW4gdGhlIGdpdmVuIHZlY3RvcjsgYXNzdW1lcyB0aGUgdmVjdG9yIGhhc1xuICAgICAqIHR3byBlbnRyaWVzLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeCB0byBiZSBtb2RpZmllZC5cbiAgICAgKiBAcGFyYW0gdiAtIEEgdmVjdG9yIG9mIDIgZW50cmllcyBzcGVjaWZ5aW5nIHRoZVxuICAgICAqICAgICBmYWN0b3IgYnkgd2hpY2ggdG8gc2NhbGUgaW4gZWFjaCBkaW1lbnNpb24uXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzY2FsZShtLCB2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgbmV3RHN0WzBdID0gdjAgKiBtWzAgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHYwICogbVswICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbMl0gPSB2MCAqIG1bMCAqIDQgKyAyXTtcbiAgICAgICAgbmV3RHN0WzRdID0gdjEgKiBtWzEgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFs1XSA9IHYxICogbVsxICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbNl0gPSB2MSAqIG1bMSAqIDQgKyAyXTtcbiAgICAgICAgaWYgKG0gIT09IG5ld0RzdCkge1xuICAgICAgICAgICAgbmV3RHN0WzhdID0gbVs4XTtcbiAgICAgICAgICAgIG5ld0RzdFs5XSA9IG1bOV07XG4gICAgICAgICAgICBuZXdEc3RbMTBdID0gbVsxMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDMtYnktMyBtYXRyaXggd2hpY2ggc2NhbGVzIGluIGVhY2ggZGltZW5zaW9uIGJ5IGFuIGFtb3VudCBnaXZlbiBieVxuICAgICAqIHRoZSBjb3JyZXNwb25kaW5nIGVudHJ5IGluIHRoZSBnaXZlbiB2ZWN0b3I7IGFzc3VtZXMgdGhlIHZlY3RvciBoYXMgdGhyZWVcbiAgICAgKiBlbnRyaWVzLlxuICAgICAqIEBwYXJhbSB2IC0gQSB2ZWN0b3Igb2ZcbiAgICAgKiAgICAgMyBlbnRyaWVzIHNwZWNpZnlpbmcgdGhlIGZhY3RvciBieSB3aGljaCB0byBzY2FsZSBpbiBlYWNoIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsaW5nIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzY2FsaW5nM0QodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gdlsxXTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IHZbMl07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNjYWxlcyB0aGUgZ2l2ZW4gMy1ieS0zIG1hdHJpeCBpbiBlYWNoIGRpbWVuc2lvbiBieSBhbiBhbW91bnRcbiAgICAgKiBnaXZlbiBieSB0aGUgY29ycmVzcG9uZGluZyBlbnRyeSBpbiB0aGUgZ2l2ZW4gdmVjdG9yOyBhc3N1bWVzIHRoZSB2ZWN0b3IgaGFzXG4gICAgICogdGhyZWUgZW50cmllcy5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXggdG8gYmUgbW9kaWZpZWQuXG4gICAgICogQHBhcmFtIHYgLSBBIHZlY3RvciBvZiAzIGVudHJpZXMgc3BlY2lmeWluZyB0aGVcbiAgICAgKiAgICAgZmFjdG9yIGJ5IHdoaWNoIHRvIHNjYWxlIGluIGVhY2ggZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2NhbGUzRChtLCB2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgY29uc3QgdjIgPSB2WzJdO1xuICAgICAgICBuZXdEc3RbMF0gPSB2MCAqIG1bMCAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzFdID0gdjAgKiBtWzAgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHYwICogbVswICogNCArIDJdO1xuICAgICAgICBuZXdEc3RbNF0gPSB2MSAqIG1bMSAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzVdID0gdjEgKiBtWzEgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFs2XSA9IHYxICogbVsxICogNCArIDJdO1xuICAgICAgICBuZXdEc3RbOF0gPSB2MiAqIG1bMiAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzldID0gdjIgKiBtWzIgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSB2MiAqIG1bMiAqIDQgKyAyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDMtYnktMyBtYXRyaXggd2hpY2ggc2NhbGVzIHVuaWZvcm1seSBpbiB0aGUgWCBhbmQgWSBkaW1lbnNpb25zXG4gICAgICogQHBhcmFtIHMgLSBBbW91bnQgdG8gc2NhbGVcbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsaW5nIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmlmb3JtU2NhbGluZyhzLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBzO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSBzO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTBdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2NhbGVzIHRoZSBnaXZlbiAzLWJ5LTMgbWF0cml4IGluIHRoZSBYIGFuZCBZIGRpbWVuc2lvbiBieSBhbiBhbW91bnRcbiAgICAgKiBnaXZlbi5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXggdG8gYmUgbW9kaWZpZWQuXG4gICAgICogQHBhcmFtIHMgLSBBbW91bnQgdG8gc2NhbGUuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmlmb3JtU2NhbGUobSwgcywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTIpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gcyAqIG1bMCAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzFdID0gcyAqIG1bMCAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gcyAqIG1bMCAqIDQgKyAyXTtcbiAgICAgICAgbmV3RHN0WzRdID0gcyAqIG1bMSAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzVdID0gcyAqIG1bMSAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzZdID0gcyAqIG1bMSAqIDQgKyAyXTtcbiAgICAgICAgaWYgKG0gIT09IG5ld0RzdCkge1xuICAgICAgICAgICAgbmV3RHN0WzhdID0gbVs4XTtcbiAgICAgICAgICAgIG5ld0RzdFs5XSA9IG1bOV07XG4gICAgICAgICAgICBuZXdEc3RbMTBdID0gbVsxMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIDMtYnktMyBtYXRyaXggd2hpY2ggc2NhbGVzIHVuaWZvcm1seSBpbiBlYWNoIGRpbWVuc2lvblxuICAgICAqIEBwYXJhbSBzIC0gQW1vdW50IHRvIHNjYWxlXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2NhbGluZyBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5pZm9ybVNjYWxpbmczRChzLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxMikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBzO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSBzO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTBdID0gcztcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2NhbGVzIHRoZSBnaXZlbiAzLWJ5LTMgbWF0cml4IGluIGVhY2ggZGltZW5zaW9uIGJ5IGFuIGFtb3VudFxuICAgICAqIGdpdmVuLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeCB0byBiZSBtb2RpZmllZC5cbiAgICAgKiBAcGFyYW0gcyAtIEFtb3VudCB0byBzY2FsZS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVuaWZvcm1TY2FsZTNEKG0sIHMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDEyKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHMgKiBtWzAgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHMgKiBtWzAgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHMgKiBtWzAgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFs0XSA9IHMgKiBtWzEgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFs1XSA9IHMgKiBtWzEgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFs2XSA9IHMgKiBtWzEgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFs4XSA9IHMgKiBtWzIgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFs5XSA9IHMgKiBtWzIgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSBzICogbVsyICogNCArIDJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjbG9uZSxcbiAgICAgICAgY3JlYXRlLFxuICAgICAgICBzZXQsXG4gICAgICAgIGZyb21NYXQ0LFxuICAgICAgICBmcm9tUXVhdCxcbiAgICAgICAgbmVnYXRlLFxuICAgICAgICBjb3B5LFxuICAgICAgICBlcXVhbHNBcHByb3hpbWF0ZWx5LFxuICAgICAgICBlcXVhbHMsXG4gICAgICAgIGlkZW50aXR5LFxuICAgICAgICB0cmFuc3Bvc2UsXG4gICAgICAgIGludmVyc2UsXG4gICAgICAgIGludmVydCxcbiAgICAgICAgZGV0ZXJtaW5hbnQsXG4gICAgICAgIG11bCxcbiAgICAgICAgbXVsdGlwbHksXG4gICAgICAgIHNldFRyYW5zbGF0aW9uLFxuICAgICAgICBnZXRUcmFuc2xhdGlvbixcbiAgICAgICAgZ2V0QXhpcyxcbiAgICAgICAgc2V0QXhpcyxcbiAgICAgICAgZ2V0U2NhbGluZyxcbiAgICAgICAgZ2V0M0RTY2FsaW5nLFxuICAgICAgICB0cmFuc2xhdGlvbixcbiAgICAgICAgdHJhbnNsYXRlLFxuICAgICAgICByb3RhdGlvbixcbiAgICAgICAgcm90YXRlLFxuICAgICAgICByb3RhdGlvblgsXG4gICAgICAgIHJvdGF0ZVgsXG4gICAgICAgIHJvdGF0aW9uWSxcbiAgICAgICAgcm90YXRlWSxcbiAgICAgICAgcm90YXRpb25aLFxuICAgICAgICByb3RhdGVaLFxuICAgICAgICBzY2FsaW5nLFxuICAgICAgICBzY2FsZSxcbiAgICAgICAgdW5pZm9ybVNjYWxpbmcsXG4gICAgICAgIHVuaWZvcm1TY2FsZSxcbiAgICAgICAgc2NhbGluZzNELFxuICAgICAgICBzY2FsZTNELFxuICAgICAgICB1bmlmb3JtU2NhbGluZzNELFxuICAgICAgICB1bmlmb3JtU2NhbGUzRCxcbiAgICB9O1xufVxuY29uc3QgY2FjaGUkMyA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldEFQSSQzKEN0b3IpIHtcbiAgICBsZXQgYXBpID0gY2FjaGUkMy5nZXQoQ3Rvcik7XG4gICAgaWYgKCFhcGkpIHtcbiAgICAgICAgYXBpID0gZ2V0QVBJSW1wbCQzKEN0b3IpO1xuICAgICAgICBjYWNoZSQzLnNldChDdG9yLCBhcGkpO1xuICAgIH1cbiAgICByZXR1cm4gYXBpO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHR5cGVkIEFQSSBmb3IgTWF0NFxuICogKi9cbmZ1bmN0aW9uIGdldEFQSUltcGwkMihDdG9yKSB7XG4gICAgY29uc3QgdmVjMyA9IGdldEFQSSQ0KEN0b3IpO1xuICAgIC8qKlxuICAgICAqIDR4NCBNYXRyaXggbWF0aCBtYXRoIGZ1bmN0aW9ucy5cbiAgICAgKlxuICAgICAqIEFsbW9zdCBhbGwgZnVuY3Rpb25zIHRha2UgYW4gb3B0aW9uYWwgYG5ld0RzdGAgYXJndW1lbnQuIElmIGl0IGlzIG5vdCBwYXNzZWQgaW4gdGhlXG4gICAgICogZnVuY3Rpb25zIHdpbGwgY3JlYXRlIGEgbmV3IG1hdHJpeC4gSW4gb3RoZXIgd29yZHMgeW91IGNhbiBkbyB0aGlzXG4gICAgICpcbiAgICAgKiAgICAgY29uc3QgbWF0ID0gbWF0NC50cmFuc2xhdGlvbihbMSwgMiwgM10pOyAgLy8gQ3JlYXRlcyBhIG5ldyB0cmFuc2xhdGlvbiBtYXRyaXhcbiAgICAgKlxuICAgICAqIG9yXG4gICAgICpcbiAgICAgKiAgICAgY29uc3QgbWF0ID0gbWF0NC5jcmVhdGUoKTtcbiAgICAgKiAgICAgbWF0NC50cmFuc2xhdGlvbihbMSwgMiwgM10sIG1hdCk7ICAvLyBQdXRzIHRyYW5zbGF0aW9uIG1hdHJpeCBpbiBtYXQuXG4gICAgICpcbiAgICAgKiBUaGUgZmlyc3Qgc3R5bGUgaXMgb2Z0ZW4gZWFzaWVyIGJ1dCBkZXBlbmRpbmcgb24gd2hlcmUgaXQncyB1c2VkIGl0IGdlbmVyYXRlcyBnYXJiYWdlIHdoZXJlXG4gICAgICogYXMgdGhlcmUgaXMgYWxtb3N0IG5ldmVyIGFsbG9jYXRpb24gd2l0aCB0aGUgc2Vjb25kIHN0eWxlLlxuICAgICAqXG4gICAgICogSXQgaXMgYWx3YXlzIHNhdmUgdG8gcGFzcyBhbnkgbWF0cml4IGFzIHRoZSBkZXN0aW5hdGlvbi4gU28gZm9yIGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICBjb25zdCBtYXQgPSBtYXQ0LmlkZW50aXR5KCk7XG4gICAgICogICAgIGNvbnN0IHRyYW5zID0gbWF0NC50cmFuc2xhdGlvbihbMSwgMiwgM10pO1xuICAgICAqICAgICBtYXQ0Lm11bHRpcGx5KG1hdCwgdHJhbnMsIG1hdCk7ICAvLyBNdWx0aXBsaWVzIG1hdCAqIHRyYW5zIGFuZCBwdXRzIHJlc3VsdCBpbiBtYXQuXG4gICAgICpcbiAgICAgKi9cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBNYXQ0IGZyb20gdmFsdWVzXG4gICAgICpcbiAgICAgKiBOb3RlOiBTaW5jZSBwYXNzaW5nIGluIGEgcmF3IEphdmFTY3JpcHQgYXJyYXlcbiAgICAgKiBpcyB2YWxpZCBpbiBhbGwgY2lyY3Vtc3RhbmNlcywgaWYgeW91IHdhbnQgdG9cbiAgICAgKiBmb3JjZSBhIEphdmFTY3JpcHQgYXJyYXkgaW50byBhIE1hdDQncyBzcGVjaWZpZWQgdHlwZVxuICAgICAqIGl0IHdvdWxkIGJlIGZhc3RlciB0byB1c2VcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGNvbnN0IG0gPSBtYXQ0LmNsb25lKHNvbWVKU0FycmF5KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2MCAtIHZhbHVlIGZvciBlbGVtZW50IDBcbiAgICAgKiBAcGFyYW0gdjEgLSB2YWx1ZSBmb3IgZWxlbWVudCAxXG4gICAgICogQHBhcmFtIHYyIC0gdmFsdWUgZm9yIGVsZW1lbnQgMlxuICAgICAqIEBwYXJhbSB2MyAtIHZhbHVlIGZvciBlbGVtZW50IDNcbiAgICAgKiBAcGFyYW0gdjQgLSB2YWx1ZSBmb3IgZWxlbWVudCA0XG4gICAgICogQHBhcmFtIHY1IC0gdmFsdWUgZm9yIGVsZW1lbnQgNVxuICAgICAqIEBwYXJhbSB2NiAtIHZhbHVlIGZvciBlbGVtZW50IDZcbiAgICAgKiBAcGFyYW0gdjcgLSB2YWx1ZSBmb3IgZWxlbWVudCA3XG4gICAgICogQHBhcmFtIHY4IC0gdmFsdWUgZm9yIGVsZW1lbnQgOFxuICAgICAqIEBwYXJhbSB2OSAtIHZhbHVlIGZvciBlbGVtZW50IDlcbiAgICAgKiBAcGFyYW0gdjEwIC0gdmFsdWUgZm9yIGVsZW1lbnQgMTBcbiAgICAgKiBAcGFyYW0gdjExIC0gdmFsdWUgZm9yIGVsZW1lbnQgMTFcbiAgICAgKiBAcGFyYW0gdjEyIC0gdmFsdWUgZm9yIGVsZW1lbnQgMTJcbiAgICAgKiBAcGFyYW0gdjEzIC0gdmFsdWUgZm9yIGVsZW1lbnQgMTNcbiAgICAgKiBAcGFyYW0gdjE0IC0gdmFsdWUgZm9yIGVsZW1lbnQgMTRcbiAgICAgKiBAcGFyYW0gdjE1IC0gdmFsdWUgZm9yIGVsZW1lbnQgMTVcbiAgICAgKiBAcmV0dXJucyBjcmVhdGVkIGZyb20gdmFsdWVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZSh2MCwgdjEsIHYyLCB2MywgdjQsIHY1LCB2NiwgdjcsIHY4LCB2OSwgdjEwLCB2MTEsIHYxMiwgdjEzLCB2MTQsIHYxNSkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSBuZXcgQ3RvcigxNik7XG4gICAgICAgIGlmICh2MCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSB2MDtcbiAgICAgICAgICAgIGlmICh2MSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzFdID0gdjE7XG4gICAgICAgICAgICAgICAgaWYgKHYyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzJdID0gdjI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2MyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbM10gPSB2MztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2NCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzRdID0gdjQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY1ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzVdID0gdjU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2NiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbNl0gPSB2NjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2NyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzddID0gdjc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHY4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzhdID0gdjg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2OSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEc3RbOV0gPSB2OTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2MTAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RzdFsxMF0gPSB2MTA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYxMSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RzdFsxMV0gPSB2MTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2MTIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzEyXSA9IHYxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2MTMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RzdFsxM10gPSB2MTM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYxNCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RzdFsxNF0gPSB2MTQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2MTUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzE1XSA9IHYxNTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZXMgb2YgYSBNYXQ0XG4gICAgICogQWxzbyBzZWUge0BsaW5rIG1hdDQuY3JlYXRlfSBhbmQge0BsaW5rIG1hdDQuY29weX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2MCAtIHZhbHVlIGZvciBlbGVtZW50IDBcbiAgICAgKiBAcGFyYW0gdjEgLSB2YWx1ZSBmb3IgZWxlbWVudCAxXG4gICAgICogQHBhcmFtIHYyIC0gdmFsdWUgZm9yIGVsZW1lbnQgMlxuICAgICAqIEBwYXJhbSB2MyAtIHZhbHVlIGZvciBlbGVtZW50IDNcbiAgICAgKiBAcGFyYW0gdjQgLSB2YWx1ZSBmb3IgZWxlbWVudCA0XG4gICAgICogQHBhcmFtIHY1IC0gdmFsdWUgZm9yIGVsZW1lbnQgNVxuICAgICAqIEBwYXJhbSB2NiAtIHZhbHVlIGZvciBlbGVtZW50IDZcbiAgICAgKiBAcGFyYW0gdjcgLSB2YWx1ZSBmb3IgZWxlbWVudCA3XG4gICAgICogQHBhcmFtIHY4IC0gdmFsdWUgZm9yIGVsZW1lbnQgOFxuICAgICAqIEBwYXJhbSB2OSAtIHZhbHVlIGZvciBlbGVtZW50IDlcbiAgICAgKiBAcGFyYW0gdjEwIC0gdmFsdWUgZm9yIGVsZW1lbnQgMTBcbiAgICAgKiBAcGFyYW0gdjExIC0gdmFsdWUgZm9yIGVsZW1lbnQgMTFcbiAgICAgKiBAcGFyYW0gdjEyIC0gdmFsdWUgZm9yIGVsZW1lbnQgMTJcbiAgICAgKiBAcGFyYW0gdjEzIC0gdmFsdWUgZm9yIGVsZW1lbnQgMTNcbiAgICAgKiBAcGFyYW0gdjE0IC0gdmFsdWUgZm9yIGVsZW1lbnQgMTRcbiAgICAgKiBAcGFyYW0gdjE1IC0gdmFsdWUgZm9yIGVsZW1lbnQgMTVcbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIE1hdDQgY3JlYXRlZCBmcm9tIHZhbHVlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQodjAsIHYxLCB2MiwgdjMsIHY0LCB2NSwgdjYsIHY3LCB2OCwgdjksIHYxMCwgdjExLCB2MTIsIHYxMywgdjE0LCB2MTUsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHYwO1xuICAgICAgICBuZXdEc3RbMV0gPSB2MTtcbiAgICAgICAgbmV3RHN0WzJdID0gdjI7XG4gICAgICAgIG5ld0RzdFszXSA9IHYzO1xuICAgICAgICBuZXdEc3RbNF0gPSB2NDtcbiAgICAgICAgbmV3RHN0WzVdID0gdjU7XG4gICAgICAgIG5ld0RzdFs2XSA9IHY2O1xuICAgICAgICBuZXdEc3RbN10gPSB2NztcbiAgICAgICAgbmV3RHN0WzhdID0gdjg7XG4gICAgICAgIG5ld0RzdFs5XSA9IHY5O1xuICAgICAgICBuZXdEc3RbMTBdID0gdjEwO1xuICAgICAgICBuZXdEc3RbMTFdID0gdjExO1xuICAgICAgICBuZXdEc3RbMTJdID0gdjEyO1xuICAgICAgICBuZXdEc3RbMTNdID0gdjEzO1xuICAgICAgICBuZXdEc3RbMTRdID0gdjE0O1xuICAgICAgICBuZXdEc3RbMTVdID0gdjE1O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgTWF0NCBmcm9tIGEgTWF0M1xuICAgICAqIEBwYXJhbSBtMyAtIHNvdXJjZSBtYXRyaXhcbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIE1hdDQgbWFkZSBmcm9tIG0zXG4gICAgICovXG4gICAgZnVuY3Rpb24gZnJvbU1hdDMobTMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IG0zWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtM1sxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gbTNbMl07XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IG0zWzRdO1xuICAgICAgICBuZXdEc3RbNV0gPSBtM1s1XTtcbiAgICAgICAgbmV3RHN0WzZdID0gbTNbNl07XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IG0zWzhdO1xuICAgICAgICBuZXdEc3RbOV0gPSBtM1s5XTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IG0zWzEwXTtcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMl0gPSAwO1xuICAgICAgICBuZXdEc3RbMTNdID0gMDtcbiAgICAgICAgbmV3RHN0WzE0XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgTWF0NCByb3RhdGlvbiBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0gcSAtIHF1YXRlcm5pb24gdG8gY3JlYXRlIG1hdHJpeCBmcm9tXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBNYXQ0IG1hZGUgZnJvbSBxXG4gICAgICovXG4gICAgZnVuY3Rpb24gZnJvbVF1YXQocSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgY29uc3QgeCA9IHFbMF07XG4gICAgICAgIGNvbnN0IHkgPSBxWzFdO1xuICAgICAgICBjb25zdCB6ID0gcVsyXTtcbiAgICAgICAgY29uc3QgdyA9IHFbM107XG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XG4gICAgICAgIGNvbnN0IHkyID0geSArIHk7XG4gICAgICAgIGNvbnN0IHoyID0geiArIHo7XG4gICAgICAgIGNvbnN0IHh4ID0geCAqIHgyO1xuICAgICAgICBjb25zdCB5eCA9IHkgKiB4MjtcbiAgICAgICAgY29uc3QgeXkgPSB5ICogeTI7XG4gICAgICAgIGNvbnN0IHp4ID0geiAqIHgyO1xuICAgICAgICBjb25zdCB6eSA9IHogKiB5MjtcbiAgICAgICAgY29uc3QgenogPSB6ICogejI7XG4gICAgICAgIGNvbnN0IHd4ID0gdyAqIHgyO1xuICAgICAgICBjb25zdCB3eSA9IHcgKiB5MjtcbiAgICAgICAgY29uc3Qgd3ogPSB3ICogejI7XG4gICAgICAgIG5ld0RzdFswXSA9IDEgLSB5eSAtIHp6O1xuICAgICAgICBuZXdEc3RbMV0gPSB5eCArIHd6O1xuICAgICAgICBuZXdEc3RbMl0gPSB6eCAtIHd5O1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSB5eCAtIHd6O1xuICAgICAgICBuZXdEc3RbNV0gPSAxIC0geHggLSB6ejtcbiAgICAgICAgbmV3RHN0WzZdID0genkgKyB3eDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0genggKyB3eTtcbiAgICAgICAgbmV3RHN0WzldID0genkgLSB3eDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IDEgLSB4eCAtIHl5O1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxM10gPSAwO1xuICAgICAgICBuZXdEc3RbMTRdID0gMDtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE5lZ2F0ZXMgYSBtYXRyaXguXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgLW0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbmVnYXRlKG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IC1tWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSAtbVsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gLW1bMl07XG4gICAgICAgIG5ld0RzdFszXSA9IC1tWzNdO1xuICAgICAgICBuZXdEc3RbNF0gPSAtbVs0XTtcbiAgICAgICAgbmV3RHN0WzVdID0gLW1bNV07XG4gICAgICAgIG5ld0RzdFs2XSA9IC1tWzZdO1xuICAgICAgICBuZXdEc3RbN10gPSAtbVs3XTtcbiAgICAgICAgbmV3RHN0WzhdID0gLW1bOF07XG4gICAgICAgIG5ld0RzdFs5XSA9IC1tWzldO1xuICAgICAgICBuZXdEc3RbMTBdID0gLW1bMTBdO1xuICAgICAgICBuZXdEc3RbMTFdID0gLW1bMTFdO1xuICAgICAgICBuZXdEc3RbMTJdID0gLW1bMTJdO1xuICAgICAgICBuZXdEc3RbMTNdID0gLW1bMTNdO1xuICAgICAgICBuZXdEc3RbMTRdID0gLW1bMTRdO1xuICAgICAgICBuZXdEc3RbMTVdID0gLW1bMTVdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgYSBtYXRyaXguIChzYW1lIGFzIHtAbGluayBtYXQ0LmNsb25lfSlcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgbWF0NC5jcmVhdGV9IGFuZCB7QGxpbmsgbWF0NC5zZXR9XG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBUaGUgbWF0cml4LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgY29weSBvZiBtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcHkobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gbVswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gbVsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gbVsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gbVszXTtcbiAgICAgICAgbmV3RHN0WzRdID0gbVs0XTtcbiAgICAgICAgbmV3RHN0WzVdID0gbVs1XTtcbiAgICAgICAgbmV3RHN0WzZdID0gbVs2XTtcbiAgICAgICAgbmV3RHN0WzddID0gbVs3XTtcbiAgICAgICAgbmV3RHN0WzhdID0gbVs4XTtcbiAgICAgICAgbmV3RHN0WzldID0gbVs5XTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IG1bMTBdO1xuICAgICAgICBuZXdEc3RbMTFdID0gbVsxMV07XG4gICAgICAgIG5ld0RzdFsxMl0gPSBtWzEyXTtcbiAgICAgICAgbmV3RHN0WzEzXSA9IG1bMTNdO1xuICAgICAgICBuZXdEc3RbMTRdID0gbVsxNF07XG4gICAgICAgIG5ld0RzdFsxNV0gPSBtWzE1XTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29waWVzIGEgbWF0cml4IChzYW1lIGFzIHtAbGluayBtYXQ0LmNvcHl9KVxuICAgICAqIEFsc28gc2VlIHtAbGluayBtYXQ0LmNyZWF0ZX0gYW5kIHtAbGluayBtYXQ0LnNldH1cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIFRoZSBtYXRyaXguIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBjb3B5IG9mIG0uXG4gICAgICovXG4gICAgY29uc3QgY2xvbmUgPSBjb3B5O1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIDIgbWF0cmljZXMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWxcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgbWF0cml4LlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCBtYXRyaXguXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiBtYXRyaWNlcyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVxdWFsc0FwcHJveGltYXRlbHkoYSwgYikge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYVswXSAtIGJbMF0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsxXSAtIGJbMV0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsyXSAtIGJbMl0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVszXSAtIGJbM10pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs0XSAtIGJbNF0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs1XSAtIGJbNV0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs2XSAtIGJbNl0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs3XSAtIGJbN10pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs4XSAtIGJbOF0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVs5XSAtIGJbOV0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsxMF0gLSBiWzEwXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzExXSAtIGJbMTFdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMTJdIC0gYlsxMl0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsxM10gLSBiWzEzXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzE0XSAtIGJbMTRdKSA8IEVQU0lMT04gJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFbMTVdIC0gYlsxNV0pIDwgRVBTSUxPTjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgMiBtYXRyaWNlcyBhcmUgZXhhY3RseSBlcXVhbFxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCBtYXRyaXguXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIG1hdHJpeC5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIG1hdHJpY2VzIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGFbMF0gPT09IGJbMF0gJiZcbiAgICAgICAgICAgIGFbMV0gPT09IGJbMV0gJiZcbiAgICAgICAgICAgIGFbMl0gPT09IGJbMl0gJiZcbiAgICAgICAgICAgIGFbM10gPT09IGJbM10gJiZcbiAgICAgICAgICAgIGFbNF0gPT09IGJbNF0gJiZcbiAgICAgICAgICAgIGFbNV0gPT09IGJbNV0gJiZcbiAgICAgICAgICAgIGFbNl0gPT09IGJbNl0gJiZcbiAgICAgICAgICAgIGFbN10gPT09IGJbN10gJiZcbiAgICAgICAgICAgIGFbOF0gPT09IGJbOF0gJiZcbiAgICAgICAgICAgIGFbOV0gPT09IGJbOV0gJiZcbiAgICAgICAgICAgIGFbMTBdID09PSBiWzEwXSAmJlxuICAgICAgICAgICAgYVsxMV0gPT09IGJbMTFdICYmXG4gICAgICAgICAgICBhWzEyXSA9PT0gYlsxMl0gJiZcbiAgICAgICAgICAgIGFbMTNdID09PSBiWzEzXSAmJlxuICAgICAgICAgICAgYVsxNF0gPT09IGJbMTRdICYmXG4gICAgICAgICAgICBhWzE1XSA9PT0gYlsxNV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSA0LWJ5LTQgaWRlbnRpdHkgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIDQtYnktNCBpZGVudGl0eSBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gaWRlbnRpdHkoZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gMTtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gMTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IDE7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNF0gPSAwO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGFrZXMgdGhlIHRyYW5zcG9zZSBvZiBhIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdHJhbnNwb3NlIG9mIG0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNwb3NlKG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGlmIChuZXdEc3QgPT09IG0pIHtcbiAgICAgICAgICAgIGxldCB0O1xuICAgICAgICAgICAgdCA9IG1bMV07XG4gICAgICAgICAgICBtWzFdID0gbVs0XTtcbiAgICAgICAgICAgIG1bNF0gPSB0O1xuICAgICAgICAgICAgdCA9IG1bMl07XG4gICAgICAgICAgICBtWzJdID0gbVs4XTtcbiAgICAgICAgICAgIG1bOF0gPSB0O1xuICAgICAgICAgICAgdCA9IG1bM107XG4gICAgICAgICAgICBtWzNdID0gbVsxMl07XG4gICAgICAgICAgICBtWzEyXSA9IHQ7XG4gICAgICAgICAgICB0ID0gbVs2XTtcbiAgICAgICAgICAgIG1bNl0gPSBtWzldO1xuICAgICAgICAgICAgbVs5XSA9IHQ7XG4gICAgICAgICAgICB0ID0gbVs3XTtcbiAgICAgICAgICAgIG1bN10gPSBtWzEzXTtcbiAgICAgICAgICAgIG1bMTNdID0gdDtcbiAgICAgICAgICAgIHQgPSBtWzExXTtcbiAgICAgICAgICAgIG1bMTFdID0gbVsxNF07XG4gICAgICAgICAgICBtWzE0XSA9IHQ7XG4gICAgICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG0wMCA9IG1bMCAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTAxID0gbVswICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtWzAgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0wMyA9IG1bMCAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgbTEwID0gbVsxICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMTEgPSBtWzEgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0xMiA9IG1bMSAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTEzID0gbVsxICogNCArIDNdO1xuICAgICAgICBjb25zdCBtMjAgPSBtWzIgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0yMSA9IG1bMiAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsyICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMjMgPSBtWzIgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IG0zMCA9IG1bMyAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTMxID0gbVszICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMzIgPSBtWzMgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0zMyA9IG1bMyAqIDQgKyAzXTtcbiAgICAgICAgbmV3RHN0WzBdID0gbTAwO1xuICAgICAgICBuZXdEc3RbMV0gPSBtMTA7XG4gICAgICAgIG5ld0RzdFsyXSA9IG0yMDtcbiAgICAgICAgbmV3RHN0WzNdID0gbTMwO1xuICAgICAgICBuZXdEc3RbNF0gPSBtMDE7XG4gICAgICAgIG5ld0RzdFs1XSA9IG0xMTtcbiAgICAgICAgbmV3RHN0WzZdID0gbTIxO1xuICAgICAgICBuZXdEc3RbN10gPSBtMzE7XG4gICAgICAgIG5ld0RzdFs4XSA9IG0wMjtcbiAgICAgICAgbmV3RHN0WzldID0gbTEyO1xuICAgICAgICBuZXdEc3RbMTBdID0gbTIyO1xuICAgICAgICBuZXdEc3RbMTFdID0gbTMyO1xuICAgICAgICBuZXdEc3RbMTJdID0gbTAzO1xuICAgICAgICBuZXdEc3RbMTNdID0gbTEzO1xuICAgICAgICBuZXdEc3RbMTRdID0gbTIzO1xuICAgICAgICBuZXdEc3RbMTVdID0gbTMzO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgaW52ZXJzZSBvZiBhIDQtYnktNCBtYXRyaXguXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGludmVyc2Ugb2YgbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnZlcnNlKG0sIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IG0wMCA9IG1bMCAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTAxID0gbVswICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtWzAgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0wMyA9IG1bMCAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgbTEwID0gbVsxICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMTEgPSBtWzEgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0xMiA9IG1bMSAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTEzID0gbVsxICogNCArIDNdO1xuICAgICAgICBjb25zdCBtMjAgPSBtWzIgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0yMSA9IG1bMiAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsyICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMjMgPSBtWzIgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IG0zMCA9IG1bMyAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTMxID0gbVszICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMzIgPSBtWzMgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0zMyA9IG1bMyAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgdG1wMCA9IG0yMiAqIG0zMztcbiAgICAgICAgY29uc3QgdG1wMSA9IG0zMiAqIG0yMztcbiAgICAgICAgY29uc3QgdG1wMiA9IG0xMiAqIG0zMztcbiAgICAgICAgY29uc3QgdG1wMyA9IG0zMiAqIG0xMztcbiAgICAgICAgY29uc3QgdG1wNCA9IG0xMiAqIG0yMztcbiAgICAgICAgY29uc3QgdG1wNSA9IG0yMiAqIG0xMztcbiAgICAgICAgY29uc3QgdG1wNiA9IG0wMiAqIG0zMztcbiAgICAgICAgY29uc3QgdG1wNyA9IG0zMiAqIG0wMztcbiAgICAgICAgY29uc3QgdG1wOCA9IG0wMiAqIG0yMztcbiAgICAgICAgY29uc3QgdG1wOSA9IG0yMiAqIG0wMztcbiAgICAgICAgY29uc3QgdG1wMTAgPSBtMDIgKiBtMTM7XG4gICAgICAgIGNvbnN0IHRtcDExID0gbTEyICogbTAzO1xuICAgICAgICBjb25zdCB0bXAxMiA9IG0yMCAqIG0zMTtcbiAgICAgICAgY29uc3QgdG1wMTMgPSBtMzAgKiBtMjE7XG4gICAgICAgIGNvbnN0IHRtcDE0ID0gbTEwICogbTMxO1xuICAgICAgICBjb25zdCB0bXAxNSA9IG0zMCAqIG0xMTtcbiAgICAgICAgY29uc3QgdG1wMTYgPSBtMTAgKiBtMjE7XG4gICAgICAgIGNvbnN0IHRtcDE3ID0gbTIwICogbTExO1xuICAgICAgICBjb25zdCB0bXAxOCA9IG0wMCAqIG0zMTtcbiAgICAgICAgY29uc3QgdG1wMTkgPSBtMzAgKiBtMDE7XG4gICAgICAgIGNvbnN0IHRtcDIwID0gbTAwICogbTIxO1xuICAgICAgICBjb25zdCB0bXAyMSA9IG0yMCAqIG0wMTtcbiAgICAgICAgY29uc3QgdG1wMjIgPSBtMDAgKiBtMTE7XG4gICAgICAgIGNvbnN0IHRtcDIzID0gbTEwICogbTAxO1xuICAgICAgICBjb25zdCB0MCA9ICh0bXAwICogbTExICsgdG1wMyAqIG0yMSArIHRtcDQgKiBtMzEpIC1cbiAgICAgICAgICAgICh0bXAxICogbTExICsgdG1wMiAqIG0yMSArIHRtcDUgKiBtMzEpO1xuICAgICAgICBjb25zdCB0MSA9ICh0bXAxICogbTAxICsgdG1wNiAqIG0yMSArIHRtcDkgKiBtMzEpIC1cbiAgICAgICAgICAgICh0bXAwICogbTAxICsgdG1wNyAqIG0yMSArIHRtcDggKiBtMzEpO1xuICAgICAgICBjb25zdCB0MiA9ICh0bXAyICogbTAxICsgdG1wNyAqIG0xMSArIHRtcDEwICogbTMxKSAtXG4gICAgICAgICAgICAodG1wMyAqIG0wMSArIHRtcDYgKiBtMTEgKyB0bXAxMSAqIG0zMSk7XG4gICAgICAgIGNvbnN0IHQzID0gKHRtcDUgKiBtMDEgKyB0bXA4ICogbTExICsgdG1wMTEgKiBtMjEpIC1cbiAgICAgICAgICAgICh0bXA0ICogbTAxICsgdG1wOSAqIG0xMSArIHRtcDEwICogbTIxKTtcbiAgICAgICAgY29uc3QgZCA9IDEgLyAobTAwICogdDAgKyBtMTAgKiB0MSArIG0yMCAqIHQyICsgbTMwICogdDMpO1xuICAgICAgICBuZXdEc3RbMF0gPSBkICogdDA7XG4gICAgICAgIG5ld0RzdFsxXSA9IGQgKiB0MTtcbiAgICAgICAgbmV3RHN0WzJdID0gZCAqIHQyO1xuICAgICAgICBuZXdEc3RbM10gPSBkICogdDM7XG4gICAgICAgIG5ld0RzdFs0XSA9IGQgKiAoKHRtcDEgKiBtMTAgKyB0bXAyICogbTIwICsgdG1wNSAqIG0zMCkgLVxuICAgICAgICAgICAgKHRtcDAgKiBtMTAgKyB0bXAzICogbTIwICsgdG1wNCAqIG0zMCkpO1xuICAgICAgICBuZXdEc3RbNV0gPSBkICogKCh0bXAwICogbTAwICsgdG1wNyAqIG0yMCArIHRtcDggKiBtMzApIC1cbiAgICAgICAgICAgICh0bXAxICogbTAwICsgdG1wNiAqIG0yMCArIHRtcDkgKiBtMzApKTtcbiAgICAgICAgbmV3RHN0WzZdID0gZCAqICgodG1wMyAqIG0wMCArIHRtcDYgKiBtMTAgKyB0bXAxMSAqIG0zMCkgLVxuICAgICAgICAgICAgKHRtcDIgKiBtMDAgKyB0bXA3ICogbTEwICsgdG1wMTAgKiBtMzApKTtcbiAgICAgICAgbmV3RHN0WzddID0gZCAqICgodG1wNCAqIG0wMCArIHRtcDkgKiBtMTAgKyB0bXAxMCAqIG0yMCkgLVxuICAgICAgICAgICAgKHRtcDUgKiBtMDAgKyB0bXA4ICogbTEwICsgdG1wMTEgKiBtMjApKTtcbiAgICAgICAgbmV3RHN0WzhdID0gZCAqICgodG1wMTIgKiBtMTMgKyB0bXAxNSAqIG0yMyArIHRtcDE2ICogbTMzKSAtXG4gICAgICAgICAgICAodG1wMTMgKiBtMTMgKyB0bXAxNCAqIG0yMyArIHRtcDE3ICogbTMzKSk7XG4gICAgICAgIG5ld0RzdFs5XSA9IGQgKiAoKHRtcDEzICogbTAzICsgdG1wMTggKiBtMjMgKyB0bXAyMSAqIG0zMykgLVxuICAgICAgICAgICAgKHRtcDEyICogbTAzICsgdG1wMTkgKiBtMjMgKyB0bXAyMCAqIG0zMykpO1xuICAgICAgICBuZXdEc3RbMTBdID0gZCAqICgodG1wMTQgKiBtMDMgKyB0bXAxOSAqIG0xMyArIHRtcDIyICogbTMzKSAtXG4gICAgICAgICAgICAodG1wMTUgKiBtMDMgKyB0bXAxOCAqIG0xMyArIHRtcDIzICogbTMzKSk7XG4gICAgICAgIG5ld0RzdFsxMV0gPSBkICogKCh0bXAxNyAqIG0wMyArIHRtcDIwICogbTEzICsgdG1wMjMgKiBtMjMpIC1cbiAgICAgICAgICAgICh0bXAxNiAqIG0wMyArIHRtcDIxICogbTEzICsgdG1wMjIgKiBtMjMpKTtcbiAgICAgICAgbmV3RHN0WzEyXSA9IGQgKiAoKHRtcDE0ICogbTIyICsgdG1wMTcgKiBtMzIgKyB0bXAxMyAqIG0xMikgLVxuICAgICAgICAgICAgKHRtcDE2ICogbTMyICsgdG1wMTIgKiBtMTIgKyB0bXAxNSAqIG0yMikpO1xuICAgICAgICBuZXdEc3RbMTNdID0gZCAqICgodG1wMjAgKiBtMzIgKyB0bXAxMiAqIG0wMiArIHRtcDE5ICogbTIyKSAtXG4gICAgICAgICAgICAodG1wMTggKiBtMjIgKyB0bXAyMSAqIG0zMiArIHRtcDEzICogbTAyKSk7XG4gICAgICAgIG5ld0RzdFsxNF0gPSBkICogKCh0bXAxOCAqIG0xMiArIHRtcDIzICogbTMyICsgdG1wMTUgKiBtMDIpIC1cbiAgICAgICAgICAgICh0bXAyMiAqIG0zMiArIHRtcDE0ICogbTAyICsgdG1wMTkgKiBtMTIpKTtcbiAgICAgICAgbmV3RHN0WzE1XSA9IGQgKiAoKHRtcDIyICogbTIyICsgdG1wMTYgKiBtMDIgKyB0bXAyMSAqIG0xMikgLVxuICAgICAgICAgICAgKHRtcDIwICogbTEyICsgdG1wMjMgKiBtMjIgKyB0bXAxNyAqIG0wMikpO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIHRoZSBkZXRlcm1pbmFudCBvZiBhIG1hdHJpeFxuICAgICAqIEBwYXJhbSBtIC0gdGhlIG1hdHJpeFxuICAgICAqIEByZXR1cm5zIHRoZSBkZXRlcm1pbmFudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRldGVybWluYW50KG0pIHtcbiAgICAgICAgY29uc3QgbTAwID0gbVswICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMDEgPSBtWzAgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0wMiA9IG1bMCAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTAzID0gbVswICogNCArIDNdO1xuICAgICAgICBjb25zdCBtMTAgPSBtWzEgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bMSAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTEyID0gbVsxICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMTMgPSBtWzEgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bMiAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTIxID0gbVsyICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMjIgPSBtWzIgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0yMyA9IG1bMiAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgbTMwID0gbVszICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMzEgPSBtWzMgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0zMiA9IG1bMyAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTMzID0gbVszICogNCArIDNdO1xuICAgICAgICBjb25zdCB0bXAwID0gbTIyICogbTMzO1xuICAgICAgICBjb25zdCB0bXAxID0gbTMyICogbTIzO1xuICAgICAgICBjb25zdCB0bXAyID0gbTEyICogbTMzO1xuICAgICAgICBjb25zdCB0bXAzID0gbTMyICogbTEzO1xuICAgICAgICBjb25zdCB0bXA0ID0gbTEyICogbTIzO1xuICAgICAgICBjb25zdCB0bXA1ID0gbTIyICogbTEzO1xuICAgICAgICBjb25zdCB0bXA2ID0gbTAyICogbTMzO1xuICAgICAgICBjb25zdCB0bXA3ID0gbTMyICogbTAzO1xuICAgICAgICBjb25zdCB0bXA4ID0gbTAyICogbTIzO1xuICAgICAgICBjb25zdCB0bXA5ID0gbTIyICogbTAzO1xuICAgICAgICBjb25zdCB0bXAxMCA9IG0wMiAqIG0xMztcbiAgICAgICAgY29uc3QgdG1wMTEgPSBtMTIgKiBtMDM7XG4gICAgICAgIGNvbnN0IHQwID0gKHRtcDAgKiBtMTEgKyB0bXAzICogbTIxICsgdG1wNCAqIG0zMSkgLVxuICAgICAgICAgICAgKHRtcDEgKiBtMTEgKyB0bXAyICogbTIxICsgdG1wNSAqIG0zMSk7XG4gICAgICAgIGNvbnN0IHQxID0gKHRtcDEgKiBtMDEgKyB0bXA2ICogbTIxICsgdG1wOSAqIG0zMSkgLVxuICAgICAgICAgICAgKHRtcDAgKiBtMDEgKyB0bXA3ICogbTIxICsgdG1wOCAqIG0zMSk7XG4gICAgICAgIGNvbnN0IHQyID0gKHRtcDIgKiBtMDEgKyB0bXA3ICogbTExICsgdG1wMTAgKiBtMzEpIC1cbiAgICAgICAgICAgICh0bXAzICogbTAxICsgdG1wNiAqIG0xMSArIHRtcDExICogbTMxKTtcbiAgICAgICAgY29uc3QgdDMgPSAodG1wNSAqIG0wMSArIHRtcDggKiBtMTEgKyB0bXAxMSAqIG0yMSkgLVxuICAgICAgICAgICAgKHRtcDQgKiBtMDEgKyB0bXA5ICogbTExICsgdG1wMTAgKiBtMjEpO1xuICAgICAgICByZXR1cm4gbTAwICogdDAgKyBtMTAgKiB0MSArIG0yMCAqIHQyICsgbTMwICogdDM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBpbnZlcnNlIG9mIGEgNC1ieS00IG1hdHJpeC4gKHNhbWUgYXMgaW52ZXJzZSlcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgaW52ZXJzZSBvZiBtLlxuICAgICAqL1xuICAgIGNvbnN0IGludmVydCA9IGludmVyc2U7XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyB0d28gNC1ieS00IG1hdHJpY2VzIHdpdGggYSBvbiB0aGUgbGVmdCBhbmQgYiBvbiB0aGUgcmlnaHRcbiAgICAgKiBAcGFyYW0gYSAtIFRoZSBtYXRyaXggb24gdGhlIGxlZnQuXG4gICAgICogQHBhcmFtIGIgLSBUaGUgbWF0cml4IG9uIHRoZSByaWdodC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBtYXRyaXggcHJvZHVjdCBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IGEwMCA9IGFbMF07XG4gICAgICAgIGNvbnN0IGEwMSA9IGFbMV07XG4gICAgICAgIGNvbnN0IGEwMiA9IGFbMl07XG4gICAgICAgIGNvbnN0IGEwMyA9IGFbM107XG4gICAgICAgIGNvbnN0IGExMCA9IGFbNCArIDBdO1xuICAgICAgICBjb25zdCBhMTEgPSBhWzQgKyAxXTtcbiAgICAgICAgY29uc3QgYTEyID0gYVs0ICsgMl07XG4gICAgICAgIGNvbnN0IGExMyA9IGFbNCArIDNdO1xuICAgICAgICBjb25zdCBhMjAgPSBhWzggKyAwXTtcbiAgICAgICAgY29uc3QgYTIxID0gYVs4ICsgMV07XG4gICAgICAgIGNvbnN0IGEyMiA9IGFbOCArIDJdO1xuICAgICAgICBjb25zdCBhMjMgPSBhWzggKyAzXTtcbiAgICAgICAgY29uc3QgYTMwID0gYVsxMiArIDBdO1xuICAgICAgICBjb25zdCBhMzEgPSBhWzEyICsgMV07XG4gICAgICAgIGNvbnN0IGEzMiA9IGFbMTIgKyAyXTtcbiAgICAgICAgY29uc3QgYTMzID0gYVsxMiArIDNdO1xuICAgICAgICBjb25zdCBiMDAgPSBiWzBdO1xuICAgICAgICBjb25zdCBiMDEgPSBiWzFdO1xuICAgICAgICBjb25zdCBiMDIgPSBiWzJdO1xuICAgICAgICBjb25zdCBiMDMgPSBiWzNdO1xuICAgICAgICBjb25zdCBiMTAgPSBiWzQgKyAwXTtcbiAgICAgICAgY29uc3QgYjExID0gYls0ICsgMV07XG4gICAgICAgIGNvbnN0IGIxMiA9IGJbNCArIDJdO1xuICAgICAgICBjb25zdCBiMTMgPSBiWzQgKyAzXTtcbiAgICAgICAgY29uc3QgYjIwID0gYls4ICsgMF07XG4gICAgICAgIGNvbnN0IGIyMSA9IGJbOCArIDFdO1xuICAgICAgICBjb25zdCBiMjIgPSBiWzggKyAyXTtcbiAgICAgICAgY29uc3QgYjIzID0gYls4ICsgM107XG4gICAgICAgIGNvbnN0IGIzMCA9IGJbMTIgKyAwXTtcbiAgICAgICAgY29uc3QgYjMxID0gYlsxMiArIDFdO1xuICAgICAgICBjb25zdCBiMzIgPSBiWzEyICsgMl07XG4gICAgICAgIGNvbnN0IGIzMyA9IGJbMTIgKyAzXTtcbiAgICAgICAgbmV3RHN0WzBdID0gYTAwICogYjAwICsgYTEwICogYjAxICsgYTIwICogYjAyICsgYTMwICogYjAzO1xuICAgICAgICBuZXdEc3RbMV0gPSBhMDEgKiBiMDAgKyBhMTEgKiBiMDEgKyBhMjEgKiBiMDIgKyBhMzEgKiBiMDM7XG4gICAgICAgIG5ld0RzdFsyXSA9IGEwMiAqIGIwMCArIGExMiAqIGIwMSArIGEyMiAqIGIwMiArIGEzMiAqIGIwMztcbiAgICAgICAgbmV3RHN0WzNdID0gYTAzICogYjAwICsgYTEzICogYjAxICsgYTIzICogYjAyICsgYTMzICogYjAzO1xuICAgICAgICBuZXdEc3RbNF0gPSBhMDAgKiBiMTAgKyBhMTAgKiBiMTEgKyBhMjAgKiBiMTIgKyBhMzAgKiBiMTM7XG4gICAgICAgIG5ld0RzdFs1XSA9IGEwMSAqIGIxMCArIGExMSAqIGIxMSArIGEyMSAqIGIxMiArIGEzMSAqIGIxMztcbiAgICAgICAgbmV3RHN0WzZdID0gYTAyICogYjEwICsgYTEyICogYjExICsgYTIyICogYjEyICsgYTMyICogYjEzO1xuICAgICAgICBuZXdEc3RbN10gPSBhMDMgKiBiMTAgKyBhMTMgKiBiMTEgKyBhMjMgKiBiMTIgKyBhMzMgKiBiMTM7XG4gICAgICAgIG5ld0RzdFs4XSA9IGEwMCAqIGIyMCArIGExMCAqIGIyMSArIGEyMCAqIGIyMiArIGEzMCAqIGIyMztcbiAgICAgICAgbmV3RHN0WzldID0gYTAxICogYjIwICsgYTExICogYjIxICsgYTIxICogYjIyICsgYTMxICogYjIzO1xuICAgICAgICBuZXdEc3RbMTBdID0gYTAyICogYjIwICsgYTEyICogYjIxICsgYTIyICogYjIyICsgYTMyICogYjIzO1xuICAgICAgICBuZXdEc3RbMTFdID0gYTAzICogYjIwICsgYTEzICogYjIxICsgYTIzICogYjIyICsgYTMzICogYjIzO1xuICAgICAgICBuZXdEc3RbMTJdID0gYTAwICogYjMwICsgYTEwICogYjMxICsgYTIwICogYjMyICsgYTMwICogYjMzO1xuICAgICAgICBuZXdEc3RbMTNdID0gYTAxICogYjMwICsgYTExICogYjMxICsgYTIxICogYjMyICsgYTMxICogYjMzO1xuICAgICAgICBuZXdEc3RbMTRdID0gYTAyICogYjMwICsgYTEyICogYjMxICsgYTIyICogYjMyICsgYTMyICogYjMzO1xuICAgICAgICBuZXdEc3RbMTVdID0gYTAzICogYjMwICsgYTEzICogYjMxICsgYTIzICogYjMyICsgYTMzICogYjMzO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIHR3byA0LWJ5LTQgbWF0cmljZXMgd2l0aCBhIG9uIHRoZSBsZWZ0IGFuZCBiIG9uIHRoZSByaWdodCAoc2FtZSBhcyBtdWx0aXBseSlcbiAgICAgKiBAcGFyYW0gYSAtIFRoZSBtYXRyaXggb24gdGhlIGxlZnQuXG4gICAgICogQHBhcmFtIGIgLSBUaGUgbWF0cml4IG9uIHRoZSByaWdodC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBtYXRyaXggcHJvZHVjdCBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGNvbnN0IG11bCA9IG11bHRpcGx5O1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHRyYW5zbGF0aW9uIGNvbXBvbmVudCBvZiBhIDQtYnktNCBtYXRyaXggdG8gdGhlIGdpdmVuXG4gICAgICogdmVjdG9yLlxuICAgICAqIEBwYXJhbSBhIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbWF0cml4IHdpdGggdHJhbnNsYXRpb24gc2V0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldFRyYW5zbGF0aW9uKGEsIHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IGlkZW50aXR5KCkpO1xuICAgICAgICBpZiAoYSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSBhWzBdO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gYVsxXTtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IGFbMl07XG4gICAgICAgICAgICBuZXdEc3RbM10gPSBhWzNdO1xuICAgICAgICAgICAgbmV3RHN0WzRdID0gYVs0XTtcbiAgICAgICAgICAgIG5ld0RzdFs1XSA9IGFbNV07XG4gICAgICAgICAgICBuZXdEc3RbNl0gPSBhWzZdO1xuICAgICAgICAgICAgbmV3RHN0WzddID0gYVs3XTtcbiAgICAgICAgICAgIG5ld0RzdFs4XSA9IGFbOF07XG4gICAgICAgICAgICBuZXdEc3RbOV0gPSBhWzldO1xuICAgICAgICAgICAgbmV3RHN0WzEwXSA9IGFbMTBdO1xuICAgICAgICAgICAgbmV3RHN0WzExXSA9IGFbMTFdO1xuICAgICAgICB9XG4gICAgICAgIG5ld0RzdFsxMl0gPSB2WzBdO1xuICAgICAgICBuZXdEc3RbMTNdID0gdlsxXTtcbiAgICAgICAgbmV3RHN0WzE0XSA9IHZbMl07XG4gICAgICAgIG5ld0RzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvLy8qKlxuICAgIC8vICogUmV0dXJucyB0aGUgdHJhbnNsYXRpb24gY29tcG9uZW50IG9mIGEgNC1ieS00IG1hdHJpeCBhcyBhIHZlY3RvciB3aXRoIDNcbiAgICAvLyAqIGVudHJpZXMuXG4gICAgLy8gKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgLy8gKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgIC8vICogQHJldHVybnMgVGhlIHRyYW5zbGF0aW9uIGNvbXBvbmVudCBvZiBtLlxuICAgIC8vICovXG4gICAgZnVuY3Rpb24gZ2V0VHJhbnNsYXRpb24obSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gdmVjMy5jcmVhdGUoKSk7XG4gICAgICAgIG5ld0RzdFswXSA9IG1bMTJdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtWzEzXTtcbiAgICAgICAgbmV3RHN0WzJdID0gbVsxNF07XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXhpcyBvZiBhIDR4NCBtYXRyaXggYXMgYSB2ZWN0b3Igd2l0aCAzIGVudHJpZXNcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGF4aXMgLSBUaGUgYXhpcyAwID0geCwgMSA9IHksIDIgPSB6O1xuICAgICAqIEByZXR1cm5zIFRoZSBheGlzIGNvbXBvbmVudCBvZiBtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEF4aXMobSwgYXhpcywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gdmVjMy5jcmVhdGUoKSk7XG4gICAgICAgIGNvbnN0IG9mZiA9IGF4aXMgKiA0O1xuICAgICAgICBuZXdEc3RbMF0gPSBtW29mZiArIDBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBtW29mZiArIDFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBtW29mZiArIDJdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGFuIGF4aXMgb2YgYSA0eDQgbWF0cml4IGFzIGEgdmVjdG9yIHdpdGggMyBlbnRyaWVzXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSB2IC0gdGhlIGF4aXMgdmVjdG9yXG4gICAgICogQHBhcmFtIGF4aXMgLSBUaGUgYXhpcyAgMCA9IHgsIDEgPSB5LCAyID0gejtcbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIG1hdHJpeCB0byBzZXQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG1hdHJpeCB3aXRoIGF4aXMgc2V0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldEF4aXMobSwgdiwgYXhpcywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPT09IG0pID8gZHN0IDogY29weShtLCBkc3QpO1xuICAgICAgICBjb25zdCBvZmYgPSBheGlzICogNDtcbiAgICAgICAgbmV3RHN0W29mZiArIDBdID0gdlswXTtcbiAgICAgICAgbmV3RHN0W29mZiArIDFdID0gdlsxXTtcbiAgICAgICAgbmV3RHN0W29mZiArIDJdID0gdlsyXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgXCIzZFwiIHNjYWxpbmcgY29tcG9uZW50IG9mIHRoZSBtYXRyaXhcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBNYXRyaXhcbiAgICAgKiBAcGFyYW0gZHN0IC0gVGhlIHZlY3RvciB0byBzZXQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0U2NhbGluZyhtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyB2ZWMzLmNyZWF0ZSgpKTtcbiAgICAgICAgY29uc3QgeHggPSBtWzBdO1xuICAgICAgICBjb25zdCB4eSA9IG1bMV07XG4gICAgICAgIGNvbnN0IHh6ID0gbVsyXTtcbiAgICAgICAgY29uc3QgeXggPSBtWzRdO1xuICAgICAgICBjb25zdCB5eSA9IG1bNV07XG4gICAgICAgIGNvbnN0IHl6ID0gbVs2XTtcbiAgICAgICAgY29uc3QgenggPSBtWzhdO1xuICAgICAgICBjb25zdCB6eSA9IG1bOV07XG4gICAgICAgIGNvbnN0IHp6ID0gbVsxMF07XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGguc3FydCh4eCAqIHh4ICsgeHkgKiB4eSArIHh6ICogeHopO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLnNxcnQoeXggKiB5eCArIHl5ICogeXkgKyB5eiAqIHl6KTtcbiAgICAgICAgbmV3RHN0WzJdID0gTWF0aC5zcXJ0KHp4ICogenggKyB6eSAqIHp5ICsgenogKiB6eik7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIGEgNC1ieS00IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBnaXZlbiB0aGUgYW5ndWxhciBoZWlnaHRcbiAgICAgKiBvZiB0aGUgZnJ1c3R1bSwgdGhlIGFzcGVjdCByYXRpbywgYW5kIHRoZSBuZWFyIGFuZCBmYXIgY2xpcHBpbmcgcGxhbmVzLiAgVGhlXG4gICAgICogYXJndW1lbnRzIGRlZmluZSBhIGZydXN0dW0gZXh0ZW5kaW5nIGluIHRoZSBuZWdhdGl2ZSB6IGRpcmVjdGlvbi4gIFRoZSBnaXZlblxuICAgICAqIGFuZ2xlIGlzIHRoZSB2ZXJ0aWNhbCBhbmdsZSBvZiB0aGUgZnJ1c3R1bSwgYW5kIHRoZSBob3Jpem9udGFsIGFuZ2xlIGlzXG4gICAgICogZGV0ZXJtaW5lZCB0byBwcm9kdWNlIHRoZSBnaXZlbiBhc3BlY3QgcmF0aW8uICBUaGUgYXJndW1lbnRzIG5lYXIgYW5kIGZhciBhcmVcbiAgICAgKiB0aGUgZGlzdGFuY2VzIHRvIHRoZSBuZWFyIGFuZCBmYXIgY2xpcHBpbmcgcGxhbmVzLiAgTm90ZSB0aGF0IG5lYXIgYW5kIGZhclxuICAgICAqIGFyZSBub3QgeiBjb29yZGluYXRlcywgYnV0IHJhdGhlciB0aGV5IGFyZSBkaXN0YW5jZXMgYWxvbmcgdGhlIG5lZ2F0aXZlXG4gICAgICogei1heGlzLiAgVGhlIG1hdHJpeCBnZW5lcmF0ZWQgc2VuZHMgdGhlIHZpZXdpbmcgZnJ1c3R1bSB0byB0aGUgdW5pdCBib3guXG4gICAgICogV2UgYXNzdW1lIGEgdW5pdCBib3ggZXh0ZW5kaW5nIGZyb20gLTEgdG8gMSBpbiB0aGUgeCBhbmQgeSBkaW1lbnNpb25zIGFuZFxuICAgICAqIGZyb20gMCB0byAxIGluIHRoZSB6IGRpbWVuc2lvbi5cbiAgICAgKlxuICAgICAqIE5vdGU6IElmIHlvdSBwYXNzIGBJbmZpbml0eWAgZm9yIHpGYXIgdGhlbiBpdCB3aWxsIHByb2R1Y2UgYSBwcm9qZWN0aW9uIG1hdHJpeFxuICAgICAqIHJldHVybnMgLUluZmluaXR5IGZvciBaIHdoZW4gdHJhbnNmb3JtaW5nIGNvb3JkaW5hdGVzIHdpdGggWiA8PSAwIGFuZCArSW5maW5pdHkgZm9yIFpcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmllbGRPZlZpZXdZSW5SYWRpYW5zIC0gVGhlIGNhbWVyYSBhbmdsZSBmcm9tIHRvcCB0byBib3R0b20gKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBhc3BlY3QgLSBUaGUgYXNwZWN0IHJhdGlvIHdpZHRoIC8gaGVpZ2h0LlxuICAgICAqIEBwYXJhbSB6TmVhciAtIFRoZSBkZXB0aCAobmVnYXRpdmUgeiBjb29yZGluYXRlKVxuICAgICAqICAgICBvZiB0aGUgbmVhciBjbGlwcGluZyBwbGFuZS5cbiAgICAgKiBAcGFyYW0gekZhciAtIFRoZSBkZXB0aCAobmVnYXRpdmUgeiBjb29yZGluYXRlKVxuICAgICAqICAgICBvZiB0aGUgZmFyIGNsaXBwaW5nIHBsYW5lLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHBlcnNwZWN0aXZlIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwZXJzcGVjdGl2ZShmaWVsZE9mVmlld1lJblJhZGlhbnMsIGFzcGVjdCwgek5lYXIsIHpGYXIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IGYgPSBNYXRoLnRhbihNYXRoLlBJICogMC41IC0gMC41ICogZmllbGRPZlZpZXdZSW5SYWRpYW5zKTtcbiAgICAgICAgbmV3RHN0WzBdID0gZiAvIGFzcGVjdDtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gZjtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gMDtcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzExXSA9IC0xO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNV0gPSAwO1xuICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHpGYXIpKSB7XG4gICAgICAgICAgICBjb25zdCByYW5nZUludiA9IDEgLyAoek5lYXIgLSB6RmFyKTtcbiAgICAgICAgICAgIG5ld0RzdFsxMF0gPSB6RmFyICogcmFuZ2VJbnY7XG4gICAgICAgICAgICBuZXdEc3RbMTRdID0gekZhciAqIHpOZWFyICogcmFuZ2VJbnY7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuZXdEc3RbMTBdID0gLTE7XG4gICAgICAgICAgICBuZXdEc3RbMTRdID0gLXpOZWFyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIGEgNC1ieS00IHJldmVyc2UteiBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggZ2l2ZW4gdGhlIGFuZ3VsYXIgaGVpZ2h0XG4gICAgICogb2YgdGhlIGZydXN0dW0sIHRoZSBhc3BlY3QgcmF0aW8sIGFuZCB0aGUgbmVhciBhbmQgZmFyIGNsaXBwaW5nIHBsYW5lcy4gIFRoZVxuICAgICAqIGFyZ3VtZW50cyBkZWZpbmUgYSBmcnVzdHVtIGV4dGVuZGluZyBpbiB0aGUgbmVnYXRpdmUgeiBkaXJlY3Rpb24uICBUaGUgZ2l2ZW5cbiAgICAgKiBhbmdsZSBpcyB0aGUgdmVydGljYWwgYW5nbGUgb2YgdGhlIGZydXN0dW0sIGFuZCB0aGUgaG9yaXpvbnRhbCBhbmdsZSBpc1xuICAgICAqIGRldGVybWluZWQgdG8gcHJvZHVjZSB0aGUgZ2l2ZW4gYXNwZWN0IHJhdGlvLiAgVGhlIGFyZ3VtZW50cyBuZWFyIGFuZCBmYXIgYXJlXG4gICAgICogdGhlIGRpc3RhbmNlcyB0byB0aGUgbmVhciBhbmQgZmFyIGNsaXBwaW5nIHBsYW5lcy4gIE5vdGUgdGhhdCBuZWFyIGFuZCBmYXJcbiAgICAgKiBhcmUgbm90IHogY29vcmRpbmF0ZXMsIGJ1dCByYXRoZXIgdGhleSBhcmUgZGlzdGFuY2VzIGFsb25nIHRoZSBuZWdhdGl2ZVxuICAgICAqIHotYXhpcy4gIFRoZSBtYXRyaXggZ2VuZXJhdGVkIHNlbmRzIHRoZSB2aWV3aW5nIGZydXN0dW0gdG8gdGhlIHVuaXQgYm94LlxuICAgICAqIFdlIGFzc3VtZSBhIHVuaXQgYm94IGV4dGVuZGluZyBmcm9tIC0xIHRvIDEgaW4gdGhlIHggYW5kIHkgZGltZW5zaW9ucyBhbmRcbiAgICAgKiBmcm9tIDEgKGF0IC16TmVhcikgdG8gMCAoYXQgLXpGYXIpIGluIHRoZSB6IGRpbWVuc2lvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWVsZE9mVmlld1lJblJhZGlhbnMgLSBUaGUgY2FtZXJhIGFuZ2xlIGZyb20gdG9wIHRvIGJvdHRvbSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGFzcGVjdCAtIFRoZSBhc3BlY3QgcmF0aW8gd2lkdGggLyBoZWlnaHQuXG4gICAgICogQHBhcmFtIHpOZWFyIC0gVGhlIGRlcHRoIChuZWdhdGl2ZSB6IGNvb3JkaW5hdGUpXG4gICAgICogICAgIG9mIHRoZSBuZWFyIGNsaXBwaW5nIHBsYW5lLlxuICAgICAqIEBwYXJhbSB6RmFyIC0gVGhlIGRlcHRoIChuZWdhdGl2ZSB6IGNvb3JkaW5hdGUpXG4gICAgICogICAgIG9mIHRoZSBmYXIgY2xpcHBpbmcgcGxhbmUuIChkZWZhdWx0ID0gSW5maW5pdHkpXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcGVyc3BlY3RpdmUgbWF0cml4LlxuICAgICAqLyBmdW5jdGlvbiBwZXJzcGVjdGl2ZVJldmVyc2VaKGZpZWxkT2ZWaWV3WUluUmFkaWFucywgYXNwZWN0LCB6TmVhciwgekZhciA9IEluZmluaXR5LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCBmID0gMSAvIE1hdGgudGFuKGZpZWxkT2ZWaWV3WUluUmFkaWFucyAqIDAuNSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGYgLyBhc3BlY3Q7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IGY7XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAtMTtcbiAgICAgICAgbmV3RHN0WzEyXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxM10gPSAwO1xuICAgICAgICBuZXdEc3RbMTVdID0gMDtcbiAgICAgICAgaWYgKHpGYXIgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICBuZXdEc3RbMTBdID0gMDtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSB6TmVhcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmdlSW52ID0gMSAvICh6RmFyIC0gek5lYXIpO1xuICAgICAgICAgICAgbmV3RHN0WzEwXSA9IHpOZWFyICogcmFuZ2VJbnY7XG4gICAgICAgICAgICBuZXdEc3RbMTRdID0gekZhciAqIHpOZWFyICogcmFuZ2VJbnY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgYSA0LWJ5LTQgb3J0aG9nb25hbCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggdGhhdCB0cmFuc2Zvcm1zIGZyb21cbiAgICAgKiB0aGUgZ2l2ZW4gdGhlIGxlZnQsIHJpZ2h0LCBib3R0b20sIGFuZCB0b3AgZGltZW5zaW9ucyB0byAtMSArMSBpbiB4LCBhbmQgeVxuICAgICAqIGFuZCAwIHRvICsxIGluIHouXG4gICAgICogQHBhcmFtIGxlZnQgLSBMZWZ0IHNpZGUgb2YgdGhlIG5lYXIgY2xpcHBpbmcgcGxhbmUgdmlld3BvcnQuXG4gICAgICogQHBhcmFtIHJpZ2h0IC0gUmlnaHQgc2lkZSBvZiB0aGUgbmVhciBjbGlwcGluZyBwbGFuZSB2aWV3cG9ydC5cbiAgICAgKiBAcGFyYW0gYm90dG9tIC0gQm90dG9tIG9mIHRoZSBuZWFyIGNsaXBwaW5nIHBsYW5lIHZpZXdwb3J0LlxuICAgICAqIEBwYXJhbSB0b3AgLSBUb3Agb2YgdGhlIG5lYXIgY2xpcHBpbmcgcGxhbmUgdmlld3BvcnQuXG4gICAgICogQHBhcmFtIG5lYXIgLSBUaGUgZGVwdGggKG5lZ2F0aXZlIHogY29vcmRpbmF0ZSlcbiAgICAgKiAgICAgb2YgdGhlIG5lYXIgY2xpcHBpbmcgcGxhbmUuXG4gICAgICogQHBhcmFtIGZhciAtIFRoZSBkZXB0aCAobmVnYXRpdmUgeiBjb29yZGluYXRlKVxuICAgICAqICAgICBvZiB0aGUgZmFyIGNsaXBwaW5nIHBsYW5lLlxuICAgICAqIEBwYXJhbSBkc3QgLSBPdXRwdXQgbWF0cml4LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBvcnRob2dyYXBoaWMgcHJvamVjdGlvbiBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gb3J0aG8obGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDIgLyAocmlnaHQgLSBsZWZ0KTtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gMiAvICh0b3AgLSBib3R0b20pO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTBdID0gMSAvIChuZWFyIC0gZmFyKTtcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMl0gPSAocmlnaHQgKyBsZWZ0KSAvIChsZWZ0IC0gcmlnaHQpO1xuICAgICAgICBuZXdEc3RbMTNdID0gKHRvcCArIGJvdHRvbSkgLyAoYm90dG9tIC0gdG9wKTtcbiAgICAgICAgbmV3RHN0WzE0XSA9IG5lYXIgLyAobmVhciAtIGZhcik7XG4gICAgICAgIG5ld0RzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyBhIDQtYnktNCBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggZ2l2ZW4gdGhlIGxlZnQsIHJpZ2h0LFxuICAgICAqIHRvcCwgYm90dG9tLCBuZWFyIGFuZCBmYXIgY2xpcHBpbmcgcGxhbmVzLiBUaGUgYXJndW1lbnRzIGRlZmluZSBhIGZydXN0dW1cbiAgICAgKiBleHRlbmRpbmcgaW4gdGhlIG5lZ2F0aXZlIHogZGlyZWN0aW9uLiBUaGUgYXJndW1lbnRzIG5lYXIgYW5kIGZhciBhcmUgdGhlXG4gICAgICogZGlzdGFuY2VzIHRvIHRoZSBuZWFyIGFuZCBmYXIgY2xpcHBpbmcgcGxhbmVzLiBOb3RlIHRoYXQgbmVhciBhbmQgZmFyIGFyZSBub3RcbiAgICAgKiB6IGNvb3JkaW5hdGVzLCBidXQgcmF0aGVyIHRoZXkgYXJlIGRpc3RhbmNlcyBhbG9uZyB0aGUgbmVnYXRpdmUgei1heGlzLiBUaGVcbiAgICAgKiBtYXRyaXggZ2VuZXJhdGVkIHNlbmRzIHRoZSB2aWV3aW5nIGZydXN0dW0gdG8gdGhlIHVuaXQgYm94LiBXZSBhc3N1bWUgYSB1bml0XG4gICAgICogYm94IGV4dGVuZGluZyBmcm9tIC0xIHRvIDEgaW4gdGhlIHggYW5kIHkgZGltZW5zaW9ucyBhbmQgZnJvbSAwIHRvIDEgaW4gdGhlIHpcbiAgICAgKiBkaW1lbnNpb24uXG4gICAgICogQHBhcmFtIGxlZnQgLSBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSBsZWZ0IHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIHJpZ2h0IC0gVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcmlnaHQgcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gYm90dG9tIC0gVGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgYm90dG9tIHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIHRvcCAtIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHJpZ2h0IHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIG5lYXIgLSBUaGUgbmVnYXRpdmUgeiBjb29yZGluYXRlIG9mIHRoZSBuZWFyIHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIGZhciAtIFRoZSBuZWdhdGl2ZSB6IGNvb3JkaW5hdGUgb2YgdGhlIGZhciBwbGFuZSBvZiB0aGUgYm94LlxuICAgICAqIEBwYXJhbSBkc3QgLSBPdXRwdXQgbWF0cml4LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmcnVzdHVtKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCBkeCA9IChyaWdodCAtIGxlZnQpO1xuICAgICAgICBjb25zdCBkeSA9ICh0b3AgLSBib3R0b20pO1xuICAgICAgICBjb25zdCBkeiA9IChuZWFyIC0gZmFyKTtcbiAgICAgICAgbmV3RHN0WzBdID0gMiAqIG5lYXIgLyBkeDtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gMiAqIG5lYXIgLyBkeTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gKGxlZnQgKyByaWdodCkgLyBkeDtcbiAgICAgICAgbmV3RHN0WzldID0gKHRvcCArIGJvdHRvbSkgLyBkeTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IGZhciAvIGR6O1xuICAgICAgICBuZXdEc3RbMTFdID0gLTE7XG4gICAgICAgIG5ld0RzdFsxMl0gPSAwO1xuICAgICAgICBuZXdEc3RbMTNdID0gMDtcbiAgICAgICAgbmV3RHN0WzE0XSA9IG5lYXIgKiBmYXIgLyBkejtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDA7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIGEgNC1ieS00IHJldmVyc2UteiBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggZ2l2ZW4gdGhlIGxlZnQsIHJpZ2h0LFxuICAgICAqIHRvcCwgYm90dG9tLCBuZWFyIGFuZCBmYXIgY2xpcHBpbmcgcGxhbmVzLiBUaGUgYXJndW1lbnRzIGRlZmluZSBhIGZydXN0dW1cbiAgICAgKiBleHRlbmRpbmcgaW4gdGhlIG5lZ2F0aXZlIHogZGlyZWN0aW9uLiBUaGUgYXJndW1lbnRzIG5lYXIgYW5kIGZhciBhcmUgdGhlXG4gICAgICogZGlzdGFuY2VzIHRvIHRoZSBuZWFyIGFuZCBmYXIgY2xpcHBpbmcgcGxhbmVzLiBOb3RlIHRoYXQgbmVhciBhbmQgZmFyIGFyZSBub3RcbiAgICAgKiB6IGNvb3JkaW5hdGVzLCBidXQgcmF0aGVyIHRoZXkgYXJlIGRpc3RhbmNlcyBhbG9uZyB0aGUgbmVnYXRpdmUgei1heGlzLiBUaGVcbiAgICAgKiBtYXRyaXggZ2VuZXJhdGVkIHNlbmRzIHRoZSB2aWV3aW5nIGZydXN0dW0gdG8gdGhlIHVuaXQgYm94LiBXZSBhc3N1bWUgYSB1bml0XG4gICAgICogYm94IGV4dGVuZGluZyBmcm9tIC0xIHRvIDEgaW4gdGhlIHggYW5kIHkgZGltZW5zaW9ucyBhbmQgZnJvbSAxICgtbmVhcikgdG8gMCAoLWZhcikgaW4gdGhlIHpcbiAgICAgKiBkaW1lbnNpb24uXG4gICAgICogQHBhcmFtIGxlZnQgLSBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSBsZWZ0IHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIHJpZ2h0IC0gVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcmlnaHQgcGxhbmUgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0gYm90dG9tIC0gVGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgYm90dG9tIHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIHRvcCAtIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHJpZ2h0IHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIG5lYXIgLSBUaGUgbmVnYXRpdmUgeiBjb29yZGluYXRlIG9mIHRoZSBuZWFyIHBsYW5lIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIGZhciAtIFRoZSBuZWdhdGl2ZSB6IGNvb3JkaW5hdGUgb2YgdGhlIGZhciBwbGFuZSBvZiB0aGUgYm94LlxuICAgICAqIEBwYXJhbSBkc3QgLSBPdXRwdXQgbWF0cml4LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmcnVzdHVtUmV2ZXJzZVoobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIgPSBJbmZpbml0eSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgY29uc3QgZHggPSAocmlnaHQgLSBsZWZ0KTtcbiAgICAgICAgY29uc3QgZHkgPSAodG9wIC0gYm90dG9tKTtcbiAgICAgICAgbmV3RHN0WzBdID0gMiAqIG5lYXIgLyBkeDtcbiAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gMiAqIG5lYXIgLyBkeTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gKGxlZnQgKyByaWdodCkgLyBkeDtcbiAgICAgICAgbmV3RHN0WzldID0gKHRvcCArIGJvdHRvbSkgLyBkeTtcbiAgICAgICAgbmV3RHN0WzExXSA9IC0xO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNV0gPSAwO1xuICAgICAgICBpZiAoZmFyID09PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgbmV3RHN0WzEwXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbMTRdID0gbmVhcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmdlSW52ID0gMSAvIChmYXIgLSBuZWFyKTtcbiAgICAgICAgICAgIG5ld0RzdFsxMF0gPSBuZWFyICogcmFuZ2VJbnY7XG4gICAgICAgICAgICBuZXdEc3RbMTRdID0gZmFyICogbmVhciAqIHJhbmdlSW52O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIGNvbnN0IHhBeGlzID0gdmVjMy5jcmVhdGUoKTtcbiAgICBjb25zdCB5QXhpcyA9IHZlYzMuY3JlYXRlKCk7XG4gICAgY29uc3QgekF4aXMgPSB2ZWMzLmNyZWF0ZSgpO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIGEgNC1ieS00IGFpbSB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgYSBtYXRyaXggd2hpY2ggcG9zaXRpb25zIGFuIG9iamVjdCBhaW1pbmcgZG93biBwb3NpdGl2ZSBaLlxuICAgICAqIHRvd2FyZCB0aGUgdGFyZ2V0LlxuICAgICAqXG4gICAgICogTm90ZTogdGhpcyBpcyAqKk5PVCoqIHRoZSBpbnZlcnNlIG9mIGxvb2tBdCBhcyBsb29rQXQgbG9va3MgYXQgbmVnYXRpdmUgWi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAtIFRoZSBwb3NpdGlvbiBvZiB0aGUgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgcG9zaXRpb24gbWVhbnQgdG8gYmUgYWltZWQgYXQuXG4gICAgICogQHBhcmFtIHVwIC0gQSB2ZWN0b3IgcG9pbnRpbmcgdXAuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgYWltIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhaW0ocG9zaXRpb24sIHRhcmdldCwgdXAsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIHZlYzMubm9ybWFsaXplKHZlYzMuc3VidHJhY3QodGFyZ2V0LCBwb3NpdGlvbiwgekF4aXMpLCB6QXhpcyk7XG4gICAgICAgIHZlYzMubm9ybWFsaXplKHZlYzMuY3Jvc3ModXAsIHpBeGlzLCB4QXhpcyksIHhBeGlzKTtcbiAgICAgICAgdmVjMy5ub3JtYWxpemUodmVjMy5jcm9zcyh6QXhpcywgeEF4aXMsIHlBeGlzKSwgeUF4aXMpO1xuICAgICAgICBuZXdEc3RbMF0gPSB4QXhpc1swXTtcbiAgICAgICAgbmV3RHN0WzFdID0geEF4aXNbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IHhBeGlzWzJdO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSB5QXhpc1swXTtcbiAgICAgICAgbmV3RHN0WzVdID0geUF4aXNbMV07XG4gICAgICAgIG5ld0RzdFs2XSA9IHlBeGlzWzJdO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSB6QXhpc1swXTtcbiAgICAgICAgbmV3RHN0WzldID0gekF4aXNbMV07XG4gICAgICAgIG5ld0RzdFsxMF0gPSB6QXhpc1syXTtcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMl0gPSBwb3NpdGlvblswXTtcbiAgICAgICAgbmV3RHN0WzEzXSA9IHBvc2l0aW9uWzFdO1xuICAgICAgICBuZXdEc3RbMTRdID0gcG9zaXRpb25bMl07XG4gICAgICAgIG5ld0RzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyBhIDQtYnktNCBjYW1lcmEgYWltIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqXG4gICAgICogVGhpcyBpcyBhIG1hdHJpeCB3aGljaCBwb3NpdGlvbnMgYW4gb2JqZWN0IGFpbWluZyBkb3duIG5lZ2F0aXZlIFouXG4gICAgICogdG93YXJkIHRoZSB0YXJnZXQuXG4gICAgICpcbiAgICAgKiBOb3RlOiB0aGlzIGlzIHRoZSBpbnZlcnNlIG9mIGBsb29rQXRgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXllIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSBwb3NpdGlvbiBtZWFudCB0byBiZSBhaW1lZCBhdC5cbiAgICAgKiBAcGFyYW0gdXAgLSBBIHZlY3RvciBwb2ludGluZyB1cC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBhaW0gbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhbWVyYUFpbShleWUsIHRhcmdldCwgdXAsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIHZlYzMubm9ybWFsaXplKHZlYzMuc3VidHJhY3QoZXllLCB0YXJnZXQsIHpBeGlzKSwgekF4aXMpO1xuICAgICAgICB2ZWMzLm5vcm1hbGl6ZSh2ZWMzLmNyb3NzKHVwLCB6QXhpcywgeEF4aXMpLCB4QXhpcyk7XG4gICAgICAgIHZlYzMubm9ybWFsaXplKHZlYzMuY3Jvc3MoekF4aXMsIHhBeGlzLCB5QXhpcyksIHlBeGlzKTtcbiAgICAgICAgbmV3RHN0WzBdID0geEF4aXNbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHhBeGlzWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSB4QXhpc1syXTtcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0geUF4aXNbMF07XG4gICAgICAgIG5ld0RzdFs1XSA9IHlBeGlzWzFdO1xuICAgICAgICBuZXdEc3RbNl0gPSB5QXhpc1syXTtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gekF4aXNbMF07XG4gICAgICAgIG5ld0RzdFs5XSA9IHpBeGlzWzFdO1xuICAgICAgICBuZXdEc3RbMTBdID0gekF4aXNbMl07XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gZXllWzBdO1xuICAgICAgICBuZXdEc3RbMTNdID0gZXllWzFdO1xuICAgICAgICBuZXdEc3RbMTRdID0gZXllWzJdO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgYSA0LWJ5LTQgdmlldyB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgYSB2aWV3IG1hdHJpeCB3aGljaCB0cmFuc2Zvcm1zIGFsbCBvdGhlciBvYmplY3RzXG4gICAgICogdG8gYmUgaW4gdGhlIHNwYWNlIG9mIHRoZSB2aWV3IGRlZmluZWQgYnkgdGhlIHBhcmFtZXRlcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXllIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSBwb3NpdGlvbiBtZWFudCB0byBiZSBhaW1lZCBhdC5cbiAgICAgKiBAcGFyYW0gdXAgLSBBIHZlY3RvciBwb2ludGluZyB1cC5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBsb29rLWF0IG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb29rQXQoZXllLCB0YXJnZXQsIHVwLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICB2ZWMzLm5vcm1hbGl6ZSh2ZWMzLnN1YnRyYWN0KGV5ZSwgdGFyZ2V0LCB6QXhpcyksIHpBeGlzKTtcbiAgICAgICAgdmVjMy5ub3JtYWxpemUodmVjMy5jcm9zcyh1cCwgekF4aXMsIHhBeGlzKSwgeEF4aXMpO1xuICAgICAgICB2ZWMzLm5vcm1hbGl6ZSh2ZWMzLmNyb3NzKHpBeGlzLCB4QXhpcywgeUF4aXMpLCB5QXhpcyk7XG4gICAgICAgIG5ld0RzdFswXSA9IHhBeGlzWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSB5QXhpc1swXTtcbiAgICAgICAgbmV3RHN0WzJdID0gekF4aXNbMF07XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IHhBeGlzWzFdO1xuICAgICAgICBuZXdEc3RbNV0gPSB5QXhpc1sxXTtcbiAgICAgICAgbmV3RHN0WzZdID0gekF4aXNbMV07XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IHhBeGlzWzJdO1xuICAgICAgICBuZXdEc3RbOV0gPSB5QXhpc1syXTtcbiAgICAgICAgbmV3RHN0WzEwXSA9IHpBeGlzWzJdO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IC0oeEF4aXNbMF0gKiBleWVbMF0gKyB4QXhpc1sxXSAqIGV5ZVsxXSArIHhBeGlzWzJdICogZXllWzJdKTtcbiAgICAgICAgbmV3RHN0WzEzXSA9IC0oeUF4aXNbMF0gKiBleWVbMF0gKyB5QXhpc1sxXSAqIGV5ZVsxXSArIHlBeGlzWzJdICogZXllWzJdKTtcbiAgICAgICAgbmV3RHN0WzE0XSA9IC0oekF4aXNbMF0gKiBleWVbMF0gKyB6QXhpc1sxXSAqIGV5ZVsxXSArIHpBeGlzWzJdICogZXllWzJdKTtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSA0LWJ5LTQgbWF0cml4IHdoaWNoIHRyYW5zbGF0ZXMgYnkgdGhlIGdpdmVuIHZlY3RvciB2LlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3RvciBieVxuICAgICAqICAgICB3aGljaCB0byB0cmFuc2xhdGUuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgdHJhbnNsYXRpb24gbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zbGF0aW9uKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDE7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IDE7XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSAxO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IHZbMF07XG4gICAgICAgIG5ld0RzdFsxM10gPSB2WzFdO1xuICAgICAgICBuZXdEc3RbMTRdID0gdlsyXTtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZXMgdGhlIGdpdmVuIDQtYnktNCBtYXRyaXggYnkgdGhlIGdpdmVuIHZlY3RvciB2LlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IgYnlcbiAgICAgKiAgICAgd2hpY2ggdG8gdHJhbnNsYXRlLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHRyYW5zbGF0ZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZShtLCB2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgY29uc3QgdjIgPSB2WzJdO1xuICAgICAgICBjb25zdCBtMDAgPSBtWzBdO1xuICAgICAgICBjb25zdCBtMDEgPSBtWzFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtWzJdO1xuICAgICAgICBjb25zdCBtMDMgPSBtWzNdO1xuICAgICAgICBjb25zdCBtMTAgPSBtWzEgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bMSAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTEyID0gbVsxICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMTMgPSBtWzEgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bMiAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTIxID0gbVsyICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMjIgPSBtWzIgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0yMyA9IG1bMiAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgbTMwID0gbVszICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMzEgPSBtWzMgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0zMiA9IG1bMyAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTMzID0gbVszICogNCArIDNdO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSBtMDA7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSBtMDE7XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSBtMDI7XG4gICAgICAgICAgICBuZXdEc3RbM10gPSBtMDM7XG4gICAgICAgICAgICBuZXdEc3RbNF0gPSBtMTA7XG4gICAgICAgICAgICBuZXdEc3RbNV0gPSBtMTE7XG4gICAgICAgICAgICBuZXdEc3RbNl0gPSBtMTI7XG4gICAgICAgICAgICBuZXdEc3RbN10gPSBtMTM7XG4gICAgICAgICAgICBuZXdEc3RbOF0gPSBtMjA7XG4gICAgICAgICAgICBuZXdEc3RbOV0gPSBtMjE7XG4gICAgICAgICAgICBuZXdEc3RbMTBdID0gbTIyO1xuICAgICAgICAgICAgbmV3RHN0WzExXSA9IG0yMztcbiAgICAgICAgfVxuICAgICAgICBuZXdEc3RbMTJdID0gbTAwICogdjAgKyBtMTAgKiB2MSArIG0yMCAqIHYyICsgbTMwO1xuICAgICAgICBuZXdEc3RbMTNdID0gbTAxICogdjAgKyBtMTEgKiB2MSArIG0yMSAqIHYyICsgbTMxO1xuICAgICAgICBuZXdEc3RbMTRdID0gbTAyICogdjAgKyBtMTIgKiB2MSArIG0yMiAqIHYyICsgbTMyO1xuICAgICAgICBuZXdEc3RbMTVdID0gbTAzICogdjAgKyBtMTMgKiB2MSArIG0yMyAqIHYyICsgbTMzO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgNC1ieS00IG1hdHJpeCB3aGljaCByb3RhdGVzIGFyb3VuZCB0aGUgeC1heGlzIGJ5IHRoZSBnaXZlbiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGlvbiBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRpb25YKGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbMF0gPSAxO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICBuZXdEc3RbNF0gPSAwO1xuICAgICAgICBuZXdEc3RbNV0gPSBjO1xuICAgICAgICBuZXdEc3RbNl0gPSBzO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAtcztcbiAgICAgICAgbmV3RHN0WzEwXSA9IGM7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNF0gPSAwO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gNC1ieS00IG1hdHJpeCBhcm91bmQgdGhlIHgtYXhpcyBieSB0aGUgZ2l2ZW5cbiAgICAgKiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlWChtLCBhbmdsZUluUmFkaWFucywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgY29uc3QgbTEwID0gbVs0XTtcbiAgICAgICAgY29uc3QgbTExID0gbVs1XTtcbiAgICAgICAgY29uc3QgbTEyID0gbVs2XTtcbiAgICAgICAgY29uc3QgbTEzID0gbVs3XTtcbiAgICAgICAgY29uc3QgbTIwID0gbVs4XTtcbiAgICAgICAgY29uc3QgbTIxID0gbVs5XTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsxMF07XG4gICAgICAgIGNvbnN0IG0yMyA9IG1bMTFdO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbNF0gPSBjICogbTEwICsgcyAqIG0yMDtcbiAgICAgICAgbmV3RHN0WzVdID0gYyAqIG0xMSArIHMgKiBtMjE7XG4gICAgICAgIG5ld0RzdFs2XSA9IGMgKiBtMTIgKyBzICogbTIyO1xuICAgICAgICBuZXdEc3RbN10gPSBjICogbTEzICsgcyAqIG0yMztcbiAgICAgICAgbmV3RHN0WzhdID0gYyAqIG0yMCAtIHMgKiBtMTA7XG4gICAgICAgIG5ld0RzdFs5XSA9IGMgKiBtMjEgLSBzICogbTExO1xuICAgICAgICBuZXdEc3RbMTBdID0gYyAqIG0yMiAtIHMgKiBtMTI7XG4gICAgICAgIG5ld0RzdFsxMV0gPSBjICogbTIzIC0gcyAqIG0xMztcbiAgICAgICAgaWYgKG0gIT09IG5ld0RzdCkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gbVswXTtcbiAgICAgICAgICAgIG5ld0RzdFsxXSA9IG1bMV07XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSBtWzJdO1xuICAgICAgICAgICAgbmV3RHN0WzNdID0gbVszXTtcbiAgICAgICAgICAgIG5ld0RzdFsxMl0gPSBtWzEyXTtcbiAgICAgICAgICAgIG5ld0RzdFsxM10gPSBtWzEzXTtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSBtWzE0XTtcbiAgICAgICAgICAgIG5ld0RzdFsxNV0gPSBtWzE1XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgNC1ieS00IG1hdHJpeCB3aGljaCByb3RhdGVzIGFyb3VuZCB0aGUgeS1heGlzIGJ5IHRoZSBnaXZlbiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGlvbiBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRpb25ZKGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICBuZXdEc3RbMF0gPSBjO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAtcztcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0gMDtcbiAgICAgICAgbmV3RHN0WzVdID0gMTtcbiAgICAgICAgbmV3RHN0WzZdID0gMDtcbiAgICAgICAgbmV3RHN0WzddID0gMDtcbiAgICAgICAgbmV3RHN0WzhdID0gcztcbiAgICAgICAgbmV3RHN0WzldID0gMDtcbiAgICAgICAgbmV3RHN0WzEwXSA9IGM7XG4gICAgICAgIG5ld0RzdFsxMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTJdID0gMDtcbiAgICAgICAgbmV3RHN0WzEzXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNF0gPSAwO1xuICAgICAgICBuZXdEc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gNC1ieS00IG1hdHJpeCBhcm91bmQgdGhlIHktYXhpcyBieSB0aGUgZ2l2ZW5cbiAgICAgKiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRlZCBtYXRyaXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlWShtLCBhbmdsZUluUmFkaWFucywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoMTYpKTtcbiAgICAgICAgY29uc3QgbTAwID0gbVswICogNCArIDBdO1xuICAgICAgICBjb25zdCBtMDEgPSBtWzAgKiA0ICsgMV07XG4gICAgICAgIGNvbnN0IG0wMiA9IG1bMCAqIDQgKyAyXTtcbiAgICAgICAgY29uc3QgbTAzID0gbVswICogNCArIDNdO1xuICAgICAgICBjb25zdCBtMjAgPSBtWzIgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0yMSA9IG1bMiAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTIyID0gbVsyICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMjMgPSBtWzIgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFswXSA9IGMgKiBtMDAgLSBzICogbTIwO1xuICAgICAgICBuZXdEc3RbMV0gPSBjICogbTAxIC0gcyAqIG0yMTtcbiAgICAgICAgbmV3RHN0WzJdID0gYyAqIG0wMiAtIHMgKiBtMjI7XG4gICAgICAgIG5ld0RzdFszXSA9IGMgKiBtMDMgLSBzICogbTIzO1xuICAgICAgICBuZXdEc3RbOF0gPSBjICogbTIwICsgcyAqIG0wMDtcbiAgICAgICAgbmV3RHN0WzldID0gYyAqIG0yMSArIHMgKiBtMDE7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBjICogbTIyICsgcyAqIG0wMjtcbiAgICAgICAgbmV3RHN0WzExXSA9IGMgKiBtMjMgKyBzICogbTAzO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbNF0gPSBtWzRdO1xuICAgICAgICAgICAgbmV3RHN0WzVdID0gbVs1XTtcbiAgICAgICAgICAgIG5ld0RzdFs2XSA9IG1bNl07XG4gICAgICAgICAgICBuZXdEc3RbN10gPSBtWzddO1xuICAgICAgICAgICAgbmV3RHN0WzEyXSA9IG1bMTJdO1xuICAgICAgICAgICAgbmV3RHN0WzEzXSA9IG1bMTNdO1xuICAgICAgICAgICAgbmV3RHN0WzE0XSA9IG1bMTRdO1xuICAgICAgICAgICAgbmV3RHN0WzE1XSA9IG1bMTVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSA0LWJ5LTQgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYXJvdW5kIHRoZSB6LWF4aXMgYnkgdGhlIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGUgKGluIHJhZGlhbnMpLlxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHJvdGF0aW9uIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGlvblooYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIG5ld0RzdFswXSA9IGM7XG4gICAgICAgIG5ld0RzdFsxXSA9IHM7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IC1zO1xuICAgICAgICBuZXdEc3RbNV0gPSBjO1xuICAgICAgICBuZXdEc3RbNl0gPSAwO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSAwO1xuICAgICAgICBuZXdEc3RbOV0gPSAwO1xuICAgICAgICBuZXdEc3RbMTBdID0gMTtcbiAgICAgICAgbmV3RHN0WzExXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMl0gPSAwO1xuICAgICAgICBuZXdEc3RbMTNdID0gMDtcbiAgICAgICAgbmV3RHN0WzE0XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIHRoZSBnaXZlbiA0LWJ5LTQgbWF0cml4IGFyb3VuZCB0aGUgei1heGlzIGJ5IHRoZSBnaXZlblxuICAgICAqIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGVaKG0sIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBjb25zdCBtMDAgPSBtWzAgKiA0ICsgMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG1bMCAqIDQgKyAxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbVswICogNCArIDJdO1xuICAgICAgICBjb25zdCBtMDMgPSBtWzAgKiA0ICsgM107XG4gICAgICAgIGNvbnN0IG0xMCA9IG1bMSAqIDQgKyAwXTtcbiAgICAgICAgY29uc3QgbTExID0gbVsxICogNCArIDFdO1xuICAgICAgICBjb25zdCBtMTIgPSBtWzEgKiA0ICsgMl07XG4gICAgICAgIGNvbnN0IG0xMyA9IG1bMSAqIDQgKyAzXTtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYyAqIG0wMCArIHMgKiBtMTA7XG4gICAgICAgIG5ld0RzdFsxXSA9IGMgKiBtMDEgKyBzICogbTExO1xuICAgICAgICBuZXdEc3RbMl0gPSBjICogbTAyICsgcyAqIG0xMjtcbiAgICAgICAgbmV3RHN0WzNdID0gYyAqIG0wMyArIHMgKiBtMTM7XG4gICAgICAgIG5ld0RzdFs0XSA9IGMgKiBtMTAgLSBzICogbTAwO1xuICAgICAgICBuZXdEc3RbNV0gPSBjICogbTExIC0gcyAqIG0wMTtcbiAgICAgICAgbmV3RHN0WzZdID0gYyAqIG0xMiAtIHMgKiBtMDI7XG4gICAgICAgIG5ld0RzdFs3XSA9IGMgKiBtMTMgLSBzICogbTAzO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbOF0gPSBtWzhdO1xuICAgICAgICAgICAgbmV3RHN0WzldID0gbVs5XTtcbiAgICAgICAgICAgIG5ld0RzdFsxMF0gPSBtWzEwXTtcbiAgICAgICAgICAgIG5ld0RzdFsxMV0gPSBtWzExXTtcbiAgICAgICAgICAgIG5ld0RzdFsxMl0gPSBtWzEyXTtcbiAgICAgICAgICAgIG5ld0RzdFsxM10gPSBtWzEzXTtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSBtWzE0XTtcbiAgICAgICAgICAgIG5ld0RzdFsxNV0gPSBtWzE1XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgNC1ieS00IG1hdHJpeCB3aGljaCByb3RhdGVzIGFyb3VuZCB0aGUgZ2l2ZW4gYXhpcyBieSB0aGUgZ2l2ZW5cbiAgICAgKiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gYXhpcyAtIFRoZSBheGlzXG4gICAgICogICAgIGFib3V0IHdoaWNoIHRvIHJvdGF0ZS5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYW5nbGUgcmFkaWFuc1xuICAgICAqICAgICBhcm91bmQgdGhlIGF4aXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXhpc1JvdGF0aW9uKGF4aXMsIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBsZXQgeCA9IGF4aXNbMF07XG4gICAgICAgIGxldCB5ID0gYXhpc1sxXTtcbiAgICAgICAgbGV0IHogPSBheGlzWzJdO1xuICAgICAgICBjb25zdCBuID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gICAgICAgIHggLz0gbjtcbiAgICAgICAgeSAvPSBuO1xuICAgICAgICB6IC89IG47XG4gICAgICAgIGNvbnN0IHh4ID0geCAqIHg7XG4gICAgICAgIGNvbnN0IHl5ID0geSAqIHk7XG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHo7XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IG9uZU1pbnVzQ29zaW5lID0gMSAtIGM7XG4gICAgICAgIG5ld0RzdFswXSA9IHh4ICsgKDEgLSB4eCkgKiBjO1xuICAgICAgICBuZXdEc3RbMV0gPSB4ICogeSAqIG9uZU1pbnVzQ29zaW5lICsgeiAqIHM7XG4gICAgICAgIG5ld0RzdFsyXSA9IHggKiB6ICogb25lTWludXNDb3NpbmUgLSB5ICogcztcbiAgICAgICAgbmV3RHN0WzNdID0gMDtcbiAgICAgICAgbmV3RHN0WzRdID0geCAqIHkgKiBvbmVNaW51c0Nvc2luZSAtIHogKiBzO1xuICAgICAgICBuZXdEc3RbNV0gPSB5eSArICgxIC0geXkpICogYztcbiAgICAgICAgbmV3RHN0WzZdID0geSAqIHogKiBvbmVNaW51c0Nvc2luZSArIHggKiBzO1xuICAgICAgICBuZXdEc3RbN10gPSAwO1xuICAgICAgICBuZXdEc3RbOF0gPSB4ICogeiAqIG9uZU1pbnVzQ29zaW5lICsgeSAqIHM7XG4gICAgICAgIG5ld0RzdFs5XSA9IHkgKiB6ICogb25lTWludXNDb3NpbmUgLSB4ICogcztcbiAgICAgICAgbmV3RHN0WzEwXSA9IHp6ICsgKDEgLSB6eikgKiBjO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxM10gPSAwO1xuICAgICAgICBuZXdEc3RbMTRdID0gMDtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSA0LWJ5LTQgbWF0cml4IHdoaWNoIHJvdGF0ZXMgYXJvdW5kIHRoZSBnaXZlbiBheGlzIGJ5IHRoZSBnaXZlblxuICAgICAqIGFuZ2xlLiAoc2FtZSBhcyBheGlzUm90YXRpb24pXG4gICAgICogQHBhcmFtIGF4aXMgLSBUaGUgYXhpc1xuICAgICAqICAgICBhYm91dCB3aGljaCB0byByb3RhdGUuXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIG1hdHJpeCB3aGljaCByb3RhdGVzIGFuZ2xlIHJhZGlhbnNcbiAgICAgKiAgICAgYXJvdW5kIHRoZSBheGlzLlxuICAgICAqL1xuICAgIGNvbnN0IHJvdGF0aW9uID0gYXhpc1JvdGF0aW9uO1xuICAgIC8qKlxuICAgICAqIFJvdGF0ZXMgdGhlIGdpdmVuIDQtYnktNCBtYXRyaXggYXJvdW5kIHRoZSBnaXZlbiBheGlzIGJ5IHRoZVxuICAgICAqIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBtIC0gVGhlIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gYXhpcyAtIFRoZSBheGlzXG4gICAgICogICAgIGFib3V0IHdoaWNoIHRvIHJvdGF0ZS5cbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlIChpbiByYWRpYW5zKS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByb3RhdGVkIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBheGlzUm90YXRlKG0sIGF4aXMsIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBsZXQgeCA9IGF4aXNbMF07XG4gICAgICAgIGxldCB5ID0gYXhpc1sxXTtcbiAgICAgICAgbGV0IHogPSBheGlzWzJdO1xuICAgICAgICBjb25zdCBuID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gICAgICAgIHggLz0gbjtcbiAgICAgICAgeSAvPSBuO1xuICAgICAgICB6IC89IG47XG4gICAgICAgIGNvbnN0IHh4ID0geCAqIHg7XG4gICAgICAgIGNvbnN0IHl5ID0geSAqIHk7XG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHo7XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGNvbnN0IG9uZU1pbnVzQ29zaW5lID0gMSAtIGM7XG4gICAgICAgIGNvbnN0IHIwMCA9IHh4ICsgKDEgLSB4eCkgKiBjO1xuICAgICAgICBjb25zdCByMDEgPSB4ICogeSAqIG9uZU1pbnVzQ29zaW5lICsgeiAqIHM7XG4gICAgICAgIGNvbnN0IHIwMiA9IHggKiB6ICogb25lTWludXNDb3NpbmUgLSB5ICogcztcbiAgICAgICAgY29uc3QgcjEwID0geCAqIHkgKiBvbmVNaW51c0Nvc2luZSAtIHogKiBzO1xuICAgICAgICBjb25zdCByMTEgPSB5eSArICgxIC0geXkpICogYztcbiAgICAgICAgY29uc3QgcjEyID0geSAqIHogKiBvbmVNaW51c0Nvc2luZSArIHggKiBzO1xuICAgICAgICBjb25zdCByMjAgPSB4ICogeiAqIG9uZU1pbnVzQ29zaW5lICsgeSAqIHM7XG4gICAgICAgIGNvbnN0IHIyMSA9IHkgKiB6ICogb25lTWludXNDb3NpbmUgLSB4ICogcztcbiAgICAgICAgY29uc3QgcjIyID0genogKyAoMSAtIHp6KSAqIGM7XG4gICAgICAgIGNvbnN0IG0wMCA9IG1bMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG1bMV07XG4gICAgICAgIGNvbnN0IG0wMiA9IG1bMl07XG4gICAgICAgIGNvbnN0IG0wMyA9IG1bM107XG4gICAgICAgIGNvbnN0IG0xMCA9IG1bNF07XG4gICAgICAgIGNvbnN0IG0xMSA9IG1bNV07XG4gICAgICAgIGNvbnN0IG0xMiA9IG1bNl07XG4gICAgICAgIGNvbnN0IG0xMyA9IG1bN107XG4gICAgICAgIGNvbnN0IG0yMCA9IG1bOF07XG4gICAgICAgIGNvbnN0IG0yMSA9IG1bOV07XG4gICAgICAgIGNvbnN0IG0yMiA9IG1bMTBdO1xuICAgICAgICBjb25zdCBtMjMgPSBtWzExXTtcbiAgICAgICAgbmV3RHN0WzBdID0gcjAwICogbTAwICsgcjAxICogbTEwICsgcjAyICogbTIwO1xuICAgICAgICBuZXdEc3RbMV0gPSByMDAgKiBtMDEgKyByMDEgKiBtMTEgKyByMDIgKiBtMjE7XG4gICAgICAgIG5ld0RzdFsyXSA9IHIwMCAqIG0wMiArIHIwMSAqIG0xMiArIHIwMiAqIG0yMjtcbiAgICAgICAgbmV3RHN0WzNdID0gcjAwICogbTAzICsgcjAxICogbTEzICsgcjAyICogbTIzO1xuICAgICAgICBuZXdEc3RbNF0gPSByMTAgKiBtMDAgKyByMTEgKiBtMTAgKyByMTIgKiBtMjA7XG4gICAgICAgIG5ld0RzdFs1XSA9IHIxMCAqIG0wMSArIHIxMSAqIG0xMSArIHIxMiAqIG0yMTtcbiAgICAgICAgbmV3RHN0WzZdID0gcjEwICogbTAyICsgcjExICogbTEyICsgcjEyICogbTIyO1xuICAgICAgICBuZXdEc3RbN10gPSByMTAgKiBtMDMgKyByMTEgKiBtMTMgKyByMTIgKiBtMjM7XG4gICAgICAgIG5ld0RzdFs4XSA9IHIyMCAqIG0wMCArIHIyMSAqIG0xMCArIHIyMiAqIG0yMDtcbiAgICAgICAgbmV3RHN0WzldID0gcjIwICogbTAxICsgcjIxICogbTExICsgcjIyICogbTIxO1xuICAgICAgICBuZXdEc3RbMTBdID0gcjIwICogbTAyICsgcjIxICogbTEyICsgcjIyICogbTIyO1xuICAgICAgICBuZXdEc3RbMTFdID0gcjIwICogbTAzICsgcjIxICogbTEzICsgcjIyICogbTIzO1xuICAgICAgICBpZiAobSAhPT0gbmV3RHN0KSB7XG4gICAgICAgICAgICBuZXdEc3RbMTJdID0gbVsxMl07XG4gICAgICAgICAgICBuZXdEc3RbMTNdID0gbVsxM107XG4gICAgICAgICAgICBuZXdEc3RbMTRdID0gbVsxNF07XG4gICAgICAgICAgICBuZXdEc3RbMTVdID0gbVsxNV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gNC1ieS00IG1hdHJpeCBhcm91bmQgdGhlIGdpdmVuIGF4aXMgYnkgdGhlXG4gICAgICogZ2l2ZW4gYW5nbGUuIChzYW1lIGFzIHJvdGF0ZSlcbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXguXG4gICAgICogQHBhcmFtIGF4aXMgLSBUaGUgYXhpc1xuICAgICAqICAgICBhYm91dCB3aGljaCB0byByb3RhdGUuXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSAoaW4gcmFkaWFucykuXG4gICAgICogQHBhcmFtIGRzdCAtIG1hdHJpeCB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgcm90YXRlZCBtYXRyaXguXG4gICAgICovXG4gICAgY29uc3Qgcm90YXRlID0gYXhpc1JvdGF0ZTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgNC1ieS00IG1hdHJpeCB3aGljaCBzY2FsZXMgaW4gZWFjaCBkaW1lbnNpb24gYnkgYW4gYW1vdW50IGdpdmVuIGJ5XG4gICAgICogdGhlIGNvcnJlc3BvbmRpbmcgZW50cnkgaW4gdGhlIGdpdmVuIHZlY3RvcjsgYXNzdW1lcyB0aGUgdmVjdG9yIGhhcyB0aHJlZVxuICAgICAqIGVudHJpZXMuXG4gICAgICogQHBhcmFtIHYgLSBBIHZlY3RvciBvZlxuICAgICAqICAgICB0aHJlZSBlbnRyaWVzIHNwZWNpZnlpbmcgdGhlIGZhY3RvciBieSB3aGljaCB0byBzY2FsZSBpbiBlYWNoIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsaW5nIG1hdHJpeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzY2FsaW5nKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IHZbMV07XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSB2WzJdO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxM10gPSAwO1xuICAgICAgICBuZXdEc3RbMTRdID0gMDtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNjYWxlcyB0aGUgZ2l2ZW4gNC1ieS00IG1hdHJpeCBpbiBlYWNoIGRpbWVuc2lvbiBieSBhbiBhbW91bnRcbiAgICAgKiBnaXZlbiBieSB0aGUgY29ycmVzcG9uZGluZyBlbnRyeSBpbiB0aGUgZ2l2ZW4gdmVjdG9yOyBhc3N1bWVzIHRoZSB2ZWN0b3IgaGFzXG4gICAgICogdGhyZWUgZW50cmllcy5cbiAgICAgKiBAcGFyYW0gbSAtIFRoZSBtYXRyaXggdG8gYmUgbW9kaWZpZWQuXG4gICAgICogQHBhcmFtIHYgLSBBIHZlY3RvciBvZiB0aHJlZSBlbnRyaWVzIHNwZWNpZnlpbmcgdGhlXG4gICAgICogICAgIGZhY3RvciBieSB3aGljaCB0byBzY2FsZSBpbiBlYWNoIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNjYWxlKG0sIHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIG5ld0RzdFswXSA9IHYwICogbVswICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbMV0gPSB2MCAqIG1bMCAqIDQgKyAxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gdjAgKiBtWzAgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFszXSA9IHYwICogbVswICogNCArIDNdO1xuICAgICAgICBuZXdEc3RbNF0gPSB2MSAqIG1bMSAqIDQgKyAwXTtcbiAgICAgICAgbmV3RHN0WzVdID0gdjEgKiBtWzEgKiA0ICsgMV07XG4gICAgICAgIG5ld0RzdFs2XSA9IHYxICogbVsxICogNCArIDJdO1xuICAgICAgICBuZXdEc3RbN10gPSB2MSAqIG1bMSAqIDQgKyAzXTtcbiAgICAgICAgbmV3RHN0WzhdID0gdjIgKiBtWzIgKiA0ICsgMF07XG4gICAgICAgIG5ld0RzdFs5XSA9IHYyICogbVsyICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbMTBdID0gdjIgKiBtWzIgKiA0ICsgMl07XG4gICAgICAgIG5ld0RzdFsxMV0gPSB2MiAqIG1bMiAqIDQgKyAzXTtcbiAgICAgICAgaWYgKG0gIT09IG5ld0RzdCkge1xuICAgICAgICAgICAgbmV3RHN0WzEyXSA9IG1bMTJdO1xuICAgICAgICAgICAgbmV3RHN0WzEzXSA9IG1bMTNdO1xuICAgICAgICAgICAgbmV3RHN0WzE0XSA9IG1bMTRdO1xuICAgICAgICAgICAgbmV3RHN0WzE1XSA9IG1bMTVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSA0LWJ5LTQgbWF0cml4IHdoaWNoIHNjYWxlcyBhIHVuaWZvcm0gYW1vdW50IGluIGVhY2ggZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBzIC0gdGhlIGFtb3VudCB0byBzY2FsZVxuICAgICAqIEBwYXJhbSBkc3QgLSBtYXRyaXggdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxpbmcgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVuaWZvcm1TY2FsaW5nKHMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDE2KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHM7XG4gICAgICAgIG5ld0RzdFsxXSA9IDA7XG4gICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgIG5ld0RzdFszXSA9IDA7XG4gICAgICAgIG5ld0RzdFs0XSA9IDA7XG4gICAgICAgIG5ld0RzdFs1XSA9IHM7XG4gICAgICAgIG5ld0RzdFs2XSA9IDA7XG4gICAgICAgIG5ld0RzdFs3XSA9IDA7XG4gICAgICAgIG5ld0RzdFs4XSA9IDA7XG4gICAgICAgIG5ld0RzdFs5XSA9IDA7XG4gICAgICAgIG5ld0RzdFsxMF0gPSBzO1xuICAgICAgICBuZXdEc3RbMTFdID0gMDtcbiAgICAgICAgbmV3RHN0WzEyXSA9IDA7XG4gICAgICAgIG5ld0RzdFsxM10gPSAwO1xuICAgICAgICBuZXdEc3RbMTRdID0gMDtcbiAgICAgICAgbmV3RHN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNjYWxlcyB0aGUgZ2l2ZW4gNC1ieS00IG1hdHJpeCBpbiBlYWNoIGRpbWVuc2lvbiBieSBhIHVuaWZvcm0gc2NhbGUuXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4IHRvIGJlIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSBzIC0gVGhlIGFtb3VudCB0byBzY2FsZS5cbiAgICAgKiBAcGFyYW0gZHN0IC0gbWF0cml4IHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgbWF0cml4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVuaWZvcm1TY2FsZShtLCBzLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3RvcigxNikpO1xuICAgICAgICBuZXdEc3RbMF0gPSBzICogbVswICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBzICogbVswICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBzICogbVswICogNCArIDJdO1xuICAgICAgICBuZXdEc3RbM10gPSBzICogbVswICogNCArIDNdO1xuICAgICAgICBuZXdEc3RbNF0gPSBzICogbVsxICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbNV0gPSBzICogbVsxICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbNl0gPSBzICogbVsxICogNCArIDJdO1xuICAgICAgICBuZXdEc3RbN10gPSBzICogbVsxICogNCArIDNdO1xuICAgICAgICBuZXdEc3RbOF0gPSBzICogbVsyICogNCArIDBdO1xuICAgICAgICBuZXdEc3RbOV0gPSBzICogbVsyICogNCArIDFdO1xuICAgICAgICBuZXdEc3RbMTBdID0gcyAqIG1bMiAqIDQgKyAyXTtcbiAgICAgICAgbmV3RHN0WzExXSA9IHMgKiBtWzIgKiA0ICsgM107XG4gICAgICAgIGlmIChtICE9PSBuZXdEc3QpIHtcbiAgICAgICAgICAgIG5ld0RzdFsxMl0gPSBtWzEyXTtcbiAgICAgICAgICAgIG5ld0RzdFsxM10gPSBtWzEzXTtcbiAgICAgICAgICAgIG5ld0RzdFsxNF0gPSBtWzE0XTtcbiAgICAgICAgICAgIG5ld0RzdFsxNV0gPSBtWzE1XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGUsXG4gICAgICAgIHNldCxcbiAgICAgICAgZnJvbU1hdDMsXG4gICAgICAgIGZyb21RdWF0LFxuICAgICAgICBuZWdhdGUsXG4gICAgICAgIGNvcHksXG4gICAgICAgIGNsb25lLFxuICAgICAgICBlcXVhbHNBcHByb3hpbWF0ZWx5LFxuICAgICAgICBlcXVhbHMsXG4gICAgICAgIGlkZW50aXR5LFxuICAgICAgICB0cmFuc3Bvc2UsXG4gICAgICAgIGludmVyc2UsXG4gICAgICAgIGRldGVybWluYW50LFxuICAgICAgICBpbnZlcnQsXG4gICAgICAgIG11bHRpcGx5LFxuICAgICAgICBtdWwsXG4gICAgICAgIHNldFRyYW5zbGF0aW9uLFxuICAgICAgICBnZXRUcmFuc2xhdGlvbixcbiAgICAgICAgZ2V0QXhpcyxcbiAgICAgICAgc2V0QXhpcyxcbiAgICAgICAgZ2V0U2NhbGluZyxcbiAgICAgICAgcGVyc3BlY3RpdmUsXG4gICAgICAgIHBlcnNwZWN0aXZlUmV2ZXJzZVosXG4gICAgICAgIG9ydGhvLFxuICAgICAgICBmcnVzdHVtLFxuICAgICAgICBmcnVzdHVtUmV2ZXJzZVosXG4gICAgICAgIGFpbSxcbiAgICAgICAgY2FtZXJhQWltLFxuICAgICAgICBsb29rQXQsXG4gICAgICAgIHRyYW5zbGF0aW9uLFxuICAgICAgICB0cmFuc2xhdGUsXG4gICAgICAgIHJvdGF0aW9uWCxcbiAgICAgICAgcm90YXRlWCxcbiAgICAgICAgcm90YXRpb25ZLFxuICAgICAgICByb3RhdGVZLFxuICAgICAgICByb3RhdGlvblosXG4gICAgICAgIHJvdGF0ZVosXG4gICAgICAgIGF4aXNSb3RhdGlvbixcbiAgICAgICAgcm90YXRpb24sXG4gICAgICAgIGF4aXNSb3RhdGUsXG4gICAgICAgIHJvdGF0ZSxcbiAgICAgICAgc2NhbGluZyxcbiAgICAgICAgc2NhbGUsXG4gICAgICAgIHVuaWZvcm1TY2FsaW5nLFxuICAgICAgICB1bmlmb3JtU2NhbGUsXG4gICAgfTtcbn1cbmNvbnN0IGNhY2hlJDIgPSBuZXcgTWFwKCk7XG5mdW5jdGlvbiBnZXRBUEkkMihDdG9yKSB7XG4gICAgbGV0IGFwaSA9IGNhY2hlJDIuZ2V0KEN0b3IpO1xuICAgIGlmICghYXBpKSB7XG4gICAgICAgIGFwaSA9IGdldEFQSUltcGwkMihDdG9yKTtcbiAgICAgICAgY2FjaGUkMi5zZXQoQ3RvciwgYXBpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwaTtcbn1cblxuLypcbiAqIENvcHlyaWdodCAyMDIyIEdyZWdnIFRhdmFyZXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICogY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuICogdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuICogdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuLyoqXG4gKiBHZW5lcmF0ZXMgYW0gdHlwZWQgQVBJIGZvciBRdWRcbiAqICovXG5mdW5jdGlvbiBnZXRBUElJbXBsJDEoQ3Rvcikge1xuICAgIGNvbnN0IHZlYzMgPSBnZXRBUEkkNChDdG9yKTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgcXVhdDQ7IG1heSBiZSBjYWxsZWQgd2l0aCB4LCB5LCB6IHRvIHNldCBpbml0aWFsIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0geCAtIEluaXRpYWwgeCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geSAtIEluaXRpYWwgeSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geiAtIEluaXRpYWwgeiB2YWx1ZS5cbiAgICAgKiBAcGFyYW0gdyAtIEluaXRpYWwgdyB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyB0aGUgY3JlYXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGUoeCwgeSwgeiwgdykge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSBuZXcgQ3Rvcig0KTtcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0geDtcbiAgICAgICAgICAgIGlmICh5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMV0gPSB5O1xuICAgICAgICAgICAgICAgIGlmICh6ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzJdID0gejtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzNdID0gdztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgUXVhdDsgbWF5IGJlIGNhbGxlZCB3aXRoIHgsIHksIHogdG8gc2V0IGluaXRpYWwgdmFsdWVzLiAoc2FtZSBhcyBjcmVhdGUpXG4gICAgICogQHBhcmFtIHggLSBJbml0aWFsIHggdmFsdWUuXG4gICAgICogQHBhcmFtIHkgLSBJbml0aWFsIHkgdmFsdWUuXG4gICAgICogQHBhcmFtIHogLSBJbml0aWFsIHogdmFsdWUuXG4gICAgICogQHBhcmFtIHogLSBJbml0aWFsIHcgdmFsdWUuXG4gICAgICogQHJldHVybnMgdGhlIGNyZWF0ZWQgdmVjdG9yXG4gICAgICovXG4gICAgY29uc3QgZnJvbVZhbHVlcyA9IGNyZWF0ZTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZXMgb2YgYSBRdWF0XG4gICAgICogQWxzbyBzZWUge0BsaW5rIHF1YXQuY3JlYXRlfSBhbmQge0BsaW5rIHF1YXQuY29weX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IGZpcnN0IHZhbHVlXG4gICAgICogQHBhcmFtIHkgc2Vjb25kIHZhbHVlXG4gICAgICogQHBhcmFtIHogdGhpcmQgdmFsdWVcbiAgICAgKiBAcGFyYW0gdyBmb3VydGggdmFsdWVcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHdpdGggaXRzIGVsZW1lbnRzIHNldC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQoeCwgeSwgeiwgdywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSB4O1xuICAgICAgICBuZXdEc3RbMV0gPSB5O1xuICAgICAgICBuZXdEc3RbMl0gPSB6O1xuICAgICAgICBuZXdEc3RbM10gPSB3O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgcXVhdGVybmlvbiBmcm9tIHRoZSBnaXZlbiBhbmdsZSBhbmQgIGF4aXMsXG4gICAgICogdGhlbiByZXR1cm5zIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGF4aXMgLSB0aGUgYXhpcyB0byByb3RhdGUgYXJvdW5kXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gdGhlIGFuZ2xlXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHF1YXRlcm5pb24gdGhhdCByZXByZXNlbnRzIHRoZSBnaXZlbiBheGlzIGFuZCBhbmdsZVxuICAgICAqKi9cbiAgICBmdW5jdGlvbiBmcm9tQXhpc0FuZ2xlKGF4aXMsIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IGhhbGZBbmdsZSA9IGFuZ2xlSW5SYWRpYW5zICogMC41O1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oaGFsZkFuZ2xlKTtcbiAgICAgICAgbmV3RHN0WzBdID0gcyAqIGF4aXNbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IHMgKiBheGlzWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBzICogYXhpc1syXTtcbiAgICAgICAgbmV3RHN0WzNdID0gTWF0aC5jb3MoaGFsZkFuZ2xlKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgcm90YXRpb24gYXhpcyBhbmQgYW5nbGVcbiAgICAgKiBAcGFyYW0gcSAtIHF1YXRlcm5pb24gdG8gY29tcHV0ZSBmcm9tXG4gICAgICogQHBhcmFtIGRzdCAtIFZlYzMgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybiBhbmdsZSBhbmQgYXhpc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRvQXhpc0FuZ2xlKHEsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IHZlYzMuY3JlYXRlKDMpKTtcbiAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLmFjb3MocVszXSkgKiAyO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGUgKiAwLjUpO1xuICAgICAgICBpZiAocyA+IEVQU0lMT04pIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IHFbMF0gLyBzO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gcVsxXSAvIHM7XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSBxWzJdIC8gcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IDE7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBhbmdsZSwgYXhpczogbmV3RHN0IH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGFuZ2xlIGluIGRlZ3JlZXMgYmV0d2VlbiB0d28gcm90YXRpb25zIGEgYW5kIGIuXG4gICAgICogQHBhcmFtIGEgLSBxdWF0ZXJuaW9uIGFcbiAgICAgKiBAcGFyYW0gYiAtIHF1YXRlcm5pb24gYlxuICAgICAqIEByZXR1cm4gYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHRoZSB0d28gcXVhdGVybmlvbnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbmdsZShhLCBiKSB7XG4gICAgICAgIGNvbnN0IGQgPSBkb3QoYSwgYik7XG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoMiAqIGQgKiBkIC0gMSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgdHdvIHF1YXRlcm5pb25zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYSAtIHRoZSBmaXJzdCBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIGIgLSB0aGUgc2Vjb25kIHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHF1YXRlcm5pb24gdGhhdCBpcyB0aGUgcmVzdWx0IG9mIGEgKiBiXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsdGlwbHkoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBjb25zdCBheCA9IGFbMF07XG4gICAgICAgIGNvbnN0IGF5ID0gYVsxXTtcbiAgICAgICAgY29uc3QgYXogPSBhWzJdO1xuICAgICAgICBjb25zdCBhdyA9IGFbM107XG4gICAgICAgIGNvbnN0IGJ4ID0gYlswXTtcbiAgICAgICAgY29uc3QgYnkgPSBiWzFdO1xuICAgICAgICBjb25zdCBieiA9IGJbMl07XG4gICAgICAgIGNvbnN0IGJ3ID0gYlszXTtcbiAgICAgICAgbmV3RHN0WzBdID0gYXggKiBidyArIGF3ICogYnggKyBheSAqIGJ6IC0gYXogKiBieTtcbiAgICAgICAgbmV3RHN0WzFdID0gYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBiejtcbiAgICAgICAgbmV3RHN0WzJdID0gYXogKiBidyArIGF3ICogYnogKyBheCAqIGJ5IC0gYXkgKiBieDtcbiAgICAgICAgbmV3RHN0WzNdID0gYXcgKiBidyAtIGF4ICogYnggLSBheSAqIGJ5IC0gYXogKiBiejtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyB0d28gcXVhdGVybmlvbnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIC0gdGhlIGZpcnN0IHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0gYiAtIHRoZSBzZWNvbmQgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgcXVhdGVybmlvbiB0aGF0IGlzIHRoZSByZXN1bHQgb2YgYSAqIGJcbiAgICAgKi9cbiAgICBjb25zdCBtdWwgPSBtdWx0aXBseTtcbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIHRoZSBnaXZlbiBxdWF0ZXJuaW9uIGFyb3VuZCB0aGUgWCBheGlzIGJ5IHRoZSBnaXZlbiBhbmdsZS5cbiAgICAgKiBAcGFyYW0gcSAtIHF1YXRlcm5pb24gdG8gcm90YXRlXG4gICAgICogQHBhcmFtIGFuZ2xlSW5SYWRpYW5zIC0gVGhlIGFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgcXVhdGVybmlvbiB0aGF0IGlzIHRoZSByZXN1bHQgb2YgYSAqIGJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3RhdGVYKHEsIGFuZ2xlSW5SYWRpYW5zLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IGhhbGZBbmdsZSA9IGFuZ2xlSW5SYWRpYW5zICogMC41O1xuICAgICAgICBjb25zdCBxeCA9IHFbMF07XG4gICAgICAgIGNvbnN0IHF5ID0gcVsxXTtcbiAgICAgICAgY29uc3QgcXogPSBxWzJdO1xuICAgICAgICBjb25zdCBxdyA9IHFbM107XG4gICAgICAgIGNvbnN0IGJ4ID0gTWF0aC5zaW4oaGFsZkFuZ2xlKTtcbiAgICAgICAgY29uc3QgYncgPSBNYXRoLmNvcyhoYWxmQW5nbGUpO1xuICAgICAgICBuZXdEc3RbMF0gPSBxeCAqIGJ3ICsgcXcgKiBieDtcbiAgICAgICAgbmV3RHN0WzFdID0gcXkgKiBidyArIHF6ICogYng7XG4gICAgICAgIG5ld0RzdFsyXSA9IHF6ICogYncgLSBxeSAqIGJ4O1xuICAgICAgICBuZXdEc3RbM10gPSBxdyAqIGJ3IC0gcXggKiBieDtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgZ2l2ZW4gcXVhdGVybmlvbiBhcm91bmQgdGhlIFkgYXhpcyBieSB0aGUgZ2l2ZW4gYW5nbGUuXG4gICAgICogQHBhcmFtIHEgLSBxdWF0ZXJuaW9uIHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSBhbmdsZUluUmFkaWFucyAtIFRoZSBhbmdsZSBieSB3aGljaCB0byByb3RhdGVcbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHF1YXRlcm5pb24gdGhhdCBpcyB0aGUgcmVzdWx0IG9mIGEgKiBiXG4gICAgICovXG4gICAgZnVuY3Rpb24gcm90YXRlWShxLCBhbmdsZUluUmFkaWFucywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBjb25zdCBoYWxmQW5nbGUgPSBhbmdsZUluUmFkaWFucyAqIDAuNTtcbiAgICAgICAgY29uc3QgcXggPSBxWzBdO1xuICAgICAgICBjb25zdCBxeSA9IHFbMV07XG4gICAgICAgIGNvbnN0IHF6ID0gcVsyXTtcbiAgICAgICAgY29uc3QgcXcgPSBxWzNdO1xuICAgICAgICBjb25zdCBieSA9IE1hdGguc2luKGhhbGZBbmdsZSk7XG4gICAgICAgIGNvbnN0IGJ3ID0gTWF0aC5jb3MoaGFsZkFuZ2xlKTtcbiAgICAgICAgbmV3RHN0WzBdID0gcXggKiBidyAtIHF6ICogYnk7XG4gICAgICAgIG5ld0RzdFsxXSA9IHF5ICogYncgKyBxdyAqIGJ5O1xuICAgICAgICBuZXdEc3RbMl0gPSBxeiAqIGJ3ICsgcXggKiBieTtcbiAgICAgICAgbmV3RHN0WzNdID0gcXcgKiBidyAtIHF5ICogYnk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJvdGF0ZXMgdGhlIGdpdmVuIHF1YXRlcm5pb24gYXJvdW5kIHRoZSBaIGF4aXMgYnkgdGhlIGdpdmVuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSBxIC0gcXVhdGVybmlvbiB0byByb3RhdGVcbiAgICAgKiBAcGFyYW0gYW5nbGVJblJhZGlhbnMgLSBUaGUgYW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBxdWF0ZXJuaW9uIHRoYXQgaXMgdGhlIHJlc3VsdCBvZiBhICogYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0ZVoocSwgYW5nbGVJblJhZGlhbnMsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgY29uc3QgaGFsZkFuZ2xlID0gYW5nbGVJblJhZGlhbnMgKiAwLjU7XG4gICAgICAgIGNvbnN0IHF4ID0gcVswXTtcbiAgICAgICAgY29uc3QgcXkgPSBxWzFdO1xuICAgICAgICBjb25zdCBxeiA9IHFbMl07XG4gICAgICAgIGNvbnN0IHF3ID0gcVszXTtcbiAgICAgICAgY29uc3QgYnogPSBNYXRoLnNpbihoYWxmQW5nbGUpO1xuICAgICAgICBjb25zdCBidyA9IE1hdGguY29zKGhhbGZBbmdsZSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHF4ICogYncgKyBxeSAqIGJ6O1xuICAgICAgICBuZXdEc3RbMV0gPSBxeSAqIGJ3IC0gcXggKiBiejtcbiAgICAgICAgbmV3RHN0WzJdID0gcXogKiBidyArIHF3ICogYno7XG4gICAgICAgIG5ld0RzdFszXSA9IHF3ICogYncgLSBxeiAqIGJ6O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTcGhlcmljYWxseSBsaW5lYXIgaW50ZXJwb2xhdGUgYmV0d2VlbiB0d28gcXVhdGVybmlvbnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhIC0gc3RhcnRpbmcgdmFsdWVcbiAgICAgKiBAcGFyYW0gYiAtIGVuZGluZyB2YWx1ZVxuICAgICAqIEBwYXJhbSB0IC0gdmFsdWUgd2hlcmUgMCA9IGEgYW5kIDEgPSBiXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBxdWF0ZXJuaW9uIHRoYXQgaXMgdGhlIHJlc3VsdCBvZiBhICogYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNsZXJwKGEsIGIsIHQsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgY29uc3QgYXggPSBhWzBdO1xuICAgICAgICBjb25zdCBheSA9IGFbMV07XG4gICAgICAgIGNvbnN0IGF6ID0gYVsyXTtcbiAgICAgICAgY29uc3QgYXcgPSBhWzNdO1xuICAgICAgICBsZXQgYnggPSBiWzBdO1xuICAgICAgICBsZXQgYnkgPSBiWzFdO1xuICAgICAgICBsZXQgYnogPSBiWzJdO1xuICAgICAgICBsZXQgYncgPSBiWzNdO1xuICAgICAgICBsZXQgY29zT21lZ2EgPSBheCAqIGJ4ICsgYXkgKiBieSArIGF6ICogYnogKyBhdyAqIGJ3O1xuICAgICAgICBpZiAoY29zT21lZ2EgPCAwKSB7XG4gICAgICAgICAgICBjb3NPbWVnYSA9IC1jb3NPbWVnYTtcbiAgICAgICAgICAgIGJ4ID0gLWJ4O1xuICAgICAgICAgICAgYnkgPSAtYnk7XG4gICAgICAgICAgICBieiA9IC1iejtcbiAgICAgICAgICAgIGJ3ID0gLWJ3O1xuICAgICAgICB9XG4gICAgICAgIGxldCBzY2FsZTA7XG4gICAgICAgIGxldCBzY2FsZTE7XG4gICAgICAgIGlmICgxLjAgLSBjb3NPbWVnYSA+IEVQU0lMT04pIHtcbiAgICAgICAgICAgIGNvbnN0IG9tZWdhID0gTWF0aC5hY29zKGNvc09tZWdhKTtcbiAgICAgICAgICAgIGNvbnN0IHNpbk9tZWdhID0gTWF0aC5zaW4ob21lZ2EpO1xuICAgICAgICAgICAgc2NhbGUwID0gTWF0aC5zaW4oKDEgLSB0KSAqIG9tZWdhKSAvIHNpbk9tZWdhO1xuICAgICAgICAgICAgc2NhbGUxID0gTWF0aC5zaW4odCAqIG9tZWdhKSAvIHNpbk9tZWdhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2NhbGUwID0gMS4wIC0gdDtcbiAgICAgICAgICAgIHNjYWxlMSA9IHQ7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RHN0WzBdID0gc2NhbGUwICogYXggKyBzY2FsZTEgKiBieDtcbiAgICAgICAgbmV3RHN0WzFdID0gc2NhbGUwICogYXkgKyBzY2FsZTEgKiBieTtcbiAgICAgICAgbmV3RHN0WzJdID0gc2NhbGUwICogYXogKyBzY2FsZTEgKiBiejtcbiAgICAgICAgbmV3RHN0WzNdID0gc2NhbGUwICogYXcgKyBzY2FsZTEgKiBidztcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSB0aGUgaW52ZXJzZSBvZiBhIHF1YXRlcm5pb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBxIC0gcXVhdGVybmlvbiB0byBjb21wdXRlIHRoZSBpbnZlcnNlIG9mXG4gICAgICogQHJldHVybnMgQSBxdWF0ZXJuaW9uIHRoYXQgaXMgdGhlIHJlc3VsdCBvZiBhICogYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludmVyc2UocSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBjb25zdCBhMCA9IHFbMF07XG4gICAgICAgIGNvbnN0IGExID0gcVsxXTtcbiAgICAgICAgY29uc3QgYTIgPSBxWzJdO1xuICAgICAgICBjb25zdCBhMyA9IHFbM107XG4gICAgICAgIGNvbnN0IGRvdCA9IGEwICogYTAgKyBhMSAqIGExICsgYTIgKiBhMiArIGEzICogYTM7XG4gICAgICAgIGNvbnN0IGludkRvdCA9IGRvdCA/IDEgLyBkb3QgOiAwO1xuICAgICAgICBuZXdEc3RbMF0gPSAtYTAgKiBpbnZEb3Q7XG4gICAgICAgIG5ld0RzdFsxXSA9IC1hMSAqIGludkRvdDtcbiAgICAgICAgbmV3RHN0WzJdID0gLWEyICogaW52RG90O1xuICAgICAgICBuZXdEc3RbM10gPSBhMyAqIGludkRvdDtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSB0aGUgY29uanVnYXRlIG9mIGEgcXVhdGVybmlvblxuICAgICAqIEZvciBxdWF0ZXJuaW9ucyB3aXRoIGEgbWFnbml0dWRlIG9mIDEgKGEgdW5pdCBxdWF0ZXJuaW9uKVxuICAgICAqIHRoaXMgcmV0dXJucyB0aGUgc2FtZSBhcyB0aGUgaW52ZXJzZSBidXQgaXMgZmFzdGVyIHRvIGNhbGN1bGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBxIC0gcXVhdGVybmlvbiB0byBjb21wdXRlIHRoZSBjb25qdWdhdGUgb2YuXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGNvbmp1Z2F0ZSBvZiBxXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29uanVnYXRlKHEsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gLXFbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IC1xWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSAtcVsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gcVszXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHF1YXRlcm5pb24gZnJvbSB0aGUgZ2l2ZW4gcm90YXRpb24gbWF0cml4LlxuICAgICAqXG4gICAgICogVGhlIGNyZWF0ZWQgcXVhdGVybmlvbiBpcyBub3Qgbm9ybWFsaXplZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtIC0gcm90YXRpb24gbWF0cml4XG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZyb21NYXQobSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICAvKlxuICAgICAgICAwIDEgMlxuICAgICAgICAzIDQgNVxuICAgICAgICA2IDcgOFxuICAgICAgXG4gICAgICAgIDAgMSAyXG4gICAgICAgIDQgNSA2XG4gICAgICAgIDggOSAxMFxuICAgICAgICAgKi9cbiAgICAgICAgLy8gQWxnb3JpdGhtIGluIEtlbiBTaG9lbWFrZSdzIGFydGljbGUgaW4gMTk4NyBTSUdHUkFQSCBjb3Vyc2Ugbm90ZXNcbiAgICAgICAgLy8gYXJ0aWNsZSBcIlF1YXRlcm5pb24gQ2FsY3VsdXMgYW5kIEZhc3QgQW5pbWF0aW9uXCIuXG4gICAgICAgIGNvbnN0IHRyYWNlID0gbVswXSArIG1bNV0gKyBtWzEwXTtcbiAgICAgICAgaWYgKHRyYWNlID4gMC4wKSB7XG4gICAgICAgICAgICAvLyB8d3wgPiAxLzIsIG1heSBhcyB3ZWxsIGNob29zZSB3ID4gMS8yXG4gICAgICAgICAgICBjb25zdCByb290ID0gTWF0aC5zcXJ0KHRyYWNlICsgMSk7IC8vIDJ3XG4gICAgICAgICAgICBuZXdEc3RbM10gPSAwLjUgKiByb290O1xuICAgICAgICAgICAgY29uc3QgaW52Um9vdCA9IDAuNSAvIHJvb3Q7IC8vIDEvKDR3KVxuICAgICAgICAgICAgbmV3RHN0WzBdID0gKG1bNl0gLSBtWzldKSAqIGludlJvb3Q7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSAobVs4XSAtIG1bMl0pICogaW52Um9vdDtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IChtWzFdIC0gbVs0XSkgKiBpbnZSb290O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gfHd8IDw9IDEvMlxuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgaWYgKG1bNV0gPiBtWzBdKSB7XG4gICAgICAgICAgICAgICAgaSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobVsxMF0gPiBtW2kgKiA0ICsgaV0pIHtcbiAgICAgICAgICAgICAgICBpID0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGogPSAoaSArIDEpICUgMztcbiAgICAgICAgICAgIGNvbnN0IGsgPSAoaSArIDIpICUgMztcbiAgICAgICAgICAgIGNvbnN0IHJvb3QgPSBNYXRoLnNxcnQobVtpICogNCArIGldIC0gbVtqICogNCArIGpdIC0gbVtrICogNCArIGtdICsgMS4wKTtcbiAgICAgICAgICAgIG5ld0RzdFtpXSA9IDAuNSAqIHJvb3Q7XG4gICAgICAgICAgICBjb25zdCBpbnZSb290ID0gMC41IC8gcm9vdDtcbiAgICAgICAgICAgIG5ld0RzdFszXSA9IChtW2ogKiA0ICsga10gLSBtW2sgKiA0ICsgal0pICogaW52Um9vdDtcbiAgICAgICAgICAgIG5ld0RzdFtqXSA9IChtW2ogKiA0ICsgaV0gKyBtW2kgKiA0ICsgal0pICogaW52Um9vdDtcbiAgICAgICAgICAgIG5ld0RzdFtrXSA9IChtW2sgKiA0ICsgaV0gKyBtW2kgKiA0ICsga10pICogaW52Um9vdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgcXVhdGVybmlvbiBmcm9tIHRoZSBnaXZlbiBldWxlciBhbmdsZSB4LCB5LCB6IHVzaW5nIHRoZSBwcm92aWRlZCBpbnRyaW5zaWMgb3JkZXIgZm9yIHRoZSBjb252ZXJzaW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHhBbmdsZUluUmFkaWFucyAtIGFuZ2xlIHRvIHJvdGF0ZSBhcm91bmQgWCBheGlzIGluIHJhZGlhbnMuXG4gICAgICogQHBhcmFtIHlBbmdsZUluUmFkaWFucyAtIGFuZ2xlIHRvIHJvdGF0ZSBhcm91bmQgWSBheGlzIGluIHJhZGlhbnMuXG4gICAgICogQHBhcmFtIHpBbmdsZUluUmFkaWFucyAtIGFuZ2xlIHRvIHJvdGF0ZSBhcm91bmQgWiBheGlzIGluIHJhZGlhbnMuXG4gICAgICogQHBhcmFtIG9yZGVyIC0gb3JkZXIgdG8gYXBwbHkgZXVsZXIgYW5nbGVzXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgc2FtZSByb3RhdGlvbiBhcyB0aGUgZXVsZXIgYW5nbGVzIGFwcGxpZWQgaW4gdGhlIGdpdmVuIG9yZGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gZnJvbUV1bGVyKHhBbmdsZUluUmFkaWFucywgeUFuZ2xlSW5SYWRpYW5zLCB6QW5nbGVJblJhZGlhbnMsIG9yZGVyLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IHhIYWxmQW5nbGUgPSB4QW5nbGVJblJhZGlhbnMgKiAwLjU7XG4gICAgICAgIGNvbnN0IHlIYWxmQW5nbGUgPSB5QW5nbGVJblJhZGlhbnMgKiAwLjU7XG4gICAgICAgIGNvbnN0IHpIYWxmQW5nbGUgPSB6QW5nbGVJblJhZGlhbnMgKiAwLjU7XG4gICAgICAgIGNvbnN0IHN4ID0gTWF0aC5zaW4oeEhhbGZBbmdsZSk7XG4gICAgICAgIGNvbnN0IGN4ID0gTWF0aC5jb3MoeEhhbGZBbmdsZSk7XG4gICAgICAgIGNvbnN0IHN5ID0gTWF0aC5zaW4oeUhhbGZBbmdsZSk7XG4gICAgICAgIGNvbnN0IGN5ID0gTWF0aC5jb3MoeUhhbGZBbmdsZSk7XG4gICAgICAgIGNvbnN0IHN6ID0gTWF0aC5zaW4oekhhbGZBbmdsZSk7XG4gICAgICAgIGNvbnN0IGN6ID0gTWF0aC5jb3MoekhhbGZBbmdsZSk7XG4gICAgICAgIHN3aXRjaCAob3JkZXIpIHtcbiAgICAgICAgICAgIGNhc2UgJ3h5eic6XG4gICAgICAgICAgICAgICAgbmV3RHN0WzBdID0gc3ggKiBjeSAqIGN6ICsgY3ggKiBzeSAqIHN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFsxXSA9IGN4ICogc3kgKiBjeiAtIHN4ICogY3kgKiBzejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMl0gPSBjeCAqIGN5ICogc3ogKyBzeCAqIHN5ICogY3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzNdID0gY3ggKiBjeSAqIGN6IC0gc3ggKiBzeSAqIHN6O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAneHp5JzpcbiAgICAgICAgICAgICAgICBuZXdEc3RbMF0gPSBzeCAqIGN5ICogY3ogLSBjeCAqIHN5ICogc3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzFdID0gY3ggKiBzeSAqIGN6IC0gc3ggKiBjeSAqIHN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFsyXSA9IGN4ICogY3kgKiBzeiArIHN4ICogc3kgKiBjejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbM10gPSBjeCAqIGN5ICogY3ogKyBzeCAqIHN5ICogc3o7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd5eHonOlxuICAgICAgICAgICAgICAgIG5ld0RzdFswXSA9IHN4ICogY3kgKiBjeiArIGN4ICogc3kgKiBzejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMV0gPSBjeCAqIHN5ICogY3ogLSBzeCAqIGN5ICogc3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzJdID0gY3ggKiBjeSAqIHN6IC0gc3ggKiBzeSAqIGN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFszXSA9IGN4ICogY3kgKiBjeiArIHN4ICogc3kgKiBzejtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3l6eCc6XG4gICAgICAgICAgICAgICAgbmV3RHN0WzBdID0gc3ggKiBjeSAqIGN6ICsgY3ggKiBzeSAqIHN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFsxXSA9IGN4ICogc3kgKiBjeiArIHN4ICogY3kgKiBzejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMl0gPSBjeCAqIGN5ICogc3ogLSBzeCAqIHN5ICogY3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzNdID0gY3ggKiBjeSAqIGN6IC0gc3ggKiBzeSAqIHN6O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnenh5JzpcbiAgICAgICAgICAgICAgICBuZXdEc3RbMF0gPSBzeCAqIGN5ICogY3ogLSBjeCAqIHN5ICogc3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzFdID0gY3ggKiBzeSAqIGN6ICsgc3ggKiBjeSAqIHN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFsyXSA9IGN4ICogY3kgKiBzeiArIHN4ICogc3kgKiBjejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbM10gPSBjeCAqIGN5ICogY3ogLSBzeCAqIHN5ICogc3o7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd6eXgnOlxuICAgICAgICAgICAgICAgIG5ld0RzdFswXSA9IHN4ICogY3kgKiBjeiAtIGN4ICogc3kgKiBzejtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMV0gPSBjeCAqIHN5ICogY3ogKyBzeCAqIGN5ICogc3o7XG4gICAgICAgICAgICAgICAgbmV3RHN0WzJdID0gY3ggKiBjeSAqIHN6IC0gc3ggKiBzeSAqIGN6O1xuICAgICAgICAgICAgICAgIG5ld0RzdFszXSA9IGN4ICogY3kgKiBjeiArIHN4ICogc3kgKiBzejtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHJvdGF0aW9uIG9yZGVyOiAke29yZGVyfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvcGllcyBhIHF1YXRlcm5pb24uIChzYW1lIGFzIHtAbGluayBxdWF0LmNsb25lfSlcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgcXVhdC5jcmVhdGV9IGFuZCB7QGxpbmsgcXVhdC5zZXR9XG4gICAgICogQHBhcmFtIHEgLSBUaGUgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHF1YXRlcm5pb24gdGhhdCBpcyBhIGNvcHkgb2YgcVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcHkocSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBxWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBxWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBxWzJdO1xuICAgICAgICBuZXdEc3RbM10gPSBxWzNdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9uZXMgYSBxdWF0ZXJuaW9uLiAoc2FtZSBhcyB7QGxpbmsgcXVhdC5jb3B5fSlcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgcXVhdC5jcmVhdGV9IGFuZCB7QGxpbmsgcXVhdC5zZXR9XG4gICAgICogQHBhcmFtIHEgLSBUaGUgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIGNvcHkgb2YgcS5cbiAgICAgKi9cbiAgICBjb25zdCBjbG9uZSA9IGNvcHk7XG4gICAgLyoqXG4gICAgICogQWRkcyB0d28gcXVhdGVybmlvbnM7IGFzc3VtZXMgYSBhbmQgYiBoYXZlIHRoZSBzYW1lIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHF1YXRlcm5pb24gdGhhdCBpcyB0aGUgc3VtIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSArIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdICsgYlsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gYVszXSArIGJbM107XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0d28gcXVhdGVybmlvbnMuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHF1YXRlcm5pb24uXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHF1YXRlcm5pb24uXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBxdWF0ZXJuaW9uIHRoYXQgaXMgdGhlIGRpZmZlcmVuY2Ugb2YgYSBhbmQgYi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdWJ0cmFjdChhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gLSBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSAtIGJbMl07XG4gICAgICAgIG5ld0RzdFszXSA9IGFbM10gLSBiWzNdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgdHdvIHF1YXRlcm5pb25zLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCBxdWF0ZXJuaW9uLlxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgcXVhdGVybmlvbiB0aGF0IGlzIHRoZSBkaWZmZXJlbmNlIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3Qgc3ViID0gc3VidHJhY3Q7XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHF1YXRlcm5pb24gYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gayAtIFRoZSBzY2FsYXIuXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCBxdWF0ZXJuaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG11bFNjYWxhcih2LCBrLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF0gKiBrO1xuICAgICAgICBuZXdEc3RbMV0gPSB2WzFdICogaztcbiAgICAgICAgbmV3RHN0WzJdID0gdlsyXSAqIGs7XG4gICAgICAgIG5ld0RzdFszXSA9IHZbM10gKiBrO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgcXVhdGVybmlvbiBieSBhIHNjYWxhci4gKHNhbWUgYXMgbXVsU2NhbGFyKVxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHF1YXRlcm5pb24uXG4gICAgICogQHBhcmFtIGsgLSBUaGUgc2NhbGFyLlxuICAgICAqIEBwYXJhbSBkc3QgLSBxdWF0ZXJuaW9uIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgcXVhdGVybmlvbi5cbiAgICAgKi9cbiAgICBjb25zdCBzY2FsZSA9IG11bFNjYWxhcjtcbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIGEgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gayAtIFRoZSBzY2FsYXIuXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHNjYWxlZCBxdWF0ZXJuaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdlNjYWxhcih2LCBrLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF0gLyBrO1xuICAgICAgICBuZXdEc3RbMV0gPSB2WzFdIC8gaztcbiAgICAgICAgbmV3RHN0WzJdID0gdlsyXSAvIGs7XG4gICAgICAgIG5ld0RzdFszXSA9IHZbM10gLyBrO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHF1YXRlcm5pb25zXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHF1YXRlcm5pb24uXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHF1YXRlcm5pb24uXG4gICAgICogQHJldHVybnMgZG90IHByb2R1Y3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkb3QoYSwgYikge1xuICAgICAgICByZXR1cm4gKGFbMF0gKiBiWzBdKSArIChhWzFdICogYlsxXSkgKyAoYVsyXSAqIGJbMl0pICsgKGFbM10gKiBiWzNdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgbGluZWFyIGludGVycG9sYXRpb24gb24gdHdvIHF1YXRlcm5pb25zLlxuICAgICAqIEdpdmVuIHF1YXRlcm5pb25zIGEgYW5kIGIgYW5kIGludGVycG9sYXRpb24gY29lZmZpY2llbnQgdCwgcmV0dXJuc1xuICAgICAqIGEgKyB0ICogKGIgLSBhKS5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gdCAtIEludGVycG9sYXRpb24gY29lZmZpY2llbnQuXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGxpbmVhciBpbnRlcnBvbGF0ZWQgcmVzdWx0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlcnAoYSwgYiwgdCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgdCAqIChiWzBdIC0gYVswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyB0ICogKGJbMV0gLSBhWzFdKTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSArIHQgKiAoYlsyXSAtIGFbMl0pO1xuICAgICAgICBuZXdEc3RbM10gPSBhWzNdICsgdCAqIChiWzNdIC0gYVszXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBsZW5ndGggb2YgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSB2IC0gcXVhdGVybmlvbi5cbiAgICAgKiBAcmV0dXJucyBsZW5ndGggb2YgcXVhdGVybmlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsZW5ndGgodikge1xuICAgICAgICBjb25zdCB2MCA9IHZbMF07XG4gICAgICAgIGNvbnN0IHYxID0gdlsxXTtcbiAgICAgICAgY29uc3QgdjIgPSB2WzJdO1xuICAgICAgICBjb25zdCB2MyA9IHZbM107XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodjAgKiB2MCArIHYxICogdjEgKyB2MiAqIHYyICsgdjMgKiB2Myk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBsZW5ndGggb2YgcXVhdGVybmlvbiAoc2FtZSBhcyBsZW5ndGgpXG4gICAgICogQHBhcmFtIHYgLSBxdWF0ZXJuaW9uLlxuICAgICAqIEByZXR1cm5zIGxlbmd0aCBvZiBxdWF0ZXJuaW9uLlxuICAgICAqL1xuICAgIGNvbnN0IGxlbiA9IGxlbmd0aDtcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSB2IC0gcXVhdGVybmlvbi5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiBxdWF0ZXJuaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlbmd0aFNxKHYpIHtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHYyID0gdlsyXTtcbiAgICAgICAgY29uc3QgdjMgPSB2WzNdO1xuICAgICAgICByZXR1cm4gdjAgKiB2MCArIHYxICogdjEgKyB2MiAqIHYyICsgdjMgKiB2MztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHF1YXRlcm5pb24gKHNhbWUgYXMgbGVuZ3RoU3EpXG4gICAgICogQHBhcmFtIHYgLSBxdWF0ZXJuaW9uLlxuICAgICAqIEByZXR1cm5zIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHF1YXRlcm5pb24uXG4gICAgICovXG4gICAgY29uc3QgbGVuU3EgPSBsZW5ndGhTcTtcbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIGEgcXVhdGVybmlvbiBieSBpdHMgRXVjbGlkZWFuIGxlbmd0aCBhbmQgcmV0dXJucyB0aGUgcXVvdGllbnQuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBUaGUgbm9ybWFsaXplZCBxdWF0ZXJuaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIGNvbnN0IHYzID0gdlszXTtcbiAgICAgICAgY29uc3QgbGVuID0gTWF0aC5zcXJ0KHYwICogdjAgKyB2MSAqIHYxICsgdjIgKiB2MiArIHYzICogdjMpO1xuICAgICAgICBpZiAobGVuID4gMC4wMDAwMSkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gdjAgLyBsZW47XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSB2MSAvIGxlbjtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IHYyIC8gbGVuO1xuICAgICAgICAgICAgbmV3RHN0WzNdID0gdjMgLyBsZW47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbM10gPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIDIgcXVhdGVybmlvbnMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWxcbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgcXVhdGVybmlvbi5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHF1YXRlcm5pb25zIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXF1YWxzQXBwcm94aW1hdGVseShhLCBiKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhWzBdIC0gYlswXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzFdIC0gYlsxXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzJdIC0gYlsyXSkgPCBFUFNJTE9OICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhWzNdIC0gYlszXSkgPCBFUFNJTE9OO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiAyIHF1YXRlcm5pb25zIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHF1YXRlcm5pb24uXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHF1YXRlcm5pb24uXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiBxdWF0ZXJuaW9ucyBhcmUgZXhhY3RseSBlcXVhbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gICAgICAgIHJldHVybiBhWzBdID09PSBiWzBdICYmIGFbMV0gPT09IGJbMV0gJiYgYVsyXSA9PT0gYlsyXSAmJiBhWzNdID09PSBiWzNdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGlkZW50aXR5IHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0gZHN0IC0gcXVhdGVybmlvbiB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBhbiBpZGVudGl0eSBxdWF0ZXJuaW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaWRlbnRpdHkoZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSAwO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbM10gPSAxO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICBjb25zdCB0ZW1wVmVjMyA9IHZlYzMuY3JlYXRlKCk7XG4gICAgY29uc3QgeFVuaXRWZWMzID0gdmVjMy5jcmVhdGUoKTtcbiAgICBjb25zdCB5VW5pdFZlYzMgPSB2ZWMzLmNyZWF0ZSgpO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIGEgcXVhdGVybmlvbiB0byByZXByZXNlbnQgdGhlIHNob3J0ZXN0IHJvdGF0aW9uIGZyb20gb25lIHZlY3RvciB0byBhbm90aGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFVbml0IC0gdGhlIHN0YXJ0IHZlY3RvclxuICAgICAqIEBwYXJhbSBiVW5pdCAtIHRoZSBlbmQgdmVjdG9yXG4gICAgICogQHBhcmFtIGRzdCAtIHF1YXRlcm5pb24gdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdGF0aW9uVG8oYVVuaXQsIGJVbml0LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IGRvdCA9IHZlYzMuZG90KGFVbml0LCBiVW5pdCk7XG4gICAgICAgIGlmIChkb3QgPCAtMC45OTk5OTkpIHtcbiAgICAgICAgICAgIHZlYzMuY3Jvc3MoeFVuaXRWZWMzLCBhVW5pdCwgdGVtcFZlYzMpO1xuICAgICAgICAgICAgaWYgKHZlYzMubGVuKHRlbXBWZWMzKSA8IDAuMDAwMDAxKSB7XG4gICAgICAgICAgICAgICAgdmVjMy5jcm9zcyh5VW5pdFZlYzMsIGFVbml0LCB0ZW1wVmVjMyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2ZWMzLm5vcm1hbGl6ZSh0ZW1wVmVjMywgdGVtcFZlYzMpO1xuICAgICAgICAgICAgZnJvbUF4aXNBbmdsZSh0ZW1wVmVjMywgTWF0aC5QSSwgbmV3RHN0KTtcbiAgICAgICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZG90ID4gMC45OTk5OTkpIHtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzJdID0gMDtcbiAgICAgICAgICAgIG5ld0RzdFszXSA9IDE7XG4gICAgICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmVjMy5jcm9zcyhhVW5pdCwgYlVuaXQsIHRlbXBWZWMzKTtcbiAgICAgICAgICAgIG5ld0RzdFswXSA9IHRlbXBWZWMzWzBdO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gdGVtcFZlYzNbMV07XG4gICAgICAgICAgICBuZXdEc3RbMl0gPSB0ZW1wVmVjM1syXTtcbiAgICAgICAgICAgIG5ld0RzdFszXSA9IDEgKyBkb3Q7XG4gICAgICAgICAgICByZXR1cm4gbm9ybWFsaXplKG5ld0RzdCwgbmV3RHN0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB0ZW1wUXVhdDEgPSBuZXcgQ3Rvcig0KTtcbiAgICBjb25zdCB0ZW1wUXVhdDIgPSBuZXcgQ3Rvcig0KTtcbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBhIHNwaGVyaWNhbCBsaW5lYXIgaW50ZXJwb2xhdGlvbiB3aXRoIHR3byBjb250cm9sIHBvaW50c1xuICAgICAqXG4gICAgICogQHBhcmFtIGEgLSB0aGUgZmlyc3QgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSBiIC0gdGhlIHNlY29uZCBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIGMgLSB0aGUgdGhpcmQgcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSBkIC0gdGhlIGZvdXJ0aCBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIHQgLSBJbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50IDAgdG8gMVxuICAgICAqIEByZXR1cm5zIHJlc3VsdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNxbGVycChhLCBiLCBjLCBkLCB0LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIHNsZXJwKGEsIGQsIHQsIHRlbXBRdWF0MSk7XG4gICAgICAgIHNsZXJwKGIsIGMsIHQsIHRlbXBRdWF0Mik7XG4gICAgICAgIHNsZXJwKHRlbXBRdWF0MSwgdGVtcFF1YXQyLCAyICogdCAqICgxIC0gdCksIG5ld0RzdCk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZSxcbiAgICAgICAgZnJvbVZhbHVlcyxcbiAgICAgICAgc2V0LFxuICAgICAgICBmcm9tQXhpc0FuZ2xlLFxuICAgICAgICB0b0F4aXNBbmdsZSxcbiAgICAgICAgYW5nbGUsXG4gICAgICAgIG11bHRpcGx5LFxuICAgICAgICBtdWwsXG4gICAgICAgIHJvdGF0ZVgsXG4gICAgICAgIHJvdGF0ZVksXG4gICAgICAgIHJvdGF0ZVosXG4gICAgICAgIHNsZXJwLFxuICAgICAgICBpbnZlcnNlLFxuICAgICAgICBjb25qdWdhdGUsXG4gICAgICAgIGZyb21NYXQsXG4gICAgICAgIGZyb21FdWxlcixcbiAgICAgICAgY29weSxcbiAgICAgICAgY2xvbmUsXG4gICAgICAgIGFkZCxcbiAgICAgICAgc3VidHJhY3QsXG4gICAgICAgIHN1YixcbiAgICAgICAgbXVsU2NhbGFyLFxuICAgICAgICBzY2FsZSxcbiAgICAgICAgZGl2U2NhbGFyLFxuICAgICAgICBkb3QsXG4gICAgICAgIGxlcnAsXG4gICAgICAgIGxlbmd0aCxcbiAgICAgICAgbGVuLFxuICAgICAgICBsZW5ndGhTcSxcbiAgICAgICAgbGVuU3EsXG4gICAgICAgIG5vcm1hbGl6ZSxcbiAgICAgICAgZXF1YWxzQXBwcm94aW1hdGVseSxcbiAgICAgICAgZXF1YWxzLFxuICAgICAgICBpZGVudGl0eSxcbiAgICAgICAgcm90YXRpb25UbyxcbiAgICAgICAgc3FsZXJwLFxuICAgIH07XG59XG5jb25zdCBjYWNoZSQxID0gbmV3IE1hcCgpO1xuLyoqXG4gKlxuICogUXVhdDQgbWF0aCBmdW5jdGlvbnMuXG4gKlxuICogQWxtb3N0IGFsbCBmdW5jdGlvbnMgdGFrZSBhbiBvcHRpb25hbCBgbmV3RHN0YCBhcmd1bWVudC4gSWYgaXQgaXMgbm90IHBhc3NlZCBpbiB0aGVcbiAqIGZ1bmN0aW9ucyB3aWxsIGNyZWF0ZSBhIG5ldyBgUXVhdDRgLiBJbiBvdGhlciB3b3JkcyB5b3UgY2FuIGRvIHRoaXNcbiAqXG4gKiAgICAgY29uc3QgdiA9IHF1YXQ0LmNyb3NzKHYxLCB2Mik7ICAvLyBDcmVhdGVzIGEgbmV3IFF1YXQ0IHdpdGggdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdjEgeCB2Mi5cbiAqXG4gKiBvclxuICpcbiAqICAgICBjb25zdCB2ID0gcXVhdDQuY3JlYXRlKCk7XG4gKiAgICAgcXVhdDQuY3Jvc3ModjEsIHYyLCB2KTsgIC8vIFB1dHMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdjEgeCB2MiBpbiB2XG4gKlxuICogVGhlIGZpcnN0IHN0eWxlIGlzIG9mdGVuIGVhc2llciBidXQgZGVwZW5kaW5nIG9uIHdoZXJlIGl0J3MgdXNlZCBpdCBnZW5lcmF0ZXMgZ2FyYmFnZSB3aGVyZVxuICogYXMgdGhlcmUgaXMgYWxtb3N0IG5ldmVyIGFsbG9jYXRpb24gd2l0aCB0aGUgc2Vjb25kIHN0eWxlLlxuICpcbiAqIEl0IGlzIGFsd2F5cyBzYWZlIHRvIHBhc3MgYW55IHZlY3RvciBhcyB0aGUgZGVzdGluYXRpb24uIFNvIGZvciBleGFtcGxlXG4gKlxuICogICAgIHF1YXQ0LmNyb3NzKHYxLCB2MiwgdjEpOyAgLy8gUHV0cyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB2MSB4IHYyIGluIHYxXG4gKlxuICovXG5mdW5jdGlvbiBnZXRBUEkkMShDdG9yKSB7XG4gICAgbGV0IGFwaSA9IGNhY2hlJDEuZ2V0KEN0b3IpO1xuICAgIGlmICghYXBpKSB7XG4gICAgICAgIGFwaSA9IGdldEFQSUltcGwkMShDdG9yKTtcbiAgICAgICAgY2FjaGUkMS5zZXQoQ3RvciwgYXBpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwaTtcbn1cblxuLypcbiAqIENvcHlyaWdodCAyMDIyIEdyZWdnIFRhdmFyZXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICogY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuICogdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuICogdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuLyoqXG4gKiBHZW5lcmF0ZXMgYW0gdHlwZWQgQVBJIGZvciBWZWM0XG4gKiAqL1xuZnVuY3Rpb24gZ2V0QVBJSW1wbChDdG9yKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHZlYzQ7IG1heSBiZSBjYWxsZWQgd2l0aCB4LCB5LCB6IHRvIHNldCBpbml0aWFsIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0geCAtIEluaXRpYWwgeCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geSAtIEluaXRpYWwgeSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0geiAtIEluaXRpYWwgeiB2YWx1ZS5cbiAgICAgKiBAcGFyYW0gdyAtIEluaXRpYWwgdyB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyB0aGUgY3JlYXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGUoeCwgeSwgeiwgdykge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSBuZXcgQ3Rvcig0KTtcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0geDtcbiAgICAgICAgICAgIGlmICh5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBuZXdEc3RbMV0gPSB5O1xuICAgICAgICAgICAgICAgIGlmICh6ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzJdID0gejtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RHN0WzNdID0gdztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgdmVjNDsgbWF5IGJlIGNhbGxlZCB3aXRoIHgsIHksIHogdG8gc2V0IGluaXRpYWwgdmFsdWVzLiAoc2FtZSBhcyBjcmVhdGUpXG4gICAgICogQHBhcmFtIHggLSBJbml0aWFsIHggdmFsdWUuXG4gICAgICogQHBhcmFtIHkgLSBJbml0aWFsIHkgdmFsdWUuXG4gICAgICogQHBhcmFtIHogLSBJbml0aWFsIHogdmFsdWUuXG4gICAgICogQHBhcmFtIHogLSBJbml0aWFsIHcgdmFsdWUuXG4gICAgICogQHJldHVybnMgdGhlIGNyZWF0ZWQgdmVjdG9yXG4gICAgICovXG4gICAgY29uc3QgZnJvbVZhbHVlcyA9IGNyZWF0ZTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZXMgb2YgYSBWZWM0XG4gICAgICogQWxzbyBzZWUge0BsaW5rIHZlYzQuY3JlYXRlfSBhbmQge0BsaW5rIHZlYzQuY29weX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IGZpcnN0IHZhbHVlXG4gICAgICogQHBhcmFtIHkgc2Vjb25kIHZhbHVlXG4gICAgICogQHBhcmFtIHogdGhpcmQgdmFsdWVcbiAgICAgKiBAcGFyYW0gdyBmb3VydGggdmFsdWVcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHdpdGggaXRzIGVsZW1lbnRzIHNldC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQoeCwgeSwgeiwgdywgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSB4O1xuICAgICAgICBuZXdEc3RbMV0gPSB5O1xuICAgICAgICBuZXdEc3RbMl0gPSB6O1xuICAgICAgICBuZXdEc3RbM10gPSB3O1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIE1hdGguY2VpbCB0byBlYWNoIGVsZW1lbnQgb2YgdmVjdG9yXG4gICAgICogQHBhcmFtIHYgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIGNlaWwgb2YgZWFjaCBlbGVtZW50IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2VpbCh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGguY2VpbCh2WzBdKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5jZWlsKHZbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLmNlaWwodlsyXSk7XG4gICAgICAgIG5ld0RzdFszXSA9IE1hdGguY2VpbCh2WzNdKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXBwbGllcyBNYXRoLmZsb29yIHRvIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gdiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgZmxvb3Igb2YgZWFjaCBlbGVtZW50IG9mIHYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmxvb3IodiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBNYXRoLmZsb29yKHZbMF0pO1xuICAgICAgICBuZXdEc3RbMV0gPSBNYXRoLmZsb29yKHZbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLmZsb29yKHZbMl0pO1xuICAgICAgICBuZXdEc3RbM10gPSBNYXRoLmZsb29yKHZbM10pO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIE1hdGgucm91bmQgdG8gZWFjaCBlbGVtZW50IG9mIHZlY3RvclxuICAgICAqIEBwYXJhbSB2IC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSByb3VuZCBvZiBlYWNoIGVsZW1lbnQgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByb3VuZCh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IE1hdGgucm91bmQodlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgucm91bmQodlsxXSk7XG4gICAgICAgIG5ld0RzdFsyXSA9IE1hdGgucm91bmQodlsyXSk7XG4gICAgICAgIG5ld0RzdFszXSA9IE1hdGgucm91bmQodlszXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsYW1wIGVhY2ggZWxlbWVudCBvZiB2ZWN0b3IgYmV0d2VlbiBtaW4gYW5kIG1heFxuICAgICAqIEBwYXJhbSB2IC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIG1heCAtIE1pbiB2YWx1ZSwgZGVmYXVsdCAwXG4gICAgICogQHBhcmFtIG1pbiAtIE1heCB2YWx1ZSwgZGVmYXVsdCAxXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IHRoZSBjbGFtcGVkIHZhbHVlIG9mIGVhY2ggZWxlbWVudCBvZiB2LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsYW1wKHYsIG1pbiA9IDAsIG1heCA9IDEsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZbMF0pKTtcbiAgICAgICAgbmV3RHN0WzFdID0gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZbMV0pKTtcbiAgICAgICAgbmV3RHN0WzJdID0gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZbMl0pKTtcbiAgICAgICAgbmV3RHN0WzNdID0gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZbM10pKTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyB0d28gdmVjdG9yczsgYXNzdW1lcyBhIGFuZCBiIGhhdmUgdGhlIHNhbWUgZGltZW5zaW9uLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIHN1bSBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZChhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gKyBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICsgYlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSArIGJbMl07XG4gICAgICAgIG5ld0RzdFszXSA9IGFbM10gKyBiWzNdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIHR3byB2ZWN0b3JzLCBzY2FsaW5nIHRoZSAybmQ7IGFzc3VtZXMgYSBhbmQgYiBoYXZlIHRoZSBzYW1lIGRpbWVuc2lvbi5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHNjYWxlIC0gQW1vdW50IHRvIHNjYWxlIGJcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIEEgdmVjdG9yIHRoYXQgaXMgdGhlIHN1bSBvZiBhICsgYiAqIHNjYWxlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFNjYWxlZChhLCBiLCBzY2FsZSwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgYlswXSAqIHNjYWxlO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdICsgYlsxXSAqIHNjYWxlO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdICsgYlsyXSAqIHNjYWxlO1xuICAgICAgICBuZXdEc3RbM10gPSBhWzNdICsgYlszXSAqIHNjYWxlO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSB2ZWN0b3IgdGhhdCBpcyB0aGUgZGlmZmVyZW5jZSBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gYVswXSAtIGJbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSBhWzJdIC0gYlsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gYVszXSAtIGJbM107XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIHZlY3RvciB0aGF0IGlzIHRoZSBkaWZmZXJlbmNlIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgY29uc3Qgc3ViID0gc3VidHJhY3Q7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgMiB2ZWN0b3JzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdmVjdG9ycyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVxdWFsc0FwcHJveGltYXRlbHkoYSwgYikge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYVswXSAtIGJbMF0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsxXSAtIGJbMV0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVsyXSAtIGJbMl0pIDwgRVBTSUxPTiAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYVszXSAtIGJbM10pIDwgRVBTSUxPTjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgMiB2ZWN0b3JzIGFyZSBleGFjdGx5IGVxdWFsXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdmVjdG9ycyBhcmUgZXhhY3RseSBlcXVhbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gICAgICAgIHJldHVybiBhWzBdID09PSBiWzBdICYmIGFbMV0gPT09IGJbMV0gJiYgYVsyXSA9PT0gYlsyXSAmJiBhWzNdID09PSBiWzNdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBsaW5lYXIgaW50ZXJwb2xhdGlvbiBvbiB0d28gdmVjdG9ycy5cbiAgICAgKiBHaXZlbiB2ZWN0b3JzIGEgYW5kIGIgYW5kIGludGVycG9sYXRpb24gY29lZmZpY2llbnQgdCwgcmV0dXJuc1xuICAgICAqIGEgKyB0ICogKGIgLSBhKS5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHQgLSBJbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50LlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGxpbmVhciBpbnRlcnBvbGF0ZWQgcmVzdWx0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlcnAoYSwgYiwgdCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgdCAqIChiWzBdIC0gYVswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyB0ICogKGJbMV0gLSBhWzFdKTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSArIHQgKiAoYlsyXSAtIGFbMl0pO1xuICAgICAgICBuZXdEc3RbM10gPSBhWzNdICsgdCAqIChiWzNdIC0gYVszXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGxpbmVhciBpbnRlcnBvbGF0aW9uIG9uIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiBhbmQgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudCB2ZWN0b3IgdCwgcmV0dXJuc1xuICAgICAqIGEgKyB0ICogKGIgLSBhKS5cbiAgICAgKiBAcGFyYW0gYSAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHQgLSBJbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50cyB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgbGluZWFyIGludGVycG9sYXRlZCByZXN1bHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVycFYoYSwgYiwgdCwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICsgdFswXSAqIChiWzBdIC0gYVswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IGFbMV0gKyB0WzFdICogKGJbMV0gLSBhWzFdKTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSArIHRbMl0gKiAoYlsyXSAtIGFbMl0pO1xuICAgICAgICBuZXdEc3RbM10gPSBhWzNdICsgdFszXSAqIChiWzNdIC0gYVszXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBtYXggdmFsdWVzIG9mIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiByZXR1cm5zXG4gICAgICogW21heChhWzBdLCBiWzBdKSwgbWF4KGFbMV0sIGJbMV0pLCBtYXgoYVsyXSwgYlsyXSldLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBtYXggY29tcG9uZW50cyB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWF4KGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5tYXgoYVswXSwgYlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgubWF4KGFbMV0sIGJbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLm1heChhWzJdLCBiWzJdKTtcbiAgICAgICAgbmV3RHN0WzNdID0gTWF0aC5tYXgoYVszXSwgYlszXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBtaW4gdmFsdWVzIG9mIHR3byB2ZWN0b3JzLlxuICAgICAqIEdpdmVuIHZlY3RvcnMgYSBhbmQgYiByZXR1cm5zXG4gICAgICogW21pbihhWzBdLCBiWzBdKSwgbWluKGFbMV0sIGJbMV0pLCBtaW4oYVsyXSwgYlsyXSldLlxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBtaW4gY29tcG9uZW50cyB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWluKGEsIGIsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gTWF0aC5taW4oYVswXSwgYlswXSk7XG4gICAgICAgIG5ld0RzdFsxXSA9IE1hdGgubWluKGFbMV0sIGJbMV0pO1xuICAgICAgICBuZXdEc3RbMl0gPSBNYXRoLm1pbihhWzJdLCBiWzJdKTtcbiAgICAgICAgbmV3RHN0WzNdID0gTWF0aC5taW4oYVszXSwgYlszXSk7XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBrIC0gVGhlIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG11bFNjYWxhcih2LCBrLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF0gKiBrO1xuICAgICAgICBuZXdEc3RbMV0gPSB2WzFdICogaztcbiAgICAgICAgbmV3RHN0WzJdID0gdlsyXSAqIGs7XG4gICAgICAgIG5ld0RzdFszXSA9IHZbM10gKiBrO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGEgc2NhbGFyLiAoc2FtZSBhcyBtdWxTY2FsYXIpXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBrIC0gVGhlIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGNvbnN0IHNjYWxlID0gbXVsU2NhbGFyO1xuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBrIC0gVGhlIHNjYWxhci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBzY2FsZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdlNjYWxhcih2LCBrLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IHZbMF0gLyBrO1xuICAgICAgICBuZXdEc3RbMV0gPSB2WzFdIC8gaztcbiAgICAgICAgbmV3RHN0WzJdID0gdlsyXSAvIGs7XG4gICAgICAgIG5ld0RzdFszXSA9IHZbM10gLyBrO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnZlcnNlIGEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB2IC0gVGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSBpbnZlcnRlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52ZXJzZSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IDEgLyB2WzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSAxIC8gdlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gMSAvIHZbMl07XG4gICAgICAgIG5ld0RzdFszXSA9IDEgLyB2WzNdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnZlcnQgYSB2ZWN0b3IuIChzYW1lIGFzIGludmVyc2UpXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIGludmVydGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBjb25zdCBpbnZlcnQgPSBpbnZlcnNlO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjdG9yc1xuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBkb3QgcHJvZHVjdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvdChhLCBiKSB7XG4gICAgICAgIHJldHVybiAoYVswXSAqIGJbMF0pICsgKGFbMV0gKiBiWzFdKSArIChhWzJdICogYlsyXSkgKyAoYVszXSAqIGJbM10pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgbGVuZ3RoIG9mIHZlY3RvclxuICAgICAqIEBwYXJhbSB2IC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGxlbmd0aCBvZiB2ZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVuZ3RoKHYpIHtcbiAgICAgICAgY29uc3QgdjAgPSB2WzBdO1xuICAgICAgICBjb25zdCB2MSA9IHZbMV07XG4gICAgICAgIGNvbnN0IHYyID0gdlsyXTtcbiAgICAgICAgY29uc3QgdjMgPSB2WzNdO1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHYwICogdjAgKyB2MSAqIHYxICsgdjIgKiB2MiArIHYzICogdjMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgbGVuZ3RoIG9mIHZlY3RvciAoc2FtZSBhcyBsZW5ndGgpXG4gICAgICogQHBhcmFtIHYgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgbGVuZ3RoIG9mIHZlY3Rvci5cbiAgICAgKi9cbiAgICBjb25zdCBsZW4gPSBsZW5ndGg7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHZlY3RvclxuICAgICAqIEBwYXJhbSB2IC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHNxdWFyZSBvZiB0aGUgbGVuZ3RoIG9mIHZlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsZW5ndGhTcSh2KSB7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIGNvbnN0IHYzID0gdlszXTtcbiAgICAgICAgcmV0dXJuIHYwICogdjAgKyB2MSAqIHYxICsgdjIgKiB2MiArIHYzICogdjM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGxlbmd0aCBvZiB2ZWN0b3IgKHNhbWUgYXMgbGVuZ3RoU3EpXG4gICAgICogQHBhcmFtIHYgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBsZW5ndGggb2YgdmVjdG9yLlxuICAgICAqL1xuICAgIGNvbnN0IGxlblNxID0gbGVuZ3RoU3E7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHNcbiAgICAgKiBAcGFyYW0gYSAtIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXN0YW5jZShhLCBiKSB7XG4gICAgICAgIGNvbnN0IGR4ID0gYVswXSAtIGJbMF07XG4gICAgICAgIGNvbnN0IGR5ID0gYVsxXSAtIGJbMV07XG4gICAgICAgIGNvbnN0IGR6ID0gYVsyXSAtIGJbMl07XG4gICAgICAgIGNvbnN0IGR3ID0gYVszXSAtIGJbM107XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkgKyBkeiAqIGR6ICsgZHcgKiBkdyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzIChzYW1lIGFzIGRpc3RhbmNlKVxuICAgICAqIEBwYXJhbSBhIC0gdmVjdG9yLlxuICAgICAqIEBwYXJhbSBiIC0gdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGNvbnN0IGRpc3QgPSBkaXN0YW5jZTtcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzXG4gICAgICogQHBhcmFtIGEgLSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMgc3F1YXJlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXN0YW5jZVNxKGEsIGIpIHtcbiAgICAgICAgY29uc3QgZHggPSBhWzBdIC0gYlswXTtcbiAgICAgICAgY29uc3QgZHkgPSBhWzFdIC0gYlsxXTtcbiAgICAgICAgY29uc3QgZHogPSBhWzJdIC0gYlsyXTtcbiAgICAgICAgY29uc3QgZHcgPSBhWzNdIC0gYlszXTtcbiAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5ICsgZHogKiBkeiArIGR3ICogZHc7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gMiBwb2ludHMgKHNhbWUgYXMgZGlzdGFuY2VTcSlcbiAgICAgKiBAcGFyYW0gYSAtIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyBzcXVhcmUgb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgICAqL1xuICAgIGNvbnN0IGRpc3RTcSA9IGRpc3RhbmNlU3E7XG4gICAgLyoqXG4gICAgICogRGl2aWRlcyBhIHZlY3RvciBieSBpdHMgRXVjbGlkZWFuIGxlbmd0aCBhbmQgcmV0dXJucyB0aGUgcXVvdGllbnQuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIG5vcm1hbGl6ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZSh2LCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IHYwID0gdlswXTtcbiAgICAgICAgY29uc3QgdjEgPSB2WzFdO1xuICAgICAgICBjb25zdCB2MiA9IHZbMl07XG4gICAgICAgIGNvbnN0IHYzID0gdlszXTtcbiAgICAgICAgY29uc3QgbGVuID0gTWF0aC5zcXJ0KHYwICogdjAgKyB2MSAqIHYxICsgdjIgKiB2MiArIHYzICogdjMpO1xuICAgICAgICBpZiAobGVuID4gMC4wMDAwMSkge1xuICAgICAgICAgICAgbmV3RHN0WzBdID0gdjAgLyBsZW47XG4gICAgICAgICAgICBuZXdEc3RbMV0gPSB2MSAvIGxlbjtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IHYyIC8gbGVuO1xuICAgICAgICAgICAgbmV3RHN0WzNdID0gdjMgLyBsZW47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuZXdEc3RbMF0gPSAwO1xuICAgICAgICAgICAgbmV3RHN0WzFdID0gMDtcbiAgICAgICAgICAgIG5ld0RzdFsyXSA9IDA7XG4gICAgICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE5lZ2F0ZXMgYSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgLXYuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbmVnYXRlKHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gLXZbMF07XG4gICAgICAgIG5ld0RzdFsxXSA9IC12WzFdO1xuICAgICAgICBuZXdEc3RbMl0gPSAtdlsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gLXZbM107XG4gICAgICAgIHJldHVybiBuZXdEc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvcGllcyBhIHZlY3Rvci4gKHNhbWUgYXMge0BsaW5rIHZlYzQuY2xvbmV9KVxuICAgICAqIEFsc28gc2VlIHtAbGluayB2ZWM0LmNyZWF0ZX0gYW5kIHtAbGluayB2ZWM0LnNldH1cbiAgICAgKiBAcGFyYW0gdiAtIFRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGRzdCAtIHZlY3RvciB0byBob2xkIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBpbiBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyBBIGNvcHkgb2Ygdi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb3B5KHYsIGRzdCkge1xuICAgICAgICBjb25zdCBuZXdEc3QgPSAoZHN0ID8/IG5ldyBDdG9yKDQpKTtcbiAgICAgICAgbmV3RHN0WzBdID0gdlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gdlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gdlsyXTtcbiAgICAgICAgbmV3RHN0WzNdID0gdlszXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvbmVzIGEgdmVjdG9yLiAoc2FtZSBhcyB7QGxpbmsgdmVjNC5jb3B5fSlcbiAgICAgKiBBbHNvIHNlZSB7QGxpbmsgdmVjNC5jcmVhdGV9IGFuZCB7QGxpbmsgdmVjNC5zZXR9XG4gICAgICogQHBhcmFtIHYgLSBUaGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgQSBjb3B5IG9mIHYuXG4gICAgICovXG4gICAgY29uc3QgY2xvbmUgPSBjb3B5O1xuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgYSB2ZWN0b3IgYnkgYW5vdGhlciB2ZWN0b3IgKGNvbXBvbmVudC13aXNlKTsgYXNzdW1lcyBhIGFuZFxuICAgICAqIGIgaGF2ZSB0aGUgc2FtZSBsZW5ndGguXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBwcm9kdWN0cyBvZiBlbnRyaWVzIG9mIGEgYW5kIGIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsdGlwbHkoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSBhWzBdICogYlswXTtcbiAgICAgICAgbmV3RHN0WzFdID0gYVsxXSAqIGJbMV07XG4gICAgICAgIG5ld0RzdFsyXSA9IGFbMl0gKiBiWzJdO1xuICAgICAgICBuZXdEc3RbM10gPSBhWzNdICogYlszXTtcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhbm90aGVyIHZlY3RvciAoY29tcG9uZW50LXdpc2UpOyBhc3N1bWVzIGEgYW5kXG4gICAgICogYiBoYXZlIHRoZSBzYW1lIGxlbmd0aC4gKHNhbWUgYXMgbXVsKVxuICAgICAqIEBwYXJhbSBhIC0gT3BlcmFuZCB2ZWN0b3IuXG4gICAgICogQHBhcmFtIGIgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3Igb2YgcHJvZHVjdHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGNvbnN0IG11bCA9IG11bHRpcGx5O1xuICAgIC8qKlxuICAgICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYW5vdGhlciB2ZWN0b3IgKGNvbXBvbmVudC13aXNlKTsgYXNzdW1lcyBhIGFuZFxuICAgICAqIGIgaGF2ZSB0aGUgc2FtZSBsZW5ndGguXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBxdW90aWVudHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdmlkZShhLCBiLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5ld0RzdFswXSA9IGFbMF0gLyBiWzBdO1xuICAgICAgICBuZXdEc3RbMV0gPSBhWzFdIC8gYlsxXTtcbiAgICAgICAgbmV3RHN0WzJdID0gYVsyXSAvIGJbMl07XG4gICAgICAgIG5ld0RzdFszXSA9IGFbM10gLyBiWzNdO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIGEgdmVjdG9yIGJ5IGFub3RoZXIgdmVjdG9yIChjb21wb25lbnQtd2lzZSk7IGFzc3VtZXMgYSBhbmRcbiAgICAgKiBiIGhhdmUgdGhlIHNhbWUgbGVuZ3RoLiAoc2FtZSBhcyBkaXZpZGUpXG4gICAgICogQHBhcmFtIGEgLSBPcGVyYW5kIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0gYiAtIE9wZXJhbmQgdmVjdG9yLlxuICAgICAqIEBwYXJhbSBkc3QgLSB2ZWN0b3IgdG8gaG9sZCByZXN1bHQuIElmIG5vdCBwYXNzZWQgaW4gYSBuZXcgb25lIGlzIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMgVGhlIHZlY3RvciBvZiBxdW90aWVudHMgb2YgZW50cmllcyBvZiBhIGFuZCBiLlxuICAgICAqL1xuICAgIGNvbnN0IGRpdiA9IGRpdmlkZTtcbiAgICAvKipcbiAgICAgKiBaZXJvJ3MgYSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gZHN0IC0gdmVjdG9yIHRvIGhvbGQgcmVzdWx0LiBJZiBub3QgcGFzc2VkIGluIGEgbmV3IG9uZSBpcyBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIFRoZSB6ZXJvZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHplcm8oZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBuZXdEc3RbMF0gPSAwO1xuICAgICAgICBuZXdEc3RbMV0gPSAwO1xuICAgICAgICBuZXdEc3RbMl0gPSAwO1xuICAgICAgICBuZXdEc3RbM10gPSAwO1xuICAgICAgICByZXR1cm4gbmV3RHN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB0cmFuc2Zvcm0gdmVjNCBieSA0eDQgbWF0cml4XG4gICAgICogQHBhcmFtIHYgLSB0aGUgdmVjdG9yXG4gICAgICogQHBhcmFtIG0gLSBUaGUgbWF0cml4LlxuICAgICAqIEBwYXJhbSBkc3QgLSBvcHRpb25hbCB2ZWM0IHRvIHN0b3JlIHJlc3VsdC4gSWYgbm90IHBhc3NlZCBhIG5ldyBvbmUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgdmVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtTWF0NCh2LCBtLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIGNvbnN0IHggPSB2WzBdO1xuICAgICAgICBjb25zdCB5ID0gdlsxXTtcbiAgICAgICAgY29uc3QgeiA9IHZbMl07XG4gICAgICAgIGNvbnN0IHcgPSB2WzNdO1xuICAgICAgICBuZXdEc3RbMF0gPSBtWzBdICogeCArIG1bNF0gKiB5ICsgbVs4XSAqIHogKyBtWzEyXSAqIHc7XG4gICAgICAgIG5ld0RzdFsxXSA9IG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWzldICogeiArIG1bMTNdICogdztcbiAgICAgICAgbmV3RHN0WzJdID0gbVsyXSAqIHggKyBtWzZdICogeSArIG1bMTBdICogeiArIG1bMTRdICogdztcbiAgICAgICAgbmV3RHN0WzNdID0gbVszXSAqIHggKyBtWzddICogeSArIG1bMTFdICogeiArIG1bMTVdICogdztcbiAgICAgICAgcmV0dXJuIG5ld0RzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJlYXQgYSA0RCB2ZWN0b3IgYXMgYSBkaXJlY3Rpb24gYW5kIHNldCBpdCdzIGxlbmd0aFxuICAgICAqXG4gICAgICogQHBhcmFtIGEgVGhlIHZlYzQgdG8gbGVuZ3RoZW5cbiAgICAgKiBAcGFyYW0gbGVuIFRoZSBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyB2ZWN0b3JcbiAgICAgKiBAcmV0dXJucyBUaGUgbGVuZ3RoZW5lZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRMZW5ndGgoYSwgbGVuLCBkc3QpIHtcbiAgICAgICAgY29uc3QgbmV3RHN0ID0gKGRzdCA/PyBuZXcgQ3Rvcig0KSk7XG4gICAgICAgIG5vcm1hbGl6ZShhLCBuZXdEc3QpO1xuICAgICAgICByZXR1cm4gbXVsU2NhbGFyKG5ld0RzdCwgbGVuLCBuZXdEc3QpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbnN1cmUgYSB2ZWN0b3IgaXMgbm90IGxvbmdlciB0aGFuIGEgbWF4IGxlbmd0aFxuICAgICAqXG4gICAgICogQHBhcmFtIGEgVGhlIHZlYzQgdG8gbGltaXRcbiAgICAgKiBAcGFyYW0gbWF4TGVuIFRoZSBsb25nZXN0IGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHZlY3RvclxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3IsIHNob3J0ZW5lZCB0byBtYXhMZW4gaWYgaXQncyB0b28gbG9uZ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRydW5jYXRlKGEsIG1heExlbiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICBpZiAobGVuZ3RoKGEpID4gbWF4TGVuKSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0TGVuZ3RoKGEsIG1heExlbiwgbmV3RHN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weShhLCBuZXdEc3QpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIHZlY3RvciBleGFjdGx5IGJldHdlZW4gMiBlbmRwb2ludCB2ZWN0b3JzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYSBFbmRwb2ludCAxXG4gICAgICogQHBhcmFtIGIgRW5kcG9pbnQgMlxuICAgICAqIEByZXR1cm5zIFRoZSB2ZWN0b3IgZXhhY3RseSByZXNpZGluZyBiZXR3ZWVuIGVuZHBvaW50cyAxIGFuZCAyXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWlkcG9pbnQoYSwgYiwgZHN0KSB7XG4gICAgICAgIGNvbnN0IG5ld0RzdCA9IChkc3QgPz8gbmV3IEN0b3IoNCkpO1xuICAgICAgICByZXR1cm4gbGVycChhLCBiLCAwLjUsIG5ld0RzdCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZSxcbiAgICAgICAgZnJvbVZhbHVlcyxcbiAgICAgICAgc2V0LFxuICAgICAgICBjZWlsLFxuICAgICAgICBmbG9vcixcbiAgICAgICAgcm91bmQsXG4gICAgICAgIGNsYW1wLFxuICAgICAgICBhZGQsXG4gICAgICAgIGFkZFNjYWxlZCxcbiAgICAgICAgc3VidHJhY3QsXG4gICAgICAgIHN1YixcbiAgICAgICAgZXF1YWxzQXBwcm94aW1hdGVseSxcbiAgICAgICAgZXF1YWxzLFxuICAgICAgICBsZXJwLFxuICAgICAgICBsZXJwVixcbiAgICAgICAgbWF4LFxuICAgICAgICBtaW4sXG4gICAgICAgIG11bFNjYWxhcixcbiAgICAgICAgc2NhbGUsXG4gICAgICAgIGRpdlNjYWxhcixcbiAgICAgICAgaW52ZXJzZSxcbiAgICAgICAgaW52ZXJ0LFxuICAgICAgICBkb3QsXG4gICAgICAgIGxlbmd0aCxcbiAgICAgICAgbGVuLFxuICAgICAgICBsZW5ndGhTcSxcbiAgICAgICAgbGVuU3EsXG4gICAgICAgIGRpc3RhbmNlLFxuICAgICAgICBkaXN0LFxuICAgICAgICBkaXN0YW5jZVNxLFxuICAgICAgICBkaXN0U3EsXG4gICAgICAgIG5vcm1hbGl6ZSxcbiAgICAgICAgbmVnYXRlLFxuICAgICAgICBjb3B5LFxuICAgICAgICBjbG9uZSxcbiAgICAgICAgbXVsdGlwbHksXG4gICAgICAgIG11bCxcbiAgICAgICAgZGl2aWRlLFxuICAgICAgICBkaXYsXG4gICAgICAgIHplcm8sXG4gICAgICAgIHRyYW5zZm9ybU1hdDQsXG4gICAgICAgIHNldExlbmd0aCxcbiAgICAgICAgdHJ1bmNhdGUsXG4gICAgICAgIG1pZHBvaW50LFxuICAgIH07XG59XG5jb25zdCBjYWNoZSA9IG5ldyBNYXAoKTtcbi8qKlxuICpcbiAqIFZlYzQgbWF0aCBmdW5jdGlvbnMuXG4gKlxuICogQWxtb3N0IGFsbCBmdW5jdGlvbnMgdGFrZSBhbiBvcHRpb25hbCBgbmV3RHN0YCBhcmd1bWVudC4gSWYgaXQgaXMgbm90IHBhc3NlZCBpbiB0aGVcbiAqIGZ1bmN0aW9ucyB3aWxsIGNyZWF0ZSBhIG5ldyBgVmVjNGAuIEluIG90aGVyIHdvcmRzIHlvdSBjYW4gZG8gdGhpc1xuICpcbiAqICAgICBjb25zdCB2ID0gdmVjNC5jcm9zcyh2MSwgdjIpOyAgLy8gQ3JlYXRlcyBhIG5ldyBWZWM0IHdpdGggdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdjEgeCB2Mi5cbiAqXG4gKiBvclxuICpcbiAqICAgICBjb25zdCB2ID0gdmVjNC5jcmVhdGUoKTtcbiAqICAgICB2ZWM0LmNyb3NzKHYxLCB2Miwgdik7ICAvLyBQdXRzIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHYxIHggdjIgaW4gdlxuICpcbiAqIFRoZSBmaXJzdCBzdHlsZSBpcyBvZnRlbiBlYXNpZXIgYnV0IGRlcGVuZGluZyBvbiB3aGVyZSBpdCdzIHVzZWQgaXQgZ2VuZXJhdGVzIGdhcmJhZ2Ugd2hlcmVcbiAqIGFzIHRoZXJlIGlzIGFsbW9zdCBuZXZlciBhbGxvY2F0aW9uIHdpdGggdGhlIHNlY29uZCBzdHlsZS5cbiAqXG4gKiBJdCBpcyBhbHdheXMgc2FmZSB0byBwYXNzIGFueSB2ZWN0b3IgYXMgdGhlIGRlc3RpbmF0aW9uLiBTbyBmb3IgZXhhbXBsZVxuICpcbiAqICAgICB2ZWM0LmNyb3NzKHYxLCB2MiwgdjEpOyAgLy8gUHV0cyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB2MSB4IHYyIGluIHYxXG4gKlxuICovXG5mdW5jdGlvbiBnZXRBUEkoQ3Rvcikge1xuICAgIGxldCBhcGkgPSBjYWNoZS5nZXQoQ3Rvcik7XG4gICAgaWYgKCFhcGkpIHtcbiAgICAgICAgYXBpID0gZ2V0QVBJSW1wbChDdG9yKTtcbiAgICAgICAgY2FjaGUuc2V0KEN0b3IsIGFwaSk7XG4gICAgfVxuICAgIHJldHVybiBhcGk7XG59XG5cbi8qKlxuICogU29tZSBkb2NzXG4gKiBAbmFtZXNwYWNlIHdncHUtbWF0cml4XG4gKi9cbi8qKlxuICogR2VuZXJhdGUgd2dwdS1tYXRyaXggQVBJIGZvciB0eXBlXG4gKi9cbmZ1bmN0aW9uIHdncHVNYXRyaXhBUEkoTWF0M0N0b3IsIE1hdDRDdG9yLCBRdWF0Q3RvciwgVmVjMkN0b3IsIFZlYzNDdG9yLCBWZWM0Q3Rvcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIC8qKiBAbmFtZXNwYWNlIG1hdDMgKi9cbiAgICAgICAgbWF0MzogZ2V0QVBJJDMoTWF0M0N0b3IpLFxuICAgICAgICAvKiogQG5hbWVzcGFjZSBtYXQ0ICovXG4gICAgICAgIG1hdDQ6IGdldEFQSSQyKE1hdDRDdG9yKSxcbiAgICAgICAgLyoqIEBuYW1lc3BhY2UgcXVhdCAqL1xuICAgICAgICBxdWF0OiBnZXRBUEkkMShRdWF0Q3RvciksXG4gICAgICAgIC8qKiBAbmFtZXNwYWNlIHZlYzIgKi9cbiAgICAgICAgdmVjMjogZ2V0QVBJJDUoVmVjMkN0b3IpLFxuICAgICAgICAvKiogQG5hbWVzcGFjZSB2ZWMzICovXG4gICAgICAgIHZlYzM6IGdldEFQSSQ0KFZlYzNDdG9yKSxcbiAgICAgICAgLyoqIEBuYW1lc3BhY2UgdmVjNCAqL1xuICAgICAgICB2ZWM0OiBnZXRBUEkoVmVjNEN0b3IpLFxuICAgIH07XG59XG5jb25zdCB7IFxuLyoqXG4gKiAzeDMgTWF0cml4IGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDMyQXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbm1hdDMsIFxuLyoqXG4gKiA0eDQgTWF0cml4IGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDMyQXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbm1hdDQsIFxuLyoqXG4gKiBRdWF0ZXJuaW9uIGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDMyQXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnF1YXQsIFxuLyoqXG4gKiBWZWMyIGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDMyQXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnZlYzIsIFxuLyoqXG4gKiBWZWMzIGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDMyQXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnZlYzMsIFxuLyoqXG4gKiBWZWMzIGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDMyQXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnZlYzQsIH0gPSB3Z3B1TWF0cml4QVBJKEZsb2F0MzJBcnJheSwgRmxvYXQzMkFycmF5LCBGbG9hdDMyQXJyYXksIEZsb2F0MzJBcnJheSwgRmxvYXQzMkFycmF5LCBGbG9hdDMyQXJyYXkpO1xuY29uc3QgeyBcbi8qKlxuICogM3gzIE1hdHJpeCBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgRmxvYXQ2NEFycmF5YFxuICogQG5hbWVzcGFjZVxuICovXG5tYXQzOiBtYXQzZCwgXG4vKipcbiAqIDR4NCBNYXRyaXggZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0NjRBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xubWF0NDogbWF0NGQsIFxuLyoqXG4gKiBRdWF0ZXJuaW9uIGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDY0QXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnF1YXQ6IHF1YXRkLCBcbi8qKlxuICogVmVjMiBmdW5jdGlvbnMgdGhhdCBkZWZhdWx0IHRvIHJldHVybmluZyBgRmxvYXQ2NEFycmF5YFxuICogQG5hbWVzcGFjZVxuICovXG52ZWMyOiB2ZWMyZCwgXG4vKipcbiAqIFZlYzMgZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYEZsb2F0NjRBcnJheWBcbiAqIEBuYW1lc3BhY2VcbiAqL1xudmVjMzogdmVjM2QsIFxuLyoqXG4gKiBWZWMzIGZ1bmN0aW9ucyB0aGF0IGRlZmF1bHQgdG8gcmV0dXJuaW5nIGBGbG9hdDY0QXJyYXlgXG4gKiBAbmFtZXNwYWNlXG4gKi9cbnZlYzQ6IHZlYzRkLCB9ID0gd2dwdU1hdHJpeEFQSShGbG9hdDY0QXJyYXksIEZsb2F0NjRBcnJheSwgRmxvYXQ2NEFycmF5LCBGbG9hdDY0QXJyYXksIEZsb2F0NjRBcnJheSwgRmxvYXQ2NEFycmF5KTtcbmNvbnN0IHsgXG4vKipcbiAqIDN4MyBNYXRyaXggZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYG51bWJlcltdYFxuICogQG5hbWVzcGFjZVxuICovXG5tYXQzOiBtYXQzbiwgXG4vKipcbiAqIDR4NCBNYXRyaXggZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYG51bWJlcltdYFxuICogQG5hbWVzcGFjZVxuICovXG5tYXQ0OiBtYXQ0biwgXG4vKipcbiAqIFF1YXRlcm5pb24gZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYG51bWJlcltdYFxuICogQG5hbWVzcGFjZVxuICovXG5xdWF0OiBxdWF0biwgXG4vKipcbiAqIFZlYzIgZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYG51bWJlcltdYFxuICogQG5hbWVzcGFjZVxuICovXG52ZWMyOiB2ZWMybiwgXG4vKipcbiAqIFZlYzMgZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYG51bWJlcltdYFxuICogQG5hbWVzcGFjZVxuICovXG52ZWMzOiB2ZWMzbiwgXG4vKipcbiAqIFZlYzMgZnVuY3Rpb25zIHRoYXQgZGVmYXVsdCB0byByZXR1cm5pbmcgYG51bWJlcltdYFxuICogQG5hbWVzcGFjZVxuICovXG52ZWM0OiB2ZWM0biwgfSA9IHdncHVNYXRyaXhBUEkoWmVyb0FycmF5LCBBcnJheSwgQXJyYXksIEFycmF5LCBBcnJheSwgQXJyYXkpO1xuXG5leHBvcnQgeyBtYXQzLCBtYXQzZCwgbWF0M24sIG1hdDQsIG1hdDRkLCBtYXQ0biwgcXVhdCwgcXVhdGQsIHF1YXRuLCB1dGlscywgdmVjMiwgdmVjMmQsIHZlYzJuLCB2ZWMzLCB2ZWMzZCwgdmVjM24sIHZlYzQsIHZlYzRkLCB2ZWM0biB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2dwdS1tYXRyaXgubW9kdWxlLmpzLm1hcFxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9