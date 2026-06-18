import { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import { 
  Building2, 
  Plus, 
  Loader2, 
  ExternalLink,
  Users,
  Search,
  Shield,
  ShieldOff
} from "lucide-react";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Link } from "react-router-dom";

const AllOrganizations = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchOrgs();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/organizations/all", {
        params: { search, page, limit: 12 }
      });
      setOrgs(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  if (loading && orgs.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-bold">Organizations</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orgs (server-side)..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </div>

      {orgs.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No organizations found</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgs.map((org) => (
              <Card key={org._id} className="p-5 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {org.profile?.logo ? (
                      <img src={org.profile.logo} alt={org.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-heading font-bold text-sm">{org.name}</h3>
                      <p className="text-xs text-muted-foreground">/{org.slug}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-label font-semibold uppercase px-2 py-0.5 rounded ${
                    org.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {org.status}
                  </span>
                </div>
                {org.profile?.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {org.profile.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Link
                    to={`/dashboard/org/${org._id}`}
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Manage
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-sm"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllOrganizations;
