import { useRef, useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboardMenuItems } from "./getDashboardMenuItems";
import { cn } from "@/lib/utils";

const DashboardTopNav = () => {
  const location = useLocation();
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(Infinity);
  const [showMore, setShowMore] = useState(false);

  const { dbUser, orgContext, orgRole, hasPermission } = useAuth();
  const globalRole = dbUser?.globalRole;
  const legacyRole = dbUser?.role?.toLowerCase() || "student";

  const allItems = useMemo(
    () =>
      getDashboardMenuItems({
        globalRole,
        orgContext,
        orgRole,
        legacyRole,
        hasPermission,
      }),
    [globalRole, orgContext, orgRole, legacyRole, hasPermission],
  );

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const activeIndex = allItems.findIndex((item) => isActive(item.path));
  const activeItem = activeIndex >= 0 ? allItems[activeIndex] : null;

  const visibleItems = allItems.slice(0, visibleCount);
  const overflowItems = allItems.slice(visibleCount);

  // Measure how many items fit
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const children = Array.from(container.querySelectorAll("[data-nav-item]"));
      if (children.length === 0) return;

      const containerWidth = container.offsetWidth;
      let totalWidth = 0;
      let count = 0;

      for (const child of children) {
        totalWidth += child.offsetWidth;
        if (totalWidth > containerWidth - 60) break;
        count++;
      }

      setVisibleCount(Math.max(count, 1));
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    measure();

    return () => observer.disconnect();
  }, [allItems]);

  // Scroll active item into view
  useEffect(() => {
    const el = scrollRef.current?.querySelector("[data-active]");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [location.pathname]);

  if (allItems.length <= 1) return null;

  return (
    <div className="relative" ref={containerRef}>
      <nav
        ref={scrollRef}
        className="flex items-center gap-0 overflow-x-auto scrollbar-hide -mb-px"
      >
        {visibleItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              data-nav-item
              {...(active ? { "data-active": "" } : {})}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-[10px] font-label font-semibold uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors shrink-0",
                active
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/30",
              )}
            >
              <item.icon size={12} className={cn(active ? "text-primary" : "opacity-50")} />
              {item.label}
            </Link>
          );
        })}

        {overflowItems.length > 0 && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMore((p) => !p)}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-[10px] font-label font-semibold uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors",
                showMore
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/30",
              )}
            >
              <MoreHorizontal size={12} className="opacity-50" />
              More
            </button>

            {showMore && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMore(false)}
                />
                <div className="absolute top-full left-0 mt-1 z-50 min-w-[180px] bg-card border border-border rounded-lg shadow-lg py-1">
                  {overflowItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowMore(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-[10px] font-label font-semibold uppercase tracking-widest transition-colors",
                          active
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                      >
                        <item.icon size={12} className={cn(active ? "text-primary" : "opacity-50")} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default DashboardTopNav;
