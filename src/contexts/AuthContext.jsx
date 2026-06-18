import { createContext, useContext } from 'react';
import useSessionManager from '../hooks/useSessionManager';
import useAuthActionsHook from '../hooks/useAuthActions';
import { AuthUserContext, AuthActionsContext } from './AuthSplitContexts';

// Legacy context — kept for backward compatibility. New code should use
// useAuthUser() or useAuthActions() instead.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

/**
 * Read-only hook — returns user state only. Preferred for components that
 * only read auth data (avoids re-renders from mutation functions).
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthUser = () => {
    const ctx = useContext(AuthUserContext);
    if (!ctx) throw new Error("useAuthUser must be used within AuthProvider.");
    return ctx;
};

/**
 * Write-only hook — returns mutation functions only. Preferred for components
 * that only perform auth actions (avoids re-renders from state changes).
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthActions = () => {
    const ctx = useContext(AuthActionsContext);
    if (!ctx) throw new Error("useAuthActions must be used within AuthProvider.");
    return ctx;
};

/**
 * Backward-compatible hook — returns everything. Existing components can
 * continue using this without changes. New code should prefer useAuthUser()
 * or useAuthActions() for better performance.
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
    const session = useSessionManager();
    const actions = useAuthActionsHook(session);

    // Read-only values — only change when auth state changes, not on mutations
    const userValue = {
        user: session.user,
        dbUser: session.dbUser,
        userRole: session.userRole,
        myOrgs: session.myOrgs,
        orgContext: session.orgContext,
        orgMember: session.orgMember,
        orgRole: session.orgRole,
        switchOrg: session.switchOrg,
        hasPermission: session.hasPermission,
        loading: session.loading,
    };

    // Write-only values — only change when mutation functions are recreated
    const actionsValue = {
        ...actions,
        refreshUserFromDB: session.refreshUserFromDB,
        checkUserExists: session.checkUserExists,
    };

    // Legacy combined value — kept for backward compatibility
    const legacyValue = { ...userValue, ...actionsValue };

    return (
        <AuthUserContext.Provider value={userValue}>
            <AuthActionsContext.Provider value={actionsValue}>
                <AuthContext.Provider value={legacyValue}>
                    {children}
                </AuthContext.Provider>
            </AuthActionsContext.Provider>
        </AuthUserContext.Provider>
    );
};
