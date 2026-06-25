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
            <div className="flex flex-wrap gap-2 mt-4 border-t-2 border-black/10 dark:border-white/10 pt-3">
                {notif.actions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notif._id, action.action, action.link);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black hover:scale-105 transition-transform active:scale-95"
                    >
                        {action.label}
                        <ExternalLink size={12} />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
            {/* Massive Typographic Hero */}
            <div className="mb-12 border-b-4 border-black dark:border-white pb-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tighter leading-none text-black dark:text-white relative">
                            SYSTEM
                            <span className="block text-[#FF5500]">ALERTS</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-4">
                            <span className="inline-flex items-center justify-center px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-mono font-bold">
                                STATUS: {unreadCount > 0 ? 'ATTENTION REQUIRED' : 'ALL CLEAR'}
                            </span>
                            {unreadCount > 0 && (
                                <span className="font-mono text-sm font-bold text-[#FF5500]">
                                    [{unreadCount} UNREAD]
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 border-2 border-black dark:border-white font-mono text-sm font-bold active:bg-black active:text-white dark:active:bg-white dark:active:text-black transition-colors"
                        >
                            <Filter size={16} />
                            FILTERS
                        </button>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold tracking-widest bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white hover:bg-transparent hover:text-black dark:hover:text-white transition-colors active:scale-95"
                            >
                                <Check size={16} />
                                ACKNOWLEDGE ALL
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Left Panel: Neo-Brutalist Control Panel */}
                <aside className={cn(
                    "w-full md:w-64 flex-shrink-0 md:block transition-all",
                    showFiltersMobile ? "block" : "hidden"
                )}>
                    <div className="sticky top-24 space-y-2">
                        <h3 className="font-mono font-bold text-xs tracking-widest text-muted-foreground mb-4 border-b-2 border-border pb-2">
                            DATA STREAMS
                        </h3>
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = category === cat.id;
                            return (
                                <button
                                    key={cat.label}
                                    onClick={() => setCategory(cat.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 font-mono text-sm transition-all border-2",
                                        isActive
                                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold translate-x-2"
                                            : "border-transparent text-muted-foreground hover:border-black/20 dark:hover:border-white/20 hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={16} />
                                        <span className="uppercase tracking-wider">{cat.label}</span>
                                    </div>
                                    {isActive && <div className="w-2 h-2 bg-[#FF5500] rounded-full animate-pulse" />}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Right Panel: Asymmetric Feed */}
                <main className="flex-1 min-w-0">
                    {/* Batch Actions Float */}
                    {selectedIds.size > 0 && (
                        <div className="flex items-center justify-between p-4 mb-8 bg-[#FF5500] text-white border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                            <span className="font-mono font-bold text-sm tracking-widest">
                                TARGETS ACQUIRED: [{selectedIds.size}]
                            </span>
                            <button
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-white hover:text-black transition-colors font-mono font-bold text-sm"
                            >
                                <Trash2 size={16} />
                                PURGE
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <NotificationListSkeleton count={6} />
                    ) : !Array.isArray(notifications) || notifications.length === 0 ? (
                        <div className="border-4 border-dashed border-muted p-12 text-center">
                            <Info size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="font-mono font-bold text-xl uppercase tracking-widest">No signals detected</h3>
                            <p className="text-muted-foreground mt-2 font-mono text-sm">Your data stream is currently empty.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-4 pb-2 border-b-2 border-black dark:border-white">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center w-6 h-6 border-2 border-black dark:border-white bg-transparent group-hover:bg-black/5 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.size === notifications.length && notifications.length > 0}
                                            onChange={toggleSelectAll}
                                            className="absolute opacity-0 w-full h-full cursor-pointer"
                                        />
                                        {(selectedIds.size === notifications.length && notifications.length > 0) && (
                                            <Check size={14} className="text-black dark:text-white" />
                                        )}
                                    </div>
                                    <span className="font-mono font-bold text-xs tracking-widest uppercase">Select All</span>
                                </label>
                            </div>

                            {notifications.map((notif, index) => {
                                const isSelected = selectedIds.has(notif._id);
                                // Asymmetric styling logic
                                const isEven = index % 2 === 0;
                                
                                return (
                                    <div
                                        key={notif._id}
                                        className={cn(
                                            'relative group transition-all duration-300',
                                            isEven ? 'md:pr-12' : 'md:pl-12' // Asymmetric stagger
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'relative border-4 bg-card p-6 transition-transform duration-300 hover:-translate-y-1 hover:translate-x-1',
                                                notif.isRead ? 'border-black dark:border-white' : 'border-[#FF5500]',
                                                isSelected && 'ring-4 ring-black ring-offset-2 dark:ring-white dark:ring-offset-black',
                                                !notif.isRead && 'shadow-[8px_8px_0px_0px_rgba(255,85,0,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(255,85,0,0.5)]',
                                                notif.isRead && 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]'
                                            )}
                                        >
                                            <div className="absolute -left-3 -top-3 z-10 flex items-center gap-2">
                                                <div className="relative flex items-center justify-center w-6 h-6 border-2 border-black dark:border-white bg-white dark:bg-black cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelect(notif._id)}
                                                        className="absolute opacity-0 w-full h-full cursor-pointer z-20"
                                                    />
                                                    {isSelected && <Check size={14} className="text-black dark:text-white" />}
                                                </div>
                                                
                                                {!notif.isRead && (
                                                    <div className="w-3 h-3 bg-[#FF5500] border-2 border-black dark:border-white rounded-full animate-pulse" />
                                                )}
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "p-3 border-2 border-black dark:border-white",
                                                    notif.isRead ? "bg-muted" : "bg-black text-white dark:bg-white dark:text-black"
                                                )}>
                                                    {getTypeIcon(notif.type, 24)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                        <div>
                                                            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase block mb-2">
                                                                T-{formatRelativeTime(notif.createdAt)}
                                                            </span>
                                                            <h3 className={cn(
                                                                "font-heading font-black text-xl md:text-2xl uppercase tracking-tight leading-tight mb-2",
                                                                !notif.isRead && "text-foreground"
                                                            )}>
                                                                {notif.title}
                                                            </h3>
                                                            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                                                                {notif.message}
                                                            </p>
                                                            {renderActions(notif)}
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {!notif.isRead && (
                                                                <button
                                                                    onClick={() => markAsRead(notif._id)}
                                                                    className="p-2 border-2 border-black dark:border-white bg-green-400 text-black hover:bg-green-500 transition-colors"
                                                                    title="Acknowledge"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteNotification(notif._id)}
                                                                className="p-2 border-2 border-black dark:border-white bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                                title="Purge"
                                                            >
                                                                <Trash2 size={16} />
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
                        <div className="mt-12 pt-8 border-t-4 border-black dark:border-white flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="font-mono font-bold text-sm tracking-widest uppercase">
                                CHUNK [{pagination.page}/{pagination.totalPages}]
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => goToPage(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="flex items-center gap-2 px-6 py-3 border-4 border-black dark:border-white font-mono font-black tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
                                >
                                    <ChevronLeft size={16} />
                                    PREV
                                </button>
                                <button
                                    onClick={() => goToPage(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="flex items-center gap-2 px-6 py-3 border-4 border-black dark:border-white font-mono font-black tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
                                >
                                    NEXT
                                    <ChevronRight size={16} />
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
