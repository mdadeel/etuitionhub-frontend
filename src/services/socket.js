import { io } from 'socket.io-client';
import API_URL from '../config/api';

const socket = io(API_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling'],
});

export const connectSocket = (userId) => {
    if (socket.connected) return;
    socket.auth = { userId };
    socket.connect();
};

export const disconnectSocket = () => {
    if (!socket.connected) return;
    socket.disconnect();
};

export default socket;
