import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Users, Zap, Layers, Banknote, Database } from 'lucide-react';
import { useAnalyticsQuery } from '../../hooks/queries/useAnalyticsQuery';
import { useAllPaymentsQuery } from '../../hooks/queries/usePaymentsQuery';

const EMERALD_PRIMARY = '#10b981';
const COLORS = [EMERALD_PRIMARY, '#3b82f6', '#6366f1', '#f43f5e'];

/**
 * DashAnalytics Component
 * Refactored to "Figma-inspired Human Crafted"
 * Features: Professional metrics, restrained geometry, smart layout
 */
const DashAnalytics = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [stats, setStats] = useState({
        totalUsers: 0, totalTutors: 0, totalStudents: 0, totalAdmins: 0,
        totalTuitions: 0, pendingTuitions: 0, approvedTuitions: 0, totalRevenue: 0
    });
    const [transactions, setTransactions] = useState([]);

    const { data: statsData, isLoading: statsLoading, isError: statsError } = useAnalyticsQuery();
    const { data: paymentsData } = useAllPaymentsQuery({ limit: 50 });

    // Core: prefer /analytics/stats (cached + invalidated by socket).
    // Fallback: aggregate from raw endpoints only if stats endpoint is down.
    useEffect(() => {
        if (statsData && !statsError) {
            setStats({
                totalUsers: statsData.totalUsers ?? 0,
                totalTutors: statsData.totalTutors ?? 0,
                totalStudents: statsData.totalStudents ?? 0,
                totalAdmins: statsData.totalAdmins ?? 0,
                totalTuitions: statsData.totalTuitions ?? 0,
                pendingTuitions: statsData.pendingTuitions ?? 0,
                approvedTuitions: statsData.approvedTuitions ?? 0,
                totalRevenue: statsData.totalRevenue ?? 0,
            });
        } else if (statsError) {
            // eslint-disable-next-line react-hooks/immutability
            loadFallback();
        }
    }, [statsData, statsError]);

    useEffect(() => {
        if (Array.isArray(paymentsData)) setTransactions(paymentsData);
    }, [paymentsData]);

    const loadFallback = async () => {
        try {
            const [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
                api.get('/api/users'),
                api.get('/api/tuitions'),
                api.get('/api/payments/all').catch(() => ({ data: [] }))
            ]);

            const users = usersRes.data?.data || usersRes.data || [];
            const tuitions = tuitionsRes.data?.data || tuitionsRes.data || [];
            const payments = paymentsRes.data?.data || paymentsRes.data || [];

            const tutors = users.filter(u => u.role === 'tutor').length;
            const students = users.filter(u => u.role === 'student').length;
            const admins = users.filter(u => u.role === 'admin').length;
            const pending = tuitions.filter(t => t.status === 'pending').length;
            const approved = tuitions.filter(t => t.status === 'approved').length;
            const completed = payments.filter(p => p.status === 'verified');
            const revenue = completed.reduce((sum, p) => sum + (p.grossAmount || 0), 0);

            setTransactions(payments);
            setStats({
                totalUsers: users.length, totalTutors: tutors,
                totalStudents: students, totalAdmins: admins,
                totalTuitions: tuitions.length, pendingTuitions: pending,
                approvedTuitions: approved, totalRevenue: revenue
            });
        } catch {
            console.error('Fallback systems failure');
        }
    };

    const userDist = [
        { name: 'Students', value: stats.totalStudents },
        { name: 'Tutors', value: stats.totalTutors },
        { name: 'Admins', value: stats.totalAdmins }
    ];

    const tuitionStatus = [
        { name: 'Pending', count: stats.pendingTuitions, fill: '#3f3f46' },
        { name: 'Approved', count: stats.approvedTuitions, fill: EMERALD_PRIMARY }
    ];

    if (statsLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-10 animate-in fade-in duration-500 animate-fade-in-up">
            <header className="mb-8 border-b border-border pb-6">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-1.5 bg-primary rounded-lg"></div>
                    <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Operations Control</span>
                </div>
                <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">Platform Insights</h2>
                <p className="text-xs text-muted-foreground mt-1">Real-time performance metrics and user distribution tracking.</p>
            </header>

            {/* Core KPI Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    unit="Accounts"
                    icon={Users}
                />
                <StatCard
                    title="Active Tuitions"
                    value={stats.totalTuitions}
                    unit="Postings"
                    icon={Zap}
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pendingTuitions}
                    unit="Reviews"
                    icon={Layers}
                />
                <StatCard
                    title="Total Revenue"
                    value={`৳${stats.totalRevenue.toLocaleString()}`}
                    unit="BDT"
                    icon={Banknote}
                    isPrimary
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribution Matrix */}
                <div className="bg-card border border-border p-5 md:p-6 rounded-xl relative overflow-hidden">
                    <div className="mb-4">
                        <h3 className="text-xs md:text-sm font-heading font-bold uppercase tracking-wider text-foreground">User Distribution</h3>
                        <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">Breakdown by user roles</p>
                    </div>
                    
                    <div className="h-[220px] md:h-[260px] min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} aspect={undefined}>
                            <PieChart>
                                <Pie
                                    data={userDist}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {userDist.map((entry, i) => (
                                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: isDark ? '#0f172e' : 'white', 
                                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,46,0.12)', 
                                        borderRadius: '0px',
                                        padding: '8px 12px',
                                        boxShadow: 'none'
                                    }}
                                    itemStyle={{ 
                                        color: isDark ? '#f8fafc' : '#111827',
                                        fontWeight: 800, 
                                        fontSize: '11px',
                                        fontFamily: 'Space Grotesk'
                                    }}
                                />
                                <Legend 
                                    iconType="rect" 
                                    wrapperStyle={{ 
                                        paddingTop: '20px', 
                                        fontSize: '10px', 
                                        fontWeight: 800,
                                        fontFamily: 'Space Grotesk',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        color: isDark ? '#94a3b8' : '#5B6475'
                                    }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Operations Lifecycle */}
                <div className="bg-card border border-border p-5 md:p-6 rounded-xl relative overflow-hidden">
                    <div className="mb-4">
                        <h3 className="text-xs md:text-sm font-heading font-bold uppercase tracking-wider text-foreground">Tuition Status</h3>
                        <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">Current status of tuition postings</p>
                    </div>
                    
                    <div className="h-[220px] md:h-[260px] min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} aspect={undefined}>
                            <BarChart data={tuitionStatus} barSize={32}>
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,46,0.06)"} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 800, fontFamily: 'Space Grotesk', fill: isDark ? '#94a3b8' : '#5B6475' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 800, fontFamily: 'Space Grotesk', fill: isDark ? '#94a3b8' : '#5B6475' }}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,46,0.02)' }}
                                    contentStyle={{ 
                                        backgroundColor: isDark ? '#0f172e' : 'white', 
                                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,46,0.12)', 
                                        borderRadius: '0px'
                                    }}
                                    itemStyle={{ color: isDark ? '#f8fafc' : '#111827', fontWeight: 800, fontSize: '11px', fontFamily: 'Space Grotesk' }}
                                />
                                <Bar dataKey="count">
                                    {tuitionStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Yield Real-time Matrix */}
            <div className="bg-card border border-border rounded-xl overflow-hidden relative">
                <div className="px-6 py-5 border-b border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xs md:text-sm font-heading font-bold uppercase tracking-wider text-foreground">Recent Transactions</h3>
                        <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">Latest BDT Payment Operations</p>
                    </div>
                    <span className="rounded-lg bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-[10px] font-label font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="size-1.5 bg-primary rounded-lg animate-pulse"></span>
                        Live Sync
                    </span>
                </div>
                
                {transactions.length === 0 ? (
                    <div className="p-16 text-center">
                        <Database size={32} className="text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">No recent transactions found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-transparent border-b border-border text-muted-foreground">
                                    <th className="hidden md:table-cell px-6 py-4 text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Transaction ID</th>
                                    <th className="px-4 md:px-6 py-4 text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Node</th>
                                    <th className="px-4 md:px-6 py-4 text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground text-center">Yield</th>
                                    <th className="px-4 md:px-6 py-4 text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[rgba(15,23,46,0.06)]">
                                {transactions.slice(0, 8).map((tx) => (
                                    <tr key={tx._id} className="hover:bg-accent hover:text-accent-foreground transition-colors">
                                        <td className="hidden md:table-cell px-6 py-4">
                                            <span className="text-xs font-mono font-medium text-muted-foreground">#{tx._id.slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs md:text-sm font-bold text-foreground leading-tight">{(tx.studentEmail || '').split('@')[0]}</span>
                                                <span className="hidden md:inline text-xs text-muted-foreground mt-0.5">{tx.studentEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-center">
                                            <span className="text-xs md:text-sm font-heading font-black text-primary tabular-nums">৳{tx.amount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <span className={`px-2.5 py-1 text-[10px] font-label font-semibold uppercase tracking-wider rounded-lg border ${tx.status === 'verified'
                                                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                                                : tx.status === 'rejected'
                                                ? 'bg-red-500/10 text-red-700 border-red-500/20'
                                                : 'bg-orange-500/10 text-orange-700 border-orange-500/20'
                                                }`}>
                                                {tx.status === 'pending_verification' ? 'Verify' : tx.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, isPrimary = false }) => {
    const IconComponent = icon;
    return (
        <div className={cn(
            "p-4 md:p-6 bg-card border border-border rounded-xl relative overflow-hidden border-l-[5px]",
            isPrimary ? "border-l-primary" : "border-l-[#1E293B]"
        )}>
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                        "size-9 flex items-center justify-center rounded-lg border",
                        isPrimary ? "bg-primary/10 text-primary border-primary/20" : "bg-background text-muted-foreground border-border"
                    )}>
                        <IconComponent size={16} strokeWidth={2.5} />
                    </div>
                </div>

                <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    {title}
                </p>

                <div className="flex items-baseline gap-1.5">
                    <span className="text-xl md:text-2xl font-heading font-black tracking-tight text-foreground">
                        {value}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DashAnalytics;
