
import { Server, Socket } from "socket.io";
import http from 'http';

class SocketManager {
    private static io: Server | null = null;

    static setupSocketIO(server: http.Server): Server {
        if (!SocketManager.io) {
            SocketManager.io = new Server(server, {
                path: '/razorpay/socket.io',
                cors: {
                    origin: '*',
                },
            });

            SocketManager.io.on('connection', (socket: Socket) => {
                SocketManager.onSocketConnection(SocketManager.io!, socket); 
            });
        }

        return SocketManager.io;
    }

    private static onSocketConnection(io: Server, socket: Socket) {
        console.log('User connected');    
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    }

    static getSocketIO(): Server {
        if (!SocketManager.io) {
            throw new Error('Socket.io not initialized. Call setupSocketIO first.');
        }
        return SocketManager.io;
    }
}

export default SocketManager;