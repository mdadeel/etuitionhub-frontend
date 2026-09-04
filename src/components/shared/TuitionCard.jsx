import { useState, useEffect } from "react";
import { Bookmark, MapPin, GraduationCap, ArrowRight } from "lucide-react";
import Highlight from "./Highlight";
import api from "../../services/api";
import toast from "react-hot-toast";
import { formatRelativeTime } from "@/utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginRequiredModal from "./LoginRequiredModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TuitionCard = ({ tuition, className, searchQuery = "", initialIsSaved = null, onRequestTutor }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
    try {
      if (isSaved) {
        await api.delete(`/api/bookmarks/tuitions/${tuition._id}`);
        setIsSaved(false);
        toast.success("Tuition removed");
      } else {
        await api.post(`/api/bookmarks/tuitions/${tuition._id}`);
        setIsSaved(true);
        toast.success("Tuition saved to your list");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save tuition");
    }
  };

  if (!tuition) return null;

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/tuition/${tuition._id}`);
  };

  const handleRequestClick = (e) => {
    e.stopPropagation();
    if (onRequestTutor) {
      onRequestTutor(tuition);
    } else {
      navigate(`/tuition/${tuition._id}`);
    }
  };

  const academicLabel = [
    tuition.class_name || tuition.qualification,
    tuition.medium ? `${tuition.medium} Medium` : null,
  ].filter(Boolean).join(" · ") || "Academic Tuition";

  return (
    <>
    <div
      className={`group flex flex-col p-3.5 sm:p-5 bg-card border border-border/80 rounded-lg hover:border-primary/30 transition-all duration-300 cursor-pointer relative ${className}`}
      onClick={handleViewDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleViewDetails(e);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Corner Bookmark (Absolute Overlay) - Minimum 44px touch target container */}
      <button
        type="button"
        onClick={handleBookmark}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 size-10 flex items-center justify-center text-muted-foreground transition-all duration-200"
        title={isSaved ? "Unsave" : "Save"}
        aria-label={isSaved ? "Unsave tuition" : "Save tuition"}
      >
        <div className="size-7.5 flex items-center justify-center rounded-full bg-muted/80 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors">
          <Bookmark
            size={15}
            className={
              isSaved ? "fill-primary text-primary" : "transition-colors"
            }
          />
        </div>
      </button>

      {tuition.poster && (
        <div className="flex items-center gap-1.5 mb-2">
          <Avatar size="xs" className="size-5 rounded-full">
            <AvatarImage src={tuition.poster.photoURL} alt={tuition.poster.name} />
            <AvatarFallback className="text-[10px] font-medium rounded-full">
              {tuition.poster.name?.charAt(0)?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] sm:text-xs text-muted-foreground truncate">{tuition.poster.name || 'Unknown'}</span>
        </div>
      )}

      <div className="flex justify-between items-start gap-4 mb-2 sm:mb-3">
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="font-bold text-sm sm:text-base md:text-lg text-foreground truncate leading-snug group-hover:text-primary transition-colors">
            <Highlight text={tuition.subject} query={searchQuery} />
          </h3>
          <span className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5 block">
            {formatRelativeTime(tuition.createdAt) || "Recent"}
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
        {tuition.description || "Specialized academic support for students."}
      </p>

      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5">
        <div className="flex items-center gap-1.5 min-w-0">
          <GraduationCap className="size-3.5 sm:size-4 text-primary/70 shrink-0" />
          <span className="truncate max-w-[160px] font-medium text-[11px] sm:text-xs">
            {academicLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="size-3.5 sm:size-4 text-primary/70 shrink-0" />
          <span className="truncate max-w-[130px] text-[11px] sm:text-xs">
            <Highlight
              text={(tuition.location || "N/A").split(",")[0]}
              query={searchQuery}
            />
          </span>
        </div>
        {tuition.mode === 'online' && (
          <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">Online</span>
        )}
        {tuition.mode === 'home' && (
          <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md bg-success/10 text-success font-semibold">Home</span>
        )}
        {tuition.mode === 'both' && (
          <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold">Both</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-tight">
            ৳{tuition.salary ? tuition.salary.toLocaleString() : 'Negotiable'}
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">/mo</span>
        </div>
        <button
          type="button"
          data-action="request-tutor"
          className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg sm:rounded-xl transition-all active:scale-95 group/btn shadow-sm hover:shadow-glow-blue hover:-translate-y-0.5 duration-300"
          onClick={handleRequestClick}
        >
          View
          <ArrowRight className="size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
    <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="save tuitions" />
    </>
  );
};

export default TuitionCard;
