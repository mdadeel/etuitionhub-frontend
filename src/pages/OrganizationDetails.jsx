import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Building, MapPin, Users, Globe, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { Button } from "@/components/ui/button";

const OrganizationDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        setLoading(true);
        // Note: The backend needs an endpoint `GET /api/organizations/slug/:slug` or similar
        // If we don't have one, we might need to fetch all and filter or add the endpoint
        const res = await api.get(`/api/v1/organizations`);
        const orgs = res.data.data || [];
        const org = orgs.find(o => o.slug === slug);
        
        if (org) {
          setOrganization(org);
        } else {
          setError("Organization not found.");
        }
      } catch (err) {
        setError("Failed to load organization details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mt-20"></div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-foreground mt-20">{error || "Organization not found"}</h2>
        <Link to="/organizations">
          <Button className="mt-6" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      {/* Hero Cover Banner */}
      <div className="h-48 md:h-64 bg-primary/10 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-10 mb-8 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="size-32 md:size-40 bg-background border-4 border-card rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
              {organization.logo ? (
                <img src={organization.logo} alt={organization.name} className="size-full object-cover" />
              ) : (
                <Building className="size-16 text-primary opacity-50" />
              )}
            </div>
          </div>

          {/* Org Info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-2 flex items-center gap-3">
                  {organization.name}
                  {organization.isActive && (
                    <span title="Verified Organization">
                      <CheckCircle2 className="size-6 text-green-500" />
                    </span>
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-primary" />
                    <span>Dhaka, Bangladesh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-primary" />
                    <span>Educational Institution</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row gap-3">
                <Button variant="default" className="shadow-lg hover:-translate-y-0.5 transition-all">
                  Request to Join
                </Button>
                <Button variant="outline">
                  Contact
                </Button>
              </div>
            </div>

            <div className="mt-6 prose prose-slate dark:prose-invert max-w-none">
              <p className="text-foreground/80 leading-relaxed text-lg">
                {organization.description || "This organization has not provided a description yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Content Tabs / Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 font-heading">Available Tuitions</h2>
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">This organization has not posted any public tuitions yet.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <Mail className="size-5 text-muted-foreground flex-shrink-0" />
                  <span>Contact admin to reveal email</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <Globe className="size-5 text-muted-foreground flex-shrink-0" />
                  <a href="#" className="text-primary hover:underline">Website not provided</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
