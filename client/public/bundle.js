/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
    function RenderPass(device, pheromoneTexture) {
        var shaderCode = "\n@group(0) @binding(0) var textureIn: texture_2d<f32>;\n@group(0) @binding(1) var samplerIn: sampler;\n\nstruct VertexOut {\n    @builtin(position) position : vec4f,\n    @location(0) uv : vec2f,\n}\n\n@vertex\nfn vertex_main(@builtin(vertex_index) VertexIndex: u32) -> VertexOut\n{\n    var vertices = array<vec2f, 6>(\n    vec2(-1, -1),\n    vec2(1, -1),\n    vec2(-1, 1),\n    vec2(1, 1),\n    vec2(1, -1),\n    vec2(-1, 1),\n    );\n    var uvs = array<vec2f, 6> (\n    vec2(0, 0),\n    vec2(1, 0),\n    vec2(0, 1),\n    vec2(1, 1),\n    vec2(1, 0),\n    vec2(0, 1),\n    );\n    var output : VertexOut;\n    output.position = vec4(vertices[VertexIndex], 0, 1);\n    output.uv = uvs[VertexIndex];\n    \n    return output;\n}\n\n@fragment\nfn fragment_main(fragData: VertexOut) -> @location(0) vec4f\n{\n    return vec4(textureSample(textureIn, samplerIn, fragData.uv).xyz, 1);\n}";
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
                        format: pheromoneTexture.format,
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
        this.bindGroup = device.createBindGroup({
            label: "Render Bind Group",
            layout: renderBindGroupLayout,
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
    }
    RenderPass.prototype.addPass = function (commandEncoder, targetView, timestampWrites) {
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
/* harmony export */   getAgentsArray: () => (/* binding */ getAgentsArray)
/* harmony export */ });
function getAgentsArray(parameters) {
    var agentsArray = new Array(4 * parameters.agentCount);
    for (var i = 0; i < parameters.agentCount; i += 4) {
        agentsArray[i] = 128;
        agentsArray[i + 1] = 256;
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
    function SimulationPass(device, simulationParameters, pheromoneTexture, agentsBuffer) {
        var shaderCode = "\n        // Hash function from H. Schechter & R. Bridson, goo.gl/RXiKaH\n        fn Hash(p: u32) -> u32\n        {\n            var s = p; \n            s ^= 2747636419u;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            return s;\n        }\n\n        fn Random(seed: u32) -> f32\n        {\n            return f32(Hash(seed)) / 4294967295.0; // 2^32-1\n        }\n\n        struct Uniforms {\n            time: u32\n        }\n\n        @group(0) @binding(0) var<uniform> uniforms: Uniforms;\n\n        @group(0) @binding(1) var textureOut: texture_storage_2d<".concat(pheromoneTexture.format, ", write>;\n        @group(0) @binding(2) var<storage, read_write> agents: array<vec4f, ").concat(simulationParameters.agentCount, ">;\n\n        @compute @workgroup_size(").concat(WORKGROUP_SIZE, ")\n        fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {\n        let index = global_id.x;\n        // Trim off the excess if agentCount % WORKGROUP_SIZE != 0\n        if (index >= ").concat(simulationParameters.agentCount, ") {\n            return;\n        }\n\n        var agent = agents[index];\n\n        agent.x += agent.z;\n        agent.y += agent.w;\n\n        if (agent.x >= ").concat(simulationParameters.width, " || agent.x < 0) {\n            agent.z = -agent.z;\n        }\n        if (agent.y >= ").concat(simulationParameters.height, " || agent.y < 0) {\n            agent.w = -agent.w;\n        }\n\n        let randomDirChange = ").concat(simulationParameters.turnJitter, " * vec2(Random(uniforms.time + u32(agent.x)) - .5, Random(uniforms.time + u32(agent.y)) - .5);\n        let velocity = normalize(agent.zw + randomDirChange);\n\n        agent.z = velocity.x;\n        agent.w = velocity.y;\n\n        let pixel = vec2<u32>(agent.xy);\n        textureStore(textureOut, pixel, vec4(1.));\n        agents[index] = agent;\n        }");
        this.device = device;
        this.pheromoneTexture = pheromoneTexture;
        this.agentsBuffer = agentsBuffer;
        this.workgroups = Math.ceil(simulationParameters.agentCount / WORKGROUP_SIZE);
        this.uniformBuffer = device.createBuffer({
            size: 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
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
                        format: pheromoneTexture.format,
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
            ]
        });
        this.bindGroup = device.createBindGroup({
            label: "Simulation Bind Group",
            layout: computeBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.uniformBuffer },
                },
                {
                    binding: 1,
                    resource: pheromoneTexture.createView(),
                },
                {
                    binding: 2,
                    resource: { buffer: agentsBuffer },
                }
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
    }
    SimulationPass.prototype.addPass = function (commandEncoder, timestampWrites) {
        var uniformData = new Uint32Array([new Date().getMilliseconds()]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData, 0, uniformData.length);
        var passDescriptor = {
            timestampWrites: timestampWrites
        };
        var simulatePass = commandEncoder.beginComputePass(passDescriptor);
        simulatePass.setPipeline(this.pipeline);
        simulatePass.setBindGroup(0, this.bindGroup);
        simulatePass.dispatchWorkgroups(this.workgroups);
        simulatePass.end();
    };
    return SimulationPass;
}());



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
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _renderPass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderPass */ "./src/renderPass.ts");
/* harmony import */ var _simulationConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./simulationConfig */ "./src/simulationConfig.ts");
/* harmony import */ var _simulationPass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./simulationPass */ "./src/simulationPass.ts");
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
function go() {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, adapter, hasTimestampQuery, device, perfDisplayContainer, perfDisplay, simulationDurationSum, renderDurationSum, timerSamples, sparePerfTimeBuffers, querySet, perfResolveBuffer, simulationPerfTimeStampWrites, renderPerfTimeStampWrites, context, presentationFormat, simulationParameters, pheromoneTexture, agentsBuffer, simulationPass, renderPass, frame;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvas = document.querySelector('canvas');
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
                    context = canvas.getContext('webgpu');
                    presentationFormat = navigator.gpu.getPreferredCanvasFormat();
                    context.configure({
                        device: device,
                        format: presentationFormat,
                        alphaMode: 'premultiplied'
                    });
                    simulationParameters = {
                        agentCount: 1000,
                        height: canvas.height,
                        width: canvas.width,
                        turnJitter: .5,
                    };
                    pheromoneTexture = device.createTexture({
                        size: [canvas.width, canvas.height],
                        format: 'rgba8unorm',
                        usage: GPUTextureUsage.TEXTURE_BINDING |
                            GPUTextureUsage.STORAGE_BINDING
                    });
                    agentsBuffer = device.createBuffer({
                        label: "agents",
                        size: 16 * simulationParameters.agentCount,
                        usage: GPUBufferUsage.STORAGE,
                        mappedAtCreation: true,
                    });
                    new Float32Array(agentsBuffer.getMappedRange()).set((0,_simulationConfig__WEBPACK_IMPORTED_MODULE_1__.getAgentsArray)(simulationParameters));
                    agentsBuffer.unmap();
                    simulationPass = new _simulationPass__WEBPACK_IMPORTED_MODULE_2__.SimulationPass(device, simulationParameters, pheromoneTexture, agentsBuffer);
                    renderPass = new _renderPass__WEBPACK_IMPORTED_MODULE_0__.RenderPass(device, pheromoneTexture);
                    frame = function () {
                        var commandEncoder = device.createCommandEncoder();
                        simulationPass.addPass(commandEncoder, simulationPerfTimeStampWrites);
                        var canvasTextureView = context.getCurrentTexture().createView();
                        renderPass.addPass(commandEncoder, canvasTextureView, renderPerfTimeStampWrites);
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
                        requestAnimationFrame(frame);
                    };
                    requestAnimationFrame(frame);
                    return [2 /*return*/];
            }
        });
    });
}
go();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixHQUFHLEdBQUcsQ0FBQztnQ0FDdEMsSUFBSSxZQUFZLElBQUkseUJBQXlCLEVBQUUsQ0FBQztvQ0FDNUMsSUFBTSx5QkFBeUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUN4QyxxQkFBcUIsR0FBRyxZQUFZLEdBQUcsSUFBSSxDQUM5QyxDQUFDO29DQUNGLElBQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDcEMsaUJBQWlCLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FDMUMsQ0FBQztvQ0FDRixXQUFXLENBQUMsV0FBVyxHQUFHLG1DQUNuQix5QkFBeUIsNENBQzVCLHFCQUFxQiw2Q0FDcEIsb0JBQW9CLENBQUMsTUFBTSxDQUFFLENBQUM7b0NBQ25DLHFCQUFxQixHQUFHLENBQUMsQ0FBQztvQ0FDMUIsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO29DQUN0QixZQUFZLEdBQUcsQ0FBQyxDQUFDO2dDQUVyQixDQUFDOzRCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUNQLENBQUM7d0JBQ0QscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2pDLENBQUMsQ0FBQztvQkFDRixxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Ozs7Q0FDaEM7QUFFRCxFQUFFLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9yZW5kZXJQYXNzLnRzIiwid2VicGFjazovLy8uL3NyYy9zaW11bGF0aW9uQ29uZmlnLnRzIiwid2VicGFjazovLy8uL3NyYy9zaW11bGF0aW9uUGFzcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIHtcclxuICAgIGJpbmRHcm91cDogR1BVQmluZEdyb3VwO1xyXG4gICAgcGlwZWxpbmU6IEdQVVJlbmRlclBpcGVsaW5lO1xyXG4gICAgc2FtcGxlcjogR1BVU2FtcGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2U6IEdQVURldmljZSwgcGhlcm9tb25lVGV4dHVyZTogR1BVVGV4dHVyZSkge1xyXG4gICAgICAgIGNvbnN0IHNoYWRlckNvZGUgPSBgXHJcbkBncm91cCgwKSBAYmluZGluZygwKSB2YXIgdGV4dHVyZUluOiB0ZXh0dXJlXzJkPGYzMj47XHJcbkBncm91cCgwKSBAYmluZGluZygxKSB2YXIgc2FtcGxlckluOiBzYW1wbGVyO1xyXG5cclxuc3RydWN0IFZlcnRleE91dCB7XHJcbiAgICBAYnVpbHRpbihwb3NpdGlvbikgcG9zaXRpb24gOiB2ZWM0ZixcclxuICAgIEBsb2NhdGlvbigwKSB1diA6IHZlYzJmLFxyXG59XHJcblxyXG5AdmVydGV4XHJcbmZuIHZlcnRleF9tYWluKEBidWlsdGluKHZlcnRleF9pbmRleCkgVmVydGV4SW5kZXg6IHUzMikgLT4gVmVydGV4T3V0XHJcbntcclxuICAgIHZhciB2ZXJ0aWNlcyA9IGFycmF5PHZlYzJmLCA2PihcclxuICAgIHZlYzIoLTEsIC0xKSxcclxuICAgIHZlYzIoMSwgLTEpLFxyXG4gICAgdmVjMigtMSwgMSksXHJcbiAgICB2ZWMyKDEsIDEpLFxyXG4gICAgdmVjMigxLCAtMSksXHJcbiAgICB2ZWMyKC0xLCAxKSxcclxuICAgICk7XHJcbiAgICB2YXIgdXZzID0gYXJyYXk8dmVjMmYsIDY+IChcclxuICAgIHZlYzIoMCwgMCksXHJcbiAgICB2ZWMyKDEsIDApLFxyXG4gICAgdmVjMigwLCAxKSxcclxuICAgIHZlYzIoMSwgMSksXHJcbiAgICB2ZWMyKDEsIDApLFxyXG4gICAgdmVjMigwLCAxKSxcclxuICAgICk7XHJcbiAgICB2YXIgb3V0cHV0IDogVmVydGV4T3V0O1xyXG4gICAgb3V0cHV0LnBvc2l0aW9uID0gdmVjNCh2ZXJ0aWNlc1tWZXJ0ZXhJbmRleF0sIDAsIDEpO1xyXG4gICAgb3V0cHV0LnV2ID0gdXZzW1ZlcnRleEluZGV4XTtcclxuICAgIFxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxufVxyXG5cclxuQGZyYWdtZW50XHJcbmZuIGZyYWdtZW50X21haW4oZnJhZ0RhdGE6IFZlcnRleE91dCkgLT4gQGxvY2F0aW9uKDApIHZlYzRmXHJcbntcclxuICAgIHJldHVybiB2ZWM0KHRleHR1cmVTYW1wbGUodGV4dHVyZUluLCBzYW1wbGVySW4sIGZyYWdEYXRhLnV2KS54eXosIDEpO1xyXG59YDtcclxuXHJcbiAgICAgICAgdGhpcy5zYW1wbGVyID0gZGV2aWNlLmNyZWF0ZVNhbXBsZXIoe1xyXG4gICAgICAgICAgICBtaW5GaWx0ZXI6IFwibGluZWFyXCIsXHJcbiAgICAgICAgICAgIG1hZ0ZpbHRlcjogXCJsaW5lYXJcIixcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCByZW5kZXJCaW5kR3JvdXBMYXlvdXQgPSBkZXZpY2UuY3JlYXRlQmluZEdyb3VwTGF5b3V0KHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiUmVuZGVyIEJpbmQgR3JvdXAgTGF5b3V0XCIsXHJcbiAgICAgICAgICAgIGVudHJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkZSQUdNRU5ULFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBwaGVyb21vbmVUZXh0dXJlLmZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBcInJlYWQtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuRlJBR01FTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgc2FtcGxlcjogdGhpcy5zYW1wbGVyLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W10sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyU2hhZGVyTW9kdWxlID0gZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7XHJcbiAgICAgICAgICAgIGNvZGU6IHNoYWRlckNvZGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVSZW5kZXJQaXBlbGluZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBQaXBlbGluZVwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IGRldmljZS5jcmVhdGVQaXBlbGluZUxheW91dCh7XHJcbiAgICAgICAgICAgICAgICBiaW5kR3JvdXBMYXlvdXRzOiBbcmVuZGVyQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHZlcnRleDoge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiByZW5kZXJTaGFkZXJNb2R1bGUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZyYWdtZW50OiB7XHJcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHJlbmRlclNoYWRlck1vZHVsZSxcclxuICAgICAgICAgICAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogbmF2aWdhdG9yLmdwdS5nZXRQcmVmZXJyZWRDYW52YXNGb3JtYXQoKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJpbWl0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICB0b3BvbG9neTogJ3RyaWFuZ2xlLWxpc3QnLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmluZEdyb3VwID0gZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBCaW5kIEdyb3VwXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogcmVuZGVyQmluZEdyb3VwTGF5b3V0LFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogcGhlcm9tb25lVGV4dHVyZS5jcmVhdGVWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHRoaXMuc2FtcGxlcixcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQYXNzKGNvbW1hbmRFbmNvZGVyOiBHUFVDb21tYW5kRW5jb2RlciwgdGFyZ2V0VmlldzogR1BVVGV4dHVyZVZpZXcsIHRpbWVzdGFtcFdyaXRlcz86IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCByZW5kZXJQYXNzRGVzY3JpcHRvcjogR1BVUmVuZGVyUGFzc0Rlc2NyaXB0b3IgPSB7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudHM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3OiB0YXJnZXRWaWV3LFxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVmFsdWU6IFswLCAwLCAwLCAxXSxcclxuICAgICAgICAgICAgICAgICAgICBsb2FkT3A6ICdjbGVhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVPcDogJ3N0b3JlJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0gYXMgR1BVUmVuZGVyUGFzc0NvbG9yQXR0YWNobWVudFtdLFxyXG4gICAgICAgICAgICB0aW1lc3RhbXBXcml0ZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBwYXNzRW5jb2RlciA9IGNvbW1hbmRFbmNvZGVyLmJlZ2luUmVuZGVyUGFzcyhyZW5kZXJQYXNzRGVzY3JpcHRvcik7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuc2V0UGlwZWxpbmUodGhpcy5waXBlbGluZSk7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuc2V0QmluZEdyb3VwKDAsIHRoaXMuYmluZEdyb3VwKTtcclxuICAgICAgICBwYXNzRW5jb2Rlci5kcmF3KDYpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLmVuZCgpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGludGVyZmFjZSBJU2ltdWxhdGlvblBhcmFtZXRlcnMge1xyXG4gICAgYWdlbnRDb3VudDogbnVtYmVyXHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICB0dXJuSml0dGVyOiBudW1iZXIsXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBZ2VudHNBcnJheShwYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnMpOiBudW1iZXJbXSB7XHJcbiAgICBjb25zdCBhZ2VudHNBcnJheSA9IG5ldyBBcnJheSg0ICogcGFyYW1ldGVycy5hZ2VudENvdW50KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1ldGVycy5hZ2VudENvdW50OyBpICs9IDQpIHtcclxuICAgICAgICBhZ2VudHNBcnJheVtpXSA9IDEyODtcclxuICAgICAgICBhZ2VudHNBcnJheVtpKzFdID0gMjU2O1xyXG4gICAgICAgIGFnZW50c0FycmF5W2krMl0gPSBNYXRoLnJhbmRvbSgpIC0gLjU7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaSszXSA9IE1hdGgucmFuZG9tKCkgLSAuNTtcclxuICAgIH1cclxuICAgIHJldHVybiBhZ2VudHNBcnJheTtcclxufSIsImltcG9ydCB7IElTaW11bGF0aW9uUGFyYW1ldGVycyB9IGZyb20gXCIuL3NpbXVsYXRpb25Db25maWdcIjtcclxuXHJcbmNvbnN0IFdPUktHUk9VUF9TSVpFID0gNjQ7XHJcblxyXG5leHBvcnQgY2xhc3MgU2ltdWxhdGlvblBhc3Mge1xyXG4gICAgZGV2aWNlOiBHUFVEZXZpY2U7XHJcbiAgICBwaGVyb21vbmVUZXh0dXJlOiBHUFVUZXh0dXJlO1xyXG4gICAgYWdlbnRzQnVmZmVyOiBHUFVCdWZmZXI7XHJcblxyXG4gICAgd29ya2dyb3VwczogbnVtYmVyO1xyXG4gICAgYmluZEdyb3VwOiBHUFVCaW5kR3JvdXA7XHJcbiAgICB1bmlmb3JtQnVmZmVyOiBHUFVCdWZmZXI7XHJcbiAgICBwaXBlbGluZTogR1BVQ29tcHV0ZVBpcGVsaW5lO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRldmljZTogR1BVRGV2aWNlLCBzaW11bGF0aW9uUGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzLCBwaGVyb21vbmVUZXh0dXJlOiBHUFVUZXh0dXJlLCBhZ2VudHNCdWZmZXI6IEdQVUJ1ZmZlcikge1xyXG4gICAgICAgIGNvbnN0IHNoYWRlckNvZGUgPSBgXHJcbiAgICAgICAgLy8gSGFzaCBmdW5jdGlvbiBmcm9tIEguIFNjaGVjaHRlciAmIFIuIEJyaWRzb24sIGdvby5nbC9SWGlLYUhcclxuICAgICAgICBmbiBIYXNoKHA6IHUzMikgLT4gdTMyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcyA9IHA7IFxyXG4gICAgICAgICAgICBzIF49IDI3NDc2MzY0MTl1O1xyXG4gICAgICAgICAgICBzICo9IDI2NTQ0MzU3Njl1O1xyXG4gICAgICAgICAgICBzIF49IHMgPj4gMTY7XHJcbiAgICAgICAgICAgIHMgKj0gMjY1NDQzNTc2OXU7XHJcbiAgICAgICAgICAgIHMgXj0gcyA+PiAxNjtcclxuICAgICAgICAgICAgcyAqPSAyNjU0NDM1NzY5dTtcclxuICAgICAgICAgICAgcmV0dXJuIHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmbiBSYW5kb20oc2VlZDogdTMyKSAtPiBmMzJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBmMzIoSGFzaChzZWVkKSkgLyA0Mjk0OTY3Mjk1LjA7IC8vIDJeMzItMVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RydWN0IFVuaWZvcm1zIHtcclxuICAgICAgICAgICAgdGltZTogdTMyXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMCkgdmFyPHVuaWZvcm0+IHVuaWZvcm1zOiBVbmlmb3JtcztcclxuXHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDEpIHZhciB0ZXh0dXJlT3V0OiB0ZXh0dXJlX3N0b3JhZ2VfMmQ8JHtwaGVyb21vbmVUZXh0dXJlLmZvcm1hdH0sIHdyaXRlPjtcclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMikgdmFyPHN0b3JhZ2UsIHJlYWRfd3JpdGU+IGFnZW50czogYXJyYXk8dmVjNGYsICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuYWdlbnRDb3VudH0+O1xyXG5cclxuICAgICAgICBAY29tcHV0ZSBAd29ya2dyb3VwX3NpemUoJHtXT1JLR1JPVVBfU0laRX0pXHJcbiAgICAgICAgZm4gc2ltdWxhdGUoQGJ1aWx0aW4oZ2xvYmFsX2ludm9jYXRpb25faWQpIGdsb2JhbF9pZDogdmVjMzx1MzI+KSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gZ2xvYmFsX2lkLng7XHJcbiAgICAgICAgLy8gVHJpbSBvZmYgdGhlIGV4Y2VzcyBpZiBhZ2VudENvdW50ICUgV09SS0dST1VQX1NJWkUgIT0gMFxyXG4gICAgICAgIGlmIChpbmRleCA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnR9KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhZ2VudCA9IGFnZW50c1tpbmRleF07XHJcblxyXG4gICAgICAgIGFnZW50LnggKz0gYWdlbnQuejtcclxuICAgICAgICBhZ2VudC55ICs9IGFnZW50Lnc7XHJcblxyXG4gICAgICAgIGlmIChhZ2VudC54ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGh9IHx8IGFnZW50LnggPCAwKSB7XHJcbiAgICAgICAgICAgIGFnZW50LnogPSAtYWdlbnQuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFnZW50LnkgPj0gJHtzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHR9IHx8IGFnZW50LnkgPCAwKSB7XHJcbiAgICAgICAgICAgIGFnZW50LncgPSAtYWdlbnQudztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYW5kb21EaXJDaGFuZ2UgPSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLnR1cm5KaXR0ZXJ9ICogdmVjMihSYW5kb20odW5pZm9ybXMudGltZSArIHUzMihhZ2VudC54KSkgLSAuNSwgUmFuZG9tKHVuaWZvcm1zLnRpbWUgKyB1MzIoYWdlbnQueSkpIC0gLjUpO1xyXG4gICAgICAgIGxldCB2ZWxvY2l0eSA9IG5vcm1hbGl6ZShhZ2VudC56dyArIHJhbmRvbURpckNoYW5nZSk7XHJcblxyXG4gICAgICAgIGFnZW50LnogPSB2ZWxvY2l0eS54O1xyXG4gICAgICAgIGFnZW50LncgPSB2ZWxvY2l0eS55O1xyXG5cclxuICAgICAgICBsZXQgcGl4ZWwgPSB2ZWMyPHUzMj4oYWdlbnQueHkpO1xyXG4gICAgICAgIHRleHR1cmVTdG9yZSh0ZXh0dXJlT3V0LCBwaXhlbCwgdmVjNCgxLikpO1xyXG4gICAgICAgIGFnZW50c1tpbmRleF0gPSBhZ2VudDtcclxuICAgICAgICB9YDtcclxuXHJcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICAgICAgdGhpcy5waGVyb21vbmVUZXh0dXJlID0gcGhlcm9tb25lVGV4dHVyZTtcclxuICAgICAgICB0aGlzLmFnZW50c0J1ZmZlciA9IGFnZW50c0J1ZmZlcjtcclxuICAgICAgICB0aGlzLndvcmtncm91cHMgPSBNYXRoLmNlaWwoc2ltdWxhdGlvblBhcmFtZXRlcnMuYWdlbnRDb3VudCAvIFdPUktHUk9VUF9TSVpFKTtcclxuXHJcbiAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcih7XHJcbiAgICAgICAgICAgIHNpemU6IDQsXHJcbiAgICAgICAgICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZS5VTklGT1JNIHwgR1BVQnVmZmVyVXNhZ2UuQ09QWV9EU1RcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgY29tcHV0ZUJpbmRHcm91cExheW91dCA9IGRldmljZS5jcmVhdGVCaW5kR3JvdXBMYXlvdXQoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIEJpbmQgR3JvdXAgTGF5b3V0XCIsXHJcbiAgICAgICAgICAgIGVudHJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidW5pZm9ybVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMSxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JhZ2VUZXh0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogcGhlcm9tb25lVGV4dHVyZS5mb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJ3cml0ZS1vbmx5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMixcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdG9yYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0gYXMgR1BVQmluZEdyb3VwTGF5b3V0RW50cnlbXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IGRldmljZS5jcmVhdGVCaW5kR3JvdXAoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIEJpbmQgR3JvdXBcIixcclxuICAgICAgICAgICAgbGF5b3V0OiBjb21wdXRlQmluZEdyb3VwTGF5b3V0LFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogeyBidWZmZXI6IHRoaXMudW5pZm9ybUJ1ZmZlciB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiBwaGVyb21vbmVUZXh0dXJlLmNyZWF0ZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMixcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTp7IGJ1ZmZlcjogYWdlbnRzQnVmZmVyIH0sIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVDb21wdXRlUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIFBpcGVsaW5lXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogZGV2aWNlLmNyZWF0ZVBpcGVsaW5lTGF5b3V0KHtcclxuICAgICAgICAgICAgICAgIGJpbmRHcm91cExheW91dHM6IFtjb21wdXRlQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNvbXB1dGU6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7Y29kZTogc2hhZGVyQ29kZX0pLFxyXG4gICAgICAgICAgICAgICAgZW50cnlQb2ludDogJ3NpbXVsYXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFzcyhjb21tYW5kRW5jb2RlcjogR1BVQ29tbWFuZEVuY29kZXIsIHRpbWVzdGFtcFdyaXRlcz86IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB1bmlmb3JtRGF0YSA9IG5ldyBVaW50MzJBcnJheShbbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKV0pO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtRGF0YSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdW5pZm9ybURhdGEubGVuZ3RoLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXBXcml0ZXNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNpbXVsYXRlUGFzcyA9IGNvbW1hbmRFbmNvZGVyLmJlZ2luQ29tcHV0ZVBhc3MocGFzc0Rlc2NyaXB0b3IpO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5zZXRQaXBlbGluZSh0aGlzLnBpcGVsaW5lKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3Muc2V0QmluZEdyb3VwKDAsIHRoaXMuYmluZEdyb3VwKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3MuZGlzcGF0Y2hXb3JrZ3JvdXBzKHRoaXMud29ya2dyb3Vwcyk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmVuZCgpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBSZW5kZXJQYXNzIH0gZnJvbSBcIi4vcmVuZGVyUGFzc1wiO1xyXG5pbXBvcnQgeyBnZXRBZ2VudHNBcnJheSwgSVNpbXVsYXRpb25QYXJhbWV0ZXJzIH0gZnJvbSBcIi4vc2ltdWxhdGlvbkNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBTaW11bGF0aW9uUGFzcyB9IGZyb20gXCIuL3NpbXVsYXRpb25QYXNzXCI7XHJcblxyXG5jb25zdCBOVU1CRVJfT0ZfUEFTU0VTID0gMjtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdvKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb25zdCBhZGFwdGVyID0gYXdhaXQgbmF2aWdhdG9yLmdwdS5yZXF1ZXN0QWRhcHRlcigpO1xyXG4gICAgY29uc3QgaGFzVGltZXN0YW1wUXVlcnkgPSBhZGFwdGVyLmZlYXR1cmVzLmhhcyhcInRpbWVzdGFtcC1xdWVyeVwiKTtcclxuICAgIGNvbnN0IGRldmljZSA9IGF3YWl0IGFkYXB0ZXIucmVxdWVzdERldmljZSh7XHJcbiAgICAgICAgcmVxdWlyZWRGZWF0dXJlczogaGFzVGltZXN0YW1wUXVlcnkgPyBbXCJ0aW1lc3RhbXAtcXVlcnlcIl0gYXMgR1BVRmVhdHVyZU5hbWVbXTogW10sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBQZXJmb3JtYW5jZSBTdGF0aXN0aWNzIERvY3VtZW50IFNldHVwXHJcbiAgICBjb25zdCBwZXJmRGlzcGxheUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUuYmFja2Ryb3BGaWx0ZXIgPSAnYmx1cigxMHB4KSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5ib3R0b20gPSAnMTBweCc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gJzEwcHgnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUudGV4dEFsaWduID0gJ2xlZnQnO1xyXG4gICAgY29uc3QgcGVyZkRpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKTtcclxuICAgIHBlcmZEaXNwbGF5LnN0eWxlLm1hcmdpbiA9ICcuNWVtJztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLmFwcGVuZENoaWxkKHBlcmZEaXNwbGF5KTtcclxuICAgIGNhbnZhcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHBlcmZEaXNwbGF5Q29udGFpbmVyKTtcclxuICAgIGxldCBzaW11bGF0aW9uRHVyYXRpb25TdW0gPSAwO1xyXG4gICAgbGV0IHJlbmRlckR1cmF0aW9uU3VtID0gMDtcclxuICAgIGxldCB0aW1lclNhbXBsZXMgPSAwO1xyXG5cclxuICAgIGNvbnN0IHNwYXJlUGVyZlRpbWVCdWZmZXJzOiBHUFVCdWZmZXJbXSA9IFtdO1xyXG4gICAgbGV0IHF1ZXJ5U2V0OiBHUFVRdWVyeVNldCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIGxldCBwZXJmUmVzb2x2ZUJ1ZmZlcjogR1BVQnVmZmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgbGV0IHNpbXVsYXRpb25QZXJmVGltZVN0YW1wV3JpdGVzOiBHUFVDb21wdXRlUGFzc1RpbWVzdGFtcFdyaXRlcyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIGxldCByZW5kZXJQZXJmVGltZVN0YW1wV3JpdGVzOiBHUFVSZW5kZXJQYXNzVGltZXN0YW1wV3JpdGVzIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgaWYgKGhhc1RpbWVzdGFtcFF1ZXJ5KSB7XHJcbiAgICAgICAgcGVyZkRpc3BsYXkudGV4dENvbnRlbnQgPSBgXFxcclxuYXZnIHNpbXVsYXRpb24gZHVyYXRpb246IOKAlCDCtXNcclxuYXZnIHJlbmRlciBkdXJhdGlvbjogIOKAlCDCtXNcclxuc3BhcmUgcGVyZiBidWZmZXJzOiAgICDigJRgO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBxdWVyeVNldCA9IGRldmljZS5jcmVhdGVRdWVyeVNldCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwidGltZXN0YW1wXCIsXHJcbiAgICAgICAgICAgIGNvdW50OiAyICogTlVNQkVSX09GX1BBU1NFUyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBwZXJmUmVzb2x2ZUJ1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJwZXJmUmVzb2x2ZVwiLFxyXG4gICAgICAgICAgICBzaXplOiA0ICogQmlnSW50NjRBcnJheS5CWVRFU19QRVJfRUxFTUVOVCAqIE5VTUJFUl9PRl9QQVNTRVMsXHJcbiAgICAgICAgICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZS5RVUVSWV9SRVNPTFZFIHwgR1BVQnVmZmVyVXNhZ2UuQ09QWV9TUkMsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2ltdWxhdGlvblBlcmZUaW1lU3RhbXBXcml0ZXMgPSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5U2V0LFxyXG4gICAgICAgICAgICBiZWdpbm5pbmdPZlBhc3NXcml0ZUluZGV4OiAwLFxyXG4gICAgICAgICAgICBlbmRPZlBhc3NXcml0ZUluZGV4OiAxLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJlbmRlclBlcmZUaW1lU3RhbXBXcml0ZXMgPSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5U2V0LFxyXG4gICAgICAgICAgICBiZWdpbm5pbmdPZlBhc3NXcml0ZUluZGV4OiAyLFxyXG4gICAgICAgICAgICBlbmRPZlBhc3NXcml0ZUluZGV4OiAzLFxyXG4gICAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdwdScpIGFzIHVua25vd24gYXMgR1BVQ2FudmFzQ29udGV4dDtcclxuICAgIGNvbnN0IHByZXNlbnRhdGlvbkZvcm1hdCA9IG5hdmlnYXRvci5ncHUuZ2V0UHJlZmVycmVkQ2FudmFzRm9ybWF0KCk7XHJcbiAgICBjb250ZXh0LmNvbmZpZ3VyZSh7XHJcbiAgICAgICAgZGV2aWNlLFxyXG4gICAgICAgIGZvcm1hdDogcHJlc2VudGF0aW9uRm9ybWF0LFxyXG4gICAgICAgIGFscGhhTW9kZTogJ3ByZW11bHRpcGxpZWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBzaW11bGF0aW9uUGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzID0ge1xyXG4gICAgICAgIGFnZW50Q291bnQ6IDFfMDAwLFxyXG4gICAgICAgIGhlaWdodDogY2FudmFzLmhlaWdodCxcclxuICAgICAgICB3aWR0aDogY2FudmFzLndpZHRoLFxyXG4gICAgICAgIHR1cm5KaXR0ZXI6IC41LFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBoZXJvbW9uZVRleHR1cmUgPSBkZXZpY2UuY3JlYXRlVGV4dHVyZSh7XHJcbiAgICAgICAgc2l6ZTogW2NhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodF0sXHJcbiAgICAgICAgZm9ybWF0OiAgJ3JnYmE4dW5vcm0nLFxyXG4gICAgICAgIHVzYWdlOiBcclxuICAgICAgICAgICAgR1BVVGV4dHVyZVVzYWdlLlRFWFRVUkVfQklORElORyB8XHJcbiAgICAgICAgICAgIEdQVVRleHR1cmVVc2FnZS5TVE9SQUdFX0JJTkRJTkdcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGFnZW50c0J1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgIGxhYmVsOiBcImFnZW50c1wiLFxyXG4gICAgICAgIHNpemU6IDE2ICogc2ltdWxhdGlvblBhcmFtZXRlcnMuYWdlbnRDb3VudCxcclxuICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuU1RPUkFHRSxcclxuICAgICAgICBtYXBwZWRBdENyZWF0aW9uOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICBuZXcgRmxvYXQzMkFycmF5KGFnZW50c0J1ZmZlci5nZXRNYXBwZWRSYW5nZSgpKS5zZXQoZ2V0QWdlbnRzQXJyYXkoc2ltdWxhdGlvblBhcmFtZXRlcnMpKTtcclxuICAgIGFnZW50c0J1ZmZlci51bm1hcCgpO1xyXG5cclxuICAgIGNvbnN0IHNpbXVsYXRpb25QYXNzID0gbmV3IFNpbXVsYXRpb25QYXNzKGRldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnMsIHBoZXJvbW9uZVRleHR1cmUsIGFnZW50c0J1ZmZlcik7XHJcblxyXG4gICAgY29uc3QgcmVuZGVyUGFzcyA9IG5ldyBSZW5kZXJQYXNzKGRldmljZSwgcGhlcm9tb25lVGV4dHVyZSk7XHJcblxyXG4gICAgY29uc3QgZnJhbWUgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZEVuY29kZXIgPSBkZXZpY2UuY3JlYXRlQ29tbWFuZEVuY29kZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICBzaW11bGF0aW9uUGFzcy5hZGRQYXNzKGNvbW1hbmRFbmNvZGVyLCBzaW11bGF0aW9uUGVyZlRpbWVTdGFtcFdyaXRlcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbnZhc1RleHR1cmVWaWV3ID0gY29udGV4dC5nZXRDdXJyZW50VGV4dHVyZSgpLmNyZWF0ZVZpZXcoKTtcclxuICAgICAgICByZW5kZXJQYXNzLmFkZFBhc3MoY29tbWFuZEVuY29kZXIsIGNhbnZhc1RleHR1cmVWaWV3LCByZW5kZXJQZXJmVGltZVN0YW1wV3JpdGVzKTtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdEJ1ZmZlcjogR1BVQnVmZmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmIChoYXNUaW1lc3RhbXBRdWVyeSkge1xyXG4gICAgICAgICAgICByZXN1bHRCdWZmZXIgPSBzcGFyZVBlcmZUaW1lQnVmZmVycy5wb3AoKSB8fCBcclxuICAgICAgICAgICAgICAgIGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IDQgKiBCaWdJbnQ2NEFycmF5LkJZVEVTX1BFUl9FTEVNRU5UICogTlVNQkVSX09GX1BBU1NFUyxcclxuICAgICAgICAgICAgICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuQ09QWV9EU1QgfCBHUFVCdWZmZXJVc2FnZS5NQVBfUkVBRCxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb21tYW5kRW5jb2Rlci5yZXNvbHZlUXVlcnlTZXQocXVlcnlTZXQsIDAsIDIgKiBOVU1CRVJfT0ZfUEFTU0VTLCBwZXJmUmVzb2x2ZUJ1ZmZlciwgMCk7XHJcbiAgICAgICAgICAgIGNvbW1hbmRFbmNvZGVyLmNvcHlCdWZmZXJUb0J1ZmZlcihcclxuICAgICAgICAgICAgICAgIHBlcmZSZXNvbHZlQnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIHJlc3VsdEJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRCdWZmZXIuc2l6ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGV2aWNlLnF1ZXVlLnN1Ym1pdChbY29tbWFuZEVuY29kZXIuZmluaXNoKCldKTtcclxuXHJcbiAgICAgICAgaWYgKGhhc1RpbWVzdGFtcFF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdEJ1ZmZlci5tYXBBc3luYyhHUFVNYXBNb2RlLlJFQUQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZXMgPSBuZXcgQmlnSW50NjRBcnJheShyZXN1bHRCdWZmZXIuZ2V0TWFwcGVkUmFuZ2UoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaW11bGF0aW9uRHVyYXRpb24gPSBOdW1iZXIodGltZXNbMV0gLSB0aW1lc1swXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJEdXJhdGlvbiA9IE51bWJlcih0aW1lc1szXSAtIHRpbWVzWzJdKTtcclxuICAgICAgICAgICAgICAgIGlmIChzaW11bGF0aW9uRHVyYXRpb24gPiAwICYmIHJlbmRlckR1cmF0aW9uID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbXVsYXRpb25EdXJhdGlvblN1bSArPSBzaW11bGF0aW9uRHVyYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRHVyYXRpb25TdW0gKz0gcmVuZGVyRHVyYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXJTYW1wbGVzKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHRCdWZmZXIudW5tYXAoKTtcclxuICAgICAgICAgICAgICAgIHNwYXJlUGVyZlRpbWVCdWZmZXJzLnB1c2gocmVzdWx0QnVmZmVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBrTnVtVGltZXJTYW1wbGVzUGVyVXBkYXRlID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRpbWVyU2FtcGxlcyA+PSBrTnVtVGltZXJTYW1wbGVzUGVyVXBkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXZnU2ltdWxhdGlvbk1pY3Jvc2Vjb25kcyA9IE1hdGgucm91bmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbXVsYXRpb25EdXJhdGlvblN1bSAvIHRpbWVyU2FtcGxlcyAvIDEwMDBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF2Z1JlbmRlck1pY3Jvc2Vjb25kcyA9IE1hdGgucm91bmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckR1cmF0aW9uU3VtIC8gdGltZXJTYW1wbGVzIC8gMTAwMFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyZkRpc3BsYXkudGV4dENvbnRlbnQgPSBgXFxcclxuYXZnIHNpbXVsYXRpb24gZHVyYXRpb246ICR7YXZnU2ltdWxhdGlvbk1pY3Jvc2Vjb25kc33CtXNcclxuYXZnIHJlbmRlciBkdXJhdGlvbjogICR7YXZnUmVuZGVyTWljcm9zZWNvbmRzfcK1c1xyXG5zcGFyZSBwZXJmIGJ1ZmZlcnM6ICAgICR7c3BhcmVQZXJmVGltZUJ1ZmZlcnMubGVuZ3RofWA7XHJcbiAgICAgICAgICAgICAgICAgICAgc2ltdWxhdGlvbkR1cmF0aW9uU3VtID0gMDtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXJEdXJhdGlvblN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXJTYW1wbGVzID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xyXG4gICAgfTtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZSk7XHJcbn1cclxuXHJcbmdvKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9