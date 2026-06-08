import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowUpDown } from "lucide-react";
import TutorCard from "../components/shared/TutorCard";
import TuitionCard from "../components/shared/TuitionCard";
import useDebouncedValue from "../hooks/useDebouncedValue";
import API_URL from "../config/api";
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
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

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
          fetch(
            `${API_URL}/api/tutors/search?q=${encodeURIComponent(debouncedQuery)}&limit=10`,
            { signal: controller.signal },
          ).then((r) => r.json()),
          fetch(
            `${API_URL}/api/tuitions?search=${encodeURIComponent(debouncedQuery)}&limit=10&status=approved`,
            { signal: controller.signal },
          ).then((r) => r.json()),
        ]);
        setTutors(tutorsRes.data || []);
        const tuitionData = tuitionsRes.data || tuitionsRes.tuitions || [];
        setTuitions(tuitionData);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== "AbortError") {
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

  const totalResults = tutors.length + tuitions.length;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setInput("");
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
        if (activeIndex < tutors.length) {
          navigate(`/tutor/${tutors[activeIndex]._id}`);
        } else {
          navigate(`/tuition/${tuitions[activeIndex - tutors.length]._id}`);
        }
      }
    },
    [activeIndex, totalResults, tutors, tuitions, navigate],
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#94A3B8]" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tutors and tuitions..."
            className="w-full pl-12 pr-4 h-14 bg-card border border-border rounded-xl text-lg outline-none focus:ring-2 focus:ring-[#2563EB]/20 shadow-sm"
            autoFocus
          />
          {input && (
            <button
              onClick={() => {
                setInput("");
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

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
            <div className="flex items-center gap-2 mb-4 text-xs text-[#94A3B8]">
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
                        activeIndex === idx && "ring-2 ring-[#2563EB]",
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
                          "ring-2 ring-[#2563EB]",
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
            <Search size={48} className="mx-auto mb-4 text-[#E2E8F0]" />
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
