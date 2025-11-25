// payment success page - stripe checkout er pore dekhabe
import { useEffect } from "react"
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

function PaymentSuccess() {
    let navigate = useNavigate()
    let [searchParams] = useSearchParams()

    useEffect(() => {
        let sessionId = searchParams.get('session_id')
        console.log('payment success, session:', sessionId) // debug

        if (sessionId) {
            // payment success hoise!
            toast.success('Payment successful! Tutor approved hoise')

            // 3 second pore dashboard e jabe
            setTimeout(() => {
                navigate('/dashboard')
            }, 3000)
        } else {
            // session id nai - direct dashboard e jao
            navigate('/dashboard')
        }
    }, [])

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <div className="card bg-base-100 shadow-2xl max-w-lg">
                <div className="card-body text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="card-title text-3xl justify-center mb-2">Payment Successful!</h2>
                    <p className="text-lg mb-4">Your payment has been processed successfully</p>
                    <p className="text-gray-600">The tutor application has been approved</p>


                    <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>

                    <div className="card-actions justify-center mt-6">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/dashboard')}
                        >
                            Go to Dashboard
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate('/payment-history')}
                        >
                            View Payment History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess
