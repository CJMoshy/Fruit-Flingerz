export default class Menu extends Phaser.Scene {
  private scrollingScreen!: Phaser.GameObjects.TileSprite;

  private characterImage!: Phaser.GameObjects.Sprite;
  private texturesMapping: Array<[BackgroundColor, CharacterModel]>;
  private characterTextureCount: number = 0;
  private isLockedIn: Boolean = false;

  private playBtn!: Phaser.GameObjects.Image;
  private selectButton!: Phaser.GameObjects.Image;

  private LEVELPADDING: number = 100;
  private PLAYER_RESOLUTION_SCALE_FACTOR: number = 3;

  constructor() {
    super({ key: "menuScene" });
    // this is used to map each sprite texture to a background
    this.texturesMapping = new Array(
      ["BG-pink", "player01"],
      ["BG-blue", "player02"],
      ["BG-green", "player03"],
      ["BG-gray", "player04"],
    );
  }

  init(): void {}

  preload(): void {}

  create(): void {
    this.isLockedIn = false; // set in create so whenever the player returns here from game its reset
    this.characterTextureCount = 0; // track where we are in the mapping (reset on return)

    // snag first index of mapping
    let selectedMapping = this.texturesMapping[this.characterTextureCount];
    //verify the texture was loaded and set it
    if (this.textures.exists(selectedMapping[0])) {
      this.scrollingScreen = this.add.tileSprite(
        0,
        0,
        this.sys.canvas.width,
        this.sys.canvas.height,
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

    // sprite images on screen
    this.characterImage = this.add.sprite(
      this.game.config.width as number / 2,
      this.game.config.height as number / 2,
      `${selectedMapping[1]}-idle`,
    ).setScale(this.PLAYER_RESOLUTION_SCALE_FACTOR); // (upscaled in size)
    this.characterImage.anims.play(`${selectedMapping[1]}-idle`);

    // helper for seeking through list of sprites
    const seekCharacter = (forward: boolean) => {
      const setTextureAndPlayAnim = () => {
        selectedMapping = this.texturesMapping[this.characterTextureCount];
        this.characterImage.setTexture(`${selectedMapping[1]}-idle`);
        this.characterImage.anims.play(`${selectedMapping[1]}-idle`);
        this.scrollingScreen.setTexture(`${selectedMapping[0]}`);
      };
      if (forward) {
        // at length of arr so reset to 0th index
        if (this.characterTextureCount === this.texturesMapping.length - 1) {
          this.characterTextureCount = 0;
        } else {
          this.characterTextureCount++;
        }
      } else {
        // at 0th so set to length
        if (this.characterTextureCount === 0) {
          this.characterTextureCount = this.texturesMapping.length - 1;
        } else {
          this.characterTextureCount--;
        }
      }
      setTextureAndPlayAnim();
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
      if (this.isLockedIn === false) {
        this.isLockedIn = true;
        this.selectButton.setTexture("selectLocked");
        this.playBtn.setAlpha(1).setInteractive().on("pointerdown", () => {
          this.scene.stop("menuScene");
          this.scene.start("playScene", { char: selectedMapping[1] });
        });
      } else {
        this.isLockedIn = false;
        this.selectButton.setTexture("selectHover");
        this.playBtn.setAlpha(0).removeInteractive();
      }
    });
  }

  update(time: number, delta: number): void {
    this.scrollingScreen.tilePositionY += 1;
  }
}
