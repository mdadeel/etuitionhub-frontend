/**
 * useAnalytics Hook
 * 
 * Fetches pre-computed dashboard stats from backend
 * Uses the new /api/analytics/stats endpoint (MongoDB aggregation)
 * Much more efficient than fetching all data and calculating on frontend
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useAnalytics() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTutors: 0,
        totalAdmins: 0,
        totalTuitions: 0,
        pendingTuitions: 0,
        approvedTuitions: 0,
        totalRevenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);

        try {
            // Single API call - backend does all calculations
            const response = await api.get('/api/analytics/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setFetchError(err.response?.data?.error || 'Failed to load analytics');

            // Fall back to empty stats on error
            // Frontend still works, just shows zeros
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading: isLoading,
        error: fetchError,
        refetch: fetchStats
    };
}

/**
 * Fallback hook that uses old method (fetches all data)
 * Use this if analytics endpoint is not available
 */
export function useAnalyticsFallback() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTutors: 0,
        totalAdmins: 0,
        totalTuitions: 0,
        pendingTuitions: 0,
        approvedTuitions: 0,
        totalRevenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Parallel requests - same as old DashAnalytics but in hook
                const [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
                    api.get('/api/users'),
                    api.get('/api/tuitions'),
                    api.get('/api/payments/all').catch(() => ({ data: [] }))
                ]);

                const userList = usersRes.data;
                const tuitionList = tuitionsRes.data;
                const paymentList = paymentsRes.data;

                // Calculate stats on frontend (fallback method)
                const studentCount = userList.filter(u => u.role === 'student').length;
                const tutorCount = userList.filter(u => u.role === 'tutor').length;
                const adminCount = userList.filter(u => u.role === 'admin').length;

                const pendingCount = tuitionList.filter(t => t.status === 'pending').length;
                const approvedCount = tuitionList.filter(t => t.status === 'approved').length;

                const completedPayments = paymentList.filter(p => p.status === 'completed');
                const revenueTotal = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

                setStats({
                    totalUsers: userList.length,
                    totalStudents: studentCount,
                    totalTutors: tutorCount,
                    totalAdmins: adminCount,
                    totalTuitions: tuitionList.length,
                    pendingTuitions: pendingCount,
                    approvedTuitions: approvedCount,
                    totalRevenue: revenueTotal
                });
            } catch (err) {
                console.error('Analytics fallback error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    return { stats, loading: isLoading };
}

export default useAnalytics;
