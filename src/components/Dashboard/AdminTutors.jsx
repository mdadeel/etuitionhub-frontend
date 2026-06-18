import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Plus, UserX, ShieldAlert, ShieldCheck, Shield, Clock, Eye, ChevronDown, Star, Calendar, BookOpen, FileText, GraduationCap, AlertCircle, Award, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DataTable from "@/components/ui/data-table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import StatusBadge from '../shared/StatusBadge';
import DashboardPageHeader from '../shared/DashboardPageHeader';
import EmptyState from '../shared/EmptyState';

const VERIFICATION_OPTIONS = [
    { value: 'unverified', label: 'Unverified', color: 'bg-muted text-muted-foreground border-border' },
    { value: 'pending_review', label: 'Pending Review', color: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
    { value: 'verified_basic', label: 'Basic Verified', color: 'bg-primary/10 text-primary border-primary/20' },
    { value: 'verified_premium', label: 'Premium Verified', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' },
];

const AdminTutors = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addOpen, setAddOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [adding, setAdding] = useState(false);

    // Profile modal state
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileTutor, setProfileTutor] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [updatingVerification, setUpdatingVerification] = useState(false);

    const loadTutors = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/tutors');
            setTutors(res.data?.data || []);
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to load tutors');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadTutors(); }, [loadTutors]);

    const handleAddTutor = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setAdding(true);
        try {
            await api.patch(`/api/users/by-email/${encodeURIComponent(email.trim())}`, { role: 'tutor' });
            toast.success('User upgraded to tutor');
            setAddOpen(false);
            setEmail('');
            await loadTutors();
        } catch (err) {
            const msg = err?.response?.data?.error || 'Failed to add tutor';
            toast.error(msg);
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveTutor = async (id) => {
        if (!confirm('Downgrade this tutor to student?')) return;
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Demo data is read-only');
            return;
        }
        try {
            await api.patch(`/api/users/${id}`, { role: 'student' });
            toast.success('Tutor downgraded to student');
            await loadTutors();
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to remove tutor');
        }
    };

    const handleViewProfile = async (tutor) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(tutor._id)) {
            toast.error('Demo data is not viewable');
            return;
        }
        setProfileOpen(true);
        setProfileLoading(true);
        try {
            const res = await api.get(`/api/tutors/${tutor._id}`);
            setProfileTutor(res.data || tutor);
        } catch {
            setProfileTutor(tutor);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleVerificationChange = async (userId, newStatus) => {
        setUpdatingVerification(true);
        try {
            await api.patch(`/api/users/${userId}`, { verificationStatus: newStatus });
            toast.success(`Verification updated to ${newStatus.replace('_', ' ')}`);
            setProfileTutor(prev => prev ? { ...prev, verificationStatus: newStatus, isVerified: newStatus.startsWith('verified_') } : prev);
            await loadTutors();
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to update verification');
        } finally {
            setUpdatingVerification(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <DashboardPageHeader
                category="Tutor Management"
                title="All Tutors"
                subtitle={`${tutors.length} registered tutors`}
                action={
                    <Button size="sm" onClick={() => setAddOpen(true)}>
                        <Plus size={12} />
                        Add Tutor
                    </Button>
                }
            />

            <DataTable
                columns={[
                    {
                        key: 'displayName',
                        label: 'Tutor',
                        render: (_, t) => (
                            <div className="flex items-center gap-3">
                                <Avatar className="size-8 rounded-lg border border-border">
                                    <AvatarImage src={t.photoURL} alt={t.displayName} className="object-cover rounded-lg" />
                                    <AvatarFallback className="bg-muted rounded-lg text-[9px] font-bold">
                                        {(t.displayName || 'T')[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs md:text-sm font-bold text-foreground leading-tight">{t.displayName}</p>
                                    <p className="text-[9px] font-label font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">{t.mobileNumber || '—'}</p>
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: 'email',
                        label: 'Email',
                        hideOn: 'md',
                        render: (val) => <span className="text-xs text-muted-foreground">{val}</span>,
                    },
                    {
                        key: 'subjects',
                        label: 'Subjects',
                        hideOn: 'md',
                        render: (val) => (
                            <div className="flex flex-wrap gap-1">
                                {(val || []).length > 0
                                    ? val.slice(0, 3).map((s, i) => (
                                        <span key={i} className="px-1.5 py-0.5 text-[8px] font-label font-semibold uppercase tracking-wider bg-muted rounded-md border border-border">{s}</span>
                                    ))
                                    : <span className="text-[9px] text-muted-foreground italic">—</span>
                                }
                                {(val || []).length > 3 && (
                                    <span className="text-[8px] text-muted-foreground">+{val.length - 3}</span>
                                )}
                            </div>
                        ),
                    },
                    {
                        key: 'verificationStatus',
                        label: 'Verification',
                        align: 'center',
                        render: (val) => (
                            <StatusBadge status={val} />
                        ),
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        align: 'center',
                        render: (_, t) => (
                            <div className="flex items-center justify-center gap-1.5">
                                {t.isVerified ? (
                                    <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <Clock size={12} className="text-muted-foreground" />
                                )}
                                <span className={`text-[9px] font-label font-semibold uppercase tracking-wider ${t.isVerified ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                                    {t.isVerified ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                        ),
                    },
                    {
                        key: '_id',
                        label: 'Actions',
                        align: 'right',
                        render: (val, row) => (
                            <div className="flex justify-end gap-2 items-center">
                                <button
                                    onClick={() => handleViewProfile(row)}
                                    className="size-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/20 flex items-center justify-center transition-colors active:scale-[0.98]"
                                    title="View profile"
                                >
                                    <Eye size={12} />
                                </button>
                                <button
                                    onClick={() => handleRemoveTutor(val)}
                                    className="size-7 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 flex items-center justify-center transition-colors active:scale-[0.98]"
                                    title="Downgrade to student"
                                >
                                    <UserX size={12} />
                                </button>
                            </div>
                        ),
                    },
                ]}
                data={tutors}
                rowKey={(t) => t._id}
                resizable
                emptyState={
                    <EmptyState
                        icon={ShieldAlert}
                        title="No tutors found"
                    />
                }
            />

            {/* Add Tutor Dialog */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="sm:max-w-[450px] bg-card border border-border rounded-xl p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="p-6 pb-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-1.5 bg-primary rounded-none"></div>
                            <span className="text-xs font-label font-semibold uppercase tracking-wider text-primary">Admin Action</span>
                        </div>
                        <DialogTitle className="text-lg font-heading font-bold tracking-tight text-foreground">
                            Add Tutor
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground mt-1">
                            Upgrade an existing user to tutor role
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTutor} className="p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">
                                <Mail size={12} />
                                User Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                required
                                className="w-full px-4 py-3 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary transition-all font-heading font-bold placeholder:text-muted-foreground/40"
                            />
                            <p className="text-xs text-muted-foreground ml-1">
                                The user must already have an account. Their role will be upgraded to tutor.
                            </p>
                        </div>
                        <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => { setAddOpen(false); setEmail(''); }}
                                className="flex-1 h-10 rounded-lg text-muted-foreground hover:text-foreground border border-border hover:bg-muted text-xs font-label font-semibold uppercase tracking-wider transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={adding || !email.trim()}
                                className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-label font-semibold uppercase tracking-wider transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {adding ? 'Upgrading...' : 'Upgrade to Tutor'}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Profile Detail Dialog */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogContent className="sm:max-w-[560px] bg-card border border-border rounded-xl p-0 overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto">
                    {profileLoading ? (
                        <div className="p-12 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                        </div>
                    ) : profileTutor ? (
                        <>
                            <DialogHeader className="p-6 pb-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap size={14} className="text-primary" />
                                    <span className="text-xs font-label font-semibold uppercase tracking-wider text-primary">Tutor Profile</span>
                                </div>
                                <DialogTitle className="text-lg font-heading font-bold tracking-tight text-foreground uppercase">
                                    {profileTutor.displayName}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-1">
                                    {profileTutor.email}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="p-6 space-y-5">
                                {/* Avatar Card */}
                                <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border">
                                    <Avatar className="size-14 rounded-xl border border-border">
                                        <AvatarImage src={profileTutor.photoURL} alt={profileTutor.displayName} className="object-cover rounded-xl" />
                                        <AvatarFallback className="bg-muted rounded-xl text-base font-bold">
                                            {(profileTutor.displayName || 'T')[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-heading font-bold text-foreground truncate">{profileTutor.displayName}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Mail size={12} className="text-muted-foreground shrink-0" />
                                            <p className="text-xs text-muted-foreground truncate">{profileTutor.email}</p>
                                        </div>
                                        {profileTutor.mobileNumber && (
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Phone size={12} className="text-muted-foreground shrink-0" />
                                                <p className="text-xs text-muted-foreground">{profileTutor.mobileNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Verification Status Update */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-muted-foreground" />
                                        <label className="text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">Verification Status</label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {VERIFICATION_OPTIONS.map(opt => {
                                            const icons = {
                                                unverified: AlertCircle,
                                                pending_review: Clock,
                                                verified_basic: ShieldCheck,
                                                verified_premium: Award,
                                            };
                                            const Icon = icons[opt.value] || ShieldCheck;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    disabled={updatingVerification || profileTutor.verificationStatus === opt.value}
                                                    onClick={() => handleVerificationChange(profileTutor._id, opt.value)}
                                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-label font-semibold transition-all ${
                                                        profileTutor.verificationStatus === opt.value
                                                            ? `${opt.color} border-current ring-1 ring-current/20`
                                                            : 'bg-background border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                                                    } disabled:opacity-50 active:scale-[0.98]`}
                                                >
                                                    <Icon size={14} />
                                                    <span>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Shield, label: 'Role', value: profileTutor.role || 'Tutor' },
                                        { icon: Star, label: 'Rating', value: profileTutor.ratings?.average ? `${profileTutor.ratings.average.toFixed(1)} / 5` : 'No ratings' },
                                        { icon: Calendar, label: 'Member Since', value: profileTutor.createdAt ? new Date(profileTutor.createdAt).toLocaleDateString() : '—' },
                                        { icon: Clock, label: 'Last Active', value: profileTutor.lastActive ? new Date(profileTutor.lastActive).toLocaleDateString() : '—' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-3 bg-background rounded-xl border border-border">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <item.icon size={12} className="text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">{item.label}</span>
                                            </div>
                                            <p className="text-sm font-heading font-bold text-foreground capitalize">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Subjects */}
                                {profileTutor.subjects?.length > 0 && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={14} className="text-muted-foreground" />
                                            <label className="text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">Subjects</label>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {profileTutor.subjects.map((s, i) => (
                                                <span key={i} className="px-2.5 py-1 text-xs font-label font-semibold bg-muted rounded-lg border border-border">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Bio */}
                                {profileTutor.bio && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-muted-foreground" />
                                            <label className="text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">Bio</label>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed bg-background p-3 rounded-xl border border-border">{profileTutor.bio}</p>
                                    </div>
                                )}

                                {/* Education */}
                                {profileTutor.education?.length > 0 && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap size={14} className="text-muted-foreground" />
                                            <label className="text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">Education</label>
                                        </div>
                                        {profileTutor.education.map((edu, i) => (
                                            <div key={i} className="p-3 bg-background rounded-xl border border-border">
                                                <p className="text-sm font-heading font-bold text-foreground">{edu.degree}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{edu.institution}</p>
                                                {edu.year && <p className="text-xs text-muted-foreground mt-0.5">{edu.year}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="p-6 pt-0">
                                <button
                                    onClick={() => setProfileOpen(false)}
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

export default AdminTutors;
