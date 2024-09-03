export default class Menu extends Phaser.Scene{

    LEVELPADDING: number

    constructor(){
        super({key: 'menuScene'})

        this.LEVELPADDING = 100
    }


    init(): void{}

    preload(): void {
    }

    create(): void {
        this.add.image((this.sys.canvas.width/2) - this.LEVELPADDING, this.sys.canvas.height/2, 'playBtn', 0).setInteractive().on('pointerdown', () => {
            console.log('click on play btn')
            this.scene.start('playScene')
        })
        this.add.image((this.sys.canvas.width/2) + this.LEVELPADDING, this.sys.canvas.height/2, 'levelBtn', 0).setInteractive().on('pointerdown', () => {
            console.log('click on level btn')
        })
    }

    // update(time: number, delta: number): void {
        
    // }
}