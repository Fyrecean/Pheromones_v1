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
/* harmony export */   getAgentsArray: () => (/* binding */ getAgentsArray)
/* harmony export */ });
function getAgentsArray(parameters) {
    var agentsArray = new Array(4 * parameters.agentCount);
    for (var i = 0; i < parameters.agentCount * 4; i += 4) {
        agentsArray[i] = parameters.height / 2;
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
        var shaderCode = "\n        // Hash function from H. Schechter & R. Bridson, goo.gl/RXiKaH\n        fn Hash(p: u32) -> u32\n        {\n            var s = p; \n            s ^= 2747636419u;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            return s;\n        }\n\n        fn Random(seed: u32) -> f32\n        {\n            return f32(Hash(seed)) / 4294967295.0; // 2^32-1\n        }\n\n        struct Uniforms {\n            time: u32\n        }\n\n        @group(0) @binding(0) var<uniform> uniforms: Uniforms;\n\n        @group(0) @binding(1) var textureOut: texture_storage_2d<".concat(textureFormat, ", write>;\n        @group(0) @binding(2) var<storage, read_write> agents: array<vec4f, ").concat(simulationParameters.agentCount, ">;\n\n        @compute @workgroup_size(").concat(WORKGROUP_SIZE, ")\n        fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {\n        let index = global_id.x;\n        // Trim off the excess if agentCount % WORKGROUP_SIZE != 0\n        if (index >= ").concat(simulationParameters.agentCount, ") {\n            return;\n        }\n\n        var agent = agents[index];\n\n        agent.x += agent.z;\n        agent.y += agent.w;\n\n        if (agent.x >= ").concat(simulationParameters.width, " || agent.x < 0) {\n            agent.z = -agent.z;\n        }\n        if (agent.y >= ").concat(simulationParameters.height, " || agent.y < 0) {\n            agent.w = -agent.w;\n        }\n\n        let randomDirChange = ").concat(simulationParameters.turnJitter, " * vec2(Random(uniforms.time + u32(agent.x)) - .5, Random(uniforms.time + u32(agent.y)) - .5);\n        let velocity = normalize(agent.zw + randomDirChange);\n\n        agent.z = velocity.x;\n        agent.w = velocity.y;\n\n        let pixel = vec2<u32>(agent.xy);\n        textureStore(textureOut, pixel, vec4(1.));\n        agents[index] = agent;\n        }");
        this.device = device;
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
    SimulationPass.prototype.addPass = function (commandEncoder, pheromoneTexture, timestampWrites) {
        var uniformData = new Uint32Array([window.performance.now() * 10]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData, 0, uniformData.length);
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
                    resource: pheromoneTexture.createView(),
                },
                {
                    binding: 2,
                    resource: { buffer: this.agentsBuffer },
                }
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
var WORKGROUP_SIZE = 64;
var TexturePass = /** @class */ (function () {
    function TexturePass(device, simulationParameters, pheromoneTextureFormat) {
        // TODO - Remove Uniform?
        var shaderCode = "\n        struct Uniforms {\n            color: vec4<f32>\n        }\n        @group(0) @binding(0) var<uniform> uniforms: Uniforms;\n\n        @group(0) @binding(1) var textureIn: texture_storage_2d<".concat(pheromoneTextureFormat, ", read>;\n        @group(0) @binding(2) var textureOut: texture_storage_2d<").concat(pheromoneTextureFormat, ", write>;\n\n        @compute @workgroup_size(8, 8)\n        fn attenuate(@builtin(global_invocation_id) global_id: vec3<u32>) {\n            if (global_id.x >= ").concat(simulationParameters.width, " || global_id.y >= ").concat(simulationParameters.height, ") {\n                return;\n            }\n            \n            let pixel = global_id.xy;\n\n            // Define Gaussian kernel (3x3)\n            let ortho = .09;\n            let diag = .01;\n            let kernel: array<array<f32, 3>, 3> = array<array<f32, 3>, 3>(\n                array<f32, 3>(diag, ortho, diag),\n                array<f32, 3>(ortho,  .6,  ortho),\n                array<f32, 3>(diag, ortho, diag)\n            );\n\n            var colorSum = 0.0;\n\n            // Loop through neighboring pixels (3x3 kernel)\n            for (var i: i32 = -1; i <= 1; i = i + 1) {\n                for (var j: i32 = -1; j <= 1; j = j + 1) {\n                    let samplePixel= vec2(i32(global_id.x) + i, i32(global_id.y) + j);\n\n                    // Ensure we don't sample out of bounds\n                    if (samplePixel.x < ").concat(simulationParameters.width, " && samplePixel.y < ").concat(simulationParameters.height, ") {\n                        let sampleColor = textureLoad(textureIn, samplePixel).x; // Load neighboring pixel color\n                        colorSum += sampleColor * kernel[i + 1][j + 1]; // Apply Gaussian kernel\n                    }\n                }\n            }\n\n            colorSum = max(0., colorSum - .002);\n\n            textureStore(textureOut, pixel, vec4(vec3(colorSum), 1.0)); // Store blurred color\n        }\n\n            ");
        this.device = device;
        this.workgroups = [Math.ceil(simulationParameters.width / 8), Math.ceil(simulationParameters.height / 8)];
        this.uniformBuffer = device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        // Color
        var uniformData = new Uint32Array([
            0.,
            1.,
            1.,
            1.,
        ]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData, 0, uniformData.length);
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
function go() {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, adapter, hasTimestampQuery, device, perfDisplayContainer, perfDisplay, simulationDurationSum, renderDurationSum, timerSamples, sparePerfTimeBuffers, querySet, perfResolveBuffer, simulationPerfTimeStampWrites, renderPerfTimeStampWrites, context, presentationFormat, simulationParameters, pheromoneTextures, agentsBuffer, texturePass, simulationPass, renderPass, pheromoneIndex, frame;
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
                        size: 16 * simulationParameters.agentCount,
                        usage: GPUBufferUsage.STORAGE,
                        mappedAtCreation: true,
                    });
                    new Float32Array(agentsBuffer.getMappedRange()).set((0,_simulationConfig__WEBPACK_IMPORTED_MODULE_1__.getAgentsArray)(simulationParameters));
                    agentsBuffer.unmap();
                    texturePass = new _textureComputePass__WEBPACK_IMPORTED_MODULE_3__.TexturePass(device, simulationParameters, pheromoneTextures[0].format);
                    simulationPass = new _simulationPass__WEBPACK_IMPORTED_MODULE_2__.SimulationPass(device, simulationParameters, pheromoneTextures[0].format, agentsBuffer);
                    renderPass = new _renderPass__WEBPACK_IMPORTED_MODULE_0__.RenderPass(device, pheromoneTextures[0].format);
                    pheromoneIndex = 0;
                    frame = function () {
                        var commandEncoder = device.createCommandEncoder();
                        texturePass.addPass(commandEncoder, pheromoneTextures[(pheromoneIndex + 1) % 2], pheromoneTextures[pheromoneIndex]);
                        simulationPass.addPass(commandEncoder, pheromoneTextures[pheromoneIndex], simulationPerfTimeStampWrites);
                        var canvasTextureView = context.getCurrentTexture().createView();
                        renderPass.addPass(commandEncoder, pheromoneTextures[pheromoneIndex], canvasTextureView, renderPerfTimeStampWrites);
                        pheromoneIndex = (pheromoneIndex + 1) % 2;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDO3dCQUNELHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNqQyxDQUFDLENBQUM7b0JBQ0YscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7O0NBQ2hDO0FBRUQsRUFBRSxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcmVuZGVyUGFzcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvbkNvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvblBhc3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RleHR1cmVDb21wdXRlUGFzcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIHtcclxuICAgIGRldmljZTogR1BVRGV2aWNlO1xyXG4gICAgYmluZEdyb3VwOiBHUFVCaW5kR3JvdXA7XHJcbiAgICBwaXBlbGluZTogR1BVUmVuZGVyUGlwZWxpbmU7XHJcbiAgICBzYW1wbGVyOiBHUFVTYW1wbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRldmljZTogR1BVRGV2aWNlLCB0ZXh0dXJlRm9ybWF0OiBHUFVUZXh0dXJlRm9ybWF0KSB7XHJcbiAgICAgICAgY29uc3Qgc2hhZGVyQ29kZSA9IGBcclxuQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhciB0ZXh0dXJlSW46IHRleHR1cmVfMmQ8ZjMyPjtcclxuQGdyb3VwKDApIEBiaW5kaW5nKDEpIHZhciBzYW1wbGVySW46IHNhbXBsZXI7XHJcblxyXG5zdHJ1Y3QgVmVydGV4T3V0IHtcclxuICAgIEBidWlsdGluKHBvc2l0aW9uKSBwb3NpdGlvbiA6IHZlYzRmLFxyXG4gICAgQGxvY2F0aW9uKDApIHV2IDogdmVjMmYsXHJcbn1cclxuXHJcbkB2ZXJ0ZXhcclxuZm4gdmVydGV4X21haW4oQGJ1aWx0aW4odmVydGV4X2luZGV4KSBWZXJ0ZXhJbmRleDogdTMyKSAtPiBWZXJ0ZXhPdXRcclxue1xyXG4gICAgdmFyIHZlcnRpY2VzID0gYXJyYXk8dmVjMmYsIDY+KFxyXG4gICAgdmVjMigtMSwgLTEpLFxyXG4gICAgdmVjMigxLCAtMSksXHJcbiAgICB2ZWMyKC0xLCAxKSxcclxuICAgIHZlYzIoMSwgMSksXHJcbiAgICB2ZWMyKDEsIC0xKSxcclxuICAgIHZlYzIoLTEsIDEpLFxyXG4gICAgKTtcclxuICAgIHZhciB1dnMgPSBhcnJheTx2ZWMyZiwgNj4gKFxyXG4gICAgdmVjMigwLCAwKSxcclxuICAgIHZlYzIoMSwgMCksXHJcbiAgICB2ZWMyKDAsIDEpLFxyXG4gICAgdmVjMigxLCAxKSxcclxuICAgIHZlYzIoMSwgMCksXHJcbiAgICB2ZWMyKDAsIDEpLFxyXG4gICAgKTtcclxuICAgIHZhciBvdXRwdXQgOiBWZXJ0ZXhPdXQ7XHJcbiAgICBvdXRwdXQucG9zaXRpb24gPSB2ZWM0KHZlcnRpY2VzW1ZlcnRleEluZGV4XSwgMCwgMSk7XHJcbiAgICBvdXRwdXQudXYgPSB1dnNbVmVydGV4SW5kZXhdO1xyXG4gICAgXHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG59XHJcblxyXG5AZnJhZ21lbnRcclxuZm4gZnJhZ21lbnRfbWFpbihmcmFnRGF0YTogVmVydGV4T3V0KSAtPiBAbG9jYXRpb24oMCkgdmVjNGZcclxue1xyXG4gICAgcmV0dXJuIHZlYzQodGV4dHVyZVNhbXBsZSh0ZXh0dXJlSW4sIHNhbXBsZXJJbiwgZnJhZ0RhdGEudXYpLnh5eiwgMSk7XHJcbn1gO1xyXG4gICAgICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgICAgIHRoaXMuc2FtcGxlciA9IGRldmljZS5jcmVhdGVTYW1wbGVyKHtcclxuICAgICAgICAgICAgbWluRmlsdGVyOiBcImxpbmVhclwiLFxyXG4gICAgICAgICAgICBtYWdGaWx0ZXI6IFwibGluZWFyXCIsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyQmluZEdyb3VwTGF5b3V0ID0gZGV2aWNlLmNyZWF0ZUJpbmRHcm91cExheW91dCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5GUkFHTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogdGV4dHVyZUZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBcInJlYWQtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuRlJBR01FTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgc2FtcGxlcjogdGhpcy5zYW1wbGVyLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W10sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyU2hhZGVyTW9kdWxlID0gZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7XHJcbiAgICAgICAgICAgIGNvZGU6IHNoYWRlckNvZGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVSZW5kZXJQaXBlbGluZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBQaXBlbGluZVwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IGRldmljZS5jcmVhdGVQaXBlbGluZUxheW91dCh7XHJcbiAgICAgICAgICAgICAgICBiaW5kR3JvdXBMYXlvdXRzOiBbcmVuZGVyQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHZlcnRleDoge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiByZW5kZXJTaGFkZXJNb2R1bGUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZyYWdtZW50OiB7XHJcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHJlbmRlclNoYWRlck1vZHVsZSxcclxuICAgICAgICAgICAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogbmF2aWdhdG9yLmdwdS5nZXRQcmVmZXJyZWRDYW52YXNGb3JtYXQoKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJpbWl0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICB0b3BvbG9neTogJ3RyaWFuZ2xlLWxpc3QnLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFzcyhjb21tYW5kRW5jb2RlcjogR1BVQ29tbWFuZEVuY29kZXIsIHBoZXJvbW9uZVRleHR1cmU6IEdQVVRleHR1cmUsIHRhcmdldFZpZXc6IEdQVVRleHR1cmVWaWV3LCB0aW1lc3RhbXBXcml0ZXM/OiBHUFVSZW5kZXJQYXNzVGltZXN0YW1wV3JpdGVzKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyUGFzc0Rlc2NyaXB0b3I6IEdQVVJlbmRlclBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnRzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldzogdGFyZ2V0VmlldyxcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclZhbHVlOiBbMCwgMCwgMCwgMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZE9wOiAnY2xlYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlT3A6ICdzdG9yZScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVVJlbmRlclBhc3NDb2xvckF0dGFjaG1lbnRbXSxcclxuICAgICAgICAgICAgdGltZXN0YW1wV3JpdGVzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gVE9ETyAtIGlzIHJlY3JlYXRpbmcgdGhlIGJpbmQgZ3JvdXAgd2l0aCBhIHRleHR1cmUgc3dhcCBmYXN0ZXIgdGhhbiBjb3B5aW5nIHRleHR1cmUgZGF0YSBiYWNrIGFuZCBmb3J0aD9cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBCaW5kIEdyb3VwXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogdGhpcy5waXBlbGluZS5nZXRCaW5kR3JvdXBMYXlvdXQoMCksXHJcbiAgICAgICAgICAgIGVudHJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiBwaGVyb21vbmVUZXh0dXJlLmNyZWF0ZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMSxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogdGhpcy5zYW1wbGVyLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBwYXNzRW5jb2RlciA9IGNvbW1hbmRFbmNvZGVyLmJlZ2luUmVuZGVyUGFzcyhyZW5kZXJQYXNzRGVzY3JpcHRvcik7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuc2V0UGlwZWxpbmUodGhpcy5waXBlbGluZSk7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuc2V0QmluZEdyb3VwKDAsIHRoaXMuYmluZEdyb3VwKTtcclxuICAgICAgICBwYXNzRW5jb2Rlci5kcmF3KDYpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLmVuZCgpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGludGVyZmFjZSBJU2ltdWxhdGlvblBhcmFtZXRlcnMge1xyXG4gICAgYWdlbnRDb3VudDogbnVtYmVyXHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICB0dXJuSml0dGVyOiBudW1iZXIsXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBZ2VudHNBcnJheShwYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnMpOiBudW1iZXJbXSB7XHJcbiAgICBjb25zdCBhZ2VudHNBcnJheSA9IG5ldyBBcnJheSg0ICogcGFyYW1ldGVycy5hZ2VudENvdW50KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1ldGVycy5hZ2VudENvdW50ICogNDsgaSArPSA0KSB7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaV0gPSBwYXJhbWV0ZXJzLmhlaWdodCAvIDI7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaSsxXSA9IHBhcmFtZXRlcnMuaGVpZ2h0IC8gMjtcclxuICAgICAgICBhZ2VudHNBcnJheVtpKzJdID0gTWF0aC5yYW5kb20oKSAtIC41O1xyXG4gICAgICAgIGFnZW50c0FycmF5W2krM10gPSBNYXRoLnJhbmRvbSgpIC0gLjU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWdlbnRzQXJyYXk7XHJcbn0iLCJpbXBvcnQgeyBJU2ltdWxhdGlvblBhcmFtZXRlcnMgfSBmcm9tIFwiLi9zaW11bGF0aW9uQ29uZmlnXCI7XHJcblxyXG5jb25zdCBXT1JLR1JPVVBfU0laRSA9IDY0O1xyXG5cclxuZXhwb3J0IGNsYXNzIFNpbXVsYXRpb25QYXNzIHtcclxuICAgIGRldmljZTogR1BVRGV2aWNlO1xyXG4gICAgcGhlcm9tb25lVGV4dHVyZTogR1BVVGV4dHVyZTtcclxuICAgIGFnZW50c0J1ZmZlcjogR1BVQnVmZmVyO1xyXG5cclxuICAgIHdvcmtncm91cHM6IG51bWJlcjtcclxuICAgIGJpbmRHcm91cDogR1BVQmluZEdyb3VwO1xyXG4gICAgdW5pZm9ybUJ1ZmZlcjogR1BVQnVmZmVyO1xyXG4gICAgcGlwZWxpbmU6IEdQVUNvbXB1dGVQaXBlbGluZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2U6IEdQVURldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycywgdGV4dHVyZUZvcm1hdDogR1BVVGV4dHVyZUZvcm1hdCwgYWdlbnRzQnVmZmVyOiBHUFVCdWZmZXIpIHtcclxuICAgICAgICBjb25zdCBzaGFkZXJDb2RlID0gYFxyXG4gICAgICAgIC8vIEhhc2ggZnVuY3Rpb24gZnJvbSBILiBTY2hlY2h0ZXIgJiBSLiBCcmlkc29uLCBnb28uZ2wvUlhpS2FIXHJcbiAgICAgICAgZm4gSGFzaChwOiB1MzIpIC0+IHUzMlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBwOyBcclxuICAgICAgICAgICAgcyBePSAyNzQ3NjM2NDE5dTtcclxuICAgICAgICAgICAgcyAqPSAyNjU0NDM1NzY5dTtcclxuICAgICAgICAgICAgcyBePSBzID4+IDE2O1xyXG4gICAgICAgICAgICBzICo9IDI2NTQ0MzU3Njl1O1xyXG4gICAgICAgICAgICBzIF49IHMgPj4gMTY7XHJcbiAgICAgICAgICAgIHMgKj0gMjY1NDQzNTc2OXU7XHJcbiAgICAgICAgICAgIHJldHVybiBzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm4gUmFuZG9tKHNlZWQ6IHUzMikgLT4gZjMyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZjMyKEhhc2goc2VlZCkpIC8gNDI5NDk2NzI5NS4wOyAvLyAyXjMyLTFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0cnVjdCBVbmlmb3JtcyB7XHJcbiAgICAgICAgICAgIHRpbWU6IHUzMlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhcjx1bmlmb3JtPiB1bmlmb3JtczogVW5pZm9ybXM7XHJcblxyXG4gICAgICAgIEBncm91cCgwKSBAYmluZGluZygxKSB2YXIgdGV4dHVyZU91dDogdGV4dHVyZV9zdG9yYWdlXzJkPCR7dGV4dHVyZUZvcm1hdH0sIHdyaXRlPjtcclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMikgdmFyPHN0b3JhZ2UsIHJlYWRfd3JpdGU+IGFnZW50czogYXJyYXk8dmVjNGYsICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuYWdlbnRDb3VudH0+O1xyXG5cclxuICAgICAgICBAY29tcHV0ZSBAd29ya2dyb3VwX3NpemUoJHtXT1JLR1JPVVBfU0laRX0pXHJcbiAgICAgICAgZm4gc2ltdWxhdGUoQGJ1aWx0aW4oZ2xvYmFsX2ludm9jYXRpb25faWQpIGdsb2JhbF9pZDogdmVjMzx1MzI+KSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gZ2xvYmFsX2lkLng7XHJcbiAgICAgICAgLy8gVHJpbSBvZmYgdGhlIGV4Y2VzcyBpZiBhZ2VudENvdW50ICUgV09SS0dST1VQX1NJWkUgIT0gMFxyXG4gICAgICAgIGlmIChpbmRleCA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnR9KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhZ2VudCA9IGFnZW50c1tpbmRleF07XHJcblxyXG4gICAgICAgIGFnZW50LnggKz0gYWdlbnQuejtcclxuICAgICAgICBhZ2VudC55ICs9IGFnZW50Lnc7XHJcblxyXG4gICAgICAgIGlmIChhZ2VudC54ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGh9IHx8IGFnZW50LnggPCAwKSB7XHJcbiAgICAgICAgICAgIGFnZW50LnogPSAtYWdlbnQuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFnZW50LnkgPj0gJHtzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHR9IHx8IGFnZW50LnkgPCAwKSB7XHJcbiAgICAgICAgICAgIGFnZW50LncgPSAtYWdlbnQudztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYW5kb21EaXJDaGFuZ2UgPSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLnR1cm5KaXR0ZXJ9ICogdmVjMihSYW5kb20odW5pZm9ybXMudGltZSArIHUzMihhZ2VudC54KSkgLSAuNSwgUmFuZG9tKHVuaWZvcm1zLnRpbWUgKyB1MzIoYWdlbnQueSkpIC0gLjUpO1xyXG4gICAgICAgIGxldCB2ZWxvY2l0eSA9IG5vcm1hbGl6ZShhZ2VudC56dyArIHJhbmRvbURpckNoYW5nZSk7XHJcblxyXG4gICAgICAgIGFnZW50LnogPSB2ZWxvY2l0eS54O1xyXG4gICAgICAgIGFnZW50LncgPSB2ZWxvY2l0eS55O1xyXG5cclxuICAgICAgICBsZXQgcGl4ZWwgPSB2ZWMyPHUzMj4oYWdlbnQueHkpO1xyXG4gICAgICAgIHRleHR1cmVTdG9yZSh0ZXh0dXJlT3V0LCBwaXhlbCwgdmVjNCgxLikpO1xyXG4gICAgICAgIGFnZW50c1tpbmRleF0gPSBhZ2VudDtcclxuICAgICAgICB9YDtcclxuXHJcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICAgICAgdGhpcy5hZ2VudHNCdWZmZXIgPSBhZ2VudHNCdWZmZXI7XHJcbiAgICAgICAgdGhpcy53b3JrZ3JvdXBzID0gTWF0aC5jZWlsKHNpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnQgLyBXT1JLR1JPVVBfU0laRSk7XHJcblxyXG4gICAgICAgIHRoaXMudW5pZm9ybUJ1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgICAgICBzaXplOiA0LFxyXG4gICAgICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuVU5JRk9STSB8IEdQVUJ1ZmZlclVzYWdlLkNPUFlfRFNUXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVCaW5kR3JvdXBMYXlvdXQgPSBkZXZpY2UuY3JlYXRlQmluZEdyb3VwTGF5b3V0KHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInVuaWZvcm1cIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJ3cml0ZS1vbmx5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMixcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdG9yYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0gYXMgR1BVQmluZEdyb3VwTGF5b3V0RW50cnlbXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBpcGVsaW5lID0gZGV2aWNlLmNyZWF0ZUNvbXB1dGVQaXBlbGluZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gUGlwZWxpbmVcIixcclxuICAgICAgICAgICAgbGF5b3V0OiBkZXZpY2UuY3JlYXRlUGlwZWxpbmVMYXlvdXQoe1xyXG4gICAgICAgICAgICAgICAgYmluZEdyb3VwTGF5b3V0czogW2NvbXB1dGVCaW5kR3JvdXBMYXlvdXRdLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgY29tcHV0ZToge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiBkZXZpY2UuY3JlYXRlU2hhZGVyTW9kdWxlKHtjb2RlOiBzaGFkZXJDb2RlfSksXHJcbiAgICAgICAgICAgICAgICBlbnRyeVBvaW50OiAnc2ltdWxhdGUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQYXNzKGNvbW1hbmRFbmNvZGVyOiBHUFVDb21tYW5kRW5jb2RlciwgcGhlcm9tb25lVGV4dHVyZTogR1BVVGV4dHVyZSwgdGltZXN0YW1wV3JpdGVzPzogR1BVUmVuZGVyUGFzc1RpbWVzdGFtcFdyaXRlcyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHVuaWZvcm1EYXRhID0gbmV3IFVpbnQzMkFycmF5KFt3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgKiAxMF0pO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtRGF0YSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdW5pZm9ybURhdGEubGVuZ3RoLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXBXcml0ZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMucGlwZWxpbmUuZ2V0QmluZEdyb3VwTGF5b3V0KDApLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogeyBidWZmZXI6IHRoaXMudW5pZm9ybUJ1ZmZlciB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiBwaGVyb21vbmVUZXh0dXJlLmNyZWF0ZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMixcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTp7IGJ1ZmZlcjogdGhpcy5hZ2VudHNCdWZmZXIgfSwgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0gYXMgR1BVQmluZEdyb3VwRW50cnlbXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBzaW11bGF0ZVBhc3MgPSBjb21tYW5kRW5jb2Rlci5iZWdpbkNvbXB1dGVQYXNzKHBhc3NEZXNjcmlwdG9yKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3Muc2V0UGlwZWxpbmUodGhpcy5waXBlbGluZSk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLnNldEJpbmRHcm91cCgwLCB0aGlzLmJpbmRHcm91cCk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmRpc3BhdGNoV29ya2dyb3Vwcyh0aGlzLndvcmtncm91cHMpO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5lbmQoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IElTaW11bGF0aW9uUGFyYW1ldGVycyB9IGZyb20gXCIuL3NpbXVsYXRpb25Db25maWdcIjtcclxuXHJcbmNvbnN0IFdPUktHUk9VUF9TSVpFID0gNjQ7XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dHVyZVBhc3Mge1xyXG4gICAgZGV2aWNlOiBHUFVEZXZpY2U7XHJcbiAgICBwaGVyb21vbmVUZXh0dXJlSW46IEdQVVRleHR1cmU7XHJcbiAgICBwaGVyb21vbmVUZXh0dXJlT3V0OiBHUFVUZXh0dXJlO1xyXG5cclxuICAgIHdvcmtncm91cHM6IG51bWJlcltdO1xyXG4gICAgYmluZEdyb3VwOiBHUFVCaW5kR3JvdXA7XHJcbiAgICB1bmlmb3JtQnVmZmVyOiBHUFVCdWZmZXI7XHJcbiAgICBwaXBlbGluZTogR1BVQ29tcHV0ZVBpcGVsaW5lO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRldmljZTogR1BVRGV2aWNlLCBzaW11bGF0aW9uUGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzLCBwaGVyb21vbmVUZXh0dXJlRm9ybWF0OiBHUFVUZXh0dXJlRm9ybWF0KSB7XHJcbiAgICAgICAgLy8gVE9ETyAtIFJlbW92ZSBVbmlmb3JtP1xyXG4gICAgICAgIGNvbnN0IHNoYWRlckNvZGUgPSBgXHJcbiAgICAgICAgc3RydWN0IFVuaWZvcm1zIHtcclxuICAgICAgICAgICAgY29sb3I6IHZlYzQ8ZjMyPlxyXG4gICAgICAgIH1cclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMCkgdmFyPHVuaWZvcm0+IHVuaWZvcm1zOiBVbmlmb3JtcztcclxuXHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDEpIHZhciB0ZXh0dXJlSW46IHRleHR1cmVfc3RvcmFnZV8yZDwke3BoZXJvbW9uZVRleHR1cmVGb3JtYXR9LCByZWFkPjtcclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMikgdmFyIHRleHR1cmVPdXQ6IHRleHR1cmVfc3RvcmFnZV8yZDwke3BoZXJvbW9uZVRleHR1cmVGb3JtYXR9LCB3cml0ZT47XHJcblxyXG4gICAgICAgIEBjb21wdXRlIEB3b3JrZ3JvdXBfc2l6ZSg4LCA4KVxyXG4gICAgICAgIGZuIGF0dGVudWF0ZShAYnVpbHRpbihnbG9iYWxfaW52b2NhdGlvbl9pZCkgZ2xvYmFsX2lkOiB2ZWMzPHUzMj4pIHtcclxuICAgICAgICAgICAgaWYgKGdsb2JhbF9pZC54ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGh9IHx8IGdsb2JhbF9pZC55ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0fSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgcGl4ZWwgPSBnbG9iYWxfaWQueHk7XHJcblxyXG4gICAgICAgICAgICAvLyBEZWZpbmUgR2F1c3NpYW4ga2VybmVsICgzeDMpXHJcbiAgICAgICAgICAgIGxldCBvcnRobyA9IC4wOTtcclxuICAgICAgICAgICAgbGV0IGRpYWcgPSAuMDE7XHJcbiAgICAgICAgICAgIGxldCBrZXJuZWw6IGFycmF5PGFycmF5PGYzMiwgMz4sIDM+ID0gYXJyYXk8YXJyYXk8ZjMyLCAzPiwgMz4oXHJcbiAgICAgICAgICAgICAgICBhcnJheTxmMzIsIDM+KGRpYWcsIG9ydGhvLCBkaWFnKSxcclxuICAgICAgICAgICAgICAgIGFycmF5PGYzMiwgMz4ob3J0aG8sICAuNiwgIG9ydGhvKSxcclxuICAgICAgICAgICAgICAgIGFycmF5PGYzMiwgMz4oZGlhZywgb3J0aG8sIGRpYWcpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29sb3JTdW0gPSAwLjA7XHJcblxyXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggbmVpZ2hib3JpbmcgcGl4ZWxzICgzeDMga2VybmVsKVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBpMzIgPSAtMTsgaSA8PSAxOyBpID0gaSArIDEpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGo6IGkzMiA9IC0xOyBqIDw9IDE7IGogPSBqICsgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzYW1wbGVQaXhlbD0gdmVjMihpMzIoZ2xvYmFsX2lkLngpICsgaSwgaTMyKGdsb2JhbF9pZC55KSArIGopO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBFbnN1cmUgd2UgZG9uJ3Qgc2FtcGxlIG91dCBvZiBib3VuZHNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2FtcGxlUGl4ZWwueCA8ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGh9ICYmIHNhbXBsZVBpeGVsLnkgPCAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmhlaWdodH0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNhbXBsZUNvbG9yID0gdGV4dHVyZUxvYWQodGV4dHVyZUluLCBzYW1wbGVQaXhlbCkueDsgLy8gTG9hZCBuZWlnaGJvcmluZyBwaXhlbCBjb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvclN1bSArPSBzYW1wbGVDb2xvciAqIGtlcm5lbFtpICsgMV1baiArIDFdOyAvLyBBcHBseSBHYXVzc2lhbiBrZXJuZWxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbG9yU3VtID0gbWF4KDAuLCBjb2xvclN1bSAtIC4wMDIpO1xyXG5cclxuICAgICAgICAgICAgdGV4dHVyZVN0b3JlKHRleHR1cmVPdXQsIHBpeGVsLCB2ZWM0KHZlYzMoY29sb3JTdW0pLCAxLjApKTsgLy8gU3RvcmUgYmx1cnJlZCBjb2xvclxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGA7XHJcblxyXG4gICAgICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgICAgIHRoaXMud29ya2dyb3VwcyA9IFtNYXRoLmNlaWwoc2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGggLyA4KSwgTWF0aC5jZWlsKHNpbXVsYXRpb25QYXJhbWV0ZXJzLmhlaWdodCAvIDgpXTtcclxuXHJcbiAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcih7XHJcbiAgICAgICAgICAgIHNpemU6IDE2LFxyXG4gICAgICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuVU5JRk9STSB8IEdQVUJ1ZmZlclVzYWdlLkNPUFlfRFNUXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gQ29sb3JcclxuICAgICAgICBjb25zdCB1bmlmb3JtRGF0YSA9IG5ldyBVaW50MzJBcnJheShbXHJcbiAgICAgICAgICAgIDAuLFxyXG4gICAgICAgICAgICAxLixcclxuICAgICAgICAgICAgMS4sXHJcbiAgICAgICAgICAgIDEuLFxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtRGF0YSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdW5pZm9ybURhdGEubGVuZ3RoLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVCaW5kR3JvdXBMYXlvdXQgPSBkZXZpY2UuY3JlYXRlQmluZEdyb3VwTGF5b3V0KHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInVuaWZvcm1cIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHBoZXJvbW9uZVRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJyZWFkLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZVRleHR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBwaGVyb21vbmVUZXh0dXJlRm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3M6IFwid3JpdGUtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVDb21wdXRlUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIFBpcGVsaW5lXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogZGV2aWNlLmNyZWF0ZVBpcGVsaW5lTGF5b3V0KHtcclxuICAgICAgICAgICAgICAgIGJpbmRHcm91cExheW91dHM6IFtjb21wdXRlQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNvbXB1dGU6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7Y29kZTogc2hhZGVyQ29kZX0pLFxyXG4gICAgICAgICAgICAgICAgZW50cnlQb2ludDogJ2F0dGVudWF0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhc3MoY29tbWFuZEVuY29kZXI6IEdQVUNvbW1hbmRFbmNvZGVyLCB0ZXh0dXJlSW46IEdQVVRleHR1cmUsIHRleHR1cmVPdXQ6IEdQVVRleHR1cmUsIHRpbWVzdGFtcFdyaXRlcz86IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBwYXNzRGVzY3JpcHRvciA9IHtcclxuICAgICAgICAgICAgdGltZXN0YW1wV3JpdGVzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMucGlwZWxpbmUuZ2V0QmluZEdyb3VwTGF5b3V0KDApLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogeyBidWZmZXI6IHRoaXMudW5pZm9ybUJ1ZmZlciB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0ZXh0dXJlSW4uY3JlYXRlVmlldygpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0ZXh0dXJlT3V0LmNyZWF0ZVZpZXcoKSwgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0gYXMgR1BVQmluZEdyb3VwRW50cnlbXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBzaW11bGF0ZVBhc3MgPSBjb21tYW5kRW5jb2Rlci5iZWdpbkNvbXB1dGVQYXNzKHBhc3NEZXNjcmlwdG9yKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3Muc2V0UGlwZWxpbmUodGhpcy5waXBlbGluZSk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLnNldEJpbmRHcm91cCgwLCB0aGlzLmJpbmRHcm91cCk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmRpc3BhdGNoV29ya2dyb3Vwcyh0aGlzLndvcmtncm91cHNbMF0sIHRoaXMud29ya2dyb3Vwc1sxXSk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmVuZCgpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBSZW5kZXJQYXNzIH0gZnJvbSBcIi4vcmVuZGVyUGFzc1wiO1xyXG5pbXBvcnQgeyBnZXRBZ2VudHNBcnJheSwgSVNpbXVsYXRpb25QYXJhbWV0ZXJzIH0gZnJvbSBcIi4vc2ltdWxhdGlvbkNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBTaW11bGF0aW9uUGFzcyB9IGZyb20gXCIuL3NpbXVsYXRpb25QYXNzXCI7XHJcbmltcG9ydCB7IFRleHR1cmVQYXNzIH0gZnJvbSBcIi4vdGV4dHVyZUNvbXB1dGVQYXNzXCI7XHJcblxyXG5jb25zdCBOVU1CRVJfT0ZfUEFTU0VTID0gMjtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdvKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb25zdCBhZGFwdGVyID0gYXdhaXQgbmF2aWdhdG9yLmdwdS5yZXF1ZXN0QWRhcHRlcigpO1xyXG4gICAgY29uc3QgaGFzVGltZXN0YW1wUXVlcnkgPSBhZGFwdGVyLmZlYXR1cmVzLmhhcyhcInRpbWVzdGFtcC1xdWVyeVwiKTtcclxuICAgIGNvbnN0IGRldmljZSA9IGF3YWl0IGFkYXB0ZXIucmVxdWVzdERldmljZSh7XHJcbiAgICAgICAgcmVxdWlyZWRGZWF0dXJlczogaGFzVGltZXN0YW1wUXVlcnkgPyBbXCJ0aW1lc3RhbXAtcXVlcnlcIl0gYXMgR1BVRmVhdHVyZU5hbWVbXTogW10sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBQZXJmb3JtYW5jZSBTdGF0aXN0aWNzIERvY3VtZW50IFNldHVwXHJcbiAgICBjb25zdCBwZXJmRGlzcGxheUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUuYmFja2Ryb3BGaWx0ZXIgPSAnYmx1cigxMHB4KSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5ib3R0b20gPSAnMTBweCc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gJzEwcHgnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUudGV4dEFsaWduID0gJ2xlZnQnO1xyXG4gICAgY29uc3QgcGVyZkRpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKTtcclxuICAgIHBlcmZEaXNwbGF5LnN0eWxlLm1hcmdpbiA9ICcuNWVtJztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLmFwcGVuZENoaWxkKHBlcmZEaXNwbGF5KTtcclxuICAgIGNhbnZhcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHBlcmZEaXNwbGF5Q29udGFpbmVyKTtcclxuICAgIGxldCBzaW11bGF0aW9uRHVyYXRpb25TdW0gPSAwO1xyXG4gICAgbGV0IHJlbmRlckR1cmF0aW9uU3VtID0gMDtcclxuICAgIGxldCB0aW1lclNhbXBsZXMgPSAwO1xyXG5cclxuICAgIGNvbnN0IHNwYXJlUGVyZlRpbWVCdWZmZXJzOiBHUFVCdWZmZXJbXSA9IFtdO1xyXG4gICAgbGV0IHF1ZXJ5U2V0OiBHUFVRdWVyeVNldCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIGxldCBwZXJmUmVzb2x2ZUJ1ZmZlcjogR1BVQnVmZmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgbGV0IHNpbXVsYXRpb25QZXJmVGltZVN0YW1wV3JpdGVzOiBHUFVDb21wdXRlUGFzc1RpbWVzdGFtcFdyaXRlcyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIGxldCByZW5kZXJQZXJmVGltZVN0YW1wV3JpdGVzOiBHUFVSZW5kZXJQYXNzVGltZXN0YW1wV3JpdGVzIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgaWYgKGhhc1RpbWVzdGFtcFF1ZXJ5KSB7XHJcbiAgICAgICAgcGVyZkRpc3BsYXkudGV4dENvbnRlbnQgPSBgXFxcclxuYXZnIHNpbXVsYXRpb24gZHVyYXRpb246IOKAlCDCtXNcclxuYXZnIHJlbmRlciBkdXJhdGlvbjogIOKAlCDCtXNcclxuc3BhcmUgcGVyZiBidWZmZXJzOiAgICDigJRgO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBxdWVyeVNldCA9IGRldmljZS5jcmVhdGVRdWVyeVNldCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwidGltZXN0YW1wXCIsXHJcbiAgICAgICAgICAgIGNvdW50OiAyICogTlVNQkVSX09GX1BBU1NFUyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBwZXJmUmVzb2x2ZUJ1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJwZXJmUmVzb2x2ZVwiLFxyXG4gICAgICAgICAgICBzaXplOiA0ICogQmlnSW50NjRBcnJheS5CWVRFU19QRVJfRUxFTUVOVCAqIE5VTUJFUl9PRl9QQVNTRVMsXHJcbiAgICAgICAgICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZS5RVUVSWV9SRVNPTFZFIHwgR1BVQnVmZmVyVXNhZ2UuQ09QWV9TUkMsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2ltdWxhdGlvblBlcmZUaW1lU3RhbXBXcml0ZXMgPSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5U2V0LFxyXG4gICAgICAgICAgICBiZWdpbm5pbmdPZlBhc3NXcml0ZUluZGV4OiAwLFxyXG4gICAgICAgICAgICBlbmRPZlBhc3NXcml0ZUluZGV4OiAxLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJlbmRlclBlcmZUaW1lU3RhbXBXcml0ZXMgPSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5U2V0LFxyXG4gICAgICAgICAgICBiZWdpbm5pbmdPZlBhc3NXcml0ZUluZGV4OiAyLFxyXG4gICAgICAgICAgICBlbmRPZlBhc3NXcml0ZUluZGV4OiAzLFxyXG4gICAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdwdScpIGFzIHVua25vd24gYXMgR1BVQ2FudmFzQ29udGV4dDtcclxuICAgIGNvbnN0IHByZXNlbnRhdGlvbkZvcm1hdCA9IG5hdmlnYXRvci5ncHUuZ2V0UHJlZmVycmVkQ2FudmFzRm9ybWF0KCk7XHJcbiAgICBjb250ZXh0LmNvbmZpZ3VyZSh7XHJcbiAgICAgICAgZGV2aWNlLFxyXG4gICAgICAgIGZvcm1hdDogcHJlc2VudGF0aW9uRm9ybWF0LFxyXG4gICAgICAgIGFscGhhTW9kZTogJ3ByZW11bHRpcGxpZWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBzaW11bGF0aW9uUGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzID0ge1xyXG4gICAgICAgIGFnZW50Q291bnQ6IDEwMDAsXHJcbiAgICAgICAgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXHJcbiAgICAgICAgdHVybkppdHRlcjogLjUsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGhlcm9tb25lVGV4dHVyZXMgPSBbXHJcbiAgICAgICAgZGV2aWNlLmNyZWF0ZVRleHR1cmUoe1xyXG4gICAgICAgICAgICBzaXplOiBbY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0XSxcclxuICAgICAgICAgICAgZm9ybWF0OiAgJ3JnYmE4dW5vcm0nLFxyXG4gICAgICAgICAgICB1c2FnZTogXHJcbiAgICAgICAgICAgICAgICBHUFVUZXh0dXJlVXNhZ2UuVEVYVFVSRV9CSU5ESU5HIHxcclxuICAgICAgICAgICAgICAgIEdQVVRleHR1cmVVc2FnZS5TVE9SQUdFX0JJTkRJTkdcclxuICAgICAgICB9KSxcclxuICAgICAgICBkZXZpY2UuY3JlYXRlVGV4dHVyZSh7XHJcbiAgICAgICAgICAgIHNpemU6IFtjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHRdLFxyXG4gICAgICAgICAgICBmb3JtYXQ6ICAncmdiYTh1bm9ybScsXHJcbiAgICAgICAgICAgIHVzYWdlOiBcclxuICAgICAgICAgICAgICAgIEdQVVRleHR1cmVVc2FnZS5URVhUVVJFX0JJTkRJTkcgfFxyXG4gICAgICAgICAgICAgICAgR1BVVGV4dHVyZVVzYWdlLlNUT1JBR0VfQklORElOR1xyXG4gICAgICAgIH0pLFxyXG4gICAgXTtcclxuXHJcbiAgICBjb25zdCBhZ2VudHNCdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICBsYWJlbDogXCJhZ2VudHNcIixcclxuICAgICAgICBzaXplOiAxNiAqIHNpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnQsXHJcbiAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLlNUT1JBR0UsXHJcbiAgICAgICAgbWFwcGVkQXRDcmVhdGlvbjogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgbmV3IEZsb2F0MzJBcnJheShhZ2VudHNCdWZmZXIuZ2V0TWFwcGVkUmFuZ2UoKSkuc2V0KGdldEFnZW50c0FycmF5KHNpbXVsYXRpb25QYXJhbWV0ZXJzKSk7XHJcbiAgICBhZ2VudHNCdWZmZXIudW5tYXAoKTtcclxuXHJcbiAgICBjb25zdCB0ZXh0dXJlUGFzcyA9IG5ldyBUZXh0dXJlUGFzcyhkZXZpY2UsIHNpbXVsYXRpb25QYXJhbWV0ZXJzLCBwaGVyb21vbmVUZXh0dXJlc1swXS5mb3JtYXQpXHJcblxyXG4gICAgY29uc3Qgc2ltdWxhdGlvblBhc3MgPSBuZXcgU2ltdWxhdGlvblBhc3MoZGV2aWNlLCBzaW11bGF0aW9uUGFyYW1ldGVycywgcGhlcm9tb25lVGV4dHVyZXNbMF0uZm9ybWF0LCBhZ2VudHNCdWZmZXIpO1xyXG5cclxuICAgIGNvbnN0IHJlbmRlclBhc3MgPSBuZXcgUmVuZGVyUGFzcyhkZXZpY2UsIHBoZXJvbW9uZVRleHR1cmVzWzBdLmZvcm1hdCk7XHJcblxyXG4gICAgbGV0IHBoZXJvbW9uZUluZGV4ID0gMDtcclxuICAgIGNvbnN0IGZyYW1lID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmRFbmNvZGVyID0gZGV2aWNlLmNyZWF0ZUNvbW1hbmRFbmNvZGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZVBhc3MuYWRkUGFzcyhjb21tYW5kRW5jb2RlciwgcGhlcm9tb25lVGV4dHVyZXNbKHBoZXJvbW9uZUluZGV4ICsgMSkgJSAyXSwgcGhlcm9tb25lVGV4dHVyZXNbcGhlcm9tb25lSW5kZXhdKVxyXG5cclxuICAgICAgICBzaW11bGF0aW9uUGFzcy5hZGRQYXNzKGNvbW1hbmRFbmNvZGVyLCBwaGVyb21vbmVUZXh0dXJlc1twaGVyb21vbmVJbmRleF0sIHNpbXVsYXRpb25QZXJmVGltZVN0YW1wV3JpdGVzKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FudmFzVGV4dHVyZVZpZXcgPSBjb250ZXh0LmdldEN1cnJlbnRUZXh0dXJlKCkuY3JlYXRlVmlldygpO1xyXG4gICAgICAgIHJlbmRlclBhc3MuYWRkUGFzcyhjb21tYW5kRW5jb2RlciwgcGhlcm9tb25lVGV4dHVyZXNbcGhlcm9tb25lSW5kZXhdLCBjYW52YXNUZXh0dXJlVmlldywgcmVuZGVyUGVyZlRpbWVTdGFtcFdyaXRlcyk7XHJcbiAgICAgICAgcGhlcm9tb25lSW5kZXggPSAocGhlcm9tb25lSW5kZXggKyAxKSAlIDI7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHRCdWZmZXI6IEdQVUJ1ZmZlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoaGFzVGltZXN0YW1wUXVlcnkpIHtcclxuICAgICAgICAgICAgcmVzdWx0QnVmZmVyID0gc3BhcmVQZXJmVGltZUJ1ZmZlcnMucG9wKCkgfHwgXHJcbiAgICAgICAgICAgICAgICBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiA0ICogQmlnSW50NjRBcnJheS5CWVRFU19QRVJfRUxFTUVOVCAqIE5VTUJFUl9PRl9QQVNTRVMsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLkNPUFlfRFNUIHwgR1BVQnVmZmVyVXNhZ2UuTUFQX1JFQUQsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29tbWFuZEVuY29kZXIucmVzb2x2ZVF1ZXJ5U2V0KHF1ZXJ5U2V0LCAwLCAyICogTlVNQkVSX09GX1BBU1NFUywgcGVyZlJlc29sdmVCdWZmZXIsIDApO1xyXG4gICAgICAgICAgICBjb21tYW5kRW5jb2Rlci5jb3B5QnVmZmVyVG9CdWZmZXIoXHJcbiAgICAgICAgICAgICAgICBwZXJmUmVzb2x2ZUJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0QnVmZmVyLnNpemVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRldmljZS5xdWV1ZS5zdWJtaXQoW2NvbW1hbmRFbmNvZGVyLmZpbmlzaCgpXSk7XHJcblxyXG4gICAgICAgIGlmIChoYXNUaW1lc3RhbXBRdWVyeSkge1xyXG4gICAgICAgICAgICByZXN1bHRCdWZmZXIubWFwQXN5bmMoR1BVTWFwTW9kZS5SRUFEKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVzID0gbmV3IEJpZ0ludDY0QXJyYXkocmVzdWx0QnVmZmVyLmdldE1hcHBlZFJhbmdlKCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2ltdWxhdGlvbkR1cmF0aW9uID0gTnVtYmVyKHRpbWVzWzFdIC0gdGltZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyRHVyYXRpb24gPSBOdW1iZXIodGltZXNbM10gLSB0aW1lc1syXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2ltdWxhdGlvbkR1cmF0aW9uID4gMCAmJiByZW5kZXJEdXJhdGlvbiA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzaW11bGF0aW9uRHVyYXRpb25TdW0gKz0gc2ltdWxhdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckR1cmF0aW9uU3VtICs9IHJlbmRlckR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyU2FtcGxlcysrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0QnVmZmVyLnVubWFwKCk7XHJcbiAgICAgICAgICAgICAgICBzcGFyZVBlcmZUaW1lQnVmZmVycy5wdXNoKHJlc3VsdEJ1ZmZlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qga051bVRpbWVyU2FtcGxlc1BlclVwZGF0ZSA9IDEwMDtcclxuICAgICAgICAgICAgICAgIGlmICh0aW1lclNhbXBsZXMgPj0ga051bVRpbWVyU2FtcGxlc1BlclVwZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF2Z1NpbXVsYXRpb25NaWNyb3NlY29uZHMgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaW11bGF0aW9uRHVyYXRpb25TdW0gLyB0aW1lclNhbXBsZXMgLyAxMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdmdSZW5kZXJNaWNyb3NlY29uZHMgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJEdXJhdGlvblN1bSAvIHRpbWVyU2FtcGxlcyAvIDEwMDBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcmZEaXNwbGF5LnRleHRDb250ZW50ID0gYFxcXHJcbmF2ZyBzaW11bGF0aW9uIGR1cmF0aW9uOiAke2F2Z1NpbXVsYXRpb25NaWNyb3NlY29uZHN9wrVzXHJcbmF2ZyByZW5kZXIgZHVyYXRpb246ICAke2F2Z1JlbmRlck1pY3Jvc2Vjb25kc33CtXNcclxuc3BhcmUgcGVyZiBidWZmZXJzOiAgICAke3NwYXJlUGVyZlRpbWVCdWZmZXJzLmxlbmd0aH1gO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbXVsYXRpb25EdXJhdGlvblN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRHVyYXRpb25TdW0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyU2FtcGxlcyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcclxuICAgIH07XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xyXG59XHJcblxyXG5nbygpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==