import { useState, useCallback } from 'react';
import { Bell, Check, Trash2, Calendar, CreditCard, MessageSquare, Star, FileText, Bookmark, ShieldCheck, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useNotifications from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;

const getTypeIcon = (type, size = 18) => {
    const props = { size, className: 'text-muted-foreground' };
    switch (type) {
        case 'booking': return <Calendar {...props} />;
        case 'payment': return <CreditCard {...props} />;
        case 'message': return <MessageSquare {...props} />;
        case 'review': return <Star {...props} />;
        case 'application': return <FileText {...props} />;
        case 'save': return <Bookmark {...props} />;
        case 'verification': return <ShieldCheck {...props} />;
        default: return <Bell {...props} />;
    }
};

const NotificationPage = () => {
    const { user } = useAuth();
    const {
        notifications,
        unreadCount,
        isLoading,
        pagination,
        goToPage,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteBatch,
        handleAction,
    } = useNotifications({ userId: user?.uid, pageSize: PAGE_SIZE });

    const [selectedIds, setSelectedIds] = useState(new Set());

    const toggleSelect = useCallback((id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (!Array.isArray(notifications)) return;
        if (selectedIds.size === notifications.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(notifications.map(n => n._id)));
        }
    }, [notifications, selectedIds]);

    const handleDeleteSelected = useCallback(async () => {
        if (selectedIds.size === 0) return;
        await deleteBatch(Array.from(selectedIds));
        setSelectedIds(new Set());
    }, [selectedIds, deleteBatch]);

    const renderActions = (notif) => {
        if (!notif.actions || notif.actions.length === 0) return null;
        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {notif.actions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAction(notif._id, action.action, action.link)}
                        className="flex items-center gap-1 text-xs font-heading font-bold uppercase tracking-wider text-[#2563EB] hover:text-[#1d4ed8] hover:underline transition-colors"
                    >
                        {action.label}
                        <ExternalLink size={12} />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-black text-2xl text-foreground uppercase tracking-wider">
                        Notifications
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                            : 'All caught up!'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={14} />
                            Delete ({selectedIds.size})
                        </button>
                    )}
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider text-[#2563EB] border border-[#2563EB]/20 hover:bg-blue-50 transition-colors"
                        >
                            <Check size={14} />
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-5 h-5 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
                </div>
            ) : !Array.isArray(notifications) || notifications.length === 0 ? (
                <div className="text-center py-20">
                    <Bell size={40} className="mx-auto mb-4 text-[#94A3B8]" />
                    <p className="font-heading font-bold text-muted-foreground">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-1">
                    <div className="flex items-center px-4 py-2">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedIds.size === notifications.length && notifications.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-[#D1D5DB]"
                            />
                            Select all
                        </label>
                    </div>

                    {notifications.map(notif => (
                        <div
                            key={notif._id}
                            className={cn(
                                'flex items-start gap-4 px-4 py-4 border border-border bg-card transition-colors',
                                !notif.isRead && 'bg-blue-50/30 border-blue-100'
                            )}
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.has(notif._id)}
                                onChange={() => toggleSelect(notif._id)}
                                className="mt-1 rounded border-[#D1D5DB]"
                            />
                            <span className="mt-0.5">{getTypeIcon(notif.type)}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className={cn('text-sm font-heading', !notif.isRead && 'font-bold text-foreground')}>
                                            {notif.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {notif.message}
                                        </p>
                                        {renderActions(notif)}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                                            {formatRelativeTime(notif.createdAt)}
                                        </span>
                                        {!notif.isRead && (
                                            <button
                                                onClick={() => markAsRead(notif._id)}
                                                className="p-1.5 hover:bg-muted rounded transition-colors"
                                                title="Mark as read"
                                            >
                                                <Check size={14} className="text-green-600" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notif._id)}
                                            className="p-1.5 hover:bg-muted rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="flex items-center gap-1 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider border border-border hover:bg-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={14} />
                            Previous
                        </button>
                        <button
                            onClick={() => goToPage(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="flex items-center gap-1 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider border border-border hover:bg-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
