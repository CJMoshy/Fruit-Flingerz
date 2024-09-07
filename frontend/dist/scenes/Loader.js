"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Play_png_1 = __importDefault(require("../assets/img/buttons/Play.png"));
const Levels_png_1 = __importDefault(require("../assets/img/buttons/Levels.png"));
const Terrain_png_1 = __importDefault(require("../assets/tileset/Terrain.png"));
const level_01_json_1 = __importDefault(require("../assets/tileset/level_01.json"));
const char01_idle_png_1 = __importDefault(require("../assets/spritesheets/char01/char01_idle.png"));
const char01_run_png_1 = __importDefault(require("../assets/spritesheets/char01/char01_run.png"));
const char01_jmp_png_1 = __importDefault(require("../assets/img/characters/char01_jmp.png"));
const char01_fall_png_1 = __importDefault(require("../assets/img/characters/char01_fall.png"));
const char01_dbJmp_png_1 = __importDefault(require("../assets/spritesheets/char01/char01_dbJmp.png"));
const Pink_png_1 = __importDefault(require("../assets/img/backgrounds/Pink.png"));
class Loader extends Phaser.Scene {
    constructor() {
        super({ key: 'loaderScene' });
    }
    init() { }
    preload() {
        this.load.image('BG-pink', Pink_png_1.default);
        this.load.image('playBtn', Play_png_1.default);
        this.load.image('levelBtn', Levels_png_1.default);
        this.load.image('player-01-jump', char01_jmp_png_1.default);
        this.load.image('player-01-fall', char01_fall_png_1.default);
        this.load.spritesheet('player-01-idle', char01_idle_png_1.default, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player-01-run', char01_run_png_1.default, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player-01-dbJmp', char01_dbJmp_png_1.default, { frameWidth: 32, frameHeight: 32 });
        this.load.image('base-tileset', Terrain_png_1.default);
        this.load.tilemapTiledJSON('tilemapJSON', level_01_json_1.default);
    }
    create() {
        this.anims.create({
            key: 'player01-idle',
            frames: this.anims.generateFrameNumbers('player-01-idle', {
                start: 0,
                end: 10
            }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'player01-run',
            frames: this.anims.generateFrameNumbers('player-01-run', {
                start: 0,
                end: 11
            }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'player01-dbJmp',
            frames: this.anims.generateFrameNumbers('player-01-dbJmp', {
                start: 0,
                end: 5
            }),
            frameRate: 20,
            repeat: 0
        });
        this.scene.start('menuScene');
    }
    update(time, delta) {
    }
}
exports.default = Loader;
