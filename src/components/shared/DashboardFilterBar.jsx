import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Collapsible filter bar for dashboard tables.
 * Renders filter slots in a collapsible row.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Filter components
 * @param {Function} props.onClear - Callback to clear all filters
 * @param {number} props.activeCount - Number of active filters
 * @param {string} props.className - Additional classes
 */
const DashboardFilterBar = ({ children, onClear, activeCount = 0, className }) => {
  const [expanded, setExpanded] = useState(activeCount > 0);

  return (
    <div className={cn("border border-border rounded-lg bg-card", className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="flex flex-wrap items-end gap-3 pt-3">
            {children}
            {activeCount > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFilterBar;
