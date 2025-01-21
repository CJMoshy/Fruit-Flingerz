import StateMachine, { State } from "../lib/StateMachine.ts";
import {
  exitScene,
  joinScene,
  playerEliminated,
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
  private possibleSpawns: Phaser.Types.Tilemaps.TiledObject[];
  private metadataPingId: number;
  private metadataPingInterval = 20; // ping the server every 20ms (50 ping/second)
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string = "appearing-anim",
    frame: number,
    charSprite: CharacterModel,
    hitPoints: number = 10,
    userName: string = "player",
    possibleSpawns: Phaser.Types.Tilemaps.TiledObject[],
  ) {
    super(
      scene,
      x,
      y,
      texture,
      frame,
      charSprite,
      hitPoints,
      userName,
    );

    this.parentScene = scene;

    this.setGravityY(700);

    // spawns
    this.possibleSpawns = possibleSpawns;
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

  takeHit(fromUser: UserID) {
    this.hitPoints -= 1;
    if (this.hitPoints < 1) {
      console.log("player is eliminated by user", fromUser);
      playerEliminated(fromUser);
      this.respawn();
    }
  }

  respawn() {
    const newSpawn = this
      .possibleSpawns[Phaser.Math.Between(0, this.possibleSpawns.length - 1)];
    this.hitPoints = 10;
    this.body!.enable = false;
    this.anims.play("disappearing-anim").once("animationcomplete", () => {
      this.body!.enable = true;
      this.setX(newSpawn.x).setY(newSpawn.y).setVelocity(0);
      this.anims.play("appearing-anim").once(
        "animationcomplete",
        () => {
          this.FSM.transition("idle");
        },
      );
    });
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
    if (this.anims.isPlaying) return;
    if (this.body!.velocity.y < 0) {
      this.setTexture(`${this.characterSprite}-jump`);
    } else if (
      this.body!.velocity.y > 0
    ) {
      this.setTexture(`${this.characterSprite}-fall`);
    }
  }
}

//spawn state
class spawnState extends State {
  override enter(scene: Phaser.Scene, player: Player): void {
    player.anims.play("appearing-anim").once("animationcomplete", () => {
      this.stateMachine.transition("idle");
    });
  }
  override execute(scene: Phaser.Scene, player: Player): void {}
}

//idle state
class idleState extends State {
  override enter(scene: Phaser.Scene, player: Player) {
    player.anims.play(`${player["characterSprite"]}-idle`);
  }

  override execute(scene: Phaser.Scene, player: Player) {
    if (
      Phaser.Input.Keyboard.JustDown(player.keys.up) &&
      player.isJumping === false
    ) {
      this.stateMachine.transition("jump");
    }

    if (Phaser.Input.Keyboard.JustDown(player.keys.space)) {
      this.stateMachine.transition("shoot");
    }

    if (player.body!.blocked.down) {
      if (player.keys.left.isDown || player.keys.right.isDown) {
        this.stateMachine.transition("move");
      }
    }
  }
}

//moving state
class moveState extends State {
  override enter(scene: Phaser.Scene, player: Player) {
    player.anims.play(`${player["characterSprite"]}-run`);
  }

  override execute(scene: Phaser.Scene, player: Player) {
    player.handleMovement();
    if (
      Phaser.Input.Keyboard.JustDown(player.keys.up) &&
      player.isJumping === false
    ) {
      this.stateMachine.transition("jump");
    }

    if (Phaser.Input.Keyboard.JustDown(player.keys.space)) {
      this.stateMachine.transition("shoot");
    }

    if (
      player.keys.left.isDown === false && player.keys.right.isDown === false &&
      player.body?.blocked.down
    ) {
      player.setVelocity(0);
      this.stateMachine.transition("idle");
    }

    if (
      player.body?.blocked.down === false
    ) {
      player.anims.stop();
    } else {
      if (player.anims.isPlaying === false) {
        player.anims.play(`${player["characterSprite"]}-run`);
      }
    }
  }
}

class jumpState extends State {
  jump(player: Player) {
    player.jumpCount += 1;
    player.setVelocityY(player.JUMP_VELOCITY);

    if (player.jumpCount === 2) {
      player.anims.play(`${player["characterSprite"]}-dbJmp`);
      player.isJumping = true;
    }
  }

  override enter(scene: Phaser.Scene, player: Player) {
    player.anims.stop();
    this.jump(player);
  }

  override execute(scene: Phaser.Scene, player: Player) {
    console.log("in jump");
    if (
      Phaser.Input.Keyboard.JustDown(player.keys.up) && player.jumpCount === 1
    ) {
      this.jump(player);
    }
    player.handleMovement();
  }
}

class shootState extends State {
  override enter(scene: Phaser.Scene, player: Player) {
    const fruits = [
      "apple",
      "bananas",
      "kiwi",
      "cherries",
      "orange",
      "melon",
      "pineapple",
      "strawberry",
    ];
    const p = new Projectile(
      scene,
      player.x,
      player.y,
      fruits[Phaser.Math.Between(0, fruits.length - 1)],
      0,
      player.userName,
      500,
      player.flipX ? -1 : 1,
    );

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
