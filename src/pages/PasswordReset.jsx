import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email);
            setEmailSent(true);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (error) {
            console.error('Password reset error:', error);
            if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email address');
            } else if (error.code === 'auth/user-not-found') {
                toast.error('No user found with this email');
            } else {
                toast.error('Failed to send reset email');
            }
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden bg-pattern-academic">
                {/* Header Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                
                <div className="w-full max-w-md z-10">
                    <div className="bg-card border-2 border-border rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] overflow-hidden p-6 sm:p-8 text-center">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-none flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-heading font-bold text-foreground mb-2">Check Your Email</h2>
                        <p className="text-xs text-muted-foreground font-body mb-6 leading-relaxed">
                            We've sent password reset instructions to <span className="font-semibold text-foreground">{email}</span>. Please check your inbox and spam folders.
                        </p>
                        <Link 
                            to="/login" 
                            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-primary hover:underline uppercase tracking-wider"
                        >
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden bg-pattern-academic">
            {/* Header Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

            <div className="w-full max-w-md z-10">
                <div className="bg-card border-2 border-border rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] overflow-hidden p-6 sm:p-8">
                    
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <div className="bg-primary p-1.5 text-primary-foreground rounded-none">
                                <Shield size={18} className="stroke-[2.5]" />
                            </div>
                            <span className="font-heading text-lg font-bold tracking-tight uppercase text-foreground">e-TuitionBD</span>
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-foreground">
                            Reset Password
                        </h1>
                        <p className="text-xs text-muted-foreground font-body mt-1">
                            Enter your email to receive reset instructions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@domain.com"
                                    required
                                    className="pl-9 h-10 bg-input/40 border-2 border-border focus-visible:border-primary text-foreground rounded-none transition-smooth"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold uppercase tracking-wider transition-smooth active:scale-[0.99] text-xs"
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </Button>
                    </form>

                    <p className="text-center text-xs font-body text-muted-foreground mt-6 pt-5 border-t border-border">
                        Remember your password?{' '}
                        <Link to="/login" className="font-heading font-bold text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;