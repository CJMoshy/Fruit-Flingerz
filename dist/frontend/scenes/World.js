"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("../prefabs/Player"));
class World extends Phaser.Scene {
    constructor() {
        super({ key: 'worldScene' });
        this.player = null;
    }
    init() {
    }
    preload() {
    }
    create() {
        this.player = new Player_1.default(this, 100, 100, 'a', 0, undefined, 2);
    }
    update(time, delta) {
    }
}
exports.default = World;
