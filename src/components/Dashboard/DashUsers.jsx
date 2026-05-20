// user management dashboard
import { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import useDebouncedValue from '../../hooks/useDebouncedValue';
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
    const debouncedSearch = useDebouncedValue(search, 300);

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
            const res = await api.get('/api/users', {
                params: { search: debouncedSearch },
            });
            setUsers(res.data?.data || res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filtered = useMemo(() => {
        let result = users;
        
        // Filter by role
        if (filter !== 'all') {
            result = result.filter(u => u.role === filter);
        }
        
        return result;
    }, [users, filter]);

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
        <div className="bg-transparent animate-in fade-in duration-500">
            <header className="mb-8 border-b border-[rgba(15,23,46,0.08)] pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-1.5 bg-[#2563EB] rounded-none"></div>
                        <span className="text-[9px] font-heading font-black uppercase tracking-[0.25em] text-[#2563EB]">User Directory</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight text-[#111827]">Users</h2>
                    <p className="text-xs text-[#5B6475] mt-1">
                        Total of {filtered.length} users found.
                    </p>
                </div>

                {/* Search Input */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6475]/60 group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-11 pr-4 py-3 text-xs bg-white border border-[rgba(15,23,46,0.12)] rounded-none w-full lg:w-72 focus:outline-none focus:border-[#2563EB] transition-all font-heading font-bold placeholder:text-[#5B6475]/40"
                    />
                </div>

                <div className="flex bg-[#F8FAFC] p-1.5 rounded-none gap-2 border border-[rgba(15,23,46,0.12)] w-fit backdrop-blur-md">
                    {['all', 'student', 'tutor', 'admin'].map(f => (
                        <button
                            key={f}
                            className={cn(
                                "px-5 py-2.5 text-[9px] font-heading font-black uppercase tracking-widest rounded-none border transition-all duration-300",
                                filter === f
                                    ? "bg-[#2563EB] border-[#2563EB] text-white"
                                    : "text-[#5B6475] border-transparent hover:text-[#111827] hover:bg-[#EEF2F6]"
                            )}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto border border-[rgba(15,23,46,0.12)] bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#F8FAFC] border-b border-[rgba(15,23,46,0.08)] text-[#5B6475]">
                            <th className="px-4 md:px-6 py-4 text-[9px] font-heading font-black uppercase tracking-widest text-[#5B6475]/60">User</th>
                            <th className="hidden md:table-cell px-6 py-4 text-[9px] font-heading font-black uppercase tracking-widest text-[#5B6475]/60">Email</th>
                            <th className="hidden lg:table-cell px-6 py-4 text-[9px] font-heading font-black uppercase tracking-widest text-[#5B6475]/60">Verification Status</th>
                            <th className="px-4 md:px-6 py-4 text-[9px] font-heading font-black uppercase tracking-widest text-[#5B6475]/60">Role</th>
                            <th className="px-4 md:px-6 py-4 text-[9px] font-heading font-black uppercase tracking-widest text-[#5B6475]/60 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(15,23,46,0.06)]">
                        {filtered.map((user) => (
                            <tr key={user._id} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-4 md:px-6 py-4">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <Avatar className="h-9 w-9 rounded-none border border-[rgba(15,23,46,0.12)] shadow-none">
                                            <AvatarImage src={user.photoURL} className="object-cover rounded-none" />
                                            <AvatarFallback className="bg-slate-900 border border-slate-800 rounded-none animate-none" />
                                        </Avatar>
                                        <div>
                                            <p className="text-xs md:text-sm font-bold text-[#111827] leading-tight">{user.displayName}</p>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className={cn("w-1.5 h-1.5 rounded-none", user.isVerified ? "bg-[#2563EB] animate-pulse" : "bg-[#5B6475]/30")}></div>
                                                <span className="text-[8px] md:text-[9px] font-heading font-black uppercase tracking-widest text-[#5B6475]/60 mt-0.5">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4">
                                    <p className="text-xs font-medium text-[#5B6475] lowercase tracking-tight">{user.email}</p>
                                </td>
                                <td className="hidden lg:table-cell px-6 py-4">
                                    <div className="flex flex-col gap-2">
                                        {user.verificationStatus === 'verified_premium' ? (
                                            <span className="px-2.5 py-1 text-[9px] font-heading font-black uppercase tracking-widest rounded-none bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 w-fit">Premium</span>
                                        ) : user.verificationStatus === 'verified_basic' ? (
                                            <span className="px-2.5 py-1 text-[9px] font-heading font-black uppercase tracking-widest rounded-none bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 w-fit">Basic</span>
                                        ) : user.verificationStatus === 'pending_review' ? (
                                            <span className="px-2.5 py-1 text-[9px] font-heading font-black uppercase tracking-widest rounded-none bg-amber-500/10 text-amber-700 border-amber-500/20 w-fit">Review</span>
                                        ) : (
                                            <span className="px-2.5 py-1 text-[9px] font-heading font-black uppercase tracking-widest rounded-none bg-[#EEF2F6] text-[#5B6475]/40 border border-transparent w-fit">None</span>
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
                                <td className="px-4 md:px-6 py-4">
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
                                <td className="px-4 md:px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <AppleButton
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-[#5B6475]/60 hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-none border border-transparent hover:border-[#2563EB]/20"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <Edit2 size={12} />
                                        </AppleButton>
                                        <AppleButton
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-[#5B6475]/60 hover:text-red-600 hover:bg-red-600/10 rounded-none border border-transparent hover:border-red-200"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <UserX size={14} />
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
