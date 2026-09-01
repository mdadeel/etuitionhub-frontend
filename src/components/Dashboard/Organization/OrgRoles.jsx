import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  Shield,
  Plus,
  Trash2,
  Loader2,
  Pencil,
  Check,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import DataTable from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PERMISSION_GROUPS = {
  Members: ["member:view", "member:invite", "member:invite_teacher", "member:invite_student", "member:remove", "member:manage_roles", "member:suspend", "member:export"],
  Roles: ["role:view", "role:create", "role:update", "role:delete", "role:assign", "role:duplicate", "role:export", "role:manage"],
  Tuitions: ["tuition:view", "tuition:view_all", "tuition:create", "tuition:edit_own", "tuition:edit_all", "tuition:delete_own", "tuition:delete_all", "tuition:approve", "tuition:delete"],
  Finance: ["payment:view_own", "payment:view_all", "payment:process", "payment:refund", "payment:export", "payment:configure", "payment:reconcile", "payment:audit", "payment:schedule"],
  Analytics: ["analytics:view", "analytics:view_detailed", "analytics:export", "analytics:schedule_reports", "analytics:custom_reports", "analytics:view_student_metrics"],
  Settings: ["settings:view", "settings:update_profile", "settings:update_billing", "settings:update_features", "settings:manage_webhooks", "settings:delete_org", "settings:manage"],
  Verification: ["verification:view", "verification:approve_teacher", "verification:approve_org", "verification:reject", "verification:manage_docs", "verification:approve"],
  Audit: ["audit:view", "audit:view_detailed", "audit:export", "audit:delete_logs", "audit:configure"],
};

const OrgRoles = () => {
  const { orgId } = useParams();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPerms, setFormPerms] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/organizations/${orgId}/roles`);
      setRoles(res.data.data);
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const togglePerm = (perm) => {
    setFormPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleAllInGroup = (group) => {
    const perms = PERMISSION_GROUPS[group];
    const allSelected = perms.every((p) => formPerms.includes(p));
    setFormPerms((prev) =>
      allSelected ? prev.filter((p) => !perms.includes(p)) : [...new Set([...prev, ...perms])]
    );
  };

  const openCreate = () => {
    setEditingRole(null);
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormPerms([]);
    setShowCreateModal(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormSlug(role.slug);
    setFormDesc(role.description || "");
    setFormPerms([...(role.permissions || [])]);
    setShowCreateModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Role name is required");
      return;
    }
    try {
      setSaving(true);
      const body = {
        name: formName,
        slug: formSlug || formName.toLowerCase().replace(/\s+/g, "_"),
        description: formDesc,
        permissions: formPerms,
      };

      if (editingRole) {
        await api.patch(`/api/v1/organizations/${orgId}/roles/${editingRole._id}`, body);
        toast.success("Role updated");
      } else {
        await api.post(`/api/v1/organizations/${orgId}/roles`, body);
        toast.success("Role created");
      }
      setShowCreateModal(false);
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role) => {
    if (role.isSystem) {
      toast.error("Cannot delete system roles");
      return;
    }
    if (!window.confirm(`Delete role "${role.name}"? Members using it will lose their permissions.`)) return;
    try {
      await api.delete(`/api/v1/organizations/${orgId}/roles/${role._id}`);
      toast.success("Role deleted");
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete role");
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
          <h1 className="text-2xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create custom roles and assign granular permissions to control access.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      <DataTable
        columns={[
          {
            key: "name",
            label: "Role",
            render: (_, role) => (
              <div className="flex items-center gap-3">
                <div className={`size-9 rounded-lg flex items-center justify-center ${role.isSystem ? "bg-primary/10" : "bg-muted"}`}>
                  <Shield size={16} className={role.isSystem ? "text-primary" : "text-muted-foreground"} />
                </div>
                <div>
                  <div className="font-medium text-foreground">{role.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{role.slug}</div>
                </div>
              </div>
            ),
          },
          {
            key: "permissions",
            label: "Permissions",
            render: (_, role) => (
              <div className="flex flex-wrap gap-1">
                {(role.permissions || []).slice(0, 4).map((p) => (
                  <span key={p} className="px-2 py-0.5 bg-muted text-[10px] font-mono rounded-md border border-border">
                    {p}
                  </span>
                ))}
                {role.permissions?.length > 4 && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md border border-primary/20">
                    +{role.permissions.length - 4}
                  </span>
                )}
                {role.permissions?.includes("*") && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold rounded-md border border-amber-500/20">
                    ALL
                  </span>
                )}
              </div>
            ),
          },
          {
            key: "isSystem",
            label: "Type",
            render: (_, role) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                role.isSystem ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {role.isSystem ? "System" : "Custom"}
              </span>
            ),
          },
          {
            key: "_id",
            label: "Actions",
            align: "right",
            render: (_, role) => (
              <div className="flex items-center gap-1 justify-end">
                <button
                  onClick={() => openEdit(role)}
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  title="Edit Role"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {!role.isSystem && (
                  <button
                    onClick={() => handleDelete(role)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Delete Role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
        data={roles}
        emptyState="No roles found. Create your first custom role."
        rowKey={(r) => r._id}
      />

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Edit Role" : "Create Role"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
            <div className="space-y-5 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Role Name *</label>
                  <input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. Finance Staff"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Slug</label>
                  <input
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                    placeholder="auto-generated"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <input
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Optional description"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Permissions</label>
                <div className="bg-background border border-border rounded-lg divide-y divide-border">
                  {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                    const selected = perms.filter((p) => formPerms.includes(p)).length;
                    const allSelected = selected === perms.length;
                    const expanded = expandedGroups[group];
                    return (
                      <div key={group}>
                        <div
                          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleGroup(group)}
                        >
                          <div className="flex items-center gap-3">
                            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span className="text-sm font-medium">{group}</span>
                            <span className="text-xs text-muted-foreground">
                              {selected}/{perms.length}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleAllInGroup(group); }}
                            className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                              allSelected
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                            }`}
                          >
                            {allSelected ? "Deselect All" : "Select All"}
                          </button>
                        </div>
                        {expanded && (
                          <div className="px-6 pb-3 grid grid-cols-2 gap-2">
                            {perms.map((perm) => (
                              <label
                                key={perm}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-xs ${
                                  formPerms.includes(perm)
                                    ? "bg-primary/5 border-primary/20 text-primary"
                                    : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={formPerms.includes(perm)}
                                  onChange={() => togglePerm(perm)}
                                  className="sr-only"
                                />
                                <div className={`size-4 rounded flex items-center justify-center border ${
                                  formPerms.includes(perm) ? "bg-primary border-primary" : "border-border"
                                }`}>
                                  {formPerms.includes(perm) && <Check size={10} className="text-primary-foreground" />}
                                </div>
                                <span className="font-mono">{perm}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingRole ? "Save Changes" : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgRoles;
