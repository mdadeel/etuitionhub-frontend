import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RoleBadge from '../RoleBadge';

describe('RoleBadge', () => {
    it('renders Super Admin for super_admin globalRole', () => {
        render(<RoleBadge globalRole="super_admin" role="admin" />);
        const badge = screen.getByText('Super Admin');
        expect(badge).toBeInTheDocument();
        expect(badge.closest('span').className).toContain('border-destructive/20');
    });

    it('renders Admin for legacy role without super_admin globalRole', () => {
        render(<RoleBadge globalRole="user" role="admin" />);
        const badge = screen.getByText('Admin');
        expect(badge).toBeInTheDocument();
        expect(badge.closest('span').className).toContain('border-primary/20');
    });

    it('renders Tutor for role tutor', () => {
        render(<RoleBadge globalRole="user" role="tutor" />);
        const badge = screen.getByText('Tutor');
        expect(badge).toBeInTheDocument();
        expect(badge.closest('span').className).toContain('border-border');
    });

    it('renders Student for role student (default)', () => {
        render(<RoleBadge globalRole="user" role="student" />);
        const badge = screen.getByText('Student');
        expect(badge).toBeInTheDocument();
        expect(badge.closest('span').className).toContain('border-transparent');
    });

    it('defaults to Student when role is missing', () => {
        render(<RoleBadge globalRole="user" />);
        expect(screen.getByText('Student')).toBeInTheDocument();
    });

    it('defaults to Student for unknown roles', () => {
        render(<RoleBadge globalRole="user" role="moderator" />);
        expect(screen.getByText('Student')).toBeInTheDocument();
    });
});
