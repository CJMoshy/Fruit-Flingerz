import { io, Socket } from "socket.io-client";

import { MultiplayerManager } from "../main.ts";

export const loginMsg: LoginMessage = {
  username: "",
  password: "",
};

export let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
const URL = "http://localhost:3000";
socket = io(URL);

socket.on("connect", () => {
  console.log("conncted");
});

socket.on("loginResponseMsg", (msg) => {
  console.log("here");
  if (msg.status === 409) {
    alert("Error Logging In. A user with this name already exists");
    console.error("Error Logging In. A user with this name already exists");
  }
  for (const user of msg.users) {
    if (user.user_id! === loginMsg.username) continue;
    MultiplayerManager.addUser(user.user_id!, user);
  }
  // new Phaser.Game(CONFIG); emit event
  document.dispatchEvent(new Event("connectionSuccess"));
});

socket.on("newUserMsg", (msg) => {
  console.log("new user message", msg);
  // maybe an issue here with the id being undef
  if (msg.user.user_id === loginMsg.username) {
    console.log("new user message id is same");
    return;
  }
  MultiplayerManager.addUser(msg.user.user_id!, msg.user);
});

socket.on("globalPositionUpdateMsg", (msg) => {
  if (msg.id === loginMsg.username) {
    console.log("update message id is same");
    return;
  }
  MultiplayerManager.updateUser(msg.id, msg.data);
});

export function logUserIn(loginMsg: LoginMessage) {
  socket.emit("loginMsg", loginMsg);
}
