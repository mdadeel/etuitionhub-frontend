import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  Users,
  BookOpen,
  Building2,
  UserPlus,
  Sparkles,
  LayoutDashboard,
  MessageCircle,
  Wallet,
  Calendar,
  BookmarkIcon,
  User,
  Settings,
  Shield,
  BarChart3,
  CreditCard,
  FileText,
  LogOut,
  Plus,
  Moon,
  Sun,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const fuzzyMatch = (query, target) => {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
};

const scoreItem = (query, item) => {
  if (!query) return 1;
  const q = query.toLowerCase();
  if (item.path?.toLowerCase() === q) return 100;
  if (item.label.toLowerCase().startsWith(q)) return 50;
  if (item.label.toLowerCase().includes(q)) return 30;
  if (item.keywords?.some((k) => k.toLowerCase().includes(q))) return 20;
  if (item.section?.toLowerCase().includes(q)) return 10;
  return 1;
};

const CommandPalette = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { dbUser, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const isAdmin = dbUser?.globalRole === "super_admin";
  const isTutor = dbUser?.role === "tutor";
  const isLoggedIn = !!user;

  const items = useMemo(() => {
    const list = [
      {
        section: "Navigate",
        label: "Home",
        path: "/",
        icon: Home,
        keywords: ["home", "landing", "main"],
      },
      {
        section: "Navigate",
        label: "Find Tutors",
        path: "/tutors",
        icon: Users,
        keywords: ["tutors", "find", "browse", "search"],
      },
      {
        section: "Navigate",
        label: "Browse Tuitions",
        path: "/tuitions",
        icon: BookOpen,
        keywords: ["tuitions", "jobs", "browse"],
      },
      {
        section: "Navigate",
        label: "Organizations",
        path: "/organizations",
        icon: Building2,
        keywords: ["organizations", "coaching", "centers"],
      },
      {
        section: "Navigate",
        label: "AI Assistant",
        path: "/ai-assistant",
        icon: Sparkles,
        keywords: ["ai", "porua", "assistant", "tutor tools"],
        requiresAuth: true,
      },
      {
        section: "Navigate",
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        keywords: ["dashboard", "home", "main"],
        requiresAuth: true,
      },
      {
        section: "Navigate",
        label: "Messages",
        path: "/dashboard/connections",
        icon: MessageCircle,
        keywords: ["messages", "chat", "inbox"],
        requiresAuth: true,
      },
      {
        section: "Navigate",
        label: "Calendar",
        path: "/dashboard/sessions",
        icon: Calendar,
        keywords: ["calendar", "sessions", "schedule"],
        requiresAuth: true,
      },
      {
        section: "Navigate",
        label: "Wallet",
        path: "/dashboard/wallet",
        icon: Wallet,
        keywords: ["wallet", "earnings", "money", "payout"],
        requiresAuth: true,
      },
      {
        section: "Navigate",
        label: "Bookmarks",
        path: "/dashboard/bookmarks",
        icon: BookmarkIcon,
        keywords: ["bookmarks", "saved"],
        requiresAuth: true,
      },
      {
        section: "Navigate",
        label: "Profile",
        path: "/dashboard/profile",
        icon: User,
        keywords: ["profile", "account", "settings"],
        requiresAuth: true,
      },
      {
        section: "Navigate",
        label: "Notifications",
        path: "/dashboard/notifications",
        icon: FileText,
        keywords: ["notifications", "alerts"],
        requiresAuth: true,
      },
      {
        section: "Navigate",
        label: "Billing",
        path: "/dashboard/billing",
        icon: CreditCard,
        keywords: ["billing", "payments", "history"],
        requiresAuth: true,
      },
    ];

    if (isAdmin) {
      list.push(
        {
          section: "Admin",
          label: "Platform Overview",
          path: "/super-admin",
          icon: BarChart3,
          keywords: ["admin", "overview", "platform", "metrics"],
        },
        {
          section: "Admin",
          label: "All Users",
          path: "/super-admin/users",
          icon: Users,
          keywords: ["admin", "users", "manage"],
        },
        {
          section: "Admin",
          label: "Verifications",
          path: "/super-admin/verifications",
          icon: Shield,
          keywords: ["admin", "verifications", "tutor", "kyc"],
        },
        {
          section: "Admin",
          label: "Payments",
          path: "/super-admin/payments",
          icon: CreditCard,
          keywords: ["admin", "payments", "transactions"],
        },
        {
          section: "Admin",
          label: "Withdrawals",
          path: "/super-admin/withdrawals",
          icon: Wallet,
          keywords: ["admin", "withdrawals", "payouts"],
        },
        {
          section: "Admin",
          label: "Organizations",
          path: "/super-admin/organizations",
          icon: Building2,
          keywords: ["admin", "organizations", "coaching"],
        },
        {
          section: "Admin",
          label: "Settings",
          path: "/super-admin/settings",
          icon: Settings,
          keywords: ["admin", "settings", "config"],
        },
      );
    }

    list.push(
      {
        section: "Action",
        label: "Post a Tuition",
        path: "/post-tuition",
        icon: Plus,
        keywords: ["post", "create", "tuition", "job"],
        action: "navigate",
      },
      {
        section: "Action",
        label: "Become a Tutor",
        path: "/become-tutor",
        icon: UserPlus,
        keywords: ["become", "tutor", "register", "apply"],
        action: "navigate",
      },
    );

    if (isLoggedIn) {
      list.push({
        section: "Action",
        label: "Toggle Theme",
        icon: theme === "light" ? Moon : Sun,
        keywords: ["theme", "dark", "light", "mode"],
        action: "toggleTheme",
      });
      list.push({
        section: "Action",
        label: "Sign Out",
        icon: LogOut,
        keywords: ["logout", "signout", "exit"],
        action: "logout",
      });
    }

    return list.filter(
      (item) => !item.requiresAuth || isLoggedIn,
    );
  }, [isAdmin, isTutor, isLoggedIn, theme]);

  const filtered = useMemo(() => {
    const q = query.trim();
    const matched = items.filter(
      (item) =>
        fuzzyMatch(q, item.label) ||
        fuzzyMatch(q, item.section) ||
        item.keywords?.some((k) => fuzzyMatch(q, k)),
    );
    return matched
      .map((item) => ({ item, score: scoreItem(q, item) }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`,
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const runItem = (item) => {
    onOpenChange(false);
    if (item.action === "toggleTheme") {
      toggleTheme();
      return;
    }
    if (item.action === "logout") {
      logout();
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) runItem(item);
    }
  };

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((item) => {
      if (!groups[item.section]) groups[item.section] = [];
      groups[item.section].push(item);
    });
    return groups;
  }, [filtered]);

  let globalIndex = 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl p-0 gap-0 overflow-hidden sm:rounded-xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search and navigate the platform quickly
        </DialogDescription>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, actions, or anything…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            autoComplete="off"
            spellCheck="false"
            data-testid="command-palette-input"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 h-5 text-[10px] font-mono font-medium text-muted-foreground bg-background border border-border rounded">
            ESC
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto py-1.5"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              <HelpCircle className="size-6 mx-auto mb-2 text-muted-foreground/50" />
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            Object.entries(grouped).map(([section, sectionItems]) => (
              <div key={section} className="px-1.5 pb-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {section}
                </div>
                {sectionItems.map((item) => {
                  const Icon = item.icon;
                  const idx = globalIndex++;
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={`${section}-${item.label}`}
                      data-index={idx}
                      onClick={() => runItem(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm rounded-lg transition-colors",
                        isActive
                          ? "bg-primary/10 text-foreground"
                          : "text-foreground/80 hover:bg-muted",
                      )}
                      role="option"
                      aria-selected={isActive}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      )}
                      <span className="flex-1 truncate font-medium">
                        {item.label}
                      </span>
                      {item.path && !item.action && (
                        <ChevronRight
                          className={cn(
                            "size-3.5 shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground/50",
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 h-4 font-mono bg-background border border-border rounded text-[10px]">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 h-4 font-mono bg-background border border-border rounded text-[10px]">
                ↵
              </kbd>
              select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1 h-4 font-mono bg-background border border-border rounded text-[10px]">
              ⌘K
            </kbd>
            to open
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
