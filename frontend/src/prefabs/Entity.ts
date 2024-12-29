export default class Entity extends Phaser.Physics.Arcade.Sprite {
  protected characterSprite: CharacterModel;

  protected userName: string;

  protected hitPoints: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: CharacterModel,
    frame: number = 0,
    userName: string,
    hitPoints: number,
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setGravityY(500);

    //game things
    this.characterSprite = texture;

    //base player info
    this.userName = userName;
    this.hitPoints = hitPoints;
  }

  public playAppearAnim() {
    this.anims.play("appearing-anim");
  }

  public playDisappearAnim() {
    this.anims.play("disappearing-anim");
  }
}
