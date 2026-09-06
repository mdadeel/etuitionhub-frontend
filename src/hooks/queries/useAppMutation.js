// hooks/queries/useAppMutation.js
// Shared mutation wrapper — wraps TanStack Query useMutation with a consistent
// error/success/toast pattern so every call site is 3 lines instead of ~20.
//
// Usage:
//
//   const mutation = useAppMutation({
//     mutationFn: (payload) => api.patch(`/api/users/${payload.id}`, payload),
//     queryKey: ['users'],
//     // optional:
//     successMessage: 'User updated',
//     errorTitle: 'Update failed',
//     onOptimisticUpdate: (old, { id }) => old?.filter(u => u._id !== id),
//     invalidate: true,            // default false — set true to invalidate queryKey on success
//     onSuccess: () => refetch(),  // for raw-fetch pages that don't use React Query
//   });
//
// Returns { mutate, mutateAsync, isPending, error } — same shape as useMutation.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

/**
 * @param {Object} options
 * @param {Function} options.mutationFn       — async fn(payload) → API call
 * @param {string|string[]} [options.queryKey] — React Query key to invalidate on success
 * @param {string} [options.successMessage]  — toast message on success (if onSuccessToast)
 * @param {string} [options.errorTitle]      — toast title on error (if onErrorToast)
 * @param {boolean} [options.onSuccessToast] — show success toast (default true)
 * @param {boolean} [options.onErrorToast]   — show error toast (default true)
 * @param {boolean} [options.invalidate]     — invalidate queryKey on success (default false)
 * @param {Function} [options.onOptimisticUpdate] — (oldData, payload) => newData
 * @param {Function} [options.onSuccess]     — runs after default success handler
 * @param {Function} [options.onSettled]     — runs after success or error
 */
export function useAppMutation(options) {
    const {
        mutationFn,
        queryKey,
        successMessage,
        errorTitle,
        onSuccessToast = true,
        onErrorToast = true,
        invalidate = false,
        onOptimisticUpdate,
        onSuccess,
        onSettled,
    } = options;

    const queryClient = useQueryClient();
    const hasQuery = Array.isArray(queryKey) || typeof queryKey === 'string';

    return useMutation({
        mutationFn,
        onMutate: async (payload) => {
            if (!onOptimisticUpdate || !hasQuery) return;

            const keys = Array.isArray(queryKey) ? queryKey : [queryKey];
            const snapshots = {};
            for (const key of keys) {
                snapshots[key] = queryClient.getQueryData(key);
                queryClient.cancelQueries({ queryKey: key });
                queryClient.setQueryData(key, (old) => onOptimisticUpdate(old, payload));
            }
            return { snapshots, keys };
        },
        onError: (err, payload, context) => {
            if (context?.snapshots && context?.keys) {
                for (const key of context.keys) {
                    queryClient.setQueryData(key, context.snapshots[key]);
                }
            }
            if (onErrorToast) {
                const msg = err?.response?.data?.error || err?.message || 'Something went wrong';
                toast.error(errorTitle ? `${errorTitle}: ${msg}` : msg);
            }
        },
        onSuccess: (data, payload, context) => {
            if (onSuccessToast && successMessage) {
                toast.success(successMessage);
            }
            if (invalidate && hasQuery) {
                const keys = Array.isArray(queryKey) ? queryKey : [queryKey];
                for (const key of keys) {
                    queryClient.invalidateQueries({ queryKey: key });
                }
            }
            if (onSuccess) onSuccess(data, payload, context);
        },
        onSettled: (data, err, payload, context) => {
            if (onSettled) onSettled(data, err, payload, context);
        },
    });
}
