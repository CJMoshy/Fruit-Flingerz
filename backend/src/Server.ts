import { Server } from "socket.io";
import { createServer } from "http";
import { app } from "./App";
import ServerManager from "./lib/ServerManager";

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

const sManager = new ServerManager();

// base connection to the server, from any client
io.on("connection", (socket) => {
  // listen for specific message types from the client
  socket.on("loginMsg", (msg) => {
    // check if a user with the same username already exists in the list of current users
    if (sManager.checkConnectedUserExist(msg.username) !== undefined) {
      console.log("A user tried to join that already exists");
      socket.emit("loginResponseMsg", {
        status: 409,
      } as Message);
    } else { // new user
      sManager.addConnectedUser({
        id: msg.username,
        socket: socket,
        lobby: "none",
      });

      // send a message back to the specific user
      socket.emit("loginResponseMsg", {
        status: 200,
      });

      // add it to server list
      sManager.addUserToSpritesList({
        user_id: msg.username,
        inGame: false,
        position: {
          x: 0,
          y: 0,
        },
        currentAnimation: undefined,
        currentTexture: undefined,
        flipX: false,
      });
    }
  });

  // emitted when a user disconnects from the server
  socket.on("disconnect", () => {
    console.log("socket disconnected from server", socket.id);
    // find the user in the socket list
    const userToDisconnectIndex = sManager.getConnectedUserBySocketID(
      socket.id,
    );

    // prob dont need this
    if (userToDisconnectIndex === undefined) {
      console.log(
        "failed to find user in connected users arr with socket that just disconnected from server",
      );
      return;
    } // end

    const removedUser = sManager.removeConnectedUser(userToDisconnectIndex.id);

    if (!removedUser) {
      return;
    }
    // find the users sprite in the sprite list
    sManager.removeUserFromSpritesList(removedUser.id);

    io.emit("userDisconnectMsg", { id: removedUser.id }); // should only get sent if the server can verify the user existed
  });

  // handle creating lobbys
  socket.on("createLobbyEvent", (msg) => {
    const user = sManager.getConnectedUserBySocketID(socket.id); // assert request comes from registered user
    if (!user) return;

    const response: CreateLobbyResponseMsg = {
      status: 201,
      created: true,
    };

    // lobby exists
    if (sManager.activeLobbies.has(msg.lobbyName)) {
      response.status = 409;
      response.created = false;
    } else { // make a new lobby
      sManager.activeLobbies.add(msg.lobbyName);
      socket.join(msg.lobbyName); // connect requester
      user.lobby = msg.lobbyName;
    }

    socket.emit("lobbyCreatedMsg", response);
  });

  // handle for joining lobbys
  socket.on("joinLobbyEvent", (msg) => {
    const thisUser = sManager.getConnectedUserBySocketID(socket.id); // assert
    if (!thisUser) return;

    const response: JoinLobbyResponseMessage = {
      status: 200,
      joined: true,
      allUsers: [],
      usersInGame: [],
    };

    // lobby exists
    if (sManager.activeLobbies.has(msg.lobbyName)) {
      socket.join(msg.lobbyName); // add user
      thisUser.lobby = msg.lobbyName;
      const spr = sManager.getSpriteByUserID(thisUser.id);
      if (spr === undefined) {
        console.log(
          "failed to find a user in sprites list with correct id after verifying user in connected list",
        );
        return;
      }
      socket.to(msg.lobbyName).emit("newUserMsg", { user: spr });

      sManager.populateLobbyResponseEvent(response, thisUser, msg.lobbyName);

      // all the users in the current lobby except this socket/user full data

      // const usersInLobby = sManager.connectedUsers.filter((user) =>
      //   user.lobby === msg.lobbyName && user.id !== thisUser.id
      // );

      // // Get only the ids of users in the lobby
      // const userIds = usersInLobby.map((user) => user.id);

      // // get all users in the lobby
      // sManager.spritesList.forEach((spr) => {
      //   if (userIds.includes(spr.user_id)) {
      //     response.allUsers.push(spr);
      //     if (spr.inGame) { // get users also in game but just the ids
      //       response.usersInGame.push(spr.user_id);
      //     }
      //   }
      // });
    } else {
      response.status = 404;
      response.joined = false;
    }

    socket.emit("lobbyJoinedMsg", response);
  });

  //sent by connected players to server containing game information
  socket.on("playerUpdateEvent", (msg) => {
    sManager.updateSpriteInList(msg);

    // can likely turn into function getUserRoom
    const user = sManager.getConnectedUserBySocketID(socket.id);
    if (!user) return;
    const { lobby } = user;
    // end func

    const usr = sManager.getSpriteByUserID(user.id);
    if (usr === undefined) {
      console.log("failed to fina sprite in sprites list given id", user.id);
      return;
    }
    socket.to(lobby).emit("globalPositionUpdateMsg", {
      id: usr.user_id,
      data: usr,
    });
  });

  // end pseudo except lines 215 and 216
  socket.on("fireProjectileEvent", (msg) => {
    console.log("user wants to fire projectile", msg);
    // verify some shit idk
    // projectiles.push(new projectile) IDK if we even need this 
    // given that we can properly verify that projectile stuff is valid
    // thats a bit tricky
    const user = sManager.getConnectedUserByID(msg.id);
    if (!user) return;
    socket.to(user.lobby).emit("newProjectileEvent", {
      position: {
        x: msg.position.x,
        y: msg.position.y,
      },
      velocity: msg.velocity,
    });
  });

  // sent when a player returns to the menu
  socket.on("playerLeftGameEvent", (msg) => {
    const user = sManager.getConnectedUserBySocketID(socket.id);
    if (!user) return;

    if (sManager.setUserInGame(false, user.id) == false) {
      console.log("Failed to find user in spr list to remove from game");
      return;
    }
    const { lobby } = user;
    socket.to(lobby).emit("userLeftGameMsg", { id: msg.id });
  });

  // sent when a player joins back into the game (playScene)
  socket.on("playerJoinedGameEvent", (msg) => {
    const user = sManager.getConnectedUserBySocketID(socket.id);
    if (!user) return;

    if (sManager.setUserInGame(true, user.id) == false) {
      console.log("Failed to find user in spr list to add to game");
      return;
    }

    const { lobby } = user;
    socket.to(lobby).emit("userJoinedGameMsg", {
      id: msg.id,
      texture: msg.texture,
    });
  });
});
