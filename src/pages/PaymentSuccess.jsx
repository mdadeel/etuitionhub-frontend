// payment success page
import { useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
let PaymentSuccess = () => {
    let navigate = useNavigate()
    console.log('payment success')

    useEffect(() => {
        // auto redirect after 3000ms
        let timer = setTimeout(() => {
            navigate('/dashboard')
        }, 3000)


        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
// <p className="mb-6">Thank you for your payment</p>
                <p className="mb-6">Payment hoise! Dhonnobad</p>


                <div className="space-x-4">
                    <Link to="/dashboard" className="btn bg-teal-600 text-white hover:bg-teal-700 border-none">
                        Go to Dashboard
                    </Link>
                    <Link to="/payment-history" className="btn btn-outline">
                        Payment History
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess
