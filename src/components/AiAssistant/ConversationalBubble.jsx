// components/AiAssistant/ConversationalBubble.jsx
// AI_TUTOR_DESIGN.md §5.12 — Plain-prose short reply for follow-ups,
// corrections, and clarifications. Triggered when the backend returns
// `templateType: "conversational"`. No card chrome, no header, no
// gradient, no quiz CTA, no tutor card.
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import PoruaLogo from './PoruaLogo';
import { Typewriter } from './ChatMessage';
import { lazy, Suspense } from 'react';

const LazyMarkdownRenderer = lazy(() => import('./MarkdownRenderer'));
function MarkdownRenderer(props) {
    return (
        <Suspense fallback={<div className="h-8 w-full animate-pulse bg-muted/40 rounded" />}>
            <LazyMarkdownRenderer {...props} />
        </Suspense>
    );
}

/**
 * @param {Object}   props
 * @param {Object}   props.structured  LLM JSON: { templateType: "conversational", answer, followUpSuggestion }
 * @param {Function} [props.onFollowUpClick]  Pre-fill the chat input with the suggested follow-up.
 * @param {string}   [props.className]
 * @param {boolean}  [props.isLast]
 */
export default function ConversationalBubble({ structured, onFollowUpClick, className = '', isLast }) {
    if (!structured) return null;
    const answer = structured.answer;
    const followUp = structured.followUpSuggestion;

    return (
        <div
            className={cn(
                'border-l-2 border-primary/30 pl-4 py-1.5 text-[14px] leading-relaxed text-foreground/95',
                className,
            )}
        >
            {answer && (
                <p className="break-words">
                    {isLast ? <Typewriter text={answer} speed={10} /> : <MarkdownRenderer content={answer} />}
                </p>
            )}

            {followUp && (
                <button
                    type="button"
                    onClick={() => onFollowUpClick?.(followUp)}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-card text-xs text-muted-foreground hover:text-foreground hover:border-primary/45 hover:bg-primary/5 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                    <Lightbulb size={12} className="text-primary/75" aria-hidden="true" />
                    <span>{followUp}</span>
                </button>
            )}
        </div>
    );
}
