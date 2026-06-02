import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRealtimeStore } from '../../store/realtimeStore';

/**
 * ToastViewport — drains the realtimeStore.toasts queue into react-hot-toast.
 *
 * Mount once at app top level (next to <Toaster /> from react-hot-toast).
 * Listens for store changes and fires a toast for each new entry, then
 * removes it from the queue so it isn't re-fired.
 */
const ToastViewport = () => {
    const toasts = useRealtimeStore((s) => s.toasts);
    const dismissToast = useRealtimeStore((s) => s.dismissToast);

    useEffect(() => {
        toasts.forEach((t) => {
            const opts = { duration: t.duration ?? 4000, id: t.id };
            if (t.type === 'success') toast.success(t.message, opts);
            else if (t.type === 'error') toast.error(t.message, opts);
            else toast(t.message, { ...opts, icon: t.icon });
            dismissToast(t.id);
        });
    }, [toasts, dismissToast]);

    return null;
};

export default ToastViewport;
