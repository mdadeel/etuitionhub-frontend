// tuition management dashboard - admin approve/reject
import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { ShieldAlert, Edit2, Eye, MapPin, DollarSign, BookOpen, Calendar, Globe, User, FileText } from 'lucide-react';
import DataTable from "@/components/ui/data-table";
import EditModal from './EditModal';
import Pagination from '../shared/Pagination';
import StatusBadge from '../shared/StatusBadge';
import DashboardPageHeader from '../shared/DashboardPageHeader';
import EmptyState from '../shared/EmptyState';
import DashboardFilterBar from '../shared/DashboardFilterBar';
import SubjectFilter from '../shared/SubjectFilter';
import ClassFilter from '../shared/ClassFilter';
import LocationFilter from '../shared/LocationFilter';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTuitions, setTotalTuitions] = useState(0);

    // Advanced filters
    const [subjectFilter, setSubjectFilter] = useState(null);
    const [classFilter, setClassFilter] = useState(null);
    const [locationFilter, setLocationFilter] = useState(null);

    // Reset page when any filter changes
    useEffect(() => {
        setPage(1);
    }, [filter, subjectFilter, classFilter, locationFilter]);
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTuition, setSelectedTuition] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Detail Modal State
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailTuition, setDetailTuition] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const tuitionFields = [
        { name: 'subject', label: 'Subject', placeholder: 'e.g. Mathematics' },
        { name: 'class_name', label: 'Class', placeholder: 'e.g. Class 10' },
        { name: 'location', label: 'Location', placeholder: 'e.g. Dhanmondi, Dhaka' },
        { name: 'salary', label: 'Salary (BDT)', type: 'number', placeholder: 'e.g. 5000' }
    ];

    const loadTuitions = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page };
            if (subjectFilter) params.subjects = subjectFilter;
            if (classFilter) params.classFilter = classFilter;
            if (locationFilter) params.locationFilter = locationFilter;

            const res = await api.get('/api/tuitions', { params });
            const data = res.data;
            setTuitions(Array.isArray(data) ? data : (data?.data || []));
            if (data?.pagination) {
                setTotalPages(data.pagination.totalPages ?? data.pagination.pages ?? 1);
                setTotalTuitions(data.pagination.totalItems ?? data.pagination.total ?? 0);
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to load tuitions');
        } finally {
            setLoading(false);
        }
    }, [page, subjectFilter, classFilter, locationFilter]);

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
            await api.patch(`/api/tuitions/${id}/status`, { status: 'approved' });
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
            await api.delete(`/api/tuitions/${id}`);
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

    const handleViewDetail = async (tuition) => {
        setDetailOpen(true);
        setDetailLoading(true);
        try {
            const res = await api.get(`/api/tuitions/${tuition._id}`);
            setDetailTuition(res.data || tuition);
        } catch {
            setDetailTuition(tuition);
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in fade-in duration-700 animate-fade-in-up">
            <DashboardPageHeader
                category="Marketplace Management"
                title="Tuition Streams"
                subtitle={`${totalTuitions || tuitions.length} active tuition postings.`}
                action={
                    <div className="flex bg-background p-1 rounded-lg gap-1 border border-border w-fit">
                        {['all', 'pending', 'approved'].map(f => (
                            <button
                                key={f}
                                className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-wider rounded-lg border transition-all duration-300 ${filter === f
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
                                    }`}
                                onClick={() => setFilter(f)}
                            >
                                {f === 'approved' ? 'Active' : f === 'all' ? 'All' : 'Pending'}
                            </button>
                        ))}
                    </div>
                }
            />

            {/* Advanced Filters */}
            <DashboardFilterBar
                activeCount={[subjectFilter, classFilter, locationFilter].filter(Boolean).length}
                onClear={() => { setSubjectFilter(null); setClassFilter(null); setLocationFilter(null); }}
            >
                <SubjectFilter value={subjectFilter} onChange={setSubjectFilter} />
                <ClassFilter value={classFilter} onChange={setClassFilter} />
                <LocationFilter value={locationFilter} onChange={setLocationFilter} />
            </DashboardFilterBar>

            <DataTable
                columns={[
                    {
                        key: 'subject',
                        label: 'Scope',
                        render: (val, row) => (
                            <>
                                <p className="text-xs md:text-sm font-bold text-foreground leading-tight">{row.subject}</p>
                                <p className="text-[9px] font-label font-semibold text-muted-foreground uppercase tracking-wider mt-1">{row.class_name}</p>
                            </>
                        ),
                    },
                    {
                        key: 'location',
                        label: 'Geography',
                        hideOn: 'md',
                        render: (val) => (
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{val}</p>
                        ),
                    },
                    {
                        key: 'salary',
                        label: 'Fee',
                        align: 'center',
                        render: (val) => (
                            <span className="text-xs md:text-sm font-heading font-bold text-primary tabular-nums">৳{val}</span>
                        ),
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        align: 'center',
                        render: (val) => (
                            <StatusBadge status={val} />
                        ),
                    },
                    {
                        key: '_id',
                        label: 'Ops',
                        align: 'right',
                        render: (val, row) => (
                            <div className="flex justify-end gap-2 md:gap-3 items-center">
                                <button
                                    onClick={() => handleViewDetail(row)}
                                    className="size-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/20 flex items-center justify-center transition-colors active:scale-[0.98]"
                                    title="View details"
                                >
                                    <Eye size={12} />
                                </button>
                                <button
                                    onClick={() => handleEditClick(row)}
                                    className="size-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/20 flex items-center justify-center transition-colors active:scale-[0.98]"
                                >
                                    <Edit2 size={12} />
                                </button>
                                {row.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(row._id)}
                                            className="h-7 px-3 rounded-lg border border-primary bg-primary text-primary-foreground text-[9px] font-heading font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-[0.98]"
                                        >
                                            Verify
                                        </button>
                                        <button
                                            onClick={() => handleReject(row._id)}
                                            className="h-7 px-3 rounded-lg text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 text-[9px] font-label font-semibold uppercase tracking-widest transition-all active:scale-[0.98]"
                                        >
                                            Drop
                                        </button>
                                    </>
                                )}
                                {row.status !== 'pending' && (
                                    <span className="text-[9px] font-heading font-bold text-muted-foreground/60 uppercase tracking-[0.2em] italic pr-3">Done</span>
                                )}
                            </div>
                        ),
                    },
                ]}
                data={filtered}
                rowKey={(t) => t._id}
                resizable
                emptyState={
                    <EmptyState icon={ShieldAlert} title="No tuition postings found" />
                }
            />

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

            {/* Tuition Detail Dialog */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="sm:max-w-[520px] bg-card border border-border rounded-xl p-0 overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto">
                    {detailLoading ? (
                        <div className="p-12 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                        </div>
                    ) : detailTuition ? (
                        <>
                            <DialogHeader className="p-6 pb-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen size={14} className="text-primary" />
                                    <span className="text-xs font-label font-semibold uppercase tracking-wider text-primary">Tuition Details</span>
                                </div>
                                <DialogTitle className="text-lg font-heading font-bold tracking-tight text-foreground">
                                    {detailTuition.subject}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-1">
                                    {detailTuition.class_name || 'All Classes'}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="p-6 space-y-5">
                                {/* Status Badge + Date */}
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1.5 text-xs font-label font-semibold uppercase tracking-wider rounded-lg border ${
                                        detailTuition.status === 'approved' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
                                        detailTuition.status === 'rejected' ? 'bg-red-500/10 text-red-700 border-red-500/20' :
                                        'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                    }`}>
                                        {detailTuition.status}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Posted {detailTuition.createdAt ? new Date(detailTuition.createdAt).toLocaleDateString() : '—'}
                                    </span>
                                </div>

                                {/* Student Info */}
                                {(detailTuition.student_name || detailTuition.student_email) && (
                                    <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
                                        <Avatar className="size-11 rounded-xl border border-border">
                                            <AvatarFallback className="bg-muted rounded-xl text-sm font-bold">
                                                {(detailTuition.student_name || 'S')[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-heading font-bold text-foreground">{detailTuition.student_name || 'Student'}</p>
                                            <p className="text-xs text-muted-foreground">{detailTuition.student_email || '—'}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: MapPin, label: 'Location', value: detailTuition.location || '—' },
                                        { icon: DollarSign, label: 'Salary', value: `৳${detailTuition.salary || '—'}`, isPrimary: true },
                                        { icon: BookOpen, label: 'Class', value: detailTuition.class_name || '—' },
                                        { icon: Calendar, label: 'Days/Week', value: detailTuition.days_per_week || '—' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-3 bg-background rounded-xl border border-border">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <item.icon size={12} className="text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">{item.label}</span>
                                            </div>
                                            <p className={`text-sm font-heading font-bold ${item.isPrimary ? 'text-primary' : 'text-foreground'}`}>{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Medium + Gender row */}
                                <div className="flex gap-3">
                                    <div className="flex-1 p-3 bg-background rounded-xl border border-border">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Globe size={12} className="text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Medium</span>
                                        </div>
                                        <p className="text-sm font-heading font-bold text-foreground capitalize">{detailTuition.medium || '—'}</p>
                                    </div>
                                    <div className="flex-1 p-3 bg-background rounded-xl border border-border">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <User size={12} className="text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Gender Pref</span>
                                        </div>
                                        <p className="text-sm font-heading font-bold text-foreground capitalize">{detailTuition.gender_preference || 'Any'}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                {detailTuition.description && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-muted-foreground" />
                                            <label className="text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed bg-background p-3 rounded-xl border border-border">
                                            {detailTuition.description}
                                        </p>
                                    </div>
                                )}

                                {/* Subjects */}
                                {detailTuition.subjects?.length > 0 && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={14} className="text-muted-foreground" />
                                            <label className="text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">Subjects</label>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {detailTuition.subjects.map((s, i) => (
                                                <span key={i} className="px-2.5 py-1 text-xs font-label font-semibold bg-muted rounded-lg border border-border">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tuition ID */}
                                <div className="pt-2 border-t border-border">
                                    <p className="text-xs text-muted-foreground font-mono">
                                        ID: {detailTuition._id}
                                    </p>
                                </div>
                            </div>

                            <DialogFooter className="p-6 pt-0">
                                <button
                                    onClick={() => setDetailOpen(false)}
                                    className="h-10 px-6 rounded-lg text-muted-foreground hover:text-foreground border border-border hover:bg-muted text-xs font-label font-semibold uppercase tracking-wider transition-all active:scale-[0.98]"
                                >
                                    Close
                                </button>
                            </DialogFooter>
                        </>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DashTuitions;
