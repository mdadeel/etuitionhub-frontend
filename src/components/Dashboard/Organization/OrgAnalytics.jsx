import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Users, GraduationCap, BookOpen, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgAnalytics = () => {
  const { orgId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/analytics/dashboard`);
        setStats(res.data.data);
      } catch {
        toast.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [orgId]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">No analytics data available.</p>
      </div>
    );
  }

  const statCards = [
    { title: "Total Members", value: stats.members?.total || 0, icon: Users, color: "text-blue-500" },
    { title: "Students", value: stats.members?.students || 0, icon: GraduationCap, color: "text-green-500" },
    { title: "Teachers", value: stats.members?.teachers || 0, icon: BookOpen, color: "text-cyan-500" },
    { title: "Active Enrollments", value: stats.enrollments?.active || 0, icon: TrendingUp, color: "text-orange-500" },
    { title: "Total Revenue", value: `৳${(stats.finance?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
    { title: "Net Income", value: `৳${(stats.finance?.netIncome || 0).toLocaleString()}`, icon: BarChart3, color: stats.finance?.netIncome >= 0 ? "text-green-500" : "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of your organization's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Finance Summary</CardTitle>
            <CardDescription>Revenue vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-medium text-green-600">৳{(stats.finance?.totalRevenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="font-medium text-red-600">৳{(stats.finance?.totalExpenses || 0).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-sm font-medium">Net Income</span>
                <span className={`font-bold ${(stats.finance?.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ৳{(stats.finance?.netIncome || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Organization overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Branches</span>
                <span className="font-medium">{stats.branches || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Exams</span>
                <span className="font-medium">{stats.exams || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Invoices</span>
                <span className="font-medium">{stats.finance?.pendingInvoices || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Paid Invoices</span>
                <span className="font-medium">{stats.finance?.paidInvoices || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrgAnalytics;
