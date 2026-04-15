import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Briefcase, ArrowLeft, ArrowRight, CheckCircle2, Shield, Mail, Lock, Phone, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

/**
 * Register Page
 * Refactored to "Technical Emerald Minimalism"
 * Features: Step-based deployment, sharp geometry, technical labels
 */
const Register = () => {
    const { register: registerUser, googleLogin } = useAuth()
    const navigate = useNavigate()

    // Step state - 1 = role selection, 2 = registration form
    const [step, setStep] = useState(1)

    // form fields
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(false)

    // handle role selection
    const selectRole = (selectedRole) => {
        setRole(selectedRole)
        setStep(2)
    }

    // go back to role selection
    const goBack = () => {
        setStep(1)
    }

    // form submit handler
    const handleSubmit = (e) => {
        e.preventDefault()

        if (!name || name.length < 3) {
            toast.error('Identity too brief: 3 characters minimum')
            return
        }
        if (!email?.includes('@')) {
            toast.error('Invalid transmission endpoint (Email)')
            return
        }
        if (!password || password.length < 6) {
            toast.error('Security Cipher too short: 6 characters minimum')
            return
        }

        setLoading(true)
        const toastId = toast.loading("Initializing Account...")

        registerUser(email, password, name, role, phone)
            .then(() => {
                toast.dismiss(toastId)
                toast.success('System node registered successfully')
                setLoading(false)
                navigate('/dashboard')
            })
            .catch(err => {
                console.error('Registration error', err)
                toast.dismiss(toastId)
                toast.error('Node Registration Failed')
                setLoading(false)
            })
    }

    // google login handler
    const handleGoogleLogin = async () => {
        try {
            await googleLogin(role)
            toast.success('Cloud Identity Synchronized')
            navigate('/dashboard')
        } catch (error) {
            toast.error('Google Auth Failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden selection:bg-primary/30 selection:text-primary py-12 px-6">
            {/* Background Technical Grid Element */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full max-w-[900px] relative z-10"
                    >
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter mb-4 uppercase italic">Initialize Identity</h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Select deployment mode to continue // STEP 01 / 02</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Academic Node (Student) */}
                            <div
                                onClick={() => selectRole('student')}
                                className="group relative bg-background border border-border hover:border-primary p-12 cursor-pointer transition-all duration-300 rounded-none overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-none bg-primary text-primary-foreground flex items-center justify-center mb-8">
                                        <User size={32} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-3xl font-black text-foreground mb-4 tracking-tighter uppercase italic">Academic Node</h2>
                                    <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">Seek elite instruction to maximize academic throughput and cognitive output.</p>
                                    <ul className="space-y-4">
                                        {['Post Requirements', 'Review Candidates', 'Managed Ecosystem'].map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                <CheckCircle2 size={14} className="text-primary" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Specialist Node (Tutor) */}
                            <div
                                onClick={() => selectRole('tutor')}
                                className="group relative bg-background border border-border hover:border-primary p-12 cursor-pointer transition-all duration-300 rounded-none overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-none bg-primary text-primary-foreground flex items-center justify-center mb-8">
                                        <Briefcase size={32} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-3xl font-black text-foreground mb-4 tracking-tighter uppercase italic">Specialist Node</h2>
                                    <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">Provide high-value instruction and strategic pedagogical support.</p>
                                    <ul className="space-y-4">
                                        {['Manage Pipeline', 'Revenue Analytics', 'Verified Operations'].map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                <CheckCircle2 size={14} className="text-primary" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-16">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                                Already integrated? <Link to="/login" className="text-primary hover:underline italic font-bold">Access Command Center</Link>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-[1000px] relative z-10"
                    >
                        <div className="bg-background border border-border rounded-none overflow-hidden shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-12">
                                {/* Primary Column: Registration Form */}
                                <div className="md:col-span-7 p-10 lg:p-14 border-b md:border-b-0 md:border-r border-border">
                                    {/* Navigation & Role */}
                                    <div className="flex items-center justify-between mb-12">
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={goBack} 
                                            className="rounded-none hover:bg-muted"
                                        >
                                            <ArrowLeft size={20} />
                                        </Button>
                                        <Badge variant="outline" className="rounded-none border-primary text-primary text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-primary/5">
                                            {role === 'tutor' ? 'Specialist Node' : 'Academic Node'}
                                        </Badge>
                                    </div>

                                    <div className="mb-12">
                                        <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter mb-2 uppercase italic">Configure Protocol</h2>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Finalize account parameters // STEP 02 / 02</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <User size={12} className="text-primary" /> Identity Name
                                                </label>
                                                <Input
                                                    type="text"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    className="h-14 rounded-none border-border bg-muted/30 font-bold focus-visible:ring-primary"
                                                    placeholder="FULL_NAME"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <Mail size={12} className="text-primary" /> Communication Channel
                                                </label>
                                                <Input
                                                    type="email"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    className="h-14 rounded-none border-border bg-muted/30 font-bold focus-visible:ring-primary"
                                                    placeholder="EMAIL_ADDRESS"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                                                        <Lock size={12} className="text-primary" /> Access Cipher
                                                    </label>
                                                    <Input
                                                        type="password"
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        className="h-14 rounded-none border-border bg-muted/30 font-bold focus-visible:ring-primary"
                                                        placeholder="6+_CHARACTERS"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                                                        <Phone size={12} className="text-primary" /> Contact (Opt)
                                                    </label>
                                                    <Input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={e => setPhone(e.target.value)}
                                                        className="h-14 rounded-none border-border bg-muted/30 font-bold focus-visible:ring-primary"
                                                        placeholder="01XXXXXXXXX"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-16 rounded-none text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 mt-8"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    Initialize Protocol
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </div>

                                {/* Secondary Column: Benefits & Alternate */}
                                <div className="md:col-span-5 bg-muted/20 p-10 lg:p-14 flex flex-col justify-center">
                                    <div className="space-y-10">
                                        <div>
                                            <h3 className="text-xl font-black text-foreground tracking-tighter mb-2 uppercase italic">Network Benefits</h3>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Why integrate with the collective?</p>
                                        </div>

                                        <ul className="space-y-6">
                                            {[
                                                { icon: <CheckCircle2 size={16} />, text: 'Real-time synchronization' },
                                                { icon: <CheckCircle2 size={16} />, text: 'Verified node credentials' },
                                                { icon: <Shield size={16} />, text: 'End-to-end encryption' }
                                            ].map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    <span className="text-primary">{item.icon}</span>
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                                            <div className="relative flex justify-center">
                                                <span className="bg-background px-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">OR QUICK SYNC</span>
                                            </div>
                                        </div>

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
                                            Google Identity
                                        </Button>

                                        <div className="pt-10 border-t border-border text-center">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
                                                <Info size={14} className="text-primary" /> Member of the collective?
                                            </p>
                                            <Link to="/login" className="text-primary font-black text-[12px] uppercase tracking-[0.2em] group italic">
                                                Verify Identity
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Register
