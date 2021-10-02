import {SocketConfig} from "../classes/Socket.config";

const Message = require('../api/models/message');

export class SocketHandlerService {
static encoderPayload = 'guru';
    static connectSocket = () => {
        SocketConfig.io.on('connection', (socket) => {
            console.log('Connected with a socket');
            SocketConfig.io.emit('welcome', 'hello guru1');
            socket.on('roomId', (data: any) => {
                //socket.emit('roomId', 'hello1');
                SocketHandlerService.getRoomId(data).then(async (info: any) => {
                    console.log(info.roomId);
                    await SocketHandlerService.joinRoom(socket, info, data,);
                    SocketHandlerService.emitMessage(socket, info.roomId, data);
                });
            });
            //SocketHandlerService.sendAllRecievedMessage(socket);
        });
    }

    private static getRoomId = (data: any) => {
        console.log(data.to + process.env.ROOM_ID_ADDON + data.from);
        return Message.find().or([{roomId: data.to + SocketHandlerService.encoderPayload + data.from.id}, {roomId: data.from.id + SocketHandlerService.encoderPayload + data.to}])
            .exec()
            .then((message: any) => {
                return message.length > 0 ? {
                    roomId: SocketHandlerService.encodeRoomId(message[0].roomId),
                    isFoundFromDb: true
                } : {roomId: data.from.id + process.env.ROOM_ID_ADDON + data.to, isFoundFromDb: false};
            }, () => {
                return {roomId: data.from.id + process.env.ROOM_ID_ADDON + data.to, isFoundFromDb: false};
            });
    }

    private static  encodeRoomId = (roomId: string) => {
        if(roomId.includes(SocketHandlerService.encoderPayload)) {
            const room = roomId.split(SocketHandlerService.encoderPayload);
            return room.length === 2 ? room[0] + process.env.ROOM_ID_ADDON + room[1] : '';
        }
        else {
            return  '';
        }
    }
    private static  decodeRoomId = (roomId: string) => {
        if(process.env.ROOM_ID_ADDON && roomId.includes(process.env.ROOM_ID_ADDON)) {
            const room = roomId.split(process.env.ROOM_ID_ADDON);
            return room.length === 2 ? room[0] + SocketHandlerService.encoderPayload + room[1] : '';
        }
        else {
            return  '';
        }
    }

    private static joinRoom(socket: any, info: any, data: any) {
        socket.join(info.roomId);
        if(data.message && data.message !== '') {
            const payload = {
                from: data.from,
                to: data.to,
                message: data.message,
                isRead: data.isRead,
                timeStamp: data.timeStamp,
                roomId: SocketHandlerService.decodeRoomId(info.roomId),
            };
            const message = new Message(payload);
            message.save().then().catch((err: any) => {
                console.log(err);
            });
        }
    }

    private static emitMessage(socket: any, roomId: any, data: any) {
        console.log(roomId, data);
        SocketConfig.io.to(roomId).emit('roomId', data);
    }

    private static sendAllRecievedMessage(socket: any) {
        const changeStream = Message.watch();
        // Message - Change
        changeStream.on('change', function (change: any) {
            console.log('COLLECTION CHANGED');
            Message.find({}, (err: any, data: any) => {
                if (err) throw err;
                if (data) {
                    // RESEND ALL MESSAGES
                    socket.on('askedForALlMessage', (payload: any) => {
                        const message = data.filter((e: { to: any; }) => e.to === payload.from);
                        SocketConfig.io.emit('askedForALlMessage', message);
                    });
                }
            });
        });

    }
}
