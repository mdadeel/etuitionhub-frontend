// analytics dashboard - admin stats view
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

var COLORS = ['#0d9488', '#7c3aed', '#f59e0b', '#ef4444'];

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
            } catch (err) {
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
            } catch (err) {
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
        { name: 'Pending', count: stats.pendingTuitions, fill: '#6366f1' },
        { name: 'Active', count: stats.approvedTuitions, fill: '#10b981' }
    ];

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Capacity"
                    value={stats.totalUsers}
                    unit="Identities"
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    color="teal"
                />
                <StatCard
                    title="Velocity"
                    value={stats.totalTuitions}
                    unit="Operations"
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                    color="violet"
                />
                <StatCard
                    title="Pipeline"
                    value={stats.pendingTuitions}
                    unit="Pending"
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="amber"
                />
                <StatCard
                    title="Yield"
                    value={`৳${stats.totalRevenue}`}
                    unit="Revenue"
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    color="teal"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xs font-black text-[var(--color-text-primary)] tracking-tight">Identity Distribution</h3>
                            <p className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5">User segmentation</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={userDist}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={6}
                                dataKey="value"
                            >
                                {userDist.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '10px' }}
                                itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '9px' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '16px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xs font-black text-[var(--color-text-primary)] tracking-tight">Post Operations</h3>
                            <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5">Lifecycle status</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={tuitionStatus} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fontWeight: 900, fill: 'var(--color-text-muted)' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fontWeight: 900, fill: 'var(--color-text-muted)' }}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--color-surface-muted)' }}
                                contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#0d9488">
                                {tuitionStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden text-[var(--color-text-primary)]">
                <div className="px-8 py-5 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]/20 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-black text-[var(--color-text-primary)] tracking-tight">Yield Logs</h3>
                        <p className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5">Real-time sync</p>
                    </div>
                    <span className="px-3 py-1 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)] text-[8px] font-black uppercase tracking-widest text-teal-600 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                        Live
                    </span>
                </div>
                {transactions.length === 0 ? (
                    <div className="p-20 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-text-muted)]">No yield records identified.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[var(--color-surface-muted)]/10 border-b border-[var(--color-border)]">
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">ID</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Header</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] text-center">Yield</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {transactions.slice(0, 8).map((tx, i) => (
                                    <tr key={tx._id} className="hover:bg-teal-50/10 transition-colors group">
                                        <td className="px-8 py-4">
                                            <span className="text-[10px] font-black text-[var(--color-text-muted)] group-hover:text-teal-600 transition-colors">T-00{i + 1}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-[var(--color-text-primary)] leading-none mb-0.5">{tx.studentEmail.split('@')[0]}</span>
                                                <span className="text-[9px] font-medium text-[var(--color-text-muted)]">{tx.studentEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <span className="text-xs font-black text-teal-600 bg-teal-50/10 px-2 py-0.5 rounded border border-teal-100/20">৳{tx.amount}</span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <span className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg border ${tx.status === 'completed'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }`}>
                                                {tx.status}
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

const StatCard = ({ title, value, unit, icon, color = 'teal' }) => {
    const colorMap = {
        teal: 'text-teal-600 bg-teal-500/10 border-teal-500/20',
        violet: 'text-violet-600 bg-violet-500/10 border-violet-100/20',
        amber: 'text-amber-600 bg-amber-500/10 border-amber-100/20',
    };

    return (
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group relative overflow-hidden">
            <div className="relative z-10">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-5 border transition-transform duration-500 group-hover:rotate-3 ${colorMap[color]}`}>
                    {icon}
                </div>

                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-1.5 group-hover:text-teal-600 transition-colors">
                    {title}
                </p>

                <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight leading-none">{value}</span>
                    <span className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">{unit}</span>
                </div>

                <div className="mt-5 h-1 w-full bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 w-2/3 ${color === 'teal' ? 'bg-teal-500' : color === 'violet' ? 'bg-violet-500' : 'bg-amber-500'}`}></div>
                </div>
            </div>
        </div>
    );
};

export default DashAnalytics;

