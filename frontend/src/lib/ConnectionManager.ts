export default class ConnectionManager {
  public CONNECTED_PLAYER_COUNT: number;
  private connectedPlayers: Map<UserID, User>;

  public CURRENT_SPRITE_COUNT: number;
  private spritePool: Array<OtherSprites>;

  constructor() {
    this.CONNECTED_PLAYER_COUNT = 0;
    this.CURRENT_SPRITE_COUNT = 0;
    this.connectedPlayers = new Map();
    this.spritePool = new Array();
  }

  addUser(id: UserID, user: User) {
    if (this.connectedPlayers.has(id)) return;
    console.log("adding new user to game");
    this.connectedPlayers.set(id, user);
    console.log(this.connectedPlayers);
    this.CONNECTED_PLAYER_COUNT += 1;
  }

  updateSpritePool(scene: Phaser.Scene) {
    for (const player of this.connectedPlayers) {
      if (this.spritePool.find((e) => e.user_id === player[0])) {
        continue;
      }
      const spr = scene.physics.add.sprite(100, 100, "player-01-idle", 0);
      this.spritePool.push({ user_id: player[0], entity: spr });
      this.CURRENT_SPRITE_COUNT += 1;
    }
  }

  createUsers(scene: Phaser.Scene) {
    for (const player of this.connectedPlayers) {
      const spr = scene.physics.add.sprite(100, 100, "player-01-idle", 0);
      this.spritePool.push({ user_id: player[0], entity: spr });
      this.CURRENT_SPRITE_COUNT += 1;
    }
  }

  updateUser(id: UserID, _data: User) {
    this.connectedPlayers.set(id, _data);
  }

  checkForNewUsers(): boolean {
    if (this.CONNECTED_PLAYER_COUNT > this.CURRENT_SPRITE_COUNT) {
      return true;
    }
    return false;
  }

  updateSpritePoolGameState(): void {
    if (this.spritePool.length === 0) return;
    for (const spr of this.spritePool) {
      const xIndex = this.connectedPlayers.get(spr.user_id)?.position.x;
      const yIndex = this.connectedPlayers.get(spr.user_id)?.position.y;
      const animKey = this.connectedPlayers.get(spr.user_id)?.currentAnimation;
      const currentTexture = this.connectedPlayers.get(spr.user_id)
        ?.currentTexture;
      const xFlip = this.connectedPlayers.get(spr.user_id)?.flipX; // careful

      spr.entity.setFlipX(xFlip as boolean);
      spr.entity.setX(xIndex);
      spr.entity.setY(yIndex);

      if (
        currentTexture === "player-01-jump" ||
        currentTexture === "player-01-fall"
      ) {
        spr.entity.setTexture(currentTexture);
      } else {
        if (spr.entity.anims.currentAnim?.toJSON().key !== animKey) {
          spr.entity.anims.play(animKey as string);
        }
      }
      // if (us.entity.anims.currentAnim?.toJSON().key !== animKey) {
      //   us.entity.anims.play(animKey as string);
      // }
    }
  }
}
