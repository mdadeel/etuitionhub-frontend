import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { User, LogOut, Menu, X, Search, Bell, Sun, Moon, Plus } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import NotificationBell from "./NotificationBell";
import Logo from "./Logo";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import API_URL from "../../config/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, userRole } = useAuth();
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
  };

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions({ tutors: [], tuitions: [] });
      return;
    }
    const controller = new AbortController();
    fetch(
      `${API_URL}/api/search/suggest?q=${encodeURIComponent(debouncedQuery)}`,
      { signal: controller.signal },
    )
      .then((r) => r.json())
      .then((data) => setSuggestions(data))
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await logout();
      Cookies.set("token", "");
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
    ...(userRole !== "tutor" 
      ? [{ path: "/become-tutor", label: t("nav.become_tutor", "Become Tutor") }] 
      : []),
    { path: "/about", label: t("nav.about", "About") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full h-16",
        "bg-background border-b border-border",
        isScrolled ? "shadow-sm shadow-[rgba(0,0,0,0.04)]" : "",
      )}
    >
      <div className="container-premium flex items-center justify-between h-full">
        {/* Left Section: Calm Academic Branding */}
        <div className="flex items-center gap-8">
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
            className="hidden lg:flex items-center gap-8"
            data-tour="find-tutors"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "text-muted-foreground hover:text-foreground transition-colors duration-300 font-label text-xs tracking-wide",
                    isActive && "text-foreground",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Center Section: Calm Search */}
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
              placeholder="Search tutors..."
              className="w-full pl-10 pr-4 h-10 rounded-lg text-sm bg-muted border border-border !text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 placeholder:text-muted-foreground"
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
                      <div className="px-4 py-2 text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
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
                      <div className="px-4 py-2 text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
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
                              <p className="text-[10px] text-[#94A3B8]">
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
                      <div className="px-4 py-2 text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
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
                            <p className="text-[10px] text-[#94A3B8]">
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
                      className="block px-4 py-3 text-center text-xs font-heading font-bold uppercase tracking-wider text-[#2563EB] border-t border-border hover:bg-background transition-colors"
                    >
                      View All Results &rarr;
                    </Link>
                  )}
                </div>
              )}
          </form>
        </div>

        {/* Right Section: Calm Authentication */}
        <div className="flex items-center justify-end gap-6">
          {/* Post Tuition Action Button */}
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

          {user ? (
            <div className="flex items-center gap-5">
              {/* Theme Toggle - icon only */}
              <button
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-300"
                aria-label={theme === "light" ? "Dark Mode" : "Light Mode"}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* Notification Bell */}
              <NotificationBell />

              {/* User Avatar with Dropdown */}
              <div className="relative group">
                <div className="size-9 bg-muted border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-300">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center bg-background text-muted-foreground text-xs font-heading">
                      {user.displayName?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
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
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-background transition-all"
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <div className="h-px bg-border" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all text-left"
                    >
                      <LogOut size={16} /> Logout Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-label text-xs tracking-wide"
              >
                {t("nav.login", "Sign In")}
              </Link>
              <Link
                to="/register"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-label text-xs tracking-wide transition-all duration-300 hover:shadow-md"
              >
                {t("nav.get_started", "Get Started")}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - calm, welcoming */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[100%] left-0 right-0 bg-background border-b border-border shadow-xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="container-premium py-5">
            <form onSubmit={handleSearch} className="mb-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tutors..."
                className="w-full pl-10 pr-4 h-11 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
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
                        ? "bg-[#2563EB] text-white shadow-sm"
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
      )}
    </header>
  );
};

export default Navbar;
