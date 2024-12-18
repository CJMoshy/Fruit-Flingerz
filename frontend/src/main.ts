import Phaser from "phaser";
import Menu from "./scenes/Menu.ts";
import Play from "./scenes/Play.ts";
import Loader from "./scenes/Loader.ts";
import ConnectionManager from "./lib/ConnectionManager.ts";
import { loginMsg, logUserIn, socket } from "./lib/Socket.ts";

export const CONFIG = {
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
  zoom: 1,
  scene: [Loader, Menu, Play],
};

export const loggedin: boolean = false;

export const MultiplayerManager = new ConnectionManager();

document.addEventListener("DOMContentLoaded", () => {
  const usernameField = document.getElementById(
    "username-field",
  ) as HTMLInputElement;
  usernameField.addEventListener("change", () => {
    loginMsg.username = usernameField.value;
  });
  // let passwordField = document.getElementById('password-field') as HTMLInputElement
  document.getElementById("login-btn")!.addEventListener("click", () => {
    console.log("click");
    if (loginMsg.username !== "") { // password not null
      logUserIn(loginMsg);
    } else {
      console.log("no username or password");
    }
  });
});

socket.on("login-response-msg", (msg) => {
  if (msg.status === 200) {
    for (const user of msg.pos) {
      MultiplayerManager.addUser(user.id, user);
    }
    new Phaser.Game(CONFIG);
  }
});
