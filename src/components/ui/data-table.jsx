import { useState, useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * DataTable — unified table component with optional column resizing.
 *
 * Props:
 *   columns    – Array<{ key, label, hideOn?, align?, render?, width? }>
 *   data       – Array<row>
 *   emptyState – ReactNode shown when data is empty
 *   onRowClick – (row) => void
 *   stickyHeader – boolean
 *   compact    – boolean (reduced padding)
 *   resizable  – boolean (drag-to-resize column handles)
 *   className  – extra class on outer wrapper
 *   rowKey     – (row) => string | number  (defaults to row._id || index)
 */

const HIDDEN_BP = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell", xl: "hidden xl:table-cell" };

export default function DataTable({
  columns = [],
  data = [],
  emptyState = null,
  onRowClick,
  stickyHeader = false,
  compact = false,
  resizable = false,
  className,
  rowKey,
}) {
  const [colWidths, setColWidths] = useState(() => {
    const w = {};
    columns.forEach((c) => { if (c.width) w[c.key] = c.width; });
    return w;
  });
  const resizing = useRef(null);

  const onResizeStart = useCallback((colKey, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = e.target.parentElement.offsetWidth;
    resizing.current = colKey;

    const onMove = (ev) => {
      const delta = ev.clientX - startX;
      setColWidths((prev) => ({ ...prev, [colKey]: Math.max(60, startW + delta) }));
    };
    const onUp = () => {
      resizing.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  const thStyle = useMemo(() => (key) => {
    const w = colWidths[key];
    return w ? { width: w, maxWidth: w } : undefined;
  }, [colWidths]);

  const tdPy = compact ? "py-2.5" : "py-4";

  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={cn("bg-muted/30 border-b border-border", stickyHeader && "sticky top-0 z-10")}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-6 py-3 text-[11px] font-label font-semibold uppercase tracking-wider text-muted-foreground relative select-none",
                    col.hideOn && HIDDEN_BP[col.hideOn],
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                  )}
                  style={thStyle(col.key)}
                >
                  <span>{col.label}</span>
                  {resizable && (
                    <div
                      onMouseDown={(e) => onResizeStart(col.key, e)}
                      className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-primary/40 transition-colors"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {data.length === 0 && emptyState ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  {emptyState}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const key = rowKey ? rowKey(row) : row._id ?? idx;
                return (
                  <tr
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-6 text-sm text-foreground",
                          tdPy,
                          col.hideOn && HIDDEN_BP[col.hideOn],
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                        )}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
