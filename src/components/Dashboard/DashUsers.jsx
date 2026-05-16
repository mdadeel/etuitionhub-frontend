// user management dashboard
import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { AppleButton } from '../shared/AppleUI';
import { UserX, Edit2, ShieldAlert, UserCog, Search } from 'lucide-react';
import FilterSelect from '../shared/FilterSelect';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditModal from './EditModal';

const DashUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const userFields = [
        { name: 'displayName', label: 'Full Name', placeholder: 'e.g. Rahim Khan' },
        { name: 'mobileNumber', label: 'Mobile Number', placeholder: 'e.g. 01700000000' },
        { name: 'photoURL', label: 'Photo URL', placeholder: 'https://...' }
    ];

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/users');
            setUsers(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filtered = useMemo(() => {
        let result = users;
        
        // Filter by role
        if (filter !== 'all') {
            result = result.filter(u => u.role === filter);
        }
        
        // Filter by search
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            result = result.filter(u => 
                u.displayName?.toLowerCase().includes(searchLower) ||
                u.email?.toLowerCase().includes(searchLower) ||
                u.mobileNumber?.toLowerCase().includes(searchLower)
            );
        }
        
        return result;
    }, [users, filter, search]);

    const handleDelete = async (id) => {
        if (!confirm('Delete this user? This action cannot be undone.')) return;

        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Demo data is read-only');
            return;
        }

        try {
            await api.delete(`/api/users/${id}`);
            toast.success('User deleted');
            await loadUsers();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete user');
        }
    };

    const handleRoleChange = async (id, role) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Demo data is read-only');
            return;
        }

        try {
            await api.patch(`/api/users/${id}`, { role });
            toast.success(`Role updated to ${role}`);
            await loadUsers();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update role');
        }
    };

    const handleVerificationChange = async (id, status) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Demo data is read-only');
            return;
        }

        const isVerified = ['verified_basic', 'verified_premium'].includes(status);
        
        try {
            await api.patch(`/api/users/${id}`, { verificationStatus: status, isVerified });
            toast.success(`Verification updated to ${status}`);
            await loadUsers();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update verification');
        }
    };

    const handleEditClick = (user) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(user._id)) {
            toast.error('Demo data is read-only');
            return;
        }
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditSave = async (updatedData) => {
        setIsSaving(true);
        try {
            await api.patch(`/api/users/${selectedUser._id}`, updatedData);
            toast.success('User updated successfully');
            setIsEditModalOpen(false);
            await loadUsers();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update user');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-transparent">
            <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Identity Directory</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight">User Manifest</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                        Total of {filtered.length} active nodes identified.
                    </p>
                </div>

                {/* Search Input */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-11 pr-4 py-3 text-sm bg-muted/30 border border-border/60 rounded-2xl w-full lg:w-72 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20 transition-all placeholder:text-muted-foreground/40"
                    />
                </div>

                <div className="flex bg-muted/40 p-1 rounded-2xl gap-1 border border-border/60 w-fit backdrop-blur-md">
                    {['all', 'student', 'tutor', 'admin'].map(f => (
                        <button
                            key={f}
                            className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${filter === f
                                ? 'bg-card text-blue-600 shadow-sm border border-border/60'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                        <tr className="text-muted-foreground/40">
                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Node</th>
                            <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Metadata</th>
                            <th className="hidden lg:table-cell px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Trust Tier</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Auth</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((user) => (
                            <tr key={user._id} className="group">
                                <td className="px-4 md:px-6 py-4 md:py-5 bg-card border-y border-l border-border/60 first:rounded-l-2xl group-hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <Avatar className="h-8 w-8 md:h-10 md:w-10 rounded-xl border border-border/60 shadow-sm transition-transform group-hover:scale-105">
                                            <AvatarImage src={user.photoURL} className="object-cover" />
                                            <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground/60">
                                                {user.displayName?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-xs md:text-sm font-bold text-foreground leading-tight">{user.displayName}</p>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-blue-600 animate-pulse' : 'bg-muted-foreground/30'}`}></div>
                                                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-5 bg-card border-y border-border/60 group-hover:bg-muted/30 transition-colors">
                                    <p className="text-xs font-bold text-muted-foreground/60 lowercase italic tracking-tight">{user.email}</p>
                                </td>
                                <td className="hidden lg:table-cell px-6 py-5 bg-card border-y border-border/60 group-hover:bg-muted/30 transition-colors">
                                    <div className="flex flex-col gap-2">
                                        {user.verificationStatus === 'verified_premium' ? (
                                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full bg-blue-600/10 text-blue-600 border border-blue-500/20 w-fit">Premium</span>
                                        ) : user.verificationStatus === 'verified_basic' ? (
                                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full bg-muted text-muted-foreground/60 border border-border/60 w-fit">Basic</span>
                                        ) : user.verificationStatus === 'pending_review' ? (
                                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full bg-amber-600/10 text-amber-600 border border-amber-500/20 w-fit">Review</span>
                                        ) : (
                                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full bg-muted text-muted-foreground/30 border border-border/60 w-fit opacity-60">None</span>
                                        )}
                                        
                                        {user.role === 'tutor' && (
                                            <div className="w-32">
                                                <FilterSelect
                                                    value={user.verificationStatus || 'unverified'}
                                                    onValueChange={(status) => handleVerificationChange(user._id, status)}
                                                    icon={ShieldAlert}
                                                    options={[
                                                        { value: 'unverified', label: 'Unverified' },
                                                        { value: 'pending_review', label: 'Pending' },
                                                        { value: 'verified_basic', label: 'Basic' },
                                                        { value: 'verified_premium', label: 'Premium' },
                                                    ]}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-4 md:py-5 bg-card border-y border-border/60 group-hover:bg-muted/30 transition-colors">
                                    <div className="w-24 md:w-36">
                                        <FilterSelect
                                            value={user.role}
                                            onValueChange={(role) => handleRoleChange(user._id, role)}
                                            icon={UserCog}
                                            options={[
                                                { value: 'student', label: 'Student' },
                                                { value: 'tutor', label: 'Tutor' },
                                                { value: 'admin', label: 'Admin' },
                                            ]}
                                        />
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-4 md:py-5 bg-card border-y border-r border-border/60 last:rounded-r-2xl text-right group-hover:bg-muted/30 transition-colors">
                                    <div className="flex justify-end gap-2">
                                        <AppleButton
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0 text-muted-foreground/60 hover:text-blue-600 hover:bg-blue-600/10"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <Edit2 size={14} />
                                        </AppleButton>
                                        <AppleButton
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0 text-muted-foreground/60 hover:text-red-600 hover:bg-red-600/10"
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
