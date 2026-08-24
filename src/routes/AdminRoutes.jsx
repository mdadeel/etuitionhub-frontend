import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoutes = () => {
  const { dbUser, loading } = useAuth();

  if (loading) return null;

  if (dbUser?.globalRole !== 'super_admin') {
    return <Navigate to="/403" replace />;
  }

  // Collapse: /admin → /super-admin. Both route sets guard on the same
  // globalRole check, so /admin is a redirect to keep one canonical admin
  // destination. Remove this file entirely after the transition period.
  return <Navigate to="/super-admin" replace />;
};

export default AdminRoutes;
