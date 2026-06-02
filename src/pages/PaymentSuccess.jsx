import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowRight, Receipt, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '../services/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        const paymentId = searchParams.get('payment_id');
        if (!paymentId) return;
        api.get(`/api/payments/${paymentId}`)
            .then((res) => setPayment(res.data))
            .catch(() => {});
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6 selection:bg-primary/30 selection:text-primary">
            <div className="max-w-2xl w-full">
                <div className="border border-border bg-card p-10 md:p-14 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-1 bg-emerald-500"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Submission Confirmed</span>
                    </div>

                    <div className="flex items-start gap-6 mb-10">
                        <div className="size-16 rounded-none bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                            <CheckCircle size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase italic leading-[0.9]">
                                Payment Submitted.
                            </h1>
                            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                                Your payment has been received and is awaiting admin verification. You will be notified once it is reviewed.
                            </p>
                        </div>
                    </div>

                    <div className="border border-border bg-muted/20 p-6 mb-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Verification Timeline</p>
                        <div className="space-y-4">
                            <TimelineStep icon={Receipt} label="Submitted" detail="Payment details received" status="done" />
                            <TimelineStep icon={Clock} label="Under Review" detail="Admin verifies transaction (24-48h)" status="active" />
                            <TimelineStep icon={CheckCircle} label="Approved" detail="Tutor wallet credited" status="pending" />
                        </div>
                    </div>

                    <div className="border border-emerald-500/30 bg-emerald-500/5 p-5 mb-10 flex items-start gap-4">
                        <Mail size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-foreground/80 leading-relaxed">
                            A confirmation email has been sent. You can track this payment's status in your dashboard.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => navigate('/dashboard/payments')} className="flex-1 h-14 rounded-none font-black uppercase tracking-[0.2em] text-[11px]">
                            View My Payments <ArrowRight size={16} className="ml-2" />
                        </Button>
                        <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1 h-14 rounded-none font-black uppercase tracking-[0.2em] text-[11px] border-border">
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimelineStep = ({ icon: Icon, label, detail, status }) => {
    const colors = {
        done: 'bg-emerald-500/10 text-emerald-600',
        active: 'bg-amber-500/10 text-amber-600 animate-pulse',
        pending: 'bg-muted text-muted-foreground',
    };
    return (
        <div className="flex items-center gap-4">
            <div className={`size-10 rounded-none flex items-center justify-center shrink-0 ${colors[status]}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-sm font-black text-foreground uppercase tracking-tight">{label}</p>
                <p className="text-xs text-muted-foreground">{detail}</p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
