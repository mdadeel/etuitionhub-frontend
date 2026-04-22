import { useState, useEffect, useCallback } from 'react';
import { tuitionService } from '../services/tuitionService';
import toast from 'react-hot-toast';

export const useTuitions = (initialFilters = {}) => {
    const [tuitions, setTuitions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [filterOptions, setFilterOptions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTuitions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await tuitionService.getAll(initialFilters);
            if (data.data) {
                setTuitions(data.data);
                setPagination(data.pagination);
                setFilterOptions(data.filterOptions);
            } else {
                setTuitions(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('tuition fetch error:', err);
            const errorMsg = err.response?.data?.error || 'Failed to load tuitions. Please check your connection.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(initialFilters)]);

    useEffect(() => { 
        fetchTuitions();
    }, [fetchTuitions]);

    return { tuitions, pagination, filterOptions, loading, error, refetch: fetchTuitions };
};

export const useTuition = (tuitionId) => {
    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tuitionId) {
            setLoading(false);
            return;
        }

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
