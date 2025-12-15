// checkout page - payment er jonno
import { useEffect, useState } from 'react'
import { loadStripe } from "@stripe/stripe-js"
import { useParams, useNavigate } from "react-router-dom"
import toast from 'react-hot-toast'
import { useAuth } from "../contexts/AuthContext"
import API_URL from '../config/api';

// stripe key
let stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51ScKPwBLmnYHXqck9C3HR4Rg10utxFGf4spiNB6nXVGtkfjqjXmlZObBnZz1FZOOae29kxFE50UIkMJCNxILV0Ux00r6wdXVfi')

let Checkout = () => {
    let { id } = useParams()
    let { user } = useAuth()
    let navigate = useNavigate()
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState(null)
    let [application, setApplication] = useState(null)
    console.log('checkout page', id)

    useEffect(() => {
        if (!id || !user?.email) {
            toast.error('Invalid session')
            navigate('/dashboard')
            return
        }
        fetchApplication()
    }, [id, user])

    let fetchApplication = async () => {
        try {
            setLoading(true)
            setError(null)
            let appRes = await fetch(`${API_URL}/api/applications/${id}`)
            if (!appRes.ok) {
                throw new Error('Application not found')
            }
            let appData = await appRes.json()
            setApplication(appData)
            console.log('app data', appData)
            setLoading(false)
        } catch (err) {
            console.log('fetch app error', err)
            setError('Could not load application details')
            setLoading(false)
        }
    }

    let handlePayment = async () => {
        if (!application) return
        setLoading(true)
        try {
            let res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId: id,
                    studentEmail: user.email,
                    amount: application.expectedSalary
                })
            })

            let data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error(data.error || 'Payment session failed')
            }
        } catch (error) {
            console.log('payment error', error)
            toast.error('Payment service unavailable')
            setError('Payment service not available. Please try again later.')
            setLoading(false)
        }
    }

    // loading state
    if (loading && !application) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-teal-600"></div>
                    <p className="mt-4">Loading payment details...</p>
                </div>
            </div>
        )
    }

    // error state
    if (error && !application) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-error text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold">{error}</h2>
                    <div className="mt-4 flex gap-2 justify-center">
                        <button onClick={() => navigate('/dashboard')} className="btn btn-outline">
                            Back to Dashboard
                        </button>
                        <button onClick={fetchApplication} className="btn btn-primary">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // success - show payment form
    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-lg mx-auto">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl">Payment Details</h2>

                        <div className="divider"></div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tutor:</span>
                                <span className="font-semibold">{application?.tutorName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subject:</span>
                                <span>{application?.tuitionId?.subject || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-lg">
                                <span className="text-gray-500">Amount:</span>
                                <span className="font-bold text-primary">৳{application?.expectedSalary}/month</span>
                            </div>
                        </div>

                        <div className="divider"></div>

                        {error && (
                            <div className="alert alert-warning">
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="card-actions justify-end">
                            <button onClick={() => navigate('/dashboard')} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="loading loading-spinner loading-sm"></span> Processing...</>
                                ) : (
                                    'Pay with Stripe'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout

