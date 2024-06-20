"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const distDir = path_1.default.join(__dirname, '..');
app.use(express_1.default.static(distDir));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(distDir, 'index.html'));
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('login-msg', (msg) => {
        console.log(msg);
        socket.emit('cat message', 'pong');
    });
});
server.listen(3000, () => {
    console.log('server running');
});
