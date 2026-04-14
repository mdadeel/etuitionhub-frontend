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
    }
};

export default analyticsService;
