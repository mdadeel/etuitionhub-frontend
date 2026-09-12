import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '@/services/api';

/**
 * Domain 1: Student & Marketplace Query Hooks
 */

// Fetch student tuitions
export function useStudentTuitionsQuery(userEmail, enabled = true) {
  return useQuery({
    queryKey: ['tuitions', 'student', userEmail],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/tuitions/student/${userEmail}`, { signal });
      return res.data || [];
    },
    enabled: Boolean(userEmail) && enabled,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch student bookings
export function useStudentBookingsQuery(userEmail, enabled = true) {
  return useQuery({
    queryKey: ['bookings', 'student', userEmail],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/bookings/student/${userEmail}`, { signal });
      return res.data || [];
    },
    enabled: Boolean(userEmail) && enabled,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch applications for student tuitions
export function useStudentApplicationsQuery(userEmail, enabled = true) {
  return useQuery({
    queryKey: ['applications', 'student', userEmail],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/applications/student/${userEmail}`, { signal });
      return res.data || [];
    },
    enabled: Boolean(userEmail) && enabled,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch student payments
export function useStudentPaymentsQuery(userEmail) {
  return useQuery({
    queryKey: ['payments', 'student', userEmail],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/payments/student/${userEmail}`, { signal });
      return res.data || [];
    },
    enabled: Boolean(userEmail),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch active relationships/connections
export function useConnectionsQuery(status = 'accepted', enabled = true) {
  return useQuery({
    queryKey: ['connections', status],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/connections?status=${status}`, { signal });
      return res.data?.data || res.data || [];
    },
    enabled: Boolean(enabled),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch hire requests (inbox / sent)
export function useHireRequestsQuery(tab = 'inbox', enabled = true) {
  return useQuery({
    queryKey: ['hire-requests', tab],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/hire-requests/${tab}`, { signal });
      return res.data?.data || res.data || [];
    },
    enabled: Boolean(enabled && tab !== 'important'),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Student application status update mutation
export function useUpdateApplicationStatusMutation(userEmail) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ applicationId, status }) => {
      const res = await api.patch(`/api/applications/${applicationId}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'student', userEmail] });
    },
  });
}
