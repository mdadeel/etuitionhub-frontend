import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const useAuthActions = ({ setUser, setDbUser, setUserRole, setLoading, setJWT, refreshUserFromDB, checkUserExists, markAuthActionInProgress }) => {
    const googleProvider = new GoogleAuthProvider();

    const saveUserToDB = async (firebaseUser, role, mobileNumber = '') => {
        const toastId = toast.loading("Saving user...");
        try {
            const userData = {
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL || '',
                role: role,
                mobileNumber: mobileNumber,
                isVerified: false
            };

            const res = await api.post('/api/users', userData);

            toast.dismiss(toastId);

            setDbUser(res.data);
            setUserRole(res.data.role);

            return res.data;
        } catch (error) {
            toast.dismiss(toastId);

            if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Is backend running?');
            } else {
                toast.error(error.response?.data?.error || 'Failed to save user');
            }
            throw error;
        }
    };

    const register = async (email, password, name, role = 'student', phone = '') => {
        setLoading(true);
        markAuthActionInProgress();

        if (!email.includes('@')) {
            toast.error('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        if (!name || name.trim().length === 0) {
            toast.error('Name is required.');
            setLoading(false);
            return;
        }

        try {
            let result = await createUserWithEmailAndPassword(auth, email, password);
            // Parallelize: update profile + save to DB + create JWT
            const [, savedUser] = await Promise.all([
                updateProfile(result.user, { displayName: name }),
                saveUserToDB(result.user, role, phone),
            ]);

            await setJWT(result.user.email, result.user);

            setLoading(false);
            return result;
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Registration failed!';
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        markAuthActionInProgress();
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await setJWT(result.user.email, result.user);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const googleLogin = async (selectedRole = 'student') => {
        setLoading(true);
        markAuthActionInProgress();
        try {
            let result = await signInWithPopup(auth, googleProvider);
            const email = result.user.email;

            // Parallelize: save user to DB and create JWT at the same time
            const [dbRecord] = await Promise.all([
                saveUserToDB(result.user, selectedRole),
                setJWT(email, result.user),
            ]);

            setDbUser(dbRecord);
            setUserRole(dbRecord.role);

            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const googleRegister = async (role = 'student') => {
        setLoading(true);
        markAuthActionInProgress();
        try {
            let result = await signInWithPopup(auth, googleProvider);
            const email = result.user.email;

            const exists = await checkUserExists(email);
            if (exists) {
                await signOut(auth);
                const error = new Error('User already exists');
                error.code = 'USER_EXISTS';
                throw error;
            }

            // Parallelize: save user to DB and create JWT at the same time
            const [dbRecord] = await Promise.all([
                saveUserToDB(result.user, role),
                setJWT(email, result.user),
            ]);

            setDbUser(dbRecord);
            setUserRole(dbRecord.role);

            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        setLoading(true);
        // Fire-and-forget: revoke server-side token, but don't block logout.
        // If backend is cold-starting on Vercel, this would delay the whole flow.
        api.post('/api/auth/logout').catch(() => {});
        Cookies.remove('token', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        try { await signOut(auth); } catch (_) { /* ignore */ }
        setDbUser(null);
        setUserRole(null);
        setUser(null);
        setLoading(false);
    };

    const resetPassword = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    };

    const updateUserProfile = async (updateUser) => {
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, updateUser);
            setUser((preUser) => ({ ...preUser, ...updateUser }));
        } catch (error) {
            toast.error('Failed to sync profile with auth server');
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        login,
        googleLogin,
        googleRegister,
        logout,
        resetPassword,
        updateUserProfile,
    };
};

export default useAuthActions;
