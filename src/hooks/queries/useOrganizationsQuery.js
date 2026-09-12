import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../../services/api';

const buildParams = (filters = {}) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
        if (v != null && v !== '') params.append(k, v);
    }
    return params.toString();
};

// Batch 4a: cached, cancellable organization directory listing.
// keepPreviousData keeps the previous list visible during background
// refetches instead of flashing a full skeleton on every filter tweak.
export const useOrganizationsQuery = (filters = {}) =>
    useQuery({
        queryKey: ['organizations', filters],
        queryFn: async ({ signal }) => {
            const res = await api.get(`/api/v1/organizations?${buildParams(filters)}`, { signal });
            return res.data?.data || [];
        },
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    });

// The viewer's own memberships (affiliation strip). Independent query so a
// slow membership fetch never blocks the public directory.
export const useMyOrgsQuery = (enabled = false) =>
    useQuery({
        queryKey: ['organizations', 'mine'],
        queryFn: async ({ signal }) => {
            const res = await api.get('/api/v1/organizations/my/orgs', { signal }).catch(() => ({ data: { data: [] } }));
            return res.data?.data || [];
        },
        enabled: Boolean(enabled),
        staleTime: 120_000,
    });
