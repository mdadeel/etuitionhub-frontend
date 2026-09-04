import { useState, useEffect, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import useDebouncedValue from "../hooks/useDebouncedValue";
import { useSearchParams } from "react-router-dom";
import TutorCard from "../components/shared/TutorCard";
import TutorCompareModal from "../components/shared/TutorCompareModal";
import { useAuth } from "../contexts/AuthContext";
import {
  SlidersHorizontal,
  ShieldCheck,
  Filter,
  X,
  Search,
  RefreshCw,
  Scale,
} from "lucide-react";
import { toggleCompare, MAX_COMPARE } from "../lib/tutorCompare";
import FilterSelect from "../components/shared/FilterSelect";
import SearchEmptyState from "../components/shared/SearchEmptyState";
import SaveSearchButton from "../components/shared/SaveSearchButton";
import api from "../services/api";
import { cn } from "@/lib/utils";
import SEO from '../components/shared/SEO';
import { TutorCardGridSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Tutors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const [tutors, setTutors] = useState([]);
  const [savedTutorIds, setSavedTutorIds] = useState(new Set());
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("ratings");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedArea, setSelectedArea] = useState("All");
  const [allSubjects, setAllSubjects] = useState([]);
  const [allAreas, setAllAreas] = useState(["All"]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedMinSalary, setSelectedMinSalary] = useState(1000);
  const [selectedMaxSalary, setSelectedMaxSalary] = useState(20000);
  const searchQuery = searchParams.get("q") || "";
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebouncedValue(localSearch, 300);
  const [page, setPage] = useState(1);
  const [_pagination, setPagination] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [retryNonce, setRetryNonce] = useState(0);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleToggleCompare = (id) => {
    const { ids, rejected } = toggleCompare(compareIds, id);
    if (rejected) {
      toast.error(t('tutors.compare_limit', { count: MAX_COMPARE }));
      return;
    }
    setCompareIds(ids);
  };

  const compareTutors = useMemo(
    () => tutors.filter((t) => compareIds.includes(t._id)),
    [compareIds, tutors],
  );

  const handleMainScroll = (e) => {
    if (e.currentTarget.scrollTop > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFiltersOpen]);

  // Reset page, loaders, and list when search or filters change to prevent visual glitches
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setTutors([]);
    setLoading(true);
    setError(null);
  }, [
    debouncedSearch,
    selectedSubjects,
    selectedArea,
    selectedLanguage,
    selectedGender,
    selectedMinSalary,
    selectedMaxSalary,
    sortBy,
  ]);

  // Sync filters to URL
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (selectedSubjects.length > 0)
      params.subject = selectedSubjects.join(",");
    if (selectedArea && selectedArea !== "All") params.area = selectedArea;
    if (selectedLanguage && selectedLanguage !== "all")
      params.lang = selectedLanguage;
    if (selectedGender && selectedGender !== "all") params.gender = selectedGender;
    if (selectedMinSalary && selectedMinSalary !== 1000) params.minSalary = selectedMinSalary;
    if (selectedMaxSalary && selectedMaxSalary !== 20000) params.maxSalary = selectedMaxSalary;
    if (sortBy && sortBy !== "ratings") params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    selectedSubjects,
    selectedArea,
    selectedLanguage,
    selectedGender,
    selectedMinSalary,
    selectedMaxSalary,
    sortBy,
    setSearchParams,
  ]);

  // Restore filters from URL on mount
  useEffect(() => {
    const subject = searchParams.get("subject") || searchParams.get("subjects");
    const area = searchParams.get("area");
    const lang = searchParams.get("lang");
    const gender = searchParams.get("gender");
    const minSalary = searchParams.get("minSalary");
    const maxSalary = searchParams.get("maxSalary");
    const sort = searchParams.get("sort");
    if (subject) setSelectedSubjects(subject.split(","));
    if (area) setSelectedArea(area);
    if (lang) setSelectedLanguage(lang);
    if (gender) setSelectedGender(gender);
    if (minSalary) setSelectedMinSalary(parseInt(minSalary));
    if (maxSalary) setSelectedMaxSalary(parseInt(maxSalary));
    if (sort) setSortBy(sort);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    let active = true;
    const fetchTutors = async () => {
      setLoading(true);
      try {
        let params = new URLSearchParams();
        if (debouncedSearch) params.append("q", debouncedSearch);

        selectedSubjects.forEach((sub) => params.append("subject", sub));

        if (selectedArea !== "All") params.append("location", selectedArea);
        if (selectedLanguage !== "all" && selectedLanguage !== "All")
          params.append("language", selectedLanguage);
        if (selectedGender && selectedGender !== "all")
          params.append("gender", selectedGender);
        if (selectedMinSalary && selectedMinSalary !== 1000)
          params.append("minPrice", selectedMinSalary);
        if (selectedMaxSalary && selectedMaxSalary !== 20000)
          params.append("maxPrice", selectedMaxSalary);

        params.append("page", page);
        params.append("limit", 21);

        if (sortBy) {
          params.append("sort", sortBy);
        }

        const response = await api.get(
          `/api/tutors?${params.toString()}`,
        );
        
        if (!active) return;
        
        const responseData = response.data;
        const tutorsData = responseData.data || responseData;
        const paginationData = responseData.pagination || null;
        const filterOptions = responseData.filterOptions || null;

        setError(null);
        setTutors(prev => page === 1 ? (Array.isArray(tutorsData) ? tutorsData : []) : [...prev, ...(Array.isArray(tutorsData) ? tutorsData : [])]);
        setPagination(paginationData);
        setHasMore(paginationData ? paginationData.page < paginationData.pages : false);

        if (filterOptions) {
          if (filterOptions.subjects) {
            const subjectsSet = new Set();
            filterOptions.subjects.forEach((s) => {
              if (typeof s === "string" && s.includes(",")) {
                s.split(",").forEach((sub) => subjectsSet.add(sub.trim()));
              } else {
                subjectsSet.add(s);
              }
            });
            setAllSubjects(Array.from(subjectsSet));
          }
          if (filterOptions.locations) {
            const areasSet = new Set(["All"]);
            filterOptions.locations.forEach((loc) => {
              if (typeof loc === "string") {
                const area = loc.split(",").pop().trim();
                if (area) areasSet.add(area);
              }
            });
            setAllAreas(Array.from(areasSet));
          }
        }
      } catch (error) {
        if (!active) return;
        console.error("Error fetching tutors", error);
        setError(
          error?.response?.data?.message ||
            "Unable to load tutors. Please check your connection and try again.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchTutors();
    return () => {
      active = false;
    };
  }, [
    debouncedSearch,
    selectedSubjects,
    selectedArea,
    sortBy,
    selectedLanguage,
    selectedGender,
    selectedMinSalary,
    selectedMaxSalary,
    page,
    retryNonce,
  ]);

  useEffect(() => {
    if (!user || tutors.length === 0) return;
    const realIds = tutors
      .map((t) => t._id)
      .filter((id) => /^[a-f\d]{24}$/i.test(id));
    if (realIds.length === 0) return;
    api
      .post('/api/bookmarks/check-many', { tutorIds: realIds })
      .then((res) => {
        const savedSet = new Set();
        for (const [id, isSaved] of Object.entries(res.data.saved || {})) {
          if (isSaved) savedSet.add(id);
        }
        setSavedTutorIds(savedSet);
      })
      .catch(() => {});
  }, [user, tutors]);

  const filteredAndSortedTutors = useMemo(() => {
    if (!Array.isArray(tutors)) return [];
    let result = [...tutors];

    if (sortBy === "exp-high") {
      result.sort((a, b) => {
        const aExp = parseInt(a.experience) || 0;
        const bExp = parseInt(b.experience) || 0;
        return bExp - aExp;
      });
    }

    return result;
  }, [tutors, sortBy]);

  const handleClear = () => {
    setSearchParams({});
    setLocalSearch("");
    setSortBy("ratings");
    setSelectedSubjects([]);
    setSelectedArea("All");
    setSelectedLanguage("all");
    setSelectedGender("all");
    setSelectedMinSalary(1000);
    setSelectedMaxSalary(20000);
    setPage(1);
  };

  const toggleSubject = (sub) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub],
    );
  };

  const activeFilters = useMemo(() => {
    const list = [];
    if (selectedSubjects.length > 0) {
      selectedSubjects.forEach(sub => list.push({ key: `subject-${sub}`, label: sub, remove: () => toggleSubject(sub) }));
    }
    if (selectedArea && selectedArea !== "All") {
      list.push({ key: 'area', label: `Area: ${selectedArea}`, remove: () => setSelectedArea("All") });
    }
    if (selectedLanguage && selectedLanguage !== "all") {
      list.push({ key: 'language', label: `Lang: ${selectedLanguage}`, remove: () => setSelectedLanguage("all") });
    }
    if (selectedGender && selectedGender !== "all") {
      list.push({ key: 'gender', label: `Gender: ${selectedGender}`, remove: () => setSelectedGender("all") });
    }
    if (localSearch) {
      list.push({ key: 'query', label: `"${localSearch}"`, remove: () => setLocalSearch("") });
    }
    return list;
  }, [selectedSubjects, selectedArea, selectedLanguage, selectedGender, localSearch]);

  return (
    <div className="bg-background text-foreground lg:h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <SEO
        title={t('tutors.seo_title')}
        description={t('tutors.seo_desc')}
        keywords={t('tutors.seo_keywords')}
      />
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden shrink-0",
            scrolled
              ? "max-h-0 opacity-0 mb-0 pointer-events-none"
              : "max-h-[250px] opacity-100 mb-8"
          )}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl font-heading text-foreground tracking-tight leading-none mb-2">
                {t('tutors.heading_prefix')} <span className="text-primary">{t('tutors.heading_suffix')}</span>
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                {t('tutors.heading_desc')}
              </p>
            </div>

            {/* Integrated Trust & Stats Bar (Stripe/Linear style) */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center divide-x divide-border rounded-xl border border-border/80 bg-card px-3.5 py-2 shadow-sm text-xs text-foreground">
                <div className="flex items-center gap-2 pr-3.5">
                  <span className="text-base font-bold text-foreground leading-none">
                    {filteredAndSortedTutors.length}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                    {t('tutors.available')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pl-3.5">
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-semibold text-foreground tracking-wide">
                    100% Identity & Degree Vetted
                  </span>
                </div>
              </div>

              {/* Mobile Filters Inline Trigger */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden px-3.5 py-2 bg-card border border-border rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-muted active:scale-[0.98] transition-all relative self-stretch"
              >
                <Filter size={16} className="text-primary" />
                <span className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                  {t('tutors.filters')}
                </span>
                {activeFilters.length > 0 && (
                  <span className="size-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {activeFilters.length}
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
              placeholder={t('tutors.search_placeholder')}
              className="w-full pl-10 pr-4 h-12 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all text-foreground placeholder:text-muted-foreground"
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
              "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:relative lg:inset-auto lg:z-auto lg:bg-transparent transition-opacity",
              isMobileFiltersOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto",
            )}
          >
            <div
              className={cn(
                "bg-card w-full max-w-none h-[85vh] absolute bottom-0 lg:h-full p-6 lg:p-4 lg:rounded-lg lg:border lg:border-border lg:w-full lg:shadow-sm transition-transform duration-300 rounded-t-lg lg:rounded-lg overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+1.5rem)] custom-scrollbar",
                isMobileFiltersOpen
                  ? "translate-y-0"
                  : "translate-y-full lg:translate-y-0",
              )}
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6 lg:hidden" />
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-xl font-heading tracking-tight">{t('tutors.filters')}</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 hover:bg-background rounded-full touch-manipulation"
                >
                  <X size={24} />
                </button>
              </div>
              <h3 className="hidden lg:flex text-sm font-semibold text-foreground mb-4 items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter size={16} className="text-primary" /> {t('tutors.filters')}
                </span>
                {activeFilters.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    {activeFilters.length} active
                  </span>
                )}
              </h3>

              <div className="space-y-4">
                <FilterSelect
                  label={t('tutors.sort_by')}
                  value={sortBy}
                  onValueChange={setSortBy}
                  icon={SlidersHorizontal}
                  options={[
                    { value: "ratings", label: "Highest Rated" },
                    { value: "name-az", label: t('tutors.sort_name_az') },
                    { value: "name-za", label: t('tutors.sort_name_za') },
                    { value: "salary-high", label: t('tutors.sort_fee_high') },
                    { value: "salary-low", label: t('tutors.sort_fee_low') },
                  ]}
                />

                <FilterSelect
                  label={t('tutors.area_label')}
                  value={selectedArea}
                  onValueChange={setSelectedArea}
                  placeholder={t('tutors.area_placeholder')}
                  options={allAreas}
                />

                <FilterSelect
                  label={t('tutors.language_label')}
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                  options={[
                    { value: "all", label: t('tutors.lang_all') },
                    { value: "english", label: t('tutors.lang_english') },
                    { value: "bangla", label: t('tutors.lang_bangla') },
                    { value: "both", label: t('tutors.lang_both') },
                  ]}
                />

                <FilterSelect
                  label={t('tutors.gender_label')}
                  value={selectedGender}
                  onValueChange={setSelectedGender}
                  options={[
                    { value: "all", label: t('tutors.lang_all') },
                    { value: "male", label: t('tutors.gender_male') },
                    { value: "female", label: t('tutors.gender_female') },
                  ]}
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
                      {t('tutors.subjects')}
                    </label>
                    {selectedSubjects.length > 0 && (
                      <button
                        onClick={() => setSelectedSubjects([])}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        {t('tutors.reset')}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto pr-1">
                    {allSubjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => toggleSubject(subject)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors min-h-[36px] border ${
                          selectedSubjects.includes(subject)
                            ? "bg-primary text-white border-primary"
                            : "bg-background text-muted-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-6 space-y-2">
                {activeFilters.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="w-full px-3 py-2.5 text-xs font-semibold text-muted-foreground border border-border rounded-xl hover:bg-muted hover:text-foreground flex items-center justify-center gap-2 transition-all"
                  >
                    <X size={14} /> {t('tutors.clear_all')} ({activeFilters.length})
                  </button>
                )}

                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full px-3 py-3 bg-primary text-white rounded-xl font-semibold text-xs lg:hidden shadow-sm active:scale-[0.98] transition-all"
                >
                  {t('tutors.apply_filters')}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main onScroll={handleMainScroll} className="lg:col-span-3 relative pb-24 md:pb-0 overflow-y-auto custom-scrollbar pr-1">

            {/* Active Filter Chips Bar */}
            {activeFilters.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 bg-muted/40 p-2.5 rounded-xl border border-border/60">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-1">
                  Active Filters:
                </span>
                {activeFilters.map((f) => (
                  <span
                    key={f.key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-medium text-foreground shadow-2xs group"
                  >
                    {f.label}
                    <button
                      type="button"
                      onClick={f.remove}
                      className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
                      title="Remove filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-primary font-semibold hover:underline ml-auto"
                >
                  {t('tutors.clear_all')}
                </button>
              </div>
            )}

            <div className="md:hidden mb-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="search"
                placeholder={t('tutors.search_placeholder')}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-4 h-10 rounded-xl text-sm bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {loading && tutors.length === 0 && (
              <TutorCardGridSkeleton count={9} columns={3} className="gap-4 md:gap-4" />
            )}

            {searchQuery && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                  {t('tutors.searching_for')}
                </span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                  "{searchQuery}"
                </span>
                <SaveSearchButton query={searchQuery} filters={{ subject: selectedSubjects, area: selectedArea, language: selectedLanguage, gender: selectedGender, minSalary: selectedMinSalary, maxSalary: selectedMaxSalary }} />
              </div>
            )}

            {tutors.length === 0 && !loading && error ? (
              <div className="py-12 text-center">
                <h3 className="text-lg font-heading text-destructive mb-2">
                  {t('tutors.error_title')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  {error}
                </p>
                <button
                  onClick={() => { setError(null); setLoading(true); setRetryNonce(n => n + 1); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
                >
                  <RefreshCw size={14} />
                  {t('tutors.try_again')}
                </button>
              </div>
            ) : tutors.length === 0 && !loading ? (
              <div className="bg-card border border-border rounded-xl">
                <SearchEmptyState
                  query={searchQuery}
                  type="tutors"
                  suggestions={
                    selectedSubjects.length === 0
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
                {(searchQuery ||
                  selectedSubjects.length > 0 ||
                  selectedArea !== "All" ||
                  selectedLanguage !== "all") && (
                  <div className="px-4 pb-6 flex justify-center">
                    <button
                      onClick={handleClear}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
                    >
                      <RefreshCw size={14} />
                      {t('tutors.reset_filters')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
                  {filteredAndSortedTutors.map((tutor) => (
                    <TutorCard
                      key={tutor._id}
                      tutor={tutor}
                      searchQuery={searchQuery}
                      initialIsSaved={savedTutorIds.has(tutor._id)}
                      isCompared={compareIds.includes(tutor._id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>

                {loading && tutors.length > 0 && (
                  <div className="mt-6">
                    <TutorCardGridSkeleton count={3} columns={3} className="gap-4 md:gap-4" />
                  </div>
                )}
                {hasMore && !loading && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md"
                    >
                      {t('tutors.load_more')}
                    </button>
                  </div>
                )}
                {!hasMore && tutors.length > 0 && !loading && (
                  <div className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-8">
                    {t('tutors.no_more')}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Compare bar — fixed bottom, only when 2+ tutors selected */}
      {compareIds.length >= 2 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Scale size={14} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  {t('tutors.compare_selected', { count: compareIds.length })}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {compareTutors.map((t) => t.displayName).join(", ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCompareIds([])}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                {t('tutors.compare_clear')}
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCompareOpen(true)}
                className="gap-2"
              >
                <Scale size={14} strokeWidth={2.5} />
                {t('tutors.compare_btn')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <TutorCompareModal
        open={isCompareOpen}
        onOpenChange={setIsCompareOpen}
        tutors={compareTutors}
      />
    </div>
  );
};

export default Tutors;