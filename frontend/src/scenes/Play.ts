import Player from "../prefabs/Player.ts";
import { connectionManager } from "../main.ts";
import { loginMsg } from "../lib/Socket.ts";
import Projectile from "../prefabs/Projectile.ts";

export default class Play extends Phaser.Scene {
  private player!: Player;
  private playScreen!: Phaser.GameObjects.TileSprite;
  private selectedCharModel: CharacterModel = "player01";
  private elimLeaderText!: Phaser.GameObjects.Text;

  private userJoinedGameListener: (
    e: CustomEvent<UserJoinedGameEventDetail>
  ) => void;
  private createProjectileListener: (e: CustomEvent<FireProjectileMsg>) => void;
  private elimLeaderListener: (e: CustomEvent<ElimLeaderMsg>) => void;

  private TILE_SCROLL_RATE = 0.75;
  constructor() {
    super({ key: "playScene" });

    // Define the listener function and store it in a variable
    this.userJoinedGameListener = (e) => {
      if (this.scene.isActive("playScene")) {
        console.log(
          "playScene should be active right now, adding",
          e.detail,
          " to the spritepool"
        );
        connectionManager.addUserToSpritePool(this, e.detail.id);
      }
    };

    this.createProjectileListener = (e) => {
      if (this.scene.isActive("playScene")) {
        this.events.emit("createProjectile", e);
      }
    };

    this.elimLeaderListener = (e) => {
      if (this.scene.isActive("playScene")) {
        this.elimLeaderText.setText(`Current Leader: ${e.detail.leader}`);
      }
    };

    document.addEventListener(
      "userJoinedGame",
      this.userJoinedGameListener as EventListener
    );

    document.addEventListener(
      "createProjectile",
      this.createProjectileListener as EventListener
    );

    document.addEventListener(
      "elimLeader",
      this.elimLeaderListener as EventListener
    );
  }

  init(data: { char: CharacterModel }): void {
    this.selectedCharModel = data.char; // should overwrite line 8 on entry of scene
  }

  preload(): void {}

  create(): void {
    this.events.on("destroy", () => {
      console.log("destroy playScene");
      document.removeEventListener(
        "userJoinedGame",
        this.userJoinedGameListener as EventListener
      );

      document.removeEventListener(
        "createProjectile",
        this.createProjectileListener as EventListener
      );

      document.removeEventListener(
        "elimLeader",
        this.elimLeaderListener as EventListener
      );
    });

    //load backgorund
    if (this.textures.exists("BG-purple")) {
      this.playScreen = this.add
        .tileSprite(0, 0, 800, 640, "BG-purple")
        .setOrigin(0);
    }

    // load existing users
    connectionManager.createUsers(this);

    //create map
    const map = this.add.tilemap("tilemapJSON");
    const tileset = map.addTilesetImage(
      "base-tileset-pixel-adv",
      "base-tileset"
    ) as Phaser.Tilemaps.Tileset;
    const collisionLayer = map.createLayer(
      "collideLayer",
      tileset
    ) as Phaser.Tilemaps.TilemapLayer;
    collisionLayer.setCollisionByProperty({ collides: true });

    const spawnLayer = map.getObjectLayer("Spawns")!;

    //text at the top of the screen to show elim leader in lobby
    this.elimLeaderText = this.add
      .text(this.sys.canvas.width / 2, 25, "Current Leader: ")
      .setOrigin(0.5)
      .setDepth(1);

    // button to return to the menu
    this.add
      .image(this.sys.canvas.width - 25, 25, "levelBtn")
      .setInteractive()
      .setDepth(1)
      .on("pointerdown", () => {
        connectionManager.clearAllUsersFromSpritePool();
        this.player.returnToMenu();
      });

    //spawn player
    const randSpawn =
      spawnLayer.objects[Phaser.Math.Between(0, spawnLayer.objects.length - 1)];
    this.player = new Player(
      this,
      randSpawn.x!,
      randSpawn.y!,
      "appearing-anim",
      0,
      this.selectedCharModel,
      3,
      loginMsg.username,
      spawnLayer.objects
    );

    //define collision logic for player and map
    this.physics.add.collider(this.player, collisionLayer, () => {
      if (this.player.body!.blocked.down === true) {
        if (this.player.FSM.state === "jump") {
          this.player.isJumping = false;
          this.player.jumpCount = 0;
          this.player.setVelocity(0);
          this.player.FSM.transition("idle");
        }
      }
    });

    this.events.on("createProjectile", (e: CustomEvent<FireProjectileMsg>) => {
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
        this,
        e.detail.position.x,
        e.detail.position.y,
        fruits[Phaser.Math.Between(0, fruits.length - 1)],
        0,
        e.detail.id,
        e.detail.velocity
      );

      this.physics.add.collider(this.player, p, () => {
        console.log(p.owner);
        this.player.takeHit(p.owner);
        p.destroy();
      });
    });
  }

  update(): void {
    this.playScreen.tilePositionY += this.TILE_SCROLL_RATE;
    if (this.player.active) {
      this.player.update();
    }
    connectionManager.updateSpritePoolGameState();
  }
}
