import {
  LayoutDashboard,
  User,
  FileText,
  Users,
  ShieldCheck,
  Banknote,
  Bookmark,
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
  Calendar,
  CreditCard,
  BarChart3,
  Shield,
} from "lucide-react";

export function getDashboardMenuItems({ globalRole, orgContext, orgRole, legacyRole, hasPermission }) {
  if (globalRole === 'super_admin') {
    return [
      { path: "/dashboard/super-admin", label: "Overview", icon: LayoutDashboard },
      { path: "/dashboard/super-admin/organizations", label: "Organizations", icon: Users },
      { path: "/dashboard/super-admin/analytics", label: "Analytics", icon: History },
      { path: "/dashboard/super-admin/subscriptions", label: "Subscriptions", icon: CreditCard },
      { path: "/dashboard/super-admin/users", label: "All Users", icon: User },
      { path: "/dashboard/super-admin/tutors", label: "Tutors", icon: ShieldCheck },
      { path: "/dashboard/super-admin/tuitions", label: "Tuitions", icon: FileText },
      { path: "/dashboard/super-admin/verifications", label: "Verifications", icon: ClipboardCheck },
      { path: "/dashboard/admin/withdrawals", label: "Withdrawals", icon: ArrowDownToLine },
      { path: "/dashboard/admin/payments", label: "Payments", icon: DollarSign },
      { path: "/dashboard/admin/contacts", label: "Contacts", icon: Mail },
      { path: "/dashboard/super-admin/audit-logs", label: "Audit Logs", icon: History },
      { path: "/dashboard/disputes", label: "Disputes", icon: Scale },
      { path: "/dashboard/requests", label: "Requests", icon: Inbox },
    ];
  }

    if (orgContext) {
      const orgPath = `/dashboard/org/${orgContext.orgId || orgContext.slug}`;
      const items = [
        { path: orgPath, label: "Overview", icon: LayoutDashboard },
        { path: `${orgPath}/tuitions`, label: "Tuitions", icon: BookOpen },
        { path: `${orgPath}/sessions`, label: "Sessions", icon: ClipboardCheck },
      ];
      if (hasPermission('member:read')) {
        items.push({ path: `${orgPath}/members`, label: "Members", icon: Users });
      }
      if (hasPermission('student:view')) {
        items.push({ path: `${orgPath}/students`, label: "Students", icon: User });
        items.push({ path: `${orgPath}/tutors`, label: "Tutors", icon: ShieldCheck });
      }
      if (hasPermission('class:manage')) {
        items.push({ path: `${orgPath}/classes`, label: "Classes", icon: LayoutDashboard });
      }
      if (hasPermission('subject:manage')) {
        items.push({ path: `${orgPath}/subjects`, label: "Subjects", icon: FileStack });
      }
      if (hasPermission('assignment:create') || hasPermission('student:view')) {
        items.push({ path: `${orgPath}/assignments`, label: "Assignments", icon: FileText });
      }
      if (hasPermission('material:upload') || hasPermission('student:view')) {
        items.push({ path: `${orgPath}/materials`, label: "Materials", icon: Bookmark });
      }
      if (hasPermission('announcement:create') || hasPermission('student:view')) {
        items.push({ path: `${orgPath}/announcements`, label: "Announcements", icon: Mail });
      }
      if (hasPermission('attendance:mark')) {
        items.push({ path: `${orgPath}/attendance`, label: "Attendance", icon: Calendar });
      }
      if (hasPermission('billing:read')) {
        items.push({ path: `${orgPath}/payments`, label: "Payments", icon: Banknote });
        items.push({ path: `${orgPath}/billing`, label: "Subscription", icon: CreditCard });
      }
      if (hasPermission('role:view')) {
        items.push({ path: `${orgPath}/roles`, label: "Roles", icon: Shield });
      }
      if (hasPermission('analytics:view')) {
        items.push({ path: `${orgPath}/analytics`, label: "Analytics", icon: BarChart3 });
      }
      if (hasPermission('org:update')) {
        items.push({ path: `${orgPath}/settings`, label: "Settings", icon: Settings });
      }
      return items;
    }

  if (legacyRole === 'admin') {
    return [
      { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { path: "/dashboard/requests", label: "Requests", icon: Inbox },
      { path: "/dashboard/users", label: "Users", icon: Users },
      { path: "/dashboard/admin/withdrawals", label: "Withdrawals", icon: ArrowDownToLine },
      { path: "/dashboard/admin/settings", label: "Settings", icon: Settings },
      { path: "/dashboard/admin/audit-logs", label: "Audit Logs", icon: History },
      { path: "/dashboard/admin/payments", label: "Payments", icon: DollarSign },
      { path: "/dashboard/admin/contacts", label: "Contacts", icon: Mail },
      { path: "/dashboard/disputes", label: "Disputes", icon: Scale },
    ];
  }

  if (legacyRole === 'tutor') {
    return [
      { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { path: "/dashboard/requests", label: "Requests", icon: Inbox },
      { path: "/dashboard/sessions", label: "Sessions", icon: Calendar },
      { path: "/dashboard/verification", label: "Verification", icon: ShieldCheck },
      { path: "/dashboard/wallet", label: "Wallet", icon: Wallet },
      { path: "/dashboard/withdraw", label: "Withdraw", icon: ArrowDownToLine },
      { path: "/dashboard/assignments", label: "Assignments", icon: BookOpen },
      { path: "/dashboard/templates", label: "Templates", icon: FileStack },
    ];
  }

  return [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/dashboard/requests", label: "Requests", icon: Inbox },
    { path: "/dashboard/billing", label: "Billing", icon: Banknote },
    { path: "/dashboard/relationships", label: "Relationships", icon: Users },
    { path: "/dashboard/bookmarks", label: "Bookmarks", icon: Bookmark },
    { path: "/dashboard/saved-searches", label: "Saved", icon: BookmarkCheck },
    { path: "/dashboard/session-confirmations", label: "Confirm", icon: ClipboardCheck },
    { path: "/dashboard/assignments", label: "Assignments", icon: BookOpen },
    { path: "/dashboard/disputes", label: "Disputes", icon: Scale },
  ];
}
