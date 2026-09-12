import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/services/api';

/**
 * Domain 4: Organization Workspace Query Hooks
 */

// Fetch Org Overview details, members & tuitions
export function useOrgHomeQuery(orgId, { canViewMembers = true, canViewTuitions = true } = {}) {
  return useQuery({
    queryKey: ['org', orgId, 'home', { canViewMembers, canViewTuitions }],
    queryFn: async ({ signal }) => {
      const membersPromise = canViewMembers
        ? api.get(`/api/v1/organizations/${orgId}/members`, { signal })
        : Promise.resolve({ data: { data: [] } });

      const tuitionsPromise = canViewTuitions
        ? api.get(`/api/v1/organizations/${orgId}/tuitions`, { signal })
        : Promise.resolve({ data: { data: [] } });

      const [orgRes, membersRes, tuitionsRes] = await Promise.all([
        api.get(`/api/v1/organizations/${orgId}`, { signal }).catch(() => ({ data: { data: null } })),
        membersPromise.catch(() => ({ data: { data: [] } })),
        tuitionsPromise.catch(() => ({ data: { data: [] } })),
      ]);

      const org = orgRes.data?.data || null;
      const memberList = membersRes.data?.data || [];
      const tuitionList = tuitionsRes.data?.data || [];

      const stats = {
        totalMembers: memberList.length,
        teachers: memberList.filter(m => ['teacher', 'admin', 'coordinator', 'owner'].includes(m.roleId?.slug)).length,
        students: memberList.filter(m => m.roleId?.slug === 'student').length,
        activeTuitions: tuitionList.filter(t => t.status === 'approved' || t.status === 'matched').length,
        totalTuitions: tuitionList.length,
      };

      return { org, stats, tuitions: tuitionList };
    },
    enabled: Boolean(orgId),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch Org Members, Roles & Join Requests
export function useOrgMembersQuery(orgId) {
  return useQuery({
    queryKey: ['org', orgId, 'members-and-roles'],
    queryFn: async ({ signal }) => {
      const [membersRes, rolesRes, joinRes] = await Promise.all([
        api.get(`/api/v1/organizations/${orgId}/members`, { signal }),
        api.get(`/api/v1/organizations/${orgId}/roles`, { signal }),
        api.get(`/api/v1/organizations/${orgId}/join-requests`, { signal }).catch(() => ({ data: { data: [] } })),
      ]);

      return {
        members: membersRes.data?.data || [],
        roles: rolesRes.data?.data || [],
        joinRequests: joinRes.data?.data || [],
      };
    },
    enabled: Boolean(orgId),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch Org Students
export function useOrgStudentsQuery(orgId) {
  return useQuery({
    queryKey: ['org', orgId, 'students'],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/v1/organizations/${orgId}/students`, { signal });
      return res.data?.data || [];
    },
    enabled: Boolean(orgId),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch Org Batches
export function useOrgBatchesQuery(orgId) {
  return useQuery({
    queryKey: ['org', orgId, 'batches'],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/v1/organizations/${orgId}/batches`, { signal });
      return res.data?.data || [];
    },
    enabled: Boolean(orgId),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Fetch Org Invoices
export function useOrgInvoicesQuery(orgId) {
  return useQuery({
    queryKey: ['org', orgId, 'invoices'],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/v1/organizations/${orgId}/invoices`, { signal });
      return res.data?.data || [];
    },
    enabled: Boolean(orgId),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Lazy Tab Queries for OrgAcademicSetup
export function useOrgAcademicTabQuery(orgId, tab = 'classes') {
  return useQuery({
    queryKey: ['org', orgId, 'academic-setup', tab],
    queryFn: async ({ signal }) => {
      let endpoint = `/api/v1/organizations/${orgId}/classes`;
      if (tab === 'subjects') endpoint = `/api/v1/organizations/${orgId}/subjects-list`;
      if (tab === 'years') endpoint = `/api/v1/organizations/${orgId}/academic-years`;
      if (tab === 'batches') endpoint = `/api/v1/organizations/${orgId}/batches`;

      const res = await api.get(endpoint, { signal });
      return res.data?.data || [];
    },
    enabled: Boolean(orgId && tab),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Generic collection query for the remaining workspace entities (Batch 4d).
// resource = path segment after /api/v1/organizations/:orgId/ as used by the
// page today (e.g. 'tutors', 'guardians', 'branches'). Same caching contract
// as the hooks above: 60s stale + keepPreviousData + abort signal.
export function useOrgListQuery(orgId, resource) {
  return useQuery({
    queryKey: ['org', orgId, resource],
    queryFn: async ({ signal }) => {
      const res = await api.get(`/api/v1/organizations/${orgId}/${resource}`, { signal });
      return res.data?.data || [];
    },
    enabled: Boolean(orgId && resource),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
