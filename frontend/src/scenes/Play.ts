import Player from "../prefabs/Player.ts";
import { connectionManager } from "../main.ts";

export default class Play extends Phaser.Scene {
  private player!: Player;
  private playScreen!: Phaser.GameObjects.TileSprite;
  private selectedCharModel: CharacterModel;

  constructor() {
    super({ key: "playScene" });

    this.selectedCharModel = "player01"; // default to player1 if for some reason things went bad and they got to this scene without selecting a charater
  }

  init(data: { char: CharacterModel }): void {
    this.selectedCharModel = data.char;
  }

  preload(): void {}

  create(): void {
    //load backgorund
    if (this.textures.exists("BG-pink")) {
      this.playScreen = this.add.tileSprite(0, 0, 800, 640, "BG-pink")
        .setOrigin(0);
    }

    connectionManager.createUsers(this);

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

    this.player = new Player(
      this,
      100,
      100,
      this.selectedCharModel,
      0,
      undefined,
      2,
    );

    this.physics.add.collider(this.player, collisionLayer, () => {
      if (this.player !== null) {
        this.player.setVelocity(0);
        if (this.player.body?.blocked.down === true) {
          this.player.isJumping = false;
          this.player.jumpCount = 0;
        }
      }
    });
  }

  update(): void {
    this.playScreen.tilePositionY += 1;
    if (connectionManager.checkForNewUsers()) {
      connectionManager.updateSpritePool(this);
    }
    this.player?.update();
    connectionManager.updateSpritePoolGameState();
  }
}
