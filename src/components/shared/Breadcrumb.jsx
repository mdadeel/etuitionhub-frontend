import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Reusable breadcrumb navigation for public pages.
 * @param {Array<{ label: string, to?: string }>} items - Breadcrumb items. Last item should not have `to`.
 */
export default function Breadcrumb({ items, className }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center gap-1.5 text-xs text-muted-foreground',
        className,
      )}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight size={10} className="shrink-0" />}
            {isLast || !item.to ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
                to={item.to}
                className="font-medium hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
