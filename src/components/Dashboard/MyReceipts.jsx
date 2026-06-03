import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Receipt as ReceiptIcon, Calendar, FileText } from 'lucide-react';
import ReceiptModal from '../shared/ReceiptModal';

/**
 * Lists all the user's receipts (student or tutor) with click-to-open modal.
 * Reachable from student/tutor sidebar.
 */
const MyReceipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/receipts/me');
            setReceipts(res.data || []);
        } catch {
            toast.error('Failed to load receipts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="border-b border-border pb-6">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-1.5 bg-primary rounded-none"></div>
                    <span className="text-[9px] font-heading font-black uppercase tracking-[0.25em] text-primary">Financial Records</span>
                </div>
                <h2 className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight text-foreground">My Receipts</h2>
                <p className="text-xs text-muted-foreground mt-1">All payment receipts for transactions you participated in.</p>
            </header>

            {receipts.length === 0 ? (
                <div className="bg-card border border-border p-12 text-center">
                    <ReceiptIcon size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-xs text-muted-foreground">No receipts yet. Receipts are generated once an admin verifies a payment.</p>
                </div>
            ) : (
                <div className="bg-card border border-border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border text-left text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground">
                                <th className="px-6 py-4">Receipt #</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Counterparty</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {receipts.map(r => (
                                <tr key={r._id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-muted-foreground" />
                                            <span className="text-sm font-mono font-bold text-foreground">{r.receiptNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(r.generatedAt || r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground">
                                        {r.studentEmail === r.tutorEmail ? 'N/A' : (r.tutorId?.displayName || r.tutorEmail)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-bold text-foreground tabular-nums">৳{r.amount?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setOpenId(r.paymentId?._id || r.paymentId)}
                                            className="text-[9px] font-heading font-black uppercase tracking-widest text-primary hover:underline"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {openId && <ReceiptModal paymentId={openId} onClose={() => setOpenId(null)} />}
        </div>
    );
};

export default MyReceipts;
