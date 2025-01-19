import StateMachine, { State } from "../lib/StateMachine.ts";
import ConnectionManager from "../lib/ConnectionManager.ts";
import {
  exitScene,
  joinScene,
  sendProjectileEvent,
  sendUpdateEvent,
} from "../lib/Socket.ts";
import { loginMsg } from "../lib/Socket.ts";
import Entity from "./Entity.ts";

import Projectile from "./Projectile.ts";
import { connectionManager } from "../main.ts";

export default class Player extends Entity {
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  VELOCITY: number;
  JUMP_VELOCITY: number;
  isJumping: boolean;
  jumpCount: number;
  FSM: StateMachine;
  parentScene: Phaser.Scene;

  private metadataPingId: number;
  private metadataPingInterval = 20; // ping the server every 20ms (50 ping/second)
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

    this.setGravityY(700);

    //movement logic
    this.VELOCITY = 200; //player speed
    this.JUMP_VELOCITY = -350; //jump speed
    this.isJumping = false;
    this.jumpCount = 0;
    this.keys = scene.input.keyboard?.addKeys({
      "left": Phaser.Input.Keyboard.KeyCodes.A,
      "right": Phaser.Input.Keyboard.KeyCodes.D,
      "up": Phaser.Input.Keyboard.KeyCodes.W,
      "space": Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as Phaser.Types.Input.Keyboard.CursorKeys;

    this.FSM = new StateMachine("spawn", {
      spawn: new spawnState(),
      idle: new idleState(),
      move: new moveState(),
      jump: new jumpState(),
      shoot: new shootState(),
    }, [scene, this]);

    joinScene(this.userName, texture);

    this.metadataPingId = setInterval(() => {
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
    }, this.metadataPingInterval);

    this.on("destroy", () => {
      clearInterval(this.metadataPingId);
    });
  }

  takeHit() {
    if (this.hitPoints <= 0) {
      console.log("player is eliminated");
    } else {
      this.hitPoints -= 1;
      console.log(this.hitPoints);
    }
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
    this.FSM.step();
    this.determineTexture();
  }

  handleMovement() {
    const vector = new Phaser.Math.Vector2(0, 0);

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
    } else if (Phaser.Input.Keyboard.JustDown(player.keys.space)) {
      this.stateMachine.transition("shoot");
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

    if (Phaser.Input.Keyboard.JustDown(player.keys.space)) {
      this.stateMachine.transition("shoot");
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
    setTimeout(() => this.stateMachine.transition("idle"), 500);
  }

  override execute(scene: Phaser.Scene, player: Player) {
    player.handleMovement();
  }
}

class shootState extends State {
  override enter(scene: Phaser.Scene, player: Player) {
    const p = new Projectile(
      scene,
      player.x,
      player.y,
      `star-${Phaser.Math.Between(1, 6)}`,
      0,
      500,
      player.flipX ? -1 : 1,
    );
    p.fire();

    connectionManager.getSpritePool().forEach((spr) => {
      scene.physics.add.overlap(spr.entity, p, () => p.destroy());
    });

    sendProjectileEvent({
      id: player.userName,
      position: {
        x: player.x,
        y: player.y,
      },
      velocity: 500 * (player.flipX ? -1 : 1),
    });
    this.stateMachine.transition("idle");
  }

  override execute() {
    // no implementation needed
  }
}
