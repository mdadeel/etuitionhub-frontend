import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from '../../../contexts/AuthContext';
import PublicRoute from '../PublicRoute';

const mockUseAuth = vi.mocked(useAuth);

const Child = () => <div>Login form</div>;

describe('PublicRoute', () => {
    beforeEach(() => {
        mockUseAuth.mockReset();
    });

    it('renders children when logged out', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            dbUser: null,
            loading: false,
            configError: null,
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <PublicRoute>
                    <Child />
                </PublicRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Login form')).toBeInTheDocument();
    });

    it('renders a loading skeleton while checking auth', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            dbUser: null,
            loading: true,
            configError: null,
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <PublicRoute>
                    <Child />
                </PublicRoute>
            </MemoryRouter>
        );

        expect(screen.queryByText('Login form')).not.toBeInTheDocument();
        expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('redirects to dashboard when signed in and visiting /login', () => {
        mockUseAuth.mockReturnValue({
            user: { email: 'student@test.com', displayName: 'Demo Student' },
            dbUser: { role: 'student', globalRole: 'user', displayName: 'Demo Student' },
            loading: false,
            configError: null,
            logout: vi.fn(),
        });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <PublicRoute>
                    <Child />
                </PublicRoute>
            </MemoryRouter>
        );

        expect(screen.queryByText('Login form')).not.toBeInTheDocument();
        expect(screen.queryByText("You're already signed in")).not.toBeInTheDocument();
    });

    it('redirects to dashboard when signed in and visiting /register', () => {
        mockUseAuth.mockReturnValue({
            user: { email: 'student@test.com', displayName: 'Demo Student' },
            dbUser: { role: 'student', globalRole: 'user', displayName: 'Demo Student' },
            loading: false,
            configError: null,
            logout: vi.fn(),
        });

        render(
            <MemoryRouter initialEntries={['/register']}>
                <PublicRoute>
                    <Child />
                </PublicRoute>
            </MemoryRouter>
        );

        expect(screen.queryByText('Login form')).not.toBeInTheDocument();
        expect(screen.queryByText("You're already signed in")).not.toBeInTheDocument();
    });

    it('shows an interstitial (not a silent redirect) when signed in on /admin-login', () => {
        mockUseAuth.mockReturnValue({
            user: { email: 'student@test.com', displayName: 'Demo Student' },
            dbUser: { role: 'student', globalRole: 'user', displayName: 'Demo Student' },
            loading: false,
            configError: null,
            logout: vi.fn(),
        });

        render(
            <MemoryRouter initialEntries={['/admin-login']}>
                <PublicRoute>
                    <Child />
                </PublicRoute>
            </MemoryRouter>
        );

        expect(screen.getByText("You're already signed in")).toBeInTheDocument();
        expect(screen.getByText(/Demo Student/)).toBeInTheDocument();
        expect(screen.getByText('Continue to Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Sign out')).toBeInTheDocument();
        expect(screen.queryByText('Login form')).not.toBeInTheDocument();
    });

    it('calls logout when the user signs out from admin-login interstitial', async () => {
        const user = userEvent.setup();
        const logout = vi.fn().mockResolvedValue(undefined);
        mockUseAuth.mockReturnValue({
            user: { email: 'student@test.com', displayName: 'Demo Student' },
            dbUser: { role: 'student', globalRole: 'user', displayName: 'Demo Student' },
            loading: false,
            configError: null,
            logout,
        });

        render(
            <MemoryRouter initialEntries={['/admin-login']}>
                <PublicRoute>
                    <Child />
                </PublicRoute>
            </MemoryRouter>
        );

        await user.click(screen.getByText('Sign out'));
        expect(logout).toHaveBeenCalledTimes(1);
    });
});
