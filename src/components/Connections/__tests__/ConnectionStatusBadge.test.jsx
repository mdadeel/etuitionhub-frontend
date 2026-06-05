import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConnectionStatusBadge from '../ConnectionStatusBadge';

describe('ConnectionStatusBadge', () => {
  it.each([
    ['pending', null, 'Pending request'],
    ['accepted', null, 'Accepted'],
    ['rejected', null, 'Rejected'],
    ['cancelled', null, 'Cancelled'],
    [null, 'waiting_for_payment', 'Awaiting payment'],
    [null, 'scheduled', 'Scheduled'],
    [null, 'active', 'Active'],
    [null, 'paused', 'Paused'],
    [null, 'completed', 'Completed'],
    ['accepted', 'active', 'Active']
  ])('renders status=%s relationshipStatus=%s as "%s"', (status, rel, expected) => {
    render(<ConnectionStatusBadge status={status} relationshipStatus={rel} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
