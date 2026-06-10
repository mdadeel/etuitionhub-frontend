/**
 * Analytics Service - API layer for dashboard analytics
 */
import api from './api';

export const analyticsService = {
    /**
     * Get pre-computed dashboard stats (uses MongoDB aggregation)
     */
    getStats: async () => {
        const response = await api.get('/api/analytics/stats');
        return response.data;
    },

    /**
     * Fallback: Get raw data for manual calculation
     * Used when aggregation endpoint is unavailable
     */
    getRawData: async () => {
        const [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
            api.get('/api/users'),
            api.get('/api/tuitions'),
            api.get('/api/payments/all').catch(() => ({ data: [] }))
        ]);

        return {
            users: usersRes.data,
            tuitions: tuitionsRes.data,
            payments: paymentsRes.data
        };
    },

    /**
     * Get all payments/transactions
     */
    getTransactions: async () => {
        const response = await api.get('/api/payments/all');
        return response.data;
    },

    getUsersStats: async () => {
        const response = await api.get('/api/analytics/users');
        return response.data;
    },

    getTuitionsStats: async () => {
        const response = await api.get('/api/analytics/tuitions');
        return response.data;
    },

    getRevenueStats: async () => {
        const response = await api.get('/api/analytics/revenue');
        return response.data;
    },

    getMonthlyRevenue: async () => {
        const response = await api.get('/api/analytics/revenue/monthly');
        return response.data;
    },

    getPopularSearches: async (params = {}) => {
        const response = await api.get('/api/analytics/search/popular', { params });
        return response.data;
    },

    getZeroResultSearches: async (params = {}) => {
        const response = await api.get('/api/analytics/search/zero-results', { params });
        return response.data;
    }
};

export default analyticsService;
