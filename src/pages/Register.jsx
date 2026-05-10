import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { User, Briefcase, ArrowLeft, ArrowRight, CheckCircle2, Shield, Mail, Lock, Phone } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Register = () => {
    const { register: registerUser, googleLogin } = useAuth()
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

        if (!name || name.length < 3) {
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
            await googleLogin(role)
            toast.success('Signed in with Google')
            navigate('/dashboard')
        } catch (error) {
            toast.error('Google login failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-8 px-4">
            <div className="w-full max-w-4xl">
                {step === 1 ? (
                    <div>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Create an Account</h1>
                            <p className="text-sm text-slate-500">Select your account type to continue</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Student */}
                            <div
                                onClick={() => selectRole('student')}
                                className="group bg-white border border-slate-200 hover:border-blue-300 p-6 cursor-pointer transition-all rounded-lg"
                            >
                                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-lg mb-4">
                                    <User size={24} />
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-2">Student</h2>
                                <p className="text-sm text-slate-600 mb-4">Find tutors and manage your learning</p>
                                <ul className="space-y-2">
                                    {['Post tuition requirements', 'Review tutor profiles', 'Track progress'].map((item) => (
                                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                            <CheckCircle2 size={14} className="text-blue-600" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tutor */}
                            <div
                                onClick={() => selectRole('tutor')}
                                className="group bg-white border border-slate-200 hover:border-blue-300 p-6 cursor-pointer transition-all rounded-lg"
                            >
                                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-lg mb-4">
                                    <Briefcase size={24} />
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-2">Tutor</h2>
                                <p className="text-sm text-slate-600 mb-4">Find tuition jobs and grow your teaching</p>
                                <ul className="space-y-2">
                                    {['Browse tuition jobs', 'Apply to opportunities', 'Manage students'].map((item) => (
                                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                            <CheckCircle2 size={14} className="text-blue-600" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <button
                                onClick={goBack}
                                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                            <h1 className="text-xl font-semibold text-slate-900 mt-2">
                                Create your {role} account
                            </h1>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-600">Full Name</label>
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-600">Phone</label>
                                        <Input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-600">Email</label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-600">Password</label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-10"
                                >
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-slate-500">Or continue with</span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleLogin}
                                    className="w-full h-10"
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </Button>

                                <p className="text-center text-sm text-slate-500">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-blue-600 hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Register