import { useState, useCallback } from 'react';
import { Bell, Check, Trash2, Calendar, CreditCard, MessageSquare, Star, FileText, ShieldCheck, ExternalLink, ChevronLeft, ChevronRight, Zap, Filter, Info, AlertTriangle, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useNotifications from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { NotificationListSkeleton } from "@/components/shared/skeletons";

const PAGE_SIZE = 20;

const CATEGORIES = [
    { id: null, label: 'All', icon: Bell },
    { id: 'financial', label: 'Financials', icon: CreditCard },
    { id: 'session', label: 'Sessions', icon: Calendar },
    { id: 'request', label: 'Requests', icon: Zap },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'system', label: 'System', icon: ShieldCheck },
    { id: 'social', label: 'Social', icon: MessageSquare }
];

const getTypeIcon = (type, size = 18) => {
    const props = { size, className: 'text-current' };
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

const NotificationPage = () => {
    const { user, dbUser } = useAuth();
    const [category, setCategory] = useState(null);
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
    } = useNotifications({ userId: user?.uid, pageSize: PAGE_SIZE, enabled: !!dbUser, category });

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

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
            <div className="flex flex-wrap gap-2 mt-3.5 border-t border-border/80 pt-3">
                {notif.actions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notif._id, action.action, action.link);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all active:scale-95 shadow-sm"
                    >
                        {action.label}
                        <ExternalLink size={12} />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
            {/* Premium Header */}
            <div className="mb-8 pb-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                            Notifications
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Stay updated with your academic, session, and financial activities.
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border",
                                unreadCount > 0 
                                    ? "bg-primary/10 text-primary border-primary/20" 
                                    : "bg-muted text-muted-foreground border-border"
                            )}>
                                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                            className="md:hidden inline-flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted/50 text-sm font-semibold text-foreground transition-all shadow-sm active:scale-95"
                        >
                            <Filter size={16} />
                            Filters
                        </button>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-sm hover:shadow-[0_0_12px_hsl(var(--primary)/0.2)] active:scale-95"
                            >
                                <Check size={16} />
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Panel: Modern Navigation Sidebar */}
                <aside className={cn(
                    "w-full md:w-60 flex-shrink-0 md:block transition-all",
                    showFiltersMobile ? "block" : "hidden"
                )}>
                    <div className="sticky top-24 space-y-1 bg-card border border-border rounded-xl p-4 shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 mb-3">
                            Categories
                        </h3>
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = category === cat.id;
                            return (
                                <button
                                    key={cat.label}
                                    onClick={() => setCategory(cat.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={16} />
                                        <span>{cat.label}</span>
                                    </div>
                                    {isActive && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Right Panel: Feed */}
                <main className="flex-1 min-w-0">
                    {/* Batch Actions Float */}
                    {selectedIds.size > 0 && (
                        <div className="flex items-center justify-between p-4 mb-6 bg-primary text-primary-foreground rounded-xl shadow-lg border border-primary/30 animate-fade-in-up">
                            <span className="text-sm font-semibold tracking-tight">
                                Selected {selectedIds.size} {selectedIds.size === 1 ? 'notification' : 'notifications'}
                            </span>
                            <button
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all font-semibold rounded-lg text-xs active:scale-95 shadow-sm"
                            >
                                <Trash2 size={14} />
                                Delete Selected
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <NotificationListSkeleton count={6} />
                    ) : !Array.isArray(notifications) || notifications.length === 0 ? (
                        <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card/50">
                            <Info size={40} className="mx-auto mb-3.5 text-muted-foreground opacity-60" />
                            <h3 className="font-bold text-lg text-foreground">No notifications</h3>
                            <p className="text-muted-foreground mt-1 text-sm">Your notification list is currently empty.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2 pb-3 border-b border-border">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center w-5 h-5 rounded border border-border bg-card group-hover:border-primary/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.size === notifications.length && notifications.length > 0}
                                            onChange={toggleSelectAll}
                                            className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                                        />
                                        {(selectedIds.size === notifications.length && notifications.length > 0) && (
                                            <Check size={12} className="text-primary stroke-[3]" />
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select All</span>
                                </label>
                            </div>

                            {notifications.map((notif) => {
                                const isSelected = selectedIds.has(notif._id);
                                return (
                                    <div
                                        key={notif._id}
                                        className="relative group transition-all duration-300"
                                    >
                                        <div
                                            className={cn(
                                                'relative border rounded-xl p-5 transition-all duration-300',
                                                notif.isRead 
                                                    ? 'bg-card border-border shadow-sm hover:shadow-premium-md' 
                                                    : 'bg-primary/[0.01] border-primary/20 shadow-sm hover:shadow-premium hover:border-primary/40',
                                                isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                            )}
                                        >
                                            <div className="flex gap-4">
                                                {/* Checkbox and Unread Dot */}
                                                <div className="flex flex-col items-center gap-2 pt-1 shrink-0">
                                                    <div className="relative flex items-center justify-center w-5 h-5 rounded border border-border bg-card cursor-pointer hover:border-primary/50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleSelect(notif._id)}
                                                            className="absolute opacity-0 w-full h-full cursor-pointer z-20"
                                                        />
                                                        {isSelected && <Check size={12} className="text-primary stroke-[3]" />}
                                                    </div>
                                                    {!notif.isRead && (
                                                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" title="Unread" />
                                                    )}
                                                </div>

                                                {/* Icon Wrapper */}
                                                <div className={cn(
                                                    "p-3 rounded-lg border shrink-0 flex items-center justify-center size-11",
                                                    notif.isRead 
                                                        ? "bg-muted text-muted-foreground border-border" 
                                                        : "bg-primary/10 text-primary border-primary/20"
                                                )}>
                                                    {getTypeIcon(notif.type, 20)}
                                                </div>

                                                {/* Content Area */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                        <div className="min-w-0">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                                                                {formatRelativeTime(notif.createdAt)}
                                                            </span>
                                                            <h3 className={cn(
                                                                "font-bold text-base md:text-lg tracking-tight leading-tight text-foreground mb-1",
                                                                !notif.isRead && "text-primary"
                                                            )}>
                                                                {notif.title}
                                                            </h3>
                                                            <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
                                                                {notif.message}
                                                            </p>
                                                            {renderActions(notif)}
                                                        </div>
                                                        
                                                        {/* Card Actions (Mark as Read / Delete) */}
                                                        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-start opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                                            {!notif.isRead && (
                                                                <button
                                                                    onClick={() => markAsRead(notif._id)}
                                                                    className="p-2 border border-border rounded-lg bg-card text-muted-foreground hover:text-primary hover:border-primary/20 transition-all active:scale-95 shadow-sm"
                                                                    title="Mark as read"
                                                                >
                                                                    <Check size={14} className="stroke-[2.5]" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteNotification(notif._id)}
                                                                className="p-2 border border-border rounded-lg bg-card text-muted-foreground hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95 shadow-sm"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {pagination.totalPages > 1 && (
                        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Page {pagination.page} of {pagination.totalPages}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => goToPage(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted/50 disabled:opacity-50 disabled:hover:bg-card text-xs font-bold text-foreground transition-all shadow-sm active:scale-95"
                                >
                                    <ChevronLeft size={14} />
                                    Previous
                                </button>
                                <button
                                    onClick={() => goToPage(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted/50 disabled:opacity-50 disabled:hover:bg-card text-xs font-bold text-foreground transition-all shadow-sm active:scale-95"
                                >
                                    Next
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default NotificationPage;
