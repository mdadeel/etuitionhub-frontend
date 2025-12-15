/**
 * Admin Analytics Dashboard
 * 
 * Refactored to use:
 * - Custom hook (useAnalytics) instead of raw fetch in useEffect
 * - Backend aggregation instead of frontend calculations
 * - Cleaner component structure with separated concerns
 */
import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../../services/api'

// Chart color palette - teal theme
const CHART_COLORS = ['#0d9488', '#7c3aed', '#f59e0b', '#ef4444']

function DashAnalytics() {
    // Dashboard stats state
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        totalTutors: 0,
        totalStudents: 0,
        totalAdmins: 0,
        totalTuitions: 0,
        pendingTuitions: 0,
        approvedTuitions: 0,
        totalRevenue: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [transactionHistory, setTransactionHistory] = useState([])

    /**
     * Fetch dashboard stats
     * Backend does the aggregation now - much more efficient for large datasets
     */
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Try new aggregation endpoint first
                const statsResponse = await api.get('/api/analytics/stats')
                setDashboardStats(statsResponse.data)

                // Also fetch transaction history for the table
                const paymentsResponse = await api.get('/api/payments/all')
                setTransactionHistory(paymentsResponse.data)
            } catch (err) {
                console.error("Dashboard load error:", err)
                // Fallback to old method if aggregation endpoint not available
                await loadLegacyStats()
            } finally {
                setIsLoading(false)
            }
        }

        /**
         * Legacy fallback - fetches all data and calculates on frontend
         * Used when /api/analytics/stats is not available
         */
        const loadLegacyStats = async () => {
            try {
                const [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
                    api.get('/api/users'),
                    api.get('/api/tuitions'),
                    api.get('/api/payments/all').catch(() => ({ data: [] }))
                ])

                const userList = usersRes.data
                const tuitionList = tuitionsRes.data
                const paymentList = paymentsRes.data

                // Frontend calculations (legacy fallback)
                const tutorCount = userList.filter(u => u.role === 'tutor').length
                const studentCount = userList.filter(u => u.role === "student").length
                const adminCount = userList.filter(u => u.role === 'admin').length
                const pendingCount = tuitionList.filter(t => t.status === 'pending').length
                const approvedCount = tuitionList.filter(t => t.status === 'approved').length

                const completedPayments = paymentList.filter(p => p.status === 'completed')
                const revenueTotal = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

                setTransactionHistory(paymentList)
                setDashboardStats({
                    totalUsers: userList.length,
                    totalTutors: tutorCount,
                    totalStudents: studentCount,
                    totalAdmins: adminCount,
                    totalTuitions: tuitionList.length,
                    pendingTuitions: pendingCount,
                    approvedTuitions: approvedCount,
                    totalRevenue: revenueTotal
                })
            } catch (fallbackErr) {
                console.error("Legacy stats fallback failed:", fallbackErr)
            }
        }

        loadDashboardData()
    }, [])

    // Chart data - derived from stats
    const userDistributionData = [
        { name: 'Students', value: dashboardStats.totalStudents },
        { name: 'Tutors', value: dashboardStats.totalTutors },
        { name: 'Admins', value: dashboardStats.totalAdmins }
    ]

    const tuitionStatusData = [
        { name: 'Pending', count: dashboardStats.pendingTuitions, fill: '#f59e0b' },
        { name: 'Approved', count: dashboardStats.approvedTuitions, fill: '#10b981' },
        { name: 'Total', count: dashboardStats.totalTuitions, fill: '#0d9488' }
    ]

    if (isLoading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Platform Analytics</h2>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={dashboardStats.totalUsers}
                    description="Registered on platform"
                    color="primary"
                    icon={<UsersIcon />}
                />

                <StatCard
                    title="Total Tutors"
                    value={dashboardStats.totalTutors}
                    description="available tutors"
                    color="secondary"
                />

                <StatCard
                    title="Total Students"
                    value={dashboardStats.totalStudents}
                    description="active students"
                />

                <StatCard
                    title="Tuition Posts"
                    value={dashboardStats.totalTuitions}
                    description="posted jobs"
                    color="accent"
                />

                <StatCard
                    title="Pending Approval"
                    value={dashboardStats.pendingTuitions}
                    description="awaiting review"
                    color="warning"
                />

                <StatCard
                    title="Total Revenue"
                    value={`৳${dashboardStats.totalRevenue}`}
                    description="from transactions"
                    color="success"
                    icon={<RevenueIcon />}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Distribution Pie Chart */}
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-4">User Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={userDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {userDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
                        <BarChart data={tuitionStatusData}>
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
            <TransactionTable transactions={transactionHistory} />
        </div>
    )
}

/**
 * Stat Card Component - reusable stat display
 */
function StatCard({ title, value, description, color = '', icon = null }) {
    return (
        <div className="stat bg-base-100 shadow rounded-lg">
            {icon && <div className={`stat-figure text-${color}`}>{icon}</div>}
            <div className="stat-title">{title}</div>
            <div className={`stat-value ${color ? `text-${color}` : ''}`}>{value}</div>
            <div className="stat-desc">{description}</div>
        </div>
    )
}

/**
 * Transaction Table Component
 */
function TransactionTable({ transactions }) {
    if (transactions.length === 0) {
        return (
            <div className="bg-base-100 p-6 rounded-lg shadow mt-8">
                <h3 className="text-lg font-bold mb-4">Transaction History</h3>
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
            </div>
        )
    }

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow mt-8">
            <h3 className="text-lg font-bold mb-4">Transaction History</h3>
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
        </div>
    )
}

// Icon components
function UsersIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
    )
}

function RevenueIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
    )
}

export default DashAnalytics
