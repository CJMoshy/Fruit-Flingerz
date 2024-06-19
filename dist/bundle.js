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

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.loggedin = exports.CONFIG = void 0;\nconst phaser_1 = __importDefault(__webpack_require__(/*! phaser */ \"phaser\"));\nconst World_1 = __importDefault(__webpack_require__(/*! ./scenes/World */ \"./dist/scenes/World.js\"));\nexports.CONFIG = {\n    type: phaser_1.default.CANVAS,\n    parent: 'phaser-game',\n    width: 800,\n    height: 600,\n    pixelArt: true,\n    scale: {\n        autoCenter: phaser_1.default.Scale.CENTER_BOTH\n    },\n    physics: {\n        default: 'arcade',\n        arcade: {}\n    },\n    zoom: 1,\n    scene: [World_1.default]\n};\nexports.loggedin = false;\nconst GAME = new phaser_1.default.Game(exports.CONFIG);\ndocument.addEventListener('DOMContentLoaded', (e) => {\n    var _a;\n    let usernameField = document.getElementById('username-field');\n    let passwordField = document.getElementById('password-field');\n    (_a = document.getElementById('login-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener(\"click\", () => {\n        usernameField.value === '' ? console.log('no username') : console.log(usernameField.value);\n        passwordField.value === '' ? console.log('no password') : console.log(passwordField.value);\n    });\n});\n\n\n//# sourceURL=webpack://maerio/./dist/main.js?");

/***/ }),

/***/ "./dist/prefabs/Player.js":
/*!********************************!*\
  !*** ./dist/prefabs/Player.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Player extends Phaser.Physics.Arcade.Sprite {\n    constructor(scene, x, y, texture, frame, _name = 'player', _hitPoints = 10) {\n        super(scene, x, y, texture, frame);\n        this.name = _name;\n        this.health = _hitPoints;\n    }\n}\nexports[\"default\"] = Player;\n\n\n//# sourceURL=webpack://maerio/./dist/prefabs/Player.js?");

/***/ }),

/***/ "./dist/scenes/World.js":
/*!******************************!*\
  !*** ./dist/scenes/World.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Player_1 = __importDefault(__webpack_require__(/*! ../prefabs/Player */ \"./dist/prefabs/Player.js\"));\nclass World extends Phaser.Scene {\n    constructor() {\n        super({ key: 'worldScene' });\n        this.player = null;\n    }\n    init() {\n    }\n    preload() {\n    }\n    create() {\n        this.player = new Player_1.default(this, 100, 100, 'a', 0, undefined, 2);\n    }\n    update(time, delta) {\n    }\n}\nexports[\"default\"] = World;\n\n\n//# sourceURL=webpack://maerio/./dist/scenes/World.js?");

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