import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

const EmptyState = ({ icon, title = "No records found", description, className }) => {
  const IconComponent = icon || Database;
  return (
    <div className={cn("py-24 text-center border border-dashed border-border rounded-xl bg-background/50", className)}>
      <IconComponent size={40} className="text-muted-foreground/25 mx-auto mb-4" strokeWidth={1} />
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground/40 mt-1 max-w-xs mx-auto">{description}</p>
      )}
    </div>
  );
};

export default EmptyState;
