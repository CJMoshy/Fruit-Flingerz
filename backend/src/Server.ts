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
      spritesList.push(newUserToken); // here is logic error although its handled on client side we still send the user it itself *

      // send a message back to the specific user
      socket.emit("loginResponseMsg", {
        status: 200,
        users: spritesList,
      } as LoginResponseMessage);

      // notify all connected users about the new user except user that just connected
      socket.broadcast.emit("newUserMsg", { user: newUserToken }); // making this broadcast redundant *
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
    const user = users.find((user) => user.socket.id === socket.id); // assert
    if (!user) return;

    const response: JoinLobbyResponseMessage = {
      status: 200,
      joined: true,
      usersInGame: [],
    };

    if (activeLobbies.has(msg.lobbyName)) {
      user.socket.join(msg.lobbyName);
      user.lobby = msg.lobbyName;

      // all the users in the current lobby
      const usersInLobby = users.filter((user) => user.lobby === msg.lobbyName);

      // get only the ids
      const userIds: UserID[] = [];
      usersInLobby.forEach((e) => userIds.push(e.id));

      // only get sprites that are in the lobby AND in the game
      // otherwise the join and leave events will do the work
      response.usersInGame = spritesList.filter((spr) =>
        userIds.includes(spr.user_id)
      ).filter((spr) => spr.inGame === true);
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
