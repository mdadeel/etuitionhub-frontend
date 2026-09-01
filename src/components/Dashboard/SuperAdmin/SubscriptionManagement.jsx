import { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  Building2,
} from "lucide-react";
import DataTable from "@/components/ui/data-table";

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "", slug: "", description: "",
    priceMonthly: 0, priceYearly: 0,
    features: "", maxMembers: 5, maxTuitions: 10, maxStorageMB: 100,
    isPublic: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, subsRes] = await Promise.all([
        api.get("/api/v1/plans"),
        api.get("/api/v1/subscriptions"),
      ]);
      setPlans(plansRes.data.data || []);
      setSubscriptions(subsRes.data.data || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingPlan(null);
    setForm({ name: "", slug: "", description: "", priceMonthly: 0, priceYearly: 0, features: "", maxMembers: 5, maxTuitions: 10, maxStorageMB: 100, isPublic: true });
    setShowPlanModal(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || "",
      priceMonthly: plan.price?.monthly || 0,
      priceYearly: plan.price?.yearly || 0,
      features: (plan.features || []).join("\n"),
      maxMembers: plan.limits?.maxMembers || 5,
      maxTuitions: plan.limits?.maxTuitions || 10,
      maxStorageMB: plan.limits?.maxStorageMB || 100,
      isPublic: plan.isPublic !== false,
    });
    setShowPlanModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Plan name is required");
      return;
    }
    try {
      setSaving(true);
      const body = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        description: form.description,
        price: { monthly: Number(form.priceMonthly), yearly: Number(form.priceYearly) },
        features: form.features.split("\n").map(f => f.trim()).filter(Boolean),
        limits: { maxMembers: Number(form.maxMembers), maxTuitions: Number(form.maxTuitions), maxStorageMB: Number(form.maxStorageMB) },
        isPublic: form.isPublic,
      };

      if (editingPlan) {
        await api.patch(`/api/v1/plans/${editingPlan._id}`, body);
        toast.success("Plan updated");
      } else {
        await api.post("/api/v1/plans", body);
        toast.success("Plan created");
      }
      setShowPlanModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (plan) => {
    if (plan.isSystem) {
      toast.error("Cannot delete system plans");
      return;
    }
    if (!window.confirm(`Delete plan "${plan.name}"?`)) return;
    try {
      await api.delete(`/api/v1/plans/${plan._id}`);
      toast.success("Plan deleted");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete plan");
    }
  };

  const planColumns = [
    {
      key: "name",
      label: "Plan",
      render: (_, plan) => (
        <div>
          <div className="font-medium text-foreground">{plan.name}</div>
          <div className="text-xs text-muted-foreground font-mono">{plan.slug}</div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (_, plan) => (
        <div className="text-sm">
          <span className="font-medium">৳{plan.price?.monthly?.toLocaleString() || 0}</span>
          <span className="text-muted-foreground">/mo</span>
          {plan.price?.yearly > 0 && (
            <span className="text-muted-foreground block text-xs">৳{plan.price.yearly.toLocaleString()}/yr</span>
          )}
        </div>
      ),
    },
    {
      key: "limits",
      label: "Limits",
      render: (_, plan) => (
        <div className="text-xs text-muted-foreground space-y-0.5">
          <div>{plan.limits?.maxMembers || "—"} members</div>
          <div>{plan.limits?.maxTuitions || "—"} tuitions</div>
          <div>{plan.limits?.maxStorageMB || "—"} MB</div>
        </div>
      ),
    },
    {
      key: "features",
      label: "Features",
      render: (_, plan) => (
        <div className="flex flex-wrap gap-1">
          {(plan.features || []).slice(0, 3).map((f, i) => (
            <span key={i} className="px-2 py-0.5 bg-muted text-[10px] rounded-md border border-border">{f}</span>
          ))}
          {plan.features?.length > 3 && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md">+{plan.features.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: "isPublic",
      label: "Visible",
      render: (_, plan) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          plan.isPublic ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"
        }`}>
          {plan.isPublic ? "Public" : "Hidden"}
        </span>
      ),
    },
    {
      key: "_id",
      label: "Actions",
      align: "right",
      render: (_, plan) => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => openEdit(plan)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Edit">
            <Pencil className="w-4 h-4" />
          </button>
          {!plan.isSystem && (
            <button onClick={() => handleDeletePlan(plan)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const subColumns = [
    {
      key: "orgId",
      label: "Organization",
      render: (_, sub) => (
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-muted-foreground" />
          <span className="text-sm font-medium">{sub.orgId?.name || "—"}</span>
        </div>
      ),
    },
    {
      key: "planId",
      label: "Plan",
      render: (_, sub) => <span className="text-sm">{sub.planId?.name || "—"}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (_, sub) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          sub.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          sub.status === "trialing" ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" :
          sub.status === "canceled" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
        }`}>
          {sub.status}
        </span>
      ),
    },
    {
      key: "billingCycle",
      label: "Cycle",
      render: (_, sub) => <span className="text-sm capitalize">{sub.billingCycle || "monthly"}</span>,
    },
    {
      key: "currentPeriodEnd",
      label: "Renews",
      render: (_, sub) => (
        <span className="text-sm text-muted-foreground">
          {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (_, sub) => (
        <span className="text-sm text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

    return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Plans Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-label font-semibold uppercase tracking-wider text-muted-foreground">Plans</h2>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Plan
          </button>
        </div>
        <DataTable columns={planColumns} data={plans} emptyState="No plans created yet." rowKey={(p) => p._id} />
      </div>

      {/* Subscriptions Section */}
      <div>
        <h2 className="text-sm font-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">Active Subscriptions</h2>
        <DataTable columns={subColumns} data={subscriptions} emptyState="No subscriptions yet." rowKey={(s) => s._id} />
      </div>

      {/* Create/Edit Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg max-h-[85vh] rounded-lg shadow-xl border border-border overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-foreground">{editingPlan ? "Edit Plan" : "Create Plan"}</h2>
              <button onClick={() => setShowPlanModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
              <div className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Plan Name *</label>
                    <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Pro" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" placeholder="auto-generated" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Plan description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Price (৳)</label>
                    <input type="number" value={form.priceMonthly} onChange={(e) => setForm(f => ({ ...f, priceMonthly: e.target.value }))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Yearly Price (৳)</label>
                    <input type="number" value={form.priceYearly} onChange={(e) => setForm(f => ({ ...f, priceYearly: e.target.value }))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Members</label>
                    <input type="number" value={form.maxMembers} onChange={(e) => setForm(f => ({ ...f, maxMembers: e.target.value }))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Tuitions</label>
                    <input type="number" value={form.maxTuitions} onChange={(e) => setForm(f => ({ ...f, maxTuitions: e.target.value }))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Storage (MB)</label>
                    <input type="number" value={form.maxStorageMB} onChange={(e) => setForm(f => ({ ...f, maxStorageMB: e.target.value }))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Features (one per line)</label>
                  <textarea value={form.features} onChange={(e) => setForm(f => ({ ...f, features: e.target.value }))} rows={4} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-mono" placeholder="Unlimited tuitions&#10;Priority support&#10;Custom branding" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`size-5 rounded border flex items-center justify-center transition-colors ${form.isPublic ? "bg-primary border-primary" : "border-border"}`} onClick={() => setForm(f => ({ ...f, isPublic: !f.isPublic }))}>
                    {form.isPublic && <Check size={12} className="text-primary-foreground" />}
                  </div>
                  <span className="text-sm font-medium">Visible in public plan listing</span>
                </label>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3 flex-shrink-0">
                <button type="button" onClick={() => setShowPlanModal(false)} className="px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingPlan ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
