import { io, Socket } from "socket.io-client";

import { connectionManager } from "../main.ts";

export const loginMsg: LoginMessage = {
  username: "",
  password: "",
};

const URL = "http://localhost:3000";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
);

socket.on("connect", () => {
  console.log("conncted");
  document.dispatchEvent(new Event("connected"));
});

socket.on("connect_error", (err) => {
  console.error("error connecting", err);
  alert("World Server Down! Refresh page to initiate new connection to server");
  socket.disconnect();
});

socket.on("loginResponseMsg", (msg) => {
  if (msg.status === 409) {
    alert("Error Logging In. A user with this name already exists");
    console.error("Error Logging In. A user with this name already exists");
    return;
  }
  document.dispatchEvent(new Event("connectionSuccess"));
});

socket.on("newUserMsg", (msg) => {
  console.log("new user message", msg);
  if (msg.user.user_id === loginMsg.username) {
    console.log("new user message id is same");
    return;
  }
  connectionManager.addUser(msg.user.user_id, msg.user);
});

socket.on("userDisconnectMsg", (msg) => {
  console.log("user disconnected from the server");
  connectionManager.removeUser(msg.id);
});

socket.on("globalPositionUpdateMsg", (msg) => {
  if (msg.id === loginMsg.username) {
    console.log("update message id is same");
    return;
  }
  connectionManager.updateUser(msg.id, msg.data, false);
});

socket.on("userJoinedGameMsg", (msg) => {
  console.log("user join msg", msg);
  connectionManager.addPlayerInGame(msg.id);
  connectionManager.updateUser(msg.id, msg.texture, true);
  document.dispatchEvent(new CustomEvent("userJoinedGame", { detail: msg.id }));
});

socket.on("userLeftGameMsg", (msg) => {
  console.log(`user ${msg.id} left the game!`);
  connectionManager.removePlayerInGame(msg.id);
  connectionManager.removeUserFromSpritePool(msg.id);
});

socket.on("lobbyCreatedMsg", (msg) => {
  if (msg.created) {
    console.log("lobby created success, connected to lobby");
    document.dispatchEvent(new Event("lobbySuccessEvent"));
  } else {
    let message = "";
    if (msg.status === 409) {
      message = "Error creating lobby. lobby with this name exists";
    } else {
      message = "An unexpected error occoured (LOBBY:1)";
    }
    alert(message);
  }
});

socket.on("lobbyJoinedMsg", (msg) => {
  if (msg.joined) {
    msg.allUsers.forEach((user) => {
      connectionManager.addUser(user.user_id, user);
    });
    msg.usersInGame.forEach((id) => {
      connectionManager.addPlayerInGame(id);
    });
    document.dispatchEvent(new Event("lobbySuccessEvent"));
  } else {
    let message = "";
    if (msg.status === 404) {
      message = "Error joining lobby. lobby not found";
    } else {
      message = "An unexpected error occoured (LOBBY:2)";
    }
    alert(message);
  }
});

/**
 * used to ping the server with in game data
 * @param userData standard user object describing data relative to current game state
 */
export function sendUpdateEvent(userData: User) {
  socket.emit("playerUpdateEvent", userData);
}

export function logUserIn(loginMsg: LoginMessage) {
  socket.emit("loginMsg", loginMsg);
}

export function createLobby(lobbyName: string) {
  socket.emit("createLobbyEvent", { lobbyName: lobbyName });
}

export function joinLobby(lobbyName: string) {
  socket.emit("joinLobbyEvent", { lobbyName: lobbyName }); // can simplify to just lobby name
}

export function joinScene(id: UserID, texture: string = "appearing-anim") {
  if (id === "") {
    console.error("user name is empty");
    return;
  }
  socket.emit("playerJoinedGameEvent", {
    id: id,
    texture: texture,
  });
}

export function exitScene(id: UserID) {
  socket.emit("playerLeftGameEvent", { id: id });
}

export function disconnectFromServer() {
  socket.disconnect();
}

export function connectToServer() {
  socket.connect();
}

export function isSocketConnected(): boolean {
  return socket.connected;
}
