import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Building, MapPin, Users, Globe, Mail, ArrowLeft, CheckCircle2, Loader2, Clock } from "lucide-react";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import SEO from "../components/shared/SEO";

const OrganizationDetails = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinStatus, setJoinStatus] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/organizations/slug/${slug}`);
        setOrganization(res.data.data);
      } catch {
        setError("Failed to load organization details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrgDetails();
  }, [slug]);

  useEffect(() => {
    if (!user || !organization) return;

    const checkJoinStatus = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${organization._id}/join-requests/my`);
        if (res.data.data) {
          setJoinStatus('pending');
        }
      } catch {
        // Not pending or not authed - fine
      }
    };

    checkJoinStatus();
  }, [user, organization]);

  const handleJoinRequest = async () => {
    if (!user) {
      toast.error("Please sign in to request joining this organization");
      return;
    }

    try {
      setJoining(true);
      const res = await api.post(`/api/v1/organizations/${organization._id}/join-request`, {
        message: joinMessage || `I would like to join ${organization.name}`
      });
      if (res.data.autoApproved) {
        toast.success(`Welcome to ${organization.name}!`);
      } else {
        setJoinStatus('pending');
        toast.success("Join request submitted! The organization admin will review your request.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to submit join request";
      if (errorMsg.includes('invitation')) {
        toast.error("This organization requires an invitation. Please contact an admin directly.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setJoining(false);
    }
  };

  const handleWithdrawRequest = async () => {
    try {
      setJoining(true);
      const res = await api.get(`/api/v1/organizations/${organization._id}/join-requests/my`);
      const myRequest = res.data.data;
      if (myRequest) {
        await api.delete(`/api/v1/organizations/${organization._id}/join-requests/${myRequest._id}`);
        setJoinStatus(null);
        toast.success("Join request withdrawn");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to withdraw request");
    } finally {
      setJoining(false);
    }
  };

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
      <SEO 
        title={`${organization.name} | eTuitionBD`} 
        description={organization.profile?.bio || `Find tuition programs, coaching courses, and academic batches from ${organization.name} on eTuitionBD.`} 
      />
      {/* Hero Cover Banner */}
      <div className="h-48 md:h-64 bg-primary/10 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
      </div>

      <div className="w-full px-4 md:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-card rounded-lg shadow-xl border border-border p-6 md:p-10 mb-8 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="size-32 md:size-40 bg-background border-4 border-card rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
              {organization.profile?.logo ? (
                <img src={organization.profile.logo} alt={organization.name} className="size-full object-cover" />
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
                  {organization.status === 'active' && (
                    <span title="Verified Organization">
                      <CheckCircle2 className="size-6 text-success" />
                    </span>
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium mb-4">
                  {organization.profile?.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-primary" />
                      <span>{organization.profile.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-primary" />
                    <span>Educational Institution</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row gap-3">
                {joinStatus === 'pending' ? (
                  <Button 
                    variant="outline" 
                    disabled={joining}
                    onClick={handleWithdrawRequest}
                    className="shadow-lg"
                  >
                    {joining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                    Request Pending - Withdraw
                  </Button>
                ) : (organization.settings?.joinMode || 'approval_required') === 'invite_only' ? (
                  <Button 
                    variant="outline" 
                    disabled
                    className="shadow-lg opacity-60"
                    title="This organization requires an invitation to join"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Invitation Required
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={joinMessage}
                      onChange={(e) => setJoinMessage(e.target.value)}
                      placeholder="Why do you want to join? (optional)"
                      maxLength={500}
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button 
                      variant="default" 
                      className="shadow-lg hover:-translate-y-0.5 transition-all"
                      onClick={handleJoinRequest}
                      disabled={joining}
                    >
                      {joining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Request to Join
                    </Button>
                  </div>
                )}
                {(organization.profile?.publicEmail || organization.contact?.email) && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      window.location.href = `mailto:${organization.profile?.publicEmail || organization.contact?.email}`;
                    }}
                  >
                    Contact
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs / Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-lg border border-border p-8">
              <h2 className="text-xl font-bold text-foreground mb-4 font-heading">About Us</h2>
              <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line">
                {organization.profile?.description || "This organization has not provided a description yet."}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Contact Information</h3>
              <ul className="space-y-4">
                {organization.profile?.publicEmail && (
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Mail className="size-5 text-muted-foreground flex-shrink-0" />
                    <span>{organization.profile.publicEmail}</span>
                  </li>
                )}
                {organization.profile?.publicPhone && (
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Globe className="size-5 text-muted-foreground flex-shrink-0" />
                    <span>{organization.profile.publicPhone}</span>
                  </li>
                )}
                {!organization.profile?.publicEmail && !organization.profile?.publicPhone && (
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Mail className="size-5 text-muted-foreground flex-shrink-0" />
                    <span>Contact admin to reveal email</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
