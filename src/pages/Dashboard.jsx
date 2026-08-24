import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { lazy, Suspense } from "react";
import DashboardLayout from "../components/shared/DashboardLayout";
import { DashboardSkeleton } from "@/components/shared/skeletons";

// Lazy-loaded role-specific components — only downloaded when the route matches
const StudentDashboard = lazy(() => import("../components/Dashboard/StudentDashboard"));
const TutorDashboard = lazy(() => import("../components/Dashboard/TutorDashboard"));
const Profile = lazy(() => import("../components/Dashboard/Profile"));
const TutorSessions = lazy(() => import("../components/Dashboard/TutorSessions"));
const Bookmarks = lazy(() => import("../components/Dashboard/Bookmarks"));
const BillingHistory = lazy(() => import("../components/Dashboard/BillingHistory"));
const NotificationPage = lazy(() => import("../components/Dashboard/NotificationPage"));
const OrgDashboardLayout = lazy(() => import("../components/Dashboard/OrgDashboardLayout"));
const VerificationFlow = lazy(() => import("../components/Dashboard/VerificationFlow"));
const TutorWallet = lazy(() => import("../components/Dashboard/TutorWallet"));
const TutorWithdraw = lazy(() => import("../components/Dashboard/TutorWithdraw"));
const DisputeWorkspace = lazy(() => import("../components/Dashboard/DisputeWorkspace"));
const Assignments = lazy(() => import("../components/Dashboard/Assignments"));
const HireRequests = lazy(() => import("../components/Dashboard/HireRequests"));
const ActiveRelationships = lazy(() => import("../components/Dashboard/ActiveRelationships"));
const SavedSearchAlerts = lazy(() => import("../components/Dashboard/SavedSearchAlerts"));
const SessionConfirmationList = lazy(() => import("../components/Dashboard/SessionConfirmationList"));
const TemplateManager = lazy(() => import("../components/Dashboard/TemplateManager"));

/**
 * Dashboard Component — role-aware routing hub
 */
const Dashboard = () => {
  const { user, dbUser, loading, configError, dbUserError, retryDbUser, orgContext } = useAuth();

  const role = dbUser?.role?.toLowerCase() || (loading ? "" : "student");
  const globalRole = dbUser?.globalRole;

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
    <DashboardLayout>
      <Routes>
        {/* Multi-Tenant Dashboard Routes */}
        <Route path="org/:orgId/*" element={<OrgDashboardLayout />} />

        {/* Note: /dashboard/super-admin and /dashboard/admin routes have been migrated to top-level /super-admin and /admin routes */}

        <Route
          index
          element={
            globalRole === "super_admin" ? (
              <Navigate to="/super-admin" replace />
            ) : orgContext ? (
              <Navigate to={`/dashboard/org/${orgContext.orgId || orgContext.slug}`} replace />
            ) : role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : role === "tutor" ? (
              <TutorDashboard />
            ) : (
              <StudentDashboard />
            )
          }
        />

        <Route path="profile" element={<Profile />} />
        <Route path="my-profile" element={<Navigate to="/dashboard/profile" replace />} />
        
        <Route
          path="sessions"
          element={role === "tutor" ? <TutorSessions /> : <Navigate to="/dashboard" replace />}
        />
        
        <Route
          path="billing"
          element={role === "tutor" ? <Navigate to="/dashboard" replace /> : <BillingHistory />}
        />
        
        <Route
          path="bookmarks"
          element={role === "tutor" ? <Navigate to="/dashboard" replace /> : <Bookmarks />}
        />
        
        <Route path="payments" element={<Navigate to="/dashboard/billing" replace />} />
        <Route path="receipts" element={<Navigate to="/dashboard/billing" replace />} />
        <Route path="saved-tutors" element={<Navigate to="/dashboard/bookmarks" replace />} />
        <Route path="saved-tuitions" element={<Navigate to="/dashboard/bookmarks" replace />} />
        
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="requests" element={<HireRequests />} />
        
        <Route
          path="relationships"
          element={role === "tutor" ? <Navigate to="/dashboard" replace /> : <ActiveRelationships />}
        />
        
        <Route
          path="saved-searches"
          element={role === "tutor" ? <Navigate to="/dashboard" replace /> : <SavedSearchAlerts />}
        />
        
        <Route
          path="verification"
          element={role === "tutor" ? <VerificationFlow /> : <Navigate to="/dashboard" replace />}
        />
        
        <Route
          path="wallet"
          element={role === "tutor" ? <TutorWallet /> : <Navigate to="/dashboard" replace />}
        />
        
        <Route
          path="withdraw"
          element={role === "tutor" ? <TutorWithdraw /> : <Navigate to="/dashboard" replace />}
        />
        
        <Route path="disputes" element={<DisputeWorkspace />} />
        <Route path="assignments" element={<Assignments />} />
        
        <Route
          path="session-confirmations"
          element={role === "tutor" ? <Navigate to="/dashboard" replace /> : <SessionConfirmationList />}
        />
        
        <Route
          path="templates"
          element={role === "student" ? <Navigate to="/dashboard" replace /> : <TemplateManager />}
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
