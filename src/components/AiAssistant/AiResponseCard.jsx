// components/AiAssistant/AiResponseCard.jsx
// The crown jewel of the AI Assistant. Renders the LLM's structured
// JSON response as a beautiful, multi-section card. The component is
// dispatch-by-templateType — each template has its own layout. We
// never render raw markdown from the LLM (the prompt forbids it).
//
// All sections animate in with a small stagger via inline CSS so the
// card *feels* alive without being noisy. Each section is a "Section"
// component (label + body) for visual consistency across templates.
import { useState, Component } from 'react';
import {
    BookOpen, Target, Brain, Globe, AlertTriangle, ClipboardList,
    Sigma, ListChecks, FileText, CheckCircle2, Sparkles, ChevronDown,
    Calculator, Lightbulb, Code2, Languages, FileEdit, Clock, Zap,
    XCircle, Compass, Lightbulb as Idea,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ConversationalBubble from './ConversationalBubble';

class RendererBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                    Could not render this response. The AI output may be malformed.
                </div>
            );
        }
        return this.props.children;
    }
}

// Inline-styled section with fade-up entrance.
function Section({ icon: Icon, label, children, delay = 0, accent = 'primary' }) {
    return (
        <div
            className="space-y-2 animate-fade-in-up"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
        >
            <div className="flex items-center gap-2">
                {Icon && (
                    <span
                        className={cn(
                            'flex items-center justify-center size-6 rounded-md',
                            accent === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary',
                        )}
                    >
                        <Icon size={13} strokeWidth={2.4} />
                    </span>
                )}
                <h4 className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    {label}
                </h4>
            </div>
            <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
        </div>
    );
}

function CollapsibleList({ items, renderItem, emptyText = 'Nothing to show.' }) {
    const [open, setOpen] = useState(false);
    const visible = open ? items : items?.slice(0, 3);
    if (!items || items.length === 0) {
        return <p className="text-xs text-muted-foreground italic">{emptyText}</p>;
    }
    return (
        <ul className="space-y-1.5">
            {visible.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                    <span className="mt-2 size-1 rounded-full bg-primary/60 shrink-0" />
                    <span className="flex-1">{renderItem ? renderItem(item, i) : item}</span>
                </li>
            ))}
            {items.length > 3 && (
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="text-[11px] font-medium text-primary hover:underline mt-1 flex items-center gap-1"
                >
                    {open ? 'Show less' : `+${items.length - 3} more`}
                    <ChevronDown size={11} className={cn('transition-transform', open && 'rotate-180')} />
                </button>
            )}
        </ul>
    );
}

function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false);
    if (!code) return null;
    const handleCopy = () => {
        navigator.clipboard?.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };
    return (
        <div className="relative group">
            <pre className="bg-muted/60 border border-border/60 rounded-lg p-3 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre">
                {code}
            </pre>
            <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2 right-2 text-[10px] font-label tracking-wider px-2 py-1 rounded bg-background/80 border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            >
                {copied ? '✓ Copied' : 'Copy'}
            </button>
        </div>
    );
}

// ---------- Inline Quick Quiz (self-check MCQs from concept/math responses) ----------

function QuickQuizMini({ questions }) {
    const [answers, setAnswers] = useState({});
    if (!questions || questions.length === 0) return null;
    return (
        <div
            className="space-y-3 animate-fade-in-up"
            style={{ animationDelay: '280ms', animationFillMode: 'both' }}
        >
            <div className="flex items-center gap-2">
                <span className="flex items-center justify-center size-6 rounded-md bg-accent/10 text-accent">
                    <ClipboardList size={13} strokeWidth={2.4} />
                </span>
                <h4 className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Quick Self-Check ({questions.length} Q{questions.length > 1 ? 's' : ''})
                </h4>
            </div>
            <div className="space-y-3">
                {questions.map((q, qi) => {
                    const chosen = answers[qi];
                    const revealed = chosen !== undefined;
                    const isCorrect = revealed && chosen === q.answer;
                    return (
                        <div key={qi} className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
                            <p className="text-sm font-medium text-foreground leading-snug">{q.q}</p>
                            <div className="grid grid-cols-1 gap-1.5">
                                {(q.options || []).map((opt, oi) => {
                                    let optStyle = 'border-border/50 bg-card/30 text-foreground/80 hover:border-primary/40 hover:bg-card/60';
                                    if (revealed) {
                                        if (oi === q.answer) {
                                            optStyle = 'border-emerald-500/60 bg-emerald-500/10 text-foreground';
                                        } else if (oi === chosen) {
                                            optStyle = 'border-destructive/50 bg-destructive/10 text-foreground';
                                        } else {
                                            optStyle = 'border-border/30 bg-card/20 text-muted-foreground opacity-60';
                                        }
                                    }
                                    return (
                                        <button
                                            key={oi}
                                            type="button"
                                            disabled={revealed}
                                            onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                                            className={cn(
                                                'w-full flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs text-left transition-all',
                                                optStyle,
                                                !revealed && 'cursor-pointer active:scale-[0.99]',
                                                revealed && 'cursor-default',
                                            )}
                                        >
                                            <span className="shrink-0 size-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">
                                                {String.fromCharCode(65 + oi)}
                                            </span>
                                            <span className="flex-1">{opt}</span>
                                            {revealed && oi === q.answer && <CheckCircle2 size={12} className="shrink-0 text-emerald-500" />}
                                            {revealed && oi === chosen && oi !== q.answer && <XCircle size={12} className="shrink-0 text-destructive" />}
                                        </button>
                                    );
                                })}
                            </div>
                            {revealed && (
                                <p className={cn(
                                    'text-xs mt-1 font-medium',
                                    isCorrect ? 'text-emerald-500' : 'text-destructive',
                                )}>
                                    {isCorrect ? '✓ Correct!' : `✕ The correct answer is ${String.fromCharCode(65 + q.answer)}.`}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ---------- Template renderers ----------

function ConceptTemplate({ data }) {
    return (
        <div className="space-y-4">
            <Section icon={BookOpen} label="Topic" delay={0.05}>
                <p className="text-base font-heading font-semibold text-foreground">{data.topic}</p>
            </Section>
            {data.easyExplanation && (
                <Section icon={Target} label="Easy Explanation" delay={0.1}>
                    <p>{data.easyExplanation}</p>
                </Section>
            )}
            {data.keyConcepts?.length > 0 && (
                <Section icon={Brain} label={`Key Concepts (${data.keyConcepts.length})`} delay={0.15}>
                    <CollapsibleList items={data.keyConcepts} />
                </Section>
            )}
            {data.realLifeExample && (
                <Section icon={Globe} label="Real Life Example" delay={0.2}>
                    <p className="italic text-muted-foreground border-l-2 border-primary/40 pl-3">
                        {data.realLifeExample}
                    </p>
                </Section>
            )}
            {data.commonMistakes?.length > 0 && (
                <Section icon={AlertTriangle} label="Common Mistakes" delay={0.25} accent="amber">
                    <CollapsibleList items={data.commonMistakes} />
                </Section>
            )}
            {data.quickQuiz?.length > 0 && (
                <QuickQuizMini questions={data.quickQuiz} />
            )}
        </div>
    );
}

function MathTemplate({ data }) {
    return (
        <div className="space-y-4">
            <Section icon={Sigma} label="Topic" delay={0.05}>
                <p className="text-base font-heading font-semibold text-foreground">{data.topic}</p>
            </Section>
            {data.problem && (
                <Section icon={FileText} label="Problem" delay={0.1}>
                    <p className="font-mono text-sm bg-muted/40 rounded px-3 py-2 border border-border/50">
                        {data.problem}
                    </p>
                </Section>
            )}
            {data.given && (
                <Section icon={ListChecks} label="Given" delay={0.15}>
                    <p>{data.given}</p>
                </Section>
            )}
            {data.stepByStep?.length > 0 && (
                <Section icon={Calculator} label="Step-by-Step Solution" delay={0.2}>
                    <ol className="space-y-1.5 list-decimal list-inside marker:text-primary marker:font-semibold">
                        {data.stepByStep.map((step, i) => (
                            <li key={i} className="text-sm leading-relaxed pl-1">{step}</li>
                        ))}
                    </ol>
                </Section>
            )}
            {data.finalAnswer && (
                <Section icon={CheckCircle2} label="Final Answer" delay={0.25}>
                    <p className="font-mono font-semibold text-primary bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
                        {data.finalAnswer}
                    </p>
                </Section>
            )}
            {data.whyThisWorks && (
                <Section icon={Lightbulb} label="Why This Works" delay={0.3} accent="amber">
                    <p>{data.whyThisWorks}</p>
                </Section>
            )}
            {data.similarPractice && (
                <Section icon={ClipboardList} label="Similar Practice Question" delay={0.35}>
                    <p className="italic">{data.similarPractice}</p>
                </Section>
            )}
            {data.quickQuiz?.length > 0 && (
                <QuickQuizMini questions={data.quickQuiz} />
            )}
        </div>
    );
}

function ProgrammingTemplate({ data }) {
    return (
        <div className="space-y-4">
            <Section icon={Code2} label="Topic" delay={0.05}>
                <p className="text-base font-heading font-semibold text-foreground">{data.topic}</p>
            </Section>
            {data.solution && (
                <Section icon={Code2} label="Solution" delay={0.1}>
                    <CodeBlock code={data.solution} />
                </Section>
            )}
            {data.codeExplanation && (
                <Section icon={Brain} label="Code Explanation" delay={0.15}>
                    <p>{data.codeExplanation}</p>
                </Section>
            )}
            {data.bestPractices?.length > 0 && (
                <Section icon={Zap} label="Best Practices" delay={0.2}>
                    <CollapsibleList items={data.bestPractices} />
                </Section>
            )}
            {data.commonMistakes?.length > 0 && (
                <Section icon={AlertTriangle} label="Common Mistakes" delay={0.25} accent="amber">
                    <CollapsibleList items={data.commonMistakes} />
                </Section>
            )}
            {data.testCases?.length > 0 && (
                <Section icon={CheckCircle2} label="Test Cases" delay={0.3}>
                    <div className="space-y-2">
                        {data.testCases.map((tc, i) => (
                            <div key={i} className="bg-muted/40 border border-border/50 rounded-md p-2.5 text-xs font-mono">
                                <div><span className="text-muted-foreground">Input:</span> {tc.input}</div>
                                <div><span className="text-muted-foreground">Output:</span> {tc.expectedOutput}</div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
}

function ScorePill({ label, value }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 border border-border/50 text-foreground">
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-label">{label}</span>
            <span className="font-bold">{value}</span>
        </span>
    );
}

function IeltsTemplate({ data }) {
    const s = data.estimatedScore || {};
    return (
        <div className="space-y-4">
            <Section icon={Languages} label="Topic" delay={0.05}>
                <p className="text-base font-heading font-semibold text-foreground">{data.topic}</p>
            </Section>
            {data.evaluation && (
                <Section icon={FileEdit} label="Evaluation" delay={0.1}>
                    <p>{data.evaluation}</p>
                </Section>
            )}
            {s.overall != null && (
                <Section icon={Target} label="Estimated Score" delay={0.15}>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-heading font-bold text-primary">{s.overall}</span>
                            <span className="text-xs text-muted-foreground">/ 9.0</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {s.grammar != null && <ScorePill label="Grammar" value={s.grammar} />}
                            {s.vocabulary != null && <ScorePill label="Vocab" value={s.vocabulary} />}
                            {s.coherence != null && <ScorePill label="Coherence" value={s.coherence} />}
                        </div>
                    </div>
                </Section>
            )}
            {data.strengths?.length > 0 && (
                <Section icon={CheckCircle2} label="Strengths" delay={0.2}>
                    <CollapsibleList items={data.strengths} />
                </Section>
            )}
            {data.improvements?.length > 0 && (
                <Section icon={AlertTriangle} label="Areas for Improvement" delay={0.25} accent="amber">
                    <CollapsibleList items={data.improvements} />
                </Section>
            )}
            {data.improvedVersion && (
                <Section icon={FileText} label="Improved Version" delay={0.3}>
                    <div className="bg-muted/40 border border-border/50 rounded-md p-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {data.improvedVersion}
                    </div>
                </Section>
            )}
            {data.practiceTips?.length > 0 && (
                <Section icon={Sparkles} label="Practice Tips" delay={0.35}>
                    <CollapsibleList items={data.practiceTips} />
                </Section>
            )}
        </div>
    );
}

function FollowUpChips({ suggestions, onClick, delayMs = 600 }) {
    if (!Array.isArray(suggestions) || suggestions.length === 0) return null;
    return (
        <div
            className="flex flex-wrap gap-2 animate-fade-in-up"
            style={{ animationDelay: `${delayMs}ms`, animationFillMode: 'both' }}
        >
            {suggestions.slice(0, 3).map((s, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onClick?.(s)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                >
                    <Idea size={11} />
                    <span>{s}</span>
                </button>
            ))}
        </div>
    );
}

function GeneralTemplate({ data, onFollowUpClick }) {
    return (
        <div className="space-y-4">
            <Section icon={Compass} label="Topic" delay={0.05}>
                <p className="text-base font-heading font-semibold text-foreground">{data.topic}</p>
            </Section>
            {data.answer && (
                <Section icon={FileText} label="Answer" delay={0.1}>
                    <p className="whitespace-pre-wrap leading-relaxed">{data.answer}</p>
                </Section>
            )}
            {data.keyPoints?.length > 0 && (
                <Section icon={ListChecks} label="Key Points" delay={0.15}>
                    <CollapsibleList items={data.keyPoints} />
                </Section>
            )}
            {data.didYouKnow && (
                <div
                    className="bg-accent/5 border-l-2 border-accent/60 px-3 py-2 text-sm italic text-foreground/90 animate-fade-in-up"
                    style={{ animationDelay: '200ms', animationFillMode: 'both' }}
                >
                    <span className="font-label not-italic text-[10px] uppercase tracking-wider text-accent mr-1">Did you know?</span>
                    {data.didYouKnow}
                </div>
            )}
            <FollowUpChips suggestions={data.followUpSuggestions} onClick={onFollowUpClick} delayMs={600} />
        </div>
    );
}

function SrijonshilTemplate({ data }) {
    const parts = [
        { key: 'ka', label: 'ক', sublabel: 'Knowledge', marks: '1 mark', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
        { key: 'kha', label: 'খ', sublabel: 'Comprehension', marks: '2 marks', color: 'bg-teal-500/10 text-teal-600 border-teal-500/30' },
        { key: 'ga', label: 'গ', sublabel: 'Application', marks: '3 marks', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
        { key: 'gha', label: 'ঘ', sublabel: 'Higher Order', marks: '4 marks', color: 'bg-primary/10 text-primary border-primary/30' },
    ];

    return (
        <div className="space-y-4">
            <Section icon={BookOpen} label="Topic" delay={0.05}>
                <p className="text-base font-heading font-semibold text-foreground">{data.topic}</p>
            </Section>

            {data.stimulus && (
                <Section icon={FileText} label="উদ্দীপক (Stimulus)" delay={0.1}>
                    <blockquote className="border-l-2 border-primary/40 pl-3 py-1 text-sm italic text-foreground/80 bg-primary/5 rounded-r-lg">
                        {data.stimulus}
                    </blockquote>
                </Section>
            )}

            {parts.map((part, i) => data[part.key] && (
                <Section key={part.key} icon={null} label={`${part.label} — ${part.sublabel}`} delay={0.15 + i * 0.05}>
                    <div className={cn('rounded-lg border px-3 py-2', part.color)}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-label font-semibold uppercase tracking-wider">{part.label} {part.sublabel}</span>
                            <span className="text-[10px] font-label font-medium opacity-70">{part.marks}</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{data[part.key]}</p>
                    </div>
                </Section>
            ))}

            {data.tips?.length > 0 && (
                <Section icon={Lightbulb} label="Exam Tips" delay={0.4}>
                    <ul className="space-y-1.5">
                        {data.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 size={13} className="text-primary mt-0.5 shrink-0" />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}
        </div>
    );
}

// Compass (not Sparkles) for `general` per AI_TUTOR_DESIGN.md §2.4 + §5.15.
// Sparkles is the AI's brand glyph; using it here would conflict with
// the layout chrome (header logo, ThinkingBubble avatar).
const TEMPLATE_META = {
    concept: { label: 'Concept Explanation', color: 'from-blue-500/10 to-blue-500/0', icon: BookOpen },
    math: { label: 'Math Solution', color: 'from-purple-500/10 to-purple-500/0', icon: Calculator },
    programming: { label: 'Programming Help', color: 'from-emerald-500/10 to-emerald-500/0', icon: Code2 },
    ielts: { label: 'IELTS Review', color: 'from-amber-500/10 to-amber-500/0', icon: Languages },
    general: { label: 'Answer', color: 'from-indigo-500/10 to-indigo-500/0', icon: Compass },
    srijonshil: { label: 'সৃজনশীল (Creative Question)', color: 'from-rose-500/10 to-rose-500/0', icon: FileText },
};

const TEMPLATE_RENDERERS = {
    concept: ConceptTemplate,
    math: MathTemplate,
    programming: ProgrammingTemplate,
    ielts: IeltsTemplate,
    general: GeneralTemplate,
    srijonshil: SrijonshilTemplate,
};

/**
 * @param {Object}  props
 * @param {Object}  props.structured  The parsed LLM JSON (templateType + sections)
 * @param {string}  props.provider    'gemini' | 'openrouter'
 * @param {number}  props.latencyMs   LLM call latency
 * @param {Object}  [props.quizCta]   If present, renders a "Start quiz on this topic" button.
 * @param {Function}[props.onStartQuiz]
 * @param {React.ReactNode} [props.children]  Extra sections to render (e.g. tutor recommendations).
 */
export default function AiResponseCard({
    structured,
    provider,
    latencyMs,
    quizCta,
    onStartQuiz,
    onFollowUpClick,
    children,
    className = '',
}) {
    if (!structured) return null;

    // AI_TUTOR_DESIGN.md §5.12.3 — conversational template is rendered
    // via ConversationalBubble, not as a card. Bail out here so the
    // dispatcher in ChatMessage.jsx doesn't accidentally double-render.
    if (structured.templateType === 'conversational') {
        return <ConversationalBubble structured={structured} onFollowUpClick={onFollowUpClick} className={className} />;
    }

    const type = structured.templateType || 'general';
    const Renderer = TEMPLATE_RENDERERS[type] || GeneralTemplate;
    const meta = TEMPLATE_META[type] || TEMPLATE_META.general;
    const MetaIcon = meta.icon;

    return (
        <article
            className={cn(
                'relative overflow-hidden rounded-2xl rounded-tl-sm border border-border/70 bg-card/80 backdrop-blur-md shadow-sm animate-fade-in-up w-full',
                className,
            )}
        >
            {/* Soft top gradient */}
            <div className={cn('absolute inset-x-0 top-0 h-20 bg-gradient-to-b pointer-events-none', meta.color)} />

            {/* Header */}
            <header className="relative flex items-center justify-between gap-2 px-5 pt-4 pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center size-7 rounded-lg bg-primary/15 text-primary">
                        <MetaIcon size={15} strokeWidth={2.4} />
                    </span>
                    <div>
                        <p className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                            Porua
                        </p>
                        <h3 className="text-sm font-heading font-bold text-foreground">{meta.label}</h3>
                    </div>
                </div>
                {(provider || latencyMs) && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/80 font-label tracking-wider">
                        <Clock size={10} />
                        <span>{latencyMs ? `${(latencyMs / 1000).toFixed(1)}s` : ''}</span>
                        {provider && (
                            <span className="px-1.5 py-0.5 rounded bg-muted/60 text-foreground/80 capitalize">
                                {provider === 'openrouter' ? 'OR' : 'Gemini'}
                            </span>
                        )}
                    </div>
                )}
            </header>

            {/* Body */}
            <div className="relative px-5 py-4 space-y-4">
                <RendererBoundary>
                    <Renderer data={structured} onFollowUpClick={onFollowUpClick} />
                </RendererBoundary>

                {/* Optional inline quiz CTA */}
                {quizCta && (
                    <div
                        className="flex items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 animate-fade-in-up"
                        style={{ animationDelay: '400ms', animationFillMode: 'both' }}
                    >
                        <div className="flex items-center gap-2">
                            <ClipboardList size={16} className="text-accent" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">{quizCta.label || 'Ready to test yourself?'}</p>
                                {quizCta.description && (
                                    <p className="text-xs text-muted-foreground">{quizCta.description}</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onStartQuiz?.(structured?.topic)}
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-accent text-accent-foreground px-3.5 h-9 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all"
                        >
                            <ClipboardList size={12} />
                            Start Quiz
                        </button>
                    </div>
                )}

                {/* Extra sections (e.g. tutor recommendations) */}
                {children}
            </div>
        </article>
    );
}
