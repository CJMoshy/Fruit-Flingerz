"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const App_1 = require("./App");
exports.server = (0, http_1.createServer)(App_1.app);
exports.server.listen(3000, () => {
    console.log(`server running at http://localhost:3000`);
});
const io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: 'http://127.0.0.1:5500'
    }
}); //* pass in custom url possible..
const users = [];
const global_user_positions = [];
// let usercount = 0
// const increment_user_count = () => {
//     usercount += 1
// }
io.on('connection', (socket) => {
    console.log('a user connected'); // log it
    // users.push({id: usercount, socket: socket});
    // global_user_positions.push({
    //     user_id: usercount,
    //     position: {
    //         x: 0,
    //         y: 0,
    //     }
    // })
    // increment_user_count()
    socket.on('login-msg', (msg) => {
        users.push({ id: msg.username, socket: socket });
        console.log(msg);
        const x = {
            user_id: msg.username,
            position: {
                x: 0,
                y: 0,
            }
        };
        global_user_positions.push(x);
        socket.emit('login-response-msg', { status: 200, pos: global_user_positions }); //we can send a message back to the specific user
        io.emit('new-user-msg', x);
        // send_msg();
    });
    const send_msg = (index) => {
        users.forEach((s) => {
            s.socket.emit('global-position-update', { data: global_user_positions[index] });
        });
    };
    socket.on('player-update-event', (msg) => {
        const index = global_user_positions.findIndex((e) => e.user_id === msg.user_id);
        global_user_positions[index].position.x = msg.x;
        global_user_positions[index].position.y = msg.y;
        send_msg(index);
    });
});
