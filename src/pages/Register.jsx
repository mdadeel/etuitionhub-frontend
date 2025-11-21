// Register page - student ba tutor registration korte parbe
// edge cases sob test hoinai - fixes lagbe maybe
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import PropTypes from 'prop-types'

function Register() {
    let { register: registerUser, googleLogin } = useAuth()
    let [loading, setLoading] = useState(false)
    let navigate = useNavigate()

    let { register, handleSubmit, watch, formState: { errors } } = useForm()
    let password = watch('password')

    // Submit handler - TODO: more validation add korbo
    // registration submit handler - account create kortesi
    // NOTE: ei function ta khub boro hoye geche
    // TODO: split into helper functions maybe
    const onSubmit = async (data) => {
        // loading true kortesi
        setLoading(true)

        // validate name field
        if (!data.name || data.name.trim().length === 0) {
            toast.error('Name dao please')
            setLoading(false)
            return
        }

        // validate name length minimum 3 character
        if (data.name.trim().length < 3) {
            toast.error('Name minimum 3 character hobe')
            setLoading(false)
            return
        }

        // validate email field
        if (!data.email) {
            toast.error('Email dao')
            setLoading(false)
            return
        }

        // validate email format - @ check kortesi
        if (!data.email.includes('@')) {
            toast.error('Email format thik na')
            setLoading(false)
            return
        }

        // validate password field
        if (!data.password) {
            toast.error('Password dao')
            setLoading(false)
            return
        }

        // validate password length - minimum 6
        if (data.password.length < 6) {
            toast.error('Password minimum 6 character')
            setLoading(false)
            return
        }

        // validate role selection
        if (!data.role || (data.role !== 'student' && data.role !== 'tutor')) {
            toast.error('Role select koro')
            setLoading(false)
            return
        }

        // try catch block - registration process
        try {
            // register function call kortesi
            await registerUser(data.email, data.password, data.name, data.role)

            // success toast show kortesi
            toast.success('Account create hoye geche!')

            // dashboard e redirect kortesi
            // 1 second delay disi
            setTimeout(() => {
                navigate('/dashboard')
            }, 1000) // magic number - 1 second delay
        } catch (error) {
            // error handle kortesi ekhane
            console.log('registration error:', error)

            // check kortesi error type
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Email already ase')
            } else if (error.code === 'auth/weak-password') {
                toast.error('Password aro strong koro')
            } else {
                toast.error('Registration failed')
            }

            // NOTE: sometimes Firebase down thake
            // FIXME: add better error messages
        } finally {
            // loading false kortesi always
            setLoading(false)
        }
    }

    // Google login - simple rakhsi
    const handleGoogleLogin = async () => {
        try {
            await googleLogin()
            toast.success('Google login successful!')


            navigate('/dashboard')
        } catch (error) {
            toast.error('Google login hoinai')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control mb-4">
                            <label className="label"><span className="label-text">Full Name</span></label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                                {...register('name', { required: 'Name ta dao' })}
                            />
                            {errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
                        </div>

                        <div className="form-control mb-4">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                                {...register('email', { required: 'Email ta dao' })}
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                                {...register('password', { required: true, minLength: 6 })}
                            />
                            {errors.password && <span className="text-error text-sm">Minimum 6 characters lagbe</span>}
                        </div>

                        <div className="form-control mb-4">
                            <label className="label"><span className="label-text">Confirm Password</span></label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
                                {...register('confirmPassword', {
                                    required: true,
                                    validate: value => value === password || 'Passwords match korena'
                                })}
                            />
                            {errors.confirmPassword && <span className="text-error text-sm">{errors.confirmPassword.message}</span>}
                        </div>

                        {/* Role Selection - req.md onujayi */}
                        <div className="form-control mb-6">
                            <label className="label"><span className="label-text">Register as</span></label>
                            <select className="select select-bordered" {...register('role', { required: true })}>
                                <option value="student">Student</option>
                                <option value="tutor">Tutor</option>
                            </select>
                        </div>

                        <button type="submit" className="btn bg-teal-600 text-white hover:bg-teal-700 w-full border-none" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : 'Register'}
                        </button>
                    </form>

                    <div className="divider">OR</div>

                    <button onClick={handleGoogleLogin} className="btn btn-outline w-full gap-2">
                        <FcGoogle className="text-xl" />
                        Continue with Google
                    </button>

                    <p className="text-center mt-4">
                        Already have an account? <Link to="/login" className="text-teal-600 hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

// PropTypes - keeping for consistency
Register.propTypes = {
    onSuccess: PropTypes.func
}

export default Register
