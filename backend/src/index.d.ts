interface ConnectedUser {
  id: string;
  socket: any; // socket.io socket
}

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

interface Message {
  status?: number;
}

interface LoginMesssage extends Message {
  username: string;
  password: string;
}

interface LoginResponseMessage extends Message {
  users: User[];
}

interface NewUserMessage extends Message {
  user: User;
}

interface GlobalPositionUpdateMsg extends Message {
  id: UserID;
  data: User; // FIX THIS MAKE DATA TYPE AND PASS THAT
}

interface ServerToClientEvents {
  hello: () => void;
  newUserMsg: (msg: NewUserMessage) => void;
  globalPositionUpdateMsg: (msg: GlobalPositionUpdateMsg) => void;
  loginResponseMsg: (msg: Message | LoginResponseMessage) => void;
}

interface ClientToServerEvents {
  loginMsg: (msg: loginMsg) => void;
  playerUpdateEvent: (msg: User) => void;
}
