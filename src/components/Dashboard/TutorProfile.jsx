import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadingSpinner from "../shared/LoadingSpinner";
import {
  ShieldCheck,
  RefreshCw,
  Camera,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  MapPin,
  Save,
  Wallet,
  Briefcase,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  AppleCard,
  AppleButton,
  AppleBadge,
  AppleHeader,
} from "../shared/AppleUI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  BANGLADESH_DIVISIONS,
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  WEEK_DAYS,
} from "../../utils/constants";

const SUBJECT_OPTIONS = [
  "Mathematics",
  "English",
  "Bangla",
  "Physics",
  "Chemistry",
  "Biology",
  "Higher Math",
  "General Science",
  "ICT",
  "Accounting",
  "Finance",
  "Economics",
  "History",
  "Geography",
];

const TutorProfile = () => {
  const { user, dbUser, loading: authLoading, refreshUserFromDB } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mobileInput, setMobileInput] = useState("");
  const [qualification, setQualification] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [location, setLocation] = useState("");
  const [photoInput, setPhotoInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [gender, setGender] = useState("");
  const [languagePreference, setLanguagePreference] = useState("both");
  const [availableDays, setAvailableDays] = useState([]);

  useEffect(() => {
    if (dbUser) {
      setNameInput(dbUser.displayName || user?.displayName || "");
      setPhotoInput(dbUser.photoURL || user?.photoURL || "");
      setMobileInput(dbUser.mobileNumber || "");
      setQualification(dbUser.qualification || "");
      setSubjects(dbUser.subjects || []);
      setExpectedSalary(dbUser.expectedSalary || "");
      setLocation(dbUser.location || "");
      setGender(dbUser.gender || "");
      setLanguagePreference(dbUser.languagePreference || "both");
      setAvailableDays(dbUser.availableDays || []);
    }
  }, [dbUser, user]);

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

  const handleSave = async () => {
    if (nameInput.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        displayName: nameInput,
        photoURL: photoInput,
        mobileNumber: mobileInput,
        qualification,
        subjects,
        expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
        location,
        gender,
        languagePreference,
        availableDays,
      };

      await api.patch(`/api/users/by-email/${user?.email}`, updateData);
      toast.success("Profile updated successfully");
      await refreshUserFromDB(user?.email);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-12 space-y-2 border-b border-border pb-8">
        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">
          Tutor Profile
        </h1>
        <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">
          Manage your tutoring profile and qualifications.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Preview Card - Sharp */}
        <div className="bg-card border border-border rounded-none shadow-none">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Left: Profile Image */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-none overflow-hidden border border-border">
                <img
                  src={
                    photoInput || "https://i.ibb.co/4pDNDk1/default-avatar.png"
                  }
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              </div>
              {/* Verified badge removed as per request */}
            </div>

            {/* Right: Info */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Verified label removed as per request */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted text-muted-foreground rounded-none text-[9px] font-black uppercase tracking-widest border border-border">
                  <MapPin size={10} />
                  {location || "Location not set"}
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase leading-none">
                {nameInput || "Tutor Name"}
              </h2>

              <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase tracking-tight">
                <GraduationCap className="text-blue-600" size={18} />
                <span className="text-xs">
                  {qualification || "Qualifications not specified"}
                </span>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground text-xs font-bold leading-relaxed max-w-2xl italic uppercase tracking-tight">
                  "Passionate about making concepts easy to understand. Helping
                  students achieve their academic goals with personalized
                  guidance."
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Stats Strip */}
          <div className="bg-background border-t border-border px-6 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-none bg-muted border border-border flex items-center justify-center text-foreground">
                <Wallet size={16} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Monthly Fee
                </p>
                <p className="text-lg font-black text-foreground tracking-tighter">
                  ৳{parseInt(expectedSalary || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-none bg-muted border border-border flex items-center justify-center text-foreground">
                <Briefcase size={16} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Experience
                </p>
                <p className="text-lg font-black text-foreground tracking-tighter">
                  4+ Years
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-none bg-muted border border-border flex items-center justify-center text-foreground">
                <Star size={16} className="fill-blue-600 text-blue-600" />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Rating
                </p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-lg font-black text-foreground tracking-tighter">
                    4.9
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold">
                    (128)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="h-10 px-6 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-blue-600 transition-colors"
                onClick={() =>
                  dbUser?._id && window.open(`/tutor/${dbUser._id}`, "_blank")
                }
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form Section */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="p-8 bg-card border border-border rounded-none shadow-none">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={16} />
              Update Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full h-11 bg-background border border-border px-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all placeholder:text-muted-foreground"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full h-11 bg-background border border-border px-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all placeholder:text-muted-foreground"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  placeholder="01700000000"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  className="w-full h-11 bg-background border border-border px-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all placeholder:text-muted-foreground"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Division
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 bg-background border border-border px-4 text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
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

          {/* Professional Info */}
          <div className="p-8 bg-card border border-border rounded-none shadow-none">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
              <GraduationCap className="text-blue-600" size={16} />
              Professional Details
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Qualification
                </label>
                <input
                  type="text"
                  className="w-full h-11 bg-background border border-border px-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all placeholder:text-muted-foreground"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. B.Sc in Engineering, HSC with GPA 5"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Subjects You Can Teach
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_OPTIONS.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => toggleSubject(subject)}
                      className={cn(
                        "px-4 py-2 text-[10px] font-black rounded-none border transition-all uppercase tracking-widest",
                        subjects.includes(subject)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-background border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                      )}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Available Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "px-4 py-2 text-[10px] font-black rounded-none border transition-all uppercase tracking-widest",
                        availableDays.includes(day)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-background border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-11 bg-background border border-border px-4 text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
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
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Language Preference
                  </label>
                  <select
                    value={languagePreference}
                    onChange={(e) => setLanguagePreference(e.target.value)}
                    className="w-full h-11 bg-background border border-border px-4 text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                  >
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Expected Monthly Salary (BDT)
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="number"
                      className="w-full h-11 bg-background border border-border pl-11 pr-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all placeholder:text-muted-foreground"
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full h-14 bg-blue-600 hover:bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-none transition-all shadow-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
