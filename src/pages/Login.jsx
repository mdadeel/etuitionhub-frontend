// Login page - user login korate parbe
// email/password and Google login duitai ase
// FIXME: forgot password link add korbo later bhaiya
import { useState, startTransition } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
// import createJWT from "@/utils/createJWT";

function Login() {
    let { login, googleLogin, setLoading } = useAuth();
    let [loading, setLocalLoading] = useState(false);
    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || '/';

    let { register, handleSubmit, formState: { errors } } = useForm();
    // console.log('logIn',login);

    // email/password login - form data nibo
    // form submit handler - login process kortesi
    // NOTE: eta boro function hoye geche
    // TODO: maybe break into smaller pieces
    const onSubmit = async (data) => {
        // loading toast show kortesi
        let toastId = toast.loading("Logging in...");

        // validate kori email ase kina
        if (!data.email) {
            toast.dismiss(toastId)
            toast.error('Email dao!')
            return
        }

        // validate kori email e @ ase kina
        if (!data.email.includes('@')) {
            toast.dismiss(toastId)
            toast.error('Email thik kore dao')
            return
        }

        // validate kori password ase kina
        if (!data.password) {
            toast.dismiss(toastId)
            toast.error('Password dao!')
            return
        }

        // validate kori password length 6+ kina
        if (data.password.length < 6) {
            toast.dismiss(toastId)
            toast.error('Password minimum 6 character')
            return
        }

        // login kortesi try catch diye
        try {
            // login function call kortesi
            await login(data.email, data.password)

            // success toast show kortesi
            toast.dismiss(toastId);
            toast.success('Login successful!')

            // redirect kortesi dashboard e
            // 500ms delay disi smooth er jonno
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 500) // magic number - half second
        } catch (error) {
            // error hole ekhane handle kortesi
            console.log('login error:', error)

            // toast dismiss kortesi
            toast.dismiss(toastId);

            // error message show kortesi
            // check kortesi ki type er error
            if (error.code === 'auth/user-not-found') {
                toast.error('User paoa jaini')
            } else if (error.code === 'auth/wrong-password') {
                toast.error('Password vul dise')
            } else {
                toast.error('Login hoinai!')
            }

            // NOTE: sometimes network error ase
            // FIXME: add retry mechanism maybe?
        }
    };

    // Google login - default role student
    const handleGoogleLogin = async () => {
        let toastId = toast.loading("Loading...");
        try {
            let { user } = await googleLogin();
            // await createJWT({email:user.email});


            console.log('google login success:', user.email) // chk
            startTransition(() => {
                toast.dismiss(toastId);
                toast.success('Google diye login hoise')
                navigate(from, { replace: true });
            });
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error.message || 'Google login hoinai')
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6">Login to e-tuitionBD</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control mb-4">
                            <label htmlFor="email" className="label label-text">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                id="email"
                                name="email"
                                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                                autoComplete="email"
                                {...register('email', {
                                    required: true,
                                    pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/
                                })}
                            />
                            {errors.email && <span className="text-red-500 text-base mt-1">Email ta thik kore dao</span>}
                        </div>

                        <div className="form-control mb-6">
                            <label htmlFor="password" className="label label-text">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                id="password"
                                name="password"
                                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                                autoComplete="new-password"
                                {...register('password', { required: true, minLength: 6 })}
                            />
                            {errors.password && <span className="text-red-500 text-base mt-1">Password minimum 6 characters</span>}
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>

                        <button type="submit" className="btn bg-teal-600 text-white hover:bg-teal-700 w-full border-none">
                            Login
                        </button>
                    </form>

                    <p className="mt-3">
                        Don&apos;t have an account?
                        <Link className="text-blue-500 underline ml-1" to="/register">Signup</Link>
                    </p>

                    <div className="divider mt-5">OR</div>

                    {/* Google Login Button */}
                    <button onClick={handleGoogleLogin} className="btn btn-outline w-full gap-2">
                        <FcGoogle className="text-3xl mr-3" />
                        Continue with google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
