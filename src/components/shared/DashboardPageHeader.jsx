import { cn } from "@/lib/utils";

const DashboardPageHeader = ({ category, title, subtitle, action, className }) => {
  return (
    <header className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6", className)}>
      <div className="space-y-1">
        {category && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-1 bg-primary rounded-full" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{category}</span>
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-heading font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
};

export default DashboardPageHeader;
