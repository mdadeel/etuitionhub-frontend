import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Loader2,
  Check,
  ArrowRight,
  Calendar,
} from "lucide-react";
import DataTable from "@/components/ui/data-table";

const OrgBilling = () => {
  const { orgId } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [subRes, plansRes, paymentsRes] = await Promise.all([
        api.get(`/api/v1/subscriptions/${orgId}/subscription`).catch(() => ({ data: { data: null } })),
        api.get("/api/v1/plans/public").catch(() => ({ data: { data: [] } })),
        api.get(`/api/v1/organizations/${orgId}/payments`).catch(() => ({ data: { data: [] } })),
      ]);
      setSubscription(subRes.data.data);
      setPlans(plansRes.data.data || []);
      setPayments(paymentsRes.data?.data || paymentsRes.data || []);
    } catch {
      toast.error("Failed to load billing data");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubscribe = async (planId, billingCycle) => {
    try {
      setUpgrading(true);
      await api.post(`/api/v1/subscriptions/${orgId}/subscription`, { planId, billingCycle });
      toast.success("Subscription activated!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to subscribe");
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel your subscription? You'll retain access until the current period ends.")) return;
    try {
      await api.patch(`/api/v1/subscriptions/${orgId}/subscription/cancel`);
      toast.success("Subscription canceled");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const sub = subscription;
  const activePlan = sub?.planId;

  const paymentColumns = [
    {
      key: "createdAt",
      label: "Date",
      render: (_, p) => (
        <span className="text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (_, p) => (
        <span className="font-medium text-foreground">৳{(p.amount || 0).toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, p) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          p.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          p.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {p.status}
        </span>
      ),
    },
    {
      key: "method",
      label: "Method",
      render: (_, p) => (
        <span className="text-muted-foreground capitalize">{p.method || "—"}</span>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your organization's subscription and view payment history.</p>
      </div>

      {/* Current Subscription */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-label font-semibold uppercase tracking-wider text-muted-foreground">Current Plan</h2>
          {sub && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              sub.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
              sub.status === "trialing" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
              sub.status === "canceled" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}>
              {sub.status}
            </span>
          )}
        </div>

        {sub && activePlan ? (
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground">{activePlan.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{activePlan.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {sub.billingCycle === "yearly" ? "Yearly" : "Monthly"}
                </span>
                {sub.currentPeriodEnd && (
                  <span>Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}</span>
                )}
              </div>
              {activePlan.limits && (
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>{activePlan.limits.maxMembers} members</span>
                  <span>{activePlan.limits.maxTuitions} tuitions</span>
                  <span>{activePlan.limits.maxStorageMB} MB storage</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                ৳{activePlan.price?.monthly?.toLocaleString() || 0}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
              {sub.status === "active" && (
                <button
                  onClick={handleCancel}
                  className="mt-3 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No active subscription. Choose a plan below.</p>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-sm font-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = activePlan?._id === plan._id;
            return (
              <div key={plan._id} className={`bg-card border rounded-xl p-6 flex flex-col ${
                isCurrent ? "border-primary shadow-sm" : "border-border"
              }`}>
                {isCurrent && (
                  <span className="self-start px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-wider mb-3">
                    Current
                  </span>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex-1">{plan.description}</p>

                <div className="mt-4 mb-4">
                  <span className="text-3xl font-bold text-foreground">৳{plan.price?.monthly?.toLocaleString() || 0}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                  {plan.price?.yearly > 0 && (
                    <span className="text-xs text-muted-foreground block mt-1">
                      ৳{plan.price.yearly.toLocaleString()}/yr (save {Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100)}%)
                    </span>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {(plan.features || []).slice(0, 5).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan._id, "monthly")}
                  disabled={isCurrent || upgrading}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  } disabled:opacity-70`}
                >
                  {isCurrent ? "Current Plan" : upgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Subscribe</span><ArrowRight size={14} /></>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-sm font-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">Payment History</h2>
        <DataTable
          columns={paymentColumns}
          data={payments}
          emptyState="No payment history yet."
          rowKey={(p) => p._id}
        />
      </div>
    </div>
  );
};

export default OrgBilling;
