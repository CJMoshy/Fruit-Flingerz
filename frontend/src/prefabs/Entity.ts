export default class Entity extends Phaser.Physics.Arcade.Sprite {
  protected characterSprite: CharacterModel;

  protected userName: string;

  protected hitPoints: number;

  private namePlate: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: CharacterModel,
    frame: number = 0,
    userName: UserID,
    hitPoints: number,
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    //game things
    this.characterSprite = texture;

    //base player info
    this.userName = userName;
    this.hitPoints = hitPoints;

    this.namePlate = scene.add.text(this.x, this.y - 20, this.userName)
      .setOrigin(0.5);
  }

  update(...args: any[]): void {
    this.updateNamePlate();
  }

  private updateNamePlate() {
    this.namePlate.x = this.x;
    this.namePlate.y = this.y - 30;
  }

  public removeFromScene(): Promise<boolean> {
    return new Promise((resolve) => {
      this.anims.play("disappearing-anim").on(
        "animationcomplete",
        () => {
          this.destroy();
          console.log("destroyed", this);
          resolve(true);
        },
      );
    });
  }
}
