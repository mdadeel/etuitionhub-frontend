import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriceBadge from '../PriceBadge';

describe('PriceBadge', () => {
  it('renders per-session price', () => {
    render(<PriceBadge pricePerSession={500} />);
    expect(screen.getByText(/500/)).toBeInTheDocument();
    expect(screen.getByText(/\/session/)).toBeInTheDocument();
  });

  it('renders per-month price', () => {
    render(<PriceBadge pricePerMonth={5000} />);
    expect(screen.getByText(/5,000\/mo/)).toBeInTheDocument();
  });

  it('renders both prices with a separator when showBoth is true', () => {
    render(<PriceBadge pricePerSession={500} pricePerMonth={5000} />);
    expect(screen.getByText(/\/session/)).toBeInTheDocument();
    expect(screen.getByText(/\/mo/)).toBeInTheDocument();
  });

  it('renders nothing when no prices provided', () => {
    const { container } = render(<PriceBadge />);
    expect(container.firstChild).toBeNull();
  });
});
