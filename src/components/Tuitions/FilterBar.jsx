/**
 * FilterBar Component
 * 
 * Extracted filter controls - reusable across different list pages
 */

const FilterBar = ({
    filters,
    onFilterChange,
    onClear,
    classOptions = [],
    locationOptions = [],
    showClearButton = true
}) => {
    return (
        <div className="flex flex-col gap-6 mb-12 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
            {/* Search and Sort Row */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-teal-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by subject, location, or requirement..."
                        className="input-quiet h-14 pl-12 bg-[var(--color-surface-muted)] border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-teal-600 focus:ring-1 focus:ring-teal-600/10"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <select
                        className="input-quiet h-14 w-full md:w-56 appearance-none bg-[var(--color-surface-muted)] border-[var(--color-border)] text-[var(--color-text-primary)] cursor-pointer pr-10 focus:border-teal-600"
                        value={filters.sortBy}
                        onChange={(e) => onFilterChange('sortBy', e.target.value)}
                    >
                        <option value="newest">Latest Operations</option>
                        <option value="oldest">Historical Order</option>
                        <option value="salary-high">Yield: High to Low</option>
                        <option value="salary-low">Yield: Low to High</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Advanced Filters Row */}
            <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-[var(--color-border-muted)]">
                {/* Class Filter */}
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Class Node</span>
                    <select
                        className="bg-transparent text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] focus:border-teal-600 outline-none transition-colors cursor-pointer py-1"
                        value={filters.classFilter}
                        onChange={(e) => onFilterChange('classFilter', e.target.value)}
                    >
                        <option value="">All Protocols</option>
                        {classOptions.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>

                {/* Location Filter */}
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Spatial Area</span>
                    <select
                        className="bg-transparent text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] focus:border-teal-600 outline-none transition-colors cursor-pointer py-1"
                        value={filters.locationFilter}
                        onChange={(e) => onFilterChange('locationFilter', e.target.value)}
                    >
                        <option value="">All Zones</option>
                        {locationOptions.map(loc => (loc && (
                            <option key={loc} value={loc}>{loc}</option>
                        )))}
                    </select>
                </div>

                {/* Clear Button */}
                {showClearButton && (
                    <button
                        className="ml-auto flex items-center gap-2 text-[10px] font-black text-[var(--color-text-muted)] hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                        onClick={onClear}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset Matrix
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
