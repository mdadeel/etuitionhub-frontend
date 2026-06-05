import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CancelConnectionDialog from '../CancelConnectionDialog';

vi.mock('../../../services/api', () => ({
  default: {
    put: vi.fn(() => Promise.resolve({ data: {} }))
  }
}));
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}));

describe('CancelConnectionDialog', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(
      <CancelConnectionDialog open={false} onClose={() => {}} connectionId="abc" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the dialog when open is true', () => {
    render(<CancelConnectionDialog open onClose={() => {}} connectionId="abc" />);
    expect(screen.getByText('Cancel connection')).toBeInTheDocument();
  });

  it('submits PUT /api/connections/:id/cancel with the selected reason', async () => {
    const api = (await import('../../../services/api')).default;
    api.put.mockClear();
    const onClose = vi.fn();
    render(<CancelConnectionDialog open onClose={onClose} connectionId="c123" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'mutual' } });
    fireEvent.click(screen.getByText('Cancel connection'));
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/connections/c123/cancel', { reason: 'mutual', note: '' });
    });
    expect(onClose).toHaveBeenCalled();
  });
});
