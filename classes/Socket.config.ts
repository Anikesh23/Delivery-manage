import {Socket} from "socket.io";

export class SocketConfig{
    public static io: Socket;

    static initSocket = (server: any) => {
        SocketConfig.io = require('socket.io')(server, {
            cors: {
                origin: '*'
            }
        })
        return SocketConfig.io;
    }
}
