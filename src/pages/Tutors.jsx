import { useState, useEffect, useMemo } from "react";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { useSearchParams } from "react-router-dom";
import TutorCard from "../components/shared/TutorCard";
import {
  SlidersHorizontal,
  ShieldCheck,
  Filter,
  X,
  LayoutGrid,
  Search,
  RefreshCw,
} from "lucide-react";
import FilterSelect from "../components/shared/FilterSelect";
import SearchEmptyState from "../components/shared/SearchEmptyState";
import SaveSearchButton from "../components/shared/SaveSearchButton";
import api from "../services/api";
import { cn } from "@/lib/utils";

const Tutors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name-az");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All");
  const [allSubjects, setAllSubjects] = useState([]);
  const [allClasses, setAllClasses] = useState(["All"]);
  const [allAreas, setAllAreas] = useState(["All"]);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const searchQuery = searchParams.get("q") || "";
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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

  // Sync filters to URL
  useEffect(() => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedSubjects.length > 0)
      params.subjects = selectedSubjects.join(",");
    if (selectedClass && selectedClass !== "All") params.class = selectedClass;
    if (selectedArea && selectedArea !== "All") params.area = selectedArea;
    if (selectedLanguage && selectedLanguage !== "all")
      params.lang = selectedLanguage;
    if (maxPrice < 20000) params.price = String(maxPrice);
    if (sortBy && sortBy !== "name-az") params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [
    searchQuery,
    selectedSubjects,
    selectedClass,
    selectedArea,
    selectedLanguage,
    maxPrice,
    sortBy,
    setSearchParams,
  ]);

  // Restore filters from URL on mount
  useEffect(() => {
    const subjects = searchParams.get("subjects");
    const classParam = searchParams.get("class");
    const area = searchParams.get("area");
    const lang = searchParams.get("lang");
    const price = searchParams.get("price");
    const sort = searchParams.get("sort");
    if (subjects) setSelectedSubjects(subjects.split(","));
    if (classParam) setSelectedClass(classParam);
    if (area) setSelectedArea(area);
    if (lang) setSelectedLanguage(lang);
    if (price) setMaxPrice(Number(price));
    if (sort) setSortBy(sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        let params = new URLSearchParams();
        if (debouncedSearch) params.append("q", debouncedSearch);

        selectedSubjects.forEach((sub) => params.append("subject", sub));

        if (selectedClass !== "All") params.append("class_name", selectedClass);
        if (selectedArea !== "All") params.append("location", selectedArea);
        if (selectedLanguage !== "all" && selectedLanguage !== "All")
          params.append("language", selectedLanguage);
        if (maxPrice < 20000) params.append("maxPrice", maxPrice);

        if (sortBy === "ratings" || sortBy === "salary-low") {
          params.append("sort", sortBy);
        }

        const response = await api.get(
          `/api/tutors?${params.toString()}`,
        );
        const tutorsData = response.data.data || response.data;
        setTutors(Array.isArray(tutorsData) ? tutorsData : []);

        const subjectsSet = new Set();
        const classesSet = new Set(["All"]);
        const areasSet = new Set(["All"]);

        tutorsData.forEach((t) => {
          if (t.subjects) {
            t.subjects.forEach((s) => {
              if (typeof s === "string") {
                s.split(",").forEach((sub) => subjectsSet.add(sub.trim()));
              } else {
                subjectsSet.add(s);
              }
            });
          }
          if (t.class_name) classesSet.add(t.class_name);
          if (t.location) {
            const area = t.location.split(",").pop().trim();
            if (area) areasSet.add(area);
          }
        });

        setAllSubjects((prev) =>
          prev.length === 0 ? Array.from(subjectsSet) : prev,
        );
        setAllClasses((prev) =>
          prev.length <= 1 ? Array.from(classesSet) : prev,
        );
        setAllAreas((prev) => (prev.length <= 1 ? Array.from(areasSet) : prev));
      } catch (error) {
        console.error("Error fetching tutors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, [
    debouncedSearch,
    selectedSubjects,
    selectedClass,
    selectedArea,
    sortBy,
    maxPrice,
    selectedLanguage,
  ]);

  const filteredAndSortedTutors = useMemo(() => {
    if (!Array.isArray(tutors)) return [];
    let result = [...tutors];

    switch (sortBy) {
      case "name-az":
        result.sort((a, b) =>
          (a.displayName || "").localeCompare(b.displayName || ""),
        );
        break;
      case "name-za":
        result.sort((a, b) =>
          (b.displayName || "").localeCompare(a.displayName || ""),
        );
        break;
      case "exp-high":
        result.sort((a, b) => {
          const aExp = parseInt(a.experience) || 0;
          const bExp = parseInt(b.experience) || 0;
          return bExp - aExp;
        });
        break;
      default:
        break;
    }

    return result;
  }, [tutors, sortBy]);

  const handleClear = () => {
    setSearchParams({});
    setSortBy("name-az");
    setSelectedSubjects([]);
    setSelectedClass("All");
    setSelectedArea("All");
    setMaxPrice(20000);
    setSelectedLanguage("all");
  };

  const toggleSubject = (sub) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub],
    );
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
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
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tutors..."
              className="w-full pl-10 pr-4 h-12 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 shadow-sm transition-all text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchParams({ q: e.target.value })}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Mobile Filters Trigger */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden fixed z-40 bg-[#2563EB] text-white h-14 rounded-xl shadow-xl flex items-center justify-center gap-2 hover:bg-[#1D4ED8] active:scale-[0.98] transition-all"
            style={{
              bottom: "calc(env(safe-area-inset-bottom) + 5.25rem)",
              left: "1rem",
              right: "1rem",
            }}
          >
            <Filter size={20} />
            <span className="font-medium text-base tracking-wide">Filters</span>
            {(selectedSubjects.length > 0 ||
              selectedClass !== "All" ||
              selectedArea !== "All") && (
              <span className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 bg-card text-[#2563EB] text-xs font-bold flex items-center justify-center rounded-full">
                {(selectedSubjects.length > 0 ? 1 : 0) +
                  (selectedClass !== "All" ? 1 : 0) +
                  (selectedArea !== "All" ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Sidebar Filters */}
          <aside
            className={cn(
              "lg:col-span-1",
              "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:relative lg:inset-auto lg:z-auto lg:bg-transparent transition-opacity",
              isMobileFiltersOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto",
            )}
          >
            <div
              className={cn(
                "bg-card w-full max-w-none h-[85vh] absolute bottom-0 lg:h-auto p-6 lg:p-4 lg:rounded-xl lg:border lg:border-border lg:sticky lg:top-20 lg:w-full lg:shadow-sm transition-transform duration-300 rounded-t-2xl lg:rounded-none overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+1.5rem)]",
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
                    { value: "name-az", label: "Alphabetical: A-Z" },
                    { value: "name-za", label: "Alphabetical: Z-A" },
                    { value: "exp-high", label: "Experience: High" },
                    { value: "salary-low", label: "Fee: Low to High" },
                  ]}
                />

                <FilterSelect
                  label="Class"
                  value={selectedClass}
                  onValueChange={setSelectedClass}
                  icon={LayoutGrid}
                  placeholder="Select Class"
                  options={allClasses}
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
                      Max Monthly Fee (৳{maxPrice})
                    </label>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-[#2563EB]"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>৳500</span>
                    <span>৳20k+</span>
                  </div>
                </div>

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
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[36px] border ${
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
                sortBy !== "name-az" ||
                selectedSubjects.length > 0 ||
                selectedClass !== "All" ||
                selectedArea !== "All" ||
                maxPrice < 20000 ||
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
          <main className="lg:col-span-3 relative pb-24 md:pb-0">
            {loading && tutors.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">Loading tutors...</p>
              </div>
            )}

            {searchQuery && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                  Searching for:
                </span>
                <span className="px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-lg text-sm font-medium">
                  "{searchQuery}"
                </span>
                <SaveSearchButton query={searchQuery} filters={{ subjects: selectedSubjects, class: selectedClass, area: selectedArea, language: selectedLanguage, maxPrice }} />
              </div>
            )}

            {filteredAndSortedTutors.length === 0 && !loading ? (
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
                  selectedClass !== "All" ||
                  selectedArea !== "All" ||
                  maxPrice < 20000 ||
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
                {filteredAndSortedTutors.map((tutor) => (
                  <TutorCard
                    key={tutor._id}
                    tutor={tutor}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Tutors;
