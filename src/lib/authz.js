// Centralized role-based authorization helpers for the app.
// The backend remains the source of truth for permissions; these only
// decide which app (admin vs student) the frontend routes the user to.

// Canonical admin signal — mirrors the backend model (User.js: role:'admin'
// is vestigial; globalRole === 'super_admin' is the only trusted check).
// Never rely on the legacy role field for authorization.
export const isAdmin = (dbUser) =>
  dbUser?.globalRole === 'super_admin';

export const defaultRouteFor = (dbUser) => {
  // /admin was collapsed into /super-admin (AdminRoutes redirects); a legacy
  // role:'admin' without globalRole is not a real admin — send to the user app.
  if (dbUser?.globalRole === 'super_admin') return '/super-admin';
  return '/dashboard';
};

export const isAdminPath = (pathname) =>
  typeof pathname === 'string' &&
  (pathname.startsWith('/admin') || pathname.startsWith('/super-admin'));
