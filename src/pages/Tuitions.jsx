import { useTuitions, useTuitionFilters, usePagination } from '../hooks/useTuitions';
import FilterBar from '../components/Tuitions/FilterBar';
import TuitionCard from '../components/Tuitions/TuitionCard';
import Pagination from '../components/Tuitions/Pagination';
import { TuitionGridSkeleton } from '../components/Tuitions/TuitionSkeleton';
import EmptyState from '../components/Tuitions/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
import { Search, Grid3X3, Database } from 'lucide-react';

/**
 * Tuitions Page
 * Refactored to "Technical Emerald Minimalism"
 * Features: High-density data grid, sharp geometry, technical labels
 */
const Tuitions = () => {
    const { userRole } = useAuth();
    const { tuitions, loading, error } = useTuitions();
    const {
        filters,
        updateFilter,
        clearFilters,
        filteredTuitions,
        filterOptions
    } = useTuitionFilters(tuitions);

    const {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage,
        hasPrevPage
    } = usePagination(filteredTuitions, 8);

    return (
        <div className="bg-background min-h-screen py-20 px-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary">
            {/* Background Technical Grid Element */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 border-b border-border pb-12">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-1 bg-primary"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Requirement Database</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.85] mb-8 uppercase tracking-tighter">
                            Tuition <br />
                            <span className="text-primary italic">Matrix.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                            Access our high-density stream of academic requirements. Filter by subject, node class, or geographic coordinates.
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-4">
                        {userRole === 'admin' && (
                            <Badge variant="outline" className="rounded-none border-primary text-primary text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-primary/5">
                                Admin Protocol Active
                            </Badge>
                        )}
                        <div className="flex items-center gap-6 text-muted-foreground">
                            <div className="text-right">
                                <p className="text-3xl font-black text-foreground tabular-nums">{filteredTuitions.length}</p>
                                <p className="text-[9px] uppercase tracking-[0.2em] font-bold">Active Nodes</p>
                            </div>
                            <div className="w-px h-10 bg-border"></div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-foreground tabular-nums">{totalPages}</p>
                                <p className="text-[9px] uppercase tracking-[0.2em] font-bold">Data Pages</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <Search size={14} className="text-primary" /> 
                        Parameter Filtering
                    </div>
                    <FilterBar
                        filters={filters}
                        onFilterChange={updateFilter}
                        onClear={clearFilters}
                        classOptions={filterOptions.classes}
                        locationOptions={filterOptions.locations}
                    />
                </div>

                {/* Content Section */}
                {loading ? (
                    <TuitionGridSkeleton />
                ) : filteredTuitions.length === 0 ? (
                    <EmptyState onReset={clearFilters} />
                ) : (
                    <div className="space-y-24">
                        <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <Grid3X3 size={14} className="text-primary" /> 
                            Data Stream Output
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedItems.map(tuition => (
                                <TuitionCard key={tuition._id} tuition={tuition} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pt-12 border-t border-border">
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
                
                {/* System Footer Info */}
                <div className="mt-40 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em]">
                        <Database size={12} className="text-primary" />
                        Live Synchronized Database
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em]">
                        Buffer Status: Stable // latency: 24ms
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tuitions;
