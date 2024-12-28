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

// this is the list of the sockets we iterate through to nofity connected users
const users: ConnectedUser[] = [];

// this contains the data about user sprites in game
const spritesList: User[] = [];

// base connection to the server, from any client
io.on("connection", (socket) => {
  console.log("a user connected");
  // listen for specific message types from the client
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
      spritesList.push(newUserToken);
      console.log(spritesList);
      // send a message back to the specific user
      socket.emit("loginResponseMsg", {
        status: 200,
        users: spritesList,
      } as LoginResponseMessage);

      // notify all connected users about the new user except user that just connected
      socket.broadcast.emit("newUserMsg", { user: newUserToken });
    }
  });

  // emitted when a user disconnects from the server
  socket.on("disconnect", () => {
    console.log("socket disconnected from server");
    // find the user in the socket list
    const userToDisconnectIndex = users.findIndex((user) =>
      user.socket === socket
    );
    if (userToDisconnectIndex === -1) {
      console.log(
        "failed to find user in connected users arr with socket that just disconnected from server",
      );
      return;
    }
    const removedUser = users.splice(userToDisconnectIndex, 1); // remove user

    // find the users sprite in the sprite list
    const spriteDataIndex = spritesList.findIndex((user) =>
      user.user_id === removedUser[0].id
    );

    if (spriteDataIndex === -1) {
      console.log(
        "failed to find user in phaser sprite users arr that just disconnected from the server",
      );
      return;
    }
    // remove the sprite
    spritesList.splice(spriteDataIndex, 1);

    // only emit the user dc message once both have been removed TODO fix more clean logic
    io.emit("userDisconnectMsg", { id: removedUser[0].id });
  });

  socket.on("playerUpdateEvent", (msg) => {
    const index = spritesList.findIndex((e) => e.user_id === msg.user_id);
    // globalUsersList[index] = msg; TEST THIS
    spritesList[index].position.x = msg.position.x;
    spritesList[index].position.y = msg.position.y;
    spritesList[index].currentAnimation = msg.currentAnimation;
    spritesList[index].currentTexture = msg.currentTexture;
    spritesList[index].flipX = msg.flipX;

    socket.broadcast.emit("globalPositionUpdateMsg", {
      id: spritesList[index].user_id,
      data: spritesList[index],
    });
  });
});
