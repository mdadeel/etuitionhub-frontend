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
        <div className="space-y-4 mb-6">
            {/* Search and Sort Row */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="🔍 Search by subject or location..."
                        className="input input-bordered w-full"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                {/* Sort Dropdown */}
                <select
                    className="select select-bordered w-full md:w-auto"
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
            <div className="flex flex-col md:flex-row gap-4">
                {/* Class Filter */}
                <select
                    className="select select-bordered w-full md:w-auto"
                    value={filters.classFilter}
                    onChange={(e) => onFilterChange('classFilter', e.target.value)}
                >
                    <option value="">All Classes</option>
                    {classOptions.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                    ))}
                </select>

                {/* Location Filter */}
                <select
                    className="select select-bordered w-full md:w-auto"
                    value={filters.locationFilter}
                    onChange={(e) => onFilterChange('locationFilter', e.target.value)}
                >
                    <option value="">All Locations</option>
                    {locationOptions.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>

                {/* Clear Button */}
                {showClearButton && (
                    <button className="btn btn-ghost" onClick={onClear}>
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
