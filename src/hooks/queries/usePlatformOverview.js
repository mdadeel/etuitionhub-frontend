import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

/**
 * Super-admin platform-overview aggregate. One call returns money/growth/funnel/
 * queues/activity numbers for the dashboard landing page.
 *
 * Admin-only endpoint; no pagination, no filters — just the full snapshot.
 */
export const usePlatformOverview = () =>
    useQuery({
        queryKey: ['analytics', 'platform-overview'],
        queryFn: async () => {
            const res = await api.get('/api/analytics/platform-overview');
            return res.data.data;
        },
        // 60s stale time — admin landing page doesn't need sub-second accuracy.
        staleTime: 60_000,
    });