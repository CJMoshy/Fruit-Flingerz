import Phaser from "phaser"
import {io} from "socket.io-client"
// import World from "./scenes/World"
import Menu from "./scenes/Menu"
import Play from "./scenes/Play"
import Loader from "./scenes/Loader"
import {init_login_msg } from "./lib/Socket"


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
export const socket = io('http://localhost:3000')
socket.on("connect", () => {
    console.log('conncted')
})

interface Position {
    user_id: string;
    position: {
        x: number;
        y: number;
    }
}

export const users: Position[] = []

socket.on('login-response-msg', (msg) => {
    console.log(msg)
    for(const x of msg.pos){
        console.log(x)
        users.push(x)
    }
    console.log(users);
})

socket.on('new-user-msg', (msg) => {
    if(msg.user_id !== init_login_msg.username){
        users.push(msg)
    }
})

socket.on('global-position-update', (msg) => {
    const index = users.findIndex((e) => e.user_id === msg.data.user_id)
    users[index].position.x = msg.data.position.x;
    users[index].position.y = msg.data.position.y;
    console.log(users[index])
})

document.addEventListener('DOMContentLoaded', () => {
    const usernameField = document.getElementById('username-field') as HTMLInputElement
    // let passwordField = document.getElementById('password-field') as HTMLInputElement
    document.getElementById('login-btn')?.addEventListener("click", () => {
        init_login_msg.username = usernameField.value;
        if(usernameField.value !== ''){ // password not null
            socket.emit('login-msg', {username: init_login_msg.username, password: 'test'})
            const GAME: Phaser.Game = new Phaser.Game(CONFIG)
        } else console.log('no username or password')
    })
})