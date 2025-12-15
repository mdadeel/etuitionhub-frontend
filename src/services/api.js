/**
 * Centralized API Service using Axios
 * 
 * Key improvements over raw fetch():
 * 1. Automatic token attachment via request interceptor
 * 2. Global 401 handling - redirects to login
 * 3. Consistent error response format
 * 4. Centralized base URL configuration
 */
import axios from 'axios';
import Cookies from 'js-cookie';
import API_URL from '../config/api';

// Create axios instance with defaults
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000  // 10 second timeout
});

/**
 * Request Interceptor
 * Attaches auth token to every request automatically
 * No need to manually add headers in every component
 */
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Handles common error scenarios globally
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        // Handle specific error codes
        if (response) {
            switch (response.status) {
                case 401:
                    // Session expired or invalid token
                    // Clear token and redirect to login
                    Cookies.remove('token');
                    // Only redirect if not already on login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    // Forbidden - user doesn't have permission
                    console.warn('Access forbidden:', response.data?.error);
                    break;

                case 404:
                    // Resource not found - let component handle
                    break;

                default:
                    // Log unexpected errors
                    console.error('API Error:', response.data?.error || response.statusText);
            }
        } else {
            // Network error - no response received
            console.error('Network error - check your connection');
        }

        return Promise.reject(error);
    }
);

// Convenience methods with better naming
export const apiService = {
    // GET request
    get: (endpoint, config = {}) => api.get(endpoint, config),

    // POST request
    post: (endpoint, data, config = {}) => api.post(endpoint, data, config),

    // PATCH request
    patch: (endpoint, data, config = {}) => api.patch(endpoint, data, config),

    // PUT request
    put: (endpoint, data, config = {}) => api.put(endpoint, data, config),

    // DELETE request
    delete: (endpoint, config = {}) => api.delete(endpoint, config)
};

export default api;
