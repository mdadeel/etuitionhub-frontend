import { useNavigate } from "react-router-dom";
import Highlight from "./Highlight";
import {
  Star,
  MapPin,
  BookOpen,
  Clock,
  Bookmark,
} from "lucide-react";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { memo, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const TutorCard = memo(({ tutor, searchQuery = "" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Only check bookmark status for real MongoDB ObjectIDs (24 hex chars)
    const isRealId = /^[a-f\d]{24}$/i.test(tutor._id);
    if (user && isRealId) {
      api
        .get(`/api/bookmarks/check/${tutor._id}`)
        .then((res) => setIsSaved(res.data.isSaved))
        .catch(() => {});
    }
  }, [user, tutor._id]);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save tutors");
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

  const teachingStyles = [
    "Explains concepts visually",
    "Concept-based teaching",
    "Problem-solving approach",
    "Exam-oriented strategy",
    "Patient & step-by-step",
    "Focused on core fundamentals",
  ];
  const randomStyle =
    teachingStyles[Math.floor(Math.random() * teachingStyles.length)];

  return (
    <Card
      hover
      className="group cursor-pointer h-full flex flex-col border-border rounded overflow-hidden hover:shadow-premium hover:border-primary/20 transition-all duration-300"
      onClick={() => navigate(`/tutor/${_id}`)}
    >
      <div className="p-5 flex-grow">
        <div className="flex items-start gap-4">
          <Avatar
            src={photoURL}
            alt={displayName}
            size="md"
            gender={tutor.gender}
            verified={isVerified}
            className="ring-2 ring-border group-hover:ring-primary/30 transition-all"
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
            {subjects.slice(0, 3).map((sub, i) => (
              <Badge
                key={i}
                variant="subtle"
                className="shrink-0 bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-[9px] font-medium border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors truncate max-w-[85px]"
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

        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 mt-4 pt-3 border-t border-border text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen
              size={10}
              className="text-muted-foreground/60"
            />
            <span className="truncate">{experience}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">
              {rating.toFixed(1)}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin
              size={10}
              className="text-muted-foreground/60"
            />
            <span className="truncate">
              {(location || "N/A").split(",")[0]}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock
              size={10}
              className="text-muted-foreground/60"
            />
            <span className="truncate">Fast Response</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-foreground tracking-tight">
            ৳{salary.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground font-medium">/mo</span>
        </div>
        <Button
          size="sm"
          className="font-semibold text-xs uppercase tracking-wider rounded"
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
});

export default TutorCard;
