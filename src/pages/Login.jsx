import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { Mail, Lock, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import Logo from '../components/shared/Logo'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SEO from '@/components/shared/SEO'
import { cn } from "@/lib/utils"
import { isAdmin, defaultRouteFor } from '../lib/authz'

const Login = () => {
    const { t } = useTranslation()
    const { register, handleSubmit, control, formState: { errors } } = useForm({ mode: 'onChange' })
    const { login, googleLogin, refreshUserFromDB } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const nextParam = queryParams.get('next')
    let from = nextParam || location.state?.from?.pathname || '/dashboard'
    if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//')) {
        from = '/dashboard'
    }
    const [loading, setLoading] = useState(false)

    const emailValue = useWatch({ control, name: 'email' })

    const isEmailValid = emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
    const isEmailInvalid = emailValue && !isEmailValid

    const onSubmit = async (data) => {
        setLoading(true)
        const toastId = toast.loading(t('login.toast_logging_in'))
        try {
            await login(data.email, data.password)
            const dbUser = await refreshUserFromDB(data.email)
            toast.dismiss(toastId)
            toast.success(t('login.toast_success'))
            navigate(isAdmin(dbUser) ? defaultRouteFor(dbUser) : from, { replace: true })
        } catch (err) {
            console.error('Login error', err)
            toast.dismiss(toastId)
            if (err.code === 'auth/user-not-found') {
                toast.error(t('login.error_not_found'))
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                toast.error(t('login.error_wrong_password'))
            } else {
                toast.error(t('login.error_generic'))
            }
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const result = await googleLogin()
            const dbUser = await refreshUserFromDB(result.user.email)
            toast.success(t('login.toast_success'))
            navigate(isAdmin(dbUser) ? defaultRouteFor(dbUser) : from, { replace: true })
        } catch {
            toast.error(t('login.error_generic'))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden ">
            <SEO title={t('login.seo_title')} description={t('login.seo_desc')} />
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
            <div className="w-full max-w-md z-10">
                <div className="bg-card border border-border rounded-xl  overflow-hidden p-5 sm:p-6">
                    <div className="text-center mb-4">
                        <div className="flex justify-center mb-3">
                            <Logo textSize="text-xl" boxSize="size-12" iconSize="size-8" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">{t('login.title')}</h1>
                        <p className="text-sm text-muted-foreground font-body mt-1">{t('login.subtitle')}</p>
                    </div>

                    <Button type="button" variant="outline" onClick={handleGoogleLogin}
                        className="w-full h-11 rounded-xl border border-border hover:bg-muted text-foreground text-sm transition-smooth mb-3">
                        <svg className="size-4 mr-2.5 inline-block" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {t('login.google')}
                    </Button>

                    <div className="relative mb-4 flex items-center justify-center">
                        <span className="absolute inset-x-0 h-px bg-border"></span>
                        <span className="relative bg-card px-3 text-xs font-medium text-muted-foreground">{t('login.or_continue')}</span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div className="space-y-2.5">
                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground block font-label uppercase tracking-wider">{t('login.email_label')}</label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
                                        })}
                                        placeholder={t('login.email_placeholder')}
                                        className={cn("pl-9 h-11 bg-input/40 border rounded-xl transition-smooth",
                                            errors.email ? "border-destructive focus-visible:border-destructive" :
                                            isEmailValid ? "border-success focus-visible:border-success" :
                                            "border-border focus-visible:border-primary"
                                        )}
                                    />
                                    {isEmailValid && <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />}
                                    {isEmailInvalid && <XCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive" />}
                                </div>
                                {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-muted-foreground block font-label uppercase tracking-wider">{t('login.password_label')}</label>
                                    <Link to="/password-reset" className="text-xs font-medium text-primary hover:underline">{t('login.forgot_password')}</Link>
                                </div>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        {...register("password", { required: "Password is required" })}
                                        placeholder="••••••••"
                                        className={cn("pl-9 h-11 bg-input/40 border rounded-xl transition-smooth",
                                            errors.password ? "border-destructive focus-visible:border-destructive" : "border-border focus-visible:border-primary"
                                        )}
                                    />
                                </div>
                                {errors.password && <p className="text-[11px] text-destructive">{errors.password.message}</p>}
                            </div>
                        </div>

                        <Button type="submit" disabled={loading}
                            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-smooth active:scale-[0.98] text-sm shadow-sm">
                            {loading ? t('login.submitting') : t('login.submit')}
                        </Button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-center text-xs font-body text-muted-foreground">
                            {t('login.no_account')}{' '}
                            <Link to="/register" className="font-heading font-bold text-primary hover:underline inline-flex items-center gap-0.5">
                                {t('login.signup_link')} <ArrowRight size={12} />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
