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
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <StatCard title="Total Capacity" value={stats.totalUsers} unit="Users" />
                <StatCard title="Marketplace Volume" value={stats.totalTuitions} unit="Posts" />
                <StatCard title="Active Pipeline" value={stats.pendingTuitions} unit="Pending" />
                <StatCard title="System Yield" value={`৳${stats.totalRevenue}`} unit="BDT" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 p-8 rounded-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 pb-4 border-b border-gray-50">Identity Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={userDist}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {userDist.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 p-8 rounded-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 pb-4 border-b border-gray-50">Operations Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={tuitionStatus} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} />
                            <Bar dataKey="count" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/30">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Global Yield Logs</h3>
                </div>
                {transactions.length === 0 ? (
                    <div className="p-20 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Zero transaction records available.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ref</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Client</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Professional</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Yield</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.slice(0, 10).map((tx, i) => (
                                    <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-gray-400">#0{i + 1}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.studentEmail}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tx.tutorEmail}</td>
                                        <td className="px-6 py-4 text-sm font-extrabold text-gray-900">৳{tx.amount}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${tx.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
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

const StatCard = ({ title, value, unit }) => (
    <div className="p-8 bg-white border border-gray-200 rounded-sm shadow-sm transition-transform hover:-translate-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">{title}</p>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{unit}</span>
        </div>
    </div>
);

export default DashAnalytics;
