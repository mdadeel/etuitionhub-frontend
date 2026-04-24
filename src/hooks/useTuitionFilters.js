import { useState, useCallback, useEffect } from 'react';

export const useTuitionFilters = (initialSearchQuery = '') => {
    const [filters, setFilters] = useState({
        search: initialSearchQuery,
        classFilter: '',
        locationFilter: '',
        subjects: [],
        sortBy: 'newest'
    });

    // Update search filter when URL query changes
    useEffect(() => {
        setFilters(prev => ({ ...prev, search: initialSearchQuery }));
    }, [initialSearchQuery]);

    const updateFilter = useCallback((key, val) => {
        setFilters(prev => ({ ...prev, [key]: val }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ search: '', classFilter: '', locationFilter: '', subjects: [], sortBy: 'newest' });
    }, []);

    const hasActiveFilters = Boolean(
        filters.search || filters.classFilter || filters.locationFilter || filters.subjects.length > 0 || filters.sortBy !== 'newest'
    );

    return {
        filters, 
        updateFilter, 
        clearFilters,
        hasActiveFilters
    };
};
