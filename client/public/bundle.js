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
/* harmony export */   getAgentsArray: () => (/* binding */ getAgentsArray),
/* harmony export */   simulationParameters: () => (/* binding */ simulationParameters)
/* harmony export */ });
var simulationParameters = {
    agentCount: 100,
    height: 0,
    width: 0,
    turnJitter: 0,
    steerFactor: .5,
    sampleDistance: 5,
    passiveAttenuation: .001,
};
document.addEventListener("DOMContentLoaded", function () {
    addSlider("Jitter", "turnJitter", 0.5, 0, 1.5);
    addSlider("Steering", "steerFactor", 0.5, 0, 1);
});
var configPanel = document.getElementById("config");
function addSlider(name, configKey, initialValue, min, max) {
    var sliderLabel = document.createElement("label");
    sliderLabel.setAttribute("for", name);
    sliderLabel.innerText = name;
    var sliderInput = document.createElement("input");
    sliderInput.setAttribute("id", name);
    sliderInput.setAttribute("type", "range");
    sliderInput.setAttribute("value", String(initialValue));
    sliderInput.setAttribute("step", String(0.01));
    sliderInput.setAttribute("min", String(min));
    sliderInput.setAttribute("max", String(max));
    var sliderDisplay = document.createElement("span");
    configPanel.append(sliderLabel, sliderInput, sliderDisplay);
    var onUpdate = function () {
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
        var shaderCode = "\n        // Hash function from H. Schechter & R. Bridson, goo.gl/RXiKaH\n        fn Hash(p: u32) -> u32\n        {\n            var s = p; \n            s ^= 2747636419u;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            return s;\n        }\n\n        fn Random(seed: u32) -> f32\n        {\n            return f32(Hash(seed)) / 4294967295.0; // 2^32-1\n        }\n\n        struct Uniforms {\n            time: u32,\n            turnJitter: f32,\n            steerFactor: f32,\n        }\n\n        @group(0) @binding(0) var<uniform> uniforms: Uniforms;\n\n        @group(0) @binding(1) var textureOut: texture_storage_2d<".concat(textureFormat, ", write>;\n        @group(0) @binding(2) var<storage, read_write> agents: array<vec4f, ").concat(simulationParameters.agentCount, ">;\n        @group(0) @binding(3) var textureIn: texture_storage_2d<").concat(textureFormat, ", read>;\n\n        const leftSampleMatrix =  mat2x2(0.866025, 0.5, -0.5, 0.866025);\n        const rightSampleMatrix = mat2x2(0.866025, -0.5, 0.5, 0.866025);\n        fn samplePheromone(position: vec2<f32>, direction: vec2<f32>, steps: u32) -> vec3<f32> {\n            let sampleStart = position + direction * 2;\n            var sum = vec3(0.);\n            let fSteps = f32(steps);\n            for (var i = 0.; i < fSteps; i += 1.) {\n                sum += textureLoad(textureIn, vec2<i32>(round(sampleStart + i * direction))).xyz;\n            }\n            return sum;\n        }\n\n        @compute @workgroup_size(").concat(WORKGROUP_SIZE, ")\n        fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {\n        let index = global_id.x;\n        // Trim off the excess if agentCount % WORKGROUP_SIZE != 0\n        if (index >= ").concat(simulationParameters.agentCount, ") {\n            return;\n        }\n\n        var agent = agents[index];\n\n        agent.x += agent.z;\n        agent.y += agent.w;\n\n        if (agent.x >= ").concat(simulationParameters.width, " || agent.x < 0) {\n            agent.z = -agent.z;\n        }\n        if (agent.y >= ").concat(simulationParameters.height, " || agent.y < 0) {\n            agent.w = -agent.w;\n        }\n\n        let randomDirChange = uniforms.turnJitter * vec2(Random(uniforms.time + global_id.x) - .5, Random(uniforms.time + global_id.x + ").concat(simulationParameters.height, ") - .5);\n        var velocity = normalize(agent.zw + randomDirChange);\n\n        // Take pheromone samples\n        let rightSampleDir = rightSampleMatrix * velocity;\n        let rightSamplePixel = vec2<i32>(round(agent.xy + 3 * rightSampleDir));\n        \n        let forwardSamplePixel = vec2<i32>(round(agent.xy + 3 * velocity));\n\n        \n        let leftSampleDir = leftSampleMatrix * velocity;\n\n        let rightSample = samplePheromone(agent.xy, rightSampleDir, ").concat(simulationParameters.sampleDistance, ").x;\n        let forwardSample = samplePheromone(agent.xy, velocity, ").concat(simulationParameters.sampleDistance, ").x;\n        let leftSample = samplePheromone(agent.xy, leftSampleDir, ").concat(simulationParameters.sampleDistance, ").x;\n        \n        if (forwardSample < rightSample || forwardSample < leftSample) {\n            if (rightSample > leftSample) {\n                velocity += uniforms.steerFactor * rightSampleDir;\n            } else {\n                velocity += uniforms.steerFactor * leftSampleDir;\n             }\n            velocity = normalize(velocity);\n        }\n\n        let pixel = vec2<i32>(round(agent.xy));\n        textureStore(textureOut, pixel, vec4(1., 0., 0., 1.));\n        \n        agent.z = velocity.x;\n        agent.w = velocity.y;\n        agents[index] = agent;\n        }");
        this.device = device;
        this.agentsBuffer = agentsBuffer;
        this.workgroups = Math.ceil(simulationParameters.agentCount / WORKGROUP_SIZE);
        this.simulationParameters = simulationParameters;
        this.uniformBuffer = device.createBuffer({
            size: 12,
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
        var uniformInts = new Uint32Array([window.performance.now() * 10]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFHLFlBQVksR0FBRyxJQUFJLENBQzFDLENBQUM7b0NBQ0YsV0FBVyxDQUFDLFdBQVcsR0FBRyxtQ0FDbkIseUJBQXlCLDRDQUM1QixxQkFBcUIsNkNBQ3BCLG9CQUFvQixDQUFDLE1BQU0sQ0FBRSxDQUFDO29DQUNuQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7b0NBQzFCLGlCQUFpQixHQUFHLENBQUMsQ0FBQztvQ0FDdEIsWUFBWSxHQUFHLENBQUMsQ0FBQztnQ0FFckIsQ0FBQzs0QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDO3dCQUNELHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNqQyxDQUFDLENBQUM7b0JBQ0YscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7O0NBQ2hDO0FBRUQsRUFBRSxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcmVuZGVyUGFzcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvbkNvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvblBhc3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RleHR1cmVDb21wdXRlUGFzcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIHtcclxuICAgIGRldmljZTogR1BVRGV2aWNlO1xyXG4gICAgYmluZEdyb3VwOiBHUFVCaW5kR3JvdXA7XHJcbiAgICBwaXBlbGluZTogR1BVUmVuZGVyUGlwZWxpbmU7XHJcbiAgICBzYW1wbGVyOiBHUFVTYW1wbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRldmljZTogR1BVRGV2aWNlLCB0ZXh0dXJlRm9ybWF0OiBHUFVUZXh0dXJlRm9ybWF0KSB7XHJcbiAgICAgICAgY29uc3Qgc2hhZGVyQ29kZSA9IGBcclxuQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhciB0ZXh0dXJlSW46IHRleHR1cmVfMmQ8ZjMyPjtcclxuQGdyb3VwKDApIEBiaW5kaW5nKDEpIHZhciBzYW1wbGVySW46IHNhbXBsZXI7XHJcblxyXG5zdHJ1Y3QgVmVydGV4T3V0IHtcclxuICAgIEBidWlsdGluKHBvc2l0aW9uKSBwb3NpdGlvbiA6IHZlYzRmLFxyXG4gICAgQGxvY2F0aW9uKDApIHV2IDogdmVjMmYsXHJcbn1cclxuXHJcbkB2ZXJ0ZXhcclxuZm4gdmVydGV4X21haW4oQGJ1aWx0aW4odmVydGV4X2luZGV4KSBWZXJ0ZXhJbmRleDogdTMyKSAtPiBWZXJ0ZXhPdXRcclxue1xyXG4gICAgdmFyIHZlcnRpY2VzID0gYXJyYXk8dmVjMmYsIDY+KFxyXG4gICAgdmVjMigtMSwgLTEpLFxyXG4gICAgdmVjMigxLCAtMSksXHJcbiAgICB2ZWMyKC0xLCAxKSxcclxuICAgIHZlYzIoMSwgMSksXHJcbiAgICB2ZWMyKDEsIC0xKSxcclxuICAgIHZlYzIoLTEsIDEpLFxyXG4gICAgKTtcclxuICAgIHZhciB1dnMgPSBhcnJheTx2ZWMyZiwgNj4gKFxyXG4gICAgdmVjMigwLCAwKSxcclxuICAgIHZlYzIoMSwgMCksXHJcbiAgICB2ZWMyKDAsIDEpLFxyXG4gICAgdmVjMigxLCAxKSxcclxuICAgIHZlYzIoMSwgMCksXHJcbiAgICB2ZWMyKDAsIDEpLFxyXG4gICAgKTtcclxuICAgIHZhciBvdXRwdXQgOiBWZXJ0ZXhPdXQ7XHJcbiAgICBvdXRwdXQucG9zaXRpb24gPSB2ZWM0KHZlcnRpY2VzW1ZlcnRleEluZGV4XSwgMCwgMSk7XHJcbiAgICBvdXRwdXQudXYgPSB1dnNbVmVydGV4SW5kZXhdO1xyXG4gICAgXHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG59XHJcblxyXG5AZnJhZ21lbnRcclxuZm4gZnJhZ21lbnRfbWFpbihmcmFnRGF0YTogVmVydGV4T3V0KSAtPiBAbG9jYXRpb24oMCkgdmVjNGZcclxue1xyXG4gICAgcmV0dXJuIHZlYzQodGV4dHVyZVNhbXBsZSh0ZXh0dXJlSW4sIHNhbXBsZXJJbiwgZnJhZ0RhdGEudXYpLnh5eiwgMSk7XHJcbn1gO1xyXG4gICAgICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgICAgIHRoaXMuc2FtcGxlciA9IGRldmljZS5jcmVhdGVTYW1wbGVyKHtcclxuICAgICAgICAgICAgbWluRmlsdGVyOiBcImxpbmVhclwiLFxyXG4gICAgICAgICAgICBtYWdGaWx0ZXI6IFwibGluZWFyXCIsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyQmluZEdyb3VwTGF5b3V0ID0gZGV2aWNlLmNyZWF0ZUJpbmRHcm91cExheW91dCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5GUkFHTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogdGV4dHVyZUZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBcInJlYWQtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuRlJBR01FTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgc2FtcGxlcjogdGhpcy5zYW1wbGVyLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W10sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyU2hhZGVyTW9kdWxlID0gZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7XHJcbiAgICAgICAgICAgIGNvZGU6IHNoYWRlckNvZGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVSZW5kZXJQaXBlbGluZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBQaXBlbGluZVwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IGRldmljZS5jcmVhdGVQaXBlbGluZUxheW91dCh7XHJcbiAgICAgICAgICAgICAgICBiaW5kR3JvdXBMYXlvdXRzOiBbcmVuZGVyQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHZlcnRleDoge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiByZW5kZXJTaGFkZXJNb2R1bGUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZyYWdtZW50OiB7XHJcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHJlbmRlclNoYWRlck1vZHVsZSxcclxuICAgICAgICAgICAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogbmF2aWdhdG9yLmdwdS5nZXRQcmVmZXJyZWRDYW52YXNGb3JtYXQoKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJpbWl0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICB0b3BvbG9neTogJ3RyaWFuZ2xlLWxpc3QnLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFzcyhjb21tYW5kRW5jb2RlcjogR1BVQ29tbWFuZEVuY29kZXIsIHBoZXJvbW9uZVRleHR1cmU6IEdQVVRleHR1cmUsIHRhcmdldFZpZXc6IEdQVVRleHR1cmVWaWV3LCB0aW1lc3RhbXBXcml0ZXM/OiBHUFVSZW5kZXJQYXNzVGltZXN0YW1wV3JpdGVzKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyUGFzc0Rlc2NyaXB0b3I6IEdQVVJlbmRlclBhc3NEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnRzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldzogdGFyZ2V0VmlldyxcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclZhbHVlOiBbMCwgMCwgMCwgMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZE9wOiAnY2xlYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlT3A6ICdzdG9yZScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVVJlbmRlclBhc3NDb2xvckF0dGFjaG1lbnRbXSxcclxuICAgICAgICAgICAgdGltZXN0YW1wV3JpdGVzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gVE9ETyAtIGlzIHJlY3JlYXRpbmcgdGhlIGJpbmQgZ3JvdXAgd2l0aCBhIHRleHR1cmUgc3dhcCBmYXN0ZXIgdGhhbiBjb3B5aW5nIHRleHR1cmUgZGF0YSBiYWNrIGFuZCBmb3J0aD9cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBCaW5kIEdyb3VwXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogdGhpcy5waXBlbGluZS5nZXRCaW5kR3JvdXBMYXlvdXQoMCksXHJcbiAgICAgICAgICAgIGVudHJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiBwaGVyb21vbmVUZXh0dXJlLmNyZWF0ZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMSxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogdGhpcy5zYW1wbGVyLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBwYXNzRW5jb2RlciA9IGNvbW1hbmRFbmNvZGVyLmJlZ2luUmVuZGVyUGFzcyhyZW5kZXJQYXNzRGVzY3JpcHRvcik7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuc2V0UGlwZWxpbmUodGhpcy5waXBlbGluZSk7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuc2V0QmluZEdyb3VwKDAsIHRoaXMuYmluZEdyb3VwKTtcclxuICAgICAgICBwYXNzRW5jb2Rlci5kcmF3KDYpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLmVuZCgpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy93ZWJwYWNrL3R5cGVzXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTaW11bGF0aW9uUGFyYW1ldGVycyB7XHJcbiAgICBhZ2VudENvdW50OiBudW1iZXJcclxuICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgIHR1cm5KaXR0ZXI6IG51bWJlcixcclxuICAgIHN0ZWVyRmFjdG9yOiBudW1iZXIsXHJcbiAgICBzYW1wbGVEaXN0YW5jZTogbnVtYmVyLFxyXG4gICAgcGFzc2l2ZUF0dGVudWF0aW9uOiBudW1iZXIsXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzaW11bGF0aW9uUGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzID0ge1xyXG4gICAgYWdlbnRDb3VudDogMTAwLFxyXG4gICAgaGVpZ2h0OiAwLFxyXG4gICAgd2lkdGg6IDAsXHJcbiAgICB0dXJuSml0dGVyOiAwLFxyXG4gICAgc3RlZXJGYWN0b3I6IC41LFxyXG4gICAgc2FtcGxlRGlzdGFuY2U6IDUsXHJcbiAgICBwYXNzaXZlQXR0ZW51YXRpb246IC4wMDEsXHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuICAgIGFkZFNsaWRlcihcIkppdHRlclwiLCBcInR1cm5KaXR0ZXJcIiwgMC41LCAwLCAxLjUpO1xyXG4gICAgYWRkU2xpZGVyKFwiU3RlZXJpbmdcIiwgXCJzdGVlckZhY3RvclwiLCAwLjUsIDAsIDEpO1xyXG59KTsgXHJcblxyXG5jb25zdCBjb25maWdQYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29uZmlnXCIpO1xyXG5mdW5jdGlvbiBhZGRTbGlkZXIobmFtZTogc3RyaW5nLCBjb25maWdLZXk6IGtleW9mKElTaW11bGF0aW9uUGFyYW1ldGVycyksaW5pdGlhbFZhbHVlOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3Qgc2xpZGVyTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBzbGlkZXJMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgbmFtZSk7XHJcbiAgICBzbGlkZXJMYWJlbC5pbm5lclRleHQgPSBuYW1lO1xyXG4gICAgY29uc3Qgc2xpZGVySW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBzbGlkZXJJbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBuYW1lKTtcclxuICAgIHNsaWRlcklucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJyYW5nZVwiKTtcclxuICAgIHNsaWRlcklucHV0LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIFN0cmluZyhpbml0aWFsVmFsdWUpKTtcclxuICAgIHNsaWRlcklucHV0LnNldEF0dHJpYnV0ZShcInN0ZXBcIiwgU3RyaW5nKDAuMDEpKTtcclxuICAgIHNsaWRlcklucHV0LnNldEF0dHJpYnV0ZShcIm1pblwiLCBTdHJpbmcobWluKSk7XHJcbiAgICBzbGlkZXJJbnB1dC5zZXRBdHRyaWJ1dGUoXCJtYXhcIiwgU3RyaW5nKG1heCkpO1xyXG4gICAgY29uc3Qgc2xpZGVyRGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cclxuICAgIGNvbmZpZ1BhbmVsLmFwcGVuZChzbGlkZXJMYWJlbCwgc2xpZGVySW5wdXQsIHNsaWRlckRpc3BsYXkpO1xyXG5cclxuICAgIGxldCBvblVwZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBzaW11bGF0aW9uUGFyYW1ldGVyc1tjb25maWdLZXldID0gTnVtYmVyKHNsaWRlcklucHV0LnZhbHVlKTtcclxuICAgICAgICBzbGlkZXJEaXNwbGF5LmlubmVyVGV4dCA9IHNsaWRlcklucHV0LnZhbHVlO1xyXG4gICAgfTtcclxuICAgIG9uVXBkYXRlKCk7XHJcbiAgICBzbGlkZXJJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgb25VcGRhdGUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWdlbnRzQXJyYXkocGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzKTogbnVtYmVyW10ge1xyXG4gICAgY29uc3QgYWdlbnRzQXJyYXkgPSBuZXcgQXJyYXkoNCAqIHBhcmFtZXRlcnMuYWdlbnRDb3VudCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtZXRlcnMuYWdlbnRDb3VudCAqIDQ7IGkgKz0gNCkge1xyXG4gICAgICAgIGFnZW50c0FycmF5W2ldID0gcGFyYW1ldGVycy53aWR0aCAvIDI7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaSsxXSA9IHBhcmFtZXRlcnMuaGVpZ2h0IC8gMjtcclxuICAgICAgICBhZ2VudHNBcnJheVtpKzJdID0gTWF0aC5yYW5kb20oKSAtIC41O1xyXG4gICAgICAgIGFnZW50c0FycmF5W2krM10gPSBNYXRoLnJhbmRvbSgpIC0gLjU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWdlbnRzQXJyYXk7XHJcbn0iLCJpbXBvcnQgeyBJU2ltdWxhdGlvblBhcmFtZXRlcnMgfSBmcm9tIFwiLi9zaW11bGF0aW9uQ29uZmlnXCI7XHJcblxyXG5jb25zdCBXT1JLR1JPVVBfU0laRSA9IDY0O1xyXG5cclxuZXhwb3J0IGNsYXNzIFNpbXVsYXRpb25QYXNzIHtcclxuICAgIGRldmljZTogR1BVRGV2aWNlO1xyXG4gICAgcGhlcm9tb25lVGV4dHVyZTogR1BVVGV4dHVyZTtcclxuICAgIGFnZW50c0J1ZmZlcjogR1BVQnVmZmVyO1xyXG4gICAgc2ltdWxhdGlvblBhcmFtZXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycztcclxuXHJcbiAgICB3b3JrZ3JvdXBzOiBudW1iZXI7XHJcbiAgICBiaW5kR3JvdXA6IEdQVUJpbmRHcm91cDtcclxuICAgIHVuaWZvcm1CdWZmZXI6IEdQVUJ1ZmZlcjtcclxuICAgIHBpcGVsaW5lOiBHUFVDb21wdXRlUGlwZWxpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGV2aWNlOiBHUFVEZXZpY2UsIHNpbXVsYXRpb25QYXJhbWV0ZXJzOiBJU2ltdWxhdGlvblBhcmFtZXRlcnMsIHRleHR1cmVGb3JtYXQ6IEdQVVRleHR1cmVGb3JtYXQsIGFnZW50c0J1ZmZlcjogR1BVQnVmZmVyKSB7XHJcbiAgICAgICAgY29uc3Qgc2hhZGVyQ29kZSA9IGBcclxuICAgICAgICAvLyBIYXNoIGZ1bmN0aW9uIGZyb20gSC4gU2NoZWNodGVyICYgUi4gQnJpZHNvbiwgZ29vLmdsL1JYaUthSFxyXG4gICAgICAgIGZuIEhhc2gocDogdTMyKSAtPiB1MzJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBzID0gcDsgXHJcbiAgICAgICAgICAgIHMgXj0gMjc0NzYzNjQxOXU7XHJcbiAgICAgICAgICAgIHMgKj0gMjY1NDQzNTc2OXU7XHJcbiAgICAgICAgICAgIHMgXj0gcyA+PiAxNjtcclxuICAgICAgICAgICAgcyAqPSAyNjU0NDM1NzY5dTtcclxuICAgICAgICAgICAgcyBePSBzID4+IDE2O1xyXG4gICAgICAgICAgICBzICo9IDI2NTQ0MzU3Njl1O1xyXG4gICAgICAgICAgICByZXR1cm4gcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZuIFJhbmRvbShzZWVkOiB1MzIpIC0+IGYzMlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGYzMihIYXNoKHNlZWQpKSAvIDQyOTQ5NjcyOTUuMDsgLy8gMl4zMi0xXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHJ1Y3QgVW5pZm9ybXMge1xyXG4gICAgICAgICAgICB0aW1lOiB1MzIsXHJcbiAgICAgICAgICAgIHR1cm5KaXR0ZXI6IGYzMixcclxuICAgICAgICAgICAgc3RlZXJGYWN0b3I6IGYzMixcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBncm91cCgwKSBAYmluZGluZygwKSB2YXI8dW5pZm9ybT4gdW5pZm9ybXM6IFVuaWZvcm1zO1xyXG5cclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMSkgdmFyIHRleHR1cmVPdXQ6IHRleHR1cmVfc3RvcmFnZV8yZDwke3RleHR1cmVGb3JtYXR9LCB3cml0ZT47XHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDIpIHZhcjxzdG9yYWdlLCByZWFkX3dyaXRlPiBhZ2VudHM6IGFycmF5PHZlYzRmLCAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnR9PjtcclxuICAgICAgICBAZ3JvdXAoMCkgQGJpbmRpbmcoMykgdmFyIHRleHR1cmVJbjogdGV4dHVyZV9zdG9yYWdlXzJkPCR7dGV4dHVyZUZvcm1hdH0sIHJlYWQ+O1xyXG5cclxuICAgICAgICBjb25zdCBsZWZ0U2FtcGxlTWF0cml4ID0gIG1hdDJ4MigwLjg2NjAyNSwgMC41LCAtMC41LCAwLjg2NjAyNSk7XHJcbiAgICAgICAgY29uc3QgcmlnaHRTYW1wbGVNYXRyaXggPSBtYXQyeDIoMC44NjYwMjUsIC0wLjUsIDAuNSwgMC44NjYwMjUpO1xyXG4gICAgICAgIGZuIHNhbXBsZVBoZXJvbW9uZShwb3NpdGlvbjogdmVjMjxmMzI+LCBkaXJlY3Rpb246IHZlYzI8ZjMyPiwgc3RlcHM6IHUzMikgLT4gdmVjMzxmMzI+IHtcclxuICAgICAgICAgICAgbGV0IHNhbXBsZVN0YXJ0ID0gcG9zaXRpb24gKyBkaXJlY3Rpb24gKiAyO1xyXG4gICAgICAgICAgICB2YXIgc3VtID0gdmVjMygwLik7XHJcbiAgICAgICAgICAgIGxldCBmU3RlcHMgPSBmMzIoc3RlcHMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMC47IGkgPCBmU3RlcHM7IGkgKz0gMS4pIHtcclxuICAgICAgICAgICAgICAgIHN1bSArPSB0ZXh0dXJlTG9hZCh0ZXh0dXJlSW4sIHZlYzI8aTMyPihyb3VuZChzYW1wbGVTdGFydCArIGkgKiBkaXJlY3Rpb24pKSkueHl6O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAY29tcHV0ZSBAd29ya2dyb3VwX3NpemUoJHtXT1JLR1JPVVBfU0laRX0pXHJcbiAgICAgICAgZm4gc2ltdWxhdGUoQGJ1aWx0aW4oZ2xvYmFsX2ludm9jYXRpb25faWQpIGdsb2JhbF9pZDogdmVjMzx1MzI+KSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gZ2xvYmFsX2lkLng7XHJcbiAgICAgICAgLy8gVHJpbSBvZmYgdGhlIGV4Y2VzcyBpZiBhZ2VudENvdW50ICUgV09SS0dST1VQX1NJWkUgIT0gMFxyXG4gICAgICAgIGlmIChpbmRleCA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnR9KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhZ2VudCA9IGFnZW50c1tpbmRleF07XHJcblxyXG4gICAgICAgIGFnZW50LnggKz0gYWdlbnQuejtcclxuICAgICAgICBhZ2VudC55ICs9IGFnZW50Lnc7XHJcblxyXG4gICAgICAgIGlmIChhZ2VudC54ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGh9IHx8IGFnZW50LnggPCAwKSB7XHJcbiAgICAgICAgICAgIGFnZW50LnogPSAtYWdlbnQuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFnZW50LnkgPj0gJHtzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHR9IHx8IGFnZW50LnkgPCAwKSB7XHJcbiAgICAgICAgICAgIGFnZW50LncgPSAtYWdlbnQudztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYW5kb21EaXJDaGFuZ2UgPSB1bmlmb3Jtcy50dXJuSml0dGVyICogdmVjMihSYW5kb20odW5pZm9ybXMudGltZSArIGdsb2JhbF9pZC54KSAtIC41LCBSYW5kb20odW5pZm9ybXMudGltZSArIGdsb2JhbF9pZC54ICsgJHtzaW11bGF0aW9uUGFyYW1ldGVycy5oZWlnaHR9KSAtIC41KTtcclxuICAgICAgICB2YXIgdmVsb2NpdHkgPSBub3JtYWxpemUoYWdlbnQuencgKyByYW5kb21EaXJDaGFuZ2UpO1xyXG5cclxuICAgICAgICAvLyBUYWtlIHBoZXJvbW9uZSBzYW1wbGVzXHJcbiAgICAgICAgbGV0IHJpZ2h0U2FtcGxlRGlyID0gcmlnaHRTYW1wbGVNYXRyaXggKiB2ZWxvY2l0eTtcclxuICAgICAgICBsZXQgcmlnaHRTYW1wbGVQaXhlbCA9IHZlYzI8aTMyPihyb3VuZChhZ2VudC54eSArIDMgKiByaWdodFNhbXBsZURpcikpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmb3J3YXJkU2FtcGxlUGl4ZWwgPSB2ZWMyPGkzMj4ocm91bmQoYWdlbnQueHkgKyAzICogdmVsb2NpdHkpKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGxlZnRTYW1wbGVEaXIgPSBsZWZ0U2FtcGxlTWF0cml4ICogdmVsb2NpdHk7XHJcblxyXG4gICAgICAgIGxldCByaWdodFNhbXBsZSA9IHNhbXBsZVBoZXJvbW9uZShhZ2VudC54eSwgcmlnaHRTYW1wbGVEaXIsICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuc2FtcGxlRGlzdGFuY2V9KS54O1xyXG4gICAgICAgIGxldCBmb3J3YXJkU2FtcGxlID0gc2FtcGxlUGhlcm9tb25lKGFnZW50Lnh5LCB2ZWxvY2l0eSwgJHtzaW11bGF0aW9uUGFyYW1ldGVycy5zYW1wbGVEaXN0YW5jZX0pLng7XHJcbiAgICAgICAgbGV0IGxlZnRTYW1wbGUgPSBzYW1wbGVQaGVyb21vbmUoYWdlbnQueHksIGxlZnRTYW1wbGVEaXIsICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuc2FtcGxlRGlzdGFuY2V9KS54O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChmb3J3YXJkU2FtcGxlIDwgcmlnaHRTYW1wbGUgfHwgZm9yd2FyZFNhbXBsZSA8IGxlZnRTYW1wbGUpIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0U2FtcGxlID4gbGVmdFNhbXBsZSkge1xyXG4gICAgICAgICAgICAgICAgdmVsb2NpdHkgKz0gdW5pZm9ybXMuc3RlZXJGYWN0b3IgKiByaWdodFNhbXBsZURpcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZlbG9jaXR5ICs9IHVuaWZvcm1zLnN0ZWVyRmFjdG9yICogbGVmdFNhbXBsZURpcjtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmVsb2NpdHkgPSBub3JtYWxpemUodmVsb2NpdHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHBpeGVsID0gdmVjMjxpMzI+KHJvdW5kKGFnZW50Lnh5KSk7XHJcbiAgICAgICAgdGV4dHVyZVN0b3JlKHRleHR1cmVPdXQsIHBpeGVsLCB2ZWM0KDEuLCAwLiwgMC4sIDEuKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYWdlbnQueiA9IHZlbG9jaXR5Lng7XHJcbiAgICAgICAgYWdlbnQudyA9IHZlbG9jaXR5Lnk7XHJcbiAgICAgICAgYWdlbnRzW2luZGV4XSA9IGFnZW50O1xyXG4gICAgICAgIH1gO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcclxuICAgICAgICB0aGlzLmFnZW50c0J1ZmZlciA9IGFnZW50c0J1ZmZlcjtcclxuICAgICAgICB0aGlzLndvcmtncm91cHMgPSBNYXRoLmNlaWwoc2ltdWxhdGlvblBhcmFtZXRlcnMuYWdlbnRDb3VudCAvIFdPUktHUk9VUF9TSVpFKTtcclxuICAgICAgICB0aGlzLnNpbXVsYXRpb25QYXJhbWV0ZXJzID0gc2ltdWxhdGlvblBhcmFtZXRlcnM7XHJcblxyXG4gICAgICAgIHRoaXMudW5pZm9ybUJ1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgICAgICBzaXplOiAxMixcclxuICAgICAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLlVOSUZPUk0gfCBHUFVCdWZmZXJVc2FnZS5DT1BZX0RTVFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBjb21wdXRlQmluZEdyb3VwTGF5b3V0ID0gZGV2aWNlLmNyZWF0ZUJpbmRHcm91cExheW91dCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cCBMYXlvdXRcIixcclxuICAgICAgICAgICAgZW50cmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ1bmlmb3JtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZVRleHR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiB0ZXh0dXJlRm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3M6IFwid3JpdGUtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RvcmFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJyZWFkLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSBhcyBHUFVCaW5kR3JvdXBMYXlvdXRFbnRyeVtdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBkZXZpY2UuY3JlYXRlQ29tcHV0ZVBpcGVsaW5lKHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBQaXBlbGluZVwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IGRldmljZS5jcmVhdGVQaXBlbGluZUxheW91dCh7XHJcbiAgICAgICAgICAgICAgICBiaW5kR3JvdXBMYXlvdXRzOiBbY29tcHV0ZUJpbmRHcm91cExheW91dF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjb21wdXRlOiB7XHJcbiAgICAgICAgICAgICAgICBtb2R1bGU6IGRldmljZS5jcmVhdGVTaGFkZXJNb2R1bGUoe2NvZGU6IHNoYWRlckNvZGV9KSxcclxuICAgICAgICAgICAgICAgIGVudHJ5UG9pbnQ6ICdzaW11bGF0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhc3MoY29tbWFuZEVuY29kZXI6IEdQVUNvbW1hbmRFbmNvZGVyLCB0ZXh0dXJlSW46IEdQVVRleHR1cmUsIHRleHR1cmVPdXQ6IEdQVVRleHR1cmUsIHRpbWVzdGFtcFdyaXRlcz86IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB1bmlmb3JtSW50cyA9IG5ldyBVaW50MzJBcnJheShbd2luZG93LnBlcmZvcm1hbmNlLm5vdygpICogMTBdKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXZpY2UucXVldWUud3JpdGVCdWZmZXIoXHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybUJ1ZmZlcixcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdW5pZm9ybUludHMsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHVuaWZvcm1JbnRzLmxlbmd0aCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHVuaWZvcm1GbG9hdHMgPSBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAgICAgdGhpcy5zaW11bGF0aW9uUGFyYW1ldGVycy50dXJuSml0dGVyLFxyXG4gICAgICAgICAgICB0aGlzLnNpbXVsYXRpb25QYXJhbWV0ZXJzLnN0ZWVyRmFjdG9yXHJcbiAgICAgICAgXSlcclxuICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyLFxyXG4gICAgICAgICAgICB1bmlmb3JtSW50cy5ieXRlTGVuZ3RoLFxyXG4gICAgICAgICAgICB1bmlmb3JtRmxvYXRzLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtRmxvYXRzLmxlbmd0aCxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXNzRGVzY3JpcHRvciA9IHtcclxuICAgICAgICAgICAgdGltZXN0YW1wV3JpdGVzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5iaW5kR3JvdXAgPSB0aGlzLmRldmljZS5jcmVhdGVCaW5kR3JvdXAoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIEJpbmQgR3JvdXBcIixcclxuICAgICAgICAgICAgbGF5b3V0OiB0aGlzLnBpcGVsaW5lLmdldEJpbmRHcm91cExheW91dCgwKSxcclxuICAgICAgICAgICAgZW50cmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHsgYnVmZmVyOiB0aGlzLnVuaWZvcm1CdWZmZXIgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMSxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogdGV4dHVyZU91dC5jcmVhdGVWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6eyBidWZmZXI6IHRoaXMuYWdlbnRzQnVmZmVyIH0sIFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0ZXh0dXJlSW4uY3JlYXRlVmlldygpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSBhcyBHUFVCaW5kR3JvdXBFbnRyeVtdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNpbXVsYXRlUGFzcyA9IGNvbW1hbmRFbmNvZGVyLmJlZ2luQ29tcHV0ZVBhc3MocGFzc0Rlc2NyaXB0b3IpO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5zZXRQaXBlbGluZSh0aGlzLnBpcGVsaW5lKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3Muc2V0QmluZEdyb3VwKDAsIHRoaXMuYmluZEdyb3VwKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3MuZGlzcGF0Y2hXb3JrZ3JvdXBzKHRoaXMud29ya2dyb3Vwcyk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmVuZCgpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSVNpbXVsYXRpb25QYXJhbWV0ZXJzIH0gZnJvbSBcIi4vc2ltdWxhdGlvbkNvbmZpZ1wiO1xyXG5cclxuY29uc3QgV09SS0dST1VQX1NJWkUgPSA2NDtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXh0dXJlUGFzcyB7XHJcbiAgICBkZXZpY2U6IEdQVURldmljZTtcclxuICAgIHBoZXJvbW9uZVRleHR1cmVJbjogR1BVVGV4dHVyZTtcclxuICAgIHBoZXJvbW9uZVRleHR1cmVPdXQ6IEdQVVRleHR1cmU7XHJcblxyXG4gICAgd29ya2dyb3VwczogbnVtYmVyW107XHJcbiAgICBiaW5kR3JvdXA6IEdQVUJpbmRHcm91cDtcclxuICAgIHVuaWZvcm1CdWZmZXI6IEdQVUJ1ZmZlcjtcclxuICAgIHBpcGVsaW5lOiBHUFVDb21wdXRlUGlwZWxpbmU7XHJcblxyXG4gICAgYmx1cktlcm5lbDogbnVtYmVyW11bXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2U6IEdQVURldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycywgcGhlcm9tb25lVGV4dHVyZUZvcm1hdDogR1BVVGV4dHVyZUZvcm1hdCkge1xyXG4gICAgICAgIC8vIFRPRE8gLSBSZW1vdmUgVW5pZm9ybT9cclxuICAgICAgICBjb25zdCBzaGFkZXJDb2RlID0gYFxyXG4gICAgICAgIHN0cnVjdCBVbmlmb3JtcyB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2ZWM0PGYzMj5cclxuICAgICAgICB9XHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhcjx1bmlmb3JtPiB1bmlmb3JtczogVW5pZm9ybXM7XHJcblxyXG4gICAgICAgIEBncm91cCgwKSBAYmluZGluZygxKSB2YXIgdGV4dHVyZUluOiB0ZXh0dXJlX3N0b3JhZ2VfMmQ8JHtwaGVyb21vbmVUZXh0dXJlRm9ybWF0fSwgcmVhZD47XHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDIpIHZhciB0ZXh0dXJlT3V0OiB0ZXh0dXJlX3N0b3JhZ2VfMmQ8JHtwaGVyb21vbmVUZXh0dXJlRm9ybWF0fSwgd3JpdGU+O1xyXG5cclxuICAgICAgICBAY29tcHV0ZSBAd29ya2dyb3VwX3NpemUoOCwgOClcclxuICAgICAgICBmbiBhdHRlbnVhdGUoQGJ1aWx0aW4oZ2xvYmFsX2ludm9jYXRpb25faWQpIGdsb2JhbF9pZDogdmVjMzx1MzI+KSB7XHJcbiAgICAgICAgICAgIGlmIChnbG9iYWxfaWQueCA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRofSB8fCBnbG9iYWxfaWQueSA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmhlaWdodH0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHBpeGVsID0gZ2xvYmFsX2lkLnh5O1xyXG5cclxuICAgICAgICAgICAgLy8gRGVmaW5lIEdhdXNzaWFuIGtlcm5lbCAoM3gzKVxyXG4gICAgICAgICAgICBsZXQgb3J0aG8gPSAuMDU7XHJcbiAgICAgICAgICAgIGxldCBkaWFnID0gLjAxO1xyXG4gICAgICAgICAgICBsZXQga2VybmVsID0gYXJyYXk8YXJyYXk8ZjMyLCAzPiwgMz4oXHJcbiAgICAgICAgICAgICAgICBhcnJheTxmMzIsIDM+KGRpYWcsIG9ydGhvLCBkaWFnKSxcclxuICAgICAgICAgICAgICAgIGFycmF5PGYzMiwgMz4ob3J0aG8sICAuNywgIG9ydGhvKSxcclxuICAgICAgICAgICAgICAgIGFycmF5PGYzMiwgMz4oZGlhZywgb3J0aG8sIGRpYWcpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29sb3JTdW0gPSB2ZWMzKDAuKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBuZWlnaGJvcmluZyBwaXhlbHMgKDN4MyBrZXJuZWwpXHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IGkzMiA9IC0xOyBpIDw9IDE7IGkgPSBpICsgMSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgajogaTMyID0gLTE7IGogPD0gMTsgaiA9IGogKyAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNhbXBsZVBpeGVsPSB2ZWMyKGkzMihnbG9iYWxfaWQueCkgKyBpLCBpMzIoZ2xvYmFsX2lkLnkpICsgaik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVuc3VyZSB3ZSBkb24ndCBzYW1wbGUgb3V0IG9mIGJvdW5kc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzYW1wbGVQaXhlbC54IDwgJHtzaW11bGF0aW9uUGFyYW1ldGVycy53aWR0aH0gJiYgc2FtcGxlUGl4ZWwueSA8ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0fSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2FtcGxlQ29sb3IgPSB0ZXh0dXJlTG9hZCh0ZXh0dXJlSW4sIHNhbXBsZVBpeGVsKS54eXo7IC8vIExvYWQgbmVpZ2hib3JpbmcgcGl4ZWwgY29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JTdW0gKz0gc2FtcGxlQ29sb3IgKiBrZXJuZWxbaSArIDFdW2ogKyAxXTsgLy8gQXBwbHkgR2F1c3NpYW4ga2VybmVsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb2xvclN1bSA9IG1heCh2ZWMzKDAuKSwgY29sb3JTdW0gLSB2ZWMzKCR7c2ltdWxhdGlvblBhcmFtZXRlcnMucGFzc2l2ZUF0dGVudWF0aW9ufSkpO1xyXG5cclxuICAgICAgICAgICAgdGV4dHVyZVN0b3JlKHRleHR1cmVPdXQsIHBpeGVsLCB2ZWM0KGNvbG9yU3VtLCAxLjApKTsgLy8gU3RvcmUgYmx1cnJlZCBjb2xvclxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGA7XHJcblxyXG4gICAgICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgICAgIHRoaXMud29ya2dyb3VwcyA9IFtNYXRoLmNlaWwoc2ltdWxhdGlvblBhcmFtZXRlcnMud2lkdGggLyA4KSwgTWF0aC5jZWlsKHNpbXVsYXRpb25QYXJhbWV0ZXJzLmhlaWdodCAvIDgpXTtcclxuXHJcbiAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcih7XHJcbiAgICAgICAgICAgIHNpemU6IDE2LFxyXG4gICAgICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuVU5JRk9STSB8IEdQVUJ1ZmZlclVzYWdlLkNPUFlfRFNUXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gQ29sb3JcclxuICAgICAgICBjb25zdCB1bmlmb3JtRGF0YSA9IG5ldyBVaW50MzJBcnJheShbXHJcbiAgICAgICAgICAgIDAuLFxyXG4gICAgICAgICAgICAxLixcclxuICAgICAgICAgICAgMS4sXHJcbiAgICAgICAgICAgIDEuLFxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZS5xdWV1ZS53cml0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtQnVmZmVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtRGF0YSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdW5pZm9ybURhdGEubGVuZ3RoLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVCaW5kR3JvdXBMYXlvdXQgPSBkZXZpY2UuY3JlYXRlQmluZEdyb3VwTGF5b3V0KHtcclxuICAgICAgICAgICAgbGFiZWw6IFwiU2ltdWxhdGlvbiBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5DT01QVVRFLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInVuaWZvcm1cIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVGV4dHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHBoZXJvbW9uZVRleHR1cmVGb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJyZWFkLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZVRleHR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBwaGVyb21vbmVUZXh0dXJlRm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3M6IFwid3JpdGUtb25seVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdIGFzIEdQVUJpbmRHcm91cExheW91dEVudHJ5W11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IGRldmljZS5jcmVhdGVDb21wdXRlUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJTaW11bGF0aW9uIFBpcGVsaW5lXCIsXHJcbiAgICAgICAgICAgIGxheW91dDogZGV2aWNlLmNyZWF0ZVBpcGVsaW5lTGF5b3V0KHtcclxuICAgICAgICAgICAgICAgIGJpbmRHcm91cExheW91dHM6IFtjb21wdXRlQmluZEdyb3VwTGF5b3V0XSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNvbXB1dGU6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogZGV2aWNlLmNyZWF0ZVNoYWRlck1vZHVsZSh7Y29kZTogc2hhZGVyQ29kZX0pLFxyXG4gICAgICAgICAgICAgICAgZW50cnlQb2ludDogJ2F0dGVudWF0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhc3MoY29tbWFuZEVuY29kZXI6IEdQVUNvbW1hbmRFbmNvZGVyLCB0ZXh0dXJlSW46IEdQVVRleHR1cmUsIHRleHR1cmVPdXQ6IEdQVVRleHR1cmUsIHRpbWVzdGFtcFdyaXRlcz86IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBwYXNzRGVzY3JpcHRvciA9IHtcclxuICAgICAgICAgICAgdGltZXN0YW1wV3JpdGVzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMucGlwZWxpbmUuZ2V0QmluZEdyb3VwTGF5b3V0KDApLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogeyBidWZmZXI6IHRoaXMudW5pZm9ybUJ1ZmZlciB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0ZXh0dXJlSW4uY3JlYXRlVmlldygpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0ZXh0dXJlT3V0LmNyZWF0ZVZpZXcoKSwgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0gYXMgR1BVQmluZEdyb3VwRW50cnlbXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBzaW11bGF0ZVBhc3MgPSBjb21tYW5kRW5jb2Rlci5iZWdpbkNvbXB1dGVQYXNzKHBhc3NEZXNjcmlwdG9yKTtcclxuICAgICAgICBzaW11bGF0ZVBhc3Muc2V0UGlwZWxpbmUodGhpcy5waXBlbGluZSk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLnNldEJpbmRHcm91cCgwLCB0aGlzLmJpbmRHcm91cCk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmRpc3BhdGNoV29ya2dyb3Vwcyh0aGlzLndvcmtncm91cHNbMF0sIHRoaXMud29ya2dyb3Vwc1sxXSk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmVuZCgpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBSZW5kZXJQYXNzIH0gZnJvbSBcIi4vcmVuZGVyUGFzc1wiO1xyXG5pbXBvcnQgeyBnZXRBZ2VudHNBcnJheSwgc2ltdWxhdGlvblBhcmFtZXRlcnMgfSBmcm9tIFwiLi9zaW11bGF0aW9uQ29uZmlnXCI7XHJcbmltcG9ydCB7IFNpbXVsYXRpb25QYXNzIH0gZnJvbSBcIi4vc2ltdWxhdGlvblBhc3NcIjtcclxuaW1wb3J0IHsgVGV4dHVyZVBhc3MgfSBmcm9tIFwiLi90ZXh0dXJlQ29tcHV0ZVBhc3NcIjtcclxuXHJcbmNvbnN0IE5VTUJFUl9PRl9QQVNTRVMgPSAyO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ28oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGNvbnN0IGFkYXB0ZXIgPSBhd2FpdCBuYXZpZ2F0b3IuZ3B1LnJlcXVlc3RBZGFwdGVyKCk7XHJcbiAgICBjb25zdCBoYXNUaW1lc3RhbXBRdWVyeSA9IGFkYXB0ZXIuZmVhdHVyZXMuaGFzKFwidGltZXN0YW1wLXF1ZXJ5XCIpO1xyXG4gICAgY29uc3QgZGV2aWNlID0gYXdhaXQgYWRhcHRlci5yZXF1ZXN0RGV2aWNlKHtcclxuICAgICAgICByZXF1aXJlZEZlYXR1cmVzOiBoYXNUaW1lc3RhbXBRdWVyeSA/IFtcInRpbWVzdGFtcC1xdWVyeVwiXSBhcyBHUFVGZWF0dXJlTmFtZVtdOiBbXSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFBlcmZvcm1hbmNlIFN0YXRpc3RpY3MgRG9jdW1lbnQgU2V0dXBcclxuICAgIGNvbnN0IHBlcmZEaXNwbGF5Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS5iYWNrZHJvcEZpbHRlciA9ICdibHVyKDEwcHgpJztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLmJvdHRvbSA9ICcxMHB4JztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLmxlZnQgPSAnMTBweCc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5zdHlsZS50ZXh0QWxpZ24gPSAnbGVmdCc7XHJcbiAgICBjb25zdCBwZXJmRGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ByZScpO1xyXG4gICAgcGVyZkRpc3BsYXkuc3R5bGUubWFyZ2luID0gJy41ZW0nO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuYXBwZW5kQ2hpbGQocGVyZkRpc3BsYXkpO1xyXG4gICAgY2FudmFzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQocGVyZkRpc3BsYXlDb250YWluZXIpO1xyXG4gICAgbGV0IHNpbXVsYXRpb25EdXJhdGlvblN1bSA9IDA7XHJcbiAgICBsZXQgcmVuZGVyRHVyYXRpb25TdW0gPSAwO1xyXG4gICAgbGV0IHRpbWVyU2FtcGxlcyA9IDA7XHJcblxyXG4gICAgY29uc3Qgc3BhcmVQZXJmVGltZUJ1ZmZlcnM6IEdQVUJ1ZmZlcltdID0gW107XHJcbiAgICBsZXQgcXVlcnlTZXQ6IEdQVVF1ZXJ5U2V0IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgbGV0IHBlcmZSZXNvbHZlQnVmZmVyOiBHUFVCdWZmZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICBsZXQgc2ltdWxhdGlvblBlcmZUaW1lU3RhbXBXcml0ZXM6IEdQVUNvbXB1dGVQYXNzVGltZXN0YW1wV3JpdGVzIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgbGV0IHJlbmRlclBlcmZUaW1lU3RhbXBXcml0ZXM6IEdQVVJlbmRlclBhc3NUaW1lc3RhbXBXcml0ZXMgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICBpZiAoaGFzVGltZXN0YW1wUXVlcnkpIHtcclxuICAgICAgICBwZXJmRGlzcGxheS50ZXh0Q29udGVudCA9IGBcXFxyXG5hdmcgc2ltdWxhdGlvbiBkdXJhdGlvbjog4oCUIMK1c1xyXG5hdmcgcmVuZGVyIGR1cmF0aW9uOiAg4oCUIMK1c1xyXG5zcGFyZSBwZXJmIGJ1ZmZlcnM6ICAgIOKAlGA7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHF1ZXJ5U2V0ID0gZGV2aWNlLmNyZWF0ZVF1ZXJ5U2V0KHtcclxuICAgICAgICAgICAgdHlwZTogXCJ0aW1lc3RhbXBcIixcclxuICAgICAgICAgICAgY291bnQ6IDIgKiBOVU1CRVJfT0ZfUEFTU0VTLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBlcmZSZXNvbHZlQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcih7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcInBlcmZSZXNvbHZlXCIsXHJcbiAgICAgICAgICAgIHNpemU6IDQgKiBCaWdJbnQ2NEFycmF5LkJZVEVTX1BFUl9FTEVNRU5UICogTlVNQkVSX09GX1BBU1NFUyxcclxuICAgICAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLlFVRVJZX1JFU09MVkUgfCBHUFVCdWZmZXJVc2FnZS5DT1BZX1NSQyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBzaW11bGF0aW9uUGVyZlRpbWVTdGFtcFdyaXRlcyA9IHtcclxuICAgICAgICAgICAgcXVlcnlTZXQsXHJcbiAgICAgICAgICAgIGJlZ2lubmluZ09mUGFzc1dyaXRlSW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGVuZE9mUGFzc1dyaXRlSW5kZXg6IDEsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgcmVuZGVyUGVyZlRpbWVTdGFtcFdyaXRlcyA9IHtcclxuICAgICAgICAgICAgcXVlcnlTZXQsXHJcbiAgICAgICAgICAgIGJlZ2lubmluZ09mUGFzc1dyaXRlSW5kZXg6IDIsXHJcbiAgICAgICAgICAgIGVuZE9mUGFzc1dyaXRlSW5kZXg6IDMsXHJcbiAgICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICAgc2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ3B1JykgYXMgdW5rbm93biBhcyBHUFVDYW52YXNDb250ZXh0O1xyXG4gICAgY29uc3QgcHJlc2VudGF0aW9uRm9ybWF0ID0gbmF2aWdhdG9yLmdwdS5nZXRQcmVmZXJyZWRDYW52YXNGb3JtYXQoKTtcclxuICAgIGNvbnRleHQuY29uZmlndXJlKHtcclxuICAgICAgICBkZXZpY2UsXHJcbiAgICAgICAgZm9ybWF0OiBwcmVzZW50YXRpb25Gb3JtYXQsXHJcbiAgICAgICAgYWxwaGFNb2RlOiAncHJlbXVsdGlwbGllZCdcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHBoZXJvbW9uZVRleHR1cmVzID0gW1xyXG4gICAgICAgIGRldmljZS5jcmVhdGVUZXh0dXJlKHtcclxuICAgICAgICAgICAgc2l6ZTogW2NhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodF0sXHJcbiAgICAgICAgICAgIGZvcm1hdDogICdyZ2JhOHVub3JtJyxcclxuICAgICAgICAgICAgdXNhZ2U6IFxyXG4gICAgICAgICAgICAgICAgR1BVVGV4dHVyZVVzYWdlLlRFWFRVUkVfQklORElORyB8XHJcbiAgICAgICAgICAgICAgICBHUFVUZXh0dXJlVXNhZ2UuU1RPUkFHRV9CSU5ESU5HXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZGV2aWNlLmNyZWF0ZVRleHR1cmUoe1xyXG4gICAgICAgICAgICBzaXplOiBbY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0XSxcclxuICAgICAgICAgICAgZm9ybWF0OiAgJ3JnYmE4dW5vcm0nLFxyXG4gICAgICAgICAgICB1c2FnZTogXHJcbiAgICAgICAgICAgICAgICBHUFVUZXh0dXJlVXNhZ2UuVEVYVFVSRV9CSU5ESU5HIHxcclxuICAgICAgICAgICAgICAgIEdQVVRleHR1cmVVc2FnZS5TVE9SQUdFX0JJTkRJTkdcclxuICAgICAgICB9KSxcclxuICAgIF07XHJcblxyXG4gICAgY29uc3QgYWdlbnRzQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcih7XHJcbiAgICAgICAgbGFiZWw6IFwiYWdlbnRzXCIsXHJcbiAgICAgICAgc2l6ZTogMTYgKiBzaW11bGF0aW9uUGFyYW1ldGVycy5hZ2VudENvdW50LFxyXG4gICAgICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZS5TVE9SQUdFLFxyXG4gICAgICAgIG1hcHBlZEF0Q3JlYXRpb246IHRydWUsXHJcbiAgICB9KTtcclxuICAgIG5ldyBGbG9hdDMyQXJyYXkoYWdlbnRzQnVmZmVyLmdldE1hcHBlZFJhbmdlKCkpLnNldChnZXRBZ2VudHNBcnJheShzaW11bGF0aW9uUGFyYW1ldGVycykpO1xyXG4gICAgYWdlbnRzQnVmZmVyLnVubWFwKCk7XHJcblxyXG4gICAgY29uc3QgdGV4dHVyZVBhc3MgPSBuZXcgVGV4dHVyZVBhc3MoZGV2aWNlLCBzaW11bGF0aW9uUGFyYW1ldGVycywgcGhlcm9tb25lVGV4dHVyZXNbMF0uZm9ybWF0KVxyXG5cclxuICAgIGNvbnN0IHNpbXVsYXRpb25QYXNzID0gbmV3IFNpbXVsYXRpb25QYXNzKGRldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnMsIHBoZXJvbW9uZVRleHR1cmVzWzBdLmZvcm1hdCwgYWdlbnRzQnVmZmVyKTtcclxuXHJcbiAgICBjb25zdCByZW5kZXJQYXNzID0gbmV3IFJlbmRlclBhc3MoZGV2aWNlLCBwaGVyb21vbmVUZXh0dXJlc1swXS5mb3JtYXQpO1xyXG5cclxuICAgIGxldCBwaGVyb21vbmVJbmRleCA9IDA7XHJcbiAgICBjb25zdCBmcmFtZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBjb21tYW5kRW5jb2RlciA9IGRldmljZS5jcmVhdGVDb21tYW5kRW5jb2RlcigpO1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmVJbkluZGV4ID0gcGhlcm9tb25lSW5kZXg7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZU91dEluZGV4ID0gKHBoZXJvbW9uZUluZGV4ICsgMSkgJSAyXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZVBhc3MuYWRkUGFzcyhjb21tYW5kRW5jb2RlciwgcGhlcm9tb25lVGV4dHVyZXNbdGV4dHVyZUluSW5kZXhdLCBwaGVyb21vbmVUZXh0dXJlc1t0ZXh0dXJlT3V0SW5kZXhdKVxyXG5cclxuICAgICAgICBzaW11bGF0aW9uUGFzcy5hZGRQYXNzKGNvbW1hbmRFbmNvZGVyLCBwaGVyb21vbmVUZXh0dXJlc1t0ZXh0dXJlSW5JbmRleF0sIHBoZXJvbW9uZVRleHR1cmVzW3RleHR1cmVPdXRJbmRleF0sIHNpbXVsYXRpb25QZXJmVGltZVN0YW1wV3JpdGVzKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FudmFzVGV4dHVyZVZpZXcgPSBjb250ZXh0LmdldEN1cnJlbnRUZXh0dXJlKCkuY3JlYXRlVmlldygpO1xyXG4gICAgICAgIHJlbmRlclBhc3MuYWRkUGFzcyhjb21tYW5kRW5jb2RlciwgcGhlcm9tb25lVGV4dHVyZXNbcGhlcm9tb25lSW5kZXhdLCBjYW52YXNUZXh0dXJlVmlldywgcmVuZGVyUGVyZlRpbWVTdGFtcFdyaXRlcyk7XHJcbiAgICAgICAgcGhlcm9tb25lSW5kZXggPSB0ZXh0dXJlT3V0SW5kZXg7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHRCdWZmZXI6IEdQVUJ1ZmZlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoaGFzVGltZXN0YW1wUXVlcnkpIHtcclxuICAgICAgICAgICAgcmVzdWx0QnVmZmVyID0gc3BhcmVQZXJmVGltZUJ1ZmZlcnMucG9wKCkgfHwgXHJcbiAgICAgICAgICAgICAgICBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiA0ICogQmlnSW50NjRBcnJheS5CWVRFU19QRVJfRUxFTUVOVCAqIE5VTUJFUl9PRl9QQVNTRVMsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLkNPUFlfRFNUIHwgR1BVQnVmZmVyVXNhZ2UuTUFQX1JFQUQsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29tbWFuZEVuY29kZXIucmVzb2x2ZVF1ZXJ5U2V0KHF1ZXJ5U2V0LCAwLCAyICogTlVNQkVSX09GX1BBU1NFUywgcGVyZlJlc29sdmVCdWZmZXIsIDApO1xyXG4gICAgICAgICAgICBjb21tYW5kRW5jb2Rlci5jb3B5QnVmZmVyVG9CdWZmZXIoXHJcbiAgICAgICAgICAgICAgICBwZXJmUmVzb2x2ZUJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0QnVmZmVyLnNpemVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRldmljZS5xdWV1ZS5zdWJtaXQoW2NvbW1hbmRFbmNvZGVyLmZpbmlzaCgpXSk7XHJcblxyXG4gICAgICAgIGlmIChoYXNUaW1lc3RhbXBRdWVyeSkge1xyXG4gICAgICAgICAgICByZXN1bHRCdWZmZXIubWFwQXN5bmMoR1BVTWFwTW9kZS5SRUFEKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVzID0gbmV3IEJpZ0ludDY0QXJyYXkocmVzdWx0QnVmZmVyLmdldE1hcHBlZFJhbmdlKCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2ltdWxhdGlvbkR1cmF0aW9uID0gTnVtYmVyKHRpbWVzWzFdIC0gdGltZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyRHVyYXRpb24gPSBOdW1iZXIodGltZXNbM10gLSB0aW1lc1syXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2ltdWxhdGlvbkR1cmF0aW9uID4gMCAmJiByZW5kZXJEdXJhdGlvbiA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzaW11bGF0aW9uRHVyYXRpb25TdW0gKz0gc2ltdWxhdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckR1cmF0aW9uU3VtICs9IHJlbmRlckR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyU2FtcGxlcysrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0QnVmZmVyLnVubWFwKCk7XHJcbiAgICAgICAgICAgICAgICBzcGFyZVBlcmZUaW1lQnVmZmVycy5wdXNoKHJlc3VsdEJ1ZmZlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qga051bVRpbWVyU2FtcGxlc1BlclVwZGF0ZSA9IDEwMDtcclxuICAgICAgICAgICAgICAgIGlmICh0aW1lclNhbXBsZXMgPj0ga051bVRpbWVyU2FtcGxlc1BlclVwZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF2Z1NpbXVsYXRpb25NaWNyb3NlY29uZHMgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaW11bGF0aW9uRHVyYXRpb25TdW0gLyB0aW1lclNhbXBsZXMgLyAxMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdmdSZW5kZXJNaWNyb3NlY29uZHMgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJEdXJhdGlvblN1bSAvIHRpbWVyU2FtcGxlcyAvIDEwMDBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcmZEaXNwbGF5LnRleHRDb250ZW50ID0gYFxcXHJcbmF2ZyBzaW11bGF0aW9uIGR1cmF0aW9uOiAke2F2Z1NpbXVsYXRpb25NaWNyb3NlY29uZHN9wrVzXHJcbmF2ZyByZW5kZXIgZHVyYXRpb246ICAke2F2Z1JlbmRlck1pY3Jvc2Vjb25kc33CtXNcclxuc3BhcmUgcGVyZiBidWZmZXJzOiAgICAke3NwYXJlUGVyZlRpbWVCdWZmZXJzLmxlbmd0aH1gO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbXVsYXRpb25EdXJhdGlvblN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRHVyYXRpb25TdW0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyU2FtcGxlcyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcclxuICAgIH07XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xyXG59XHJcblxyXG5nbygpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==