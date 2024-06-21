import playButton from '../../assets/img/buttons/Play.png'
import levelButton from '../../assets/img/buttons/Levels.png'
import tileset from '../../assets/tileset/Terrain.png'
import mapData from '../../assets/tileset/level_01.json'
import player1Idle from '../../assets/spritesheets/char01/char01_idle.png'
import player1Run from '../../assets/spritesheets/char01/char01_run.png'
import pinkBG from '../../assets/img/backgrounds/Pink.png'
import grayBG from '../../assets/img/backgrounds/Gray.png'
import blueBG from '../../assets/img/backgrounds/Blue.png'
import brownBG from '../../assets/img/backgrounds/Brown.png'
import greenBG from '../../assets/img/backgrounds/Green.png'
import purpleBG from '../../assets/img/backgrounds/Purple.png'
import yellowBG from '../../assets/img/backgrounds/Yellow.png'

export default class Loader extends Phaser.Scene{

    constructor(){
        super({key: 'loaderScene'})

    }


    init(): void{}

    preload(): void {
        //backgrounds
        this.load.image('BG-pink', pinkBG)

        //buttons
        this.load.image('playBtn', playButton)
        this.load.image('levelBtn', levelButton)

        //player
        this.load.spritesheet('player-01-idle', player1Idle, {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('player-01-run', player1Run, {frameWidth: 32, frameHeight: 32})

        //tilemap stuff, proboably move to loader scene...
        this.load.image('base-tileset', tileset)
        this.load.tilemapTiledJSON('tilemapJSON', mapData)
    }

    create(): void {
        this.anims.create({
            key: 'player01-idle',
            frames: this.anims.generateFrameNumbers('player-01-idle', {
                start: 0,
                end: 10
            }),
            frameRate: 20,
            repeat: -1
        })

        this.anims.create({
            key: 'player01-run',
            frames: this.anims.generateFrameNumbers('player-01-run', {
                start: 0,
                end: 11
            }),
            frameRate: 20,
            repeat: -1
        })

        this.scene.start('menuScene')
    }

    update(time: number, delta: number): void {
        
    }
}