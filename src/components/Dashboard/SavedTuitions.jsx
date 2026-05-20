import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";

const SavedTuitions = () => {
  const navigate = useNavigate();
  const [savedTuitions, setSavedTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedTuitions();
  }, []);

  const fetchSavedTuitions = async () => {
    try {
      const res = await api.get("/api/bookmarks/tuitions");
      setSavedTuitions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch saved tuitions:", err);
      toast.error("Failed to load saved tuitions");
    } finally {
      setLoading(false);
    }
  };

  const removeTuition = async (tuitionId) => {
    try {
      await api.delete(`/api/bookmarks/tuitions/${tuitionId}`);
      setSavedTuitions(savedTuitions.filter((t) => t._id !== tuitionId));
      toast.success("Tuition removed from saved");
    } catch (err) {
      toast.error("Failed to remove tuition");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
        <span className="ml-3 text-sm text-[#5B6475]">
          Loading saved tuitions...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading text-[#111827]">
            Saved Tuitions
          </h2>
          <p className="text-sm text-[#5B6475]">
            {savedTuitions.length} tuition
            {savedTuitions.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {savedTuitions.length === 0 ? (
        <div className="py-16 text-center bg-white border border-[rgba(15,23,46,0.08)] rounded-xl">
          <Bookmark size={40} className="mx-auto text-[#5B6475]/30 mb-4" />
          <h3 className="text-lg font-heading text-[#111827] mb-2">
            No saved tuitions yet
          </h3>
          <p className="text-sm text-[#5B6475] mb-6">
            Browse tuitions and save your favorites for quick access.
          </p>
          <button
            onClick={() => navigate("/tuitions")}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] text-sm font-medium"
          >
            Browse Tuitions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedTuitions.map((tuition) => (
            <div
              key={tuition._id}
              className="bg-white border border-[rgba(15,23,46,0.08)] rounded-xl p-4 hover:shadow-lg hover:border-[#2563EB]/20 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                  <Bookmark size={20} className="text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm text-[#111827] truncate">
                    {tuition.subject}
                  </h3>
                  <p className="text-xs text-[#5B6475] truncate">
                    {tuition.class_name || "N/A"}
                  </p>
                  {tuition.location && (
                    <p className="text-xs text-[#5B6475] truncate">
                      {tuition.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[rgba(15,23,46,0.08)]">
                {tuition.salary && (
                  <span className="text-sm font-heading text-[#2563EB]">
                    ৳{tuition.salary.toLocaleString()}/mo
                  </span>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => navigate(`/tuition/${tuition._id}`)}
                    className="p-2 text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button
                    onClick={() => removeTuition(tuition._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTuitions;
