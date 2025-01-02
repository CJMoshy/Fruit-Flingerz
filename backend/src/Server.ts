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

// tracks active lobbies
const activeLobbies = new Set<string>();

// base connection to the server, from any client
io.on("connection", (socket) => {
  // listen for specific message types from the client
  socket.on("loginMsg", (msg) => {
    // check if a user with the same username already exists in the list of current users
    if (users.findIndex((e) => e.id === msg.username) !== -1) {
      console.log("A user tried to join that already exists");
      socket.emit("loginResponseMsg", {
        status: 409,
      } as Message);
    } else { // new user
      users.push({ id: msg.username, socket: socket, lobby: "none" });

      // send a message back to the specific user
      socket.emit("loginResponseMsg", {
        status: 200,
      });

      const newUserToken: User = {
        user_id: msg.username,
        inGame: false,
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
    }
  });

  // emitted when a user disconnects from the server
  socket.on("disconnect", () => {
    console.log("socket disconnected from server", socket.id);
    // find the user in the socket list
    const userToDisconnectIndex = users.findIndex((user) =>
      user.socket.id === socket.id
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
    io.emit("userDisconnectMsg", { id: removedUser[0].id }); // sometimes the server fails line 87 and this doesnt get sent out
  });

  // handle creating lobbys
  socket.on("createLobbyEvent", (msg) => {
    const user = users.find((user) => user.socket.id === socket.id); // assert request comes from registered user
    if (!user) return;

    const response: CreateLobbyResponseMsg = {
      status: 201,
      created: true,
    };

    // lobby exists
    if (activeLobbies.has(msg.lobbyName)) {
      response.status = 409;
      response.created = false;
    } else { // make a new lobby
      activeLobbies.add(msg.lobbyName);
      socket.join(msg.lobbyName); // connect requester
      user.lobby = msg.lobbyName;
    }

    socket.emit("lobbyCreatedMsg", response);
  });

  // handle for joining lobbys
  socket.on("joinLobbyEvent", (msg) => {
    const thisUser = users.find((user) => user.socket.id === socket.id); // assert
    if (!thisUser) return;

    const response: JoinLobbyResponseMessage = {
      status: 200,
      joined: true,
      allUsers: [],
      usersInGame: [],
    };

    if (activeLobbies.has(msg.lobbyName)) {
      socket.join(msg.lobbyName);
      thisUser.lobby = msg.lobbyName;
      const spr = spritesList.find((spr) => spr.user_id === thisUser.id);
      if (spr === undefined) {
        console.log(
          "failed to find a user in sprites list with correct id, could be bad",
        );
        return;
      }
      socket.to(msg.lobbyName).emit("newUserMsg", { user: spr });

      // all the users in the current lobby except this socket/user full data
      const usersInLobby = users.filter((user) =>
        user.lobby === msg.lobbyName && user.id !== thisUser.id
      );

      // Get only the ids of users in the lobby
      const userIds = usersInLobby.map((user) => user.id);
      
      // get all users in the lobby
      spritesList.forEach((spr) => {
        if (userIds.includes(spr.user_id)) {
          response.allUsers.push(spr);
          if (spr.inGame) { // get users also in game but just the ids
            response.usersInGame.push(spr.user_id);
          }
        }
      });
    } else {
      response.status = 404;
      response.joined = false;
    }

    socket.emit("lobbyJoinedMsg", response);
  });

  //sent by connected players to server containing game information
  socket.on("playerUpdateEvent", (msg) => {
    const index = spritesList.findIndex((e) => e.user_id === msg.user_id);
    if (index === -1) return;
    // globalUsersList[index] = msg; TEST THIS
    spritesList[index].position.x = msg.position.x;
    spritesList[index].position.y = msg.position.y;
    spritesList[index].currentAnimation = msg.currentAnimation;
    spritesList[index].currentTexture = msg.currentTexture;
    spritesList[index].flipX = msg.flipX;

    // can likely turn into function getUserRoom
    const user = users.find((user) => user.socket.id === socket.id);
    if (!user) return;
    const { lobby } = user;
    // end func

    socket.to(lobby).emit("globalPositionUpdateMsg", {
      id: spritesList[index].user_id,
      data: spritesList[index],
    });
  });

  // sent when a player returns to the menu
  socket.on("playerLeftGameEvent", (msg) => {
    const user = users.find((user) => user.socket.id === socket.id);
    if (!user) return;

    // thats a function if ive ever seen one
    const sprIndex = spritesList.findIndex((spr) => spr.user_id === user.id);
    if (sprIndex === -1) return;
    spritesList[sprIndex].inGame = false;

    const { lobby } = user;
    socket.to(lobby).emit("userLeftGameMsg", { id: msg.id });
  });

  // sent when a player joins back into the game (playScene)
  socket.on("playerJoinedGameEvent", (msg) => {
    const user = users.find((user) => user.socket.id === socket.id);
    if (!user) return;

    //refactor to function
    const sprIndex = spritesList.findIndex((spr) => spr.user_id === user.id);
    if (sprIndex === -1) return;
    spritesList[sprIndex].inGame = true;

    const { lobby } = user;
    socket.to(lobby).emit("userJoinedGameMsg", {
      id: msg.id,
      texture: msg.texture,
    });
  });
});
