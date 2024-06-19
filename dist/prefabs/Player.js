"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, _name = 'player', _hitPoints = 10) {
        super(scene, x, y, texture, frame);
        this.name = _name;
        this.health = _hitPoints;
    }
}
exports.default = Player;
