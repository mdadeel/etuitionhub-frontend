// Admin Payment Verification Dashboard
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const PAYMENT_METHOD_LABELS = {
    bkash: { name: 'bKash', color: 'bg-pink-500' },
    nagad: { name: 'Nagad', color: 'bg-orange-500' },
    rocket: { name: 'Rocket', color: 'bg-purple-500' },
    bank: { name: 'Bank Transfer', color: 'bg-blue-500' }
};

const STATUS_STYLES = {
    pending_verification: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100', label: 'Pending' },
    verified: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', label: 'Verified' },
    completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', label: 'Completed' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', label: 'Rejected' }
};

const DashPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending_verification');
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const res = await api.get('/api/payments/all');
            setPayments(res.data || []);
        } catch (err) {
            console.error('Payment load error:', err);
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id) => {
        if (!confirm('Verify this payment as successful?')) return;
        setProcessingId(id);
        try {
            await api.patch(`/api/payments/${id}`, { status: 'verified' });
            toast.success('Payment verified successfully');
            setPayments(prev => prev.map(p => p._id === id ? { ...p, status: 'verified' } : p));
        } catch (err) {
            toast.error('Verification failed');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Reject this payment? This action cannot be undone.')) return;
        setProcessingId(id);
        try {
            await api.patch(`/api/payments/${id}`, { status: 'rejected' });
            toast.success('Payment rejected');
            setPayments(prev => prev.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
        } catch (err) {
            toast.error('Rejection failed');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredPayments = filter === 'all'
        ? payments
        : payments.filter(p => p.status === filter);

    const pendingCount = payments.filter(p => p.status === 'pending_verification').length;

    if (loading) return <LoadingSpinner />;

    return (
        <div className="fade-up">
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Payment Verification</h2>
                    <p className="text-xs text-gray-500 mt-1">Review and verify manual payment submissions</p>
                </div>
                {pendingCount > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-sm">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-700">
                            {pendingCount} Pending Review
                        </span>
                    </div>
                )}
            </header>

            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-sm gap-1 mb-8">
                {[
                    { id: 'pending_verification', label: 'Pending' },
                    { id: 'verified', label: 'Verified' },
                    { id: 'rejected', label: 'Rejected' },
                    { id: 'all', label: 'All' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${filter === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Payments Table */}
            {filteredPayments.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                        No payments in this category
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Student</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Tutor</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Method</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Transaction</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredPayments.map((payment) => {
                                const method = PAYMENT_METHOD_LABELS[payment.paymentMethod] || { name: payment.paymentMethod, color: 'bg-gray-500' };
                                const status = STATUS_STYLES[payment.status] || STATUS_STYLES.pending_verification;

                                return (
                                    <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5 text-xs font-mono text-gray-500">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-bold text-gray-900">{payment.studentEmail}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">{payment.senderNumber}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-bold text-gray-900">{payment.tutorName}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${method.color}`}></span>
                                                <span className="text-xs font-medium text-gray-700">{method.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-mono font-bold text-gray-900">{payment.transactionId}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-extrabold text-gray-900">৳{payment.amount}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 ${status.bg} ${status.text} border ${status.border} rounded-sm`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {payment.status === 'pending_verification' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleVerify(payment._id)}
                                                        disabled={processingId === payment._id}
                                                        className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-sm hover:bg-green-100 transition-colors disabled:opacity-50"
                                                    >
                                                        Verify
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(payment._id)}
                                                        disabled={processingId === payment._id}
                                                        className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {payment.status !== 'pending_verification' && (
                                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DashPayments;
