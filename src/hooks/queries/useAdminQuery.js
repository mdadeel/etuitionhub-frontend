import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/services/api';

/**
 * Domain 3: SuperAdmin & Admin Query Hooks
 */

// Fetch pending verifications
export function usePendingVerificationsQuery() {
  return useQuery({
    queryKey: ['admin', 'verifications', 'pending'],
    queryFn: async ({ signal }) => {
      const res = await api.get('/api/users?verificationStatus=pending_review&limit=50', { signal });
      return res.data?.data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch admin tutors (pending vs approved tabs)
export function useAdminTutorsModerationQuery(tab = 'pending') {
  return useQuery({
    queryKey: ['admin', 'tutors', 'moderation', tab],
    queryFn: async ({ signal }) => {
      const endpoint = tab === 'pending' ? '/api/admin/tutors/pending' : '/api/admin/tutors/approved';
      const res = await api.get(endpoint, { signal });
      return res.data?.data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch all tutors for AdminTutors table
export function useAdminTutorsQuery() {
  return useQuery({
    queryKey: ['admin', 'tutors', 'all'],
    queryFn: async ({ signal }) => {
      const res = await api.get('/api/tutors', { signal });
      return res.data?.data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch users list for DashUsers
export function useDashUsersQuery({ page = 1, search = '', roleFilter = '', locationFilter = null }) {
  return useQuery({
    queryKey: ['admin', 'users', { page, search, roleFilter, locationFilter }],
    queryFn: async ({ signal }) => {
      const params = { page };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (locationFilter) params.location = locationFilter;

      const res = await api.get('/api/users', { params, signal });
      return res.data;
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch tuitions list for DashTuitions
export function useDashTuitionsQuery({ page = 1, subjectFilter = null, classFilter = null, locationFilter = null }) {
  return useQuery({
    queryKey: ['admin', 'tuitions', { page, subjectFilter, classFilter, locationFilter }],
    queryFn: async ({ signal }) => {
      const params = { page };
      if (subjectFilter) params.subjects = subjectFilter;
      if (classFilter) params.classFilter = classFilter;
      if (locationFilter) params.location = locationFilter;

      const res = await api.get('/api/tuitions', { params, signal });
      return res.data;
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch SMS/Email templates
export function useTemplatesQuery() {
  return useQuery({
    queryKey: ['admin', 'templates'],
    queryFn: async ({ signal }) => {
      const res = await api.get('/api/templates', { signal });
      return res.data?.templates || res.data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch saved search alerts
export function useSavedSearchAlertsQuery() {
  return useQuery({
    queryKey: ['search-alerts'],
    queryFn: async ({ signal }) => {
      const res = await api.get('/api/search-alerts', { signal });
      return res.data?.data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
