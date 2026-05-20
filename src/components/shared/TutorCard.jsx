import { useNavigate } from "react-router-dom";
import Highlight from "./Highlight";
import {
  Star,
  MapPin,
  BookOpen,
  Clock,
  CheckCircle,
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
    if (user) {
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
      className="group cursor-pointer h-full flex flex-col border-slate-200 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 transition-all duration-300"
      onClick={() => navigate(`/tutor/${_id}`)}
    >
      <div className="p-5 flex-grow">
        <div className="flex items-start gap-4">
          <Avatar
            src={photoURL}
            alt={displayName}
            size="md"
            verified={isVerified && _id !== "tutor_001"}
            className="ring-2 ring-slate-100 group-hover:ring-blue-100 transition-all"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-base text-slate-900 tracking-tight truncate leading-snug">
                  <Highlight text={displayName} query={searchQuery} />
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  {qualification || "Experienced Tutor"}
                </p>
              </div>
              <button
                onClick={handleBookmark}
                disabled={saving}
                className="shrink-0 p-2 -mr-2 -mt-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title={isSaved ? "Unsave" : "Save"}
              >
                <Bookmark
                  size={18}
                  className={
                    isSaved
                      ? "fill-blue-600 text-blue-600"
                      : "transition-colors"
                  }
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          {subjects.slice(0, 3).map((sub, i) => (
            <Badge
              key={i}
              variant="subtle"
              className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-colors"
            >
              <Highlight text={sub} query={searchQuery} />
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <span className="flex items-center gap-2 group/stat">
            <BookOpen
              size={14}
              className="text-slate-400 group-hover:text-blue-500 transition-colors"
            />
            <span className="truncate">{experience}</span>
          </span>
          <span className="flex items-center gap-2">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-900">
              {rating.toFixed(1)}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <MapPin
              size={14}
              className="text-slate-400 group-hover:text-blue-500 transition-colors"
            />
            <span className="truncate">
              {(location || "N/A").split(",")[0]}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <Clock
              size={14}
              className="text-slate-400 group-hover:text-blue-500 transition-colors"
            />
            <span className="truncate">Fast Response</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-white">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            ৳{salary.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 font-medium">/mo</span>
        </div>
        <Button
          size="xs"
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-medium px-4 py-2 h-auto rounded-lg transition-colors border-none"
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
});

export default TutorCard;
