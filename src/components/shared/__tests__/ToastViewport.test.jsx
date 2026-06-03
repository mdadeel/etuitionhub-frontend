import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import ToastViewport from '../ToastViewport';
import { useRealtimeStore } from '../../../store/realtimeStore';

describe('ToastViewport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRealtimeStore.setState({ toasts: [] });
  });

  it('drains a success toast from the store', () => {
    useRealtimeStore.getState().pushToast({ type: 'success', message: 'Approved!' });
    render(<ToastViewport />);
    expect(toast.success).toHaveBeenCalledWith('Approved!', expect.objectContaining({ duration: 4000 }));
    expect(useRealtimeStore.getState().toasts).toHaveLength(0);
  });

  it('drains an error toast from the store', () => {
    useRealtimeStore.getState().pushToast({ type: 'error', message: 'Nope' });
    render(<ToastViewport />);
    expect(toast.error).toHaveBeenCalledWith('Nope', expect.objectContaining({ duration: 4000 }));
  });

  it('renders nothing (returns null)', () => {
    const { container } = render(<ToastViewport />);
    expect(container.innerHTML).toBe('');
  });
});
