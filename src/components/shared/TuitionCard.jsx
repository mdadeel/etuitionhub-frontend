import { useState, useEffect } from "react";
import { Bookmark, MapPin, GraduationCap, ArrowRight } from "lucide-react";
import Highlight from "./Highlight";
import api from "../../services/api";
import toast from "react-hot-toast";
import { formatRelativeTime } from "@/utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginRequiredModal from "./LoginRequiredModal";

const TuitionCard = ({ tuition, className, searchQuery = "", initialIsSaved = null, onRequestTutor }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(initialIsSaved === true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (initialIsSaved !== null) {
      setIsSaved(initialIsSaved === true);
      return;
    }
    const checkSaved = async () => {
      try {
        const res = await api.get(
          `/api/bookmarks/tuitions/check/${tuition._id}`,
        );
        setIsSaved(res.data.isSaved);
      } catch {
        /* ignore */
      }
    };
    if (tuition?._id) checkSaved();
  }, [tuition._id, initialIsSaved]);

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

  return (
    <>
    <div
      className={`group flex flex-col p-5 bg-card border border-border/80 rounded-2xl hover:shadow-premium hover:border-primary/30 transition-all duration-300 cursor-pointer relative ${className}`}
      onClick={handleViewDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleViewDetails(e);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Corner Bookmark (Absolute Overlay) */}
      <button
        type="button"
        onClick={handleBookmark}
        className="absolute top-4 right-4 z-10 size-8 flex items-center justify-center rounded-full bg-slate-100/80 hover:bg-primary/10 hover:text-primary dark:bg-slate-900/80 dark:hover:bg-primary/20 text-muted-foreground transition-all duration-200"
        title={isSaved ? "Unsave" : "Save"}
      >
        <Bookmark
          size={16}
          className={
            isSaved ? "fill-primary text-primary" : "transition-colors"
          }
        />
      </button>

      {tuition.poster && (
        <div className="flex items-center gap-1.5 mb-2">
          {tuition.poster.photoURL ? (
            <img src={tuition.poster.photoURL} alt="" className="size-5 rounded-full object-cover" />
          ) : (
            <div className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
              {tuition.poster.name?.charAt(0) || '?'}
            </div>
          )}
          <span className="text-xs text-muted-foreground truncate">{tuition.poster.name || 'Unknown'}</span>
        </div>
      )}

      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="font-bold text-base md:text-lg text-foreground truncate leading-snug group-hover:text-primary transition-colors">
            <Highlight text={tuition.subject} query={searchQuery} />
          </h3>
          <span className="text-xs text-muted-foreground font-medium mt-1 block">
            {formatRelativeTime(tuition.createdAt) || "Recent"}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
        {tuition.description || "Specialized academic support for students."}
      </p>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground mb-5">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="size-4 text-primary/70" />
          <span className="truncate max-w-[140px]">
            {tuition.qualification || tuition.class_name || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="size-4 text-primary/70" />
          <span className="truncate max-w-[140px]">
            <Highlight
              text={(tuition.location || "N/A").split(",")[0]}
              query={searchQuery}
            />
          </span>
        </div>
        {tuition.mode === 'online' && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">Online</span>
        )}
        {tuition.mode === 'home' && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">Home</span>
        )}
        {tuition.mode === 'both' && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 font-medium">Both</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-lg md:text-xl font-bold text-foreground tracking-tight">
            ৳{tuition.salary}
          </span>
          <span className="text-xs text-muted-foreground font-medium">/mo</span>
        </div>
        <button
          type="button"
          data-action="request-tutor"
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all active:scale-95 group/btn shadow-sm hover:shadow-glow-blue hover:-translate-y-0.5 duration-300"
          onClick={handleRequestClick}
        >
          Request Tutor
          <ArrowRight className="size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
    <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="save tuitions" />
    </>
  );
};

export default TuitionCard;
