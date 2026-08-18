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
  const { user, dbUser, loading, configError } = useAuth();
  const location = useLocation();

  if (configError) {
    return <ConfigError />;
  }

  if (loading) {
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

  if (!isAdmin(dbUser)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default AdminRoute;
