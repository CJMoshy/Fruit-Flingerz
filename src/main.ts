import Phaser, { Scale } from "phaser";
import World from "./scenes/World"

export const CONFIG = {
    type: Phaser.CANVAS,
    parent: 'phaser-game',
    width: 800,
    height: 600,
    pixelArt: true,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
        }
    },
    zoom: 1,
    scene: [World]
}

export let loggedin: boolean = false


const GAME: Phaser.Game = new Phaser.Game(CONFIG)

document.addEventListener('DOMContentLoaded', (e) => {
    let usernameField = document.getElementById('username-field') as HTMLInputElement
    let passwordField = document.getElementById('password-field') as HTMLInputElement
    document.getElementById('login-btn')?.addEventListener("click", () => {
        usernameField.value === '' ? console.log('no username') : console.log(usernameField.value)
        passwordField.value === '' ? console.log('no password') : console.log(passwordField.value)
    })
})