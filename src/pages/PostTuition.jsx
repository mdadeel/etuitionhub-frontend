import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import api from "../services/api";
import {
  BANGLADESH_DIVISIONS,
  SUBJECT_OPTIONS,
  GENDER_OPTIONS,
  WEEK_DAYS,
  MEDIUM_OPTIONS,
} from "../utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, ArrowLeft, GraduationCap } from "lucide-react";
import LoginRequiredModal from "../components/shared/LoginRequiredModal";

const PostTuition = () => {
  const { user, dbUser, loading: authLoading } = useAuth();
  const role = dbUser?.role?.toLowerCase();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [salary, setSalary] = useState("");
  const [medium, setMedium] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [description, setDescription] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (role === "tutor") {
      toast.error(
        "Tutors cannot post tuitions. Switch to student mode or use a student account.",
      );
      return;
    }

    if (
      !subject ||
      !className ||
      !salary ||
      !medium ||
      !location ||
      !gender ||
      !daysPerWeek
    ) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/tuitions", {
        subject,
        class_name: className,
        salary: parseInt(salary),
        medium,
        location,
        student_email: user.email,
        gender,
        days_per_week: parseInt(daysPerWeek),
        available_days: availableDays,
        description: description || undefined,
        status: "pending",
      });
      toast.success("Tuition posted successfully!");
      navigate("/tuitions");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post tuition");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-heading text-foreground mb-2">
            Post a tuition requirement
          </h1>
          <p className="text-muted-foreground">
            Fill in your academic needs and we'll match you with suitable tutors
          </p>
        </div>

        {!user ? (
          <div className="bg-card border border-border p-8 rounded-xl text-center shadow-sm">
            <div className="size-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={28} className="text-muted-foreground" />
            </div>
            <h2 className="text-lg font-heading text-foreground mb-2">
              Login required
            </h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to post a tuition request
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-5 py-2.5 border border-border text-foreground font-medium rounded-lg hover:bg-background transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Subject *
                </Label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  required
                >
                  <option value="">Select subject</option>
                  {SUBJECT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Class Level *
                </Label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  required
                >
                  <option value="">Select class</option>
                  {[
                    "Class 1",
                    "Class 2",
                    "Class 3",
                    "Class 4",
                    "Class 5",
                    "Class 6",
                    "Class 7",
                    "Class 8",
                    "Class 9",
                    "Class 10",
                    "SSC",
                    "HSC 1st Year",
                    "HSC 2nd Year",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Monthly Budget (BDT) *
                </Label>
                <Input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  type="number"
                  placeholder="5000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Curriculum *
                </Label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  required
                >
                  <option value="">Select medium</option>
                  {MEDIUM_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Division *
              </Label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Preferred Tutor Gender *
              </Label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Days Per Week *
              </Label>
              <Input
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
                type="number"
                min="1"
                max="7"
                placeholder="e.g. 3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Available Days
              </Label>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => {
                  const isSelected = availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all border ${
                        isSelected
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : "bg-background text-muted-foreground border-border hover:border-[#2563EB]/30"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Additional Details
              </Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you're looking for in a tutor, specific requirements, etc."
                className="w-full min-h-[100px] px-3 py-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all resize-none"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 h-11"
              >
                {submitting ? "Posting..." : "Post Tuition"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="h-11 px-5"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
      <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="post a tuition" />
    </div>
  );
};

export default PostTuition;
