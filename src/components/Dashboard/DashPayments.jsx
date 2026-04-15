import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    ShieldCheck, 
    Database, 
    Clock, 
    ArrowUpRight, 
    CheckCircle2, 
    XCircle,
    User,
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

/**
 * DashPayments Component
 * Refactored to "Technical Emerald Minimalism"
 */
const DashPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending_verification');
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const res = await api.get('/api/payments/all');
            setPayments(res.data || []);
        } catch (err) {
            console.error('Payment load error:', err);
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id) => {
        if (!confirm('Verify this payment as successful?')) return;
        setProcessingId(id);
        try {
            await api.patch(`/api/payments/${id}`, { status: 'verified' });
            toast.success('Payment verified successfully');
            setPayments(prev => prev.map(p => p._id === id ? { ...p, status: 'verified' } : p));
        } catch (err) {
            toast.error('Verification failed');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Reject this payment? This action cannot be undone.')) return;
        setProcessingId(id);
        try {
            await api.patch(`/api/payments/${id}`, { status: 'rejected' });
            toast.success('Payment rejected');
            setPayments(prev => prev.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
        } catch (err) {
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
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-background border-b border-border pb-10">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-1 bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Financial Audit Stream</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic leading-none text-balance">Payment Verification.</h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-6 flex items-center gap-2">
                        <Activity size={12} className="text-primary" /> Systems Audit Interface // Protocol: 0x22A
                    </p>
                </div>
                
                {pendingCount > 0 && (
                    <div className="flex items-center gap-4 px-6 py-4 bg-amber-500/5 border border-amber-500/20 rounded-none group hover:border-amber-500/40 transition-colors">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-none h-3 w-3 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 italic">
                            {pendingCount} Critical Transmission{pendingCount > 1 ? 's' : ''} Pending
                        </span>
                    </div>
                )}
            </header>

            {/* Matrix Filters */}
            <div className="flex flex-wrap bg-muted/20 p-1 rounded-none border border-border gap-1 w-fit">
                {[
                    { id: 'pending_verification', label: 'PENDING_NODES' },
                    { id: 'verified', label: 'VERIFIED_NODES' },
                    { id: 'rejected', label: 'DROPPED_NODES' },
                    { id: 'all', label: 'ALL_LEDGER_LOGS' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-6 py-3 text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-none ${filter === tab.id
                            ? 'bg-background text-primary shadow-sm border border-border'
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
                <div className="bg-background border border-border shadow-2xl overflow-hidden relative">
                    <div className="overflow-x-auto selection:bg-primary/30 selection:text-primary">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted border-b border-border">
                                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Log_TS</th>
                                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Source_Entity</th>
                                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Target_Entity</th>
                                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Protocol</th>
                                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Reference_Hash</th>
                                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Yield</th>
                                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Status</th>
                                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPayments.map((payment) => {
                                    const method = PAYMENT_METHOD_LABELS[payment.paymentMethod] || { name: payment.paymentMethod, color: 'bg-muted-foreground' };
                                    
                                    return (
                                        <tr key={payment._id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tabular-nums tracking-widest">
                                                {new Date(payment.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-[11px] font-black text-foreground uppercase tracking-tight italic leading-none">{payment.studentEmail.split('@')[0]}</p>
                                                <p className="text-[9px] text-muted-foreground font-black mt-1.5 tabular-nums tracking-widest">{payment.senderNumber}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{payment.tutorName || '—'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-none ${method.color} shadow-[0_0_4px_currentColor]`}></div>
                                                    <span className="text-[9px] font-black text-foreground uppercase tracking-widest">{method.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <Badge variant="outline" className="rounded-none border-primary/20 text-primary bg-primary/5 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest">
                                                    {payment.transactionId}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-foreground tabular-nums italic">৳{payment.amount}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="outline" className={`rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                                                    payment.status === 'verified' || payment.status === 'completed' ? 'text-primary border-primary bg-primary/5' :
                                                    payment.status === 'rejected' ? 'text-destructive border-destructive/20 bg-destructive/5' :
                                                    'text-amber-500 border-amber-500/20 bg-amber-500/5'
                                                }`}>
                                                    {payment.status.toUpperCase().replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {payment.status === 'pending_verification' ? (
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleVerify(payment._id)}
                                                            disabled={processingId === payment._id}
                                                            className="h-10 px-4 rounded-none border-primary/30 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                                                        >
                                                            <CheckCircle2 size={12} className="mr-2" /> Verify
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleReject(payment._id)}
                                                            disabled={processingId === payment._id}
                                                            className="h-10 px-4 rounded-none text-destructive text-[9px] font-black uppercase tracking-widest hover:bg-destructive/5 transition-all"
                                                        >
                                                            <XCircle size={12} className="mr-2" /> Drop
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] italic">Audit_Done</span>
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
