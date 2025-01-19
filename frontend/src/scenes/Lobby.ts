import { createLobby, joinLobby } from "../lib/Socket";
export default class Lobby extends Phaser.Scene {
  createLobbyInput!: Phaser.GameObjects.DOMElement;
  createLobbySubmit!: Phaser.GameObjects.DOMElement;

  joinLobbyInput!: Phaser.GameObjects.DOMElement;
  joinLobbySubmit!: Phaser.GameObjects.DOMElement;

  private lobbySuccessListener: EventListener;

  constructor() {
    super({ key: "lobbyScene" });

    this.lobbySuccessListener = () => {
      if (this.scene.isActive("lobbyScene")) {
        console.log("scene activ");
        this.scene.stop("lobbyScene");
        this.scene.start("menuScene");
      }
    };
    document.addEventListener("lobbySuccessEvent", this.lobbySuccessListener);
  }

  create() {
    this.events.on("destroy", () => {
      document.removeEventListener(
        "lobbySuccessEvent",
        this.lobbySuccessListener,
      );
    });

    let lobbyName = "";

    this.createLobbyInput = this.add.dom(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 4 + 25,
      "input",
      "width: 220px; height: 50px;",
    );
    this.createLobbyInput.addListener("input");
    this.createLobbyInput.on("input", (e: InputEvent) => {
      lobbyName = (e.target as HTMLInputElement).value;
    });

    this.createLobbySubmit = this.add.dom(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 4 + 100,
      "button",
      "width: 200px; height: 45px; font: 16px Arial",
      "create lobby",
    );
    this.createLobbySubmit.addListener("click");
    this.createLobbySubmit.on("click", () => {
      if (lobbyName === "") {
        alert("Enter a lobby name");
        return;
      }
      //potential regex parsing for lobby names?
      console.log("user looking to create lobby", lobbyName);
      createLobby(lobbyName);
    });

    let joinLobbyName = "";
    this.joinLobbyInput = this.add.dom(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + 100,
      "input",
      "width: 220px; height: 50px;",
    );
    this.joinLobbyInput.addListener("input");
    this.joinLobbyInput.on("input", (e: InputEvent) => {
      joinLobbyName = (e.target as HTMLInputElement).value;
    });

    this.joinLobbySubmit = this.add.dom(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + 175,
      "button",
      "width: 200px; height: 45px; font: 16px Arial",
      "join lobby",
    );
    this.joinLobbySubmit.addListener("click");
    this.joinLobbySubmit.on("click", () => {
      if (joinLobbyName === "") {
        alert("Enter a lobby name");
        return;
      }
      joinLobby(joinLobbyName);
    });

    this.physics.world.setBounds(
      0,
      -100,
      this.sys.canvas.width,
      this.sys.canvas.height + 100,
    );
    this.fruitMadness();
    this.time.addEvent({
      loop: true,
      callback: () => this.fruitMadness(),
      delay: Phaser.Math.Between(9, 12) * 1000,
    });
  }

  fruitMadness() {
    const fadeOut = (toFade: Phaser.Physics.Arcade.Sprite) => {
      this.tweens.add({
        targets: toFade,
        alpha: 0,
        duration: 1500,
        ease: "Bounce.easeOut",
        onComplete: () => {
          toFade.destroy();
        },
      });
    };

    const fruits = [
      "apple",
      "bananas",
      "kiwi",
      "cherries",
      "orange",
      "melon",
      "pineapple",
      "strawberry",
    ];

    for (let i = 0; i < 20; i++) {
      const x = this.physics.add.sprite(
        Phaser.Math.Between(50, this.sys.canvas.width - 50),
        -100,
        fruits[Phaser.Math.Between(0, fruits.length - 1)],
        0,
      ).setScale(2)
        .setGravityY(Phaser.Math.Between(200, 350))
        .setCollideWorldBounds().setBounce(
          0.85,
        );

      setTimeout(() => {
        fadeOut(x);
      }, Phaser.Math.Between(10, 15) * 1000);
    }
  }
}
