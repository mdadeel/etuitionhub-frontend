import { Search, SlidersHorizontal, X, LayoutGrid, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FilterSelect from "../shared/FilterSelect";

/**
 * FilterBar Component
 * Refactored to "Technical Emerald Minimalism"
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
        <div className="flex flex-col gap-8 mb-16 p-8 bg-muted/20 border border-border rounded-none relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)', backgroundSize: '16px 16px' }}>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6">
                {/* Search Input Container */}
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="text"
                        placeholder="Search by subject, class, or location…"
                        className="h-14 pl-12 rounded-none border-border bg-background font-bold focus-visible:ring-primary text-sm tracking-normal text-foreground"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                {/* Sort Strategy */}
                <div className="w-full md:w-64">
                    <FilterSelect
                        value={filters.sortBy}
                        onValueChange={(value) => onFilterChange('sortBy', value)}
                        icon={SlidersHorizontal}
                        placeholder="Sort by"
                        options={[
                            { value: 'newest', label: 'Newest' },
                            { value: 'oldest', label: 'Oldest' },
                            { value: 'salary-high', label: 'Fee: High to Low' },
                            { value: 'salary-low', label: 'Fee: Low to High' },
                        ]}
                    />
                </div>
            </div>

            {/* Parameter Clusters */}
            <div className="relative z-10 flex flex-wrap items-center gap-10 pt-8 border-t border-border">
                {/* Class filter */}
                <div className="flex items-center gap-4">
                    <FilterSelect
                        label="Class"
                        value={filters.classFilter}
                        onValueChange={(value) => onFilterChange('classFilter', value)}
                        icon={LayoutGrid}
                        placeholder="All Classes"
                        options={['all', ...classOptions]}
                    />
                </div>

                {/* Location filter */}
                <div className="flex items-center gap-4">
                    <FilterSelect
                        label="Location"
                        value={filters.locationFilter}
                        onValueChange={(value) => onFilterChange('locationFilter', value)}
                        icon={MapPin}
                        placeholder="All Locations"
                        options={['all', ...locationOptions.filter(loc => !!loc)]}
                    />
                </div>

                {/* Clear filters */}
                {showClearButton && (
                    <Button
                        variant="ghost"
                        className="ml-auto h-auto p-0 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
                        onClick={onClear}
                    >
                        <X size={14} />
                        Reset Filters
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
