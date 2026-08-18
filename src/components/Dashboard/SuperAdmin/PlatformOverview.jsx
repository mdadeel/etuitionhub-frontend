import { useState, useEffect } from "react";
import api from "../../../services/api";
import { 
  Building2, 
  Users, 
  Loader2,
} from "lucide-react";
import { Card } from "../../ui/card";

const PlatformOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orgsRes, usersRes] = await Promise.all([
          api.get("/api/v1/organizations/all", { params: { limit: 1 } }),
          api.get("/api/users", { params: { limit: 1 } })
        ]);
        setStats({
          totalOrgs: orgsRes.data.pagination?.total || orgsRes.data.data?.length || 0,
          totalUsers: usersRes.data.pagination?.total || usersRes.data.length || 0,
        });
      } catch (err) {
        console.error("Failed to load platform stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cards = [
    { label: "Organizations", value: stats?.totalOrgs || 0, icon: Building2, color: "text-blue-500" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-green-500" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </p>
                <p className="text-2xl font-heading font-bold mt-1">{card.value}</p>
              </div>
              <card.icon className={`h-8 w-8 ${card.color} opacity-50`} />
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Quick Actions
        </h3>
        <p className="text-sm text-muted-foreground">
          Use the sidebar to navigate to Organizations, Users, Audit Logs, and Platform Settings.
        </p>
      </Card>
    </div>
  );
};

export default PlatformOverview;
