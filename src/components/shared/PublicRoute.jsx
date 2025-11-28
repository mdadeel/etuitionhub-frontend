// Public Route component - redirects logged in users to home
// Used for login/register pages
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-teal-600"></span>
            </div>
        );
    }

    // If logged in, redirect to home or dashboard
    if (user) {
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    return children;
}

export default PublicRoute;
