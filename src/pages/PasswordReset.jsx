import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail } from 'lucide-react';
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="max-w-md w-full p-8 bg-white rounded-lg border border-slate-200 shadow-sm text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Check Your Email</h2>
                    <p className="text-slate-600 mb-6">We've sent password reset instructions to {email}</p>
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full p-8 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="mb-6">
                    <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4">
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Login
                    </Link>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-4">
                        <Mail size={24} />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Reset Password</h2>
                    <p className="text-sm text-slate-500">Enter your email and we'll send you reset instructions</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="text-sm font-medium text-slate-600 mb-2 block">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                        />
                    </div>
                    
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>
                
                <p className="mt-6 text-center text-sm text-slate-600">
                    Remember your password?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default PasswordReset;