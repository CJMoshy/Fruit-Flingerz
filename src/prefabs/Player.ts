export default class Player extends Phaser.Physics.Arcade.Sprite {

    name: string
    health: number

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number, _name: string = 'player', _hitPoints: number = 10){
        super(scene, x, y, texture, frame)

        this.name = _name
        this.health = _hitPoints
    }
    /****properties**********/

    //     //phaser stuff
    //     this.setScale(1.65)

    //     //derived
    //     this.HEALTH_BAR.setScrollFactor(0).setDepth(3)
    //     this.HEALTH_BAR.width = 150

    //     //sprinting
    //     this.isSprinting = false
    //     this.SPRINT_INTERVAL_ID = undefined
    //     this.STAMINA_BAR = scene.add.graphics().setScrollFactor(0).setAlpha(1).setDepth(3)
    //     this.STAMINA_BAR.width = 150
    //     this.stamina = 5
    //     this.stamina_log = this.stamina

    //     //inventory
    //     this.p1Inventory = new Inventory(inv)

    //     //tracks if player has a window open
    //     this.windowOpen = false 
        
    //     /**
    //      * current window -> holds data on game objests that exist if a window is open -> so we can reset windows if we die in wierd situations...
    //      * @param {Array[Phaser.GameObjects]} objs an array of phaser gameobjs in refrence to open window
    //      * @param {Inventory.active} array specific to this project, for the inventory manager
    //      */
    //     this.currentWindow = {
    //         objs: undefined,
    //         array: undefined
    //     }
    
    //     //walking noise
    //     this.walk_noise = scene.sound.add('walking', {rate: 1.5, volume: 0.25})
    //     this.attack_noise_light_hit = scene.sound.add('attack-light-hit', {volume: 0.05})
    //     this.attack_noise_heavy_hit = scene.sound.add('attack-heavy-hit', {volume: 0.05, rate: 1.2})
    //     this.water_noise = scene.sound.add('in-water', {volume: 0.5})

    //     //visual quest text:
    //     this.questTrackerTxtTitle = scene.add.bitmapText(game.config.width/6 + 10,game.config.height - 200,'8-bit-white', "Current Quest: ", 32).setAlpha(0).setOrigin(0).setScrollFactor(0,0)
    //     this.questTrackerTxtBody = scene.add.bitmapText(game.config.width/6 + 15, game.config.height - 170, 'pixel-white', "nil", 10).setAlpha(0).setOrigin(0).setScrollFactor(0,0)
       
    //     //quest tracker 
    //     qobj === undefined ?
    //     this.questStatus = {
    //         number : 0,
    //         finished: true,
    //         currentQuest: undefined, // this holds quest obj
    //         completedQuests: [] // unused as of right now...
    //     } :
    //     this.questStatus = qobj

    //     //combat listener obj
    //     this.pkg = {
    //         attack_type : undefined,
    //         isAttacking : false,
    //         attackCooldown : false,
    //         dmg : 0,
    //     }

    //     //state machines
    //     this.animsFSM = new StateMachine('idle', {
    //         idle: new idlePlayerState(),
    //         moving: new movingState(),
    //         interacting: new interactionPlayerState(),
    //         swim: new inWaterPlayerState(),
    //         attack: new attackPlayerState(),
    //         dead: new deadPlayerState(),
    //         gamePause: new gamePausePlayerState()
    //     }, [scene, this])

    //     //swimming!
    //     scene.physics.add.overlap(this, scene.ponds, ()=>{
    //         if(this.animsFSM.state !== 'swim' && this.animsFSM.state !== 'dead' && this.animsFSM.state !== 'gamePause'){
    //             scene.sound.stopAll()
    //             this.animsFSM.transition('swim')
    //         }
    //     })

    //     //collide with npc
    //     scene.physics.add.collider(this, scene.n1,undefined,undefined)

    //     //input
    //     keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    //     keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    //     keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    //     keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    //     keyAttackLight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
    //     keyAttackHeavy = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
    //     keyInventory = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB).on('down', ()=>{ 
    //         if(this.animsFSM.state !== 'swim'){
    //             if(this.p1Inventory.isOpen === false && this.windowOpen === false){
    //                 this.windowOpen = true
    //                 this.p1Inventory.openInventoryWindow(scene, this)
    //                 this.animsFSM.transition('interacting')
    //             } else if (this.p1Inventory.isOpen === true){
    //                 this.checkWindow()
    //                 this.animsFSM.transition('idle')
    //             }
    //         }
    //     })
    //     keySprint = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT).on('down', ()=>{
    //         if(this.animsFSM.state !== 'idle' && this.animsFSM.state !== 'swim' && this.animsFSM.state !== 'interacting'){
    //             this.isSprinting = !this.isSprinting 
    //             if(this.isSprinting){
    //                 clearInterval(this.SPRINT_INTERVAL_ID)
    //                 this.VELOCITY = 175
    //                 this.SPRINT_INTERVAL_ID = setInterval(()=>{
    //                     if(this.stamina <= 0){
    //                         //console.log('stamina empty, sprint done')
    //                         this.VELOCITY = 100
    //                         clearInterval(this.SPRINT_INTERVAL_ID)
    //                     } else{
    //                         //console.log('stamina -- ', this.stamina)
    //                         this.stamina -= 0.025
    //                     }
    //                 }, 50)
    //             } else {
    //                 clearInterval(this.SPRINT_INTERVAL_ID)
    //                 this.SPRINT_INTERVAL_ID = setInterval(()=>{
    //                     if(this.stamina >= 5){
    //                         //console.log('stamina refil done ')
    //                         clearInterval(this.SPRINT_INTERVAL_ID)
    //                     }else{
    //                         //console.log('stamina refil, ', this.stamina)
    //                         this.stamina += 0.025
    //                     }
    //                 }, 50)
    //                 this.VELOCITY = 100
    //             }
    //         }
    //     })
    // }

    // update(){
    //     if(this.HIT_POINTS <= 0 && this.animsFSM.state !== 'dead'){
    //         this.animsFSM.transition('dead')
    //     }
    //     if(this.isAlive){
    //         this.updateHealthBar()
    //         this.updateStaminaBar()
    //         this.displayCurrentQuests()
    //         this.animsFSM.step() 
    //     } 
    // }

}


