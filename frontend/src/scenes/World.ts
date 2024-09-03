import Player from "../prefabs/Player"

export default class World extends Phaser.Scene{

    private player: Player | null = null

    constructor(){
        super({key: 'worldScene'})
    }

    init(): void{

    }

    preload(): void{

    }

    create(): void{
        this.player = new Player(this, 100, 100, 'a', 0, undefined, 2)
    }

    update(time: number, delta: number): void {
        
    }
}