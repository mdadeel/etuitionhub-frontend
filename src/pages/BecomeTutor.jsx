import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoginRequiredModal from "../components/shared/LoginRequiredModal";
import {
  BANGLADESH_DIVISIONS,
  SUBJECT_OPTIONS,
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  WEEK_DAYS,
} from "../utils/constants";
import {
  Briefcase,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  MapPin,
  Phone,
  DollarSign,
  ShieldCheck,
  Calendar,
  Globe,
} from "lucide-react";

const BecomeTutor = () => {
  const {
    user,
    dbUser,
    userRole,
    loading: authLoading,
    refreshUserFromDB,
  } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [name, setName] = useState(
    dbUser?.displayName || user?.displayName || "",
  );
  const [phone, setPhone] = useState(dbUser?.mobileNumber || "");
  const [qualification, setQualification] = useState(
    dbUser?.qualification || "",
  );
  const [subjects, setSubjects] = useState(dbUser?.subjects || []);
  const [expectedSalary, setExpectedSalary] = useState(
    dbUser?.expectedSalary || "",
  );
  const [location, setLocation] = useState(dbUser?.location || "");
  const [gender, setGender] = useState(dbUser?.gender || "");
  const [languagePreference, setLanguagePreference] = useState(
    dbUser?.languagePreference || "both",
  );
  const [availableDays, setAvailableDays] = useState(
    dbUser?.availableDays || [],
  );

  const isAlreadyTutor = userRole === "tutor";

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const toggleSubject = (subject) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (
      !name ||
      !phone ||
      !qualification ||
      subjects.length === 0 ||
      !location ||
      !gender
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/api/users/by-email/${user.email}`, {
        displayName: name,
        mobileNumber: phone,
        qualification,
        subjects,
        expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
        location,
        gender,
        languagePreference,
        availableDays,
        role: "tutor",
      });

      toast.success("Tutor profile created successfully!");
      await refreshUserFromDB(user.email);
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to create tutor profile",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container-narrow px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-heading text-foreground mb-2">
            Become a tutor
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto md:mx-0">
            Create your professional tutor profile and start connecting with
            students across Bangladesh.
          </p>
        </div>

        {!user ? (
          <div className="bg-card border border-border rounded-2xl p-10 md:p-14 text-center shadow-sm">
            <div className="size-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/[0.02]">
              <Briefcase size={28} className="text-primary/60" />
            </div>
            <h2 className="text-xl font-heading text-foreground mb-3">
              Create an account first
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              You need a verified account to register as a tutor on our
              platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="lg" className="w-full sm:w-auto px-8">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        ) : isAlreadyTutor ? (
          <div className="bg-card border border-border rounded-2xl p-10 md:p-14 text-center shadow-sm">
            <div className="size-16 bg-success/5 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-success/[0.02]">
              <ShieldCheck size={28} className="text-success" />
            </div>
            <h2 className="text-xl font-heading text-foreground mb-3">
              You're already a tutor
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              Your tutor profile is active. You can manage your availability and
              applications from your dashboard.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/dashboard" className="gap-2">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-8 md:gap-12">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className="relative flex flex-col items-center gap-2"
                >
                  <div
                    className={`size-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                      step >= s
                        ? "bg-primary text-white shadow-md ring-4 ring-primary/10"
                        : "bg-muted text-slate-400"
                    }`}
                  >
                    {step > s ? <CheckCircle size={16} /> : s}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                      step >= s ? "text-foreground" : "text-slate-400"
                    }`}
                  >
                    {s === 1 ? "Basic Info" : "Details"}
                  </span>
                  {s === 1 && (
                    <div
                      className={`absolute left-full top-4 w-8 md:w-12 h-0.5 -translate-x-1/2 transition-colors duration-300 ${
                        step > 1 ? "bg-primary" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-2xl p-6 md:p-10 space-y-8 shadow-sm"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-foreground ml-1">
                      Full Name
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-11 bg-card border-border text-foreground focus:border-primary focus:ring-primary/10 placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-foreground ml-1">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="h-11 pl-11 bg-card border-border text-foreground focus:border-primary focus:ring-primary/10 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-foreground ml-1">
                      Academic Qualification
                    </Label>
                    <Textarea
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. BSc in Mathematics, University of Dhaka. Mention your current status."
                      className="min-h-[120px] py-3 resize-none bg-card border-border text-foreground focus:border-primary focus:ring-primary/10 placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    size="lg"
                    className="w-full gap-2 group"
                  >
                    Continue{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-foreground ml-1">
                        Subjects You Teach ({subjects.length} selected)
                      </Label>
                      {subjects.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSubjects([])}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2.5 p-5 bg-background/50 rounded-2xl border border-border">
                      {SUBJECT_OPTIONS.map((subject) => {
                        const isSelected = subjects.includes(subject);
                        return (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => toggleSubject(subject)}
                            className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 border ${
                              isSelected
                                ? "bg-primary text-white border-primary shadow-sm scale-105"
                                : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:bg-primary/[0.02]"
                            }`}
                          >
                            {subject}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability & Preferences */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-foreground ml-1">
                      Available Days ({availableDays.length} selected)
                    </Label>
                    <div className="flex flex-wrap gap-2.5 p-5 bg-background/50 rounded-2xl border border-border">
                      {WEEK_DAYS.map((day) => {
                        const isSelected = availableDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 border ${
                              isSelected
                                ? "bg-primary text-white border-primary shadow-sm scale-105"
                                : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:bg-primary/[0.02]"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold text-foreground ml-1">
                        Gender
                      </Label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full h-11 px-4 rounded-md border border-border bg-card text-sm text-foreground focus:border-primary focus:ring-primary/10 appearance-none outline-none transition-all cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundSize: "1em",
                          backgroundPosition: "right 1rem center",
                          backgroundRepeat: "no-repeat",
                        }}
                        required
                      >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold text-foreground ml-1">
                        Language Preference
                      </Label>
                      <select
                        value={languagePreference}
                        onChange={(e) => setLanguagePreference(e.target.value)}
                        className="w-full h-11 px-4 rounded-md border border-border bg-card text-sm text-foreground focus:border-primary focus:ring-primary/10 appearance-none outline-none transition-all cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundSize: "1em",
                          backgroundPosition: "right 1rem center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {LANGUAGE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold text-foreground ml-1">
                        Expected Monthly Salary
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                          ৳
                        </span>
                        <Input
                          value={expectedSalary}
                          onChange={(e) => setExpectedSalary(e.target.value)}
                          type="number"
                          placeholder="5000"
                          className="h-11 pl-8 bg-card border-border text-foreground focus:border-primary focus:ring-primary/10 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold text-foreground ml-1">
                        Preferred Division
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full h-11 pl-11 pr-4 rounded-md border border-border bg-card text-sm text-foreground focus:border-primary focus:ring-primary/10 appearance-none outline-none transition-all cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundSize: "1em",
                            backgroundPosition: "right 1rem center",
                            backgroundRepeat: "no-repeat",
                          }}
                          required
                        >
                          <option value="">Select division</option>
                          {BANGLADESH_DIVISIONS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto px-10 h-12"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      size="lg"
                      className="flex-1 w-full h-12"
                    >
                      {submitting
                        ? "Creating Profile..."
                        : "Create Tutor Profile"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
      <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="become a tutor" />
    </div>
  );
};

export default BecomeTutor;
