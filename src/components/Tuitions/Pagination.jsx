import React from 'react';
import { AppleButton } from '../shared/AppleUI';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-3 mt-16 pb-12">
            <AppleButton
                variant="outline"
                size="sm"
                onClick={onPrev}
                disabled={!hasPrev}
                className="h-10 w-10 p-0 rounded-xl"
            >
                <ChevronLeft size={16} />
            </AppleButton>
            
            <div className="flex items-center gap-1.5 bg-muted/30 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm">
                {pageNumbers.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-3 text-xs font-bold text-muted-foreground/50 tracking-widest">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    "min-w-[40px] h-9 px-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                                    currentPage === page
                                        ? "bg-primary text-primary-foreground shadow-apple-sm scale-105"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
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
                onClick={onNext}
                disabled={!hasNext}
                className="h-10 w-10 p-0 rounded-xl"
            >
                <ChevronRight size={16} />
            </AppleButton>
        </div>
    );
};

export default Pagination;