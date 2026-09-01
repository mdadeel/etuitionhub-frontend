// components/AiAssistant/CurriculumCard.jsx
// Renders a batch AI curriculum export as a list of weekly lesson plans,
// reusing LessonPlanCard for each week. Shows a combined header and any
// per-week failures that the generator collected.
import { CalendarRange, AlertTriangle } from 'lucide-react';
import LessonPlanCard from './LessonPlanCard';

function WeekCard({ week }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 pt-1">
                <span className="flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary shrink-0">
                    <CalendarRange size={13} strokeWidth={2.4} />
                </span>
                <h4 className="text-[11px] font-label font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Week {week.week} — {week.topic}
                </h4>
            </div>
            <LessonPlanCard data={week.plan} />
        </div>
    );
}

export default function CurriculumCard({ data }) {
    if (!data) return null;
    const weeks = Array.isArray(data.weeks) ? data.weeks : [];
    const failures = Array.isArray(data.failures) ? data.failures : [];

    return (
        <div className="space-y-5">
            {/* Combined header */}
            <div className="pb-3 border-b border-border/40">
                <p className="text-[11px] font-label font-semibold uppercase tracking-[0.1em] text-primary mb-1">
                    Monthly Curriculum
                </p>
                <h3 className="text-lg font-heading font-bold text-foreground">
                    {data.title || 'Curriculum'}
                </h3>
                {(data.subject || data.grade || data.duration) && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {[data.subject, data.grade, data.duration].filter(Boolean).join(' · ')}
                        {weeks.length > 0 && ` · ${weeks.length} week${weeks.length === 1 ? '' : 's'}`}
                    </p>
                )}
            </div>

            {/* One lesson-plan card per week */}
            {weeks.map((week) => (
                <WeekCard key={week.week} week={week} />
            ))}

            {/* Per-week failures the generator collected */}
            {failures.length > 0 && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive space-y-1">
                    <p className="flex items-center gap-1.5 font-semibold">
                        <AlertTriangle size={12} />
                        {failures.length} week{failures.length === 1 ? '' : 's'} could not be generated
                    </p>
                    {failures.map((f) => (
                        <p key={f.week} className="pl-5">
                            Week {f.week} ({f.topic}): {f.error}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
