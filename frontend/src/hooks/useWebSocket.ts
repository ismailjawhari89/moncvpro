
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export function useWebSocket() {
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        const socket: Socket = io(apiUrl, {
            auth: {
                token: typeof window !== 'undefined' ? localStorage.getItem('token') : null
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.on('connect', () => {
            console.log('WebSocket connected to server');
        });

        socket.on('pdf-generation-progress', (data) => {
            console.log(`PDF progress: ${data.progress}%`);
            // In a real implementation, you would use a global state (Zustand/Redux) 
            // or a callback to update the UI
        });

        socket.on('pdf-ready', (data) => {
            console.log('PDF is ready!', data);
            // Show download notification
        });

        socket.on('ai-suggestions-ready', (data) => {
            console.log('AI suggestions ready:', data);
            // Update suggestions in UI
        });

        socket.on('notification', (data) => {
            console.log('New notification:', data);
        });

        socket.on('error', (err) => {
            console.error('WebSocket error:', err);
        });

        return () => {
            console.log('Disconnecting WebSocket');
            socket.disconnect();
        };
    }, []);
}
