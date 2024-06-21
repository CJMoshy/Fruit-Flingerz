"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine_1 = __importDefault(require("../lib/StateMachine"));
const StateMachine_2 = require("../lib/StateMachine");
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, _name = 'player', _hitPoints = 10) {
        var _a;
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.name = _name;
        this.health = _hitPoints;
        this.VELOCITY = 200;
        this.JUMP_VELOCITY = -300;
        this.keys = (_a = scene.input.keyboard) === null || _a === void 0 ? void 0 : _a.createCursorKeys();
        this.moveStatus = '';
        this.FSM = new StateMachine_1.default('idle', {
            idle: new idleState(),
            move: new moveState(),
            jump: new jumpState()
        }, [scene, this]);
    }
    update(...args) {
        this.FSM.step();
    }
    handleMovement() {
        let vector = new Phaser.Math.Vector2(0, 0);
        if (this.keys.left.isDown) {
            this.setFlipX(true);
            vector.x = -1;
            this.moveStatus = 'left';
        }
        if (this.keys.right.isDown) {
            this.setFlipX(false);
            vector.x = 1;
            this.moveStatus = 'right';
        }
        if (vector.x === 0 && vector.y === 0) {
            this.moveStatus = 'none';
        }
        vector.normalize();
        this.setVelocity(this.VELOCITY * vector.x, this.VELOCITY * vector.y);
    }
}
exports.default = Player;
class idleState extends StateMachine_2.State {
    enter(scene, player) {
        console.log('in idle player state');
        player.anims.stop();
        player.anims.play('player01-idle');
    }
    execute(scene, player) {
        player.setVelocityY(100);
        if (player.keys.up.isDown) {
            if (this.stateMachine !== undefined) {
                this.stateMachine.transition('jump');
            }
        }
        if (player.keys.left.isDown || player.keys.right.isDown) {
            if (this.stateMachine !== undefined) {
                this.stateMachine.transition('move');
            }
        }
    }
}
class moveState extends StateMachine_2.State {
    enter(scene, player) {
        console.log('in move player State');
        player.anims.stop();
        player.anims.play('player01-run');
    }
    execute(scene, player) {
        if (player.keys.up.isDown) {
            if (this.stateMachine !== undefined) {
                this.stateMachine.transition('jump');
            }
        }
        if (!(player.keys.left.isDown || player.keys.right.isDown)) {
            if (this.stateMachine !== undefined) {
                this.stateMachine.transition('idle');
            }
        }
        player.handleMovement();
    }
}
class jumpState extends StateMachine_2.State {
    enter(scene, player) {
        console.log('in jump player State');
        player.setVelocity(0);
        scene.time.delayedCall(500, () => { var _a; (_a = this.stateMachine) === null || _a === void 0 ? void 0 : _a.transition('idle'); });
    }
    execute(scene, player) {
        player.setVelocityY(player.JUMP_VELOCITY);
    }
}
