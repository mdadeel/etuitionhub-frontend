import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile, sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { getFirebase } from '../utils/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const useAuthActions = ({ setUser, setDbUser, setUserRole, setLoading, setJWT, refreshUserFromDB, checkUserExists, markAuthActionInProgress, resetAuthState }) => {
    const googleProvider = new GoogleAuthProvider();

    const saveUserToDB = async (firebaseUser, role, mobileNumber = '') => {
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
            setDbUser(res.data);
            setUserRole(res.data.role);
            return res.data;
        } catch (error) {
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
            const { auth } = await getFirebase();
            let result = await createUserWithEmailAndPassword(auth, email, password);
            // Update profile in parallel with JWT creation (both fast)
            await Promise.all([
                updateProfile(result.user, { displayName: name }),
                setJWT(result.user.email, result.user),
            ]);

            await saveUserToDB(result.user, role, phone);

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
            const { auth } = await getFirebase();
            const result = await signInWithEmailAndPassword(auth, email, password);
            await setJWT(result.user.email, result.user);

            // Fetch user from DB in background (non-blocking)
            refreshUserFromDB(email).catch(() => {});

            // Clear the loading spinner now that the JWT cookie is set. The
            // post-initial onAuthStateChanged branch returns early without
            // touching `loading`, so the action MUST clear it itself — otherwise
            // the spinner hangs until a manual refresh (mirrors register()).
            setLoading(false);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const loginAdmin = async (email, password) => {
        setLoading(true);
        markAuthActionInProgress();
        try {
            const { auth } = await getFirebase();
            const result = await signInWithEmailAndPassword(auth, email, password);
            await setJWT(result.user.email, result.user);

            // Resolve the DB role BEFORE returning so the caller can route the
            // user to the correct app (admin vs student) without a redirect flash.
            const dbUser = await refreshUserFromDB(email);

            setLoading(false);
            return dbUser;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const googleLogin = async (selectedRole = 'student') => {
        setLoading(true);
        markAuthActionInProgress();
        try {
            const { auth } = await getFirebase();
            let result = await signInWithPopup(auth, googleProvider);
            const email = result.user.email;

            // Set JWT first (fast) — user can proceed to dashboard
            await setJWT(email, result.user);

            await saveUserToDB(result.user, selectedRole);

            // Clear the spinner now that the JWT cookie is set (see login()).
            setLoading(false);
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
            const { auth } = await getFirebase();
            let result = await signInWithPopup(auth, googleProvider);
            const email = result.user.email;

            const exists = await checkUserExists(email);
            if (exists) {
                await signOut(auth);
                const error = new Error('User already exists');
                error.code = 'USER_EXISTS';
                throw error;
            }

            // Set JWT first (fast) — user can proceed to dashboard
            await setJWT(email, result.user);

            await saveUserToDB(result.user, role);

            // Clear the spinner now that the JWT cookie is set (see login()).
            setLoading(false);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        setLoading(true);
        // Reset initial auth state so next login shows loading spinner
        resetAuthState();
        try {
            const { auth } = await getFirebase();
            await api.post('/api/auth/logout');
            // Auth cookies are httpOnly, so the backend must clear them.
            Cookies.remove('token', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            await signOut(auth);
            setDbUser(null);
            setUserRole(null);
            setUser(null);
        } catch {
            toast.error('Logout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email) => {
        setLoading(true);
        const actionCodeSettings = {
            url: `${window.location.origin}/reset-password`,
            handleCodeInApp: true,
        };
        const { auth } = await getFirebase();
        return sendPasswordResetEmail(auth, email, actionCodeSettings);
    };

    const verifyResetCode = async (oobCode) => {
        const { auth } = await getFirebase();
        return verifyPasswordResetCode(auth, oobCode);
    };

    const confirmReset = async (oobCode, newPassword) => {
        setLoading(true);
        const { auth } = await getFirebase();
        return confirmPasswordReset(auth, oobCode, newPassword);
    };

    const updateUserProfile = async (updateUser) => {
        setLoading(true);
        try {
            const { auth } = await getFirebase();
            await updateProfile(auth.currentUser, updateUser);
            setUser((preUser) => ({ ...preUser, ...updateUser }));
        } catch {
            toast.error('Failed to sync profile with auth server');
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        login,
        loginAdmin,
        googleLogin,
        googleRegister,
        logout,
        resetPassword,
        verifyResetCode,
        confirmReset,
        updateUserProfile,
    };
};

export default useAuthActions;
