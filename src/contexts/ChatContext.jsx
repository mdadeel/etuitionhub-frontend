import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import api from '../services/api';

const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user, dbUser } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [socket, setSocket] = useState(null);
    const [unreadTotal, setUnreadTotal] = useState(0);
    const [isFloatingOpen, setIsFloatingOpen] = useState(false);
    const [floatingActiveConv, setFloatingActiveConv] = useState(null);
    // onlineUsers: a Set of user IDs (string) that are currently connected
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    // typingUsers: a Set of room_userId keys like "convId_userId" that indicate active typing
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [pollingIntervalId, setPollingIntervalId] = useState(null);
    const socketRef = useRef(null);

    // Fetch conversations and unread count
    const fetchConversations = async () => {
        if (!user) return;
        try {
            const res = await api.get('/api/messages/conversations');
            const convs = Array.isArray(res.data) ? res.data : (res.data.conversations || []);
            setConversations(convs);
            const total = convs.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
            setUnreadTotal(total);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchConversations();
        } else {
            setConversations([]);
            setUnreadTotal(0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Poll online status every 30s — Vercel-only fallback. On hosts that
    // support persistent sockets (Railway, Render, localhost), the socket
    // already pushes online status, so the poll is skipped to avoid duplicate
    // work.
    useEffect(() => {
        if (!user) return;
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        if (!backendUrl.includes('vercel')) return;
        const fetchOnline = async () => {
            try {
                const res = await api.get('/api/users/online');
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

        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // NOTE: WebSockets do NOT work on Vercel (serverless functions don't support
        // persistent connections). Online status uses REST polling instead (above).
        // Real-time chat (messages, typing) requires a persistent host (Railway/Render).
        if (backendUrl.includes('vercel')) {
            console.log('Socket.IO disabled: Vercel serverless does not support persistent connections');
            return;
        }

        socketRef.current = io(backendUrl, {
            withCredentials: true,
            // Start with polling so the connection at least establishes on serverless hosts;
            // upgrade to websocket only on platforms that support it (Railway, Render, etc.)
            transports: ['polling', 'websocket'],
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
            timeout: 5000,
        });

        const s = socketRef.current;

        s.on('connect', () => {
            console.log('Global Socket connected for chat');
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
            setConversations(prev => {
                const existingIndex = prev.findIndex(c => c._id === data.conversationId);
                if (existingIndex >= 0) {
                    const updatedConv = { ...prev[existingIndex], lastMessage: data, updatedAt: new Date() };
                    if (data.senderId !== user.uid && data.senderId !== dbUser?._id) {
                        updatedConv.unreadCount = (updatedConv.unreadCount || 0) + 1;
                    }
                    const newConvs = [...prev];
                    newConvs[existingIndex] = updatedConv;
                    return newConvs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                } else {
                    fetchConversations();
                    return prev;
                }
            });
        });

        s.on('messages-read', () => {
            fetchConversations();
        });

        setSocket(s);

        return () => {
            if (s) {
                s.off('connect');
                s.off('typing');
                s.off('stop-typing');
                s.off('chat-message');
                s.off('messages-read');
                s.disconnect();
                setSocket(null);
            }
            // eslint-disable-next-line react-hooks/immutability
            stopMessagePolling();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Helper to calculate total unread
    useEffect(() => {
        const total = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
        setUnreadTotal(total);
    }, [conversations]);

    const markAsRead = async (conversationId) => {
        try {
            await api.patch(`/api/messages/${conversationId}/read`);
            setConversations(prev => prev.map(c => 
                c._id === conversationId ? { ...c, unreadCount: 0 } : c
            ));
            if (socketRef.current) {
                socketRef.current.emit('mark-read', { room: conversationId });
            }
        } catch (error) {
            console.error('Failed to mark messages as read', error);
        }
    };

    const openChatWith = (conversation) => {
        setFloatingActiveConv(conversation);
        setIsFloatingOpen(true);
    };

    const startMessagePolling = useCallback((conversationId) => {
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }

        if (socketRef.current?.connected) return;

        const intervalId = setInterval(async () => {
            try {
                const res = await api.get(`/api/messages/${conversationId}`);
                const msgs = Array.isArray(res.data) ? res.data : (res.data.messages || []);
                window.dispatchEvent(new CustomEvent('chat:messages-updated', {
                    detail: { conversationId, messages: msgs }
                }));
            // eslint-disable-next-line no-unused-vars, no-empty
            } catch (err) {
            }
        }, 3000);

        setPollingIntervalId(intervalId);
    }, [pollingIntervalId]);

    const stopMessagePolling = useCallback(() => {
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
            setPollingIntervalId(null);
        }
    }, [pollingIntervalId]);

    return (
        <ChatContext.Provider value={{
            socket,
            conversations,
            setConversations,
            unreadTotal,
            fetchConversations,
            markAsRead,
            isFloatingOpen,
            setIsFloatingOpen,
            floatingActiveConv,
            setFloatingActiveConv,
            openChatWith,
            onlineUsers,
            typingUsers,
            startMessagePolling,
            stopMessagePolling,
        }}>
            {children}
        </ChatContext.Provider>
    );
};
