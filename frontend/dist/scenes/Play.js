"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("../prefabs/Player"));
class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'playScene' });
        this.player = null;
    }
    init() {
    }
    preload() {
    }
    create() {
        if (this.textures.exists('BG-pink')) {
            this.playScreen = this.add.tileSprite(0, 0, 800, 640, 'BG-pink').setOrigin(0);
        }
        const map = this.add.tilemap('tilemapJSON');
        const tileset = map.addTilesetImage('Terrain', 'base-tileset');
        const collisionLayer = map.createLayer('collideLayer', tileset);
        collisionLayer.setCollisionByProperty({ collides: true });
        this.player = new Player_1.default(this, 100, 100, 'player-01-idle', 0, undefined, 2);
        this.physics.add.collider(this.player, collisionLayer, () => {
            var _a;
            if (this.player !== null) {
                this.player.setVelocity(0);
                if (((_a = this.player.body) === null || _a === void 0 ? void 0 : _a.blocked.down) === true) {
                    this.player.isJumping = false;
                    this.player.jumpCount = 0;
                }
            }
        });
    }
    update() {
        var _a;
        this.playScreen.tilePositionY += 1;
        (_a = this.player) === null || _a === void 0 ? void 0 : _a.update();
    }
}
exports.default = Play;
