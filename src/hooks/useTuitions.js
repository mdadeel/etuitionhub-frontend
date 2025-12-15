/**
 * useTuitions Hook - Enhanced version with filters
 * 
 * Separates data fetching and filtering logic from components
 * Components become "dumb" - just render data
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { tuitionService } from '../services/tuitionService';
import toast from 'react-hot-toast';

/**
 * Main hook for fetching tuitions
 */
export const useTuitions = (initialFilters = {}) => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTuitions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await tuitionService.getAll(initialFilters);
            setTuitions(data);
        } catch (err) {
            console.error('Failed to fetch tuitions:', err);
            setError(err.response?.data?.error || 'Failed to load tuitions');
            toast.error('Failed to load tuitions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTuitions();
    }, [fetchTuitions]);

    return { tuitions, loading, error, refetch: fetchTuitions };
};

/**
 * Filter hook - handles all filtering/sorting logic
 * Keeps this complex logic out of the component
 */
export const useTuitionFilters = (tuitions) => {
    // Consolidated filter state - professional pattern
    const [filters, setFilters] = useState({
        search: '',
        classFilter: '',
        locationFilter: '',
        sortBy: 'newest'
    });

    // Update single filter value
    const updateFilter = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            classFilter: '',
            locationFilter: '',
            sortBy: 'newest'
        });
    }, []);

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return filters.search || filters.classFilter || filters.locationFilter || filters.sortBy !== 'newest';
    }, [filters]);

    // Filtered and sorted tuitions - memoized for performance
    const filteredTuitions = useMemo(() => {
        // Only show approved tuitions to public
        let result = tuitions.filter(t => t.status === 'approved');

        // Search filter
        if (filters.search) {
            const query = filters.search.toLowerCase();
            result = result.filter(t =>
                t.subject.toLowerCase().includes(query) ||
                t.location.toLowerCase().includes(query)
            );
        }

        // Class filter
        if (filters.classFilter) {
            result = result.filter(t => t.class_name === filters.classFilter);
        }

        // Location filter
        if (filters.locationFilter) {
            result = result.filter(t =>
                t.location.toLowerCase().includes(filters.locationFilter.toLowerCase())
            );
        }

        // Sorting
        switch (filters.sortBy) {
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'salary-high':
                result.sort((a, b) => b.salary - a.salary);
                break;
            case 'salary-low':
                result.sort((a, b) => a.salary - b.salary);
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return result;
    }, [tuitions, filters]);

    // Extract unique values for filter dropdowns
    const filterOptions = useMemo(() => ({
        classes: [...new Set(tuitions.map(t => t.class_name).filter(Boolean))],
        locations: [...new Set(tuitions.map(t => t.location).filter(Boolean))]
    }), [tuitions]);

    return {
        filters,
        updateFilter,
        clearFilters,
        hasActiveFilters,
        filteredTuitions,
        filterOptions
    };
};

/**
 * Pagination hook - reusable across components
 */
export const usePagination = (items, itemsPerPage = 6) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 when items change
    useEffect(() => {
        setCurrentPage(1);
    }, [items.length]);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = useCallback((page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    return {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
};

/**
 * Single tuition hook
 */
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
                const data = await tuitionService.getById(tuitionId);
                setTuition(data);
            } catch (err) {
                setError(err.response?.data?.error || 'Tuition not found');
            } finally {
                setLoading(false);
            }
        };

        fetchTuition();
    }, [tuitionId]);

    return { tuition, loading, error };
};

export default useTuitions;
