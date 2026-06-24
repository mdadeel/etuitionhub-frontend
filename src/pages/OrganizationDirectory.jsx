import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import {
  Building2,
  Search,
  Loader2,
  MapPin,
  Users,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const OrganizationDirectory = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [myOrgs, setMyOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orgsRes, myOrgsRes] = await Promise.all([
        api.get("/api/v1/organizations"),
        user ? api.get("/api/v1/organizations/my/orgs").catch(() => ({ data: { data: [] } })) : { data: { data: [] } }
      ]);
      setOrganizations(orgsRes.data.data || []);
      setMyOrgs(myOrgsRes.data.data || []);
    } catch {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoin = async (orgId, orgName) => {
    try {
      await api.post(`/api/v1/organizations/${orgId}/join`);
      toast.success(`Request sent to ${orgName}!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to join organization");
    }
  };

  const handleLeave = async (orgId, orgName) => {
    if (!confirm(`Are you sure you want to leave ${orgName}?`)) return;
    try {
      await api.post(`/api/v1/organizations/${orgId}/leave`);
      toast.success(`You have left ${orgName}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to leave organization");
    }
  };

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.profile?.description?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || org.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const isMember = (orgId) => myOrgs.some(m => m._id === orgId);

  const typeLabels = {
    coaching_center: "Coaching Center",
    school: "School",
    college: "College",
    academy: "Academy",
    other: "Other"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4">
            Organizations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover coaching centers, schools, and educational institutions
          </p>
        </div>

        {/* My Organizations */}
        {myOrgs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-heading font-bold mb-4">My Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myOrgs.map((org) => (
                <div key={org._id} className="bg-card border border-primary/20 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {org.profile?.logo ? (
                        <img src={org.profile.logo} alt={org.name} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-heading font-bold">{org.name}</h3>
                        <p className="text-xs text-muted-foreground">{org.membership?.role?.name}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-[10px] font-semibold uppercase bg-green-500/10 text-green-600 rounded">
                      Member
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/org/${org._id}`}
                      className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-center text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Open Dashboard
                    </Link>
                    <button
                      onClick={() => handleLeave(org._id, org.name)}
                      className="px-3 py-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Types</option>
            <option value="coaching_center">Coaching Center</option>
            <option value="school">School</option>
            <option value="college">College</option>
            <option value="academy">Academy</option>
          </select>
        </div>

        {/* Organizations Grid */}
        {filteredOrgs.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-heading font-bold mb-2">No Organizations Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <div key={org._id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative">
                  {org.profile?.banner && (
                    <img src={org.profile.banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
                    <div className="flex items-center gap-3">
                      {org.profile?.logo ? (
                        <img src={org.profile.logo} alt={org.name} className="h-12 w-12 rounded-lg border-2 border-background object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg border-2 border-background bg-card flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-heading font-bold text-foreground">{org.name}</h3>
                        <p className="text-xs text-muted-foreground">/{org.slug}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-primary/10 text-primary rounded">
                      {typeLabels[org.type] || org.type}
                    </span>
                    {org.verificationStatus === 'verified' && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-green-500/10 text-green-600 rounded">
                        Verified
                      </span>
                    )}
                  </div>

                  {org.profile?.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {org.profile.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    {org.profile?.district && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {org.profile.district}
                      </span>
                    )}
                    {org.stats?.totalStudents > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {org.stats.totalStudents} students
                      </span>
                    )}
                    {org.stats?.totalClasses > 0 && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {org.stats.totalClasses} classes
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {isMember(org._id) ? (
                      <Link
                        to={`/dashboard/org/${org._id}`}
                        className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-center text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                      >
                        Open Dashboard
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : org.settings?.allowSelfJoin ? (
                      <button
                        onClick={() => handleJoin(org._id, org.name)}
                        className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Request to Join
                      </button>
                    ) : (
                      <span className="flex-1 py-2 bg-muted text-muted-foreground rounded-lg text-center text-sm">
                        Invitation Required
                      </span>
                    )}
                    <Link
                      to={`/organizations/${org.slug}`}
                      className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDirectory;
