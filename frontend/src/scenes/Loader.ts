import playButton from "../assets/img/buttons/Play.png";
import levelButton from "../assets/img/buttons/Levels.png";
import nextButton from "../assets/img/buttons/Next.png";
import prevButton from "../assets/img/buttons/Previous.png";
import tileset from "../assets/tileset/base-tileset-pixel-adv.png";
import mapData from "../assets/tileset/world.json" with { type: "json" };
import player1Idle from "../assets/spritesheets/char01/char01_idle.png";
import player1Run from "../assets/spritesheets/char01/char01_run.png";
import player1Jmp from "../assets/img/characters/char01/char01_jmp.png";
import player1Fall from "../assets/img/characters/char01/char01_fall.png";
import player1dbJmp from "../assets/spritesheets/char01/char01_dbJmp.png";
import player2Idle from "../assets/spritesheets/char02/char02_idle.png";
import player2Run from "../assets/spritesheets/char02/char02_run.png";
import player2Jmp from "../assets/img/characters/char02/char02_jmp.png";
import player2Fall from "../assets/img/characters/char02/char02_fall.png";
import player2dbJmp from "../assets/spritesheets/char02/char02_dbJmp.png";
import player3Idle from "../assets/spritesheets/char03/char03_idle.png";
import player3Run from "../assets/spritesheets/char03/char03_run.png";
import player3Jmp from "../assets/img/characters/char03/char03_jmp.png";
import player3Fall from "../assets/img/characters/char03/char03_fall.png";
import player3dbJmp from "../assets/spritesheets/char03/char03_dbJmp.png";
import player4Idle from "../assets/spritesheets/char04/char04_idle.png";
import player4Run from "../assets/spritesheets/char04/char04_run.png";
import player4Jmp from "../assets/img/characters/char04/char04_jmp.png";
import player4Fall from "../assets/img/characters/char04/char04_fall.png";
import player4dbJmp from "../assets/spritesheets/char04/char04_dbJmp.png";

import pinkBG from "../assets/img/backgrounds/Pink.png";
import blueBG from "../assets/img/backgrounds/blue.png";
import grayBG from "../assets/img/backgrounds/gray.png";
import greenBG from "../assets/img/backgrounds/green.png";
import purpleBG from "../assets/img/backgrounds/purple.png";

import selectNoHover from "../assets/img/buttons/select/select_no_hover.png";
import selectHover from "../assets/img/buttons/select/select_hover.png";
import selectLocked from "../assets/img/buttons/select/select_locked.png";

import Appearing from "../assets/spritesheets/spawn/Appearing.png";
import Disappearing from "../assets/spritesheets/spawn/Disappearing.png";

import star1 from "../assets/img/star/star1.png";
import star2 from "../assets/img/star/star2.png";
import star3 from "../assets/img/star/star3.png";
import star4 from "../assets/img/star/star4.png";
import star5 from "../assets/img/star/star5.png";
import star6 from "../assets/img/star/star6.png";

import apple from "../assets/spritesheets/fruits/Apple.png";
import bananas from "../assets/spritesheets/fruits/Bananas.png";
import cherries from "../assets/spritesheets/fruits/cherries.png";
import kiwi from "../assets/spritesheets/fruits/Kiwi.png";
import melon from "../assets/spritesheets/fruits/Melon.png";
import orange from "../assets/spritesheets/fruits/Orange.png";
import pineapple from "../assets/spritesheets/fruits/Pineapple.png";
import strawberry from "../assets/spritesheets/fruits/Strawberry.png";

export default class Loader extends Phaser.Scene {
  constructor() {
    super({ key: "loaderScene" });
  }

  init(): void {}

  preload(): void {
    //backgrounds
    this.load.image("BG-pink", pinkBG);
    this.load.image("BG-blue", blueBG);
    this.load.image("BG-gray", grayBG);
    this.load.image("BG-green", greenBG);
    this.load.image("BG-purple", purpleBG);

    //buttons
    this.load.image("playBtn", playButton);
    this.load.image("levelBtn", levelButton);
    this.load.image("nextBtn", nextButton);
    this.load.image("prevBtn", prevButton);
    this.load.image("selectNoHover", selectNoHover);
    this.load.image("selectHover", selectHover);
    this.load.image("selectLocked", selectLocked);

    //static player images
    this.load.image("player01-jump", player1Jmp);
    this.load.image("player01-fall", player1Fall);
    this.load.image("player02-jump", player2Jmp);
    this.load.image("player02-fall", player2Fall);
    this.load.image("player03-jump", player3Jmp);
    this.load.image("player03-fall", player3Fall);
    this.load.image("player04-jump", player4Jmp);
    this.load.image("player04-fall", player4Fall);

    //stahrz
    this.load.image("star-1", star1);
    this.load.image("star-2", star2);
    this.load.image("star-3", star3);
    this.load.image("star-4", star4);
    this.load.image("star-5", star5);
    this.load.image("star-6", star6);
    //appearing and disappearing animation
    this.load.spritesheet("appear", Appearing, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("disappear", Disappearing, {
      frameWidth: 96,
      frameHeight: 96,
    });

    //player spritesheets
    //p1
    this.load.spritesheet("player-01-idle", player1Idle, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-01-run", player1Run, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-01-dbJmp", player1dbJmp, {
      frameWidth: 32,
      frameHeight: 32,
    });

    //p2
    this.load.spritesheet("player-02-idle", player2Idle, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-02-run", player2Run, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-02-dbJmp", player2dbJmp, {
      frameWidth: 32,
      frameHeight: 32,
    });

    //p3
    this.load.spritesheet("player-03-idle", player3Idle, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-03-run", player3Run, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-03-dbJmp", player3dbJmp, {
      frameWidth: 32,
      frameHeight: 32,
    });

    //p4
    this.load.spritesheet("player-04-idle", player4Idle, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-04-run", player4Run, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-04-dbJmp", player4dbJmp, {
      frameWidth: 32,
      frameHeight: 32,
    });

    //fruits

    this.load.spritesheet("apple", apple, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("bananas", bananas, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("cherries", cherries, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("kiwi", kiwi, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("melon", melon, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("orange", orange, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("pineapple", pineapple, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("strawberry", strawberry, {
      frameWidth: 32,
      frameHeight: 32,
    });

    //tilemap stuff
    this.load.image("base-tileset", tileset);
    this.load.tilemapTiledJSON("tilemapJSON", mapData);
  }

  create(): void {
    this.anims.create({
      key: "appearing-anim",
      frames: this.anims.generateFrameNumbers("appear", {
        start: 0,
        end: 6,
      }),
    });

    this.anims.create({
      key: "disappearing-anim",
      frames: this.anims.generateFrameNumbers("disappear", {
        start: 0,
        end: 6,
      }),
    });

    this.anims.create({
      key: "player01-idle",
      frames: this.anims.generateFrameNumbers("player-01-idle", {
        start: 0,
        end: 10,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "player01-run",
      frames: this.anims.generateFrameNumbers("player-01-run", {
        start: 0,
        end: 11,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "player01-dbJmp",
      frames: this.anims.generateFrameNumbers("player-01-dbJmp", {
        start: 0,
        end: 5,
      }),
      frameRate: 25,
      repeat: 0,
    });

    this.anims.create({
      key: "player02-idle",
      frames: this.anims.generateFrameNumbers("player-02-idle", {
        start: 0,
        end: 10,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "player02-run",
      frames: this.anims.generateFrameNumbers("player-02-run", {
        start: 0,
        end: 11,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "player02-dbJmp",
      frames: this.anims.generateFrameNumbers("player-02-dbJmp", {
        start: 0,
        end: 5,
      }),
      frameRate: 25,
      repeat: 0,
    });

    this.anims.create({
      key: "player03-idle",
      frames: this.anims.generateFrameNumbers("player-03-idle", {
        start: 0,
        end: 10,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "player03-run",
      frames: this.anims.generateFrameNumbers("player-03-run", {
        start: 0,
        end: 11,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "player03-dbJmp",
      frames: this.anims.generateFrameNumbers("player-03-dbJmp", {
        start: 0,
        end: 5,
      }),
      frameRate: 25,
      repeat: 0,
    });

    this.anims.create({
      key: "player04-idle",
      frames: this.anims.generateFrameNumbers("player-04-idle", {
        start: 0,
        end: 10,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "player04-run",
      frames: this.anims.generateFrameNumbers("player-04-run", {
        start: 0,
        end: 11,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "player04-dbJmp",
      frames: this.anims.generateFrameNumbers("player-04-dbJmp", {
        start: 0,
        end: 5,
      }),
      frameRate: 25,
      repeat: 0,
    });

    this.scene.start("lobbyScene");
  }
}
