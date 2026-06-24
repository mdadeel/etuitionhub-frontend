import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * RoleRoute - Consistent role-based route wrapper.
 * Waits for dbUser to load before deciding — prevents false redirects.
 *
 * @param {React.ReactNode} children - Route content
 * @param {string[]} allowedRoles - Array of allowed legacy roles (e.g., ['admin', 'tutor'])
 * @param {string[]} allowedGlobalRoles - Array of allowed global roles (e.g., ['super_admin'])
 * @param {string} redirectTo - Redirect path if not authorized (default: '/dashboard')
 */
const RoleRoute = ({ children, allowedRoles = [], allowedGlobalRoles = [], redirectTo = '/dashboard' }) => {
  const { dbUser, loading } = useAuth();

  if (loading) return null;

  const userRole = dbUser?.role?.toLowerCase();
  const userGlobalRole = dbUser?.globalRole;

  // Check global role first
  if (allowedGlobalRoles.length > 0 && allowedGlobalRoles.includes(userGlobalRole)) {
    return children;
  }

  // Check legacy role
  if (allowedRoles.length > 0 && allowedRoles.includes(userRole)) {
    return children;
  }

  // If no roles specified, allow all authenticated users
  if (allowedRoles.length === 0 && allowedGlobalRoles.length === 0) {
    return children;
  }

  return <Navigate to={redirectTo} replace />;
};

export default RoleRoute;
