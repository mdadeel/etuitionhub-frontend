import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { StatCardSkeleton } from "@/components/shared/skeletons";
import StudentPayments from "./StudentPayments";
import Assignments from "./Assignments";
import { AppleHeader } from "@/components/shared/AppleUI";
import {
  Activity,
  Plus,
  Database,
  FileText,
  Trash2,
  UserCheck,
  Phone,
  RefreshCw,
  Search,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DataTable from "@/components/ui/data-table";
import SessionStatsCard from "./SessionStatsCard";
import PostTuition from "../../pages/PostTuition";
 
const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "post-job", label: "Post Job", icon: Plus },
  { id: "my-jobs", label: "My Requests", icon: Database },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "booked", label: "Engagements", icon: UserCheck },
  { id: "payments", label: "Payments", icon: Banknote },
  { id: "assignments", label: "Assignments", icon: Search },
];
 
/**
 * StudentDashboard Component — Refined Apple Aesthetic
 */
const StudentDashboard = () => {
  const { user } = useAuth();
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
 
  // react-hook-form initialization removed, handled in PostTuition component
 
  // Fetch tuitions for this student
  const fetchMyTuitions = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await api.get(`/api/tuitions/student/${user.email}`);
      setMyTuitions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tuitions:", err);
      toast.error("Failed to load your requests");
      setMyTuitions([]);
    }
  }, [user?.email]);
 
  // Fetch bookings for this student
  const fetchBookings = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await api.get(`/api/bookings/student/${user.email}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      toast.error("Failed to load bookings");
      setBookings([]);
    }
  }, [user?.email]);
 
  // Fetch applications for student's tuitions
  const fetchApplications = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await api.get(`/api/applications/student/${user.email}`);
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      toast.error("Failed to load applications");
      setApplications([]);
    }
  }, [user?.email]);
 
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
 
  // onPostTuition removed, handled in PostTuition component
 
  const handleApprove = (id) => navigate(`/checkout/${id}`);
 
  const handleReject = async (id) => {
    if (!confirm("Reject this application?")) return;
    try {
      await api.patch(`/api/applications/${id}`, { status: "rejected" });
      toast.success("Application rejected");
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "rejected" } : a)),
      );
    } catch {
      toast.error("Failed to reject application");
    }
  };
 
  const handleDeleteTuition = async (tid) => {
    if (!confirm("Delete this request?")) return;
    try {
      await api.delete(`/api/tuitions/${tid}`);
      toast.success("Request deleted");
      await refreshData();
    } catch {
      toast.error("Failed to delete request");
    }
  };
 
  return (
    <div className="space-y-10 animate-in fade-in duration-700 animate-fade-in-up">
      <AppleHeader
        title={`Hello, ${user?.displayName?.split(" ")[0]}`}
        subtitle="Manage your tutoring requests and find the perfect match for your studies."
        badge={
          <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary border border-primary/20">
            Student Dashboard
          </span>
        }
      />
 
      {/* Tab Navigation */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border w-full max-w-full overflow-x-auto scrollbar-hide flex-nowrap">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-all duration-300 rounded-lg whitespace-nowrap min-w-fit active:scale-[0.98]",
                activeTab === tab.id
                  ? "bg-card text-primary shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
              )}
            >
              <tab.icon
                size={14}
                className={
                  activeTab === tab.id ? "text-primary" : "opacity-50"
                }
              />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
 
      {/* Overview Content */}
      {activeTab === "overview" &&
        (loading ? (
          <div className="space-y-6">
            <SessionStatsCard />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <SessionStatsCard />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <Card className="p-6 md:p-10 group" >
              <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-primary/20 shadow-sm">
                <Database size={24} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Active Requests
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter tabular-nums">
                  {myTuitions.length}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Requests
                </span>
              </div>
            </Card>
 
            <Card className="p-6 md:p-10 group" >
              <div className="size-12 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-indigo-500/20 shadow-sm">
                <FileText size={24} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Tutor Applications
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter tabular-nums">
                  {applications.length}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Applications
                </span>
              </div>
            </Card>
 
            <Card
              className="p-6 md:p-10 group col-span-2 lg:col-span-1"
              
            >
              <div className="size-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-emerald-500/20 shadow-sm">
                <UserCheck size={24} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Engagements
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter tabular-nums">
                  {bookings.filter((b) => b.isAccepted).length}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Sessions
                </span>
              </div>
            </Card>
          </div>
          </div>
        ))}
      {/* Post Job Tab */}
      {activeTab === "post-job" && (
        <PostTuition
          isDashboard={true}
          onSuccess={async () => {
            await refreshData();
            setActiveTab("my-jobs");
          }}
        />
      )}
 
      {/* My Jobs Tab */}
      {activeTab === "my-jobs" && (
        <DataTable
          rowKey={(row) => row._id}
          data={myTuitions}
          emptyState={<p className="italic">No active requests.</p>}
          columns={[
            {
              key: "subject",
              label: "Subject",
              render: (_, row) => (
                <>
                  <p className="text-sm font-bold text-foreground">{row.subject}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{row.class_name}</p>
                </>
              ),
            },
            {
              key: "salary",
              label: "Budget",
              render: (val) => (
                <span className="text-sm font-bold text-primary tabular-nums">৳{val}</span>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (val) => (
                <Badge variant={val === "approved" ? "success" : "default"} className="rounded-lg">
                  {val === "approved" ? "Active" : "Pending"}
                </Badge>
              ),
            },
            {
              key: "_id",
              label: "Actions",
              align: "right",
              render: (_, row) => (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => navigate(`/tuition/${row._id}`)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteTuition(row._id)}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}
 
      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
          {applications.length === 0 ? (
            <Card className="col-span-full p-32 text-center border-dashed">
              <Search
                size={48}
                className="text-muted-foreground/20 mx-auto mb-8"
                strokeWidth={1}
              />
              <p className="text-sm font-medium text-muted-foreground italic">
                No incoming applications yet.
              </p>
            </Card>
          ) : (
            applications.map((app) => (
              <Card
                key={app._id}
                className="p-4 md:p-8 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground tracking-tight">
                        {app.tutorName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {app.tutorEmail}
                      </p>
                    </div>
                    <Badge
                      variant={app.status === "approved" ? "success" : app.status === "rejected" ? "error" : "warning"}
                      className="rounded-lg"
                    >
                      {app.status}
                    </Badge>
                  </div>
 
                  <div className="space-y-4 mb-8">
                    <div className="p-4 rounded-lg bg-background border border-border text-xs text-muted-foreground leading-relaxed italic">
                      "{app.qualifications}"
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Expected Salary
                      </span>
                      <span className="text-lg font-bold text-primary tabular-nums">
                        ৳{app.expectedSalary}
                      </span>
                    </div>
                  </div>
 
                  {app.status === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 h-10 rounded-lg text-xs active:scale-[0.98]"
                        onClick={() => handleReject(app._id)}
                      >
                        Decline
                      </Button>
                      <Button
                        className="flex-1 h-10 rounded-lg text-xs active:scale-[0.98]"
                        onClick={() => handleApprove(app._id)}
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
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
          emptyState={<p className="italic">No verified engagements yet.</p>}
          columns={[
            {
              key: "tutor_name",
              label: "Tutor Name",
              render: (_, row) => (
                <p className="text-sm font-bold text-foreground">
                  {row.tutor_name || row.tutorName}
                </p>
              ),
            },
            {
              key: "subject",
              label: "Subject",
              render: (val) => (
                <span className="text-sm font-semibold text-muted-foreground">{val}</span>
              ),
            },
            {
              key: "mobile",
              label: "Contact",
              align: "center",
              render: (val) => (
                <a
                  href={`tel:${val}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1.5"
                >
                  <Phone size={12} /> {val}
                </a>
              ),
            },
            {
              key: "_id",
              label: "Verification",
              align: "right",
              render: (_, row) => (
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="success" className="rounded-lg">
                    Active
                  </Badge>
                  {row.isAccepted && (
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs rounded-lg active:scale-[0.98]"
                      onClick={() => navigate(`/session/${row._id}`)}
                    >
                      Join Room
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
