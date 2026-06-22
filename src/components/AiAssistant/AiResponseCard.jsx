/* eslint-disable react-refresh/only-export-components */
import { useState, Component } from 'react';
import {
    BookOpen, Target, Brain, Globe, AlertTriangle, ClipboardList,
    Sigma, ListChecks, FileText, CheckCircle2, ChevronDown,
    Calculator, Lightbulb, Code2, Languages, FileEdit, Clock, Zap,
    XCircle, Compass, Lightbulb as Idea, GraduationCap, BookMarked, Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ConversationalBubble from './ConversationalBubble';
import PoruaLogo from './PoruaLogo';

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

export function parseInlineCode(text) {
    if (!text || typeof text !== 'string') return text;
    if (!text.includes('`')) return text;

    const parts = text.split(/`([^`]+)`/g);
    return parts.map((part, index) => {
        if (index % 2 === 1) {
            return (
                <code
                    key={index}
                    className="px-1.5 py-0.5 mx-0.5 rounded bg-muted text-primary border border-border/40 font-mono text-[13px]"
                >
                    {part}
                </code>
            );
        }
        return part;
    });
}

// Premium Swiss Section Divider
function SectionTitle({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-4 mb-5 mt-8">
            <div className="text-[12px] font-bold uppercase tracking-[1px] text-accent bg-accent/10 px-3 py-1.5 border border-accent/20 rounded-sm flex items-center gap-2">
                {Icon && <Icon size={14} strokeWidth={2.5} />}
                {title}
            </div>
            <div className="flex-1 h-[1px] bg-border"></div>
        </div>
    );
}

// ─── New student-friendly components ────────────────────────────────────────

// Difficulty badge shown in the card header
function DifficultyBadge({ level }) {
    if (!level) return null;
    const map = {
        beginner:     { label: 'Beginner',     color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
        intermediate: { label: 'Intermediate', color: 'bg-amber-500/10   text-amber-600   dark:text-amber-400   border-amber-500/20'   },
        advanced:     { label: 'Advanced',     color: 'bg-rose-500/10    text-rose-600    dark:text-rose-400    border-rose-500/20'    },
    };
    const m = map[level] || map.beginner;
    return (
        <span className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]',
            m.color,
        )}>
            <Flame size={9} strokeWidth={2.5} />
            {m.label}
        </span>
    );
}

// Analogy-first story card — rendered BEFORE the technical explanation
function AnalogyCard({ text }) {
    if (!text) return null;
    return (
        <div className="relative mb-5 rounded-xl border border-amber-200/50 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-950/20 p-4 pl-12">
            {/* Speech bubble icon */}
            <div className="absolute left-3 top-3.5 size-7 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-base">
                💬
            </div>
            <p className="text-[15px] leading-[1.65] text-foreground/90 italic">
                {parseInlineCode(text)}
            </p>
            <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-600/60 dark:text-amber-400/50">
                Analogy · Think of it this way
            </span>
        </div>
    );
}

// Bilingual key terms table — English | বাংলা | Definition
function BilingualKeyTerms({ terms }) {
    if (!Array.isArray(terms) || terms.length === 0) return null;
    return (
        <div className="mt-5">
            <div className="flex items-center gap-2 mb-2">
                <Languages size={15} className="text-primary/70" />
                <span className="text-[13px] font-semibold text-foreground/70 uppercase tracking-wider">Key Terms</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-border/60">
                <table className="w-full text-[13px]">
                    <thead>
                        <tr className="bg-muted/40 border-b border-border/40">
                            <th className="text-left px-3 py-2 font-semibold text-foreground/60 w-1/4">English</th>
                            <th className="text-left px-3 py-2 font-semibold text-foreground/60 w-1/4">বাংলা</th>
                            <th className="text-left px-3 py-2 font-semibold text-foreground/60">Definition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {terms.map((t, i) => (
                            <tr
                                key={i}
                                className={cn(
                                    'border-b border-border/30 last:border-0',
                                    i % 2 === 0 ? 'bg-transparent' : 'bg-muted/20',
                                )}
                            >
                                <td className="px-3 py-2 font-medium text-foreground">{t.term}</td>
                                <td className="px-3 py-2 font-medium text-primary">{t.bangla}</td>
                                <td className="px-3 py-2 text-foreground/70 leading-relaxed">{parseInlineCode(t.definition)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Memory hook — mnemonic or trick
function MemoryHook({ text }) {
    if (!text) return null;
    return (
        <div className="mt-4 rounded-xl border border-sky-400/20 dark:border-sky-500/20 bg-sky-50/60 dark:bg-sky-950/20 p-3.5 flex items-start gap-3">
            <div className="shrink-0 size-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sm">
                🧠
            </div>
            <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-sky-600 dark:text-sky-400 mb-1">
                    Memory Hook
                </span>
                <p className="text-[14px] leading-relaxed text-foreground/90 font-medium">
                    {parseInlineCode(text)}
                </p>
            </div>
        </div>
    );
}

// Exam spotlight — board-exam specific tip
function ExamSpotlight({ text }) {
    if (!text) return null;
    return (
        <div className="mt-4 rounded-xl border border-emerald-400/25 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 flex items-start gap-3">
            <div className="shrink-0 size-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <GraduationCap size={14} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400 mb-1">
                    📝 Exam Spotlight · SSC / HSC / Admission
                </span>
                <p className="text-[14px] leading-relaxed text-foreground/90">
                    {parseInlineCode(text)}
                </p>
            </div>
        </div>
    );
}

// ─── Existing shared components ──────────────────────────────────────────────

// V2 Educational Highlight Block (compact, minimal border)
function Highlight({ type, title, children }) {
    const config = {
        key:     { icon: Idea,          color: 'text-blue-500',  bg: 'bg-blue-500/10',  border: 'border-blue-500/20',  defaultTitle: 'Key Point' },
        mistake: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', defaultTitle: 'Common Mistake' },
        tip:     { icon: ({size, className}) => <PoruaLogo iconOnly size={size || 14} className={className} />,      color: 'text-primary',   bg: 'bg-primary/10',   border: 'border-primary/20',   defaultTitle: 'Exam Tip' },
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
                    <span className="flex-1">{parseInlineCode(item)}</span>
                </li>
            ))}
        </ul>
    );
}

function isHtmlCode(code) {
    if (!code || typeof code !== 'string') return false;
    const clean = code.trim().toLowerCase();
    return (
        clean.startsWith('<!doctype html') ||
        clean.includes('<html') ||
        (clean.includes('<body') && clean.includes('</body>')) ||
        (clean.includes('<table') && clean.includes('</table>')) ||
        (clean.includes('<div') && clean.includes('</div>'))
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

    const handlePreview = () => {
        try {
            const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
            const blobUrl = URL.createObjectURL(blob);
            const previewWindow = window.open(blobUrl, '_blank');
            if (!previewWindow) {
                alert('Popup blocker prevented opening the preview in a new tab. Please allow popups for this site.');
                return;
            }
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 60000);
        } catch (err) {
            console.error('Failed to open preview:', err);
        }
    };

    const isHtml = isHtmlCode(code);

    return (
        <div className="relative group mt-3 mb-6">
            <pre className="bg-[#080a0d] dark:bg-[#080a0d] border border-border rounded-sm p-5 text-[13px] font-mono leading-relaxed overflow-x-auto whitespace-pre text-zinc-100 shadow-sm">
                {code}
            </pre>
            <div className="absolute top-3 right-3 flex items-center gap-2">
                {isHtml && (
                    <button
                        type="button"
                        onClick={handlePreview}
                        className="text-[11px] font-bold px-2 py-1 rounded-[2px] border border-[#f97316]/30 bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316] hover:text-white hover:border-[#f97316] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer"
                    >
                        Preview
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[11px] font-medium px-2 py-1 rounded-sm border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
        </div>
    );
}

// Minimal Direct Answer Block
function DirectAnswer({ text }) {
    if (!text) return null;
    return (
        <p className="text-[15px] sm:text-[16px] text-foreground leading-[1.6] mb-4">
            {parseInlineCode(text)}
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
            {/* 1. Analogy-first — story BEFORE the technical explanation */}
            <AnalogyCard text={data.analogyFirst} />

            {/* 2. Technical explanation */}
            <DirectAnswer text={data.easyExplanation} />

            {/* 3. Key concepts */}
            {data.keyConcepts?.length > 0 && (
                <div>
                    <SectionTitle icon={Brain} title="Key Concepts" />
                    <BulletList items={data.keyConcepts} />
                </div>
            )}

            {/* 4. Bilingual key terms */}
            <BilingualKeyTerms terms={data.bilingualKeyTerms} />

            {/* 5. Memory hook */}
            <MemoryHook text={data.memoryHook} />

            {/* 6. Common mistakes */}
            {data.commonMistakes?.length > 0 && (
                <Highlight type="mistake" title="Common Mistakes">
                    <BulletList items={data.commonMistakes} />
                </Highlight>
            )}

            {/* 7. Exam spotlight */}
            <ExamSpotlight text={data.examSpotlight} />

            {/* Legacy: realLifeExample from old schema */}
            {!data.analogyFirst && data.realLifeExample && (
                <Highlight type="key" title="Real-Life Example">
                    {data.realLifeExample}
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
                    {parseInlineCode(data.problem)}
                </div>
            )}

            {data.given && (
                <div className="mb-4 text-[15px] leading-[1.6]">
                    <strong>Given:</strong> {parseInlineCode(data.given)}
                </div>
            )}

            {data.stepByStep?.length > 0 && (
                <div>
                    <SectionTitle icon={Calculator} title="Step-by-Step Solution" />
                    <ol className="space-y-2 list-decimal list-inside marker:text-primary marker:font-semibold text-[15px] leading-[1.6] text-foreground/90">
                        {data.stepByStep.map((step, i) => (
                            <li key={i} className="pl-1">{parseInlineCode(step)}</li>
                        ))}
                    </ol>
                </div>
            )}

            {data.finalAnswer && (
                <div className="mt-6 mb-4">
                    <span className="inline-block bg-primary/10 text-primary border border-primary/20 rounded-md px-4 py-2 font-mono font-semibold text-base">
                        Answer: {parseInlineCode(data.finalAnswer)}
                    </span>
                </div>
            )}

            {data.whyThisWorks && (
                <Highlight type="key" title="Why This Works">
                    {parseInlineCode(data.whyThisWorks)}
                </Highlight>
            )}

            {/* Memory hook for formulas/tricks */}
            <MemoryHook text={data.memoryHook} />

            {/* Exam tip */}
            <ExamSpotlight text={data.examSpotlight} />

            {data.similarPractice && (
                <Highlight type="tip" title="Practice Problem">
                    {parseInlineCode(data.similarPractice)}
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
            
            {(data.bestPractices?.length > 0 || data.commonMistakes?.length > 0) && (
                <div className="mt-8 mb-6">
                    <SectionTitle icon={Idea} title="Insights & Best Practices" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {data.bestPractices?.length > 0 && (
                            <div className="bg-transparent border border-border hover:border-foreground/30 transition-colors p-5 rounded-sm shadow-sm flex flex-col gap-3">
                                <h3 className="font-bold text-[16px] flex items-center gap-2 text-success">
                                    <Zap size={16} strokeWidth={2.5} />
                                    Best Practices
                                </h3>
                                <BulletList items={data.bestPractices} />
                            </div>
                        )}
                        {data.commonMistakes?.length > 0 && (
                            <div className="bg-transparent border border-border hover:border-foreground/30 transition-colors p-5 rounded-sm shadow-sm flex flex-col gap-3">
                                <h3 className="font-bold text-[16px] flex items-center gap-2 text-accent">
                                    <AlertTriangle size={16} strokeWidth={2.5} />
                                    Common Pitfalls
                                </h3>
                                <BulletList items={data.commonMistakes} />
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {data.testCases?.length > 0 && (
                <div className="mt-8">
                    <SectionTitle icon={CheckCircle2} title="Verification & Tests" />
                    <div className="space-y-2">
                        {data.testCases.map((tc, i) => (
                            <div key={i} className="bg-muted/10 border border-border/60 rounded-sm p-4 text-[14px] font-mono text-foreground/80">
                                <div className="mb-2"><span className="text-muted-foreground font-sans text-xs uppercase tracking-wider font-semibold">Input:</span> <br/>{parseInlineCode(tc.input)}</div>
                                <div><span className="text-muted-foreground font-sans text-xs uppercase tracking-wider font-semibold">Output:</span> <br/>{parseInlineCode(tc.expectedOutput)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function RefusedMessage({ data }) {
    const category = data._meta?.category || 'off-topic';
    const heading = {
        'politics': 'Politics',
        'religion-debate': 'Religious Debate',
        'adult-content': 'Adult Content',
        'violence': 'Violence',
        'illegal-activity': 'Illegal Activity',
        'medical-advice': 'Medical Advice',
        'legal-advice': 'Legal Advice',
        'financial-advice': 'Financial Advice',
        'personal-relationship': 'Personal Relationship',
    }[category] || 'Off-Topic';

    return (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <AlertTriangle size={14} className="text-amber-500" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                        {heading}
                    </p>
                    <p className="text-[11px] text-amber-500/60">This topic is outside Porua&apos;s scope</p>
                </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
                {data.answer}
            </p>
            {data.keyPoints?.length > 0 && (
                <div className="pt-2 border-t border-amber-500/10">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        I can help with:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {data.keyPoints.map((point, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground border border-border/50">
                                {point}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {data.followUpSuggestion && (
                <p className="text-xs text-muted-foreground italic">
                    {data.followUpSuggestion}
                </p>
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
                    {parseInlineCode(data.didYouKnow)}
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
                        {parseInlineCode(data.improvedVersion)}
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
                    <SectionTitle icon={({size, className}) => <PoruaLogo iconOnly size={size || 20} className={className} />} title="Practice Tips" />
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
                    {parseInlineCode(data.stimulus)}
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
                            {parseInlineCode(data[part.key])}
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

function NeoBrutalistDivider({ title, icon: Icon }) {
    return (
        <div className="flex items-center gap-4 mb-5">
            <div className="text-[12px] font-bold uppercase tracking-[1px] text-[#f97316] bg-[rgba(249,115,22,0.1)] py-1 px-3 border border-[rgba(249,115,22,0.2)] rounded-[2px] flex items-center gap-2">
                {Icon && <Icon size={12} strokeWidth={2.5} />}
                {title}
            </div>
            <div className="flex-1 h-[1px] bg-border"></div>
        </div>
    );
}

function UnifiedTemplate({ data }) {
    return (
        <div className="flex flex-col gap-8">
            {/* SECTION 1: Solution Code */}
            {data.solution && (
                <section>
                    <NeoBrutalistDivider title={data.solution.title || "Solution"} icon={FileText} />
                    {data.solution.explanation && (
                        <p className="text-muted-foreground leading-[1.6] text-[15px] mb-4">
                            {parseInlineCode(data.solution.explanation)}
                        </p>
                    )}
                    {data.solution.codeOrMath && (
                        <div className="mt-4 rounded-[2px] overflow-hidden shadow-sm border border-border">
                            <CodeBlock code={data.solution.codeOrMath} />
                        </div>
                    )}
                </section>
            )}
            
            {/* SECTION 2: Insights & Best Practices */}
            {data.insights && data.insights.cards?.length > 0 && (
                <section>
                    <NeoBrutalistDivider title={data.insights.title || "Insights & Best Practices"} icon={Idea} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                        {data.insights.cards.map((card, i) => (
                            <div key={i} className="bg-[rgba(255,255,255,0.01)] border border-border hover:border-muted-foreground/30 p-5 rounded-[2px] shadow-sm flex flex-col gap-3 transition-colors duration-300">
                                <h3 className={cn("font-bold text-[16px] flex items-center gap-2", card.type === 'success' ? "text-[#10b981]" : card.type === 'warning' ? "text-[#f97316]" : "text-primary")}>
                                    {card.type === 'success' ? <CheckCircle2 size={16} strokeWidth={2.5} /> : card.type === 'warning' ? <AlertTriangle size={16} strokeWidth={2.5} /> : <Idea size={16} strokeWidth={2.5} />}
                                    {card.title}
                                </h3>
                                <ul className="flex flex-col gap-2.5 list-none">
                                    {card.points.map((pt, j) => (
                                        <li key={j} className="text-[14px] leading-[1.5] text-muted-foreground relative pl-4">
                                            <span className="absolute left-0 top-0 font-bold">•</span>
                                            {parseInlineCode(pt)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            
            {/* SECTION 3: Verification & Tests */}
            {data.verification && data.verification.scenarios?.length > 0 && (
                <section>
                    <NeoBrutalistDivider title={data.verification.title || "Verification & Tests"} icon={CheckCircle2} />
                    <div className="w-full mt-3 rounded-[2px] overflow-hidden border border-border overflow-x-auto">
                        <table className="w-full text-left text-[14px] border-collapse whitespace-nowrap md:whitespace-normal">
                            <thead className="bg-[rgba(255,255,255,0.02)] border-b border-border text-foreground font-semibold">
                                <tr>
                                    <th className="p-3 border-r border-border min-w-[120px]">Test Scenario</th>
                                    <th className="p-3 border-r border-border min-w-[150px]">Input</th>
                                    <th className="p-3 min-w-[200px]">Expected Output</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.verification.scenarios.map((tc, i) => (
                                    <tr key={i} className="border-b border-border last:border-b-0">
                                        <td className="p-3 border-r border-border align-top">{parseInlineCode(tc.scenario || `Scenario ${i+1}`)}</td>
                                        <td className="p-3 border-r border-border align-top"><code className="font-mono text-[13px] px-1.5 py-0.5 bg-background border border-border rounded-[2px] text-[#f97316] break-all">{tc.input}</code></td>
                                        <td className="p-3 align-top">{parseInlineCode(tc.expectedOutput)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
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
    unified: UnifiedTemplate,
};

function getMetadataLabel(type, topic) {
    let cat = 'General';
    if (type === 'concept')     cat = 'Education';
    if (type === 'math')        cat = 'Mathematics';
    if (type === 'programming') cat = 'Programming';
    if (type === 'ielts')       cat = 'IELTS';
    if (type === 'srijonshil')  cat = 'Srijonshil';
    const words = JSON.stringify(topic || '').split(/\s+/).length * 10;
    const time = Math.max(1, Math.ceil(words / 200));
    return `${cat} • ${time} min read`;
}

export default function AiResponseCard({
    structured: structuredProp,
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
    // Defensive: if structured is a JSON string, parse it
    let structured = structuredProp;
    if (typeof structured === 'string') {
        try { structured = JSON.parse(structured); } catch { structured = null; }
    }
    if (!structured || typeof structured !== 'object') return null;

    // Scope-guard refusal: render a compact warning card instead of the
    // normal template. The structured payload has _meta.refused: true
    // with a category and a pre-written answer listing supported topics.
    if (structured._meta?.refused) {
        return <RefusedMessage data={structured} />;
    }

    if (structured.templateType === 'conversational') {
        return <ConversationalBubble structured={structured} onFollowUpClick={onFollowUpClick} className={className} />;
    }

    const type = structured.templateType || 'general';
    const Renderer = TEMPLATE_RENDERERS[type] || GeneralTemplate;
    const metadataStr = getMetadataLabel(type, structured.topic);

    return (
        <article className={cn('animate-fade-in-up w-full max-w-[850px] bg-card border border-border rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-6', className)}>
            {/* Header: metadata row with difficulty badge */}
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-3 font-medium flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center size-5 rounded-md bg-primary/10 text-primary">
                        <PoruaLogo iconOnly size={12} />
                    </span>
                    <span>{metadataStr}</span>
                </div>
                {/* Difficulty badge — from new schema field */}
                {structured.difficultyLevel && (
                    <>
                        <span className="text-border/60">·</span>
                        <DifficultyBadge level={structured.difficultyLevel} />
                    </>
                )}
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

                {/* Optional inline quiz CTA (Neo-Brutalist Premium style) */}
                {quizCta && (
                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg border border-border bg-gradient-to-b from-transparent to-accent/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[16px] font-bold text-foreground flex items-center gap-2">
                                <Brain size={18} className="text-accent" />
                                Want to test your understanding?
                            </h3>
                            <p className="text-[13px] text-muted-foreground">
                                Take a micro-quiz based on this content.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onStartQuiz?.(structured?.topic)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-accent text-white text-[14px] font-semibold transition-all duration-200 hover:bg-accent/90 hover:scale-[1.03] active:scale-[0.98] shadow-[0_4px_12px_rgba(var(--accent-rgb),0.2)]"
                        >
                            Generate Quiz
                            <ClipboardList size={16} />
                        </button>
                    </div>
                )}

                {/* Extra sections (e.g. tutor recommendations) */}
                {children}
            </div>
        </article>
    );
}
