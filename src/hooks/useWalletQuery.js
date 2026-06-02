import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

/**
 * Fetches /api/wallet/me (tutor's own wallet + recent payments).
 *
 * Real-time updates flow through React Query's invalidation: when
 * useSocketEvents hears `wallet:updated`, it calls
 * queryClient.invalidateQueries({ queryKey: ['wallet', 'me'] }).
 * That triggers an immediate refetch, so the UI stays in sync without
 * a per-component polling loop.
 */
export const useWalletQuery = () =>
    useQuery({
        queryKey: ['wallet', 'me'],
        queryFn: async () => {
            const res = await api.get('/api/wallet/me');
            return res.data;
        },
    });
