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

/***/ "./dist/main.js":
/*!**********************!*\
  !*** ./dist/main.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CONFIG = void 0;\nconst phaser_1 = __importDefault(__webpack_require__(/*! phaser */ \"phaser\"));\nconst World_1 = __importDefault(__webpack_require__(/*! ./scenes/World */ \"./dist/scenes/World.js\"));\nexports.CONFIG = {\n    type: phaser_1.default.CANVAS,\n    parent: 'phaser-game',\n    width: 800,\n    height: 600,\n    pixelArt: true,\n    physics: {\n        default: 'arcade',\n        arcade: {}\n    },\n    zoom: 1,\n    scene: [World_1.default]\n};\nconst GAME = new phaser_1.default.Game(exports.CONFIG);\n\n\n//# sourceURL=webpack://maerio/./dist/main.js?");

/***/ }),

/***/ "./dist/scenes/World.js":
/*!******************************!*\
  !*** ./dist/scenes/World.js ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass World extends Phaser.Scene {\n    constructor() {\n        super({ key: 'worldScene' });\n    }\n    init() {\n    }\n    preload() {\n    }\n    create() {\n    }\n    update(time, delta) {\n    }\n}\nexports[\"default\"] = World;\n\n\n//# sourceURL=webpack://maerio/./dist/scenes/World.js?");

/***/ }),

/***/ "phaser":
/*!*************************!*\
  !*** external "Phaser" ***!
  \*************************/
/***/ ((module) => {

module.exports = Phaser;

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/main.js");
/******/ 	
/******/ })()
;