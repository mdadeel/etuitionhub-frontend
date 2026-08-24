import { describe, it, expect } from 'vitest';
import { isAdmin, defaultRouteFor, isAdminPath } from '../authz';

describe('isAdmin', () => {
    it('returns true for super_admin', () => {
        expect(isAdmin({ globalRole: 'super_admin', role: 'tutor' })).toBe(true);
    });

    it('returns false for a legacy admin without super_admin globalRole', () => {
        expect(isAdmin({ globalRole: 'user', role: 'admin' })).toBe(false);
    });

    it('returns false for student', () => {
        expect(isAdmin({ globalRole: 'user', role: 'student' })).toBe(false);
    });

    it('returns false for tutor', () => {
        expect(isAdmin({ globalRole: 'user', role: 'tutor' })).toBe(false);
    });

    it('returns false for null/undefined', () => {
        expect(isAdmin(null)).toBe(false);
        expect(isAdmin(undefined)).toBe(false);
    });
});

describe('defaultRouteFor', () => {
    it('returns /super-admin for super_admin', () => {
        expect(defaultRouteFor({ globalRole: 'super_admin', role: 'admin' })).toBe('/super-admin');
    });

    it('returns /admin for legacy admin (no super_admin)', () => {
        expect(defaultRouteFor({ globalRole: 'user', role: 'admin' })).toBe('/admin');
    });

    it('returns /dashboard for student', () => {
        expect(defaultRouteFor({ globalRole: 'user', role: 'student' })).toBe('/dashboard');
    });

    it('returns /dashboard for tutor', () => {
        expect(defaultRouteFor({ globalRole: 'user', role: 'tutor' })).toBe('/dashboard');
    });

    it('returns /dashboard for null', () => {
        expect(defaultRouteFor(null)).toBe('/dashboard');
    });
});

describe('isAdminPath', () => {
    it('matches /admin/* paths', () => {
        expect(isAdminPath('/admin')).toBe(true);
        expect(isAdminPath('/admin/users')).toBe(true);
    });

    it('matches /super-admin/* paths', () => {
        expect(isAdminPath('/super-admin')).toBe(true);
        expect(isAdminPath('/super-admin/users')).toBe(true);
    });

    it('does not match /dashboard paths', () => {
        expect(isAdminPath('/dashboard')).toBe(false);
        expect(isAdminPath('/dashboard/profile')).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(isAdminPath('')).toBe(false);
    });
});
