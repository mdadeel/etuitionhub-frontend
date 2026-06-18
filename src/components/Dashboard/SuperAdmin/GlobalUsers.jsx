import { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import { 
  Users, 
  Search, 
  Loader2,
  Shield,
  Mail,
  MapPin
} from "lucide-react";
import { Input } from "../../ui/input";
import DataTable from "@/components/ui/data-table";

const GlobalUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/users", {
        params: { search, page, limit: 10 }
      });
      setUsers(res.data.data || res.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-bold">Users</h2>
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

      <DataTable
        columns={[
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
                  <p className="font-medium text-sm">{u.displayName}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
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
                val === 'super_admin' ? 'bg-red-500/10 text-red-500' : 'bg-muted'
              }`}>
                {val || 'user'}
              </span>
            ),
          },
          {
            key: 'verificationStatus',
            label: 'Status',
            render: (val) => (
              <span className={`text-xs font-label font-semibold uppercase px-2 py-0.5 rounded ${
                val === 'verified_basic' || val === 'verified_premium'
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {val || 'unverified'}
              </span>
            ),
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
    </div>
  );
};

export default GlobalUsers;
