import axios from 'axios';
import API_URL from '../config/api';
import toast from 'react-hot-toast';

function getCsrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 30000
});

let isRefreshing = false;
let sessionDead = false;
let failedQueue = [];
let redirectPending = false;

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

const redirectToLogin = () => {
    if (redirectPending) return;
    redirectPending = true;
    if (!window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please login again.', { duration: 4000 });
        setTimeout(() => { window.location.href = '/login'; }, 200);
    }
};

export const resetSession = () => {
    sessionDead = false;
    redirectPending = false;
    isRefreshing = false;
    failedQueue = [];
};

const reauthFromFirebase = async () => {
    const { auth } = await import('../utils/firebase');
    const fbUser = auth.currentUser;
    if (!fbUser?.email) return false;
    const idToken = await fbUser.getIdToken(true);
    try {
        await api.post('/api/auth/jwt', { email: fbUser.email, idToken }, { _isReauth: true });
        return true;
    } catch {
        return false;
    }
};

api.interceptors.request.use(config => {
    if (sessionDead) {
        return Promise.reject({ __sessionDead: true, config });
    }
    if (!['get', 'head', 'options'].includes(config.method?.toLowerCase())) {
        const token = getCsrfToken();
        if (token) {
            config.headers['X-CSRF-Token'] = token;
        }
    }
    return config;
});

api.interceptors.response.use(
    res => res,
    async err => {
        if (err.__sessionDead) {
            return Promise.reject(err);
        }

        const originalRequest = err.config;
        const status = err.response?.status;

        if (status !== 401 || originalRequest._retry || originalRequest._isRefresh || originalRequest._isReauth) {
            if (status === 429) {
                const msg = err?.response?.data?.error || 'Too many requests. Please slow down and try again.';
                toast.error(msg, { duration: 4000 });
            } else if (status === 401 && !originalRequest._isRefresh) {
                redirectToLogin();
            } else if (status === 403) {
                toast.error('You do not have permission to perform this action.');
            }
            return Promise.reject(err);
        }

        if (sessionDead) {
            redirectToLogin();
            return Promise.reject(err);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => {
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await api.post('/api/auth/refresh', {}, { withCredentials: true, _isRefresh: true });
            processQueue(null);
            return api(originalRequest);
        } catch (refreshError) {
            const reauthed = await reauthFromFirebase();
            if (reauthed) {
                processQueue(null);
                return api(originalRequest);
            }
            sessionDead = true;
            processQueue(refreshError);
            redirectToLogin();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api
