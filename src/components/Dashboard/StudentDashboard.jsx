import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { useSearchParams, useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { StatCardSkeleton } from "@/components/shared/skeletons";
import StudentPayments from "./StudentPayments";
import Assignments from "./Assignments";
import DashboardPageHeader from "@/components/shared/DashboardPageHeader";
import {
  Database,
  FileText,
  UserCheck,
  Phone,
  Search,
  Activity,
  Plus,
  Banknote,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import DataTable from "@/components/ui/data-table";
import OnboardingChecklist from "./widgets/OnboardingChecklist";

const PostTuition = lazy(() => import("../../pages/PostTuition"));
 
const tabs = [
  { id: "overview", label: "overview", icon: Activity },
  { id: "post-job", label: "post_job", icon: Plus },
  { id: "my-jobs", label: "my_jobs", icon: Database },
  { id: "applications", label: "applications", icon: FileText },
  { id: "booked", label: "engagements", icon: UserCheck },
  { id: "payments", label: "payments", icon: Banknote },
  { id: "assignments", label: "assignments", icon: Search },
];
 
/**
 * StudentDashboard Component — Actionable, Low-Cognitive Load Workspace
 */
const StudentDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const initialTab = pathname.includes('/applications') ? 'applications' : (searchParams.get("tab") || "overview");
  const [activeTab, setActiveTab] = useState(initialTab);
 
  useEffect(() => {
    if (pathname.includes('/applications')) {
      setActiveTab('applications');
    } else {
      setActiveTab(searchParams.get("tab") || "overview");
    }
  }, [pathname, searchParams]);

  const [bookings, setBookings] = useState([]);
  const [myTuitions, setMyTuitions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
 
  // Fetch tuitions for this student
  const fetchMyTuitions = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await api.get(`/api/tuitions/student/${user.email}`);
      setMyTuitions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tuitions:", err);
      toast.error(t("student.load_requests_failed"));
      setMyTuitions([]);
    }
  }, [user?.email, t]);
 
  // Fetch bookings for this student
  const fetchBookings = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await api.get(`/api/bookings/student/${user.email}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      toast.error(t("student.load_bookings_failed"));
      setBookings([]);
    }
  }, [user?.email, t]);
 
  // Fetch applications for student's tuitions
  const fetchApplications = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await api.get(`/api/applications/student/${user.email}`);
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      toast.error(t("student.load_applications_failed"));
      setApplications([]);
    }
  }, [user?.email, t]);
 
  // Initial data fetch
  useEffect(() => {
    if (!user?.email) return;
 
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMyTuitions(),
          fetchBookings(),
          fetchApplications(),
        ]);
      } finally {
        setLoading(false);
      }
    };
 
    loadData();
  }, [user?.email, fetchMyTuitions, fetchBookings, fetchApplications]);
 
  // Refresh data after any mutation
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchMyTuitions(),
      fetchBookings(),
      fetchApplications(),
    ]);
  }, [fetchMyTuitions, fetchBookings, fetchApplications]);
 
  const handleApprove = (id) => navigate(`/checkout/${id}`);
 
  const handleReject = async (id) => {
    if (!confirm(t("student.confirm_reject"))) return;
    try {
      await api.patch(`/api/applications/${id}`, { status: "rejected" });
      toast.success(t("student.app_rejected"));
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "rejected" } : a)),
      );
    } catch {
      toast.error(t("student.reject_failed"));
    }
  };

  const handleDeleteTuition = async (tid) => {
    if (!confirm(t("student.confirm_delete"))) return;
    try {
      await api.delete(`/api/tuitions/${tid}`);
      toast.success(t("student.request_deleted"));
      await refreshData();
    } catch {
      toast.error(t("student.delete_failed"));
    }
  };

  const pendingApps = applications.filter(a => a.status === 'pending');
  const activeBookings = bookings.filter(b => b.isAccepted);
 
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      <DashboardPageHeader
        title={t("student.hello", { name: user?.displayName?.split(" ")[0] || "Student" })}
        subtitle={t("student.subtitle", "Track your tuition requirements, tutor applications, and scheduled sessions.")}
        category={t("student.dashboard_badge", "Student Workspace")}
      />
 
      {/* Segmented Tab Navigation */}
      <div className="w-full overflow-hidden border-b border-border pb-px">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar flex-nowrap">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all shrink-0",
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5 shadow-none"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              <tab.icon size={14} className={activeTab === tab.id ? "text-primary" : "opacity-60"} />
              <span>{t(`student.tab_${tab.label}`)}</span>
              {tab.id === 'applications' && pendingApps.length > 0 && (
                <span className="ml-1 size-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {pendingApps.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
 
      {/* Overview Content */}
      {activeTab === "overview" && (
        loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <OnboardingChecklist />

            {/* Actionable Pending Banner */}
            {pendingApps.length > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {pendingApps.length} Tutor {pendingApps.length === 1 ? 'Application' : 'Applications'} Awaiting Review
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Verified tutors have applied for your tuition job. Review their qualifications and approve a demo session.
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setActiveTab('applications')}
                  className="shrink-0 text-xs font-semibold gap-1.5 self-start sm:self-auto"
                >
                  <span>Review Applications</span>
                  <ArrowRight size={13} />
                </Button>
              </div>
            )}

            {/* Standardized Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5 bg-card border-border" hover={false}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Tuitions</span>
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
                    <Database size={15} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-foreground">{myTuitions.length}</span>
                  <span className="text-xs text-muted-foreground">requirements</span>
                </div>
              </Card>

              <Card className="p-5 bg-card border-border" hover={false}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applications</span>
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
                    <FileText size={15} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-foreground">{applications.length}</span>
                  <span className="text-xs text-muted-foreground">total received</span>
                </div>
              </Card>

              <Card className="p-5 bg-card border-border" hover={false}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Tutors</span>
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
                    <UserCheck size={15} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-foreground">{activeBookings.length}</span>
                  <span className="text-xs text-muted-foreground">hired instructors</span>
                </div>
              </Card>
            </div>

            {/* Recent Pending Applications Preview */}
            {pendingApps.length > 0 && (
              <Card className="p-6 bg-card border-border space-y-4" hover={false}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Pending Applications</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View all ({applications.length})</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingApps.slice(0, 2).map((app) => (
                    <div key={app._id} className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{app.tutorName}</h4>
                          <p className="text-xs text-muted-foreground">{app.tutorEmail}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-primary">৳{app.expectedSalary}/mo</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic line-clamp-2">
                        "{app.qualifications || 'No bio specified'}"
                      </p>
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8"
                          onClick={() => handleReject(app._id)}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs h-8"
                          onClick={() => handleApprove(app._id)}
                        >
                          Accept &amp; Book
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Actions Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Need Another Tutor?</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Post a new requirement for instant matches.</p>
                </div>
                <Button size="sm" onClick={() => setActiveTab('post-job')} className="shrink-0 text-xs font-semibold gap-1.5">
                  <Plus size={14} />
                  <span>Post Tuition</span>
                </Button>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Browse Verified Tutors</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Explore instructors across all curriculums.</p>
                </div>
                <Button variant="outline" size="sm" asChild className="shrink-0 text-xs font-semibold gap-1.5">
                  <Link to="/tutors">
                    <span>Explore</span>
                    <ArrowRight size={13} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )
      )}

      {/* Post Job Tab */}
      {activeTab === "post-job" && (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground text-sm italic">{t("student.loading")}</div>}>
          <PostTuition
            isDashboard={true}
            onSuccess={async () => {
              await refreshData();
              setActiveTab("my-jobs");
            }}
          />
        </Suspense>
      )}
 
      {/* My Jobs Tab */}
      {activeTab === "my-jobs" && (
        <DataTable
          rowKey={(row) => row._id}
          data={myTuitions}
          emptyState={<p className="italic py-8 text-center text-muted-foreground text-xs">{t("student.no_active_requests")}</p>}
          columns={[
            {
              key: "subject",
              label: t("student.subject"),
              render: (_, row) => (
                <>
                  <p className="text-xs font-bold text-foreground">{row.subject}</p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{row.class_name}</p>
                </>
              ),
            },
            {
              key: "salary",
              label: t("student.budget"),
              render: (val) => (
                <span className="text-xs font-bold font-mono text-primary">৳{val}</span>
              ),
            },
            {
              key: "status",
              label: t("student.status"),
              render: (val) => (
                <Badge variant={val === "approved" ? "success" : "default"} className="rounded-md text-[11px]">
                  {val === "approved" ? t("student.active") : t("student.pending")}
                </Badge>
              ),
            },
            {
              key: "_id",
              label: t("student.actions"),
              align: "right",
              render: (_, row) => (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => navigate(`/tuition/${row._id}`)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {t("student.view")}
                  </button>
                  <button
                    onClick={() => handleDeleteTuition(row._id)}
                    className="text-xs font-semibold text-destructive hover:underline"
                  >
                    {t("student.remove")}
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}
 
      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.length === 0 ? (
            <Card className="col-span-full p-16 text-center border-dashed" hover={false}>
              <Search
                size={36}
                className="text-muted-foreground/30 mx-auto mb-4"
                strokeWidth={1.5}
              />
              <p className="text-xs font-medium text-muted-foreground italic">
                {t("student.no_applications")}
              </p>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app._id} className="p-5 space-y-4" hover={false}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {app.tutorName}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {app.tutorEmail}
                    </p>
                  </div>
                  <Badge
                    variant={app.status === "approved" ? "success" : app.status === "rejected" ? "error" : "warning"}
                    className="rounded-md text-[11px]"
                  >
                    {app.status}
                  </Badge>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed italic">
                  "{app.qualifications || 'No bio specified'}"
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Expected Salary</span>
                  <span className="text-xs font-bold font-mono text-primary">৳{app.expectedSalary}/mo</span>
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-9"
                      onClick={() => handleReject(app._id)}
                    >
                      {t("student.decline")}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs h-9"
                      onClick={() => handleApprove(app._id)}
                    >
                      {t("student.approve")}
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
 
      {/* Booked / Engagements Tab */}
      {activeTab === "booked" && (
        <DataTable
          rowKey={(row) => row._id}
          data={bookings}
          emptyState={<p className="italic py-8 text-center text-muted-foreground text-xs">{t("student.no_engagements")}</p>}
          columns={[
            {
              key: "tutor_name",
              label: t("student.tutor_name"),
              render: (_, row) => (
                <p className="text-xs font-bold text-foreground">
                  {row.tutor_name || row.tutorName}
                </p>
              ),
            },
            {
              key: "subject",
              label: t("student.subject"),
              render: (val) => (
                <span className="text-xs font-medium text-muted-foreground">{val}</span>
              ),
            },
            {
              key: "mobile",
              label: t("student.contact"),
              align: "center",
              render: (val) => (
                <a
                  href={`tel:${val}`}
                  className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Phone size={12} /> {val}
                </a>
              ),
            },
            {
              key: "_id",
              label: t("student.verification"),
              align: "right",
              render: (_, row) => (
                <div className="flex items-center justify-end gap-2">
                  <Badge variant="success" className="rounded-md text-[11px]">
                    {t("student.active")}
                  </Badge>
                  {row.isAccepted && (
                    <Button
                      size="sm"
                      className="h-8 px-2.5 text-xs"
                      onClick={() => navigate(`/session/${row._id}`)}
                    >
                      {t("student.join_room")}
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && <StudentPayments />}

      {/* Assignments Tab */}
      {activeTab === "assignments" && <Assignments />}
    </div>
  );
};

export default StudentDashboard;
