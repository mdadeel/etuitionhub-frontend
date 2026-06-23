import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import { 
  Building2, 
  Settings, 
  Image as ImageIcon, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Loader2,
  Building,
  LogOut,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

const OrgSettings = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    banner: "",
    description: "",
    publicEmail: "",
    publicPhone: "",
    address: "",
    allowPublicListings: true,
    requireInviteToJoin: true
  });

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/organizations/${orgId}`);
        const org = res.data.data;
        if (org) {
          setFormData({
            name: org.name || "",
            slug: org.slug || "",
            logo: org.profile?.logo || "",
            banner: org.profile?.banner || "",
            description: org.profile?.description || "",
            publicEmail: org.profile?.publicEmail || "",
            publicPhone: org.profile?.publicPhone || "",
            address: org.profile?.address || "",
            allowPublicListings: org.settings?.allowPublicListings ?? true,
            requireInviteToJoin: org.settings?.requireInviteToJoin ?? true
          });
        }
      } catch (error) {
        toast.error("Failed to load organization settings");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [orgId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        slug: formData.slug,
        profile: {
          logo: formData.logo,
          banner: formData.banner,
          description: formData.description,
          publicEmail: formData.publicEmail,
          publicPhone: formData.publicPhone,
          address: formData.address
        },
        settings: {
          allowPublicListings: formData.allowPublicListings,
          requireInviteToJoin: formData.requireInviteToJoin
        }
      };

      await api.patch(`/api/v1/organizations/${orgId}`, payload);
      toast.success("Organization settings updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLeaveOrganization = async () => {
    if (!window.confirm("Are you sure you want to leave this organization? You will lose access to all organization resources.")) {
      return;
    }
    
    try {
      setLeaving(true);
      await api.delete(`/api/v1/organizations/${orgId}/leave`);
      toast.success("You have left the organization");
      navigate("/organizations");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to leave organization");
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organization Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your organization's profile, visibility, and contact details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Info Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">General Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Apex Coaching Center"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. apex-coaching"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be your public URL: /organizations/{formData.slug || 'slug'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">About the Organization</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your organization's mission, subjects taught, and achievements..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Media Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Branding & Media</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  type="url"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner">Banner URL</Label>
                <Input
                  id="banner"
                  name="banner"
                  type="url"
                  value={formData.banner}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Public Contact Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="publicEmail" className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-muted-foreground"/> Public Email</Label>
                <Input
                  id="publicEmail"
                  name="publicEmail"
                  type="email"
                  value={formData.publicEmail}
                  onChange={handleChange}
                  placeholder="contact@apex.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicPhone" className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-muted-foreground"/> Public Phone</Label>
                <Input
                  id="publicPhone"
                  name="publicPhone"
                  type="tel"
                  value={formData.publicPhone}
                  onChange={handleChange}
                  placeholder="+880 1234 567890"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-muted-foreground"/> Office Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, Dhaka, Bangladesh"
              />
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="allowPublicListings" className="text-base">Public Directory Listing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow your organization to appear in the public /organizations directory.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input 
                  type="checkbox" 
                  id="allowPublicListings"
                  name="allowPublicListings"
                  checked={formData.allowPublicListings} 
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="requireInviteToJoin" className="text-base">Require Invitations</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent users from requesting to join. They must be explicitly invited by an Admin.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input 
                  type="checkbox" 
                  id="requireInviteToJoin"
                  name="requireInviteToJoin"
                  checked={formData.requireInviteToJoin} 
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>

      {/* Danger Zone */}
      <div className="bg-card border border-red-200 dark:border-red-900/50 rounded-xl shadow-sm overflow-hidden mt-8">
        <div className="border-b border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-6 py-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Leave Organization</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Once you leave, you will lose access to all organization resources and data.
              </p>
            </div>
            <button
              onClick={handleLeaveOrganization}
              disabled={leaving}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-70"
            >
              {leaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              {leaving ? "Leaving..." : "Leave Organization"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgSettings;
