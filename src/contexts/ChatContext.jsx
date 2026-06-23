import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import useChatSocket from '../hooks/useChatSocket';
import useChatPolling from '../hooks/useChatPolling';
import { logError } from '../utils/devLogger';

const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);

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

    const markAsRead = async (conversationId) => {
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
            startMessagePolling,
            stopMessagePolling,
        }}>
            {children}
        </ChatContext.Provider>
    );
};
