import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useRealtimeStore } from '../store/realtimeStore';
import { queryClient } from '../lib/queryClient';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

let socketRef = null;

const useSocketEvents = () => {
    const ref = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        ref.current = socketRef;

        if (!user || socketRef) return;

        const backendUrl = API_URL;
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

        s.on('connect_error', (err) => {
            const msg = (err?.message || '').toLowerCase();
            if (msg.includes('auth') || msg.includes('401') || msg.includes('unauthorized') || msg.includes('forbidden')) {
                s.io.opts.reconnection = false;
                s.disconnect();
                socketRef = null;
            }
        });

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
            s.off('connect_error');
            s.off('payment:approved');
            s.off('payment:rejected');
            s.off('wallet:updated');
            s.off('withdrawal:status');
            s.off('notification:new');
            s.disconnect();
        };
    }, [user]);
};

export const reconnectSocket = () => {
    if (socketRef) {
        socketRef.connect();
    }
};

export const getSocket = () => socketRef;
export default useSocketEvents;
