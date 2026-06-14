import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Bookmark, BookmarkCheck, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton, LineSkeleton } from '@/components/shared/skeletons';

const SavedSearchAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletedItems, setDeletedItems] = useState({});

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/api/search-alerts');
            setAlerts(res.data);
        } catch (error) {
            console.error('Failed to fetch search alerts', error);
            toast.error('Could not load saved searches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleDeleteIntent = (id) => {
        setDeletedItems(prev => ({ ...prev, [id]: true }));

        const timer = setTimeout(async () => {
            try {
                await api.delete(`/api/search-alerts/${id}`);
                setAlerts(prev => prev.filter(a => a._id !== id));
            } catch (error) {
                console.error('Failed to delete search alert', error);
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
            <CardSkeleton className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32 rounded-lg" />
                        <Skeleton className="h-3 w-48 rounded-lg" />
                    </div>
                    <Skeleton className="size-12 rounded-2xl" />
                </div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 border border-border/50 rounded-2xl">
                            <Skeleton className="size-6 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <LineSkeleton width="2/3" className="h-4" />
                                <LineSkeleton width="1/3" className="h-3" />
                            </div>
                            <Skeleton className="size-8 rounded-lg shrink-0" />
                        </div>
                    ))}
                </div>
            </CardSkeleton>
        );
    }

    return (
        <Card className="p-6 md:p-8" hover={false}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Saved Searches</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage your saved search alerts.</p>
                </div>
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Bookmark size={24} />
                </div>
            </div>

            {alerts.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground bg-background rounded-2xl border border-border">
                    <BookmarkCheck size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium text-foreground">No saved searches</p>
                    <p className="text-xs mt-1">Save a search from the search page to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.map(alert => {
                        const isPendingDelete = deletedItems[alert._id];

                        if (isPendingDelete) {
                            return (
                                <div key={alert._id} className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-2xl">
                                    <span className="text-sm text-red-600 font-medium flex items-center gap-2">
                                        <AlertCircle size={16} /> Search alert marked for deletion (30s remaining)
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => undoDelete(alert._id)}
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
                                key={alert._id}
                                className={cn(
                                    "p-5 border rounded-2xl transition-all relative group overflow-hidden",
                                    "bg-card border-border"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2 pr-10">
                                    <h3 className="text-sm font-semibold text-foreground">
                                        {alert.query || 'All results'}
                                    </h3>
                                    <span className="text-[10px] font-label text-muted-foreground whitespace-nowrap ml-4">
                                        {new Date(alert.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {alert.filters && Object.keys(alert.filters).length > 0 && (
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Filters: {JSON.stringify(alert.filters)}
                                    </p>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteIntent(alert._id);
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

export default SavedSearchAlerts;
