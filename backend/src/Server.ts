import { Server } from "socket.io";
import { createServer } from "http";
import { app } from "./App";

export const server = createServer(app);

server.listen(3000, () => {
  console.log(`server running at http://localhost:3000`);
});

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
}); //* pass in custom url possible..

const users: User[] = [];
const global_user_information: User_Info[] = [];

io.on("connection", (socket) => { // this is the base connection to the server, from any client
  console.log("a user connected"); // log it

  socket.on("login-msg", (msg) => { // we can listen for specific messgae types from the client
    console.log(msg);
    if (users.findIndex((e) => e.id === msg.username) !== -1) {
      console.log("ok");
      socket.emit("login-response-msg", {
        status: 409,
        pos: global_user_information,
      });
    } else {
      users.push({ id: msg.username, socket: socket });
      const x = {
        user_id: msg.username,
        position: {
          x: 0,
          y: 0,
        },
        currentAnimation: undefined,
        currentTexture: undefined,
        flipX: false,
      };
      global_user_information.push(x);
      socket.emit("login-response-msg", {
        status: 200,
        pos: global_user_information,
      }); //we can send a message back to the specific user
      io.emit("new-user-msg", x);
    }
  });

  const send_msg = (index: number) => {
    users.forEach((s: any) => {
      s.socket.emit("global-position-update", {
        data: global_user_information[index],
      });
    });
  };

  socket.on("player-update-event", (msg) => {
    console.log(msg.currentTexture);
    const index = global_user_information.findIndex((e) =>
      e.user_id === msg.user_id
    );
    global_user_information[index].position.x = msg.x;
    global_user_information[index].position.y = msg.y;
    global_user_information[index].currentAnimation = msg.currentAnimation;
    global_user_information[index].currentTexture = msg.currentTexture;
    global_user_information[index].flipX = msg.flipX;
    send_msg(index);
  });
});
