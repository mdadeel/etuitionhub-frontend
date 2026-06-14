// tuition management dashboard - admin approve/reject
import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Check, X, ShieldAlert, Edit2 } from 'lucide-react';
import EditModal from './EditModal';
import Pagination from '../shared/Pagination';

const DashTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTuitions, setTotalTuitions] = useState(0);

    // Reset page when filter changes
    useEffect(() => {
        setPage(1);
    }, [filter]);
    
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
            const res = await api.get('/api/tuitions', {
                params: { page }
            });
            const data = res.data;
            setTuitions(Array.isArray(data) ? data : (data?.data || []));
            if (data?.pagination) {
                setTotalPages(data.pagination.pages);
                setTotalTuitions(data.pagination.total);
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to load tuitions');
        } finally {
            setLoading(false);
        }
    }, [page]);

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
        <div className="space-y-6 animate-in fade-in duration-700 animate-fade-in-up">
            <header className="mb-4 border-b border-border pb-3 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-1.5 bg-primary rounded-lg"></div>
                        <span className="text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Marketplace Management</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-heading font-bold uppercase tracking-tight text-foreground">Tuition Streams</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {totalTuitions || tuitions.length} active metadata nodes detected.
                    </p>
                </div>

                <div className="flex bg-background p-1 rounded-lg gap-1 border border-border w-fit backdrop-blur-md">
                    {['all', 'pending', 'approved'].map(f => (
                        <button
                            key={f}
                            className={`px-4 py-2 text-[9px] font-heading font-semibold uppercase tracking-widest rounded-lg border transition-all duration-300 ${filter === f
                                ? 'bg-primary border-primary text-primary-foreground shadow-none'
                                : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
                                }`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'approved' ? 'Active' : f === 'all' ? 'Universal' : 'Verify'}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto border border-border bg-card">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/30 border-b border-border text-foreground">
                            <th className="px-4 md:px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Scope</th>
                            <th className="hidden md:table-cell px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Geography</th>
                            <th className="px-4 md:px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground text-center">Yield</th>
                            <th className="px-4 md:px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground text-center">State</th>
                            <th className="px-4 md:px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-16 text-center bg-muted/20">
                                    <div className="flex flex-col items-center gap-3">
                                        <ShieldAlert size={40} className="text-muted-foreground" strokeWidth={1} />
                                        <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Universal records empty</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((t) => (
                                <tr key={t._id} className="hover:bg-muted/30 hover:text-foreground transition-colors">
                                    <td className="px-4 md:px-5 py-3">
                                        <p className="text-xs md:text-sm font-bold text-foreground leading-tight">{t.subject}</p>
                                        <p className="text-[9px] font-label font-semibold text-muted-foreground uppercase tracking-wider mt-1">{t.class_name}</p>
                                    </td>
                                    <td className="hidden md:table-cell px-5 py-3">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.location}</p>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 text-center">
                                        <span className="text-xs md:text-sm font-heading font-bold text-primary tabular-nums">৳{t.salary}</span>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 text-center">
                                        <span className={`px-2.5 py-1 text-[9px] font-label font-semibold uppercase tracking-wider rounded-lg border w-fit ${
                                            t.status === 'approved' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
                                            t.status === 'rejected' ? 'bg-red-500/10 text-red-700 border-red-500/20' :
                                            'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 text-right">
                                        <div className="flex justify-end gap-2 md:gap-3 items-center">
                                            <button
                                                onClick={() => handleEditClick(t)}
                                                className="size-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/20 flex items-center justify-center transition-colors active:scale-[0.98]"
                                            >
                                                <Edit2 size={12} />
                                            </button>

                                            {t.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(t._id)}
                                                        className="h-7 px-3 rounded-lg border border-primary bg-primary text-primary-foreground text-[9px] font-heading font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-[0.98]"
                                                    >
                                                        Verify
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(t._id)}
                                                        className="h-7 px-3 rounded-lg text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 text-[9px] font-label font-semibold uppercase tracking-widest transition-all active:scale-[0.98]"
                                                    >
                                                        Drop
                                                    </button>
                                                </>
                                            )}
                                            {t.status !== 'pending' && (
                                                <span className="text-[9px] font-heading font-bold text-muted-foreground/60 uppercase tracking-[0.2em] italic pr-3">Done</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination 
                        currentPage={page} 
                        totalPages={totalPages} 
                        onPageChange={setPage} 
                    />
                </div>
            )}

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
