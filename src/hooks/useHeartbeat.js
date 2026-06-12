import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function useHeartbeat() {
    const { user, dbUser } = useAuth();
    const intervalRef = useRef(null);

    useEffect(() => {
        // Only for tutors
        if (!user || dbUser?.role !== 'tutor') return;

        const beat = () => {
            api.post('/api/tutors/heartbeat').catch(() => {});
        };

        // Immediate heartbeat
        beat();

        // Then every 60 seconds
        intervalRef.current = setInterval(beat, 60000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [user, dbUser]);
}
