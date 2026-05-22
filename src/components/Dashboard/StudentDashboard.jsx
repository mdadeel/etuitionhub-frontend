import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import LoadingSpinner from "../shared/LoadingSpinner";
import StudentPayments from "./StudentPayments";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppleCard, AppleHeader, AppleButton } from "../shared/AppleUI";
import FilterSelect from "../shared/FilterSelect";
import { cn } from "@/lib/utils";
import { BANGLADESH_DIVISIONS, MEDIUM_OPTIONS } from "../../utils/constants";

/**
 * StudentDashboard Component — Refined Apple Aesthetic
 */
const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookings, setBookings] = useState([]);
  const [myTuitions, setMyTuitions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

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

  const onPostTuition = async (data) => {
    setSubmitting(true);
    const postData = {
      ...data,
      student_email: user?.email,
      status: "pending",
    };

    try {
      await api.post("/api/tuitions", postData);
      toast.success("Request posted successfully!");
      reset();
      await refreshData();
      setActiveTab("my-jobs");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to post request";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

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

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "post-job", label: "Post Job", icon: Plus },
    { id: "my-jobs", label: "My Requests", icon: Database },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "booked", label: "Engagements", icon: UserCheck },
    { id: "payments", label: "Payments", icon: Banknote },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <AppleHeader
        title={`Hello, ${user?.displayName?.split(" ")[0]}`}
        subtitle="Manage your tutoring requests and find the perfect match for your studies."
        badge={
          <span className="px-3 py-1 text-xs font-semibold rounded-none bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">
            Student Dashboard
          </span>
        }
      />

      {/* Tab Navigation */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-none border border-border w-full max-w-full overflow-x-auto scrollbar-hide flex-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-all duration-300 rounded-none whitespace-nowrap min-w-fit",
                activeTab === tab.id
                  ? "bg-card text-[#2563EB] shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50",
              )}
            >
              <tab.icon
                size={14}
                className={
                  activeTab === tab.id ? "text-[#2563EB]" : "opacity-50"
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
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <AppleCard className="p-6 md:p-10 group" hover={false}>
              <div className="w-12 h-12 rounded-none bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-[#2563EB]/20 shadow-sm">
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
            </AppleCard>

            <AppleCard className="p-6 md:p-10 group" hover={false}>
              <div className="w-12 h-12 rounded-none bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-indigo-500/20 shadow-sm">
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
            </AppleCard>

            <AppleCard
              className="p-6 md:p-10 group col-span-2 lg:col-span-1"
              hover={false}
            >
              <div className="w-12 h-12 rounded-none bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-emerald-500/20 shadow-sm">
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
            </AppleCard>
          </div>
        ))}

      {/* Post Job Tab */}
      {activeTab === "post-job" && (
        <AppleCard className="p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-none -mr-32 -mt-32 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-none bg-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-[#2563EB]/20">
                <Plus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  Post a New Request
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Define your academic requirements to find the best tutor.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onPostTuition)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground ml-1">
                    Subject / Topic *
                  </Label>
                  <Input
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                    placeholder="e.g. Higher Mathematics"
                    className="h-11 rounded-none bg-background border-border"
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-600 ml-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground ml-1">
                    Class Level *
                  </Label>
                  <Controller
                    name="class_name"
                    control={control}
                    rules={{ required: "Class level is required" }}
                    render={({ field }) => (
                      <FilterSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Class"
                        options={[
                          "Class 6",
                          "Class 7",
                          "Class 8",
                          "Class 9",
                          "Class 10",
                          "HSC",
                        ]}
                      />
                    )}
                  />
                  {errors.class_name && (
                    <p className="text-xs text-red-600 ml-1">
                      {errors.class_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground ml-1">
                    Monthly Budget (BDT) *
                  </Label>
                  <Input
                    {...register("salary", { required: "Budget is required" })}
                    type="number"
                    placeholder="5000"
                    className="h-11 rounded-none bg-background border-border"
                  />
                  {errors.salary && (
                    <p className="text-xs text-red-600 ml-1">
                      {errors.salary.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground ml-1">
                    Curriculum *
                  </Label>
                  <Controller
                    name="medium"
                    control={control}
                    rules={{ required: "Curriculum is required" }}
                    render={({ field }) => (
                      <FilterSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Medium"
                        options={MEDIUM_OPTIONS}
                      />
                    )}
                  />
                  {errors.medium && (
                    <p className="text-xs text-red-600 ml-1">
                      {errors.medium.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground ml-1">
                  Division *
                </Label>
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Division is required" }}
                  render={({ field }) => (
                    <FilterSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Division"
                      options={BANGLADESH_DIVISIONS}
                    />
                  )}
                />
                {errors.location && (
                  <p className="text-xs text-red-600 ml-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <AppleButton
                type="submit"
                className="w-full h-12 rounded-none shadow-lg shadow-[#2563EB]/20"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Publishing...
                  </>
                ) : (
                  "Publish Request"
                )}
              </AppleButton>
            </form>
          </div>
        </AppleCard>
      )}

      {/* My Jobs Tab */}
      {activeTab === "my-jobs" && (
        <AppleCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-8 py-5 text-xs font-semibold text-muted-foreground">
                    Subject
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-muted-foreground">
                    Budget
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(15,23,46,0.08)]">
                {myTuitions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-20 text-center text-sm text-muted-foreground italic"
                    >
                      No active requests.
                    </td>
                  </tr>
                ) : (
                  myTuitions.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-background/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-foreground">
                          {job.subject}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium mt-1">
                          {job.class_name}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-[#2563EB] tabular-nums">
                        ৳{job.salary}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-none ${job.status === "approved" ? "bg-[#2563EB]/10 text-[#2563EB]" : "bg-background text-muted-foreground"}`}
                        >
                          {job.status === "approved" ? "Active" : "Pending"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => navigate(`/tuition/${job._id}`)}
                            className="text-xs font-bold text-[#2563EB] hover:underline"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteTuition(job._id)}
                            className="text-xs font-bold text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AppleCard>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
          {applications.length === 0 ? (
            <AppleCard className="col-span-full p-32 text-center border-dashed">
              <Search
                size={48}
                className="text-muted-foreground/20 mx-auto mb-8"
                strokeWidth={1}
              />
              <p className="text-sm font-medium text-muted-foreground italic">
                No incoming applications yet.
              </p>
            </AppleCard>
          ) : (
            applications.map((app) => (
              <AppleCard
                key={app._id}
                className="p-4 md:p-8 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
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
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-none ${app.status === "approved" ? "bg-[#2563EB]/10 text-[#2563EB]" : app.status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-background text-muted-foreground"}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="p-4 rounded-none bg-background border border-border text-xs text-muted-foreground leading-relaxed italic">
                      "{app.qualifications}"
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Expected Salary
                      </span>
                      <span className="text-lg font-bold text-[#2563EB] tabular-nums">
                        ৳{app.expectedSalary}
                      </span>
                    </div>
                  </div>

                  {app.status === "pending" && (
                    <div className="flex gap-3">
                      <AppleButton
                        variant="outline"
                        className="flex-1 h-10 rounded-none text-xs"
                        onClick={() => handleReject(app._id)}
                      >
                        Decline
                      </AppleButton>
                      <AppleButton
                        className="flex-1 h-10 rounded-none text-xs"
                        onClick={() => handleApprove(app._id)}
                      >
                        Approve
                      </AppleButton>
                    </div>
                  )}
                </div>
              </AppleCard>
            ))
          )}
        </div>
      )}

      {/* Booked / Engagements Tab */}
      {activeTab === "booked" && (
        <AppleCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-8 py-5 text-xs font-semibold text-muted-foreground">
                    Tutor Name
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-muted-foreground">
                    Subject
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-muted-foreground text-center">
                    Contact
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-muted-foreground text-right">
                    Verification
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(15,23,46,0.08)]">
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-20 text-center text-sm text-muted-foreground italic"
                    >
                      No verified engagements yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-background/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-foreground">
                          {booking.tutor_name || booking.tutorName}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-sm font-semibold text-muted-foreground">
                        {booking.subject}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <a
                          href={`tel:${booking.mobile}`}
                          className="text-xs font-bold text-[#2563EB] hover:underline flex items-center justify-center gap-1.5"
                        >
                          <Phone size={12} /> {booking.mobile}
                        </a>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-none bg-[#2563EB]/10 text-[#2563EB]">
                            Active
                          </span>
                          {booking.isAccepted && (
                            <AppleButton
                              size="sm"
                              className="h-7 px-3 text-xs rounded-none"
                              onClick={() =>
                                navigate(`/session/${booking._id}`)
                              }
                            >
                              Join Room
                            </AppleButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AppleCard>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && <StudentPayments />}
    </div>
  );
};

export default StudentDashboard;
