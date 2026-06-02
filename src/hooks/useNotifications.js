import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useRealtimeStore } from '../store/realtimeStore';

const useNotifications = ({ userId, pageSize = 20 } = {}) => {
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
            const res = await api.get(`/api/notifications?page=${page}&limit=${pageSize}`);
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
            console.error('Error fetching notifications:', err);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [pageSize]);

    // Initial fetch + count. The 10s poll is gone — unread count is driven by
    // socket 'notification:new' events (incremented on arrival, decremented on
    // markAsRead, reset on markAllAsRead). On Vercel (no socket) the badge
    // simply doesn't update — same as the pre-3.1 behavior for new events.
    useEffect(() => {
        refetch(1);
        api.get('/api/notifications/unread-count')
            .then((res) => setUnreadCount(res.data.count || 0))
            .catch(() => {});
    }, [refetch, setUnreadCount]);

    const goToPage = useCallback((page) => refetch(page), [refetch]);

    const markAsRead = useCallback(async (id) => {
        try {
            await api.put(`/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            decrementUnread();
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    }, [decrementUnread]);

    const markAllAsRead = useCallback(async () => {
        try {
            await api.put('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            resetUnread();
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    }, [resetUnread]);

    const deleteNotification = useCallback(async (id) => {
        try {
            await api.delete(`/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error('Error deleting:', err);
        }
    }, []);

    const deleteBatch = useCallback(async (ids) => {
        try {
            await api.delete('/api/notifications/batch', { data: { ids } });
            setNotifications(prev => prev.filter(n => !ids.includes(n._id)));
        } catch (err) {
            console.error('Error batch deleting:', err);
        }
    }, []);

    const handleAction = useCallback(async (id, action, link) => {
        try {
            await api.post(`/api/notifications/${id}/action`, { action, link });
            if (link) {
                window.location.href = link;
            }
        } catch (err) {
            console.error('Error handling action:', err);
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
