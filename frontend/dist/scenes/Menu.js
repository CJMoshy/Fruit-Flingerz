"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menuScene' });
        this.LEVELPADDING = 100;
    }
    init() { }
    preload() {
    }
    create() {
        this.add.image((this.sys.canvas.width / 2) - this.LEVELPADDING, this.sys.canvas.height / 2, 'playBtn', 0).setInteractive().on('pointerdown', () => {
            console.log('click on play btn');
            this.scene.start('playScene');
        });
        this.add.image((this.sys.canvas.width / 2) + this.LEVELPADDING, this.sys.canvas.height / 2, 'levelBtn', 0).setInteractive().on('pointerdown', () => {
            console.log('click on level btn');
        });
    }
}
exports.default = Menu;
