import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CredibilityBadge from '../CredibilityBadge';

describe('CredibilityBadge', () => {
    it('renders nothing when requestsRespondedCount is 0 (no fabricated rate)', () => {
        const { container } = render(
            <CredibilityBadge requestsReceived={10} requestsRespondedCount={0} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders accurate response rate when response data exists', () => {
        render(
            <CredibilityBadge requestsReceived={10} requestsRespondedCount={5} />
        );
        expect(screen.getByText('Response Rate: 50%')).toBeInTheDocument();
    });

    it('renders Verified Profile only for verified_basic status', () => {
        render(
            <CredibilityBadge verificationStatus="verified_basic" requestsReceived={2} requestsRespondedCount={0} />
        );
        expect(screen.getByText('Verified Profile')).toBeInTheDocument();
    });

    it('renders Verified Profile only for verified_premium status', () => {
        render(
            <CredibilityBadge verificationStatus="verified_premium" requestsReceived={2} requestsRespondedCount={0} />
        );
        expect(screen.getByText('Verified Profile')).toBeInTheDocument();
    });

    it('does not render Verified Profile for unverified status even with high completeness-like data', () => {
        const { container } = render(
            <CredibilityBadge verificationStatus="pending_review" requestsReceived={2} requestsRespondedCount={0} reviewCount={0} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('does not claim Verified Profile when verificationStatus is missing', () => {
        const { container } = render(
            <CredibilityBadge requestsReceived={2} requestsRespondedCount={0} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders rating when reviewCount >= 3 and rating present', () => {
        render(
            <CredibilityBadge requestsReceived={2} requestsRespondedCount={0} reviewCount={3} rating={4.5} />
        );
        expect(screen.getByText('4.5 ★')).toBeInTheDocument();
    });
});
