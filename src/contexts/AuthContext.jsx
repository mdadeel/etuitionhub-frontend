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
    const saveUserToDB = async (firebaseUser, role) => {
        let toastId = toast.loading("Saving user...");
        try {
            let userData = {
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL || '',
                role: role,
                isVerified: false
            };

            // backend API use kortesi
            let res = await axios.post('http://localhost:5000/api/users', userData);
            // console.log('User saved:',res.data);
            toast.dismiss(toastId);
            return res.data;
        } catch (error) {
            console.error('Error saving user:', error);
            toast.dismiss(toastId);
            // throw korsi na - just log for now
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
    }, [user, userRole]);

    // registration function - email password diye register korbo
    // NOTE: this function ta long hoye geche, maybe refactor korbo
    const register = async (email, password, name, role = 'student') => {
        // loading true kortesi
        setLoading(true);

        // validate email - check kortesi @ ase kina
        // TODO: better validation add korbo
        if (!email.includes('@')) {
            toast.error('Email thik na!')
            setLoading(false)
            return
        }

        // validate password length - minimum 6 character
        if (password.length < 6) {
            toast.error('Password 6 character ba beshi hote hobe')
            setLoading(false)
            return
        }

        // validate name - empty hole reject
        if (!name || name.trim().length === 0) {
            toast.error('Name dao')
            setLoading(false)
            return
        }

        // firebase e user create kortesi
        // try catch use kortesi error handle korar jonno
        try {
            // createUserWithEmailAndPassword call kortesi
            let result = await createUserWithEmailAndPassword(auth, email, password);

            // profile update kortesi name diye
            await updateProfile(result.user, { displayName: name });

            // database e user save kortesi
            // TODO: error handling improve korbo ekhane
            // FIXME: sometimes db save fail hoy but user create hoye jay
            await saveUserToDB(result.user, role);

            // loading false kortesi
            setLoading(false)

            // result return kortesi
            return result;
        } catch (err) {
            // error hole toast show kortesi
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

    // Google login - check if user exists first, preserve role
    const googleLogin = async () => {
        setLoading(true);
        try {
            let result = await signInWithPopup(auth, googleProvider);

            // Check if user already exists in database
            try {
                let checkRes = await axios.get(`http://localhost:5000/api/users/${result.user.email}`);
                console.log('✅ Existing Google user found:', checkRes.data);
                // User exists - don't overwrite their role
                return result;
            } catch (error) {
                // User doesn't exist - save as new student
                console.log('📝 New Google user - saving as student');
                await saveUserToDB(result.user, 'student');
                console.log('google user saved as student') // debug
                return result;
            }
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
