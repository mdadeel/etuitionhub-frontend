// Auth Context - authentication and user management
// handles login, register, logout etc kortesi ekhane
// app er sob jaygay user state maintain kore
// "use client" - NOTE: maybe remove this?
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
            let res = await axios.post('http://localhost:5000/api/users', userData);
            console.log('User saved/updated:', res.data);
            toast.dismiss(toastId);

            // Update local state immediately
            setDbUser(res.data);
            setUserRole(res.data.role);

            return res.data;
        } catch (error) {
            console.error('Error saving user:', error);
            toast.dismiss(toastId);
        }
    };

    // Refresh user from database
    const refreshUserFromDB = async (email) => {
        try {
            let res = await axios.get(`http://localhost:5000/api/users/${email}`);
            setDbUser(res.data);
            setUserRole(res.data.role);
            console.log('User refreshed:', res.data);
            return res.data;
        } catch (error) {
            console.error('Refresh error:', error);
            return null;
        }
    };

    // user change hoile db theke role anbo
    useEffect(() => {
        // database theke user data anbo
        const fetchUserFromDB = async (email) => {
            try {
                let res = await axios.get(`http://localhost:5000/api/users/${email}`);
                setDbUser(res.data);
                console.log('✅ dbUser loaded:', res.data); // debug
                return res.data;
            } catch (error) {
                console.log('❌ User DB error:', error.message);
                return null;
            }
        };

        if (user) {
            const fetchUserData = async () => {
                let data = await fetchUserFromDB(user?.email);
                setUserData(data);
                setUserRole(data?.role);
                // console.log(userRole); // updated value show korbe
                setLoading(false);
            };
            fetchUserData()
        }
    }, [user]);  // Fixed: removed userRole from deps

    // registration function - email password diye register korbo
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
            let result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName: name });

            // database e user save kortesi with phone
            await saveUserToDB(result.user, role, phone);

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
    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Google login - ALWAYS save/update role
    const googleLogin = async (selectedRole = 'student') => {
        setLoading(true);
        try {
            let result = await signInWithPopup(auth, googleProvider);

            // Always save to DB - backend will update role if changed
            console.log('Google login - saving with role:', selectedRole);
            await saveUserToDB(result.user, selectedRole);

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

    // auth state changes listen kortesi
    useEffect(() => {
        // JWT token set - messy but kaj kore
        const setJWT = async (tokenData) => {
            try {
                let res = await axios.post('http://localhost:5000/api/auth/jwt', tokenData, {
                    withCredentials: true
                });
                Cookies.set('token', res.data.token)
            } catch {
                // console.log('JWT error')
            }
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // console.log('Auth Change Observer',currentUser)
            setUser(currentUser);
            setLoading(false);
        });
        let tokenData = {
            email: user?.email
        }
        setJWT(tokenData)

        return () => {
            unsubscribe();
        }
    }, [user?.email]);

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
