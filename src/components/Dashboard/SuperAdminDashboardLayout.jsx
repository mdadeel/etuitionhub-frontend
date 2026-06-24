import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PlatformOverview = lazy(() => import('./SuperAdmin/PlatformOverview'));
const AllOrganizations = lazy(() => import('./SuperAdmin/AllOrganizations'));
const OrgRequests = lazy(() => import('./SuperAdmin/OrgRequests'));
const GlobalUsers = lazy(() => import('./SuperAdmin/GlobalUsers'));
const AdminAuditLogs = lazy(() => import('../../pages/AdminAuditLogs'));
const DashSettings = lazy(() => import('./DashSettings'));
const DashAnalytics = lazy(() => import('./DashAnalytics'));
const AdminTutors = lazy(() => import('./AdminTutors'));
const DashTuitions = lazy(() => import('./DashTuitions'));
const AdminVerifications = lazy(() => import('./AdminVerifications'));
const SubscriptionManagement = lazy(() => import('./SuperAdmin/SubscriptionManagement'));

const SuperAdminDashboardLayout = () => {
  const { dbUser, loading } = useAuth();

  if (loading) return null;

  if (dbUser?.globalRole !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
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
  );
};

export default SuperAdminDashboardLayout;
