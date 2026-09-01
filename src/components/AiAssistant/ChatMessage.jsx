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
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { User as UserIcon, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import AiResponseCard, { parseInlineCode } from './AiResponseCard';
import TutorRecommendationCard from './TutorRecommendationCard';
import TuitionRecommendationCard from './TuitionRecommendationCard';
import ConversationalBubble from './ConversationalBubble';
import MessageActions from './MessageActions';
import PoruaLogo from './PoruaLogo';
import IntentBadge from './IntentBadge';
import SkeletonCard from './SkeletonCard';
import ThinkingBlock from './ThinkingBlock';

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

export function Typewriter({ text, speed = 8 }) {
    const [displayedText, setDisplayedText] = useState('');
    const queueRef = useRef('');
    const timerRef = useRef(null);

    useEffect(() => {
        queueRef.current = text;
        
        if (!timerRef.current) {
            timerRef.current = setInterval(() => {
                setDisplayedText((curr) => {
                    const target = queueRef.current;
                    if (curr.length >= target.length) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                        return curr;
                    }
                    const diff = target.length - curr.length;
                    const step = diff > 40 ? 6 : diff > 15 ? 3 : 1;
                    return target.slice(0, curr.length + step);
                });
            }, speed);
        }

        return () => {
            if (timerRef.current && queueRef.current === text) {
                // Keep streaming timer active
            } else if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [text, speed]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <>
            {parseInlineCode(displayedText, displayedText.length < text.length)}
        </>
    );
}

const UserBubble = memo(function UserBubble({
    content, user, createdAt, onEdit, isEditing, onCancelEdit, onResend,
}) {
    const timestamp = formatTimestamp(createdAt);

    if (isEditing) {
        return (
            <div className="flex items-start justify-end gap-2.5 animate-fade-in-up">
                <div className="flex flex-col items-end gap-1.5 max-w-[85%]">
                    <EditInput
                        initialValue={content}
                        onSave={onResend}
                        onCancel={onCancelEdit}
                    />
                </div>
                <div className="shrink-0 size-8 rounded-lg bg-muted border border-border/50 flex items-center justify-center overflow-hidden shadow-sm">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'You'} className="size-full object-cover" />
                    ) : (
                        <UserIcon size={14} className="text-muted-foreground" />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="group flex items-start justify-end gap-2.5 animate-fade-in-up">
            <div className="flex flex-col items-end gap-1.5 max-w-[85%]">
                <div
                    className={cn(
                        'w-fit max-w-full rounded-lg rounded-tr-sm px-5 py-3 text-[14px] leading-[22px]',
                        'bg-primary text-primary-foreground shadow-md shadow-primary/10',
                    )}
                >
                    <p className="whitespace-pre-wrap break-words">{content}</p>
                </div>
                <div className="flex items-center gap-2.5 px-0.5">
                    {timestamp && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {timestamp}
                        </span>
                    )}
                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40 hover:text-primary transition-all duration-150 opacity-0 group-hover:opacity-100 active:scale-95"
                            title="Edit message"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>
            <div className="shrink-0 size-8 rounded-lg bg-muted border border-border/50 flex items-center justify-center overflow-hidden shadow-sm">
                {user?.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || 'You'}
                        className="size-full object-cover"
                    />
                ) : (
                    <UserIcon size={14} className="text-muted-foreground" />
                )}
            </div>
        </div>
    );
});

function EditInput({ initialValue, onSave, onCancel }) {
    const [value, setValue] = useState(initialValue);
    const taRef = useRef(null);

    useEffect(() => {
        taRef.current?.focus();
        taRef.current?.setSelectionRange(initialValue.length, initialValue.length);
    }, [initialValue]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) onSave?.(value.trim());
        }
        if (e.key === 'Escape') onCancel?.();
    };

    return (
        <div className="flex flex-col items-end gap-2 w-full">
            <label htmlFor="edit-message-textarea" className="sr-only">Edit message</label>
            <textarea
                id="edit-message-textarea"
                ref={taRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full min-w-[260px] rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground resize-none outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                rows={2}
            />
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground active:scale-95 transition-all duration-150"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => { if (value.trim()) onSave?.(value.trim()); }}
                    className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 active:scale-95 transition-all duration-150 shadow-sm shadow-primary/10"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

function SkeletonCardWrapper() {
    return <SkeletonCard />;
}

function unescapeStr(s) {
    if (typeof s !== 'string') return s;
    return s.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function unescapeDeep(obj) {
    if (typeof obj === 'string') return unescapeStr(obj);
    if (Array.isArray(obj)) return obj.map(unescapeDeep);
    if (typeof obj === 'object' && obj !== null) {
        const res = {};
        for (const key of Object.keys(obj)) {
            res[key] = unescapeDeep(obj[key]);
        }
        return res;
    }
    return obj;
}

const AssistantMessage = memo(function AssistantMessage({
    message, isLast,
    onStartQuiz, onTrackTutorClick,
    onCopy, onRegenerate, onFeedback, onFollowUpClick,
    feedback, isCopied
}) {
    // Defensive: if structured is a JSON string, parse it
    const structured = useMemo(() => {
        let s = message.structured;
        if (typeof s === 'string') {
            try { s = JSON.parse(s); } catch { s = null; }
        }
        return unescapeDeep(s);
    }, [message.structured]);
    const tutors = message.recommendedTutors || [];
    const tuitions = message.recommendedTuitions || [];
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
                    {message.thinking && <ThinkingBlock thinking={message.thinking} />}
                    <ConversationalBubble
                        structured={structured}
                        onFollowUpClick={onFollowUpClick}
                        isLast={isLast}
                    />
                    <div className="flex items-center gap-2">
                        {timestamp && (
                            <span className="text-[11px] font-label text-muted-foreground/50 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
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
            {/* Thinking block — collapsible chain-of-thought */}
            {message.thinking && <ThinkingBlock thinking={message.thinking} />}
            {/* Intent badge — shows what mode Porua AI used for this response */}
            {structured?.templateType && structured.templateType !== 'conversational' && (
                <IntentBadge templateType={structured.templateType} intent={structured.intent} className="mb-1" />
            )}
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
                isLast={isLast}
            >
                {tutors.length > 0 && (
                    <TutorRecommendationCard
                        tutors={tutors}
                        onTrackClick={onTrackTutorClick}
                        subject={structured?.recommendedSubject}
                    />
                )}
                {tuitions.length > 0 && (
                    <TuitionRecommendationCard
                        tuitions={tuitions}
                        subject={structured?.recommendedSubject}
                    />
                )}
            </AiResponseCard>
            <div className="flex items-center gap-2 pl-1">
                {timestamp && (
                    <span className="text-[11px] font-label text-muted-foreground/50 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
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
});

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
 * @param {Function} [props.onRetry]               (text) => void
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
    onRetry,
    editingMessageId,
    copiedMessageId,
    feedbackMap = {},
}) {
    if (message.isThinking) {
        return <SkeletonCardWrapper />;
    }

    if (message.isError) {
        return (
            <div className="flex items-start gap-3 animate-fade-in-up w-full max-w-[850px] mb-4">
                <div className="shrink-0 size-8 flex items-center justify-center mt-1">
                    <PoruaLogo iconOnly size={20} className="text-destructive/80" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="bg-destructive/10 border-l-4 border-destructive/40 text-destructive text-[15px] px-4 py-3 rounded-r-lg flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="font-medium">⚠ Response could not be generated.</span>
                        {onRetry && (
                            <button onClick={() => onRetry(message.originalInput)} className="px-4 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg font-semibold text-[13px] hover:bg-destructive/20 transition-colors">
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (message.isStreaming) {
        let display = message.content || '';

        try {
            const raw = display;
            const trimmed = raw.trim();

            if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                // Content fields in priority order — 'solution' handled separately for code templates
                const TEXT_FIELDS = ['answer', 'content', 'explanation', 'text', 'easyExplanation'];
                let extracted = null;

                // ── Pass 1: valid complete JSON ──────────────────────────────────────
                try {
                    const parsed = JSON.parse(trimmed);
                    const isProg = parsed.templateType === 'programming' || !!parsed.solution;
                    if (isProg && parsed.solution) {
                        // Wrap the solution in a fenced block so parseInlineCode renders it
                        const explain = typeof parsed.codeExplanation === 'string' ? unescapeStr(parsed.codeExplanation) : '';
                        const solution = typeof parsed.solution === 'string' ? unescapeStr(parsed.solution) : parsed.solution;
                        extracted = (explain ? explain + '\n\n' : '') + '```\n' + solution + '\n```';
                    } else {
                        for (const field of TEXT_FIELDS) {
                            if (typeof parsed[field] === 'string' && parsed[field].length > 0) {
                                extracted = unescapeStr(parsed[field]);
                                break;
                            }
                        }
                    }
                } catch {
                    // ── Pass 2: partial/malformed JSON — regex on the raw string ─────
                    const unescape = (s) => s.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

                    const solMatch = raw.match(/"solution"\s*:\s*"((?:[^"\\]|\\.)*)(?:"|$)/);
                    if (solMatch && solMatch[1]) {
                        extracted = '```\n' + unescape(solMatch[1]) + '\n```';
                    } else {
                        for (const field of TEXT_FIELDS) {
                            const re = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)(?:"|$)`);
                            const m = raw.match(re);
                            if (m && m[1]) {
                                extracted = unescape(m[1]);
                                break;
                            }
                        }
                    }
                }

                display = extracted !== null ? extracted.trim() : '';
            }
            // Non-JSON content (plain text / markdown) is used as-is.
        } catch {
            display = (message.content || '').trim();
        }

        const streamingTitle = message.userInput || '';

        return (
            <article className="w-full max-w-[850px] bg-card border border-border/60 rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-6 animate-fade-in-up">
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-3 font-medium flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center size-5 rounded-md bg-primary/10 text-primary">
                            <PoruaLogo iconOnly size={12} />
                        </span>
                        <span>Education</span>
                    </div>
                </div>

                {streamingTitle && (
                    <h1 className="text-[22px] font-bold text-foreground leading-snug mb-4 tracking-tight">
                        {streamingTitle}
                    </h1>
                )}

                <div className="text-[15px] leading-[1.6] text-foreground/90">
                    {display ? (
                        <Typewriter text={display} />
                    ) : (
                        <span className="inline-block w-1.5 h-4 bg-primary animate-cursor-blink align-text-bottom" />
                    )}
                </div>
            </article>
        );
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
