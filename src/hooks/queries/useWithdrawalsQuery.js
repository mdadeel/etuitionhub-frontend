import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

/**
 * Fetches the current user's withdrawal list. `scope`:
 *  - 'me'   → /api/wallet/me/withdrawals (tutor's own list)
 *  - 'admin' → /api/wallet/admin/withdrawals (admin's full list)
 *
 * The list is auto-refetched whenever useSocketEvents hears a
 * `withdrawal:status` event (it calls invalidateQueries on the
 * `['withdrawals']` key).
 */
export const useWithdrawalsQuery = (scope = 'me', params = {}) =>
    useQuery({
        queryKey: ['withdrawals', scope, params],
        queryFn: async () => {
            const path = scope === 'admin' ? '/api/wallet/admin/withdrawals' : '/api/wallet/me/withdrawals';
            const res = await api.get(path, { params });
            return res.data;
        },
    });
