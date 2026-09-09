import { useNavigate } from "react-router-dom";
import Highlight from "./Highlight";
import {
  Star,
  MapPin,
  Bookmark,
  Briefcase,
  ChevronRight,
  Check,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { memo, useState, useEffect } from "react";
import { useAuthUser } from "@/contexts/AuthContext";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import LoginRequiredModal from "./LoginRequiredModal";

const TutorCard = memo(({ tutor, searchQuery = "", isBannerPreview = false, initialIsSaved = null }) => {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [isSaved, setIsSaved] = useState(initialIsSaved === true);
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
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);
    try {
      if (wasSaved) {
        await api.delete(`/api/bookmarks/${tutor._id}`);
        toast.success("Tutor removed");
      } else {
        await api.post(`/api/bookmarks/${tutor._id}`);
        toast.success("Tutor saved to your list");
      }
    } catch {
      setIsSaved(wasSaved);
      toast.error("Could not save tutor");
    }
  };

  if (!tutor) return null;

  const {
    _id,
    displayName,
    photoURL,
    qualification,
    location,
    subjects = [],
  } = tutor;
  
  const isVerified = tutor.verificationStatus
    ? tutor.verificationStatus === 'verified_basic' || tutor.verificationStatus === 'verified_premium'
    : !!tutor.isVerified;
  const rating = tutor.ratings || tutor.rating || 0;
  const salary = tutor.expectedSalary || 5000;
  const experience = tutor.experience || "1-2 years";

  return (
    <>
    <Card
      hover={false}
      className={cn(
        "group h-full flex flex-col border border-border/80 bg-card rounded-xl relative transition-all duration-200",
        isBannerPreview ? "" : "cursor-pointer hover:border-primary/40 hover:shadow-md"
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
      {/* Corner Bookmark (44px touch container) */}
      <button
        type="button"
        onClick={handleBookmark}
        className="absolute top-2 right-2 z-10 size-11 flex items-center justify-center rounded-full text-muted-foreground transition-colors"
        title={isSaved ? "Unsave" : "Save"}
        aria-label={isSaved ? "Unsave tutor" : "Save tutor"}
      >
        <div className={cn("size-8 flex items-center justify-center rounded-full bg-muted/70 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors", isSaved ? "text-primary" : "")}>
          <Bookmark
            size={15}
            className={cn(isSaved ? "fill-primary" : "")}
          />
        </div>
      </button>

      {/* MOBILE COMPACT LAYOUT */}
      <div className="p-3.5 flex-grow flex flex-col sm:hidden">
        <div className="flex items-start gap-2.5">
          <div className="relative shrink-0 mt-0.5">
            <div className="size-11">
              <Avatar
                src={photoURL}
                alt={displayName}
                size="md"
                gender={tutor.gender}
                className="size-full ring-1 ring-border rounded-lg"
              />
            </div>
            {isVerified && (
              <span className="absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center ring-2 ring-card" title="Verified Profile">
                <Check className="size-2 stroke-[3]" />
              </span>
            )}
          </div>
          <div className="flex-grow min-w-0 pr-8">
            <h3 className="font-bold text-xs text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              <Highlight text={displayName} query={searchQuery} />
            </h3>
            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5" title={qualification}>
              {qualification || "Experienced Tutor"}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          {rating > 0 && (
            <span className="flex items-center gap-0.5 font-semibold text-foreground shrink-0">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-muted-foreground/50 mx-0.5">·</span>
            </span>
          )}
          <span className="flex items-center gap-1 truncate">
            <MapPin size={10} className="text-primary shrink-0" />
            <span className="truncate">{(location || "N/A").split(",")[0]}</span>
          </span>
        </div>

        {/* Compact Subject Badges */}
        <div className="flex flex-wrap gap-1 mt-2">
          {subjects.slice(0, 2).map((sub) => (
            <span
              key={`sub-mob-${sub}`}
              className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/40 truncate max-w-[110px]"
            >
              <Highlight text={sub} query={searchQuery} />
            </span>
          ))}
          {subjects.length > 2 && (
            <span className="text-[9px] text-muted-foreground font-semibold px-1 py-0.5">
              +{subjects.length - 2}
            </span>
          )}
        </div>

        <div className="mt-auto border-t border-border pt-2.5 mt-2.5 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-0.5 min-w-0">
            <span className="text-sm font-bold font-mono text-foreground">
              ৳{salary.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold">/mo</span>
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="text-[11px] px-2.5 h-7 rounded-md"
            onClick={(e) => {
              if (isBannerPreview) {
                e.stopPropagation();
                navigate(`/tutor/${_id}`);
              }
            }}
          >
            <span>View</span>
            <ChevronRight size={12} />
          </Button>
        </div>
      </div>

      {/* DESKTOP VIEW LAYOUT */}
      <div className="hidden sm:flex flex-col flex-grow">
        <div className="p-5 flex-grow space-y-3.5">
          {/* Avatar & Main Credentials Header */}
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0">
              <div className="size-14">
                <Avatar
                  src={photoURL}
                  alt={displayName}
                  size="lg"
                  gender={tutor.gender}
                  className="size-14 ring-1 ring-border rounded-xl"
                />
              </div>
              {isVerified && (
                <span className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 text-white rounded-full flex items-center justify-center ring-2 ring-card" title="Verified Profile">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-12">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-sm text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                  <Highlight text={displayName} query={searchQuery} />
                </h3>
                {rating > 0 && (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-foreground font-mono shrink-0 ml-2">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{rating.toFixed(1)}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5" title={qualification}>
                {qualification || "Experienced Tutor"}
              </p>
            </div>
          </div>

          {/* Subject Mastery Badges */}
          <div className="flex flex-wrap gap-1">
            {subjects.slice(0, 3).map((sub) => (
              <span
                key={`sub-${sub}`}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/50"
              >
                <Highlight text={sub} query={searchQuery} />
              </span>
            ))}
            {subjects.length > 3 && (
              <span className="text-[11px] text-muted-foreground font-semibold px-1 py-0.5">
                +{subjects.length - 3}
              </span>
            )}
          </div>

          {/* Key Metrics: Location & Experience */}
          <div className="flex items-center justify-between pt-2.5 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1 truncate max-w-[130px]">
              <MapPin size={12} className="text-primary shrink-0" />
              <span className="truncate">{(location || "N/A").split(",")[0]}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Briefcase size={12} className="text-primary shrink-0" />
              <span>{experience}</span>
            </span>
          </div>
        </div>

        {/* Card Footer: Monthly Fee & CTA */}
        <div className="flex items-center justify-between px-5 py-3 bg-muted/20 border-t border-border rounded-b-xl">
          <div className="flex items-baseline gap-0.5">
            <span className="text-base font-bold font-mono text-foreground">
              ৳{salary.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">/mo</span>
          </div>
          <Button
            type="button"
            size="sm"
            className="text-xs h-8 px-3 rounded-lg font-semibold gap-1"
            onClick={(e) => {
              if (isBannerPreview) {
                e.stopPropagation();
                navigate(`/tutor/${_id}`);
              }
            }}
          >
            <span>View Profile</span>
            <ChevronRight size={13} />
          </Button>
        </div>
      </div>
    </Card>
    <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="save tutors" />
    </>
  );
});

export default TutorCard;