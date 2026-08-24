import { useState, useEffect, useRef, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebase } from '../utils/firebase';
import api, { resetSession } from '../services/api';
import toast from 'react-hot-toast';
import { logError } from '../utils/devLogger';

const useSessionManager = () => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [userRole, setUserRole] = useState('');
    
    // Organization Context States
    const [myOrgs, setMyOrgs] = useState([]);
    const [orgContext, setOrgContext] = useState(null);
    const [orgMember, setOrgMember] = useState(null);
    const [orgRole, setOrgRole] = useState(null);
    const orgContextRef = useRef(null);

    const [loading, setLoading] = useState(true);
    // Set when the backend /api/config fetch or Firebase init fails — lets the
    // route guards show a retry panel instead of hanging on the loading skeleton.
    const [configError, setConfigError] = useState(null);
    const [dbUserError, setDbUserError] = useState(null);

    // Flag to prevent onAuthStateChanged from duplicating work done by auth actions.
    // When an auth action (login/register/googleLogin) calls setJWT + fetches user,
    // it sets this flag. The next onAuthStateChanged callback checks it and skips.
    const authActionCompletedRef = useRef(false);

    // Track whether initial auth check has completed.
    // After initial load, subsequent onAuthStateChanged firings should NOT
    // set loading=true (which unmounts/remounts Dashboard, causing full-page refresh).
    const initialAuthDoneRef = useRef(false);

    // Keep orgContextRef in sync with orgContext state
    useEffect(() => {
        orgContextRef.current = orgContext;
    }, [orgContext]);

    const setJWT = useCallback(async (email, firebaseUser) => {
        if (!email) return;
        try {
            const idToken = firebaseUser ? await firebaseUser.getIdToken() : null;
            // Server sets httpOnly cookie via Set-Cookie header — no client-side cookie needed.
            await api.post('/api/auth/jwt', {
                email,
                idToken,
                displayName: firebaseUser?.displayName || '',
                photoURL: firebaseUser?.photoURL || ''
            });
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
            setDbUserError(null);

            try {
                let orgRes = await api.get(`/api/users/${email}/organizations`);
                const orgs = orgRes.data.data || [];
                setMyOrgs(orgs);
                // Auto-select first org if context is empty, or maintain current context
                // Use ref to avoid stale closure and unnecessary re-subscriptions
                if (orgs.length > 0 && !orgContextRef.current) {
                    const savedOrgId = localStorage.getItem('x-org-id');
                    let targetOrg = orgs.find(o => o.orgId === savedOrgId);
                    if (!targetOrg) targetOrg = orgs[0];
                    setOrgContext(targetOrg);
                    setOrgMember(targetOrg);
                    setOrgRole(targetOrg.role?.slug || 'student');
                    localStorage.setItem('x-org-id', targetOrg.orgId);
                }
            } catch (err) {
                logError('useSessionManager', 'failed to fetch user organizations', err);
            }

            return res.data;
        } catch (err) {
            setDbUserError({
                status: err.response?.status || null,
                message: err.response?.data?.error || err.message || 'Failed to load profile',
                code: err.code || null,
            });
            return null;
        }
    }, []); // No dependencies — reads orgContext via ref

    const retryDbUser = useCallback(async () => {
        const email = user?.email;
        if (email) return refreshUserFromDB(email);
        return null;
    }, [user, refreshUserFromDB]);

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
        let unsubscribe = null;
        let cancelled = false;

        // Firebase is initialized asynchronously from the backend /api/config
        // (the frontend has no env vars). Subscribe to auth state only after it
        // resolves; surface a retryable error if config/Firebase init fails.
        getFirebase()
            .then(({ auth }) => {
                if (cancelled) return;
                unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
                    // CRITICAL: Reset sessionDead BEFORE setJWT to break deadlock.
                    // If sessionDead is true, the request interceptor blocks api.post(),
                    // which means setJWT() can never succeed, which means resetSession()
                    // can never be called. By resetting first, we allow setJWT() to proceed.
                    resetSession();
                    setJWT(currentUser.email, currentUser)
                        .then(() => {
                            refreshUserFromDB(currentUser.email).catch(() => {});
                        })
                        .catch(() => {});
                } else {
                    setDbUser(null);
                    setUserRole(null);
                    setDbUserError(null);
                }
                return;
            }

            // Initial auth check — show loading spinner
            setLoading(true);
            setUser(currentUser);

            // If an auth action just completed its own setJWT + user fetch,
            // skip the duplicate work. Don't clear loading here — let
            // loginAdmin's blocking refreshUserFromDB clear it (prevents
            // AdminRoute 403 flash with dbUser still null).
            if (authActionCompletedRef.current) {
                authActionCompletedRef.current = false;
                initialAuthDoneRef.current = true;
                return;
            }

            if (currentUser?.email) {
                resetSession();
                await setJWT(currentUser.email, currentUser);

                try {
                    let res = await api.get(`/api/users/${currentUser.email}`);
                    setDbUser(res.data);
                    setUserRole(res.data.role);
                    setDbUserError(null);

                    try {
                        let orgRes = await api.get(`/api/users/${currentUser.email}/organizations`);
                        const orgs = orgRes.data.data || [];
                        setMyOrgs(orgs);
                        if (orgs.length > 0) {
                            const savedOrgId = localStorage.getItem('x-org-id');
                            let targetOrg = orgs.find(o => o.orgId === savedOrgId);
                            if (!targetOrg) targetOrg = orgs[0];
                            setOrgContext(targetOrg);
                            setOrgMember(targetOrg);
                            setOrgRole(targetOrg.role?.slug || 'student');
                            localStorage.setItem('x-org-id', targetOrg.orgId);
                        }
                    } catch (err) {
                        logError('useSessionManager', 'failed to fetch user organizations', err);
                    }
                } catch (error) {
                    if (error.response?.status === 404) {
                        setDbUser(null);
                        setUserRole(null);
                        setDbUserError(null);
                    } else {
                        setDbUserError({
                            status: error.response?.status || null,
                            message: error.response?.data?.error || error.message || 'Failed to load profile',
                            code: error.code || null,
                        });
                    }
                }
            } else {
                setDbUser(null);
                setUserRole(null);
                setDbUserError(null);
                setMyOrgs([]);
                setOrgContext(null);
                setOrgMember(null);
                setOrgRole(null);
                localStorage.removeItem('x-org-id');
            }

                    initialAuthDoneRef.current = true;
                    setLoading(false);
                });
            })
            .catch((err) => {
                if (cancelled) return;
                logError('useSessionManager', 'failed to init firebase from /api/config', err);
                setConfigError('Could not load app configuration. Check your connection and try again.');
                setLoading(false);
            });

        return () => {
            cancelled = true;
            if (unsubscribe) unsubscribe();
        };
    }, [setJWT, refreshUserFromDB]);

    const switchOrg = useCallback((orgId) => {
        const targetOrg = myOrgs.find(org => org.orgId === orgId);
        if (targetOrg) {
            setOrgContext(targetOrg);
            setOrgMember(targetOrg);
            setOrgRole(targetOrg.role?.slug || 'student');
            localStorage.setItem('x-org-id', targetOrg.orgId);
        } else {
            setOrgContext(null);
            setOrgMember(null);
            setOrgRole(null);
            localStorage.removeItem('x-org-id');
        }
    }, [myOrgs]);

    const hasPermission = useCallback((permission) => {
        // Super admin has all permissions (canonical signal — role:'admin' is vestigial)
        if (dbUser?.globalRole === 'super_admin') return true;
        // Check org permissions
        if (orgMember && orgMember.role && orgMember.role.permissions) {
            return orgMember.role.permissions.includes(permission);
        }
        return false;
    }, [dbUser, orgMember]);

    return {
        user,
        setUser,
        dbUser,
        setDbUser,
        userRole,
        setUserRole,
        myOrgs,
        orgContext,
        orgMember,
        orgRole,
        switchOrg,
        hasPermission,
        loading,
        setLoading,
        configError,
        dbUserError,
        setJWT,
        refreshUserFromDB,
        retryDbUser,
        checkUserExists,
        markAuthActionInProgress,
        resetAuthState,
    };
};

export default useSessionManager;
