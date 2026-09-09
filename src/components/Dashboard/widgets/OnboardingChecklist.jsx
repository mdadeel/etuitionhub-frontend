import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ChevronRight, 
  X, 
  User, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  Building2, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const OnboardingChecklist = () => {
  const { user, dbUser, refreshUserFromDB } = useAuth();
  const [dismissing, setDismissing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // If already completed onboarding or no dbUser loaded yet, do not display
  if (!dbUser || dbUser.hasCompletedOnboarding === true) {
    return null;
  }

  const isTutor = dbUser.role?.toLowerCase() === "tutor";

  // Dynamic step evaluation based on live user profile data
  const tutorSteps = [
    {
      id: "profile",
      title: "Complete your profile details",
      description: "Add your qualification, taught subjects, and brief bio to attract students.",
      completed: Boolean(dbUser.qualification && (dbUser.subjects?.length > 0)),
      actionLabel: "Edit Profile",
      actionUrl: "/dashboard/profile",
      icon: User,
    },
    {
      id: "availability",
      title: "Set up weekly availability",
      description: "Choose days and hours you are available to take tuition sessions.",
      completed: Boolean(dbUser.availableDays?.length > 0),
      actionLabel: "Set Days",
      actionUrl: "/dashboard/availability",
      icon: Calendar,
    },
    {
      id: "verification",
      title: "Verify your identity",
      description: "Submit your NID or student ID to earn the Verified Tutor trust badge.",
      completed: Boolean(dbUser.verificationStatus && dbUser.verificationStatus !== "unverified"),
      actionLabel: "Get Verified",
      actionUrl: "/dashboard/verification",
      icon: ShieldCheck,
    },
    {
      id: "browse_tuitions",
      title: "Explore tuition requirements",
      description: "Find matching student posts and apply to start tutoring immediately.",
      completed: false,
      actionLabel: "Find Tuitions",
      actionUrl: "/tuitions",
      icon: BookOpen,
    },
  ];

  const studentSteps = [
    {
      id: "profile",
      title: "Complete your contact profile",
      description: "Add your mobile number and district so verified tutors can reach you.",
      completed: Boolean(dbUser.mobileNumber && dbUser.displayName),
      actionLabel: "Edit Profile",
      actionUrl: "/dashboard/profile",
      icon: User,
    },
    {
      id: "post_job",
      title: "Post your tuition requirement",
      description: "Tell tutors your class, subject needs, and budget to receive applications.",
      completed: false,
      actionLabel: "Post Tuition",
      actionUrl: "/dashboard?tab=post-job",
      icon: BookOpen,
    },
    {
      id: "browse_tutors",
      title: "Browse verified private tutors",
      description: "Search top educators in your area with verified academic credentials.",
      completed: false,
      actionLabel: "Browse Tutors",
      actionUrl: "/tutors",
      icon: User,
    },
    {
      id: "institutions",
      title: "Explore educational institutions",
      description: "Discover accredited coaching centers, academies, and schools.",
      completed: false,
      actionLabel: "Explore Institutions",
      actionUrl: "/organizations",
      icon: Building2,
    },
  ];

  const steps = isTutor ? tutorSteps : studentSteps;
  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const handleDismiss = async () => {
    setDismissing(true);
    try {
      if (dbUser._id) {
        await api.patch(`/api/users/${dbUser._id}`, { hasCompletedOnboarding: true });
      } else if (dbUser.email || user?.email) {
        await api.patch(`/api/users/by-email/${encodeURIComponent(dbUser.email || user.email)}`, {
          hasCompletedOnboarding: true,
        });
      }
      toast.success("Welcome aboard! Onboarding checklist dismissed.");
      if (typeof refreshUserFromDB === "function") {
        await refreshUserFromDB(dbUser.email || user?.email);
      }
    } catch {
      toast.error("Could not update onboarding status.");
    } finally {
      setDismissing(false);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card shadow-sm">
      <div className="p-5 md:p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Welcome to eTuitionBD, {dbUser.displayName || "there"}!
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-primary/15 text-primary rounded-full">
                  Quick Start
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete these recommended steps to get the most out of your {isTutor ? "tutoring" : "learning"} journey.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors"
              title={collapsed ? "Expand checklist" : "Collapse checklist"}
              aria-label={collapsed ? "Expand checklist" : "Collapse checklist"}
            >
              {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
            <button
              onClick={handleDismiss}
              disabled={dismissing}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted/80 rounded-lg transition-colors"
              title="Dismiss checklist permanently"
              aria-label="Dismiss checklist"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {completedCount} of {steps.length} completed
            </span>
            <span className="font-medium text-muted-foreground tabular-nums">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        {!collapsed && (
          <div className="mt-5 space-y-2.5 divide-y divide-border/40">
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.id}
                  className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {step.completed ? (
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      ) : (
                        <Circle className="size-4 text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-xs font-semibold flex items-center gap-1.5",
                          step.completed ? "text-muted-foreground line-through" : "text-foreground"
                        )}
                      >
                        <StepIcon size={13} className="text-primary shrink-0" />
                        <span>{step.title}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 pl-7 sm:pl-0">
                    <Link
                      to={step.actionUrl}
                      className={cn(
                        "px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1",
                        step.completed
                          ? "bg-muted text-muted-foreground hover:text-foreground"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      )}
                    >
                      {step.completed ? "View" : step.actionLabel}
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                You can dismiss this card at any time when ready.
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                disabled={dismissing}
                className="text-xs text-muted-foreground hover:text-foreground h-8"
              >
                {dismissing ? "Dismissing..." : "Dismiss Checklist"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OnboardingChecklist;
