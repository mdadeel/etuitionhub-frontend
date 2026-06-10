import { useState, useEffect, useMemo } from "react";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { useSearchParams } from "react-router-dom";
import TutorCard from "../components/shared/TutorCard";
import { useAuth } from "../contexts/AuthContext";
import {
  SlidersHorizontal,
  ShieldCheck,
  Filter,
  X,
  Search,
  RefreshCw,
} from "lucide-react";
import FilterSelect from "../components/shared/FilterSelect";
import SearchEmptyState from "../components/shared/SearchEmptyState";
import SaveSearchButton from "../components/shared/SaveSearchButton";
import api from "../services/api";
import { cn } from "@/lib/utils";
import SEO from '../components/shared/SEO';
import { TutorCardGridSkeleton } from "@/components/shared/skeletons";

const Tutors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
  const searchQuery = searchParams.get("q") || "";
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [page, setPage] = useState(1);
  const [_pagination, setPagination] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
  }, [
    debouncedSearch,
    selectedSubjects,
    selectedArea,
    selectedLanguage,
    sortBy,
  ]);

  // Sync filters to URL
  useEffect(() => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedSubjects.length > 0)
      params.subjects = selectedSubjects.join(",");
    if (selectedArea && selectedArea !== "All") params.area = selectedArea;
    if (selectedLanguage && selectedLanguage !== "all")
      params.lang = selectedLanguage;
    if (sortBy && sortBy !== "ratings") params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [
    searchQuery,
    selectedSubjects,
    selectedArea,
    selectedLanguage,
    sortBy,
    setSearchParams,
  ]);

  // Restore filters from URL on mount
  useEffect(() => {
    const subjects = searchParams.get("subjects");
    const area = searchParams.get("area");
    const lang = searchParams.get("lang");
    const sort = searchParams.get("sort");
    if (subjects) setSelectedSubjects(subjects.split(","));
    if (area) setSelectedArea(area);
    if (lang) setSelectedLanguage(lang);
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
    page,
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
    setSortBy("ratings");
    setSelectedSubjects([]);
    setSelectedArea("All");
    setSelectedLanguage("all");
    setPage(1);
  };

  const toggleSubject = (sub) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub],
    );
  };

  return (
    <div className="bg-background text-foreground lg:h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <SEO 
        title="Find the Best Verified Tutors" 
        description="Browse and connect with highly qualified, verified home and online tutors across Bangladesh. Select by class, subject, location, and monthly budget."
        keywords="tutor, find tutors, verified tutors, bangladesh tutor, home tuition, online study"
      />
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col flex-1 min-h-0 w-full">
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
                Verified <span className="text-[#2563EB]">Tutors.</span>
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Browse through our verified network of academic professionals.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-card border border-border rounded-xl shadow-sm flex flex-col items-center min-w-[80px]">
                <span className="text-xl font-heading text-foreground leading-none">
                  {filteredAndSortedTutors.length}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Available
                </span>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-xl shadow-sm flex flex-col items-center min-w-[80px]">
                <ShieldCheck size={18} className="text-[#2563EB] mb-1" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  100% Vetted
                </span>
              </div>

              {/* Mobile Filters Inline Trigger */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden px-4 py-2 bg-card border border-border rounded-xl shadow-sm flex flex-col items-center justify-center min-w-[80px] hover:bg-muted active:scale-[0.98] transition-all relative self-stretch"
              >
                <Filter size={18} className="text-[#2563EB] mb-1" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Filters
                </span>
                {(selectedSubjects.length > 0 || selectedArea !== "All") && (
                  <span className="absolute -top-1 -right-1 size-5 bg-[#2563EB] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-card shadow-sm">
                    {(selectedSubjects.length > 0 ? 1 : 0) + (selectedArea !== "All" ? 1 : 0)}
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
              placeholder="Search tutors..."
              className="w-full pl-10 pr-4 h-12 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 shadow-sm transition-all text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchParams({ q: e.target.value })}
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
                "bg-card w-full max-w-none h-[85vh] absolute bottom-0 lg:h-full p-6 lg:p-4 lg:rounded-2xl lg:border lg:border-border lg:w-full lg:shadow-sm transition-transform duration-300 rounded-t-3xl lg:rounded-2xl overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+1.5rem)] custom-scrollbar",
                isMobileFiltersOpen
                  ? "translate-y-0"
                  : "translate-y-full lg:translate-y-0",
              )}
            >
              <div className="w-12 h-1.5 bg-[#E2E8F0] rounded-full mx-auto mb-6 lg:hidden" />
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-xl font-heading tracking-tight">Filters</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 hover:bg-background rounded-full touch-manipulation"
                >
                  <X size={24} />
                </button>
              </div>
              <h3 className="hidden lg:flex text-sm font-medium text-foreground mb-4 items-center gap-2">
                <Filter size={16} /> Filters
              </h3>

              <div className="space-y-4">
                <FilterSelect
                  label="Sort by"
                  value={sortBy}
                  onValueChange={setSortBy}
                  icon={SlidersHorizontal}
                  options={[
                    { value: "ratings", label: "Top Rated" },
                    { value: "name-az", label: "Alphabetical: A-Z" },
                    { value: "name-za", label: "Alphabetical: Z-A" },
                    { value: "salary-high", label: "Fee: High to Low" },
                    { value: "salary-low", label: "Fee: Low to High" },
                  ]}
                />

                <FilterSelect
                  label="Area / Location"
                  value={selectedArea}
                  onValueChange={setSelectedArea}
                  placeholder="Select Area"
                  options={allAreas}
                />

                <FilterSelect
                  label="Language Preference"
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                  options={[
                    { value: "all", label: "All" },
                    { value: "english", label: "English" },
                    { value: "bangla", label: "Bangla" },
                    { value: "both", label: "Both" },
                  ]}
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
                      Subjects
                    </label>
                    {selectedSubjects.length > 0 && (
                      <button
                        onClick={() => setSelectedSubjects([])}
                        className="text-xs text-[#2563EB] hover:underline font-medium"
                      >
                        Reset
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
                            ? "bg-[#2563EB] text-white border-[#2563EB]"
                            : "bg-background text-muted-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(searchQuery ||
                sortBy !== "ratings" ||
                selectedSubjects.length > 0 ||
                selectedArea !== "All" ||
                selectedLanguage !== "all") && (
                <button
                  onClick={handleClear}
                  className="w-full mt-6 px-3 py-3 text-sm font-medium text-muted-foreground border border-border rounded-xl hover:bg-background flex items-center justify-center gap-2 transition-colors"
                >
                  <X size={16} /> Clear All
                </button>
              )}

              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full mt-4 px-3 py-4 bg-[#2563EB] text-white rounded-xl font-medium text-sm lg:hidden h-14 shadow-sm active:scale-[0.98] transition-all"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main onScroll={handleMainScroll} className="lg:col-span-3 relative pb-24 md:pb-0 overflow-y-auto custom-scrollbar pr-1">

            <div className="md:hidden mb-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search tutors..."
                value={searchQuery}
                onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})}
                className="w-full pl-9 pr-4 h-10 rounded-xl text-sm bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {loading && tutors.length === 0 && (
              <TutorCardGridSkeleton count={9} columns={3} className="gap-4 md:gap-4" />
            )}

            {searchQuery && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                  Searching for:
                </span>
                <span className="px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-lg text-sm font-medium">
                  "{searchQuery}"
                </span>
                <SaveSearchButton query={searchQuery} filters={{ subjects: selectedSubjects, area: selectedArea, language: selectedLanguage }} />
              </div>
            )}

            {tutors.length === 0 && !loading ? (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
                  {filteredAndSortedTutors.map((tutor) => (
                    <TutorCard
                      key={tutor._id}
                      tutor={tutor}
                      searchQuery={searchQuery}
                      initialIsSaved={savedTutorIds.has(tutor._id)}
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
                      className="px-6 py-3 bg-[#2563EB] text-white font-medium rounded-xl hover:bg-[#1D4ED8] active:scale-[0.98] transition-all shadow-md"
                    >
                      Load More Tutors
                    </button>
                  </div>
                )}
                {!hasMore && tutors.length > 0 && !loading && (
                  <div className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-8">
                    No more tutors available
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

export default Tutors;