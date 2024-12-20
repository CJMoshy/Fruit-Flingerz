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
const globalUsersList: ClientInfo[] = [];

/**
 * @param msgName the name/type of message to send
 * @param msg the message object containg the data
 */
function send_msg(msgName: string, msg: any) {
  users.forEach((user: User) => {
    user.socket.emit(msgName, msg);
  });
}

// base connection to the server, from any client
io.on("connection", (socket) => {
  console.log("a user connected");

  // listen for specific messgae types from the client
  socket.on("login-msg", (msg: LoginMessage) => {
    // check if a user with the same username already exists in the list of current users
    if (users.findIndex((e) => e.id === msg.username) !== -1) {
      console.log("A user tried to join that already exists");
      socket.emit("login-response-msg", {
        status: 409,
      } as ResponseMessage);
    } else { // new user
      users.push({ id: msg.username, socket: socket });
      const newUserToken: ClientInfo = {
        user_id: msg.username,
        user: {
          position: {
            x: 0,
            y: 0,
          },
          currentAnimation: undefined,
          currentTexture: undefined,
          flipX: false,
        },
      };

      // add it to server list
      globalUsersList.push(newUserToken);

      // send a message back to the specific user
      socket.emit("login-response-msg", {
        status: 200,
        users: globalUsersList,
      } as LoginResponseMessage);

      // notify all connected users about the new user
      io.emit("new-user-msg", newUserToken);
    }
  });

  socket.on("player-update-event", (msg) => {
    const index = globalUsersList.findIndex((e) => e.user_id === msg.user_id);
    globalUsersList[index].user.position.x = msg.x;
    globalUsersList[index].user.position.y = msg.y;
    globalUsersList[index].user.currentAnimation = msg.currentAnimation;
    globalUsersList[index].user.currentTexture = msg.currentTexture;
    globalUsersList[index].user.flipX = msg.flipX;

    send_msg("global-position-update", {
      user_id: globalUsersList[index].user_id,
      user: globalUsersList[index].user,
    });
  });
});
