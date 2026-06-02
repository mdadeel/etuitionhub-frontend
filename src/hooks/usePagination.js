import { useState, useEffect, useCallback } from 'react';

export function usePagination(items, perPage = 6) {
    const [page, setPage] = useState(1);
    const [prevItemsLength, setPrevItemsLength] = useState(items.length);

    // reset page when items change
    if (items.length !== prevItemsLength) {
        setPrevItemsLength(items.length);
        setPage(1);
    }

    const totalPages = Math.ceil(items.length / perPage);
    const start = (page - 1) * perPage;
    const paginatedItems = items.slice(start, start + perPage);

    const goToPage = useCallback((p) => {
        setPage(Math.max(1, Math.min(p, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => {
        setPage(p => Math.min(p + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setPage(p => Math.max(p - 1, 1));
    }, []);

    return {
        currentPage: page,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
}
