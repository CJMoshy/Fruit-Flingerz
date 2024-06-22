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

/***/ "./dist/frontend/lib/StateMachine.js":
/*!*******************************************!*\
  !*** ./dist/frontend/lib/StateMachine.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.State = void 0;\nclass StateMachine {\n    constructor(initialState, possibleStates, stateArgs) {\n        this.initialState = initialState;\n        this.possibleStates = possibleStates;\n        this.stateArgs = stateArgs;\n        this.state = null;\n        for (const state of Object.values(this.possibleStates)) {\n            state.stateMachine = this;\n        }\n    }\n    step() {\n        if (this.state === null) {\n            this.state = this.initialState;\n            this.possibleStates[this.initialState].enter(...this.stateArgs);\n        }\n        this.possibleStates[this.state].execute(...this.stateArgs);\n    }\n    transition(newState) {\n        this.state = newState;\n        this.possibleStates[this.state].enter(...this.stateArgs);\n    }\n}\nexports[\"default\"] = StateMachine;\nclass State {\n    enter(...args) {\n    }\n    execute(...args) {\n    }\n}\nexports.State = State;\n\n\n//# sourceURL=webpack://maerio/./dist/frontend/lib/StateMachine.js?");

/***/ }),

/***/ "./dist/frontend/prefabs/Player.js":
/*!*****************************************!*\
  !*** ./dist/frontend/prefabs/Player.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst StateMachine_1 = __importDefault(__webpack_require__(/*! ../lib/StateMachine */ \"./dist/frontend/lib/StateMachine.js\"));\nconst StateMachine_2 = __webpack_require__(/*! ../lib/StateMachine */ \"./dist/frontend/lib/StateMachine.js\");\nclass Player extends Phaser.Physics.Arcade.Sprite {\n    constructor(scene, x, y, texture, frame, _name = 'player', _hitPoints = 10) {\n        var _a;\n        super(scene, x, y, texture, frame);\n        scene.add.existing(this);\n        scene.physics.add.existing(this);\n        this.setCollideWorldBounds(true);\n        this.setGravityY(500);\n        this.name = _name;\n        this.health = _hitPoints;\n        this.VELOCITY = 200;\n        this.JUMP_VELOCITY = -300;\n        this.isJumping = false;\n        this.jumpCount = 0;\n        this.keys = (_a = scene.input.keyboard) === null || _a === void 0 ? void 0 : _a.addKeys({ 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'up': Phaser.Input.Keyboard.KeyCodes.W });\n        this.FSM = new StateMachine_1.default('idle', {\n            idle: new idleState(),\n            move: new moveState(),\n            jump: new jumpState()\n        }, [scene, this]);\n    }\n    update(...args) {\n        this.FSM.step();\n        this.determineTexture();\n    }\n    handleMovement() {\n        let vector = new Phaser.Math.Vector2(0, 0);\n        if (this.keys.left.isDown) {\n            this.setFlipX(true);\n            vector.x = -1;\n            this.setVelocityX(this.VELOCITY * vector.x);\n        }\n        if (this.keys.right.isDown) {\n            this.setFlipX(false);\n            vector.x = 1;\n            this.setVelocityX(this.VELOCITY * vector.x);\n        }\n    }\n    determineTexture() {\n        var _a, _b;\n        if (((_a = this.body) === null || _a === void 0 ? void 0 : _a.velocity.y) !== undefined && this.body.velocity.y < 0) {\n            this.setTexture('player-01-jump');\n        }\n        else if (((_b = this.body) === null || _b === void 0 ? void 0 : _b.velocity.y) !== undefined && this.body.velocity.y > 0) {\n            this.setTexture('player-01-fall');\n        }\n    }\n}\nexports[\"default\"] = Player;\nclass idleState extends StateMachine_2.State {\n    enter(scene, player) {\n        console.log('in idle player state');\n        player.anims.play('player01-idle');\n    }\n    execute(scene, player) {\n        var _a;\n        if (Phaser.Input.Keyboard.JustDown(player.keys.up)) {\n            if (this.stateMachine !== undefined && player.isJumping === false) {\n                this.stateMachine.transition('jump');\n            }\n        }\n        if ((_a = player.body) === null || _a === void 0 ? void 0 : _a.blocked.down) {\n            if (player.keys.left.isDown || player.keys.right.isDown) {\n                if (this.stateMachine !== undefined) {\n                    this.stateMachine.transition('move');\n                }\n            }\n        }\n    }\n}\nclass moveState extends StateMachine_2.State {\n    enter(scene, player) {\n        console.log('in move player State');\n        player.anims.stop();\n        player.anims.play('player01-run');\n    }\n    execute(scene, player) {\n        if (Phaser.Input.Keyboard.JustDown(player.keys.up)) {\n            if (this.stateMachine !== undefined && player.isJumping === false) {\n                this.stateMachine.transition('jump');\n            }\n        }\n        if (!(player.keys.left.isDown || player.keys.right.isDown)) {\n            if (this.stateMachine !== undefined) {\n                this.stateMachine.transition('idle');\n            }\n        }\n        player.handleMovement();\n    }\n}\nclass jumpState extends StateMachine_2.State {\n    enter(scene, player) {\n        var _a;\n        console.log('in jump player State', player.jumpCount);\n        player.jumpCount += 1;\n        if (player.jumpCount === 2) {\n            player.anims.stop();\n            player.anims.play('player01-dbJmp');\n            player.isJumping = true;\n        }\n        player.setVelocityY(player.JUMP_VELOCITY);\n        (_a = this.stateMachine) === null || _a === void 0 ? void 0 : _a.transition('idle');\n    }\n    execute(scene, player) {\n        player.handleMovement();\n    }\n}\n\n\n//# sourceURL=webpack://maerio/./dist/frontend/prefabs/Player.js?");

/***/ }),

/***/ "./dist/frontend/scenes/Loader.js":
/*!****************************************!*\
  !*** ./dist/frontend/scenes/Loader.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Play_png_1 = __importDefault(__webpack_require__(/*! ../../assets/img/buttons/Play.png */ \"./dist/assets/img/buttons/Play.png\"));\nconst Levels_png_1 = __importDefault(__webpack_require__(/*! ../../assets/img/buttons/Levels.png */ \"./dist/assets/img/buttons/Levels.png\"));\nconst Terrain_png_1 = __importDefault(__webpack_require__(/*! ../../assets/tileset/Terrain.png */ \"./dist/assets/tileset/Terrain.png\"));\nconst level_01_json_1 = __importDefault(__webpack_require__(/*! ../../assets/tileset/level_01.json */ \"./dist/assets/tileset/level_01.json\"));\nconst char01_idle_png_1 = __importDefault(__webpack_require__(/*! ../../assets/spritesheets/char01/char01_idle.png */ \"./dist/assets/spritesheets/char01/char01_idle.png\"));\nconst char01_run_png_1 = __importDefault(__webpack_require__(/*! ../../assets/spritesheets/char01/char01_run.png */ \"./dist/assets/spritesheets/char01/char01_run.png\"));\nconst char01_jmp_png_1 = __importDefault(__webpack_require__(/*! ../../assets/img/characters/char01_jmp.png */ \"./dist/assets/img/characters/char01_jmp.png\"));\nconst char01_fall_png_1 = __importDefault(__webpack_require__(/*! ../../assets/img/characters/char01_fall.png */ \"./dist/assets/img/characters/char01_fall.png\"));\nconst char01_dbJmp_png_1 = __importDefault(__webpack_require__(/*! ../../assets/spritesheets/char01/char01_dbJmp.png */ \"./dist/assets/spritesheets/char01/char01_dbJmp.png\"));\nconst Pink_png_1 = __importDefault(__webpack_require__(/*! ../../assets/img/backgrounds/Pink.png */ \"./dist/assets/img/backgrounds/Pink.png\"));\nclass Loader extends Phaser.Scene {\n    constructor() {\n        super({ key: 'loaderScene' });\n    }\n    init() { }\n    preload() {\n        this.load.image('BG-pink', Pink_png_1.default);\n        this.load.image('playBtn', Play_png_1.default);\n        this.load.image('levelBtn', Levels_png_1.default);\n        this.load.image('player-01-jump', char01_jmp_png_1.default);\n        this.load.image('player-01-fall', char01_fall_png_1.default);\n        this.load.spritesheet('player-01-idle', char01_idle_png_1.default, { frameWidth: 32, frameHeight: 32 });\n        this.load.spritesheet('player-01-run', char01_run_png_1.default, { frameWidth: 32, frameHeight: 32 });\n        this.load.spritesheet('player-01-dbJmp', char01_dbJmp_png_1.default, { frameWidth: 32, frameHeight: 32 });\n        this.load.image('base-tileset', Terrain_png_1.default);\n        this.load.tilemapTiledJSON('tilemapJSON', level_01_json_1.default);\n    }\n    create() {\n        this.anims.create({\n            key: 'player01-idle',\n            frames: this.anims.generateFrameNumbers('player-01-idle', {\n                start: 0,\n                end: 10\n            }),\n            frameRate: 20,\n            repeat: -1\n        });\n        this.anims.create({\n            key: 'player01-run',\n            frames: this.anims.generateFrameNumbers('player-01-run', {\n                start: 0,\n                end: 11\n            }),\n            frameRate: 20,\n            repeat: -1\n        });\n        this.anims.create({\n            key: 'player01-dbJmp',\n            frames: this.anims.generateFrameNumbers('player-01-dbJmp', {\n                start: 0,\n                end: 5\n            }),\n            frameRate: 20,\n            repeat: 0\n        });\n        this.scene.start('menuScene');\n    }\n    update(time, delta) {\n    }\n}\nexports[\"default\"] = Loader;\n\n\n//# sourceURL=webpack://maerio/./dist/frontend/scenes/Loader.js?");

/***/ }),

/***/ "./dist/frontend/scenes/Menu.js":
/*!**************************************!*\
  !*** ./dist/frontend/scenes/Menu.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Menu extends Phaser.Scene {\n    constructor() {\n        super({ key: 'menuScene' });\n        this.LEVELPADDING = 100;\n    }\n    init() { }\n    preload() {\n    }\n    create() {\n        this.add.image((this.sys.canvas.width / 2) - this.LEVELPADDING, this.sys.canvas.height / 2, 'playBtn', 0).setInteractive().on('pointerdown', () => {\n            console.log('click on play btn');\n            this.scene.start('playScene');\n        });\n        this.add.image((this.sys.canvas.width / 2) + this.LEVELPADDING, this.sys.canvas.height / 2, 'levelBtn', 0).setInteractive().on('pointerdown', () => {\n            console.log('click on level btn');\n        });\n    }\n    update(time, delta) {\n    }\n}\nexports[\"default\"] = Menu;\n\n\n//# sourceURL=webpack://maerio/./dist/frontend/scenes/Menu.js?");

/***/ }),

/***/ "./dist/frontend/scenes/Play.js":
/*!**************************************!*\
  !*** ./dist/frontend/scenes/Play.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Player_1 = __importDefault(__webpack_require__(/*! ../prefabs/Player */ \"./dist/frontend/prefabs/Player.js\"));\nclass Play extends Phaser.Scene {\n    constructor() {\n        super({ key: 'playScene' });\n        this.player = null;\n    }\n    init() {\n    }\n    preload() {\n    }\n    create() {\n        if (this.textures.exists('BG-pink')) {\n            this.playScreen = this.add.tileSprite(0, 0, 800, 640, 'BG-pink').setOrigin(0);\n        }\n        const map = this.add.tilemap('tilemapJSON');\n        const tileset = map.addTilesetImage('Terrain', 'base-tileset');\n        const collisionLayer = map.createLayer('collideLayer', tileset);\n        collisionLayer.setCollisionByProperty({ collides: true });\n        this.player = new Player_1.default(this, 100, 100, 'player-01-idle', 0, undefined, 2);\n        this.physics.add.collider(this.player, collisionLayer, () => {\n            var _a;\n            if (this.player !== null) {\n                this.player.setVelocity(0);\n                if (((_a = this.player.body) === null || _a === void 0 ? void 0 : _a.blocked.down) === true) {\n                    this.player.isJumping = false;\n                    this.player.jumpCount = 0;\n                }\n            }\n        });\n    }\n    update(time, delta) {\n        var _a;\n        this.playScreen.tilePositionY += 1;\n        (_a = this.player) === null || _a === void 0 ? void 0 : _a.update();\n    }\n}\nexports[\"default\"] = Play;\n\n\n//# sourceURL=webpack://maerio/./dist/frontend/scenes/Play.js?");

/***/ }),

/***/ "./dist/main.js":
/*!**********************!*\
  !*** ./dist/main.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.loggedin = exports.CONFIG = void 0;\nconst phaser_1 = __importDefault(__webpack_require__(/*! phaser */ \"phaser\"));\nconst Menu_1 = __importDefault(__webpack_require__(/*! ./frontend/scenes/Menu */ \"./dist/frontend/scenes/Menu.js\"));\nconst Play_1 = __importDefault(__webpack_require__(/*! ./frontend/scenes/Play */ \"./dist/frontend/scenes/Play.js\"));\nconst Loader_1 = __importDefault(__webpack_require__(/*! ./frontend/scenes/Loader */ \"./dist/frontend/scenes/Loader.js\"));\nexports.CONFIG = {\n    type: phaser_1.default.CANVAS,\n    parent: 'phaser-game',\n    width: 800,\n    height: 640,\n    pixelArt: true,\n    scale: {\n        autoCenter: phaser_1.default.Scale.CENTER_BOTH\n    },\n    physics: {\n        default: 'arcade',\n        arcade: {\n            debug: true\n        }\n    },\n    zoom: 1,\n    scene: [Loader_1.default, Menu_1.default, Play_1.default]\n};\nexports.loggedin = false;\nconst GAME = new phaser_1.default.Game(exports.CONFIG);\ndocument.addEventListener('DOMContentLoaded', (e) => {\n    var _a;\n    let usernameField = document.getElementById('username-field');\n    let passwordField = document.getElementById('password-field');\n    (_a = document.getElementById('login-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener(\"click\", () => {\n        if (usernameField.value !== '' && passwordField.value !== '') {\n        }\n        else\n            console.log('no username or password');\n    });\n});\n\n\n//# sourceURL=webpack://maerio/./dist/main.js?");

/***/ }),

/***/ "./dist/assets/img/backgrounds/Pink.png":
/*!**********************************************!*\
  !*** ./dist/assets/img/backgrounds/Pink.png ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"f8583a3ec0cf539bc046.png\";\n\n//# sourceURL=webpack://maerio/./dist/assets/img/backgrounds/Pink.png?");

/***/ }),

/***/ "./dist/assets/img/buttons/Levels.png":
/*!********************************************!*\
  !*** ./dist/assets/img/buttons/Levels.png ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"cdf862c83aefc3a07261.png\";\n\n//# sourceURL=webpack://maerio/./dist/assets/img/buttons/Levels.png?");

/***/ }),

/***/ "./dist/assets/img/buttons/Play.png":
/*!******************************************!*\
  !*** ./dist/assets/img/buttons/Play.png ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"a107537094dd06e78f5e.png\";\n\n//# sourceURL=webpack://maerio/./dist/assets/img/buttons/Play.png?");

/***/ }),

/***/ "./dist/assets/img/characters/char01_fall.png":
/*!****************************************************!*\
  !*** ./dist/assets/img/characters/char01_fall.png ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"ac02cbcfdcb868d2a57a.png\";\n\n//# sourceURL=webpack://maerio/./dist/assets/img/characters/char01_fall.png?");

/***/ }),

/***/ "./dist/assets/img/characters/char01_jmp.png":
/*!***************************************************!*\
  !*** ./dist/assets/img/characters/char01_jmp.png ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"ca5edb4d241959d42c7c.png\";\n\n//# sourceURL=webpack://maerio/./dist/assets/img/characters/char01_jmp.png?");

/***/ }),

/***/ "./dist/assets/spritesheets/char01/char01_dbJmp.png":
/*!**********************************************************!*\
  !*** ./dist/assets/spritesheets/char01/char01_dbJmp.png ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"a4c53825c330143639c3.png\";\n\n//# sourceURL=webpack://maerio/./dist/assets/spritesheets/char01/char01_dbJmp.png?");

/***/ }),

/***/ "./dist/assets/spritesheets/char01/char01_idle.png":
/*!*********************************************************!*\
  !*** ./dist/assets/spritesheets/char01/char01_idle.png ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"1eeb1a6f8484b30c6bb0.png\";\n\n//# sourceURL=webpack://maerio/./dist/assets/spritesheets/char01/char01_idle.png?");

/***/ }),

/***/ "./dist/assets/spritesheets/char01/char01_run.png":
/*!********************************************************!*\
  !*** ./dist/assets/spritesheets/char01/char01_run.png ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"93b22eada5f33822478c.png\";\n\n//# sourceURL=webpack://maerio/./dist/assets/spritesheets/char01/char01_run.png?");

/***/ }),

/***/ "./dist/assets/tileset/Terrain.png":
/*!*****************************************!*\
  !*** ./dist/assets/tileset/Terrain.png ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"4ba2c33f9f82e805588f.png\";\n\n//# sourceURL=webpack://maerio/./dist/assets/tileset/Terrain.png?");

/***/ }),

/***/ "phaser":
/*!*************************!*\
  !*** external "Phaser" ***!
  \*************************/
/***/ ((module) => {

module.exports = Phaser;

/***/ }),

/***/ "./dist/assets/tileset/level_01.json":
/*!*******************************************!*\
  !*** ./dist/assets/tileset/level_01.json ***!
  \*******************************************/
/***/ ((module) => {

eval("module.exports = /*#__PURE__*/JSON.parse('{\"compressionlevel\":-1,\"editorsettings\":{\"export\":{\"format\":\"json\"}},\"height\":40,\"infinite\":false,\"layers\":[{\"data\":[89,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,91,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,7,8,9,0,0,7,8,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,29,30,31,0,0,29,30,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,51,52,53,0,0,51,52,53,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,133,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,135],\"height\":40,\"id\":1,\"name\":\"collideLayer\",\"opacity\":1,\"type\":\"tilelayer\",\"visible\":true,\"width\":50,\"x\":0,\"y\":0}],\"nextlayerid\":2,\"nextobjectid\":1,\"orientation\":\"orthogonal\",\"renderorder\":\"right-down\",\"tiledversion\":\"1.10.2\",\"tileheight\":16,\"tilesets\":[{\"columns\":22,\"firstgid\":1,\"image\":\"C:/Users/CJ/Downloads/Pixel Adventure 1/Free/Terrain/Terrain (16x16).png\",\"imageheight\":176,\"imagewidth\":352,\"margin\":0,\"name\":\"Terrain\",\"spacing\":0,\"tilecount\":242,\"tileheight\":16,\"tiles\":[{\"id\":0,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":1,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":2,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":3,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":4,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":5,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":6,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":7,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":8,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":9,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":10,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":11,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":12,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":13,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":14,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":15,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":16,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":17,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":18,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":19,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":20,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":21,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":22,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":23,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":24,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":25,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":26,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":27,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":28,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":29,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":30,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":31,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":32,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":33,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":34,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":35,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":36,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":37,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":38,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":39,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":40,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":41,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":42,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":43,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":44,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":45,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":46,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":47,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":48,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":49,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":50,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":51,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":52,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":53,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":54,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":55,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":56,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":57,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":58,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":59,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":60,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":61,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":62,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":63,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":64,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":65,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":66,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":67,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":68,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":69,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":70,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":71,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":72,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":73,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":74,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":75,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":76,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":77,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":78,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":79,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":80,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":81,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":82,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":83,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":84,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":85,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":86,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":87,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":88,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":89,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":90,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":91,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":92,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":93,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":94,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":95,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":96,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":97,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":98,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":99,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":100,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":101,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":102,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":103,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":104,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":105,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":106,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":107,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":108,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":109,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":110,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":111,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":112,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":113,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":114,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":115,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":116,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":117,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":118,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":119,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":120,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":121,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":122,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":123,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":124,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":125,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":126,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":127,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":128,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":129,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":130,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":131,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":132,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":133,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":134,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":135,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":136,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":137,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":138,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":139,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":140,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":141,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":142,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":143,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":144,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":145,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":146,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":147,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":148,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":149,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":150,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":151,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":152,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":153,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":154,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":155,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":156,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":157,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":158,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":159,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":160,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":161,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":162,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":163,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":164,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":165,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":166,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":167,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":168,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":169,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":170,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":171,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":172,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":173,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":174,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":175,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":176,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":177,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":178,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":179,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":180,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":181,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":182,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":183,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":184,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":185,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":186,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":187,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":188,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":189,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":190,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":191,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":192,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":193,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":194,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":195,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":196,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":197,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":198,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":199,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":200,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":201,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":202,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":203,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":204,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":205,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":206,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":207,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":208,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":209,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":210,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":211,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":212,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":213,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":214,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":215,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":216,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":217,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":218,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":219,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":220,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":221,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":222,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":223,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":224,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":225,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":226,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":227,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":228,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":229,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":230,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":231,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":232,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":233,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":234,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":235,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":236,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":237,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":238,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":239,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":240,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]},{\"id\":241,\"properties\":[{\"name\":\"collides\",\"type\":\"bool\",\"value\":true}]}],\"tilewidth\":16}],\"tilewidth\":16,\"type\":\"map\",\"version\":\"1.10\",\"width\":50}');\n\n//# sourceURL=webpack://maerio/./dist/assets/tileset/level_01.json?");

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
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