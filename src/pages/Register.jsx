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
                            <label className="label" style={{ marginBottom: '4px' }}>Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input input-bordered" />
                        </div>


                        <div className="form-control mb-4">
                            <label className="label">Email</label>
                            <input type="email" value={email}
                                onChange={e => setEmail(e.target.value)} className="input input-bordered" />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input input-bordered" />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">Role</label>
// <select value={role} onChange={e => setRole(e.target.value)}>
                                <select value={role} onChange={e => setRole(e.target.value)} className="select select-bordered">
                                    <option value="student">Student</option>
                                    <option value="tutor">Tutor</option>
                                </select>
                        </div>


                        <button type="submit" disabled={loading} className="btn w-full bg-teal-600 text-white 
hover:bg-teal-700 border-none">
                            {loading ? "Creating..." : "Create Account"}
                        </button>
                    </form>

                    <div className="divider">OR</div>

                    <button onClick={handleGoogleLogin} className="btn btn-outline w-full">
                        Google Register
                    </button>

                    <p className="text-center mt-4">
                        Have account? <Link to="/login" className="text-teal-600 hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
