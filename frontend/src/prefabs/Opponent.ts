import Entity from "./Entity";

export default class Opponent extends Entity {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: CharacterModel,
    frame: number,
  ) {
    super(scene, x, y, texture, frame, "any", 0);
  }
}
