import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const buildParams = (params = {}) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v != null && v !== '') sp.append(k, v);
    }
    return sp.toString();
};

/**
 * Fetches the current user's own payments list.
 * Auto-refreshes when a payment:approved / payment:rejected socket event
 * lands (useSocketEvents invalidates the `['payments']` key).
 */
export const useMyPaymentsQuery = (params = {}) =>
    useQuery({
        queryKey: ['payments', 'me', params],
        queryFn: async () => {
            // Use a relative path; the api instance resolves the absolute URL.
            const res = await api.get(`/api/payments/student/${encodeURIComponent(params.email || '')}?${buildParams(params)}`);
            return res.data;
        },
    });

/**
 * Admin payments dashboard — full list across all students/tutors.
 */
export const useAllPaymentsQuery = (params = {}) =>
    useQuery({
        queryKey: ['payments', 'all', params],
        queryFn: async () => {
            const res = await api.get(`/api/payments/all?${buildParams(params)}`);
            return res.data;
        },
    });
