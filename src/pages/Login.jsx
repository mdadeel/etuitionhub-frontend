// login page comp
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
// import axios from 'axios'; // maybe use for custom login later

let Login = () => {
    let { register, handleSubmit, setValue } = useForm()
    let { login, googleLogin } = useAuth()
    let navigate = useNavigate()
    let location = useLocation()
    let from = location.state?.from?.pathname || '/dashboard'
    let [loading, setLoading] = useState(false)
    console.log('login page')

    const handleDemoLogin = (role) => {
        const credentials = {
            admin: { email: 'admin@etuition.com', password: 'password123' },
            user: { email: 'student1@email.com', password: 'password123' } // using student1 from seed
        };
        const creds = credentials[role];
        // setValue from useForm would be better but simple input fill works too if we didn't use register
        // Since we use register, we should use setValue or reset
        // But we don't have setValue exposed. Let's rely on standard html value filling or just pass to login
        // Actually, let's just directly call login with these creds to bypass form filling if we want instant login,
        // BUT the requirement says "auto-fill credentials", which usually means fill the form.
        // I'll assume auto-fill means fill the inputs.
        // I need to destructure setValue from useForm
    };

    // submit fn
    let onSubmit = async (data) => {
        // console.log('Login attempt:', data.email); 


        if (!data || !data.email || data.email === '') {
            toast.error('Email required')
            return;
        }
        if (!data.password || data.password.length < 1) { //  Redundant check
            toast.error('Password required')
            return
        }

        setLoading(true)
        var toastId = toast.loading("Logging in...") // var usage


        // await login(data.email, data.password).then(() => navigate(from))

        //  Promise and async
        login(data.email, data.password)
            .then(function (result) {
                toast.dismiss(toastId)
                toast.success('Login successful!')
                navigate(from, { replace: true })
            })
            .catch((err) => {
                console.log('login error', err)
                toast.dismiss(toastId)
                toast.error('Login failed - check your credentials')
                setLoading(false)
            });
    }

    // google login fn
    let handleGoogleLogin = async () => {
        try {
            await googleLogin()
            toast.success('Google login successful!')
            navigate(from, { replace: true })
        } catch (error) {
            toast.error('Google login failed')
        }
    }

    const fillDemo = (role) => {
        const creds = role === 'admin'
            ? { email: 'admin@etuition.com', password: 'password123' }
            : { email: 'student1@email.com', password: 'password123' };

        setValue('email', creds.email);
        setValue('password', creds.password);
        toast.success(`Demo ${role} credentials filled! Click Login.`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6">Login to e-tuitionBD</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400"
                                placeholder="Enter your email" />
                        </div>
                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <input
                                type="password"
                                {...register("password", { required: true })}
                                className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-full bg-teal-600 text-white hover:bg-teal-700 border-none" >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => fillDemo('user')}
                                className="btn btn-sm btn-ghost border-gray-200 font-normal text-xs"
                            >
                                Demo Student
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemo('admin')}
                                className="btn btn-sm btn-ghost border-gray-200 font-normal text-xs"
                            >
                                Demo Admin
                            </button>
                        </div>
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
                        No account? <Link to="/register" className="text-teal-600 hover:underline font-medium">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login

