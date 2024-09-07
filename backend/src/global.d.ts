
interface User {
    id: string;
    socket: any // socket.io socket
}

interface Position {
    user_id: string;
    position: {
        x: number;
        y: number;
    }
}