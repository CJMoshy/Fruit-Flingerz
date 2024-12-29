type UserID = string;

interface User {
  user_id: UserID;
  position: {
    x: number;
    y: number;
  };
  currentAnimation: string | undefined;
  currentTexture: string | undefined;
  flipX: boolean;
}

interface OtherSprites {
  user_id: UserID;
  entity: OpponentType;
}

interface Message {
  status?: number;
}

interface LoginMessage extends Message {
  username: string;
  password: string;
}

interface LoginResponseMessage extends Message {
  users: User[];
}

interface NewUserMessage extends Message {
  user: User;
}

interface UserDCMessage extends Message {
  id: UserID;
}

interface GlobalPositionUpdateMsg extends Message {
  id: UserID;
  data: User; // FIX THIS MAKE DATA TYPE AND PASS THAT
}

interface ServerToClientEvents {
  hello: () => void;
  newUserMsg: (msg: NewUserMessage) => void;
  globalPositionUpdateMsg: (msg: GlobalPositionUpdateMsg) => void;
  loginResponseMsg: (msg: LoginResponseMessage) => void;
  userDisconnectMsg: (msg: UserDCMessage) => void;
}

interface ClientToServerEvents {
  loginMsg: (msg: loginMsg) => void;
  playerUpdateEvent: (msg: User) => void;
}
