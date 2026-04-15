import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Shield, User, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Login Page
 * Refactored to "Technical Emerald Minimalism"
 * Features: Sharp geometry, high-contrast typography, emerald accents
 */
const Login = () => {
    const { register, handleSubmit, setValue } = useForm()
    const { login, googleLogin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/dashboard'
    const [loading, setLoading] = useState(false)

    // Handle standard login
    const onSubmit = async (data) => {
        if (!data?.email || !data?.password) {
            toast.error('Required parameters missing')
            return
        }

        setLoading(true)
        const toastId = toast.loading("Authenticating node...")

        try {
            await login(data.email, data.password)
            toast.dismiss(toastId)
            toast.success('Access Granted // Identity Verified')
            navigate(from, { replace: true })
        } catch (err) {
            console.error('Login error', err)
            toast.dismiss(toastId)
            toast.error('Authentication Failure')
            setLoading(false)
        }
    }

    // Handle Google login
    const handleGoogleLogin = async () => {
        try {
            await googleLogin()
            toast.success('Google Identity Synchronized')
            navigate(from, { replace: true })
        } catch (error) {
            toast.error('Google Auth Failure')
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
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden selection:bg-primary/30 selection:text-primary p-6">
            {/* Background Technical Grid Element */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[1000px] relative z-10"
            >
                <div className="bg-background border border-border rounded-none overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                        {/* Primary Column: Login Form */}
                        <div className="md:col-span-7 p-10 lg:p-14 border-b md:border-b-0 md:border-r border-border">
                            {/* Header */}
                            <div className="mb-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-none bg-primary text-primary-foreground mb-8">
                                    <Shield size={32} strokeWidth={1.5} />
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter mb-2 uppercase italic">Welcome Back</h1>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Secure Entry Protocol // v2.4.0</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Mail size={12} className="text-primary" /> Identity Vector
                                        </label>
                                        <Input
                                            type="email"
                                            {...register("email", { required: true })}
                                            className="h-14 rounded-none border-border bg-muted/30 font-bold focus-visible:ring-primary"
                                            placeholder="EMAIL_ADDRESS"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Lock size={12} className="text-primary" /> Access Cipher
                                        </label>
                                        <Input
                                            type="password"
                                            {...register("password", { required: true })}
                                            className="h-14 rounded-none border-border bg-muted/30 font-bold focus-visible:ring-primary"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary transition-all bg-muted" />
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">Persistent Node</span>
                                    </label>
                                    <button type="button" className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors">Recovery Required?</button>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-none text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Authorize Access
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Secondary Column: Alternate Entry */}
                        <div className="md:col-span-5 bg-muted/20 p-10 lg:p-14 flex flex-col justify-center">
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-xl font-black text-foreground tracking-tighter mb-2 uppercase italic">Alternate Channels</h3>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Connect via secondary protocols</p>
                                </div>

                                {/* Social Sync */}
                                <div className="space-y-4">
                                    <Button
                                        variant="outline"
                                        onClick={handleGoogleLogin}
                                        className="w-full h-14 rounded-none border-border bg-background text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center justify-center gap-3"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google Identity Sync
                                    </Button>

                                    <div className="grid grid-cols-1 gap-4">
                                        <Button
                                            variant="secondary"
                                            onClick={() => fillDemo('user')}
                                            className="h-14 rounded-none text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            <User size={16} />
                                            Student Demo Node
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => navigate('/admin-login')}
                                            className="h-14 rounded-none text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            <Shield size={16} />
                                            Admin Portal
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-border">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Info size={14} className="text-primary" /> New to the infrastructure?
                                    </p>
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center gap-2 text-primary font-black text-[12px] uppercase tracking-[0.2em] group italic"
                                    >
                                        Register Requirement
                                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Stats */}
                <div className="flex justify-between mt-8 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] px-4">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary animate-pulse"></span> 
                        System Status: Active
                    </span>
                    <span>Encrypted // TLS 1.3 // Node BD-01</span>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
