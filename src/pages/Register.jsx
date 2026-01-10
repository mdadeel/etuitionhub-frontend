// register page with step-by-step flow
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiBriefcase, FiArrowLeft, FiArrowRight, FiCheckCircle, FiShield, FiMail, FiLock, FiPhone } from 'react-icons/fi'

let Register = () => {
    let { register: registerUser, googleLogin } = useAuth()
    let navigate = useNavigate()

    // Step state - 1 = role selection, 2 = registration form
    let [step, setStep] = useState(1)

    // form fields
    let [name, setName] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [phone, setPhone] = useState('')
    let [role, setRole] = useState('')
    let [loading, setLoading] = useState(false)

    // handle role selection
    let selectRole = (selectedRole) => {
        setRole(selectedRole)
        setStep(2)
    }

    // go back to role selection
    let goBack = () => {
        setStep(1)
    }

    // form submit handler
    let handleSubmit = (e) => {
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
    let handleGoogleLogin = async () => {
        try {
            await googleLogin(role)
            toast.success('Cloud Identity Synchronized')
            navigate('/dashboard')
        } catch (error) {
            toast.error('Could Authentication Failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] relative overflow-hidden font-inter selection:bg-teal-100">
            {/* Background Accents */}
            <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-60 transition-colors duration-1000 ${role === 'tutor' ? 'bg-amber-50' : 'bg-teal-50'}`}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-[800px] px-6 relative z-10"
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Initialize Identity</h1>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Select deployment mode to continue // 01 / 02</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Academic Node (Student) */}
                            <div
                                onClick={() => selectRole('student')}
                                className="group relative bg-white/80 backdrop-blur-xl border border-white hover:border-teal-500 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] hover:shadow-[0_32px_64px_-16px_rgba(20,184,166,0.15)] rounded-[40px] p-12 cursor-pointer transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-3xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/20 mb-8 transition-transform group-hover:scale-110 duration-500">
                                        <FiUser size={32} />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Academic Node</h2>
                                    <p className="text-sm text-gray-500 font-bold mb-8 leading-relaxed">Looking for elite instruction to enhance academic output.</p>
                                    <ul className="space-y-3">
                                        {['Post Requirements', 'Review Candidates', 'Managed Ecosystem'].map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <FiCheckCircle className="text-teal-600" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Specialist Node (Tutor) */}
                            <div
                                onClick={() => selectRole('tutor')}
                                className="group relative bg-white/80 backdrop-blur-xl border border-white hover:border-amber-500 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] hover:shadow-[0_32px_64px_-16px_rgba(245,158,11,0.15)] rounded-[40px] p-12 cursor-pointer transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 mb-8 transition-transform group-hover:scale-110 duration-500">
                                        <FiBriefcase size={32} />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Specialist Node</h2>
                                    <p className="text-sm text-gray-500 font-bold mb-8 leading-relaxed">Providing high-value instruction and strategic learning support.</p>
                                    <ul className="space-y-3">
                                        {['Manage Pipeline', 'Revenue Analytics', 'Verified Operations'].map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <FiCheckCircle className="text-amber-500" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                Already integrated? <Link to="/login" className="text-teal-600 hover:underline">Access Command Center</Link>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-[1000px] px-6 relative z-10"
                    >
                        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[40px] overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-12">
                                {/* Primary Column: Registration Form */}
                                <div className="md:col-span-7 p-10 lg:p-14">
                                    {/* Navigation & Role */}
                                    <div className="flex items-center justify-between mb-10">
                                        <button onClick={goBack} className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95">
                                            <FiArrowLeft size={20} />
                                        </button>
                                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${role === 'tutor' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-teal-50 text-teal-700 border-teal-100'}`}>
                                            {role === 'tutor' ? 'Specialist Node' : 'Academic Node'}
                                        </div>
                                    </div>

                                    <div className="text-left mb-10">
                                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-2">Configure Protocol</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Finalize account parameters // 02 / 02</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 gap-5">
                                            <div className="relative group">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Identity Name</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                                                        <FiUser size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={e => setName(e.target.value)}
                                                        className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="relative group">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Communication Channel</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                                                        <FiMail size={18} />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="relative group">
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Access Cipher</label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                                                            <FiLock size={18} />
                                                        </div>
                                                        <input
                                                            type="password"
                                                            value={password}
                                                            onChange={e => setPassword(e.target.value)}
                                                            className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all"
                                                            placeholder="6+ characters"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="relative group">
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Contact (Opt)</label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                                                            <FiPhone size={18} />
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            value={phone}
                                                            onChange={e => setPhone(e.target.value)}
                                                            className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all"
                                                            placeholder="01XXXXXXXXX"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full h-16 ${role === 'tutor' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'} text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] mt-6`}
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    Initialize Protocol
                                                    <FiArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>

                                {/* Secondary Column: Benefits & Alternate */}
                                <div className={`md:col-span-5 border-l border-gray-100 p-10 lg:p-14 flex flex-col justify-center ${role === 'tutor' ? 'bg-amber-50/30' : 'bg-teal-50/30'}`}>
                                    <div className="space-y-8">
                                        <div className="text-left">
                                            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">Network Benefits</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Why integrate with the collective?</p>
                                        </div>

                                        <ul className="space-y-4">
                                            {[
                                                { icon: <FiCheckCircle />, text: 'Real-time synchronization' },
                                                { icon: <FiCheckCircle />, text: 'Verified node credentials' },
                                                { icon: <FiShield />, text: 'End-to-end encryption' }
                                            ].map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-[11px] font-bold text-gray-600">
                                                    <span className={role === 'tutor' ? 'text-amber-500' : 'text-teal-600'}>{item.icon}</span>
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                            <div className="relative flex justify-center">
                                                <span className={`${role === 'tutor' ? 'bg-[#fef9f1]' : 'bg-[#f5fbfb]'} px-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]`}>OR QUICK SYNC</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleGoogleLogin}
                                            className="w-full h-14 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-700 uppercase tracking-widest hover:bg-white hover:border-gray-300 shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Google Identity
                                        </button>

                                        <div className="pt-8 border-t border-gray-200/60 text-center">
                                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                                                Member of the collective?
                                            </p>
                                            <Link to="/login" className="text-teal-600 font-black text-[12px] uppercase tracking-wider hover:underline">
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

