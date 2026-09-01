import { useState, useEffect, useCallback, useRef } from 'react';
import { Trash2, RotateCcw, Mail, MailOpen, AlertCircle, Send, Loader2, Search, CheckCheck, Clock, Users, Inbox, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const ImportantMails = () => {
    const { dbUser } = useAuth();
    const isAdmin = dbUser?.globalRole === 'super_admin';
    const [mailTab, setMailTab] = useState('received');
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletedItems, setDeletedItems] = useState({});
    const [showCompose, setShowCompose] = useState(false);
    const [composeForm, setComposeForm] = useState({ userId: '', subject: '', body: '', type: 'admin' });
    const [userSearch, setUserSearch] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendToAll, setSendToAll] = useState(false);
    const [expandedMail, setExpandedMail] = useState(null);
    const debounceRef = useRef(null);
    const deleteTimersRef = useRef({});

    const fetchMails = async (tab) => {
        setLoading(true);
        try {
            const endpoint = tab === 'sent' ? '/api/mails/sent' : '/api/mails';
            const res = await api.get(endpoint);
            setMails(res.data);
        } catch (error) {
            console.error('Failed to fetch mails', error);
            toast.error('Could not load mails');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMails(mailTab);
    }, [mailTab]);

    const searchUsers = useCallback((query) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!query || query.length < 2) {
            setUserResults([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setSearchingUsers(true);
            try {
                const res = await api.get(`/api/users?search=${encodeURIComponent(query)}&limit=10`);
                setUserResults(res.data?.data || res.data?.users || res.data || []);
            } catch (error) {
                console.error('Failed to search users', error);
            } finally {
                setSearchingUsers(false);
            }
        }, 300);
    }, []);

    const handleSendMail = async () => {
        if (sendToAll) {
            if (!composeForm.subject || !composeForm.body) {
                toast.error('Please fill in subject and message');
                return;
            }
            setSending(true);
            try {
                const res = await api.post('/api/mails/admin/send-all', {
                    subject: composeForm.subject,
                    body: composeForm.body,
                    type: composeForm.type,
                });
                toast.success(`Mail sent to ${res.data.count} users`);
                resetCompose();
                fetchMails('sent');
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.error || 'Failed to send mail');
            } finally {
                setSending(false);
            }
        } else {
            if (!composeForm.userId || !composeForm.subject || !composeForm.body) {
                toast.error('Please fill in all fields');
                return;
            }
            setSending(true);
            try {
                await api.post('/api/mails/admin/send', composeForm);
                toast.success('Mail sent successfully');
                resetCompose();
                fetchMails('sent');
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.error || 'Failed to send mail');
            } finally {
                setSending(false);
            }
        }
    };

    const resetCompose = () => {
        setComposeForm({ userId: '', subject: '', body: '', type: 'admin' });
        setUserSearch('');
        setUserResults([]);
        setShowCompose(false);
        setSendToAll(false);
    };

    const markAsRead = async (id, currentStatus) => {
        if (currentStatus) return;
        try {
            await api.put(`/api/mails/${id}/read`);
            setMails(mails.map(m => m._id === id ? { ...m, isRead: true, readAt: new Date().toISOString() } : m));
        } catch (error) {
            console.error(error);
            toast.error('Failed to mark mail as read');
        }
    };

    const handleDeleteIntent = (id) => {
        setDeletedItems(prev => ({ ...prev, [id]: true }));

        const timer = setTimeout(async () => {
            try {
                await api.delete(`/api/mails/${id}`);
                setMails(prev => prev.filter(m => m._id !== id));
            } catch (error) {
                console.error('Failed to delete mail', error);
                toast.error('Failed to delete mail');
            }
            setDeletedItems(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
            delete deleteTimersRef.current[id];
        }, 30000);

        deleteTimersRef.current[id] = timer;
    };

    const undoDelete = (id) => {
        const timerId = deleteTimersRef.current[id];
        if (timerId) {
            clearTimeout(timerId);
            delete deleteTimersRef.current[id];
        }
        setDeletedItems(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
        toast.success('Action undone');
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const unreadCount = mails.filter(m => !m.isRead).length;

    return (
        <Card className="p-6 md:p-8" hover={false}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Important Inbox</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {unreadCount > 0
                            ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
                            : 'All caught up'
                        }
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <Button
                            size="sm"
                            onClick={() => {
                                setShowCompose(!showCompose);
                                setSendToAll(false);
                            }}
                            className={cn(
                                "text-xs font-heading font-bold uppercase tracking-wider",
                                showCompose ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                            )}
                        >
                            <Send size={12} className="mr-1.5" />
                            Compose
                        </Button>
                    )}
                    <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <Mail size={24} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 p-1 bg-muted/50 rounded-xl w-fit">
                <button
                    onClick={() => setMailTab('received')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all",
                        mailTab === 'received'
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Inbox size={14} />
                    Received
                    {mailTab !== 'received' && unreadCount > 0 && (
                        <span className="size-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setMailTab('sent')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all",
                        mailTab === 'sent'
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <ArrowUpRight size={14} />
                    Sent
                </button>
            </div>

            {/* Compose Form */}
            {showCompose && isAdmin && (
                <div className="mb-5 p-5 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-label font-semibold uppercase tracking-wider text-primary">Compose Mail</p>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={sendToAll}
                                onChange={(e) => {
                                    setSendToAll(e.target.checked);
                                    if (e.target.checked) {
                                        setComposeForm(prev => ({ ...prev, userId: '' }));
                                        setUserSearch('');
                                        setUserResults([]);
                                    }
                                }}
                                className="size-4 rounded border-border text-primary focus:ring-primary/20"
                            />
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Users size={12} /> Send to all users
                            </span>
                        </label>
                    </div>

                    {!sendToAll && (
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={userSearch}
                                onChange={(e) => {
                                    setUserSearch(e.target.value);
                                    searchUsers(e.target.value);
                                }}
                                placeholder="Search for a user by name or email..."
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            {searchingUsers && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                                </div>
                            )}
                            {userResults.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {userResults.map(user => (
                                        <button
                                            key={user._id}
                                            onClick={() => {
                                                setComposeForm(prev => ({ ...prev, userId: user._id }));
                                                setUserSearch(user.displayName || user.email);
                                                setUserResults([]);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/30 transition-colors flex items-center gap-3"
                                        >
                                            <div className="size-7 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-[10px] font-bold text-muted-foreground">
                                                    {(user.displayName || user.email)?.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-foreground truncate">{user.displayName}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <input
                        type="text"
                        value={composeForm.subject}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Subject"
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />

                    <textarea
                        value={composeForm.body}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, body: e.target.value }))}
                        placeholder="Write your message..."
                        rows={4}
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />

                    <div className="flex items-center justify-between">
                        <select
                            value={composeForm.type}
                            onChange={(e) => setComposeForm(prev => ({ ...prev, type: e.target.value }))}
                            className="px-3 py-2 text-xs border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="admin">Admin</option>
                            <option value="system">System</option>
                            <option value="promo">Promotional</option>
                        </select>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={resetCompose}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSendMail} disabled={sending}>
                                {sending ? <Loader2 size={12} className="mr-1.5 animate-spin" /> : <Send size={12} className="mr-1.5" />}
                                {sending ? 'Sending...' : sendToAll ? 'Send to All' : 'Send Mail'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mail List */}
            {loading ? (
                <div className="flex items-center justify-center h-32">
                    <Loader2 size={20} className="animate-spin text-muted-foreground" />
                </div>
            ) : mails.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground bg-background rounded-lg border border-border">
                    <MailOpen size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium text-foreground">
                        {mailTab === 'sent' ? 'No sent mails' : 'No received mails'}
                    </p>
                    <p className="text-xs mt-1">
                        {mailTab === 'sent' ? 'Mails you send will appear here' : 'You\'re all caught up!'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {mails.map(mail => {
                        const isPendingDelete = deletedItems[mail._id];
                        const isExpanded = expandedMail === mail._id;

                        if (isPendingDelete) {
                            return (
                                <div key={mail._id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 rounded-lg">
                                    <span className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                                        <AlertCircle size={16} /> Mail marked for deletion (30s remaining)
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => undoDelete(mail._id)}
                                        className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-100"
                                    >
                                        <RotateCcw size={14} className="mr-1.5" />
                                        Undo
                                    </Button>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={mail._id}
                                onClick={() => {
                                    if (mailTab === 'received') markAsRead(mail._id, mail.isRead);
                                    setExpandedMail(isExpanded ? null : mail._id);
                                }}
                                className={cn(
                                    "border rounded-lg transition-all relative group overflow-hidden cursor-pointer",
                                    mailTab === 'received' && !mail.isRead
                                        ? "bg-primary/5 border-primary/20 shadow-sm"
                                        : "bg-card border-border hover:border-border/80"
                                )}
                            >
                                <div className="p-4">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                            {mailTab === 'received' && !mail.isRead && (
                                                <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className={cn(
                                                        "text-sm",
                                                        mailTab === 'received' && !mail.isRead ? "font-bold text-foreground" : "font-semibold text-foreground"
                                                    )}>
                                                        {mail.subject}
                                                    </h3>
                                                    <span className={cn(
                                                        "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                                        mail.type === 'admin' && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
                                                        mail.type === 'system' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                                        mail.type === 'promo' && "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
                                                        mail.type === 'booking' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                                        mail.type === 'security' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                                                    )}>
                                                        {mail.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {mailTab === 'sent' ? `To: ${mail.userId?.displayName || 'User'}` : `From: ${mail.senderName || 'System'}`}
                                                    </span>
                                                    <span className="text-muted-foreground/30">·</span>
                                                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {formatDate(mail.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {mailTab === 'received' && mail.isRead && mail.readAt && (
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1" title={`Read ${new Date(mail.readAt).toLocaleString()}`}>
                                                    <CheckCheck size={12} className="text-primary" />
                                                    Read
                                                </span>
                                            )}
                                            {mailTab === 'sent' && (
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <ArrowUpRight size={12} />
                                                    Sent
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteIntent(mail._id);
                                                }}
                                                className="size-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white dark:bg-red-950/30"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className={cn(
                                        "text-sm text-muted-foreground leading-relaxed mt-2",
                                        !isExpanded && "line-clamp-2"
                                    )}>
                                        {mail.body}
                                    </p>

                                    {!isExpanded && mail.body.length > 100 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedMail(mail._id);
                                            }}
                                            className="text-xs text-primary font-medium mt-1 hover:underline"
                                        >
                                            Read more
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default ImportantMails;
