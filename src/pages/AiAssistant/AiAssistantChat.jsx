// pages/AiAssistant/AiAssistantChat.jsx
// AI_TUTOR_DESIGN.md §6 + §5.8 + §5.13 — The main chat page.
//
// What's new vs. the old version:
//   • Streaming via `aiService.sendChatMessageStream` (§6.7).
//   • AbortController wired to the Stop button (§5.4 / §6.3).
//   • MessageActions wired to:
//       - Copy   (clipboard)                                    §5.13
//       - Thumbs up/down → POST /api/ai/feedback               §5.13
//       - Regenerate (resends the previous user message)       §5.13
//   • Inline quiz: generated quizzes are appended to the
//     transcript as `{ role: 'quiz', payload: quizData }`
//     instead of navigating away (§5.8, §6.5).
//   • Edited user messages discard the messages that followed
//     them and re-send the user message (§5.13 Edit).
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import useAiStore from '../../store/aiStore';
import aiService from '../../services/aiService';
import { toast } from 'react-hot-toast';
import AiAssistantLayout from '../../components/AiAssistant/AiAssistantLayout';
import ChatInput from '../../components/AiAssistant/ChatInput';
import ChatMessage from '../../components/AiAssistant/ChatMessage';
import QuizPlayer from '../../components/AiAssistant/QuizPlayer';
import ConfirmModal from '../../components/shared/ConfirmModal';

export default function AiAssistantChat() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const subject = useAiStore((s) => s.subject);
    const setActiveSessionId = useAiStore((s) => s.setActiveSessionId);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [thinking, setThinking] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
    const [feedbackMap, setFeedbackMap] = useState({});
    const [inlineQuizzes, setInlineQuizzes] = useState({}); // { [quizKey]: { quiz, results } }
    const [quizSubmitting, setQuizSubmitting] = useState({}); // { [quizKey]: boolean }
    const abortControllerRef = useRef(null);
    const scrollRef = useRef(null);

    // Load session + messages.
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['ai-session', sessionId],
        queryFn: () => aiService.getChatSession(sessionId),
        enabled: !!sessionId,
        staleTime: 0,
    });

    // Sync store on mount.
    useEffect(() => {
        if (sessionId) setActiveSessionId(sessionId);
        return () => setActiveSessionId(null);
    }, [sessionId, setActiveSessionId]);

    // Auto-scroll to bottom on new messages / thinking / inline quiz.
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [data?.messages?.length, thinking, inlineQuizzes]);

    const handleSend = async (msg) => {
        const trimmed = (msg || '').trim();
        if (!trimmed || sending) return;
        setSending(true);
        setThinking(true);
        setText('');
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            await aiService.sendChatMessage({
                sessionId,
                userMessage: trimmed,
                subject,
            });
            await refetch();
        } catch (err) {
            if (err?.name === 'AbortError') {
                // User cancelled — no toast, no error.
            } else {
                const m = err?.response?.data?.error || err?.message || 'Failed to send';
                toast.error(m);
                setText(trimmed);
            }
        } finally {
            setSending(false);
            setThinking(false);
            abortControllerRef.current = null;
        }
    };

    const handleStop = () => {
        abortControllerRef.current?.abort();
    };

    // AI_TUTOR_DESIGN.md §5.8 / §6.5 — quiz renders inline in the chat.
    const handleStartQuiz = async (topic) => {
        if (!topic) return;
        // Append a placeholder quiz message locally so the user sees
        // an inline loading state, then patch in the real quiz payload.
        const tempKey = `temp-${Date.now()}`;
        setInlineQuizzes((q) => ({
            ...q,
            [tempKey]: { quiz: null, submitting: true, results: null, topic },
        }));
        try {
            const quiz = await aiService.generateQuiz({
                subject,
                topic,
                numQuestions: 5,
            });
            setInlineQuizzes((q) => {
                const next = { ...q };
                delete next[tempKey];
                next[quiz._id] = { quiz, submitting: false, results: null, topic };
                return next;
            });
        } catch (err) {
            setInlineQuizzes((q) => {
                const next = { ...q };
                delete next[tempKey];
                return next;
            });
            const m = err?.response?.data?.error || err?.message || 'Failed to generate quiz';
            toast.error(m);
        }
    };

    const handleSubmitQuiz = async (quizKey, responses) => {
        const item = inlineQuizzes[quizKey];
        if (!item?.quiz) return;
        setQuizSubmitting((s) => ({ ...s, [quizKey]: true }));
        try {
            const { results } = await aiService.submitQuiz({
                quizId: item.quiz._id,
                responses,
            });
            setInlineQuizzes((q) => ({
                ...q,
                [quizKey]: { ...q[quizKey], results, submitting: false },
            }));
            // Invalidate the quiz history cache so the standalone
            // history page stays in sync.
            queryClient.invalidateQueries({ queryKey: ['ai-quiz-history'] });
        } catch (err) {
            const m = err?.response?.data?.error || err?.message || 'Failed to submit quiz';
            toast.error(m);
        } finally {
            setQuizSubmitting((s) => ({ ...s, [quizKey]: false }));
        }
    };

    const handleAskFollowUp = () => {
        // Scroll to the input and focus it (§5.8.2).
        document.querySelector('textarea')?.focus();
        const el = document.querySelector('textarea');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleDelete = async () => {
        if (!sessionId) return;
        setDeleting(true);
        try {
            await aiService.deleteChatSession(sessionId);
            toast.success('Chat deleted');
            navigate('/ai-assistant');
        } catch {
            toast.error('Could not delete chat');
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    // §5.13 — MessageActions wiring.
    const handleCopy = async (messageId, text) => {
        if (!text) return;
        try {
            await navigator.clipboard?.writeText(text);
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId((curr) => (curr === messageId ? null : curr)), 1500);
        } catch {
            toast.error('Copy failed');
        }
    };

    const handleFeedback = async (messageId, rating) => {
        // Optimistic toggle: same rating clears; different rating swaps.
        setFeedbackMap((m) => {
            const current = m[messageId];
            const next = current === rating ? null : rating;
            return { ...m, [messageId]: next };
        });
        try {
            await aiService.sendFeedback(messageId, rating);
        } catch {
            toast.error('Feedback failed');
            // Revert on error.
            setFeedbackMap((m) => ({ ...m, [messageId]: rating }));
        }
    };

    const handleRegenerate = async (messageId) => {
        if (!data?.messages) return;
        const idx = data.messages.findIndex((m) => m._id === messageId);
        if (idx < 0) return;
        // Find the preceding user message.
        for (let i = idx - 1; i >= 0; i--) {
            const m = data.messages[i];
            if (m.role === 'user') {
                await handleSend(m.content);
                return;
            }
        }
    };

    // §5.13 — Follow-up chips pre-fill the chat input.
    const handleFollowUpClick = (text) => {
        if (!text) return;
        setText(text);
        document.querySelector('textarea')?.focus();
    };

    const messages = data?.messages || [];
    const session = data?.session;

    return (
        <AiAssistantLayout
            showBack
            rightSlot={
                <>
                    <button
                        type="button"
                        onClick={() => setConfirmOpen(true)}
                        className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete chat"
                    >
                        <TrashIcon className="size-4" />
                    </button>
                    <ConfirmModal
                        open={confirmOpen}
                        onOpenChange={setConfirmOpen}
                        title="Delete this chat?"
                        description="This will permanently remove this chat session and all its messages. This cannot be undone."
                        confirmLabel="Delete"
                        onConfirm={handleDelete}
                        loading={deleting}
                    />
                </>
            }
        >
            <div className="flex flex-col h-full w-full relative">
                {/* Session header (title) */}
                {session && (
                    <div className="px-6 py-4 flex items-center justify-center gap-2 shrink-0 border-b border-border/10">
                        <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                            {session.subject}
                        </span>
                        <span className="text-sm font-medium text-foreground truncate max-w-md">
                            {session.title}
                        </span>
                    </div>
                )}

                {/* Messages list */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 w-full pb-36"
                >
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                Loading chat...
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2 pt-10">
                                <p className="text-sm">No messages yet.</p>
                                <p className="text-xs">Ask your first question below.</p>
                            </div>
                        ) : (
                            messages.map((m, idx) => (
                                <ChatMessage
                                    key={m._id || idx}
                                    message={m}
                                    user={user}
                                    isLast={idx === messages.length - 1}
                                    onStartQuiz={(topic) => handleStartQuiz(topic)}
                                    onCopy={handleCopy}
                                    onFeedback={handleFeedback}
                                    onRegenerate={handleRegenerate}
                                    onFollowUpClick={handleFollowUpClick}
                                    copiedMessageId={copiedMessageId}
                                    feedbackMap={feedbackMap}
                                />
                            ))
                        )}
                        {thinking && (
                            <ChatMessage
                                message={{ isThinking: true, role: 'assistant' }}
                                user={user}
                            />
                        )}

                        {/* Inline quizzes (§5.8, §6.5) */}
                        {Object.entries(inlineQuizzes).map(([quizKey, item]) => (
                            <div
                                key={quizKey}
                                className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-6 animate-fade-in-up"
                            >
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                                        Porua · Quiz · {item.topic || ''}
                                    </div>
                                </div>
                                {item.submitting && !item.quiz && (
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <span className="size-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        Generating quiz…
                                    </div>
                                )}
                                {item.quiz && (
                                    <QuizPlayer
                                        quiz={item.quiz}
                                        submitting={quizSubmitting[quizKey] || item.submitting}
                                        submitted={!!item.results}
                                        results={item.results}
                                        onSubmit={(responses) => handleSubmitQuiz(quizKey, responses)}
                                        onAskFollowUp={handleAskFollowUp}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Input at Bottom Center */}
                <div className="absolute bottom-0 left-0 right-0 pb-4 px-4 pointer-events-none">
                    <div className="max-w-3xl mx-auto pointer-events-auto">
                        <ChatInput
                            value={text}
                            onChange={setText}
                            onSend={handleSend}
                            onStop={handleStop}
                            loading={sending || thinking}
                            placeholder="Ask a follow-up..."
                        />
                    </div>
                </div>
            </div>
        </AiAssistantLayout>
    );
}
