import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Users, GraduationCap, BookOpen, TrendingUp, DollarSign, BarChart3, Building2 } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EMPTY_BRANCH_ROWS = { branches: [], unassigned: null };

const OrgAnalytics = () => {
  const { orgId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branchRows, setBranchRows] = useState(EMPTY_BRANCH_ROWS);
  const [branchLoading, setBranchLoading] = useState(true);
  const [branchError, setBranchError] = useState(false);

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

  useEffect(() => {
    const fetchBranchStats = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/analytics/branches`);
        setBranchRows(res.data.data);
      } catch {
        setBranchError(true);
      } finally {
        setBranchLoading(false);
      }
    };
    fetchBranchStats();
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
    { title: "Total Members", value: stats.members?.total || 0, icon: Users, color: "text-primary" },
    { title: "Students", value: stats.members?.students || 0, icon: GraduationCap, color: "text-success" },
    { title: "Teachers", value: stats.members?.teachers || 0, icon: BookOpen, color: "text-primary" },
    { title: "Active Enrollments", value: stats.enrollments?.active || 0, icon: TrendingUp, color: "text-warning" },
    { title: "Total Revenue", value: `৳${(stats.finance?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-success" },
    { title: "Net Income", value: `৳${(stats.finance?.netIncome || 0).toLocaleString()}`, icon: BarChart3, color: stats.finance?.netIncome >= 0 ? "text-success" : "text-destructive" },
  ];

  const branches = branchRows.branches || [];
  const unassigned = branchRows.unassigned;

  const formatRate = (rate) => `${rate}%`;
  const formatTaka = (value) => `৳${(value || 0).toLocaleString()}`;

  const renderBranchTable = (rows) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="py-2 pr-4 font-medium">Branch</th>
            <th className="py-2 pr-4 font-medium">Students</th>
            <th className="py-2 pr-4 font-medium">Attendance</th>
            <th className="py-2 pr-4 font-medium">Exam Pass Rate</th>
            <th className="py-2 font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const att = row.attendance || {};
            const exams = row.exams || {};
            return (
              <tr key={row._id ?? 'unassigned'} className="border-b border-border/60 last:border-0">
                <td className="py-3 pr-4 font-medium text-foreground">{row.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">{row.students || 0}</td>
                <td className="py-3 pr-4">
                  <span className={att.rate >= 75 ? "text-success" : att.rate >= 50 ? "text-warning" : "text-destructive"}>
                    {formatRate(att.rate || 0)}
                  </span>
                  <span className="text-muted-foreground"> · {att.total || 0}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className={exams.passRate >= 60 ? "text-success" : exams.passRate >= 40 ? "text-warning" : "text-destructive"}>
                    {formatRate(exams.passRate || 0)}
                  </span>
                  <span className="text-muted-foreground"> · {exams.passed || 0}/{exams.total || 0}</span>
                </td>
                <td className="py-3 font-medium">{formatTaka(row.finance?.revenue)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

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
                <span className="font-medium text-success">{formatTaka(stats.finance?.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="font-medium text-destructive">{formatTaka(stats.finance?.totalExpenses)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-sm font-medium">Net Income</span>
                <span className={`font-bold ${(stats.finance?.netIncome || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatTaka(stats.finance?.netIncome)}
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

      {/* Branch comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Branch Comparison
          </CardTitle>
          <CardDescription>Attendance, exam pass rate and revenue per branch</CardDescription>
        </CardHeader>
        <CardContent>
          {branchLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : branchError ? (
            <p className="text-sm text-destructive">Could not load branch comparison.</p>
          ) : branches.length === 0 && !unassigned ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Building2 className="h-10 w-10 opacity-40 mb-3" />
              <p className="text-sm">No branches with data yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {renderBranchTable(branches)}
              {unassigned && (
                <div className="rounded-lg border border-border bg-muted/30">
                  <p className="px-4 pt-3 text-xs font-medium text-muted-foreground">
                    Members without a branch
                  </p>
                  <div className="px-4 pb-3 pt-1">{renderBranchTable([unassigned])}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgAnalytics;
