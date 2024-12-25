import { Server } from "socket.io";
import { createServer } from "http";
import { app } from "./App";

export const server = createServer(app);

server.listen(3000, () => {
  console.log(`server running at http://localhost:3000`);
});

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents
>(server, {
  cors: {
    origin: "http://localhost:5173",
  },
}); //* pass in custom url possible..

const users: ConnectedUser[] = [];
const globalUsersList: User[] = [];

/**
 * @param msgName the name/type of message to send
 * @param msg the message object containg the data
 */
function send_msg(msgName: string, msg: Message) {
  users.forEach((user) => {
    user.socket.emit(msgName, msg);
  });
}

// base connection to the server, from any client
io.on("connection", (socket) => {
  console.log("a user connected");
  // listen for specific messgae types from the client
  socket.on("loginMsg", (msg) => {
    // check if a user with the same username already exists in the list of current users
    if (users.findIndex((e) => e.id === msg.username) !== -1) {
      console.log("A user tried to join that already exists");
      socket.emit("loginResponseMsg", {
        status: 409,
      } as Message);
    } else { // new user
      users.push({ id: msg.username, socket: socket });
      const newUserToken: User = {
        user_id: msg.username,
        position: {
          x: 0,
          y: 0,
        },
        currentAnimation: undefined,
        currentTexture: undefined,
        flipX: false,
      };

      // add it to server list
      globalUsersList.push(newUserToken);
      console.log(globalUsersList);
      // send a message back to the specific user
      socket.emit("loginResponseMsg", {
        status: 200,
        users: globalUsersList,
      } as LoginResponseMessage);

      // notify all connected users about the new user
      io.emit("newUserMsg", { user: newUserToken });
    }
  });

  socket.on("playerUpdateEvent", (msg) => {
    const index = globalUsersList.findIndex((e) => e.user_id === msg.user_id);
    // globalUsersList[index] = msg; TEST THIS
    globalUsersList[index].position.x = msg.position.x;
    globalUsersList[index].position.y = msg.position.y;
    globalUsersList[index].currentAnimation = msg.currentAnimation;
    globalUsersList[index].currentTexture = msg.currentTexture;
    globalUsersList[index].flipX = msg.flipX;

    send_msg("globalPositionUpdateMsg", {
      id: globalUsersList[index].user_id,
      data: globalUsersList[index],
    } as GlobalPositionUpdateMsg);
  });
});
