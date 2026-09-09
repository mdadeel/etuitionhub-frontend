import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const Breadcrumb = ({ items = [], className }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home size={13} />
        <span className="sr-only sm:not-sr-only">Home</span>
      </Link>
      {items.map((item, i) => {
        const href = item.to || item.href;
        return (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={12} className="text-muted-foreground/50" />
          {href ? (
            <Link
              to={href}
              className="hover:text-foreground transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn("font-semibold", i === items.length - 1 ? "text-foreground" : "text-muted-foreground")}>
              {item.label}
            </span>
          )}
        </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
