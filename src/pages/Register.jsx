// register page - learned useState after making login with hook-form lol
import { useState } from "react"
// import {useForm} from 'react-hook-form'  // not using this anymore
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import { useAuth } from '../contexts/AuthContext'
let Register = () => {
    let { register: registerUser, googleLogin } = useAuth()
    let navigate = useNavigate()

    // manual state for all fields - different from login page
    let [name, setName] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [role, setRole] = useState('student')
    let [loading, setLoading] = useState(false)
    console.log('register page rendering')

    // manual form submit - no hook form here
    let handleSubmit = (e) => {
        e.preventDefault()

        // inline validation - should extract but whatever
        if (!name) {
            toast.error('Name dao please')
            return
        }
        if (name.length < 3) {
            toast.error('Name ta boro kore dao')
            return
        }

        // email check
        if (!email) {
            toast.error('Email dao')
            return
        }
        if (!email.includes('@')) {
            toast.error('Email format thik na')
            return
        }

        // password validation
        if (!password) {
            toast.error('Password dao')
            return
        }
        if (password.length < 6) {
            toast.error('Password minimum 6 character')
            return
        }

        // all good - register kortesi
        setLoading(true)
        registerUser(email, password, name, role)
            .then(() => {
                toast.success('Account create hoye geche!')
                setLoading(false)
                navigate('/dashboard')
            })
            .catch(err => {
                console.log('registration error', err)
                toast.error('Registration hoinai')
                setLoading(false)
            })
    }

    // google login
    let handleGoogleLogin = async () => {
        try {
            await googleLogin()
            toast.success('Google diye hoise')
            navigate('/dashboard')
        } catch (error) {
            toast.error('Google login failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400"
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
                                className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400"
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
                                className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400"
                                placeholder="Minimum 6 characters"
                            />
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text font-medium">Register as</span>
                            </label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="select select-bordered w-full bg-white text-gray-900"
                            >
                                <option value="student">Student - I want to find tutors</option>
                                <option value="tutor">Tutor - I want to teach</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-full bg-teal-600 text-white hover:bg-teal-700 border-none"
                        >
                            {loading ? "Creating..." : "Create Account"}
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

