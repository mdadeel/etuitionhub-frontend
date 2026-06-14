import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let moduleSocketRef = null;

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

    // Initialize Socket
    useEffect(() => {
        if (!user) return;
        // Don't create a duplicate socket if one is already connected
        if (socketRef.current?.connected) return;

        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        // NOTE: WebSockets do NOT work on Vercel (serverless functions don't support
        // persistent connections). Online status uses REST polling instead (above).
        // Real-time chat (messages, typing) requires a persistent host (Railway/Render).
        if (backendUrl.includes('vercel')) {
            return;
        }

        const s = io(backendUrl, {
            withCredentials: true,
            transports: ['polling', 'websocket'],
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
            timeout: 5000,
        });
        socketRef.current = s;
        moduleSocketRef = s;

        s.on('connect_error', (err) => {
            const msg = (err?.message || '').toLowerCase();
            if (msg.includes('auth') || msg.includes('401') || msg.includes('unauthorized') || msg.includes('forbidden')) {
                s.io.opts.reconnection = false;
                s.disconnect();
                socketRef.current = null;
            }
        });

        // --- Typing Indicators ---
        s.on('typing', (data) => {
            const key = `${data.room}_${data.senderId}`;
            setTypingUsers(prev => new Set([...prev, key]));
        });
        s.on('stop-typing', (data) => {
            const key = `${data.room}_${data.senderId}`;
            setTypingUsers(prev => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        });

        // --- Message Events ---
        s.on('chat-message', (data) => {
            // Dispatch to ChatProvider which owns conversations state
            window.dispatchEvent(new CustomEvent('chat:message-received', { detail: data }));
        });

        s.on('messages-read', () => {
            fetchConversations();
        });

        setSocket(s);

        return () => {
            if (s) {
                s.off('connect_error');
                s.off('connect');
                s.off('typing');
                s.off('stop-typing');
                s.off('chat-message');
                s.off('messages-read');
                s.disconnect();
                socketRef.current = null;
                if (moduleSocketRef === s) moduleSocketRef = null;
                setSocket(null);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return { socket, socketRef, onlineUsers, typingUsers };
};

export const reconnectChatSocket = () => {
    if (moduleSocketRef) {
        moduleSocketRef.connect();
    }
};

export default useChatSocket;
