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
        origin: "http://127.0.0.1:5500",
    },
}); //* pass in custom url possible..
const users = [];
const global_user_information = [];
io.on("connection", (socket) => {
    console.log("a user connected"); // log it
    socket.on("login-msg", (msg) => {
        console.log(msg);
        if (users.findIndex((e) => e.id === msg.username) !== -1) {
            console.log("ok");
            socket.emit("login-response-msg", {
                status: 409,
                pos: global_user_information,
            });
        }
        else {
            users.push({ id: msg.username, socket: socket });
            const x = {
                user_id: msg.username,
                position: {
                    x: 0,
                    y: 0,
                },
                currentAnimation: undefined,
                currentTexture: undefined,
                flipX: false,
            };
            global_user_information.push(x);
            socket.emit("login-response-msg", {
                status: 200,
                pos: global_user_information,
            }); //we can send a message back to the specific user
            io.emit("new-user-msg", x);
        }
    });
    const send_msg = (index) => {
        users.forEach((s) => {
            s.socket.emit("global-position-update", {
                data: global_user_information[index],
            });
        });
    };
    socket.on("player-update-event", (msg) => {
        console.log(msg.currentTexture);
        const index = global_user_information.findIndex((e) => e.user_id === msg.user_id);
        global_user_information[index].position.x = msg.x;
        global_user_information[index].position.y = msg.y;
        global_user_information[index].currentAnimation = msg.currentAnimation;
        global_user_information[index].currentTexture = msg.currentTexture;
        global_user_information[index].flipX = msg.flipX;
        send_msg(index);
    });
});
