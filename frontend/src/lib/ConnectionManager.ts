import Opponent from "../prefabs/Opponent";

export default class ConnectionManager {
  private connectedPlayers: Map<UserID, User>;
  private playersInGame: Set<UserID>;
  private spritePool: Array<OtherSprites>;

  constructor() {
    this.connectedPlayers = new Map();
    this.playersInGame = new Set();
    this.spritePool = new Array();
  }

  addPlayerInGame(id: UserID) {
    this.playersInGame.add(id);
  }

  removePlayerInGame(id: UserID) {
    this.playersInGame.delete(id);
  }

  hasPlayerInGame(id: UserID): boolean {
    return this.playersInGame.has(id);
  }

  addUser(id: UserID, user: User) {
    if (this.connectedPlayers.has(id)) return;
    this.connectedPlayers.set(id, user);
  }

  // this can prob be redone more elegantly
  removeUser(id: UserID): void {
    if (this.connectedPlayers.delete(id) === false) {
      console.log(
        "attemping to remove user that was not in the connected users list",
      );
      return;
    }
    console.log(`removed player ${id} from connected users list`);
    this.removeUserFromSpritePool(id);
  }

  /**
   * used when a new player joins the server and loads into the game for the first time
   * or when the player backs out to the menu and re-joins. If a player is in the menu or connected to the server when
   * another player joins game (playScene) this method will skip the iteration for that player (33-35)
   */
  createUsers(scene: Phaser.Scene): void {
    for (const player of this.connectedPlayers) {
      if (
        this.spritePool.find((e) => e.user_id === player[0]) ||
        this.playersInGame.has(player[0]) === false // shitty code but this will keep people in other lobbys from getting in
      ) {
        console.log(
          "character was already loaded into sprite pool or is in menu",
          this.spritePool.find((e) => e.user_id === player[0]),
          this.playersInGame.has(player[0]),
        );
        continue;
      }
      const opp = new Opponent(
        scene,
        100,
        100,
        "appearing-anim",
        0,
        player[1].currentTexture! as CharacterModel,
        player[1].user_id,
      );
      this.spritePool.push({ user_id: player[0], entity: opp });
    }
  }

  // check user in map and update TODO this might have bricked shit
  updateUser(
    id: UserID,
    _data: User | string,
    texture: boolean,
  ): void {
    if (this.connectedPlayers.has(id) === false) return;
    if (texture === false) {
      this.connectedPlayers.set(id, _data as User);
    } else {
      const updateMe = this.connectedPlayers.get(id)!;
      if (!updateMe.currentTexture) {
        updateMe["currentTexture"] = _data as CharacterModel;
      } else {
        updateMe!.currentTexture = _data as CharacterModel;
      }
      this.connectedPlayers.set(id, updateMe);
    }
  }

  clearAllUsersFromSpritePool(): void {
    for (const spr of this.spritePool) {
      spr.entity.removeNamePlate();
      spr.entity.destroy();
    }
    this.spritePool = new Array();
  }

  removeUserFromSpritePool(id: UserID) {
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

    sprite[0].entity.removeFromScene();
  }

  addUserToSpritePool(scene: Phaser.Scene, id: UserID) {
    if (this.spritePool.find((e) => e.user_id === id)) {
      console.log("character was already loaded into sprite pool");
      return;
    }
    const data = this.connectedPlayers.get(id);
    const opp = new Opponent(
      scene,
      100,
      100,
      "appearing-anim",
      0,
      data!.currentTexture as CharacterModel,
      data!.user_id,
    );
    this.spritePool.push({ user_id: id, entity: opp });
  }

  updateSpritePoolGameState(): void {
    if (this.spritePool.length === 0) return;
    for (const spr of this.spritePool) {
      if (!spr.entity.active) continue;
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
