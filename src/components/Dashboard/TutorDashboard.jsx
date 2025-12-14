// tutor dashboard - revenue tracking and stuff
import { useState, useEffect } from 'react'
import { useAuth } from "../../contexts/AuthContext";
import toast from 'react-hot-toast'
import API_URL from '../../config/api';

const TutorDashboard = () => {
    let { user, dbUser } = useAuth() // lazy var
    const [activeTab, setActiveTab] = useState("overview")
    let [apps, setApps] = useState([]) // using let even tho const would work
    const [loading, setLoading] = useState(true)
    const [revenue, setRevenue] = useState([])

    // get applications data
    useEffect(() => {
        if (user?.email) {
            // fetchApplications() // old way - slow
            loadApps()
        }
    }, [user]) // missing dependency warning - ignore it for now

    // main fn to load apps
    const loadApps = async () => {
        try {
            let response = await fetch(`${API_URL}/api/applications/tutor/${user.email}`)
            let data = await response.json()
            console.log('got apps:', data)
            setApps(data)

            // Also fetch revenue history
            let revenueRes = await fetch(`${API_URL}/api/payments/tutor/${user.email}`)
            if (revenueRes.ok) {
                let revenueData = await revenueRes.json()
                setRevenue(revenueData)
            }
        } catch (e) {
            console.error("error:", e)
        } finally {
            setLoading(false)
        }
    }

    // calculate kori total earnings from revenue
    let totalEarnings = revenue.reduce((sum, p) => sum + (p.amount || 0), 0)
    let activeStudents = apps.filter(a => a.status === 'approved').length

    // delete application - pending thakle delete kora jabe
    const handleDelete = async (id) => {
        if (!confirm('Application delete korben?')) return

        // Validate ObjectId
        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(id)) {
            toast.error('Cannot delete demo data - invalid ID');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/applications/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                toast.success("Application deleted")
                setApps(prev => prev.filter(a => a._id !== id))
            } else {
                const errorData = await res.json();
                toast.error('Delete failed - ' + (errorData.error || 'try again'))
            }
        } catch (err) {
            console.error(err)
            toast.error('Network error - check connection');
        }
    }

    // loading spinner
    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    // main render
    console.log('rendering dashboard...')
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tutor Dashboard</h1>

                {/* tab navigation */}
                <div className="tabs tabs-boxed flex-wrap">
                    <a className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('overview')}>Overview</a>
                    <a className={`tab ${activeTab === 'applications' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab("applications")}>My Applications</a>
                    <a className={`tab ${activeTab === 'ongoing' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('ongoing')}>Ongoing Tuitions</a>
                    <a className={`tab ${activeTab === 'revenue' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('revenue')}>Revenue History</a>
                </div>
            </div>

            {/* overview tab - stats dekhay */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">Total Applications</div>
                        <div className="stat-value text-primary">{apps.length}</div>
                        <div className="stat-desc">All applications submitted</div>
                    </div>


                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">Active Students</div>
                        <div className="stat-value text-secondary">{activeStudents}</div>
                        <div className="stat-desc">Currently teaching</div>
                    </div>
                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">Total Earnings</div>
                        <div className="stat-value">৳{totalEarnings}</div>
                        <div className="stat-desc">From approved tuitions</div>
                    </div>
                </div>
            )}

            {/* applications tab - tutor er sob applications */}
            {activeTab === 'applications' && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">My Applications</h2>
                    {apps.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">You haven't applied to any tuitions yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* applications table */}
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tuition</th>
                                        <th>Student</th>
                                        <th>Expected Salary</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apps.map((app, idx) => (
                                        <tr key={app._id}>
                                            <th>{idx + 1}</th>
                                            <td>{app.tuitionId?.subject || "N/A"}</td>
                                            <td>{app.studentEmail}</td>
                                            <td>৳{app.expectedSalary}</td>
                                            <td>
                                                {/* status badge - color coded */}
                                                <div className={`badge ${app.status === 'approved' ? 'badge-success' :
                                                    app.status === 'rejected' ? 'badge-error' :
                                                        'badge-warning'
                                                    }`}>
                                                    {app.status}
                                                </div>
                                            </td>
                                            <td>
                                                {/* delete button - only pending er jonno */}
                                                {app.status === 'pending' && (
                                                    <button
                                                        className="btn btn-error btn-xs"
                                                        onClick={() => handleDelete(app._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ongoing tuitions tab - approved tuitions dekhay */}
            {activeTab === 'ongoing' && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Ongoing Tuitions</h2>
                    {apps.filter(a => a.status === 'approved').length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No ongoing tuitions - apply for more!</p>
                    ) : (
                        <div className="grid gap-4">
                            {apps.filter(a => a.status === 'approved').map(app => (
                                <div key={app._id} className="card bg-base-200 shadow">
                                    <div className="card-body">
                                        <h3 className="font-bold">{app.tuitionId?.subject}</h3>
                                        <p className="text-sm">Student: {app.studentEmail}</p>
                                        <p className="text-sm">Location: {app.tuitionId?.location}</p>
                                        <p className="text-sm font-bold">Monthly Salary: ৳{app.expectedSalary}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Revenue History Tab */}
            {activeTab === 'revenue' && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Revenue History</h2>

                    {/* Total earnings card */}
                    <div className="stat bg-teal-50 rounded-lg mb-6 inline-block">
                        <div className="stat-title">Total Earnings</div>
                        <div className="stat-value text-teal-600">৳{totalEarnings}</div>
                        <div className="stat-desc">From {revenue.length} payments</div>
                    </div>

                    {revenue.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No payment history yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student</th>
                                        <th>Subject</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {revenue.map((payment, idx) => (
                                        <tr key={payment._id}>
                                            <td>{idx + 1}</td>
                                            <td>{payment.studentEmail}</td>
                                            <td>{payment.tuitionId?.subject || 'N/A'}</td>
                                            <td className="font-semibold text-teal-600">৳{payment.amount}</td>
                                            <td>
                                                <span className={`badge ${payment.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TutorDashboard
