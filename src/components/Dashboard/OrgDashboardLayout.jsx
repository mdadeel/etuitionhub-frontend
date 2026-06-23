import { lazy, useEffect } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import OrgPermissionGate from '../shared/OrgPermissionGate';

const OrgSettings = lazy(() => import('./Organization/OrgSettings'));
const OrgMembers = lazy(() => import('./Organization/OrgMembers'));
const OrgTuitions = lazy(() => import('./Organization/OrgTuitions'));
const OrgHome = lazy(() => import('./Organization/OrgHome'));
const OrgSessions = lazy(() => import('./Organization/OrgSessions'));
const OrgPayments = lazy(() => import('./Organization/OrgPayments'));
const OrgRoles = lazy(() => import('./Organization/OrgRoles'));
const OrgBilling = lazy(() => import('./Organization/OrgBilling'));
const OrgAnalytics = lazy(() => import('./Organization/OrgAnalytics'));
const OrgStudents = lazy(() => import('./Organization/OrgStudents'));
const OrgTutors = lazy(() => import('./Organization/OrgTutors'));
const OrgClasses = lazy(() => import('./Organization/OrgClasses'));
const OrgSubjects = lazy(() => import('./Organization/OrgSubjects'));
const OrgAssignments = lazy(() => import('./Organization/OrgAssignments'));
const OrgMaterials = lazy(() => import('./Organization/OrgMaterials'));
const OrgAnnouncements = lazy(() => import('./Organization/OrgAnnouncements'));
const OrgAttendance = lazy(() => import('./Organization/OrgAttendance'));

const OrgDashboardLayout = () => {
  const { orgId } = useParams();
  const { myOrgs, switchOrg, orgContext, loading } = useAuth();

  useEffect(() => {
    if (!loading && orgId) {
      // If the current context doesn't match the URL, switch it.
      if (!orgContext || orgContext.orgId !== orgId && orgContext.slug !== orgId) {
        // Find org by id or slug
        const targetOrg = myOrgs.find(o => o.orgId === orgId || o.slug === orgId);
        if (targetOrg) {
          switchOrg(targetOrg.orgId);
        }
      }
    }
  }, [orgId, orgContext, myOrgs, switchOrg, loading]);

  if (loading) return null;

  // Validate that the user actually belongs to this org
  const isMember = myOrgs.some(o => o.orgId === orgId || o.slug === orgId);
  if (!isMember) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route index element={<OrgHome />} />
      <Route path="tuitions" element={<OrgTuitions />} />
      <Route path="sessions" element={<OrgSessions />} />
      <Route 
        path="members" 
        element={
          <OrgPermissionGate permission="member:read" redirect>
            <OrgMembers />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="settings" 
        element={
          <OrgPermissionGate permission="org:update" redirect>
            <OrgSettings />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="payments" 
        element={
          <OrgPermissionGate permission="billing:read" redirect>
            <OrgPayments />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="roles" 
        element={
          <OrgPermissionGate permission="role:view" redirect>
            <OrgRoles />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="billing" 
        element={
          <OrgPermissionGate permission="billing:read" redirect>
            <OrgBilling />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="analytics" 
        element={
          <OrgPermissionGate permission="analytics:view" redirect>
            <OrgAnalytics />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="students" 
        element={
          <OrgPermissionGate permission="student:view" redirect>
            <OrgStudents />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="tutors" 
        element={
          <OrgPermissionGate permission="student:view" redirect>
            <OrgTutors />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="classes" 
        element={
          <OrgPermissionGate permission="class:manage" redirect>
            <OrgClasses />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="subjects" 
        element={
          <OrgPermissionGate permission="subject:manage" redirect>
            <OrgSubjects />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="assignments" 
        element={
          <OrgPermissionGate permission="student:view" redirect>
            <OrgAssignments />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="materials" 
        element={
          <OrgPermissionGate permission="student:view" redirect>
            <OrgMaterials />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="announcements" 
        element={
          <OrgPermissionGate permission="student:view" redirect>
            <OrgAnnouncements />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="attendance" 
        element={
          <OrgPermissionGate permission="attendance:mark" redirect>
            <OrgAttendance />
          </OrgPermissionGate>
        } 
      />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default OrgDashboardLayout;
