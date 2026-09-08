/**
 * Canonical permission map for organization dashboard routes.
 * Used by both getDashboardMenuItems.js (navigation) and OrgDashboardLayout.jsx (route guards)
 * to ensure 100% parity between menu visibility and sub-route access gates.
 *
 * Values can be:
 * - null: Accessible to all active organization members
 * - string: A single required permission (e.g. 'member:view')
 * - string[]: An array of permissions where possessing ANY grants access (OR condition)
 */
export const ORG_ROUTE_PERMISSIONS = {
  overview: null,
  sessions: null,
  tuitions: 'tuition:view',
  members: 'member:view',
  students: 'student:view',
  tutors: 'tutor:view',
  classes: ['class:view', 'class:manage'],
  'academic-years': 'class:manage',
  batches: 'class:manage',
  subjects: ['subject:manage', 'subject:view'],
  schedule: 'class:view',
  assignments: 'assignment:view',
  materials: 'material:view',
  attendance: ['attendance:mark', 'attendance:view'],
  branches: 'branch:view',
  exams: ['exam:view', 'exam:manage'],
  results: ['result:view', 'result:manage'],
  announcements: 'announcement:view',
  messages: ['message:send', 'message:view'],
  payments: ['billing:read', 'invoice:view', 'payment:view_all'],
  billing: ['billing:read', 'invoice:view', 'payment:view_all'],
  invoices: ['billing:read', 'invoice:view', 'payment:view_all'],
  salaries: 'salary:view',
  expenses: 'payment:view_all',
  enrollments: ['student:enroll', 'student:manage'],
  guardians: 'student:manage',
  scholarships: ['student:manage', 'billing:read'],
  roles: 'role:view',
  settings: 'settings:manage',
  analytics: 'analytics:view',
  'audit-logs': 'audit:view',
};
