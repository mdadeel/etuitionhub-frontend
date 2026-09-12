import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '@/services/api';

/**
 * Domain 2: Tutor Dashboard & Operational Workspace Query Hooks
 */

// Fetch tutor applications
export function useTutorApplicationsQuery(userEmail, enabled = true) {
  return useQuery({
    queryKey: ['applications', 'tutor', userEmail],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/applications/tutor/${userEmail}`, { signal });
      return res.data || [];
    },
    enabled: Boolean(userEmail) && enabled,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch tutor revenue/earnings
export function useTutorRevenueQuery(userEmail, enabled = true) {
  return useQuery({
    queryKey: ['payments', 'tutor', userEmail],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/payments/tutor/${userEmail}`, { signal });
      return res.data || [];
    },
    enabled: Boolean(userEmail) && enabled,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch tutor sessions
export function useTutorSessionsQuery(scope = 'tutor') {
  return useQuery({
    queryKey: ['sessions', scope],
    queryFn: async ({ signal }) => {
      const res = await api.get('/api/sessions', { params: { scope }, signal });
      return res.data?.data || res.data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch assignments
export function useAssignmentsQuery() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: async ({ signal }) => {
      const res = await api.get('/api/assignments', { signal });
      return res.data?.data || res.data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch disputes — Batch 3: endpoints aligned to the mounted backend routes
// (GET /api/disputes = my disputes, GET /api/disputes/all = admin; there is
// no /api/disputes/my route).
export function useDisputesQuery(scope = 'my') {
  return useQuery({
    queryKey: ['disputes', scope],
    queryFn: async ({ signal }) => {
      const endpoint = scope === 'all' ? '/api/disputes/all' : '/api/disputes';
      const res = await api.get(endpoint, { signal });
      return res.data?.data || res.data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Tutor application deletion mutation
export function useDeleteTutorApplicationMutation(userEmail) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/applications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'tutor', userEmail] });
    },
  });
}
