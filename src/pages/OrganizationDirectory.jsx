import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import {
  Building2,
  Search,
  MapPin,
  BookOpen,
  Filter,
  Compass,
  School,
  X,
  ShieldCheck,
  ArrowUpDown,
  ChevronDown,
  RotateCcw,
  GraduationCap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import SEO from "@/components/shared/SEO";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BANGLADESH_DIVISIONS } from "../utils/constants";
import { cn } from "@/lib/utils";
import OrgAdmissionModal from "../components/Organizations/OrgAdmissionModal";
import OrganizationCard from "../components/Organizations/OrganizationCard";
import useDebouncedValue from "../hooks/useDebouncedValue";

const TYPE_LABELS = Object.freeze({
  coaching_center: "Coaching Center",
  school: "School",
  college: "College",
  academy: "Training Academy",
  other: "Institution",
});

const getTypeLabel = (type) => {
  if (type && Object.prototype.hasOwnProperty.call(TYPE_LABELS, type)) {
    return TYPE_LABELS[type];
  }
  return "Institution";
};

const CATEGORIES = [
  { id: "all", label: "All Institutions", icon: Compass },
  { id: "coaching_center", label: "Coaching Centers", icon: BookOpen },
  { id: "school", label: "Schools & Colleges", icon: School },
  { id: "academy", label: "Academies & Bootcamps", icon: GraduationCap },
];

function OrgCardSkeleton() {
  return (
    <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
      <div>
        <Skeleton className="h-32 sm:h-36 w-full rounded-none" />
        <div className="px-5 -mt-8 mb-3">
          <Skeleton className="size-16 rounded-2xl ring-2 ring-card" />
        </div>
        <div className="px-5 space-y-3">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-4/5 rounded-md" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="p-5 pt-4 flex gap-2.5">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-20 rounded-xl" />
      </div>
    </div>
  );
}

const OrganizationDirectory = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [organizations, setOrganizations] = useState([]);
  const [myOrgs, setMyOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mobile Filter Drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filters state initialized from URL
  const [search, setSearch] = useState(() => searchParams.get("search") || searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("type") || "all");
  const [selectedDivision, setSelectedDivision] = useState(() => searchParams.get("district") || searchParams.get("division") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(() => searchParams.get("verified") === "true");
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "newest");

  const debouncedSearch = useDebouncedValue(search, 300);

  // Admission Modal state
  const [selectedOrgForAdmission, setSelectedOrgForAdmission] = useState(null);

  // Desktop collapsible header on scroll
  const [scrolled, setScrolled] = useState(false);

  const handleMainScroll = (e) => {
    if (e.currentTarget.scrollTop > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // Lock body scroll on mobile drawer open
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

  // Sync state to URL search parameters
  useEffect(() => {
    const params = {};
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (activeCategory !== "all") params.type = activeCategory;
    if (selectedDivision) params.district = selectedDivision;
    if (verifiedOnly) params.verified = "true";
    if (sortBy !== "newest") params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, activeCategory, selectedDivision, verifiedOnly, sortBy, setSearchParams]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (debouncedSearch.trim()) queryParams.set("search", debouncedSearch.trim());
      if (activeCategory !== "all") queryParams.set("type", activeCategory);
      if (selectedDivision) queryParams.set("district", selectedDivision);
      if (verifiedOnly) queryParams.set("verified", "true");
      if (sortBy) queryParams.set("sort", sortBy);

      const [orgsRes, myOrgsRes] = await Promise.all([
        api.get(`/api/v1/organizations?${queryParams.toString()}`),
        user
          ? api.get("/api/v1/organizations/my/orgs").catch(() => ({ data: { data: [] } }))
          : { data: { data: [] } },
      ]);
      setOrganizations(orgsRes.data.data || []);
      setMyOrgs(myOrgsRes.data.data || []);
    } catch {
      toast.error(t("org.failed_to_load", "Failed to load organizations"));
    } finally {
      setLoading(false);
    }
  }, [user, debouncedSearch, activeCategory, selectedDivision, verifiedOnly, sortBy, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isMember = (orgId) => myOrgs.some((m) => m._id === orgId);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("all");
    setSelectedDivision("");
    setVerifiedOnly(false);
    setSortBy("newest");
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = Boolean(
    search.trim() || activeCategory !== "all" || selectedDivision || verifiedOnly || sortBy !== "newest"
  );

  return (
    <div className="bg-background text-foreground lg:h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <SEO
        title="Educational Institutions & Coaching Centers | eTuitionBD"
        description="Discover verified coaching centers, schools, colleges, and training academies across Bangladesh."
      />

      <div className="w-full px-4 md:px-6 lg:px-8 py-6 flex flex-col flex-1 min-h-0">
        {/* Header matching Tutors and Tuitions pages */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden shrink-0",
            scrolled
              ? "max-h-0 opacity-0 mb-0 pointer-events-none"
              : "max-h-[250px] opacity-100 mb-6"
          )}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/70">
            <div>
              <h1 className="text-2xl font-heading text-foreground tracking-tight leading-none mb-2">
                {t("org.heading_prefix", "Find Verified")}{" "}
                <span className="text-primary">
                  {t("org.heading_suffix", "Institutions & Coaching Centers")}
                </span>
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                {t(
                  "org.discover_desc",
                  "Explore verified academic batches, board coaching, Cambridge/Edexcel programs, and training academies across Bangladesh."
                )}
              </p>
            </div>

            {/* Integrated Trust & Stats Bar */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center divide-x divide-border rounded-xl border border-border/80 bg-card px-3.5 py-2 shadow-xs text-xs text-foreground">
                <div className="flex items-center gap-2 pr-3.5">
                  <span className="text-base font-bold text-foreground leading-none">
                    {organizations.length}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                    {t("common.institutions", "Institutions")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pl-3.5">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-semibold text-foreground tracking-wide">
                    100% Verified Campuses
                  </span>
                </div>
              </div>

              {/* Mobile Filters Inline Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden px-3.5 py-2 bg-card border border-border rounded-xl shadow-xs flex items-center justify-center gap-2 hover:bg-muted active:scale-95 transition-all relative self-stretch cursor-pointer text-foreground"
                aria-label="Open filters"
              >
                <Filter className="size-4 text-primary" />
                <span className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                  {t("common.filters", "Filters")}
                </span>
                {hasActiveFilters && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-6 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t(
                "org.search_placeholder",
                "Search by name, subject or keyword..."
              )}
              className="w-full pl-10 pr-8 h-11 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-xs text-foreground placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left Filter Sidebar (1 col) + Right Content Area (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden">
          {/* LEFT SIDEBAR: FILTERS */}
          <aside
            className={cn(
              "lg:col-span-1 h-full",
              "fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs transition-opacity duration-200",
              "lg:relative lg:inset-auto lg:z-auto lg:bg-transparent",
              isMobileFiltersOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
            )}
          >
            <div
              className={cn(
                "bg-card w-full max-w-none h-[88vh] absolute bottom-0 lg:relative lg:bottom-auto lg:h-full p-6 lg:p-5 lg:rounded-2xl lg:border lg:border-border lg:shadow-xs transition-transform duration-300 rounded-t-3xl lg:rounded-2xl overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+1.5rem)] lg:pb-5 custom-scrollbar space-y-5",
                isMobileFiltersOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
              )}
            >
              {/* Mobile Drawer Handle & Header */}
              <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4 lg:hidden" />
              <div className="flex items-center justify-between pb-3 border-b border-border/60 lg:hidden">
                <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                  <Filter className="size-4 text-primary" />
                  <span>{t("common.filters", "Filters")}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Desktop Filter Header */}
              <div className="hidden lg:flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                  <Filter className="size-4 text-primary" />
                  <span>{t("common.filters", "Filters")}</span>
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <RotateCcw className="size-3" />
                    <span>{t("common.reset_all", "Reset all")}</span>
                  </button>
                )}
              </div>

              {/* Filter 1: Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {t("common.search", "Search")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t(
                      "org.search_placeholder",
                      "Search by name, subject or keyword..."
                    )}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-8 h-10 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter 2: Institution Types / Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  {t("org.categories_label", "Institution Type")}
                </label>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <CatIcon
                            className={cn(
                              "size-4 shrink-0",
                              isSelected ? "text-primary-foreground" : "text-primary"
                            )}
                          />
                          <span>{cat.label}</span>
                        </span>
                        {isSelected && (
                          <span className="size-2 rounded-full bg-primary-foreground shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter 3: Division / Location Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" />
                  <span>{t("common.division", "Division / Region")}</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className="w-full h-10 px-3 pr-8 bg-background border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    <option value="">{t("common.all_divisions", "All Divisions")}</option>
                    {BANGLADESH_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Filter 4: Verified Only Toggle */}
              <div className="pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setVerifiedOnly((prev) => !prev)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all select-none cursor-pointer",
                    verifiedOnly
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck
                      className={cn(
                        "size-4",
                        verifiedOnly
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      )}
                    />
                    <span>{t("common.verified_only", "Verified Campuses Only")}</span>
                  </span>
                  <span
                    className={cn(
                      "size-2.5 rounded-full transition-colors",
                      verifiedOnly ? "bg-emerald-500" : "bg-muted-foreground/30"
                    )}
                  />
                </button>
              </div>

              {/* Mobile Drawer Close Action */}
              <div className="pt-2 lg:hidden">
                <Button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full h-11 text-xs font-bold rounded-xl"
                >
                  {t("common.view_results", "View Results")} ({organizations.length})
                </Button>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT AREA: (AFFILIATED ORGS + CONTROLS + CARDS) */}
          <section
            onScroll={handleMainScroll}
            className="lg:col-span-3 min-w-0 space-y-6 pb-24 md:pb-6 overflow-y-auto custom-scrollbar pr-1 flex flex-col flex-1 min-h-0"
          >
            {/* User's Joined Organizations */}
            {myOrgs.length > 0 && (
              <div className="bg-card border border-primary/20 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold font-heading text-foreground flex items-center gap-2">
                      <Building2 className="size-4 text-primary" />
                      <span>
                        {t("org.my_affiliated", "My Affiliated Institutions")} ({myOrgs.length})
                      </span>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t(
                        "org.affiliated_desc",
                        "Institutions where you are enrolled as a student or active faculty member."
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                  {myOrgs.map((org) => (
                    <div
                      key={org._id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                          {org.profile?.logo ? (
                            <img
                              src={org.profile.logo}
                              alt={org.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <Building2 className="size-4.5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate">{org.name}</h4>
                          <span className="text-[10px] font-semibold text-primary uppercase">
                            {org.membership?.role?.name || "Active Member"}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/dashboard/org/${org._id}`}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors shrink-0"
                      >
                        {t("common.dashboard", "Dashboard")}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Directory Controls Bar */}
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                {/* Result count indicator */}
                <div className="inline-flex items-center gap-2 font-heading font-bold text-foreground text-sm sm:text-base">
                  <Building2 className="size-4.5 text-primary shrink-0" />
                  <span>
                    {loading ? "Searching..." : `${organizations.length} Institutions Found`}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {loading ? "..." : organizations.length}
                  </span>
                </div>

                {/* Styled Sort Dropdown */}
                <div className="relative flex items-center shrink-0 w-full sm:w-auto justify-end">
                  <ArrowUpDown className="size-3.5 absolute left-3 text-muted-foreground pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 pl-8 pr-8 bg-background border border-border rounded-xl text-xs font-semibold text-foreground hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all shadow-xs"
                  >
                    <option value="newest">{t("sort.newest_first", "Newest First")}</option>
                    <option value="popular">{t("sort.most_popular", "Most Popular")}</option>
                  </select>
                  <ChevronDown className="size-3 absolute right-2.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-border/50 text-xs">
                  <span className="text-[11px] font-medium text-muted-foreground mr-1">
                    {t("common.active_filters", "Active filters:")}
                  </span>
                  {search && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border/60 text-foreground font-medium text-[11px]">
                      &ldquo;{search}&rdquo;
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="text-muted-foreground hover:text-foreground ml-0.5 cursor-pointer"
                        aria-label="Remove search filter"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                  {activeCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border/60 text-foreground font-medium text-[11px]">
                      {t("common.category", "Category")}: {getTypeLabel(activeCategory)}
                      <button
                        type="button"
                        onClick={() => setActiveCategory("all")}
                        className="text-muted-foreground hover:text-foreground ml-0.5 cursor-pointer"
                        aria-label="Remove category filter"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                  {selectedDivision && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border/60 text-foreground font-medium text-[11px]">
                      <MapPin className="size-3 text-primary" />
                      <span>{selectedDivision}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedDivision("")}
                        className="text-muted-foreground hover:text-foreground ml-0.5 cursor-pointer"
                        aria-label="Remove division filter"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                  {verifiedOnly && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border/60 text-foreground font-medium text-[11px]">
                      <ShieldCheck className="size-3 text-emerald-500" />
                      <span>{t("common.verified_only", "Verified Only")}</span>
                      <button
                        type="button"
                        onClick={() => setVerifiedOnly(false)}
                        className="text-muted-foreground hover:text-foreground ml-0.5 cursor-pointer"
                        aria-label="Remove verified filter"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors ml-1 underline underline-offset-2 font-medium cursor-pointer"
                  >
                    {t("common.reset_all", "Reset all")}
                  </button>
                </div>
              )}
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <OrgCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && organizations.length === 0 && (
              <div className="text-center py-16 bg-card/40 border border-border/60 rounded-3xl p-8 max-w-xl mx-auto">
                <Building2 className="size-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-bold font-heading text-foreground mb-1">
                  {t("org.no_institutions_found", "No Educational Institutions Found")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  {t(
                    "org.no_institutions_desc",
                    "We couldn't find any institutions matching your selected criteria. Try resetting filters or searching with a broader keyword."
                  )}
                </p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold rounded-xl"
                >
                  {t("common.reset_filters", "Reset Filters")}
                </Button>
              </div>
            )}

            {/* Organizations Cards Grid with OrganizationCard */}
            {!loading && organizations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {organizations.map((org) => (
                  <OrganizationCard
                    key={org._id}
                    org={org}
                    isMember={isMember(org._id)}
                    onApply={(selected) => setSelectedOrgForAdmission(selected)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Admission / Inquiry Modal */}
      {selectedOrgForAdmission && (
        <OrgAdmissionModal
          open={Boolean(selectedOrgForAdmission)}
          onClose={() => setSelectedOrgForAdmission(null)}
          organization={selectedOrgForAdmission}
          onSuccess={() => fetchData()}
        />
      )}
    </div>
  );
};

export default OrganizationDirectory;
