import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  Building2,
  Users,
  BookOpen,
  DollarSign,
  Loader2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Card } from "../../ui/card";

const OrgHome = () => {
  const { orgId } = useParams();
  const [org, setOrg] = useState(null);
  const [stats, setStats] = useState(null);
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orgRes, membersRes, tuitionsRes] = await Promise.all([
          api.get(`/api/v1/organizations/${orgId}`).catch(() => ({ data: { data: null } })),
          api.get(`/api/v1/organizations/${orgId}/members`).catch(() => ({ data: { data: [] } })),
          api.get(`/api/v1/organizations/${orgId}/tuitions`).catch(() => ({ data: { data: [] } })),
        ]);

        setOrg(orgRes.data.data);
        setTuitions(tuitionsRes.data.data || []);

        const memberList = membersRes.data.data || [];
        const tuitionList = tuitionsRes.data.data || [];
        setStats({
          totalMembers: memberList.length,
          teachers: memberList.filter(m => ['teacher', 'admin', 'coordinator', 'owner'].includes(m.roleId?.slug)).length,
          students: memberList.filter(m => m.roleId?.slug === 'student').length,
          activeTuitions: tuitionList.filter(t => t.status === 'approved' || t.status === 'matched').length,
          totalTuitions: tuitionList.length,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load organization data");
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
    { label: "Teachers", value: stats?.teachers || 0, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Tuitions", value: stats?.activeTuitions || 0, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
    { label: "Students", value: stats?.students || 0, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const quickLinks = [
    { label: "Tuitions", path: "tuitions", icon: BookOpen, count: stats?.totalTuitions },
    { label: "Members", path: "members", icon: Users, count: stats?.totalMembers },
    { label: "Sessions", path: "sessions", icon: DollarSign },
    { label: "Settings", path: "settings", icon: Building2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-1.5 bg-primary rounded-lg"></div>
          <span className="text-[9px] font-label font-semibold uppercase tracking-wider text-primary">Organization</span>
        </div>
        <h1 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">
          {org?.name || "Organization"}
        </h1>
        {org?.profile?.description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">{org.profile.description}</p>
        )}
      </div>

      {/* Stats Grid */}
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

      {/* Quick Links */}
      <div>
        <h2 className="text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted/50 hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <link.icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-xs font-heading font-bold text-foreground">{link.label}</p>
                  {link.count !== undefined && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">{link.count} total</p>
                  )}
                </div>
              </div>
              <ArrowRight size={14} className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tuitions */}
      {tuitions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Recent Tuitions</h2>
            <Link to="tuitions" className="text-[9px] font-heading font-bold uppercase tracking-wider text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-6 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Subject</th>
                    <th className="px-6 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Class</th>
                    <th className="px-6 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
                    <th className="px-6 py-3 text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {tuitions.slice(0, 5).map((t) => (
                    <tr key={t._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 text-sm font-bold text-foreground">{t.subject}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{t.class_name}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{t.location}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 text-[9px] font-label font-semibold uppercase tracking-wider rounded-lg border ${
                          t.status === 'approved' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
                          t.status === 'pending' ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' :
                          'bg-muted text-muted-foreground border-border'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgHome;
