import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { lazy, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import { Menu, X, Home, Settings } from "lucide-react";
import NotificationBell from "../components/shared/NotificationBell";

import { DashboardSkeleton } from "@/components/shared/skeletons";
import { cn } from "@/lib/utils";

// Lazy-loaded role-specific components — only downloaded when the route matches
const StudentDashboard = lazy(() => import("../components/Dashboard/StudentDashboard"));
const TutorDashboard = lazy(() => import("../components/Dashboard/TutorDashboard"));
const AdminDashboard = lazy(() => import("../components/Dashboard/AdminDashboard"));
const Profile = lazy(() => import("../components/Dashboard/Profile"));
const DashUsers = lazy(() => import("../components/Dashboard/DashUsers"));
const TutorSessions = lazy(() => import("../components/Dashboard/TutorSessions"));
const Bookmarks = lazy(() => import("../components/Dashboard/Bookmarks"));
const BillingHistory = lazy(() => import("../components/Dashboard/BillingHistory"));
const NotificationPage = lazy(() => import("../components/Dashboard/NotificationPage"));
const OrgDashboardLayout = lazy(() => import("../components/Dashboard/OrgDashboardLayout"));
const SuperAdminDashboardLayout = lazy(() => import("../components/Dashboard/SuperAdminDashboardLayout"));
const VerificationFlow = lazy(() => import("../components/Dashboard/VerificationFlow"));
const TutorWallet = lazy(() => import("../components/Dashboard/TutorWallet"));
const TutorWithdraw = lazy(() => import("../components/Dashboard/TutorWithdraw"));
const AdminWithdrawals = lazy(() => import("./AdminWithdrawals"));
const AdminAuditLogs = lazy(() => import("./AdminAuditLogs"));
const DashSettings = lazy(() => import("../components/Dashboard/DashSettings"));
const DisputeWorkspace = lazy(() => import("../components/Dashboard/DisputeWorkspace"));
const Assignments = lazy(() => import("../components/Dashboard/Assignments"));
const HireRequests = lazy(() => import("../components/Dashboard/HireRequests"));
const ActiveRelationships = lazy(() => import("../components/Dashboard/ActiveRelationships"));
const DashPayments = lazy(() => import("../components/Dashboard/DashPayments"));
const SavedSearchAlerts = lazy(() => import("../components/Dashboard/SavedSearchAlerts"));
const AdminContacts = lazy(() => import("../components/Dashboard/AdminContacts"));
const SessionConfirmationList = lazy(() => import("../components/Dashboard/SessionConfirmationList"));
const TemplateManager = lazy(() => import("../components/Dashboard/TemplateManager"));

const RouteFallback = () => (
  <div className="flex items-center justify-center py-24">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

/**
 * Restricts a route to the admin role only.
 * Waits for dbUser to load before deciding — prevents false redirects.
 */
const AdminRoute = ({ children, role, globalRole }) => {
  const { loading } = useAuth();
  if (loading) return null;
  if (role !== "admin" && globalRole !== "super_admin") return <Navigate to="/dashboard" replace />;
  return children;
};

/**
 * Dashboard Component — role-aware routing hub with Apple Design System.
 */
const Dashboard = () => {
  const { t } = useTranslation();
  const { user, dbUser, loading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = dbUser?.role?.toLowerCase() || (loading ? "" : "student");
  const globalRole = dbUser?.globalRole;
  const { orgContext, orgRole } = useAuth();
  
  const getRoleLabel = () => {
    if (globalRole === 'super_admin') return 'Super Admin';
    if (orgContext) {
      if (orgRole === 'org_admin') return 'Org Admin';
      if (orgRole === 'teacher') return 'Org Teacher';
      return 'Org Student';
    }
    return role;
  };

  const getSettingsPath = () => {
    if (globalRole === 'super_admin') return '/dashboard/super-admin/settings';
    if (orgContext) return `/dashboard/org/${orgContext.orgId || orgContext.slug}/settings`;
    if (role === 'admin') return '/dashboard/admin/settings';
    return '/dashboard/profile';
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Inline loading state - show dashboard skeleton
  if (loading || (user && !dbUser)) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <DashboardSidebar />

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

      <main className={`flex-1 h-full overflow-x-hidden relative flex flex-col safe-bottom ${location.pathname === '/dashboard/messages' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        {/* Dashboard Top Navbar */}
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-14 px-6">
            {/* Left: Mobile menu toggle + breadcrumb */}
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
              <nav className="flex items-center gap-2 text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <Home size={12} />
                  <span className="hidden sm:inline">{t("nav.home", "Home")}</span>
                </Link>
                <span className="text-[#E2E8F0] font-normal">/</span>
                <span className="text-foreground font-semibold">{t("nav.dashboard", "Dashboard")}</span>
              </nav>
            </div>

            {/* Right: Notifications + Settings */}
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Link
                to={getSettingsPath()}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </Link>
            </div>
          </div>

        </header>

        {/* Main Content */}
        <div className="flex-grow p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Multi-Tenant Dashboard Routes */}
                <Route path="org/:orgId/*" element={<OrgDashboardLayout />} />
                <Route path="super-admin/*" element={<SuperAdminDashboardLayout />} />

                <Route
                  index
                  element={
                    globalRole === "super_admin" ? (
                      <Navigate to="/dashboard/super-admin" replace />
                    ) : orgContext ? (
                      <Navigate to={`/dashboard/org/${orgContext.orgId || orgContext.slug}`} replace />
                    ) : role === "admin" ? (
                      <AdminDashboard />
                    ) : role === "tutor" ? (
                      <TutorDashboard />
                    ) : (
                      <StudentDashboard />
                    )
                  }
                />

                <Route
                  path="users"
                  element={
                    <AdminRoute role={role} globalRole={globalRole}>
                      <DashUsers />
                    </AdminRoute>
                  }
                />

                <Route path="profile" element={<Profile />} />

                <Route
                  path="my-profile"
                  element={<Navigate to="/dashboard/profile" replace />}
                />

                <Route
                  path="sessions"
                  element={
                    role === "tutor" ? (
                      <TutorSessions />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />

                <Route
                  path="billing"
                  element={
                    role === "tutor" ? <Navigate to="/dashboard" replace /> : <BillingHistory />
                  }
                />

                <Route
                  path="bookmarks"
                  element={
                    role === "tutor" ? <Navigate to="/dashboard" replace /> : <Bookmarks />
                  }
                />

                <Route
                  path="payments"
                  element={<Navigate to="/dashboard/billing" replace />}
                />
                <Route
                  path="receipts"
                  element={<Navigate to="/dashboard/billing" replace />}
                />

                <Route
                  path="saved-tutors"
                  element={<Navigate to="/dashboard/bookmarks" replace />}
                />
                <Route
                  path="saved-tuitions"
                  element={<Navigate to="/dashboard/bookmarks" replace />}
                />
                <Route path="notifications" element={<NotificationPage />} />
                <Route path="requests" element={<HireRequests />} />
                <Route
                  path="relationships"
                  element={
                    role === "tutor" ? <Navigate to="/dashboard" replace /> : <ActiveRelationships />
                  }
                />
                <Route
                  path="saved-searches"
                  element={
                    role === "tutor" ? <Navigate to="/dashboard" replace /> : <SavedSearchAlerts />
                  }
                />
                <Route
                  path="admin/contacts"
                  element={
                    <AdminRoute role={role} globalRole={globalRole}>
                      <AdminContacts />
                    </AdminRoute>
                  }
                />

                <Route
                  path="verification"
                  element={
                    role === "tutor" ? (
                      <VerificationFlow />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />

                <Route
                  path="wallet"
                  element={
                    role === "tutor" ? (
                      <TutorWallet />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />

                <Route
                  path="withdraw"
                  element={
                    role === "tutor" ? (
                      <TutorWithdraw />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />

                <Route
                  path="admin/withdrawals"
                  element={
                    <AdminRoute role={role} globalRole={globalRole}>
                      <AdminWithdrawals />
                    </AdminRoute>
                  }
                />

                <Route
                  path="admin/settings"
                  element={
                    <AdminRoute role={role} globalRole={globalRole}>
                      <DashSettings />
                    </AdminRoute>
                  }
                />

                <Route
                  path="admin/audit-logs"
                  element={
                    <AdminRoute role={role} globalRole={globalRole}>
                      <AdminAuditLogs />
                    </AdminRoute>
                  }
                />

                <Route
                  path="admin/payments"
                  element={
                    <AdminRoute role={role} globalRole={globalRole}>
                      <DashPayments />
                    </AdminRoute>
                  }
                />

                <Route
                  path="disputes"
                  element={<DisputeWorkspace />}
                />

                <Route
                  path="assignments"
                  element={<Assignments />}
                />
                <Route
                  path="session-confirmations"
                  element={
                    role === "tutor" ? <Navigate to="/dashboard" replace /> : <SessionConfirmationList />
                  }
                />
                <Route
                  path="templates"
                  element={
                    role === "student" ? <Navigate to="/dashboard" replace /> : <TemplateManager />
                  }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
