import React from 'react';
import { AppleButton } from './AppleUI';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Unified Pagination component with Apple Design System.
 * Supports both step-based (next/prev) and direct page navigation.
 */
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
    // Derived states if explicit ones aren't provided
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
        <div className={cn("flex items-center justify-center gap-3 mt-12 pb-8", className)}>
            <AppleButton
                variant="outline"
                size="sm"
                onClick={_onPrev}
                disabled={!_hasPrev}
                className="h-9 w-9 p-0 rounded-xl bg-background/50 border-border/40 hover:bg-background/80"
            >
                <ChevronLeft size={16} />
            </AppleButton>
            
            <div className="flex items-center gap-1.5 bg-muted/20 p-1.5 rounded-2xl border border-border/30 backdrop-blur-sm">
                {pageNumbers.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-3 text-xs font-bold text-muted-foreground/30 tracking-widest">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    "min-w-[36px] h-8 px-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                                    currentPage === page
                                        ? "bg-primary text-primary-foreground shadow-apple-sm scale-105"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                                )}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>
            
            <AppleButton
                variant="outline"
                size="sm"
                onClick={_onNext}
                disabled={!_hasNext}
                className="h-9 w-9 p-0 rounded-xl bg-background/50 border-border/40 hover:bg-background/80"
            >
                <ChevronRight size={16} />
            </AppleButton>
        </div>
    );
};

export default Pagination;
