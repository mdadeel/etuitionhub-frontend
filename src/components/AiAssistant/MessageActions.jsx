// components/AiAssistant/MessageActions.jsx
// AI_TUTOR_DESIGN.md §5.13 — On-hover row of contextual actions
// attached to every chat message.
//
// User messages:  [✏️ Edit]                   (right-aligned)
// AI messages:    [👍] [👎] [⎘ Copy] [↺ Regenerate]   (left-aligned)
//
// All buttons share the same compact visual:
//   h-7 px-2 text-[11px] font-label rounded-md ...
//
// The component is purely presentational. State (copied, feedback
// rating) is owned by the parent.
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, Pencil, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

function ActionButton({ active, activeClass, children, onClick, label, disabled, ariaLive }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            aria-live={ariaLive}
            className={cn(
                'h-7 px-2 text-[11px] font-label rounded-md text-muted-foreground hover:text-foreground hover:bg-muted',
                'border border-transparent hover:border-border/60 transition-all duration-200',
                'inline-flex items-center gap-1',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                active && activeClass,
            )}
        >
            {children}
        </button>
    );
}

/**
 * @param {Object}   props
 * @param {'user' | 'assistant'} props.role
 * @param {Function} [props.onEdit]               (user) put the bubble into edit mode
 * @param {Function} [props.onCopy]               (assistant) copy the response as plain text
 * @param {Function} [props.onRegenerate]         (assistant, last AI msg) resend the previous user message
 * @param {Function} [props.onFeedback]           (assistant) (rating: 'up' | 'down') => void
 * @param {'up' | 'down' | null} [props.feedback] currently-active rating
 * @param {boolean}   [props.isCopied]            flips the Copy button label for 1.5 s
 * @param {boolean}   [props.isLast]              gates the Regenerate button
 * @param {string}    [props.className]
 */
export default function MessageActions({
    role,
    onEdit,
    onCopy,
    onRegenerate,
    onFeedback,
    feedback = null,
    isCopied = false,
    isLast = false,
    className = '',
}) {
    if (role === 'user') {
        return (
            <div
                className={cn(
                    'flex items-center justify-end gap-1',
                    'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                    className,
                )}
            >
                <ActionButton label="Edit message" onClick={onEdit}>
                    <Pencil size={11} />
                    <span>Edit</span>
                </ActionButton>
            </div>
        );
    }

    // assistant
    return (
        <div
            className={cn(
                'flex items-center gap-1',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                className,
            )}
        >
            <ActionButton
                label="Helpful"
                onClick={() => onFeedback?.('up')}
                active={feedback === 'up'}
                activeClass="text-primary"
            >
                <ThumbsUp size={11} className={feedback === 'up' ? 'text-primary' : feedback === 'down' ? 'opacity-40' : ''} />
            </ActionButton>
            <ActionButton
                label="Not helpful"
                onClick={() => onFeedback?.('down')}
                active={feedback === 'down'}
                activeClass="text-destructive"
            >
                <ThumbsDown size={11} className={feedback === 'down' ? 'text-destructive' : feedback === 'up' ? 'opacity-40' : ''} />
            </ActionButton>
            <ActionButton label={isCopied ? "Copied to clipboard" : "Copy response"} onClick={onCopy} ariaLive="polite">
                {isCopied ? (
                    <>
                        <Check size={11} />
                        <span>Copied</span>
                    </>
                ) : (
                    <>
                        <Copy size={11} />
                        <span>Copy</span>
                    </>
                )}
            </ActionButton>
            {isLast && (
                <ActionButton label="Regenerate response" onClick={onRegenerate}>
                    <RotateCcw size={11} />
                    <span>Regenerate</span>
                </ActionButton>
            )}
        </div>
    );
}
