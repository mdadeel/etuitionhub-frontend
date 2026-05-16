import { Badge } from "@/components/ui/badge";
import { useTheme } from '../../contexts/ThemeContext';

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
            <header className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Operations Control</span>
                </div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight">Platform Insights</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">Real-time performance and user distribution analytics.</p>
            </header>

            {/* Core KPI Matrix */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Distribution Matrix */}
                <div className="bg-card border border-border/60 p-5 md:p-6 rounded-2xl shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-sm md:text-base font-bold text-foreground">User Distribution</h3>
                        <p className="text-[10px] md:text-xs font-medium text-muted-foreground/60 mt-0.5">Breakdown by user roles</p>
                    </div>
                    
                    <div className="h-[220px] md:h-[260px]">
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
                                        backgroundColor: isDark ? '#0F172A' : 'white', 
                                        border: isDark ? '1px solid #1e293b' : '1px solid #e5e7eb', 
                                        borderRadius: '12px',
                                        padding: '8px 12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ 
                                        color: isDark ? '#f1f5f9' : '#18181b',
                                        fontWeight: 600, 
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend 
                                    iconType="circle" 
                                    wrapperStyle={{ 
                                        paddingTop: '20px', 
                                        fontSize: '11px', 
                                        fontWeight: 600,
                                        color: isDark ? '#94a3b8' : '#64748b'
                                    }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Operations Lifecycle */}
                <div className="bg-card border border-border/60 p-5 md:p-6 rounded-2xl shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-sm md:text-base font-bold text-foreground">Tuition Status</h3>
                        <p className="text-[10px] md:text-xs font-medium text-muted-foreground/60 mt-0.5">Current status of tuition postings</p>
                    </div>
                    
                    <div className="h-[220px] md:h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tuitionStatus} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 500, fill: isDark ? '#64748b' : '#71717a' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 500, fill: isDark ? '#64748b' : '#71717a' }}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{ 
                                        backgroundColor: isDark ? '#0F172A' : 'white', 
                                        border: isDark ? '1px solid #1e293b' : '1px solid #e5e7eb', 
                                        borderRadius: '12px'
                                    }}
                                    itemStyle={{ color: isDark ? '#f1f5f9' : '#18181b', fontWeight: 600, fontSize: '12px' }}
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
            <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden relative">
                <div className="px-6 py-5 border-b border-border/40 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-bold text-foreground">Recent Transactions</h3>
                        <p className="text-[10px] font-bold text-muted-foreground/60 mt-0.5 uppercase tracking-widest">Latest payment activities</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full bg-blue-600/10 text-blue-600 border-none px-4 py-1 text-[10px] font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
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
                                    <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Transaction ID</th>
                                    <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Node</th>
                                    <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Yield</th>
                                    <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {transactions.slice(0, 8).map((tx) => (
                                    <tr key={tx._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="hidden md:table-cell px-6 py-4">
                                            <span className="text-xs font-medium text-muted-foreground">#{tx._id.slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs md:text-sm font-bold text-foreground leading-tight">{(tx.studentEmail || '').split('@')[0]}</span>
                                                <span className="hidden md:inline text-xs text-muted-foreground/60 mt-0.5">{tx.studentEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-center">
                                            <span className="text-xs md:text-sm font-bold text-blue-600 tabular-nums">৳{tx.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <Badge className={`rounded-full px-2.5 py-0.5 text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${tx.status === 'completed' || tx.status === 'verified'
                                                ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-none'
                                                : 'bg-amber-50 text-amber-600 border border-amber-100 shadow-none'
                                                }`}>
                                                {tx.status === 'pending_verification' ? 'Verify' : tx.status.toUpperCase()}
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
        <div className={`p-4 md:p-6 bg-card border border-border/60 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md group relative overflow-hidden`}>
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isPrimary ? 'bg-blue-600 text-white' : 'bg-muted/40 text-muted-foreground group-hover:text-blue-600 group-hover:bg-blue-600/10'
                    }`}>
                        <IconComponent size={16} mdSize={18} strokeWidth={2.5} />
                    </div>
                </div>

                <p className="text-[10px] md:text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">
                    {title}
                </p>

                <div className="flex items-baseline gap-1.5">
                    <span className="text-lg md:text-2xl font-bold tracking-tight text-foreground">
                        {value}
                    </span>
                </div>
            </div>
        </div>
    );
};


export default DashAnalytics;
