// Payment submission success page - for manual payment flow
import { useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { AppleCard, AppleButton } from '../components/shared/AppleUI';
import { ShieldCheck, History, LayoutDashboard } from 'lucide-react';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 8000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <AppleCard className="text-center max-w-lg p-12 bg-muted/20 border-none shadow-2xl relative overflow-hidden" hover={false}>
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-3xl -mt-32 rounded-full"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-background border border-border/50 shadow-apple-sm rounded-[2rem] flex items-center justify-center mx-auto mb-10 group">
                        <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                    </div>

                    <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary/10 text-primary mb-4">Verification Pending</span>
                    
                    <h1 className="text-4xl font-bold text-foreground tracking-tight mb-6">Payment Transmitted</h1>
                    
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-10">
                        Your transaction details have been submitted to the curation pipeline.<br />
                        Verification is expected within 24-48 business hours.
                    </p>

                    <div className="p-6 bg-background/50 border border-border/50 rounded-2xl mb-12">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed">
                            Monitor your transaction status via the administrative dashboard
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <AppleButton asChild size="lg" className="h-16 shadow-apple-md">
                            <Link to="/dashboard">
                                <LayoutDashboard size={18} className="mr-3" /> Dashboard
                            </Link>
                        </AppleButton>
                        <AppleButton asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                            <Link to="/payment-history">
                                <History size={16} className="mr-2" /> View History
                            </Link>
                        </AppleButton>
                    </div>
                </div>
            </AppleCard>
        </div>
    );
};

export default PaymentSuccess;
