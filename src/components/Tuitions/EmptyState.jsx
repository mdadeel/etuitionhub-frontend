import React from 'react';

const EmptyState = ({ onReset }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="mb-8">
                <svg 
                    className="w-24 h-24 mx-auto text-[var(--color-text-muted)]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                No Tuitions Found
            </h3>
            
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md">
                We couldn't find any tuitions matching your current filters. Try adjusting your search criteria.
            </p>
            
            <button
                onClick={onReset}
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
                Reset Filters
            </button>
        </div>
    );
};

export default EmptyState;