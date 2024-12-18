import { io } from "socket.io-client";

import { MultiplayerManager } from "../main.ts";

export const loginMsg: loginMsg = {
  username: "",
  password: "",
};

export const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("conncted");
});

socket.on("new-user-msg", (msg) => {
  if (msg.user_id === loginMsg.username) return;
  MultiplayerManager.addUser(msg.user_id, msg.user);
});

socket.on("global-position-update", (msg) => {
  MultiplayerManager.updateUser(msg.user_id as UserID, msg.data as OtherUser);
});

export function logUserIn(loginMsg: loginMsg) {
  socket.emit("login-msg", {
    username: loginMsg.username,
    password: "test",
  });
}
