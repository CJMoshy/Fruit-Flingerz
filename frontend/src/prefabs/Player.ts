import StateMachine, { State } from "../lib/StateMachine.ts";
import { exitScene, joinScene, sendUpdateEvent } from "../lib/Socket.ts";
import { loginMsg } from "../lib/Socket.ts";
import Entity from "./Entity.ts";

export default class Player extends Entity {
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  VELOCITY: number;
  JUMP_VELOCITY: number;
  isJumping: boolean;
  jumpCount: number;
  FSM: StateMachine;
  parentScene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string = "appearing-anim",
    frame: number,
    charSprite: CharacterModel,
    userName: string = "player",
    hitPoints: number = 10,
  ) {
    super(scene, x, y, texture, frame, charSprite, userName, hitPoints);

    this.parentScene = scene;

    this.setGravityY(500);

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

    this.FSM = new StateMachine("spawn", {
      spawn: new spawnState(),
      idle: new idleState(),
      move: new moveState(),
      jump: new jumpState(),
    }, [scene, this]);

    joinScene(this.userName, texture);
  }

  returnToMenu() {
    this.anims.play("disappearing-anim").on(
      "animationcomplete",
      () => {
        super.removeFromScene();
        exitScene(this.userName);
        this.parentScene.scene.stop("playScene");
        this.parentScene.scene.start("menuScene");
      },
    );
  }

  override update(): void {
    super.update();
    // this is the next problem. Emitting an event/ping to the server every update tick just seems nasty
    sendUpdateEvent({
      user_id: loginMsg.username,
      inGame: true,
      position: {
        x: this.x,
        y: this.y,
      },
      currentAnimation: this.anims.currentAnim?.toJSON().key, // potential problem
      currentTexture: this.texture.key,
      flipX: this.flipX,
    });
    // end problem
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
        this.setTexture(`${this.characterSprite}-jump`);
      } else if (
        this.body?.velocity.y !== undefined && this.body.velocity.y > 0
      ) {
        this.setTexture(`${this.characterSprite}-fall`);
      }
    }
  }
}

//spawn state

class spawnState extends State {
  override enter(scene: Phaser.Scene, player: Player): void {
    player.anims.play("appearing-anim");
  }

  override execute(scene: Phaser.Scene, player: Player): void {
    if (!player.anims.isPlaying) {
      this.stateMachine.transition("idle");
    }
  }
}

//idle state
class idleState extends State {
  override enter() {
    // console.log("in idle player state");
  }

  override execute(scene: Phaser.Scene, player: Player) {
    if (player.body?.velocity.y === 0 && !player.anims.isPlaying) {
      player.anims.play(`${player["characterSprite"]}-idle`);
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
    // console.log("in move player State");
    player.anims.stop();
    player.anims.play(`${player["characterSprite"]}-run`);
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
    // console.log("in jump player State", player.jumpCount);
    player.setVelocityY(player.JUMP_VELOCITY);

    if (player.jumpCount === 2) {
      player.anims.play(`${player["characterSprite"]}-dbJmp`);
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
