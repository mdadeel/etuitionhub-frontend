import { useAuth } from '../contexts/AuthContext';

/**
 * Returns the correct dashboard base route for current user's role + org context
 */
const useOrgDashboard = () => {
    const { orgRole, orgContext, dbUser } = useAuth();
    
    // 1. Super Admin route
    if (dbUser?.globalRole === 'super_admin') {
        return '/dashboard/super-admin';
    }

    // 2. Organization-specific route
    if (orgContext && orgRole) {
        return `/dashboard/org/${orgContext.slug || orgContext.orgId}`;
    }

    // 3. Legacy Dashboard route (backward compatibility)
    return '/dashboard';
};

export default useOrgDashboard;
