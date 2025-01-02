interface ConnectedUser {
  id: string;
  socket: socket;
  lobby: string | "none";
}

type UserID = string;

interface User {
  user_id: UserID;
  inGame: boolean;
  position: {
    x: number;
    y: number;
  };
  currentAnimation: string | undefined;
  currentTexture: string | undefined;
  flipX: boolean;
}

interface Message {
  status?: number;
}

interface LoginMesssage extends Message {
  username: string;
  password: string;
}

interface CreateLobbyMessage extends Message {
  lobbyName: string;
}

interface JoinLobbyMessage extends Message {
  lobbyName: string;
}

interface CreateLobbyResponseMsg extends Message {
  created: boolean;
}

interface JoinLobbyResponseMessage extends Message {
  joined: boolean;
  allUsers: User[];
  usersInGame: UserID[];
}

interface NewUserMessage extends Message {
  user: User;
}

interface UserDCMessage extends Message {
  id: UserID;
}

interface UserJoinedGameMsg extends Message {
  id: UserID;
  texture: string;
}

interface GlobalPositionUpdateMsg extends Message {
  id: UserID;
  data: User; // FIX THIS MAKE DATA TYPE AND PASS THAT
}

interface ServerToClientEvents {
  newUserMsg: (msg: NewUserMessage) => void;
  lobbyCreatedMsg: (msg: CreateLobbyResponseMsg) => void;
  lobbyJoinedMsg: (msg: JoinLobbyResponseMessage) => void;
  globalPositionUpdateMsg: (msg: GlobalPositionUpdateMsg) => void;
  loginResponseMsg: (msg: Message) => void;
  userDisconnectMsg: (msg: UserDCMessage) => void;
  userLeftGameMsg: (msg: UserDCMessage) => void;
  userJoinedGameMsg: (msg: UserJoinedGameMsg) => void;
}

interface ClientToServerEvents {
  loginMsg: (msg: loginMsg) => void;
  createLobbyEvent: (msg: CreateLobbyMessage) => void;
  joinLobbyEvent: (msg: JoinLobbyMessage) => void;
  playerUpdateEvent: (msg: User) => void;
  playerLeftGameEvent: (msg: UserDCMessage) => void;
  playerJoinedGameEvent: (msg: UserJoinedGameMsg) => void;
}
