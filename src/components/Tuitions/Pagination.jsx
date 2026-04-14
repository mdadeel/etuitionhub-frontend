import React from 'react';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    onNext, 
    onPrev, 
    hasNext, 
    hasPrev 
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center space-x-2 mt-12">
            <button
                onClick={onPrev}
                disabled={!hasPrev}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    hasPrev
                        ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] cursor-pointer'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
                Previous
            </button>
            
            {pageNumbers.map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="px-3 py-2 text-sm font-medium text-gray-500">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                currentPage === page
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'hover:bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]'
                            }`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}
            
            <button
                onClick={onNext}
                disabled={!hasNext}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    hasNext
                        ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] cursor-pointer'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;