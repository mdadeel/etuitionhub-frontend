// Private Route component
// Redirects to login if user is not authenticated
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardSkeleton } from '@/components/shared/skeletons';
import ConfigError from './ConfigError';

// Simple private route wrapper
const PrivateRoute = ({ children }) => {
    const { user, loading, configError } = useAuth();
    const location = useLocation();

    // App config (Firebase) failed to load — nothing auth-related can work.
    if (configError) {
        return <ConfigError />;
    }

    // Show dashboard skeleton while checking auth
    if (loading) {
        return <DashboardSkeleton />;
    }

    // Redirect to login if not authenticated
    if (!user) {
        const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin');
        const loginPath = isAdminRoute ? '/admin-login' : '/login';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
