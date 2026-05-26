import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import api from '../services/api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [socket, setSocket] = useState(null);
    const [unreadTotal, setUnreadTotal] = useState(0);
    const [isFloatingOpen, setIsFloatingOpen] = useState(false);
    const [floatingActiveConv, setFloatingActiveConv] = useState(null);
    // onlineUsers: a Set of user IDs (string) that are currently connected
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    // typingUsers: a Set of room_userId keys like "convId_userId" that indicate active typing
    const [typingUsers, setTypingUsers] = useState(new Set());
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
    }, [user]);

    // Poll online status every 30s (works on Vercel, no WebSocket needed)
    useEffect(() => {
        if (!user) return;
        const fetchOnline = async () => {
            try {
                const res = await api.get('/api/users/online');
                const ids = res.data.online.map(u => u._id.toString());
                setOnlineUsers(new Set(ids));
            } catch {}
        };
        fetchOnline();
        const interval = setInterval(fetchOnline, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Initialize Socket
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token || !user) return;

        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // NOTE: WebSockets do NOT work on Vercel (serverless functions don't support
        // persistent connections). Online status uses REST polling instead (above).
        // Real-time chat (messages, typing) requires a persistent host (Railway/Render).
        if (backendUrl.includes('vercel')) {
            console.log('Socket.IO disabled: Vercel serverless does not support persistent connections');
            return;
        }

        socketRef.current = io(backendUrl, {
            auth: { token },
            // Start with polling so the connection at least establishes on serverless hosts;
            // upgrade to websocket only on platforms that support it (Railway, Render, etc.)
            transports: ['polling', 'websocket'],
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
            timeout: 5000,
        });

        socketRef.current.on('connect', () => {
            console.log('Global Socket connected for chat');
        });

        // --- Typing Indicators ---
        socketRef.current.on('typing', (data) => {
            const key = `${data.room}_${data.senderId}`;
            setTypingUsers(prev => new Set([...prev, key]));
        });
        socketRef.current.on('stop-typing', (data) => {
            const key = `${data.room}_${data.senderId}`;
            setTypingUsers(prev => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        });

        // --- Message Events ---
        socketRef.current.on('chat-message', (data) => {
            setConversations(prev => {
                const existingIndex = prev.findIndex(c => c._id === data.conversationId);
                if (existingIndex >= 0) {
                    const updatedConv = { ...prev[existingIndex], lastMessage: data, updatedAt: new Date() };
                    if (data.senderId !== user.uid && data.senderId !== user.dbUser?._id) {
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

        socketRef.current.on('messages-read', () => {
            fetchConversations();
        });

        setSocket(socketRef.current);

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                setSocket(null);
            }
        };
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
        }}>
            {children}
        </ChatContext.Provider>
    );
};
