// user management dashboard
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { AppleBadge, AppleButton } from '../shared/AppleUI';
import { ShieldCheck, UserX, ChevronDown, Edit2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditModal from './EditModal';

const DashUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const userFields = [
        { name: 'displayName', label: 'Full Name', placeholder: 'e.g. Rahim Khan' },
        { name: 'mobileNumber', label: 'Mobile Number', placeholder: 'e.g. 01700000000' },
        { name: 'photoURL', label: 'Photo URL', placeholder: 'https://...' }
    ];

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await api.get('/api/users');
                setUsers(res.data);
            } catch (err) {
                toast.error(err.response?.data?.error || 'System access failed');
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const filtered = useMemo(() => {
        if (filter === 'all') return users;
        return users.filter(u => u.role === filter);
    }, [users, filter]);

    const handleDelete = async (id) => {
        if (!confirm('Permanently remove this identity from the infrastructure?')) return;

        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Identity Integrity: Demo data is read-only');
            return;
        }

        const backup = [...users];
        setUsers(prev => prev.filter(u => u._id !== id));

        try {
            await api.delete(`/api/users/${id}`);
            toast.success('Identity expunged.');
        } catch (err) {
            setUsers(backup);
            toast.error('Operation failed.');
        }
    };

    const handleRoleChange = async (id, role) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Identity Integrity: Demo data is read-only');
            return;
        }

        const backup = [...users];
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));

        try {
            await api.patch(`/api/users/${id}`, { role });
            toast.success(`Identity reclassified as ${role}.`);
        } catch (err) {
            setUsers(backup);
            toast.error('Operation failed.');
        }
    };

    const handleVerificationChange = async (id, status) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Identity Integrity: Demo data is read-only');
            return;
        }

        const backup = [...users];
        // Sync legacy isVerified for backward compatibility
        const isVerified = ['verified_basic', 'verified_premium'].includes(status);
        
        setUsers(prev => prev.map(u => u._id === id ? { ...u, verificationStatus: status, isVerified } : u));

        try {
            await api.patch(`/api/users/${id}`, { verificationStatus: status, isVerified });
            toast.success(`Verification state updated to ${status}.`);
        } catch (err) {
            setUsers(backup);
            toast.error('Operation failed.');
        }
    };

    const handleEditClick = (user) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(user._id)) {
            toast.error('Identity Integrity: Demo data is read-only');
            return;
        }
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditSave = async (updatedData) => {
        setIsSaving(true);
        try {
            const res = await api.patch(`/api/users/${selectedUser._id}`, updatedData);
            setUsers(prev => prev.map(u => u._id === selectedUser._id ? res.data : u));
            toast.success('Identity metadata corrected.');
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error('Failed to update identity.');
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
                        Identity Manifest
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {users.length} registered system nodes
                    </p>
                </div>

                <div className="flex bg-muted/50 p-1 rounded-2xl gap-1 border border-border/50 w-fit backdrop-blur-md">
                    {['all', 'student', 'tutor', 'admin'].map(f => (
                        <button
                            key={f}
                            className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${filter === f
                                ? 'bg-background text-primary shadow-apple-sm ring-1 ring-border/50'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'Universal' : f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-muted-foreground">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Node Profile</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Metadata</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Trust Tier</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Permission</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((user) => (
                            <tr key={user._id} className="group">
                                <td className="px-6 py-4 bg-muted/20 border-y border-l border-border/50 first:rounded-l-2xl">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 rounded-xl border border-border shadow-sm">
                                            <AvatarImage src={user.photoURL} className="object-cover" />
                                            <AvatarFallback className="text-[10px] font-bold bg-background text-muted-foreground">
                                                {user.displayName?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-foreground leading-tight">{user.displayName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'}`}></div>
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 bg-muted/20 border-y border-border/50">
                                    <p className="text-xs font-bold text-muted-foreground lowercase italic opacity-60 tracking-tight">{user.email}</p>
                                </td>
                                <td className="px-6 py-4 bg-muted/20 border-y border-border/50">
                                    <div className="flex flex-col gap-2">
                                        {user.verificationStatus === 'verified_premium' ? (
                                            <AppleBadge variant="success" className="w-fit scale-90">Premium</AppleBadge>
                                        ) : user.verificationStatus === 'verified_basic' ? (
                                            <AppleBadge variant="primary" className="w-fit scale-90">Basic</AppleBadge>
                                        ) : user.verificationStatus === 'pending_review' ? (
                                            <AppleBadge variant="warning" className="w-fit scale-90">Review</AppleBadge>
                                        ) : (
                                            <AppleBadge variant="default" className="w-fit scale-90 opacity-40">None</AppleBadge>
                                        )}
                                        
                                        {user.role === 'tutor' && (
                                            <div className="relative group/v-select">
                                                <select
                                                    className="bg-background/30 border border-border/30 text-[8px] font-bold uppercase tracking-widest pl-2 pr-6 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer hover:bg-background/50 transition-all appearance-none"
                                                    value={user.verificationStatus || 'unverified'}
                                                    onChange={(e) => handleVerificationChange(user._id, e.target.value)}
                                                >
                                                    <option value="unverified">Unverified</option>
                                                    <option value="pending_review">Pending</option>
                                                    <option value="verified_basic">Basic</option>
                                                    <option value="verified_premium">Premium</option>
                                                </select>
                                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-muted-foreground pointer-events-none" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 bg-muted/20 border-y border-border/50">
                                    <div className="relative w-fit group/select">
                                        <select
                                            className="bg-background/50 border border-border/50 text-[10px] font-bold uppercase tracking-widest pl-4 pr-10 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-background transition-all appearance-none"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        >
                                            <option value="student">Student</option>
                                            <option value="tutor">Tutor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none transition-transform group-hover/select:translate-y-[-40%]" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 bg-muted/20 border-y border-r border-border/50 last:rounded-r-2xl text-right">
                                    <div className="flex justify-end gap-2">
                                        <AppleButton
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0 text-muted-foreground hover:text-primary hover:bg-primary/5"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <Edit2 size={14} />
                                        </AppleButton>
                                        <AppleButton
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <UserX size={16} />
                                        </AppleButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EditModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Identity Profile"
                data={selectedUser}
                fields={userFields}
                onSave={handleEditSave}
                isLoading={isSaving}
            />
        </div>
    );
};

export default DashUsers;
