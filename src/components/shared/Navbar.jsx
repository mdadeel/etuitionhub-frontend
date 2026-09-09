import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { User, LogOut, Menu, X, Search, Sun, Moon, Plus, Building2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import NotificationBell from "./NotificationBell";
import Logo from "./Logo";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import API_URL from "../../config/api";
import PoruaLogo from "../AiAssistant/PoruaLogo";
import { isAdminPath } from "../../lib/authz";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, dbUser, logout, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const searchInputRef = useRef(null);
  const [suggestions, setSuggestions] = useState({ tutors: [], tuitions: [], organizations: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recent-searches") || "[]");
    } catch {
      return [];
    }
  });
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const isAuthPage = ["/login", "/register", "/admin-login", "/password-reset", "/reset-password"].includes(location.pathname);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) setSearchQuery(q);
    else if (location.pathname !== "/tutors") setSearchQuery("");
  }, [location]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      if (location.pathname === "/tutors") navigate("/tutors");
      return;
    }

    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    localStorage.setItem("recent-searches", JSON.stringify(updated));
    setRecentSearches(updated);

    navigate(`/search?q=${encodeURIComponent(q)}`);
    setShowDropdown(false);
    setIsMobileSearchOpen(false);
  };

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions({ tutors: [], tuitions: [], organizations: [] });
      return;
    }
    const controller = new AbortController();
    fetch(
      `${API_URL}/api/search/combined?q=${encodeURIComponent(debouncedQuery)}&limit=5`,
      { signal: controller.signal, credentials: "include" },
    )
      .then((r) => r.json())
      .then((data) => {
        if (data && (Array.isArray(data.tutors) || Array.isArray(data.tuitions) || Array.isArray(data.organizations))) {
          setSuggestions({
            tutors: data.tutors || [],
            tuitions: data.tuitions || [],
            organizations: data.organizations || []
          });
        } else {
          setSuggestions({ tutors: [], tuitions: [], organizations: [] });
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [debouncedQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Session ended.");
    navigate(isAdminPath(location.pathname) ? "/admin-login" : "/login", { replace: true });
  };

  // Center Navigation Tabs (Core Product Features)
  const centerNavTabs = [
    { path: "/tutors", label: t("nav.find_tutors", "Find Tutors") },
    { path: "/tuitions", label: t("nav.tuitions", "Tuitions") },
    { path: "/organizations", label: t("nav.organizations", "Institutions") },
    {
      path: "/ai-assistant",
      label: t("nav.ai_tutor", "Porua AI"),
      icon: ({ className } = {}) => <PoruaLogo iconOnly size={18} className={className} />,
    },
  ];

  // Mobile Drawer Navigation Links
  const mobileNavLinks = [
    ...centerNavTabs,
    ...(userRole !== "tutor" && !user
      ? [{ path: "/become-tutor", label: t("nav.become_tutor", "Become Tutor") }]
      : []),
    { path: "/tutor-earnings", label: t("nav.tutor_earnings", "Tutor Earnings") },
    { path: "/about", label: t("nav.about", "About") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200 w-full h-16 bg-background/95 backdrop-blur-md border-b border-border/80",
        isScrolled ? "shadow-sm shadow-black/5" : ""
      )}
    >
      {/* Mobile Search Overlay */}
      {!isAuthPage && isMobileSearchOpen && (
        <div className="absolute inset-0 bg-background z-50 flex items-center px-4 md:hidden animate-in fade-in duration-200">
          <form onSubmit={handleSearch} className="w-full flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full transition-colors"
              aria-label="Close search overlay"
            >
              <X size={20} />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search tutors by subject or location…"
                autoComplete="off"
                className="w-full pl-9 pr-4 h-10 rounded-full text-sm bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-4 h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-full transition-all active:scale-95 shadow-sm"
            >
              {t("common.search", "Search")}
            </button>
          </form>
        </div>
      )}

      {/* Main 3-Column Navbar Container */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        
        {/* LEFT SECTION: [ LOGO + SEARCH ] */}
        <div className="flex items-center gap-3 shrink-0 flex-1 justify-start max-w-md min-w-0">
          {/* Mobile Navigation Drawer Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full md:hidden transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Platform Logo */}
          <div className="shrink-0 flex items-center">
            <Logo />
          </div>

          {/* Desktop Search Bar (Expandable + Keyboard-Aware) */}
          {!isAdminPath(location.pathname) && (
            <div className="relative hidden md:block w-full max-w-xs transition-all duration-300 focus-within:max-w-sm">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative w-full">
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    ref={searchInputRef}
                    type="search"
                    name="search"
                    placeholder={t("navbar.search_placeholder", "Search tutors by subject or location…")}
                    autoComplete="off"
                    aria-label="Search tutors"
                    className="w-full pl-10 pr-9 h-10 rounded-full text-xs font-medium bg-muted/60 hover:bg-muted focus:bg-background border border-border/80 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {showDropdown &&
                (searchQuery.length >= 2 || recentSearches.length > 0) && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150"
                  >
                    {searchQuery.length >= 2 &&
                      suggestions.tutors.length === 0 &&
                      suggestions.tuitions.length === 0 &&
                      (suggestions.organizations?.length || 0) === 0 && (
                        <div className="px-4 py-3 text-xs text-muted-foreground text-center">
                          {t("search.no_results_for", "No results for")} &ldquo;{searchQuery}&rdquo;
                        </div>
                      )}

                    {/* Recent Searches */}
                    {searchQuery.length < 2 && recentSearches.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40">
                          {t("search.recent_searches", "Recent Searches")}
                        </div>
                        {recentSearches.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const updated = [
                                s,
                                ...recentSearches.filter((rs) => rs !== s),
                              ].slice(0, 5);
                              localStorage.setItem(
                                "recent-searches",
                                JSON.stringify(updated),
                              );
                              setRecentSearches(updated);
                              setSearchQuery(s);
                              navigate(`/search?q=${encodeURIComponent(s)}`);
                              setShowDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-xs text-left text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center gap-2.5 transition-colors"
                          >
                            <Search size={14} className="text-muted-foreground/60" />
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tutor Suggestions */}
                    {suggestions.tutors.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40">
                          {t("nav.tutors", "Tutors")}
                        </div>
                        {suggestions.tutors.map((tutor) => (
                          <Link
                            key={tutor._id}
                            to={`/tutor/${tutor._id}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors"
                          >
                            <Avatar className="size-7">
                              <AvatarImage
                                src={tutor.photoURL}
                                alt={tutor.displayName}
                              />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {tutor.displayName?.[0] || "T"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-foreground truncate">
                                {tutor.displayName}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {tutor.qualification || tutor.location}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Tuition Suggestions */}
                    {suggestions.tuitions.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40">
                          {t("nav.tuitions", "Tuitions")}
                        </div>
                        {suggestions.tuitions.map((tuition) => (
                          <Link
                            key={tuition._id}
                            to={`/tuition/${tuition._id}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors"
                          >
                            <div className="size-7 bg-muted rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-muted-foreground">
                                T
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-foreground truncate">
                                {tuition.subject}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {tuition.location} &bull; {tuition.class_name}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Organization Suggestions */}
                    {suggestions.organizations?.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40">
                          {t("nav.organizations", "Institutions")}
                        </div>
                        {suggestions.organizations.map((org) => (
                          <Link
                            key={org._id}
                            to={`/organizations/${org.slug}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors"
                          >
                            {org.profile?.logo ? (
                              <img src={org.profile.logo} alt={org.name} className="size-7 rounded-lg object-cover" />
                            ) : (
                              <div className="size-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                <Building2 className="size-4 text-primary" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-foreground truncate">
                                {org.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {org.profile?.address || org.type?.replace(/_/g, ' ') || 'Educational Center'}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* View All */}
                    {searchQuery.length >= 2 && (
                      <Link
                        to={`/search?q=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2.5 text-center text-xs font-medium text-primary bg-muted/20 hover:bg-muted/50 border-t border-border/60 transition-colors"
                      >
                        {t("search.view_all_results", "View All Results")} &rarr;
                      </Link>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>

        {/* CENTER SECTION: [ MAIN NAVIGATION TABS ] - Perfectly Centered */}
        <div className="hidden lg:flex items-center justify-center flex-1 h-full max-w-xl mx-auto px-2" data-tour="find-tutors">
          <nav className="flex items-center gap-1 xl:gap-2 h-full">
            {centerNavTabs.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-2 px-4 xl:px-5 h-full text-xs xl:text-sm font-medium transition-all duration-200 select-none group",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {Icon && (
                        <Icon
                          size={18}
                          className={cn(
                            "transition-transform duration-200 group-hover:scale-105",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                      )}
                      <span>{link.label}</span>

                      {/* Facebook Modern Tab Active Bottom Indicator */}
                      {isActive && (
                        <span className="absolute bottom-0 inset-x-1.5 h-[3px] bg-primary rounded-t-full shadow-sm" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* RIGHT SECTION: [ CTA + USER ACTIONS ] */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 flex-1 max-w-md">
          {/* Mobile Search Button */}
          {!isAuthPage && (
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              className="size-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full transition-colors md:hidden"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          )}

          {/* Primary CTA: Post Tuition (Only high-emphasis action) */}
          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 px-3.5 sm:px-4 h-9 sm:h-10 rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-95 shrink-0"
          >
            <Link to="/post-tuition">
              <Plus size={15} strokeWidth={2.5} />
              <span className="hidden xs:inline">{t("nav.post_tuition_btn", "Post Tuition")}</span>
              <span className="xs:hidden">{t("nav.post", "Post")}</span>
            </Link>
          </Button>

          {/* Grouped Utility Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="size-9 sm:size-10 text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted rounded-full transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label={theme === "light" ? "Dark Mode" : "Light Mode"}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user && <NotificationBell />}
          </div>

          {/* Profile Avatar / Auth State */}
          {user ? (
            <div ref={profileDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="size-9 sm:size-10 bg-muted border border-border/80 rounded-full overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
                aria-label="User profile menu"
              >
                <Avatar size="sm" className="size-9 sm:size-10 rounded-full">
                  <AvatarImage src={dbUser?.photoURL || user?.photoURL} alt={dbUser?.displayName || user?.displayName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-muted/30 border-b border-border/60">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {user.displayName}
                    </p>
                    <p className="text-[11px] text-primary font-medium tracking-wide capitalize mt-0.5">
                      {userRole || "Member"}
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted/60 rounded-xl transition-all"
                    >
                      <User size={16} className="text-muted-foreground" /> My Profile
                    </Link>
                    <div className="my-1 h-px bg-border/60" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-all text-left"
                    >
                      <LogOut size={16} /> Logout Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-foreground text-xs font-medium px-3 py-2 rounded-full hover:bg-muted/60 transition-colors"
              >
                {t("nav.login", "Sign In")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-background/60 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="lg:hidden absolute top-[100%] left-0 right-0 bg-background border-b border-border shadow-xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="container-premium py-4">
              {!isAuthPage && (
                <form onSubmit={handleSearch} className="mb-4 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search tutors by subject or location…"
                    autoComplete="off"
                    className="w-full pl-10 pr-4 h-10 rounded-full bg-muted border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              )}
              <div className="flex flex-col gap-1">
                {mobileNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "px-4 py-3 text-xs font-semibold rounded-xl flex items-center gap-3 transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )
                      }
                    >
                      {Icon && <Icon size={16} />}
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
