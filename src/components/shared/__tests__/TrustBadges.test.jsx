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

  it('shows the Basic status badge for a verified_basic tutor', () => {
    render(<TrustBadges tutor={{ verificationStatus: 'verified_basic' }} />);
    expect(screen.getByText('Basic')).toBeInTheDocument();
  });

  it('shows the Premium status badge for a verified_premium tutor', () => {
    render(<TrustBadges tutor={{ verificationStatus: 'verified_premium' }} />);
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('shows the Review status badge for a pending_review tutor', () => {
    render(<TrustBadges tutor={{ verificationStatus: 'pending_review' }} />);
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('shows the None status badge for an unverified tutor', () => {
    render(<TrustBadges tutor={{ verificationStatus: 'unverified' }} />);
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('renders no status badge when verificationStatus is missing', () => {
    render(<TrustBadges tutor={{ nidVerified: true }} />);
    expect(screen.queryByText(/Basic|Premium|Review|None|Pending/i)).not.toBeInTheDocument();
    expect(screen.getByText(/NID verified/i)).toBeInTheDocument();
  });
});
