import Player from "../prefabs/Player"
import { users } from "../main"
import { init_login_msg } from "../lib/Socket"

type other_user = {
    user_id: string;
    entity: Phaser.Physics.Arcade.Sprite
}

export default class Play extends Phaser.Scene {

    private player: Player | null = null
    playScreen: any

    private users_length: number |  null = null
    private other_users: other_user[] | null = null

    constructor() {
        super({ key: 'playScene' })
    }

    init(): void {
        this.users_length = users.length
        this.other_users = []
    }

    preload(): void {

    }

    create(): void {

        users.forEach((u) => {
            // this.add.sprite(u.position.x, u.position.y, 'player-01-idle', 0)
            if(u.user_id !== init_login_msg.username){
                this.other_users?.push({user_id: u.user_id, entity: this.physics.add.sprite(100, 100, 'player-01-idle', 0)})
            }
            // this.other_users?.push({user_id: u.user_id, entity: this.physics.add.sprite(100, 100, 'player-01-idle', 0)})
        })
        //load backgorund
        if (this.textures.exists('BG-pink')) {
            this.playScreen = this.add.tileSprite(0, 0, 800, 640, 'BG-pink').setOrigin(0)
        }

        const map = this.add.tilemap('tilemapJSON')
        const tileset = map.addTilesetImage('Terrain', 'base-tileset') as Phaser.Tilemaps.Tileset
        const collisionLayer = map.createLayer('collideLayer', tileset) as Phaser.Tilemaps.TilemapLayer
        collisionLayer.setCollisionByProperty({ collides: true })

        this.player = new Player(this, 100, 100, 'player-01-idle', 0, undefined, 2)

        this.physics.add.collider(this.player, collisionLayer, () => {
            if(this.player !== null){
                this.player.setVelocity(0)
                if(this.player.body?.blocked.down === true){
                    this.player.isJumping = false
                    this.player.jumpCount = 0
                }
            }
        })

        this.updateUsers();
    }

    update(): void {
        if(this.users_length !== users.length){
            this.addUser()
            this.users_length = users.length;
        }
        this.playScreen.tilePositionY += 1
        this.player?.update()
        this.updateUsers()
    }

    addUser(): void {
        const us = users[users.length - 1]
        // this.add.sprite(us.position.x, us.position.y, 'player-01-idle', 0)
        const e = this.physics.add.sprite(100, 100, 'player-01-idle', 0)
        this.other_users?.push({
            user_id: us.user_id, 
            entity: e
        })
        // console.log(this.other_users);
    }

    updateUsers(): void {
        for (const us of this.other_users as other_user[]){  
                const xIndex = users[users.findIndex((e) => e.user_id === us.user_id)].position.x
                const yIndex = users[users.findIndex((e) => e.user_id === us.user_id)].position.y
                us.entity.setX(xIndex)
                us.entity.setY(yIndex)
            }
    }
}