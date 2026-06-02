import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export const useAnalyticsQuery = (filters = {}) =>
    useQuery({
        queryKey: ['analytics', filters],
        queryFn: async () => {
            const res = await api.get('/api/analytics/stats', { params: filters });
            return res.data;
        },
        // Analytics dashboard is the only caller; 60s is enough to keep it snappy
        // when admin navigates back to it.
        staleTime: 60_000,
    });
