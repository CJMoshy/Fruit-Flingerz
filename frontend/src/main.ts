import Phaser from "phaser"
// import {io} from "socket.io-client"
// import World from "./scenes/World"
import Menu from "./scenes/Menu"
import Play from "./scenes/Play"
import Loader from "./scenes/Loader"

export const CONFIG = {
    type: Phaser.CANVAS,
    parent: 'phaser-game',
    width: 800,
    height: 640,
    pixelArt: true,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    zoom: 1,
    scene: [Loader, Menu, Play]
}

export const loggedin: boolean = false

const GAME: Phaser.Game = new Phaser.Game(CONFIG)

// const socket = io('http://localhost:3000/')

// document.addEventListener('DOMContentLoaded', (e) => {
//     let usernameField = document.getElementById('username-field') as HTMLInputElement
//     let passwordField = document.getElementById('password-field') as HTMLInputElement
//     document.getElementById('login-btn')?.addEventListener("click", () => {
//         if(usernameField.value !== '' && passwordField.value !== ''){
//             // socket.emit('login-msg', {username: usernameField.value, password: passwordField.value})
//         } else console.log('no username or password')
//     })
// })