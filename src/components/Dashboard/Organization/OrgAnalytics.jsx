import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  BarChart3,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card } from "../../ui/card";

const OrgAnalytics = () => {
  const { orgId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orgRes, membersRes, tuitionsRes, paymentsRes] = await Promise.all([
          api.get(`/api/v1/organizations/${orgId}`).catch(() => ({ data: { data: null } })),
          api.get(`/api/v1/organizations/${orgId}/members`).catch(() => ({ data: { data: [] } })),
          api.get(`/api/v1/organizations/${orgId}/tuitions`).catch(() => ({ data: { data: [] } })),
          api.get(`/api/v1/organizations/${orgId}/payments`).catch(() => ({ data: { data: [] } })),
        ]);

        const members = membersRes.data.data || [];
        const tuitions = tuitionsRes.data.data || [];
        const payments = paymentsRes.data?.data || paymentsRes.data || [];

        const activeTuitions = tuitions.filter(t => t.status === "approved" || t.status === "matched");
        const totalRevenue = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0);
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const monthPayments = payments.filter(p => p.status === "completed" && new Date(p.createdAt) >= thisMonth);
        const monthRevenue = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        // Tuition status breakdown
        const statusBreakdown = tuitions.reduce((acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {});

        // Role breakdown
        const roleBreakdown = members.reduce((acc, m) => {
          const roleName = m.roleId?.slug || "unknown";
          acc[roleName] = (acc[roleName] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalMembers: members.length,
          teachers: roleBreakdown["teacher"] || roleBreakdown["org_admin"] || 0,
          students: roleBreakdown["student"] || 0,
          totalTuitions: tuitions.length,
          activeTuitions: activeTuitions.length,
          pendingTuitions: statusBreakdown["pending"] || 0,
          totalRevenue,
          monthRevenue,
          totalPayments: payments.length,
          statusBreakdown,
          roleBreakdown,
        });
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Members", value: stats?.totalMembers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Tuitions", value: stats?.activeTuitions || 0, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Revenue", value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { label: "This Month", value: `৳${(stats?.monthRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your organization's performance and activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`size-9 ${card.bg} rounded-lg flex items-center justify-center`}>
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
              {card.label}
            </p>
            <p className="text-2xl font-heading font-bold mt-1">{card.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tuition Status Breakdown */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">Tuition Status</h3>
          <div className="space-y-3">
            {Object.entries(stats?.statusBreakdown || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-foreground capitalize">{status}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === "approved" || status === "matched" ? "bg-green-500" :
                        status === "pending" ? "bg-yellow-500" :
                        status === "rejected" ? "bg-red-500" : "bg-primary"
                      }`}
                      style={{ width: `${(count / (stats?.totalTuitions || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(stats?.statusBreakdown || {}).length === 0 && (
              <p className="text-sm text-muted-foreground">No tuitions yet</p>
            )}
          </div>
        </div>

        {/* Role Breakdown */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">Member Roles</h3>
          <div className="space-y-3">
            {Object.entries(stats?.roleBreakdown || {}).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm text-foreground capitalize">{role.replace(/_/g, " ")}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / (stats?.totalMembers || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(stats?.roleBreakdown || {}).length === 0 && (
              <p className="text-sm text-muted-foreground">No members yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgAnalytics;
