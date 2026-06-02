import { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Receipt, X, Printer, Download } from 'lucide-react';

/**
 * Receipt modal: fetches /api/receipts/me and shows the matching receipt for a given paymentId.
 * Owner can print or download (data URL text).
 */
const ReceiptModal = ({ paymentId, onClose }) => {
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!paymentId) return;
        setLoading(true);
        try {
            const res = await api.get('/api/receipts/me');
            const match = (res.data || []).find(r => r.paymentId?._id === paymentId || r.paymentId === paymentId);
            if (!match) {
                toast.error('Receipt not available yet');
                return;
            }
            setReceipt(match);
        } catch {
            toast.error('Failed to load receipt');
        } finally {
            setLoading(false);
        }
    }, [paymentId]);

    useEffect(() => {
        load();
    }, [load]);

    if (!paymentId) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Receipt size={18} className="text-primary" />
                        <h2 className="text-sm font-heading font-black uppercase tracking-widest">Payment Receipt</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-muted transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {loading && <div className="p-10 text-center text-xs text-muted-foreground">Loading...</div>}

                {!loading && receipt && (
                    <div className="p-8 space-y-6">
                        <div className="text-center pb-6 border-b border-border">
                            <p className="text-[10px] font-heading font-black uppercase tracking-widest text-muted-foreground">Receipt No.</p>
                            <p className="text-2xl font-heading font-black text-primary mt-1">{receipt.receiptNumber}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                                {new Date(receipt.generatedAt || receipt.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground">Student</p>
                                <p className="text-sm font-bold text-foreground mt-1">{receipt.studentId?.displayName || 'N/A'}</p>
                                <p className="text-xs text-muted-foreground">{receipt.studentEmail}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground">Tutor</p>
                                <p className="text-sm font-bold text-foreground mt-1">{receipt.tutorId?.displayName || 'N/A'}</p>
                                <p className="text-xs text-muted-foreground">{receipt.tutorEmail}</p>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-6 space-y-3">
                            <Row label="Amount" value={`৳${receipt.amount?.toLocaleString()}`} />
                            <Row label={`Platform Commission (${receipt.commissionPercentage}%)`} value={`-৳${receipt.commissionAmount?.toLocaleString()}`} />
                            <div className="border-t border-border pt-3">
                                <Row label="Net to Tutor" value={`৳${receipt.netAmount?.toLocaleString()}`} bold />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground">Payment Method</p>
                                <p className="text-sm font-bold text-foreground mt-1 uppercase">{receipt.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground">Transaction ID</p>
                                <p className="text-sm font-mono font-bold text-foreground mt-1 break-all">{receipt.transactionId}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-border">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 h-10 px-4 border border-border text-[10px] font-heading font-black uppercase tracking-widest hover:bg-muted transition-colors flex items-center justify-center gap-2"
                            >
                                <Printer size={14} /> Print
                            </button>
                            <button
                                onClick={() => {
                                    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${receipt.receiptNumber}.json`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                                className="flex-1 h-10 px-4 bg-primary text-white text-[10px] font-heading font-black uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={14} /> Download
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Row = ({ label, value, bold }) => (
    <div className="flex items-center justify-between">
        <span className={`text-xs ${bold ? 'font-heading font-black uppercase tracking-widest' : 'text-muted-foreground'}`}>{label}</span>
        <span className={`text-sm tabular-nums ${bold ? 'font-heading font-black text-primary' : 'font-bold text-foreground'}`}>{value}</span>
    </div>
);

export default ReceiptModal;
