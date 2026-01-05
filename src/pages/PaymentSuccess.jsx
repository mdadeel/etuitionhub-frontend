// payment success page
import { useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="fade-up min-h-screen flex items-center justify-center bg-gray-50/30">
            <div className="text-center max-w-md p-12 bg-white border border-gray-200 rounded-sm shadow-sm">
                <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600 mb-2 italic">Protocol Complete</p>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Transaction Successful</h1>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest leading-loose mb-12 italic">
                    Funds verified and engagement finalized.<br />System synchronization in progress.
                </p>

                <div className="flex flex-col gap-4">
                    <Link to="/dashboard" className="btn-quiet-primary py-4 text-[10px]">Management Interface</Link>
                    <Link to="/payment-history" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Yield History Log</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess
