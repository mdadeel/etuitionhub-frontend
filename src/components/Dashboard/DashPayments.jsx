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
        <div className="fade-up space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm border border-teal-100/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">Payment Verification</h2>
                        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-400">Systems Audit Interface</p>
                    </div>
                </div>
                {pendingCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100/50 rounded-lg">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-700">
                            {pendingCount} Critical
                        </span>
                    </div>
                )}
            </header>

            {/* Filter Tabs */}
            <div className="flex bg-gray-50/50 p-1 rounded-xl gap-1 border border-gray-100/50 w-fit">
                {[
                    { id: 'pending_verification', label: 'Pending' },
                    { id: 'verified', label: 'Verified' },
                    { id: 'rejected', label: 'Rejected' },
                    { id: 'all', label: 'All Logs' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${filter === tab.id
                            ? 'bg-white text-teal-600 shadow-sm ring-1 ring-black/5'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Payments Table */}
            {filteredPayments.length === 0 ? (
                <div className="py-20 text-center bg-gray-50/30 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">
                        No transactions found
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/30 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Sender</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Tutor</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Protocol</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Reference</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Yield</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredPayments.map((payment) => {
                                    const method = PAYMENT_METHOD_LABELS[payment.paymentMethod] || { name: payment.paymentMethod, color: 'bg-gray-500' };
                                    const status = STATUS_STYLES[payment.status] || STATUS_STYLES.pending_verification;

                                    return (
                                        <tr key={payment._id} className="hover:bg-teal-50/10 transition-colors">
                                            <td className="px-6 py-3.5 text-[10px] font-black text-gray-300">
                                                {new Date(payment.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <p className="text-[11px] font-black text-gray-800 leading-none">{payment.studentEmail.split('@')[0]}</p>
                                                <p className="text-[8px] text-gray-400 font-bold mt-0.5">{payment.senderNumber}</p>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <p className="text-[11px] font-black text-gray-800">{payment.tutorName || '—'}</p>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-1 h-1 rounded-full ${method.color}`}></span>
                                                    <span className="text-[9px] font-black text-gray-700 uppercase">{method.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-center">
                                                <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100/30 uppercase">{payment.transactionId}</span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <p className="text-xs font-black text-gray-900 tracking-tight">৳{payment.amount}</p>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ${status.bg} ${status.text} border ${status.border} rounded shadow-sm opacity-90`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                {payment.status === 'pending_verification' && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleVerify(payment._id)}
                                                            disabled={processingId === payment._id}
                                                            className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all disabled:opacity-50"
                                                        >
                                                            Verify
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(payment._id)}
                                                            disabled={processingId === payment._id}
                                                            className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-all disabled:opacity-50"
                                                        >
                                                            Drop
                                                        </button>
                                                    </div>
                                                )}
                                                {payment.status !== 'pending_verification' && (
                                                    <span className="text-[9px] font-black text-gray-200 uppercase tracking-widest">Done</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashPayments;
