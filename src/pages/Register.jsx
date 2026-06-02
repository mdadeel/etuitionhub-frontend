import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { User, Briefcase, ArrowLeft, Shield, Mail, Lock, Phone } from 'lucide-react'
import Logo from '../components/shared/Logo'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Register = () => {
    const { register: registerUser, googleRegister } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(false)

    const selectRole = (selectedRole) => {
        setRole(selectedRole)
        setStep(2)
    }

    const goBack = () => {
        setStep(1)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!name || name.trim().length < 3) {
            toast.error('Name must be at least 3 characters')
            return
        }
        if (!email?.includes('@')) {
            toast.error('Please enter a valid email')
            return
        }
        if (!password || password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        const toastId = toast.loading("Creating account...")

        registerUser(email, password, name, role, phone)
            .then(() => {
                toast.dismiss(toastId)
                toast.success('Account created successfully!')
                setLoading(false)
                navigate('/dashboard')
            })
            .catch(err => {
                console.error('Registration error', err)
                toast.dismiss(toastId)
                toast.error('Registration failed')
                setLoading(false)
            })
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
            {/* Header Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

            <div className="w-full max-w-md z-10">
                <div className="bg-card border-2 border-border rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] overflow-hidden p-6 sm:p-8">
                    
                    {step === 1 ? (
                        <>
                            {/* Step 1 Header */}
                            <div className="text-center mb-6">
                                <div className="flex justify-center mb-4">
                                    <Logo textSize="text-xl" boxSize="size-12" iconSize="size-8" />
                                </div>
                                <h1 className="text-2xl font-heading font-bold text-foreground">
                                    Create Account
                                </h1>
                                <p className="text-xs text-muted-foreground font-body mt-1">
                                    Select your account type to proceed with registration.
                                </p>
                            </div>

                            {/* Step 1 Options */}
                            <div className="space-y-4">
                                <div
                                    onClick={() => selectRole('student')}
                                    className="group bg-card border-2 border-border hover:border-primary hover:shadow-[4px_4px_0px_0px_var(--primary)] p-4 cursor-pointer transition-smooth rounded-none flex items-start gap-4"
                                >
                                    <div className="size-10 bg-primary text-primary-foreground flex items-center justify-center rounded-none shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-heading font-bold text-foreground mb-1 uppercase tracking-wider group-hover:text-primary transition-smooth">
                                            Student Portal
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-body leading-normal">
                                            Find tutors, post tuition requests, and track your sessions.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => selectRole('tutor')}
                                    className="group bg-card border-2 border-border hover:border-primary hover:shadow-[4px_4px_0px_0px_var(--primary)] p-4 cursor-pointer transition-smooth rounded-none flex items-start gap-4"
                                >
                                    <div className="size-10 bg-foreground text-background flex items-center justify-center rounded-none shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-heading font-bold text-foreground mb-1 uppercase tracking-wider group-hover:text-primary transition-smooth">
                                            Tutor Portal
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-body leading-normal">
                                            Apply to active tuition posts and manage tutoring jobs.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-xs font-body text-muted-foreground mt-6 pt-5 border-t border-border">
                                Already have an account?{' '}
                                <Link to="/login" className="font-heading font-bold text-primary hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </>
                    ) : (
                        <>
                            {/* Step 2 Header */}
                            <div className="mb-5 flex items-center justify-between">
                                <button
                                    onClick={goBack}
                                    className="flex items-center gap-1 text-[10px] font-heading font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider transition-smooth"
                                >
                                    <ArrowLeft size={12} /> Change Role
                                </button>
                                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-none">
                                    Role: {role}
                                </span>
                            </div>

                            <div className="mb-5 border-l-2 border-primary pl-3">
                                <h2 className="text-lg font-heading font-bold text-foreground">
                                    Profile Details
                                </h2>
                                <p className="text-[10px] text-muted-foreground font-body">
                                    Please enter your real information.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider block">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Adeel Rahman"
                                                required
                                                className="pl-9 h-10 bg-input/40 border-2 border-border focus-visible:border-primary text-foreground rounded-none transition-smooth"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider block">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="01XXXXXXXXX"
                                                className="pl-9 h-10 bg-input/40 border-2 border-border focus-visible:border-primary text-foreground rounded-none transition-smooth"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider block">
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
                                                className="pl-9 h-10 bg-input/40 border-2 border-border focus-visible:border-primary text-foreground rounded-none transition-smooth"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider block">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Min. 6 characters"
                                                required
                                                className="pl-9 h-10 bg-input/40 border-2 border-border focus-visible:border-primary text-foreground rounded-none transition-smooth"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold uppercase tracking-wider transition-smooth active:scale-[0.99] text-xs"
                                >
                                    {loading ? 'Registering...' : 'Create Account'}
                                </Button>
                            </form>

                            <div className="relative my-5 flex items-center justify-center">
                                <span className="absolute inset-x-0 h-px bg-border"></span>
                                <span className="relative bg-card px-3 text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest">
                                    Or Connect With
                                </span>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleLogin}
                                className="w-full h-11 rounded-none border-2 border-border hover:bg-muted text-foreground font-heading font-bold uppercase tracking-wider text-xs transition-smooth"
                            >
                                <svg className="size-4 mr-2.5 inline-block" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign Up with Google
                            </Button>

                            <p className="text-center text-xs font-body text-muted-foreground mt-5">
                                Already have an account?{' '}
                                <Link to="/login" className="font-heading font-bold text-primary hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Register;