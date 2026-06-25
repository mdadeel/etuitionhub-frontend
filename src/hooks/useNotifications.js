import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useRealtimeStore } from '../store/realtimeStore';
import { getSocket } from './useSocketEvents';

const isSafeRedirect = (url) => {
    if (!url) return false;
    if (url.startsWith('/') && !url.startsWith('//')) return true;
    try {
        return new URL(url, window.location.origin).origin === window.location.origin;
    } catch { return false; }
};

// eslint-disable-next-line no-unused-vars
const useNotifications = ({ userId, pageSize = 20, enabled = true, category = null } = {}) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const unreadCount = useRealtimeStore((s) => s.unreadCount);
    const setUnreadCount = useRealtimeStore((s) => s.setUnreadCount);
    const decrementUnread = useRealtimeStore((s) => s.decrementUnread);
    const resetUnread = useRealtimeStore((s) => s.resetUnread);

    const refetch = useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            const query = `/api/notifications?page=${page}&limit=${pageSize}${category ? `&category=${category}` : ''}`;
            const res = await api.get(query);
            const response = res.data;

            if (response && response.data && Array.isArray(response.data)) {
                setNotifications(response.data);
                setPagination(response.pagination || { page, totalPages: 1, total: 0 });
            } else if (Array.isArray(response)) {
                setNotifications(response);
                setPagination({ page: 1, totalPages: 1, total: response.length });
            } else {
                setNotifications([]);
                setPagination({ page, totalPages: 1, total: 0 });
            }
        } catch (err) {
            if (import.meta.env.DEV) console.warn('Error fetching notifications:', err);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [pageSize, category]);

    // Initial fetch + count. The 10s poll is gone — unread count is driven by
    // socket 'notification:new' events (incremented on arrival, decremented on
    // markAsRead, reset on markAllAsRead). On Vercel (no socket) the badge
    // simply doesn't update — same as the pre-3.1 behavior for new events.
    useEffect(() => {
        // Wait until the backend session is ready (enabled = !!dbUser). Firing
        // before the token cookie is minted just produces a 401 cascade.
        if (!enabled) {
            setIsLoading(false);
            return;
        }
        refetch(1);
        api.get('/api/notifications/unread-count')
            .then((res) => setUnreadCount(res.data.count || 0))
            .catch(() => {});
    }, [enabled, refetch, setUnreadCount]);

    // Prepend new notifications from socket events for instant display
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        const handler = (notification) => {
            // Very basic local filtering if category is present. Backend doesn't emit 'category' with socket.
            setNotifications((prev) => [notification, ...prev]);
        };
        socket.on('notification:new', handler);
        return () => socket.off('notification:new', handler);
    }, [category]);

    const goToPage = useCallback((page) => refetch(page), [refetch]);

    const markAsRead = useCallback(async (id) => {
        try {
            await api.put(`/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            decrementUnread();
        } catch (err) {
            if (import.meta.env.DEV) console.warn('Error marking as read:', err);
        }
    }, [decrementUnread]);

    const markAllAsRead = useCallback(async () => {
        try {
            await api.put('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            resetUnread();
        } catch (err) {
            if (import.meta.env.DEV) console.warn('Error marking all as read:', err);
        }
    }, [resetUnread]);

    const deleteNotification = useCallback(async (id) => {
        try {
            await api.delete(`/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            if (import.meta.env.DEV) console.warn('Error deleting:', err);
        }
    }, []);

    const deleteBatch = useCallback(async (ids) => {
        try {
            await api.delete('/api/notifications/batch', { data: { ids } });
            setNotifications(prev => prev.filter(n => !ids.includes(n._id)));
        } catch (err) {
            if (import.meta.env.DEV) console.warn('Error batch deleting:', err);
        }
    }, []);

    const handleAction = useCallback(async (id, action, link) => {
        try {
            await api.post(`/api/notifications/${id}/action`, { action, link });
            if (link && isSafeRedirect(link)) {
                window.location.href = link;
            }
        } catch (err) {
            if (import.meta.env.DEV) console.warn('Notification action error:', err);
        }
    }, []);

    return {
        notifications,
        unreadCount,
        isLoading,
        pagination,
        goToPage,
        refetch,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteBatch,
        handleAction,
    };
};

export default useNotifications;
