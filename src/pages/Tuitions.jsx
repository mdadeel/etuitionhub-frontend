// tuitions page - shows all available tuitions
// filtering and pagination hooks use korsi
import { useTuitions, useTuitionFilters, usePagination } from '../hooks/useTuitions';
import TuitionCard from '../components/Tuitions/TuitionCard';
import FilterBar from '../components/Tuitions/FilterBar';
import Pagination from '../components/shared/Pagination';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import PageHeader from '../components/shared/PageHeader';

const ITEMS_PER_PAGE = 6;

const Tuitions = () => {
    // Data fetching - logic hidden in hook
    const { tuitions, loading, error } = useTuitions();

    // Filtering - all filter logic in hook
    const {
        filters,
        updateFilter,
        clearFilters,
        hasActiveFilters,
        filteredTuitions,
        filterOptions
    } = useTuitionFilters(tuitions || []);

    // Pagination - reusable hook
    const {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage
    } = usePagination(filteredTuitions, ITEMS_PER_PAGE);

    // Loading state
    if (loading) {
        return <LoadingSpinner />;
    }

    // Error state - show message instead of blank page
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <PageHeader title="Available Tuitions" subtitle="Find tuition jobs" />
                <div className="text-center py-12">
                    <p className="text-red-500 text-lg mb-4">⚠️ Failed to load tuitions</p>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Available Tuitions"
                subtitle="Find tuition jobs"
            />

            {/* Filter Controls */}
            <FilterBar
                filters={filters}
                onFilterChange={updateFilter}
                onClear={clearFilters}
                classOptions={filterOptions.classes}
                locationOptions={filterOptions.locations}
                showClearButton={hasActiveFilters}
            />

            {/* Results Count */}
            <p className="text-sm text-gray-500 mb-4">
                Showing {filteredTuitions.length} tuition{filteredTuitions.length !== 1 ? 's' : ''}
            </p>

            {/* Content */}
            {filteredTuitions.length === 0 ? (
                <EmptyState
                    message="No tuitions found matching your criteria"
                    onAction={clearFilters}
                    actionLabel="Clear Filters"
                />
            ) : (
                <>
                    {/* Tuition Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedItems.map(tuition => (
                            <TuitionCard key={tuition._id} tuition={tuition} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                    />
                </>
            )}
        </div>
    );
};

export default Tuitions;
