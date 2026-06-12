// axios setup with auth token
// interceptors add kora ache for auth
import axios from 'axios';
import API_URL from '../config/api';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 30000
});

// Response interceptor - error handling with token refresh
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
        setTimeout(() => { window.location.href = '/login'; }, 1000);
    }
};

api.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;
        const status = err.response?.status;

        // Skip refresh logic entirely for non-401 errors, refresh requests,
        // and requests that already failed once
        if (status !== 401 || originalRequest._retry || originalRequest._isRefresh) {
            if (status === 401 && !originalRequest._isRefresh) {
                redirectToLogin();
            } else if (status === 403) {
                toast.error('You do not have permission to perform this action.');
            }
            return Promise.reject(err);
        }

        // If we already know the session is dead (refresh failed earlier),
        // don't try again — just redirect
        if (sessionDead) {
            redirectToLogin();
            return Promise.reject(err);
        }

        // If a refresh is already in progress, queue this request
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
