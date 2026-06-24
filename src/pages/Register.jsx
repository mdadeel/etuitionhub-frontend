import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { User, Briefcase, Mail, Lock, Phone, CheckCircle, XCircle } from 'lucide-react'
import Logo from '../components/shared/Logo'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import PasswordStrength from '../components/shared/PasswordStrength'

const Register = () => {
    const { t } = useTranslation()
    const { register: registerUser, googleRegister } = useAuth()
    const navigate = useNavigate()
    const [role, setRole] = useState('student')
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onChange' })

    const emailValue = watch('email')
    const phoneValue = watch('phone')
    const passwordValue = watch('password')

    const isEmailValid = emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
    const isEmailInvalid = emailValue && !isEmailValid
    const isPhoneValid = !phoneValue || /^01[3-9]\d{8}$/.test(phoneValue.replace(/\s/g, ''))
    const isPhoneInvalid = phoneValue && !isPhoneValid

    const onSubmit = async (data) => {
        setLoading(true)
        const toastId = toast.loading("Creating account...")
        try {
            await registerUser(data.email, data.password, data.name, role, data.phone || '')
            toast.dismiss(toastId)
            toast.success('Account created successfully!')
            navigate('/dashboard')
        } catch (err) {
            console.error('Registration error', err)
            toast.dismiss(toastId)
            if (err.code === 'auth/email-already-in-use') {
                toast.error('An account with this email already exists')
            } else {
                toast.error('Registration failed')
            }
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await googleRegister(role)
            toast.success('Signed in with Google')
            navigate('/dashboard')
        } catch (error) {
            if (error.code === 'USER_EXISTS' || error.message === 'User already exists') {
                toast.error('An account with this Google email already exists. Please log in instead.')
            } else {
                toast.error('Google login failed')
            }
        }
    }

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
                            {t('register.create_account', 'Create Account')}
                        </h1>
                        <p className="text-sm text-muted-foreground font-body mt-1">
                            {t('register.select_account_type', 'Select your account type to proceed with registration.')}
                        </p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex gap-2 mb-4">
                        <button type="button" onClick={() => setRole('student')}
                            className={cn("flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-smooth border",
                                role === 'student' ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground')}>
                            <User size={16} /> Student
                        </button>
                        <button type="button" onClick={() => setRole('tutor')}
                            className={cn("flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-smooth border",
                                role === 'tutor' ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground')}>
                            <Briefcase size={16} /> Tutor
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div className="space-y-2.5">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground block font-label uppercase tracking-wider">
                                    {t('register.full_name', 'Full Name')}
                                </label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        {...register("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
                                        placeholder="e.g. Adeel Rahman"
                                        className={cn("pl-9 h-11 bg-input/40 border rounded-xl transition-smooth",
                                            errors.name ? "border-red-500 focus-visible:border-red-500" : "border-border focus-visible:border-primary"
                                        )}
                                    />
                                </div>
                                {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground block font-label uppercase tracking-wider">
                                    {t('register.phone_number', 'Phone Number')} <span className="text-muted-foreground/50">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="tel"
                                        {...register("phone", {
                                            pattern: { value: /^01[3-9]\d{8}$/, message: "Enter valid BD number (01XXXXXXXXX)" }
                                        })}
                                        placeholder="01XXXXXXXXX"
                                        className={cn("pl-9 h-11 bg-input/40 border rounded-xl transition-smooth",
                                            errors.phone ? "border-red-500 focus-visible:border-red-500" :
                                            isPhoneValid && phoneValue ? "border-green-500 focus-visible:border-green-500" :
                                            "border-border focus-visible:border-primary"
                                        )}
                                    />
                                    {isPhoneValid && phoneValue && <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                                    {isPhoneInvalid && <XCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />}
                                </div>
                                {errors.phone && <p className="text-[11px] text-red-500">{errors.phone.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground block font-label uppercase tracking-wider">
                                    {t('register.email_address', 'Email Address')}
                                </label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
                                        })}
                                        placeholder="name@domain.com"
                                        className={cn("pl-9 h-11 bg-input/40 border rounded-xl transition-smooth",
                                            errors.email ? "border-red-500 focus-visible:border-red-500" :
                                            isEmailValid ? "border-green-500 focus-visible:border-green-500" :
                                            "border-border focus-visible:border-primary"
                                        )}
                                    />
                                    {isEmailValid && <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                                    {isEmailInvalid && <XCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />}
                                </div>
                                {errors.email && <p className="text-[11px] text-red-500">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground block font-label uppercase tracking-wider">
                                    {t('register.password', 'Password')}
                                </label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Password must be at least 8 characters" },
                                            pattern: { value: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: "Must include letters and numbers" }
                                        })}
                                        placeholder="Min. 8 characters"
                                        className={cn("pl-9 h-11 bg-input/40 border rounded-xl transition-smooth",
                                            errors.password ? "border-red-500 focus-visible:border-red-500" : "border-border focus-visible:border-primary"
                                        )}
                                    />
                                </div>
                                {errors.password && <p className="text-[11px] text-red-500">{errors.password.message}</p>}
                                <PasswordStrength password={passwordValue} />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading}
                            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-smooth active:scale-[0.98] text-sm shadow-sm">
                            {loading ? t('register.registering', 'Registering...') : t('register.create_account', 'Create Account')}
                        </Button>
                    </form>

                    <div className="relative my-4 flex items-center justify-center">
                        <span className="absolute inset-x-0 h-px bg-border"></span>
                        <span className="relative bg-card px-3 text-xs font-medium text-muted-foreground">
                            {t('register.or_connect_with', 'Or Connect With')}
                        </span>
                    </div>

                    <Button type="button" variant="outline" onClick={handleGoogleLogin}
                        className="w-full h-11 rounded-xl border border-border hover:bg-muted text-foreground text-sm transition-smooth">
                        <svg className="size-4 mr-2.5 inline-block" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {t('register.signup_google', 'Sign Up with Google')}
                    </Button>

                    <p className="text-center text-xs font-body text-muted-foreground mt-4">
                        {t('register.already_have_account', 'Already have an account?')}{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">{t('register.sign_in', 'Sign In')}</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
