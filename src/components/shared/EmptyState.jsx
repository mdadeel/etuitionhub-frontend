import { Database, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

const EmptyState = ({
  icon,
  title,
  description,
  action,
  onAction,
  className,
  variant = "default",
  query,
  suggestions,
}) => {
  if (variant === "search") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="size-16 bg-background rounded-full flex items-center justify-center mb-4">
          <SearchX size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-heading font-bold text-lg text-foreground mb-1">
          {title || "No results found"}
        </h3>
        {query ? (
          <p className="text-sm text-muted-foreground mb-4">
            No results for &ldquo;<span className="font-semibold">{query}</span>&rdquo;
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            {description || "Try adjusting your filters or search term"}
          </p>
        )}
        {suggestions && suggestions.length > 0 && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Suggestions</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs bg-background text-muted-foreground border border-border rounded-lg"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {action && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-colors"
          >
            {action}
          </button>
        )}
      </div>
    );
  }

  const IconComponent = icon || Database;
  return (
    <div className={cn("py-16 sm:py-24 text-center border border-dashed border-border rounded-xl bg-background/50", className)}>
      <IconComponent size={40} className="text-muted-foreground/25 mx-auto mb-4" strokeWidth={1} />
      <p className="text-sm font-semibold text-muted-foreground/70">{title || "No records found"}</p>
      {description && (
        <p className="text-xs text-muted-foreground/50 mt-1.5 max-w-xs mx-auto leading-relaxed">{description}</p>
      )}
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
