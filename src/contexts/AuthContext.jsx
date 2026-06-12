
import { createContext, useContext } from 'react';
import useSessionManager from '../hooks/useSessionManager';
import useAuthActions from '../hooks/useAuthActions';

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
    const session = useSessionManager();
    const actions = useAuthActions(session);

    let authInfo = {
        user: session.user,
        dbUser: session.dbUser,
        userRole: session.userRole,
        loading: session.loading,
        ...actions,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};
