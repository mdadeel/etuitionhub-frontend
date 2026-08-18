import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/shared/DashboardLayout';

const PlatformOverview = lazy(() => import('../components/Dashboard/SuperAdmin/PlatformOverview'));
const AllOrganizations = lazy(() => import('../components/Dashboard/SuperAdmin/AllOrganizations'));
const OrgRequests = lazy(() => import('../components/Dashboard/SuperAdmin/OrgRequests'));
const GlobalUsers = lazy(() => import('../components/Dashboard/SuperAdmin/GlobalUsers'));
const AdminAuditLogs = lazy(() => import('../pages/AdminAuditLogs'));
const DashSettings = lazy(() => import('../components/Dashboard/DashSettings'));
const DashAnalytics = lazy(() => import('../components/Dashboard/DashAnalytics'));
const AdminTutors = lazy(() => import('../components/Dashboard/AdminTutors'));
const DashTuitions = lazy(() => import('../components/Dashboard/DashTuitions'));
const AdminVerifications = lazy(() => import('../components/Dashboard/AdminVerifications'));
const SubscriptionManagement = lazy(() => import('../components/Dashboard/SuperAdmin/SubscriptionManagement'));

const SuperAdminRoutes = () => {
  const { dbUser, loading } = useAuth();

  if (loading) return null;

  if (dbUser?.globalRole !== 'super_admin') {
    return <Navigate to="/403" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<PlatformOverview />} />
        <Route path="organizations" element={<AllOrganizations />} />
        <Route path="org-requests" element={<OrgRequests />} />
        <Route path="users" element={<GlobalUsers />} />
        <Route path="analytics" element={<DashAnalytics />} />
        <Route path="tutors" element={<AdminTutors />} />
        <Route path="tuitions" element={<DashTuitions />} />
        <Route path="verifications" element={<AdminVerifications />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<DashSettings />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default SuperAdminRoutes;
