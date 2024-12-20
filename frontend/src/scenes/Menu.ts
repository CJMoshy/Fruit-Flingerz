export default class Menu extends Phaser.Scene {
  LEVELPADDING: number;
  private scrollingScreen!: Phaser.GameObjects.TileSprite;
  private texturesMapping: Array<[BackgroundColor, CharacterModel]>;
  private characterImage!: Phaser.GameObjects.Sprite;
  private characterTextureCount: number;
  constructor() {
    super({ key: "menuScene" });

    this.LEVELPADDING = 100;
    this.texturesMapping = new Array(
      ["BG-pink", "player01"],
      ["BG-blue", "player02"],
      // ["BG-green", "player-03"],
      // ["BG-gray", "player-04"],
      // ["BG-purple", "player-05"],
    );
    this.characterTextureCount = 0;
  }

  init(): void {}

  preload(): void {
  }

  create(): void {
    let selectedMapping = this.texturesMapping[this.characterTextureCount];
    if (selectedMapping[0]) {
      this.scrollingScreen = this.add.tileSprite(0, 0, 800, 640, "BG-pink")
        .setOrigin(0);
    }

    this.add.image(
      (this.sys.canvas.width / 4) - this.LEVELPADDING,
      this.LEVELPADDING,
      "playBtn",
      0,
    ).setAlpha(0);
    // .on("pointerdown", () => {
    //   console.log("click on play btn");
    //   this.scene.start("playScene");
    // });
    this.add.image(
      (this.sys.canvas.width) - this.LEVELPADDING,
      this.LEVELPADDING,
      "levelBtn",
      0,
    ).setInteractive().on("pointerdown", () => {
      console.log("click on level btn");
    });

    this.characterImage = this.add.sprite(
      this.game.config.width as number / 2,
      this.game.config.height as number / 2,
      `${selectedMapping[1]}-idle`,
    ).setScale(3);
    this.characterImage.anims.play(`${selectedMapping[1]}-idle`);

    const seekCharacter = (forward: boolean) => {
      if (
        forward && this.characterTextureCount < this.texturesMapping.length - 1
      ) {
        selectedMapping = this.texturesMapping[++this.characterTextureCount];
        this.characterImage.setTexture(`${selectedMapping[1]}-idle`);
        this.characterImage.anims.play(`${selectedMapping[1]}-idle`);
        this.scrollingScreen.setTexture(`${selectedMapping[0]}`);
      } else if (!forward && this.characterTextureCount > 0) {
        selectedMapping = this.texturesMapping[--this.characterTextureCount];
        this.characterImage.setTexture(`${selectedMapping[1]}-idle`);
        this.characterImage.anims.play(`${selectedMapping[1]}-idle`);
        this.scrollingScreen.setTexture(`${selectedMapping[0]}`);
      }
    };

    this.add.image(
      this.sys.canvas.width / 2 + 100,
      this.sys.canvas.height / 2 + 250,
      "nextBtn",
    ).setInteractive().on("pointerdown", () => {
      seekCharacter(true);
    });
    this.add.image(
      this.sys.canvas.width / 2 - 100,
      this.sys.canvas.height / 2 + 250,
      "prevBtn",
    ).setInteractive().on("pointerdown", () => {
      seekCharacter(false);
    });
  }

  update(time: number, delta: number): void {
    (this.scrollingScreen as Phaser.GameObjects.TileSprite).tilePositionY += 1;
  }
}
