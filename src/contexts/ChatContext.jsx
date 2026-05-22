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
            setConversations(res.data);
            const total = res.data.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
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

    // Initialize Socket
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token || !user) return;

        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        socketRef.current = io(backendUrl, {
            auth: { token },
            query: { token }
        });

        socketRef.current.on('connect', () => {
            console.log('Global Socket connected for chat');
        });

        // --- Online Status ---
        socketRef.current.on('online-users', (userIds) => {
            setOnlineUsers(new Set(userIds));
        });
        socketRef.current.on('user-online', (userId) => {
            setOnlineUsers(prev => new Set([...prev, userId]));
        });
        socketRef.current.on('user-offline', (userId) => {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
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
