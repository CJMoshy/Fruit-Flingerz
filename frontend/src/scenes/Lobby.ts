import { createLobby, joinLobby } from "../lib/Socket";
export default class Lobby extends Phaser.Scene {
  createLobbyInput!: Phaser.GameObjects.DOMElement;
  createLobbySubmit!: Phaser.GameObjects.DOMElement;

  joinLobbyInput!: Phaser.GameObjects.DOMElement;
  joinLobbySubmit!: Phaser.GameObjects.DOMElement;

  constructor() {
    super({ key: "lobbyScene" });
    document.addEventListener("lobbySuccessEvent", () => {
      if (this.scene.isActive("lobbyScene")) {
        this.scene.stop("lobbyScene");
        this.scene.start("menuScene");
      }
    });
  }

  create() {
    let lobbyName = "";
    this.createLobbyInput = this.add.dom(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      "input",
      "width: 220px; height: 50px;",
    );
    this.createLobbyInput.addListener("input");
    this.createLobbyInput.on("input", (e: InputEvent) => {
      lobbyName = (e.target as HTMLInputElement).value;
    });

    this.createLobbySubmit = this.add.dom(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + 100,
      "button",
      "width: 100px; height: 45px; font: 16px Arial",
      "create",
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
      this.sys.canvas.height / 2 + 200,
      "input",
      "width: 220px; height: 50px;",
    );
    this.joinLobbyInput.addListener("input");
    this.joinLobbyInput.on("input", (e: InputEvent) => {
      joinLobbyName = (e.target as HTMLInputElement).value;
    });

    this.joinLobbySubmit = this.add.dom(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + 300,
      "button",
      "width: 100px; height: 45px; font: 16px Arial",
      "join",
    );
    this.joinLobbySubmit.addListener("click");
    this.joinLobbySubmit.on("click", () => {
      joinLobby(joinLobbyName);
    });
  }
}
