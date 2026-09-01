import { useState, useEffect, Fragment, Suspense } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Settings, ChevronRight, Inbox } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import NotificationBell from "./NotificationBell";
import { DashboardSkeleton } from "./skeletons";
import { cn } from "@/lib/utils";

const RouteFallback = () => (
  <div className="flex items-center justify-center py-24">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const DashboardLayout = ({ children }) => {
  const { t } = useTranslation();
  const { user, dbUser, loading, configError, dbUserError, retryDbUser, orgContext } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const globalRole = dbUser?.globalRole;

  const getSettingsPath = () => {
    if (globalRole === 'super_admin') return '/super-admin/settings';
    if (orgContext) return `/dashboard/org/${orgContext.orgId || orgContext.slug}/settings`;
    if (dbUser?.role === 'admin') return '/admin/settings';
    return '/dashboard/profile';
  };

  const getSettingsLabel = () => {
    if (globalRole === 'super_admin') return 'Platform Settings';
    if (orgContext) return 'Organization Settings';
    if (dbUser?.role === 'admin') return 'Admin Settings';
    return 'Account Settings';
  };

  const getBreadcrumbExtra = () => {
    const path = location.pathname;
    if (path.includes('/super-admin')) return 'Super Admin';
    if (path.includes('/org/')) return 'Organization';
    if (path.includes('/admin/')) return 'Admin';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/notifications')) return 'Notifications';
    if (path.includes('/bookmarks')) return 'Bookmarks';
    if (path.includes('/wallet')) return 'Wallet';
    if (path.includes('/sessions')) return 'Sessions';
    if (path.includes('/billing')) return 'Billing';
    return null;
  };

  const renderBreadcrumbs = () => {
    const path = location.pathname;
    
    let items = [];

    if (path.startsWith("/super-admin")) {
      items.push({ label: "Super Admin", to: "/super-admin", isLast: false });
      if (path === "/super-admin" || path === "/super-admin/") {
        items[0].isLast = true;
      } else if (path.includes("/org-requests")) {
        items.push({ label: "Organizations", to: "/super-admin/organizations", isLast: false });
        items.push({ label: "Org Requests", isLast: true });
      } else if (path.includes("/organizations")) {
        items.push({ label: "Organizations", isLast: true });
      } else if (path.includes("/analytics")) {
        items.push({ label: "Analytics", isLast: true });
      } else if (path.includes("/subscriptions")) {
        items.push({ label: "Subscriptions", isLast: true });
      } else if (path.includes("/users")) {
        items.push({ label: "Users", isLast: true });
      } else if (path.includes("/tutors")) {
        items.push({ label: "Tutors", isLast: true });
      } else if (path.includes("/tuitions")) {
        items.push({ label: "Tuitions", isLast: true });
      } else if (path.includes("/verifications")) {
        items.push({ label: "Verifications", isLast: true });
      } else if (path.includes("/audit-logs")) {
        items.push({ label: "Audit Logs", isLast: true });
      } else if (path.includes("/settings")) {
        items.push({ label: "Settings", isLast: true });
      } else {
        items[0].isLast = true;
      }
    } else if (path.startsWith("/admin")) {
      items.push({ label: "Admin", to: "/admin", isLast: false });
      if (path === "/admin" || path === "/admin/") {
        items[0].isLast = true;
      } else if (path.includes("/withdrawals")) {
        items.push({ label: "Withdrawals", isLast: true });
      } else if (path.includes("/payments")) {
        items.push({ label: "Payments", isLast: true });
      } else if (path.includes("/settings")) {
        items.push({ label: "Settings", isLast: true });
      } else if (path.includes("/audit-logs")) {
        items.push({ label: "Audit Logs", isLast: true });
      } else if (path.includes("/contacts")) {
        items.push({ label: "Contacts", isLast: true });
      } else {
        items[0].isLast = true;
      }
    } else {
      // Base "Dashboard" item
      items.push({ label: t("nav.dashboard", "Dashboard"), to: "/dashboard", isLast: false });
      if (path === "/dashboard" || path === "/dashboard/") {
        items[0].isLast = true;
      } else if (path.includes("/org/")) {
        items.push({ label: "Organization", to: `/dashboard/org/${orgContext?.orgId || 'context'}`, isLast: false });
        if (path.includes("/tuitions")) {
          items.push({ label: "Tuitions", isLast: true });
        } else if (path.includes("/sessions")) {
          items.push({ label: "Sessions", isLast: true });
        } else if (path.includes("/members")) {
          items.push({ label: "Members", isLast: true });
        } else if (path.includes("/students")) {
          items.push({ label: "Students", isLast: true });
        } else if (path.includes("/tutors")) {
          items.push({ label: "Tutors", isLast: true });
        } else if (path.includes("/classes")) {
          items.push({ label: "Classes", isLast: true });
        } else if (path.includes("/subjects")) {
          items.push({ label: "Subjects", isLast: true });
        } else if (path.includes("/assignments")) {
          items.push({ label: "Assignments", isLast: true });
        } else if (path.includes("/materials")) {
          items.push({ label: "Materials", isLast: true });
        } else if (path.includes("/announcements")) {
          items.push({ label: "Announcements", isLast: true });
        } else if (path.includes("/messages")) {
          items.push({ label: "Messages", isLast: true });
        } else if (path.includes("/attendance")) {
          items.push({ label: "Attendance", isLast: true });
        } else if (path.includes("/payments")) {
          items.push({ label: "Payments", isLast: true });
        } else if (path.includes("/billing")) {
          items.push({ label: "Subscription", isLast: true });
        } else if (path.includes("/roles")) {
          items.push({ label: "Roles", isLast: true });
        } else if (path.includes("/analytics")) {
          items.push({ label: "Analytics", isLast: true });
        } else if (path.includes("/settings")) {
          items.push({ label: "Settings", isLast: true });
        } else {
          items[1].isLast = true;
        }
      } else {
        const extra = getBreadcrumbExtra();
        if (extra) {
          items.push({ label: extra, isLast: true });
        } else {
          items[0].isLast = true;
        }
      }
    }

    return (
      <nav className="hidden md:flex items-center gap-1.5 text-[11px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
        {items.map((item, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <ChevronRight size={10} />}
            {item.isLast ? (
              <span className="text-foreground">{item.label}</span>
            ) : (
              <Link to={item.to} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            )}
          </Fragment>
        ))}
      </nav>
    );
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  if (configError) {
    return <div className="flex items-center justify-center min-h-[50vh] p-8 text-destructive">Could not load app config: {configError}</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (user && !dbUser) {
    if (dbUserError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 gap-4 min-h-[50vh]">
          <p className="text-destructive">{dbUserError.message || 'Failed to load profile'}</p>
          <button type="button" onClick={retryDbUser} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Retry</button>
        </div>
      );
    }
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <DashboardSidebar className="hidden lg:flex" />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Content */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-card z-[70] lg:hidden transition-transform duration-300 border-r border-border overflow-y-auto",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="sticky top-0 z-10 flex justify-end p-2 bg-card">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-background rounded-lg border border-border transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        <DashboardSidebar />
      </div>

      <main className="flex-1 h-full overflow-x-hidden relative flex flex-col safe-bottom overflow-y-auto">
        {/* Dashboard Top Navbar */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between h-14 px-6">
            {/* Left: Mobile menu toggle + Greeting + Breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-background rounded-lg border border-border transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-muted-foreground" />
                ) : (
                  <Menu size={20} className="text-muted-foreground" />
                )}
              </button>
              {/* Breadcrumb */}
              {renderBreadcrumbs()}
            </div>

            {/* Right: Notifications + Settings */}
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/requests"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
                title="Requests"
              >
                <Inbox size={20} />
              </Link>
              <NotificationBell />
              <Link
                to={getSettingsPath()}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
                title={getSettingsLabel()}
              >
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-grow p-4 md:p-6 lg:p-8">
          <div className="w-full">
            <Suspense fallback={<RouteFallback />}>
              {children}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
