import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="text"
                        placeholder="SEARCH_BY_SUBJECT_OR_COORDINATES..."
                        className="h-14 pl-12 rounded-none border-border bg-background font-bold focus-visible:ring-primary uppercase text-[11px] tracking-widest"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                {/* Sort Strategy */}
                <div className="w-full md:w-64">
                    <Select 
                        value={filters.sortBy} 
                        onValueChange={(value) => onFilterChange('sortBy', value)}
                    >
                        <SelectTrigger className="h-14 rounded-none border-border bg-background font-black text-[10px] tracking-widest uppercase focus:ring-primary">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={14} className="text-primary" />
                                <SelectValue placeholder="SORT_STRATEGY" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border">
                            <SelectItem value="newest" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">Latest Operations</SelectItem>
                            <SelectItem value="oldest" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">Historical Order</SelectItem>
                            <SelectItem value="salary-high" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">Yield: High-Low</SelectItem>
                            <SelectItem value="salary-low" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">Yield: Low-High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Parameter Clusters */}
            <div className="relative z-10 flex flex-wrap items-center gap-10 pt-8 border-t border-border">
                {/* Class Protocol Cluster */}
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Class Node</span>
                    <Select 
                        value={filters.classFilter} 
                        onValueChange={(value) => onFilterChange('classFilter', value)}
                    >
                        <SelectTrigger className="w-48 h-10 border-none bg-transparent hover:bg-muted/50 font-black text-[10px] tracking-widest uppercase focus:ring-0 p-0 shadow-none">
                            <SelectValue placeholder="ALL_PROTOCOLS" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border">
                            <SelectItem value="all" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">All Protocols</SelectItem>
                            {classOptions.map(cls => (
                                <SelectItem key={cls} value={cls} className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">{cls}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Spatial Area Cluster */}
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Spatial Area</span>
                    <Select 
                        value={filters.locationFilter} 
                        onValueChange={(value) => onFilterChange('locationFilter', value)}
                    >
                        <SelectTrigger className="w-48 h-10 border-none bg-transparent hover:bg-muted/50 font-black text-[10px] tracking-widest uppercase focus:ring-0 p-0 shadow-none">
                            <SelectValue placeholder="ALL_ZONES" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border">
                            <SelectItem value="all" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">All Zones</SelectItem>
                            {locationOptions.map(loc => (loc && (
                                <SelectItem key={loc} value={loc} className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">{loc}</SelectItem>
                            )))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Clear Matrix Signal */}
                {showClearButton && (
                    <Button
                        variant="ghost"
                        className="ml-auto h-auto p-0 flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-destructive transition-colors uppercase tracking-[0.3em]"
                        onClick={onClear}
                    >
                        <X size={14} />
                        Reset Matrix
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
