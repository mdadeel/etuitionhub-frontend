// axios setup with auth token
// interceptors add kora ache for auth
import axios from 'axios';
import Cookies from 'js-cookie';
import API_URL from '../config/api';
import { AUTH_COOKIE_OPTIONS } from '../utils/cookieOptions';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 30000
});

// request interceptor - add token
api.interceptors.request.use(config => {
    let token = Cookies.get('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // console.log('request:', config.url) // debug
    return config
})

// Response interceptor - error handling with token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
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
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post('/auth/refresh', {}, { withCredentials: true });
                const { token: newToken } = response.data;
                Cookies.set('token', newToken, AUTH_COOKIE_OPTIONS);
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                Cookies.remove('token', { path: '/' });
                Cookies.remove('refreshToken', { path: '/' });
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
            Cookies.remove('token', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
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
