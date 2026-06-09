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

// Flat V2 Section Header
function SectionTitle({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-2 mb-2 mt-6">
            {Icon && <Icon size={16} className="text-primary/70" />}
            <h3 className="text-[16px] font-semibold text-foreground tracking-tight">{title}</h3>
        </div>
    );
}

// V2 Educational Highlight Block (compact, minimal border)
function Highlight({ type, title, children }) {
    const config = {
        key: { icon: Idea, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', defaultTitle: 'Key Point' },
        mistake: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', defaultTitle: 'Common Mistake' },
        tip: { icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', defaultTitle: 'Exam Tip' },
    };
    const c = config[type] || config.key;
    const Icon = c.icon;

    return (
        <div className={cn("mt-4 mb-2 p-3 rounded-lg border", c.bg, c.border)}>
            <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={14} className={c.color} />
                <span className={cn("text-xs font-bold uppercase tracking-wider", c.color)}>
                    {title || c.defaultTitle}
                </span>
            </div>
            <div className="text-[15px] leading-relaxed text-foreground/80 pl-5">
                {children}
            </div>
        </div>
    );
}

function BulletList({ items }) {
    if (!items || items.length === 0) return null;
    return (
        <ul className="space-y-1.5 mt-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] leading-[1.6] text-foreground/90">
                    <span className="mt-2 size-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span className="flex-1">{item}</span>
                </li>
            ))}
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
        <div className="relative group mt-3 mb-4">
            <pre className="bg-zinc-950/90 dark:bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-[13px] font-mono leading-relaxed overflow-x-auto whitespace-pre text-zinc-100">
                {code}
            </pre>
            <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2 right-2 text-[10px] font-medium tracking-wider px-2 py-1 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
                {copied ? 'Copied' : 'Copy'}
            </button>
        </div>
    );
}

// Minimal Direct Answer Block
function DirectAnswer({ text }) {
    if (!text) return null;
    return (
        <p className="text-[15px] sm:text-[16px] text-foreground leading-[1.6] mb-4">
            {text}
        </p>
    );
}

// Follow-up chips
function FollowUpChips({ suggestions, onClick }) {
    if (!Array.isArray(suggestions) || suggestions.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/40">
            {suggestions.slice(0, 3).map((s, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onClick?.(s)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-transparent text-[13px] text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                >
                    <Idea size={14} />
                    <span>{s}</span>
                </button>
            ))}
        </div>
    );
}

// Main Templates
function ConceptTemplate({ data }) {
    return (
        <div>
            <DirectAnswer text={data.easyExplanation} />
            
            {data.keyConcepts?.length > 0 && (
                <div>
                    <SectionTitle icon={Brain} title="Key Concepts" />
                    <BulletList items={data.keyConcepts} />
                </div>
            )}
            
            {data.realLifeExample && (
                <Highlight type="key" title="Real-Life Example">
                    {data.realLifeExample}
                </Highlight>
            )}
            
            {data.commonMistakes?.length > 0 && (
                <Highlight type="mistake" title="Common Mistakes">
                    <BulletList items={data.commonMistakes} />
                </Highlight>
            )}
        </div>
    );
}

function MathTemplate({ data }) {
    return (
        <div>
            {data.problem && (
                <div className="bg-muted/30 border-l-4 border-primary/40 pl-4 py-2 mb-4 text-[15px] font-mono text-foreground/80">
                    {data.problem}
                </div>
            )}
            
            {data.given && (
                <div className="mb-4 text-[15px] leading-[1.6]">
                    <strong>Given:</strong> {data.given}
                </div>
            )}
            
            {data.stepByStep?.length > 0 && (
                <div>
                    <SectionTitle icon={Calculator} title="Step-by-Step Solution" />
                    <ol className="space-y-2 list-decimal list-inside marker:text-primary marker:font-semibold text-[15px] leading-[1.6] text-foreground/90">
                        {data.stepByStep.map((step, i) => (
                            <li key={i} className="pl-1">{step}</li>
                        ))}
                    </ol>
                </div>
            )}
            
            {data.finalAnswer && (
                <div className="mt-6 mb-4">
                    <span className="inline-block bg-primary/10 text-primary border border-primary/20 rounded-md px-4 py-2 font-mono font-semibold text-base">
                        Answer: {data.finalAnswer}
                    </span>
                </div>
            )}
            
            {data.whyThisWorks && (
                <Highlight type="key" title="Why This Works">
                    {data.whyThisWorks}
                </Highlight>
            )}
            
            {data.similarPractice && (
                <Highlight type="tip" title="Practice Idea">
                    {data.similarPractice}
                </Highlight>
            )}
        </div>
    );
}

function ProgrammingTemplate({ data }) {
    return (
        <div>
            <DirectAnswer text={data.codeExplanation} />
            
            {data.solution && <CodeBlock code={data.solution} />}
            
            {data.bestPractices?.length > 0 && (
                <div>
                    <SectionTitle icon={Zap} title="Best Practices" />
                    <BulletList items={data.bestPractices} />
                </div>
            )}
            
            {data.commonMistakes?.length > 0 && (
                <Highlight type="mistake" title="Common Mistakes">
                    <BulletList items={data.commonMistakes} />
                </Highlight>
            )}
            
            {data.testCases?.length > 0 && (
                <div className="mt-4">
                    <SectionTitle icon={CheckCircle2} title="Test Cases" />
                    <div className="space-y-2">
                        {data.testCases.map((tc, i) => (
                            <div key={i} className="bg-muted/20 border border-border/50 rounded-md p-3 text-[14px] font-mono text-foreground/80">
                                <div className="mb-1"><span className="text-muted-foreground">Input:</span> {tc.input}</div>
                                <div><span className="text-muted-foreground">Output:</span> {tc.expectedOutput}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function GeneralTemplate({ data }) {
    return (
        <div>
            <DirectAnswer text={data.answer} />
            
            {data.keyPoints?.length > 0 && (
                <div>
                    <SectionTitle icon={ListChecks} title="Key Points" />
                    <BulletList items={data.keyPoints} />
                </div>
            )}
            
            {data.didYouKnow && (
                <Highlight type="tip" title="Did you know?">
                    {data.didYouKnow}
                </Highlight>
            )}
        </div>
    );
}

// Fallbacks for specific formats
function IeltsTemplate({ data }) {
    const s = data.estimatedScore || {};
    return (
        <div>
            <DirectAnswer text={data.evaluation} />
            
            {s.overall != null && (
                <div className="my-6 flex items-center gap-4 border border-border/50 rounded-xl p-4 bg-muted/10 w-fit">
                    <div className="flex flex-col items-center border-r border-border/50 pr-4">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Score</span>
                        <span className="text-3xl font-bold text-primary">{s.overall}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 text-[14px]">
                        {s.grammar != null && <div><span className="text-muted-foreground w-20 inline-block">Grammar:</span> <span className="font-medium">{s.grammar}</span></div>}
                        {s.vocabulary != null && <div><span className="text-muted-foreground w-20 inline-block">Vocab:</span> <span className="font-medium">{s.vocabulary}</span></div>}
                        {s.coherence != null && <div><span className="text-muted-foreground w-20 inline-block">Coherence:</span> <span className="font-medium">{s.coherence}</span></div>}
                    </div>
                </div>
            )}
            
            {data.improvedVersion && (
                <div>
                    <SectionTitle icon={FileEdit} title="Improved Version" />
                    <div className="bg-muted/20 border-l-4 border-primary/40 pl-4 py-3 text-[15px] leading-[1.6] whitespace-pre-wrap italic">
                        {data.improvedVersion}
                    </div>
                </div>
            )}
            
            {data.strengths?.length > 0 && (
                <Highlight type="key" title="Strengths">
                    <BulletList items={data.strengths} />
                </Highlight>
            )}
            
            {data.improvements?.length > 0 && (
                <Highlight type="mistake" title="Areas for Improvement">
                    <BulletList items={data.improvements} />
                </Highlight>
            )}
            
            {data.practiceTips?.length > 0 && (
                <div>
                    <SectionTitle icon={Sparkles} title="Practice Tips" />
                    <BulletList items={data.practiceTips} />
                </div>
            )}
        </div>
    );
}

function SrijonshilTemplate({ data }) {
    const parts = [
        { key: 'ka', label: 'ক', sublabel: 'Knowledge', marks: '1' },
        { key: 'kha', label: 'খ', sublabel: 'Comprehension', marks: '2' },
        { key: 'ga', label: 'গ', sublabel: 'Application', marks: '3' },
        { key: 'gha', label: 'ঘ', sublabel: 'Higher Order', marks: '4' },
    ];

    return (
        <div>
            {data.stimulus && (
                <div className="bg-muted/10 border-l-4 border-primary/40 pl-4 py-3 mb-6 text-[15px] italic text-foreground/80 leading-[1.6] rounded-r-lg">
                    {data.stimulus}
                </div>
            )}

            <div className="space-y-6">
                {parts.map((part) => data[part.key] && (
                    <div key={part.key}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center size-6 rounded bg-primary/10 text-primary font-bold text-sm">
                                {part.label}
                            </span>
                            <h4 className="text-[15px] font-semibold text-foreground/90">{part.sublabel}</h4>
                            <span className="ml-auto text-[13px] font-medium text-muted-foreground">{part.marks} mark{part.marks > '1' ? 's' : ''}</span>
                        </div>
                        <p className="text-[15px] leading-[1.6] whitespace-pre-wrap pl-8 text-foreground/90">
                            {data[part.key]}
                        </p>
                    </div>
                ))}
            </div>

            {data.tips?.length > 0 && (
                <Highlight type="tip" title="Exam Tips">
                    <BulletList items={data.tips} />
                </Highlight>
            )}
        </div>
    );
}

const TEMPLATE_RENDERERS = {
    concept: ConceptTemplate,
    math: MathTemplate,
    programming: ProgrammingTemplate,
    ielts: IeltsTemplate,
    general: GeneralTemplate,
    srijonshil: SrijonshilTemplate,
};

function getMetadataLabel(type, topic) {
    // Generate a simple metadata string, e.g., "Programming • Beginner • 2 min read"
    let cat = "General";
    if (type === 'concept') cat = "Education";
    if (type === 'math') cat = "Mathematics";
    if (type === 'programming') cat = "Programming";
    if (type === 'ielts') cat = "IELTS";
    if (type === 'srijonshil') cat = "Srijonshil";
    
    // Very naive read time estimation
    const words = JSON.stringify(topic || "").split(/\s+/).length * 10; // rough proxy
    const time = Math.max(1, Math.ceil(words / 200));
    
    return `${cat} • ${time} min read`;
}

export default function AiResponseCard({
    structured,
    // eslint-disable-next-line no-unused-vars
    provider,
    // eslint-disable-next-line no-unused-vars
    latencyMs,
    quizCta,
    onStartQuiz,
    onFollowUpClick,
    children,
    className = '',
}) {
    if (!structured) return null;

    if (structured.templateType === 'conversational') {
        return <ConversationalBubble structured={structured} onFollowUpClick={onFollowUpClick} className={className} />;
    }

    const type = structured.templateType || 'general';
    const Renderer = TEMPLATE_RENDERERS[type] || GeneralTemplate;
    const metadataStr = getMetadataLabel(type, structured.topic);

    return (
        <article className={cn('animate-fade-in-up w-full max-w-[850px] bg-card/60 border border-border/60 shadow-sm rounded-2xl p-5', className)}>
            {/* Header: Small metadata row */}
            <div className="flex items-center gap-3 text-[13px] text-muted-foreground mb-3 font-medium">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center size-5 rounded-md bg-primary/10 text-primary">
                        <Sparkles size={12} />
                    </span>
                    <span>{metadataStr}</span>
                </div>
            </div>

            {/* Main Title: Large clear title */}
            {structured.topic && (
                <h1 className="text-[22px] font-bold text-foreground leading-snug mb-4 tracking-tight">
                    {structured.topic}
                </h1>
            )}

            {/* Body */}
            <div className="space-y-2">
                <RendererBoundary>
                    <Renderer data={structured} />
                </RendererBoundary>

                <FollowUpChips suggestions={structured.followUpSuggestions} onClick={onFollowUpClick} />

                {/* Optional inline quiz CTA (V2 flat style) */}
                {quizCta && (
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-border/40">
                        <div className="flex items-center gap-3">
                            <Brain size={20} className="text-primary" />
                            <p className="text-[15px] font-medium text-foreground">
                                🧠 Want to test yourself?
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onStartQuiz?.(structured?.topic)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[14px] font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <ClipboardList size={16} />
                            Generate Quiz
                        </button>
                    </div>
                )}

                {/* Extra sections (e.g. tutor recommendations) */}
                {children}
            </div>
        </article>
    );
}
