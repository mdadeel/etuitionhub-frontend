import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { cn } from '@/lib/utils';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const [notifsRes, countRes] = await Promise.all([
                api.get('/api/notifications'),
                api.get('/api/notifications/unread-count')
            ]);
            setNotifications(notifsRes.data);
            setUnreadCount(countRes.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/api/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/api/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'booking': return '📅';
            case 'payment': return '💳';
            case 'message': return '💬';
            case 'review': return '⭐';
            default: return '🔔';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[#5B6475] hover:text-[#111827] hover:bg-[#F5F7FA] rounded-lg transition-colors relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[rgba(15,23,46,0.08)] shadow-xl rounded-lg overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(15,23,46,0.08)]">
                        <h3 className="font-heading text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs text-[#2563EB] hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-[#5B6475]">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif._id}
                                    className={cn(
                                        "px-4 py-3 border-b border-[rgba(15,23,46,0.08)] hover:bg-[#F5F7FA] transition-colors",
                                        !notif.isRead && "bg-blue-50/50"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg">{getTypeIcon(notif.type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-sm font-heading", !notif.isRead && "text-[#111827]")}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-[#5B6475] truncate">
                                                {notif.message}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {!notif.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notif._id)}
                                                    className="p-1 hover:bg-slate-200 rounded"
                                                >
                                                    <Check size={14} className="text-green-600" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notif._id)}
                                                className="p-1 hover:bg-slate-200 rounded"
                                            >
                                                <Trash2 size={14} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;