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
  GitBranch,
  GraduationCap,
  HeartHandshake,
  Clock,
  FileSpreadsheet,
  Trophy,
  Receipt,
  WalletCards,
  Landmark,
  PiggyBank,
  Layers,
  PanelTop,
} from "lucide-react";

function buildOrgMenu(orgContext, hasPermission) {
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
  }
  if (hasPermission('tutor:view')) {
    items.push({ path: `${orgPath}/tutors`, label: "Tutors", icon: ShieldCheck, group: "People" });
  }
  if (hasPermission('class:view') || hasPermission('class:manage')) {
    items.push({ path: `${orgPath}/classes`, label: "Classes", icon: LayoutDashboard, group: "Academic" });
  }
  if (hasPermission('class:manage')) {
    items.push({ path: `${orgPath}/academic-years`, label: "Academic Years", icon: Calendar, group: "Academic" });
    items.push({ path: `${orgPath}/batches`, label: "Batches", icon: Layers, group: "Academic" });
  }
  if (hasPermission('subject:manage')) {
    items.push({ path: `${orgPath}/subjects`, label: "Subjects", icon: FileStack, group: "Academic" });
  }
  if (hasPermission('class:view')) {
    items.push({ path: `${orgPath}/schedule`, label: "Schedule", icon: Clock, group: "Academic" });
  }
  if (hasPermission('assignment:view')) {
    items.push({ path: `${orgPath}/assignments`, label: "Assignments", icon: FileText, group: "Academic" });
  }
  if (hasPermission('material:view')) {
    items.push({ path: `${orgPath}/materials`, label: "Materials", icon: Bookmark, group: "Academic" });
  }
  if (hasPermission('attendance:mark') || hasPermission('attendance:view')) {
    items.push({ path: `${orgPath}/attendance`, label: "Attendance", icon: Calendar, group: "Academic" });
  }
  if (hasPermission('branch:view')) {
    items.push({ path: `${orgPath}/branches`, label: "Branches", icon: GitBranch, group: "Academic" });
  }
  if (hasPermission('exam:manage')) {
    items.push({ path: `${orgPath}/exams`, label: "Exams", icon: FileSpreadsheet, group: "Academic" });
  }
  if (hasPermission('result:manage')) {
    items.push({ path: `${orgPath}/results`, label: "Results", icon: Trophy, group: "Academic" });
  }
  if (hasPermission('announcement:view')) {
    items.push({ path: `${orgPath}/announcements`, label: "Announcements", icon: Mail, group: "Communication" });
  }
  if (hasPermission('message:send') || hasPermission('message:view')) {
    items.push({ path: `${orgPath}/messages`, label: "Messages", icon: MessageSquare, group: "Communication" });
  }
  if (hasPermission('billing:read')) {
    items.push({ path: `${orgPath}/payments`, label: "Payments", icon: Banknote, group: "Finance" });
    items.push({ path: `${orgPath}/billing`, label: "Subscription", icon: CreditCard, group: "Finance" });
    items.push({ path: `${orgPath}/invoices`, label: "Invoices", icon: Receipt, group: "Finance" });
  }
  if (hasPermission('salary:view')) {
    items.push({ path: `${orgPath}/salaries`, label: "Salaries", icon: WalletCards, group: "Finance" });
  }
  if (hasPermission('payment:view_all')) {
    items.push({ path: `${orgPath}/expenses`, label: "Expenses", icon: Landmark, group: "Finance" });
  }
  if (hasPermission('student:view')) {
    items.push({ path: `${orgPath}/enrollments`, label: "Enrollments", icon: GraduationCap, group: "People" });
    items.push({ path: `${orgPath}/guardians`, label: "Guardians", icon: HeartHandshake, group: "People" });
    items.push({ path: `${orgPath}/scholarships`, label: "Scholarships", icon: PiggyBank, group: "Finance" });
  }
  if (hasPermission('role:view')) {
    items.push({ path: `${orgPath}/roles`, label: "Roles", icon: Shield, group: "Settings" });
  }
  if (hasPermission('analytics:view')) {
    items.push({ path: `${orgPath}/analytics`, label: "Analytics", icon: BarChart3, group: "Settings" });
  }
  if (hasPermission('audit:view')) {
    items.push({ path: `${orgPath}/audit-logs`, label: "Audit Logs", icon: History, group: "Settings" });
  }
  if (hasPermission('org:update')) {
    items.push({ path: `${orgPath}/settings`, label: "Settings", icon: Settings, group: "Settings" });
  }
  return items;
}

export function getDashboardMenuItems({ globalRole, orgContext, legacyRole, hasPermission }) {
  if (globalRole === 'super_admin') {
    return [
      { path: "/super-admin", label: "Overview", icon: LayoutDashboard, group: "Platform" },
      { path: "/super-admin/organizations", label: "Organizations", icon: Users, group: "Platform" },
      { path: "/super-admin/analytics", label: "Analytics", icon: History, group: "Platform" },
      { path: "/super-admin/subscriptions", label: "Subscriptions", icon: CreditCard, group: "Platform" },
      { path: "/super-admin/users", label: "All Users", icon: User, group: "Users & Content" },
      { path: "/super-admin/tutors", label: "Tutors", icon: ShieldCheck, group: "Users & Content" },
      { path: "/super-admin/tuitions", label: "Tuitions", icon: FileText, group: "Users & Content" },
      { path: "/super-admin/verifications", label: "Verifications", icon: ClipboardCheck, group: "Users & Content" },
      { path: "/super-admin/withdrawals", label: "Withdrawals", icon: ArrowDownToLine, group: "Finance" },
      { path: "/super-admin/payments", label: "Payments", icon: DollarSign, group: "Finance" },
      { path: "/super-admin/contacts", label: "Contacts", icon: Mail, group: "Operations" },
      { path: "/super-admin/audit-logs", label: "Audit Logs", icon: History, group: "Operations" },
      { path: "/dashboard/disputes", label: "Disputes", icon: Scale, group: "Operations" },
      ...(orgContext ? buildOrgMenu(orgContext, hasPermission) : []),
    ];
  }

  if (orgContext) {
    return buildOrgMenu(orgContext, hasPermission);
  }

  if (legacyRole === 'tutor') {
    return [
      { path: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "Teaching" },
      { path: "/dashboard/profile", label: "Profile", icon: User, group: "Account" },
      { path: "/dashboard/sessions", label: "Sessions", icon: Calendar, group: "Teaching" },
      { path: "/dashboard/verification", label: "Verification", icon: ShieldCheck, group: "Account" },
      { path: "/dashboard/wallet", label: "Finance", icon: Wallet, group: "Finance" },
      { path: "/dashboard/assignments", label: "Assignments", icon: BookOpen, group: "Teaching" },
      { path: "/dashboard/templates", label: "Templates", icon: FileStack, group: "Teaching" },
    ];
  }

  return [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "Learning" },
    { path: "/dashboard/profile", label: "Profile", icon: User, group: "Account" },
    { path: "/dashboard/billing", label: "Billing", icon: Banknote, group: "Finance" },
    { path: "/dashboard/relationships", label: "Connections", icon: Users, group: "Learning" },
    { path: "/dashboard/bookmarks", label: "Bookmarks", icon: Bookmark, group: "Learning" },
    { path: "/dashboard/saved-searches", label: "Saved Searches", icon: BookmarkCheck, group: "Learning" },
    { path: "/dashboard/calendar", label: "Sessions", icon: Calendar, group: "Learning" },
    { path: "/dashboard/assignments", label: "Assignments", icon: BookOpen, group: "Learning" },
    { path: "/dashboard/disputes", label: "Disputes", icon: Scale, group: "Support" },
  ];
}