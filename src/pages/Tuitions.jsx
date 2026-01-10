import { useTuitions, useTuitionFilters, usePagination } from '../hooks/useTuitions';
import FilterBar from '../components/Tuitions/FilterBar';
import TuitionCard from '../components/Tuitions/TuitionCard';
import Pagination from '../components/Tuitions/Pagination';
import TuitionSkeleton, { TuitionGridSkeleton } from '../components/Tuitions/TuitionSkeleton';
import EmptyState from '../components/Tuitions/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Tuitions = () => {
    const { userRole } = useAuth();
    const { theme } = useTheme();
    const { tuitions, loading, error, refetch } = useTuitions();
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
    } = usePagination(filteredTuitions, 8); // Updated to 8 for 4-per-row layout

    return (
        <div className="bg-[var(--color-surface)] min-h-screen py-16 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-12 h-[2px] bg-teal-600"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600">Available Projects</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-primary)] leading-[1.1] mb-6">
                            Find Your Ideal <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Tuition Matrix</span>
                        </h1>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                            Access our high-density database of tuition requirements. filter by subject, class node, or spatial location to find your match.
                        </p>
                    </div>
                    {userRole === 'admin' && (
                        <div className="px-4 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg">
                            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Admin View Active</span>
                        </div>
                    )}
                </div>

                <FilterBar
                    filters={filters}
                    onFilterChange={updateFilter}
                    onClear={clearFilters}
                    classOptions={filterOptions.classes}
                    locationOptions={filterOptions.locations}
                />

                {loading ? (
                    <TuitionGridSkeleton />
                ) : filteredTuitions.length === 0 ? (
                    <EmptyState onReset={clearFilters} />
                ) : (
                    <div className="space-y-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedItems.map(tuition => (
                                <TuitionCard key={tuition._id} tuition={tuition} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                                onNext={nextPage}
                                onPrev={prevPage}
                                hasNext={hasNextPage}
                                hasPrev={hasPrev}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tuitions;
