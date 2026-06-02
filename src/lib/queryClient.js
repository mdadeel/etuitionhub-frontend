import { QueryClient } from '@tanstack/react-query';

/**
 * Single shared React Query client.
 *
 * Defaults are tuned for "stale-while-revalidate, not aggressive":
 *   - staleTime 30s: data is considered fresh for 30s, no refetch in that window
 *   - gcTime 5min: unused cache entries hang around for 5 min so back-navigations are instant
 *   - retry 1: 1 automatic retry on network/5xx errors (then surface to UI)
 *   - refetchOnWindowFocus: false — saves battery + avoids duplicate GETs on tab focus
 *
 * Specific queries can override these (e.g. analytics might want 60s).
 * Real-time events (wallet:updated, payment:approved, etc.) call
 * queryClient.invalidateQueries() from useSocketEvents — that's the
 * "live" path, not poll-based.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
