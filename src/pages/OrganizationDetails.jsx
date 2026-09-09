import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles,
  Share2,
  Bookmark,
  Calendar,
  DollarSign,
  Award,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Send
} from "lucide-react";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import SEO from "../components/shared/SEO";
import { cn } from "@/lib/utils";
import OrgAdmissionModal from "../components/Organizations/OrgAdmissionModal";
import { useTranslation } from "react-i18next";

const TYPE_LABELS = Object.freeze({
  coaching_center: "Coaching Center",
  school: "School",
  college: "College",
  academy: "Training Academy",
  other: "Educational Institution",
});

const getTypeLabel = (type) => {
  if (type && Object.prototype.hasOwnProperty.call(TYPE_LABELS, type)) {
    return TYPE_LABELS[type];
  }
  return "Educational Institution";
};

const OrganizationDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Join / Admission states
  const [joinStatus, setJoinStatus] = useState(null);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/organizations/slug/${slug}`);
        setData(res.data.data);
      } catch {
        setError("Failed to load institution details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrgDetails();
  }, [slug]);

  const organization = data;

  useEffect(() => {
    if (!user || !organization) return;

    const checkJoinStatus = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${organization._id}/join-requests/my`);
        if (res.data.data) {
          setJoinStatus("pending");
        }
      } catch {
        // Not pending - ok
      }
    };

    checkJoinStatus();
  }, [user, organization]);

  const handleWithdrawRequest = async () => {
    try {
      setWithdrawing(true);
      const res = await api.get(`/api/v1/organizations/${organization._id}/join-requests/my`);
      const myRequest = res.data.data;
      if (myRequest) {
        await api.delete(`/api/v1/organizations/${organization._id}/join-requests/${myRequest._id}`);
        setJoinStatus(null);
        toast.success("Join request withdrawn successfully.");
      }
    } catch {
      toast.error("Failed to withdraw join request.");
    } finally {
      setWithdrawing(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Campus link copied to clipboard!");
    } else {
      toast.success(url);
    }
  };

  const handleBookmark = () => {
    toast.success(`${organization?.name} saved to your bookmarks!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex justify-center items-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-xs text-muted-foreground font-semibold">{t("common.loading_campus", "Loading campus details...")}</p>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 text-center">
        <Building2 className="size-16 mx-auto text-muted-foreground/30 mt-16 mb-4" />
        <h2 className="text-2xl font-bold font-heading text-foreground mb-2">
          {error || "Institution Not Found"}
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
          {t("org.not_found_desc", "The requested educational institution or coaching center could not be found or may have been updated.")}
        </p>
        <Link to="/organizations">
          <Button variant="outline" className="text-xs font-semibold">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  const courses = organization.courses || [];
  const faculty = organization.faculty || [];
  const branches = organization.branches || [];
  const scholarships = organization.scholarships || [];
  const announcements = organization.announcements || [];

  const totalStudents = organization.counts?.students || organization.stats?.totalStudents || 0;
  const totalFaculty = organization.counts?.teachers || organization.stats?.totalTutors || 0;
  const primaryPhone = organization.profile?.publicPhone || organization.contact?.phone;
  const primaryEmail = organization.profile?.publicEmail || organization.contact?.email;

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "programs", label: `Programs (${courses.length})`, icon: BookOpen },
    { id: "faculty", label: `Faculty (${faculty.length})`, icon: Users },
    { id: "branches", label: `Campuses (${branches.length})`, icon: MapPin },
    { id: "scholarships", label: `Scholarships (${scholarships.length})`, icon: Award },
    { id: "contact", label: "Contact & About", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title={`${organization.name} | eTuitionBD`}
        description={
          organization.profile?.description?.slice(0, 160) ||
          `Explore courses, batches, verified faculty, and campus details for ${organization.name} on eTuitionBD.`
        }
      />

      {/* Hero Cover Banner */}
      <div className="h-52 sm:h-64 md:h-80 bg-gradient-to-r from-primary/20 via-primary/10 to-muted w-full relative overflow-hidden">
        {organization.profile?.banner ? (
          <img
            src={organization.profile.banner}
            alt={`${organization.name} Campus Banner`}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full flex items-center justify-center opacity-10">
            <Building2 size={128} className="text-primary" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Institution Identity Card (Above the Fold) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Logo */}
            <div className="size-28 sm:size-32 rounded-2xl bg-card border-4 border-background shadow-lg overflow-hidden shrink-0 flex items-center justify-center">
              {organization.profile?.logo ? (
                <img
                  src={organization.profile.logo}
                  alt={organization.name}
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-14 text-primary opacity-60" />
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-md border border-primary/20">
                  {getTypeLabel(organization.type)}
                </span>
                {organization.verificationStatus === "verified" && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" /> Verified Academic Partner
                  </span>
                )}
                {organization.category && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground rounded-md capitalize">
                    {organization.category.replace(/_/g, " ")}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-foreground tracking-tight mb-2">
                {organization.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                {organization.profile?.district && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    <span>{organization.profile.district}{organization.profile.thana ? `, ${organization.profile.thana}` : ""}</span>
                  </div>
                )}
                {branches.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-primary" />
                    <span>{branches.length} Campuses</span>
                  </div>
                )}
                {totalStudents > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-primary" />
                    <span>{totalStudents.toLocaleString()} Students Enrolled</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Button
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="text-xs font-bold px-5 h-10 shadow-md gap-1.5"
                >
                  <Send size={13} />
                  Apply for Admission
                </Button>

                {primaryPhone && (
                  <Button
                    variant="outline"
                    onClick={() => { window.location.href = `tel:${primaryPhone}`; }}
                    className="text-xs font-semibold h-10 gap-1.5"
                  >
                    <Phone size={13} className="text-primary" />
                    Call Campus
                  </Button>
                )}

                {joinStatus === "pending" && (
                  <Button
                    variant="outline"
                    disabled={withdrawing}
                    onClick={handleWithdrawRequest}
                    className="text-xs font-semibold h-10 text-destructive border-destructive/30"
                  >
                    {withdrawing ? <Loader2 className="size-3 animate-spin mr-1" /> : <Clock className="size-3 mr-1" />}
                    Withdraw Request
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className="h-10 px-3 text-muted-foreground hover:text-foreground"
                  title="Bookmark"
                >
                  <Bookmark size={15} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="h-10 px-3 text-muted-foreground hover:text-foreground"
                  title="Share"
                >
                  <Share2 size={15} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Sub-Navigation Bar */}
        <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md border-b border-border mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <TabIcon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Main Layout: Tab Contents + Right Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Left Tab View */}
          <div className="lg:col-span-2 space-y-8">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Counter Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <Users size={18} className="text-primary mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-foreground">
                      {totalStudents > 0 ? totalStudents.toLocaleString() : "Active"}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                      {t("org.students", "Students")}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <GraduationCap size={18} className="text-indigo-500 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-foreground">
                      {totalFaculty > 0 ? totalFaculty : "Certified"}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                      {t("org.teachers", "Teachers")}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <BookOpen size={18} className="text-emerald-500 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-foreground">{courses.length}</p>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                      {t("org.programs", "Programs")}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <Building2 size={18} className="text-amber-500 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-foreground">{branches.length || 1}</p>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                      {t("org.campuses", "Campuses")}
                    </p>
                  </div>
                </div>

                {/* About Section */}
                <Card className="p-6 md:p-8 border border-border">
                  <h2 className="text-base font-bold font-heading text-foreground mb-3 flex items-center gap-2">
                    <Building2 size={16} className="text-primary" /> About {organization.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                    {organization.profile?.description ||
                      "This institution provides structured learning, verified teachers, and curriculum-aligned batches to help students excel in board and competitive exams."}
                  </p>
                </Card>

                {/* Active Announcements */}
                {announcements.length > 0 && (
                  <Card className="p-6 border border-border">
                    <h3 className="text-sm font-bold font-heading text-foreground mb-4 flex items-center gap-2">
                      <Sparkles size={15} className="text-primary" /> Campus Announcements
                    </h3>
                    <div className="space-y-3">
                      {announcements.map((ann) => (
                        <div
                          key={ann._id}
                          className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-foreground">{ann.title}</h4>
                            {ann.isPinned && (
                              <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-primary/10 text-primary rounded">
                                {t("common.pinned", "Pinned")}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ann.body}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Academic Highlights Grid */}
                <Card className="p-6 border border-border">
                  <h3 className="text-sm font-bold font-heading text-foreground mb-4">
                    {t("org.academic_standards_title", "Academic Standards & Facilities")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-foreground">{t("org.curriculum_alignment", "Curriculum Alignment")}</p>
                        <p className="text-muted-foreground text-[11px]">{t("org.curriculum_alignment_desc", "NCTB Bangla & English versions, plus Cambridge test prep.")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-foreground">{t("org.verified_teachers", "Verified Teachers")}</p>
                        <p className="text-muted-foreground text-[11px]">{t("org.verified_teachers_desc", "Experienced educators from BUET, DU, and Medical faculties.")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-foreground">{t("org.weekly_model_tests", "Weekly Model Tests")}</p>
                        <p className="text-muted-foreground text-[11px]">{t("org.weekly_model_tests_desc", "Regular evaluation, progress tracking, and report cards.")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-foreground">{t("org.multi_branch_presence", "Multi-Branch Presence")}</p>
                        <p className="text-muted-foreground text-[11px]">{t("org.multi_branch_presence_desc", "Centrally located physical campuses with dedicated study rooms.")}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* PROGRAMS & COURSES TAB */}
            {activeTab === "programs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold font-heading text-foreground">
                      {t("org.academic_programs", "Academic Programs & Courses")} ({courses.length})
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {t("org.academic_programs_desc", "Browse courses, enrollment fee structures, and batch schedules.")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsAdmissionModalOpen(true)}
                    className="text-xs font-semibold"
                  >
                    {t("org.enroll_inquire", "Enroll / Inquire")}
                  </Button>
                </div>

                {courses.length === 0 ? (
                  <Card className="p-12 text-center border border-border">
                    <BookOpen size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                    <h3 className="text-sm font-bold text-foreground mb-1">
                      {t("org.no_published_courses", "No Published Courses Yet")}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                      {t("org.no_courses_desc", "This institution is currently updating its program schedules. You can submit an inquiry to be notified when enrollment opens.")}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAdmissionModalOpen(true)}
                      className="text-xs"
                    >
                      {t("org.submit_general_inquiry", "Submit General Inquiry")}
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <Card
                        key={course._id}
                        className="p-5 border border-border hover:border-primary/40 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-bold text-foreground">{course.name}</h3>
                            {course.code && (
                              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-muted text-muted-foreground rounded">
                                {course.code}
                              </span>
                            )}
                          </div>
                          {course.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                              {course.description}
                            </p>
                          )}

                          <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border/50">
                            {course.fees?.monthly ? (
                              <div className="flex items-center justify-between">
                                <span>{t("org.monthly_fee", "Monthly Fee:")}</span>
                                <span className="font-bold text-foreground">
                                  ৳{course.fees.monthly.toLocaleString()}
                                </span>
                              </div>
                            ) : null}
                            {course.fees?.enrollment ? (
                              <div className="flex items-center justify-between">
                                <span>{t("org.enrollment_fee", "Enrollment Fee:")}</span>
                                <span className="font-semibold text-foreground">
                                  ৳{course.fees.enrollment.toLocaleString()}
                                </span>
                              </div>
                            ) : null}
                            {course.durationMonths ? (
                              <div className="flex items-center justify-between">
                                <span>{t("org.duration", "Duration:")}</span>
                                <span className="font-semibold text-foreground">
                                  {course.durationMonths} Months
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="pt-4 mt-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedCourseForModal(course);
                              setIsAdmissionModalOpen(true);
                            }}
                            className="w-full text-xs font-semibold"
                          >
                            {t("org.apply_for_course", "Apply for Course")}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FACULTY & MENTORS TAB */}
            {activeTab === "faculty" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold font-heading text-foreground">
                    {t("org.verified_faculty", "Verified Faculty & Mentors")} ({faculty.length})
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("org.faculty_desc_prefix", "Experienced subject matter experts and tutors teaching at")} {organization.name}.
                  </p>
                </div>

                {faculty.length === 0 ? (
                  <Card className="p-12 text-center border border-border">
                    <Users size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                    <h3 className="text-sm font-bold text-foreground mb-1">
                      {t("org.faculty_directory_updating", "Faculty Directory Updating")}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      {t("org.faculty_updating_desc", "Faculty profiles are currently undergoing credential verification. Check back soon.")}
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {faculty.map((teacher) => (
                      <Card
                        key={teacher._id}
                        className="p-4 border border-border flex items-start gap-3.5"
                      >
                        <div className="size-12 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                          {teacher.photoURL ? (
                            <img
                              src={teacher.photoURL}
                              alt={teacher.displayName}
                              className="size-full object-cover"
                            />
                          ) : (
                            <Users size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {teacher.displayName}
                          </h4>
                          <p className="text-[11px] text-primary font-semibold truncate">
                            {teacher.roleName || "Instructor"}
                          </p>
                          {teacher.qualification && (
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {teacher.qualification}
                            </p>
                          )}
                          {teacher.subjects && teacher.subjects.length > 0 && (
                            <p className="text-[10px] text-muted-foreground/70 truncate mt-1">
                              {t("common.subjects", "Subjects")}: {teacher.subjects.map(s => typeof s === 'object' ? s.name : s).join(", ")}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CAMPUSES & BRANCHES TAB */}
            {activeTab === "branches" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold font-heading text-foreground">
                    {t("org.campuses_branches", "Campuses & Branch Locations")} ({branches.length})
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("org.campuses_branches_desc", "Visit any of our physical branches for admission inquiries and classroom tours.")}
                  </p>
                </div>

                {branches.length === 0 ? (
                  <Card className="p-8 border border-border text-center">
                    <p className="text-xs text-muted-foreground">{t("org.main_branch_on_contact", "Main branch details available on contact tab.")}</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {branches.map((branch, idx) => (
                      <Card key={idx} className="p-5 border border-border space-y-3">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-primary" />
                          <h3 className="text-sm font-bold text-foreground">{branch.name}</h3>
                        </div>
                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          {branch.address && (
                            <p className="flex items-start gap-2">
                              <MapPin size={13} className="text-muted-foreground shrink-0 mt-0.5" />
                              <span>{branch.address}</span>
                            </p>
                          )}
                          {branch.phone && (
                            <p className="flex items-center gap-2">
                              <Phone size={13} className="text-muted-foreground shrink-0" />
                              <a href={`tel:${branch.phone}`} className="hover:underline text-foreground">
                                {branch.phone}
                              </a>
                            </p>
                          )}
                          {branch.email && (
                            <p className="flex items-center gap-2">
                              <Mail size={13} className="text-muted-foreground shrink-0" />
                              <a href={`mailto:${branch.email}`} className="hover:underline text-foreground">
                                {branch.email}
                              </a>
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SCHOLARSHIPS & AID TAB */}
            {activeTab === "scholarships" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold font-heading text-foreground">
                    {t("org.scholarships_waivers", "Scholarships & Fee Waivers")} ({scholarships.length})
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("org.waivers_provided_by", "Merit waivers and financial aid options provided by")} {organization.name}.
                  </p>
                </div>

                {scholarships.length === 0 ? (
                  <Card className="p-12 text-center border border-border">
                    <Award size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                    <h3 className="text-sm font-bold text-foreground mb-1">
                      {t("org.no_active_waivers", "No Active Waivers Open Right Now")}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                      {t("org.no_waivers_desc", "Merit waivers open during each academic intake. Contact campus administration to ask about board GPA discount criteria.")}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAdmissionModalOpen(true)}
                      className="text-xs"
                    >
                      {t("org.inquire_financial_aid", "Inquire About Financial Aid")}
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {scholarships.map((sch) => (
                      <Card
                        key={sch._id}
                        className="p-5 border border-primary/20 bg-primary/5 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-foreground">{sch.name}</h3>
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded">
                            {sch.type === "percentage" ? `${sch.value}% Waiver` : `৳${sch.value} Discount`}
                          </span>
                        </div>
                        {sch.description && (
                          <p className="text-xs text-muted-foreground">{sch.description}</p>
                        )}
                        <Button
                          size="sm"
                          onClick={() => setIsAdmissionModalOpen(true)}
                          className="w-full text-xs font-semibold mt-2"
                        >
                          {t("org.apply_waiver", "Apply for this Waiver")}
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CONTACT & ABOUT TAB */}
            {activeTab === "contact" && (
              <Card className="p-6 md:p-8 border border-border space-y-6">
                <div>
                  <h2 className="text-base font-bold font-heading text-foreground mb-1">
                    {t("org.contact_office", "Contact & Administrative Office")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("org.contact_office_desc", "Get in touch with admissions, student affairs, and management.")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {primaryEmail && (
                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                        <Mail size={12} className="text-primary" /> Admissions Email
                      </p>
                      <a href={`mailto:${primaryEmail}`} className="text-xs font-semibold text-foreground hover:underline">
                        {primaryEmail}
                      </a>
                    </div>
                  )}

                  {primaryPhone && (
                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                        <Phone size={12} className="text-primary" /> Campus Hotline
                      </p>
                      <a href={`tel:${primaryPhone}`} className="text-xs font-semibold text-foreground hover:underline">
                        {primaryPhone}
                      </a>
                    </div>
                  )}

                  {organization.profile?.address && (
                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1 sm:col-span-2">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                        <MapPin size={12} className="text-primary" /> Physical Address
                      </p>
                      <p className="text-xs font-semibold text-foreground">
                        {organization.profile.address}
                        {organization.profile.district ? `, ${organization.profile.district}` : ""}
                      </p>
                    </div>
                  )}
                </div>

                {/* Social Channels */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    {t("org.official_online_channels", "Official Online Channels")}
                  </h3>
                  <div className="flex items-center gap-2">
                    {organization.contact?.website && (
                      <a
                        href={organization.contact.website}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-muted rounded-lg text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1.5"
                      >
                        <Globe size={13} /> Official Website
                      </a>
                    )}
                    {organization.contact?.facebook && (
                      <a
                        href={organization.contact.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-muted rounded-lg text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1.5"
                      >
                        <Share2 size={13} /> Facebook
                      </a>
                    )}
                    {organization.contact?.youtube && (
                      <a
                        href={organization.contact.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-muted rounded-lg text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1.5"
                      >
                        <ExternalLink size={13} /> YouTube
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Rail / Sticky Persistent Sidebar */}
          <aside className="space-y-6">
            {/* Quick Admission CTA Card */}
            <Card className="p-6 border border-primary/20 bg-gradient-to-b from-primary/10 via-card to-card space-y-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-primary text-primary-foreground rounded">
                  {t("org.intake_open", "Intake Open")}
                </span>
                <h3 className="text-sm font-bold font-heading text-foreground pt-1">
                  {t("org.enrollment_batches", "Enrollment & Batches")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("org.enrollment_batches_desc", "Join upcoming academic batches, model tests, or personalized coaching programs.")}
                </p>
              </div>

              <Button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="w-full text-xs font-bold h-11 shadow-sm gap-2"
              >
                <Send size={14} />
                Apply for Admission
              </Button>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>{t("org.zero_app_fee", "Zero application fee. Official campus follow-up within 24 hours.")}</span>
              </div>
            </Card>

            {/* Campus Direct Hotline */}
            {primaryPhone && (
              <Card className="p-5 border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-primary" />
                  <h4 className="text-xs font-bold text-foreground">{t("org.need_urgent_counseling", "Need Urgent Counseling?")}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {t("org.urgent_counseling_desc", "Call our admissions counseling desk directly during standard office hours (9 AM - 8 PM).")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { window.location.href = `tel:${primaryPhone}`; }}
                  className="w-full text-xs font-semibold h-9 gap-1.5"
                >
                  <Phone size={12} className="text-primary" />
                  {primaryPhone}
                </Button>
              </Card>
            )}

            {/* Institution Verification & Safety */}
            <Card className="p-5 border border-border space-y-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                <h4 className="text-xs font-bold text-foreground">{t("org.verification_trust", "Verification & Trust")}</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {organization.name} is a verified institutional member of eTuitionBD. Faculty profiles and administrative credentials have been reviewed.
              </p>
            </Card>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3 flex items-center gap-2 shadow-2xl safe-bottom">
        {primaryPhone && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { window.location.href = `tel:${primaryPhone}`; }}
            className="flex-1 text-xs font-bold h-11 gap-1.5"
          >
            <Phone size={13} className="text-primary" />
            Call
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => setIsAdmissionModalOpen(true)}
          className="flex-1 text-xs font-bold h-11 gap-1.5"
        >
          <Send size={13} />
          Apply Now
        </Button>
      </div>

      {/* Admission Modal */}
      {isAdmissionModalOpen && (
        <OrgAdmissionModal
          open={isAdmissionModalOpen}
          onClose={() => {
            setIsAdmissionModalOpen(false);
            setSelectedCourseForModal(null);
          }}
          organization={organization}
          selectedCourse={selectedCourseForModal}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default OrganizationDetails;
