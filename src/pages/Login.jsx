// login page comp
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { useState, startTransition } from 'react'
import toast from "react-hot-toast"
let Login = () => {
    let { register, handleSubmit } = useForm()
    let { login, googleLogin } = useAuth()
    let navigate = useNavigate()
    let location = useLocation()
    // let from=location.state?.from?.pathname||'/dashboard'
    let from = location.state?.from?.pathname || '/dashboard'
    console.log('login page')

    // submit fn
    let onSubmit = async (data) => {
        let toastId = toast.loading("Logging in...")
        try {
            await login(data.email, data.password)
            toast.dismiss(toastId)
            toast.success('Login hoise!')
            navigate(from, { replace: true })
        } catch (error) {
            console.log('login error', error)
            toast.dismiss(toastId)
            toast.error('Login failed')
        }
    }

    // google login fn
    let handleGoogleLogin = async () => {
        try {
            // await googleLogin()
            await googleLogin()
            toast.success('Google login hoise')
            navigate(from, { replace: true })
        } catch (error) {
            toast.error('Google login failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6">Login to e-tuitionBD</h2>


                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control mb-4">
                            <label className="label">Email</label>
                            <input type="email" {...register("email", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">Password</label>
// <input type="password" {...register("password")} className="input input-bordered" />
                            <input type="password" {...register("password", { required: true })} className="input input-bordered" />
                        </div>


                        <button type="submit" className="btn w-full bg-teal-600 text-white hover:bg-teal-700 border-none">Login</button>
                    </form>

                    <div className="divider">OR</div>

                    <button onClick={handleGoogleLogin} className="btn btn-outline w-full">
                        Google Login
                    </button>

                    <p className="text-center mt-4">
                        No account? <Link to="/register" className="text-teal-600 hover:underline">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
