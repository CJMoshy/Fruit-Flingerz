"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggedin = exports.CONFIG = void 0;
const phaser_1 = __importDefault(require("phaser"));
const World_1 = __importDefault(require("./scenes/World"));
exports.CONFIG = {
    type: phaser_1.default.CANVAS,
    parent: 'phaser-game',
    width: 800,
    height: 600,
    pixelArt: true,
    scale: {
        autoCenter: phaser_1.default.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {}
    },
    zoom: 1,
    scene: [World_1.default]
};
exports.loggedin = false;
const GAME = new phaser_1.default.Game(exports.CONFIG);
document.addEventListener('DOMContentLoaded', (e) => {
    var _a;
    let usernameField = document.getElementById('username-field');
    let passwordField = document.getElementById('password-field');
    (_a = document.getElementById('login-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        usernameField.value === '' ? console.log('no username') : console.log(usernameField.value);
        passwordField.value === '' ? console.log('no password') : console.log(passwordField.value);
    });
});
