import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const sourcePath = path.resolve(__dirname, '../useSessionManager.js');
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
