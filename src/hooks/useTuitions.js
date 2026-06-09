import { useState, useEffect, useCallback } from 'react';
import { tuitionService } from '../services/tuitionService';
import toast from 'react-hot-toast';

export const useTuitions = (initialFilters = {}) => {
    const [tuitions, setTuitions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [filterOptions, setFilterOptions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [trigger, setTrigger] = useState(0);
    const refetch = useCallback(() => setTrigger(t => t + 1), []);

    useEffect(() => {
        let active = true;

        // Reset state immediately for page 1/initial load to display skeleton instantly
        if (!initialFilters.page || initialFilters.page === 1) {
            setTuitions([]);
            setLoading(true);
        }

        const fetchTuitions = async () => {
            try {
                setError(null);
                const data = await tuitionService.getAll(initialFilters);
                if (!active) return;

                if (data.data) {
                    setTuitions((prev) => 
                        initialFilters.page && initialFilters.page > 1
                            ? [...prev, ...data.data]
                            : data.data
                    );
                    setPagination(data.pagination);
                    setFilterOptions(data.filterOptions);
                } else {
                    setTuitions((prev) => 
                        initialFilters.page && initialFilters.page > 1
                            ? [...prev, ...(Array.isArray(data) ? data : [])]
                            : (Array.isArray(data) ? data : [])
                    );
                }
            } catch (err) {
                if (!active) return;
                console.error('tuition fetch error:', err);
                const errorMsg = err.response?.data?.error || 'Failed to load tuitions. Please check your connection.';
                setError(errorMsg);
                toast.error(errorMsg);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchTuitions();
        return () => {
            active = false;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(initialFilters), trigger]);

    return { tuitions, pagination, filterOptions, loading, error, refetch };
};

export const useTuition = (tuitionId) => {
    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prevTuitionId, setPrevTuitionId] = useState(null);

    if (tuitionId !== prevTuitionId) {
        setPrevTuitionId(tuitionId);
        if (!tuitionId) {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!tuitionId) return;

        const fetchTuition = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await tuitionService.getById(tuitionId);
                setTuition(data);
            } catch (err) {
                const errorMsg = err.response?.data?.error || 'Tuition not found';
                setError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchTuition();
    }, [tuitionId]);

    return { tuition, loading, error };
};

export default useTuitions;
