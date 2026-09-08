import { useState, useEffect, useCallback } from "react";
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
  PauseCircle,
  PlayCircle,
  Info,
  Calendar,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Users
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

  // Suspend modal
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendingOrg, setSuspendingOrg] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendLoading, setSuspendLoading] = useState(false);

  // Details modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsOrg, setDetailsOrg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrgs = useCallback(async () => {
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
  }, [search, statusFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchOrgs, 500);
    return () => clearTimeout(timer);
  }, [fetchOrgs]);

  const handleOpenSuspend = (org) => {
    setSuspendingOrg(org);
    setSuspendReason("");
    setSuspendModalOpen(true);
  };

  const handleConfirmSuspend = async () => {
    if (!suspendingOrg) return;
    try {
      setSuspendLoading(true);
      const res = await api.patch(`/api/v1/organizations/${suspendingOrg._id}/suspend`, {
        reason: suspendReason.trim() || "Suspended by platform administration"
      });
      toast.success(`${suspendingOrg.name} has been suspended`);
      setSuspendModalOpen(false);
      setSuspendingOrg(null);
      setSuspendReason("");
      if (detailsOrg && detailsOrg._id === suspendingOrg._id) {
        setDetailsOrg(res.data.data);
      }
      fetchOrgs();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to suspend organization");
    } finally {
      setSuspendLoading(false);
    }
  };

  const handleActivate = async (orgId, orgName) => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/api/v1/organizations/${orgId}/activate`);
      toast.success(`${orgName} has been activated`);
      if (detailsOrg && detailsOrg._id === orgId) {
        setDetailsOrg(res.data.data);
      }
      fetchOrgs();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to activate organization");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBan = async (orgId, orgName) => {
    const reason = prompt(`Ban "${orgName}"? Enter ban reason (all activities will be frozen):`);
    if (reason === null) return;
    try {
      setActionLoading(true);
      const res = await api.patch(`/api/v1/organizations/${orgId}/ban`, {
        reason: reason.trim() || "Banned by platform administration"
      });
      toast.success(`${orgName} has been banned`);
      if (detailsOrg && detailsOrg._id === orgId) {
        setDetailsOrg(res.data.data);
      }
      fetchOrgs();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to ban organization");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async (orgId, orgName) => {
    if (!confirm(`Unban "${orgName}" and restore to active status?`)) return;
    try {
      setActionLoading(true);
      const res = await api.patch(`/api/v1/organizations/${orgId}/unban`);
      toast.success(`${orgName} has been unbanned and restored`);
      if (detailsOrg && detailsOrg._id === orgId) {
        setDetailsOrg(res.data.data);
      }
      fetchOrgs();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to unban organization");
    } finally {
      setActionLoading(false);
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

  const handleOpenDetails = (org) => {
    setDetailsOrg(org);
    setDetailsModalOpen(true);
  };

  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    suspended: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    pending_verification: "bg-primary/10 text-primary border border-primary/20",
    banned: "bg-rose-500/10 text-rose-600 border border-rose-500/20"
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
        <div>
          <h2 className="text-lg font-heading font-bold">Organizations</h2>
          <p className="text-xs text-muted-foreground">
            Manage organization workspaces, status suspension, and member access.
          </p>
        </div>
        <Link to="/super-admin/org-requests">
          <Button size="sm" className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            Org Requests
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orgs by name or slug..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["", "active", "suspended", "banned", "pending_verification"].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status ? status.replace("_", " ") : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Organizations Grid */}
      {orgs.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground text-sm">No organizations found</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgs.map((org) => (
              <Card key={org._id} className="p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {org.profile?.logo ? (
                        <img src={org.profile.logo} alt={org.name} className="h-10 w-10 rounded-lg object-cover border border-border" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-heading font-bold text-sm leading-tight">{org.name}</h3>
                        <p className="text-xs text-muted-foreground">/{org.slug}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full ${statusColors[org.status] || "bg-muted text-muted-foreground"}`}>
                      {org.status?.replace("_", " ")}
                    </span>
                  </div>

                  {org.profile?.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {org.profile.description}
                    </p>
                  )}

                  {/* Status Badges & Reason preview */}
                  {org.status === "suspended" && org.suspensionReason && (
                    <div className="mb-3 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-200">
                      <span className="font-semibold">Suspended:</span> {org.suspensionReason}
                    </div>
                  )}
                  {org.status === "banned" && org.bannedReason && (
                    <div className="mb-3 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-800 dark:text-rose-200">
                      <span className="font-semibold">Banned:</span> {org.bannedReason}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2 text-xs">
                  <Link
                    to={`/dashboard/org/${org._id}`}
                    className="inline-flex items-center gap-1 font-medium hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Manage
                  </Link>

                  <span className="text-muted-foreground/50">•</span>

                  <button
                    onClick={() => handleOpenDetails(org)}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Info className="h-3 w-3" />
                    Details
                  </button>

                  <span className="text-muted-foreground/50">•</span>

                  {/* Suspend / Activate toggle */}
                  {org.status === "suspended" ? (
                    <button
                      onClick={() => handleActivate(org._id, org.name)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <PlayCircle className="h-3 w-3" />
                      Activate
                    </button>
                  ) : org.status === "active" ? (
                    <button
                      onClick={() => handleOpenSuspend(org)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      <PauseCircle className="h-3 w-3" />
                      Suspend
                    </button>
                  ) : null}

                  <span className="text-muted-foreground/50">•</span>

                  {/* Ban / Unban toggle */}
                  {org.status === "banned" ? (
                    <button
                      onClick={() => handleUnban(org._id, org.name)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      Unban
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBan(org._id, org.name)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium"
                    >
                      <ShieldOff className="h-3 w-3" />
                      Ban
                    </button>
                  )}

                  <span className="text-muted-foreground/50">•</span>

                  <button
                    onClick={() => { setSelectedOrg(org); setNotifyModalOpen(true); }}
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
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

      {/* Suspend Confirmation Modal */}
      <Dialog open={suspendModalOpen} onOpenChange={setSuspendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Suspend Organization: {suspendingOrg?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Suspending this organization workspace will restrict members from creating new classes, sessions, assignments, or sending messages. Existing records will remain viewable by members.
            </p>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Reason for Suspension
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-amber-500"
                rows={3}
                placeholder="e.g., Billing verification required, compliance audit, or terms inquiry..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSuspendModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSuspend}
              disabled={suspendLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {suspendLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <PauseCircle className="h-4 w-4 mr-1.5" />}
              Confirm Suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Organization Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Organization Details
            </DialogTitle>
          </DialogHeader>

          {detailsOrg && (
            <div className="space-y-4 py-2">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {detailsOrg.profile?.logo ? (
                    <img src={detailsOrg.profile.logo} alt={detailsOrg.name} className="h-12 w-12 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center border border-border">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading font-bold text-base">{detailsOrg.name}</h3>
                    <p className="text-xs text-muted-foreground">/{detailsOrg.slug} • Type: {detailsOrg.type || 'Coaching Center'}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full ${statusColors[detailsOrg.status] || "bg-muted text-muted-foreground"}`}>
                  {detailsOrg.status?.replace("_", " ")}
                </span>
              </div>

              {/* Status Specific Alerts */}
              {detailsOrg.status === "suspended" && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Workspace Suspended
                  </div>
                  {detailsOrg.suspendedAt && (
                    <div className="text-muted-foreground">
                      Suspended on: {new Date(detailsOrg.suspendedAt).toLocaleDateString()}
                    </div>
                  )}
                  {detailsOrg.suspensionReason && (
                    <div className="font-mono mt-1">
                      Reason: {detailsOrg.suspensionReason}
                    </div>
                  )}
                </div>
              )}

              {detailsOrg.status === "banned" && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <ShieldOff className="h-3.5 w-3.5" />
                    Workspace Banned
                  </div>
                  {detailsOrg.bannedAt && (
                    <div className="text-muted-foreground">
                      Banned on: {new Date(detailsOrg.bannedAt).toLocaleDateString()}
                    </div>
                  )}
                  {detailsOrg.bannedReason && (
                    <div className="font-mono mt-1">
                      Reason: {detailsOrg.bannedReason}
                    </div>
                  )}
                </div>
              )}

              {/* Contact & Owner Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
                  <span className="text-muted-foreground block mb-0.5">Owner ID</span>
                  <span className="font-mono font-medium truncate block">{detailsOrg.ownerId || 'N/A'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
                  <span className="text-muted-foreground block mb-0.5">Created Date</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {detailsOrg.createdAt ? new Date(detailsOrg.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Contact Details */}
              {(detailsOrg.contact?.email || detailsOrg.contact?.phone || detailsOrg.contact?.address) && (
                <div className="p-3 rounded-lg border border-border text-xs space-y-1.5">
                  <span className="font-semibold text-foreground block mb-1">Contact Information</span>
                  {detailsOrg.contact?.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>{detailsOrg.contact.email}</span>
                    </div>
                  )}
                  {detailsOrg.contact?.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{detailsOrg.contact.phone}</span>
                    </div>
                  )}
                  {detailsOrg.contact?.address && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{detailsOrg.contact.address}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Action Control Bar */}
              <div className="pt-2 flex flex-wrap gap-2 justify-end border-t border-border">
                {detailsOrg.status === "suspended" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleActivate(detailsOrg._id, detailsOrg.name)}
                    disabled={actionLoading}
                    className="text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                  >
                    <PlayCircle className="h-4 w-4 mr-1.5" />
                    Activate Workspace
                  </Button>
                ) : detailsOrg.status === "active" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDetailsModalOpen(false);
                      handleOpenSuspend(detailsOrg);
                    }}
                    disabled={actionLoading}
                    className="text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                  >
                    <PauseCircle className="h-4 w-4 mr-1.5" />
                    Suspend Workspace
                  </Button>
                ) : null}

                {detailsOrg.status === "banned" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUnban(detailsOrg._id, detailsOrg.name)}
                    disabled={actionLoading}
                    className="text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                  >
                    <ShieldCheck className="h-4 w-4 mr-1.5" />
                    Unban
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBan(detailsOrg._id, detailsOrg.name)}
                    disabled={actionLoading}
                    className="text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    <ShieldOff className="h-4 w-4 mr-1.5" />
                    Ban
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedOrg(detailsOrg);
                    setDetailsModalOpen(false);
                    setNotifyModalOpen(true);
                  }}
                >
                  <Bell className="h-4 w-4 mr-1.5" />
                  Notify Members
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
