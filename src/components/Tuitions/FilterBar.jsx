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
        <div className="flex flex-col gap-6 mb-12">
            {/* Search and Sort Row */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search by subject, location, or requirement..."
                        className="input-quiet h-12 pl-4"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                {/* Sort Dropdown */}
                <select
                    className="input-quiet h-12 w-full md:w-48 appearance-none bg-white cursor-pointer"
                    value={filters.sortBy}
                    onChange={(e) => onFilterChange('sortBy', e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                </select>
            </div>

            {/* Advanced Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Class Filter */}
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Class</span>
                    <select
                        className="p-1 border-b border-gray-200 text-sm font-medium focus:border-indigo-600 outline-none transition-colors bg-transparent cursor-pointer"
                        value={filters.classFilter}
                        onChange={(e) => onFilterChange('classFilter', e.target.value)}
                    >
                        <option value="">All Levels</option>
                        {classOptions.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>

                {/* Location Filter */}
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Area</span>
                    <select
                        className="p-1 border-b border-gray-200 text-sm font-medium focus:border-teal-600 outline-none transition-colors bg-transparent cursor-pointer"
                        value={filters.locationFilter}
                        onChange={(e) => onFilterChange('locationFilter', e.target.value)}
                    >
                        <option value="">All Locations</option>
                        {locationOptions.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Clear Button */}
                {showClearButton && (
                    <button
                        className="ml-auto text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                        onClick={onClear}
                    >
                        Reset Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
