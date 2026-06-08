// pages/AiAssistant/AiAssistantQuiz.jsx
// Full-screen quiz player. Loads a quiz by ID, lets the user play it,
// and on submit scores via the backend. Uses the shared QuizPlayer
// component for the actual UI.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ClipboardList } from 'lucide-react';
import aiService from '../../services/aiService';
import AiAssistantLayout from '../../components/AiAssistant/AiAssistantLayout';
import QuizPlayer from '../../components/AiAssistant/QuizPlayer';

export default function AiAssistantQuiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [results, setResults] = useState(null);

    const { data: quiz, isLoading } = useQuery({
        queryKey: ['ai-quiz', quizId],
        queryFn: () => aiService.getQuiz(quizId),
        enabled: !!quizId,
    });

    const handleSubmit = async (responses) => {
        setSubmitting(true);
        try {
            const res = await aiService.submitQuiz({ quizId, responses });
            setResults(res);
            toast.success('Quiz submitted!');
        } catch (err) {
            const m = err?.response?.data?.error || 'Failed to submit quiz';
            toast.error(m);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AiAssistantLayout showBack>
            <div className="w-full mx-auto">
                {isLoading ? (
                    <div className="rounded-2xl border border-border bg-card/50 p-8 text-center text-muted-foreground">
                        <ClipboardList className="mx-auto mb-3 text-primary" size={28} />
                        <p>Loading quiz...</p>
                    </div>
                ) : !quiz ? (
                    <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                        <p className="text-sm text-muted-foreground">Quiz not found.</p>
                        <button
                            onClick={() => navigate('/ai-assistant')}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 h-10 text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
                        >
                            Back to Porua
                        </button>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-md p-6 sm:p-8 shadow-sm">
                        {/* Header */}
                        <header className="mb-6 pb-4 border-b border-border/40">
                            <p className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-primary">
                                Porua Quiz · {quiz.subject}
                            </p>
                            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mt-1">
                                {quiz.topic}
                            </h2>
                        </header>
                        <QuizPlayer
                            quiz={quiz}
                            onSubmit={handleSubmit}
                            submitting={submitting}
                            submitted={!!results}
                            results={results}
                            onExit={() => navigate('/ai-assistant')}
                        />
                    </div>
                )}
            </div>
        </AiAssistantLayout>
    );
}
