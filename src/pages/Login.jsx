// login page comp
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight, FiShield, FiUser } from 'react-icons/fi'

let Login = () => {
    let { register, handleSubmit, setValue } = useForm()
    let { login, googleLogin } = useAuth()
    let navigate = useNavigate()
    let location = useLocation()
    let from = location.state?.from?.pathname || '/dashboard'
    let [loading, setLoading] = useState(false)

    // submit fn
    let onSubmit = async (data) => {
        if (!data?.email) {
            toast.error('Email required')
            return
        }
        if (!data?.password) {
            toast.error('Password required')
            return
        }

        setLoading(true)
        const toastId = toast.loading("Authenticating...")

        login(data.email, data.password)
            .then(() => {
                toast.dismiss(toastId)
                toast.success('Access Granted')
                navigate(from, { replace: true })
            })
            .catch((err) => {
                console.error('Login error', err)
                toast.dismiss(toastId)
                toast.error('Authentication Failed')
                setLoading(false)
            })
    }

    // google login fn
    let handleGoogleLogin = async () => {
        try {
            await googleLogin()
            toast.success('Google Authentication Successful')
            navigate(from, { replace: true })
        } catch (error) {
            toast.error('Google Authentication Failed')
        }
    }

    const fillDemo = (role) => {
        const creds = role === 'admin'
            ? { email: 'demoadmin@etuition.com', password: 'password123' }
            : { email: 'student1@email.com', password: 'password123' };

        setValue('email', creds.email);
        setValue('password', creds.password);
        toast.success(`Demo ${role} credentials loaded`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] relative overflow-hidden font-inter selection:bg-teal-100 p-6">
            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[1000px] relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[40px] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                        {/* Primary Column: Login Form */}
                        <div className="md:col-span-7 p-10 lg:p-14">
                            {/* Header */}
                            <div className="mb-10 text-left">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20 mb-6">
                                    <FiShield size={28} />
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h1>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Secure Entry Protocol // v2.0</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Identity Vector</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                                                <FiMail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                {...register("email", { required: true })}
                                                className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Access Cipher</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                                                <FiLock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                {...register("password", { required: true })}
                                                className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] px-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded-md border-gray-200 text-teal-600 focus:ring-teal-600 transition-all" />
                                        <span className="font-bold text-gray-500 group-hover:text-gray-700">Remember Node</span>
                                    </label>
                                    <button type="button" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">Recovery Required?</button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl shadow-lg shadow-teal-600/20 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Authorize Access
                                            <FiArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Secondary Column: Alternate Entry */}
                        <div className="md:col-span-5 bg-gray-50/50 border-l border-gray-100 p-10 lg:p-14 flex flex-col justify-center">
                            <div className="space-y-8">
                                <div className="text-left md:text-center lg:text-left">
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">Alternate Channels</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect via secondary protocols</p>
                                </div>

                                {/* Social Sync */}
                                <div className="space-y-4">
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="w-full h-14 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-700 uppercase tracking-widest hover:bg-white hover:border-teal-500 hover:text-teal-600 shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google Identity Sync
                                    </button>

                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => fillDemo('user')}
                                            className="h-14 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-teal-50 hover:border-teal-100 hover:text-teal-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                        >
                                            <FiUser size={16} />
                                            Student Demo Node
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/admin-login')}
                                            className="h-14 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 hover:border-gray-200 hover:text-gray-900 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                        >
                                            <FiShield size={16} />
                                            Admin Portal
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-200/60">
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                                        New to the infrastructure?
                                    </p>
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center gap-2 text-teal-600 font-black text-[12px] uppercase tracking-wider hover:translate-x-1 transition-transform"
                                    >
                                        Register Requirement
                                        <FiArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Stats */}
                <div className="flex justify-between mt-8 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> System Active</span>
                    <span>Encrypted // TLS 1.3 // Node BD-01</span>
                </div>
            </motion.div>
        </div>
    )
}

export default Login


