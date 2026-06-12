import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useChatPolling = (user, dbUser, socket) => {
    const [conversations, setConversations] = useState([]);
    const [unreadTotal, setUnreadTotal] = useState(0);
    const [pollingIntervalId, setPollingIntervalId] = useState(null);

    const fetchConversations = async () => {
        if (!user) return;
        try {
            const res = await api.get('/api/messages/conversations');
            const convs = Array.isArray(res.data) ? res.data : (res.data.conversations || []);
            setConversations(convs);
            const total = convs.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
            setUnreadTotal(total);
        } catch (error) {
            if (import.meta.env.DEV) console.warn('Error fetching conversations:', error);
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

    // Listen for socket-dispatched message events
    useEffect(() => {
        const handler = (e) => {
            const data = e.detail;
            setConversations(prev => {
                const existingIndex = prev.findIndex(c => c._id === data.conversationId);
                if (existingIndex >= 0) {
                    const updatedConv = { ...prev[existingIndex], lastMessage: data, updatedAt: new Date() };
                    if (data.senderId !== user?.uid && data.senderId !== dbUser?._id) {
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
        };
        window.addEventListener('chat:message-received', handler);
        return () => window.removeEventListener('chat:message-received', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        const total = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
        setUnreadTotal(total);
    }, [conversations]);

    const startMessagePolling = useCallback((conversationId) => {
        if (pollingIntervalId?.stop) {
            pollingIntervalId.stop();
        }

        if (socket?.connected) return;

        let consecutiveEmpty = 0;
        let timeoutId = null;

        const poll = async () => {
            try {
                const res = await api.get(`/api/messages/${conversationId}`);
                const msgs = Array.isArray(res.data) ? res.data : (res.data.messages || []);
                
                if (msgs.length > 0) {
                    consecutiveEmpty = 0;
                } else {
                    consecutiveEmpty++;
                }
                
                window.dispatchEvent(new CustomEvent('chat:messages-updated', {
                    detail: { conversationId, messages: msgs }
                }));
            // eslint-disable-next-line no-unused-vars, no-empty
            } catch (err) {
            }

            // Adaptive interval: 5s when active, up to 30s when idle
            const interval = consecutiveEmpty === 0 
                ? 5000 
                : Math.min(30000, 5000 * Math.pow(1.5, consecutiveEmpty));
            timeoutId = setTimeout(poll, interval);
        };

        poll();
        setPollingIntervalId({ timeoutId, stop: () => clearTimeout(timeoutId) });
    }, [pollingIntervalId, socket]);

    const stopMessagePolling = useCallback(() => {
        if (pollingIntervalId?.stop) {
            pollingIntervalId.stop();
            setPollingIntervalId(null);
        }
    }, [pollingIntervalId]);

    return {
        conversations,
        setConversations,
        unreadTotal,
        fetchConversations,
        startMessagePolling,
        stopMessagePolling,
    };
};

export default useChatPolling;
