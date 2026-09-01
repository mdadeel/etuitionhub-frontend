import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useTuitionsQuery } from "../hooks/queries/useTuitionsQuery";
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
import { cn } from "@/lib/utils";
import SEO from '../components/shared/SEO';
import { TuitionCardGridSkeleton } from "@/components/shared/skeletons";

const Tuitions = () => {
  const [, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);

  const { filters, updateFilter, clearFilters, hasActiveFilters } = useTuitionFilters();
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const debouncedSearch = useDebouncedValue(localSearch, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filters.search, updateFilter]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleMainScroll = (e) => {
    if (e.currentTarget.scrollTop > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

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

  const { data, isLoading, error } = useTuitionsQuery({
    ...filters,
    page,
    limit: 21,
    status: "approved",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tuitions = data?.data || [];
  const pagination = data?.pagination;
  const filterOptions = data?.filterOptions;
  const loading = isLoading;

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

  const totalPages = pagination?.totalPages ?? pagination?.pages ?? 1;
  const currentPage = pagination?.currentPage ?? pagination?.page ?? page;
  const hasMore = pagination ? currentPage < totalPages : false;

  const handleClearAll = () => {
    setSearchParams({});
    clearFilters();
    setLocalSearch("");
    setPage(1);
  };

  return (
    <div className="bg-background lg:h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <SEO
        title={t('tuitions.seo_title')}
        description={t('tuitions.seo_desc')}
        keywords={t('tuitions.seo_keywords')}
      />
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden shrink-0",
            scrolled
              ? "max-h-0 opacity-0 mb-0 pointer-events-none"
              : "max-h-[250px] opacity-100 mb-6"
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="md:block hidden">
              <h1 className="text-xl font-heading text-foreground">
                {t('tuitions.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('tuitions.subtitle')}
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-xl border border-border">
                <span className="text-lg font-heading text-foreground">
                  {pagination?.totalItems || 0}
                </span>
                <span className="text-xs text-muted-foreground">{t('tuitions.jobs_available')}</span>
              </div>

              {/* Mobile Filters Inline Trigger */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden px-3 py-1.5 bg-card border border-border rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-muted active:scale-[0.98] transition-all relative self-stretch"
              >
                <Filter size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground font-semibold">
                  {t('tuitions.filters')}
                </span>
                {(filters.subjects.length > 0 ||
                  filters.classFilter ||
                  filters.locationFilter) && (
                  <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[11px] font-bold flex items-center justify-center rounded-full border border-card shadow-sm">
                    {(filters.subjects.length > 0 ? 1 : 0) +
                      (filters.classFilter ? 1 : 0) +
                      (filters.locationFilter ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-6 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('tuitions.search_placeholder')}
              className="w-full pl-9 pr-4 h-11 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm text-foreground placeholder:text-muted-foreground"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden">

          {/* Sidebar Filters */}
          <aside
            className={cn(
              "lg:col-span-1 h-full",
              "fixed inset-0 z-[60] bg-black/55 lg:relative lg:inset-auto lg:z-auto lg:bg-transparent transition-opacity",
              isMobileFiltersOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto",
            )}
          >
            <div
              className={cn(
                "bg-card w-[85%] max-w-sm h-full p-6 lg:p-4 lg:rounded-lg lg:border lg:border-border lg:w-full lg:shadow-sm transition-transform duration-300 overflow-y-auto custom-scrollbar",
                isMobileFiltersOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0",
              )}
            >
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-lg font-heading">{t('tuitions.filters')}</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 hover:bg-background rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <h3 className="hidden lg:flex text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Filter size={14} /> {t('tuitions.filters')}
              </h3>

              <div className="space-y-4">
                <FilterSelect
                  label={t('tuitions.sort_by')}
                  value={filters.sortBy}
                  onValueChange={(val) => updateFilter("sortBy", val)}
                  icon={SlidersHorizontal}
                  options={[
                    { value: "newest", label: t('tuitions.sort_newest') },
                    { value: "oldest", label: t('tuitions.sort_oldest') },
                    { value: "salary-high", label: t('tuitions.sort_salary_high') },
                    { value: "salary-low", label: t('tuitions.sort_salary_low') },
                  ]}
                />

                <FilterSelect
                  label={t('tuitions.class_label')}
                  value={filters.classFilter || "all"}
                  onValueChange={(val) =>
                    updateFilter("classFilter", val === "all" ? "" : val)
                  }
                  icon={LayoutGrid}
                  placeholder={t('tuitions.all_classes')}
                  options={["all", ...(filterOptions?.classes || [])]}
                />

                <FilterSelect
                  label={t('tuitions.location_label')}
                  value={filters.locationFilter || "all"}
                  onValueChange={(val) =>
                    updateFilter("locationFilter", val === "all" ? "" : val)
                  }
                  icon={MapPin}
                  placeholder={t('tuitions.all_locations')}
                  options={[
                    "all",
                    ...(filterOptions?.locations?.filter((loc) => !!loc) || []),
                  ]}
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-muted-foreground block">
                      {t('tuitions.subjects')}
                    </label>
                    {filters.subjects.length > 0 && (
                      <button
                        onClick={() => updateFilter("subjects", [])}
                        className="text-xs text-primary hover:underline"
                      >
                        {t('tuitions.reset')}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
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
                            ? "bg-primary text-white"
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
                  <X size={14} /> {t('tuitions.clear_filters')}
                </button>
              )}

              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full mt-4 px-3 py-3 bg-primary text-white rounded-xl font-medium text-sm lg:hidden"
              >
                {t('tuitions.apply_filters')}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main onScroll={handleMainScroll} className="lg:col-span-3 overflow-y-auto custom-scrollbar pr-1 relative pb-24 md:pb-0">

            <div className="md:hidden mb-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="search"
                placeholder={t('tuitions.search_placeholder')}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-4 h-10 rounded-xl text-sm bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {loading && tuitions.length === 0 && (
              <TuitionCardGridSkeleton count={6} columns={3} className="gap-3 md:gap-4" />
            )}

            {filters.search && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('tuitions.searching_for')}</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                  "{filters.search}"
                </span>
              </div>
            )}

            {error ? (
              <div className="py-12 text-center">
                <h3 className="text-lg font-heading text-destructive mb-2">
                  {t('tuitions.error_title')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {error?.message || t('tuitions.error_generic')}
                </p>
              </div>
            ) : tuitions.length === 0 && !loading ? (
              <div className="bg-card border border-border rounded-xl">
                <SearchEmptyState
                  query={filters.search}
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
                    >
                      <RefreshCw size={14} />
                      {t('tuitions.reset_filters')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {tuitions.map((tuition) => (
                    <TuitionCard
                      key={tuition._id}
                      tuition={tuition}
                      searchQuery={filters.search}
                      initialIsSaved={savedTuitionIds.has(tuition._id)}
                    />
                  ))}
                </div>

                {loading && tuitions.length > 0 && (
                  <div className="mt-6">
                    <TuitionCardGridSkeleton count={3} columns={3} className="gap-3 md:gap-4" />
                  </div>
                )}
                {hasMore && !loading && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md"
                    >
                      {t('tuitions.load_more')}
                    </button>
                  </div>
                )}
                {!hasMore && tuitions.length > 0 && !loading && (
                  <div className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-8">
                    {t('tuitions.no_more')}
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
