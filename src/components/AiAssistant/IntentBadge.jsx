// components/AiAssistant/IntentBadge.jsx
// Displays a small pill showing Porua AI's detected intent mode above
// a response card. Maps backend templateType → spec intent label.
//
// Intent → UI Mode mapping from the Porua AI spec:
//   concept      → Explain Topic       → Interactive lesson
//   math         → Solve Problem       → Step-by-step solution
//   programming  → Academic Question   → Code + explanation
//   ielts        → Review IELTS        → Band score + corrections
//   srijonshil   → Explain Topic       → Srijonshil format
//   general      → Academic Question   → Guided response
//   conversational → (no badge shown)
import { cn } from '@/lib/utils';
import {
    Lightbulb, Calculator, Code2, FileEdit,
    BookOpen, Sparkles, ClipboardList,
} from 'lucide-react';

const INTENT_MAP = {
    concept: {
        label: 'Explain Topic',
        mode: 'Interactive lesson',
        icon: Lightbulb,
        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    math: {
        label: 'Solve Problem',
        mode: 'Step-by-step solution',
        icon: Calculator,
        color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    },
    programming: {
        label: 'Programming',
        mode: 'Code + explanation',
        icon: Code2,
        color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    },
    ielts: {
        label: 'Review IELTS / TOEFL',
        mode: 'Band score + corrections',
        icon: FileEdit,
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    srijonshil: {
        label: 'Srijonshil',
        mode: 'Structured exam answer',
        icon: BookOpen,
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    general: {
        label: 'Academic Question',
        mode: 'Guided response',
        icon: Sparkles,
        color: 'bg-primary/10 text-primary border-primary/20',
    },
    quiz: {
        label: 'Generate Quiz',
        mode: 'Quiz Builder',
        icon: ClipboardList,
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
};

const BACKEND_INTENT_MAP = {
    teach: 'concept',
    solve: 'math',
    debug: 'programming',
    quiz: 'quiz',
    summarize: 'general',
    translate: 'general',
    compare: 'concept',
    career: 'general',
    conversation: null,
};

/**
 * @param {string}   templateType   - templateType from the AI message (concept, math, etc.)
 * @param {string}   [intent]       - detected intent from backend (teach, solve, debug, etc.)
 * @param {string}   [className]    - additional CSS classes
 * @param {boolean}  [showMode]     - also show the UI mode label (default: false)
 */
export default function IntentBadge({ templateType, intent, className = '', showMode = false }) {
    const resolvedType = (intent && BACKEND_INTENT_MAP[intent] !== undefined)
        ? (BACKEND_INTENT_MAP[intent] || templateType)
        : templateType;

    if (!resolvedType || resolvedType === 'conversational') return null;

    const meta = INTENT_MAP[resolvedType] || INTENT_MAP.general;
    const Icon = meta.icon;

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-label font-semibold uppercase tracking-[0.08em]',
                meta.color,
                className,
            )}
            aria-label={`Intent: ${meta.label}`}
        >
            <Icon size={10} strokeWidth={2.5} className="shrink-0" />
            <span>{meta.label}</span>
            {showMode && (
                <>
                    <span className="opacity-40">·</span>
                    <span className="opacity-70 normal-case tracking-normal font-medium">{meta.mode}</span>
                </>
            )}
        </div>
    );
}

export { INTENT_MAP };
