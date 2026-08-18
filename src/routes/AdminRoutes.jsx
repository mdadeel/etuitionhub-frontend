import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/shared/DashboardLayout';

const AdminDashboard = lazy(() => import('../components/Dashboard/AdminDashboard'));
const DashUsers = lazy(() => import('../components/Dashboard/DashUsers'));
const AdminWithdrawals = lazy(() => import('../pages/AdminWithdrawals'));
const AdminAuditLogs = lazy(() => import('../pages/AdminAuditLogs'));
const DashSettings = lazy(() => import('../components/Dashboard/DashSettings'));
const DashPayments = lazy(() => import('../components/Dashboard/DashPayments'));
const AdminContacts = lazy(() => import('../components/Dashboard/AdminContacts'));

const AdminRoutes = () => {
  const { dbUser, loading } = useAuth();

  if (loading) return null;

  if (dbUser?.role !== 'admin' && dbUser?.globalRole !== 'super_admin') {
    return <Navigate to="/403" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<DashUsers />} />
        <Route path="withdrawals" element={<AdminWithdrawals />} />
        <Route path="payments" element={<DashPayments />} />
        <Route path="settings" element={<DashSettings />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminRoutes;
