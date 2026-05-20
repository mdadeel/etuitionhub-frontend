import { useState, useEffect } from "react";
import { Bookmark, MapPin, GraduationCap, ArrowRight } from "lucide-react";
import Highlight from "./Highlight";
import api from "../../services/api";
import toast from "react-hot-toast";
import { formatRelativeTime } from "@/utils/dateUtils";
import { useNavigate } from "react-router-dom";

const TuitionCard = ({ tuition, className, searchQuery = "" }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
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
  }, [tuition._id]);

  const handleBookmark = async (e) => {
    e.stopPropagation();
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

  return (
    <div
      className={`group flex flex-col p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 transition-all duration-300 cursor-pointer ${className}`}
      onClick={handleViewDetails}
    >
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base md:text-lg text-slate-900 truncate leading-snug">
            <Highlight text={tuition.subject} query={searchQuery} />
          </h3>
          <span className="text-xs text-slate-500 font-medium mt-1 block">
            {formatRelativeTime(tuition.createdAt) || "Recent"}
          </span>
        </div>
        <button
          onClick={handleBookmark}
          className="shrink-0 p-2 -mr-2 -mt-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title={isSaved ? "Unsave" : "Save"}
        >
          <Bookmark
            size={18}
            className={
              isSaved ? "text-blue-600 fill-blue-600" : "transition-colors"
            }
          />
        </button>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
        {tuition.description || "Specialized academic support for students."}
      </p>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-600 mb-5">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span className="truncate max-w-[140px]">
            {tuition.qualification || tuition.class_name || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span className="truncate max-w-[140px]">
            <Highlight
              text={(tuition.location || "N/A").split(",")[0]}
              query={searchQuery}
            />
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-baseline gap-1">
          <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
            ৳{tuition.salary}
          </span>
          <span className="text-xs text-slate-500 font-medium">/mo</span>
        </div>
        <button
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors group/btn"
          onClick={handleViewDetails}
        >
          Apply
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default TuitionCard;
