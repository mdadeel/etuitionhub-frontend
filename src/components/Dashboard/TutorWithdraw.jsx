import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowDownToLine, Wallet, AlertCircle, ArrowRight, Phone } from 'lucide-react';
import api from '../../services/api';
import { useWalletQuery } from '../../hooks/useWalletQuery';
import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton, CardSkeleton } from "@/components/shared/skeletons";
import { useWithdrawalsQuery } from '../../hooks/queries/useWithdrawalsQuery';
import { useAuth } from '../../contexts/AuthContext';

const BkashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#D12053"/>
        <path d="M7 7h3.5l2.5 5.5L15.5 7H19l-4.5 9h-3L7 7z" fill="white"/>
    </svg>
);

const NagadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7941D"/>
        <path d="M7 7h4c2.5 0 4 1.5 4 3.5S13.5 14 11 14H7V7zm0 7h4.5c1.8 0 3-1 3-2.5S13.3 9 11.5 9H7v5z" fill="white"/>
    </svg>
);

const RocketIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#8C3494"/>
        <path d="M8 7l4 5-4 5M12 7l4 5-4 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BankIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
    </svg>
);

const METHOD_ICONS = {
    bkash: BkashIcon,
    nagad: NagadIcon,
    rocket: RocketIcon,
    bank: BankIcon,
};

const METHODS = [
    { id: 'bkash', name: 'bKash' },
    { id: 'nagad', name: 'Nagad' },
    { id: 'rocket', name: 'Rocket' },
    { id: 'bank', name: 'Bank Transfer' },
];

const STATUS_COLORS = {
    requested: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    processing: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    paid: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
};

const TutorWithdraw = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { dbUser } = useAuth();
    const { data: walletData, isLoading: walletLoading } = useWalletQuery();
    const { data: withdrawals = [], isLoading: withdrawalsLoading } = useWithdrawalsQuery('me');
    const wallet = walletData?.wallet || null;
    const loading = walletLoading || withdrawalsLoading;
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        amount: '',
        method: 'bkash',
        accountNumber: dbUser?.mobileNumber || '',
        accountName: '',
    });

    // One-time prefill from user profile — intentionally omit form.accountNumber
    useEffect(() => {
        if (dbUser?.mobileNumber && !form.accountNumber) {
            setForm(prev => ({ ...prev, accountNumber: dbUser.mobileNumber }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dbUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        const amount = Number(form.amount);
        if (!amount || amount < 1000) {
            toast.error('Minimum withdrawal is ৳1000');
            return;
        }
        if (amount > (wallet?.availableBalance || 0)) {
            toast.error(`Insufficient balance. Available: ৳${wallet?.availableBalance}`);
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/api/wallet/withdraw', {
                amount,
                method: form.method,
                accountNumber: form.accountNumber.trim(),
                accountName: form.accountName.trim(),
                mobileNumber: dbUser?.mobileNumber || form.accountNumber.trim(),
            });
            toast.success('Withdrawal requested. Admin will process it shortly.');
            setForm({ amount: '', method: 'bkash', accountNumber: '', accountName: '' });
            queryClient.invalidateQueries({ queryKey: ['wallet', 'me'] });
            queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Request failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="grid lg:grid-cols-2 gap-6">
                <FormSkeleton fields={4} />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <CardSkeleton key={i} className="p-4 space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24 rounded-lg" />
                                <Skeleton className="h-4 w-16 rounded-lg" />
                            </div>
                            <Skeleton className="h-3 w-32 rounded-lg" />
                        </CardSkeleton>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in animate-fade-in-up duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 bg-emerald-500 rounded-lg"></div>
                        <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Withdraw</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">Withdraw Funds</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Available: <span className="font-heading font-bold text-emerald-700">৳{wallet?.availableBalance?.toLocaleString()}</span>
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/wallet')}
                    className="inline-flex items-center gap-2 h-10 px-6 rounded-lg border border-border text-foreground text-[10px] font-heading font-bold uppercase tracking-widest hover:bg-muted/30 transition-all active:scale-[0.98]"
                >
                    <Wallet size={14} /> Back to Wallet
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-6">
                    <h3 className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Request Withdrawal</h3>

                    <div className="space-y-2">
                        <label className="text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Amount (৳)</label>
                        <input
                            type="number"
                            min="1000"
                            step="100"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            className="w-full h-12 rounded-lg border border-border bg-background px-4 font-heading font-bold text-2xl text-foreground tabular-nums focus:outline-none focus:border-emerald-500"
                            placeholder="5000"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Method</label>
                        <div className="grid grid-cols-2 gap-2">
                            {METHODS.map((m) => {
                                const Icon = METHOD_ICONS[m.id];
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setForm({ ...form, method: m.id })}
                                        className={`h-12 px-4 rounded-lg border flex items-center gap-3 transition-all active:scale-[0.98] ${form.method === m.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-border hover:border-foreground/20'}`}
                                    >
                                        <Icon />
                                        <span className="text-xs font-heading font-bold uppercase tracking-widest">{m.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Account Number / Phone</label>
                        <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                            <input
                                type="text"
                                value={form.accountNumber}
                                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                                className="w-full h-12 rounded-lg border border-border bg-background pl-9 pr-4 font-bold tabular-nums focus:outline-none focus:border-emerald-500"
                                placeholder="01XXXXXXXXX"
                                required
                            />
                        </div>
                        {dbUser?.mobileNumber && form.accountNumber === dbUser.mobileNumber && (
                            <p className="text-[10px] text-muted-foreground/60">Pre-filled from your profile. Edit if different.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60">Account Name</label>
                        <input
                            type="text"
                            value={form.accountName}
                            onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                            className="w-full h-12 rounded-lg border border-border bg-background px-4 font-bold focus:outline-none focus:border-emerald-500"
                            placeholder="Name on account"
                            required
                        />
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/20 p-4 flex items-start gap-3">
                        <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-foreground/70 leading-relaxed">
                            Withdrawals are reviewed by admin and processed within 24-48 hours. Funds move from your available balance to pending until transfer is complete.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !form.amount || !form.accountNumber || !form.accountName}
                        className="w-full h-12 rounded-lg bg-primary text-primary-foreground text-[11px] font-heading font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        {submitting ? 'Submitting…' : <>Request Withdrawal <ArrowRight size={14} /></>}
                    </button>
                </form>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Withdrawal History</h3>
                    {withdrawals.length === 0 ? (
                        <div className="py-20 text-center bg-card border border-border rounded-xl">
                            <ArrowDownToLine size={32} className="text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
                            <p className="text-[10px] font-heading font-bold text-muted-foreground/60 uppercase tracking-[0.25em]">
                                No withdrawal requests yet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {withdrawals.map((w) => (
                                <div key={w._id} className="bg-card border border-border rounded-xl p-5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-heading font-bold text-foreground tabular-nums">৳{w.amount?.toLocaleString()}</p>
                                        <span className={`px-2 py-0.5 text-[9px] font-heading font-bold uppercase tracking-widest rounded-lg border ${STATUS_COLORS[w.status]}`}>
                                            {w.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground/70">
                                        <span className="uppercase tracking-widest flex items-center gap-1.5">
                                            {(() => { const Icon = METHOD_ICONS[w.method]; return Icon ? <Icon /> : null; })()}
                                            {w.method} · {w.accountNumber}
                                        </span>
                                        <span className="tabular-nums">{new Date(w.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {w.rejectionReason && (
                                        <p className="text-[10px] text-red-700 bg-red-500/5 border border-red-500/20 p-2 rounded-lg">
                                            Rejected: {w.rejectionReason}
                                        </p>
                                    )}
                                    {w.transferTransactionId && (
                                        <p className="text-[10px] text-emerald-700 bg-emerald-500/5 border border-emerald-500/20 p-2 rounded-lg">
                                            Transfer ID: <span className="font-mono">{w.transferTransactionId}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorWithdraw;
