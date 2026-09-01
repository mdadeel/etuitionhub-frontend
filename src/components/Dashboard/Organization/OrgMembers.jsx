import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  Users,
  Mail,
  UserPlus,
  Trash2,
  Loader2,
  Copy,
  CheckCircle2,
  Shield,
  XCircle,
  UserCheck,
  AlertOctagon,
  Check,
} from "lucide-react";
import DataTable from "@/components/ui/data-table";
import ModerationModal from "../ModerationModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const OrgMembers = () => {
  const { orgId } = useParams();
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");
  
  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);

  // Moderation Modal State
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Inline role edit state
  const [roleEditMember, setRoleEditMember] = useState(null);
  const [roleEditValue, setRoleEditValue] = useState("");

  const fetchMembersAndRoles = useCallback(async () => {
    try {
      setLoading(true);
      const [membersRes, rolesRes] = await Promise.all([
        api.get(`/api/v1/organizations/${orgId}/members`),
        api.get(`/api/v1/organizations/${orgId}/roles`)
      ]);
      setMembers(membersRes.data.data);
      setRoles(rolesRes.data.data);
      if (rolesRes.data.data.length > 0) {
        setInviteRoleId(rolesRes.data.data[0]._id);
      }

      // Fetch pending join requests
      try {
        const joinRequestsRes = await api.get(`/api/v1/organizations/${orgId}/join-requests?status=pending`);
        setJoinRequests(joinRequestsRes.data.data || []);
      } catch {
        // User might not have permission - that's fine
        setJoinRequests([]);
      }
    } catch (error) {
      toast.error("Failed to load members or roles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchMembersAndRoles();
  }, [fetchMembersAndRoles]);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      setInviting(true);
      const res = await api.post(`/api/v1/organizations/${orgId}/invites`, {
        email: inviteEmail,
        roleId: inviteRoleId
      });
      toast.success("Invitation generated!");
      setInviteResult(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create invite");
    } finally {
      setInviting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Invite token copied to clipboard!");
  };

  const resetInviteModal = () => {
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteResult(null);
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the organization?`)) {
      return;
    }
    try {
      await api.delete(`/api/v1/organizations/${orgId}/members/${memberId}`);
      toast.success("Member removed successfully");
      fetchMembersAndRoles();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to remove member");
    }
  };

  const handleApproveRequest = async (requestId, userName) => {
    if (!window.confirm(`Approve ${userName}'s request to join?`)) {
      return;
    }
    try {
      await api.patch(`/api/v1/organizations/${orgId}/join-requests/${requestId}`, {
        action: 'approve'
      });
      toast.success(`${userName} has been approved and added to the organization`);
      fetchMembersAndRoles();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to approve request");
    }
  };

  const handleRejectRequest = async (requestId, userName) => {
    const reason = window.prompt(`Reason for rejecting ${userName}? (optional)`);
    if (reason === null) return;

    try {
      await api.patch(`/api/v1/organizations/${orgId}/join-requests/${requestId}`, {
        action: 'reject',
        rejectionReason: reason || ''
      });
      toast.success(`${userName}'s request has been rejected`);
      fetchMembersAndRoles();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to reject request");
    }
  };

  const handleRoleChange = async (memberId, newRoleId) => {
    try {
      await api.patch(`/api/v1/organizations/${orgId}/members/${memberId}`, { roleId: newRoleId });
      toast.success("Member role updated");
      setRoleEditMember(null);
      fetchMembersAndRoles();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update role");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organization Members</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your staff, teachers, students, and join requests.
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "members"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
            activeTab === "requests"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Join Requests
          {joinRequests.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {joinRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <DataTable
          columns={[
            {
              key: "userId",
              label: "User",
              render: (_, member) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {member.userId?.displayName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{member.userId?.displayName}</div>
                    <div className="text-xs text-muted-foreground">{member.userId?.email}</div>
                  </div>
                </div>
              ),
            },
            {
              key: "roleId",
              label: "Role",
              render: (_, member) => (
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium">{member.roleId?.name}</span>
                </div>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (_, member) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  member.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
              ),
            },
            {
              key: "joinedAt",
              label: "Joined",
              render: (_, member) => (
                <span className="text-muted-foreground">
                  {new Date(member.createdAt).toLocaleDateString()}
                </span>
              ),
            },
            {
              key: "_id",
              label: "Actions",
              align: "right",
              render: (_, member) => (
                <div className="flex justify-end gap-2 items-center">
                  {roleEditMember === member._id ? (
                    <div className="flex items-center gap-1">
                      <select
                        value={roleEditValue}
                        onChange={(e) => setRoleEditValue(e.target.value)}
                        className="text-xs px-2 py-1 bg-background border border-border rounded focus:outline-none"
                        autoFocus
                      >
                        {roles.map((r) => (
                          <option key={r._id} value={r._id}>{r.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRoleChange(member._id, roleEditValue)}
                        className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setRoleEditMember(null)}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        title="Cancel"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setRoleEditMember(member._id);
                          setRoleEditValue(member.roleId?._id || '');
                        }}
                        className="p-2 text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors"
                        title="Change Role"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(member.userId);
                          setShowModerationModal(true);
                        }}
                        className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
                        title="Moderate Member"
                      >
                        <AlertOctagon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member._id, member.userId?.displayName)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ),
            },
          ]}
          data={members}
          emptyState="No members found."
          rowKey={(m) => m._id}
        />
      )}

      {/* Join Requests Tab */}
      {activeTab === "requests" && (
        <DataTable
          columns={[
            {
              key: "userId",
              label: "User",
              render: (_, request) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {request.userId?.displayName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{request.userId?.displayName}</div>
                    <div className="text-xs text-muted-foreground">{request.userId?.email}</div>
                  </div>
                </div>
              ),
            },
            {
              key: "message",
              label: "Message",
              render: (_, request) => (
                <span className="text-sm text-muted-foreground line-clamp-2">
                  {request.message || "No message provided"}
                </span>
              ),
            },
            {
              key: "createdAt",
              label: "Requested",
              render: (_, request) => (
                <span className="text-muted-foreground">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              ),
            },
            {
              key: "_id",
              label: "Actions",
              align: "right",
              render: (_, request) => (
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleApproveRequest(request._id, request.userId?.displayName)}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors"
                    title="Approve"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request._id, request.userId?.displayName)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Reject"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={joinRequests}
          emptyState="No pending join requests."
          rowKey={(r) => r._id}
        />
      )}

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={(open) => !open && resetInviteModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New Member</DialogTitle>
          </DialogHeader>
          
          {!inviteResult ? (
            <form onSubmit={handleInvite} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="colleague@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Assign Role</label>
                <select
                  value={inviteRoleId}
                  onChange={(e) => setInviteRoleId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                  {roles.map(role => (
                    <option key={role._id} value={role._id}>
                      {role.name} {role.isSystem ? '(System)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetInviteModal}>Cancel</Button>
                <Button type="submit" disabled={inviting}>
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  {inviting ? "Generating Invite..." : "Generate Invite Link"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Invitation Ready</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Share this token with <strong>{inviteResult.email}</strong>. They must sign up or log in, then use this token to join the organization.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg flex items-center justify-between gap-3 border border-border">
                <code className="text-sm font-mono text-primary break-all">
                  {inviteResult.token}
                </code>
                <button
                  onClick={() => copyToClipboard(inviteResult.token)}
                  className="p-2 hover:bg-background rounded-md border border-border transition-colors shrink-0"
                  title="Copy Token"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <Button variant="secondary" className="w-full" onClick={resetInviteModal}>
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Moderation Modal Overlay */}
      {selectedUser && (
        <ModerationModal
          open={showModerationModal}
          onOpenChange={(open) => {
            setShowModerationModal(open);
            if (!open) setSelectedUser(null);
          }}
          targetUser={selectedUser}
          organizationId={orgId}
          onModerationComplete={fetchMembersAndRoles}
        />
      )}
    </div>
  );
};

export default OrgMembers;
