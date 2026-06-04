import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrustBadges from '../TrustBadges';

describe('TrustBadges', () => {
  it('shows NID verified badge when nidVerified is true', () => {
    render(<TrustBadges tutor={{ nidVerified: true }} />);
    expect(screen.getByText(/NID verified/i)).toBeInTheDocument();
  });

  it('shows the verified-reviews count when verifiedReviewsCount > 0', () => {
    render(<TrustBadges tutor={{ verifiedReviewsCount: 3 }} />);
    expect(screen.getByText(/3 verified reviews/i)).toBeInTheDocument();
  });

  it('uses singular noun when verifiedReviewsCount is 1', () => {
    render(<TrustBadges tutor={{ verifiedReviewsCount: 1 }} />);
    expect(screen.getByText(/1 verified review(?!s)/i)).toBeInTheDocument();
  });

  it('renders nothing when tutor prop is null', () => {
    const { container } = render(<TrustBadges tutor={null} />);
    expect(container.firstChild).toBeNull();
  });
});
