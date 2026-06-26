import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, Check, Trash2, Calendar, CreditCard, MessageSquare, Star, FileText, ShieldCheck, ExternalLink, Loader2, AlertTriangle, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useNotifications from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import api from '@/services/api';

const NOTIF_PAGE_SIZE = 15;
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

const getTypeIcon = (type) => {
    const props = { size: 16, className: 'text-current' };
    switch (type) {
        case 'booking':
        case 'tutoring_scheduled':
        case 'tutoring_started':
        case 'tutoring_completed':
            return <Calendar {...props} />;
        case 'payment':
        case 'trx_verified':
        case 'payment_due_generated':
            return <CreditCard {...props} />;
        case 'message': return <MessageSquare {...props} />;
        case 'review': return <Star {...props} />;
        case 'application': return <FileText {...props} />;
        case 'verification':
        case 'admin':
        case 'system':
            return <ShieldCheck {...props} />;
        case 'attendance_warning':
        case 'trx_rejected':
        case 'dispute_filed':
            return <AlertTriangle {...props} />;
        case 'assignment_created':
        case 'new_material':
            return <BookOpen {...props} />;
        default: return <Bell {...props} />;
    }
};

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

    const renderActions = (notif) => {
        if (!notif.actions || notif.actions.length === 0) return null;
        return (
            <div className="flex flex-wrap gap-1 mt-2">
                {notif.actions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notif._id, action.action, action.link);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/95 text-[10px] font-bold tracking-wide transition-all shadow-sm active:scale-95"
                    >
                        {action.label}
                        <ExternalLink size={10} />
                    </button>
                ))}
            </div>
        );
    };

    const renderNotification = (notif, index) => (
        <div
            key={notif._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div
                className={cn(
                    'relative p-3.5 border-b border-border/50 transition-all hover:bg-muted/30 group',
                    !notif.isRead && 'bg-primary/[0.01] border-l-2 border-l-primary'
                )}
            >
                <div className="flex items-start gap-3">
                    <div className={cn(
                        "p-2 rounded-lg border shrink-0 flex items-center justify-center size-9",
                        notif.isRead ? "bg-muted text-muted-foreground border-border/80" : "bg-primary/10 text-primary border-primary/20"
                    )}>
                        {getTypeIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                            <p className={cn(
                                'text-xs leading-tight line-clamp-1', 
                                !notif.isRead ? 'font-bold text-primary' : 'font-semibold text-foreground'
                            )}>
                                {notif.title}
                            </p>
                            <span className="text-[9px] whitespace-nowrap text-muted-foreground mt-0.5">
                                {formatRelativeTime(notif.createdAt)}
                            </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                            {notif.message}
                        </p>
                        {renderActions(notif)}
                    </div>
                    
                    <div className="flex flex-col items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        {!notif.isRead && (
                            <button
                                onClick={() => markAsRead(notif._id)}
                                className="p-1.5 border border-border rounded-lg bg-card text-muted-foreground hover:text-primary hover:border-primary/20 transition-all active:scale-95 shadow-sm"
                                title="Mark as read"
                            >
                                <Check size={12} className="stroke-[2.5]" />
                            </button>
                        )}
                        <button
                            onClick={() => deleteNotification(notif._id)}
                            className="p-1.5 border border-border rounded-lg bg-card text-muted-foreground hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95 shadow-sm"
                            title="Delete"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
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
                className={cn(
                    "p-2 rounded-xl transition-all relative",
                    isOpen 
                        ? "bg-muted text-foreground border border-border/80 shadow-sm" 
                        : "border border-transparent hover:bg-muted/65 text-muted-foreground hover:text-foreground"
                )}
            >
                <Bell size={20} className={cn(isOpen && "animate-pulse")} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[9px] font-bold bg-primary text-primary-foreground border border-background shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-card border border-border/80 rounded-2xl shadow-premium z-50 animate-fade-in-up overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/80">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                            {expanded ? 'System Log (5d)' : 'Notifications'}
                        </h3>
                        <div className="flex items-center gap-3">
                            {unreadCount > 0 && !expanded && (
                                <button 
                                    onClick={markAllAsRead} 
                                    className="text-xs font-semibold text-primary hover:underline transition-colors"
                                >
                                    Mark all as read
                                </button>
                            )}
                            {expanded && (
                                <button 
                                    onClick={handleCollapse} 
                                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Collapse
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                        {displayNotifications.length === 0 && !allLoading ? (
                            <div className="p-12 text-center">
                                <Bell size={28} className="mx-auto mb-2 text-muted-foreground opacity-30" />
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    {expanded ? 'No logs found' : 'No notifications'}
                                </p>
                            </div>
                        ) : (
                            displayNotifications.map((notif, index) => renderNotification(notif, index))
                        )}
                        
                        {allLoading && (
                            <div className="flex items-center justify-center p-6">
                                <Loader2 size={20} className="animate-spin text-primary" />
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div>
                            {expanded && hasMore && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={allLoading}
                                    className="w-full px-4 py-3 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50 border-t border-border"
                                >
                                    {allLoading ? 'Fetching...' : 'Load more logs'}
                                </button>
                            )}
                            {!expanded && (
                                <button
                                    onClick={handleShowAll}
                                    className="w-full px-4 py-3 text-xs font-bold text-center text-primary hover:bg-muted/40 border-t border-border transition-colors block"
                                >
                                    View full logs (5d)
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
