type UserID = string;
interface OtherUser {
  position: {
    x: number;
    y: number;
  };
  currentAnimation: string | undefined;
  currentTexture: string | undefined;
  flipX: boolean;
}

interface otherSprites {
  user_id: string;
  entity: Phaser.Physics.Arcade.Sprite;
}

interface loginMsg {
  username: string;
  password: string;
}
