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
                <div className="size-8 border-2 border-t-primary border-muted rounded-full animate-spin"></div>
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
