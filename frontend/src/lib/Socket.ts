import { io, Socket } from "socket.io-client";

import { connectionManager } from "../main.ts";

export const loginMsg: LoginMessage = {
  username: "",
  password: "",
};

const URL = "http://localhost:3000";
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
);

socket.on("connect", () => {
  console.log("conncted");
});

socket.on("connect_error", (err) => {
  console.error("error connecting", err);
  alert("World Server Down! Refresh page to initiate new connection to server");
  socket.disconnect();
});

socket.on("loginResponseMsg", (msg) => {
  if (msg.status === 409) {
    alert("Error Logging In. A user with this name already exists");
    console.error("Error Logging In. A user with this name already exists");
  }
  for (const user of msg.users) {
    if (user.user_id! === loginMsg.username) continue;
    connectionManager.addUser(user.user_id!, user);
  }
  document.dispatchEvent(new Event("connectionSuccess"));
});

socket.on("newUserMsg", (msg) => {
  console.log("new user message", msg);
  // maybe an issue here with the id being undef
  if (msg.user.user_id === loginMsg.username) {
    console.log("new user message id is same");
    return;
  }
  connectionManager.addUser(msg.user.user_id!, msg.user);
});

socket.on("userDisconnectMsg", (msg) => {
  console.log("user disconnected from the server");
  connectionManager.removeUser(msg.id);
});

socket.on("globalPositionUpdateMsg", (msg) => {
  if (msg.id === loginMsg.username) {
    console.log("update message id is same");
    return;
  }
  connectionManager.updateUser(msg.id, msg.data, false);
});

socket.on("userJoinedGameMsg", (msg) => {
  connectionManager.updateUser(msg.id, msg.texture, true);
  document.dispatchEvent(new CustomEvent("userJoinedGame", { detail: msg.id }));
});

socket.on("userLeftGameMsg", (msg) => {
  console.log(`user ${msg.id} left the game!`);
  connectionManager.removeUserFromSpritePool(msg.id);
});

export function logUserIn(loginMsg: LoginMessage) {
  socket.emit("loginMsg", loginMsg);
}
