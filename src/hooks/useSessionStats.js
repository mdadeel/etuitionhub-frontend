import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const useSessionStats = () => {
    return useQuery({
        queryKey: ['session-stats'],
        queryFn: async () => {
            const res = await api.get('/api/sessions/stats/summary');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export default useSessionStats;
