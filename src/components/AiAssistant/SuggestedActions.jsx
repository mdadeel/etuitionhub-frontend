// components/AiAssistant/SuggestedActions.jsx
// Carousel of "quick action" chips that pre-fill the chat input with
// a starter prompt + the appropriate forceTemplate. Each click:
//   1. updates the store's lastQuickAction (for highlight),
//   2. fires the onAction callback with the prompt + template.
//
// The component is purely presentational; the parent page wires up
// the actual onAction (which usually means "fill the input and send").
import {
    Lightbulb, ClipboardList, Calculator, FileEdit, Search,
    Map, BookMarked, Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAiStore } from '../../store/aiStore';

// Each action maps to one of the 8 intents from the Porua AI spec.
// intent:       the spec's intent label (used for analytics + IntentBadge)
// forceTemplate: tells the backend which response schema to use
const ACTIONS = [
    {
        id: 'explain',
        label: 'Explain a topic',
        intent: 'Explain Topic',
        mode: 'Interactive lesson',
        icon: Lightbulb,
        prompt: 'Explain ',
        forceTemplate: 'concept',
        color: 'from-primary/20 to-primary/0',
    },
    {
        id: 'quiz',
        label: 'Generate a quiz',
        intent: 'Generate Quiz',
        mode: 'Quiz Builder',
        icon: ClipboardList,
        prompt: 'Generate a quiz on ',
        forceTemplate: 'general',
        color: 'from-emerald-500/20 to-emerald-500/0',
    },
    {
        id: 'math',
        label: 'Solve a problem',
        intent: 'Solve Problem',
        mode: 'Step-by-step solution',
        icon: Calculator,
        prompt: 'Solve: ',
        forceTemplate: 'math',
        color: 'from-teal-500/20 to-teal-500/0',
    },
    {
        id: 'ielts',
        label: 'Review my IELTS',
        intent: 'Review IELTS',
        mode: 'Band score + corrections',
        icon: FileEdit,
        prompt: 'Review this IELTS Writing Task 2 response: ',
        forceTemplate: 'ielts',
        color: 'from-amber-500/20 to-amber-500/0',
    },
    {
        id: 'tutor',
        label: 'Find a tutor',
        intent: 'Find Tutor',
        mode: 'Tutor recommendations',
        icon: Search,
        prompt: 'Help me find a tutor for ',
        forceTemplate: 'general',
        color: 'from-pink-500/20 to-pink-500/0',
    },
    {
        id: 'study-plan',
        label: 'Study plan',
        intent: 'Study Plan',
        mode: 'Roadmap generator',
        icon: Map,
        prompt: 'Create a study plan for ',
        forceTemplate: 'general',
        color: 'from-cyan-500/20 to-cyan-500/0',
    },
    {
        id: 'homework',
        label: 'Homework help',
        intent: 'Homework Help',
        mode: 'Guided solution',
        icon: BookMarked,
        prompt: 'Help me with this homework problem: ',
        forceTemplate: 'concept',
        color: 'from-orange-500/20 to-orange-500/0',
    },
    {
        id: 'programming',
        label: 'Programming',
        intent: 'Academic Question',
        mode: 'Code + explanation',
        icon: Code2,
        prompt: 'Write a program that ',
        forceTemplate: 'programming',
        color: 'from-indigo-500/20 to-indigo-500/0',
    },
];

export default function SuggestedActions({ onAction, className = '' }) {
    const lastQuickAction = useAiStore((s) => s.lastQuickAction);
    const setLastQuickAction = useAiStore((s) => s.setLastQuickAction);

    const handleClick = (action) => {
        setLastQuickAction(action.id);
        onAction?.(action);
    };

    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {ACTIONS.map((action) => {
                const Icon = action.icon;
                const isActive = lastQuickAction === action.id;
                return (
                    <button
                        key={action.id}
                        type="button"
                        onClick={() => handleClick(action)}
                        className={cn(
                            'group relative flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all duration-300 overflow-hidden',
                            isActive
                                ? 'border-primary/60 bg-primary/10 text-foreground shadow-md shadow-primary/10'
                                : 'border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:shadow-sm hover:-translate-y-0.5',
                        )}
                    >
                        <span
                            className={cn(
                                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
                                action.color,
                            )}
                        />
                        <Icon
                            size={14}
                            strokeWidth={2.3}
                            className={cn(
                                'transition-colors relative z-10',
                                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                            )}
                        />
                        <span className="relative z-10 whitespace-nowrap">{action.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

export { ACTIONS as SUGGESTED_ACTIONS };
