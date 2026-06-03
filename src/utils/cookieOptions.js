// Centralized cookie options for the auth `token` cookie.
// Keeps all writes consistent across AuthContext + the axios refresh interceptor.
//
// `secure: true` only when the page is served over HTTPS — local dev runs
// over http://localhost and secure cookies would be silently dropped.
// `sameSite: 'lax'` provides baseline CSRF protection while still allowing
// top-level navigations to send the cookie.
export const AUTH_COOKIE_OPTIONS = {
    expires: 7,
    sameSite: 'lax',
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
};
