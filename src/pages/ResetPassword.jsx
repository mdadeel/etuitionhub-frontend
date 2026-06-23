import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import Logo from '../components/shared/Logo';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyResetCode, confirmReset } = useAuth();

    const oobCode = searchParams.get('oobCode');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (!oobCode) {
            setError('Invalid or missing reset link. Please request a new one.');
            setVerifying(false);
            return;
        }

        verifyResetCode(oobCode)
            .then((emailAddress) => {
                setEmail(emailAddress);
                setVerifying(false);
            })
            .catch(() => {
                setError('This reset link is invalid or has expired. Please request a new one.');
                setVerifying(false);
            });
    }, [oobCode, verifyResetCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await confirmReset(oobCode, newPassword);
            setResetSuccess(true);
            toast.success('Password has been reset successfully!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error('Password reset error:', err);
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Loading state while verifying the reset code
    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden bg-pattern-academic">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                <div className="w-full max-w-md z-10">
                    <div className="bg-card border border-border rounded-xl shadow-premium overflow-hidden p-5 sm:p-6 text-center">
                        <div className="flex justify-center mb-3">
                            <Logo textSize="text-xl" boxSize="size-12" iconSize="size-8" />
                        </div>
                        <div className="size-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground font-body">Verifying reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden bg-pattern-academic">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                <div className="w-full max-w-md z-10">
                    <div className="bg-card border border-border rounded-xl shadow-premium overflow-hidden p-5 sm:p-6 text-center">
                        <div className="size-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-heading font-bold text-foreground mb-2">Link Expired</h2>
                        <p className="text-xs text-muted-foreground font-body mb-6 leading-relaxed">
                            {error}
                        </p>
                        <Link
                            to="/password-reset"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                        >
                            <ArrowLeft size={14} /> Request a New Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (resetSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden bg-pattern-academic">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                <div className="w-full max-w-md z-10">
                    <div className="bg-card border border-border rounded-xl shadow-premium overflow-hidden p-5 sm:p-6 text-center">
                        <div className="size-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="size-6" />
                        </div>
                        <h2 className="text-xl font-heading font-bold text-foreground mb-2">Password Reset Complete</h2>
                        <p className="text-xs text-muted-foreground font-body mb-6 leading-relaxed">
                            Your password has been updated. Redirecting to login...
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                        >
                            <ArrowLeft size={14} /> Go to Login Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Form state
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden bg-pattern-academic">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

            <div className="w-full max-w-md z-10">
                <div className="bg-card border border-border rounded-xl shadow-premium overflow-hidden p-5 sm:p-6">

                    <div className="text-center mb-4">
                        <div className="flex justify-center mb-3">
                            <Logo textSize="text-xl" boxSize="size-12" iconSize="size-8" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">
                            Set New Password
                        </h1>
                        <p className="text-sm text-muted-foreground font-body mt-1">
                            Creating a new password for <span className="font-medium text-foreground">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-2.5">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground block font-label uppercase tracking-wider">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        required
                                        className="pl-9 pr-10 h-11 bg-input/40 border border-border focus-visible:border-primary text-foreground rounded-xl transition-smooth"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground block font-label uppercase tracking-wider">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter your password"
                                        required
                                        className="pl-9 h-11 bg-input/40 border border-border focus-visible:border-primary text-foreground rounded-xl transition-smooth"
                                    />
                                </div>
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-[11px] text-destructive mt-1">Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-smooth active:scale-[0.98] text-sm shadow-sm"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-center text-xs font-body text-muted-foreground">
                            <Link
                                to="/login"
                                className="font-heading font-bold text-primary hover:underline inline-flex items-center gap-0.5"
                            >
                                <ArrowLeft size={12} />
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
