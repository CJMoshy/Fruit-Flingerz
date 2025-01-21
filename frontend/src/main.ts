import Phaser from "phaser";
import Menu from "./scenes/Menu.ts";
import Play from "./scenes/Play.ts";
import Loader from "./scenes/Loader.ts";
import Lobby from "./scenes/Lobby.ts";
import ConnectionManager from "./lib/ConnectionManager.ts";
import {
  connectToServer,
  disconnectFromServer,
  isSocketConnected,
  loginMsg,
  logUserIn,
} from "./lib/Socket.ts";
import { verifyUsername } from "./lib/Verify.ts";

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
      // debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  zoom: 1,
  scene: [Loader, Lobby, Menu, Play],
};

export const connectionManager = new ConnectionManager();

let game: Phaser.Game | null = null;

document.addEventListener("DOMContentLoaded", () => {
  const usernameField = document.getElementById(
    "username-field",
  ) as HTMLInputElement;

  const disconnectBtn = document.getElementById(
    "disconnect-btn",
  )! as HTMLButtonElement;

  const reconnectBtn = document.getElementById(
    "reconnect-btn",
  ) as HTMLButtonElement;
  const loginBtn = document.getElementById("login-btn")! as HTMLButtonElement;

  // listeners
  usernameField.addEventListener("input", () => {
    loginMsg.username = usernameField.value;
  });

  loginBtn.addEventListener("click", () => {
    if (verifyUsername(loginMsg.username)) {
      logUserIn(loginMsg);
    }
  });

  disconnectBtn.addEventListener("click", () => {
    if (game) {
      game.destroy(true);
      connectionManager.removeAllUsers();
      disconnectFromServer();
      disconnectBtn.disabled = true;
      reconnectBtn.disabled = false;
    }
  });

  reconnectBtn.addEventListener("click", () => {
    if (isSocketConnected() === false) {
      connectToServer();
    }
  });

  document.addEventListener("connectedBase", () => {
    loginBtn.disabled = false;
    reconnectBtn.disabled = true;
  });

  document.addEventListener(
    "connectedGame",
    () => {
      loginBtn.disabled = true;
      disconnectBtn.disabled = false;
      game = new Phaser.Game(CONFIG);
    },
  );
});
