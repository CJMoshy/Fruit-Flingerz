import { Socket } from "socket.io";

declare global {
  type socket = Socket;
}
