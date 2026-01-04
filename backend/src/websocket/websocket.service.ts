
import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

/**
 * Mock authentication middleware for WebSocket
 */
const authenticateSocket = (socket: any, next: (err?: Error) => void) => {
    const token = socket.handshake.auth?.token;

    // In a real app, verify the JWT here
    // For demo, we'll assume the token contains the userId or just mock it
    if (token) {
        socket.data.userId = 'user_123'; // Mock user ID
        return next();
    }

    // Allow connections for now but log error
    console.log('WebSocket connection without auth token');
    socket.data.userId = 'guest';
    return next();
};

export function setupWebSocket(httpServer: HttpServer) {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    io.use(authenticateSocket);

    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        console.log(`User connected: ${userId} (${socket.id})`);

        // Join room for this user to allow targeted notifications
        socket.join(`user:${userId}`);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId} (${socket.id})`);
        });
    });

    return io;
}

/**
 * Emit events to a specific user
 */
export function notifyUser(userId: string, event: string, data: any) {
    if (!io) {
        console.warn('Socket.io server not initialized');
        return;
    }
    console.log(`[WebSocket] Notifying user:${userId} event:${event}`);
    io.to(`user:${userId}`).emit(event, data);
}

/**
 * Emit progress to a specific user
 */
export function emitProgress(userId: string, type: string, progress: number) {
    notifyUser(userId, `${type}-progress`, { progress });
}
