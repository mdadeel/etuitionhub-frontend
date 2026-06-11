import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Mail, MailOpen, AlertCircle, Send, Loader2, Search } from 'lucide-react';
import api from '../../services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const ImportantMails = () => {
    const { dbUser } = useAuth();
    const isAdmin = dbUser?.role === 'admin';
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletedItems, setDeletedItems] = useState({});
    const [showCompose, setShowCompose] = useState(false);
    const [composeForm, setComposeForm] = useState({ userId: '', subject: '', body: '', type: 'admin' });
    const [userSearch, setUserSearch] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);
    const [sending, setSending] = useState(false);

    const fetchMails = async () => {
        try {
            const res = await api.get('/api/mails');
            setMails(res.data);
        } catch (error) {
            console.error('Failed to fetch mails', error);
            toast.error('Could not load inbox');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMails();
    }, []);

    const searchUsers = async (query) => {
        if (!query || query.length < 2) {
            setUserResults([]);
            return;
        }
        setSearchingUsers(true);
        try {
            const res = await api.get(`/api/users?q=${encodeURIComponent(query)}&limit=10`);
            setUserResults(res.data?.users || res.data || []);
        } catch (error) {
            console.error('Failed to search users', error);
        } finally {
            setSearchingUsers(false);
        }
    };

    const handleSendMail = async () => {
        if (!composeForm.userId || !composeForm.subject || !composeForm.body) {
            toast.error('Please fill in all fields');
            return;
        }
        setSending(true);
        try {
            await api.post('/api/mails/admin/send', composeForm);
            toast.success('Mail sent successfully');
            setComposeForm({ userId: '', subject: '', body: '', type: 'admin' });
            setUserSearch('');
            setUserResults([]);
            setShowCompose(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to send mail');
        } finally {
            setSending(false);
        }
    };

    const markAsRead = async (id, currentStatus) => {
        if (currentStatus) return; // Already read
        try {
            await api.put(`/api/mails/${id}/read`);
            setMails(mails.map(m => m._id === id ? { ...m, isRead: true } : m));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteIntent = (id) => {
        // Mark as pending deletion in UI
        setDeletedItems(prev => ({ ...prev, [id]: true }));
        
        // Auto-delete after 30 seconds if not undone
        const timer = setTimeout(async () => {
            try {
                await api.delete(`/api/mails/${id}`);
                setMails(prev => prev.filter(m => m._id !== id));
            } catch (error) {
                console.error('Failed to delete mail server-side', error);
            }
            setDeletedItems(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        }, 30000);

        // Store timer ID to clear it if undone
        setDeletedItems(prev => ({ ...prev, [`${id}_timer`]: timer }));
    };

    const undoDelete = (id) => {
        const timerId = deletedItems[`${id}_timer`];
        if (timerId) {
            clearTimeout(timerId);
        }
        setDeletedItems(prev => {
            const newState = { ...prev };
            delete newState[id];
            delete newState[`${id}_timer`];
            return newState;
        });
        toast.success('Action undone');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="size-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <Card className="p-6 md:p-8" hover={false}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Important Inbox</h2>
                    <p className="text-sm text-muted-foreground mt-1">Admin notices, booking confirmations, and critical alerts.</p>
                </div>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <Button
                            size="sm"
                            onClick={() => setShowCompose(!showCompose)}
                            className={cn(
                                "text-xs font-heading font-bold uppercase tracking-wider",
                                showCompose ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                            )}
                        >
                            <Send size={12} className="mr-1.5" />
                            Compose
                        </Button>
                    )}
                    <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Mail size={24} />
                    </div>
                </div>
            </div>

            {/* Compose Form */}
            {showCompose && isAdmin && (
                <div className="mb-6 p-5 border border-primary/20 rounded-2xl bg-primary/5 space-y-4">
                    <p className="text-xs font-label font-semibold uppercase tracking-wider text-primary">Compose Mail</p>
                    
                    {/* Recipient Search */}
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
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-3"
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

                    {/* Subject */}
                    <input
                        type="text"
                        value={composeForm.subject}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Subject"
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />

                    {/* Body */}
                    <textarea
                        value={composeForm.body}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, body: e.target.value }))}
                        placeholder="Write your message..."
                        rows={4}
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />

                    {/* Type + Send */}
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
                            <Button size="sm" variant="outline" onClick={() => setShowCompose(false)}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSendMail} disabled={sending}>
                                {sending ? <Loader2 size={12} className="mr-1.5 animate-spin" /> : <Send size={12} className="mr-1.5" />}
                                {sending ? 'Sending...' : 'Send Mail'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {mails.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground bg-background rounded-2xl border border-border">
                    <MailOpen size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium text-foreground">No important mails</p>
                    <p className="text-xs mt-1">You're all caught up!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {mails.map(mail => {
                        const isPendingDelete = deletedItems[mail._id];

                        if (isPendingDelete) {
                            return (
                                <div key={mail._id} className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-2xl">
                                    <span className="text-sm text-red-600 font-medium flex items-center gap-2">
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
                                onClick={() => markAsRead(mail._id, mail.isRead)}
                                className={cn(
                                    "p-5 border rounded-2xl transition-all relative group overflow-hidden cursor-pointer",
                                    mail.isRead 
                                        ? "bg-card border-border" 
                                        : "bg-muted border-primary/20 shadow-sm"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2 pr-10">
                                    <h3 className={cn(
                                        "text-sm", 
                                        mail.isRead ? "font-semibold text-foreground" : "font-bold text-primary"
                                    )}>
                                        {mail.subject}
                                    </h3>
                                    <span className="text-[10px] font-label text-muted-foreground whitespace-nowrap ml-4">
                                        {new Date(mail.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed pr-8 whitespace-pre-line">
                                    {mail.body}
                                </p>

                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteIntent(mail._id);
                                    }}
                                    className="absolute right-4 top-4 size-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default ImportantMails;
