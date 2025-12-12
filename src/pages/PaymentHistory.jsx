// payment history page
import { useState, useEffect } from "react"
import { useAuth } from '../contexts/AuthContext'
let PaymentHistory = () => {
    let { user } = useAuth()
    let [payments, setPayments] = useState([])
    let [loading, setLoading] = useState(true)
    console.log('payment history page')

    useEffect(() => {
        if (!user?.email) return


        fetchPayments()
    }, [user])

    let fetchPayments = async () => {
        try {
            // let res=await fetch(`http://localhost:5000/api/payments/student/${user.email}`)
            let res = await fetch(`http://localhost:5000/api/payments/student/${user.email}`)
            let data = await res.json()
            setPayments(data)
        } catch (error) {
            console.log('fetch error', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Payment History</h1>


            {payments.length === 0 ? (
                <p className="text-center text-gray-500">No payments yet</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Tutor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                // <tr key={payment._id}>
                                <tr key={payment._id || payment.id}>
                                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    <td>৳{payment.amount}</td>
                                    <td><span className="badge badge-success">{payment.status}</span></td>
                                    <td>{payment.tutorName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default PaymentHistory
