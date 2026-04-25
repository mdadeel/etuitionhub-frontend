import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    Activity, 
    Database, 
    Zap, 
    Banknote, 
    ShieldCheck, 
    ArrowUpRight,
    Users,
    Layers,
    LayoutDashboard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EMERALD_PRIMARY = '#10b981';
const ZINC_FOREGROUND = '#18181b';
const ZINC_MUTED = '#71717a';
const COLORS = [EMERALD_PRIMARY, '#3f3f46', '#a1a1aa', '#ef4444'];

/**
 * DashAnalytics Component
 * Refactored to "Figma-inspired Human Crafted"
 * Features: Professional metrics, restrained geometry, smart layout
 */
const DashAnalytics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0, totalTutors: 0, totalStudents: 0, totalAdmins: 0,
        totalTuitions: 0, pendingTuitions: 0, approvedTuitions: 0, totalRevenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const statsRes = await api.get('/api/analytics/stats');
                setStats(statsRes.data);

                const paymentsRes = await api.get('/api/payments/all');
                setTransactions(paymentsRes.data);
            } catch {
                console.error('Core analytics load failed');
                await loadFallback();
            } finally {
                setIsLoading(false);
            }
        };

        const loadFallback = async () => {
            try {
                const [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
                    api.get('/api/users'),
                    api.get('/api/tuitions'),
                    api.get('/api/payments/all').catch(() => ({ data: [] }))
                ]);

                const users = usersRes.data;
                const tuitions = tuitionsRes.data;
                const payments = paymentsRes.data;

                const tutors = users.filter(u => u.role === 'tutor').length;
                const students = users.filter(u => u.role === 'student').length;
                const admins = users.filter(u => u.role === 'admin').length;
                const pending = tuitions.filter(t => t.status === 'pending').length;
                const approved = tuitions.filter(t => t.status === 'approved').length;
                const completed = payments.filter(p => p.status === 'completed');
                const revenue = completed.reduce((sum, p) => sum + (p.amount || 0), 0);

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

        loadData();
    }, []);

    const userDist = [
        { name: 'Students', value: stats.totalStudents },
        { name: 'Tutors', value: stats.totalTutors },
        { name: 'Admins', value: stats.totalAdmins }
    ];

    const tuitionStatus = [
        { name: 'Pending', count: stats.pendingTuitions, fill: '#3f3f46' },
        { name: 'Approved', count: stats.approvedTuitions, fill: EMERALD_PRIMARY }
    ];

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header className="mb-8">
                <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-6 h-1 bg-primary rounded-full"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform Analytics</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-tight">Overview Metrics</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">Real-time performance and user distribution data.</p>
            </header>

            {/* Core KPI Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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
                <div className="bg-card border border-border/60 p-6 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-foreground">User Distribution</h3>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5">Breakdown by user roles</p>
                    </div>
                    
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
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
                                        backgroundColor: 'white', 
                                        border: '1px solid #e5e7eb', 
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                    }}
                                    itemStyle={{ 
                                        color: '#18181b',
                                        fontWeight: 600, 
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend 
                                    iconType="circle" 
                                    wrapperStyle={{ 
                                        paddingTop: '20px', 
                                        fontSize: '12px', 
                                        fontWeight: 500
                                    }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Operations Lifecycle */}
                <div className="bg-card border border-border/60 p-6 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-foreground">Tuition Status</h3>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5">Current status of tuition postings</p>
                    </div>
                    
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tuitionStatus} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 500, fill: ZINC_MUTED }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 500, fill: ZINC_MUTED }}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid #e5e7eb', 
                                        borderRadius: '8px'
                                    }}
                                    itemStyle={{ color: '#18181b', fontWeight: 600, fontSize: '12px' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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
            <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden relative">
                <div className="px-6 py-5 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-foreground">Recent Transactions</h3>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5">Latest payment activities</p>
                    </div>
                    <Badge variant="secondary" className="rounded-md bg-primary/10 text-primary border-none px-3 py-1 text-[10px] font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                        Live Sync
                    </Badge>
                </div>
                
                {transactions.length === 0 ? (
                    <div className="p-16 text-center">
                        <Database size={32} className="text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-sm font-medium text-muted-foreground">No recent transactions found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-transparent border-b border-border/40 text-muted-foreground">
                                    <th className="px-6 py-4 text-xs font-semibold">Transaction ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold">Student</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-center">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {transactions.slice(0, 8).map((tx) => (
                                    <tr key={tx._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-muted-foreground">#{tx._id.slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground mb-0.5">{tx.studentEmail.split('@')[0]}</span>
                                                <span className="text-xs text-muted-foreground">{tx.studentEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-medium text-primary">৳{tx.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Badge className={`rounded-md px-2.5 py-0.5 text-[10px] font-medium ${tx.status === 'completed' || tx.status === 'verified'
                                                ? 'bg-primary/10 text-primary hover:bg-primary/20 border-none'
                                                : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-none'
                                                }`}>
                                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                            </Badge>
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
        <div className={`p-6 bg-card border border-border/60 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group relative overflow-hidden`}>
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isPrimary ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10'
                    }`}>
                        <IconComponent size={18} strokeWidth={2} />
                    </div>
                </div>

                <p className="text-xs font-medium text-muted-foreground mb-1">
                    {title}
                </p>

                <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-semibold tracking-tight text-foreground">
                        {value}
                    </span>
                </div>
            </div>
        </div>
    );
};


export default DashAnalytics;
