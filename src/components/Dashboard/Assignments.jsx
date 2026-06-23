import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
    BookOpen, Plus, Send, CheckCircle2, Clock,
    Database, Loader2, ChevronDown, ChevronUp, X,
    Upload, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_COLORS = {
    pending: 'text-amber-700 bg-amber-500/10 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20 dark:border-amber-500/30',
    submitted: 'text-blue-700 bg-blue-500/10 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20 dark:border-blue-500/30',
    graded: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20 dark:border-emerald-500/30',
    returned: 'text-teal-700 bg-teal-500/10 border-teal-500/20 dark:text-teal-400 dark:bg-teal-500/20 dark:border-teal-500/30',
};

/** Card that expands to show assignment details and actions */
const AssignmentCard = ({ assignment, role, onRefresh }) => {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [grading, setGrading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');

    const status = STATUS_COLORS[assignment.status] || STATUS_COLORS.pending;

    const handleSubmit = async () => {
        if (!answer.trim()) { toast.error('Write your answer before submitting'); return; }
        setSubmitting(true);
        try {
            await api.patch(`/api/assignments/${assignment._id}/submit`, { answer });
            toast.success('Assignment submitted!');
            setAnswer('');
            onRefresh();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGrade = async () => {
        if (!grade) { toast.error('Enter a grade'); return; }
        setGrading(true);
        try {
            await api.patch(`/api/assignments/${assignment._id}/grade`, {
                grade: parseFloat(grade),
                feedback,
            });
            toast.success('Graded and student notified');
            setGrade('');
            setFeedback('');
            onRefresh();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Grading failed');
        } finally {
            setGrading(false);
        }
    };

    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
    const isOverdue = dueDate && dueDate < new Date() && assignment.status === 'pending';

    return (
        <div className={cn('bg-card border rounded-xl overflow-hidden transition-all', isOverdue ? 'border-red-300 dark:border-red-900/60' : 'border-border')}>
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-start justify-between px-6 py-4 hover:bg-muted/30 transition-colors text-left gap-4"
            >
                <div className="flex items-start gap-3 min-w-0">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                        <BookOpen size={15} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{assignment.description}</p>
                        {dueDate && (
                            <p className={cn('text-[10px] font-semibold mt-1', isOverdue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground')}>
                                <Clock size={10} className="inline mr-1" />
                                Due: {dueDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                {isOverdue && ' (Overdue)'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {assignment.grade != null && (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                            <Star size={12} fill="currentColor" />
                            {assignment.grade}/{assignment.maxGrade || 100}
                        </span>
                    )}
                    <span className={cn('px-2.5 py-1 text-[9px] font-heading font-bold uppercase tracking-widest rounded-lg border', status)}>
                        {assignment.status}
                    </span>
                    {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </div>
            </button>

            {open && (
                <div className="border-t border-border px-6 py-5 space-y-4 bg-background/50 dark:bg-slate-900/10 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Description */}
                    {assignment.description && (
                        <div>
                            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Instructions</p>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{assignment.description}</p>
                        </div>
                    )}

                    {/* Student's submitted answer */}
                    {assignment.answer && (
                        <div>
                            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Submitted Answer</p>
                            <div className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground whitespace-pre-wrap">
                                {assignment.answer}
                            </div>
                        </div>
                    )}

                    {/* Feedback from tutor */}
                    {assignment.feedback && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-primary mb-1">Tutor Feedback</p>
                            <p className="text-sm text-foreground">{assignment.feedback}</p>
                        </div>
                    )}

                    {/* Student: submit answer */}
                    {role === 'student' && assignment.status === 'pending' && (
                        <div className="pt-2 border-t border-border space-y-3">
                            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Your Answer</p>
                            <textarea
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                                placeholder="Write your answer here..."
                                rows={4}
                                className="w-full text-sm border border-border rounded-lg px-4 py-3 bg-card focus:outline-none focus:border-primary resize-none transition-colors"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !answer.trim()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {submitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                Submit Answer
                            </button>
                        </div>
                    )}

                    {/* Tutor: grade assignment */}
                    {role === 'tutor' && assignment.status === 'submitted' && (
                        <div className="pt-2 border-t border-border space-y-3">
                            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Grade Submission</p>
                            <div className="flex gap-3">
                                <div className="w-32">
                                    <label className="text-[10px] text-muted-foreground block mb-1">Grade (out of {assignment.maxGrade || 100})</label>
                                    <input
                                        type="number"
                                        value={grade}
                                        onChange={e => setGrade(e.target.value)}
                                        min={0}
                                        max={assignment.maxGrade || 100}
                                        placeholder="85"
                                        className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-card focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] text-muted-foreground block mb-1">Feedback (optional)</label>
                                    <input
                                        type="text"
                                        value={feedback}
                                        onChange={e => setFeedback(e.target.value)}
                                        placeholder="Great work on section 2..."
                                        className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-card focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleGrade}
                                disabled={grading || !grade}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-emerald-600 transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {grading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                                Save Grade
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/** Create new assignment form (tutor only) */
const CreateAssignmentForm = ({ connections, onSuccess, onCancel }) => {
    const [form, setForm] = useState({
        connectionId: '',
        title: '',
        description: '',
        dueDate: '',
        maxGrade: 100,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.connectionId || !form.title) { toast.error('Connection and title are required'); return; }
        setSaving(true);
        try {
            await api.post('/api/assignments', {
                connectionId: form.connectionId,
                title: form.title,
                description: form.description,
                dueDate: form.dueDate || undefined,
                maxGrade: parseInt(form.maxGrade) || 100,
            });
            toast.success('Assignment created — student notified');
            onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create assignment');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card border border-primary/20 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Plus size={15} className="text-primary" />
                    Create Assignment
                </h3>
                <button type="button" onClick={onCancel} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <X size={15} className="text-muted-foreground" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Student / Connection</label>
                    <select
                        value={form.connectionId}
                        onChange={e => setForm(f => ({ ...f, connectionId: e.target.value }))}
                        className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:border-primary"
                    >
                        <option value="">Select connection...</option>
                        {connections.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.studentId?.displayName || c.studentId?.email || 'Student'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Chapter 4 Practice Problems"
                        className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Instructions / Description</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Describe the assignment tasks..."
                        rows={3}
                        className="w-full text-sm border border-border rounded-lg px-3 py-3 bg-background focus:outline-none focus:border-primary resize-none"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Due Date (optional)</label>
                    <input
                        type="date"
                        value={form.dueDate}
                        onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                        className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Max Grade</label>
                    <input
                        type="number"
                        value={form.maxGrade}
                        onChange={e => setForm(f => ({ ...f, maxGrade: e.target.value }))}
                        min={1}
                        max={1000}
                        className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:border-primary"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onCancel} className="flex-1 py-2.5 text-xs font-heading font-bold uppercase tracking-wider border border-border rounded-lg hover:bg-muted transition-colors">
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-heading font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    Assign
                </button>
            </div>
        </form>
    );
};

/** Main Assignments component — works for both tutor and student */
const Assignments = () => {
    const { dbUser } = useAuth();
    const role = dbUser?.role;

    const [assignments, setAssignments] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showForm, setShowForm] = useState(false);

    const loadAssignments = useCallback(async () => {
        setLoading(true);
        try {
            // Use the connection-based endpoint to get assignments
            const res = await api.get('/api/connections');
            const conns = res.data?.data || res.data || [];
            setConnections(conns);


            // Try the direct list endpoint
            try {
                const assignRes = await api.get('/api/assignments', {
                    params: filter ? { status: filter } : {}
                });
                setAssignments(assignRes.data?.data || assignRes.data || []);
            } catch {
                setAssignments([]);
            }
        } catch {
            toast.error('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { loadAssignments(); }, [loadAssignments]);

    const statusFilters = [
        { id: '', label: 'All' },
        { id: 'pending', label: 'Pending' },
        { id: 'submitted', label: 'Submitted' },
        { id: 'graded', label: 'Graded' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in-up duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 bg-primary rounded-lg" />
                        <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Learning Track</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">Assignments</h2>
                    <p className="text-xs text-muted-foreground">
                        {role === 'tutor'
                            ? 'Create and grade assignments for your students.'
                            : 'View and submit assignments from your tutors.'}
                    </p>
                </div>

                {role === 'tutor' && (
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98]"
                    >
                        <Plus size={14} />
                        New Assignment
                    </button>
                )}
            </header>

            {showForm && role === 'tutor' && (
                <CreateAssignmentForm
                    connections={connections}
                    onSuccess={() => { setShowForm(false); loadAssignments(); }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <div className="flex flex-wrap bg-background p-1.5 rounded-lg gap-2 border border-border w-fit">
                {statusFilters.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={cn(
                            'px-5 py-2 text-[9px] font-heading font-bold uppercase tracking-widest rounded-lg border transition-all active:scale-[0.98]',
                            filter === f.id
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            ) : assignments.length === 0 ? (
                <div className="py-32 text-center bg-background border border-dashed border-border rounded-xl">
                    <BookOpen size={40} className="text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
                    <p className="text-sm font-heading font-bold text-muted-foreground mb-1">No assignments found</p>
                    <p className="text-xs text-muted-foreground">
                        {role === 'tutor' ? 'Create an assignment using the button above.' : 'Your tutor has not assigned any work yet.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {assignments.map(a => (
                        <AssignmentCard
                            key={a._id}
                            assignment={a}
                            role={role}
                            onRefresh={loadAssignments}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Assignments;
