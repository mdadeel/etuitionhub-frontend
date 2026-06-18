import { useNavigate } from "react-router-dom";
import Highlight from "./Highlight";
import {
  Star,
  MapPin,
  Clock,
  Bookmark,
  Briefcase,
  ChevronRight,
  Check,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { memo, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import LoginRequiredModal from "./LoginRequiredModal";
import TrustBadges from './TrustBadges';

const TutorCard = memo(({ tutor, searchQuery = "", isBannerPreview = false, initialIsSaved = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(initialIsSaved === true);
  const [saving, setSaving] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setIsSaved(initialIsSaved === true);
  }, [initialIsSaved]);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/api/bookmarks/${tutor._id}`);
        setIsSaved(false);
        toast.success("Tutor removed");
      } else {
        await api.post(`/api/bookmarks/${tutor._id}`);
        setIsSaved(true);
        toast.success("Tutor saved to your list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not save tutor");
    }
    setSaving(false);
  };

  if (!tutor) return null;

  const {
    _id,
    displayName,
    photoURL,
    qualification,
    location,
    subjects = [],
    isVerified,
  } = tutor;
  const rating = tutor.ratings || tutor.rating || 4.8;
  const salary = tutor.expectedSalary || 5000;
  const experience = tutor.experience || "1-2 years";

  return (
    <>
    <Card
      hover={false}
      className={cn(
        "group h-full flex flex-col border border-border/80 bg-card rounded-2xl overflow-hidden shadow-premium transition-all duration-300 relative",
        isBannerPreview ? "" : "cursor-pointer hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] hover:border-primary/30"
      )}
      onClick={isBannerPreview ? undefined : () => navigate(`/tutor/${_id}`)}
      onKeyDown={isBannerPreview ? undefined : (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/tutor/${_id}`);
        }
      }}
      role={isBannerPreview ? undefined : "button"}
      tabIndex={isBannerPreview ? -1 : 0}
    >
      {/* Corner Bookmark (Absolute Overlay) - Updated for 44px minimum touch target */}
      <button
        type="button"
        onClick={handleBookmark}
        disabled={saving}
        className="absolute top-2 right-2 z-10 size-11 flex items-center justify-center rounded-full text-muted-foreground transition-all duration-200"
        title={isSaved ? "Unsave" : "Save"}
        aria-label={isSaved ? "Unsave tutor" : "Save tutor"}
      >
        <div className={cn("size-8 flex items-center justify-center rounded-full bg-slate-100/80 hover:bg-primary/10 hover:text-primary dark:bg-slate-900/80 dark:hover:bg-primary/20 transition-colors", isSaved ? "text-primary" : "")}>
          <Bookmark
            size={16}
            className={cn(isSaved ? "fill-primary" : "")}
          />
        </div>
      </button>

      {/* MOBILE COMPACT LAYOUT (sm:hidden) */}
      <div className="p-3 flex-grow flex flex-col justify-between sm:hidden">
        <div>
          <div className="flex gap-3">
            {/* Left Column: Compact Avatar & Rating */}
            <div className="flex flex-col items-center gap-1 shrink-0 w-12">
              <div className="relative">
                <Avatar
                  src={photoURL}
                  alt={displayName}
                  size="lg"
                  gender={tutor.gender}
                  className="ring-2 ring-border/60 group-hover:ring-primary/40 transition-all rounded-xl size-12"
                />
                {isVerified && (
                  <span className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 text-white rounded-full flex items-center justify-center ring-2 ring-card" title="Verified Profile">
                    <Check className="size-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 mt-0.5">
                <Star size={10} className="fill-amber-500 text-amber-500" />
                <span>{rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Right Column: Info details */}
            <div className="flex-grow min-w-0 pr-6 space-y-1">
              {/* Header: Name */}
              <h3 className="font-bold text-[13px] text-foreground tracking-tight truncate leading-tight group-hover:text-primary transition-colors">
                <Highlight text={displayName} query={searchQuery} />
              </h3>

              {/* Education */}
              <p className="text-[10px] text-muted-foreground truncate leading-tight" title={qualification}>
                {qualification || "Experienced Tutor"}
              </p>

              {/* Subject Chips (Compact) */}
              <div className="flex flex-nowrap items-center gap-1 pt-0.5 overflow-hidden">
                {subjects.slice(0, 2).map((sub) => (
                  <span
                    key={`sub-mob-${sub}`}
                    className="text-[9px] font-semibold px-1.5 py-[2px] rounded bg-muted/60 text-muted-foreground border border-border/40 whitespace-nowrap truncate max-w-[65px]"
                    title={sub}
                  >
                    <Highlight text={sub} query={searchQuery} />
                  </span>
                ))}
                {subjects.length > 2 && (
                  <span className="text-[9px] text-muted-foreground font-bold whitespace-nowrap pl-0.5">
                    +{subjects.length - 2}
                  </span>
                )}
              </div>

              {/* Combined Experience & Location Row */}
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-0.5 truncate">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Briefcase size={10} className="text-primary shrink-0" />
                  {experience}
                </span>
                <span className="text-border/60">•</span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin size={10} className="text-primary shrink-0" />
                  {(location || "N/A").split(",")[0]}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-2.5">
            <TrustBadges tutor={tutor} />
          </div>
        </div>

        {/* Mobile Pricing & Actions */}
        <div className="flex items-center justify-between border-t border-border pt-2.5 mt-2.5">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[15px] font-bold text-foreground tracking-tight leading-none">
              ৳{salary.toLocaleString()}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold">/mo</span>
          </div>
          <Button
            type="button"
            variant="primary"
            className="font-semibold text-[11px] h-8 pointer-events-auto flex items-center justify-center gap-0.5 px-3 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            onClick={(e) => {
              if (isBannerPreview) {
                e.stopPropagation();
                navigate(`/tutor/${_id}`);
              }
            }}
          >
            View
            <ChevronRight size={12} className="transition-transform" />
          </Button>
        </div>
      </div>

      {/* DESKTOP VIEW LAYOUT (hidden sm:flex) */}
      <div className="hidden sm:flex flex-col flex-grow">
        <div className="p-6 flex-grow">
          {/* Avatar & Main Credentials Header */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="size-16">
                <Avatar
                  src={photoURL}
                  alt={displayName}
                  size="xl"
                  gender={tutor.gender}
                  className="size-full ring-2 ring-border/60 group-hover:ring-primary/40 transition-all rounded-xl"
                />
              </div>
              {isVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 size-5 bg-emerald-500 text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-card" title="Verified Profile">
                  <Check className="size-3 stroke-[3]" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <h3 className="font-bold text-lg text-foreground tracking-tight truncate leading-snug group-hover:text-primary transition-colors">
                <Highlight text={displayName} query={searchQuery} />
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate" title={qualification}>
                {qualification || "Experienced Tutor"}
              </p>
              {/* Rating moved directly under credentials */}
              <div className="flex items-center gap-1.5 mt-1">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                <span className="text-xs font-bold text-foreground">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border">
            {subjects.slice(0, 3).map((sub) => (
              <span
                key={`sub-${sub}`}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/40 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/20"
              >
                <Highlight text={sub} query={searchQuery} />
              </span>
            ))}
            {subjects.length > 3 && (
              <span
                className="text-[10px] text-muted-foreground font-bold px-2 py-0.5 cursor-help"
                title={subjects.slice(3).join(", ")}
              >
                +{subjects.length - 3}
              </span>
            )}
          </div>

          {/* Key Metrics Info Bar */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Briefcase size={14} className="text-primary shrink-0" />
              <span className="truncate">{experience}</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-primary shrink-0" />
              <span className="truncate">{(location || "N/A").split(",")[0]}</span>
            </span>
            <span className="flex items-center gap-2 col-span-2">
              <Clock size={14} className="text-primary shrink-0" />
              <span className="truncate">Responds in 15 mins</span>
            </span>
          </div>

          <div className="mt-3 space-y-1.5">
            <TrustBadges tutor={tutor} />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-muted/10 border-t border-border">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-foreground tracking-tight">
                ৳{salary.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">/mo</span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="primary"
            className="font-semibold text-xs tracking-wider pointer-events-auto flex items-center gap-1 group/btn rounded-xl shadow-sm hover:shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
            onClick={(e) => {
              if (isBannerPreview) {
                e.stopPropagation();
                navigate(`/tutor/${_id}`);
              }
            }}
          >
            View Profile
            <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
    <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="save tutors" />
    </>
  );
});

export default TutorCard;