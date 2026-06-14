import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { AppleButton, AppleBadge } from '../shared/AppleUI';
import { Plus, UserX, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
 
const AdminTutors = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addOpen, setAddOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [adding, setAdding] = useState(false);
 
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
 
    if (loading) return <LoadingSpinner />;
 
    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between mb-4 border-b border-border pb-3">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-1.5 bg-primary rounded-lg"></div>
                        <span className="text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Tutor Management</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-heading font-bold uppercase tracking-tight text-foreground">All Tutors</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{tutors.length} registered tutors</p>
                </div>
                <AppleButton size="sm" onClick={() => setAddOpen(true)}>
                    <Plus size={12} />
                    Add Tutor
                </AppleButton>
            </header>
 
            <div className="overflow-x-auto border border-border bg-card">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/30 border-b border-border text-foreground">
                            <th className="px-4 md:px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Tutor</th>
                            <th className="hidden md:table-cell px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                            <th className="hidden md:table-cell px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Subjects</th>
                            <th className="px-4 md:px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground text-center">Verification</th>
                            <th className="px-4 md:px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground text-center">Status</th>
                            <th className="px-4 md:px-5 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {tutors.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-16 text-center bg-muted/20">
                                    <div className="flex flex-col items-center gap-3">
                                        <ShieldAlert size={40} className="text-muted-foreground" strokeWidth={1} />
                                        <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">No tutors found</p>
                                        <AppleButton size="sm" variant="secondary" onClick={() => setAddOpen(true)}>
                                            Add your first tutor
                                        </AppleButton>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            tutors.map((t) => (
                                <tr key={t._id} className="hover:bg-muted/30 hover:text-foreground transition-colors">
                                    <td className="px-4 md:px-5 py-3">
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
                                    </td>
                                    <td className="hidden md:table-cell px-5 py-3">
                                        <span className="text-xs text-muted-foreground">{t.email}</span>
                                    </td>
                                    <td className="hidden md:table-cell px-5 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {(t.subjects || []).length > 0
                                                ? t.subjects.slice(0, 3).map((s, i) => (
                                                    <span key={i} className="px-1.5 py-0.5 text-[8px] font-label font-semibold uppercase tracking-wider bg-muted rounded-md border border-border">{s}</span>
                                                ))
                                                : <span className="text-[9px] text-muted-foreground italic">—</span>
                                            }
                                            {(t.subjects || []).length > 3 && (
                                                <span className="text-[8px] text-muted-foreground">+{t.subjects.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 text-center">
                                        <AppleBadge 
                                            variant={
                                                t.verificationStatus === 'verified_premium' ? 'success' :
                                                t.verificationStatus === 'verified_basic' ? 'primary' :
                                                t.verificationStatus === 'pending_review' ? 'warning' :
                                                'default'
                                            }
                                            className="rounded-lg"
                                        >
                                            {t.verificationStatus === 'verified_premium' ? 'Premium' :
                                             t.verificationStatus === 'verified_basic' ? 'Basic' :
                                             t.verificationStatus?.replace('_', ' ') || 'Unverified'}
                                        </AppleBadge>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 text-center">
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
                                    </td>
                                    <td className="px-4 md:px-5 py-3 text-right">
                                        <div className="flex justify-end gap-2 items-center">
                                            <button
                                                onClick={() => handleRemoveTutor(t._id)}
                                                className="size-7 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 flex items-center justify-center transition-colors active:scale-[0.98]"
                                                title="Downgrade to student"
                                            >
                                                <UserX size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="sm:max-w-[450px] bg-card border border-border rounded-xl p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="p-8 pb-0">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-1.5 bg-primary rounded-none"></div>
                            <span className="text-[9px] font-label font-semibold uppercase tracking-[0.25em] text-primary">Admin Action</span>
                        </div>
                        <DialogTitle className="text-lg font-heading font-bold tracking-tight text-foreground uppercase">
                            Add Tutor
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            Upgrade an existing user to tutor role
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTutor} className="p-8 space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                User Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                required
                                className="w-full px-4 py-3 text-xs bg-card border border-border rounded-lg focus:outline-none focus:border-primary transition-all font-heading font-bold placeholder:text-muted-foreground/40"
                            />
                            <p className="text-[8px] text-muted-foreground mt-1 ml-1">
                                The user must already have an account. Their role will be upgraded to tutor.
                            </p>
                        </div>
                        <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => { setAddOpen(false); setEmail(''); }}
                                className="flex-1 h-10 rounded-lg text-muted-foreground hover:text-foreground border border-border hover:bg-muted text-[9px] font-label font-semibold uppercase tracking-widest transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={adding || !email.trim()}
                                className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-[9px] font-label font-semibold uppercase tracking-widest transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {adding ? 'Upgrading...' : 'Upgrade to Tutor'}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminTutors;
