import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../../services/api';

// Batch 4a: cached, cancellable tutors listing with paginated append.
// Mirrors useTuitionsQuery (60s stale + keepPreviousData) but uses
// useInfiniteQuery so "Load more" appends instead of replacing, and the
// axios signal cancels stale requests on fast filter typing.
export const useTutorsInfiniteQuery = (filters = {}) =>
    useInfiniteQuery({
        queryKey: ['tutors', filters],
        queryFn: async ({ signal, pageParam = 1 }) => {
            const params = new URLSearchParams();
            for (const [k, v] of Object.entries(filters)) {
                if (v == null || v === '') continue;
                if (Array.isArray(v)) v.forEach((item) => params.append(k, item));
                else params.append(k, v);
            }
            params.append('page', pageParam);
            params.append('limit', 21);
            const res = await api.get(`/api/tutors?${params.toString()}`, { signal });
            return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const p = lastPage?.pagination;
            return p && p.page < p.pages ? p.page + 1 : undefined;
        },
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    });
