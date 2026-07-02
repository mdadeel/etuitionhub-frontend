import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  ShieldCheck,
  DoorOpen,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboardMenuItems } from "./getDashboardMenuItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import Logo from "@/components/shared/Logo";
import api from "../../services/api";

const DashboardSidebar = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dbUser, logout, orgContext, orgRole, myOrgs, switchOrg, hasPermission, refreshUserFromDB } = useAuth();
  const globalRole = dbUser?.globalRole;
  const legacyRole = dbUser?.role?.toLowerCase() || 'student';
  const effectiveRole = orgContext ? orgRole : legacyRole;

  const getRoleInfo = () => {
    if (globalRole === 'super_admin') return { label: "Super Admin", variant: "error" };
    if (orgContext) {
      if (orgRole === 'org_admin') return { label: "Org Admin", variant: "primary" };
      if (orgRole === 'teacher') return { label: "Org Teacher", variant: "primary" };
      return { label: "Org Student", variant: "secondary" };
    }
    const r = legacyRole;
    if (r === "admin") return { label: "Admin", variant: "error" };
    if (r === "tutor") return { label: "Tutor", variant: "primary" };
    return { label: "Student", variant: "secondary" };
  };

  const roleInfo = getRoleInfo();

  const menuItems = getDashboardMenuItems({ globalRole, orgContext, orgRole, legacyRole, hasPermission });

  // Group menu items by their group field
  const groupedItems = menuItems.reduce((acc, item) => {
    const group = item.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
    } catch {
      toast.error("Sign out failed");
    }
  };

  const handleLeaveOrg = async () => {
    if (!orgContext?.orgId) return;
    if (!confirm('Are you sure you want to leave this organization?')) return;
    try {
      await api.post(`/api/v1/organizations/${orgContext.orgId}/leave`);
      toast.success('Left organization');
      localStorage.removeItem('x-org-id');
      if (refreshUserFromDB && user?.email) {
        await refreshUserFromDB(user.email);
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to leave organization');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={cn("w-64 h-full flex flex-col flex-shrink-0 border-r border-border bg-card", className)}>
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-border flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo boxSize="size-8" iconSize="size-5" textSize="text-sm" />
        </Link>
      </div>

      {/* User Identity */}
      <div className="px-4 py-4 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border transition-all hover:bg-muted">
          <div className="relative shrink-0">
            <Avatar className="size-9 rounded-lg border border-border shadow-none">
              <AvatarImage src={dbUser?.photoURL || user?.photoURL} alt={dbUser?.displayName || user?.displayName} gender={dbUser?.gender} className="object-cover rounded-lg" />
              <AvatarFallback className="bg-slate-900 border border-slate-800 rounded-lg animate-none" />
            </Avatar>
            {effectiveRole !== "student" && dbUser?._id !== "tutor_001" && (
              <div className="absolute -top-1 -right-1 size-3.5 bg-primary rounded-full border-2 border-card flex items-center justify-center">
                <ShieldCheck size={8} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold text-foreground truncate">
              {user?.displayName || "User"}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {roleInfo.label}
            </span>
          </div>
        </div>

        {/* Organization Selector */}
        {myOrgs?.length > 0 && (
          <div className="mt-3">
            <label htmlFor="org-select" className="sr-only">Select Organization</label>
            <select
              id="org-select"
              className="w-full text-[11px] p-2 bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
              value={orgContext?.orgId || ''}
              onChange={(e) => switchOrg(e.target.value)}
            >
              <option value="" disabled>Select Organization</option>
              {myOrgs.map(org => (
                <option key={org.orgId} value={org.orgId}>
                  {org.name}
                </option>
              ))}
            </select>
            {orgContext && (
              <button
                onClick={handleLeaveOrg}
                className="mt-1.5 w-full flex items-center gap-1.5 px-2 py-1.5 text-[10px] text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <DoorOpen className="size-3" />
                Leave Organization
              </button>
            )}
          </div>
        )}
        {myOrgs?.length === 0 && !orgContext && (
          <div className="mt-3 text-[10px] text-muted-foreground text-center">
            <Link to="/organizations" className="text-primary hover:underline">Browse Organizations</Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 min-h-0">
        <ul>
          {Object.entries(groupedItems).map(([group, items]) => (
            <li key={group}>
              <p className="pt-5 pb-1.5 px-3 first:pt-0 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">
                {group}
              </p>
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative text-[12px] font-medium",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-primary rounded-r" />
                      )}
                      {Icon && (
                        <Icon
                          size={16}
                          className={cn(
                            "transition-opacity duration-200 shrink-0",
                            active ? "opacity-100" : "opacity-50 group-hover:opacity-100",
                          )}
                        />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </li>
          ))}
        </ul>
      </div>

      {/* Sign Out */}
      <div className="flex-shrink-0 px-3 py-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all group"
        >
          <LogOut size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          <span className="text-[12px] font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
