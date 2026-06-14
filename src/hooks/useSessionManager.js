import { useState, useEffect, useRef, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import api, { resetSession } from '../services/api';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_OPTIONS } from '../utils/cookieOptions';
import toast from 'react-hot-toast';

const useSessionManager = () => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);

    // Flag to prevent onAuthStateChanged from duplicating work done by auth actions.
    // When an auth action (login/register/googleLogin) calls setJWT + fetches user,
    // it sets this flag. The next onAuthStateChanged callback checks it and skips.
    const authActionCompletedRef = useRef(false);

    // Track whether initial auth check has completed.
    // After initial load, subsequent onAuthStateChanged firings should NOT
    // set loading=true (which unmounts/remounts Dashboard, causing full-page refresh).
    const initialAuthDoneRef = useRef(false);

    const setJWT = useCallback(async (email, firebaseUser) => {
        if (!email) return;
        try {
            const idToken = firebaseUser ? await firebaseUser.getIdToken() : null;
            // Server sets httpOnly cookie via Set-Cookie header — no client-side cookie needed.
            let res = await api.post('/api/auth/jwt', { 
                email, 
                idToken,
                displayName: firebaseUser?.displayName || '',
                photoURL: firebaseUser?.photoURL || ''
            });
            if (res.data.token) {
                // SECURITY: Do NOT set Cookies here — the server's httpOnly Set-Cookie handles auth.
                // Client-side js-cookie cannot set httpOnly, so this was creating an XSS-vulnerable cookie.
                return res.data.token;
            }
        } catch (error) {
            toast.error('Authentication failed. Please try again.');
            throw error;
        }
    }, []);

    const refreshUserFromDB = useCallback(async (email) => {
        try {
            let res = await api.get(`/api/users/${email}`);
            setDbUser(res.data);
            setUserRole(res.data.role);
            return res.data;
        } catch {
            return null;
        }
    }, []);

    const checkUserExists = useCallback(async (email) => {
        try {
            const res = await api.get(`/api/users/check/${email.toLowerCase()}`);
            return res.data.exists;
        } catch {
            return false;
        }
    }, []);

    // Call this before starting an auth action (login, register, googleLogin, etc.)
    // to tell onAuthStateChanged to skip its duplicate setJWT + user fetch.
    const markAuthActionInProgress = useCallback(() => {
        authActionCompletedRef.current = true;
    }, []);

    // Reset initial auth state on logout so next login shows loading spinner.
    const resetAuthState = useCallback(() => {
        initialAuthDoneRef.current = false;
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // After initial auth check, don't set loading=true on subsequent firings.
            // This prevents PrivateRoute from unmounting/remounting Dashboard (full-page refresh).
            if (initialAuthDoneRef.current) {
                setUser(currentUser);
                // Auth action already handled its own work
                if (authActionCompletedRef.current) {
                    authActionCompletedRef.current = false;
                    return;
                }
                // Token refresh or silent auth event — update user but don't show spinner
                if (currentUser?.email) {
                    // Silent JWT refresh + user refresh in background.
                    // Chain refreshUserFromDB AFTER setJWT completes so the
                    // new access-token cookie is in place before the next
                    // request — prevents a 401 race when the old token is
                    // expired.
                    setJWT(currentUser.email, currentUser)
                        .then(() => {
                            resetSession();
                            refreshUserFromDB(currentUser.email).catch(() => {});
                        })
                        .catch(() => {});
                } else {
                    setDbUser(null);
                    setUserRole(null);
                }
                return;
            }

            // Initial auth check — show loading spinner
            setLoading(true);
            setUser(currentUser);

            // If an auth action just completed its own setJWT + user fetch,
            // skip the duplicate work. Reset the flag for next time.
            if (authActionCompletedRef.current) {
                authActionCompletedRef.current = false;
                initialAuthDoneRef.current = true;
                setLoading(false);
                return;
            }

            if (currentUser?.email) {
                await setJWT(currentUser.email, currentUser);
                resetSession();

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

            initialAuthDoneRef.current = true;
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [setJWT, refreshUserFromDB]);

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
        markAuthActionInProgress,
        resetAuthState,
    };
};

export default useSessionManager;
