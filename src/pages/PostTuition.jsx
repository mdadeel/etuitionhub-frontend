import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import api from "../services/api";
import {
  BANGLADESH_DIVISIONS,
  SUBJECT_OPTIONS,
  GENDER_OPTIONS,
  MEDIUM_OPTIONS,
} from "../utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, ArrowLeft, GraduationCap, Plus, RefreshCw } from "lucide-react";
import LoginRequiredModal from "../components/shared/LoginRequiredModal";
import SEO from '../components/shared/SEO';
import { cn } from "@/lib/utils";

const CLASS_LEVELS = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "SSC", "HSC 1st Year", "HSC 2nd Year",
];

const PostTuition = ({ isDashboard = false, onSuccess }) => {
  const { t } = useTranslation();
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
  const [description, setDescription] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (role === "tutor") {
      toast.error(t('postTuition.error_role'));
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
      toast.error(t('postTuition.error_required'));
      return;
    }

    const parsedSalary = parseInt(salary, 10);
    if (isNaN(parsedSalary) || parsedSalary <= 0) {
      toast.error(t('postTuition.error_budget'));
      return;
    }

    const parsedDays = parseInt(daysPerWeek, 10);
    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 7) {
      toast.error(t('postTuition.error_days'));
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/tuitions", {
        subject,
        class_name: className,
        salary: parsedSalary,
        medium,
        location,
        gender,
        days_per_week: parsedDays,
        description: description || undefined,
      });
      toast.success(t('postTuition.success'));
      setSubject("");
      setClassName("");
      setSalary("");
      setMedium("");
      setLocation("");
      setGender("");
      setDaysPerWeek("");
      setDescription("");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || t('postTuition.error_generic'));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    if (isDashboard) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  const formContent = (
    <form
      onSubmit={handleSubmit}
      className={cn(
        isDashboard ? "space-y-6" : "bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('postTuition.subject_label')} *
          </Label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          >
            <option value="">{t('postTuition.select_subject')}</option>
            {SUBJECT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('postTuition.class_label')} *
          </Label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          >
            <option value="">{t('postTuition.select_class')}</option>
            {CLASS_LEVELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('postTuition.salary_label')} *
          </Label>
          <Input
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            type="number"
            placeholder={t('postTuition.salary_placeholder')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('postTuition.medium_label')} *
          </Label>
          <select
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          >
            <option value="">{t('postTuition.select_medium')}</option>
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
          {t('postTuition.location_label')} *
        </Label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          required
        >
          <option value="">{t('postTuition.select_division')}</option>
          {BANGLADESH_DIVISIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          {t('postTuition.gender_label')} *
        </Label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          required
        >
          <option value="">{t('postTuition.select_gender')}</option>
          {GENDER_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          {t('postTuition.days_label')} *
        </Label>
        <Input
          value={daysPerWeek}
          onChange={(e) => setDaysPerWeek(e.target.value)}
          type="number"
          min="1"
          max="7"
          placeholder={t('postTuition.days_placeholder')}
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          {t('postTuition.description_label')}
        </Label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('postTuition.description_placeholder')}
          className="w-full min-h-[100px] px-3 py-3 border border-border rounded-lg text-sm bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          rows={3}
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        {isDashboard ? (
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-lg"
          >
            {submitting ? (
              <>
                <RefreshCw className="size-4 animate-spin mr-2" />
                {t('postTuition.submit_btn_loading')}
              </>
            ) : (
              t('postTuition.submit_btn')
            )}
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 h-11"
            >
              {submitting ? t('postTuition.submit_btn_loading') : t('postTuition.submit_btn')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="h-11 px-5"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
          </>
        )}
      </div>
    </form>
  );

  if (isDashboard) {
    return (
      <Card className="p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden group">
        <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-lg -mr-32 -mt-32 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="size-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                {t('postTuition.title')}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('postTuition.subtitle')}
              </p>
            </div>
          </div>
          {formContent}
        </div>
      </Card>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <SEO title={t('postTuition.seo_title')} description={t('postTuition.seo_desc')} />
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> {t('common.back')}
          </button>
          <h1 className="text-2xl font-heading text-foreground mb-2">
            {t('postTuition.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('postTuition.subtitle')}
          </p>
        </div>

        {!user ? (
          <div className="bg-card border border-border p-8 rounded-xl text-center shadow-sm">
            <div className="size-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={28} className="text-muted-foreground" />
            </div>
            <h2 className="text-lg font-heading text-foreground mb-2">
              {t('common.login_required', 'Login required')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('postTuition.login_msg', 'You need to be logged in to post a tuition request')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-5 py-2.5 border border-border text-foreground font-medium rounded-lg hover:bg-background transition-colors"
              >
                {t('navigation.login', 'Sign In')}
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('navigation.get_started', 'Create Account')}
              </Link>
            </div>
          </div>
        ) : (
          formContent
        )}
      </div>
      <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="post a tuition" />
    </div>
  );
};

export default PostTuition;
