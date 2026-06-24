import { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  Building2,
  Loader2,
  ExternalLink,
  Search,
  ShieldOff,
  ShieldCheck,
  Bell,
  Eye
} from "lucide-react";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AllOrganizations = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Notification modal
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/organizations/all", {
        params: { search, status: statusFilter, page, limit: 12 }
      });
      setOrgs(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrgs();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  const handleBan = async (orgId, orgName) => {
    if (!confirm(`Ban "${orgName}"? This will suspend all org activities.`)) return;
    try {
      await api.patch(`/api/v1/organizations/${orgId}/ban`, { reason: "Banned by admin" });
      toast.success(`${orgName} has been banned`);
      fetchOrgs();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to ban organization");
    }
  };

  const handleUnban = async (orgId, orgName) => {
    if (!confirm(`Unban "${orgName}"?`)) return;
    try {
      await api.patch(`/api/v1/organizations/${orgId}/unban`);
      toast.success(`${orgName} has been unbanned`);
      fetchOrgs();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to unban organization");
    }
  };

  const handleNotify = async () => {
    if (!selectedOrg || !notifyTitle || !notifyMessage) {
      toast.error("Please fill in title and message");
      return;
    }
    try {
      setNotifyLoading(true);
      await api.post(`/api/v1/organizations/${selectedOrg._id}/notify`, {
        title: notifyTitle,
        message: notifyMessage
      });
      toast.success(`Notification sent to ${selectedOrg.name} members`);
      setNotifyModalOpen(false);
      setSelectedOrg(null);
      setNotifyTitle("");
      setNotifyMessage("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send notification");
    } finally {
      setNotifyLoading(false);
    }
  };

  const statusColors = {
    active: "bg-green-500/10 text-green-600",
    suspended: "bg-yellow-500/10 text-yellow-600",
    pending_verification: "bg-blue-500/10 text-blue-600",
    banned: "bg-red-500/10 text-red-600"
  };

  if (loading && orgs.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-bold">Organizations</h2>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orgs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {["", "active", "suspended", "banned", "pending_verification"].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Organizations Grid */}
      {orgs.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No organizations found</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgs.map((org) => (
              <Card key={org._id} className="p-5 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {org.profile?.logo ? (
                      <img src={org.profile.logo} alt={org.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-heading font-bold text-sm">{org.name}</h3>
                      <p className="text-xs text-muted-foreground">/{org.slug}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-label font-semibold uppercase px-2 py-0.5 rounded ${statusColors[org.status] || "bg-muted text-muted-foreground"}`}>
                    {org.status?.replace("_", " ")}
                  </span>
                </div>
                {org.profile?.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {org.profile.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <Link
                    to={`/dashboard/org/${org._id}`}
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Manage
                  </Link>
                  <span className="text-muted-foreground">|</span>
                  {org.status === "banned" ? (
                    <button
                      onClick={() => handleUnban(org._id, org.name)}
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-700"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      Unban
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBan(org._id, org.name)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <ShieldOff className="h-3 w-3" />
                      Ban
                    </button>
                  )}
                  <span className="text-muted-foreground">|</span>
                  <button
                    onClick={() => { setSelectedOrg(org); setNotifyModalOpen(true); }}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <Bell className="h-3 w-3" />
                    Notify
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-sm"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-muted-foreground">
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
        </>
      )}

      {/* Notification Modal */}
      <Dialog open={notifyModalOpen} onOpenChange={setNotifyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification to {selectedOrg?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Notification title"
                value={notifyTitle}
                onChange={(e) => setNotifyTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background resize-none"
                rows={4}
                placeholder="Notification message..."
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyModalOpen(false)}>Cancel</Button>
            <Button onClick={handleNotify} disabled={notifyLoading}>
              {notifyLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Bell className="h-4 w-4 mr-1" />}
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllOrganizations;
