import { Server } from "socket.io"
import express from "express"
import { createServer } from "node:http"
import path from 'path'

const app = express()
const server = createServer(app)
const io = new Server(server) //* pass in custom url possible..

const distDir = path.join(__dirname, '..')

app.use(express.static(distDir))

app.get('/', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
})

io.on('connection', (socket) => { // this is the base connection to the server, from any client
    console.log('a user connected') // log it
    // io.emit('pong', { // we can send a global message back to them 
    // something here
    // })
    socket.on('login-msg', (msg) => { // we can listen for specific messgae types from the client 
        console.log(msg)
        socket.emit('cat message', 'pong') //we can send a message back to the specific user
    })
})

server.listen(3000, () => { // open up the server (node http) 
    console.log('server running')
})