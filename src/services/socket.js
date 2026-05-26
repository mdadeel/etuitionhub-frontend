import { io } from 'socket.io-client';
import API_URL from '../config/api';

// NOTE: Socket.IO only works on non-serverless hosts (Railway, Render, etc.)
// On Vercel, ChatContext detects the vercel domain and skips socket init entirely.
// This file is used by components on non-Vercel hosts only.
const socket = io(API_URL, {
    autoConnect: false,
    withCredentials: true,
    // Start with polling — works on more platforms; upgrades to WS if supported
    transports: ['polling', 'websocket'],
    reconnectionAttempts: 3,
    timeout: 5000,
});

export const connectSocket = (token) => {
    if (socket.connected) return;
    socket.auth = { token };
    socket.connect();
};

export const disconnectSocket = () => {
    if (!socket.connected) return;
    socket.disconnect();
};

export default socket;
