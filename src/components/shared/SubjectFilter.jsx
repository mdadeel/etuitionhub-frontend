import { cn } from "@/lib/utils";
import { SUBJECT_OPTIONS } from "../../utils/constants";

/**
 * Subject filter dropdown with search.
 * Batch 4e: uses the shared SUBJECT_OPTIONS vocabulary (same list as
 * PostTuition/BecomeTutor/Profile). The old implementation misused
 * GET /api/tuitions?limit=1 and derived "unique subjects" from a single
 * record, so the list was near-always wrong.
 */
const SubjectFilter = ({ value, onChange, className }) => {
  const subjects = [...SUBJECT_OPTIONS].sort();

  return (
    <div className={cn("min-w-[150px]", className)}>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">Subject</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">All Subjects</option>
        {subjects.map(subject => (
          <option key={subject} value={subject}>{subject}</option>
        ))}
      </select>
    </div>
  );
};

export default SubjectFilter;
