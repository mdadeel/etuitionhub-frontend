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
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;
        const status = err.response?.status;

        if (status === 401 && !originalRequest._retry) {
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
                // Use the api instance so the configured baseURL (API_URL) is
                // prepended. Raw axios.post with a relative URL would hit the
                // current origin, which on a separate-frontend/backend
                // deployment is the frontend host — and /auth/refresh isn't
                // served there.
                await api.post('/api/auth/refresh', {}, { withCredentials: true });
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                if (!window.location.pathname.includes('/login')) {
                    toast.error('Session expired. Please login again.', { duration: 4000 });
                    setTimeout(() => { window.location.href = '/login'; }, 1000);
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle other errors
        if (status === 401) {
            if (!window.location.pathname.includes('/login')) {
                toast.error('Session expired. Please login again.', { duration: 4000 });
                setTimeout(() => { window.location.href = '/login'; }, 1000);
            }
        } else if (status === 403) {
            toast.error('You do not have permission to perform this action.');
        } else if (status === 404) {
            // let component handle
        }

        return Promise.reject(err);
    }
);

export default api
