import { cn } from "@/lib/utils";

const CLASS_OPTIONS = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "SSC", "HSC", "Admission", "IELTS", "University"
];

/**
 * Class filter dropdown.
 */
const ClassFilter = ({ value, onChange, className }) => {
  return (
    <div className={cn("min-w-[140px]", className)}>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">Class</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">All Classes</option>
        {CLASS_OPTIONS.map(cls => (
          <option key={cls} value={cls}>{cls}</option>
        ))}
      </select>
    </div>
  );
};

export default ClassFilter;
