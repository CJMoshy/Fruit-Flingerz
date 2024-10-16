import { io } from "socket.io-client";

export const init_login_msg: login_msg = {
  username: "",
  password: "",
};

export const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("conncted");
});

export const users: User_Position_Info[] = [];

socket.on("login-response-msg", (msg) => {
  console.log(msg);
  for (const x of msg.pos) {
    console.log(x);
    users.push(x);
  }
  console.log(users);
});

socket.on("new-user-msg", (msg) => {
  if (msg.user_id !== init_login_msg.username) {
    users.push(msg);
  }
});

socket.on("global-position-update", (msg) => {
  const index = users.findIndex((e) => e.user_id === msg.data.user_id);
  users[index].position.x = msg.data.position.x;
  users[index].position.y = msg.data.position.y;
  users[index].currentAnimation = msg.data.currentAnimation;
  users[index].currentTexture = msg.data.currentTexture;
  users[index].flipX = msg.data.flipX;
  // console.log(users[index])
});
