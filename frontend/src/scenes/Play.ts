import Player from "../prefabs/Player";
import { users } from "../lib/Socket";
import { init_login_msg } from "../lib/Socket";

export default class Play extends Phaser.Scene {
  private player: Player | null = null;
  private playScreen: Phaser.GameObjects.TileSprite | null = null;

  private users_length: number | null = null;
  private other_player_sprite_manager: other_player[] | null = null;

  constructor() {
    super({ key: "playScene" });
  }

  init(): void {
    this.users_length = users.length;
    this.other_player_sprite_manager = [];
  }

  preload(): void {
  }

  create(): void {
    //load backgorund
    if (this.textures.exists("BG-pink")) {
      this.playScreen = this.add.tileSprite(0, 0, 800, 640, "BG-pink")
        .setOrigin(0);
    }

    users.forEach((u) => {
      // this.add.sprite(u.position.x, u.position.y, 'player-01-idle', 0)
      if (u.user_id !== init_login_msg.username) {
        // console.log("creating other users");
        const x = this.physics.add.sprite(100, 100, "player-01-idle", 0)
          .setOrigin(0);
        this.other_player_sprite_manager?.push({
          user_id: u.user_id,
          entity: x,
        });
      }
      // this.other_users?.push({user_id: u.user_id, entity: this.physics.add.sprite(100, 100, 'player-01-idle', 0)})
    });

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

    this.player = new Player(this, 100, 100, "player-01-idle", 0, undefined, 2);

    this.physics.add.collider(this.player, collisionLayer, () => {
      if (this.player !== null) {
        this.player.setVelocity(0);
        if (this.player.body?.blocked.down === true) {
          this.player.isJumping = false;
          this.player.jumpCount = 0;
        }
      }
    });

    // this.updateUsers();
  }

  update(): void {
    (this.playScreen as Phaser.GameObjects.TileSprite).tilePositionY += 1;
    this.checkForNewPlayers();
    this.player?.update();
    this.updateUsers();
  }

  checkForNewPlayers(): void {
    if (this.users_length !== users.length) {
      this.addUser();
      this.users_length = users.length;
    }
  }

  addUser(): void {
    const us = users[users.length - 1];
    // this.add.sprite(us.position.x, us.position.y, 'player-01-idle', 0)
    const e = this.physics.add.sprite(100, 100, "player-01-idle", 0).setOrigin(
      0,
    );
    this.other_player_sprite_manager?.push({
      user_id: us.user_id,
      entity: e,
    });
    // console.log(this.other_users);
  }

  updateUsers(): void {
    if (users.length === 0) return;
    for (const us of this.other_player_sprite_manager as other_player[]) {
      const xIndex = users[
        users.findIndex((e) => e.user_id === us.user_id)
      ].position.x;
      const yIndex = users[
        users.findIndex((e) => e.user_id === us.user_id)
      ].position.y;
      const animKey = users[users.findIndex((e) => e.user_id === us.user_id)]
        .currentAnimation;
      const currentTexture = users[
        users.findIndex((e) => e.user_id === us.user_id)
      ].currentTexture;

      const x = users[users.findIndex((e) => e.user_id === us.user_id)].flipX;
      us.entity.setFlipX(x);
      us.entity.setX(xIndex);
      us.entity.setY(yIndex);

      if (
        currentTexture === "player-01-jump" ||
        currentTexture === "player-01-fall"
      ) {
        us.entity.setTexture(currentTexture);
      } else {
        if (us.entity.anims.currentAnim?.toJSON().key !== animKey) {
          us.entity.anims.play(animKey as string);
        }
      }
      // if (us.entity.anims.currentAnim?.toJSON().key !== animKey) {
      //   us.entity.anims.play(animKey as string);
      // }
    }
  }
}
