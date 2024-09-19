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
    RenderPass.prototype.addPass = function (commandEncoder, targetView) {
        var renderPassDescriptor = {
            colorAttachments: [
                {
                    view: targetView,
                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
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
        var shaderCode = "\n        // Hash function from H. Schechter & R. Bridson, goo.gl/RXiKaH\n        fn Hash(p: u32) -> u32\n        {\n            var s = p; \n            s ^= 2747636419u;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            s ^= s >> 16;\n            s *= 2654435769u;\n            return s;\n        }\n\n        fn Random(seed: u32) -> f32\n        {\n            return f32(Hash(seed)) / 4294967295.0; // 2^32-1\n        }\n\n        struct Uniforms {\n            time: u32\n        }\n\n        @group(0) @binding(0) var<uniform> uniforms: Uniforms;\n\n        @group(0) @binding(1) var textureOut: texture_storage_2d<".concat(pheromoneTexture.format, ", write>;\n        @group(0) @binding(2) var<storage, read_write> agents: array<vec4f, ").concat(simulationParameters.agentCount, ">;\n\n        @compute @workgroup_size(").concat(WORKGROUP_SIZE, ")\n        fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {\n        let index = global_id.x;\n        // Trim off the excess if agentCount % WORKGROUP_SIZE != 0\n        if (index >= ").concat(simulationParameters.agentCount, ") {\n            return;\n        }\n\n        var agent = agents[index];\n\n        agent.x += agent.z;\n        agent.y += agent.w;\n\n        if (agent.x >= ").concat(simulationParameters.width, " || agent.x < 0) {\n            agent.z = -agent.z;\n        }\n        if (agent.y >= ").concat(simulationParameters.height, " || agent.y < 0) {\n            agent.w = -agent.w;\n        }\n\n        let randomDirChange = .1 * vec2(Random(uniforms.time + u32(agent.x)) - .5, Random(uniforms.time + u32(agent.y)) - .5);\n        let velocity = normalize(agent.zw + randomDirChange);\n\n        agent.z = velocity.x;\n        agent.w = velocity.y;\n\n        let pixel = vec2<u32>(agent.xy);\n        textureStore(textureOut, pixel, vec4(1.));\n        agents[index] = agent;\n        }");
        this.device = device;
        this.pheromoneTexture = pheromoneTexture;
        this.agentsBuffer = agentsBuffer;
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
    SimulationPass.prototype.addPass = function (commandEncoder) {
        var uniformData = new Uint32Array([new Date().getMilliseconds()]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData, 0, uniformData.length);
        var simulatePass = commandEncoder.beginComputePass();
        simulatePass.setPipeline(this.pipeline);
        simulatePass.setBindGroup(0, this.bindGroup);
        simulatePass.dispatchWorkgroups(1);
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



function go() {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, adapter, hasTimestampQuery, device, perfDisplayContainer, perfDisplay, context, presentationFormat, simulationParameters, pheromoneTexture, agentsBuffer, simulationPass, renderPass, frame;
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
                    context = canvas.getContext('webgpu');
                    presentationFormat = navigator.gpu.getPreferredCanvasFormat();
                    context.configure({
                        device: device,
                        format: presentationFormat,
                        alphaMode: 'premultiplied'
                    });
                    simulationParameters = {
                        agentCount: 1,
                        height: canvas.height,
                        width: canvas.width,
                    };
                    pheromoneTexture = device.createTexture({
                        size: [canvas.width, canvas.height],
                        format: 'rgba8unorm',
                        usage: GPUTextureUsage.TEXTURE_BINDING |
                            GPUTextureUsage.STORAGE_BINDING
                    });
                    agentsBuffer = device.createBuffer({
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
                        simulationPass.addPass(commandEncoder);
                        var canvasTextureView = context.getCurrentTexture().createView();
                        renderPass.addPass(commandEncoder, canvasTextureView);
                        device.queue.submit([commandEncoder.finish()]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsQ0FBQztvQkFDSCxJQUFJLFlBQVksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsaUVBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7b0JBQzFGLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFFZixjQUFjLEdBQUcsSUFBSSwyREFBYyxDQUFDLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFFbEcsVUFBVSxHQUFHLElBQUksbURBQVUsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztvQkFFdEQsS0FBSyxHQUFHO3dCQUNWLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO3dCQUVyRCxjQUFjLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUV2QyxJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUNuRSxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO3dCQUV0RCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNqQyxDQUFDLENBQUM7b0JBQ0YscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7O0NBQ2hDO0FBRUQsRUFBRSxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcmVuZGVyUGFzcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvbkNvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvblBhc3MudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5leHBvcnQgY2xhc3MgUmVuZGVyUGFzcyB7XHJcbiAgICBiaW5kR3JvdXA6IEdQVUJpbmRHcm91cDtcclxuICAgIHBpcGVsaW5lOiBHUFVSZW5kZXJQaXBlbGluZTtcclxuICAgIHNhbXBsZXI6IEdQVVNhbXBsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGV2aWNlOiBHUFVEZXZpY2UsIHBoZXJvbW9uZVRleHR1cmU6IEdQVVRleHR1cmUpIHtcclxuICAgICAgICBjb25zdCBzaGFkZXJDb2RlID0gYFxyXG5AZ3JvdXAoMCkgQGJpbmRpbmcoMCkgdmFyIHRleHR1cmVJbjogdGV4dHVyZV8yZDxmMzI+O1xyXG5AZ3JvdXAoMCkgQGJpbmRpbmcoMSkgdmFyIHNhbXBsZXJJbjogc2FtcGxlcjtcclxuXHJcbnN0cnVjdCBWZXJ0ZXhPdXQge1xyXG4gICAgQGJ1aWx0aW4ocG9zaXRpb24pIHBvc2l0aW9uIDogdmVjNGYsXHJcbiAgICBAbG9jYXRpb24oMCkgdXYgOiB2ZWMyZixcclxufVxyXG5cclxuQHZlcnRleFxyXG5mbiB2ZXJ0ZXhfbWFpbihAYnVpbHRpbih2ZXJ0ZXhfaW5kZXgpIFZlcnRleEluZGV4OiB1MzIpIC0+IFZlcnRleE91dFxyXG57XHJcbiAgICB2YXIgdmVydGljZXMgPSBhcnJheTx2ZWMyZiwgNj4oXHJcbiAgICB2ZWMyKC0xLCAtMSksXHJcbiAgICB2ZWMyKDEsIC0xKSxcclxuICAgIHZlYzIoLTEsIDEpLFxyXG4gICAgdmVjMigxLCAxKSxcclxuICAgIHZlYzIoMSwgLTEpLFxyXG4gICAgdmVjMigtMSwgMSksXHJcbiAgICApO1xyXG4gICAgdmFyIHV2cyA9IGFycmF5PHZlYzJmLCA2PiAoXHJcbiAgICB2ZWMyKDAsIDApLFxyXG4gICAgdmVjMigxLCAwKSxcclxuICAgIHZlYzIoMCwgMSksXHJcbiAgICB2ZWMyKDEsIDEpLFxyXG4gICAgdmVjMigxLCAwKSxcclxuICAgIHZlYzIoMCwgMSksXHJcbiAgICApO1xyXG4gICAgdmFyIG91dHB1dCA6IFZlcnRleE91dDtcclxuICAgIG91dHB1dC5wb3NpdGlvbiA9IHZlYzQodmVydGljZXNbVmVydGV4SW5kZXhdLCAwLCAxKTtcclxuICAgIG91dHB1dC51diA9IHV2c1tWZXJ0ZXhJbmRleF07XHJcbiAgICBcclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbn1cclxuXHJcbkBmcmFnbWVudFxyXG5mbiBmcmFnbWVudF9tYWluKGZyYWdEYXRhOiBWZXJ0ZXhPdXQpIC0+IEBsb2NhdGlvbigwKSB2ZWM0ZlxyXG57XHJcbiAgICByZXR1cm4gdmVjNCh0ZXh0dXJlU2FtcGxlKHRleHR1cmVJbiwgc2FtcGxlckluLCBmcmFnRGF0YS51dikueHl6LCAxKTtcclxufWA7XHJcblxyXG4gICAgICAgIHRoaXMuc2FtcGxlciA9IGRldmljZS5jcmVhdGVTYW1wbGVyKHtcclxuICAgICAgICAgICAgbWluRmlsdGVyOiBcImxpbmVhclwiLFxyXG4gICAgICAgICAgICBtYWdGaWx0ZXI6IFwibGluZWFyXCIsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyQmluZEdyb3VwTGF5b3V0ID0gZGV2aWNlLmNyZWF0ZUJpbmRHcm91cExheW91dCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlJlbmRlciBCaW5kIEdyb3VwIExheW91dFwiLFxyXG4gICAgICAgICAgICBlbnRyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBHUFVTaGFkZXJTdGFnZS5GUkFHTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogcGhlcm9tb25lVGV4dHVyZS5mb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VzczogXCJyZWFkLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkZSQUdNRU5ULFxyXG4gICAgICAgICAgICAgICAgICAgIHNhbXBsZXI6IHRoaXMuc2FtcGxlcixcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSBhcyBHUFVCaW5kR3JvdXBMYXlvdXRFbnRyeVtdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclNoYWRlck1vZHVsZSA9IGRldmljZS5jcmVhdGVTaGFkZXJNb2R1bGUoe1xyXG4gICAgICAgICAgICBjb2RlOiBzaGFkZXJDb2RlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBkZXZpY2UuY3JlYXRlUmVuZGVyUGlwZWxpbmUoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJSZW5kZXIgUGlwZWxpbmVcIixcclxuICAgICAgICAgICAgbGF5b3V0OiBkZXZpY2UuY3JlYXRlUGlwZWxpbmVMYXlvdXQoe1xyXG4gICAgICAgICAgICAgICAgYmluZEdyb3VwTGF5b3V0czogW3JlbmRlckJpbmRHcm91cExheW91dF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB2ZXJ0ZXg6IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZTogcmVuZGVyU2hhZGVyTW9kdWxlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmcmFnbWVudDoge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiByZW5kZXJTaGFkZXJNb2R1bGUsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IG5hdmlnYXRvci5ncHUuZ2V0UHJlZmVycmVkQ2FudmFzRm9ybWF0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByaW1pdGl2ZToge1xyXG4gICAgICAgICAgICAgICAgdG9wb2xvZ3k6ICd0cmlhbmdsZS1saXN0JyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRHcm91cCA9IGRldmljZS5jcmVhdGVCaW5kR3JvdXAoe1xyXG4gICAgICAgICAgICBsYWJlbDogXCJSZW5kZXIgQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IHJlbmRlckJpbmRHcm91cExheW91dCxcclxuICAgICAgICAgICAgZW50cmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHBoZXJvbW9uZVRleHR1cmUuY3JlYXRlVmlldygpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB0aGlzLnNhbXBsZXIsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFzcyhjb21tYW5kRW5jb2RlcjogR1BVQ29tbWFuZEVuY29kZXIsIHRhcmdldFZpZXc6IEdQVVRleHR1cmVWaWV3KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyUGFzc0Rlc2NyaXB0b3I6IEdQVVJlbmRlclBhc3NEZXNjcmlwdG9yICA9IHtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50czogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IHRhcmdldFZpZXcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJWYWx1ZTogWzAsIDAsIDAsIDFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRPcDogJ2NsZWFyJyxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZU9wOiAnc3RvcmUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSBhcyBHUFVSZW5kZXJQYXNzQ29sb3JBdHRhY2htZW50W10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgcGFzc0VuY29kZXIgPSBjb21tYW5kRW5jb2Rlci5iZWdpblJlbmRlclBhc3MocmVuZGVyUGFzc0Rlc2NyaXB0b3IpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLnNldFBpcGVsaW5lKHRoaXMucGlwZWxpbmUpO1xyXG4gICAgICAgIHBhc3NFbmNvZGVyLnNldEJpbmRHcm91cCgwLCB0aGlzLmJpbmRHcm91cCk7XHJcbiAgICAgICAgcGFzc0VuY29kZXIuZHJhdyg2KTtcclxuICAgICAgICBwYXNzRW5jb2Rlci5lbmQoKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBpbnRlcmZhY2UgSVNpbXVsYXRpb25QYXJhbWV0ZXJzIHtcclxuICAgIGFnZW50Q291bnQ6IG51bWJlclxyXG4gICAgd2lkdGg6IG51bWJlcixcclxuICAgIGhlaWdodDogbnVtYmVyLFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWdlbnRzQXJyYXkocGFyYW1ldGVyczogSVNpbXVsYXRpb25QYXJhbWV0ZXJzKTogbnVtYmVyW10ge1xyXG4gICAgY29uc3QgYWdlbnRzQXJyYXkgPSBuZXcgQXJyYXkoNCAqIHBhcmFtZXRlcnMuYWdlbnRDb3VudCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtZXRlcnMuYWdlbnRDb3VudDsgaSArPSA0KSB7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaV0gPSAxMjg7XHJcbiAgICAgICAgYWdlbnRzQXJyYXlbaSsxXSA9IDI1NjtcclxuICAgICAgICBhZ2VudHNBcnJheVtpKzJdID0gTWF0aC5yYW5kb20oKSAtIC41O1xyXG4gICAgICAgIGFnZW50c0FycmF5W2krM10gPSBNYXRoLnJhbmRvbSgpIC0gLjU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWdlbnRzQXJyYXk7XHJcbn0iLCJpbXBvcnQgeyBJU2ltdWxhdGlvblBhcmFtZXRlcnMgfSBmcm9tIFwiLi9zaW11bGF0aW9uQ29uZmlnXCI7XHJcblxyXG5jb25zdCBXT1JLR1JPVVBfU0laRSA9IDY0O1xyXG5cclxuZXhwb3J0IGNsYXNzIFNpbXVsYXRpb25QYXNzIHtcclxuICAgIGRldmljZTogR1BVRGV2aWNlO1xyXG4gICAgcGhlcm9tb25lVGV4dHVyZTogR1BVVGV4dHVyZTtcclxuICAgIGFnZW50c0J1ZmZlcjogR1BVQnVmZmVyO1xyXG5cclxuICAgIGJpbmRHcm91cDogR1BVQmluZEdyb3VwO1xyXG4gICAgdW5pZm9ybUJ1ZmZlcjogR1BVQnVmZmVyO1xyXG4gICAgcGlwZWxpbmU6IEdQVUNvbXB1dGVQaXBlbGluZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2U6IEdQVURldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycywgcGhlcm9tb25lVGV4dHVyZTogR1BVVGV4dHVyZSwgYWdlbnRzQnVmZmVyOiBHUFVCdWZmZXIpIHtcclxuICAgICAgICBjb25zdCBzaGFkZXJDb2RlID0gYFxyXG4gICAgICAgIC8vIEhhc2ggZnVuY3Rpb24gZnJvbSBILiBTY2hlY2h0ZXIgJiBSLiBCcmlkc29uLCBnb28uZ2wvUlhpS2FIXHJcbiAgICAgICAgZm4gSGFzaChwOiB1MzIpIC0+IHUzMlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBwOyBcclxuICAgICAgICAgICAgcyBePSAyNzQ3NjM2NDE5dTtcclxuICAgICAgICAgICAgcyAqPSAyNjU0NDM1NzY5dTtcclxuICAgICAgICAgICAgcyBePSBzID4+IDE2O1xyXG4gICAgICAgICAgICBzICo9IDI2NTQ0MzU3Njl1O1xyXG4gICAgICAgICAgICBzIF49IHMgPj4gMTY7XHJcbiAgICAgICAgICAgIHMgKj0gMjY1NDQzNTc2OXU7XHJcbiAgICAgICAgICAgIHJldHVybiBzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm4gUmFuZG9tKHNlZWQ6IHUzMikgLT4gZjMyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZjMyKEhhc2goc2VlZCkpIC8gNDI5NDk2NzI5NS4wOyAvLyAyXjMyLTFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0cnVjdCBVbmlmb3JtcyB7XHJcbiAgICAgICAgICAgIHRpbWU6IHUzMlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDApIHZhcjx1bmlmb3JtPiB1bmlmb3JtczogVW5pZm9ybXM7XHJcblxyXG4gICAgICAgIEBncm91cCgwKSBAYmluZGluZygxKSB2YXIgdGV4dHVyZU91dDogdGV4dHVyZV9zdG9yYWdlXzJkPCR7cGhlcm9tb25lVGV4dHVyZS5mb3JtYXR9LCB3cml0ZT47XHJcbiAgICAgICAgQGdyb3VwKDApIEBiaW5kaW5nKDIpIHZhcjxzdG9yYWdlLCByZWFkX3dyaXRlPiBhZ2VudHM6IGFycmF5PHZlYzRmLCAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLmFnZW50Q291bnR9PjtcclxuXHJcbiAgICAgICAgQGNvbXB1dGUgQHdvcmtncm91cF9zaXplKCR7V09SS0dST1VQX1NJWkV9KVxyXG4gICAgICAgIGZuIHNpbXVsYXRlKEBidWlsdGluKGdsb2JhbF9pbnZvY2F0aW9uX2lkKSBnbG9iYWxfaWQ6IHZlYzM8dTMyPikge1xyXG4gICAgICAgIGxldCBpbmRleCA9IGdsb2JhbF9pZC54O1xyXG4gICAgICAgIC8vIFRyaW0gb2ZmIHRoZSBleGNlc3MgaWYgYWdlbnRDb3VudCAlIFdPUktHUk9VUF9TSVpFICE9IDBcclxuICAgICAgICBpZiAoaW5kZXggPj0gJHtzaW11bGF0aW9uUGFyYW1ldGVycy5hZ2VudENvdW50fSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYWdlbnQgPSBhZ2VudHNbaW5kZXhdO1xyXG5cclxuICAgICAgICBhZ2VudC54ICs9IGFnZW50Lno7XHJcbiAgICAgICAgYWdlbnQueSArPSBhZ2VudC53O1xyXG5cclxuICAgICAgICBpZiAoYWdlbnQueCA+PSAke3NpbXVsYXRpb25QYXJhbWV0ZXJzLndpZHRofSB8fCBhZ2VudC54IDwgMCkge1xyXG4gICAgICAgICAgICBhZ2VudC56ID0gLWFnZW50Lno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhZ2VudC55ID49ICR7c2ltdWxhdGlvblBhcmFtZXRlcnMuaGVpZ2h0fSB8fCBhZ2VudC55IDwgMCkge1xyXG4gICAgICAgICAgICBhZ2VudC53ID0gLWFnZW50Lnc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmFuZG9tRGlyQ2hhbmdlID0gLjEgKiB2ZWMyKFJhbmRvbSh1bmlmb3Jtcy50aW1lICsgdTMyKGFnZW50LngpKSAtIC41LCBSYW5kb20odW5pZm9ybXMudGltZSArIHUzMihhZ2VudC55KSkgLSAuNSk7XHJcbiAgICAgICAgbGV0IHZlbG9jaXR5ID0gbm9ybWFsaXplKGFnZW50Lnp3ICsgcmFuZG9tRGlyQ2hhbmdlKTtcclxuXHJcbiAgICAgICAgYWdlbnQueiA9IHZlbG9jaXR5Lng7XHJcbiAgICAgICAgYWdlbnQudyA9IHZlbG9jaXR5Lnk7XHJcblxyXG4gICAgICAgIGxldCBwaXhlbCA9IHZlYzI8dTMyPihhZ2VudC54eSk7XHJcbiAgICAgICAgdGV4dHVyZVN0b3JlKHRleHR1cmVPdXQsIHBpeGVsLCB2ZWM0KDEuKSk7XHJcbiAgICAgICAgYWdlbnRzW2luZGV4XSA9IGFnZW50O1xyXG4gICAgICAgIH1gO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcclxuICAgICAgICB0aGlzLnBoZXJvbW9uZVRleHR1cmUgPSBwaGVyb21vbmVUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMuYWdlbnRzQnVmZmVyID0gYWdlbnRzQnVmZmVyO1xyXG5cclxuICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgc2l6ZTogNCxcclxuICAgICAgICAgICAgdXNhZ2U6IEdQVUJ1ZmZlclVzYWdlLlVOSUZPUk0gfCBHUFVCdWZmZXJVc2FnZS5DT1BZX0RTVFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBjb21wdXRlQmluZEdyb3VwTGF5b3V0ID0gZGV2aWNlLmNyZWF0ZUJpbmRHcm91cExheW91dCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cCBMYXlvdXRcIixcclxuICAgICAgICAgICAgZW50cmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogR1BVU2hhZGVyU3RhZ2UuQ09NUFVURSxcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ1bmlmb3JtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZVRleHR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBwaGVyb21vbmVUZXh0dXJlLmZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBcIndyaXRlLW9ubHlcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IEdQVVNoYWRlclN0YWdlLkNPTVBVVEUsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN0b3JhZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSBhcyBHUFVCaW5kR3JvdXBMYXlvdXRFbnRyeVtdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmluZEdyb3VwID0gZGV2aWNlLmNyZWF0ZUJpbmRHcm91cCh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gQmluZCBHcm91cFwiLFxyXG4gICAgICAgICAgICBsYXlvdXQ6IGNvbXB1dGVCaW5kR3JvdXBMYXlvdXQsXHJcbiAgICAgICAgICAgIGVudHJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7IGJ1ZmZlcjogdGhpcy51bmlmb3JtQnVmZmVyIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHBoZXJvbW9uZVRleHR1cmUuY3JlYXRlVmlldygpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlOnsgYnVmZmVyOiBhZ2VudHNCdWZmZXIgfSwgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0gYXMgR1BVQmluZEdyb3VwRW50cnlbXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBpcGVsaW5lID0gZGV2aWNlLmNyZWF0ZUNvbXB1dGVQaXBlbGluZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiBcIlNpbXVsYXRpb24gUGlwZWxpbmVcIixcclxuICAgICAgICAgICAgbGF5b3V0OiBkZXZpY2UuY3JlYXRlUGlwZWxpbmVMYXlvdXQoe1xyXG4gICAgICAgICAgICAgICAgYmluZEdyb3VwTGF5b3V0czogW2NvbXB1dGVCaW5kR3JvdXBMYXlvdXRdLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgY29tcHV0ZToge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlOiBkZXZpY2UuY3JlYXRlU2hhZGVyTW9kdWxlKHtjb2RlOiBzaGFkZXJDb2RlfSksXHJcbiAgICAgICAgICAgICAgICBlbnRyeVBvaW50OiAnc2ltdWxhdGUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQYXNzKGNvbW1hbmRFbmNvZGVyOiBHUFVDb21tYW5kRW5jb2Rlcik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHVuaWZvcm1EYXRhID0gbmV3IFVpbnQzMkFycmF5KFtuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGV2aWNlLnF1ZXVlLndyaXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1CdWZmZXIsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHVuaWZvcm1EYXRhLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB1bmlmb3JtRGF0YS5sZW5ndGgsXHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICBjb25zdCBzaW11bGF0ZVBhc3MgPSBjb21tYW5kRW5jb2Rlci5iZWdpbkNvbXB1dGVQYXNzKCk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLnNldFBpcGVsaW5lKHRoaXMucGlwZWxpbmUpO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5zZXRCaW5kR3JvdXAoMCwgdGhpcy5iaW5kR3JvdXApO1xyXG4gICAgICAgIHNpbXVsYXRlUGFzcy5kaXNwYXRjaFdvcmtncm91cHMoMSk7XHJcbiAgICAgICAgc2ltdWxhdGVQYXNzLmVuZCgpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBSZW5kZXJQYXNzIH0gZnJvbSBcIi4vcmVuZGVyUGFzc1wiO1xyXG5pbXBvcnQgeyBnZXRBZ2VudHNBcnJheSwgSVNpbXVsYXRpb25QYXJhbWV0ZXJzIH0gZnJvbSBcIi4vc2ltdWxhdGlvbkNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBTaW11bGF0aW9uUGFzcyB9IGZyb20gXCIuL3NpbXVsYXRpb25QYXNzXCI7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnbygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY29uc3QgYWRhcHRlciA9IGF3YWl0IG5hdmlnYXRvci5ncHUucmVxdWVzdEFkYXB0ZXIoKTtcclxuICAgIGNvbnN0IGhhc1RpbWVzdGFtcFF1ZXJ5ID0gYWRhcHRlci5mZWF0dXJlcy5oYXMoXCJ0aW1lc3RhbXAtcXVlcnlcIik7XHJcbiAgICBjb25zdCBkZXZpY2UgPSBhd2FpdCBhZGFwdGVyLnJlcXVlc3REZXZpY2Uoe1xyXG4gICAgICAgIHJlcXVpcmVkRmVhdHVyZXM6IGhhc1RpbWVzdGFtcFF1ZXJ5ID8gW1widGltZXN0YW1wLXF1ZXJ5XCJdIGFzIEdQVUZlYXR1cmVOYW1lW106IFtdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUGVyZm9ybWFuY2UgU3RhdGlzdGljcyBEb2N1bWVudCBTZXR1cFxyXG4gICAgY29uc3QgcGVyZkRpc3BsYXlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLmNvbG9yID0gJ3doaXRlJztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLmJhY2tkcm9wRmlsdGVyID0gJ2JsdXIoMTBweCknO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUuYm90dG9tID0gJzEwcHgnO1xyXG4gICAgcGVyZkRpc3BsYXlDb250YWluZXIuc3R5bGUubGVmdCA9ICcxMHB4JztcclxuICAgIHBlcmZEaXNwbGF5Q29udGFpbmVyLnN0eWxlLnRleHRBbGlnbiA9ICdsZWZ0JztcclxuICAgIGNvbnN0IHBlcmZEaXNwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncHJlJyk7XHJcbiAgICBwZXJmRGlzcGxheS5zdHlsZS5tYXJnaW4gPSAnLjVlbSc7XHJcbiAgICBwZXJmRGlzcGxheUNvbnRhaW5lci5hcHBlbmRDaGlsZChwZXJmRGlzcGxheSk7XHJcbiAgICBjYW52YXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChwZXJmRGlzcGxheUNvbnRhaW5lcik7XHJcblxyXG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJncHUnKSBhcyB1bmtub3duIGFzIEdQVUNhbnZhc0NvbnRleHQ7XHJcbiAgICBjb25zdCBwcmVzZW50YXRpb25Gb3JtYXQgPSBuYXZpZ2F0b3IuZ3B1LmdldFByZWZlcnJlZENhbnZhc0Zvcm1hdCgpO1xyXG4gICAgY29udGV4dC5jb25maWd1cmUoe1xyXG4gICAgICAgIGRldmljZSxcclxuICAgICAgICBmb3JtYXQ6IHByZXNlbnRhdGlvbkZvcm1hdCxcclxuICAgICAgICBhbHBoYU1vZGU6ICdwcmVtdWx0aXBsaWVkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc2ltdWxhdGlvblBhcmFtZXRlcnM6IElTaW11bGF0aW9uUGFyYW1ldGVycyA9IHtcclxuICAgICAgICBhZ2VudENvdW50OiAxLFxyXG4gICAgICAgIGhlaWdodDogY2FudmFzLmhlaWdodCxcclxuICAgICAgICB3aWR0aDogY2FudmFzLndpZHRoLFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBoZXJvbW9uZVRleHR1cmUgPSBkZXZpY2UuY3JlYXRlVGV4dHVyZSh7XHJcbiAgICAgICAgc2l6ZTogW2NhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodF0sXHJcbiAgICAgICAgZm9ybWF0OiAgJ3JnYmE4dW5vcm0nLFxyXG4gICAgICAgIHVzYWdlOiBcclxuICAgICAgICAgICAgR1BVVGV4dHVyZVVzYWdlLlRFWFRVUkVfQklORElORyB8XHJcbiAgICAgICAgICAgIEdQVVRleHR1cmVVc2FnZS5TVE9SQUdFX0JJTkRJTkdcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGFnZW50c0J1ZmZlciA9IGRldmljZS5jcmVhdGVCdWZmZXIoe1xyXG4gICAgICAgIHNpemU6IDE2ICogc2ltdWxhdGlvblBhcmFtZXRlcnMuYWdlbnRDb3VudCxcclxuICAgICAgICB1c2FnZTogR1BVQnVmZmVyVXNhZ2UuU1RPUkFHRSxcclxuICAgICAgICBtYXBwZWRBdENyZWF0aW9uOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICBuZXcgRmxvYXQzMkFycmF5KGFnZW50c0J1ZmZlci5nZXRNYXBwZWRSYW5nZSgpKS5zZXQoZ2V0QWdlbnRzQXJyYXkoc2ltdWxhdGlvblBhcmFtZXRlcnMpKTtcclxuICAgIGFnZW50c0J1ZmZlci51bm1hcCgpO1xyXG5cclxuICAgIGNvbnN0IHNpbXVsYXRpb25QYXNzID0gbmV3IFNpbXVsYXRpb25QYXNzKGRldmljZSwgc2ltdWxhdGlvblBhcmFtZXRlcnMsIHBoZXJvbW9uZVRleHR1cmUsIGFnZW50c0J1ZmZlcik7XHJcblxyXG4gICAgY29uc3QgcmVuZGVyUGFzcyA9IG5ldyBSZW5kZXJQYXNzKGRldmljZSwgcGhlcm9tb25lVGV4dHVyZSk7XHJcblxyXG4gICAgY29uc3QgZnJhbWUgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZEVuY29kZXIgPSBkZXZpY2UuY3JlYXRlQ29tbWFuZEVuY29kZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICBzaW11bGF0aW9uUGFzcy5hZGRQYXNzKGNvbW1hbmRFbmNvZGVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FudmFzVGV4dHVyZVZpZXcgPSBjb250ZXh0LmdldEN1cnJlbnRUZXh0dXJlKCkuY3JlYXRlVmlldygpO1xyXG4gICAgICAgIHJlbmRlclBhc3MuYWRkUGFzcyhjb21tYW5kRW5jb2RlciwgY2FudmFzVGV4dHVyZVZpZXcpO1xyXG5cclxuICAgICAgICBkZXZpY2UucXVldWUuc3VibWl0KFtjb21tYW5kRW5jb2Rlci5maW5pc2goKV0pO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZSk7XHJcbiAgICB9O1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcclxufVxyXG5cclxuZ28oKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=