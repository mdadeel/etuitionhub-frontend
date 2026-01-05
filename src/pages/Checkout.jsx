// Manual Payment Checkout - replaces Stripe with transaction ID submission
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import toast from 'react-hot-toast'
import { useAuth } from "../contexts/AuthContext"
import API_URL from '../config/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const PAYMENT_METHODS = [
    { id: 'bkash', name: 'bKash', color: 'bg-pink-500' },
    { id: 'nagad', name: 'Nagad', color: 'bg-orange-500' },
    { id: 'rocket', name: 'Rocket', color: 'bg-purple-500' },
    { id: 'bank', name: 'Bank Transfer', color: 'bg-blue-500' }
];

const Checkout = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [application, setApplication] = useState(null);

    const [formData, setFormData] = useState({
        paymentMethod: 'bkash',
        transactionId: '',
        senderNumber: '',
        notes: ''
    });

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

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.transactionId.trim()) {
            toast.error('Transaction ID is required');
            return;
        }
        if (!formData.senderNumber.trim()) {
            toast.error('Sender number is required');
            return;
        }

        setSubmitting(true);
        try {
            const paymentData = {
                applicationId: id,
                studentEmail: user.email,
                tutorEmail: application?.tutorEmail,
                tutorName: application?.tutorName,
                amount: application?.expectedSalary,
                paymentMethod: formData.paymentMethod,
                transactionId: formData.transactionId.trim(),
                senderNumber: formData.senderNumber.trim(),
                notes: formData.notes.trim(),
                status: 'pending_verification'
            };

            const res = await fetch(`${API_URL}/api/payments/manual`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });

            if (res.ok) {
                toast.success('Payment submitted for verification');
                navigate('/payment-success');
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Submission failed');
            }
        } catch (error) {
            toast.error(error.message || 'Payment submission failed');
        } finally {
            setSubmitting(false);
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
            <div className="max-w-2xl mx-auto">
                <header className="mb-12 border-b border-gray-200 pb-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Transaction Infrastructure</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payment Submission</h1>
                    <p className="mt-2 text-sm text-gray-500">Submit your payment details for admin verification</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Payment Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Payment Method Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">Payment Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {PAYMENT_METHODS.map(method => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                                            className={`p-4 border rounded-sm text-left transition-all ${formData.paymentMethod === method.id
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 h-3 rounded-full ${method.color}`}></span>
                                                <span className="text-sm font-bold text-gray-900">{method.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Transaction ID */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Transaction ID / Reference</label>
                                <input
                                    type="text"
                                    name="transactionId"
                                    value={formData.transactionId}
                                    onChange={handleChange}
                                    className="input-quiet w-full font-mono"
                                    placeholder="e.g., TXN123456789"
                                    required
                                />
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Enter the transaction ID from your payment confirmation</p>
                            </div>

                            {/* Sender Number */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Sender Phone Number</label>
                                <input
                                    type="text"
                                    name="senderNumber"
                                    value={formData.senderNumber}
                                    onChange={handleChange}
                                    className="input-quiet w-full"
                                    placeholder="01XXXXXXXXX"
                                    required
                                />
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">The phone number used to send payment</p>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Additional Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="textarea-quiet w-full h-24 resize-none"
                                    placeholder="Any additional information..."
                                />
                            </div>

                            {/* Submit */}
                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-quiet-primary px-12 py-4 text-[10px]"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Payment'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm sticky top-8">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Payment Summary</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Professional</p>
                                    <p className="text-sm font-bold text-gray-900">{application?.tutorName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Reference</p>
                                    <p className="text-xs font-mono text-gray-500">#{id?.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Amount Due</p>
                                    <p className="text-2xl font-extrabold text-indigo-600">৳{application?.expectedSalary}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Monthly Fee</p>
                                </div>
                            </div>
                            <div className="p-6 bg-yellow-50 border-t border-yellow-100">
                                <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-widest">
                                    ⚠️ Payment will be verified by admin within 24-48 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
