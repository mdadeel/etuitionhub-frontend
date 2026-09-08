import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import process from 'process';

const sourcePath = path.resolve(process.cwd(), 'src/hooks/useSessionManager.js');
const source = fs.readFileSync(sourcePath, 'utf8');

describe('useSessionManager.setJWT source checks', () => {
    it('uses getIdToken(true) to force a fresh token (not the cached default)', () => {
        expect(source).toContain('getIdToken(true)');
    });

    it('posts to /api/auth/jwt with email, idToken, displayName, and photoURL', () => {
        // The setJWT callback builds the POST body with these field names
        expect(source).toContain('email,');
        expect(source).toContain('idToken,');
        expect(source).toContain('displayName:');
        expect(source).toContain('photoURL:');
        expect(source).toContain('/api/auth/jwt');
    });

    it('shows the backend error message on 401 response', () => {
        expect(source).toContain('error.response?.status === 401');
        expect(source).toContain('error.response?.data?.error');
    });

    it('shows a generic error on network failures', () => {
        expect(source).toContain("'Authentication failed. Please try again.'");
    });

    it('force-refreshes the token (getIdToken with true argument), matching reauthFromFirebase pattern', () => {
        const getIdTokenCalls = source.match(/getIdToken\s*\(\s*(true|false)?\s*\)/g) || [];
        expect(getIdTokenCalls.some(call => call.includes('true'))).toBe(true);
    });
});

describe('useSessionManager.hasPermission source checks', () => {
    it('supports array of permissions via some check', () => {
        expect(source).toContain('Array.isArray(permission)');
        expect(source).toContain('permission.some(checkSingle)');
    });

    it('grants access unconditionally if permission is null or falsy', () => {
        expect(source).toContain('if (!permission) return true;');
    });

    it('grants full access to super_admin and org owner', () => {
        expect(source).toContain("dbUser?.globalRole === 'super_admin'");
        expect(source).toContain("orgMember?.isOwner || orgMember?.role?.slug === 'owner' || orgRole?.slug === 'owner'");
    });

    it('supports domain wildcard permissions (e.g. domain:*)', () => {
        expect(source).toContain('perms.includes(`${domain}:*`)');
    });
});

