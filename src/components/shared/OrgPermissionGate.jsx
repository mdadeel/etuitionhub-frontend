import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * A wrapper component that conditionally renders its children based on
 * the current user's permissions within their active organization context.
 *
 * @param {Object} props
 * @param {string} props.permission - The permission required (e.g., 'tuition:create')
 * @param {React.ReactNode} props.fallback - Optional fallback UI if permission is denied
 * @param {boolean} props.redirect - If true, redirects to dashboard instead of rendering fallback
 */
const OrgPermissionGate = ({ permission, fallback = null, redirect = false, children }) => {
    const { hasPermission, loading } = useAuth();

    if (loading) {
        // Return null or a subtle loading state to prevent flash of content
        // Typically the parent Route/Page already handles loading states.
        return null;
    }

    if (hasPermission(permission)) {
        return <>{children}</>;
    }

    if (redirect) {
        return <Navigate to="/dashboard" replace />;
    }

    return fallback ? <>{fallback}</> : null;
};

export default OrgPermissionGate;
