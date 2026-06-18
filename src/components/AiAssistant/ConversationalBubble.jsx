// components/AiAssistant/ConversationalBubble.jsx
// AI_TUTOR_DESIGN.md §5.12 — Plain-prose short reply for follow-ups,
// corrections, and clarifications. Triggered when the backend returns
// `templateType: "conversational"`. No card chrome, no header, no
// gradient, no quiz CTA, no tutor card.
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import PoruaLogo from './PoruaLogo';
import { parseInlineCode } from './AiResponseCard';

/**
 * @param {Object}   props
 * @param {Object}   props.structured  LLM JSON: { templateType: "conversational", answer, followUpSuggestion }
 * @param {Function} [props.onFollowUpClick]  Pre-fill the chat input with the suggested follow-up.
 * @param {string}   [props.className]
 */
export default function ConversationalBubble({ structured, onFollowUpClick, className = '' }) {
    if (!structured) return null;
    const answer = structured.answer;
    const followUp = structured.followUpSuggestion;

    return (
        <div className="flex items-start gap-2 animate-fade-in-up">
            <div className="shrink-0 size-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <PoruaLogo iconOnly size={13} />
            </div>
            <div
                className={cn(
                    'flex-1 border-l-2 border-primary/40 pl-4 py-2 text-sm leading-relaxed text-foreground/90',
                    className,
                )}
            >
                {answer && <p className="whitespace-pre-wrap break-words">{parseInlineCode(answer)}</p>}

                {followUp && (
                    <button
                        type="button"
                        onClick={() => onFollowUpClick?.(followUp)}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                    >
                        <Lightbulb size={12} />
                        <span>{followUp}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
