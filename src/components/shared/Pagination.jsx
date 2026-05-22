import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
    className
}) => {
    const _hasNext = hasNext !== undefined ? hasNext : currentPage < totalPages;
    const _hasPrev = hasPrev !== undefined ? hasPrev : currentPage > 1;
    const _onNext = onNext || (() => onPageChange(currentPage + 1));
    const _onPrev = onPrev || (() => onPageChange(currentPage - 1));

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

    if (totalPages <= 1) return null;

    return (
        <div className={cn("flex items-center justify-center gap-2 mt-8", className)}>
            <button
                onClick={_onPrev}
                disabled={!_hasPrev}
                className={cn(
                    "p-2 rounded-md border border-border transition-colors",
                    _hasPrev
                        ? "hover:bg-background text-muted-foreground"
                        : "text-slate-300 cursor-not-allowed bg-background"
                )}
            >
                <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-2 text-sm text-slate-400">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    "min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors",
                                    currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <button
                onClick={_onNext}
                disabled={!_hasNext}
                className={cn(
                    "p-2 rounded-md border border-border transition-colors",
                    _hasNext
                        ? "hover:bg-background text-muted-foreground"
                        : "text-slate-300 cursor-not-allowed bg-background"
                )}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;