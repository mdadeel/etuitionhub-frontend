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
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Marketplace Management</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Tuition Streams</h1>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight leading-tight">Tuition Streams</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        {tuitions.length} active metadata nodes detected.
                    </p>
                </div>

                <div className="flex bg-muted p-1 rounded-2xl gap-1 border border-border w-fit backdrop-blur-md">
                    {['all', 'pending', 'approved'].map(f => (
                        <button
                            key={f}
                            className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${filter === f
                                ? 'bg-card text-blue-600 shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                        <tr className="text-slate-400">
                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Scope</th>
                            <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Geography</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Yield</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center">State</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Ops</th>
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
                                    <td className="px-4 md:px-6 py-4 md:py-5 bg-card border-y border-l border-border first:rounded-l-2xl group-hover:bg-muted/30 transition-colors">
                                        <p className="text-xs md:text-sm font-bold text-foreground leading-tight">{t.subject}</p>
                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.class_name}</p>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-5 bg-card border-y border-border group-hover:bg-muted/30 transition-colors">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.location}</p>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 md:py-5 bg-card border-y border-border text-center group-hover:bg-muted/30 transition-colors">
                                        <span className="text-xs md:text-sm font-bold text-blue-600 tabular-nums">৳{t.salary}</span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 md:py-5 bg-card border-y border-border text-center group-hover:bg-muted/30 transition-colors">
                                        <span className={`px-2 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded-full border ${t.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : t.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {t.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 md:py-5 bg-card border-y border-r border-border last:rounded-r-2xl text-right group-hover:bg-muted/30 transition-colors">
                                        <div className="flex justify-end gap-2 md:gap-3">
                                            <AppleButton
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 w-7 md:h-8 md:w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                onClick={() => handleEditClick(t)}
                                            >
                                                <Edit2 size={12} />
                                            </AppleButton>

                                            {t.status === 'pending' && (
                                                <>
                                                    <AppleButton
                                                        size="sm"
                                                        variant="primary"
                                                        className="h-7 md:h-8 px-2 md:px-4 text-[8px] md:text-[10px]"
                                                        onClick={() => handleApprove(t._id)}
                                                    >
                                                        <Check size={12} className="md:mr-1.5" /> <span className="hidden md:inline">Verify</span>
                                                    </AppleButton>
                                                    <AppleButton
                                                        size="sm"
                                                        variant="secondary"
                                                        className="h-7 md:h-8 px-2 md:px-4 text-[8px] md:text-[10px] bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                                                        onClick={() => handleReject(t._id)}
                                                    >
                                                        <X size={12} className="md:mr-1.5" /> <span className="hidden md:inline">Drop</span>
                                                    </AppleButton>
                                                </>
                                            )}
                                            {t.status !== 'pending' && (
                                                <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-[0.1em] md:px-4 self-center">Done</span>
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
