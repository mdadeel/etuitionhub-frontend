import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
    Scale, Database, Clock, CheckCircle2, AlertTriangle,
    Plus, X, ChevronDown, ChevronUp, User, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DISPUTE_TYPES = [
    { value: 'session_dispute', label: 'Session Issue' },
    { value: 'payment_dispute', label: 'Payment Issue' },
    { value: 'conduct_dispute', label: 'Conduct Issue' },
];

const RESOLUTION_TYPES = [
    { value: 'full_refund', label: 'Full Refund' },
    { value: 'partial_refund', label: 'Partial Refund' },
    { value: 'no_refund', label: 'No Refund' },
    { value: 'other', label: 'Other' },
];

const STATUS_CONFIG = {
    open: { label: 'Open', color: 'text-amber-700 bg-amber-500/10 border-amber-500/20' },
    under_review: { label: 'Under Review', color: 'text-blue-700 bg-blue-500/10 border-blue-500/20' },
    resolved: { label: 'Resolved', color: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20' },
    closed: { label: 'Closed', color: 'text-muted-foreground bg-muted border-border' },
};

/** Expandable detail row for a single dispute */
const DisputeRow = ({ dispute, isAdmin, onRefresh }) => {
    const [open, setOpen] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [resolution, setResolution] = useState('');
    const [resolutionType, setResolutionType] = useState('no_refund');
    const status = STATUS_CONFIG[dispute.status] || STATUS_CONFIG.open;

    const handleResolve = async () => {
        if (!resolution.trim()) { toast.error('Enter a resolution note'); return; }
        setResolving(true);
        try {
            await api.patch(`/api/disputes/${dispute._id}/resolve`, { resolution: resolution.trim(), resolutionType });
            toast.success('Dispute resolved — parties notified');
            onRefresh();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to resolve');
        } finally {
            setResolving(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden transition-all">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors text-left"
            >
                <div className="flex items-center gap-4 min-w-0">
                    <Scale size={16} className="text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">
                            {DISPUTE_TYPES.find(t => t.value === dispute.type)?.label || dispute.type}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Filed by {dispute.filedBy?.displayName || dispute.filedBy?.email || 'Unknown'} ·{' '}
                            {new Date(dispute.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className={cn('px-2.5 py-1 text-[9px] font-heading font-bold uppercase tracking-widest rounded-lg border', status.color)}>
                        {status.label}
                    </span>
                    {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </div>
            </button>

            {open && (
                <div className="border-t border-border px-6 py-5 space-y-4 bg-background/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Evidence */}
                    {dispute.evidence?.notes && (
                        <div>
                            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-1">Evidence</p>
                            <p className="text-sm text-foreground bg-card border border-border rounded-lg px-4 py-3 italic">{dispute.evidence.notes}</p>
                        </div>
                    )}

                    {/* Response */}
                    {dispute.responseEvidence?.notes && (
                        <div>
                            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-1">Response from Other Party</p>
                            <p className="text-sm text-foreground bg-card border border-border rounded-lg px-4 py-3">{dispute.responseEvidence.notes}</p>
                        </div>
                    )}

                    {/* Resolution */}
                    {dispute.resolution && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-emerald-700 mb-1">Resolution</p>
                            <p className="text-sm text-emerald-900">{dispute.resolution}</p>
                            {dispute.resolvedBy && (
                                <p className="text-[10px] text-emerald-700/60 mt-1">
                                    Resolved by {dispute.resolvedBy?.displayName || dispute.resolvedBy?.email}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Admin resolve form */}
                    {isAdmin && dispute.status !== 'resolved' && dispute.status !== 'closed' && dispute.status !== 'refunded' && (
                        <div className="pt-2 border-t border-border space-y-3">
                            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Admin Resolution</p>
                            
                            <select
                                value={resolutionType}
                                onChange={e => setResolutionType(e.target.value)}
                                className="w-full text-sm border border-border rounded-lg px-4 py-2.5 bg-background focus:outline-none focus:border-primary transition-colors"
                            >
                                {RESOLUTION_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>

                            <textarea
                                value={resolution}
                                onChange={e => setResolution(e.target.value)}
                                placeholder="Describe the resolution decision..."
                                rows={3}
                                className="w-full text-sm border border-border rounded-lg px-4 py-3 bg-card focus:outline-none focus:border-primary resize-none transition-colors"
                            />
                            <button
                                onClick={handleResolve}
                                disabled={resolving || !resolution.trim()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {resolving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                Mark Resolved
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/** File a new dispute form */
const FileDisputeForm = ({ connections, onSuccess, onCancel }) => {
    const [form, setForm] = useState({ connectionId: '', type: '', notes: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.connectionId || !form.type) { toast.error('Please select a connection and dispute type'); return; }
        setSubmitting(true);
        try {
            await api.post('/api/disputes', {
                connectionId: form.connectionId,
                type: form.type,
                evidence: { notes: form.notes },
            });
            toast.success('Dispute filed — admin notified');
            onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to file dispute');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    File a New Dispute
                </h3>
                <button onClick={onCancel} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <X size={16} className="text-muted-foreground" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Connection</label>
                    <select
                        value={form.connectionId}
                        onChange={e => setForm(f => ({ ...f, connectionId: e.target.value }))}
                        className="w-full text-sm border border-border rounded-lg px-4 py-2.5 bg-background focus:outline-none focus:border-primary transition-colors"
                    >
                        <option value="">Select a connection...</option>
                        {connections.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.studentId?.displayName || c.studentId?.email} ↔ {c.tutorId?.displayName || c.tutorId?.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Dispute Type</label>
                    <div className="flex flex-wrap gap-2">
                        {DISPUTE_TYPES.map(t => (
                            <button
                                key={t.value}
                                type="button"
                                onClick={() => setForm(f => ({ ...f, type: t.value }))}
                                className={cn(
                                    'px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-lg border transition-all active:scale-[0.98]',
                                    form.type === t.value
                                        ? 'bg-primary border-primary text-primary-foreground'
                                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Evidence / Notes</label>
                    <textarea
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        placeholder="Describe what happened in detail..."
                        rows={4}
                        className="w-full text-sm border border-border rounded-lg px-4 py-3 bg-background focus:outline-none focus:border-primary resize-none transition-colors"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 text-xs font-heading font-bold uppercase tracking-wider border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-heading font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Scale size={14} />}
                        Submit Dispute
                    </button>
                </div>
            </form>
        </div>
    );
};

/** Main DisputeWorkspace component */
const DisputeWorkspace = ({ isAdminView = false }) => {
    const { dbUser } = useAuth();
    const isAdmin = isAdminView || dbUser?.globalRole === 'super_admin';

    const [disputes, setDisputes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showForm, setShowForm] = useState(false);

    const loadDisputes = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter) params.status = filter;
            const res = await api.get('/api/disputes', { params });
            setDisputes(res.data?.data || res.data || []);
        } catch {
            toast.error('Failed to load disputes');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    const loadConnections = useCallback(async () => {
        if (isAdmin) return;
        try {
            const res = await api.get('/api/connections');
            setConnections(res.data?.data || res.data || []);
        } catch {
            // silently fail — not critical
        }
    }, [isAdmin]);

    useEffect(() => {
        loadDisputes();
        loadConnections();
    }, [loadDisputes, loadConnections]);

    const filters = [
        { id: '', label: 'All' },
        { id: 'open', label: 'Open' },
        { id: 'under_review', label: 'Under Review' },
        { id: 'resolved', label: 'Resolved' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in-up duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 bg-primary rounded-lg" />
                        <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                            {isAdmin ? 'Admin Dispute Resolution' : 'My Disputes'}
                        </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">
                        Disputes & Support
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        {isAdmin
                            ? 'Review and resolve platform disputes as an administrator.'
                            : 'File and track disputes related to your sessions or payments.'}
                    </p>
                </div>

                {!isAdmin && (
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98]"
                    >
                        <Plus size={14} />
                        File Dispute
                    </button>
                )}
            </header>

            {/* File form */}
            {showForm && !isAdmin && (
                <FileDisputeForm
                    connections={connections}
                    onSuccess={() => { setShowForm(false); loadDisputes(); }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Filter tabs */}
            <div className="flex flex-wrap bg-background p-1.5 rounded-lg gap-2 border border-border w-fit">
                {filters.map(f => (
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

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            ) : disputes.length === 0 ? (
                <div className="py-32 text-center bg-background border border-border rounded-xl">
                    <Database size={40} className="text-muted-foreground/30 mx-auto mb-6" strokeWidth={1} />
                    <p className="text-[10px] font-label font-semibold text-muted-foreground/60 uppercase tracking-[0.25em]">
                        No disputes found
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {disputes.map(d => (
                        <DisputeRow
                            key={d._id}
                            dispute={d}
                            isAdmin={isAdmin}
                            onRefresh={loadDisputes}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DisputeWorkspace;
