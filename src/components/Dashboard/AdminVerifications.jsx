import { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton, LineSkeleton } from '@/components/shared/skeletons';
import DashboardPageHeader from '../shared/DashboardPageHeader';
import EmptyState from '../shared/EmptyState';

const AdminVerifications = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingVerifications = async () => {
        try {
            const res = await api.get('/api/users?verificationStatus=pending_review&limit=50');
            setPendingUsers(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch pending verifications', error);
            toast.error('Could not load pending verifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingVerifications();
    }, []);

    const handleAction = async (userId, action) => {
        const newStatus = action === 'approve' ? 'verified_basic' : 'unverified';
        
        try {
            // Update user status
            await api.patch(`/api/users/${userId}`, {
                verificationStatus: newStatus
            });

            // Send In-App Mail Notification
            await api.post('/api/mails/admin/send', {
                userId,
                subject: action === 'approve' ? 'Verification Approved 🎉' : 'Verification Rejected ⚠️',
                body: action === 'approve' 
                    ? 'Congratulations! Your documents have been verified and your profile now has the Verified Badge.'
                    : 'Unfortunately, your verification documents were rejected. Please ensure they are clear and valid, then re-upload.',
                type: 'admin'
            });

            toast.success(`User ${action}d successfully`);
            setPendingUsers(pendingUsers.filter(u => u._id !== userId));

        } catch (error) {
            console.error('Action failed', error);
            toast.error('Failed to process verification');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-20 rounded-lg" />
                        <Skeleton className="h-6 w-48 rounded-lg" />
                        <Skeleton className="h-3 w-40 rounded-lg" />
                    </div>
                    <Skeleton className="h-6 w-24 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <CardSkeleton key={i} className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="size-10 rounded-none shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <LineSkeleton width="3/4" className="h-4" />
                                    <LineSkeleton width="1/2" className="h-3" />
                                </div>
                            </div>
                            <div className="space-y-3 bg-background/50 p-4 rounded-lg">
                                <LineSkeleton width="1/3" className="h-3" />
                                <LineSkeleton width="full" className="h-3" />
                                <LineSkeleton width="2/3" className="h-3" />
                            </div>
                            <div className="flex gap-3">
                                <Skeleton className="h-10 flex-1 rounded-lg" />
                                <Skeleton className="h-10 flex-1 rounded-lg" />
                            </div>
                        </CardSkeleton>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <DashboardPageHeader
                category="Verification Management"
                title="Pending Verifications"
                subtitle="Review tutor documents to grant the verified badge."
                action={
                    pendingUsers.length > 0 && (
                        <div className="px-4 py-2 bg-amber-500/10 text-amber-700 border border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/25 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-2 w-fit">
                            <ShieldAlert size={12} />
                            {pendingUsers.length} Pending
                        </div>
                    )
                }
            />
 
            {pendingUsers.length === 0 ? (
                <EmptyState icon={CheckCircle} title="All caught up!" description="There are no pending verification requests." />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pendingUsers.map(user => (
                        <div key={user._id} className="border border-border rounded-lg bg-card p-6 shadow-none flex flex-col justify-between">
                             <div>
                                 <div className="flex items-center gap-4 mb-6">
                                     <Avatar className="size-10 rounded-none border border-border shadow-none">
                                         <AvatarImage src={user.photoURL} alt={user.displayName} gender={user.gender} className="object-cover rounded-none" />
                                         <AvatarFallback className="bg-slate-900 border border-slate-800 rounded-none animate-none" />
                                     </Avatar>
                                     <div>
                                         <h3 className="font-bold text-foreground text-sm">{user.displayName}</h3>
                                         <p className="text-xs text-muted-foreground lowercase tracking-tight">{user.email}</p>
                                     </div>
                                 </div>
                                 
                                 <div className="space-y-3 mb-6 bg-background p-4 rounded-lg border border-border/50">
                                     <h4 className="text-[9px] font-label font-semibold text-foreground uppercase tracking-widest">Uploaded Documents</h4>
                                    {user.verificationDocuments && user.verificationDocuments.length > 0 ? (
                                        user.verificationDocuments.map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-muted-foreground">{doc.docType}</span>
                                                <a 
                                                    href={doc.docUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                >
                                                    View File <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground/40 italic">No documents attached.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    className="flex-1 h-10 rounded-lg border border-primary bg-primary text-primary-foreground text-[9px] font-label font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                    onClick={() => handleAction(user._id, 'approve')}
                                >
                                    Approve
                                </button>
                                <button 
                                    className="flex-1 h-10 rounded-lg text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 text-[9px] font-label font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    onClick={() => handleAction(user._id, 'reject')}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminVerifications;
