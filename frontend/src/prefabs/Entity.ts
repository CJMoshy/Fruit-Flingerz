
export default class Entity extends Phaser.Physics.Arcade.Sprite{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number = 0){
        super(scene, x, y, texture, frame)
    }
}