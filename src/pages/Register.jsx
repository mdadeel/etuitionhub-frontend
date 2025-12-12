// register page with step-by-step flow
import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import { useAuth } from '../contexts/AuthContext'
import { FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa'

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

        if (!name) {
            toast.error('Name is required')
            return
        }
        if (name.length < 3) {
            toast.error('Name must be at least 3 characters')
            return
        }
        if (!email) {
            toast.error('Email is required')
            return
        }
        if (!email.includes('@')) {
            toast.error('Invalid email format')
            return
        }
        if (!password) {
            toast.error('Password is required')
            return
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        registerUser(email, password, name, role, phone)
            .then(() => {
                toast.success('Account created successfully!')
                setLoading(false)
                navigate('/dashboard')
            })
            .catch(err => {
                console.log('registration error', err)
                toast.error('Registration failed')
                setLoading(false)
            })
    }

    // google login handler
    let handleGoogleLogin = async () => {
        try {
            await googleLogin(role)
            toast.success('Registration successful!')
            navigate('/dashboard')
        } catch (error) {
            toast.error('Google registration failed')
        }
    }

    // STEP 1: Role Selection
    if (step === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
                <div className="max-w-2xl w-full">
                    <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
                    <p className="text-center text-gray-500 mb-8">What brings you to e-tuitionBD?</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Card */}
                        <div
                            onClick={() => selectRole('student')}
                            className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-teal-500"
                        >
                            <div className="card-body items-center text-center py-10">
                                <FaGraduationCap className="text-6xl text-teal-600 mb-4" />
                                <h2 className="card-title text-2xl">I'm a Student</h2>
                                <p className="text-gray-500 mt-2">Looking for a tutor to help me learn</p>
                                <div className="mt-4 text-sm text-gray-400">
                                    • Find qualified tutors<br />
                                    • Post tuition requirements<br />
                                    • Book sessions
                                </div>
                            </div>
                        </div>

                        {/* Tutor Card */}
                        <div
                            onClick={() => selectRole('tutor')}
                            className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-amber-500"
                        >
                            <div className="card-body items-center text-center py-10">
                                <FaChalkboardTeacher className="text-6xl text-amber-600 mb-4" />
                                <h2 className="card-title text-2xl">I'm a Tutor</h2>
                                <p className="text-gray-500 mt-2">I want to teach and earn money</p>
                                <div className="mt-4 text-sm text-gray-400">
                                    • Apply for tuitions<br />
                                    • Create tutor profile<br />
                                    • Get paid for teaching
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-gray-500">
                        Already have an account? <Link to="/login" className="text-teal-600 hover:underline font-medium">Login</Link>
                    </p>
                </div>
            </div>
        )
    }

    // STEP 2: Registration Form
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    {/* Back button and role indicator */}
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={goBack} className="btn btn-ghost btn-sm">
                            ← Back
                        </button>
                        <span className={`badge ${role === 'tutor' ? 'badge-warning' : 'badge-info'} badge-lg`}>
                            {role === 'tutor' ? '👨‍🏫 Tutor Account' : '🎓 Student Account'}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-6">Complete Registration</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="input input-bordered w-full bg-white text-gray-900"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="input input-bordered w-full bg-white text-gray-900"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="input input-bordered w-full bg-white text-gray-900"
                                placeholder="Minimum 6 characters"
                            />
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text font-medium">Phone Number (Optional)</span>
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="input input-bordered w-full bg-white text-gray-900"
                                placeholder="01XXXXXXXXX"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-full bg-teal-600 text-white hover:bg-teal-700 border-none"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="divider">OR</div>

                    <button onClick={handleGoogleLogin} className="btn btn-outline w-full">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="text-center mt-4">
                        Have account? <Link to="/login" className="text-teal-600 hover:underline font-medium">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
