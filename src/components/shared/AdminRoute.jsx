import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../lib/authz';
import ConfigError from './ConfigError';

/**
 * AdminRoute — dedicated guard for the admin application.
 * Unauthenticated visitors go to the admin login; authenticated non-admins
 * get a 403. Never redirects an admin out of the admin app.
 */
const AdminRoute = ({ children }) => {
  const { user, dbUser, loading, configError, dbUserError, retryDbUser } = useAuth();
  const location = useLocation();

  if (configError) {
    return <ConfigError />;
  }

  if (loading || (user && !dbUser && !dbUserError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin-login"
        state={{ from: { pathname: location.pathname + location.search } }}
        replace
      />
    );
  }

  if (dbUserError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
        <p className="text-sm text-destructive">{dbUserError.message}</p>
        <button
          onClick={retryDbUser}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isAdmin(dbUser)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default AdminRoute;
