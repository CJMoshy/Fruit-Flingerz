import { Server } from "socket.io";
import { createServer } from "node:http";
import { app } from "./App";
import ServerManager from "../lib/ServerManager";

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
  socket.on("loginEvent", (msg) => {
    // check if a user with the same username already exists in the list of current users
    if (sManager.getConnectedUserByID(msg.username) !== undefined) {
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
    const userToDisconnect = sManager.getConnectedUserBySocketID(
      socket.id,
    );

    // prob dont need this
    if (userToDisconnect === undefined) {
      console.log(
        "failed to find user in connected users arr with socket that just disconnected from server",
      );
      return;
    }

    if (sManager.removeConnectedUser(userToDisconnect.id) === undefined) {
      return;
    }
    // find the users sprite in the sprite list
    sManager.removeUserFromSpritesList(userToDisconnect.id);
    sManager.removePlayerFromLobbyElimTracker(
      userToDisconnect.lobby,
      userToDisconnect.id,
    );

    io.emit("userDisconnectMsg", { id: userToDisconnect.id }); // should only get sent if the server can verify the user existed
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
      sManager.registerLobbyToElimTracker(msg.lobbyName);
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
      sManager.addPlayerToLobbyElimTracker(msg.lobbyName, thisUser.id);
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

    const usr = sManager.getSpriteByUserID(user.id);
    if (usr === undefined) {
      console.log("failed to find sprite in sprites list given id", user.id);
      return;
    }
    socket.to(lobby).emit("globalPositionUpdateMsg", {
      id: usr.user_id,
      data: usr,
    });
  });

  // when players launch projectiles this comes in
  socket.on("fireProjectileEvent", (msg) => {
    // given that we can properly verify that projectile stuff is valid then allow below to execute
    if (msg.velocity > 500) {
      console.log("trying to fire projectile at an increased speed");
      return;
    }
    const user = sManager.getConnectedUserByID(msg.id);
    if (!user) return;

    socket.to(user.lobby).emit("newProjectileEvent", msg);
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

  // player gets eliminated
  socket.on("playerEliminatedEvent", (msg) => {
    const eliminatedPlayer = sManager.getConnectedUserBySocketID(socket.id);
    const terminator = sManager.getConnectedUserByID(msg.byWho);
    if (eliminatedPlayer === undefined || terminator === undefined) {
      console.log("might have a hacker or something");
      return;
    }
    sManager.updatePlayersElimCount(terminator.lobby, terminator.id);
    const leader = sManager.getElimLeader(terminator.lobby);
    if (!leader) return;
    io.to(terminator.lobby).emit("elimLeaderEvent", { leader: leader }); // send new elim leader to lobby
  });
});
