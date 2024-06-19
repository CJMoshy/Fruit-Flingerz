"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const phaser_1 = __importDefault(require("phaser"));
const World_1 = __importDefault(require("./scenes/World"));
exports.CONFIG = {
    type: phaser_1.default.CANVAS,
    parent: 'phaser-game',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {}
    },
    zoom: 1,
    scene: [World_1.default]
};
const GAME = new phaser_1.default.Game(exports.CONFIG);
