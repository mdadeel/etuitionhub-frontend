import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import StudentDashboard from "../components/Dashboard/StudentDashboard";
import TutorDashboard from "../components/Dashboard/TutorDashboard";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import Profile from "../components/Dashboard/Profile";
import DashUsers from "../components/Dashboard/DashUsers";
import TutorSessions from "../components/Dashboard/TutorSessions";
import Bookmarks from "../components/Dashboard/Bookmarks";
import BillingHistory from "../components/Dashboard/BillingHistory";
import NotificationPage from "../components/Dashboard/NotificationPage";
import VerificationFlow from "../components/Dashboard/VerificationFlow";
import TutorWallet from "../components/Dashboard/TutorWallet";
import TutorWithdraw from "../components/Dashboard/TutorWithdraw";
import AdminWithdrawals from "./AdminWithdrawals";
import AdminAuditLogs from "./AdminAuditLogs";
import DashSettings from "../components/Dashboard/DashSettings";
import { Menu, X, Home } from "lucide-react";
import NotificationBell from "../components/shared/NotificationBell";
import { cn } from "@/lib/utils";

/**
 * Restricts a route to the admin role only.
 * Waits for dbUser to load before deciding — prevents false redirects.
 */
const AdminRoute = ({ children, role }) => {
  const { loading } = useAuth();
  if (loading) return null; // wait silently — Dashboard already shows a spinner
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Inline loading state - no spinner page
  if (loading || (user && !dbUser)) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-72 bg-card border-r border-border hidden lg:flex" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="size-5 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">{t("dashboard_loading", "Loading dashboard...")}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <DashboardSidebar role={role} />

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
        <DashboardSidebar role={role} />
      </div>

      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative flex flex-col safe-bottom">
        {/* Dashboard Top Navbar */}
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left: Mobile menu toggle + breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-background rounded-none border border-border transition-colors"
              >
                <Menu size={20} className="text-muted-foreground" />
              </button>
              <nav className="flex items-center gap-2 font-heading font-black text-[10px] uppercase tracking-widest">
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <Home size={12} />
                  <span className="hidden sm:inline">{t("nav.home", "Home")}</span>
                </Link>
                <span className="text-[#E2E8F0] font-normal">/</span>
                <span className="text-foreground">{t("nav.dashboard", "Dashboard")}</span>
              </nav>
            </div>

            {/* Right: User info + notifications */}
            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right">
                  <p className="text-xs font-heading font-black text-foreground uppercase tracking-wider">
                    {user?.displayName?.split(" ")[0]}
                  </p>
                  <p className="text-[9px] font-heading font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{role}</p>
                </div>
                <div className="size-9 bg-muted rounded-none overflow-hidden border border-border">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="size-full object-cover rounded-none"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-muted-foreground text-xs font-heading font-black uppercase">
                      {user?.displayName?.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-grow p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route
                index
                element={
                  role === "admin" ? (
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
                  <AdminRoute role={role}>
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
                  <AdminRoute role={role}>
                    <AdminWithdrawals />
                  </AdminRoute>
                }
              />

              <Route
                path="admin/settings"
                element={
                  <AdminRoute role={role}>
                    <DashSettings />
                  </AdminRoute>
                }
              />

              <Route
                path="admin/audit-logs"
                element={
                  <AdminRoute role={role}>
                    <AdminAuditLogs />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
