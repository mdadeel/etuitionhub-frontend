import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail } from 'lucide-react';
import Logo from '../components/shared/Logo';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from '@/components/shared/SEO';

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
            // SECURITY: Always show success message to prevent email enumeration
            toast.success('If an account exists with this email, you will receive a reset link.');
        } catch (error) {
            console.error('Password reset error:', error);
            // SECURITY: Show same message for all errors to prevent email enumeration
            setEmailSent(true);
            toast.success('If an account exists with this email, you will receive a reset link.');
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden ">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

                <div className="w-full max-w-md z-10">
                    <div className="bg-card border border-border rounded-xl  overflow-hidden p-5 sm:p-6 text-center">
                        <div className="size-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-heading font-bold text-foreground mb-2">Check Your Email</h2>
                        <p className="text-xs text-muted-foreground font-body mb-6 leading-relaxed">
                            We've sent password reset instructions to <span className="font-semibold text-foreground">{email}</span>. Please check your inbox and spam folders.
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                        >
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden ">
            <SEO title="Reset Password | eTuitionBD" description="Reset your eTuitionBD account password. We'll send you a link to create a new one." />
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

            <div className="w-full max-w-md z-10">
                <div className="bg-card border border-border rounded-xl  overflow-hidden p-5 sm:p-6">

                    <div className="text-center mb-4">
                        <div className="flex justify-center mb-3">
                            <Logo textSize="text-xl" boxSize="size-12" iconSize="size-8" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">
                            Reset Password
                        </h1>
                        <p className="text-sm text-muted-foreground font-body mt-1">
                            Enter your email to receive reset instructions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-2.5">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground block font-label uppercase tracking-wider">
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
                                        className="pl-9 h-11 bg-input/40 border border-border focus-visible:border-primary text-foreground rounded-xl transition-smooth"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-smooth active:scale-[0.98] text-sm shadow-sm"
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </Button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-center text-xs font-body text-muted-foreground">
                            Remember your password?{' '}
                            <Link
                                to="/login"
                                className="font-heading font-bold text-primary hover:underline inline-flex items-center gap-0.5"
                            >
                                Sign In
                                <ArrowLeft size={12} />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
