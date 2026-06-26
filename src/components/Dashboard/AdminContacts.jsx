import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, MailOpen, AlertCircle, MailPlus } from 'lucide-react';
import api from '../../services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton, LineSkeleton } from '@/components/shared/skeletons';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletedItems, setDeletedItems] = useState({});

    const fetchContacts = async () => {
        try {
            const res = await api.get('/api/contact');
            setContacts(res.data);
        } catch (error) {
            console.error('Failed to fetch contacts', error);
            toast.error('Could not load contact submissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const markAsRead = async (id, currentStatus) => {
        if (currentStatus === 'read') return;
        try {
            await api.patch(`/api/contact/${id}`, { status: 'read' });
            setContacts(contacts.map(c => c._id === id ? { ...c, status: 'read' } : c));
        } catch (error) {
            console.error(error);
            toast.error('Failed to mark as read');
        }
    };

    const handleDeleteIntent = (id) => {
        setDeletedItems(prev => ({ ...prev, [id]: true }));

        const timer = setTimeout(async () => {
            try {
                await api.delete(`/api/contact/${id}`);
                setContacts(prev => prev.filter(c => c._id !== id));
            } catch (error) {
                console.error('Failed to delete contact', error);
            }
            setDeletedItems(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        }, 30000);

        setDeletedItems(prev => ({ ...prev, [`${id}_timer`]: timer }));
    };

    const undoDelete = (id) => {
        const timerId = deletedItems[`${id}_timer`];
        if (timerId) clearTimeout(timerId);
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
            <div className="space-y-4 animate-pulse">
                <div className="flex items-center justify-between border-b border-border pb-6">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-20 rounded-lg" />
                        <Skeleton className="h-6 w-36 rounded-lg" />
                        <Skeleton className="h-3 w-48 rounded-lg" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
                {[...Array(5)].map((_, i) => (
                    <CardSkeleton key={i} className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="size-6 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <LineSkeleton width="1/2" className="h-4" />
                                <LineSkeleton width="1/4" className="h-3" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="size-8 rounded-lg" />
                                <Skeleton className="size-8 rounded-lg" />
                            </div>
                        </div>
                        <LineSkeleton width="full" className="h-3" />
                    </CardSkeleton>
                ))}
            </div>
        );
    }

    return (
        <Card className="p-6 md:p-8" hover={false}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Contact Submissions</h2>
                    <p className="text-sm text-muted-foreground mt-1">Messages submitted through the contact form.</p>
                </div>
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <MailPlus size={24} />
                </div>
            </div>

            {contacts.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground bg-background rounded-2xl border border-border">
                    <MailOpen size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium text-foreground">No contact submissions</p>
                    <p className="text-xs mt-1">When users submit the contact form, they'll appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {contacts.map(contact => {
                        const isPendingDelete = deletedItems[contact._id];
                        const isUnread = contact.status === 'unread';

                        if (isPendingDelete) {
                            return (
                                <div key={contact._id} className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-2xl">
                                    <span className="text-sm text-red-600 font-medium flex items-center gap-2">
                                        <AlertCircle size={16} /> Contact marked for deletion (30s remaining)
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => undoDelete(contact._id)}
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
                                key={contact._id}
                                onClick={() => markAsRead(contact._id, contact.status)}
                                className={cn(
                                    "p-5 border rounded-2xl transition-all relative group overflow-hidden cursor-pointer",
                                    isUnread
                                        ? "bg-muted border-primary/20 shadow-sm"
                                        : "bg-card border-border"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2 pr-10">
                                    <div className="flex items-center gap-3">
                                        <h3 className={cn(
                                            "text-sm",
                                            isUnread ? "font-bold text-primary" : "font-semibold text-foreground"
                                        )}>
                                            {contact.name}
                                        </h3>
                                        <span className="text-[10px] text-muted-foreground">{contact.email}</span>
                                    </div>
                                    <span className="text-[10px] font-label text-muted-foreground whitespace-nowrap ml-4">
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed pr-8 whitespace-pre-line">
                                    {contact.message}
                                </p>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteIntent(contact._id);
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

export default AdminContacts;
