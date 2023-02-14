/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controls/mouse-handler.ts":
/*!***************************************!*\
  !*** ./src/controls/mouse-handler.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MouseHandler = void 0;\nclass MouseHandler {\n    mouseX;\n    mouseY;\n    mousePressed;\n    rect;\n    constructor(canvas) {\n        this.mouseX = 0;\n        this.mouseY = 0;\n        this.mousePressed = false;\n        this.rect = canvas.getBoundingClientRect();\n        document.addEventListener('mousemove', (e) => this.mouseMove(e));\n        document.addEventListener('mousedown', (e) => this.mouseDown(e));\n        document.addEventListener('mouseup', (e) => this.mouseUp(e));\n    }\n    dispose() {\n        document.removeEventListener('mousemove', this.mouseMove);\n        document.removeEventListener('mousedown', this.mouseDown);\n        document.removeEventListener('mouseup', this.mouseUp);\n    }\n    getMousePosition() {\n        return [this.mouseX, this.mouseY];\n    }\n    getMousePressed() {\n        return this.mousePressed;\n    }\n    mouseMove(e) {\n        this.mouseX = e.clientX - this.rect.x;\n        this.mouseY = e.clientY - this.rect.y;\n    }\n    mouseDown(e) {\n        if (e.button === 0)\n            this.mousePressed = true;\n    }\n    mouseUp(e) {\n        if (e.button === 0)\n            this.mousePressed = false;\n    }\n}\nexports.MouseHandler = MouseHandler;\n\n\n//# sourceURL=webpack://typenodes/./src/controls/mouse-handler.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst mouse_handler_1 = __webpack_require__(/*! ./controls/mouse-handler */ \"./src/controls/mouse-handler.ts\");\nconst render_1 = __webpack_require__(/*! ./rendering/render */ \"./src/rendering/render.ts\");\nconst cnv = document.getElementById('cnv');\ncnv.width = window.innerWidth * window.devicePixelRatio;\ncnv.height = window.innerHeight * window.devicePixelRatio;\nconst render = new render_1.Render(cnv);\nconst mouseHandler = new mouse_handler_1.MouseHandler(cnv);\nlet cardSide = 0;\nlet selectedCardSide = 0;\nwindow.addEventListener('resize', () => {\n    render.resize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);\n});\nwindow.addEventListener('pointerdown', () => {\n    selectedCardSide = 1 - selectedCardSide;\n});\nconst update = () => {\n    const mousePosition = mouseHandler.getMousePosition();\n    const mouseX = mousePosition[0] / cnv.width * 4 - 1;\n    const mouseY = 0.5 - mousePosition[1] / cnv.height * 2;\n    render.clear([1, 1, 1]);\n    render.prepareQuads();\n    render.drawQuad(mouseX, mouseY, cardSide, performance.now() / 1000);\n    cardSide = cardSide * 0.95 + selectedCardSide * 0.05;\n    requestAnimationFrame(update);\n};\nupdate();\n\n\n//# sourceURL=webpack://typenodes/./src/index.ts?");

/***/ }),

/***/ "./src/rendering/quad-positions.ts":
/*!*****************************************!*\
  !*** ./src/rendering/quad-positions.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.quadPositions = void 0;\nexports.quadPositions = [\n    0, 0,\n    1, 0,\n    1, 1,\n    1, 1,\n    0, 1,\n    0, 0,\n];\n\n\n//# sourceURL=webpack://typenodes/./src/rendering/quad-positions.ts?");

/***/ }),

/***/ "./src/rendering/quad-program.ts":
/*!***************************************!*\
  !*** ./src/rendering/quad-program.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.QuadProgram = void 0;\nclass QuadProgram {\n    program;\n    positionAttribute;\n    sizeUniform;\n    resolutionUniform;\n    mouseUniform;\n    sideUniform;\n    timeUniform;\n    updateProgram(gl) {\n        const vertexShader = gl.createShader(gl.VERTEX_SHADER);\n        gl.shaderSource(vertexShader, this.vertexShaderCode);\n        gl.compileShader(vertexShader);\n        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);\n        gl.shaderSource(fragmentShader, this.fragmentShaderCode);\n        gl.compileShader(fragmentShader);\n        const log = gl.getShaderInfoLog(fragmentShader);\n        if (log) {\n            console.log(log);\n            console.log(this.fragmentShaderCode);\n        }\n        const program = gl.createProgram();\n        gl.attachShader(program, vertexShader);\n        gl.attachShader(program, fragmentShader);\n        gl.linkProgram(program);\n        gl.deleteShader(vertexShader);\n        gl.deleteShader(fragmentShader);\n        this.program = program;\n        this.positionAttribute = gl.getAttribLocation(program, 'a_position');\n        this.resolutionUniform = gl.getUniformLocation(program, 'u_resolution');\n        this.mouseUniform = gl.getUniformLocation(program, 'u_mouse');\n        this.sideUniform = gl.getUniformLocation(program, 'u_side');\n        this.timeUniform = gl.getUniformLocation(program, 'u_time');\n    }\n    getProgram() {\n        return this.program;\n    }\n    getPositionAttribute() {\n        return this.positionAttribute;\n    }\n    getRectUniform() {\n        return this.sizeUniform;\n    }\n    getResolutionUniform() {\n        return this.resolutionUniform;\n    }\n    getMouseUniform() {\n        return this.mouseUniform;\n    }\n    getSideUniform() {\n        return this.sideUniform;\n    }\n    getTimeUniform() {\n        return this.timeUniform;\n    }\n    vertexShaderCode = `#version 300 es\n        in vec2 a_position;\n\n        out vec2 v_texcoord;\n\n        void main() {\n            v_texcoord = a_position;\n            gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);\n        }\n    `;\n    fragmentShaderCode = `#version 300 es\n        precision highp float;\n\n        in vec2 v_texcoord;\n\n        uniform vec2 u_resolution;\n        uniform float u_time;\n        uniform vec2 u_mouse;\n        uniform float u_side;\n\n        out vec4 outColor;\n\n        mat2 rot(float a) {\n            float s = sin(a);\n            float c = cos(a);\n            return mat2(c, -s, s, c);\n        }\n\n        float dot2(vec2 v) {\n            return dot(v, v);\n        }\n\n        float plane(vec3 ro, vec3 rd, vec4 p) {\n            return -(dot(ro, p.xyz) + p.w) / dot(rd, p.xyz);\n        }\n\n        float square(vec2 p, vec2 b) {\n            vec2 d = abs(p) - b;\n            return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);\n        }\n\n        float heart(vec2 p) {\n            p.x = abs(p.x);\n            if(p.y + p.x > 1.0) return sqrt(dot2(p - vec2(0.25, 0.75))) - sqrt(2.0) / 4.0;\n            return sqrt(min(dot2(p - vec2(0.00, 1.00)), dot2(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);\n        }\n\n        float box(vec3 p, vec3 b) {\n            vec3 q = abs(p) - b;\n            return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);\n        }\n        \n        vec2 map(vec3 p) {\n            float dBox = -box(p, vec3(0.5, 0.5, 0.75)) + 0.15;\n            vec3 hp = p - vec3(0.0, 0.0, 0.5);\n            float size = 1.0 + (pow(abs(sin(u_time * 3.0)), 64.0) + pow(abs(sin(u_time * 3.0 + 1.0)), 64.0)) * 0.05;\n            float hd = heart(-hp.yz * size) + size * 0.5;\n            hd = sqrt(hd * hd + hp.x * hp.x) - size * 0.5;\n            hd = max(hd, -p.x);\n            dBox = max(dBox, -p.x);\n            if (dBox < hd) return vec2(dBox, 0.0);\n            return vec2(hd, 1.0);\n        }\n\n        vec3 normal(vec3 p) {\n            vec2 e = vec2(1.0, -1.0) * 0.5773 * 0.0005;\n            return normalize(e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x + e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);\n        }\n\n        vec3 march(vec3 ro, vec3 rd) {\n            vec3 p = ro;\n            for (int i = 0; i < 100; i++) {\n                vec2 d = map(p);\n                if (d.x < 0.001) {\n                    vec3 color = vec3(0.8, 0.75, 0.7);\n                    if (d.y > 0.5) color = vec3(1.0, 0.1, 0.15);\n                    vec3 lightDir = normalize(vec3(-0.5, 0.5, 1.0));\n                    float diffuse = clamp(dot(lightDir, normal(p)) * 0.25 + 0.75, 0.0, 1.0);\n                    return vec3(color * diffuse);\n                }\n                else if (d.x > 10.0) {\n                    return vec3(0.0);\n                }\n                p += rd * d.x;\n            }\n            return vec3(0.0);\n        }\n\n        void main() {\n            vec2 uv = v_texcoord - 0.5;\n            uv.x *= u_resolution.x / u_resolution.y;\n            vec3 color = vec3(0.0);\n            vec3 ro = vec3(-3.0, 0.0, 0.0);\n            vec3 rd = normalize(vec3(1.0, uv));\n            vec2 mouse = u_mouse;\n            mouse.y *= (1.0 - u_side) * 2.0 - 1.0;\n            ro.xy *= rot(mouse.x - u_side * 3.1415);\n            rd.xy *= rot(mouse.x - u_side * 3.1415);\n            ro.xz *= rot(mouse.y);\n            rd.xz *= rot(mouse.y);\n            float planeDist = plane(ro, rd, vec4(-1.0, 0.0, 0.0, 0.0));\n            vec3 planePoint = ro + rd * planeDist;\n            if (planeDist > 0.0) {\n                float squareDist = square(planePoint.yz, vec2(0.5, 0.75));\n                if (squareDist - 0.2 < 0.0) {\n                    if (dot(rd, vec3(1.0, 0.0, 0.0)) > 0.0) {\n                        float circles = sin(planePoint.y * 10.0 + 1.5) + sin(planePoint.z * 10.0);\n                        float circlesMask = smoothstep(0.5, 0.51, circles);\n                        color = mix(vec3(0.1), vec3(0.1, 0.3, 0.6), circlesMask);\n                        float specular = pow(max(dot(rd, vec3(1.0, 0.0, 0.0)), 0.0), 32.0);\n                        color += specular * clamp(circlesMask, 0.1, 0.75);\n                    }\n                    else {\n                        color = vec3(0.8, 0.75, 0.7);\n                        if (squareDist - 0.15 < 0.0) {\n                            color = march(-ro, -rd);\n                        }\n                    }\n                }\n            }\n            outColor = vec4(color, 1.0);\n        }\n    `;\n}\nexports.QuadProgram = QuadProgram;\n\n\n//# sourceURL=webpack://typenodes/./src/rendering/quad-program.ts?");

/***/ }),

/***/ "./src/rendering/render.ts":
/*!*********************************!*\
  !*** ./src/rendering/render.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Render = void 0;\nconst quad_positions_1 = __webpack_require__(/*! ./quad-positions */ \"./src/rendering/quad-positions.ts\");\nconst quad_program_1 = __webpack_require__(/*! ./quad-program */ \"./src/rendering/quad-program.ts\");\nclass Render {\n    canvas;\n    gl;\n    positionBuffer;\n    quadProgram;\n    constructor(canvas) {\n        this.canvas = canvas;\n        this.gl = canvas.getContext('webgl2');\n        this.resize(this.gl.canvas.width, this.gl.canvas.height);\n        this.initBuffers();\n        this.quadProgram = new quad_program_1.QuadProgram();\n        this.quadProgram.updateProgram(this.gl);\n        this.gl.enable(this.gl.BLEND);\n        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);\n    }\n    resize(width, height) {\n        this.gl.canvas.width = width;\n        this.gl.canvas.height = height;\n        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);\n    }\n    clear(color) {\n        this.gl.clearColor(...color, 1.0);\n        this.gl.clear(this.gl.COLOR_BUFFER_BIT);\n    }\n    prepareQuads() {\n        this.gl.useProgram(this.quadProgram.getProgram());\n        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);\n        this.gl.enableVertexAttribArray(this.quadProgram.getPositionAttribute());\n        this.gl.vertexAttribPointer(this.quadProgram.getPositionAttribute(), 2, this.gl.FLOAT, false, 0, 0);\n    }\n    drawQuad(mouseX, mouseY, side, time) {\n        this.gl.uniform2f(this.quadProgram.getResolutionUniform(), this.canvas.width, this.canvas.height);\n        this.gl.uniform2f(this.quadProgram.getMouseUniform(), mouseX, mouseY);\n        this.gl.uniform1f(this.quadProgram.getSideUniform(), side);\n        this.gl.uniform1f(this.quadProgram.getTimeUniform(), time);\n        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);\n    }\n    initBuffers() {\n        this.positionBuffer = this.gl.createBuffer();\n        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);\n        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(quad_positions_1.quadPositions), this.gl.STATIC_DRAW);\n    }\n}\nexports.Render = Render;\n\n\n//# sourceURL=webpack://typenodes/./src/rendering/render.ts?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;