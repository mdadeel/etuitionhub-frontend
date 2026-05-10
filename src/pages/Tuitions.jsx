import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTuitions } from '../hooks/useTuitions';
import { useTuitionFilters } from '../hooks/useTuitionFilters';
import TuitionCard from '../components/shared/TuitionCard';
import Pagination from '../components/shared/Pagination';
import { TuitionGridSkeleton } from '../components/Tuitions/TuitionSkeleton';
import EmptyState from '../components/shared/EmptyState';
import { SlidersHorizontal, Filter, X, LayoutGrid, MapPin } from 'lucide-react';
import FilterSelect from '../components/shared/FilterSelect';

const Tuitions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const [page, setPage] = useState(1);

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

    const processedSubjects = useMemo(() => {
        if (!filterOptions?.subjects) return [];
        const subjectsSet = new Set();
        filterOptions.subjects.forEach(s => {
            if (typeof s === 'string' && s.includes(',')) {
                s.split(',').forEach(sub => subjectsSet.add(sub.trim()));
            } else {
                subjectsSet.add(s);
            }
        });
        return Array.from(subjectsSet);
    }, [filterOptions?.subjects]);

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <TuitionGridSkeleton />
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Available Tuition Jobs</h1>
                        <p className="text-sm text-slate-600">Find the perfect teaching opportunity that matches your skills.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200">
                            <span className="text-lg font-semibold text-slate-900">{pagination?.totalItems || 0}</span>
                            <span className="text-xs text-slate-500">Jobs</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200">
                            <span className="text-lg font-semibold text-slate-900">{totalPages}</span>
                            <span className="text-xs text-slate-500">Pages</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 sticky top-20">
                            <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
                                <Filter size={14} /> Filters
                            </h3>

                            <div className="space-y-4">
                                <FilterSelect
                                    label="Sort by"
                                    value={filters.sortBy}
                                    onValueChange={(val) => updateFilter('sortBy', val)}
                                    icon={SlidersHorizontal}
                                    options={[
                                        { value: 'newest', label: 'Latest First' },
                                        { value: 'oldest', label: 'Oldest First' },
                                        { value: 'salary-high', label: 'Salary: High to Low' },
                                        { value: 'salary-low', label: 'Salary: Low to High' },
                                    ]}
                                />

                                <FilterSelect
                                    label="Class"
                                    value={filters.classFilter || 'all'}
                                    onValueChange={(val) => updateFilter('classFilter', val === 'all' ? '' : val)}
                                    icon={LayoutGrid}
                                    placeholder="All Classes"
                                    options={['all', ...(filterOptions?.classes || [])]}
                                />

                                <FilterSelect
                                    label="Location"
                                    value={filters.locationFilter || 'all'}
                                    onValueChange={(val) => updateFilter('locationFilter', val === 'all' ? '' : val)}
                                    icon={MapPin}
                                    placeholder="All Locations"
                                    options={['all', ...(filterOptions?.locations?.filter(loc => !!loc) || [])]}
                                />

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-600 block">Subjects</label>
                                        {filters.subjects.length > 0 && (
                                            <button
                                                onClick={() => updateFilter('subjects', [])}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                                        {processedSubjects.map(subject => (
                                            <button
                                                key={subject}
                                                onClick={() => {
                                                    const current = filters.subjects;
                                                    const updated = current.includes(subject)
                                                        ? current.filter(s => s !== subject)
                                                        : [...current, subject];
                                                    updateFilter('subjects', updated);
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                                    filters.subjects.includes(subject)
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                            >
                                                {subject}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {(searchQuery || filters.classFilter || filters.locationFilter || filters.subjects.length > 0 || filters.sortBy !== 'newest') && (
                                <button
                                    onClick={handleClearAll}
                                    className="w-full mt-4 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 flex items-center justify-center gap-2"
                                >
                                    <X size={14} /> Clear Filters
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {searchQuery && (
                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-sm text-slate-500">Searching for:</span>
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium">"{searchQuery}"</span>
                            </div>
                        )}

                        {error ? (
                            <div className="py-12 text-center">
                                <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
                                <p className="text-sm text-slate-600 max-w-md mx-auto">{error}</p>
                            </div>
                        ) : tuitions.length === 0 ? (
                            <div className="py-12">
                                <EmptyState
                                    title="No Jobs Found"
                                    message="We couldn't locate any tuition jobs matching your criteria."
                                    onAction={handleClearAll}
                                    actionLabel="Reset Filters"
                                />
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tuitions.map((tuition) => (
                                        <TuitionCard key={tuition._id} tuition={tuition} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="pt-6 border-t border-slate-200">
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