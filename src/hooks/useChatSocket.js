import { useState, useEffect, useRef } from 'react';
import { getSocket } from './useSocketEvents';

const useChatSocket = (user, dbUser, fetchConversations) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [typingUsers, setTypingUsers] = useState(new Set());
    const socketRef = useRef(null);

    // Poll online status every 30s — Vercel-only fallback
    useEffect(() => {
        if (!user) return;
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        if (!backendUrl.includes('vercel')) return;
        const fetchOnline = async () => {
            try {
                const res = await import('../services/api').then(m => m.default.get('/api/users/online'));
                const ids = res.data.online.map(u => u._id.toString());
                setOnlineUsers(new Set(ids));
            } catch {
                // Silently fail — online status is non-critical UX
            }
        };
        fetchOnline();
        const interval = setInterval(fetchOnline, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Reuse the existing socket from useSocketEvents instead of creating a duplicate
    useEffect(() => {
        if (!user) return;

        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        if (backendUrl.includes('vercel')) return;

        const existingSocket = getSocket();
        if (!existingSocket) return;

        socketRef.current = existingSocket;
        setSocket(existingSocket);

        const onTyping = (data) => {
            const key = `${data.room}_${data.senderId}`;
            setTypingUsers(prev => new Set([...prev, key]));
        };
        const onStopTyping = (data) => {
            const key = `${data.room}_${data.senderId}`;
            setTypingUsers(prev => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        };
        const onChatMessage = (data) => {
            window.dispatchEvent(new CustomEvent('chat:message-received', { detail: data }));
        };
        const onMessagesRead = () => {
            fetchConversations();
        };

        existingSocket.on('typing', onTyping);
        existingSocket.on('stop-typing', onStopTyping);
        existingSocket.on('chat-message', onChatMessage);
        existingSocket.on('messages-read', onMessagesRead);

        return () => {
            existingSocket.off('typing', onTyping);
            existingSocket.off('stop-typing', onStopTyping);
            existingSocket.off('chat-message', onChatMessage);
            existingSocket.off('messages-read', onMessagesRead);
            socketRef.current = null;
            setSocket(null);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return { socket, socketRef, onlineUsers, typingUsers };
};

export const reconnectChatSocket = () => {
    const s = getSocket();
    if (s) s.connect();
};

export default useChatSocket;
