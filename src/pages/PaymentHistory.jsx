// payment history page
import { useState, useEffect } from "react"
import { useAuth } from '../contexts/AuthContext'
import API_URL from '../config/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;
        fetchPayments();
    }, [user]);

    const fetchPayments = async () => {
        try {
            const res = await fetch(`${API_URL}/api/payments/student/${user.email}`);
            const data = await res.json();
            setPayments(data);
        } catch (error) {
            toast.error('Log recovery failure: Could not sync transaction history.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="fade-up container mx-auto px-8 py-20 lg:px-12 max-w-5xl">
            <header className="mb-12 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Financial Infrastructure</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Yield History Logs</h1>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-sm border border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Entries</span>
                    <span className="text-sm font-bold text-gray-900">{payments.length}</span>
                </div>
            </header>

            {payments.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Zero transaction records detected in current sector.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Professional Node</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Yield Volume</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.map((payment) => (
                                <tr key={payment._id || payment.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-5 text-xs font-mono text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs font-bold text-gray-900 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{payment.tutorName}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-extrabold text-gray-900 tracking-tight">৳{payment.amount}</p>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-sm">
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory
