import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTuitions } from '../hooks/useTuitions';
import { useTuitionFilters } from '../hooks/useTuitionFilters';
import TuitionCard from '../components/Tuitions/TuitionCard';
import Pagination from '../components/Tuitions/Pagination';
import { TuitionGridSkeleton } from '../components/Tuitions/TuitionSkeleton';
import EmptyState from '../components/Tuitions/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, UserCheck, ShieldCheck, Filter, X, Grid3X3 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/**
 * Tuitions Page
 * Refactored to "Apple macOS Sidebar Layout"
 * Consistent with Tutors page: Left sidebar filters, search integration with Nav, compact grid.
 */
const Tuitions = () => {
    const { userRole } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    
    const [page, setPage] = useState(1);
    
    const {
        filters,
        updateFilter,
        clearFilters
    } = useTuitionFilters(searchQuery);

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [filters, searchQuery]);

    const { tuitions, pagination, filterOptions, loading, error } = useTuitions({
        ...filters,
        search: searchQuery,
        page,
        limit: 8,
        status: 'approved'
    });

    const currentPage = pagination?.currentPage || 1;
    const totalPages = pagination?.totalPages || 1;
    const hasNextPage = pagination?.hasNextPage || false;
    const hasPrevPage = pagination?.hasPrevPage || false;

    const goToPage = (p) => setPage(p);
    const nextPage = () => setPage(p => Math.min(totalPages, p + 1));
    const prevPage = () => setPage(p => Math.max(1, p - 1));

    const handleClearAll = () => {
        setSearchParams({});
        clearFilters();
        setPage(1);
    };

    if (loading && tuitions.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-apple-gray-100 dark:bg-apple-gray-900">
            <TuitionGridSkeleton />
        </div>
    );

    return (
        <div className="bg-apple-gray-100 dark:bg-apple-gray-950 min-h-screen">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header (Apple Style) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-apple-blue">Requirement Stream</span>
                            {userRole === 'admin' && (
                                <Badge className="bg-apple-gray-800 text-white hover:bg-apple-gray-800 rounded-md text-[9px] px-2 py-0.5 font-bold tracking-tight">
                                    ADMIN ACCESS
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-apple-gray-900 dark:text-white tracking-tight">
                            Tuition Directory
                        </h1>
                        <p className="text-[13px] text-apple-gray-500 font-medium mt-1">
                            Access our high-precision stream of academic requirements.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-apple-gray-900 rounded-lg border border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-sm">
                            <span className="text-lg font-bold text-apple-gray-900 dark:text-white tabular-nums">{pagination?.totalItems || 0}</span>
                            <span className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-tight">Nodes</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-apple-gray-900 rounded-lg border border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-sm">
                            <span className="text-lg font-bold text-apple-gray-900 dark:text-white tabular-nums">{totalPages}</span>
                            <span className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-tight">Pages</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar Filters (macOS Style) */}
                    <aside className="md:col-span-3 lg:col-span-2 space-y-6">
                        <div className="apple-card p-4 bg-white/50 dark:bg-apple-gray-900/50 backdrop-blur-sm">
                            <h3 className="text-[11px] font-bold text-apple-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Filter size={12} /> Parameters
                            </h3>
                            
                            {/* Sort Filter */}
                            <div className="mb-6">
                                <label className="text-[10px] font-bold text-apple-gray-500 uppercase mb-2 block">Sort Strategy</label>
                                <Select value={filters.sortBy} onValueChange={(val) => updateFilter('sortBy', val)}>
                                    <SelectTrigger className="mac-input h-8 border-none bg-white dark:bg-apple-gray-800 shadow-apple-sm">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <SlidersHorizontal size={10} className="text-apple-gray-400 shrink-0" />
                                            <SelectValue placeholder="Sort" className="text-xs" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-lg p-1">
                                        <SelectItem value="newest" className="rounded-md text-[11px] font-medium py-1.5">Latest</SelectItem>
                                        <SelectItem value="oldest" className="rounded-md text-[11px] font-medium py-1.5">Oldest</SelectItem>
                                        <SelectItem value="salary-high" className="rounded-md text-[11px] font-medium py-1.5">Yield: High</SelectItem>
                                        <SelectItem value="salary-low" className="rounded-md text-[11px] font-medium py-1.5">Yield: Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Class Filter */}
                            <div className="mb-6">
                                <label className="text-[10px] font-bold text-apple-gray-500 uppercase mb-2 block">Node Class</label>
                                <Select value={filters.classFilter || 'all'} onValueChange={(val) => updateFilter('classFilter', val === 'all' ? '' : val)}>
                                    <SelectTrigger className="mac-input h-8 border-none bg-white dark:bg-apple-gray-800 shadow-apple-sm">
                                        <SelectValue placeholder="All Classes" className="text-xs" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-lg p-1">
                                        <SelectItem value="all" className="rounded-md text-[11px] font-medium py-1.5">All Protocols</SelectItem>
                                        {filterOptions?.classes?.map(cls => (
                                            <SelectItem key={cls} value={cls} className="rounded-md text-[11px] font-medium py-1.5">Class {cls}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Spatial Area (Location) Filter */}
                            <div className="mb-6">
                                <label className="text-[10px] font-bold text-apple-gray-500 uppercase mb-2 block">Spatial Area</label>
                                <Select value={filters.locationFilter || 'all'} onValueChange={(val) => updateFilter('locationFilter', val === 'all' ? '' : val)}>
                                    <SelectTrigger className="mac-input h-8 border-none bg-white dark:bg-apple-gray-800 shadow-apple-sm">
                                        <SelectValue placeholder="All Zones" className="text-xs" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-lg p-1">
                                        <SelectItem value="all" className="rounded-md text-[11px] font-medium py-1.5">All Zones</SelectItem>
                                        {filterOptions?.locations?.map(loc => (loc && (
                                            <SelectItem key={loc} value={loc} className="rounded-md text-[11px] font-medium py-1.5">{loc}</SelectItem>
                                        )))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear All */}
                            {(searchQuery || filters.classFilter || filters.locationFilter || filters.sortBy !== 'newest') && (
                                <button
                                    onClick={handleClearAll}
                                    className="w-full mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-apple-blue hover:text-apple-blue/80 py-2 border border-apple-blue/20 rounded-lg hover:bg-apple-blue/5 transition-all uppercase tracking-tight"
                                >
                                    <X size={10} /> Reset Matrix
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Main Content (Cols-9) */}
                    <main className="md:col-span-9 lg:col-span-10">
                        {searchQuery && (
                            <div className="mb-6 flex items-center gap-2">
                                <span className="text-[11px] font-bold text-apple-gray-400 uppercase tracking-tight">Active Query:</span>
                                <span className="px-2 py-0.5 bg-apple-blue/10 text-apple-blue text-[11px] font-bold rounded-md">"{searchQuery}"</span>
                            </div>
                        )}

                        {loading ? (
                            <TuitionGridSkeleton />
                        ) : error ? (
                            <div className="py-20 text-center bg-white dark:bg-apple-gray-900 rounded-container border border-dashed border-red-200 dark:border-red-800/30">
                                <h3 className="text-xl font-bold text-red-500 mb-2">Failed to Load Tuitions</h3>
                                <p className="text-apple-gray-500 text-sm max-w-md mx-auto">{error}</p>
                            </div>
                        ) : tuitions.length === 0 ? (
                            <div className="py-20 bg-white dark:bg-apple-gray-900 rounded-container border border-dashed border-apple-gray-200 dark:border-apple-gray-800">
                                <EmptyState onReset={handleClearAll} />
                            </div>
                        ) : (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                                    {tuitions.map(tuition => (
                                        <div key={tuition._id} className="transform hover:scale-[1.01] transition-all duration-300">
                                            <TuitionCard tuition={tuition} />
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="pt-8 border-t border-apple-gray-200 dark:border-apple-gray-800">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={goToPage}
                                            onNext={nextPage}
                                            onPrev={prevPage}
                                            hasNext={hasNextPage}
                                            hasPrev={hasPrevPage}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Tuitions;
