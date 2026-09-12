import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import { useOrgMembersQuery } from "@/hooks/queries/useOrgQuery";
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
import ConfirmModal from "@/components/shared/ConfirmModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const OrgMembers = () => {
  const { orgId } = useParams();
  const queryClient = useQueryClient();
  const { data: orgData, isLoading: loading } = useOrgMembersQuery(orgId);

  const members = orgData?.members || [];
  const roles = orgData?.roles || [];
  const joinRequests = orgData?.joinRequests || [];
  const [activeTab, setActiveTab] = useState("members");
  
  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState(roles[0]?._id || "");
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);

  // Moderation Modal State
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Inline role edit state
  const [roleEditMember, setRoleEditMember] = useState(null);
  const [roleEditValue, setRoleEditValue] = useState("");

  const invalidateMembers = () => {
    queryClient.invalidateQueries({ queryKey: ['org', orgId, 'members-and-roles'] });
  };

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
      invalidateMembers();
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

  const handleRemoveMember = (memberId, memberName) => {
    // Batch 2 (audit Exec #6): arm the modal; the delete fires on confirm.
    setMemberAction({ kind: "remove", id: memberId, name: memberName });
  };

  const handleApproveRequest = (requestId, userName) => {
    setMemberAction({ kind: "approve", id: requestId, name: userName });
  };

  const handleRejectRequest = (requestId, userName) => {
    setRejectReason("");
    setMemberAction({ kind: "reject", id: requestId, name: userName });
  };

  // Batch 2 (audit Exec #6): one arm-then-confirm flow replaces the three
  // native window.confirm/prompt calls below (member removal is destructive,
  // rejection keeps its optional reason via the modal textarea).
  const [memberAction, setMemberAction] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [acting, setActing] = useState(false);

  const handleConfirmMemberAction = async () => {
    if (!memberAction) return;
    setActing(true);
    try {
      if (memberAction.kind === "remove") {
        await api.delete(`/api/v1/organizations/${orgId}/members/${memberAction.id}`);
        toast.success("Member removed successfully");
      } else if (memberAction.kind === "approve") {
        await api.patch(`/api/v1/organizations/${orgId}/join-requests/${memberAction.id}`, {
          action: 'approve'
        });
        toast.success(`${memberAction.name} has been approved and added to the organization`);
      } else {
        await api.patch(`/api/v1/organizations/${orgId}/join-requests/${memberAction.id}`, {
          action: 'reject',
          rejectionReason: rejectReason.trim()
        });
        toast.success(`${memberAction.name}'s request has been rejected`);
      }
      setMemberAction(null);
      invalidateMembers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Action failed");
    } finally {
      setActing(false);
    }
  };

  const handleRoleChange = async (memberId, newRoleId) => {
    try {
      await api.patch(`/api/v1/organizations/${orgId}/members/${memberId}`, { roleId: newRoleId });
      toast.success("Member role updated");
      setRoleEditMember(null);
      invalidateMembers();
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
          onModerationComplete={invalidateMembers}
        />
      )}

      <ConfirmModal
        open={!!memberAction}
        onOpenChange={(open) => { if (!open) setMemberAction(null); }}
        title={
          memberAction?.kind === "remove"
            ? `Remove ${memberAction?.name} from the organization?`
            : memberAction?.kind === "approve"
              ? `Approve ${memberAction?.name}'s request to join?`
              : `Reject ${memberAction?.name}'s request?`
        }
        description={
          memberAction?.kind === "remove"
            ? "They will lose access to this workspace immediately."
            : memberAction?.kind === "approve"
              ? "They will be added as an organization member."
              : "They will be notified of the rejection."
        }
        confirmLabel={memberAction?.kind === "approve" ? "Approve" : memberAction?.kind === "reject" ? "Reject" : "Remove"}
        confirmVariant={memberAction?.kind === "approve" ? "default" : "destructive"}
        loadingLabel="Working..."
        loading={acting}
        onConfirm={handleConfirmMemberAction}
      >
        {memberAction?.kind === "reject" && (
          <div className="py-1">
            <label className="text-xs font-semibold text-foreground block mb-1">
              Reason (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              rows={3}
              placeholder="Why is this request being rejected?"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        )}
      </ConfirmModal>
    </div>
  );
};

export default OrgMembers;
