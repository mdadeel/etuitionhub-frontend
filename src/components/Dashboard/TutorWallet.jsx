import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, Clock, ArrowDownToLine, Banknote, Percent } from 'lucide-react';
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/skeletons";
import DataTable from "@/components/ui/data-table";
import { useRealtimeStore } from '../../store/realtimeStore';
import { useWalletQuery } from '../../hooks/useWalletQuery';
import api from '../../services/api';
import StatusBadge from '../shared/StatusBadge';
import DashboardPageHeader from '../shared/DashboardPageHeader';
import EmptyState from '../shared/EmptyState';

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
    const [commissionPct, setCommissionPct] = useState(null);

    useEffect(() => {
        api.get('/api/settings/public').then(res => {
            if (res.data?.commission_percentage) setCommissionPct(Number(res.data.commission_percentage));
        }).catch(() => {});
    }, []);

    // Live snapshot wins over the cached server value (covers the gap between
    // a socket event and the React Query refetch).
    const wallet = useMemo(() => {
        if (!data?.wallet) return null;
        return walletSnapshot ? { ...data.wallet, ...walletSnapshot } : data.wallet;
    }, [data, walletSnapshot]);
    const recentPayments = data?.recentPayments || [];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))}
                </div>
                <TableSkeleton rows={5} columns={4} />
            </div>
        );
    }
    if (isError || !wallet) return null;

    return (
        <div className="space-y-8 animate-in fade-in animate-fade-in-up duration-700">
            <DashboardPageHeader
                category="Tutor Wallet"
                title="Earnings Overview"
                subtitle="Track available balance, pending earnings, and withdrawal history."
                action={
                    <Link
                        to="/dashboard/withdraw"
                        className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all active:scale-[0.98]"
                    >
                        <ArrowDownToLine size={14} /> Withdraw Funds
                    </Link>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BalanceCard icon={Wallet} label="Available" amount={wallet.availableBalance} accent="emerald" subtitle="Ready to withdraw" />
                <BalanceCard icon={Clock} label="Pending" amount={wallet.pendingBalance} accent="amber" subtitle="Withdrawal in progress" />
                <BalanceCard icon={TrendingUp} label="Total Earned" amount={wallet.totalEarnings} accent="blue" subtitle="All time (net)" />
                <BalanceCard icon={Banknote} label="Total Withdrawn" amount={wallet.totalWithdrawn} accent="zinc" subtitle="Paid out" />
            </div>

            {commissionPct !== null && (
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border rounded-lg w-fit">
                    <Percent size={12} className="text-muted-foreground" />
                    <span className="text-[10px] font-label font-semibold text-muted-foreground uppercase tracking-wider">
                        Platform commission: {commissionPct}%
                    </span>
                </div>
            )}

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Recent Earnings</h3>
                </div>
                {recentPayments.length === 0 ? (
                    <EmptyState icon={Wallet} title="No earnings yet" />
                ) : (
                    <DataTable
                        rowKey={(p) => p._id}
                        columns={[
                            { key: 'studentEmail', label: 'Student', render: (val) => (val || '').split('@')[0] },
                            { key: 'grossAmount', label: 'Gross', render: (val) => <span className="font-heading font-bold tabular-nums">৳{val}</span> },
                            { key: 'commissionAmount', label: 'Commission', render: (val) => <span className="font-heading font-bold text-red-600 tabular-nums">{val ? `-৳${val}` : '—'}</span> },
                            { key: 'netTutorAmount', label: 'Net (You)', render: (val) => <span className="font-heading font-bold text-emerald-700 tabular-nums">৳{val}</span> },
                            { key: 'status', label: 'Status', render: (val) => (
                                <StatusBadge status={val} />
                            )},
                        ]}
                        data={recentPayments}
                        emptyState={
                            <EmptyState icon={Wallet} title="No earnings yet" />
                        }
                    />
                )}
            </section>
        </div>
    );
};

// eslint-disable-next-line no-unused-vars
const BalanceCard = ({ icon: Icon, label, amount, accent, subtitle }) => {
    const colors = {
        emerald: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-700 bg-amber-500/10 border-amber-500/20',
        blue: 'text-blue-700 bg-blue-500/10 border-blue-500/20',
        zinc: 'text-zinc-700 bg-zinc-500/10 border-zinc-500/20',
    };
    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                <div className={`size-8 rounded-lg flex items-center justify-center border ${colors[accent]}`}>
                    <Icon size={14} />
                </div>
            </div>
            <p className="text-3xl font-heading font-bold text-foreground tabular-nums tracking-tighter">৳{(amount || 0).toLocaleString()}</p>
            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">{subtitle}</p>
        </div>
    );
};

export default TutorWallet;
