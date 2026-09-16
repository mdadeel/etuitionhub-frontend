import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PremiumGate from '../PremiumGate';
import { hasPremiumAccess } from '../premiumAccess';

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k, d) => d }) }));

describe('hasPremiumAccess', () => {
  it('allows premium users', () => {
    expect(hasPremiumAccess({ globalRole: 'user', isPremium: true })).toBe(true);
  });

  it('allows super admins without the flag', () => {
    expect(hasPremiumAccess({ globalRole: 'super_admin' })).toBe(true);
  });

  it('blocks regular users', () => {
    expect(hasPremiumAccess({ globalRole: 'user' })).toBe(false);
  });

  it('blocks while unresolved', () => {
    expect(hasPremiumAccess(null)).toBe(false);
    expect(hasPremiumAccess(undefined)).toBe(false);
  });
});

describe('PremiumGate', () => {
  it('renders the premium notice with both exits and no dismiss button', () => {
    render(<PremiumGate />);
    expect(screen.getByText('Porua AI is for premium users')).toBeInTheDocument();
    expect(screen.getByText('Request premium access')).toBeInTheDocument();
    expect(screen.getByText('Go back')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });
});
