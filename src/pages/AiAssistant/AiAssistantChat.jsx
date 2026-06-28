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
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
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
    const location = useLocation();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const subject = useAiStore((s) => s.subject);
    const setActiveSessionId = useAiStore((s) => s.setActiveSessionId);
    const attachmentFile = useAiStore((s) => s.attachmentFile);
    const setAttachmentFile = useAiStore((s) => s.setAttachmentFile);
    const editingMessageId = useAiStore((s) => s.editingMessageId);
    const setEditingMessageId = useAiStore((s) => s.setEditingMessageId);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [thinking, setThinking] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
    const [feedbackMap, setFeedbackMap] = useState({});
    const [inlineQuizzes, setInlineQuizzes] = useState({}); // { [quizKey]: { quiz, results } }
    const [quizSubmitting, setQuizSubmitting] = useState({}); // { [quizKey]: boolean }
    const [streamingAssistantMessage, setStreamingAssistantMessage] = useState('');
    const [localMessages, setLocalMessages] = useState([]);
    const abortControllerRef = useRef(null);
    const sendingRef = useRef(false);
    const scrollRef = useRef(null);
    const initialMessageProcessed = useRef(false);
    const [pendingUserInput, setPendingUserInput] = useState('');
    const lastScrollRef = useRef(0);

    // Load session + messages.
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['ai-session', sessionId],
        queryFn: () => aiService.getChatSession(sessionId),
        enabled: !!sessionId && sessionId !== 'new',
        staleTime: 0,
    });

    // Sync store on mount.
    useEffect(() => {
        if (sessionId && sessionId !== 'new') setActiveSessionId(sessionId);
        return () => setActiveSessionId(null);
    }, [sessionId, setActiveSessionId]);


    // Fetch AI usage limits with 5-min cache (warm from AiAssistantHome if navigated).
    const setUsage = useAiStore((s) => s.setUsage);
    useQuery({
        queryKey: ['ai-usage'],
        queryFn: async () => { const d = await aiService.getUsage(); setUsage(d); return d; },
        staleTime: 5 * 60 * 1000,
    });

    // Reset localMessages and processed ref if sessionId changes
    useEffect(() => {
        setLocalMessages([]);
        initialMessageProcessed.current = false;
    }, [sessionId]);

    // Auto-scroll to bottom on new messages / thinking / inline quiz.
    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            // Increase threshold to account for large AiResponseCards popping in suddenly
            const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 1500;
            const lastMsg = data?.messages?.[data.messages.length - 1] || localMessages[localMessages.length - 1];
            const isUserLast = lastMsg?.role === 'user';

            if (isNearBottom || isUserLast || thinking) {
                const now = Date.now();
                if (now - lastScrollRef.current > 50) {
                    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
                    lastScrollRef.current = now;
                }
            }
        }
    }, [data?.messages?.length, localMessages.length, thinking, streamingAssistantMessage, inlineQuizzes]);

    const handleSend = async (msg, forceTemplate = undefined, editMessageId = undefined, regenerateMessageId = undefined) => {
        const trimmed = (msg || '').trim();
        if (!trimmed || sendingRef.current) return;
        sendingRef.current = true;
        setPendingUserInput(trimmed);

        // Quiz-intent detection: "generate a quiz on X", "quiz me on X", etc.
        const quizIntentMatch = trimmed.match(/(?:generate|create|make|give|start|begin)\s+(?:a\s+)?quiz\s+(?:on|about|for)\s+(.+)/i)
            || trimmed.match(/quiz\s+(?:me\s+)?(?:on|about)\s+(.+)/i)
            || trimmed.match(/(?:test|assess)\s+(?:me\s+)?(?:on|about)\s+(.+)/i);
        if (quizIntentMatch) {
            const topic = quizIntentMatch[1].trim().replace(/[.?!]+$/, '');
            setSending(true);
            setThinking(true);
            setText('');
            const tempKey = `temp-quiz-${Date.now()}`;
            setInlineQuizzes((q) => ({ ...q, [tempKey]: { quiz: null, submitting: true, results: null, topic } }));
            try {
                const quiz = await aiService.generateQuiz({ subject, topic, numQuestions: 5, difficulty: 'mixed' });
                setInlineQuizzes((q) => {
                    const next = { ...q };
                    delete next[tempKey];
                    return { ...next, [quiz._id]: { quiz, submitting: false, results: null, topic } };
                });
            } catch (err) {
                toast.error(err?.response?.data?.error || err?.message || 'Failed to generate quiz');
                setInlineQuizzes((q) => { const next = { ...q }; delete next[tempKey]; return next; });
            } finally {
                sendingRef.current = false;
                setSending(false);
                setThinking(false);
            }
            return;
        }

        const attach = attachmentFile;
        if (attach) setAttachmentFile(null);

        if (!regenerateMessageId) {
            // Optimistic UI update
            const tempId = `temp-${Date.now()}`;
            const optimisticMessage = {
                _id: tempId,
                role: 'user',
                content: trimmed,
                createdAt: new Date().toISOString(),
                status: 'sent',
                ...(attach ? { attachment: { type: attach.type, name: attach.name, data: attach.data, size: attach.size } } : {}),
            };

            if (sessionId === 'new') {
                setLocalMessages((prev) => [...prev, optimisticMessage]);
            } else {
                queryClient.setQueryData(['ai-session', sessionId], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        messages: [...(old.messages || []), optimisticMessage]
                    };
                });
            }
        }

        setSending(true);
        setThinking(true);
        setText('');
        setEditingMessageId(null);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setStreamingAssistantMessage('');
        let localStreamData = '';
        let newSessionId = null;
        let streamError = null;

        try {
            await aiService.sendChatMessageStream({
                sessionId: sessionId === 'new' ? undefined : sessionId,
                userMessage: trimmed,
                subject,
                forceTemplate,
                attachment: attach || undefined,
                editMessageId,
                regenerateMessageId,
                signal: controller.signal,
                onChunk: (chunk) => {
                    setThinking(false);
                    try {
                        const parsed = JSON.parse(chunk);
                        if (parsed.type === 'error') {
                            // Backend error frame — surface it as an error message
                            streamError = parsed.error || 'The AI assistant encountered an error.';
                            return;
                        }
                        if (parsed.type === 'done') {
                            if (parsed.session?._id) {
                                newSessionId = parsed.session._id;
                            }
                            return;
                        }
                        if (parsed.text !== undefined) {
                            localStreamData += parsed.text;
                        } else if (parsed.content !== undefined) {
                            localStreamData += parsed.content;
                        } else if (parsed.answer !== undefined) {
                            localStreamData += parsed.answer;
                        } else {
                            // If it's some other JSON chunk we can't extract, stringify or use the raw chunk
                            localStreamData += typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
                        }
                    } catch {
                        localStreamData += chunk;
                    }
                    setStreamingAssistantMessage(localStreamData);
                }
            });

            // Handle error frames received during streaming
            if (streamError) {
                toast.error(streamError);
                const errorMessage = {
                    _id: `err-${Date.now()}`,
                    role: 'assistant',
                    content: streamError,
                    isError: true,
                    originalInput: trimmed,
                };
                if (sessionId === 'new') {
                    setLocalMessages((prev) => [...prev, errorMessage]);
                } else {
                    queryClient.setQueryData(['ai-session', sessionId], (old) => {
                        if (!old) return old;
                        return { ...old, messages: [...(old.messages || []), errorMessage] };
                    });
                }
            }

            setStreamingAssistantMessage('');
            
            try {
                if (sessionId === 'new') {
                    if (newSessionId) {
                        navigate(`/ai-assistant/chat/${newSessionId}`, { replace: true });
                    }
                } else {
                    await refetch();
                }
            } catch (postErr) {
                // Non-critical: stream succeeded, DB saved the message.
                // A failed refetch/navigate shouldn't show an error to the user.
                console.warn('Post-stream navigation/refetch failed:', postErr);
            }
        } catch (err) {
            if (err?.name === 'AbortError') {
                // User cancelled — no toast, no error.
            } else {
                const m = err?.response?.data?.error || err?.message || 'Failed to send';
                toast.error(m);
                // Append error message, keep user message
                const errorMessage = {
                    _id: `err-${Date.now()}`,
                    role: 'assistant',
                    isError: true,
                    originalInput: trimmed
                };
                if (sessionId === 'new') {
                    setLocalMessages((prev) => [...prev, errorMessage]);
                } else {
                    queryClient.setQueryData(['ai-session', sessionId], (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            messages: [...old.messages, errorMessage]
                        };
                    });
                }
            }
        } finally {
            sendingRef.current = false;
            setSending(false);
            setThinking(false);
            setStreamingAssistantMessage('');
            abortControllerRef.current = null;
        }
    };

    // Handle initial message passed via location state
    useEffect(() => {
        if (sessionId === 'new' && location.state?.initialMessage && !initialMessageProcessed.current) {
            initialMessageProcessed.current = true;
            const msg = location.state.initialMessage;
            window.history.replaceState({}, document.title);
            handleSend(msg);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, location.state]);

    // §5.13 — Edit user message. When called with just messageId, enter edit mode.
    // When called with newText, save and resend, discarding subsequent messages.
    const handleEditResend = (messageId, newText) => {
        if (!newText) {
            setEditingMessageId(messageId);
            return;
        }
        setEditingMessageId(null);
        if (!data?.messages) return;
        const idx = data.messages.findIndex((m) => m._id === messageId);
        if (idx >= 0) {
            queryClient.setQueryData(['ai-session', sessionId], (old) => {
                if (!old) return old;
                return { ...old, messages: old.messages.slice(0, idx) };
            });
        }
        handleSend(newText, undefined, messageId);
    };

    const handleCancelEdit = () => setEditingMessageId(null);

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
                difficulty: 'mixed',
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
            const updatedQuiz = await aiService.submitQuiz({
                quizId: item.quiz._id,
                responses,
            });
            setInlineQuizzes((q) => ({
                ...q,
                [quizKey]: { ...q[quizKey], results: updatedQuiz, submitting: false },
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
        // Pre-fill the input with context and scroll to it (§5.8.2).
        setText("I have a question about the quiz: ");
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
                queryClient.setQueryData(['ai-session', sessionId], (old) => {
                    if (!old) return old;
                    return { ...old, messages: old.messages.slice(0, i + 1) };
                });
                await handleSend(m.content, undefined, undefined, messageId);
                return;
            }
        }
    };

    const handleTrackTutorClick = (tutorId) => {
        aiService.trackTutorRecommendationClick(tutorId).catch(() => {});
    };

    // §5.13 — Follow-up chips pre-fill the chat input.
    const handleFollowUpClick = (text) => {
        if (!text) return;
        setText(text);
        document.querySelector('textarea')?.focus();
    };

    const messages = sessionId === 'new' ? localMessages : (data?.messages || []);
    const isChatLoading = sessionId === 'new' ? false : isLoading;

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
                        <Trash2 className="size-4" />
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
                {/* Removed bloated session header for cleaner interface */}

                {/* Messages list */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 w-full pb-[140px]"
                >
                    <div className="space-y-4">
                        {isChatLoading ? (
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
                                    onRetry={(originalInput) => handleSend(originalInput)}
                                    onTrackTutorClick={handleTrackTutorClick}
                                    onEditMessage={handleEditResend}
                                    onCancelEdit={handleCancelEdit}
                                    editingMessageId={editingMessageId}
                                    copiedMessageId={copiedMessageId}
                                    feedbackMap={feedbackMap}
                                />
                            ))
                        )}
                        {thinking && !streamingAssistantMessage && (
                            <ChatMessage
                                message={{ isThinking: true, role: 'assistant' }}
                                user={user}
                            />
                        )}
                        {streamingAssistantMessage && (
                            <ChatMessage
                                message={{ isStreaming: true, content: streamingAssistantMessage, role: 'assistant', userInput: pendingUserInput }}
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
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setInlineQuizzes(q => {
                                                const next = { ...q };
                                                delete next[quizKey];
                                                return next;
                                            });
                                        }}
                                        className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 bg-muted/50 hover:bg-muted rounded-md cursor-pointer"
                                    >
                                        Skip Quiz
                                    </button>
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
                <div className="absolute bottom-0 left-0 right-0 pt-8 pb-4 px-4 pointer-events-none bg-gradient-to-t from-background via-background to-transparent z-10 mt-[2px]">
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
