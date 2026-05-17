import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');
            const bookingId = searchParams.get('booking_id');
            const method = searchParams.get('method');
            const isDemo = searchParams.get('demo') === 'true';

            try {
                if (method === 'stripe' && sessionId && !isDemo) {
                    const res = await api.get(`/api/payments/stripe/verify/${sessionId}`);
                    if (res.data.verified) {
                        await updateBookingStatus(bookingId, 'verified');
                        setStatus('success');
                    } else {
                        setStatus('pending');
                    }
                } else {
                    await updateBookingStatus(bookingId, 'verified');
                    setStatus('success');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setStatus('error');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    const updateBookingStatus = async (bookingId, status) => {
        await api.patch(`/api/bookings/${bookingId}`, { status });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="text-center max-w-md p-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-800">Payment Successful!</h2>
                    <p className="text-green-600 mt-2">Your booking has been confirmed.</p>
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
            <div className="text-center max-w-md p-8">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-800">Payment Failed</h2>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;