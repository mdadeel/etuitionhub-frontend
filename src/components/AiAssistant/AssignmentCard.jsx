// components/AiAssistant/AssignmentCard.jsx
// Renders the AI-generated assignment (ASSIGNMENT_SCHEMA) as a
// structured, printable-friendly card. MCQs show options interactively;
// short questions are listed. Answer key is reveal-on-demand.
import { useState } from 'react';
import { ClipboardList, FileText, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// eslint-disable-next-line no-unused-vars
function SectionHeader({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary shrink-0">
                <Icon size={13} strokeWidth={2.4} />
            </span>
            <h4 className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {label}
            </h4>
        </div>
    );
}

export default function AssignmentCard({ data }) {
    const [showAnswerKey, setShowAnswerKey] = useState(false);
    if (!data) return null;

    const mcqQuestions = data.mcqQuestions || [];
    const shortQuestions = data.shortQuestions || [];

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="pb-3 border-b border-border/40">
                <p className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-primary mb-1">
                    Assignment
                </p>
                <h3 className="text-lg font-heading font-bold text-foreground">
                    {data.title || 'Untitled Assignment'}
                </h3>
                {data.totalMarks != null && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Total marks: <span className="font-semibold text-foreground">{data.totalMarks}</span>
                    </p>
                )}
            </div>

            {/* MCQ Section */}
            {mcqQuestions.length > 0 && (
                <div>
                    <SectionHeader icon={ClipboardList} label={`MCQ Questions (${mcqQuestions.length})`} />
                    <div className="space-y-4">
                        {mcqQuestions.map((q, qi) => (
                            <div key={q.id || qi} className="rounded-xl border border-border/60 bg-muted/20 p-4">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <p className="text-sm font-medium text-foreground leading-snug flex-1">
                                        <span className="text-primary font-semibold mr-2">Q{qi + 1}.</span>
                                        {q.question}
                                    </p>
                                    {q.marks != null && (
                                        <span className="shrink-0 text-[10px] font-label text-muted-foreground px-1.5 py-0.5 rounded bg-muted border border-border/50">
                                            {q.marks} mark{q.marks !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {(q.options || []).map((opt, oi) => (
                                        <div
                                            key={oi}
                                            className={cn(
                                                'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs',
                                                showAnswerKey && oi === q.correctIndex
                                                    ? 'border-emerald-500/60 bg-emerald-500/10 text-foreground font-medium'
                                                    : 'border-border/40 bg-card/30 text-foreground/80',
                                            )}
                                        >
                                            <span className="shrink-0 size-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">
                                                {String.fromCharCode(65 + oi)}
                                            </span>
                                            <span className="flex-1">{opt}</span>
                                            {showAnswerKey && oi === q.correctIndex && (
                                                <CheckCircle2 size={11} className="shrink-0 text-emerald-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Short Questions Section */}
            {shortQuestions.length > 0 && (
                <div>
                    <SectionHeader icon={FileText} label={`Short Questions (${shortQuestions.length})`} />
                    <div className="space-y-2">
                        {shortQuestions.map((q, qi) => (
                            <div
                                key={q.id || qi}
                                className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/30 px-4 py-3"
                            >
                                <span className="shrink-0 size-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                                    {mcqQuestions.length + qi + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="text-sm text-foreground leading-snug">{q.question}</p>
                                    {/* Answer lines */}
                                    <div className="mt-2 space-y-1">
                                        {Array.from({ length: 3 }).map((_, li) => (
                                            <div key={li} className="h-px w-full bg-border/40" />
                                        ))}
                                    </div>
                                </div>
                                {q.marks != null && (
                                    <span className="shrink-0 text-[10px] font-label text-muted-foreground px-1.5 py-0.5 rounded bg-muted border border-border/50">
                                        {q.marks}m
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Answer Key toggle */}
            {data.answerKey && (
                <div>
                    <button
                        type="button"
                        onClick={() => setShowAnswerKey((v) => !v)}
                        className="flex items-center gap-2 text-xs font-medium text-primary hover:underline"
                    >
                        {showAnswerKey ? <EyeOff size={13} /> : <Eye size={13} />}
                        {showAnswerKey ? 'Hide Answer Key' : 'Reveal Answer Key'}
                    </button>
                    {showAnswerKey && (
                        <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 animate-fade-in-up">
                            <p className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-emerald-500 mb-2">
                                Answer Key
                            </p>
                            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                {data.answerKey}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
