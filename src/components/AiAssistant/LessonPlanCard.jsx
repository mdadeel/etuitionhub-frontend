// components/AiAssistant/LessonPlanCard.jsx
// Renders the AI-generated lesson plan (LESSON_PLAN_SCHEMA) as a
// structured, tutor-friendly card. Sections mirror the schema fields.
import { BookOpen, Clock, Target, ListChecks, Zap, BookText, Layers } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
function SectionHeader({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary shrink-0">
                <Icon size={13} strokeWidth={2.4} />
            </span>
            <h4 className="text-[11px] font-label font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {label}
            </h4>
        </div>
    );
}

function BulletList({ items }) {
    if (!items?.length) return null;
    return (
        <ul className="space-y-1">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                    <span className="mt-2 size-1 rounded-full bg-primary/60 shrink-0" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

export default function LessonPlanCard({ data }) {
    if (!data) return null;
    return (
        <div className="space-y-5 animate-fade-in-up">
            {/* Header */}
            <div className="pb-3 border-b border-border/40">
                <p className="text-[11px] font-label font-semibold uppercase tracking-[0.1em] text-primary mb-1">
                    Lesson Plan
                </p>
                <h3 className="text-lg font-heading font-bold text-foreground">
                    {data.title || 'Untitled Lesson'}
                </h3>
                {data.duration && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Clock size={11} />
                        <span>{data.duration}</span>
                    </div>
                )}
            </div>

            {/* Learning objectives */}
            {data.learningObjectives?.length > 0 && (
                <div>
                    <SectionHeader icon={Target} label="Learning Objectives" />
                    <BulletList items={data.learningObjectives} />
                </div>
            )}

            {/* Class outline (timeline) */}
            {data.classOutline?.length > 0 && (
                <div>
                    <SectionHeader icon={Layers} label="Class Outline" />
                    <div className="space-y-2">
                        {data.classOutline.map((item, i) => (
                            <div
                                key={i}
                                className="flex gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5"
                            >
                                <div className="shrink-0 flex flex-col items-center gap-1">
                                    <span className="size-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-bold">
                                        {i + 1}
                                    </span>
                                    {i < data.classOutline.length - 1 && (
                                        <div className="w-px flex-1 bg-border/50 min-h-[12px]" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-sm font-semibold text-foreground">{item.section}</p>
                                        {item.minutes && (
                                            <span className="text-[11px] font-label text-muted-foreground shrink-0">
                                                {item.minutes} min
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Activities */}
            {data.activities?.length > 0 && (
                <div>
                    <SectionHeader icon={Zap} label="Classroom Activities" />
                    <BulletList items={data.activities} />
                </div>
            )}

            {/* Homework */}
            {data.homework && (
                <div>
                    <SectionHeader icon={BookText} label="Homework" />
                    <p className="text-sm text-foreground/90 leading-relaxed italic border-l-2 border-primary/40 pl-3">
                        {data.homework}
                    </p>
                </div>
            )}

            {/* Materials */}
            {data.materialsNeeded?.length > 0 && (
                <div>
                    <SectionHeader icon={ListChecks} label="Materials Needed" />
                    <BulletList items={data.materialsNeeded} />
                </div>
            )}
        </div>
    );
}
