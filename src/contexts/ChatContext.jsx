import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import useChatSocket from '../hooks/useChatSocket';
import useChatPolling from '../hooks/useChatPolling';
import { logError } from '../utils/devLogger';

const ChatContext = createContext();

const defaultChatValue = {
    socket: null,
    conversations: [],
    setConversations: () => {},
    unreadTotal: 0,
    fetchConversations: async () => {},
    markAsRead: async () => {},
    isFloatingOpen: false,
    setIsFloatingOpen: () => {},
    floatingActiveConv: null,
    setFloatingActiveConv: () => {},
    openChatWith: () => {},
    onlineUsers: [],
    typingUsers: new Map(),
    startMessagePolling: () => {},
    stopMessagePolling: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext) ?? defaultChatValue;

export const ChatProvider = ({ children }) => {
    const { user, dbUser } = useAuth();
    const [isFloatingOpen, setIsFloatingOpen] = useState(false);
    const [floatingActiveConv, setFloatingActiveConv] = useState(null);

    const {
        conversations,
        setConversations,
        unreadTotal,
        fetchConversations,
        startMessagePolling,
        stopMessagePolling,
    } = useChatPolling(user, dbUser);

    const { socket, socketRef, onlineUsers, typingUsers } = useChatSocket(user, dbUser, fetchConversations);

    const markAsRead = useCallback(async (conversationId) => {
        try {
            const { default: api } = await import('../services/api');
            await api.patch(`/api/messages/${conversationId}/read`);
            setConversations(prev => prev.map(c =>
                c._id === conversationId ? { ...c, unreadCount: 0 } : c
            ));
            if (socketRef.current) {
                socketRef.current.emit('mark-read', { room: conversationId });
            }
        } catch (error) {
            logError('ChatContext', 'failed to mark messages as read', error);
        }
    }, [setConversations, socketRef]);

    const openChatWith = useCallback((conversation) => {
        setFloatingActiveConv(conversation);
        setIsFloatingOpen(true);
    }, []);

    const value = useMemo(() => ({
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
    }), [
        socket, conversations, unreadTotal, fetchConversations,
        isFloatingOpen, floatingActiveConv, onlineUsers, typingUsers,
        startMessagePolling, stopMessagePolling,
        markAsRead, openChatWith, setConversations,
        setIsFloatingOpen, setFloatingActiveConv,
    ]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
