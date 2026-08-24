// Admin Login Page
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { isAdmin, isAdminPath, defaultRouteFor } from '../lib/authz';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 block mb-2">Restricted Access</span>
                    <h1 className="text-3xl font-extrabold text-white">Admin Portal</h1>
                    <p className="text-gray-400 text-sm mt-2">This area is for authorized administrators only.</p>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                {...register('email', { required: true })}
                                className="w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                                placeholder="admin@domain.com"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                {...register('password', { required: true })}
                                className="w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        Not an admin? <Link to="/login" className="text-teal-400 hover:underline">Return to User Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
