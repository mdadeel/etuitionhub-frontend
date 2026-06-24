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
        "group h-full flex flex-col border border-border/80 bg-card rounded-[20px] overflow-hidden shadow-premium transition-all duration-300 relative",
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
      <div className="p-4 flex-grow flex flex-col sm:hidden">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0 mt-0.5">
            <div className="size-10">
              <Avatar
                src={photoURL}
                alt={displayName}
                size="md"
                gender={tutor.gender}
                className="size-full ring-2 ring-border/60 group-hover:ring-primary/40 transition-all rounded-[10px]"
              />
            </div>
            {isVerified && (
              <span className="absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center ring-2 ring-card" title="Verified Profile">
                <Check className="size-2 stroke-[3]" />
              </span>
            )}
          </div>
          <div className="flex-grow min-w-0 pr-10">
            <h3 className="font-bold text-[14px] text-foreground tracking-tight line-clamp-1 leading-tight group-hover:text-primary transition-colors">
              <Highlight text={displayName} query={searchQuery} />
            </h3>
            <p className="text-[11px] text-muted-foreground line-clamp-1 leading-tight mt-0.5" title={qualification}>
              {qualification || "Experienced Tutor"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
          <span className="flex items-center gap-1 shrink-0">
            <Star size={12} className="fill-amber-500 text-amber-500 shrink-0" />
            <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
          </span>
          <span className="shrink-0">•</span>
          <span className="flex items-center gap-1 shrink-0">
             <MapPin size={12} className="text-primary shrink-0" />
             <span className="truncate">{(location || "N/A").split(",")[0]}</span>
          </span>
          <span className="shrink-0">•</span>
          <span className="truncate">{experience}</span>
        </div>

        <div className="flex flex-nowrap overflow-hidden gap-1 mt-2.5">
          {subjects.slice(0, 2).map((sub) => (
            <span
              key={`sub-mob-${sub}`}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/40 whitespace-nowrap truncate max-w-[80px]"
              title={sub}
            >
              <Highlight text={sub} query={searchQuery} />
            </span>
          ))}
          {subjects.length > 2 && (
            <span className="text-[10px] text-muted-foreground font-bold whitespace-nowrap px-1 py-0.5 rounded bg-muted/30 border border-border/30">
              +{subjects.length - 2}
            </span>
          )}
        </div>

        <div className="mt-2.5">
          <TrustBadges tutor={tutor} />
        </div>

        <div className="mt-auto border-t border-border pt-3 mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-0.5 min-w-0">
            <span className="text-[16px] font-bold text-foreground tracking-tight leading-none truncate">
              ৳{salary.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold shrink-0">/mo</span>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="font-semibold text-[10px] px-2 h-6 pointer-events-auto flex items-center justify-center gap-1 rounded-[10px] shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
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
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1 shrink-0 w-16">
              <div className="relative">
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
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} className="fill-amber-500 text-amber-500 shrink-0" />
                <span className="text-[11px] font-bold text-foreground">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <h3 className="font-bold text-lg text-foreground tracking-tight line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                <Highlight text={displayName} query={searchQuery} />
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-2" title={qualification}>
                {qualification || "Experienced Tutor"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
            {subjects.slice(0, 2).map((sub) => (
              <span
                key={`sub-${sub}`}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/40 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/20"
              >
                <Highlight text={sub} query={searchQuery} />
              </span>
            ))}
            {subjects.length > 2 && (
              <span
                className="text-[10px] text-muted-foreground font-bold px-2 py-0.5 cursor-help"
                title={subjects.slice(2).join(", ")}
              >
                +{subjects.length - 2}
              </span>
            )}
          </div>

          {/* Key Metrics Info Bar */}
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Briefcase size={12} className="text-primary shrink-0" />
              <span className="truncate">{experience}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-primary shrink-0" />
              <span className="truncate">{(location || "N/A").split(",")[0]}</span>
            </span>
            <span className="flex items-center gap-1.5 col-span-2">
              <Clock size={12} className="text-primary shrink-0" />
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
            variant="primary"
            size="sm"
            className="font-semibold text-[11px] tracking-wider pointer-events-auto flex items-center gap-1 group/btn rounded-[10px] h-6 px-2 shadow-sm hover:shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
            onClick={(e) => {
              if (isBannerPreview) {
                e.stopPropagation();
                navigate(`/tutor/${_id}`);
              }
            }}
          >
            View
            <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
    <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="save tutors" />
    </>
  );
});

export default TutorCard;