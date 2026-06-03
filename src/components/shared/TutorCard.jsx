import { useNavigate } from "react-router-dom";
import Highlight from "./Highlight";
import {
  Star,
  MapPin,
  BookOpen,
  Clock,
  Bookmark,
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
    availableDays = [],
  } = tutor;
  const rating = tutor.ratings || tutor.rating || 4.8;
  const salary = tutor.expectedSalary || 5000;
  const experience = tutor.experience || "1-2 years";

  return (
    <>
    <Card
      hover={!isBannerPreview}
      className={cn(
        "group h-full flex flex-col border border-border/80 bg-card rounded-2xl overflow-hidden hover:shadow-premium hover:border-primary/30 transition-all duration-300",
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
      <div className="p-5 flex-grow">
        <div className="flex items-start gap-4">
          <Avatar
            src={photoURL}
            alt={displayName}
            size="md"
            gender={tutor.gender}
            verified={isVerified}
            className="ring-2 ring-border group-hover:ring-primary/30 transition-all rounded-xl overflow-hidden"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base text-foreground tracking-tight truncate leading-snug">
                  <Highlight text={displayName} query={searchQuery} />
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate" title={qualification}>
                  {qualification || "Experienced Tutor"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleBookmark}
                disabled={saving}
                className="shrink-0 p-2 -mr-2 -mt-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                title={isSaved ? "Unsave" : "Save"}
              >
                <Bookmark
                  size={18}
                  className={
                    isSaved
                      ? "fill-primary text-primary"
                      : "transition-colors"
                  }
                />
              </button>
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

        <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mt-4 pt-4 border-t border-border text-[11px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <BookOpen
              size={12}
              className="text-primary/70"
            />
            <span className="truncate">{experience}</span>
          </span>
          <span className="flex items-center gap-2">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">
              {rating.toFixed(1)}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <MapPin
              size={12}
              className="text-primary/70"
            />
            <span className="truncate">
              {(location || "N/A").split(",")[0]}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <Clock
              size={12}
              className="text-primary/70"
            />
            <span className="truncate">Fast Response</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-muted/10">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-foreground tracking-tight">
            ৳{salary.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground font-medium">/mo</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="primary"
          className="font-semibold text-xs tracking-wider pointer-events-auto"
          onClick={(e) => {
            if (isBannerPreview) {
              e.stopPropagation();
              navigate(`/tutor/${_id}`);
            }
          }}
        >
          View Profile
        </Button>
      </div>
    </Card>
    <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="save tutors" />
    </>
  );
});

export default TutorCard;