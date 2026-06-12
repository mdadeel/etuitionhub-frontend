import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ArrowDownToLine, Database, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/skeletons";
import { useRealtimeStore } from '../store/realtimeStore';

const STATUS_COLORS = {
    requested: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    processing: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    paid: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
};

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
    const [filter, setFilter] = useState('requested');
    const [processingId, setProcessingId] = useState(null);

    const load = useCallback(async (status) => {
        setLoading(true);
        try {
            const url = status ? `/api/wallet/admin/withdrawals?status=${status}` : '/api/wallet/admin/withdrawals';
            const res = await api.get(url);
            setWithdrawals(res.data || []);
        } catch {
            toast.error('Failed to load withdrawals');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(filter); }, [filter, load]);

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
        const reason = window.prompt('Reason for rejection (shown to tutor):', 'Insufficient documentation');
        if (!reason || !reason.trim()) return;
        setProcessingId(id);
        try {
            await api.post(`/api/wallet/admin/withdrawals/${id}/reject`, { reason: reason.trim() });
            toast.success('Rejected — tutor notified');
            await load(filter);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Rejection failed');
        } finally {
            setProcessingId(null);
        }
    };

    const handleMarkPaid = async (id) => {
        const trxid = window.prompt('Enter the transfer transaction ID (e.g., bKash/Nagad trxID):', '');
        if (!trxid || !trxid.trim()) return;
        setProcessingId(id);
        try {
            await api.post(`/api/wallet/admin/withdrawals/${id}/mark-paid`, { transferTransactionId: trxid.trim() });
            toast.success('Marked paid — tutor notified, wallet debited');
            await load(filter);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Mark paid failed');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
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
        <div className="space-y-10 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 bg-primary rounded-lg"></div>
                        <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Withdrawal Management</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">Tutor Withdrawals</h2>
                    <p className="text-xs text-muted-foreground mt-1">Approve, reject, and mark withdrawal requests as paid.</p>
                </div>
            </header>

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
                <div className="py-40 text-center bg-background border border-border rounded-xl">
                    <Database size={48} className="text-muted-foreground/30 mx-auto mb-8" strokeWidth={1} />
                    <p className="text-[10px] font-heading font-bold text-muted-foreground/60 uppercase tracking-[0.25em]">
                        No withdrawal requests in this queue
                    </p>
                </div>
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
                                            <td className="hidden md:table-cell px-6 py-5 text-xs font-heading font-bold uppercase tracking-widest text-foreground">
                                                {w.method}
                                            </td>
                                            <td className="px-4 md:px-6 py-5 text-sm font-heading font-bold text-foreground tabular-nums italic">
                                                ৳{w.amount?.toLocaleString()}
                                            </td>
                                            <td className="hidden xl:table-cell px-6 py-5">
                                                <p className="text-xs font-mono text-foreground">{w.accountNumber}</p>
                                                <p className="text-[10px] text-muted-foreground/60">{w.accountName}</p>
                                            </td>
                                            <td className="px-4 md:px-6 py-5">
                                                <span className={`px-2 py-0.5 text-[9px] font-heading font-bold uppercase tracking-widest rounded-lg border ${STATUS_COLORS[w.status]}`}>
                                                    {w.status}
                                                </span>
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
