// Public Route component - handles login/register pages
// If a session is already active, shows an explicit "continue or sign out"
// interstitial instead of silently redirecting — this is what lets an admin
// reach /admin-login even when a stale student session is sitting in the
// browser. Redirects on explicit user action only.
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { defaultRouteFor } from '../../lib/authz';
import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton, LineSkeleton } from '@/components/shared/skeletons';
import ConfigError from './ConfigError';

function PublicRoute({ children }) {
    const { user, dbUser, loading, configError, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [signingOut, setSigningOut] = useState(false);

    // App config (Firebase) failed to load — the login form can't work.
    if (configError) {
        return <ConfigError />;
    }

    // Show skeleton while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-3">
                        <Skeleton className="size-14 rounded-lg mx-auto" />
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

    // Logged in: offer explicit choice instead of a silent redirect.
    // dbUser may still be null briefly if the profile fetch failed — in that
    // case fall back to the displayName on the Firebase user.
    if (user) {
        const displayName = dbUser?.displayName || user.displayName || user.email;
        const roleLabel = dbUser?.globalRole === 'super_admin'
            ? 'Super Admin'
            : dbUser?.role || '';
        const continueTarget = defaultRouteFor(dbUser);

        const handleSignOut = async () => {
            setSigningOut(true);
            await logout();
            // logout() clears user — this component re-renders and shows children.
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 ">
                    <h1 className="text-xl font-heading font-bold text-foreground mb-2">
                        You're already signed in
                    </h1>
                    <p className="text-sm text-muted-foreground mb-5">
                        Signed in as <span className="font-medium text-foreground">{displayName}</span>
                        {roleLabel ? <span className="text-muted-foreground"> ({roleLabel})</span> : null}.
                        {location.pathname === '/admin-login'
                            ? ' Continue as this user, or sign out to use a different account.'
                            : ''}
                    </p>
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={signingOut}
                            className="h-11 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            {signingOut ? 'Signing out…' : 'Sign out'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(continueTarget, { replace: true })}
                            className="h-11 rounded-xl bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Continue to {continueTarget === '/dashboard' ? 'Dashboard' : 'Admin Dashboard'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}

export default PublicRoute;
