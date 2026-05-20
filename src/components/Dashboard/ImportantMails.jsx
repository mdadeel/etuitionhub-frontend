import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Mail, MailOpen, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { Card, Button } from '../ui';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const ImportantMails = () => {
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletedItems, setDeletedItems] = useState({});

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
                <div className="w-6 h-6 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <Card className="p-6 md:p-8" hover={false}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#111827]">Important Inbox</h2>
                    <p className="text-sm text-[#5B6475] mt-1">Admin notices, booking confirmations, and critical alerts.</p>
                </div>
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-2xl flex items-center justify-center text-[#2563EB]">
                    <Mail size={24} />
                </div>
            </div>

            {mails.length === 0 ? (
                <div className="py-12 text-center text-[#5B6475] bg-[#F5F7FA] rounded-2xl border border-[rgba(15,23,46,0.08)]">
                    <MailOpen size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium text-[#111827]">No important mails</p>
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
                                        ? "bg-white border-[rgba(15,23,46,0.08)]" 
                                        : "bg-[#EEF2F6] border-[#2563EB]/20 shadow-sm"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2 pr-10">
                                    <h3 className={cn(
                                        "text-sm", 
                                        mail.isRead ? "font-semibold text-[#111827]" : "font-bold text-[#2563EB]"
                                    )}>
                                        {mail.subject}
                                    </h3>
                                    <span className="text-[10px] font-label text-[#5B6475] whitespace-nowrap ml-4">
                                        {new Date(mail.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-[#5B6475] leading-relaxed pr-8 whitespace-pre-line">
                                    {mail.body}
                                </p>

                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteIntent(mail._id);
                                    }}
                                    className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
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
