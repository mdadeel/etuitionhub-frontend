import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../../services/api';
import { MOCK_TUITIONS, MOCK_TUITION_FILTER_OPTIONS } from '../../data/mockData';

const buildParams = (filters = {}) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
        if (v != null && v !== '') params.append(k, v);
    }
    return params.toString();
};

const isDefaultFilters = (filters = {}) => {
    return !filters.search && !filters.classFilter && !filters.locationFilter && (!filters.subjects || filters.subjects.length === 0);
};

export const useTuitionsQuery = (filters = {}) =>
    useQuery({
        queryKey: ['tuitions', filters],
        queryFn: async () => {
            const res = await api.get(`/api/tuitions?${buildParams(filters)}`);
            return res.data;
        },
        initialData: isDefaultFilters(filters) ? {
            data: MOCK_TUITIONS,
            pagination: { page: 1, limit: 21, total: MOCK_TUITIONS.length, pages: 1 },
            filterOptions: MOCK_TUITION_FILTER_OPTIONS,
        } : undefined,
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    });
