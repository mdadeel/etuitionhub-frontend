import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useRealtimeStore } from '../store/realtimeStore';
import { queryClient } from '../lib/queryClient';

let socketRef = null;

/**
 * useSocketEvents — connects a single Socket.IO instance for the app lifetime
 * and dispatches inbound events into the realtimeStore. Call ONCE at app top
 * level (e.g. App.jsx). Returns the live socket for any caller that needs to
 * emit (chat, typing, etc).
 *
 * On Vercel this is a no-op (serverless can't keep the WebSocket open); events
 * simply never arrive, which is the same as the pre-3.1 polling-based behavior.
 */
const useSocketEvents = () => {
    const ref = useRef(null);
    // eslint-disable-next-line react-hooks/refs
    ref.current = socketRef;

    useEffect(() => {

        if (socketRef) return undefined;

        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        if (backendUrl.includes('vercel')) return undefined;

        const s = io(backendUrl, {
            withCredentials: true,
            transports: ['polling', 'websocket'],
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
            timeout: 5000,
        });
        socketRef = s;

        const store = useRealtimeStore.getState();

        s.on('payment:approved', (data) => {
            store.applyPayment('payment:approved', data);
            store.pushToast({ type: 'success', message: `Payment approved (net ৳${data.netTutorAmount})` });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        });
        s.on('payment:rejected', (data) => {
            store.applyPayment('payment:rejected', data);
            store.pushToast({ type: 'error', message: `Payment rejected: ${data.reason || 'no reason'}` });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        });
        s.on('wallet:updated', (data) => {
            store.applyWalletUpdate(data);
            queryClient.invalidateQueries({ queryKey: ['wallet', 'me'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        });
        s.on('withdrawal:status', (data) => {
            store.applyWithdrawal(data);
            if (data.status === 'paid') {
                store.pushToast({ type: 'success', message: `Withdrawal paid${data.transferTransactionId ? ' · ' + data.transferTransactionId : ''}` });
            } else if (data.status === 'rejected') {
                store.pushToast({ type: 'error', message: `Withdrawal rejected: ${data.reason || 'no reason'}` });
            } else if (data.status === 'processing') {
                store.pushToast({ type: 'default', message: 'Withdrawal approved — processing payment', icon: 'ℹ️' });
            }
            queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
        });
        s.on('notification:new', (data) => {
            store.applyNotification(data);
            if (data?.isRead === false) store.incrementUnread();
        });

        return () => {
            if (socketRef === s) socketRef = null;
            s.off('payment:approved');
            s.off('payment:rejected');
            s.off('wallet:updated');
            s.off('withdrawal:status');
            s.off('notification:new');
            s.disconnect();
        };
    }, []);
};

export const getSocket = () => socketRef;
export default useSocketEvents;
