
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
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

import API_URL from '../config/api';

// auth context export kortesi
export const AuthContext = createContext(null);

// custom hook define kortesi - easier auth access er jonno
// TODO: server-side rendering support add korbo later
export const useAuth = () => {
    // context get kortesi
    let authContext = useContext(AuthContext);
    // check kortesi context ase kina
    if (!authContext) {
        // error throw kortesi if context nai
        throw new Error(
            "You must wrap your application with AuthProvider to use useAuth."
        )
    }
    // context return kortesi
    return authContext;
};

export const AuthProvider = ({ children }) => {
    let [user, setUser] = useState(null);
    let [userData, setUserData] = useState([]);
    let [userRole, setUserRole] = useState("");
    let [loading, setLoading] = useState(true);
    // const[allowedPath,setAllowedPath]=useState(true);
    let [dbUser, setDbUser] = useState(null);

    let googleProvider = new GoogleAuthProvider();

    // user ke database e save korbo
    const saveUserToDB = async (firebaseUser, role, mobileNumber = '') => {
        let toastId = toast.loading("Saving user...");
        try {
            let userData = {
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL || '',
                role: role,
                mobileNumber: mobileNumber,
                isVerified: false
            };

            // backend API use kortesi
            console.log('Posting user to DB:', userData);
            let res = await axios.post(`${API_URL}/api/users`, userData);
            console.log('Backend response:', res.data);

            toast.dismiss(toastId);

            // Update local state immediately with BACKEND data
            // this is crucial cause backend might upgrade role
            setDbUser(res.data);
            setUserRole(res.data.role); // explicitly set role from response

            return res.data;
        } catch (error) {
            console.error('Error saving user:', error);
            toast.dismiss(toastId);
            throw error; // throw so caller knows it failed
        }
    };

    // Refresh user from database
    const refreshUserFromDB = async (email) => {
        try {
            console.log('Refreshing user data for:', email);
            let res = await axios.get(`${API_URL}/api/users/${email}`);
            setDbUser(res.data);
            setUserRole(res.data.role);
            console.log('Refreshed User Role:', res.data.role);
            return res.data;
        } catch (error) {
            console.error('Refresh error:', error);
            return null;
        }
    };

    // user change hoile db theke role anbo


    useEffect(() => {
        let isMounted = true;

        const fetchUserFromDB = async (email) => {
            try {
                let res = await axios.get(`${API_URL}/api/users/${email}`);
                if (isMounted) {
                    setDbUser(res.data);
                    setUserRole(res.data.role);
                    console.log('✅ dbUser loaded:', res.data);
                }
                return res.data;
            } catch (error) {
                console.log('❌ User DB error:', error.message);
                return null;
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (user?.email) {
            // only set lading true  going  fetc

            console.log("Fetching DB User for:", user.email);
            fetchUserFromDB(user.email);
        } else {

            setDbUser(null);
            setUserRole(null);
            setLoading(false);
        }

        return () => { isMounted = false };
    }, [user?.email]);

    // JWT generation helper
    const setJWT = async (email) => {
        if (!email) return;
        try {
            console.log('Generating JWT for:', email);
            let res = await axios.post(`${API_URL}/api/auth/jwt`, { email }, {
                withCredentials: true
            });
            if (res.data.token) {
                Cookies.set('token', res.data.token, { expires: 7 }); // expires in 7 days
                console.log('JWT Token set in cookies');
                return res.data.token;
            }
        } catch (error) {
            console.log('JWT generation error:', error);
        }
    };

    // auth state changes listen kortesi
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            console.log('Auth Change Observer', currentUser)
            setUser(currentUser);

            // Generate token if user exists
            if (currentUser?.email) {
                await setJWT(currentUser.email);
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
            toast.error('Email thik na!')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            toast.error('Password 6 character ba beshi hote hobe')
            setLoading(false)
            return
        }

        if (!name || name.trim().length === 0) {
            toast.error('Name dao')
            setLoading(false)
            return
        }

        try {
            console.log('Starting registration with role:', role);
            let result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName: name });

            // database e user save kortesi with phone
            // AWAIT THE RESULT to obtain correct role from backend
            let savedUser = await saveUserToDB(result.user, role, phone);
            console.log('Saved user role form DB:', savedUser?.role);

            // Generate JWT immediately
            await setJWT(result.user.email);

            // Refresh to make sure state is updated
            await refreshUserFromDB(email);

            setLoading(false);
            return result;
        } catch (err) {
            console.log('registration error:', err)
            toast.error('Registration failed!')
            setLoading(false)
        }
    };

    // email/password diye login
    const login = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // Generate JWT immediately
            await setJWT(result.user.email);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Google login - ALWAYS save/update role
    const googleLogin = async (selectedRole = 'student') => {
        setLoading(true);
        try {
            let result = await signInWithPopup(auth, googleProvider);

            // Always save to DB - backend will update role if changed
            console.log('Google login - requesting role:', selectedRole);
            let savedUser = await saveUserToDB(result.user, selectedRole);
            console.log('After Google Login - DB Role:', savedUser?.role);

            // Generate JWT immediately
            await setJWT(result.user.email);

            // Refresh to get updated data
            await refreshUserFromDB(result.user.email);

            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Logout - token clear korbo
    const logout = () => {
        setLoading(true);
        Cookies.set('token', '')
        return signOut(auth);
    };

    // password reset - fully test hoinai
    const resetPassword = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    };

    // user profile update
    const updateUserProfile = (updateUser) => {
        console.log(updateUser);
        setLoading(true);
        updateProfile(auth.currentUser, updateUser);
        setUser((preUser) => ({ ...preUser, ...updateUser }))
    }

    let authInfo = {
        user,
        userData,
        setUser,
        dbUser,
        userRole,
        setUserRole,
        loading,
        setLoading,
        register,
        updateUserProfile,
        login,
        resetPassword,
        googleLogin,
        logout
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};
