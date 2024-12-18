interface User {
  id: string;
  socket: any; // socket.io socket
}

interface ClientInfo {
  user_id: string;
  user: {
    position: {
      x: number;
      y: number;
    };
    currentAnimation: string | undefined;
    currentTexture: string | undefined;
    flipX: boolean;
  }
}
