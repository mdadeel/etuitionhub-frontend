import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, Check, Trash2, Calendar, CreditCard, MessageSquare, Star, FileText, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useNotifications from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import api from '@/services/api';

const NOTIF_PAGE_SIZE = 15;
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [allNotifications, setAllNotifications] = useState([]);
    const [allPage, setAllPage] = useState(1);
    const [allTotalPages, setAllTotalPages] = useState(1);
    const [allLoading, setAllLoading] = useState(false);
    const dropdownRef = useRef(null);
    const { user, dbUser } = useAuth();
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        handleAction,
    } = useNotifications({ userId: user?.uid, enabled: !!dbUser });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchAllNotifications = useCallback(async (page = 1, append = false) => {
        setAllLoading(true);
        try {
            const from = new Date(Date.now() - FIVE_DAYS_MS).toISOString();
            const res = await api.get(`/api/notifications?page=${page}&limit=${NOTIF_PAGE_SIZE}&from=${from}`);
            const data = res.data?.data || [];
            const pagination = res.data?.pagination || { pages: 1 };
            setAllNotifications(prev => append ? [...prev, ...data] : data);
            setAllPage(page);
            setAllTotalPages(pagination.pages || 1);
        } catch {
            if (!append) setAllNotifications([]);
        } finally {
            setAllLoading(false);
        }
    }, []);

    const handleShowAll = useCallback(() => {
        setExpanded(true);
        fetchAllNotifications(1, false);
    }, [fetchAllNotifications]);

    const handleLoadMore = useCallback(() => {
        fetchAllNotifications(allPage + 1, true);
    }, [fetchAllNotifications, allPage]);

    const handleCollapse = useCallback(() => {
        setExpanded(false);
        setAllNotifications([]);
        setAllPage(1);
    }, []);

    const getTypeIcon = (type) => {
        const iconProps = { size: 16, className: 'text-muted-foreground' };
        switch (type) {
            case 'booking': return <Calendar {...iconProps} />;
            case 'payment': return <CreditCard {...iconProps} />;
            case 'message': return <MessageSquare {...iconProps} />;
            case 'review': return <Star {...iconProps} />;
            case 'application': return <FileText {...iconProps} />;
            case 'verification': return <ShieldCheck {...iconProps} />;
            default: return <Bell {...iconProps} />;
        }
    };

    const renderActions = (notif) => {
        if (!notif.actions || notif.actions.length === 0) return null;
        return (
            <div className="flex gap-1.5 mt-1.5">
                {notif.actions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={() => handleAction(notif._id, action.action, action.link)}
                        className="flex items-center gap-1 text-[10px] font-heading font-bold uppercase tracking-wider text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                        {action.label}
                        <ExternalLink size={10} />
                    </button>
                ))}
            </div>
        );
    };

    const renderNotification = (notif) => (
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
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {formatRelativeTime(notif.createdAt)}
                    </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    {!notif.isRead && (
                        <button
                            onClick={() => markAsRead(notif._id)}
                            className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted rounded transition-colors"
                            title="Mark as read"
                        >
                            <Check size={14} className="text-green-600" />
                        </button>
                    )}
                    <button
                        onClick={() => deleteNotification(notif._id)}
                        className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14} className="text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );

    const displayNotifications = expanded ? allNotifications : notifications.slice(0, 10);
    const hasMore = expanded && allPage < allTotalPages;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setExpanded(false);
                }}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border shadow-xl rounded-lg overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <h3 className="font-heading text-sm font-bold">
                            {expanded ? 'Last 5 Days' : 'Notifications'}
                        </h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && !expanded && (
                                <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                                    Mark all read
                                </button>
                            )}
                            {expanded && (
                                <button onClick={handleCollapse} className="text-xs text-muted-foreground hover:text-foreground">
                                    Collapse
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {displayNotifications.length === 0 && !allLoading ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                <Bell size={24} className="mx-auto mb-2 opacity-30" />
                                {expanded ? 'No notifications in the last 5 days' : 'No notifications yet'}
                            </div>
                        ) : (
                            displayNotifications.map(renderNotification)
                        )}
                        {allLoading && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 size={16} className="animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="border-t border-border">
                            {expanded && hasMore && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={allLoading}
                                    className="w-full px-4 py-3 text-xs font-heading font-bold uppercase tracking-wider text-primary hover:bg-background transition-colors disabled:opacity-50"
                                >
                                    {allLoading ? 'Loading...' : 'Load More'}
                                </button>
                            )}
                            {!expanded && (
                                <button
                                    onClick={handleShowAll}
                                    className="w-full px-4 py-3 text-xs font-heading font-bold uppercase tracking-wider text-primary hover:bg-background transition-colors"
                                >
                                    Show All
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
