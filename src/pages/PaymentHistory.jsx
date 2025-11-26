// payment history page - student er payment record dekhabe
import { useState, useEffect } from "react"
import { useAuth } from '../contexts/AuthContext'
import toast from "react-hot-toast"

function PaymentHistory() {
    let { user } = useAuth()
    let [payments, setPayments] = useState([])
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user?.email) {
            loadPayments()
        }
    }, [user])

    const loadPayments = async () => {
        try {
            // student er sob payments load korbo
            let res = await fetch(`http://localhost:5000/api/payments/student/${user.email}`)
            if (res.ok) {
                let data = await res.json()
                setPayments(data)
                console.log('loaded payments:', data.length) // debug
            }
        } catch (err) {
            console.error(err)
            // TODO: better error handling
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    return (
        <div className="min-h-screen bg-base-200 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6">My Payment History</h1>

                {payments.length === 0 ? (
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body text-center py-12">
                            <p className="text-lg text-gray-500">No payments yet</p>
                            <p className="text-sm text-gray-400 mt-2">Payments will show here when you approve tutors</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* stats section */}
                        <div className="card bg-base-100 shadow-xl mb-4">
                            <div className="card-body">
                                <div className="stats shadow">
                                    <div className="stat">
                                        <div className="stat-title">Total Payments</div>
                                        <div className="stat-value text-primary">{payments.length}</div>
                                    </div>


                                    <div className="stat">
                                        <div className="stat-title">Total Paid</div>
                                        <div className="stat-value text-success">
                                            ৳{payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* payment table */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Tutor</th>
                                                <th>Subject</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((p, i) => (
                                                <tr key={p._id}>
                                                    <td>{i + 1}</td>
                                                    <td>{p.tutorEmail}</td>
                                                    <td>{p.tuitionId?.subject || 'N/A'}</td>
                                                    <td className="font-bold">৳{p.amount}</td>
                                                    <td>
                                                        <div className={`badge ${p.status === 'completed' ? 'badge-success' :
                                                                p.status === 'failed' ? 'badge-error' :
                                                                    'badge-warning'
                                                            }`}>
                                                            {p.status}
                                                        </div>
                                                    </td>
                                                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default PaymentHistory
