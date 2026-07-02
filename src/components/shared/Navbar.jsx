import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { User, LogOut, Menu, X, Search, Sun, Moon, Plus } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import NotificationBell from "./NotificationBell";
import Logo from "./Logo";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import API_URL from "../../config/api";
import PoruaLogo from "../AiAssistant/PoruaLogo";

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
  const [suggestions, setSuggestions] = useState({ tutors: [], tuitions: [] });
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
      setSuggestions({ tutors: [], tuitions: [] });
      return;
    }
    const controller = new AbortController();
    fetch(
      `${API_URL}/api/search/combined?q=${encodeURIComponent(debouncedQuery)}&limit=5`,
      { signal: controller.signal },
    )
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.tutors) && Array.isArray(data.tuitions)) {
          setSuggestions(data);
        } else {
          setSuggestions({ tutors: [], tuitions: [] });
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
    const toastId = toast.loading("Logging out...");
    try {
      await logout();
      toast.dismiss(toastId);
      toast.success("Session ended.");
      setTimeout(() => navigate("/login"), 500);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      toast.dismiss(toastId);
    }
  };

  // Dynamic navigation links
  const navLinks = [
    { path: "/tutors", label: t("nav.find_tutors", "Find Tutors") },
    { path: "/tuitions", label: t("nav.tuitions", "Subjects") },
    ...(user
      ? [{ path: "/ai-assistant", label: t("nav.ai_tutor", "Porua AI"), icon: (props) => <PoruaLogo iconOnly {...props} /> }]
      : []),
    ...(userRole !== "tutor" && !user
      ? [{ path: "/become-tutor", label: t("nav.become_tutor", "Become Tutor") }]
      : []),
    { path: "/about", label: t("nav.about", "About") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full h-14 md:h-16",
        "bg-background border-b border-border",
        isScrolled ? "shadow-sm shadow-[rgba(0,0,0,0.04)]" : "",
      )}
    >
      {/* Mobile Search Overlay */}
      {!isAuthPage && isMobileSearchOpen && (
        <div className="absolute inset-0 bg-background z-50 flex items-center px-4 md:hidden animate-in fade-in duration-200">
          <form onSubmit={handleSearch} className="w-full flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              aria-label="Close search overlay"
            >
              <X size={20} />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search tutors by subject or location…"
                autoComplete="off"
                className="w-full pl-9 pr-4 h-10 rounded-lg text-sm bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
              <button
                type="submit"
                className="px-4 h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-lg transition-all active:scale-95 shadow-sm"
              >
              Search
            </button>
          </form>
        </div>
      )}
      <div className="container-premium flex items-center justify-between h-full">
        {/* Left Section: Calm Academic Branding */}
        <div className="flex items-center gap-6">
          <Link to="/" className="shrink-0">
            <Logo 
              boxSize="size-10" 
              iconSize="size-6" 
              textSize="text-xl" 
              className="hidden sm:flex" 
            />
            <Logo 
              boxSize="size-10" 
              iconSize="size-6" 
              showText={false} 
              className="sm:hidden" 
            />
          </Link>

          {/* Editorial Navigation - calm, intentional spacing */}
          <nav
            className="hidden lg:flex items-center gap-6"
            data-tour="find-tutors"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isAi = link.path === "/ai-assistant";
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "transition-colors duration-300 font-label text-xs tracking-wide flex items-center gap-1.5",
                      isAi
                        ? "text-primary hover:text-primary/80"
                        : "text-muted-foreground hover:text-foreground",
                      isActive && !isAi && "text-foreground",
                    )
                  }
                >
                  {Icon && <Icon size={13} strokeWidth={2.5} className="animate-pulse" />}
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Center Section: Calm Search */}
        {!isAuthPage && (
        <div className="hidden md:flex flex-1 justify-center max-w-sm mx-8">
          <form
            onSubmit={handleSearch}
            className="w-full relative"
            data-tour="search-bar"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tutors by subject or location…"
              autoComplete="off"
              className="w-full pl-10 pr-4 h-10 rounded-lg text-sm bg-muted border border-border !text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300 placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
            {/* Autocomplete Dropdown */}
            {showDropdown &&
              (searchQuery.length >= 2 || recentSearches.length > 0) && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border shadow-lg rounded-xl overflow-hidden z-50"
                >
                  {searchQuery.length >= 2 &&
                    suggestions.tutors.length === 0 &&
                    suggestions.tuitions.length === 0 && (
                      <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                        No results for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}

                  {/* Recent Searches */}
                  {searchQuery.length < 2 && recentSearches.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                        Recent Searches
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
                          className="w-full px-4 py-2 text-sm text-left text-muted-foreground hover:bg-background flex items-center gap-2"
                        >
                          <Search size={12} />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tutor Suggestions */}
                  {suggestions.tutors.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                        Tutors
                      </div>
                      {suggestions.tutors.map((tutor) => (
                        <Link
                          key={tutor._id}
                          to={`/tutor/${tutor._id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-background transition-colors"
                        >
                          <div className="size-8 bg-background rounded-full flex items-center justify-center text-xs font-heading font-bold text-muted-foreground">
                            {tutor.displayName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {tutor.displayName}
                            </p>
                            {tutor.subjects && (
                              <p className="text-xs text-muted-foreground">
                                {tutor.subjects}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Tuition Suggestions */}
                  {suggestions.tuitions.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                        Tuitions
                      </div>
                      {suggestions.tuitions.map((tuition) => (
                        <Link
                          key={tuition._id}
                          to={`/tuition/${tuition._id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-background transition-colors"
                        >
                          <div className="size-8 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-muted-foreground">
                              T
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {tuition.subject}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {tuition.location} &bull; {tuition.class_name}
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
                      className="block px-4 py-3 text-center text-xs font-medium text-primary border-t border-border hover:bg-background transition-colors"
                    >
                      View All Results &rarr;
                    </Link>
                  )}
                </div>
              )}
          </form>
        </div>
        )}

        {/* Right Section: Calm Authentication */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          {/* Post Tuition Action Button (students only) */}
          {userRole === "student" && (
            <div className="hidden sm:flex items-center">
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-[11px] uppercase tracking-[0.08em] gap-1.5 px-4 h-9 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 active:scale-95"
              >
                <Link to="/post-tuition">
                  <Plus size={14} strokeWidth={2.5} />
                  <span>{t("nav.post_tuition_btn", "Post Tuition")}</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Theme & Search Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-300"
              aria-label={theme === "light" ? "Dark Mode" : "Light Mode"}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {!isAuthPage && (
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-300 md:hidden"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            )}

            {user && <NotificationBell />}
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              {/* User Avatar with Dropdown */}
              <div ref={profileDropdownRef} className="relative hidden md:block">
                <button
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="size-9 bg-muted border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-300 block focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
                >
                  <Avatar size="sm" className="size-9 rounded-lg">
                    <AvatarImage src={dbUser?.photoURL || user?.photoURL} alt={dbUser?.displayName || user?.displayName} />
                    <AvatarFallback className="bg-background text-muted-foreground text-xs font-heading rounded-lg">
                      {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown */}
                <div
                  className={cn(
                    "absolute right-0 top-full pt-2 transition-all duration-200 z-50",
                    isProfileDropdownOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="w-52 bg-card border border-border shadow-xl rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-heading text-foreground truncate">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-primary font-label tracking-wider mt-0.5">
                        {userRole || "Member"}
                      </p>
                    </div>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-background transition-all"
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <div className="h-px bg-border" />
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all text-left"
                    >
                      <LogOut size={16} /> Logout Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-label text-xs tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background rounded px-2 py-1 -mx-2 -my-1"
              >
                {t("nav.login", "Sign In")}
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
              >
                {t("nav.get_started", "Get Started")}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle (Removed as requested) */}
        </div>
      </div>

      {/* Mobile Menu - calm, welcoming */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 top-14 bg-background/60 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="lg:hidden absolute top-[100%] left-0 right-0 bg-background border-b border-border shadow-xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="container-premium py-4">
              {!isAuthPage && (
              <form onSubmit={handleSearch} className="mb-4 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tutors by subject or location…"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 h-11 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              )}
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "px-4 py-3 text-sm font-heading transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
