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
                pages.push('...-end');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...-start');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...-start');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...-end');
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
                type="button"
                onClick={_onPrev}
                disabled={!_hasPrev}
                className={cn(
                    "p-2 rounded-xl border border-border transition-all duration-300",
                    _hasPrev
                        ? "hover:bg-muted text-foreground hover:border-primary/30 active:scale-90 shadow-sm"
                        : "text-muted-foreground/30 cursor-not-allowed bg-background border-border/40"
                )}
            >
                <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
                {pageNumbers.map((page) => (
                    <React.Fragment key={`page-${page}`}>
                        {String(page).startsWith('...') ? (
                            <span className="px-2 text-sm font-bold text-muted-foreground/50 tracking-widest">...</span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    "min-w-[36px] h-9 px-3 rounded-xl text-sm font-bold transition-all duration-300 active:scale-90",
                                    currentPage === page
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border"
                                )}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <button
                type="button"
                onClick={_onNext}
                disabled={!_hasNext}
                className={cn(
                    "p-2 rounded-xl border border-border transition-all duration-300",
                    _hasNext
                        ? "hover:bg-muted text-foreground hover:border-primary/30 active:scale-90 shadow-sm"
                        : "text-muted-foreground/30 cursor-not-allowed bg-background border-border/40"
                )}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;