// Admin Login Page
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { isAdmin, isAdminPath, defaultRouteFor } from '../lib/authz';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2 } from "lucide-react";
import SEO from '../components/shared/SEO';

const AdminLogin = () => {
    const { register, handleSubmit } = useForm();
    const { loginAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        if (!data.email || !data.password) {
            toast.error('All fields are required');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Authenticating...');

        try {
            const dbUser = await loginAdmin(data.email, data.password);
            toast.dismiss(toastId);

            if (!dbUser) {
                toast.error('Could not verify administrator access. Please try again.');
                setLoading(false);
                return;
            }

            if (!isAdmin(dbUser)) {
                toast.error('This account does not have administrator access.');
                setLoading(false);
                return;
            }

            toast.success('Admin login successful!');

            // Return to the protected admin route if there was one; otherwise
            // land in the admin app — never the student dashboard.
            const requested = location.state?.from?.pathname;
            const from = isAdminPath(requested) ? requested : defaultRouteFor(dbUser);
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Admin login error:', err);
            toast.dismiss(toastId);
            if (err.code === 'auth/user-not-found') {
                toast.error('No admin account found with this email.');
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                toast.error('Incorrect password.');
            } else {
                toast.error('Authentication failed. Verify your admin credentials.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
            <SEO title="Admin Portal | eTuitionBD" description="Restricted area for authorized administrators only." noIndex={true} />
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-3">
                        <ShieldCheck className="size-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary block mb-1">Restricted Access</span>
                    <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">Admin Portal</h1>
                    <p className="text-muted-foreground text-sm mt-1">This area is for authorized administrators only.</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-email" className="text-xs font-semibold text-foreground">
                                Admin Email
                            </Label>
                            <Input
                                id="admin-email"
                                type="email"
                                autoComplete="email"
                                {...register('email', { required: true })}
                                placeholder="admin@domain.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="admin-password" className="text-xs font-semibold text-foreground">
                                Password
                            </Label>
                            <Input
                                id="admin-password"
                                type="password"
                                autoComplete="current-password"
                                {...register('password', { required: true })}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2"
                        >
                            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        Not an admin? <Link to="/login" className="text-primary hover:underline font-medium">Return to User Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
