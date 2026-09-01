import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

const EmptyState = ({ icon, title = "No records found", description, action, onAction, className }) => {
  const IconComponent = icon || Database;
  return (
    <div className={cn("py-16 sm:py-24 text-center border border-dashed border-border rounded-xl bg-background/50", className)}>
      <IconComponent size={40} className="text-muted-foreground/25 mx-auto mb-4" strokeWidth={1} />
      <p className="text-sm font-semibold text-muted-foreground/70">{title}</p>
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
