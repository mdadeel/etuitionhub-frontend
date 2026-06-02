import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTuitions } from "../hooks/useTuitions";
import { useTuitionFilters } from "../hooks/useTuitionFilters";
import useDebouncedValue from "../hooks/useDebouncedValue";
import TuitionCard from "../components/shared/TuitionCard";
import SearchEmptyState from "../components/shared/SearchEmptyState";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  SlidersHorizontal,
  Filter,
  X,
  LayoutGrid,
  MapPin,
  Search,
  RefreshCw,
} from "lucide-react";
import FilterSelect from "../components/shared/FilterSelect";
import Pagination from "../components/shared/Pagination";
import { cn } from "@/lib/utils";
import SEO from '../components/shared/SEO';

const Tuitions = () => {
  const [, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);

  const { filters, updateFilter, clearFilters, hasActiveFilters } =
    useTuitionFilters();
  const searchQuery = filters.search;
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [savedTuitionIds, setSavedTuitionIds] = useState(new Set());
  const { user } = useAuth();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.classFilter,
    filters.locationFilter,
    filters.sortBy,
  ]);

  const { tuitions, pagination, filterOptions, loading, error } = useTuitions({
    ...filters,
    page,
    limit: 8,
    status: "approved",
  });

  useEffect(() => {
    if (!user || tuitions.length === 0) return;
    const realIds = tuitions
      .map((t) => t._id)
      .filter((id) => /^[a-f\d]{24}$/i.test(id));
    if (realIds.length === 0) return;
    api
      .post('/api/bookmarks/tuitions/check-many', { tuitionIds: realIds })
      .then((res) => {
        const savedSet = new Set();
        for (const [id, isSaved] of Object.entries(res.data.saved || {})) {
          if (isSaved) savedSet.add(id);
        }
        setSavedTuitionIds(savedSet);
      })
      .catch(() => {});
  }, [user, tuitions]);

  const processedSubjects = useMemo(() => {
    if (!filterOptions?.subjects) return [];
    const subjectsSet = new Set();
    filterOptions.subjects.forEach((s) => {
      if (typeof s === "string" && s.includes(",")) {
        s.split(",").forEach((sub) => subjectsSet.add(sub.trim()));
      } else {
        subjectsSet.add(s);
      }
    });
    return Array.from(subjectsSet);
  }, [filterOptions?.subjects]);

  const totalPages = pagination?.totalPages || 1;

  const handleClearAll = () => {
    setSearchParams({});
    clearFilters();
    setPage(1);
  };

  return (
    <div className="bg-background min-h-screen">
      <SEO 
        title="Tuition Jobs - Find Teaching Opportunities" 
        description="Browse available tuition jobs and teaching opportunities across Bangladesh. Filter by class, subject, and location to find the perfect match."
        keywords="tuition jobs, teaching jobs, tutor wanted, bangladesh tuitions, home tutor jobs"
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="md:block hidden">
            <h1 className="text-xl font-heading text-foreground">
              Available Tuition Jobs
            </h1>
            <p className="text-sm text-muted-foreground">
              Find the perfect teaching opportunity that matches your skills.
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-xl border border-border">
              <span className="text-lg font-heading text-foreground">
                {pagination?.totalItems || 0}
              </span>
              <span className="text-xs text-muted-foreground">Jobs</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-xl border border-border">
              <span className="text-lg font-heading text-foreground">
                {totalPages}
              </span>
              <span className="text-xs text-muted-foreground">Pages</span>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tuitions..."
              className="w-full pl-9 pr-4 h-11 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 shadow-sm text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Mobile Filters Trigger */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden fixed bottom-20 right-6 z-40 bg-[#2563EB] text-white p-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#1D4ED8] active:scale-95 transition-all"
          >
            <Filter size={20} />
            <span className="font-medium text-sm">Filters</span>
            {(filters.subjects.length > 0 ||
              filters.classFilter ||
              filters.locationFilter) && (
              <span className="absolute -top-1 -right-1 size-5 bg-card text-[#2563EB] text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                {(filters.subjects.length > 0 ? 1 : 0) +
                  (filters.classFilter ? 1 : 0) +
                  (filters.locationFilter ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Sidebar Filters */}
          <aside
            className={cn(
              "lg:col-span-1",
              "fixed inset-0 z-[60] bg-black/50 lg:relative lg:inset-auto lg:z-auto lg:bg-transparent transition-opacity",
              isMobileFiltersOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto",
            )}
          >
            <div
              className={cn(
                "bg-card w-[85%] max-w-sm h-full p-6 lg:p-4 lg:rounded-2xl lg:border lg:border-border lg:sticky lg:top-20 lg:w-full lg:h-auto lg:shadow-sm transition-transform duration-300",
                isMobileFiltersOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0",
              )}
            >
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-lg font-heading">Filters</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 hover:bg-background rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <h3 className="hidden lg:flex text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Filter size={14} /> Filters
              </h3>

              <div className="space-y-4">
                <FilterSelect
                  label="Sort by"
                  value={filters.sortBy}
                  onValueChange={(val) => updateFilter("sortBy", val)}
                  icon={SlidersHorizontal}
                  options={[
                    { value: "newest", label: "Latest First" },
                    { value: "oldest", label: "Oldest First" },
                    { value: "salary-high", label: "Salary: High to Low" },
                    { value: "salary-low", label: "Salary: Low to High" },
                  ]}
                />

                <FilterSelect
                  label="Class"
                  value={filters.classFilter || "all"}
                  onValueChange={(val) =>
                    updateFilter("classFilter", val === "all" ? "" : val)
                  }
                  icon={LayoutGrid}
                  placeholder="All Classes"
                  options={["all", ...(filterOptions?.classes || [])]}
                />

                <FilterSelect
                  label="Location"
                  value={filters.locationFilter || "all"}
                  onValueChange={(val) =>
                    updateFilter("locationFilter", val === "all" ? "" : val)
                  }
                  icon={MapPin}
                  placeholder="All Locations"
                  options={[
                    "all",
                    ...(filterOptions?.locations?.filter((loc) => !!loc) || []),
                  ]}
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-muted-foreground block">
                      Subjects
                    </label>
                    {filters.subjects.length > 0 && (
                      <button
                        onClick={() => updateFilter("subjects", [])}
                        className="text-xs text-[#2563EB] hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                    {processedSubjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          const current = filters.subjects;
                          const updated = current.includes(subject)
                            ? current.filter((s) => s !== subject)
                            : [...current, subject];
                          updateFilter("subjects", updated);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          filters.subjects.includes(subject)
                            ? "bg-[#2563EB] text-white"
                            : "bg-background text-muted-foreground hover:bg-muted border border-border"
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="w-full mt-4 px-3 py-2 text-sm text-muted-foreground border border-border rounded-xl hover:bg-background flex items-center justify-center gap-2 transition-colors"
                >
                  <X size={14} /> Clear Filters
                </button>
              )}

              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full mt-4 px-3 py-3 bg-[#2563EB] text-white rounded-xl font-medium text-sm lg:hidden"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {loading && tuitions.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">Loading tuitions...</p>
              </div>
            )}

            {filters.search && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Searching for:</span>
                <span className="px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-lg text-sm font-medium">
                  "{filters.search}"
                </span>
              </div>
            )}

            {error ? (
              <div className="py-12 text-center">
                <h3 className="text-lg font-heading text-red-600 mb-2">
                  Error
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {error}
                </p>
              </div>
            ) : tuitions.length === 0 && !loading ? (
              <div className="bg-card border border-border rounded-xl">
                <SearchEmptyState
                  query={searchQuery}
                  type="tuitions"
                  suggestions={
                    filters.subjects.length === 0
                      ? [
                          "Mathematics",
                          "English",
                          "Physics",
                          "Bangla",
                          "Chemistry",
                        ]
                      : []
                  }
                />
                {hasActiveFilters && (
                  <div className="px-4 pb-6 flex justify-center">
                    <button
                      onClick={handleClearAll}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] active:scale-[0.98] transition-all shadow-sm"
                    >
                      <RefreshCw size={14} />
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {tuitions.map((tuition) => (
                    <TuitionCard
                      key={tuition._id}
                      tuition={tuition}
                      searchQuery={filters.search}
                      initialIsSaved={savedTuitionIds.has(tuition._id)}
                    />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                    hasNext={page < pagination.totalPages}
                    hasPrev={page > 1}
                  />
                )}

                {loading && tuitions.length > 0 && (
                  <div className="py-8 text-center">
                    <div className="size-5 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mx-auto" />
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
