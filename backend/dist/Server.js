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
        origin: "http://localhost:5173",
    },
}); //* pass in custom url possible..
const users = [];
const globalUsersList = [];
/**
 * @param msgName the name/type of message to send
 * @param msg the message object containg the data
 */
function send_msg(msgName, msg) {
    users.forEach((user) => {
        user.socket.emit(msgName, msg);
    });
}
// base connection to the server, from any client
io.on("connection", (socket) => {
    console.log("a user connected");
    // listen for specific messgae types from the client
    socket.on("loginMsg", (msg) => {
        console.log(msg);
        // check if a user with the same username already exists in the list of current users
        if (users.findIndex((e) => e.id === msg.username) !== -1) {
            console.log("A user tried to join that already exists");
            socket.emit("loginResponseMsg", {
                status: 409,
            });
        }
        else { // new user
            users.push({ id: msg.username, socket: socket });
            const newUserToken = {
                user_id: msg.username,
                position: {
                    x: 0,
                    y: 0,
                },
                currentAnimation: undefined,
                currentTexture: undefined,
                flipX: false,
            };
            // add it to server list
            globalUsersList.push(newUserToken);
            console.log(globalUsersList);
            // send a message back to the specific user
            socket.emit("loginResponseMsg", {
                status: 200,
                users: globalUsersList,
            });
            // notify all connected users about the new user
            io.emit("newUserMsg", { user: newUserToken });
        }
    });
    socket.on("playerUpdateEvent", (msg) => {
        const index = globalUsersList.findIndex((e) => e.user_id === msg.user_id);
        globalUsersList[index].position.x = msg.position.x;
        globalUsersList[index].position.y = msg.position.y;
        globalUsersList[index].currentAnimation = msg.currentAnimation;
        globalUsersList[index].currentTexture = msg.currentTexture;
        globalUsersList[index].flipX = msg.flipX;
        send_msg("globalPositionUpdateMsg", {
            id: globalUsersList[index].user_id,
            data: globalUsersList[index],
        });
    });
});
