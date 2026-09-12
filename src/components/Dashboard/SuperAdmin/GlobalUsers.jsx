import { useState, useEffect } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import api from "../../../services/api";
import toast from "react-hot-toast";
import {
  Users,
  Search,
  Loader2,
  AlertOctagon,
  Globe,
  Building2,
  ShieldPlus,
  ShieldMinus,
  Crown,
  Eye,
} from "lucide-react";
import { Input } from "../../ui/input";
import DataTable from "@/components/ui/data-table";
import ModerationModal from "../ModerationModal";
import BulkActionBar from "./BulkActionBar";
import { useAuth } from "../../../contexts/AuthContext";

const ACCOUNT_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Public', value: 'public' },
  { label: 'Org Member', value: 'org' },
];

const GLOBAL_FILTERS = [
  { label: 'All Roles', value: 'all' },
  { label: 'Admins', value: 'super_admin' },
  { label: 'Users', value: 'user' },
];

const GlobalUsers = () => {
  const { dbUser } = useAuth();
  const selfId = dbUser?._id?.toString();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState('all');
  const [globalFilter, setGlobalFilter] = useState('all');
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading: loading, isError } = useQuery({
    queryKey: ['admin', 'users', { search: debouncedSearch, page, accountFilter, globalFilter }],
    queryFn: async ({ signal }) => {
      const params = { search: debouncedSearch, page, limit: 10 };
      if (accountFilter !== 'all') params.accountType = accountFilter;
      if (globalFilter !== 'all') params.globalRole = globalFilter;
      const res = await api.get("/api/users", { params, signal });
      return {
        users: res.data.data || res.data || [],
        totalPages: res.data.pagination?.pages || 1,
        total: res.data.pagination?.total || 0,
      };
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  useEffect(() => {
    if (isError) toast.error("Failed to load users");
  }, [isError]);

  const refreshUsers = () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });

  const [showModerationModal, setShowModerationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) setSelectedIds([]);
    else setSelectedIds(users.map((u) => u._id));
  };

  const handlePromote = async (user) => {
    if (!window.confirm(`Promote ${user.displayName} (${user.email}) to Super Admin? They will gain full platform access.`)) return;
    setActionLoading(user._id);
    try {
      await api.patch(`/api/admin/promote-to-admin/${user._id}`);
      toast.success(`${user.displayName} is now Super Admin`);
      refreshUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Promote failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (user) => {
    if (user._id?.toString() === selfId) {
      toast.error("You cannot demote yourself");
      return;
    }
    if (!window.confirm(`Remove Super Admin from ${user.displayName} (${user.email})? They will revert to student.`)) return;
    setActionLoading(user._id);
    try {
      await api.patch(`/api/admin/demote-from-admin/${user._id}`);
      toast.success(`${user.displayName} demoted to user`);
      refreshUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Demote failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleImpersonate = async (u) => {
    if (!window.confirm(`Shadow Login as ${u.displayName} (${u.email})? You will navigate the platform from their perspective.`)) return;
    setActionLoading(u._id);
    try {
      const res = await api.post(`/api/admin/impersonate/${u._id}`);
      localStorage.setItem('impersonator-session', JSON.stringify({
        adminToken: localStorage.getItem('token'),
        targetEmail: u.email,
        targetName: u.displayName,
        targetRole: u.role,
        startedAt: new Date().toISOString()
      }));
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      toast.success(`Now viewing platform as ${u.displayName}`);
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error(err.response?.data?.error || "Impersonation failed");
      setActionLoading(null);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-heading font-bold flex items-center gap-2">
          Users
          {total > 0 && <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{total} total</span>}
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users (server-side)..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 w-64"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {ACCOUNT_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setAccountFilter(f.value); setPage(1); setSelectedIds([]); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              accountFilter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.value === 'public' && <Globe className="inline size-3 mr-1" />}
            {f.value === 'org' && <Building2 className="inline size-3 mr-1" />}
            {f.label}
          </button>
        ))}
        <span className="w-px h-6 bg-border mx-1 self-center" />
        {GLOBAL_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setGlobalFilter(f.value); setPage(1); setSelectedIds([]); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              globalFilter === f.value
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.value === 'super_admin' && <Crown className="size-3" />}
            {f.label}
          </button>
        ))}
      </div>

      <BulkActionBar
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
        onAction={refreshUsers}
        total={total}
      />

      <DataTable
        columns={[
          {
            key: 'select',
            label: (
              <input
                type="checkbox"
                checked={users.length > 0 && selectedIds.length === users.length}
                onChange={toggleSelectAll}
                className="rounded border-border"
              />
            ),
            render: (_, u) => (
              <input
                type="checkbox"
                checked={selectedIds.includes(u._id)}
                onChange={() => toggleSelect(u._id)}
                className="rounded border-border"
              />
            ),
          },
          {
            key: 'user',
            label: 'User',
            render: (_, u) => (
              <div className="flex items-center gap-3">
                {u.photoURL ? (
                  <img src={u.photoURL} alt="" className="h-8 w-8 rounded object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
                    {u.displayName?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm flex items-center gap-1">
                    {u.displayName}
                    {u.globalRole === 'super_admin' && <Crown className="size-3 text-destructive" />}
                  </p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'primaryOrgId',
            label: 'Account',
            render: (val) => (
              <span className={`text-xs font-label font-semibold uppercase px-2 py-0.5 rounded ${
                val ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {val ? 'Org' : 'Public'}
              </span>
            ),
          },
          {
            key: 'role',
            label: 'Role',
            render: (val) => (
              <span className="text-xs font-label font-semibold uppercase px-2 py-0.5 rounded bg-muted">
                {val}
              </span>
            ),
          },
          {
            key: 'globalRole',
            label: 'Global',
            render: (val) => (
              <span className={`text-xs font-label font-semibold uppercase px-2 py-0.5 rounded ${
                val === 'super_admin' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-muted text-muted-foreground'
              }`}>
                {val || 'user'}
              </span>
            ),
          },
          {
            key: 'verificationStatus',
            label: 'Status',
            render: (val) => {
              let color = 'bg-warning/10 text-warning border border-warning/20';
              if (val === 'verified_basic' || val === 'verified_premium') color = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
              else if (val === 'banned') color = 'bg-destructive/10 text-destructive border border-destructive/20';
              else if (val === 'suspended') color = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';

              return (
                <span className={`text-xs font-label font-semibold uppercase px-2 py-0.5 rounded ${color}`}>
                  {val || 'unverified'}
                </span>
              );
            },
          },
          {
            key: '_id',
            label: 'Actions',
            align: 'right',
            render: (_, u) => {
              const isSelf = u._id?.toString() === selfId;
              const isAdmin = u.globalRole === 'super_admin';
              const busy = actionLoading === u._id;
              return (
                <div className="flex items-center justify-end gap-1">
                  {isAdmin ? (
                    <button
                      onClick={() => handleDemote(u)}
                      disabled={busy || isSelf}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      title={isSelf ? "Cannot demote yourself" : "Remove Super Admin"}
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldMinus className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePromote(u)}
                      disabled={busy}
                      className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-40"
                      title="Promote to Super Admin"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldPlus className="w-4 h-4" />}
                    </button>
                  )}
                  {!isAdmin && !isSelf && (
                    <button
                      onClick={() => handleImpersonate(u)}
                      disabled={busy}
                      className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors disabled:opacity-40"
                      title="Shadow Login (View as user)"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setShowModerationModal(true);
                    }}
                    className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
                    title="Moderate User"
                  >
                    <AlertOctagon className="w-4 h-4" />
                  </button>
                </div>
              );
            },
          },
        ]}
        data={users}
        rowKey={(u) => u._id}
        emptyState={
          <div className="flex flex-col items-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        }
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-sm"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-muted-foreground flex items-center">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      )}

      {selectedUser && (
        <ModerationModal
          open={showModerationModal}
          onOpenChange={(open) => {
            setShowModerationModal(open);
            if (!open) setSelectedUser(null);
          }}
          targetUser={selectedUser}
          onModerationComplete={refreshUsers}
        />
      )}
    </div>
  );
};

export default GlobalUsers;
