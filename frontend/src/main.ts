import Phaser from "phaser";
import Menu from "./scenes/Menu.ts";
import Play from "./scenes/Play.ts";
import Loader from "./scenes/Loader.ts";
import Lobby from "./scenes/Lobby.ts";
import ConnectionManager from "./lib/ConnectionManager.ts";
import { loginMsg, logUserIn } from "./lib/Socket.ts";

export const CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: "phaser-game",
  width: 800,
  height: 640,
  pixelArt: true,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  zoom: 1,
  scene: [Loader, Lobby, Menu, Play],
};

export const loggedin: boolean = false;

export const connectionManager = new ConnectionManager();

document.addEventListener("DOMContentLoaded", () => {
  // new Phaser.Game(CONFIG);
  const usernameField = document.getElementById(
    "username-field",
  ) as HTMLInputElement;
  usernameField.addEventListener("input", () => {
    loginMsg.username = usernameField.value;
  });
  document.getElementById("login-btn")!.addEventListener("click", () => {
    if (loginMsg.username !== "") {
      logUserIn(loginMsg);
    } else {
      console.log("no username or password");
    }
  });
});

document.addEventListener("connectionSuccess", () => new Phaser.Game(CONFIG));
