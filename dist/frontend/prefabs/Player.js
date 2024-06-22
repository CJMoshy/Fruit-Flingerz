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
        this.setGravityY(500);
        this.name = _name;
        this.health = _hitPoints;
        this.VELOCITY = 200;
        this.JUMP_VELOCITY = -300;
        this.isJumping = false;
        this.jumpCount = 0;
        this.keys = (_a = scene.input.keyboard) === null || _a === void 0 ? void 0 : _a.addKeys({ 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'up': Phaser.Input.Keyboard.KeyCodes.W });
        this.FSM = new StateMachine_1.default('idle', {
            idle: new idleState(),
            move: new moveState(),
            jump: new jumpState()
        }, [scene, this]);
    }
    update(...args) {
        this.FSM.step();
        this.determineTexture();
    }
    handleMovement() {
        let vector = new Phaser.Math.Vector2(0, 0);
        if (this.keys.left.isDown) {
            this.setFlipX(true);
            vector.x = -1;
            this.setVelocityX(this.VELOCITY * vector.x);
        }
        if (this.keys.right.isDown) {
            this.setFlipX(false);
            vector.x = 1;
            this.setVelocityX(this.VELOCITY * vector.x);
        }
    }
    determineTexture() {
        var _a, _b;
        if (((_a = this.body) === null || _a === void 0 ? void 0 : _a.velocity.y) !== undefined && this.body.velocity.y < 0) {
            this.setTexture('player-01-jump');
        }
        else if (((_b = this.body) === null || _b === void 0 ? void 0 : _b.velocity.y) !== undefined && this.body.velocity.y > 0) {
            this.setTexture('player-01-fall');
        }
    }
}
exports.default = Player;
class idleState extends StateMachine_2.State {
    enter(scene, player) {
        console.log('in idle player state');
        player.anims.play('player01-idle');
    }
    execute(scene, player) {
        var _a;
        if (Phaser.Input.Keyboard.JustDown(player.keys.up)) {
            if (this.stateMachine !== undefined && player.isJumping === false) {
                this.stateMachine.transition('jump');
            }
        }
        if ((_a = player.body) === null || _a === void 0 ? void 0 : _a.blocked.down) {
            if (player.keys.left.isDown || player.keys.right.isDown) {
                if (this.stateMachine !== undefined) {
                    this.stateMachine.transition('move');
                }
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
        if (Phaser.Input.Keyboard.JustDown(player.keys.up)) {
            if (this.stateMachine !== undefined && player.isJumping === false) {
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
        var _a;
        console.log('in jump player State', player.jumpCount);
        player.jumpCount += 1;
        if (player.jumpCount === 2) {
            player.anims.stop();
            player.anims.play('player01-dbJmp');
            player.isJumping = true;
        }
        player.setVelocityY(player.JUMP_VELOCITY);
        (_a = this.stateMachine) === null || _a === void 0 ? void 0 : _a.transition('idle');
    }
    execute(scene, player) {
        player.handleMovement();
    }
}
