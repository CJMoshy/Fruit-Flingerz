interface User_Position_Info {
  user_id: string;
  position: {
    x: number;
    y: number;
  };
  currentAnimation: string | undefined;
  currentTexture: string | undefined;
  flipX: boolean;
}

interface other_player {
  user_id: string;
  entity: Phaser.Physics.Arcade.Sprite;
}

interface login_msg {
  username: string;
  password: string;
}
