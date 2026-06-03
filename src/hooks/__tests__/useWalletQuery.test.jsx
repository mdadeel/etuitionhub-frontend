import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        wallet: { availableBalance: 1000, pendingBalance: 0, totalEarnings: 1000, totalWithdrawn: 0 },
        recentPayments: [],
      },
    }),
  },
}));

import { useWalletQuery } from '../useWalletQuery';

function TestWrapper({ children }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('useWalletQuery', () => {
  beforeEach(() => vi.clearAllMocks());

  it('queries /api/wallet/me and returns wallet snapshot', async () => {
    const { result } = renderHook(() => useWalletQuery(), { wrapper: TestWrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.wallet.availableBalance).toBe(1000);
    expect(result.current.data.recentPayments).toEqual([]);
  });
});
