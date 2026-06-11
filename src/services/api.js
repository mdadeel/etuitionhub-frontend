// axios setup with auth token
// interceptors add kora ache for auth
import axios from 'axios';
import API_URL from '../config/api';

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
                    window.location.href = '/login?expired=true';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle other errors
        if (status === 401) {
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login?expired=true';
            }
        } else if (status === 403) {
            console.warn('403 forbidden:', err.response?.data?.error);
        } else if (status === 404) {
            // let component handle
        } else {
            console.log('api error:', err.message);
        }

        return Promise.reject(err);
    }
);

export default api
