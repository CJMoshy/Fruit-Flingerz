import Player from "../prefabs/Player.ts";
import { connectionManager } from "../main.ts";
import { loginMsg } from "../lib/Socket.ts";

export default class Play extends Phaser.Scene {
  private player!: Player;
  private playScreen!: Phaser.GameObjects.TileSprite;
  private selectedCharModel: CharacterModel = "player01";

  constructor() {
    super({ key: "playScene" });

    document.addEventListener(
      "userJoinedGame",
      ((e: CustomEvent) => {
        if (this.scene.isActive("playScene")) {
          console.log(e.detail);
          connectionManager.addUserToSpritePool(this, e.detail);
        }
      }) as EventListener,
    );
  }

  init(data: { char: CharacterModel }): void {
    this.selectedCharModel = data.char; // should overwrite line 8 on entry of scene
  }

  preload(): void {}

  create(): void {
    //load backgorund
    if (this.textures.exists("BG-purple")) {
      this.playScreen = this.add.tileSprite(0, 0, 800, 640, "BG-purple")
        .setOrigin(0);
    }

    // load existing users
    connectionManager.createUsers(this);

    //create map
    const map = this.add.tilemap("tilemapJSON");
    const tileset = map.addTilesetImage(
      "Terrain",
      "base-tileset",
    ) as Phaser.Tilemaps.Tileset;
    const collisionLayer = map.createLayer(
      "collideLayer",
      tileset,
    ) as Phaser.Tilemaps.TilemapLayer;
    collisionLayer.setCollisionByProperty({ collides: true });

    //spawn player
    this.player = new Player(
      this,
      100,
      100,
      "appearing-anim",
      0,
      this.selectedCharModel,
      loginMsg.username,
      2,
    );

    //define collision logic for player and map
    this.physics.add.collider(this.player, collisionLayer, () => {
      if (this.player !== null) {
        this.player.setVelocity(0);
        if (this.player.body?.blocked.down === true) {
          this.player.isJumping = false;
          this.player.jumpCount = 0;
        }
      }
    });

    // button to return to the menu
    this.add.image(100, 100, "levelBtn").setInteractive().on(
      "pointerdown",
      () => {
        connectionManager.clearAllUsersFromSpritePool();
        this.player.returnToMenu();
      },
    );
  }

  update(): void {
    this.playScreen.tilePositionY += 1;
    if (this.player.active) {
      this.player.update();
    }
    connectionManager.updateSpritePoolGameState();
  }
}
