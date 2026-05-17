import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
    Banknote, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    Database,
    TrendingUp
} from "lucide-react";
import { AppleCard, AppleHeader } from '../shared/AppleUI';
import { cn } from '@/lib/utils';

const PAYMENT_METHOD_LABELS = {
    bkash: { name: 'bKash', color: 'bg-[#D12053]' },
    nagad: { name: 'Nagad', color: 'bg-[#F7941D]' },
    rocket: { name: 'Rocket', color: 'bg-[#8C3494]' },
    bank: { name: 'Bank Transfer', color: 'bg-primary' }
};

const StudentPayments = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchPayments = useCallback(async () => {
        if (!user?.email) return;
        try {
            const res = await api.get(`/api/payments/student/${user.email}`);
            setPayments(res.data || []);
        } catch {
            toast.error('Failed to load payment history');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const stats = useMemo(() => {
        const total = payments.length;
        const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const pending = payments.filter(p => p.status === 'pending_verification').length;
        const completed = payments.filter(p => p.status === 'verified').length;
        return { total, totalSpent, pending, completed };
    }, [payments]);

    const filteredPayments = useMemo(() => {
        if (filter === 'all') return payments;
        return payments.filter(p => p.status === filter);
    }, [payments, filter]);

    const filterOptions = [
        { id: 'all', label: 'All', count: stats.total },
        { id: 'pending_verification', label: 'Pending', count: stats.pending },
        { id: 'verified', label: 'Verified', count: payments.filter(p => p.status === 'verified').length },
        { id: 'completed', label: 'Verified', count: payments.filter(p => p.status === 'verified').length },
        { id: 'rejected', label: 'Rejected', count: payments.filter(p => p.status === 'rejected').length }
    ];

    if (loading) return <LoadingSpinner />;

    const getStatusBadge = (status) => {
        const variants = {
            pending_verification: { variant: 'warning', label: 'Pending' },
            verified: { variant: 'primary', label: 'Verified' },
            completed: { variant: 'success', label: 'Completed' },
            rejected: { variant: 'error', label: 'Rejected' }
        };
        const { variant, label } = variants[status] || { variant: 'default', label: status };
        return <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${variant === 'warning' ? 'bg-amber-500/10 text-amber-600' : variant === 'primary' ? 'bg-primary/10 text-primary' : variant === 'success' ? 'bg-green-500/10 text-green-600' : variant === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-muted text-muted-foreground'}`}>{label}</span>;
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <AppleHeader 
                title="Payment History" 
                subtitle="Track all your transactions and payment activities."
                badge={<span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-secondary/10 text-secondary">Financial Records</span>}
                action={
                    <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 rounded-2xl border border-green-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Live Sync</span>
                    </div>
                }
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <AppleCard className="p-6 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <Banknote size={20} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Total Transactions</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground tracking-tight tabular-nums">{stats.total}</span>
                        <span className="text-xs font-medium text-muted-foreground">payments</span>
                    </div>
                </AppleCard>

                <AppleCard className="p-6 group">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Total Spent</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground tracking-tight tabular-nums">৳{stats.totalSpent.toLocaleString()}</span>
                        <span className="text-xs font-medium text-muted-foreground">BDT</span>
                    </div>
                </AppleCard>

                <AppleCard className="p-6 group">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <AlertCircle size={20} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Pending</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground tracking-tight tabular-nums">{stats.pending}</span>
                        <span className="text-xs font-medium text-muted-foreground">awaiting</span>
                    </div>
                </AppleCard>

                <AppleCard className="p-6 group">
                    <div className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={20} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Completed</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground tracking-tight tabular-nums">{stats.completed}</span>
                        <span className="text-xs font-medium text-muted-foreground">verified</span>
                    </div>
                </AppleCard>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-2xl border border-border/40 w-fit max-w-full overflow-x-auto scrollbar-hide">
                {filterOptions.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setFilter(opt.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-300 rounded-xl whitespace-nowrap",
                            filter === opt.id
                                ? "bg-background text-primary shadow-sm shadow-primary/5 border border-border/40"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        {opt.label}
                        <span className={cn(
                            "px-2 py-0.5 text-[10px] rounded-full",
                            filter === opt.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                            {opt.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Payment Table */}
            {filteredPayments.length === 0 ? (
                <AppleCard className="p-16 text-center border-dashed">
                    <Database size={48} className="text-muted-foreground/20 mx-auto mb-6" strokeWidth={1} />
                    <p className="text-sm font-medium text-muted-foreground">No payment records found.</p>
                </AppleCard>
            ) : (
                <AppleCard className="overflow-hidden" hover={false}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/30 border-b border-border/40">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} /> Date
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Tutor</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Method</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Transaction ID</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filteredPayments.map((payment) => {
                                    const method = PAYMENT_METHOD_LABELS[payment.paymentMethod] || { name: payment.paymentMethod || 'N/A', color: 'bg-muted-foreground' };
                                    
                                    return (
                                        <tr key={payment._id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-semibold text-foreground">
                                                    {new Date(payment.createdAt).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {new Date(payment.createdAt).toLocaleTimeString('en-US', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-foreground">{payment.tutorName || 'Tutor'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full", method.color)}></div>
                                                    <span className="text-xs font-semibold text-muted-foreground">{method.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-lg font-bold text-primary tabular-nums">৳{payment.amount?.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">
                                                    {payment.transactionId || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {getStatusBadge(payment.status)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </AppleCard>
            )}
        </div>
    );
};

export default StudentPayments;