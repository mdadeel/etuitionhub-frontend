// tuition management dashboard - admin approve/reject
import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { AppleButton } from '../shared/AppleUI';
import { Check, X, ShieldAlert, Edit2 } from 'lucide-react';
import EditModal from './EditModal';

const DashTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTuition, setSelectedTuition] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const tuitionFields = [
        { name: 'subject', label: 'Subject', placeholder: 'e.g. Mathematics' },
        { name: 'class_name', label: 'Class', placeholder: 'e.g. Class 10' },
        { name: 'location', label: 'Location', placeholder: 'e.g. Dhanmondi, Dhaka' },
        { name: 'salary', label: 'Salary (BDT)', type: 'number', placeholder: 'e.g. 5000' }
    ];

    const loadTuitions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/tuitions');
            setTuitions(res.data || []);
        } catch {
            toast.error('Failed to load tuitions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTuitions();
    }, [loadTuitions]);

    const filtered = useMemo(() => {
        if (filter === 'all') return tuitions;
        return tuitions.filter(t => t.status === filter);
    }, [tuitions, filter]);

    const handleApprove = async (id) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Demo data is read-only');
            return;
        }

        try {
            await api.patch(`/api/tuitions/${id}`, { status: 'approved' });
            toast.success('Tuition approved');
            await loadTuitions();
        } catch {
            toast.error('Failed to approve tuition');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Reject this tuition?')) return;

        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Demo data is read-only');
            return;
        }

        try {
            await api.patch(`/api/tuitions/${id}`, { status: 'rejected' });
            toast.success('Tuition rejected');
            await loadTuitions();
        } catch {
            toast.error('Failed to reject tuition');
        }
    };

    const handleEditClick = (tuition) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(tuition._id)) {
            toast.error('Demo data is read-only');
            return;
        }
        setSelectedTuition(tuition);
        setIsEditModalOpen(true);
    };

    const handleEditSave = async (updatedData) => {
        setIsSaving(true);
        try {
            await api.patch(`/api/tuitions/${selectedTuition._id}`, updatedData);
            toast.success('Tuition updated');
            setIsEditModalOpen(false);
            await loadTuitions();
        } catch {
            toast.error('Failed to update tuition');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-transparent">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        Marketplace Streams
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {tuitions.length} active metadata nodes detected
                    </p>
                </div>

                <div className="flex bg-muted/50 p-1 rounded-2xl gap-1 border border-border/50 w-fit backdrop-blur-md">
                    {['all', 'pending', 'approved'].map(f => (
                        <button
                            key={f}
                            className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${filter === f
                                ? 'bg-background text-primary shadow-apple-sm ring-1 ring-border/50'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'approved' ? 'Active' : f === 'all' ? 'Universal' : 'Verify'}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-muted-foreground">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Academic Scope</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Geography</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Yield</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center">State</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                        <ShieldAlert size={48} strokeWidth={1} />
                                        <p className="text-[10px] font-bold uppercase tracking-widest italic">Universal records empty</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((t) => (
                                <tr key={t._id} className="group">
                                    <td className="px-6 py-5 bg-muted/20 border-y border-l border-border/50 first:rounded-l-2xl">
                                        <p className="text-sm font-bold text-foreground leading-tight">{t.subject}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{t.class_name}</p>
                                    </td>
                                    <td className="px-6 py-5 bg-muted/20 border-y border-border/50">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.location}</p>
                                    </td>
                                    <td className="px-6 py-5 bg-muted/20 border-y border-border/50 text-center">
                                        <span className="text-sm font-bold text-primary tabular-nums">৳{t.salary}</span>
                                    </td>
                                    <td className="px-6 py-5 bg-muted/20 border-y border-border/50 text-center">
                                                <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${t.status === 'approved' ? 'bg-green-500/10 text-green-600' : t.status === 'rejected' ? 'bg-red-500/10 text-red-600' : 'bg-primary/10 text-primary'}`}>
                                                    {t.status.toUpperCase()}
                                                </span>
                                    </td>
                                    <td className="px-6 py-5 bg-muted/20 border-y border-r border-border/50 last:rounded-r-2xl text-right">
                                        <div className="flex justify-end gap-3">
                                            <AppleButton
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                onClick={() => handleEditClick(t)}
                                            >
                                                <Edit2 size={14} />
                                            </AppleButton>

                                            {t.status === 'pending' && (
                                                <>
                                                    <AppleButton
                                                        size="sm"
                                                        variant="primary"
                                                        className="h-8 px-4 text-[10px]"
                                                        onClick={() => handleApprove(t._id)}
                                                    >
                                                        <Check size={14} className="mr-1.5" /> Verify
                                                    </AppleButton>
                                                    <AppleButton
                                                        size="sm"
                                                        variant="secondary"
                                                        className="h-8 px-4 text-[10px] bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                                                        onClick={() => handleReject(t._id)}
                                                    >
                                                        <X size={14} className="mr-1.5" /> Drop
                                                    </AppleButton>
                                                </>
                                            )}
                                            {t.status !== 'pending' && (
                                                <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] px-4 self-center">Archived</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <EditModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Tuition Requirement"
                data={selectedTuition}
                fields={tuitionFields}
                onSave={handleEditSave}
                isLoading={isSaving}
            />
        </div>
    );
};

export default DashTuitions;
