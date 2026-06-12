import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Skeleton } from "@/components/ui/skeleton";
import { 
    ShieldCheck, 
    Database, 
    Clock, 
    CheckCircle2, 
    XCircle,
    Banknote,
    Activity,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
const BankTransferIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
    </svg>
);

const METHOD_ICONS = { bkash: BkashIcon, nagad: NagadIcon, rocket: RocketIcon, bank: BankTransferIcon };

const PAYMENT_METHOD_LABELS = {
    bkash: { name: 'bKash' },
    nagad: { name: 'Nagad' },
    rocket: { name: 'Rocket' },
    bank: { name: 'Bank Transfer' }
};

const DashPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending_verification');
    const [processingId, setProcessingId] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 25;

    // Modal state for approve confirm
    const [approveOpen, setApproveOpen] = useState(false);
    const [approveId, setApproveId] = useState(null);

    // Modal state for reject
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [rejectReason, setRejectReason] = useState('Invalid transaction ID');

    const loadPayments = useCallback(async (pageNum = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/payments/all?page=${pageNum}&limit=${limit}`);
            const data = res.data;
            // Backend returns { payments, total, page, limit } or just array
            if (Array.isArray(data)) {
                setPayments(data);
                setTotal(data.length);
            } else {
                setPayments(data.payments || []);
                setTotal(data.total || 0);
            }
        } catch {
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPayments(page);
    }, [loadPayments, page]);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setPage(1);
    }, [filter]);

    const handleVerify = async (id) => {
        setApproveId(id);
        setApproveOpen(true);
    };

    const confirmApprove = async () => {
        setProcessingId(approveId);
        setApproveOpen(false);
        try {
            await api.post(`/api/payments/${approveId}/approve`);
            toast.success('Payment approved — wallet credited, notifications sent');
            await loadPayments(page);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Approval failed');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        setRejectId(id);
        setRejectReason('Invalid transaction ID');
        setRejectOpen(true);
    };

    const confirmReject = async () => {
        if (!rejectReason.trim()) return;
        setProcessingId(rejectId);
        setRejectOpen(false);
        try {
            await api.post(`/api/payments/${rejectId}/reject`, { reason: rejectReason.trim() });
            toast.success('Payment rejected — student notified');
            await loadPayments(page);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Rejection failed');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredPayments = filter === 'all'
        ? payments
        : payments.filter(p => p.status === filter);

    const pendingCount = payments.filter(p => p.status === 'pending_verification').length;

    const totalPages = Math.ceil(total / limit);

    if (loading && payments.length === 0) {
        return (
            <div className="space-y-10">
                <header className="border-b border-border pb-6">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </header>
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-lg" />)}
                </div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in-up duration-700">
            {/* Header Protocol */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
<div className="w-6 h-1.5 bg-primary rounded-lg"></div>
                            <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Financial Stream</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">Payment Verification</h2>
                    <p className="text-xs text-muted-foreground mt-1">Systems audit interface for secure financial orchestration.</p>
                </div>
                
                {pendingCount > 0 && (
                    <div className="flex items-center gap-4 px-6 py-4 bg-amber-500/10 border border-amber-500/20 rounded-lg shadow-sm">
                        <div className="relative flex size-2.5">
                            <span className="animate-ping absolute inline-flex size-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full size-2.5 bg-amber-500"></span>
                        </div>
                        <span className="text-[10px] font-label font-semibold uppercase tracking-widest text-amber-700">
                            {pendingCount} Critical Action{pendingCount > 1 ? 's' : ''} Required
                        </span>
                    </div>
                )}
            </header>

            {/* Matrix Filters */}
            <div className="flex flex-wrap bg-background p-1.5 rounded-lg gap-2 border border-border w-fit backdrop-blur-md">
                {[
                    { id: 'pending_verification', label: 'Verify' },
                    { id: 'confirmed', label: 'Verified' },
                    { id: 'rejected', label: 'Rejected' },
                    { id: 'all', label: 'Universal' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-6 py-2.5 text-[9px] font-heading font-bold uppercase tracking-widest rounded-lg border transition-all duration-300 active:scale-[0.98] ${filter === tab.id
                            ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Technical Table Matrix */}
            {filteredPayments.length === 0 ? (
                <div className="py-40 text-center bg-background border border-border rounded-xl relative overflow-hidden group">
                    <Database size={48} className="text-muted-foreground/30 mx-auto mb-8 transition-colors duration-700" strokeWidth={1} />
                    <p className="text-[10px] font-label font-semibold text-muted-foreground/60 uppercase tracking-[0.25em]">
                        No transaction nodes identified in selected matrix.
                    </p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background border-b border-border text-muted-foreground">
                                    <th className="hidden lg:table-cell px-8 py-5 text-[9px] font-label font-semibold uppercase tracking-widest text-muted-foreground/60">Timestamp</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-label font-semibold uppercase tracking-widest text-muted-foreground/60">Source</th>
                                    <th className="hidden md:table-cell px-8 py-5 text-[9px] font-label font-semibold uppercase tracking-widest text-muted-foreground/60">Tutor</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-label font-semibold uppercase tracking-widest text-muted-foreground/60">Method</th>
                                    <th className="hidden xl:table-cell px-8 py-5 text-[9px] font-label font-semibold uppercase tracking-widest text-muted-foreground/60 text-center">Reference</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-label font-semibold uppercase tracking-widest text-muted-foreground/60">Yield</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-label font-semibold uppercase tracking-widest text-muted-foreground/60">Status</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-label font-semibold uppercase tracking-widest text-muted-foreground/60 text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filteredPayments.map((payment) => {
                                    const method = PAYMENT_METHOD_LABELS[payment.paymentMethod] || { name: payment.paymentMethod, color: 'bg-muted-foreground/30' };
                                    
                                    return (
                                        <tr key={payment._id} className="hover:bg-background transition-colors group">
                                            <td className="hidden lg:table-cell px-8 py-6 text-xs font-mono font-bold text-muted-foreground/60 tabular-nums">
                                                {new Date(payment.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-4 md:px-8 py-6">
                                                <p className="text-xs md:text-sm font-bold text-foreground leading-tight">{(payment.studentEmail || '').split('@')[0]}</p>
                                                <p className="text-[9px] md:text-[10px] text-muted-foreground/40 font-bold mt-1 tabular-nums tracking-widest">{payment.senderNumber}</p>
                                            </td>
                                            <td className="hidden md:table-cell px-8 py-6">
                                                <p className="text-sm font-bold text-foreground">{payment.tutorName || '—'}</p>
                                            </td>
                                            <td className="px-4 md:px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    {(() => { const Icon = METHOD_ICONS[payment.paymentMethod]; return Icon ? <Icon /> : null; })()}
                                                    <span className="text-[9px] md:text-[10px] font-label font-semibold text-foreground uppercase tracking-widest">{(method.name || '').split(' ')[0]}</span>
                                                </div>
                                            </td>
                                            <td className="hidden xl:table-cell px-8 py-6 text-center">
                                                <span className="rounded-lg border border-primary/20 text-primary bg-primary/10 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest">
                                                    {payment.transactionId}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-8 py-6">
                                                <p className="text-xs md:text-sm font-heading font-black text-foreground tabular-nums italic">৳{payment.grossAmount}</p>
                                            </td>
                                            <td className="px-4 md:px-8 py-6">
                                                <span className={`px-2.5 py-1 text-[9px] font-heading font-bold uppercase tracking-widest rounded-lg border ${
                                                    payment.status === 'confirmed' || payment.status === 'available_for_withdrawal' || payment.status === 'withdrawn' ? 'text-emerald-700 border-emerald-500/20 bg-emerald-500/10' :
                                                    payment.status === 'rejected' ? 'text-red-700 border-red-500/20 bg-red-500/10' :
                                                    'text-amber-700 border-amber-500/20 bg-amber-500/10'
                                                }`}>
                                                    {payment.status === 'pending_verification' ? 'Verify' :
                                                     payment.status === 'commission_applied' ? 'Commission' :
                                                     payment.status.toUpperCase().replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-8 py-6 text-right">
                                                {payment.status === 'pending_verification' ? (
                                                    <div className="flex items-center justify-end gap-2 md:gap-3">
                                                        <button
                                                            onClick={() => handleVerify(payment._id)}
                                                            disabled={processingId === payment._id}
                                                            className="h-8 px-4 rounded-lg border border-primary bg-primary text-primary-foreground text-[9px] font-heading font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98]"
                                                        >
                                                            Verify
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(payment._id)}
                                                            disabled={processingId === payment._id}
                                                            className="h-8 px-4 rounded-lg text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 text-[9px] font-heading font-bold uppercase tracking-widest transition-all disabled:opacity-50 active:scale-[0.98]"
                                                        >
                                                            Drop
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] font-label font-semibold text-muted-foreground/30 uppercase tracking-[0.2em] italic">Done</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-none h-8"
                        >
                            <ChevronLeft size={14} />
                        </Button>
                        <span className="text-xs font-bold text-muted-foreground px-2">{page}/{totalPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="rounded-none h-8"
                        >
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>
            )}

            {/* Approve Payment Dialog */}
            <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
                <DialogContent className="sm:max-w-md bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-heading font-bold uppercase tracking-wider">Approve Payment</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground py-4">This will apply commission and credit the tutor's wallet. Continue?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveOpen(false)} className="rounded-none">Cancel</Button>
                        <Button onClick={confirmApprove} className="rounded-none">Approve</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Payment Dialog */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="sm:max-w-md bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-heading font-bold uppercase tracking-wider">Reject Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label className="text-xs font-bold text-muted-foreground">Reason (shown to student)</Label>
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
        </div>
    );
};

export default DashPayments;
