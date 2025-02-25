export default class Entity extends Phaser.Physics.Arcade.Sprite {
  protected characterSprite: CharacterModel;

  public userName: string;

  protected hitPoints: number;
  protected constHealth: number; // does not get modified when player take dmg, used for reset health

  protected namePlate: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string = "appearing-anim",
    frame: number = 0,
    charSprite: CharacterModel,
    hitPoints: number,
    userName: UserID
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    //game things
    this.characterSprite = charSprite;

    //base player info
    this.userName = userName;
    this.hitPoints = hitPoints;
    this.constHealth = hitPoints;

    this.namePlate = scene.add
      .text(this.x, this.y - 20, this.userName)
      .setOrigin(0.5);
  }

  update(...args: any[]): void {
    this.updateNamePlate();
  }
  public healthReset() {
    this.hitPoints = this.constHealth;
  }
  public removeNamePlate() {
    this.namePlate.destroy();
  }

  private updateNamePlate() {
    this.namePlate.x = this.x;
    this.namePlate.y = this.y - 30;
  }

  public removeFromScene() {
    this.removeNamePlate();
    this.destroy();
  }
}
