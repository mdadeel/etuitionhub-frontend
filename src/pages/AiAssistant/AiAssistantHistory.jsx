// pages/AiAssistant/AiAssistantHistory.jsx
// Standalone history page. Tabs: Chats | Quizzes. Each row is
// clickable and reopens the item. Both lists support "Load more".
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
    MessageSquare, ClipboardList, ChevronRight, 
    Calendar, CheckCircle, ChevronDown, RotateCcw,
    History, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import aiService from '../../services/aiService';
import AiAssistantLayout from '../../components/AiAssistant/AiAssistantLayout';
import ConfirmModal from '../../components/shared/ConfirmModal';

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

function ChatRow({ session, onOpen, onDelete }) {
    return (
        <div className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 hover:border-primary/40 hover:shadow-sm transition-all p-3">
            <div className="shrink-0 size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MessageSquare className="size-5" />
            </div>
            <button
                onClick={() => onOpen(session._id)}
                className="flex-1 min-w-0 text-left"
            >
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {session.title || 'Untitled chat'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-muted text-foreground/70 uppercase tracking-wider text-[10px] font-label">
                        {session.subject}
                    </span>
                    <span>{session.messageCount} msgs</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(session.lastMessageAt)}
                    </span>
                </div>
            </button>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            <button
                onClick={() => onDelete(session._id)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete"
            >
                <X className="size-3.5" />
            </button>
        </div>
    );
}

function QuizRow({ quiz, onOpen, onDelete }) {
    const done = !!quiz.submittedAt;
    const percent = quiz.score?.percent;
    return (
        <div className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 hover:border-primary/40 hover:shadow-sm transition-all p-3">
            <div className="shrink-0 size-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                <ClipboardList className="size-5" />
            </div>
            <button
                onClick={() => onOpen(quiz._id)}
                className="flex-1 min-w-0 text-left"
            >
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {quiz.topic}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-muted text-foreground/70 uppercase tracking-wider text-[10px] font-label">
                        {quiz.subject}
                    </span>
                    <span>{quiz.questions.length} Qs</span>
                    {done && (
                        <>
                            <span>·</span>
                            <span className={cn(
                                'flex items-center gap-1 font-semibold',
                                percent >= 70 ? 'text-emerald-500' : percent >= 40 ? 'text-amber-500' : 'text-destructive',
                            )}>
                                <CheckCircle className="size-3" />
                                {percent}%
                            </span>
                        </>
                    )}
                    <span>·</span>
                    <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(quiz.createdAt)}
                    </span>
                </div>
            </button>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            <button
                onClick={() => onDelete(quiz._id)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete"
            >
                <X className="size-3.5" />
            </button>
        </div>
    );
}

export default function AiAssistantHistory() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('chats');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'chat'|'quiz', id: string }

    // Pagination state
    const PAGE_SIZE = 20;
    const [chatPage, setChatPage] = useState(1);
    const [quizPage, setQuizPage] = useState(1);
    const [allChats, setAllChats] = useState([]);
    const [allQuizzes, setAllQuizzes] = useState([]);

    const { data: chatData, isFetching: chatFetching, refetch: refetchChats } = useQuery({
        queryKey: ['ai-sessions', chatPage],
        queryFn: async () => {
            const res = await aiService.listChatSessions({ page: chatPage, limit: PAGE_SIZE });
            if (chatPage === 1) {
                setAllChats(res.sessions || []);
            } else {
                setAllChats((prev) => [...prev, ...(res.sessions || [])]);
            }
            return res;
        },
        keepPreviousData: true,
    });
    const { data: quizData, isFetching: quizFetching, refetch: refetchQuizzes } = useQuery({
        queryKey: ['ai-quizzes', quizPage],
        queryFn: async () => {
            const res = await aiService.getQuizHistory({ page: quizPage, limit: PAGE_SIZE });
            if (quizPage === 1) {
                setAllQuizzes(res.quizzes || []);
            } else {
                setAllQuizzes((prev) => [...prev, ...(res.quizzes || [])]);
            }
            return res;
        },
        keepPreviousData: true,
    });

    const handleOpenChat = (id) => navigate(`/ai-assistant/chat/${id}`);
    const handleOpenQuiz = (id) => navigate(`/ai-assistant/quiz/${id}`);

    const openDeleteConfirm = (type, id) => {
        setDeleteTarget({ type, id });
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            if (deleteTarget.type === 'chat') {
                await aiService.deleteChatSession(deleteTarget.id);
                // Remove from local state immediately
                setAllChats((prev) => prev.filter((s) => s._id !== deleteTarget.id));
            } else {
                await aiService.deleteQuiz(deleteTarget.id);
                setAllQuizzes((prev) => prev.filter((q) => q._id !== deleteTarget.id));
            }
            toast.success('Deleted');
            if (deleteTarget.type === 'chat') refetchChats();
            else refetchQuizzes();
        } catch {
            toast.error('Could not delete');
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
            setDeleteTarget(null);
        }
    };

    const chatHasMore = chatData ? chatPage < chatData.pages : false;
    const quizHasMore = quizData ? quizPage < quizData.pages : false;

    return (
        <AiAssistantLayout>
            <div className="w-full px-4 md:px-8 pt-4 pb-12 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
                            <History size={18} className="text-primary" />
                            Chat History
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Review your previous conversations and quizzes
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 w-fit">
                    <button
                        onClick={() => setTab('chats')}
                        className={cn(
                            'flex items-center gap-2 px-4 h-9 text-xs font-semibold rounded-lg transition-all',
                            tab === 'chats'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <MessageSquare size={13} />
                        Chats ({chatData?.total ?? '…'})
                    </button>
                    <button
                        onClick={() => setTab('quizzes')}
                        className={cn(
                            'flex items-center gap-2 px-4 h-9 text-xs font-semibold rounded-lg transition-all',
                            tab === 'quizzes'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <ClipboardList size={13} />
                        Quizzes ({quizData?.total ?? '…'})
                    </button>
                </div>

                {/* List */}
                {tab === 'chats' ? (
                    <div className="space-y-2">
                        {allChats.length === 0 && !chatFetching ? (
                            <EmptyState
                                icon={MessageSquare}
                                title="No chats yet"
                                hint="Start a conversation from the Porua home page."
                            />
                        ) : (
                            allChats.map((s) => (
                                <ChatRow
                                    key={s._id}
                                    session={s}
                                    onOpen={handleOpenChat}
                                    onDelete={(id) => openDeleteConfirm('chat', id)}
                                />
                            ))
                        )}
                        {chatHasMore && (
                            <button
                                onClick={() => setChatPage((p) => p + 1)}
                                disabled={chatFetching}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/60 bg-card/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
                            >
                                {chatFetching ? <RotateCcw className="size-3 animate-spin" /> : <ChevronDown className="size-3" />}
                                {chatFetching ? 'Loading...' : 'Load more'}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {allQuizzes.length === 0 && !quizFetching ? (
                            <EmptyState
                                icon={ClipboardList}
                                title="No quizzes yet"
                                hint="Generate a quiz from a chat response or the home page."
                            />
                        ) : (
                            allQuizzes.map((q) => (
                                <QuizRow
                                    key={q._id}
                                    quiz={q}
                                    onOpen={handleOpenQuiz}
                                    onDelete={(id) => openDeleteConfirm('quiz', id)}
                                />
                            ))
                        )}
                        {quizHasMore && (
                            <button
                                onClick={() => setQuizPage((p) => p + 1)}
                                disabled={quizFetching}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/60 bg-card/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
                            >
                                {quizFetching ? <RotateCcw className="size-3 animate-spin" /> : <ChevronDown className="size-3" />}
                                {quizFetching ? 'Loading...' : 'Load more'}
                            </button>
                        )}
                    </div>
                )}
            </div>
            <ConfirmModal
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={deleteTarget?.type === 'chat' ? 'Delete this chat?' : 'Delete this quiz?'}
                description="This will permanently remove it. This cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />
        </AiAssistantLayout>
    );
}

// eslint-disable-next-line no-unused-vars
function EmptyState({ icon: Icon, title, hint }) {
    return (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center text-muted-foreground">
            <Icon className="mx-auto mb-3 text-muted-foreground/60" size={28} />
            <p className="text-sm font-medium text-foreground/80">{title}</p>
            <p className="text-xs mt-1">{hint}</p>
        </div>
    );
}
