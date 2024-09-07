"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("../Server");
Server_1.io.on('connection', (socket) => {
    console.log('a user connected'); // log it
    Server_1.io.emit('pong' // we can send a global message back to them 
    // something here
    );
    socket.on('login-msg', (msg) => {
        console.log(msg);
        socket.emit('login-response-msg', { status: 200 }); //we can send a message back to the specific user
    });
});
