// Payment submission success page - for manual payment flow
import { useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="fade-up min-h-screen flex items-center justify-center bg-gray-50/30">
            <div className="text-center max-w-md p-12 bg-white border border-gray-200 rounded-sm shadow-sm">
                <div className="w-16 h-16 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-600 mb-2 italic">Pending Verification</p>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Payment Submitted</h1>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest leading-loose mb-8 italic">
                    Your payment details have been submitted successfully.<br />
                    Admin will verify within 24-48 hours.
                </p>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm mb-8">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        You can track your payment status in your dashboard
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <Link to="/dashboard" className="btn-quiet-primary py-4 text-[10px]">Go to Dashboard</Link>
                    <Link to="/payment-history" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">View Payment History</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
