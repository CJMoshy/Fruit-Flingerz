export default class Menu extends Phaser.Scene {
  LEVELPADDING: number;
  private scrollingScreen!: Phaser.GameObjects.TileSprite;
  private texturesMapping: Array<[BackgroundColor, CharacterModel]>;
  private characterImage!: Phaser.GameObjects.Sprite;
  private characterTextureCount: number;
  private selectButton!: Phaser.GameObjects.Image;

  private isLockedIn: Boolean;

  private playBtn!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "menuScene" });

    this.LEVELPADDING = 100;
    this.texturesMapping = new Array(
      ["BG-pink", "player01"],
      ["BG-blue", "player02"],
      ["BG-green", "player03"],
      ["BG-gray", "player04"],
    );
    this.characterTextureCount = 0;
    this.isLockedIn = false;
  }

  init(): void {}

  preload(): void {
  }

  create(): void {
    let selectedMapping = this.texturesMapping[this.characterTextureCount];
    if (selectedMapping[0]) {
      this.scrollingScreen = this.add.tileSprite(
        0,
        0,
        800,
        640,
        selectedMapping[0],
      )
        .setOrigin(0);
    }

    this.playBtn = this.add.image(
      (this.sys.canvas.width / 4) - this.LEVELPADDING,
      this.LEVELPADDING,
      "playBtn",
      0,
    ).setAlpha(0);
    // this.add.image(
    //   (this.sys.canvas.width) - this.LEVELPADDING,
    //   this.LEVELPADDING,
    //   "levelBtn",
    //   0,
    // ).setInteractive().on("pointerdown", () => {
    //   console.log("click on level btn does nothing rn but would maybe show maps or something idk");
    // });

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
      this.sys.canvas.width / 2 + 150,
      this.sys.canvas.height / 2 + 250,
      "nextBtn",
    ).setInteractive().on("pointerdown", () => {
      if (this.isLockedIn) return;
      seekCharacter(true);
    });
    this.add.image(
      this.sys.canvas.width / 2 - 150,
      this.sys.canvas.height / 2 + 250,
      "prevBtn",
    ).setInteractive().on("pointerdown", () => {
      if (this.isLockedIn) return;
      seekCharacter(false);
    });

    this.selectButton = this.add.image(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + 250,
      "selectNoHover",
    ).setInteractive().on(
      "pointerover",
      () => {
        if (this.isLockedIn) return;
        this.selectButton.setTexture("selectHover");
      },
    ).on("pointerout", () => {
      if (this.isLockedIn) return;
      this.selectButton.setTexture("selectNoHover");
    }).on("pointerdown", () => {
      if (!this.isLockedIn) {
        this.isLockedIn = true;
        this.selectButton.setTexture("selectLocked");
        this.playBtn.setAlpha(1).setInteractive().on("pointerdown", () => {
          console.log("Game would start but the code is commented out");
          //this.scene.start('playScene')
        });
      } else {
        this.isLockedIn = false;
        this.selectButton.setTexture("selectHover");
        this.playBtn.setAlpha(0).removeInteractive();
      }
    });
  }

  update(time: number, delta: number): void {
    (this.scrollingScreen as Phaser.GameObjects.TileSprite).tilePositionY += 1;
  }
}
