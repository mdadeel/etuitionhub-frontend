// analytics dashboard - admin stats view
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

var COLORS = ['#0d9488', '#7c3aed', '#f59e0b', '#ef4444'];

function DashAnalytics() {
    let [stats, setStats] = useState({
        totalUsers: 0, totalTutors: 0, totalStudents: 0, totalAdmins: 0,
        totalTuitions: 0, pendingTuitions: 0, approvedTuitions: 0, totalRevenue: 0
    });
    let [isLoading, setIsLoading] = useState(true);
    let [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            console.log('loading dashboard...'); // debug
            try {
                var statsRes = await api.get('/api/analytics/stats');
                setStats(statsRes.data);

                var paymentsRes = await api.get('/api/payments/all');
                setTransactions(paymentsRes.data);
            } catch (err) {
                console.error('dashboard load failed:', err.message);
                await loadFallback();
            } finally {
                setIsLoading(false);
            }
        };

        // fallback - calculate on frontend
        var loadFallback = async () => {
            try {
                var [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
                    api.get('/api/users'),
                    api.get('/api/tuitions'),
                    api.get('/api/payments/all').catch(() => ({ data: [] }))
                ]);

                var users = usersRes.data;
                var tuitions = tuitionsRes.data;
                var payments = paymentsRes.data;

                // count stuff
                var tutors = users.filter(u => u.role === 'tutor').length;
                var students = users.filter(u => u.role === 'student').length;
                var admins = users.filter(u => u.role === 'admin').length;
                var pending = tuitions.filter(t => t.status === 'pending').length;
                var approved = tuitions.filter(t => t.status === 'approved').length;
                var completed = payments.filter(p => p.status === 'completed');
                var revenue = completed.reduce((sum, p) => sum + (p.amount || 0), 0);

                setTransactions(payments);
                setStats({
                    totalUsers: users.length, totalTutors: tutors,
                    totalStudents: students, totalAdmins: admins,
                    totalTuitions: tuitions.length, pendingTuitions: pending,
                    approvedTuitions: approved, totalRevenue: revenue
                });
            } catch (err) {
                console.error('fallback failed:', err.message);
            }
        };

        loadData();
    }, []);

    // chart data
    var userDist = [
        { name: 'Students', value: stats.totalStudents },
        { name: 'Tutors', value: stats.totalTutors },
        { name: 'Admins', value: stats.totalAdmins }
    ];

    var tuitionStatus = [
        { name: 'Pending', count: stats.pendingTuitions, fill: '#f59e0b' },
        { name: 'Approved', count: stats.approvedTuitions, fill: '#10b981' },
        { name: 'Total', count: stats.totalTuitions, fill: '#0d9488' }
    ];

    if (isLoading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Platform Analytics</h2>

            {/* stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.totalUsers} desc="Registered" />
                <StatCard title="Total Tutors" value={stats.totalTutors} desc="Available" />
                <StatCard title="Total Students" value={stats.totalStudents} desc="Active" />
                <StatCard title="Tuition Posts" value={stats.totalTuitions} desc="Posted" />
                <StatCard title="Pending" value={stats.pendingTuitions} desc="Awaiting" />
                <StatCard title="Revenue" value={`৳${stats.totalRevenue}`} desc="Total" />
            </div>

            {/* charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-4">User Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={userDist} cx="50%" cy="50%" labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80} fill="#8884d8" dataKey="value">
                                {userDist.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip /><Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-4">Tuition Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={tuitionStatus}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" /><YAxis /><Tooltip />
                            <Bar dataKey="count" fill="#0d9488" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <TransactionTable data={transactions} />
        </div>
    );
}

// stat card component
function StatCard({ title, value, desc }) {
    return (
        <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
            <div className="stat-desc">{desc}</div>
        </div>
    );
}

// transactions table
function TransactionTable({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-base-100 p-6 rounded-lg shadow mt-8">
                <h3 className="text-lg font-bold mb-4">Transaction History</h3>
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
            </div>
        );
    }

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow mt-8">
            <h3 className="text-lg font-bold mb-4">Transaction History</h3>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr><th>#</th><th>Student</th><th>Tutor</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 10).map((tx, i) => (
                            <tr key={tx._id}>
                                <td>{i + 1}</td>
                                <td>{tx.studentEmail}</td>
                                <td>{tx.tutorEmail}</td>
                                <td className="font-semibold">৳{tx.amount}</td>
                                <td>
                                    <span className={`badge ${tx.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DashAnalytics;
