import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    ShieldCheck, 
    Database, 
    Clock, 
    CheckCircle2, 
    XCircle,
    Banknote,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PAYMENT_METHOD_LABELS = {
    bkash: { name: 'bKash', color: 'bg-[#D12053]' },
    nagad: { name: 'Nagad', color: 'bg-[#F7941D]' },
    rocket: { name: 'Rocket', color: 'bg-[#8C3494]' },
    bank: { name: 'Bank Transfer', color: 'bg-primary' }
};

const DashPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending_verification');
    const [processingId, setProcessingId] = useState(null);

    const loadPayments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/payments/all');
            setPayments(res.data || []);
        } catch {
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPayments();
    }, [loadPayments]);

    const handleVerify = async (id) => {
        if (!confirm('Verify and approve this payment?')) return;
        setProcessingId(id);
        try {
            await api.post(`/api/payments/${id}/approve`);
            toast.success('Payment approved — wallet credited, notifications sent');
            await loadPayments();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Approval failed');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt('Reason for rejection (shown to student):', 'Invalid transaction ID');
        if (!reason || !reason.trim()) return;
        setProcessingId(id);
        try {
            await api.post(`/api/payments/${id}/reject`, { reason: reason.trim() });
            toast.success('Payment rejected — student notified');
            await loadPayments();
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

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Protocol */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 bg-[#2563EB] rounded-none"></div>
                        <span className="text-[9px] font-heading font-black uppercase tracking-[0.25em] text-[#2563EB]">Financial Stream</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight text-foreground">Payment Verification</h2>
                    <p className="text-xs text-muted-foreground mt-1">Systems audit interface for secure financial orchestration.</p>
                </div>
                
                {pendingCount > 0 && (
                    <div className="flex items-center gap-4 px-6 py-4 bg-amber-500/10 border border-amber-500/20 rounded-none shadow-none">
                        <div className="relative flex size-2.5">
                            <span className="animate-ping absolute inline-flex size-full rounded-none bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-none size-2.5 bg-amber-500"></span>
                        </div>
                        <span className="text-[10px] font-heading font-black uppercase tracking-widest text-amber-700">
                            {pendingCount} Critical Action{pendingCount > 1 ? 's' : ''} Required
                        </span>
                    </div>
                )}
            </header>

            {/* Matrix Filters */}
            <div className="flex flex-wrap bg-background p-1.5 rounded-none gap-2 border border-border w-fit backdrop-blur-md">
                {[
                    { id: 'pending_verification', label: 'Verify' },
                    { id: 'confirmed', label: 'Verified' },
                    { id: 'rejected', label: 'Rejected' },
                    { id: 'all', label: 'Universal' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-6 py-2.5 text-[9px] font-heading font-black uppercase tracking-widest rounded-none border transition-all duration-300 ${filter === tab.id
                            ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-none'
                            : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Technical Table Matrix */}
            {filteredPayments.length === 0 ? (
                <div className="py-40 text-center bg-background border border-border rounded-none relative overflow-hidden group">
                    <Database size={48} className="text-muted-foreground/30 mx-auto mb-8 transition-colors duration-700" strokeWidth={1} />
                    <p className="text-[10px] font-heading font-black text-muted-foreground/60 uppercase tracking-[0.25em]">
                        No transaction nodes identified in selected matrix.
                    </p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-none shadow-none overflow-hidden relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background border-b border-border text-muted-foreground">
                                    <th className="hidden lg:table-cell px-8 py-5 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Timestamp</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Source</th>
                                    <th className="hidden md:table-cell px-8 py-5 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Tutor</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Method</th>
                                    <th className="hidden xl:table-cell px-8 py-5 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60 text-center">Reference</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Yield</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                                    <th className="px-4 md:px-8 py-5 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60 text-right">Ops</th>
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
                                                    <div className={`size-2 rounded-none ${method.color}`}></div>
                                                    <span className="text-[9px] md:text-[10px] font-heading font-black text-foreground uppercase tracking-widest">{(method.name || '').split(' ')[0]}</span>
                                                </div>
                                            </td>
                                            <td className="hidden xl:table-cell px-8 py-6 text-center">
                                                <span className="rounded-none border border-[#2563EB]/20 text-[#2563EB] bg-[#2563EB]/10 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest">
                                                    {payment.transactionId}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-8 py-6">
                                                <p className="text-xs md:text-sm font-heading font-black text-foreground tabular-nums italic">৳{payment.grossAmount}</p>
                                            </td>
                                            <td className="px-4 md:px-8 py-6">
                                                <span className={`px-2.5 py-1 text-[9px] font-heading font-black uppercase tracking-widest rounded-none border ${
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
                                                            className="h-8 px-4 rounded-none border border-[#2563EB] bg-[#2563EB] text-white text-[9px] font-heading font-black uppercase tracking-widest hover:bg-[#1D4ED8] transition-all disabled:opacity-50"
                                                        >
                                                            Verify
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(payment._id)}
                                                            disabled={processingId === payment._id}
                                                            className="h-8 px-4 rounded-none text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 text-[9px] font-heading font-black uppercase tracking-widest transition-all disabled:opacity-50"
                                                        >
                                                            Drop
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] font-heading font-black text-muted-foreground/30 uppercase tracking-[0.2em] italic">Done</span>
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
        </div>
    );
};

export default DashPayments;
