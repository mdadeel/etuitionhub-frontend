// checkout page - stripe payment er jonno
// student tutor ke pay korbe approve korar time
import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

// stripe public key - env theke nibo
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51ScKPwBLmnYHXqck9C3HR4Rg10utxFGf4spiNB6nXVGtkfjqjXmlZObBnZz1FZOOae29kxFE50UIkMJCNxILV0Ux00r6wdXVfi')

function Checkout() {
    let { id } = useParams() // application id from url
    let { user } = useAuth()
    let navigate = useNavigate()

    let [loading, setLoading] = useState(true)
    let [application, setApplication] = useState(null)

    useEffect(() => {
        if (!id || !user?.email) {
            toast.error('Invalid checkout session')
            navigate('/dashboard')
            return
        }

        fetchApplicationAndCreateSession()
    }, [id, user])

    const fetchApplicationAndCreateSession = async () => {
        try {
            // application details anbo first
            console.log('fetching app:', id) // debug
            let appRes = await fetch(`http://localhost:5000/api/applications/${id}`)
            if (!appRes.ok) {
                throw new Error('Application not found')
            }

            let appData = await appRes.json()
            setApplication(appData)

            console.log('creating checkout for:', appData) // chk

            // stripe checkout session create kortesi
            let res = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId: id,
                    studentEmail: user.email,
                    amount: appData.expectedSalary
                })
            })

            if (!res.ok) {
                throw new Error('Failed to create checkout session')
            }

            let { url } = await res.json()

            // redirect to stripe checkout page
            console.log('redirecting to stripe:', url)
            window.location.href = url

        } catch (error) {
            console.error('checkout error:', error)
            toast.error('Payment session create hoinai')
            setLoading(false)
        }
    }

    // loading spinner stripe e redirect howar age
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card bg-base-100 shadow-xl p-8">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <h2 className="text-2xl font-bold">Processing Payment...</h2>
                    <p className="text-gray-600">Redirecting to secure checkout</p>
                    {application && (
                        <div className="mt-4 text-center">
                            <p className="text-sm">Tutor: {application.tutorName}</p>
                            <p className="text-lg font-bold text-primary">Amount: ৳{application.expectedSalary}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Checkout
