import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
const useNotifications = ({ userId, pageSize = 20, enabled = true, category = null, fetchOnMount = true } = {}) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(fetchOnMount ? true : false);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const unreadCount = useRealtimeStore((s) => s.unreadCount);
    const setUnreadCount = useRealtimeStore((s) => s.setUnreadCount);
    const decrementUnread = useRealtimeStore((s) => s.decrementUnread);
    const resetUnread = useRealtimeStore((s) => s.resetUnread);
    const queryClient = useQueryClient();

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

    // Shared unread-count via React Query — one network hit for all bells/pages, deduped + 30s poll.
    const { data: unreadQueryData } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => (await api.get('/api/notifications/unread-count')).data.count || 0,
        enabled: !!enabled,
        staleTime: 30_000,
        refetchInterval: 30_000,
        refetchIntervalInBackground: true,
    });
    useEffect(() => {
        if (typeof unreadQueryData === 'number') setUnreadCount(unreadQueryData);
    }, [unreadQueryData, setUnreadCount]);

    // List fetch is now lazy: Bell opens → refetch(1), NotificationPage mounts → fetchOnMount=true.
    useEffect(() => {
        if (!enabled) {
            setIsLoading(false);
            return;
        }
        if (fetchOnMount) refetch(1);
        else setIsLoading(false);
    }, [enabled, fetchOnMount, refetch]);

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
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        } catch (err) {
            if (import.meta.env.DEV) console.warn('Error marking as read:', err);
        }
    }, [decrementUnread, queryClient]);

    const markAllAsRead = useCallback(async () => {
        try {
            await api.put('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            resetUnread();
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        } catch (err) {
            if (import.meta.env.DEV) console.warn('Error marking all as read:', err);
        }
    }, [resetUnread, queryClient]);

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
