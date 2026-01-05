// checkout page - payment er jonno
import { useEffect, useState } from 'react'
import { loadStripe } from "@stripe/stripe-js"
import { useParams, useNavigate } from "react-router-dom"
import toast from 'react-hot-toast'
import { useAuth } from "../contexts/AuthContext"
import API_URL from '../config/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// stripe key
let stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51ScKPwBLmnYHXqck9C3HR4Rg10utxFGf4spiNB6nXVGtkfjqjXmlZObBnZz1FZOOae29kxFE50UIkMJCNxILV0Ux00r6wdXVfi')

const Checkout = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [application, setApplication] = useState(null);

    useEffect(() => {
        if (!id || !user?.email) {
            toast.error('Session Invalid: Identity context missing');
            navigate('/dashboard');
            return;
        }
        fetchApplication();
    }, [id, user]);

    const fetchApplication = async () => {
        try {
            setLoading(true);
            setError(null);
            const appRes = await fetch(`${API_URL}/api/applications/${id}`);
            if (!appRes.ok) throw new Error('Transaction target not found');
            const appData = await appRes.json();
            setApplication(appData);
            setLoading(false);
        } catch (err) {
            setError('Operational failure: Could not load target parameters');
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!application) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId: id,
                    studentEmail: user.email,
                    amount: application.expectedSalary
                })
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Payment gateway synchronization failed');
            }
        } catch (error) {
            toast.error('Gateway Error: Service unavailable');
            setError('Payment infrastructure is currently offline.');
            setLoading(false);
        }
    };

    if (loading && !application) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <LoadingSpinner />
            </div>
        );
    }

    if (error && !application) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30 p-8">
                <div className="max-w-md w-full text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-4 italic">System Alert</p>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{error}</h2>
                    <div className="mt-12 flex flex-col gap-4">
                        <button onClick={() => navigate('/dashboard')} className="btn-quiet-secondary w-full">Return to Management</button>
                        <button onClick={fetchApplication} className="btn-quiet-primary w-full">Retry Synchronization</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-up min-h-screen py-20 px-8 bg-gray-50/30">
            <div className="max-w-xl mx-auto">
                <header className="mb-12 border-b border-gray-200 pb-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Transaction Infrastructure</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Requirement Finalization</h1>
                </header>

                <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/30">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Engagement Summary</h3>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-8 pb-6 border-b border-gray-50">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Contractor</p>
                                <p className="text-sm font-bold text-gray-900">{application?.tutorName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Reference</p>
                                <p className="text-xs font-mono text-gray-500">#{id?.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Subject Scale</span>
                                <span className="text-sm font-medium text-gray-900">{application?.tuitionId?.subject || 'Direct Engagement'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Service Frequency</span>
                                <span className="text-sm font-medium text-gray-900">Monthly Recurrent</span>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-100">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Yield Liability</p>
                                    <p className="text-xs text-gray-400 font-medium italic">Applicable system fees inclusive</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-extrabold text-indigo-600 tracking-tighter">৳{application?.expectedSalary}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">/ Mon</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <button onClick={() => navigate('/dashboard')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Abort Transaction</button>
                        <button
                            onClick={handlePayment}
                            className="btn-quiet-primary px-12 py-4 text-[10px]"
                            disabled={loading}
                        >
                            {loading ? 'Processing Protocol...' : 'Initialize Secure Payment'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 py-4 px-6 border border-dashed border-gray-200 rounded-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Encrypted via standard SSL/Stripe protocols</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout

