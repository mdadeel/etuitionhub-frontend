import { useNavigate } from "react-router-dom";
import Highlight from "./Highlight";
import {
  Star,
  MapPin,
  BookOpen,
  Clock,
  Bookmark,
  Briefcase,
  ChevronRight,
  Check,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    // If parent passed the saved state (grid fetched via /check-many), trust it.
    if (initialIsSaved !== null) {
      setIsSaved(initialIsSaved === true);
      return;
    }
    // Only check bookmark status for real MongoDB ObjectIDs (24 hex chars)
    const isRealId = /^[a-f\d]{24}$/i.test(tutor._id);
    if (user && isRealId) {
      api
        .get(`/api/bookmarks/check/${tutor._id}`)
        .then((res) => setIsSaved(res.data.isSaved))
        .catch(() => {});
    }
  }, [user, tutor._id, initialIsSaved]);

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
      hover={!isBannerPreview}
      className={cn(
        "group h-full flex flex-col border border-border/80 bg-card rounded-2xl overflow-hidden hover:shadow-premium hover:border-primary/30 transition-all duration-300 relative",
        isBannerPreview ? "" : "cursor-pointer"
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
      {/* Corner Bookmark (Absolute Overlay) */}
      <button
        type="button"
        onClick={handleBookmark}
        disabled={saving}
        className="absolute top-4 right-4 z-10 size-8 flex items-center justify-center rounded-full bg-slate-100/80 hover:bg-primary/10 hover:text-primary dark:bg-slate-900/80 dark:hover:bg-primary/20 text-muted-foreground transition-all duration-200"
        title={isSaved ? "Unsave" : "Save"}
      >
        <Bookmark
          size={16}
          className={cn(
            isSaved ? "fill-primary text-primary" : "transition-colors"
          )}
        />
      </button>

      <div className="p-6 flex-grow">
        {/* Avatar & Main Credentials Header */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar
              src={photoURL}
              alt={displayName}
              size="xl"
              gender={tutor.gender}
              verified={false}
              className="ring-2 ring-border group-hover:ring-primary/30 transition-all rounded-xl overflow-hidden"
            />
            {isVerified && (
              <span 
                className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-card select-none"
                title="Verified Profile"
              >
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

        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-border overflow-hidden w-full">
          <div className="flex items-center gap-1.5 overflow-hidden flex-1">
            {subjects.slice(0, 3).map((sub) => (
              <Badge
                key={`sub-${sub}`}
                variant="subtle"
                className="shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-md hover:bg-primary/10 hover:text-primary transition-colors max-w-[85px] truncate"
                title={sub}
              >
                <Highlight text={sub} query={searchQuery} />
              </Badge>
            ))}
          </div>
          {subjects.length > 3 && (
            <span
              className="text-[10px] text-muted-foreground font-bold shrink-0 ml-auto cursor-help"
              title={subjects.slice(3).join(", ")}
            >
              ...
            </span>
          )}
        </div>

        {/* Cleaned 3-item metadata info grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <Briefcase
              size={14}
              className="text-primary"
            />
            <span className="truncate">{experience}</span>
          </span>
          <span className="flex items-center gap-2">
            <MapPin
              size={14}
              className="text-primary"
            />
            <span className="truncate">
              {(location || "N/A").split(",")[0]}
            </span>
          </span>
          <span className="flex items-center gap-2 col-span-2">
            <Clock
              size={14}
              className="text-primary"
            />
            <span className="truncate">Responds in 15 mins</span>
          </span>
        </div>

        <div className="mt-3 space-y-1.5">
          <TrustBadges tutor={tutor} />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
        <div>
          <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Expected Salary</div>
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
          className="font-semibold text-xs tracking-wider pointer-events-auto flex items-center gap-1 group/btn"
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
    </Card>
    <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="save tutors" />
    </>
  );
});

export default TutorCard;