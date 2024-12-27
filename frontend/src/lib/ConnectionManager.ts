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

  // this can prob be redone more elegantly
  removeUser(id: UserID): void {
    if (this.connectedPlayers.has(id) === false) {
      console.log(
        "attemping to remove user that was not in the connected users list",
      );
      return;
    }
    this.connectedPlayers.delete(id);
    console.log("deleted player", id);
    const spriteToRemoveIndex = this.spritePool.findIndex((sprite) =>
      sprite.user_id === id
    );
    if (spriteToRemoveIndex === -1) {
      console.log(
        "attempting to remove a sprite from the pool that does not exist",
      );
      return;
    }
    const sprite = this.spritePool.splice(spriteToRemoveIndex, 1);
    this.CURRENT_SPRITE_COUNT -= 1;
    sprite[0].entity.destroy();
  }

  updateSpritePool(scene: Phaser.Scene) {
    for (const player of this.connectedPlayers) {
      if (this.spritePool.find((e) => e.user_id === player[0])) {
        continue;
      }
      const spr = scene.physics.add.sprite(
        100,
        100,
        player[1].currentTexture!,
        0,
      );
      this.spritePool.push({ user_id: player[0], entity: spr });
      this.CURRENT_SPRITE_COUNT += 1;
    }
  }

  createUsers(scene: Phaser.Scene): void {
    for (const player of this.connectedPlayers) {
      const spr = scene.physics.add.sprite(
        100,
        100,
        player[1].currentTexture!,
        0,
      );
      this.spritePool.push({ user_id: player[0], entity: spr });
      this.CURRENT_SPRITE_COUNT += 1;
    }
  }

  updateUser(id: UserID, _data: User): void {
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
      const xPos = this.connectedPlayers.get(spr.user_id)?.position.x;
      const yPos = this.connectedPlayers.get(spr.user_id)?.position.y;
      const animKey = this.connectedPlayers.get(spr.user_id)?.currentAnimation;
      const currentTexture = this.connectedPlayers.get(spr.user_id)
        ?.currentTexture;
      const xFlip = this.connectedPlayers.get(spr.user_id)?.flipX; // careful

      spr.entity.setFlipX(xFlip as boolean);
      spr.entity.setX(xPos);
      spr.entity.setY(yPos);

      if (
        // are you serious cj what a fucking joke
        currentTexture?.includes("-jump") ||
        currentTexture?.includes("-fall")
      ) {
        spr.entity.setTexture(currentTexture);
      } else {
        if (spr.entity.anims.currentAnim?.toJSON().key !== animKey) {
          spr.entity.anims.play(animKey as string);
        }
      }
    }
  }
}
