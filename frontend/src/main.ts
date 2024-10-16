import Phaser from "phaser";
import Menu from "./scenes/Menu";
import Play from "./scenes/Play";
import Loader from "./scenes/Loader";
import { init_login_msg, socket, users } from "./lib/Socket";

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

document.addEventListener("DOMContentLoaded", () => {
  const usernameField = document.getElementById(
    "username-field",
  ) as HTMLInputElement;
  // let passwordField = document.getElementById('password-field') as HTMLInputElement
  document.getElementById("login-btn")?.addEventListener("click", () => {
    init_login_msg.username = usernameField.value;
    if (usernameField.value !== "") { // password not null
      socket.emit("login-msg", {
        username: init_login_msg.username,
        password: "test",
      });
      // const GAME: Phaser.Game = new Phaser.Game(CONFIG);
    } else console.log("no username or password");
  });
});

socket.on("login-response-msg", (msg) => {
  if (msg.status === 200) {
    for (const x of msg.pos) {
      console.log(x);
      users.push(x);
    }
    // eslint-disable-next-line
    const GAME: Phaser.Game = new Phaser.Game(CONFIG);
  }
});
