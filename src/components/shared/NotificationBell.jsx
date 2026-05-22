import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, CreditCard, MessageSquare, Star, FileText, Bookmark, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useNotifications from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useAuth();
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        handleAction,
    } = useNotifications({ userId: user?.uid });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeIcon = (type) => {
        const iconProps = { size: 16, className: 'text-muted-foreground' };
        switch (type) {
            case 'booking': return <Calendar {...iconProps} />;
            case 'payment': return <CreditCard {...iconProps} />;
            case 'message': return <MessageSquare {...iconProps} />;
            case 'review': return <Star {...iconProps} />;
            case 'application': return <FileText {...iconProps} />;
            case 'save': return <Bookmark {...iconProps} />;
            case 'verification': return <ShieldCheck {...iconProps} />;
            default: return <Bell {...iconProps} />;
        }
    };

    const renderActions = (notif) => {
        if (!notif.actions || notif.actions.length === 0) return null;
        return (
            <div className="flex gap-1.5 mt-1.5">
                {notif.actions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAction(notif._id, action.action, action.link)}
                        className="flex items-center gap-1 text-[10px] font-heading font-bold uppercase tracking-wider text-[#2563EB] hover:text-[#1d4ed8] hover:underline transition-colors"
                    >
                        {action.label}
                        <ExternalLink size={10} />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border shadow-xl rounded-lg overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <h3 className="font-heading text-sm font-bold">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs text-[#2563EB] hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                <Bell size={24} className="mx-auto mb-2 opacity-30" />
                                No notifications yet
                            </div>
                        ) : (
                            notifications.slice(0, 10).map(notif => (
                                <div
                                    key={notif._id}
                                    className={cn(
                                        'px-4 py-3 border-b border-border hover:bg-background transition-colors',
                                        !notif.isRead && 'bg-primary/5'
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5">{getTypeIcon(notif.type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn('text-sm font-heading leading-tight', !notif.isRead && 'text-foreground font-semibold')}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            {renderActions(notif)}
                                            <p className="text-[10px] text-[#94A3B8] mt-1">
                                                {formatRelativeTime(notif.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {!notif.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notif._id)}
                                                    className="p-1 hover:bg-muted rounded transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check size={14} className="text-green-600" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notif._id)}
                                                className="p-1 hover:bg-muted rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <Link
                            to="/dashboard/notifications"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 text-center text-xs font-heading font-bold uppercase tracking-wider text-[#2563EB] hover:bg-background border-t border-border transition-colors"
                        >
                            Show All
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
