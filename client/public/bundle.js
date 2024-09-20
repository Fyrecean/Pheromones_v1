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
        var shaderCode = "\n        // Hash function from H. Schechter & R. Bridson, goo.gl/RXiKaH\n        fn Hash(p: u32) -> u32\n        {\n            var s = p; \n            s ^= 2747636419u;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            return s;\n        }\n\n        fn Random(seed: u32) -> f32\n        {\n            return f32(Hash(seed)) / 4294967295.0; // 2^32-1\n        }\n\n        struct Uniforms {\n            time: u32,\n            \n        }\n\n        @group(0) @binding(0) var<uniform> uniforms: Uniforms;\n\n        @group(0) @binding(1) var textureOut: texture_storage_2d<".concat(textureFormat, ", write>;\n        @group(0) @binding(2) var<storage, read_write> agents: array<vec4f, ").concat(simulationParameters.agentCount, ">;\n        @group(0) @binding(3) var textureIn: texture_storage_2d<").concat(textureFormat, ", read>;\n\n        const leftSampleMatrix =  mat2x2(0.866025, 0.5, -0.5, 0.866025);\n        const rightSampleMatrix = mat2x2(0.866025, -0.5, 0.5, 0.866025);\n        fn samplePheromone(position: vec2<f32>, direction: vec2<f32>, steps: u32) -> vec3<f32> {\n            let sampleStart = position + direction * 2;\n            var sum = vec3(0.);\n            let fSteps = f32(steps);\n            for (var i = 0.; i < fSteps; i += 1.) {\n                sum += textureLoad(textureIn, vec2<i32>(round(sampleStart + i * direction))).xyz;\n            }\n            return sum;\n        }\n\n        @compute @workgroup_size(").concat(WORKGROUP_SIZE, ")\n        fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {\n        let index = global_id.x;\n        // Trim off the excess if agentCount % WORKGROUP_SIZE != 0\n        if (index >= ").concat(simulationParameters.agentCount, ") {\n            return;\n        }\n\n        var agent = agents[index];\n\n        agent.x += agent.z;\n        agent.y += agent.w;\n\n        if (agent.x >= ").concat(simulationParameters.width, " || agent.x < 0) {\n            agent.z = -agent.z;\n        }\n        if (agent.y >= ").concat(simulationParameters.height, " || agent.y < 0) {\n            agent.w = -agent.w;\n        }\n\n        let randomDirChange = ").concat(simulationParameters.turnJitter, " * vec2(Random(uniforms.time + global_id.x) - .5, Random(uniforms.time + global_id.x + ").concat(simulationParameters.height, ") - .5);\n        var velocity = normalize(agent.zw + randomDirChange);\n\n        // Take pheromone samples\n        let rightSampleDir = rightSampleMatrix * velocity;\n        let rightSamplePixel = vec2<i32>(round(agent.xy + 3 * rightSampleDir));\n        \n        let forwardSamplePixel = vec2<i32>(round(agent.xy + 3 * velocity));\n\n        \n        let leftSampleDir = leftSampleMatrix * velocity;\n\n        let rightSample = samplePheromone(agent.xy, rightSampleDir, ").concat(simulationParameters.sampleDistance, ").x;\n        let forwardSample = samplePheromone(agent.xy, velocity, ").concat(simulationParameters.sampleDistance, ").x;\n        let leftSample = samplePheromone(agent.xy, leftSampleDir, ").concat(simulationParameters.sampleDistance, ").x;\n        \n        if (forwardSample < rightSample || forwardSample < leftSample) {\n            if (rightSample > leftSample) {\n                velocity += ").concat(simulationParameters.steerFactor, " * rightSampleDir;\n            } else {\n                velocity += ").concat(simulationParameters.steerFactor, " * leftSampleDir;\n             }\n            velocity = normalize(velocity);\n        }\n\n        let pixel = vec2<i32>(round(agent.xy));\n        textureStore(textureOut, pixel, vec4(1., 0., 0., 1.));\n        \n        agent.z = velocity.x;\n        agent.w = velocity.y;\n        agents[index] = agent;\n        }");
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
    }
    SimulationPass.prototype.addPass = function (commandEncoder, textureIn, textureOut, timestampWrites) {
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
var WORKGROUP_SIZE = 64;
var TexturePass = /** @class */ (function () {
    function TexturePass(device, simulationParameters, pheromoneTextureFormat) {
        // TODO - Remove Uniform?
        var shaderCode = "\n        struct Uniforms {\n            color: vec4<f32>\n        }\n        @group(0) @binding(0) var<uniform> uniforms: Uniforms;\n\n        @group(0) @binding(1) var textureIn: texture_storage_2d<".concat(pheromoneTextureFormat, ", read>;\n        @group(0) @binding(2) var textureOut: texture_storage_2d<").concat(pheromoneTextureFormat, ", write>;\n\n        @compute @workgroup_size(8, 8)\n        fn attenuate(@builtin(global_invocation_id) global_id: vec3<u32>) {\n            if (global_id.x >= ").concat(simulationParameters.width, " || global_id.y >= ").concat(simulationParameters.height, ") {\n                return;\n            }\n            \n            let pixel = global_id.xy;\n\n            // Define Gaussian kernel (3x3)\n            let ortho = .05;\n            let diag = .01;\n            let kernel = array<array<f32, 3>, 3>(\n                array<f32, 3>(diag, ortho, diag),\n                array<f32, 3>(ortho,  .7,  ortho),\n                array<f32, 3>(diag, ortho, diag)\n            );\n\n            var colorSum = vec3(0.);\n\n            // Loop through neighboring pixels (3x3 kernel)\n            for (var i: i32 = -1; i <= 1; i = i + 1) {\n                for (var j: i32 = -1; j <= 1; j = j + 1) {\n                    let samplePixel= vec2(i32(global_id.x) + i, i32(global_id.y) + j);\n\n                    // Ensure we don't sample out of bounds\n                    if (samplePixel.x < ").concat(simulationParameters.width, " && samplePixel.y < ").concat(simulationParameters.height, ") {\n                        let sampleColor = textureLoad(textureIn, samplePixel).xyz; // Load neighboring pixel color\n                        colorSum += sampleColor * kernel[i + 1][j + 1]; // Apply Gaussian kernel\n                    }\n                }\n            }\n\n            colorSum = max(vec3(0.), colorSum - vec3(").concat(simulationParameters.passiveAttenuation, "));\n\n            textureStore(textureOut, pixel, vec4(colorSum, 1.0)); // Store blurred color\n        }\n\n            ");
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
var simulationParameters = {
    agentCount: 1000000,
    height: 0,
    width: 0,
    turnJitter: .4,
    steerFactor: 0.2,
    sampleDistance: 10,
    passiveAttenuation: .001,
};
function go() {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, adapter, hasTimestampQuery, device, perfDisplayContainer, perfDisplay, simulationDurationSum, renderDurationSum, timerSamples, sparePerfTimeBuffers, querySet, perfResolveBuffer, simulationPerfTimeStampWrites, renderPerfTimeStampWrites, context, presentationFormat, pheromoneTextures, agentsBuffer, texturePass, simulationPass, renderPass, pheromoneIndex, frame;
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
                    simulationParameters.width = canvas.width;
                    simulationParameters.height = canvas.height;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FDNUMsaUJBQWlCLElBQUksY0FBYyxDQUFDO29DQUNwQyxZQUFZLEVBQUUsQ0FBQztnQ0FDbkIsQ0FBQztnQ0FDRCxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7Z0NBQ3JCLG9CQUFvQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQ0FFeEMsSUFBTSx5QkFBeUIsR0FBRyxHQUFHLENBQUM7Z0NBQ3RDLElBQUksWUFBWSxJQUFJLHlCQUF5QixFQUFFLENBQUM7b0NBQzVDLElBQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDeEMscUJBQXFCLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FDOUMsQ0FBQztvQ0FDRixJQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQ3BDLGlCQUFpQixHQUFHLFlBQVksR0FBRyxJQUFJLENBQzFDLENBQUM7b0NBQ0YsV0FBVyxDQUFDLFdBQVcsR0FBRyxtQ0FDbkIseUJBQXlCLDRDQUM1QixxQkFBcUIsNkNBQ3BCLG9CQUFvQixDQUFDLE1BQU0sQ0FBRSxDQUFDO29DQUNuQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7b0NBQzFCLGlCQUFpQixHQUFHLENBQUMsQ0FBQztvQ0FDdEIsWUFBWSxHQUFHLENBQUMsQ0FBQztnQ0FFckIsQ0FBQzs0QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDO3dCQUNELHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNqQyxDQUFDLENBQUM7b0JBQ0YscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7O0NBQ2hDO0FBRUQsRUFBRSxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcmVuZGVyUGFzcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvbkNvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvblBhc3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RleHR1cmVDb21wdXRlUGFzcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIHtcclxuICAgIGRldmljZTogR1BVRGV2aWNlO1xyXG4gICAgYmluZEdyb3VwOiBHUFVCaW5kR3JvdXA7XHJcbiAgICBwaXBlbGluZTogR1BVUmVuZGVyUGlwZWxpbmU7XHJcbiAgICBzYW1wbGVyOiBHUFVTYW1wbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRldmljZTogR1BVRGV2aWNlLCB0ZXh0dXJlRm9ybWF0OiBHUFVUZXh0dXJlRm9ybWF0KSB7XHJcbiAgICAgICAgY29uc3Qgc2hhZGVyQ29kZSA9IGBcclxuQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhciB0ZXh0dXJlSW46IHRleHR1cmVfMmQ8ZjMyPjtcclxuQGdyb3VwKDApIEBiaW5kaW5nKDEpIHZhciBzYW1wbGVySW46IHNhbXBsZXI7XHJcblxyXG5zdHJ1Y3QgVmVydGV4T3V0IHtcclxuICAgIEBidWlsdGluKHBvc2l0aW9uKSBwb3NpdGlvbiA6IHZlYzRmLFxyXG4gICAgQGxvY2F0aW9uKDApIHV2IDogdmVjMmYsXHJcbn1cclxuXHJcbkB2ZXJ0ZXhcclxuZm4gdmVydGV4X21haW4oQGJ1aWx0aW4odmVydGV4X2luZGV4KSBWZXJ0ZXhJbmRleDogdTMyKSAtPiBWZXJ0ZXhPdXRcclxue1xyXG4gICAgdmFyIHZlcnRpY2VzID0gYXJyYXk8dmVjMmYsIDY+KFxyXG4gICAgdmVjMigtMSwgLTEpLFxyXG4gICAgdmVjMigxLCAtMSksXHJcbiAgICB2ZWMyKC0xLCAxKSxcclxuICAgIHZlYzIoMSwgMSksXHJcbiAgICB2ZWMyKDEsIC0xKSxcclxuICAgIHZlYzIoLTEsIDEpLFxyXG4gICAgKTtcclxuICAgIHZhciB1dnMgPSBhcnJheTx2ZWMyZiwgNj4gKFxyXG4gICAgdmVjMigwLCAwKSxcclxuICAgIHZlYzIoMSwgMCksXHJcbiAgICB2ZWMyKDAsIDEpLFxyXG4gICAgdmVjMigxLCAxKSxcclxuICAgIHZlYzIoMSwgMCksXHJcbiAgICB2ZWMyKDAsIDEpLFxyXG4gICAgKTtcclxuICAgIHZhciBvdXRwdXQgOiBWZXJ0ZXhPdXQ7XHJcbiAgICBvdXRwdXQucG9zaXRpb24gPSB2ZWM0KHZlcnRpY2VzW1ZlcnRleEluZGV4XSwgMCwgMSk7XHJcbiAgICBvdXRwdXQudXYgPSB1dnNbVmVydGV4SW5kZXhdO1xyXG4gICAgXHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG59XHJcblxyXG5AZnJhZ21lbnRcclxuZm4gZnJhZ21lbnRfbWFpbihmcmFnRGF0YTogVmVydGV4T3V0KSAtPiBAbG9jYXRpb24oMCkgdmVjNGZcclxue1xyXG4gICAgcmV0dXJuIHZlYzQodGV4dHVyZVNhbXBsZSh0ZXh0dXJlSW4sIHNhbXBsZXJJbiwgZnJhZ0RhdGEudXYpLnh5eiwgMSk7XHJcbn1gO1xyXG4gICAgICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgICAgIHRoaXMuc2FtcGxlciA9IGRldmljZS5jcmVhdGVTYW1wbGVyKHtcclxuICAgICAgICAgICAgbWluRmlsdGVyOiBcImxpbmVhclwiLFxyXG4gICAgICAgICAgICBtYWdGaWx0ZXI6IFwibGluZWFyXCIsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyQmluZEdyb3VwTGF5b3V0ID0gZGV2aWNlLmNyZWF0ZUJpbmRHcm91cExheW91dCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5GUkFHTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogdGV4dHVyZUZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBcInJlYWQtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuRlJBR01FTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgc2FtcGxlcjogdGhpcy5zYW1wbGVyLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W10sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyU2hhZGVyTW9kdWxlID0gZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7XHJcbiAgICAgICAgICAgIGNvZGU6IHNoYWRlckNvZGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVSZW5kZXJQaXBlbGluZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBQaXBlbGluZVwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IGRldmljZS5jcmVhdGVQaXBlbGluZUxheW91dCh7XHJcbiAgICAgICAgICAgICAgICBiaW5kR3JvdXBMYXlvdXRzOiBbcmVuZGVyQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHZlcnRleDoge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiByZW5kZXJTaGFkZXJNb2R1bGUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZyYWdtZW50OiB7XHJcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHJlbmRlclNoYWRlck1vZHVsZSxcclxuICAgICAgICAgICAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogbmF2aWdhdG9yLmdwdS5nZXRQcmVmZXJyZWRDYW52YXNGb3JtYXQoKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJpbWl0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICB0b3BvbG9neTogJ3RyaWFuZ2xlLWxpc3QnLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFzcyhjb21tYW5kRW5jb2RlcjogR1BVQ29tbWFuZEVuY29kZXIsIHBoZXJvbW9uZVRleHR1cmU6IEdQVVRleHR1cmUsIHRhcmdldFZpZXc6IEdQVVRleHR1cmVWaWV3LCB0aW1lc3RhbXBXcml0ZXM/OiBHUFVSZW5kZXJQYXNzVGltZXN0YW1wV3JpdGVzKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyUGFzc0Rlc2NyaXB0b3I6IEdQVVJlbmRlclBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnRzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldzogdGFyZ2V0VmlldyxcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclZhbHVlOiBbMCwgMCwgMCwgMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZE9wOiAnY2xlYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlT3A6ICdzdG9yZScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVVJlbmRlclBhc3NDb2xvckF0dGFjaG1lbnRbXSxcclxuICAgICAgICAgICAgdGltZXN0YW1wV3JpdGVzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gVE9ETyAtIGlzIHJlY3JlYXRpbmcgdGhlIGJpbmQgZ3JvdXAgd2l0aCBhIHRleHR1cmUgc3dhcCBmYXN0ZXIgdGhhbiBjb3B5aW5nIHRleHR1cmUgZGF0YSBiYWNrIGFuZCBmb3J0aD9cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBCaW5kIEdyb3VwXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogdGhpcy5waXBlbGluZS5nZXRCaW5kR3JvdXBMYXlvdXQoMCksXHJcbiAgICAgICAgICAgIGVudHJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiBwaGVyb21vbmVUZXh0dXJlLmNyZWF0ZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMSxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogdGhpcy5zYW1wbGVyLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBwYXNzRW5jb2RlciA9IGNvbW1hbmRFbmNvZGVyLmJlZ2luUmVuZGVyUGFzcyhyZW5kZXJQYXNzRGVzY3JpcHRvcik7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuc2V0UGlwZWxpbmUodGhpcy5waXBlbGluZSk7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuc2V0QmluZEdyb3VwKDAsIHRoaXMuYmluZEdyb3VwKTtcclxuICAgICAgICBwYXNzRW5jb2Rlci5kcmF3KDYpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLmVuZCgpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGludGVyZmFjZSBJU2ltdWxhdGlvblBhcmFtZXRlcnMge1xyXG4gICAgYWdlbnRDb3VudDogbnVtYmVyXHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICB0dXJuSml0dGVyOiBudW1iZXIsXHJcbiAgICBzdGVlckZhY3RvcjogbnVtYmVyLFxyXG4gICAgc2FtcGxlRGlzdGFuY2U6IG51bWJlcixcclxuICAgIHBhc3NpdmVBdHRlbnVhdGlvbjogbnVtYmVyLFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWdlbnRzQXJyYXkocGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzKTogbnVtYmVyW10ge1xyXG4gICAgY29uc3QgYWdlbnRzQXJyYXkgPSBuZXcgQXJyYXkoNCAqIHBhcmFtZXRlcnMuYWdlbnRDb3VudCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtZXRlcnMuYWdlbnRDb3VudCAqIDQ7IGkgKz0gNCkge1xyXG4gICAgICAgIGFnZW50c0FycmF5W2ldID0gcGFyYW1ldGVycy53aWR0aCAvIDI7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaSsxXSA9IHBhcmFtZXRlcnMuaGVpZ2h0IC8gMjtcclxuICAgICAgICBhZ2VudHNBcnJheVtpKzJdID0gTWF0aC5yYW5kb20oKSAtIC41O1xyXG4gICAgICAgIGFnZW50c0FycmF5W2krM10gPSBNYXRoLnJhbmRvbSgpIC0gLjU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWdlbnRzQXJyYXk7XHJcbn0iLCJpbXBvcnQgeyBJU2ltdWxhdGlvblBhcmFtZXRlcnMgfSBmcm9tIFwiLi9zaW11bGF0aW9uQ29uZmlnXCI7XHJcblxyXG5jb25zdCBXT1JLR1JPVVBfU0laRSA9IDY0O1xyXG5cclxuZXhwb3J0IGNsYXNzIFNpbXVsYXRpb25QYXNzIHtcclxuICAgIGRldmljZTogR1BVRGV2aWNlO1xyXG4gICAgcGhlcm9tb25lVGV4dHVyZTogR1BVVGV4dHVyZTtcclxuICAgIGFnZW50c0J1ZmZlcjogR1BVQnVmZmVyO1xyXG5cclxuICAgIHdvcmtncm91cHM6IG51bWJlcjtcclxuICAgIGJpbmRHcm91cDogR1BVQmluZEdyb3VwO1xyXG4gICAgdW5pZm9ybUJ1ZmZlcjogR1BVQnVmZmVyO1xyXG4gICAgcGlwZWxpbmU6IEdQVUNvbXB1dGVQaXBlbGluZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2U6IEdQVURldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycywgdGV4dHVyZUZvcm1hdDogR1BVVGV4dHVyZUZvcm1hdCwgYWdlbnRzQnVmZmVyOiBHUFVCdWZmZXIpIHtcclxuICAgICAgICBjb25zdCBzaGFkZXJDb2RlID0gYFxyXG4gICAgICAgIC8vIEhhc2ggZnVuY3Rpb24gZnJvbSBILiBTY2hlY2h0ZXIgJiBSLiBCcmlkc29uLCBnb28uZ2wvUlhpS2FIXHJcbiAgICAgICAgZm4gSGFzaChwOiB1MzIpIC0+IHUzMlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBwOyBcclxuICAgICAgICAgICAgcyBePSAyNzQ3NjM2NDE5dTtcclxuICAgICAgICAgICAgcyAqPSAyNjU0NDM1NzY5dTtcclxuICAgICAgICAgICAgcyBePSBzID4+IDE2O1xyXG4gICAgICAgICAgICBzICo9IDI2NTQ0MzU3Njl1O1xyXG4gICAgICAgICAgICBzIF49IHMgPj4gMTY7XHJcbiAgICAgICAgICAgIHMgKj0gMjY1NDQzNTc2OXU7XHJcbiAgICAgICAgICAgIHJldHVybiBzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm4gUmFuZG9tKHNlZWQ6IHUzMikgLT4gZjMyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZjMyKEhhc2goc2VlZCkpIC8gNDI5NDk2NzI5NS4wOyAvLyAyXjMyLTFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0cnVjdCBVbmlmb3JtcyB7XHJcbiAgICAgICAgICAgIHRpbWU6IHUzMixcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMCkgdmFyPHVuaWZvcm0+IHVuaWZvcm1zOiBVbmlmb3JtcztcclxuXHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDEpIHZhciB0ZXh0dXJlT3V0OiB0ZXh0dXJlX3N0b3JhZ2VfMmQ8JHt0ZXh0dXJlRm9ybWF0fSwgd3JpdGU+O1xyXG4gICAgICAgIEBncm91cCgwKSBAYmluZGluZygyKSB2YXI8c3RvcmFnZSwgcmVhZF93cml0ZT4gYWdlbnRzOiBhcnJheTx2ZWM0ZiwgJHtzaW11bGF0aW9uUGFyYW1ldGVycy5hZ2VudENvdW50fT47XHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDMpIHZhciB0ZXh0dXJlSW46IHRleHR1cmVfc3RvcmFnZV8yZDwke3RleHR1cmVGb3JtYXR9LCByZWFkPjtcclxuXHJcbiAgICAgICAgY29uc3QgbGVmdFNhbXBsZU1hdHJpeCA9ICBtYXQyeDIoMC44NjYwMjUsIDAuNSwgLTAuNSwgMC44NjYwMjUpO1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0U2FtcGxlTWF0cml4ID0gbWF0MngyKDAuODY2MDI1LCAtMC41LCAwLjUsIDAuODY2MDI1KTtcclxuICAgICAgICBmbiBzYW1wbGVQaGVyb21vbmUocG9zaXRpb246IHZlYzI8ZjMyPiwgZGlyZWN0aW9uOiB2ZWMyPGYzMj4sIHN0ZXBzOiB1MzIpIC0+IHZlYzM8ZjMyPiB7XHJcbiAgICAgICAgICAgIGxldCBzYW1wbGVTdGFydCA9IHBvc2l0aW9uICsgZGlyZWN0aW9uICogMjtcclxuICAgICAgICAgICAgdmFyIHN1bSA9IHZlYzMoMC4pO1xyXG4gICAgICAgICAgICBsZXQgZlN0ZXBzID0gZjMyKHN0ZXBzKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAuOyBpIDwgZlN0ZXBzOyBpICs9IDEuKSB7XHJcbiAgICAgICAgICAgICAgICBzdW0gKz0gdGV4dHVyZUxvYWQodGV4dHVyZUluLCB2ZWMyPGkzMj4ocm91bmQoc2FtcGxlU3RhcnQgKyBpICogZGlyZWN0aW9uKSkpLnh5ejtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQGNvbXB1dGUgQHdvcmtncm91cF9zaXplKCR7V09SS0dST1VQX1NJWkV9KVxyXG4gICAgICAgIGZuIHNpbXVsYXRlKEBidWlsdGluKGdsb2JhbF9pbnZvY2F0aW9uX2lkKSBnbG9iYWxfaWQ6IHZlYzM8dTMyPikge1xyXG4gICAgICAgIGxldCBpbmRleCA9IGdsb2JhbF9pZC54O1xyXG4gICAgICAgIC8vIFRyaW0gb2ZmIHRoZSBleGNlc3MgaWYgYWdlbnRDb3VudCAlIFdPUktHUk9VUF9TSVpFICE9IDBcclxuICAgICAgICBpZiAoaW5kZXggPj0gJHtzaW11bGF0aW9uUGFyYW1ldGVycy5hZ2VudENvdW50fSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYWdlbnQgPSBhZ2VudHNbaW5kZXhdO1xyXG5cclxuICAgICAgICBhZ2VudC54ICs9IGFnZW50Lno7XHJcbiAgICAgICAgYWdlbnQueSArPSBhZ2VudC53O1xyXG5cclxuICAgICAgICBpZiAoYWdlbnQueCA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRofSB8fCBhZ2VudC54IDwgMCkge1xyXG4gICAgICAgICAgICBhZ2VudC56ID0gLWFnZW50Lno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhZ2VudC55ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0fSB8fCBhZ2VudC55IDwgMCkge1xyXG4gICAgICAgICAgICBhZ2VudC53ID0gLWFnZW50Lnc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmFuZG9tRGlyQ2hhbmdlID0gJHtzaW11bGF0aW9uUGFyYW1ldGVycy50dXJuSml0dGVyfSAqIHZlYzIoUmFuZG9tKHVuaWZvcm1zLnRpbWUgKyBnbG9iYWxfaWQueCkgLSAuNSwgUmFuZG9tKHVuaWZvcm1zLnRpbWUgKyBnbG9iYWxfaWQueCArICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0fSkgLSAuNSk7XHJcbiAgICAgICAgdmFyIHZlbG9jaXR5ID0gbm9ybWFsaXplKGFnZW50Lnp3ICsgcmFuZG9tRGlyQ2hhbmdlKTtcclxuXHJcbiAgICAgICAgLy8gVGFrZSBwaGVyb21vbmUgc2FtcGxlc1xyXG4gICAgICAgIGxldCByaWdodFNhbXBsZURpciA9IHJpZ2h0U2FtcGxlTWF0cml4ICogdmVsb2NpdHk7XHJcbiAgICAgICAgbGV0IHJpZ2h0U2FtcGxlUGl4ZWwgPSB2ZWMyPGkzMj4ocm91bmQoYWdlbnQueHkgKyAzICogcmlnaHRTYW1wbGVEaXIpKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZm9yd2FyZFNhbXBsZVBpeGVsID0gdmVjMjxpMzI+KHJvdW5kKGFnZW50Lnh5ICsgMyAqIHZlbG9jaXR5KSk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsZWZ0U2FtcGxlRGlyID0gbGVmdFNhbXBsZU1hdHJpeCAqIHZlbG9jaXR5O1xyXG5cclxuICAgICAgICBsZXQgcmlnaHRTYW1wbGUgPSBzYW1wbGVQaGVyb21vbmUoYWdlbnQueHksIHJpZ2h0U2FtcGxlRGlyLCAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLnNhbXBsZURpc3RhbmNlfSkueDtcclxuICAgICAgICBsZXQgZm9yd2FyZFNhbXBsZSA9IHNhbXBsZVBoZXJvbW9uZShhZ2VudC54eSwgdmVsb2NpdHksICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuc2FtcGxlRGlzdGFuY2V9KS54O1xyXG4gICAgICAgIGxldCBsZWZ0U2FtcGxlID0gc2FtcGxlUGhlcm9tb25lKGFnZW50Lnh5LCBsZWZ0U2FtcGxlRGlyLCAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLnNhbXBsZURpc3RhbmNlfSkueDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZm9yd2FyZFNhbXBsZSA8IHJpZ2h0U2FtcGxlIHx8IGZvcndhcmRTYW1wbGUgPCBsZWZ0U2FtcGxlKSB7XHJcbiAgICAgICAgICAgIGlmIChyaWdodFNhbXBsZSA+IGxlZnRTYW1wbGUpIHtcclxuICAgICAgICAgICAgICAgIHZlbG9jaXR5ICs9ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuc3RlZXJGYWN0b3J9ICogcmlnaHRTYW1wbGVEaXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eSArPSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLnN0ZWVyRmFjdG9yfSAqIGxlZnRTYW1wbGVEaXI7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gbm9ybWFsaXplKHZlbG9jaXR5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwaXhlbCA9IHZlYzI8aTMyPihyb3VuZChhZ2VudC54eSkpO1xyXG4gICAgICAgIHRleHR1cmVTdG9yZSh0ZXh0dXJlT3V0LCBwaXhlbCwgdmVjNCgxLiwgMC4sIDAuLCAxLikpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGFnZW50LnogPSB2ZWxvY2l0eS54O1xyXG4gICAgICAgIGFnZW50LncgPSB2ZWxvY2l0eS55O1xyXG4gICAgICAgIGFnZW50c1tpbmRleF0gPSBhZ2VudDtcclxuICAgICAgICB9YDtcclxuXHJcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICAgICAgdGhpcy5hZ2VudHNCdWZmZXIgPSBhZ2VudHNCdWZmZXI7XHJcbiAgICAgICAgdGhpcy53b3JrZ3JvdXBzID0gTWF0aC5jZWlsKHNpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnQgLyBXT1JLR1JPVVBfU0laRSk7XHJcblxyXG4gICAgICAgIHRoaXMudW5pZm9ybUJ1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgICAgICBzaXplOiA0LFxyXG4gICAgICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuVU5JRk9STSB8IEdQVUJ1ZmZlclVzYWdlLkNPUFlfRFNUXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVCaW5kR3JvdXBMYXlvdXQgPSBkZXZpY2UuY3JlYXRlQmluZEdyb3VwTGF5b3V0KHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInVuaWZvcm1cIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJ3cml0ZS1vbmx5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMixcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdG9yYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMyxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JhZ2VUZXh0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogdGV4dHVyZUZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBcInJlYWQtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVDb21wdXRlUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIFBpcGVsaW5lXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogZGV2aWNlLmNyZWF0ZVBpcGVsaW5lTGF5b3V0KHtcclxuICAgICAgICAgICAgICAgIGJpbmRHcm91cExheW91dHM6IFtjb21wdXRlQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNvbXB1dGU6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7Y29kZTogc2hhZGVyQ29kZX0pLFxyXG4gICAgICAgICAgICAgICAgZW50cnlQb2ludDogJ3NpbXVsYXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFzcyhjb21tYW5kRW5jb2RlcjogR1BVQ29tbWFuZEVuY29kZXIsIHRleHR1cmVJbjogR1BVVGV4dHVyZSwgdGV4dHVyZU91dDogR1BVVGV4dHVyZSwgdGltZXN0YW1wV3JpdGVzPzogR1BVUmVuZGVyUGFzc1RpbWVzdGFtcFdyaXRlcyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHVuaWZvcm1EYXRhID0gbmV3IFVpbnQzMkFycmF5KFt3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgKiAxMF0pO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtRGF0YSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdW5pZm9ybURhdGEubGVuZ3RoLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXBXcml0ZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMucGlwZWxpbmUuZ2V0QmluZEdyb3VwTGF5b3V0KDApLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogeyBidWZmZXI6IHRoaXMudW5pZm9ybUJ1ZmZlciB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0ZXh0dXJlT3V0LmNyZWF0ZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMixcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTp7IGJ1ZmZlcjogdGhpcy5hZ2VudHNCdWZmZXIgfSwgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHRleHR1cmVJbi5jcmVhdGVWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2ltdWxhdGVQYXNzID0gY29tbWFuZEVuY29kZXIuYmVnaW5Db21wdXRlUGFzcyhwYXNzRGVzY3JpcHRvcik7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLnNldFBpcGVsaW5lKHRoaXMucGlwZWxpbmUpO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5zZXRCaW5kR3JvdXAoMCwgdGhpcy5iaW5kR3JvdXApO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5kaXNwYXRjaFdvcmtncm91cHModGhpcy53b3JrZ3JvdXBzKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3MuZW5kKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBJU2ltdWxhdGlvblBhcmFtZXRlcnMgfSBmcm9tIFwiLi9zaW11bGF0aW9uQ29uZmlnXCI7XHJcblxyXG5jb25zdCBXT1JLR1JPVVBfU0laRSA9IDY0O1xyXG5cclxuZXhwb3J0IGNsYXNzIFRleHR1cmVQYXNzIHtcclxuICAgIGRldmljZTogR1BVRGV2aWNlO1xyXG4gICAgcGhlcm9tb25lVGV4dHVyZUluOiBHUFVUZXh0dXJlO1xyXG4gICAgcGhlcm9tb25lVGV4dHVyZU91dDogR1BVVGV4dHVyZTtcclxuXHJcbiAgICB3b3JrZ3JvdXBzOiBudW1iZXJbXTtcclxuICAgIGJpbmRHcm91cDogR1BVQmluZEdyb3VwO1xyXG4gICAgdW5pZm9ybUJ1ZmZlcjogR1BVQnVmZmVyO1xyXG4gICAgcGlwZWxpbmU6IEdQVUNvbXB1dGVQaXBlbGluZTtcclxuXHJcbiAgICBibHVyS2VybmVsOiBudW1iZXJbXVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRldmljZTogR1BVRGV2aWNlLCBzaW11bGF0aW9uUGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzLCBwaGVyb21vbmVUZXh0dXJlRm9ybWF0OiBHUFVUZXh0dXJlRm9ybWF0KSB7XHJcbiAgICAgICAgLy8gVE9ETyAtIFJlbW92ZSBVbmlmb3JtP1xyXG4gICAgICAgIGNvbnN0IHNoYWRlckNvZGUgPSBgXHJcbiAgICAgICAgc3RydWN0IFVuaWZvcm1zIHtcclxuICAgICAgICAgICAgY29sb3I6IHZlYzQ8ZjMyPlxyXG4gICAgICAgIH1cclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMCkgdmFyPHVuaWZvcm0+IHVuaWZvcm1zOiBVbmlmb3JtcztcclxuXHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDEpIHZhciB0ZXh0dXJlSW46IHRleHR1cmVfc3RvcmFnZV8yZDwke3BoZXJvbW9uZVRleHR1cmVGb3JtYXR9LCByZWFkPjtcclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMikgdmFyIHRleHR1cmVPdXQ6IHRleHR1cmVfc3RvcmFnZV8yZDwke3BoZXJvbW9uZVRleHR1cmVGb3JtYXR9LCB3cml0ZT47XHJcblxyXG4gICAgICAgIEBjb21wdXRlIEB3b3JrZ3JvdXBfc2l6ZSg4LCA4KVxyXG4gICAgICAgIGZuIGF0dGVudWF0ZShAYnVpbHRpbihnbG9iYWxfaW52b2NhdGlvbl9pZCkgZ2xvYmFsX2lkOiB2ZWMzPHUzMj4pIHtcclxuICAgICAgICAgICAgaWYgKGdsb2JhbF9pZC54ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGh9IHx8IGdsb2JhbF9pZC55ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0fSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgcGl4ZWwgPSBnbG9iYWxfaWQueHk7XHJcblxyXG4gICAgICAgICAgICAvLyBEZWZpbmUgR2F1c3NpYW4ga2VybmVsICgzeDMpXHJcbiAgICAgICAgICAgIGxldCBvcnRobyA9IC4wNTtcclxuICAgICAgICAgICAgbGV0IGRpYWcgPSAuMDE7XHJcbiAgICAgICAgICAgIGxldCBrZXJuZWwgPSBhcnJheTxhcnJheTxmMzIsIDM+LCAzPihcclxuICAgICAgICAgICAgICAgIGFycmF5PGYzMiwgMz4oZGlhZywgb3J0aG8sIGRpYWcpLFxyXG4gICAgICAgICAgICAgICAgYXJyYXk8ZjMyLCAzPihvcnRobywgIC43LCAgb3J0aG8pLFxyXG4gICAgICAgICAgICAgICAgYXJyYXk8ZjMyLCAzPihkaWFnLCBvcnRobywgZGlhZylcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb2xvclN1bSA9IHZlYzMoMC4pO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIG5laWdoYm9yaW5nIHBpeGVscyAoM3gzIGtlcm5lbClcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogaTMyID0gLTE7IGkgPD0gMTsgaSA9IGkgKyAxKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqOiBpMzIgPSAtMTsgaiA8PSAxOyBqID0gaiArIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2FtcGxlUGl4ZWw9IHZlYzIoaTMyKGdsb2JhbF9pZC54KSArIGksIGkzMihnbG9iYWxfaWQueSkgKyBqKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRW5zdXJlIHdlIGRvbid0IHNhbXBsZSBvdXQgb2YgYm91bmRzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNhbXBsZVBpeGVsLnggPCAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRofSAmJiBzYW1wbGVQaXhlbC55IDwgJHtzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHR9KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzYW1wbGVDb2xvciA9IHRleHR1cmVMb2FkKHRleHR1cmVJbiwgc2FtcGxlUGl4ZWwpLnh5ejsgLy8gTG9hZCBuZWlnaGJvcmluZyBwaXhlbCBjb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvclN1bSArPSBzYW1wbGVDb2xvciAqIGtlcm5lbFtpICsgMV1baiArIDFdOyAvLyBBcHBseSBHYXVzc2lhbiBrZXJuZWxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbG9yU3VtID0gbWF4KHZlYzMoMC4pLCBjb2xvclN1bSAtIHZlYzMoJHtzaW11bGF0aW9uUGFyYW1ldGVycy5wYXNzaXZlQXR0ZW51YXRpb259KSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0dXJlU3RvcmUodGV4dHVyZU91dCwgcGl4ZWwsIHZlYzQoY29sb3JTdW0sIDEuMCkpOyAvLyBTdG9yZSBibHVycmVkIGNvbG9yXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYDtcclxuXHJcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICAgICAgdGhpcy53b3JrZ3JvdXBzID0gW01hdGguY2VpbChzaW11bGF0aW9uUGFyYW1ldGVycy53aWR0aCAvIDgpLCBNYXRoLmNlaWwoc2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0IC8gOCldO1xyXG5cclxuICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgc2l6ZTogMTYsXHJcbiAgICAgICAgICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZS5VTklGT1JNIHwgR1BVQnVmZmVyVXNhZ2UuQ09QWV9EU1RcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBDb2xvclxyXG4gICAgICAgIGNvbnN0IHVuaWZvcm1EYXRhID0gbmV3IFVpbnQzMkFycmF5KFtcclxuICAgICAgICAgICAgMC4sXHJcbiAgICAgICAgICAgIDEuLFxyXG4gICAgICAgICAgICAxLixcclxuICAgICAgICAgICAgMS4sXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHVuaWZvcm1EYXRhLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtRGF0YS5sZW5ndGgsXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29tcHV0ZUJpbmRHcm91cExheW91dCA9IGRldmljZS5jcmVhdGVCaW5kR3JvdXBMYXlvdXQoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIEJpbmQgR3JvdXAgTGF5b3V0XCIsXHJcbiAgICAgICAgICAgIGVudHJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidW5pZm9ybVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMSxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JhZ2VUZXh0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogcGhlcm9tb25lVGV4dHVyZUZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBcInJlYWQtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHBoZXJvbW9uZVRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJ3cml0ZS1vbmx5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0gYXMgR1BVQmluZEdyb3VwTGF5b3V0RW50cnlbXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBpcGVsaW5lID0gZGV2aWNlLmNyZWF0ZUNvbXB1dGVQaXBlbGluZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gUGlwZWxpbmVcIixcclxuICAgICAgICAgICAgbGF5b3V0OiBkZXZpY2UuY3JlYXRlUGlwZWxpbmVMYXlvdXQoe1xyXG4gICAgICAgICAgICAgICAgYmluZEdyb3VwTGF5b3V0czogW2NvbXB1dGVCaW5kR3JvdXBMYXlvdXRdLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgY29tcHV0ZToge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiBkZXZpY2UuY3JlYXRlU2hhZGVyTW9kdWxlKHtjb2RlOiBzaGFkZXJDb2RlfSksXHJcbiAgICAgICAgICAgICAgICBlbnRyeVBvaW50OiAnYXR0ZW51YXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFzcyhjb21tYW5kRW5jb2RlcjogR1BVQ29tbWFuZEVuY29kZXIsIHRleHR1cmVJbjogR1BVVGV4dHVyZSwgdGV4dHVyZU91dDogR1BVVGV4dHVyZSwgdGltZXN0YW1wV3JpdGVzPzogR1BVUmVuZGVyUGFzc1RpbWVzdGFtcFdyaXRlcyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXBXcml0ZXNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYmluZEdyb3VwID0gdGhpcy5kZXZpY2UuY3JlYXRlQmluZEdyb3VwKHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBCaW5kIEdyb3VwXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogdGhpcy5waXBlbGluZS5nZXRCaW5kR3JvdXBMYXlvdXQoMCksXHJcbiAgICAgICAgICAgIGVudHJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7IGJ1ZmZlcjogdGhpcy51bmlmb3JtQnVmZmVyIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHRleHR1cmVJbi5jcmVhdGVWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHRleHR1cmVPdXQuY3JlYXRlVmlldygpLCBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSBhcyBHUFVCaW5kR3JvdXBFbnRyeVtdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNpbXVsYXRlUGFzcyA9IGNvbW1hbmRFbmNvZGVyLmJlZ2luQ29tcHV0ZVBhc3MocGFzc0Rlc2NyaXB0b3IpO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5zZXRQaXBlbGluZSh0aGlzLnBpcGVsaW5lKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3Muc2V0QmluZEdyb3VwKDAsIHRoaXMuYmluZEdyb3VwKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3MuZGlzcGF0Y2hXb3JrZ3JvdXBzKHRoaXMud29ya2dyb3Vwc1swXSwgdGhpcy53b3JrZ3JvdXBzWzFdKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3MuZW5kKCk7XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFJlbmRlclBhc3MgfSBmcm9tIFwiLi9yZW5kZXJQYXNzXCI7XHJcbmltcG9ydCB7IGdldEFnZW50c0FycmF5LCBJU2ltdWxhdGlvblBhcmFtZXRlcnMgfSBmcm9tIFwiLi9zaW11bGF0aW9uQ29uZmlnXCI7XHJcbmltcG9ydCB7IFNpbXVsYXRpb25QYXNzIH0gZnJvbSBcIi4vc2ltdWxhdGlvblBhc3NcIjtcclxuaW1wb3J0IHsgVGV4dHVyZVBhc3MgfSBmcm9tIFwiLi90ZXh0dXJlQ29tcHV0ZVBhc3NcIjtcclxuXHJcbmNvbnN0IE5VTUJFUl9PRl9QQVNTRVMgPSAyO1xyXG5cclxuY29uc3Qgc2ltdWxhdGlvblBhcmFtZXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycyA9IHtcclxuICAgIGFnZW50Q291bnQ6IDFfMDAwXzAwMCxcclxuICAgIGhlaWdodDogMCxcclxuICAgIHdpZHRoOiAwLFxyXG4gICAgdHVybkppdHRlcjogLjQsXHJcbiAgICBzdGVlckZhY3RvcjogMC4yLFxyXG4gICAgc2FtcGxlRGlzdGFuY2U6IDEwLFxyXG4gICAgcGFzc2l2ZUF0dGVudWF0aW9uOiAuMDAxLFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnbygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY29uc3QgYWRhcHRlciA9IGF3YWl0IG5hdmlnYXRvci5ncHUucmVxdWVzdEFkYXB0ZXIoKTtcclxuICAgIGNvbnN0IGhhc1RpbWVzdGFtcFF1ZXJ5ID0gYWRhcHRlci5mZWF0dXJlcy5oYXMoXCJ0aW1lc3RhbXAtcXVlcnlcIik7XHJcbiAgICBjb25zdCBkZXZpY2UgPSBhd2FpdCBhZGFwdGVyLnJlcXVlc3REZXZpY2Uoe1xyXG4gICAgICAgIHJlcXVpcmVkRmVhdHVyZXM6IGhhc1RpbWVzdGFtcFF1ZXJ5ID8gW1widGltZXN0YW1wLXF1ZXJ5XCJdIGFzIEdQVUZlYXR1cmVOYW1lW106IFtdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUGVyZm9ybWFuY2UgU3RhdGlzdGljcyBEb2N1bWVudCBTZXR1cFxyXG4gICAgY29uc3QgcGVyZkRpc3BsYXlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLmNvbG9yID0gJ3doaXRlJztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLmJhY2tkcm9wRmlsdGVyID0gJ2JsdXIoMTBweCknO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUuYm90dG9tID0gJzEwcHgnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUubGVmdCA9ICcxMHB4JztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLnRleHRBbGlnbiA9ICdsZWZ0JztcclxuICAgIGNvbnN0IHBlcmZEaXNwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncHJlJyk7XHJcbiAgICBwZXJmRGlzcGxheS5zdHlsZS5tYXJnaW4gPSAnLjVlbSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5hcHBlbmRDaGlsZChwZXJmRGlzcGxheSk7XHJcbiAgICBjYW52YXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChwZXJmRGlzcGxheUNvbnRhaW5lcik7XHJcbiAgICBsZXQgc2ltdWxhdGlvbkR1cmF0aW9uU3VtID0gMDtcclxuICAgIGxldCByZW5kZXJEdXJhdGlvblN1bSA9IDA7XHJcbiAgICBsZXQgdGltZXJTYW1wbGVzID0gMDtcclxuXHJcbiAgICBjb25zdCBzcGFyZVBlcmZUaW1lQnVmZmVyczogR1BVQnVmZmVyW10gPSBbXTtcclxuICAgIGxldCBxdWVyeVNldDogR1BVUXVlcnlTZXQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICBsZXQgcGVyZlJlc29sdmVCdWZmZXI6IEdQVUJ1ZmZlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIGxldCBzaW11bGF0aW9uUGVyZlRpbWVTdGFtcFdyaXRlczogR1BVQ29tcHV0ZVBhc3NUaW1lc3RhbXBXcml0ZXMgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICBsZXQgcmVuZGVyUGVyZlRpbWVTdGFtcFdyaXRlczogR1BVUmVuZGVyUGFzc1RpbWVzdGFtcFdyaXRlcyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIGlmIChoYXNUaW1lc3RhbXBRdWVyeSkge1xyXG4gICAgICAgIHBlcmZEaXNwbGF5LnRleHRDb250ZW50ID0gYFxcXHJcbmF2ZyBzaW11bGF0aW9uIGR1cmF0aW9uOiDigJQgwrVzXHJcbmF2ZyByZW5kZXIgZHVyYXRpb246ICDigJQgwrVzXHJcbnNwYXJlIHBlcmYgYnVmZmVyczogICAg4oCUYDtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcXVlcnlTZXQgPSBkZXZpY2UuY3JlYXRlUXVlcnlTZXQoe1xyXG4gICAgICAgICAgICB0eXBlOiBcInRpbWVzdGFtcFwiLFxyXG4gICAgICAgICAgICBjb3VudDogMiAqIE5VTUJFUl9PRl9QQVNTRVMsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcGVyZlJlc29sdmVCdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgbGFiZWw6IFwicGVyZlJlc29sdmVcIixcclxuICAgICAgICAgICAgc2l6ZTogNCAqIEJpZ0ludDY0QXJyYXkuQllURVNfUEVSX0VMRU1FTlQgKiBOVU1CRVJfT0ZfUEFTU0VTLFxyXG4gICAgICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuUVVFUllfUkVTT0xWRSB8IEdQVUJ1ZmZlclVzYWdlLkNPUFlfU1JDLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNpbXVsYXRpb25QZXJmVGltZVN0YW1wV3JpdGVzID0ge1xyXG4gICAgICAgICAgICBxdWVyeVNldCxcclxuICAgICAgICAgICAgYmVnaW5uaW5nT2ZQYXNzV3JpdGVJbmRleDogMCxcclxuICAgICAgICAgICAgZW5kT2ZQYXNzV3JpdGVJbmRleDogMSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICByZW5kZXJQZXJmVGltZVN0YW1wV3JpdGVzID0ge1xyXG4gICAgICAgICAgICBxdWVyeVNldCxcclxuICAgICAgICAgICAgYmVnaW5uaW5nT2ZQYXNzV3JpdGVJbmRleDogMixcclxuICAgICAgICAgICAgZW5kT2ZQYXNzV3JpdGVJbmRleDogMyxcclxuICAgICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgc2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGggPSBjYW52YXMud2lkdGg7XHJcbiAgICBzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xyXG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJncHUnKSBhcyB1bmtub3duIGFzIEdQVUNhbnZhc0NvbnRleHQ7XHJcbiAgICBjb25zdCBwcmVzZW50YXRpb25Gb3JtYXQgPSBuYXZpZ2F0b3IuZ3B1LmdldFByZWZlcnJlZENhbnZhc0Zvcm1hdCgpO1xyXG4gICAgY29udGV4dC5jb25maWd1cmUoe1xyXG4gICAgICAgIGRldmljZSxcclxuICAgICAgICBmb3JtYXQ6IHByZXNlbnRhdGlvbkZvcm1hdCxcclxuICAgICAgICBhbHBoYU1vZGU6ICdwcmVtdWx0aXBsaWVkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcGhlcm9tb25lVGV4dHVyZXMgPSBbXHJcbiAgICAgICAgZGV2aWNlLmNyZWF0ZVRleHR1cmUoe1xyXG4gICAgICAgICAgICBzaXplOiBbY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0XSxcclxuICAgICAgICAgICAgZm9ybWF0OiAgJ3JnYmE4dW5vcm0nLFxyXG4gICAgICAgICAgICB1c2FnZTogXHJcbiAgICAgICAgICAgICAgICBHUFVUZXh0dXJlVXNhZ2UuVEVYVFVSRV9CSU5ESU5HIHxcclxuICAgICAgICAgICAgICAgIEdQVVRleHR1cmVVc2FnZS5TVE9SQUdFX0JJTkRJTkdcclxuICAgICAgICB9KSxcclxuICAgICAgICBkZXZpY2UuY3JlYXRlVGV4dHVyZSh7XHJcbiAgICAgICAgICAgIHNpemU6IFtjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHRdLFxyXG4gICAgICAgICAgICBmb3JtYXQ6ICAncmdiYTh1bm9ybScsXHJcbiAgICAgICAgICAgIHVzYWdlOiBcclxuICAgICAgICAgICAgICAgIEdQVVRleHR1cmVVc2FnZS5URVhUVVJFX0JJTkRJTkcgfFxyXG4gICAgICAgICAgICAgICAgR1BVVGV4dHVyZVVzYWdlLlNUT1JBR0VfQklORElOR1xyXG4gICAgICAgIH0pLFxyXG4gICAgXTtcclxuXHJcbiAgICBjb25zdCBhZ2VudHNCdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICBsYWJlbDogXCJhZ2VudHNcIixcclxuICAgICAgICBzaXplOiAxNiAqIHNpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnQsXHJcbiAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLlNUT1JBR0UsXHJcbiAgICAgICAgbWFwcGVkQXRDcmVhdGlvbjogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgbmV3IEZsb2F0MzJBcnJheShhZ2VudHNCdWZmZXIuZ2V0TWFwcGVkUmFuZ2UoKSkuc2V0KGdldEFnZW50c0FycmF5KHNpbXVsYXRpb25QYXJhbWV0ZXJzKSk7XHJcbiAgICBhZ2VudHNCdWZmZXIudW5tYXAoKTtcclxuXHJcbiAgICBjb25zdCB0ZXh0dXJlUGFzcyA9IG5ldyBUZXh0dXJlUGFzcyhkZXZpY2UsIHNpbXVsYXRpb25QYXJhbWV0ZXJzLCBwaGVyb21vbmVUZXh0dXJlc1swXS5mb3JtYXQpXHJcblxyXG4gICAgY29uc3Qgc2ltdWxhdGlvblBhc3MgPSBuZXcgU2ltdWxhdGlvblBhc3MoZGV2aWNlLCBzaW11bGF0aW9uUGFyYW1ldGVycywgcGhlcm9tb25lVGV4dHVyZXNbMF0uZm9ybWF0LCBhZ2VudHNCdWZmZXIpO1xyXG5cclxuICAgIGNvbnN0IHJlbmRlclBhc3MgPSBuZXcgUmVuZGVyUGFzcyhkZXZpY2UsIHBoZXJvbW9uZVRleHR1cmVzWzBdLmZvcm1hdCk7XHJcblxyXG4gICAgbGV0IHBoZXJvbW9uZUluZGV4ID0gMDtcclxuICAgIGNvbnN0IGZyYW1lID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmRFbmNvZGVyID0gZGV2aWNlLmNyZWF0ZUNvbW1hbmRFbmNvZGVyKCk7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZUluSW5kZXggPSBwaGVyb21vbmVJbmRleDtcclxuICAgICAgICBjb25zdCB0ZXh0dXJlT3V0SW5kZXggPSAocGhlcm9tb25lSW5kZXggKyAxKSAlIDJcclxuICAgICAgICBcclxuICAgICAgICB0ZXh0dXJlUGFzcy5hZGRQYXNzKGNvbW1hbmRFbmNvZGVyLCBwaGVyb21vbmVUZXh0dXJlc1t0ZXh0dXJlSW5JbmRleF0sIHBoZXJvbW9uZVRleHR1cmVzW3RleHR1cmVPdXRJbmRleF0pXHJcblxyXG4gICAgICAgIHNpbXVsYXRpb25QYXNzLmFkZFBhc3MoY29tbWFuZEVuY29kZXIsIHBoZXJvbW9uZVRleHR1cmVzW3RleHR1cmVJbkluZGV4XSwgcGhlcm9tb25lVGV4dHVyZXNbdGV4dHVyZU91dEluZGV4XSwgc2ltdWxhdGlvblBlcmZUaW1lU3RhbXBXcml0ZXMpO1xyXG5cclxuICAgICAgICBjb25zdCBjYW52YXNUZXh0dXJlVmlldyA9IGNvbnRleHQuZ2V0Q3VycmVudFRleHR1cmUoKS5jcmVhdGVWaWV3KCk7XHJcbiAgICAgICAgcmVuZGVyUGFzcy5hZGRQYXNzKGNvbW1hbmRFbmNvZGVyLCBwaGVyb21vbmVUZXh0dXJlc1twaGVyb21vbmVJbmRleF0sIGNhbnZhc1RleHR1cmVWaWV3LCByZW5kZXJQZXJmVGltZVN0YW1wV3JpdGVzKTtcclxuICAgICAgICBwaGVyb21vbmVJbmRleCA9IHRleHR1cmVPdXRJbmRleDtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdEJ1ZmZlcjogR1BVQnVmZmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmIChoYXNUaW1lc3RhbXBRdWVyeSkge1xyXG4gICAgICAgICAgICByZXN1bHRCdWZmZXIgPSBzcGFyZVBlcmZUaW1lQnVmZmVycy5wb3AoKSB8fCBcclxuICAgICAgICAgICAgICAgIGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IDQgKiBCaWdJbnQ2NEFycmF5LkJZVEVTX1BFUl9FTEVNRU5UICogTlVNQkVSX09GX1BBU1NFUyxcclxuICAgICAgICAgICAgICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuQ09QWV9EU1QgfCBHUFVCdWZmZXJVc2FnZS5NQVBfUkVBRCxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb21tYW5kRW5jb2Rlci5yZXNvbHZlUXVlcnlTZXQocXVlcnlTZXQsIDAsIDIgKiBOVU1CRVJfT0ZfUEFTU0VTLCBwZXJmUmVzb2x2ZUJ1ZmZlciwgMCk7XHJcbiAgICAgICAgICAgIGNvbW1hbmRFbmNvZGVyLmNvcHlCdWZmZXJUb0J1ZmZlcihcclxuICAgICAgICAgICAgICAgIHBlcmZSZXNvbHZlQnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIHJlc3VsdEJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRCdWZmZXIuc2l6ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGV2aWNlLnF1ZXVlLnN1Ym1pdChbY29tbWFuZEVuY29kZXIuZmluaXNoKCldKTtcclxuXHJcbiAgICAgICAgaWYgKGhhc1RpbWVzdGFtcFF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdEJ1ZmZlci5tYXBBc3luYyhHUFVNYXBNb2RlLlJFQUQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZXMgPSBuZXcgQmlnSW50NjRBcnJheShyZXN1bHRCdWZmZXIuZ2V0TWFwcGVkUmFuZ2UoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaW11bGF0aW9uRHVyYXRpb24gPSBOdW1iZXIodGltZXNbMV0gLSB0aW1lc1swXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJEdXJhdGlvbiA9IE51bWJlcih0aW1lc1szXSAtIHRpbWVzWzJdKTtcclxuICAgICAgICAgICAgICAgIGlmIChzaW11bGF0aW9uRHVyYXRpb24gPiAwICYmIHJlbmRlckR1cmF0aW9uID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbXVsYXRpb25EdXJhdGlvblN1bSArPSBzaW11bGF0aW9uRHVyYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRHVyYXRpb25TdW0gKz0gcmVuZGVyRHVyYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXJTYW1wbGVzKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHRCdWZmZXIudW5tYXAoKTtcclxuICAgICAgICAgICAgICAgIHNwYXJlUGVyZlRpbWVCdWZmZXJzLnB1c2gocmVzdWx0QnVmZmVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBrTnVtVGltZXJTYW1wbGVzUGVyVXBkYXRlID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRpbWVyU2FtcGxlcyA+PSBrTnVtVGltZXJTYW1wbGVzUGVyVXBkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXZnU2ltdWxhdGlvbk1pY3Jvc2Vjb25kcyA9IE1hdGgucm91bmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbXVsYXRpb25EdXJhdGlvblN1bSAvIHRpbWVyU2FtcGxlcyAvIDEwMDBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF2Z1JlbmRlck1pY3Jvc2Vjb25kcyA9IE1hdGgucm91bmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckR1cmF0aW9uU3VtIC8gdGltZXJTYW1wbGVzIC8gMTAwMFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyZkRpc3BsYXkudGV4dENvbnRlbnQgPSBgXFxcclxuYXZnIHNpbXVsYXRpb24gZHVyYXRpb246ICR7YXZnU2ltdWxhdGlvbk1pY3Jvc2Vjb25kc33CtXNcclxuYXZnIHJlbmRlciBkdXJhdGlvbjogICR7YXZnUmVuZGVyTWljcm9zZWNvbmRzfcK1c1xyXG5zcGFyZSBwZXJmIGJ1ZmZlcnM6ICAgICR7c3BhcmVQZXJmVGltZUJ1ZmZlcnMubGVuZ3RofWA7XHJcbiAgICAgICAgICAgICAgICAgICAgc2ltdWxhdGlvbkR1cmF0aW9uU3VtID0gMDtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXJEdXJhdGlvblN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXJTYW1wbGVzID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xyXG4gICAgfTtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZSk7XHJcbn1cclxuXHJcbmdvKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9