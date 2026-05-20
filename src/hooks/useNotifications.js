import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import socket, { connectSocket, disconnectSocket } from '../services/socket';

const useNotifications = ({ userId, pageSize = 20 } = {}) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const intervalRef = useRef(null);

    const refetch = useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            const [notifsRes, countRes] = await Promise.all([
                api.get(`/api/notifications?page=${page}&limit=${pageSize}`),
                api.get('/api/notifications/unread-count'),
            ]);
            const response = notifsRes.data;
            
            // The backend returns { data: notifications, pagination: ... }
            if (response && response.data && Array.isArray(response.data)) {
                setNotifications(response.data);
                setPagination(response.pagination || { page, totalPages: 1, total: 0 });
            } else if (Array.isArray(response)) {
                // Fallback for array-only response
                setNotifications(response);
                setPagination({ page: 1, totalPages: 1, total: response.length });
            } else {
                // Fallback to empty array if response is unexpected
                setNotifications([]);
                setPagination({ page: 1, totalPages: 1, total: 0 });
            }
            setUnreadCount(countRes.data.count);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [pageSize]);

    const goToPage = useCallback((page) => refetch(page), [refetch]);

    const markAsRead = useCallback(async (id) => {
        try {
            await api.put(`/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await api.put('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    }, []);

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
            await api.post('/api/notifications/batch-delete', { ids });
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

    // Socket.IO real-time updates
    useEffect(() => {
        if (!userId) return;

        connectSocket(userId);

        const handleNewNotification = (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        socket.on('notification:new', handleNewNotification);

        return () => {
            socket.off('notification:new', handleNewNotification);
        };
    }, [userId]);

    // Polling fallback
    useEffect(() => {
        refetch(1);
        intervalRef.current = setInterval(() => {
            api.get('/api/notifications/unread-count').then(res => {
                setUnreadCount(res.data.count);
            }).catch(() => {});
        }, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [refetch]);

    // Cleanup socket on unmount
    useEffect(() => {
        return () => {
            disconnectSocket();
        };
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
