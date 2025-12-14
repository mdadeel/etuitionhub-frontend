// admin dashboard - analytics/reports
// Admin Analytics - platform er stats dekhabe
import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import API_URL from '../../config/api';

function DashAnalytics() {
    let [stats, setStats] = useState({
        totalUsers: 0,
        totalTutors: 0,
        totalStudents: 0,
        totalAdmins: 0,
        totalTuitions: 0,
        pendingTuitions: 0,
        approvedTuitions: 0,
        totalApplications: 0,
        totalRevenue: 0
    })
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState([])

    // Colors for charts
    const COLORS = ['#0d9488', '#7c3aed', '#f59e0b', '#ef4444']

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let usersRes = await fetch(`${API_URL}/api/users`)
                let tuitionsRes = await fetch(`${API_URL}/api/tuitions`)
                let paymentsRes = await fetch(`${API_URL}/api/payments/all`)

                if (usersRes.ok && tuitionsRes.ok) {
                    let users = await usersRes.json()
                    let tuitions = await tuitionsRes.json()
                    let payments = paymentsRes.ok ? await paymentsRes.json() : []

                    let tutors = users.filter(u => u.role === 'tutor')
                    let students = users.filter(u => u.role === "student")
                    let admins = users.filter(u => u.role === 'admin')
                    let pending = tuitions.filter(t => t.status === 'pending')
                    let approved = tuitions.filter(t => t.status === 'approved')

                    // Calculate total revenue from completed payments
                    let completedPayments = payments.filter(p => p.status === 'completed')
                    let revenue = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

                    setTransactions(payments)
                    setStats({
                        totalUsers: users.length,
                        totalTutors: tutors.length,
                        totalStudents: students.length,
                        totalAdmins: admins.length,
                        totalTuitions: tuitions.length,
                        pendingTuitions: pending.length,
                        approvedTuitions: approved.length,
                        totalApplications: 0,
                        totalRevenue: revenue
                    })
                }
                setLoading(false)
            } catch (err) {
                console.error("stats fetch error:", err)
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    // Chart data
    const userDistribution = [
        { name: 'Students', value: stats.totalStudents },
        { name: 'Tutors', value: stats.totalTutors },
        { name: 'Admins', value: stats.totalAdmins }
    ]

    const tuitionStatus = [
        { name: 'Pending', count: stats.pendingTuitions, fill: '#f59e0b' },
        { name: 'Approved', count: stats.approvedTuitions, fill: '#10b981' },
        { name: 'Total', count: stats.totalTuitions, fill: '#0d9488' }
    ]

    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Platform Analytics</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value text-primary">{stats.totalUsers}</div>
                    <div className="stat-desc">Registered on platform</div>
                </div>

                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-title">Total Tutors</div>
                    <div className="stat-value text-secondary">{stats.totalTutors}</div>
                    <div className="stat-desc">available tutors</div>
                </div>

                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-title">Total Students</div>
                    <div className="stat-value">{stats.totalStudents}</div>
                    <div className="stat-desc">active students</div>
                </div>

                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-title">Tuition Posts</div>
                    <div className="stat-value text-accent">{stats.totalTuitions}</div>
                    <div className="stat-desc">posted jobs</div>
                </div>

                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-title">Pending Approval</div>
                    <div className="stat-value text-warning">{stats.pendingTuitions}</div>
                    <div className="stat-desc">awaiting review</div>
                </div>

                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="stat-title">Total Revenue</div>
                    <div className="stat-value text-success">৳{stats.totalRevenue}</div>
                    <div className="stat-desc">from transactions</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Distribution Pie Chart */}
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-4">User Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={userDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {userDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Tuition Status Bar Chart */}
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-4">Tuition Status Overview</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={tuitionStatus}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0d9488" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transaction History Table */}
            <div className="bg-base-100 p-6 rounded-lg shadow mt-8">
                <h3 className="text-lg font-bold mb-4">Transaction History</h3>
                {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No transactions yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student</th>
                                    <th>Tutor</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 10).map((tx, idx) => (
                                    <tr key={tx._id}>
                                        <td>{idx + 1}</td>
                                        <td>{tx.studentEmail}</td>
                                        <td>{tx.tutorEmail}</td>
                                        <td className="font-semibold">৳{tx.amount}</td>
                                        <td>
                                            <span className={`badge ${tx.status === 'completed' ? 'badge-success' : tx.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {transactions.length > 10 && (
                            <p className="text-center text-sm text-gray-500 mt-2">Showing 10 of {transactions.length} transactions</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DashAnalytics

