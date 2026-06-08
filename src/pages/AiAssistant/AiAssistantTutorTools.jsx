// pages/AiAssistant/AiAssistantTutorTools.jsx
// Tutor-side page with two tools: Lesson Plan generator + Assignment
// generator. Each tool has a form (left) and a live-generated result
// card (right) rendered as a structured visual card.
//
// Note: this is gated to tutors on the backend (POST /api/ai/tutor/*
// uses tutorMiddleware). If a student somehow lands here, the
// request will 403 and we'll show a friendly message.
import { useState } from 'react';
import { Copy, Check, BookOpen, ClipboardList, Sparkles, Lock, BookmarkPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/lib/utils';
import aiService from '../../services/aiService';
import AiAssistantLayout from '../../components/AiAssistant/AiAssistantLayout';
import SubjectSelector from '../../components/AiAssistant/SubjectSelector';
import LessonPlanCard from '../../components/AiAssistant/LessonPlanCard';
import AssignmentCard from '../../components/AiAssistant/AssignmentCard';
import { LessonPlanSkeleton, AssignmentSkeleton } from '@/components/shared/skeletons';
import { Card } from '@/components/ui/card';

import { useAiStore } from '../../store/aiStore';

const TABS = [
    { id: 'lesson', label: 'Lesson Plan', icon: BookOpen },
    { id: 'assignment', label: 'Assignment', icon: ClipboardList },
];

const DURATION_OPTIONS = [
    '30 minutes',
    '45 minutes',
    '1 hour',
    '1.5 hours',
    '2 hours',
];

const GRADE_OPTIONS = [
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'HSC 1st Year',
    'HSC 2nd Year',
    'Admission',
];

export default function AiAssistantTutorTools() {
    const { userRole } = useAuth();
    const [tab, setTab] = useState('lesson');

    // Form state
    const subject = useAiStore((s) => s.subject);
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState('1 hour');
    const [grade, setGrade] = useState('Class 10');
    const [numQuestions, setNumQuestions] = useState(20);
    const [difficulty, setDifficulty] = useState('mixed');

    // Output state
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const isTutor = userRole === 'tutor' || userRole === 'admin';

    const handleGenerate = async (e) => {
        e?.preventDefault();
        if (!topic.trim()) {
            toast.error('Please enter a topic');
            return;
        }
        setLoading(true);
        setError(null);
        setOutput(null);
        try {
            const data = tab === 'lesson'
                ? await aiService.generateLessonPlan({ subject, topic, duration, grade })
                : await aiService.generateAssignment({ subject, topic, numQuestions, difficulty });
            setOutput(data);
            toast.success('Generated!');
        } catch (err) {
            const code = err?.response?.status;
            if (code === 403) {
                setError('Tutor tools are only available to verified tutors. Please make sure you are signed in as a tutor.');
            } else {
                setError(err?.response?.data?.error || err?.message || 'Failed to generate');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!output) return;
        const text = JSON.stringify(output, null, 2);
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Copied JSON to clipboard');
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Could not copy');
        }
    };

    const handleSaveNote = () => {
        if (!output) return;
        const NOTES_KEY = 'ai-tutor-saved-notes';
        let notes = [];
        try {
            notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
        } catch { /* ignore */ }
        const newNote = {
            id: Date.now().toString(),
            title: output.title || output.topic || `${tab === 'lesson' ? 'Lesson Plan' : 'Assignment'} - ${topic}`,
            subject,
            grade: tab === 'lesson' ? grade : undefined,
            content: output,
            createdAt: new Date().toISOString(),
        };
        notes.unshift(newNote);
        try {
            localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        } catch { /* ignore */ }
        toast.success('Saved to notes!');
    };

    return (
        <AiAssistantLayout>
            <div className="w-full space-y-6 px-4 md:px-8 py-6">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 w-fit">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.id}
                                onClick={() => { setTab(t.id); setOutput(null); setError(null); }}
                                className={cn(
                                    'flex items-center gap-1.5 px-4 h-9 text-xs font-semibold rounded-lg transition-all',
                                    tab === t.id
                                        ? 'bg-card text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <Icon size={13} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Form */}
                <Card className="p-5 space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-sm font-heading font-semibold text-foreground flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" />
                        Generate {tab === 'lesson' ? 'Lesson Plan' : 'Assignment'}
                    </h2>
                    <form onSubmit={handleGenerate} className="space-y-3">
                        <div>
                            <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                                Subject
                            </label>
                            <div className="mt-1.5">
                                <SubjectSelector compact />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                                Topic
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. HTML Forms, SSC Physics: Motion"
                                className="mt-1.5 w-full h-10 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                        </div>
                        {tab === 'lesson' ? (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                                        Duration
                                    </label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="mt-1.5 w-full h-10 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                                    >
                                        {DURATION_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                                        Grade
                                    </label>
                                    <select
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className="mt-1.5 w-full h-10 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                                    >
                                        {GRADE_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                                        # Questions
                                    </label>
                                    <input
                                        type="number"
                                        min={5}
                                        max={50}
                                        value={numQuestions}
                                        onChange={(e) => setNumQuestions(Number(e.target.value) || 20)}
                                        className="mt-1.5 w-full h-10 px-3 rounded-lg bg-card border border-border text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                                        Difficulty
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="mt-1.5 w-full h-10 px-3 rounded-lg bg-card border border-border text-sm"
                                    >
                                        <option value="mixed">Mixed</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 h-10 text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 transition-all"
                        >
                            <Sparkles size={13} />
                            {loading ? 'Generating...' : 'Generate'}
                        </button>
                    </form>
                </Card>

                {/* Output — below form, centered */}
                <Card className="p-5 space-y-3 max-w-2xl mx-auto min-h-[200px]">
                    {!isTutor && (
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-500 flex items-start gap-2">
                            <Lock size={12} className="shrink-0 mt-0.5" />
                            <span>You must be signed in as a tutor to use these tools. The form will still work in this preview, but the API will return a 403.</span>
                        </div>
                    )}
                    {loading ? (
                        <div className="flex justify-center">
                            {tab === 'lesson' ? (
                                <LessonPlanSkeleton className="max-w-lg w-full" />
                            ) : (
                                <AssignmentSkeleton className="max-w-lg w-full" />
                            )}
                        </div>
                    ) : error ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                            {error}
                        </div>
                    ) : output ? (
                        <div className="space-y-3">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                                    Generated {tab === 'lesson' ? 'Lesson Plan' : 'Assignment'}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleSaveNote}
                                        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
                                        title="Save to notes"
                                    >
                                        <BookmarkPlus size={11} />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
                                        title="Copy raw JSON"
                                    >
                                        {copied ? <Check size={11} /> : <Copy size={11} />}
                                        {copied ? 'Copied' : 'Copy JSON'}
                                    </button>
                                </div>
                            </div>
                            {/* Rendered card */}
                            <div className="overflow-auto max-h-[600px] pr-1 flex justify-center">
                                {tab === 'lesson'
                                    ? <LessonPlanCard data={output} />
                                    : <AssignmentCard data={output} />
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                            <p className="text-sm">Fill the form and hit Generate.</p>
                            <p className="text-xs mt-1">Your {tab === 'lesson' ? 'lesson plan' : 'assignment'} will appear here.</p>
                        </div>
                    )}
                </Card>
            </div>
        </AiAssistantLayout>
    );
}
