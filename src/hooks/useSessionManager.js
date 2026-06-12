import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import api from '../services/api';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_OPTIONS } from '../utils/cookieOptions';
import toast from 'react-hot-toast';

const useSessionManager = () => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);

    const setJWT = async (email, firebaseUser) => {
        if (!email) return;
        try {
            const idToken = firebaseUser ? await firebaseUser.getIdToken() : null;
            let res = await api.post('/api/auth/jwt', { email, idToken });
            if (res.data.token) {
                Cookies.set('token', res.data.token, AUTH_COOKIE_OPTIONS);
                return res.data.token;
            }
        } catch (error) {
            toast.error('Authentication failed. Please try again.');
            throw error;
        }
    };

    const refreshUserFromDB = async (email) => {
        try {
            let res = await api.get(`/api/users/${email}`);
            setDbUser(res.data);
            setUserRole(res.data.role);
            return res.data;
        } catch (error) {
            return null;
        }
    };

    const checkUserExists = async (email) => {
        try {
            const res = await api.get(`/api/users/check/${email.toLowerCase()}`);
            return res.data.exists;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            setUser(currentUser);

            if (currentUser?.email) {
                await setJWT(currentUser.email, currentUser);

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

    return {
        user,
        setUser,
        dbUser,
        setDbUser,
        userRole,
        setUserRole,
        loading,
        setLoading,
        setJWT,
        refreshUserFromDB,
        checkUserExists,
    };
};

export default useSessionManager;
