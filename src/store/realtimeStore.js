import { create } from 'zustand';

/**
 * realtimeStore — single Zustand store for real-time event state and toast queue.
 *
 * Replaces per-component socket connections: useSocketEvents() (called once at
 * app top level) writes to this store; any component reads from it.
 *
 * Shape:
 *   walletSnapshot    — most recent wallet balance payload (or null)
 *   lastWithdrawal    — most recent withdrawal:status event (or null)
 *   lastPayment       — most recent payment:approved|rejected event (or null)
 *   toasts            — queue of { id, type, message, duration } — viewport drains
 *   eventLog          — rolling log of last 20 raw events (debug / future feed)
 *
 * The store never owns server state — it only mirrors pushes. Components that
 * need authoritative data (e.g. a wallet detail page) still fetch via REST.
 */
export const useRealtimeStore = create((set, get) => ({
    walletSnapshot: null,
    lastWithdrawal: null,
    lastPayment: null,
    toasts: [],
    eventLog: [],
    unreadCount: 0,

    applyWalletUpdate: (data) => {
        set((s) => ({
            walletSnapshot: { ...s.walletSnapshot, ...data, receivedAt: Date.now() },
            eventLog: appendLog(s.eventLog, { type: 'wallet:updated', data }),
        }));
    },

    setUnreadCount: (n) => set({ unreadCount: n }),
    incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
    decrementUnread: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
    resetUnread: () => set({ unreadCount: 0 }),

    applyPayment: (eventName, data) => {
        set((s) => ({
            lastPayment: { event: eventName, data, receivedAt: Date.now() },
            eventLog: appendLog(s.eventLog, { type: eventName, data }),
        }));
    },

    applyWithdrawal: (data) => {
        set((s) => ({
            lastWithdrawal: { ...data, receivedAt: Date.now() },
            eventLog: appendLog(s.eventLog, { type: 'withdrawal:status', data }),
        }));
    },

    applyNotification: (data) => {
        set((s) => ({
            eventLog: appendLog(s.eventLog, { type: 'notification:new', data }),
        }));
    },

    pushToast: (toast) => {
        const id = toast.id || `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        set((s) => ({ toasts: [...s.toasts, { id, ...toast }] }));
        return id;
    },

    dismissToast: (id) => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    },

    clearOnLogout: () => {
        set({ walletSnapshot: null, lastWithdrawal: null, lastPayment: null, toasts: [], eventLog: [] });
    },
}));

function appendLog(log, entry) {
    const next = [entry, ...log];
    return next.length > 20 ? next.slice(0, 20) : next;
}
