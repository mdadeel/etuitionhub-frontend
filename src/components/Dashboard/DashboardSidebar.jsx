import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Users,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Banknote,
  Bookmark,
  Bell,
  Inbox,
  Wallet,
  ArrowDownToLine,
  Settings,
  History,
  DollarSign,
  Scale,
  BookOpen,
  BookmarkCheck,
  Mail,
  ClipboardCheck,
  FileStack,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const DashboardSidebar = ({ role }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, dbUser, logout } = useAuth();

  const getRoleInfo = () => {
    const r = role?.toLowerCase();
    if (r === "admin") return { label: "Administrator", variant: "error" };
    if (r === "tutor") return { label: "Verified Tutor", variant: "primary" };
    return { label: "Student Member", variant: "secondary" };
  };

  const roleInfo = getRoleInfo();

  const menuItems = [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/dashboard/profile", label: "My Profile", icon: User },
    { path: "/dashboard/requests", label: "Requests", icon: Inbox },
    { path: "/dashboard/notifications", label: "Notifications", icon: Bell },
  ];

  if (role?.toLowerCase() === "admin") {
    menuItems.push({
      path: "/dashboard/users",
      label: "User Directory",
      icon: Users,
    });
    menuItems.push({
      path: "/dashboard/admin/withdrawals",
      label: "Withdrawals",
      icon: ArrowDownToLine,
    });
    menuItems.push({
      path: "/dashboard/admin/settings",
      label: "Settings",
      icon: Settings,
    });
    menuItems.push({
      path: "/dashboard/admin/audit-logs",
      label: "Audit Logs",
      icon: History,
    });
    menuItems.push({
      path: "/dashboard/admin/payments",
      label: "Payment Queue",
      icon: DollarSign,
    });
    menuItems.push({
      path: "/dashboard/admin/contacts",
      label: "Contact Submissions",
      icon: Mail,
    });
    menuItems.push({
      path: "/dashboard/disputes",
      label: "Disputes",
      icon: Scale,
    });
  } else if (role?.toLowerCase() === "tutor") {
    menuItems.push({
      path: "/dashboard/wallet",
      label: "Wallet",
      icon: Wallet,
    });
    menuItems.push({
      path: "/dashboard/withdraw",
      label: "Withdraw",
      icon: ArrowDownToLine,
    });
    menuItems.push({
      path: "/dashboard/assignments",
      label: "Assignments",
      icon: BookOpen,
    });
    menuItems.push({
      path: "/dashboard/templates",
      label: "Templates",
      icon: FileStack,
    });
  } else {
    menuItems.push({
      path: "/dashboard/billing",
      label: "Billing & Receipts",
      icon: Banknote,
    });
    menuItems.push({
      path: "/dashboard/relationships",
      label: "My Relationships",
      icon: Users,
    });
    menuItems.push({
      path: "/dashboard/bookmarks",
      label: "Bookmarks",
      icon: Bookmark,
    });
    menuItems.push({
      path: "/dashboard/saved-searches",
      label: "Saved Searches",
      icon: BookmarkCheck,
    });
    menuItems.push({
      path: "/dashboard/session-confirmations",
      label: "Confirm Sessions",
      icon: ClipboardCheck,
    });
    menuItems.push({
      path: "/dashboard/assignments",
      label: "Assignments",
      icon: BookOpen,
    });
    menuItems.push({
      path: "/dashboard/disputes",
      label: "My Disputes",
      icon: Scale,
    });
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
    } catch {
      toast.error("Sign out failed");
    }
  };

  return (
    <aside className="w-72 h-full hidden lg:flex flex-col flex-shrink-0 relative border-r border-border bg-card rounded-r-xl">
      <div className="flex flex-col h-full py-8 px-6">
        {/* User Identity Section */}
        <div className="mb-10 px-2 relative">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-background border border-border transition-all hover:bg-muted">
            <div className="relative">
              <Avatar className="size-12 rounded-none border-2 border-white shadow-none">
                <AvatarImage src={dbUser?.photoURL || user?.photoURL} alt={dbUser?.displayName || user?.displayName} gender={dbUser?.gender} className="object-cover rounded-none" />
                <AvatarFallback className="bg-slate-900 border border-slate-800 rounded-none animate-none" />
              </Avatar>
              {role?.toLowerCase() !== "student" &&
                dbUser?._id !== "tutor_001" && (
                  <div className="absolute -top-1 -right-1 size-4 bg-primary rounded-none border-2 border-white flex items-center justify-center">
                    <ShieldCheck size={10} className="text-primary-foreground" />
                  </div>
                )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-label font-semibold text-foreground truncate uppercase tracking-wider">
                {user?.displayName || "User"}
              </span>
              <span className="text-[9px] font-heading font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-grow space-y-8">
          <div>
            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-5 px-4">
              {t("sidebar.main_menu", "Main Menu")}
            </p>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group border",
                        isActive
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={16}
                          className={cn(
                            "transition-transform duration-300",
                            isActive
                              ? "scale-110"
                              : "opacity-55 group-hover:opacity-100",
                          )}
                        />
                        <span className="text-[10px] font-label font-semibold tracking-widest uppercase mt-0.5">
                          {item.label}
                        </span>
                      </div>
                      {isActive && (
                        <ChevronRight size={12} className="opacity-60" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 mt-auto pt-6 border-t border-border px-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 transition-all group"
          >
            <LogOut
              size={16}
              className="opacity-60 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-[10px] font-label font-semibold tracking-widest uppercase mt-0.5">
              {t("sidebar.sign_out", "Sign Out")}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
