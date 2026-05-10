import { useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, History, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 8000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="text-center max-w-md bg-white p-8 rounded-lg border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                </div>

                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 mb-4">Verification Pending</span>

                <h1 className="text-xl font-semibold text-slate-900 mb-4">Payment Submitted</h1>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Your transaction has been submitted for verification.
                    This typically takes 24-48 business hours.
                </p>

                <div className="p-4 bg-slate-50 rounded-lg mb-6">
                    <p className="text-sm text-slate-600">
                        Monitor your transaction status in the dashboard
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button asChild className="w-full h-10">
                        <Link to="/dashboard">
                            <LayoutDashboard size={16} className="mr-2" /> Dashboard
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-10">
                        <Link to="/payment-history">
                            <History size={16} className="mr-2" /> View History
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess