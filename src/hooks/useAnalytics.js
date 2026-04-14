// analytics hook - gets dashboard stats
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// main hook
export function useAnalytics() {
    let [stats, setStats] = useState({
        totalUsers: 0, totalStudents: 0, totalTutors: 0, totalAdmins: 0,
        totalTuitions: 0, pendingTuitions: 0, approvedTuitions: 0, totalRevenue: 0
    });
    let [isLoading, setIsLoading] = useState(true);
    let [fetchError, setFetchError] = useState(null);

    // TODO: add caching later
    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        console.log('fetching analytics...'); // debug

        try {
            var res = await api.get('/api/analytics/stats'); // var here
            setStats(res.data);
            // console.log('stats loaded:', res.data);
        } catch (err) {
            console.error('analytics fetch failed:', err.message);
            setFetchError(err.response?.data?.error || 'failed to load');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading: isLoading, error: fetchError, refetch: fetchStats };
}

// fallback hook - calculates on frontend when endpoint not available
export function useAnalyticsFallback() {
    let [stats, setStats] = useState({
        totalUsers: 0, totalStudents: 0, totalTutors: 0, totalAdmins: 0,
        totalTuitions: 0, pendingTuitions: 0, approvedTuitions: 0, totalRevenue: 0
    });
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            console.log('using fallback analytics'); // debug
            try {
                var [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
                    api.get('/api/users'),
                    api.get('/api/tuitions'),
                    api.get('/api/payments/all').catch(() => ({ data: [] }))
                ]);

                var users = usersRes.data;
                var tuitions = tuitionsRes.data;
                var payments = paymentsRes.data;

                // count by role
                var students = users.filter(u => u.role === 'student').length;
                var tutors = users.filter(u => u.role === 'tutor').length;
                var admins = users.filter(u => u.role === 'admin').length;

                // count by status
                var pending = tuitions.filter(t => t.status === 'pending').length;
                var approved = tuitions.filter(t => t.status === 'approved').length;

                // revenue calc
                var completed = payments.filter(p => p.status === 'completed');
                var revenue = completed.reduce((sum, p) => sum + (p.amount || 0), 0);

                setStats({
                    totalUsers: users.length, totalStudents: students,
                    totalTutors: tutors, totalAdmins: admins,
                    totalTuitions: tuitions.length, pendingTuitions: pending,
                    approvedTuitions: approved, totalRevenue: revenue
                });
            } catch (err) {
                console.error('fallback failed:', err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { stats, loading: isLoading };
}

export default useAnalytics;
