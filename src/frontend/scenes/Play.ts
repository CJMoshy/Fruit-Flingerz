import Player from "../prefabs/Player"

export default class Play extends Phaser.Scene {

    private player: Player | null = null
    playScreen: any

    constructor() {
        super({ key: 'playScene' })
    }

    init(): void {

    }

    preload(): void {

    }

    create(): void {

        //load backgorund
        if (this.textures.exists('BG-pink')) {
            this.playScreen = this.add.tileSprite(0, 0, 800, 640, 'BG-pink').setOrigin(0)
        }

        const map = this.add.tilemap('tilemapJSON')
        const tileset = map.addTilesetImage('Terrain', 'base-tileset') as Phaser.Tilemaps.Tileset
        const collisionLayer = map.createLayer('collideLayer', tileset) as Phaser.Tilemaps.TilemapLayer
        collisionLayer.setCollisionByProperty({ collides: true })

        this.player = new Player(this, 100, 100, 'player-01-idle', 0, undefined, 2)

        this.physics.add.collider(this.player, collisionLayer)
    }

    update(time: number, delta: number): void {
        this.playScreen.tilePositionY += 1
        this.player?.update()
    }
}