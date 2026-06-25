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
                        className="flex items-center gap-1 px-2 py-1 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-[10px] uppercase tracking-wider hover:bg-[#FF5500] dark:hover:bg-[#FF5500] hover:text-white transition-colors"
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
                    'relative p-3 border-b-2 border-black dark:border-white transition-all hover:bg-black/5 dark:hover:bg-white/5 group',
                    !notif.isRead && 'bg-[#FF5500]/10 border-l-4 border-l-[#FF5500]'
                )}
            >
                <div className="flex items-start gap-3">
                    <div className={cn(
                        "p-2 border-2 border-black dark:border-white shrink-0",
                        notif.isRead ? "bg-card" : "bg-black text-white dark:bg-white dark:text-black"
                    )}>
                        {getTypeIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                            <p className={cn(
                                'text-sm font-heading leading-tight uppercase line-clamp-1', 
                                !notif.isRead ? 'font-black' : 'font-bold'
                            )}>
                                {notif.title}
                            </p>
                            <span className="text-[9px] font-mono whitespace-nowrap text-muted-foreground mt-0.5">
                                T-{formatRelativeTime(notif.createdAt)}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notif.message}
                        </p>
                        {renderActions(notif)}
                    </div>
                    
                    <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.isRead && (
                            <button
                                onClick={() => markAsRead(notif._id)}
                                className="p-1 border-2 border-black dark:border-white bg-green-400 text-black hover:bg-green-500 transition-colors"
                                title="Acknowledge"
                            >
                                <Check size={12} />
                            </button>
                        )}
                        <button
                            onClick={() => deleteNotification(notif._id)}
                            className="p-1 border-2 border-black dark:border-white bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Purge"
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
                    "p-2 rounded-none border-2 transition-all relative overflow-hidden",
                    isOpen 
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]" 
                        : "border-transparent hover:border-black dark:hover:border-white text-muted-foreground hover:text-foreground"
                )}
            >
                <Bell size={20} className={cn(isOpen && "animate-pulse")} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 size-4 flex items-center justify-center text-[9px] font-mono font-bold bg-[#FF5500] text-white border border-black dark:border-white translate-x-1/4 -translate-y-1/4 z-10">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-card border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] z-50 animate-fade-in-up">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black">
                        <h3 className="font-heading text-sm font-black uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#FF5500] animate-pulse"></span>
                            {expanded ? 'SYSTEM LOG (5D)' : 'SYSTEM ALERTS'}
                        </h3>
                        <div className="flex items-center gap-3">
                            {unreadCount > 0 && !expanded && (
                                <button 
                                    onClick={markAllAsRead} 
                                    className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF5500] hover:text-white dark:hover:text-black transition-colors"
                                >
                                    ACKNOWLEDGE ALL
                                </button>
                            )}
                            {expanded && (
                                <button 
                                    onClick={handleCollapse} 
                                    className="text-[10px] font-mono font-bold uppercase tracking-widest hover:text-[#FF5500] transition-colors"
                                >
                                    COLLAPSE
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {displayNotifications.length === 0 && !allLoading ? (
                            <div className="p-12 text-center border-b-2 border-black dark:border-white">
                                <Bell size={32} className="mx-auto mb-3 opacity-20" />
                                <p className="font-mono text-sm font-bold uppercase tracking-widest">
                                    {expanded ? 'NO LOGS FOUND' : 'NO ACTIVE ALERTS'}
                                </p>
                            </div>
                        ) : (
                            displayNotifications.map((notif, index) => renderNotification(notif, index))
                        )}
                        
                        {allLoading && (
                            <div className="flex items-center justify-center p-6 border-b-2 border-black dark:border-white">
                                <Loader2 size={24} className="animate-spin" />
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
                                    className="w-full px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50 border-t-2 border-black dark:border-white"
                                >
                                    {allLoading ? 'FETCHING...' : 'LOAD MORE DATA'}
                                </button>
                            )}
                            {!expanded && (
                                <button
                                    onClick={handleShowAll}
                                    className="w-full px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black hover:bg-[#FF5500] dark:hover:bg-[#FF5500] hover:text-white transition-colors"
                                >
                                    ACCESS FULL LOGS
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
