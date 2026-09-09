import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, ArrowUpDown, User, BookOpen, Building2, MapPin, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import SEO from '../components/shared/SEO';
import TutorCard from "../components/shared/TutorCard";
import TuitionCard from "../components/shared/TuitionCard";
import SaveSearchButton from "../components/shared/SaveSearchButton";
import useDebouncedValue from "../hooks/useDebouncedValue";
import api from "../services/api";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TutorCardGridSkeleton, TuitionCardGridSkeleton } from "@/components/shared/skeletons";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get("q") || "";
  const [input, setInput] = useState(q);
  const debouncedQuery = useDebouncedValue(input, 300);

  const [tutors, setTutors] = useState([]);
  const [tuitions, setTuitions] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState({ tutors: [], tuitions: [], organizations: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery !== q) {
      setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, {
        replace: true,
      });
    }
  }, [debouncedQuery, q, setSearchParams]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setTutors([]);
      setTuitions([]);
      setOrganizations([]);
      setSuggestions({ tutors: [], tuitions: [], organizations: [] });
      setShowSuggestions(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const fetchAll = async () => {
      try {
        const [tutorsRes, tuitionsRes, combinedRes] = await Promise.all([
          api.get(`/api/tutors/search?q=${encodeURIComponent(debouncedQuery)}&limit=10`, { signal: controller.signal }),
          api.get(`/api/tuitions?search=${encodeURIComponent(debouncedQuery)}&limit=10&status=approved`, { signal: controller.signal }),
          api.get(`/api/search/combined?q=${encodeURIComponent(debouncedQuery)}&limit=6`, { signal: controller.signal }),
        ]);
        setTutors(tutorsRes.data.data || []);
        const tuitionData = tuitionsRes.data.data || tuitionsRes.data.tuitions || [];
        setTuitions(tuitionData);
        const orgs = combinedRes.data?.organizations || [];
        setOrganizations(orgs);
        // Reuse same combined response for suggestions (was duplicate GET limit=4)
        const d = combinedRes.data || {};
        setSuggestions({
          tutors: (d.tutors || []).slice(0, 4),
          tuitions: (d.tuitions || []).slice(0, 4),
          organizations: orgs.slice(0, 4),
        });
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setTutors([]);
          setTuitions([]);
          setOrganizations([]);
          setSuggestions({ tutors: [], tuitions: [], organizations: [] });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    return () => controller.abort();
  }, [debouncedQuery]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalResults = tutors.length + tuitions.length + organizations.length;
  const totalSuggestions = suggestions.tutors.length + suggestions.tuitions.length + (suggestions.organizations?.length || 0);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (showSuggestions) {
          setShowSuggestions(false);
        } else {
          setInput("");
        }
        inputRef.current?.focus();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, totalResults - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
      }
      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        setShowSuggestions(false);
        if (activeIndex < tutors.length) {
          navigate(`/tutor/${tutors[activeIndex]._id}`);
        } else if (activeIndex < tutors.length + tuitions.length) {
          navigate(`/tuition/${tuitions[activeIndex - tutors.length]._id}`);
        } else {
          const org = organizations[activeIndex - tutors.length - tuitions.length];
          if (org) navigate(`/organizations/${org.slug || org._id}`);
        }
      }
    },
    [activeIndex, totalResults, tutors, tuitions, organizations, navigate, showSuggestions],
  );

  useEffect(() => {
    if (activeIndex < 0 || !resultsRef.current) return;
    const items = resultsRef.current.querySelectorAll("[data-result-index]");
    if (items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Search Tutors, Tuitions & Institutions | eTuitionBD" description="Search for verified private tutors, tuition opportunities, and educational institutions across Bangladesh." />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tutors, tuitions, coaching centers, schools..."
            className="w-full pl-12 pr-28 h-14 bg-card border border-border rounded-xl text-lg outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            autoFocus
          />
          {input && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {debouncedQuery.length >= 2 && (
                <SaveSearchButton query={debouncedQuery} />
              )}
              <button
                onClick={() => {
                  setInput("");
                  inputRef.current?.focus();
                }}
                className="text-xs text-muted-foreground hover:text-foreground font-medium px-2 py-1 rounded hover:bg-muted"
              >
                Clear
              </button>
            </div>
          )}

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && totalSuggestions > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 top-full z-50 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden divide-y divide-border"
            >
              {suggestions.tutors.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User size={12} className="text-primary" /> Tutors
                  </p>
                  {suggestions.tutors.map((tutor) => (
                    <button
                      key={tutor._id}
                      onClick={() => {
                        setShowSuggestions(false);
                        navigate(`/tutor/${tutor._id}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    >
                      <div className="size-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-muted-foreground">
                        {tutor.displayName?.charAt(0) || "T"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{tutor.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {Array.isArray(tutor.subjects) ? tutor.subjects.map(s => typeof s === 'object' ? s.name : s).slice(0, 3).join(", ") : tutor.location || "Tutor"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.tuitions.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <BookOpen size={12} className="text-primary" /> Tuitions
                  </p>
                  {suggestions.tuitions.map((tuition) => (
                    <button
                      key={tuition._id}
                      onClick={() => {
                        setShowSuggestions(false);
                        navigate(`/tuition/${tuition._id}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    >
                      <div className="size-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen size={14} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{tuition.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {tuition.location || tuition.class_name || "Tuition"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.organizations?.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Building2 size={12} className="text-primary" /> Institutions
                  </p>
                  {suggestions.organizations.map((org) => (
                    <button
                      key={org._id}
                      onClick={() => {
                        setShowSuggestions(false);
                        navigate(`/organizations/${org.slug || org._id}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    >
                      <div className="size-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/40">
                        {org.profile?.logo ? (
                          <img src={org.profile.logo} alt={org.name} className="size-full object-cover" />
                        ) : (
                          <Building2 size={14} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
                          {org.name}
                          {org.verificationStatus === "verified" && (
                            <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {org.profile?.address || (org.type ? org.type.replace(/_/g, " ") : "Educational Institution")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Tabs when we have results or are loading */}
        {totalResults > 0 && !loading && (
          <div className="flex items-center justify-between gap-2 mb-6 border-b border-border pb-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap",
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                All ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab("tutors")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap",
                  activeTab === "tutors"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <User size={13} /> Tutors ({tutors.length})
              </button>
              <button
                onClick={() => setActiveTab("tuitions")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap",
                  activeTab === "tuitions"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <BookOpen size={13} /> Tuitions ({tuitions.length})
              </button>
              <button
                onClick={() => setActiveTab("organizations")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap",
                  activeTab === "organizations"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Building2 size={13} /> Institutions ({organizations.length})
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowUpDown size={12} />
              <span className="hidden sm:inline">Use &uarr;&darr; to navigate, Enter to open</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            <div>
              <Skeleton className="h-5 w-32 rounded-lg mb-4" />
              <TutorCardGridSkeleton count={4} />
            </div>
            <div>
              <Skeleton className="h-5 w-32 rounded-lg mb-4" />
              <TuitionCardGridSkeleton count={4} />
            </div>
          </div>
        ) : null}

        {!loading && debouncedQuery.length >= 2 && totalResults === 0 && (
          <div className="text-center py-20 bg-card/40 border border-border/60 rounded-2xl p-8">
            <Search size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-semibold text-foreground mb-1">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">
              Try searching by subject name (e.g. Physics, Math), location (e.g. Dhanmondi, Gulshan), or institution name.
            </p>
          </div>
        )}

        {totalResults > 0 && !loading && (
          <div ref={resultsRef} className="space-y-10">
            {/* Organizations Section */}
            {(activeTab === "all" || activeTab === "organizations") && organizations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-black text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Building2 className="size-4 text-primary" /> Educational Institutions ({organizations.length})
                  </h2>
                  <Link
                    to="/organizations"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    View All Directory <ChevronRight size={13} />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {organizations.map((org, idx) => {
                    const globalIdx = tutors.length + tuitions.length + idx;
                    return (
                      <div
                        key={org._id}
                        data-result-index={globalIdx}
                        className={cn(
                          "group bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between",
                          activeIndex === globalIdx && "ring-2 ring-primary"
                        )}
                      >
                        <div>
                          <div className="flex items-start gap-3 mb-3">
                            <div className="size-12 rounded-xl bg-muted border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
                              {org.profile?.logo ? (
                                <img src={org.profile.logo} alt={org.name} className="size-full object-cover" />
                              ) : (
                                <Building2 className="size-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate flex items-center gap-1">
                                {org.name}
                                {org.verificationStatus === 'verified' && (
                                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                )}
                              </h3>
                              <p className="text-xs text-muted-foreground">/{org.slug}</p>
                              {org.type && (
                                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase bg-primary/10 text-primary rounded">
                                  {org.type.replace(/_/g, " ")}
                                </span>
                              )}
                            </div>
                          </div>
                          {org.profile?.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                              {org.profile.description}
                            </p>
                          )}
                          {org.profile?.address && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                              <MapPin size={11} className="shrink-0 text-muted-foreground/70" />
                              <span className="truncate">{org.profile.address}</span>
                            </p>
                          )}
                        </div>
                        <Link
                          to={`/organizations/${org.slug || org._id}`}
                          className="mt-2 w-full py-2 bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                        >
                          View Institution <ChevronRight size={13} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tutors & Tuitions Sections */}
            <div className={cn(
              "grid gap-6",
              activeTab === "all" ? "md:grid-cols-2" : "grid-cols-1"
            )}>
              {(activeTab === "all" || activeTab === "tutors") && (
                <div>
                  <h2 className="font-heading font-black text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                    <User className="size-4 text-primary" /> Tutors ({tutors.length})
                  </h2>
                  <div className="space-y-3">
                    {tutors.length === 0 && (
                      <p className="text-sm text-muted-foreground">No tutors found for this search.</p>
                    )}
                    {tutors.map((tutor, idx) => (
                      <div
                        key={tutor._id}
                        data-result-index={idx}
                        className={cn(
                          "rounded-xl transition-colors",
                          activeIndex === idx && "ring-2 ring-primary",
                        )}
                      >
                        <TutorCard tutor={tutor} searchQuery={debouncedQuery} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeTab === "all" || activeTab === "tuitions") && (
                <div>
                  <h2 className="font-heading font-black text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" /> Tuitions ({tuitions.length})
                  </h2>
                  <div className="space-y-3">
                    {tuitions.length === 0 && (
                      <p className="text-sm text-muted-foreground">No tuitions found for this search.</p>
                    )}
                    {tuitions.map((tuition, idx) => (
                      <div
                        key={tuition._id}
                        data-result-index={tutors.length + idx}
                        className={cn(
                          "rounded-xl transition-colors",
                          activeIndex === tutors.length + idx &&
                            "ring-2 ring-primary",
                        )}
                      >
                        <TuitionCard
                          tuition={tuition}
                          searchQuery={debouncedQuery}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && (!debouncedQuery || debouncedQuery.length < 2) && (
          <div className="text-center py-20 bg-card/30 border border-border/50 rounded-2xl p-8">
            <Search size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-semibold text-foreground mb-1">
              Find Tutors, Tuition Posts & Coaching Centers
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Type at least 2 characters to search across thousands of verified educators, student tuition requests, and registered institutions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
