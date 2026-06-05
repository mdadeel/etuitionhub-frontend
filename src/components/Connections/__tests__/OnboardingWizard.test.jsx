import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import OnboardingWizard from '../OnboardingWizard';

vi.mock('../../../services/api', () => ({
  default: { put: vi.fn(() => Promise.resolve({ data: {} })) }
}));
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}));

const baseConn = {
  _id: 'c1',
  status: 'accepted',
  relationshipStatus: null,
  proposedAt: null,
  confirmedByStudent: false,
  tutorId: { displayName: 'TutorA' },
  studentId: { displayName: 'StudentA' }
};

describe('OnboardingWizard', () => {
  it('renders nothing when status is not accepted', () => {
    const { container } = render(
      <OnboardingWizard connection={{ ...baseConn, status: 'pending' }} viewerRole="tutor" onChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders propose form when tutor has not proposed yet (viewer=tutor)', () => {
    render(<OnboardingWizard connection={baseConn} viewerRole="tutor" onChange={() => {}} />);
    expect(screen.getByText(/Step 1 of 4: Propose details/)).toBeInTheDocument();
  });

  it('renders waitingForProposal when tutor has not proposed (viewer=student)', () => {
    render(<OnboardingWizard connection={baseConn} viewerRole="student" onChange={() => {}} />);
    expect(screen.getByText(/Step 1 of 4: Awaiting tutor proposal/)).toBeInTheDocument();
  });

  it('renders confirm panel when tutor has proposed (viewer=student)', () => {
    const conn = {
      ...baseConn,
      proposedAt: new Date().toISOString(),
      proposedDetails: { subject: 'Math', fee: { amount: 5000 }, schedule: { frequency: 'weekly', daysOfWeek: [1], durationMinutes: 60, preferredTime: 'evening' }, teachingMethod: 'online' }
    };
    render(<OnboardingWizard connection={conn} viewerRole="student" onChange={() => {}} />);
    expect(screen.getByText(/Step 2 of 4: Confirm details/)).toBeInTheDocument();
  });

  it('renders active panel when relationshipStatus is active', () => {
    const conn = {
      ...baseConn,
      proposedAt: new Date().toISOString(),
      confirmedByStudent: true,
      relationshipStatus: 'active'
    };
    render(<OnboardingWizard connection={conn} viewerRole="tutor" onChange={() => {}} />);
    expect(screen.getByRole('heading', { name: /Tutoring is active/ })).toBeInTheDocument();
  });
});
