interface User {
  id: string;
  socket: any; // socket.io socket
}

interface User_Info {
  user_id: string;
  position: {
    x: number;
    y: number;
  };
  currentAnimation: string | undefined;
  currentTexture: string | undefined;
  flipX: boolean;
}
