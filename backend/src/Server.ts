import { Server } from "socket.io"
import { createServer } from "http"
import { app } from "./App"

export const server = createServer(app)

server.listen(3000, () => {
    console.log(`server running at http://localhost:3000`)
});

const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:5500'
    }
}) //* pass in custom url possible..

const users: User[] = [];
const global_user_positions: Position[] = []
// let usercount = 0
// const increment_user_count = () => {
//     usercount += 1
// }

io.on('connection', (socket) => { // this is the base connection to the server, from any client
    console.log('a user connected') // log it
    // users.push({id: usercount, socket: socket});
    // global_user_positions.push({
    //     user_id: usercount,
    //     position: {
    //         x: 0,
    //         y: 0,
    //     }
    // })
    // increment_user_count()
    
    socket.on('login-msg', (msg) => { // we can listen for specific messgae types from the client 
        users.push({id: msg.username, socket: socket});
        console.log(msg)
        const x = {
            user_id: msg.username,
            position: {
                x: 0,
                y: 0,
            }
        }
        global_user_positions.push(x)
        socket.emit('login-response-msg', {status: 200, pos: global_user_positions}) //we can send a message back to the specific user
        io.emit('new-user-msg', x)
        // send_msg();
    })

    const send_msg = (index: number) => {
        users.forEach((s: any) => {
            s.socket.emit('global-position-update', {data: global_user_positions[index]})
        })
    }

    socket.on('player-update-event', (msg) => {
        const index = global_user_positions.findIndex( (e) => e.user_id === msg.user_id)
        global_user_positions[index].position.x = msg.x;
        global_user_positions[index].position.y = msg.y;
        send_msg(index);
    })
})
