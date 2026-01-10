// Admin Login Page
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
    const { register, handleSubmit, setValue } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        if (!data.email || !data.password) {
            toast.error('All fields are required');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Authenticating...');

        try {
            await login(data.email, data.password);
            toast.dismiss(toastId);
            toast.success('Admin login successful!');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Admin login error:', err);
            toast.dismiss(toastId);
            toast.error('Authentication failed. Verify your admin credentials.');
            setLoading(false);
        }
    };

    const fillDemoAdmin = () => {
        setValue('email', 'demoadmin@etuition.com');
        setValue('password', 'password123');
        toast.success('Demo Admin credentials filled. Click Login.');
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

                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={fillDemoAdmin}
                            className="w-full h-10 bg-gray-700 border border-gray-600 text-gray-300 font-medium text-sm rounded-lg hover:bg-gray-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                            Use Demo Admin Account
                        </button>
                    </div>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        Not an admin? <Link to="/login" className="text-teal-400 hover:underline">Return to User Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
