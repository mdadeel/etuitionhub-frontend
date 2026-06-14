// Private Route component
// Redirects to login if user is not authenticated
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardSkeleton } from '@/components/shared/skeletons';

// Simple private route wrapper
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show dashboard skeleton while checking auth
    if (loading) {
        return <DashboardSkeleton />;
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
