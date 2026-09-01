import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowUpDown, User, BookOpen } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState({ tutors: [], tuitions: [] });
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
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const fetchAll = async () => {
      try {
        const [tutorsRes, tuitionsRes] = await Promise.all([
          api.get(`/api/tutors/search?q=${encodeURIComponent(debouncedQuery)}&limit=10`, { signal: controller.signal }),
          api.get(`/api/tuitions?search=${encodeURIComponent(debouncedQuery)}&limit=10&status=approved`, { signal: controller.signal }),
        ]);
        setTutors(tutorsRes.data.data || []);
        const tuitionData = tuitionsRes.data.data || tuitionsRes.data.tuitions || [];
        setTuitions(tuitionData);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setTutors([]);
          setTuitions([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    return () => controller.abort();
  }, [debouncedQuery]);

  // Fetch suggestions for autocomplete dropdown
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions({ tutors: [], tuitions: [] });
      return;
    }
    const controller = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const res = await api.get(
          `/api/search/suggest?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        if (res.status === 200) {
          const data = res.data;
          setSuggestions({
            tutors: (data.tutors || []).slice(0, 5),
            tuitions: (data.tuitions || []).slice(0, 5),
          });
          setShowSuggestions(true);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setSuggestions({ tutors: [], tuitions: [] });
        }
      }
    };
    fetchSuggestions();
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

  const totalResults = tutors.length + tuitions.length;
  const totalSuggestions = suggestions.tutors.length + suggestions.tuitions.length;

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
        } else {
          navigate(`/tuition/${tuitions[activeIndex - tutors.length]._id}`);
        }
      }
    },
    [activeIndex, totalResults, tutors, tuitions, navigate, showSuggestions],
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
      <SEO title="Search Tutors & Tuitions | eTuitionBD" description="Search for verified private tutors and tuition opportunities across Bangladesh." />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tutors and tuitions..."
            className="w-full pl-12 pr-4 h-14 bg-card border border-border rounded-xl text-lg outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            autoFocus
          />
          {input && (
            <>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {debouncedQuery.length >= 2 && (
                  <SaveSearchButton query={debouncedQuery} />
                )}
                <button
                  onClick={() => {
                    setInput("");
                    inputRef.current?.focus();
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            </>
          )}
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && totalSuggestions > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
          >
            {suggestions.tutors.length > 0 && (
              <div className="p-2">
                <p className="px-3 py-1.5 text-[11px] font-label font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User size={10} /> Tutors
                </p>
                {suggestions.tutors.map((tutor) => (
                  <button
                    key={tutor._id}
                    onClick={() => {
                      setShowSuggestions(false);
                      navigate(`/tutor/${tutor._id}`);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                  >
                    <div className="size-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">
                        {tutor.displayName?.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{tutor.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {tutor.subjects?.slice(0, 3).join(", ") || "Tutor"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {suggestions.tuitions.length > 0 && (
              <div className={cn("p-2", suggestions.tutors.length > 0 && "border-t border-border")}>
                <p className="px-3 py-1.5 text-[11px] font-label font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen size={10} /> Tuitions
                </p>
                {suggestions.tuitions.map((tuition) => (
                  <button
                    key={tuition._id}
                    onClick={() => {
                      setShowSuggestions(false);
                      navigate(`/tuition/${tuition._id}`);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
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
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </p>
          </div>
        )}

        {totalResults > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
              <ArrowUpDown size={12} />
              Use &uarr;&darr; to navigate, Enter to open, Esc to clear
            </div>
            <div ref={resultsRef} className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-heading font-black text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Tutors ({tutors.length})
                </h2>
                <div className="space-y-3">
                  {tutors.length === 0 && (
                    <p className="text-sm text-muted-foreground">No tutors found</p>
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

              <div>
                <h2 className="font-heading font-black text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Tuitions ({tuitions.length})
                </h2>
                <div className="space-y-3">
                  {tuitions.length === 0 && (
                    <p className="text-sm text-muted-foreground">No tuitions found</p>
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
            </div>
          </>
        )}

        {!loading && (!debouncedQuery || debouncedQuery.length < 2) && (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-lg text-muted-foreground">
              Type at least 2 characters to search
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
