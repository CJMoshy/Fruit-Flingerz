interface OtherSprites {
  user_id: UserID;
  entity: OpponentType;
}

type UserID = string;

interface PlayerMetadata {
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

interface LoginMessage extends Message {
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
  allUsers: PlayerMetadata[];
  usersInGame: UserID[];
}

interface NewUserMessage extends Message {
  user: PlayerMetadata;
}

interface UserDCMessage extends Message {
  id: UserID;
}

interface UserJoinedGameMsg extends Message {
  id: UserID;
  texture: string;
}

interface UserJoinedGameEventDetail {
  id: UserID;
}

interface GlobalPositionUpdateMsg extends Message {
  id: UserID;
  data: PlayerMetadata; // FIX THIS MAKE DATA TYPE AND PASS THAT
}

interface FireProjectileMsg extends Message {
  id: UserID;
  position: {
    x: number;
    y: number;
  };
  velocity: number;
}

interface PlayerElimMsg {
  byWho: UserID;
}

interface ElimLeaderMsg {
  leader: UserID;
}

interface ServerToClientEvents {
  newUserMsg: (msg: NewUserMessage) => void;
  lobbyCreatedMsg: (msg: CreateLobbyResponseMsg) => void;
  lobbyJoinedMsg: (msg: JoinLobbyResponseMessage) => void;
  globalPositionUpdateMsg: (msg: GlobalPositionUpdateMsg) => void;
  loginResponseMsg: (msg: LoginResponseMessage) => void;
  userDisconnectMsg: (msg: UserDCMessage) => void;
  userLeftGameMsg: (msg: UserDCMessage) => void;
  userJoinedGameMsg: (msg: UserJoinedGameMsg) => void;
  newProjectileEvent: (msg: FireProjectileMsg) => void;
  elimLeaderEvent: (msg: ElimLeaderMsg) => void;
}

interface ClientToServerEvents {
  loginEvent: (msg: LoginMessage) => void;
  createLobbyEvent: (msg: CreateLobbyMessage) => void;
  joinLobbyEvent: (msg: JoinLobbyMessage) => void;
  playerUpdateEvent: (msg: PlayerMetadata) => void;
  playerLeftGameEvent: (msg: UserDCMessage) => void;
  playerJoinedGameEvent: (msg: UserJoinedGameMsg) => void;
  fireProjectileEvent: (msg: FireProjectileMsg) => void;
  playerEliminatedEvent: (msd: PlayerElimMsg) => void;
}
