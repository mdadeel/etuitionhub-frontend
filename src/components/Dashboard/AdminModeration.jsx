import { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, RefreshCw, ShieldAlert, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton, LineSkeleton } from '@/components/shared/skeletons';
import DashboardPageHeader from '../shared/DashboardPageHeader';
import EmptyState from '../shared/EmptyState';
import { cn } from '@/lib/utils';

const TABS = [
    { id: 'pending', label: 'Pending Review' },
    { id: 'approved', label: 'Approved Tutors' },
];

const AdminModeration = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchTutors = async (tab) => {
        setLoading(true);
        try {
            const endpoint = tab === 'pending' ? '/api/admin/tutors/pending' : '/api/admin/tutors/approved';
            const res = await api.get(endpoint);
            setTutors(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch tutors', error);
            toast.error('Could not load tutors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutors(activeTab);
    }, [activeTab]);

    const handleAction = async (tutorId, action) => {
        setActionLoading(`${action}-${tutorId}`);
        try {
            if (action === 'approve') {
                await api.post(`/api/admin/tutors/${tutorId}/approve`);
                toast.success('Tutor approved successfully');
            } else if (action === 'reject') {
                const reason = prompt('Enter rejection reason:');
                if (!reason || !reason.trim()) {
                    setActionLoading(null);
                    return;
                }
                await api.post(`/api/admin/tutors/${tutorId}/reject`, { reason: reason.trim() });
                toast.success('Tutor rejected');
            } else if (action === 'resubmission') {
                const reason = prompt('Enter what needs to be updated:');
                if (!reason || !reason.trim()) {
                    setActionLoading(null);
                    return;
                }
                await api.post(`/api/admin/tutors/${tutorId}/request-resubmission`, { reason: reason.trim() });
                toast.success('Resubmission requested');
            }
            setTutors(tutors.filter(t => t._id !== tutorId));
        } catch (error) {
            console.error('Action failed', error);
            toast.error(error.response?.data?.error || 'Failed to process action');
        } finally {
            setActionLoading(null);
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
                category="Tutor Moderation"
                title="Review Tutor Applications"
                subtitle="Approve or reject tutor applications to control who appears in search results."
                action={
                    tutors.length > 0 && (
                        <div className="px-4 py-2 bg-amber-500/10 text-amber-700 border border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/25 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-2 w-fit">
                            <ShieldAlert size={12} />
                            {tutors.length} {activeTab === 'pending' ? 'Pending' : 'Approved'}
                        </div>
                    )
                }
            />

            <div className="flex bg-background p-1 rounded-lg gap-1 border border-border w-fit">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-4 py-2 text-[10px] font-label font-semibold uppercase tracking-wider rounded-lg transition-all duration-300",
                            activeTab === tab.id
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {tutors.length === 0 ? (
                <EmptyState
                    icon={activeTab === 'pending' ? ShieldAlert : CheckCircle}
                    title={activeTab === 'pending' ? 'No pending reviews' : 'No approved tutors'}
                    description={activeTab === 'pending' ? 'All tutor applications have been reviewed.' : 'No tutors have been approved yet.'}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tutors.map(tutor => (
                        <div key={tutor._id} className="border border-border rounded-lg bg-card p-6 shadow-none flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="size-10 rounded-none border border-border shadow-none">
                                        <AvatarImage src={tutor.photoURL} alt={tutor.displayName} gender={tutor.gender} className="object-cover rounded-none" />
                                        <AvatarFallback className="bg-slate-900 border border-slate-800 rounded-none animate-none" />
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-foreground text-sm">{tutor.displayName}</h3>
                                        <p className="text-xs text-muted-foreground lowercase tracking-tight">{tutor.email}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {(tutor.subjects || []).slice(0, 4).map(sub => (
                                        <span key={sub} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/40">
                                            {sub}
                                        </span>
                                    ))}
                                </div>

                                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                                    {tutor.qualification && (
                                        <p><span className="font-semibold text-foreground">Qualification:</span> {tutor.qualification}</p>
                                    )}
                                    {tutor.location && (
                                        <p><span className="font-semibold text-foreground">Location:</span> {tutor.location}</p>
                                    )}
                                    {tutor.expectedSalary && (
                                        <p><span className="font-semibold text-foreground">Expected Salary:</span> ৳{tutor.expectedSalary.toLocaleString()}/mo</p>
                                    )}
                                    {tutor.rejectionReason && (
                                        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-lg mt-3">
                                            <p className="text-[10px] font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider mb-1">Rejection Reason</p>
                                            <p className="text-xs text-red-600 dark:text-red-300">{tutor.rejectionReason}</p>
                                        </div>
                                    )}
                                </div>

                                {tutor.verificationDocuments && tutor.verificationDocuments.length > 0 && (
                                    <div className="space-y-2 mb-4 bg-background p-4 rounded-lg border border-border/50">
                                        <h4 className="text-[9px] font-label font-semibold text-foreground uppercase tracking-widest">Uploaded Documents</h4>
                                        {tutor.verificationDocuments.map((doc, idx) => (
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
                                        ))}
                                    </div>
                                )}
                            </div>

                            {activeTab === 'pending' && (
                                <div className="flex items-center gap-3">
                                    <button
                                        className="flex-1 h-10 rounded-lg border border-primary bg-primary text-primary-foreground text-[9px] font-label font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        onClick={() => handleAction(tutor._id, 'approve')}
                                        disabled={actionLoading === `approve-${tutor._id}`}
                                    >
                                        {actionLoading === `approve-${tutor._id}` ? (
                                            <RefreshCw size={12} className="animate-spin" />
                                        ) : (
                                            <CheckCircle size={12} />
                                        )}
                                        Approve
                                    </button>
                                    <button
                                        className="flex-1 h-10 rounded-lg text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 text-[9px] font-label font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        onClick={() => handleAction(tutor._id, 'reject')}
                                        disabled={actionLoading === `reject-${tutor._id}`}
                                    >
                                        {actionLoading === `reject-${tutor._id}` ? (
                                            <RefreshCw size={12} className="animate-spin" />
                                        ) : (
                                            <XCircle size={12} />
                                        )}
                                        Reject
                                    </button>
                                    <button
                                        className="h-10 px-3 rounded-lg text-amber-600 border border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-[9px] font-label font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        onClick={() => handleAction(tutor._id, 'resubmission')}
                                        disabled={actionLoading === `resubmission-${tutor._id}`}
                                    >
                                        <RefreshCw size={12} className={actionLoading === `resubmission-${tutor._id}` ? 'animate-spin' : ''} />
                                        Revise
                                    </button>
                                </div>
                            )}

                            {activeTab === 'approved' && (
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                                        Approved
                                    </span>
                                    {tutor.reviewedAt && (
                                        <span className="text-[10px] text-muted-foreground">
                                            Reviewed {new Date(tutor.reviewedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminModeration;
