import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, Clock, ArrowDownToLine, Banknote, ArrowUpRight } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useRealtimeStore } from '../../store/realtimeStore';
import { useWalletQuery } from '../../hooks/useWalletQuery';

const STATUS_COLORS = {
    pending_verification: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    commission_applied: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    available_for_withdrawal: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    withdrawn: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20',
    rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
};

const TutorWallet = () => {
    const { data, isLoading, isError } = useWalletQuery();
    const walletSnapshot = useRealtimeStore((s) => s.walletSnapshot);

    // Live snapshot wins over the cached server value (covers the gap between
    // a socket event and the React Query refetch).
    const wallet = useMemo(() => {
        if (!data?.wallet) return null;
        return walletSnapshot ? { ...data.wallet, ...walletSnapshot } : data.wallet;
    }, [data, walletSnapshot]);
    const recentPayments = data?.recentPayments || [];

    if (isLoading) return <LoadingSpinner />;
    if (isError || !wallet) return null;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 bg-emerald-500 rounded-none"></div>
                        <span className="text-[9px] font-heading font-black uppercase tracking-[0.25em] text-emerald-600">Tutor Wallet</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight text-foreground">Earnings Overview</h2>
                    <p className="text-xs text-muted-foreground mt-1">Track available balance, pending earnings, and withdrawal history.</p>
                </div>
                <Link
                    to="/dashboard/withdraw"
                    className="inline-flex items-center gap-2 h-10 px-6 rounded-none bg-emerald-500 text-white text-[10px] font-heading font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                >
                    <ArrowDownToLine size={14} /> Withdraw Funds
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BalanceCard icon={Wallet} label="Available" amount={wallet.availableBalance} accent="emerald" subtitle="Ready to withdraw" />
                <BalanceCard icon={Clock} label="Pending" amount={wallet.pendingBalance} accent="amber" subtitle="Withdrawal in progress" />
                <BalanceCard icon={TrendingUp} label="Total Earned" amount={wallet.totalEarnings} accent="blue" subtitle="All time" />
                <BalanceCard icon={Banknote} label="Total Withdrawn" amount={wallet.totalWithdrawn} accent="zinc" subtitle="Paid out" />
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-heading font-black uppercase tracking-widest text-muted-foreground">Recent Earnings</h3>
                </div>
                {recentPayments.length === 0 ? (
                    <div className="py-20 text-center bg-card border border-border rounded-none">
                        <Wallet size={32} className="text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
                        <p className="text-[10px] font-heading font-black text-muted-foreground/60 uppercase tracking-[0.25em]">
                            No earnings yet
                        </p>
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-none overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-background border-b border-border">
                                    <th className="px-6 py-4 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Student</th>
                                    <th className="px-6 py-4 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Gross</th>
                                    <th className="px-6 py-4 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Net</th>
                                    <th className="px-6 py-4 text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {recentPayments.map((p) => (
                                    <tr key={p._id} className="hover:bg-background transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-foreground">{(p.studentEmail || '').split('@')[0]}</td>
                                        <td className="px-6 py-4 text-xs font-heading font-black text-foreground tabular-nums">৳{p.amount}</td>
                                        <td className="px-6 py-4 text-xs font-heading font-black text-emerald-700 tabular-nums">৳{p.netTutorAmount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 text-[9px] font-heading font-black uppercase tracking-widest rounded-none border ${STATUS_COLORS[p.status] || STATUS_COLORS.pending_verification}`}>
                                                {(p.status || '').replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

const BalanceCard = ({ icon: Icon, label, amount, accent, subtitle }) => {
    const colors = {
        emerald: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-700 bg-amber-500/10 border-amber-500/20',
        blue: 'text-blue-700 bg-blue-500/10 border-blue-500/20',
        zinc: 'text-zinc-700 bg-zinc-500/10 border-zinc-500/20',
    };
    return (
        <div className="bg-card border border-border rounded-none p-6 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
                <div className={`size-8 rounded-none flex items-center justify-center border ${colors[accent]}`}>
                    <Icon size={14} />
                </div>
            </div>
            <p className="text-3xl font-heading font-black text-foreground tabular-nums tracking-tighter">৳{(amount || 0).toLocaleString()}</p>
            <p className="text-[9px] font-heading font-black text-muted-foreground/50 uppercase tracking-widest">{subtitle}</p>
        </div>
    );
};

export default TutorWallet;
