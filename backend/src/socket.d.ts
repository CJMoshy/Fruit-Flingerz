import { Server, Socket } from "socket.io";

declare global {
  type socket = Socket;
  type sioServer = Server;
}
