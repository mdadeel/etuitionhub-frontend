// Centralized role-based authorization helpers for the app.
// The backend remains the source of truth for permissions; these only
// decide which app (admin vs student) the frontend routes the user to.

export const isAdmin = (dbUser) =>
  dbUser?.globalRole === 'super_admin' || dbUser?.role === 'admin';

export const defaultRouteFor = (dbUser) => {
  if (dbUser?.globalRole === 'super_admin') return '/super-admin';
  if (dbUser?.role === 'admin') return '/admin';
  return '/dashboard';
};

export const isAdminPath = (pathname) =>
  typeof pathname === 'string' &&
  (pathname.startsWith('/admin') || pathname.startsWith('/super-admin'));
