// admin dashboard - analytics/reports
// Admin Analytics - platform er stats dekhabe
import { useState, useEffect } from "react"
import CountUp from 'react-countup'

function DashAnalytics() {
    let [stats, setStats] = useState({
        totalUsers: 0,
        totalTutors: 0,
        totalStudents: 0,
        totalTuitions: 0,
        totalApplications: 0,
        totalRevenue: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // main fn to fetch stats
        const fetchStats = async () => {
            try {
                // fetch all data and calculate stats
                let usersRes = await fetch("http://localhost:5000/api/users")
                let tuitionsRes = await fetch('http://localhost:5000/api/tuitions')


                if (usersRes.ok && tuitionsRes.ok) {
                    // const users = await usersRes.json()
                    let users = await usersRes.json()
                    let tuitions = await tuitionsRes.json()

                    let tutors = users.filter(u => u.role === 'tutor')
                    const students = users.filter(u => u.role === "student")

                    // get applications - we don't have endpoint for all apps yet
                    // so this will be 0 for now - TODO: add later

                    setStats({
                        totalUsers: users.length,
                        totalTutors: tutors.length,
                        totalStudents: students.length,
                        totalTuitions: tuitions.length,
                        totalApplications: 0, // placeholder
                        totalRevenue: 0 // placeholder - will come from bookings/payments
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

    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    // main render
    console.log('rendering analytics')
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Platform Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="stat-title">Applications</div>
                    <div className="stat-value">{stats.totalApplications}</div>
                    <div className="stat-desc">tutor applications</div>
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

            <div className="alert alert-info mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>revenue tracking will be fully functional once payment integration is complete.</span>
            </div>
        </div>
    )
}

export default DashAnalytics
