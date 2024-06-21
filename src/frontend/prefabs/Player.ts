import StateMachine from "../lib/StateMachine"
import { State } from "../lib/StateMachine"

export default class Player extends Phaser.Physics.Arcade.Sprite {

    name: string
    health: number
    keys: Phaser.Types.Input.Keyboard.CursorKeys
    moveStatus: string
    VELOCITY: number
    JUMP_VELOCITY: number
    FSM: StateMachine

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number, _name: string = 'player', _hitPoints: number = 10) {
        super(scene, x, y, texture, frame)

        //phaser configs
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setCollideWorldBounds(true)

        //base player info
        this.name = _name
        this.health = _hitPoints

        //movement logic
        this.VELOCITY = 200 //player speed
        this.JUMP_VELOCITY = -300 //jump speed
        this.keys = scene.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys
        this.moveStatus = ''

        this.FSM = new StateMachine('idle', {
            idle: new idleState(),
            move: new moveState(),
            jump: new jumpState()
        }, [scene, this])
    }

    update(...args: any[]): void {
        this.FSM.step()
    }

    handleMovement() {

        let vector: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)

        if (this.keys.left.isDown) {
            this.setFlipX(true)
            vector.x = -1
            this.moveStatus = 'left'
        }
        if (this.keys.right.isDown) {
            this.setFlipX(false)
            vector.x = 1
            this.moveStatus = 'right'
        }

        if (vector.x === 0 && vector.y === 0) {
            this.moveStatus = 'none'
        }

        vector.normalize()
        this.setVelocity(this.VELOCITY * vector.x, this.VELOCITY * vector.y)
    }
}

//idle state
class idleState extends State {
    enter(scene: Phaser.Scene, player: Player) {
        console.log('in idle player state')
        player.anims.stop()
        player.anims.play('player01-idle')
        // player.setVelocity(0)
    }

    execute(scene: Phaser.Scene, player: Player) {

        player.setVelocityY(100)// 'gravity'

        if(player.keys.up.isDown){
            if (this.stateMachine !== undefined) {
                this.stateMachine.transition('jump')
            }
        }

        if (player.keys.left.isDown || player.keys.right.isDown) {
            if (this.stateMachine !== undefined) {
                this.stateMachine.transition('move')
            }
        }
    }
}

//moving state
class moveState extends State {
    enter(scene: Phaser.Scene, player: Player) {
        console.log('in move player State')
        player.anims.stop()
        player.anims.play('player01-run')
    }

    execute(scene: Phaser.Scene, player: Player) {
        if(player.keys.up.isDown){
            if (this.stateMachine !== undefined) {
                this.stateMachine.transition('jump')
            }
        }

        if (!(player.keys.left.isDown || player.keys.right.isDown)) {
            if (this.stateMachine !== undefined) {
                this.stateMachine.transition('idle')
            }
        }

        player.handleMovement()
        
    }
}

class jumpState extends State {
    enter(scene: Phaser.Scene, player: Player) {
        console.log('in jump player State')
        player.setVelocity(0)
        scene.time.delayedCall(500, () => {this.stateMachine?.transition('idle')})
    }

    execute(scene: Phaser.Scene, player: Player) {
        player.setVelocityY(player.JUMP_VELOCITY)
    }
}