import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../../services/api';
import { Receipt as ReceiptIcon, Calendar, FileText } from 'lucide-react';
import DataTable from '@/components/ui/data-table';
import ReceiptModal from '../shared/ReceiptModal';
import { TableSkeleton } from "@/components/shared/skeletons";

/**
 * Lists all the user's receipts (student or tutor) with click-to-open modal.
 * Reachable from student/tutor sidebar.
 */
const MyReceipts = ({ hideHeader }) => {
    // Batch 5 (audit Exec #2): cached query + table skeleton instead of a
    // full-page spinner early-return; failures render inline with retry.
    const { data: receipts = [], isLoading: loading, isError, refetch } = useQuery({
        queryKey: ['receipts', 'me'],
        queryFn: async ({ signal }) => {
            const res = await api.get('/api/receipts/me', { signal });
            return res.data || [];
        },
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    });
    const [openId, setOpenId] = useState(null);

    if (loading) {
        return (
            <div className="space-y-8 animate-in fade-in-up duration-700">
                <TableSkeleton rows={5} columns={4} />
            </div>
        );
    }

    if (isError && receipts.length === 0) {
        return (
            <div className="space-y-8 animate-in fade-in-up duration-700">
                <div className="bg-card border border-border p-12 text-center">
                    <ReceiptIcon size={32} className="mx-auto text-destructive/40 mb-3" />
                    <p className="text-sm font-semibold text-foreground mb-1">Couldn&apos;t load receipts</p>
                    <p className="text-xs text-muted-foreground mb-6">Check your connection and try again.</p>
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in-up duration-700">
            {!hideHeader && (
                <header className="border-b border-border pb-6">
                    <div className="flex items-center gap-2 mb-3">
<div className="w-6 h-1.5 bg-primary rounded-lg"></div>
                            <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Financial Records</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">My Receipts</h2>
                    <p className="text-xs text-muted-foreground mt-1">All payment receipts for transactions you participated in.</p>
                </header>
            )}

            {receipts.length === 0 ? (
                <div className="bg-card border border-border p-12 text-center">
                    <ReceiptIcon size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-xs text-muted-foreground">No receipts yet. Receipts are generated once an admin verifies a payment.</p>
                </div>
            ) : (
                <DataTable
                    rowKey={(r) => r._id}
                    data={receipts}
                    emptyState={
                        <div className="bg-card border border-border p-12 text-center">
                            <ReceiptIcon size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                            <p className="text-xs text-muted-foreground">No receipts yet. Receipts are generated once an admin verifies a payment.</p>
                        </div>
                    }
                    columns={[
                        {
                            key: 'receiptNumber',
                            label: 'Receipt #',
                            render: (val) => (
                                <div className="flex items-center gap-2">
                                    <FileText size={14} className="text-muted-foreground" />
                                    <span className="text-sm font-mono font-bold text-foreground">{val}</span>
                                </div>
                            ),
                        },
                        {
                            key: 'createdAt',
                            label: 'Date',
                            render: (val, r) => (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar size={12} />
                                    {new Date(r.generatedAt || val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </div>
                            ),
                        },
                        {
                            key: 'tutorEmail',
                            label: 'Counterparty',
                            render: (val, r) => (
                                <span className="text-xs text-muted-foreground">
                                    {r.studentEmail === r.tutorEmail ? 'N/A' : (r.tutorId?.displayName || val)}
                                </span>
                            ),
                        },
                        {
                            key: 'amount',
                            label: 'Amount',
                            align: 'right',
                            render: (val) => (
                                <span className="text-sm font-bold text-foreground tabular-nums">৳{val?.toLocaleString()}</span>
                            ),
                        },
                        {
                            key: '_id',
                            label: 'Action',
                            align: 'right',
                            render: (_val, r) => (
                                <button
                                    onClick={() => setOpenId(r.paymentId?._id || r.paymentId)}
                                    className="text-[9px] font-heading font-bold uppercase tracking-wider text-primary hover:underline active:scale-[0.98]"
                                >
                                    View
                                </button>
                            ),
                        },
                    ]}
                />
            )}

            {openId && <ReceiptModal paymentId={openId} onClose={() => setOpenId(null)} />}
        </div>
    );
};

export default MyReceipts;
