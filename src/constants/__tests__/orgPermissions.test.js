import { describe, it, expect } from 'vitest';
import { ORG_ROUTE_PERMISSIONS } from '../orgPermissions';

describe('ORG_ROUTE_PERMISSIONS Canonical Map', () => {
  it('defines permissions for all standard organization routes', () => {
    expect(ORG_ROUTE_PERMISSIONS.overview).toBeNull();
    expect(ORG_ROUTE_PERMISSIONS.sessions).toBeNull();
    expect(ORG_ROUTE_PERMISSIONS.tuitions).toBe('tuition:view');
    expect(ORG_ROUTE_PERMISSIONS.members).toBe('member:view');
    expect(ORG_ROUTE_PERMISSIONS.students).toBe('student:view');
    expect(ORG_ROUTE_PERMISSIONS.tutors).toBe('tutor:view');
    expect(ORG_ROUTE_PERMISSIONS.branches).toBe('branch:view');
    expect(ORG_ROUTE_PERMISSIONS.settings).toBe('settings:manage');
  });

  it('correctly maps multi-permission routes with OR arrays', () => {
    expect(Array.isArray(ORG_ROUTE_PERMISSIONS.classes)).toBe(true);
    expect(ORG_ROUTE_PERMISSIONS.classes).toContain('class:view');
    expect(ORG_ROUTE_PERMISSIONS.classes).toContain('class:manage');

    expect(Array.isArray(ORG_ROUTE_PERMISSIONS.payments)).toBe(true);
    expect(ORG_ROUTE_PERMISSIONS.payments).toContain('billing:read');
    expect(ORG_ROUTE_PERMISSIONS.payments).toContain('invoice:view');
    expect(ORG_ROUTE_PERMISSIONS.payments).toContain('payment:view_all');

    expect(Array.isArray(ORG_ROUTE_PERMISSIONS.attendance)).toBe(true);
    expect(ORG_ROUTE_PERMISSIONS.attendance).toContain('attendance:mark');
    expect(ORG_ROUTE_PERMISSIONS.attendance).toContain('attendance:view');
  });

  it('unifies previously drifting routes (academic-years, batches, enrollments, guardians)', () => {
    expect(ORG_ROUTE_PERMISSIONS['academic-years']).toBe('class:manage');
    expect(ORG_ROUTE_PERMISSIONS.batches).toBe('class:manage');
    expect(ORG_ROUTE_PERMISSIONS.guardians).toBe('student:manage');
    expect(ORG_ROUTE_PERMISSIONS.enrollments).toEqual(['student:enroll', 'student:manage']);
  });
});
