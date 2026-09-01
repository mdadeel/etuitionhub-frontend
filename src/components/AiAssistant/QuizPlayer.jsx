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
    const quizKey = `quiz_state_${quiz?._id || quiz?.id}`;

    const [currentIdx, setCurrentIdx] = useState(() => {
        if (!quiz || submitted) return 0;
        try {
            const saved = localStorage.getItem(quizKey);
            if (saved) return JSON.parse(saved).currentIdx || 0;
        // eslint-disable-next-line no-unused-vars, no-empty
        } catch (e) {}
        return 0;
    });
    
    const [responses, setResponses] = useState(() => {
        if (!quiz || submitted) return {};
        try {
            const saved = localStorage.getItem(quizKey);
            if (saved) return JSON.parse(saved).responses || {};
        // eslint-disable-next-line no-unused-vars, no-empty
        } catch (e) {}
        return {};
    });
    
    // eslint-disable-next-line no-unused-vars, react-hooks/purity
    const [questionStart, setQuestionStart] = useState(Date.now());
    // eslint-disable-next-line react-hooks/purity
    const startRef = useRef(Date.now());

    // Save state to localStorage on change
    useEffect(() => {
        if (!quiz || submitted) return;
        try {
            localStorage.setItem(quizKey, JSON.stringify({ currentIdx, responses }));
        // eslint-disable-next-line no-unused-vars, no-empty
        } catch (e) {}
    }, [currentIdx, responses, quiz, submitted, quizKey]);

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
        if (selected == null) {
            const confirmed = window.confirm("You haven't selected an answer. Are you sure you want to skip?");
            if (!confirmed) return;
        }
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
        try {
            localStorage.removeItem(quizKey);
        // eslint-disable-next-line no-unused-vars, no-empty
        } catch (e) {}
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
                    <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                        <p className="text-[11px] font-label font-semibold uppercase tracking-[0.1em] text-warning mb-2">
                            Weak Topics
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {weakTopics.map((t, i) => (
                                <span key={i} className="px-2 py-1 rounded-md bg-warning/10 text-warning text-xs font-medium">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Detailed Review Section */}
                <div className="space-y-4 mt-8">
                    <h4 className="font-semibold text-lg border-b border-border/50 pb-2">Review Answers</h4>
                    {quiz.questions.map((q, i) => {
                        // Attempt to find the specific result for this question
                        const qResult = results.responses?.find(d => d.questionId === q.id);
                        const userSelectedIdx = responses[q.id];
                        // If backend provides correctOptionIdx use it, else we assume we don't have it explicitly
                        // Wait, typically the correct answer is in the quiz object but stripped for client, OR returned in results.
                        // We will highlight the user's choice and the correct choice if available.
                        const isCorrect = qResult?.isCorrect;
                        
                        // After submission, 'results' is the full updated quiz object containing correctIndex and explanation
                        const fullQ = results.questions?.find(d => d.id === q.id);
                        const correctIdx = fullQ?.correctIndex;
                        const explanation = fullQ?.explanation;
                        
                        return (
                            <div key={q.id} className="p-4 rounded-xl border border-border/50 bg-card/50 space-y-3">
                                <p className="font-medium text-[15px]">{i + 1}. {q.question}</p>
                                <div className="space-y-2">
                                    {q.options.map((opt, optIdx) => {
                                        let bg = "bg-card/50 border-border";
                                        let icon = <Circle size={14} className="text-muted-foreground/50 shrink-0" />;
                                        
                                        if (correctIdx != null) {
                                            if (optIdx === correctIdx) {
                                                bg = "bg-success/10 border-success/30 text-success dark:text-success";
                                                icon = <CheckCircle2 size={14} className="text-success shrink-0" />;
                                            } else if (optIdx === userSelectedIdx && !isCorrect) {
                                                bg = "bg-destructive/10 border-destructive/30 text-destructive";
                                                icon = <X size={14} className="text-destructive shrink-0" />;
                                            }
                                        } else {
                                            // Fallback if backend doesn't provide exact correct index but just isCorrect boolean
                                            if (optIdx === userSelectedIdx) {
                                                if (isCorrect) {
                                                    bg = "bg-success/10 border-success/30 text-success";
                                                    icon = <CheckCircle2 size={14} className="text-success shrink-0" />;
                                                } else {
                                                    bg = "bg-destructive/10 border-destructive/30 text-destructive";
                                                    icon = <X size={14} className="text-destructive shrink-0" />;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={optIdx} className={cn("flex items-start gap-3 p-2 rounded-lg border text-sm", bg)}>
                                                <div className="mt-0.5">{icon}</div>
                                                <span>{opt}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {explanation && (
                                    <p className="text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded">
                                        <span className="font-semibold text-foreground/80">Explanation:</span> {explanation}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
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
                <div className="flex items-center justify-between text-[11px] font-label tracking-wider text-muted-foreground">
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
    const color = percent >= 70 ? 'text-success' : percent >= 40 ? 'text-warning' : 'text-destructive';
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
                    <span className="text-[11px] font-label tracking-wider text-muted-foreground uppercase">
                        Score
                    </span>
                </div>
            </div>
        </div>
    );
}
