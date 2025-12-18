// tuition related hooks - data fetch and filter
// refactored from Tuitions.jsx - was getting too long
import { useState, useEffect, useMemo, useCallback } from 'react';
import { tuitionService } from '../services/tuitionService';
import toast from 'react-hot-toast';

// main hook - tuitions fetch kore
export const useTuitions = (initialFilters = {}) => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTuitions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // const data = await fetch('/api/tuitions').then(r => r.json()) // old way
            const data = await tuitionService.getAll(initialFilters);
            // console.log('tuitions fetched:', data.length)
            setTuitions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log('tuition fetch error:', err)
            setError(err.response?.data?.error || 'Failed to load tuitions');
            toast.error('tuitions load holo na');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTuitions() }, [fetchTuitions]);

    return { tuitions, loading, error, refetch: fetchTuitions };
};

// filter hook - filtering logic alada rakhlam
export const useTuitionFilters = (tuitions) => {
    var [filters, setFilters] = useState({
        search: '',
        classFilter: '',
        locationFilter: '',
        sortBy: 'newest'
    });

    // update ekta filter
    const updateFilter = useCallback((key, val) => {
        setFilters(prev => ({ ...prev, [key]: val }))
    }, []);

    // clear all 
    const clearFilters = useCallback(() => {
        setFilters({ search: '', classFilter: '', locationFilter: '', sortBy: 'newest' })
    }, []);

    // check active filters ache kina
    const hasActiveFilters = useMemo(() => {
        return filters.search || filters.classFilter || filters.locationFilter || filters.sortBy !== 'newest'
    }, [filters]);

    // filtered tuitions calculate
    const filteredTuitions = useMemo(() => {
        // only approved ones show korbo public e
        let result = tuitions.filter(t => t.status === 'approved');

        // search filter
        if (filters.search) {
            let q = filters.search.toLowerCase()
            result = result.filter(t =>
                t.subject.toLowerCase().includes(q) ||
                t.location.toLowerCase().includes(q)
            )
        }

        // class filter lagao
        if (filters.classFilter) {
            result = result.filter(t => t.class_name === filters.classFilter)
        }

        // location filter
        if (filters.locationFilter) {
            result = result.filter(t =>
                t.location.toLowerCase().includes(filters.locationFilter.toLowerCase())
            )
        }

        // sorting - switch theke if else e convert korlam
        if (filters.sortBy === 'oldest') {
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        } else if (filters.sortBy === 'salary-high') {
            result.sort((a, b) => b.salary - a.salary)
        } else if (filters.sortBy === 'salary-low') {
            result.sort((a, b) => a.salary - b.salary)
        } else {
            // default newest first
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }

        return result
    }, [tuitions, filters]);

    // unique values for filter dropdowns
    let filterOptions = useMemo(() => ({
        classes: [...new Set(tuitions.map(t => t.class_name).filter(Boolean))],
        locations: [...new Set(tuitions.map(t => t.location).filter(Boolean))]
    }), [tuitions]);

    return {
        filters, updateFilter, clearFilters,
        hasActiveFilters,
        filteredTuitions, filterOptions
    };
};

// pagination hook - reusable anywhere
export function usePagination(items, perPage = 6) {
    var [page, setPage] = useState(1)

    // reset page when items change
    useEffect(() => { setPage(1) }, [items.length])

    let totalPages = Math.ceil(items.length / perPage)
    let start = (page - 1) * perPage
    let paginatedItems = items.slice(start, start + perPage)

    const goToPage = useCallback((p) => {
        setPage(Math.max(1, Math.min(p, totalPages)))
    }, [totalPages])

    const nextPage = useCallback(() => {
        setPage(p => Math.min(p + 1, totalPages))
    }, [totalPages])

    const prevPage = useCallback(() => {
        setPage(p => Math.max(p - 1, 1))
    }, [])

    return {
        currentPage: page,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    }
}

// single tuition fetch by id
export const useTuition = (tuitionId) => {
    const [tuition, setTuition] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!tuitionId) {
            setLoading(false)
            return
        }

        // fetch tuition
        const fetchTuition = async () => {
            try {
                setLoading(true)
                const data = await tuitionService.getById(tuitionId)
                setTuition(data)
            } catch (err) {
                setError(err.response?.data?.error || 'Tuition not found')
            } finally {
                setLoading(false)
            }
        }

        fetchTuition()
    }, [tuitionId])

    return { tuition, loading, error }
}

export default useTuitions
