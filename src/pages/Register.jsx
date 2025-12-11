// register page comp
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from "../contexts/AuthContext"
let Register = () => {
    let { register: registerUser, googleLogin } = useAuth()
    let { register, handleSubmit, watch } = useForm()
    let navigate = useNavigate()
    let [loading, setLoading] = useState(false)
    console.log('register page')

    // submit fn
    let onSubmit = async (data) => {
        setLoading(true)
        try {
            // await registerUser(data.email,data.password,data.name,data.role||'student')
            await registerUser(data.email, data.password, data.name, data.role || 'student')
            toast.success('Account created!')
            navigate('/dashboard')
        } catch (error) {
            console.log('register error', error)
            toast.error('Registration failed')
        } finally {
            setLoading(false)
        }
    }

    // google login fn
    let handleGoogleLogin = async () => {
        try {
            await googleLogin()
            toast.success('Google login hoise')


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

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control mb-4">
                            <label className="label">Full Name</label>
                            <input type="text" {...register("name", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">Email</label>
// <input type="email" {...register("email")} className="input input-bordered" />
                            <input type="email" {...register("email", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">Password</label>
                            <input type="password" {...register("password", { required: true, minLength: 6 })} className="input input-bordered" />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">Role</label>
                            <select {...register("role")} className="select select-bordered">
                                <option value="student">Student</option>
                                <option value="tutor">Tutor</option>
                            </select>
                        </div>


                        <button type="submit" disabled={loading} className="btn w-full bg-teal-600 text-white hover:bg-teal-700 border-none">
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
