import { useState, useEffect } from "react"
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';
import { Database, Banknote, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * PaymentHistory Page
 * Refactored to "Technical Emerald Minimalism"
 */
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
            const res = await api.get(`/api/payments/student/${user.email}`);
            setPayments(res.data);
        } catch (error) {
            toast.error('Log recovery failure: Could not sync transaction history.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-background min-h-screen py-20 px-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary animate-in fade-in duration-700">
            {/* Background Technical Grid Element */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-16 border-b border-border pb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-1 bg-primary"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Financial Infrastructure</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-[0.85]">Yield Logs.</h1>
                    </div>
                    <div className="flex items-center gap-4 bg-muted/20 px-6 py-4 rounded-none border border-border shrink-0 group hover:border-primary transition-colors">
                        <Database size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Entries</span>
                        <span className="text-sm font-black text-foreground tabular-nums">{payments.length}</span>
                    </div>
                </header>

                {payments.length === 0 ? (
                    <div className="py-40 text-center bg-muted/10 border border-dashed border-border rounded-none group relative overflow-hidden">
                        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                             style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 0), linear-gradient(90deg, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                        </div>
                        <div className="relative z-10">
                            <Banknote size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic leading-relaxed">
                                Zero transaction records detected in current sector.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-background border border-border shadow-2xl overflow-hidden relative">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted border-b border-border">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground"><Clock size={12} className="inline mr-2" /> Timestamp</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Professional Node</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Yield Volume</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {payments.map((payment) => (
                                        <tr key={payment._id || payment.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-10 py-8 text-[10px] font-black text-muted-foreground tabular-nums tracking-widest uppercase">
                                                {new Date(payment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <p className="text-sm font-black text-foreground uppercase tracking-tight italic transition-colors group-hover:text-primary">
                                                        {payment.tutorName}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <p className="text-base font-black text-foreground tabular-nums italic">৳{payment.amount}</p>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                {(() => {
                                                    const statusMap = {
                                                        pending_verification: { label: 'PENDING', class: 'text-amber-500 border-amber-500/20 bg-amber-500/5' },
                                                        verified: { label: 'VERIFIED', class: 'text-primary border-primary bg-primary/5' },
                                                        completed: { label: 'COMPLETED', class: 'text-primary border-primary bg-primary/5' },
                                                        rejected: { label: 'REJECTED', class: 'text-destructive border-destructive/20 bg-destructive/5' }
                                                    };
                                                    const s = statusMap[payment.status] || statusMap.pending_verification;
                                                    return (
                                                        <Badge variant="outline" className={`rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest ${s.class}`}>
                                                            {s.label}
                                                        </Badge>
                                                    );
                                                })()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <footer className="mt-20 flex justify-end">
                    <div className="flex items-center gap-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">
                        <ShieldCheck size={14} className="text-primary" /> End-to-end encrypted ledger synchronization
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PaymentHistory;
