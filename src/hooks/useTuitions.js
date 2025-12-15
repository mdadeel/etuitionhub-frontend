/**
 * useTuitions Hook
 * 
 * Custom hook for fetching and managing tuitions data
 * Extracts data fetching logic from components - cleaner separation
 * 
 * Usage:
 *   const { tuitions, loading, error, refetch } = useTuitions({ status: 'approved' });
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useTuitions(filters = {}) {
    const [tuitionList, setTuitionList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Build query string from filters
    const queryString = new URLSearchParams(filters).toString();

    const fetchTuitions = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);

        try {
            const endpoint = queryString
                ? `/api/tuitions?${queryString}`
                : '/api/tuitions';

            const response = await api.get(endpoint);
            setTuitionList(response.data);
        } catch (err) {
            console.error('Failed to fetch tuitions:', err);
            setFetchError(err.response?.data?.error || 'Failed to load tuitions');
        } finally {
            setIsLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchTuitions();
    }, [fetchTuitions]);

    return {
        tuitions: tuitionList,
        loading: isLoading,
        error: fetchError,
        refetch: fetchTuitions
    };
}

/**
 * useTuition Hook
 * Fetch single tuition by ID
 */
export function useTuition(tuitionId) {
    const [tuition, setTuition] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        if (!tuitionId) {
            setIsLoading(false);
            return;
        }

        const fetchTuition = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/tuitions/${tuitionId}`);
                setTuition(response.data);
            } catch (err) {
                setFetchError(err.response?.data?.error || 'Tuition not found');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTuition();
    }, [tuitionId]);

    return { tuition, loading: isLoading, error: fetchError };
}

/**
 * useStudentTuitions Hook
 * Fetch tuitions for a specific student (by email)
 */
export function useStudentTuitions(studentEmail) {
    const [tuitions, setTuitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!studentEmail) {
            setIsLoading(false);
            return;
        }

        const fetchStudentTuitions = async () => {
            try {
                const response = await api.get(`/api/tuitions/student/${studentEmail}`);
                setTuitions(response.data);
            } catch (err) {
                console.error('Failed to fetch student tuitions:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentTuitions();
    }, [studentEmail]);

    return { tuitions, loading: isLoading };
}

export default useTuitions;
