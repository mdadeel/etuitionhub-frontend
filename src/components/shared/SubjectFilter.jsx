import { useState, useEffect } from "react";
import api from "../../services/api";
import { cn } from "@/lib/utils";

/**
 * Subject filter dropdown with search.
 */
const SubjectFilter = ({ value, onChange, className }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/api/tuitions", { params: { limit: 1 } });
        // Extract unique subjects from tuitions
        const tuitions = res.data?.data || [];
        const uniqueSubjects = [...new Set(tuitions.map(t => t.subject).filter(Boolean))];
        setSubjects(uniqueSubjects.sort());
      } catch {
        // Fallback: use common subjects
        setSubjects(["Mathematics", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT"]);
      }
    };
    fetchSubjects();
  }, []);

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
