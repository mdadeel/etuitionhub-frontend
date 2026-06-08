// components/AiAssistant/QuizPlayer.jsx
// Interactive quiz player. Tracks the user's answers, times each
// question, and on submit hands the responses to the parent. The
// component does NOT submit or score itself — that's the parent's
// job (so we can swap APIs / mock easily).
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Circle, SkipForward, Send, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuizPlayer({
    quiz,
    onSubmit,
    submitting = false,
    submitted = false,
    results = null,
    onExit,
    onAskFollowUp,
}) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [responses, setResponses] = useState({}); // { [questionId]: selectedIndex }
    const [questionStart, setQuestionStart] = useState(Date.now());
    const startRef = useRef(Date.now());

    useEffect(() => {
        startRef.current = Date.now();
        setQuestionStart(Date.now());
    }, [currentIdx]);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <p>No questions to display.</p>
            </div>
        );
    }

    const total = quiz.questions.length;
    const current = quiz.questions[currentIdx];
    const answered = Object.keys(responses).length;
    const progress = ((currentIdx + 1) / total) * 100;
    const isLast = currentIdx === total - 1;
    const selected = responses[current.id];

    const handleSelect = (idx) => {
        if (submitted || submitting) return;
        setResponses((r) => ({ ...r, [current.id]: idx }));
    };

    const handleSkip = () => {
        if (submitted || submitting) return;
        if (isLast) {
            handleSubmit();
        } else {
            setCurrentIdx((i) => i + 1);
        }
    };

    const handleNext = () => {
        if (isLast) {
            handleSubmit();
        } else {
            setCurrentIdx((i) => i + 1);
        }
    };

    const handleSubmit = () => {
        const timeSpentMs = Date.now() - startRef.current;
        const payload = Object.entries(responses).map(([questionId, selectedIndex]) => ({
            questionId,
            selectedIndex,
            timeSpentMs,
        }));
        onSubmit?.(payload);
    };

    // ---------- Results view ----------
    if (submitted && results) {
        const score = results.score || {};
        const correct = score.correct ?? 0;
        const percent = score.percent ?? 0;
        const weakTopics = results.weakTopics || [];
        return (
            <div className="space-y-6 animate-fade-in-up">
                <ScoreGauge percent={percent} />
                <div className="text-center space-y-1">
                    <p className="text-2xl font-heading font-bold text-foreground">
                        {correct} / {score.total || total}
                    </p>
                    <p className="text-sm text-muted-foreground">questions answered correctly</p>
                </div>
                {weakTopics.length > 0 && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                        <p className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-amber-500 mb-2">
                            Weak Topics
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {weakTopics.map((t, i) => (
                                <span key={i} className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 text-xs font-medium">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    {/* AI_TUTOR_DESIGN.md §5.8.2 — the primary action is
                        "Ask a follow-up" when inline; "Back to chat" only
                        for the standalone /quiz/:id route. */}
                    {onAskFollowUp ? (
                        <button
                            onClick={onAskFollowUp}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 h-10 text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
                        >
                            Ask a follow-up →
                        </button>
                    ) : onExit ? (
                        <button
                            onClick={onExit}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 h-10 text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
                        >
                            Back to chat
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }

    // ---------- Player view ----------
    return (
        <div className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-label tracking-wider text-muted-foreground">
                    <span>
                        Question {currentIdx + 1} of {total}
                    </span>
                    <span>{answered} answered</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground leading-relaxed">
                    {current.question}
                </h3>
                <div className="space-y-2">
                    {current.options.map((opt, idx) => {
                        const isSelected = selected === idx;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelect(idx)}
                                disabled={submitting}
                                className={cn(
                                    'w-full text-left flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-200',
                                    isSelected
                                        ? 'border-primary bg-primary/10 shadow-sm'
                                        : 'border-border bg-card/50 hover:border-primary/40 hover:bg-card',
                                    submitting && 'opacity-60 cursor-not-allowed',
                                )}
                            >
                                {isSelected ? (
                                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                                ) : (
                                    <Circle size={16} className="text-muted-foreground/60 shrink-0" />
                                )}
                                <span className="flex-1">{opt}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer controls */}
            <div className="flex items-center justify-between gap-2 pt-2">
                <button
                    type="button"
                    onClick={handleSkip}
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-3 h-9 rounded-lg transition-colors"
                >
                    <SkipForward size={13} />
                    Skip
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={selected == null || submitting}
                    className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-4 h-9 text-xs font-semibold transition-all',
                        selected != null && !submitting
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95'
                            : 'bg-muted text-muted-foreground/60 cursor-not-allowed',
                    )}
                >
                    {submitting ? (
                        'Submitting...'
                    ) : isLast ? (
                        <>
                            <Send size={12} />
                            Submit
                        </>
                    ) : (
                        <>
                            Next
                            <ChevronRight size={12} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// ---------- SVG score gauge ----------
function ScoreGauge({ percent = 0 }) {
    const radius = 56;
    const stroke = 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    const color = percent >= 70 ? 'text-emerald-500' : percent >= 40 ? 'text-amber-500' : 'text-destructive';
    return (
        <div className="flex items-center justify-center">
            <div className="relative size-40">
                <svg className="size-full -rotate-90" viewBox="0 0 128 128">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={stroke}
                        className="text-muted/60"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className={cn(color, 'transition-all duration-1000 ease-out')}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-3xl font-heading font-bold', color)}>
                        {percent}%
                    </span>
                    <span className="text-[10px] font-label tracking-wider text-muted-foreground uppercase">
                        Score
                    </span>
                </div>
            </div>
        </div>
    );
}
