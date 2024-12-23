import StateMachine from "../lib/StateMachine.ts";
import { State } from "../lib/StateMachine.ts";
import { socket } from "../lib/Socket.ts";
import { loginMsg } from "../lib/Socket.ts";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  user_name: string;
  health: number;
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  VELOCITY: number;
  JUMP_VELOCITY: number;
  isJumping: boolean;
  jumpCount: number;
  FSM: StateMachine;

  charModel: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: number,
    _name: string = "player",
    _hitPoints: number = 10,
  ) {
    super(scene, x, y, texture, frame);

    //phaser configs
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setGravityY(500);

    //game things
    this.charModel = texture;

    //base player info
    this.user_name = _name;
    this.health = _hitPoints;

    //movement logic
    this.VELOCITY = 200; //player speed
    this.JUMP_VELOCITY = -300; //jump speed
    this.isJumping = false;
    this.jumpCount = 0;
    this.keys = scene.input.keyboard?.addKeys({
      "left": Phaser.Input.Keyboard.KeyCodes.A,
      "right": Phaser.Input.Keyboard.KeyCodes.D,
      "up": Phaser.Input.Keyboard.KeyCodes.W,
    }) as Phaser.Types.Input.Keyboard.CursorKeys;

    this.FSM = new StateMachine("idle", {
      idle: new idleState(),
      move: new moveState(),
      jump: new jumpState(),
    }, [scene, this]);
  }

  override update(): void {
    socket.emit("playerUpdateEvent", {
      user_id: loginMsg.username,
      position: {
        x: this.x,
        y: this.y,
      },
      currentAnimation: this.anims.currentAnim?.toJSON().key,
      currentTexture: this.texture.key,
      flipX: this.flipX,
    });

    this.FSM.step();
    this.determineTexture();
  }

  handleMovement() {
    const vector: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

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
    if (!this.anims.isPlaying) {
      if (this.body?.velocity.y !== undefined && this.body.velocity.y < 0) {
        this.setTexture(`${this.charModel}-jump`);
      } else if (
        this.body?.velocity.y !== undefined && this.body.velocity.y > 0
      ) {
        this.setTexture(`${this.charModel}-fall`);
      }
    }
  }
}

//idle state
class idleState extends State {
  override enter() {
    console.log("in idle player state");
  }

  override execute(scene: Phaser.Scene, player: Player) {
    if (player.body?.velocity.y === 0 && !player.anims.isPlaying) {
      player.anims.play(`${player.charModel}-idle`);
    } else player.determineTexture();
    if (Phaser.Input.Keyboard.JustDown(player.keys.up)) {
      if (this.stateMachine !== undefined && player.isJumping === false) {
        player.anims.stop();
        this.stateMachine.transition("jump");
      }
    }

    if (player.body?.blocked.down) {
      if (player.keys.left.isDown || player.keys.right.isDown) {
        if (this.stateMachine !== undefined) {
          player.anims.stop();
          this.stateMachine.transition("move");
        }
      }
    }
  }
}

//moving state
class moveState extends State {
  override enter(scene: Phaser.Scene, player: Player) {
    console.log("in move player State");
    player.anims.stop();
    player.anims.play(`${player.charModel}-run`);
  }

  override execute(scene: Phaser.Scene, player: Player) {
    if (Phaser.Input.Keyboard.JustDown(player.keys.up)) {
      if (this.stateMachine !== undefined && player.isJumping === false) {
        player.anims.stop();
        this.stateMachine.transition("jump");
      }
    }

    if (!(player.keys.left.isDown || player.keys.right.isDown)) {
      if (this.stateMachine !== undefined) {
        player.anims.stop();
        this.stateMachine.transition("idle");
      }
    }

    player.handleMovement();
  }
}

class jumpState extends State {
  override enter(scene: Phaser.Scene, player: Player) {
    player.jumpCount += 1;
    console.log("in jump player State", player.jumpCount);
    player.setVelocityY(player.JUMP_VELOCITY);

    if (player.jumpCount === 2) {
      player.anims.play(`${player.charModel}-dbJmp`);
      player.isJumping = true;
    }

    // if (player.body?.velocity.y !== undefined) {
    //     player.setVelocityY(player.body?.velocity.y + player.JUMP_VELOCITY) //hard mode ?
    // }
    setTimeout(() => this.stateMachine?.transition("idle"), 500);
  }

  override execute(scene: Phaser.Scene, player: Player) {
    player.handleMovement();
  }
}
