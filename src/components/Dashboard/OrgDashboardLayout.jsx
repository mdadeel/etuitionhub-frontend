import { lazy, useEffect } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import OrgPermissionGate from '../shared/OrgPermissionGate';
import { ORG_ROUTE_PERMISSIONS } from '../../constants/orgPermissions';

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
const OrgMessages = lazy(() => import('./Organization/OrgMessages'));
const OrgAttendance = lazy(() => import('./Organization/OrgAttendance'));
const OrgBranches = lazy(() => import('./Organization/OrgBranches'));
const OrgEnrollments = lazy(() => import('./Organization/OrgEnrollments'));
const OrgGuardians = lazy(() => import('./Organization/OrgGuardians'));
const OrgSchedule = lazy(() => import('./Organization/OrgSchedule'));
const OrgExams = lazy(() => import('./Organization/OrgExams'));
const OrgResults = lazy(() => import('./Organization/OrgResults'));
const OrgInvoices = lazy(() => import('./Organization/OrgInvoices'));
const OrgSalaries = lazy(() => import('./Organization/OrgSalaries'));
const OrgExpenses = lazy(() => import('./Organization/OrgExpenses'));
const OrgAuditLogs = lazy(() => import('./Organization/OrgAuditLogs'));
const OrgScholarships = lazy(() => import('./Organization/OrgScholarships'));
const OrgAcademicYears = lazy(() => import('./Organization/OrgAcademicYears'));
const OrgBatches = lazy(() => import('./Organization/OrgBatches'));

const OrgDashboardLayout = () => {
  const { orgId } = useParams();
  const { myOrgs, switchOrg, orgContext, dbUser, loading } = useAuth();
  const { t } = useTranslation();

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

  const isSuperAdmin = dbUser?.globalRole === 'super_admin';
  const isMember = isSuperAdmin || myOrgs.some(o => o.orgId === orgId || o.slug === orgId);
  if (!isMember) {
    return <Navigate to="/dashboard" replace />;
  }

  const currentOrg = orgContext || myOrgs.find(o => o.orgId === orgId || o.slug === orgId);
  const isBanned = currentOrg?.status === 'banned';
  const isSuspended = currentOrg?.status === 'suspended';

  if (isBanned && !isSuperAdmin) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 text-center space-y-4">
        <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive space-y-3">
          <h2 className="text-xl font-heading font-bold">{t('org.banned_title', 'Organization Banned')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('org.banned_desc', 'This organization workspace has been suspended or banned by platform administration. Access is restricted.')}
          </p>
          {currentOrg?.bannedReason && (
            <p className="text-xs text-destructive/90 font-mono bg-destructive/10 p-2 rounded">
              {t('common.reason', 'Reason')}: {currentOrg.bannedReason}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isSuspended && (
        <div className="bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-3 rounded-lg text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t('org.suspended_badge', '⚠️ Organization Suspended:')}</span>
            <span>{t('org.suspended_desc', 'This workspace has been suspended by platform administration. Write operations are temporarily restricted.')}</span>
          </div>
          {currentOrg?.suspensionReason && (
            <span className="text-xs opacity-80 font-mono">
              {t('common.reason', 'Reason')}: {currentOrg.suspensionReason}
            </span>
          )}
        </div>
      )}
      <Routes>
        <Route index element={<OrgHome />} />
      <Route 
        path="tuitions" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.tuitions} redirect>
            <OrgTuitions />
          </OrgPermissionGate>
        } 
      />
      <Route path="sessions" element={<OrgSessions />} />
      <Route 
        path="members" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.members} redirect>
            <OrgMembers />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="settings" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.settings} redirect>
            <OrgSettings />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="payments" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.payments} redirect>
            <OrgPayments />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="roles" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.roles} redirect>
            <OrgRoles />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="billing" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.billing} redirect>
            <OrgBilling />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="analytics" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.analytics} redirect>
            <OrgAnalytics />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="students" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.students} redirect>
            <OrgStudents />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="tutors" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.tutors} redirect>
            <OrgTutors />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="classes" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.classes} redirect>
            <OrgClasses />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="subjects" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.subjects} redirect>
            <OrgSubjects />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="assignments" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.assignments} redirect>
            <OrgAssignments />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="materials" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.materials} redirect>
            <OrgMaterials />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="announcements" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.announcements} redirect>
            <OrgAnnouncements />
          </OrgPermissionGate>
        } 
      />
      <Route
        path="messages"
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.messages} redirect>
            <OrgMessages />
          </OrgPermissionGate>
        }
      />
      <Route
        path="attendance"
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.attendance} redirect>
            <OrgAttendance />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="branches" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.branches} redirect>
            <OrgBranches />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="enrollments" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.enrollments} redirect>
            <OrgEnrollments />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="guardians" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.guardians} redirect>
            <OrgGuardians />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="schedule" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.schedule} redirect>
            <OrgSchedule />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="exams" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.exams} redirect>
            <OrgExams />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="results" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.results} redirect>
            <OrgResults />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="invoices" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.invoices} redirect>
            <OrgInvoices />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="salaries" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.salaries} redirect>
            <OrgSalaries />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="expenses" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.expenses} redirect>
            <OrgExpenses />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="scholarships" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.scholarships} redirect>
            <OrgScholarships />
          </OrgPermissionGate>
        } 
      />
      <Route
        path="audit-logs"
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS['audit-logs']} redirect>
            <OrgAuditLogs />
          </OrgPermissionGate>
        }
      />
      <Route
        path="academic-years"
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS['academic-years']} redirect>
            <OrgAcademicYears />
          </OrgPermissionGate>
        } 
      />
      <Route 
        path="batches" 
        element={
          <OrgPermissionGate permission={ORG_ROUTE_PERMISSIONS.batches} redirect>
            <OrgBatches />
          </OrgPermissionGate>
        } 
      />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
    </div>
  );
};

export default OrgDashboardLayout;
