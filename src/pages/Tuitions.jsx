// tuitions page - shows all available tuitions
// filtering and pagination hooks use korsi
import { useTuitions, useTuitionFilters, usePagination } from '../hooks/useTuitions';
import TuitionCard from '../components/Tuitions/TuitionCard';
import FilterBar from '../components/Tuitions/FilterBar';
import Pagination from '../components/shared/Pagination';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import PageHeader from '../components/shared/PageHeader';

const ITEMS_PER_PAGE = 9;

const Tuitions = () => {
    const { tuitions, loading, error } = useTuitions();

    const {
        filters,
        updateFilter,
        clearFilters,
        hasActiveFilters,
        filteredTuitions,
        filterOptions
    } = useTuitionFilters(tuitions || []);

    const {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage
    } = usePagination(filteredTuitions, ITEMS_PER_PAGE);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-4 block">System Error</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Failed to synchronize data.</h1>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">{error}</p>
                    <button
                        className="btn-quiet-primary px-8"
                        onClick={() => window.location.reload()}
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-4 pb-10">
            <header className="mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-lg">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Direct Marketplace</span>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Available Positions</h1>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Analyze and apply to verified tuition requirements. We prioritize clarity of expectations and direct communication.
                        </p>
                    </div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        {filteredTuitions.length} Results Found
                    </div>
                </div>
            </header>

            <FilterBar
                filters={filters}
                onFilterChange={updateFilter}
                onClear={clearFilters}
                classOptions={filterOptions.classes}
                locationOptions={filterOptions.locations}
                showClearButton={hasActiveFilters}
            />

            {filteredTuitions.length === 0 ? (
                <EmptyState
                    message="No requirements match your current parameters"
                    onAction={clearFilters}
                    actionLabel="Reset Parameters"
                />
            ) : (
                <div className="space-y-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedItems.map(tuition => (
                            <TuitionCard key={tuition._id} tuition={tuition} />
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-12">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={goToPage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tuitions;
