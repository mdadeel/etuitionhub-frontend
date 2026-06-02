import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const buildParams = (filters = {}) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
        if (v != null && v !== '') params.append(k, v);
    }
    return params.toString();
};

export const useTuitionsQuery = (filters = {}) =>
    useQuery({
        queryKey: ['tuitions', filters],
        queryFn: async () => {
            const res = await api.get(`/api/tuitions?${buildParams(filters)}`);
            return res.data;
        },
        staleTime: 60_000,
    });
