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
    let [application, setApplication] = useState(null)
    console.log('checkout page', id)

    useEffect(() => {
        if (!id || !user?.email) {
            toast.error('Invalid session')
            navigate('/dashboard')
            return
        }


        fetchApplicationAndCreateSession()
    }, [id, user])

    let fetchApplicationAndCreateSession = async () => {
        try {
            // console.log('ftch app',id)
            let appRes = await fetch(`${API_URL}/api/applications/${id}`)
            if (!appRes.ok) {
                throw new Error('App not found')
            }

            let appData = await appRes.json()
            setApplication(appData)
            console.log('app data', appData)

            // let res=await fetch('http://localhost:5000/api/payments/create-checkout-session',{
            let res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId: id,
                    studentEmail: user.email,
                    amount: appData.expectedSalary
                })
            })

            let data = await res.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.log('checkout error', error)
            toast.error('Payment failed!')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="loading loading-spinner loading-lg text-teal-600"></div>
                <p className="mt-4">Redirecting to payment...</p>
            </div>
        </div>
    )
}

export default Checkout
