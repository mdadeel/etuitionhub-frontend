
import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_OPTIONS } from '../utils/cookieOptions';

// Export auth context for app-wide access
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

/**
 * Custom hook for easy auth access
 * @returns {Object} Auth context value
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error(
            "You must wrap your application with AuthProvider to use useAuth."
        )
    }
    return authContext;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [userData, setUserData] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [dbUser, setDbUser] = useState(null);

    const googleProvider = new GoogleAuthProvider();

    // Save user to database
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

            console.log('Posting user to DB:', userData);
            const res = await api.post('/api/users', userData);
            console.log('Backend response:', res.data);

            toast.dismiss(toastId);

            // Update local state immediately with BACKEND data
            // this is crucial cause backend might upgrade role
            setDbUser(res.data);
            setUserRole(res.data.role); // explicitly set role from response

            return res.data;
        } catch (error) {
            console.error('Error saving user to DB:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            toast.dismiss(toastId);
            
            // Show specific error
            if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Is backend running?');
            } else {
                toast.error(error.response?.data?.error || 'Failed to save user');
            }
            throw error;
        }
    };

    // Refresh user from database
    const refreshUserFromDB = async (email) => {
        try {
            console.log('Refreshing user data for:', email);
            let res = await api.get(`/api/users/${email}`);
            setDbUser(res.data);
            setUserRole(res.data.role);
            console.log('Refreshed User Role:', res.data.role);
            return res.data;
        } catch (error) {
            console.error('Refresh error:', error);
            return null;
        }
    };

    // Check if user exists in database by email
    const checkUserExists = async (email) => {
        try {
            console.log('Checking user existence for:', email);
            const res = await api.get(`/api/users/check/${email.toLowerCase()}`);
            return res.data.exists;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false;
        }
    };


    // JWT generation helper
    // The backend now requires a Firebase ID token to prove email ownership.
    // The client SDK mints one when getIdToken() is called; it auto-refreshes.
    const setJWT = async (email, firebaseUser) => {
        if (!email) return;
        try {
            console.log('Generating JWT for:', email);
            // getIdToken() returns a fresh JWT signed by Google. Pass it
            // through; the backend verifies signature, issuer, and that
            // the email claim matches the body. forceRefresh=false — the
            // SDK already caches and rotates this for us.
            const idToken = firebaseUser ? await firebaseUser.getIdToken() : null;
            let res = await api.post('/api/auth/jwt', { email, idToken });
            if (res.data.token) {
                Cookies.set('token', res.data.token, AUTH_COOKIE_OPTIONS);
                console.log('JWT Token set in cookies');
                return res.data.token;
            }
        } catch (error) {
            console.log('JWT generation error:', error);
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            console.log('Auth Change Observer', currentUser)
            setUser(currentUser);

            // Generate token if user exists
            if (currentUser?.email) {
                await setJWT(currentUser.email, currentUser);

                // Also fetch dbUser
                try {
                    let res = await api.get(`/api/users/${currentUser.email}`);
                    setDbUser(res.data);
                    setUserRole(res.data.role);
                } catch (error) {
                    if (error.response?.status === 404) {
                        setDbUser(null);
                        setUserRole(null);
                    }
                }
            } else {
                setDbUser(null);
                setUserRole(null);
            }

            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // rgstrtn function email password diye register korbo
    const register = async (email, password, name, role = 'student', phone = '') => {
        setLoading(true);

        if (!email.includes('@')) {
            toast.error('Please enter a valid email address.')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long.')
            setLoading(false)
            return
        }

        if (!name || name.trim().length === 0) {
            toast.error('Name is required.')
            setLoading(false)
            return
        }

        try {
            console.log('Starting registration with role:', role);
            let result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName: name });

            // Save user to database with phone number
            // AWAIT THE RESULT to obtain correct role from backend
            let savedUser = await saveUserToDB(result.user, role, phone);
            console.log('Saved user role form DB:', savedUser?.role);

            // Generate JWT immediately
            await setJWT(result.user.email, result.user);

            // Refresh to make sure state is updated
            await refreshUserFromDB(email);

            setLoading(false);
            return result;
        } catch (err) {
            console.error('Registration error:', err);
            console.error('Error response:', err.response?.data);
            const errorMsg = err.response?.data?.error || err.message || 'Registration failed!';
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    // email/password diye login
    const login = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // Generate JWT immediately
            await setJWT(result.user.email, result.user);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Google login - preserve existing role for returning users
    const googleLogin = async (selectedRole = 'student') => {
        setLoading(true);
        try {
            let result = await signInWithPopup(auth, googleProvider);
            const email = result.user.email;

            // Use the saveUserToDB (createOrUpdate) endpoint for EVERY Google login
            // The backend handles "upsert" and ensures roles are preserved/upgraded correctly
            console.log('Google login - syncing with DB, requested role:', selectedRole);
            const dbRecord = await saveUserToDB(result.user, selectedRole);

            // Update local state immediately with DB data
            setDbUser(dbRecord);
            setUserRole(dbRecord.role);

            // Generate JWT immediately
            await setJWT(email, result.user);

            return result;
        } catch (error) {
            console.error('Google login error:', error.code, error.message);
            setLoading(false);
            throw error;
        }
    };

    // Google register - preserve selected role for new users, intercept existing users
    const googleRegister = async (role = 'student') => {
        setLoading(true);
        try {
            let result = await signInWithPopup(auth, googleProvider);
            const email = result.user.email;

            // Check if user already exists in DB
            const exists = await checkUserExists(email);
            if (exists) {
                // User already exists! Sign out of Firebase session immediately
                await signOut(auth);
                const error = new Error('User already exists');
                error.code = 'USER_EXISTS';
                throw error;
            }

            // Save new user to DB with selected role
            console.log('Google register - saving new user with role:', role);
            const dbRecord = await saveUserToDB(result.user, role);

            // Update local state immediately with DB data
            setDbUser(dbRecord);
            setUserRole(dbRecord.role);

            // Generate JWT immediately
            await setJWT(email, result.user);

            return result;
        } catch (error) {
            console.error('Google registration error:', error.code, error.message);
            setLoading(false);
            throw error;
        }
    };

    // Logout - notify backend, then clear local state.
    // Best-effort: if the API call fails (e.g., offline), still clear locally
    // so the user isn't trapped. The 7-day token expiry remains the worst case.
    const logout = async () => {
        setLoading(true);
        try {
            await api.post('/api/auth/logout');
        } catch (err) {
            // Non-fatal — log and continue with local cleanup
            console.warn('Backend logout failed (proceeding with local cleanup):', err?.message);
        }
        Cookies.remove('token', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        // eslint-disable-next-line no-unused-vars
        try { await signOut(auth); } catch (_) { /* ignore */ }
        setDbUser(null);
        setUserRole(null);
        setUser(null);
        setLoading(false);
    };

    // password reset - fully test hoinai
    const resetPassword = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    };

    // user profile update
    const updateUserProfile = async (updateUser) => {
        console.log('Updating Firebase Profile:', updateUser);
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, updateUser);
            setUser((preUser) => ({ ...preUser, ...updateUser }));
            console.log('Firebase Profile Updated Successfully');
        } catch (error) {
            console.error('Firebase Profile Update Error:', error);
            toast.error('Failed to sync profile with auth server');
        } finally {
            setLoading(false);
        }
    }

    let authInfo = {
        user,
        userData,
        dbUser,
        userRole,
        loading,
        register,
        updateUserProfile,
        refreshUserFromDB,
        checkUserExists,
        login,
        resetPassword,
        googleLogin,
        googleRegister,
        logout
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};
