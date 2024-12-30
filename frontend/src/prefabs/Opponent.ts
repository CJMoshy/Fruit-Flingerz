import Entity from "./Entity";

export default class Opponent extends Entity {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: CharacterModel,
    frame: number,
    name?: string,
  ) {
    super(scene, x, y, texture, frame, name ? name : "any", 0);
    scene.events.on("update", this.update, this);
  }

  update(...args: any[]): void {
    super.update();
  }
}
