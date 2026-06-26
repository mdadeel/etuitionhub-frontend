import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ArrowDownToLine, Database, CheckCircle2, XCircle, Clock, AlertCircle, Phone } from 'lucide-react';
import api from '../services/api';
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/skeletons";
import { useRealtimeStore } from '../store/realtimeStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusBadge from '../components/shared/StatusBadge';
import DashboardPageHeader from '../components/shared/DashboardPageHeader';
import EmptyState from '../components/shared/EmptyState';

const BkashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#D12053"/>
        <path d="M7 7h3.5l2.5 5.5L15.5 7H19l-4.5 9h-3L7 7z" fill="white"/>
    </svg>
);

const NagadIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7941D"/>
        <path d="M7 7h4c2.5 0 4 1.5 4 3.5S13.5 14 11 14H7V7zm0 7h4.5c1.8 0 3-1 3-2.5S13.3 9 11.5 9H7v5z" fill="white"/>
    </svg>
);

const RocketIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#8C3494"/>
        <path d="M8 7l4 5-4 5M12 7l4 5-4 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BankIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
    </svg>
);

const METHOD_ICONS = { bkash: BkashIcon, nagad: NagadIcon, rocket: RocketIcon, bank: BankIcon };

const FILTERS = [
    { id: 'requested', label: 'Pending', icon: Clock },
    { id: 'processing', label: 'Processing', icon: ArrowDownToLine },
    { id: 'paid', label: 'Paid', icon: CheckCircle2 },
    { id: 'rejected', label: 'Rejected', icon: XCircle },
    { id: '', label: 'All', icon: Database },
];

const AdminWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [filter, setFilter] = useState('requested');
    const [processingId, setProcessingId] = useState(null);

    // Modal state for reject
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [rejectReason, setRejectReason] = useState('Insufficient documentation');

    // Modal state for mark-paid
    const [markPaidOpen, setMarkPaidOpen] = useState(false);
    const [markPaidId, setMarkPaidId] = useState(null);
    const [markPaidTrxId, setMarkPaidTrxId] = useState('');

    const load = useCallback(async (status, isInitial = false) => {
        if (isInitial) setLoading(true);
        try {
            const url = status ? `/api/wallet/admin/withdrawals?status=${status}` : '/api/wallet/admin/withdrawals';
            const res = await api.get(url);
            setWithdrawals(res.data || []);
        } catch {
            toast.error('Failed to load withdrawals');
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, []);

    useEffect(() => { load(filter, initialLoad); }, [filter, load, initialLoad]);

    const lastWithdrawal = useRealtimeStore((s) => s.lastWithdrawal);
    const lastPayment = useRealtimeStore((s) => s.lastPayment);
    useEffect(() => {
        if (lastWithdrawal) load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastWithdrawal]);
    useEffect(() => {
        if (lastPayment) load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastPayment]);

    const handleApprove = async (id) => {
        setProcessingId(id);
        try {
            await api.post(`/api/wallet/admin/withdrawals/${id}/approve`);
            toast.success('Approved — tutor notified');
            await load(filter);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Approval failed');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        setRejectId(id);
        setRejectReason('Insufficient documentation');
        setRejectOpen(true);
    };

    const confirmReject = async () => {
        if (!rejectReason.trim()) return;
        setProcessingId(rejectId);
        setRejectOpen(false);
        try {
            await api.post(`/api/wallet/admin/withdrawals/${rejectId}/reject`, { reason: rejectReason.trim() });
            toast.success('Rejected — tutor notified');
            await load(filter);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Rejection failed');
        } finally {
            setProcessingId(null);
        }
    };

    const handleMarkPaid = async (id) => {
        setMarkPaidId(id);
        setMarkPaidTrxId('');
        setMarkPaidOpen(true);
    };

    const confirmMarkPaid = async () => {
        if (!markPaidTrxId.trim()) return;
        setProcessingId(markPaidId);
        setMarkPaidOpen(false);
        try {
            await api.post(`/api/wallet/admin/withdrawals/${markPaidId}/mark-paid`, { transferTransactionId: markPaidTrxId.trim() });
            toast.success('Marked paid — tutor notified, wallet debited');
            await load(filter);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Mark paid failed');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading && initialLoad) {
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
          <TableSkeleton rows={6} columns={5} />
        </div>
      );
    }

    return (
        <div className="space-y-8">
            <DashboardPageHeader
                category="Financial Operations"
                title="Tutor Withdrawals"
                subtitle="Approve, reject, and mark withdrawal requests as paid."
            />

            <div className="flex flex-wrap bg-background p-1.5 rounded-lg gap-2 border border-border w-fit">
                {FILTERS.map((f) => {
                    const Icon = f.icon;
                    return (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-5 py-2.5 text-[9px] font-heading font-bold uppercase tracking-widest rounded-lg border transition-all flex items-center gap-2 active:scale-[0.98] ${filter === f.id
                                ? 'bg-primary border-primary text-white'
                                : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            <Icon size={12} /> {f.label}
                        </button>
                    );
                })}
            </div>

            {withdrawals.length === 0 ? (
                <EmptyState title="No withdrawal requests in this queue" />
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-background border-b border-border text-muted-foreground">
                                    <th className="hidden lg:table-cell px-6 py-4 text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Date</th>
                                    <th className="px-4 md:px-6 py-4 text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Tutor</th>
                                    <th className="hidden md:table-cell px-6 py-4 text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Method</th>
                                    <th className="px-4 md:px-6 py-4 text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Amount</th>
                                    <th className="hidden xl:table-cell px-6 py-4 text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Account</th>
                                    <th className="px-4 md:px-6 py-4 text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Status</th>
                                    <th className="px-4 md:px-6 py-4 text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60 text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {withdrawals.map((w) => {
                                    const tutor = w.userId || {};
                                    return (
                                        <tr key={w._id} className="hover:bg-muted/30 hover:text-foreground transition-colors">
                                            <td className="hidden lg:table-cell px-6 py-5 text-xs font-mono text-muted-foreground/60 tabular-nums">
                                                {new Date(w.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-4 md:px-6 py-5">
                                                <p className="text-xs font-bold text-foreground">{tutor.displayName || tutor.email || '—'}</p>
                                                {tutor.email && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{tutor.email}</p>}
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    {(() => { const Icon = METHOD_ICONS[w.method]; return Icon ? <Icon /> : null; })()}
                                                    <span className="text-xs font-heading font-bold uppercase tracking-widest text-foreground">{w.method}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-5 text-sm font-heading font-bold text-foreground tabular-nums italic">
                                                ৳{w.amount?.toLocaleString()}
                                            </td>
                                            <td className="hidden xl:table-cell px-6 py-5">
                                                <p className="text-xs font-mono text-foreground">{w.accountNumber}</p>
                                                <p className="text-[10px] text-muted-foreground/60">{w.accountName}</p>
                                                {w.userId?.mobileNumber && (
                                                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                                                        <Phone size={10} /> {w.userId.mobileNumber}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 md:px-6 py-5">
                                                <StatusBadge status={w.status} />
                                                {w.transferTransactionId && (
                                                    <p className="text-[10px] text-emerald-700 mt-1 font-mono">↳ {w.transferTransactionId}</p>
                                                )}
                                            </td>
                                            <td className="px-4 md:px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {w.status === 'requested' && (
                                                        <>
                                                            <ActionBtn onClick={() => handleApprove(w._id)} disabled={processingId === w._id} variant="primary">
                                                                Approve
                                                            </ActionBtn>
                                                            <ActionBtn onClick={() => handleReject(w._id)} disabled={processingId === w._id} variant="danger">
                                                                Reject
                                                            </ActionBtn>
                                                        </>
                                                    )}
                                                    {w.status === 'processing' && (
                                                        <ActionBtn onClick={() => handleMarkPaid(w._id)} disabled={processingId === w._id} variant="success">
                                                            Mark Paid
                                                        </ActionBtn>
                                                    )}
                                                    {w.status === 'paid' && (
                                                        <span className="text-[9px] font-heading font-bold text-emerald-700/50 uppercase tracking-widest">Done</span>
                                                    )}
                                                    {w.status === 'rejected' && (
                                                        <span className="text-[9px] font-heading font-bold text-red-700/50 uppercase tracking-widest">Closed</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reject Withdrawal Dialog */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="sm:max-w-md bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-heading font-bold uppercase tracking-wider">Reject Withdrawal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label className="text-xs font-bold text-muted-foreground">Reason (shown to tutor)</Label>
                        <Input
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="h-12 rounded-none border-border"
                            placeholder="Enter rejection reason..."
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectOpen(false)} className="rounded-none">Cancel</Button>
                        <Button variant="destructive" onClick={confirmReject} className="rounded-none" disabled={!rejectReason.trim()}>Reject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Mark Paid Dialog */}
            <Dialog open={markPaidOpen} onOpenChange={setMarkPaidOpen}>
                <DialogContent className="sm:max-w-md bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-heading font-bold uppercase tracking-wider">Mark as Paid</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label className="text-xs font-bold text-muted-foreground">Transfer Transaction ID</Label>
                        <Input
                            value={markPaidTrxId}
                            onChange={(e) => setMarkPaidTrxId(e.target.value)}
                            className="h-12 rounded-none border-border font-mono"
                            placeholder="e.g. bKash/Nagad trxID"
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMarkPaidOpen(false)} className="rounded-none">Cancel</Button>
                        <Button onClick={confirmMarkPaid} className="rounded-none bg-emerald-500 hover:bg-emerald-600" disabled={!markPaidTrxId.trim()}>Confirm Payment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const actionBtnColors = {
    primary: 'bg-primary border-primary text-white hover:bg-primary/90',
    danger: 'bg-transparent border-transparent text-red-600 hover:border-red-200 hover:bg-red-50',
    success: 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600',
};

const ActionBtn = ({ children, onClick, disabled, variant }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`h-8 px-3 rounded-lg border text-[9px] font-heading font-bold uppercase tracking-widest transition-all disabled:opacity-40 active:scale-[0.98] ${actionBtnColors[variant]}`}
        >
            {children}
        </button>
    );
};

export default AdminWithdrawals;
