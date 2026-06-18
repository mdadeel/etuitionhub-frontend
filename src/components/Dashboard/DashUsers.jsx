// user management dashboard
import { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/skeletons";
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { Button } from '@/components/ui/button';
import { UserX, Edit2, ShieldAlert, UserCog, Search } from 'lucide-react';
import FilterSelect from '../shared/FilterSelect';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DataTable from "@/components/ui/data-table";
import EditModal from './EditModal';
import Pagination from '../shared/Pagination';
import StatusBadge from '../shared/StatusBadge';
import DashboardPageHeader from '../shared/DashboardPageHeader';

const DashUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const debouncedSearch = useDebouncedValue(search, 300);

    // Reset page when search or filter changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filter]);

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
                params: { 
                    search: debouncedSearch,
                    page: page,
                    // If filter is specific, we should ideally pass it to backend. 
                    // But for now, we'll fetch paginated data.
                },
            });
            setUsers(res.data?.data || res.data || []);
            if (res.data?.pagination) {
                setTotalPages(res.data.pagination.pages);
                setTotalUsers(res.data.pagination.total);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, page]);

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

    if (loading) {
      return (
        <div className="space-y-6">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64 rounded-xl" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <TableSkeleton rows={8} columns={5} hasAvatar />
        </div>
      );
    }

    return (
        <div className="bg-transparent">
            <DashboardPageHeader
                category="User Directory"
                title="Users"
                subtitle={`Total of ${totalUsers || filtered.length} users found.`}
                action={
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-11 pr-4 py-3 text-xs bg-card border border-border rounded-lg w-full lg:w-72 focus:outline-none focus:border-primary transition-all font-semibold placeholder:text-muted-foreground/40"
                        />
                    </div>
                }
            />

            <DataTable
                rowKey={(user) => user._id}
                data={filtered}
                columns={[
                    {
                        key: 'displayName',
                        label: 'User',
                        render: (_, user) => (
                            <div className="flex items-center gap-3 md:gap-4">
                                <Avatar className="size-9 rounded-lg border border-border shadow-none">
                                    <AvatarImage src={user.photoURL} alt={user.displayName} gender={user.gender} className="object-cover rounded-lg" />
                                    <AvatarFallback className="bg-slate-900 border border-slate-800 rounded-lg animate-none" />
                                </Avatar>
                                <div>
                                    <p className="text-xs md:text-sm font-bold text-foreground leading-tight">{user.displayName}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className={cn("size-1.5 rounded-lg", user.isVerified ? "bg-primary animate-pulse" : "bg-[#5B6475]/30")}></div>
                                        <span className="text-[8px] md:text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: 'email',
                        label: 'Email',
                        hideOn: 'md',
                        render: (_, user) => (
                            <p className="text-xs font-medium text-muted-foreground lowercase tracking-tight">{user.email}</p>
                        ),
                    },
                    {
                        key: 'verificationStatus',
                        label: 'Verification Status',
                        hideOn: 'lg',
                        render: (_, user) => (
                            <div className="flex flex-col gap-2">
                                <StatusBadge status={user.verificationStatus || 'unverified'} />

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
                        ),
                    },
                    {
                        key: 'role',
                        label: 'Role',
                        render: (_, user) => (
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
                        ),
                    },
                    {
                        key: '_id',
                        label: 'Actions',
                        align: 'right',
                        render: (_, user) => (
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-8 p-0 text-muted-foreground/60 hover:text-primary hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/20 active:scale-[0.98]"
                                    onClick={() => handleEditClick(user)}
                                >
                                    <Edit2 size={12} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-8 p-0 text-muted-foreground/60 hover:text-red-600 hover:bg-red-600/10 rounded-lg border border-transparent hover:border-red-200 active:scale-[0.98]"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    <UserX size={14} />
                                </Button>
                            </div>
                        ),
                    },
                ]}
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
