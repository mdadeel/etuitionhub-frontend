import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building, MapPin, Users, Search, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../services/api";

const OrganizationDirectory = () => {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/organizations?status=active');
      setOrganizations(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase()) || 
    org.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-heading font-extrabold text-foreground sm:text-5xl mb-4">
            {t("orgDirectory.title", "Coaching Centers & Organizations")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("orgDirectory.subtitle", "Discover verified educational institutions and specialized coaching centers in your area.")}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm"
              placeholder={t("orgDirectory.searchPlaceholder", "Search by name or subject...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Organizations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-card h-64 rounded-xl border border-border"></div>
            ))}
          </div>
        ) : filteredOrgs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map(org => (
              <Link 
                to={`/organizations/${org.slug}`} 
                key={org._id}
                className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-32 bg-primary/10 relative">
                  {/* Banner/Cover Image could go here */}
                  <div className="absolute -bottom-8 left-6">
                    <div className="size-16 bg-card border-4 border-card rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                      {org.logo ? (
                        <img src={org.logo} alt={org.name} className="size-full object-cover" />
                      ) : (
                        <Building className="size-8 text-primary opacity-50" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-10 pb-6 px-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {org.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                    {org.description || "An educational organization on e-TuitionBD."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {org.settings?.allowPublicProfile && (
                       <div className="flex items-center text-xs text-muted-foreground gap-1">
                         <MapPin size={14} className="text-primary/70" />
                         <span className="truncate">Dhaka, BD</span>
                       </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-xl border border-border">
            <Building className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">{t("orgDirectory.noResults", "No organizations found")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("orgDirectory.tryDifferentSearch", "Try adjusting your search terms.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDirectory;
