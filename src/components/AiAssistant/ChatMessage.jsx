// components/AiAssistant/ChatMessage.jsx
// AI_TUTOR_DESIGN.md §5.5 + §5.12 — Renders a single chat message.
//
// Renders one of four things:
//   1. ThinkingBubble       (synthetic isThinking payload)
//   2. UserBubble + Edit    (right-aligned, on-hover Edit action)
//   3. AiResponseCard       (structured template, §5.6)
//   4. ConversationalBubble (templateType: "conversational", §5.12)
//
// Every message has:
//   • A hover-faded HH:mm timestamp (§5.14). User: left of bubble.
//     AI: below the MessageActions row.
//   • A MessageActions bar that fades in on parent hover (§5.13).
import { User as UserIcon, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import AiResponseCard from './AiResponseCard';
import TutorRecommendationCard from './TutorRecommendationCard';
import ConversationalBubble from './ConversationalBubble';
import MessageActions from './MessageActions';
import PoruaLogo from './PoruaLogo';

/**
 * Format a timestamp per §5.14. HH:mm if same day, otherwise "MMM D, HH:mm".
 */
function formatTimestamp(dateLike) {
    if (!dateLike) return '';
    const d = new Date(dateLike);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const sameDay =
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (sameDay) return `${hh}:${mm}`;
    const monthShort = d.toLocaleString('en-US', { month: 'short' });
    return `${monthShort} ${d.getDate()}, ${hh}:${mm}`;
}

function UserBubble({
    content, user, createdAt
}) {
    const timestamp = formatTimestamp(createdAt);

    return (
        <div className="group flex items-start justify-end gap-1.5 animate-fade-in-up">
            <div className="flex flex-col items-end gap-1 max-w-[85%]">
                <div
                    className={cn(
                        'max-w-full rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed',
                        'bg-primary text-primary-foreground shadow-md shadow-primary/15',
                    )}
                >
                    <p className="whitespace-pre-wrap break-words">{content}</p>
                </div>
                <div className="flex items-center gap-2">
                    {timestamp && (
                        <span className="text-[10px] font-label text-muted-foreground/50 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
                            {timestamp}
                        </span>
                    )}
                </div>
            </div>
            <div className="shrink-0 size-7 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || 'You'}
                        className="size-full object-cover"
                    />
                ) : (
                    <UserIcon size={13} className="text-muted-foreground" />
                )}
            </div>
        </div>
    );
}

function ThinkingBubble() {
    return (
        <div
            className="flex items-center gap-2 animate-fade-in-up"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="shrink-0 size-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <PoruaLogo iconOnly size={13} className="animate-pulse" />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-card/80 border border-border/60 px-4 py-3 flex items-center gap-1.5">
                <span
                    className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: '0ms' }}
                />
                <span
                    className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: '150ms' }}
                />
                <span
                    className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: '300ms' }}
                />
            </div>
        </div>
    );
}

function AssistantMessage({
    message, isLast,
    onStartQuiz, onTrackTutorClick,
    onCopy, onRegenerate, onFeedback, onFollowUpClick,
    feedback, isCopied
}) {
    const structured = message.structured;
    const tutors = message.recommendedTutors || [];
    const timestamp = formatTimestamp(message.createdAt);
    const isConversational = structured?.templateType === 'conversational';

    // Strip labels and join text fields for the Copy action (§5.13).
    const handleCopy = () => {
        if (!structured) return;
        const parts = [];
        if (structured.answer) parts.push(structured.answer);
        if (structured.topic) parts.push(structured.topic);
        if (structured.easyExplanation) parts.push(structured.easyExplanation);
        if (structured.realLifeExample) parts.push(`Example: ${structured.realLifeExample}`);
        if (structured.finalAnswer) parts.push(`Answer: ${structured.finalAnswer}`);
        if (Array.isArray(structured.keyPoints)) parts.push(...structured.keyPoints);
        if (Array.isArray(structured.stepByStep)) parts.push(...structured.stepByStep);
        if (Array.isArray(structured.bestPractices)) parts.push(...structured.bestPractices);
        if (Array.isArray(structured.commonMistakes)) parts.push(...structured.commonMistakes);
        if (Array.isArray(structured.strengths)) parts.push(...structured.strengths);
        if (Array.isArray(structured.improvements)) parts.push(...structured.improvements);
        if (Array.isArray(structured.practiceTips)) parts.push(...structured.practiceTips);
        if (structured.improvedVersion) parts.push(`Improved version:\n${structured.improvedVersion}`);
        if (Array.isArray(structured.followUpSuggestions)) {
            parts.push(`Try: ${structured.followUpSuggestions.join(' / ')}`);
        }
        const text = parts.join('\n\n') || message.content || '';
        onCopy?.(text);
    };

    if (isConversational) {
        return (
            <div className="group flex items-start gap-2 animate-fade-in-up">
                <div className="shrink-0 size-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <PoruaLogo iconOnly size={13} />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                    <ConversationalBubble
                        structured={structured}
                        onFollowUpClick={onFollowUpClick}
                    />
                    <div className="flex items-center gap-2">
                        {timestamp && (
                            <span className="text-[10px] font-label text-muted-foreground/50 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
                                {timestamp}
                            </span>
                        )}
                        <MessageActions
                            role="assistant"
                            onCopy={handleCopy}
                            isCopied={isCopied}
                            onRegenerate={isLast ? onRegenerate : undefined}
                            isLast={isLast}
                            onFeedback={onFeedback}
                            feedback={feedback}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group space-y-2 max-w-full">
            <AiResponseCard
                structured={structured}
                provider={message.provider}
                latencyMs={message.latencyMs}
                quizCta={
                    isLast && structured?.topic
                        ? {
                              label: 'Test yourself on this topic',
                              description: `Generate a quick quiz on "${structured.topic}"`,
                          }
                        : null
                }
                onStartQuiz={onStartQuiz}
                onFollowUpClick={onFollowUpClick}
            >
                {tutors.length > 0 && (
                    <TutorRecommendationCard
                        tutors={tutors}
                        onTrackClick={onTrackTutorClick}
                        subject={structured?.recommendedSubject}
                    />
                )}
            </AiResponseCard>
            <div className="flex items-center gap-2 pl-1">
                {timestamp && (
                    <span className="text-[10px] font-label text-muted-foreground/50 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
                        {timestamp}
                    </span>
                )}
                <MessageActions
                    role="assistant"
                    onCopy={handleCopy}
                    isCopied={isCopied}
                    onRegenerate={isLast ? onRegenerate : undefined}
                    isLast={isLast}
                    onFeedback={onFeedback}
                    feedback={feedback}
                />
            </div>
        </div>
    );
}

/**
 * @param {Object}   props
 * @param {Object}   props.message                 Single message payload.
 * @param {Object}   props.user                    Current user (for avatar).
 * @param {boolean}  props.isLast                  True if this is the last message in the transcript.
 * @param {Function} [props.onStartQuiz]
 * @param {Function} [props.onTrackTutorClick]
 * @param {Function} [props.onCopy]                (text) => void
 * @param {Function} [props.onRegenerate]          () => void
 * @param {Function} [props.onFeedback]            (messageId, rating) => void
 * @param {Function} [props.onFollowUpClick]       (text) => void
 * @param {Function} [props.onEditMessage]         (messageId, newText) => void
 * @param {Function} [props.onCancelEdit]          () => void
 * @param {string}   [props.editingMessageId]      ID of the message currently in edit mode.
 * @param {string}   [props.copiedMessageId]       ID of the message whose Copy button is in "Copied" state.
 * @param {string}   [props.feedback]              Map of messageId → 'up' | 'down'.
 */
export default function ChatMessage({
    message,
    user,
    isLast = false,
    onStartQuiz,
    onTrackTutorClick,
    onCopy,
    onRegenerate,
    onFeedback,
    onFollowUpClick,
    onEditMessage,
    onCancelEdit,
    editingMessageId,
    copiedMessageId,
    feedbackMap = {},
}) {
    if (message.isThinking) {
        return <ThinkingBubble />;
    }

    if (message.role === 'user') {
        return (
            <UserBubble
                content={message.content}
                user={user}
                createdAt={message.createdAt}
                onEdit={() => onEditMessage?.(message._id)}
                isEditing={editingMessageId === message._id}
                onCancelEdit={onCancelEdit}
                onResend={(text) => onEditMessage?.(message._id, text)}
            />
        );
    }

    return (
        <AssistantMessage
            message={message}
            user={user}
            isLast={isLast}
            onStartQuiz={onStartQuiz}
            onTrackTutorClick={onTrackTutorClick}
            onCopy={(text) => onCopy?.(message._id, text)}
            onRegenerate={() => onRegenerate?.(message._id)}
            onFeedback={(rating) => onFeedback?.(message._id, rating)}
            onFollowUpClick={onFollowUpClick}
            feedback={feedbackMap[message._id] || null}
            isCopied={copiedMessageId === message._id}
        />
    );
}
