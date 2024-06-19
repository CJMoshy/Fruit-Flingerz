import Phaser from "phaser";
import World from "./scenes/World"

export const CONFIG = {
    type: Phaser.CANVAS,
    parent: 'phaser-game',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
        }
    },
    zoom: 1,
    scene: [World]
}

const GAME: Phaser.Game = new Phaser.Game(CONFIG)