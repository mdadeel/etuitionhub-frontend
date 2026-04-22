import { useState, useCallback } from 'react';

export const useTuitionFilters = (initialSearchQuery = '') => {
    const [filters, setFilters] = useState({
        search: initialSearchQuery,
        classFilter: '',
        locationFilter: '',
        sortBy: 'newest'
    });

    const updateFilter = useCallback((key, val) => {
        setFilters(prev => ({ ...prev, [key]: val }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ search: '', classFilter: '', locationFilter: '', sortBy: 'newest' });
    }, []);

    const hasActiveFilters = Boolean(
        filters.search || filters.classFilter || filters.locationFilter || filters.sortBy !== 'newest'
    );

    return {
        filters, 
        updateFilter, 
        clearFilters,
        hasActiveFilters
    };
};
