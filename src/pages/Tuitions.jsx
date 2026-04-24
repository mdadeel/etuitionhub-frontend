import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTuitions } from '../hooks/useTuitions';
import { useTuitionFilters } from '../hooks/useTuitionFilters';
import TuitionCard from '../components/shared/TuitionCard';
import Pagination from '../components/shared/Pagination';
import { TuitionGridSkeleton } from '../components/Tuitions/TuitionSkeleton';
import EmptyState from '../components/shared/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { SlidersHorizontal, Filter, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AppleBadge, AppleCard, AppleButton, AppleHeader } from '../components/shared/AppleUI/index'
import { motion, AnimatePresence } from 'framer-motion';

const Tuitions = () => {
    const { userRole } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const [page, setPage] = useState( page => 1);

    const {
        filters,
        updateFilter,
        clearFilters
    } = useTuitionFilters(searchQuery);

    useEffect(() => {
        setPage(1);
    }, [filters.search, filters.classFilter, filters.locationFilter, filters.sortBy]);

    const { tuitions, pagination, filterOptions, loading, error } = useTuitions({
        ...filters,
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
        <div className="min-h-screen flex items-center justify-center bg-background">
            <TuitionGridSkeleton />
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="w-full px-6 md:px-12 py-18">

                <AppleHeader
                    title="Available Tuition Jobs"
                    subtitle="Find the perfect teaching opportunity that matches your skills and location."
                    action={
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-2xl border border-border/50">
                                <span className="text-xl font-bold text-foreground tabular-nums">{pagination?.totalItems || 0}</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Jobs</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-2xl border border-border/50">
                                <span className="text-xl font-bold text-foreground tabular-nums">{totalPages}</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pages</span>
                            </div>
                        </div>
                    }
                />

                <div className="flex flex-col md:grid md:grid-cols-12 gap-10">
                    <aside className="md:col-span-3 space-y-6">
                        <AppleCard className="p-6 sticky top-24" hover={false}>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Filter size={14} /> Filters
                            </h3>

                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Sort by</label>
                                <Select value={filters.sortBy} onValueChange={(val) => updateFilter('sortBy', val)}>
                                    <SelectTrigger className="h-10 bg-muted/50 border-border/50 rounded-xl px-4 text-xs font-medium focus:ring-primary/20">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal size={12} className="text-muted-foreground" />
                                            <SelectValue placeholder="Sort" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border shadow-2xl p-1 bg-card/95 backdrop-blur-xl">
                                        <SelectItem value="newest" className="rounded-xl text-xs font-medium py-2 px-3">Latest First</SelectItem>
                                        <SelectItem value="oldest" className="rounded-xl text-xs font-medium py-2 px-3">Oldest First</SelectItem>
                                        <SelectItem value="salary-high" className="rounded-xl text-xs font-medium py-2 px-3">Salary: High to Low</SelectItem>
                                        <SelectItem value="salary-low" className="rounded-xl text-xs font-medium py-2 px-3">Salary: Low to High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Class</label>
                                <Select value={filters.classFilter || 'all'} onValueChange={(val) => updateFilter('classFilter', val === 'all' ? '' : val)}>
                                    <SelectTrigger className="h-10 bg-muted/50 border-border/50 rounded-xl px-4 text-xs font-medium focus:ring-primary/20">
                                        <SelectValue placeholder="All Classes" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border shadow-2xl p-1 bg-card/95 backdrop-blur-xl">
                                        <SelectItem value="all" className="rounded-xl text-xs font-medium py-2 px-3">All Classes</SelectItem>
                                        {filterOptions?.classes?.map(cls => (
                                            <SelectItem key={cls} value={cls} className="rounded-xl text-xs font-medium py-2 px-3">Class {cls}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Location</label>
                                <Select value={filters.locationFilter || 'all'} onValueChange={(val) => updateFilter('locationFilter', val === 'all' ? '' : val)}>
                                    <SelectTrigger className="h-10 bg-muted/50 border-border/50 rounded-xl px-4 text-xs font-medium focus:ring-primary/20">
                                        <SelectValue placeholder="All Locations" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border shadow-2xl p-1 bg-card/95 backdrop-blur-xl max-h-[300px]">
                                        <SelectItem value="all" className="rounded-xl text-xs font-medium py-2 px-3">All Locations</SelectItem>
                                        {filterOptions?.locations?.map(loc => loc && (
                                            <SelectItem key={loc} value={loc} className="rounded-xl text-xs font-medium py-2 px-3">{loc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {(searchQuery || filters.classFilter || filters.locationFilter || filters.sortBy !== 'newest') && (
                                <AppleButton
                                    onClick={handleClearAll}
                                    variant="ghost"
                                    className="w-full mt-2 text-[10px] font-bold uppercase tracking-widest border border-border/50 hover:bg-muted/50 rounded-xl"
                                >
                                    <X size={12} className="mr-2" /> Clear Filters
                                </AppleButton>
                            )}
                        </AppleCard>
                    </aside>

                    <main className="md:col-span-9">
                        {searchQuery && (
                            <div className="mb-8 flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Searching for:</span>
                                <AppleBadge variant="primary" className="px-3 py-1 normal-case text-sm tracking-normal">"{searchQuery}"</AppleBadge>
                            </div>
                        )}

                        {error ? (
                            <div className="py-32 text-center">
                                <h3 className="text-xl font-bold text-destructive mb-2">Error</h3>
                                <p className="text-muted-foreground text-sm max-w-md mx-auto">{error}</p>
                            </div>
                        ) : tuitions.length === 0 ? (
                            <div className="py-32">
                                <EmptyState
                                    title="No Jobs Detected"
                                    message="We couldn't locate any academic requirements matching your current filtering parameters."
                                    onAction={handleClearAll}
                                    actionLabel="Reset Parameters"
                                />
                            </div>
                        ) : (
                            <div className="space-y-12">
                                <motion.div 
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {tuitions.map((tuition) => (
                                        <motion.div key={tuition._id} variants={itemVariants}>
                                            <TuitionCard tuition={tuition} />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {totalPages > 1 && (
                                    <div className="pt-10 border-t border-border/50">
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

