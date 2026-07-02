import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import { History, Search, Loader2, Filter } from "lucide-react";
import DataTable from "@/components/ui/data-table";
import { Input } from "../../ui/input";

const actions = [
  { value: "", label: "All Actions" },
  { value: "MEMBER_INVITED", label: "Member Invited" },
  { value: "MEMBER_REMOVED", label: "Member Removed" },
  { value: "MEMBER_SUSPENDED", label: "Member Suspended" },
  { value: "MEMBER_RESTORED", label: "Member Restored" },
  { value: "ROLE_CREATED", label: "Role Created" },
  { value: "ROLE_UPDATED", label: "Role Updated" },
  { value: "ROLE_DELETED", label: "Role Deleted" },
  { value: "OWNERSHIP_TRANSFERRED", label: "Ownership Transferred" },
  { value: "INVITE_ACCEPTED", label: "Invite Accepted" },
  { value: "JOIN_REQUESTED", label: "Join Requested" },
  { value: "JOIN_APPROVED", label: "Join Approved" },
  { value: "LEAVE_REQUESTED", label: "Leave Requested" },
  { value: "LEAVE_APPROVED", label: "Leave Approved" },
];

const OrgAuditLogs = () => {
  const { orgId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = { orgId, limit: 200 };
      if (actionFilter) params.action = actionFilter;
      if (search) params.userEmail = search;
      const res = await api.get("/api/audit-logs", { params });
      setLogs(res.data.logs || []);
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [orgId, actionFilter, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">Track all administrative actions in your organization</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
          >
            {actions.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: "action",
            label: "Action",
            render: (_, log) => {
              const found = actions.find((a) => a.value === log.action);
              return (
                <span className="text-xs font-label font-semibold uppercase px-2 py-0.5 rounded bg-muted">
                  {found?.label || log.action}
                </span>
              );
            },
          },
          {
            key: "userEmail",
            label: "User",
            render: (_, log) => (
              <div>
                <p className="text-sm font-medium text-foreground">{log.userEmail || "System"}</p>
                <p className="text-[10px] text-muted-foreground">{log.userRole || ""}</p>
              </div>
            ),
          },
          {
            key: "entityType",
            label: "Entity",
            render: (val) => (
              <span className="text-xs text-muted-foreground capitalize">{val || "-"}</span>
            ),
          },
          {
            key: "createdAt",
            label: "Date",
            render: (_, log) => (
              <span className="text-xs text-muted-foreground" title={new Date(log.createdAt).toLocaleString()}>
                {new Date(log.createdAt).toLocaleDateString()}
              </span>
            ),
          },
        ]}
        data={logs}
        emptyState={
          <div className="flex flex-col items-center py-12">
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No audit logs found</p>
          </div>
        }
        rowKey={(l) => l._id}
      />
    </div>
  );
};

export default OrgAuditLogs;
