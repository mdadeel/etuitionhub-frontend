// Public Route component - redirects logged in users to home
// Used for login/register pages
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton, LineSkeleton } from '@/components/shared/skeletons';

function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show skeleton while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-3">
                        <Skeleton className="size-14 rounded-2xl mx-auto" />
                        <Skeleton className="h-7 w-44 rounded-lg mx-auto" />
                        <LineSkeleton width="2/3" className="h-4 mx-auto" />
                    </div>
                    <CardSkeleton className="p-6 space-y-4">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </CardSkeleton>
                </div>
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
