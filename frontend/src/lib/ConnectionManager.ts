import Opponent from "../prefabs/Opponent";

export default class ConnectionManager {
  private connectedPlayers: Map<UserID, PlayerMetadata>;
  private playersInGame: Set<UserID>;
  private spritePool: Array<OtherSprites>;

  constructor() {
    this.connectedPlayers = new Map();
    this.playersInGame = new Set();
    this.spritePool = new Array();
  }

  // ADD METHODS
  addPlayerInGame(id: UserID) {
    this.playersInGame.add(id);
  }

  addUser(id: UserID, user: PlayerMetadata) {
    if (this.connectedPlayers.has(id)) return;
    this.connectedPlayers.set(id, user);
  }

  addUserToSpritePool(scene: Phaser.Scene, id: UserID) {
    if (this.spritePool.find((e) => e.user_id === id)) {
      console.log("character was already loaded into sprite pool");
      return;
    }
    const data = this.connectedPlayers.get(id);
    console.log(data);
    const opp = new Opponent(
      scene,
      100,
      100,
      "appearing-anim",
      0,
      data!.currentTexture as CharacterModel,
      data!.user_id
    );
    this.spritePool.push({ user_id: id, entity: opp });
  }

  // REMOVE METHODS
  removePlayerInGame(id: UserID) {
    this.playersInGame.delete(id);
  }

  removeAllUsers() {
    this.connectedPlayers.forEach((player) => {
      this.removeUser(player.user_id);
    });
    this.playersInGame.clear();
  }

  removeUser(id: UserID): void {
    if (this.connectedPlayers.delete(id) === false) {
      console.log(
        "attemping to remove user that was not in the connected users list"
      );
      return;
    }
    console.log(`removed player ${id} from connected users list`);
    this.removeUserFromSpritePool(id);
  }

  removeUserFromSpritePool(id: UserID) {
    const spriteToRemoveIndex = this.spritePool.findIndex(
      (sprite) => sprite.user_id === id
    );
    if (spriteToRemoveIndex === -1) {
      console.log(
        "attempting to remove a sprite from the pool that does not exist"
      );
      return;
    }
    const sprite = this.spritePool.splice(spriteToRemoveIndex, 1);

    sprite[0].entity.removeFromScene();
  }

  // MISC / HELPERS

  hasPlayerInGame(id: UserID): boolean {
    return this.playersInGame.has(id);
  }

  /**
   * used when a new player joins the server and loads into the game for the first time
   * or when the player backs out to the menu and re-joins. If a player is in the menu or connected to the server when
   * another player joins game (playScene) this method will skip the iteration for that player (33-35)
   */
  createUsers(scene: Phaser.Scene): void {
    for (const player of this.connectedPlayers) {
      if (this.playersInGame.has(player[0]) === false) {
        console.log(
          `attempting to load in character ${player[0]} but char is in menu`
        );
        continue;
      }
      this.addUserToSpritePool(scene, player[0]);
    }
  }

  // check user in map and update TODO this might have bricked shit
  setUserMetadata(id: UserID, data: PlayerMetadata): void {
    if (this.connectedPlayers.has(id) === false) return;
    this.connectedPlayers.set(id, data as PlayerMetadata);
  }

  setUserTexture(id: UserID, texture: string) {
    if (this.connectedPlayers.has(id) === false) {
      return;
    }
    const updateMe = this.connectedPlayers.get(id)!;
    updateMe.currentTexture = texture;
    this.connectedPlayers.set(id, updateMe);
  }

  clearAllUsersFromSpritePool(): void {
    for (const spr of this.spritePool) {
      spr.entity.removeNamePlate();
      spr.entity.destroy();
    }
    this.spritePool = new Array();
  }

  getSpritePool() {
    return this.spritePool;
  }

  updateSpritePoolGameState(): void {
    if (this.spritePool.length === 0) return;
    for (const spr of this.spritePool) {
      if (!spr.entity.active) continue;
      const xPos = this.connectedPlayers.get(spr.user_id)?.position.x;
      const yPos = this.connectedPlayers.get(spr.user_id)?.position.y;
      const animKey = this.connectedPlayers.get(spr.user_id)?.currentAnimation;
      const currentTexture = this.connectedPlayers.get(
        spr.user_id
      )?.currentTexture;
      const xFlip = this.connectedPlayers.get(spr.user_id)?.flipX; // careful

      spr.entity.setFlipX(xFlip as boolean);
      spr.entity.setX(xPos);
      spr.entity.setY(yPos);

      if (
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
