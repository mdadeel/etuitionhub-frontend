/**
 * Centralized API Service
 * Axios instance with interceptors for authentication and error handling
 */
import axios from 'axios';
import Cookies from 'js-cookie';
import API_URL from '../config/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000
});

// Request interceptor - attaches auth token
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handles common error scenarios
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response) {
            switch (response.status) {
                case 401:
                    Cookies.remove('token');
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    console.warn('Access forbidden:', response.data?.error);
                    break;
                case 404:
                    // Let component handle not found errors
                    break;
                default:
                    console.error('API error:', response.data?.error || response.statusText);
            }
        } else {
            console.error('Network error - check your connection');
        }

        return Promise.reject(error);
    }
);

/**
 * API service methods
 */
export const apiService = {
    get: (url, config = {}) => api.get(url, config),
    post: (url, data, config = {}) => api.post(url, data, config),
    patch: (url, data, config = {}) => api.patch(url, data, config),
    put: (url, data, config = {}) => api.put(url, data, config),
    delete: (url, config = {}) => api.delete(url, config)
};

export default api;
