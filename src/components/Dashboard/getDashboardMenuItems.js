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
  FilePlus,
  MessageSquare,
} from "lucide-react";

export function getDashboardMenuItems({ globalRole, orgContext, legacyRole, hasPermission }) {
  if (globalRole === 'super_admin') {
    return [
      { path: "/dashboard/super-admin", label: "Overview", icon: LayoutDashboard, group: "Platform" },
      { path: "/dashboard/super-admin/organizations", label: "Organizations", icon: Users, group: "Platform" },
      { path: "/dashboard/super-admin/analytics", label: "Analytics", icon: History, group: "Platform" },
      { path: "/dashboard/super-admin/subscriptions", label: "Subscriptions", icon: CreditCard, group: "Platform" },
      { path: "/dashboard/super-admin/users", label: "All Users", icon: User, group: "Users & Content" },
      { path: "/dashboard/super-admin/tutors", label: "Tutors", icon: ShieldCheck, group: "Users & Content" },
      { path: "/dashboard/super-admin/tuitions", label: "Tuitions", icon: FileText, group: "Users & Content" },
      { path: "/dashboard/super-admin/verifications", label: "Verifications", icon: ClipboardCheck, group: "Users & Content" },
      { path: "/dashboard/admin/withdrawals", label: "Withdrawals", icon: ArrowDownToLine, group: "Finance" },
      { path: "/dashboard/admin/payments", label: "Payments", icon: DollarSign, group: "Finance" },
      { path: "/dashboard/admin/contacts", label: "Contacts", icon: Mail, group: "Operations" },
      { path: "/dashboard/super-admin/audit-logs", label: "Audit Logs", icon: History, group: "Operations" },
      { path: "/dashboard/disputes", label: "Disputes", icon: Scale, group: "Operations" },
    ];
  }

  if (orgContext) {
    const orgPath = `/dashboard/org/${orgContext.orgId || orgContext.slug}`;
    const items = [
      { path: orgPath, label: "Overview", icon: LayoutDashboard, group: "Core" },
      { path: `${orgPath}/tuitions`, label: "Tuitions", icon: BookOpen, group: "Core" },
      { path: `${orgPath}/sessions`, label: "Sessions", icon: ClipboardCheck, group: "Core" },
    ];
    if (hasPermission('member:read')) {
      items.push({ path: `${orgPath}/members`, label: "Members", icon: Users, group: "People" });
    }
    if (hasPermission('student:view')) {
      items.push({ path: `${orgPath}/students`, label: "Students", icon: User, group: "People" });
      items.push({ path: `${orgPath}/tutors`, label: "Tutors", icon: ShieldCheck, group: "People" });
    }
    if (hasPermission('class:manage')) {
      items.push({ path: `${orgPath}/classes`, label: "Classes", icon: LayoutDashboard, group: "Academic" });
    }
    if (hasPermission('subject:manage')) {
      items.push({ path: `${orgPath}/subjects`, label: "Subjects", icon: FileStack, group: "Academic" });
    }
    if (hasPermission('assignment:create') || hasPermission('student:view')) {
      items.push({ path: `${orgPath}/assignments`, label: "Assignments", icon: FileText, group: "Academic" });
    }
    if (hasPermission('material:upload') || hasPermission('student:view')) {
      items.push({ path: `${orgPath}/materials`, label: "Materials", icon: Bookmark, group: "Academic" });
    }
    if (hasPermission('announcement:create') || hasPermission('student:view')) {
      items.push({ path: `${orgPath}/announcements`, label: "Announcements", icon: Mail, group: "Communication" });
    }
    if (hasPermission('message:send') || hasPermission('message:view')) {
      items.push({ path: `${orgPath}/messages`, label: "Messages", icon: MessageSquare, group: "Communication" });
    }
    if (hasPermission('attendance:mark')) {
      items.push({ path: `${orgPath}/attendance`, label: "Attendance", icon: Calendar, group: "Academic" });
    }
    if (hasPermission('billing:read')) {
      items.push({ path: `${orgPath}/payments`, label: "Payments", icon: Banknote, group: "Finance" });
      items.push({ path: `${orgPath}/billing`, label: "Subscription", icon: CreditCard, group: "Finance" });
    }
    if (hasPermission('role:view')) {
      items.push({ path: `${orgPath}/roles`, label: "Roles", icon: Shield, group: "Settings" });
    }
    if (hasPermission('analytics:view')) {
      items.push({ path: `${orgPath}/analytics`, label: "Analytics", icon: BarChart3, group: "Settings" });
    }
    if (hasPermission('org:update')) {
      items.push({ path: `${orgPath}/settings`, label: "Settings", icon: Settings, group: "Settings" });
    }
    return items;
  }

  if (legacyRole === 'admin') {
    return [
      { path: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "Management" },
      { path: "/dashboard/users", label: "Users", icon: Users, group: "Management" },
      { path: "/dashboard/admin/withdrawals", label: "Withdrawals", icon: ArrowDownToLine, group: "Finance" },
      { path: "/dashboard/admin/payments", label: "Payments", icon: DollarSign, group: "Finance" },
      { path: "/dashboard/admin/settings", label: "Settings", icon: Settings, group: "Operations" },
      { path: "/dashboard/admin/audit-logs", label: "Audit Logs", icon: History, group: "Operations" },
      { path: "/dashboard/admin/contacts", label: "Contacts", icon: Mail, group: "Operations" },
      { path: "/dashboard/disputes", label: "Disputes", icon: Scale, group: "Operations" },
    ];
  }

  if (legacyRole === 'tutor') {
    return [
      { path: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "Teaching" },
      { path: "/dashboard/sessions", label: "Sessions", icon: Calendar, group: "Teaching" },
      { path: "/dashboard/verification", label: "Verification", icon: ShieldCheck, group: "Account" },
      { path: "/dashboard/wallet", label: "Wallet", icon: Wallet, group: "Finance" },
      { path: "/dashboard/withdraw", label: "Withdraw", icon: ArrowDownToLine, group: "Finance" },
      { path: "/dashboard/assignments", label: "Assignments", icon: BookOpen, group: "Teaching" },
      { path: "/dashboard/templates", label: "Templates", icon: FileStack, group: "Teaching" },
    ];
  }

  return [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "Learning" },
    { path: "/dashboard/billing", label: "Billing", icon: Banknote, group: "Finance" },
    { path: "/dashboard/relationships", label: "Relationships", icon: Users, group: "Connections" },
    { path: "/dashboard/bookmarks", label: "Bookmarks", icon: Bookmark, group: "Connections" },
    { path: "/dashboard/saved-searches", label: "Saved", icon: BookmarkCheck, group: "Connections" },
    { path: "/dashboard/session-confirmations", label: "Confirm", icon: ClipboardCheck, group: "Learning" },
    { path: "/dashboard/assignments", label: "Assignments", icon: BookOpen, group: "Learning" },
    { path: "/dashboard/disputes", label: "Disputes", icon: Scale, group: "Support" },
  ];
}
