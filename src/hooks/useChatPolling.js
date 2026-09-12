import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const useChatPolling = (user, dbUser, socket) => {
    const [conversations, setConversations] = useState([]);
    const [unreadTotal, setUnreadTotal] = useState(0);

    const fetchConversations = async () => {
        // Gate on dbUser, not the raw Firebase user: dbUser only resolves after
        // the backend session cookies are minted, so this avoids firing an
        // authenticated request before the token cookie exists (which 401s).
        if (!dbUser) return;
        try {
            const res = await api.get('/api/messages/conversations');
            const convs = Array.isArray(res.data) ? res.data : (res.data.conversations || []);
            setConversations(convs);
            const total = convs.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
            setUnreadTotal(total);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.warn('Error fetching conversations:', error);
            }
        }
    };

    useEffect(() => {
        if (dbUser) {
            fetchConversations();
        } else {
            setConversations([]);
            setUnreadTotal(0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dbUser]);

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

    const pollingRef = useRef(null);

    const stopMessagePolling = useCallback(() => {
        if (pollingRef.current) {
            pollingRef.current.isCancelled = true;
            clearTimeout(pollingRef.current.timeoutId);
            pollingRef.current = null;
        }
    }, []);

    const startMessagePolling = useCallback((conversationId) => {
        stopMessagePolling();

        if (socket?.connected || !conversationId) return;

        const state = { isCancelled: false, timeoutId: null };
        pollingRef.current = state;
        let consecutiveEmpty = 0;

        const poll = async () => {
            if (state.isCancelled) return;
            try {
                const res = await api.get(`/api/messages/${conversationId}`);
                if (state.isCancelled) return;
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

            if (state.isCancelled) return;

            // Adaptive interval: 5s when active, up to 30s when idle
            const interval = consecutiveEmpty === 0 
                ? 5000 
                : Math.min(30000, 5000 * Math.pow(1.5, consecutiveEmpty));
            state.timeoutId = setTimeout(poll, interval);
        };

        poll();
    }, [socket, stopMessagePolling]);

    // Unmount cleanup to prevent timer leaks
    useEffect(() => {
        return () => {
            stopMessagePolling();
        };
    }, [stopMessagePolling]);

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
