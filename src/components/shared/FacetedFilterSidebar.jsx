import { useEffect, memo } from "react";
import { Filter, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Canonical Faceted Filter Sidebar for Discovery & Directory Pages.
 * 
 * Provides:
 * 1. Fixed/Sticky desktop panel with clear typography and active count badge.
 * 2. Responsive mobile bottom drawer / slide-in modal with touch drag handle.
 * 3. Consistent "Clear All" / Reset triggers and semantic CSS design tokens.
 */
const FacetedFilterSidebar = ({
  isOpen = false,
  onClose,
  title = "Filters",
  activeCount = 0,
  onClearAll,
  clearLabel = "Clear all",
  applyLabel = "Apply filters",
  children,
  className,
}) => {
  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <aside
      className={cn(
        "lg:col-span-1 h-full",
        "fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs lg:relative lg:inset-auto lg:z-auto lg:bg-transparent transition-opacity duration-200",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto",
        className
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      aria-modal={isOpen ? "true" : undefined}
      role={isOpen ? "dialog" : undefined}
      aria-label={title}
    >
      <div
        className={cn(
          "bg-card w-full max-w-none h-[88vh] absolute bottom-0 lg:h-full p-5 lg:p-4 lg:rounded-xl lg:border lg:border-border lg:w-full lg:shadow-xs transition-transform duration-300 rounded-t-2xl lg:rounded-xl overflow-y-auto custom-scrollbar flex flex-col justify-between",
          isOpen
            ? "translate-y-0"
            : "translate-y-full lg:translate-y-0"
        )}
      >
        <div>
          {/* Mobile Handle & Header */}
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4 lg:hidden" />
          
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-primary" />
              <h2 className="text-sm md:text-base font-bold tracking-tight text-foreground">
                {title}
              </h2>
              {activeCount > 0 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {activeCount} active
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeCount > 0 && onClearAll && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
                  title={clearLabel}
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="lg:hidden p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Body Controls */}
          <div className="space-y-4">
            {children}
          </div>
        </div>

        {/* Mobile Action Footer */}
        <div className="pt-4 border-t border-border mt-6 space-y-2 lg:hidden">
          {activeCount > 0 && onClearAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="w-full h-11 text-xs font-semibold gap-1.5 rounded-lg"
            >
              <RotateCcw size={14} />
              {clearLabel} ({activeCount})
            </Button>
          )}

          {onClose && (
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="w-full h-11 text-xs font-semibold rounded-lg"
            >
              {applyLabel}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default memo(FacetedFilterSidebar);
