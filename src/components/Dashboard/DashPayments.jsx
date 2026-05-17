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
        if (!confirm('Verify this payment?')) return;
        setProcessingId(id);
        try {
            await api.patch(`/api/payments/${id}`, { status: 'verified' });
            toast.success('Payment verified');
            await loadPayments();
        } catch {
            toast.error('Verification failed');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Reject this payment?')) return;
        setProcessingId(id);
        try {
            await api.patch(`/api/payments/${id}`, { status: 'rejected' });
            toast.success('Payment rejected');
            await loadPayments();
        } catch {
            toast.error('Rejection failed');
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
        <div className="space-y-10 animate-in fade-in duration-700 selection:bg-primary/30 selection:text-primary">
            {/* Header Protocol */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Financial Stream</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">Payment Verification</h1>
                    <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-xl">Systems audit interface for secure financial orchestration.</p>
                </div>
                
                {pendingCount > 0 && (
                    <div className="flex items-center gap-4 px-6 py-4 bg-amber-600/10 border border-amber-500/20 rounded-2xl group hover:border-amber-500/40 transition-colors shadow-sm">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-apple-sm"></span>
                        </div>
                        <span className="text-xs font-bold text-amber-600 tracking-tight">
                            {pendingCount} Critical Action{pendingCount > 1 ? 's' : ''} Required
                        </span>
                    </div>
                )}
            </header>

            {/* Matrix Filters */}
            <div className="flex flex-wrap bg-muted p-1 rounded-2xl gap-1 w-fit border border-border backdrop-blur-md">
                {[
                    { id: 'pending_verification', label: 'Verify' },
                    { id: 'verified', label: 'Verified' },
                    { id: 'rejected', label: 'Rejected' },
                    { id: 'all', label: 'Universal' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-xl ${filter === tab.id
                            ? 'bg-card text-blue-600 shadow-sm border border-border/60'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Technical Table Matrix */}
            {filteredPayments.length === 0 ? (
                <div className="py-40 text-center bg-muted/10 border border-dashed border-border rounded-none relative overflow-hidden group">
                    <Database size={48} className="text-muted-foreground/20 mx-auto mb-8 group-hover:text-primary/20 transition-colors duration-700" strokeWidth={1} />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">
                        No transaction nodes identified in selected matrix.
                    </p>
                </div>
            ) : (
            <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden relative">
                    <div className="overflow-x-auto selection:bg-primary/30 selection:text-primary">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/20 border-b border-border">
                                    <th className="hidden lg:table-cell px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Timestamp</th>
                                    <th className="px-4 md:px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Source</th>
                                    <th className="hidden md:table-cell px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tutor</th>
                                    <th className="px-4 md:px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Method</th>
                                    <th className="hidden xl:table-cell px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Reference</th>
                                    <th className="px-4 md:px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Yield</th>
                                    <th className="px-4 md:px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-4 md:px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPayments.map((payment) => {
                                    const method = PAYMENT_METHOD_LABELS[payment.paymentMethod] || { name: payment.paymentMethod, color: 'bg-muted-foreground' };
                                    
                                    return (
                                        <tr key={payment._id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="hidden lg:table-cell px-8 py-6 text-xs font-bold text-muted-foreground/60 tabular-nums">
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
                                                    <div className={`w-2 h-2 rounded-full ${method.color}`}></div>
                                                    <span className="text-[9px] md:text-[10px] font-bold text-foreground uppercase tracking-widest">{(method.name || '').split(' ')[0]}</span>
                                                </div>
                                            </td>
                                            <td className="hidden xl:table-cell px-8 py-6 text-center">
                                                <Badge variant="outline" className="rounded-xl border-blue-500/20 text-blue-600 bg-blue-600/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                                                    {payment.transactionId}
                                                </Badge>
                                            </td>
                                            <td className="px-4 md:px-8 py-6">
                                                <p className="text-xs md:text-sm font-bold text-foreground tabular-nums italic">৳{payment.amount}</p>
                                            </td>
                                            <td className="px-4 md:px-8 py-6">
                                                <Badge variant="outline" className={`rounded-full px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${
                                                    (payment.status === 'verified' || payment.status === 'completed') ? 'text-blue-600 border-blue-500/20 bg-blue-600/10' :
                                                    payment.status === 'rejected' ? 'text-red-600 border-red-500/20 bg-red-600/10' :
                                                    'text-amber-600 border-amber-500/20 bg-amber-600/10'
                                                }`}>
                                                    {payment.status === 'pending_verification' ? 'Verify' : payment.status.toUpperCase().replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-4 md:px-8 py-6 text-right">
                                                {payment.status === 'pending_verification' ? (
                                                    <div className="flex items-center justify-end gap-2 md:gap-3">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleVerify(payment._id)}
                                                            disabled={processingId === payment._id}
                                                            className="h-8 md:h-9 px-2 md:px-4 rounded-xl border-blue-500/20 text-blue-600 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <CheckCircle2 size={10} className="md:mr-2" /> <span className="hidden md:inline">Verify</span>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleReject(payment._id)}
                                                            disabled={processingId === payment._id}
                                                            className="h-8 md:h-9 px-2 md:px-4 rounded-xl text-red-600 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-red-600/10 transition-all"
                                                        >
                                                            <XCircle size={10} className="md:mr-2" /> <span className="hidden md:inline">Drop</span>
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] italic">Done</span>
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
