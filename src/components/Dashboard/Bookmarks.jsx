import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Bookmark, Trash2, ExternalLink, Users, BookOpen } from "lucide-react";
import { AppleCard, AppleHeader } from "../shared/AppleUI";
import { cn } from "@/lib/utils";
import { TutorCardGridSkeleton, TuitionCardGridSkeleton } from "@/components/shared/skeletons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Bookmarks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tutors");
  const [savedTutors, setSavedTutors] = useState([]);
  const [savedTuitions, setSavedTuitions] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [loadingTuitions, setLoadingTuitions] = useState(true);

  const fetchSavedTutors = async () => {
    setLoadingTutors(true);
    try {
      const res = await api.get("/api/bookmarks");
      setSavedTutors(res.data || []);
    } catch (err) {
      console.error("Failed to fetch saved tutors:", err);
      toast.error("Failed to load saved tutors");
    } finally {
      setLoadingTutors(false);
    }
  };

  const fetchSavedTuitions = async () => {
    setLoadingTuitions(true);
    try {
      const res = await api.get("/api/bookmarks/tuitions");
      setSavedTuitions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch saved tuitions:", err);
      toast.error("Failed to load saved tuitions");
    } finally {
      setLoadingTuitions(false);
    }
  };

  useEffect(() => {
    fetchSavedTutors();
    fetchSavedTuitions();
  }, []);

  const removeTutor = async (tutorId) => {
    try {
      await api.delete(`/api/bookmarks/${tutorId}`);
      setSavedTutors((prev) => prev.filter((t) => t._id !== tutorId));
      toast.success("Tutor removed from saved");
    } catch (err) {
      console.error("Failed to remove tutor:", err);
      toast.error("Failed to remove tutor");
    }
  };

  const removeTuition = async (tuitionId) => {
    try {
      await api.delete(`/api/bookmarks/tuitions/${tuitionId}`);
      setSavedTuitions((prev) => prev.filter((t) => t._id !== tuitionId));
      toast.success("Tuition removed from saved");
    } catch (err) {
      console.error("Failed to remove tuition:", err);
      toast.error("Failed to remove tuition");
    }
  };

  const tabs = [
    { id: "tutors", label: "Saved Tutors", icon: Users, count: savedTutors.length },
    { id: "tuitions", label: "Saved Tuitions", icon: BookOpen, count: savedTuitions.length },
  ];

  const isLoading = activeTab === "tutors" ? loadingTutors : loadingTuitions;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 animate-fade-in-up">
      <AppleHeader
        title="Bookmarks"
        subtitle="Manage all your saved tutors and tuition listings in one place."
        badge={
          <span className="px-3 py-1 text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground rounded-lg bg-secondary/10">
            Saved Items
          </span>
        }
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-lg border border-border/40 w-fit max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 text-xs font-semibold transition-all duration-300 rounded-lg whitespace-nowrap",
              activeTab === tab.id
                ? "bg-background text-primary shadow-sm shadow-primary/5 border border-border/40"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <tab.icon size={14} className={activeTab === tab.id ? "text-primary" : "opacity-60"} />
            {tab.label}
            <span className={cn(
              "px-2 py-0.5 text-[10px] rounded-lg font-bold",
              activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        activeTab === "tutors" ? (
          <TutorCardGridSkeleton count={4} />
        ) : (
          <TuitionCardGridSkeleton count={4} />
        )
      ) : activeTab === "tutors" ? (
        savedTutors.length === 0 ? (
          <AppleCard className="p-16 text-center border-dashed" hover={false}>
            <Bookmark size={40} className="mx-auto text-muted-foreground/30 mb-5" strokeWidth={1.5} />
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-2">
              No saved tutors yet
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Browse available tutors and bookmark them for easy access later.
            </p>
            <button
              onClick={() => navigate("/tutors")}
              className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-heading font-bold uppercase tracking-widest rounded-lg transition-colors active:scale-[0.98]"
            >
              Browse Tutors
            </button>
          </AppleCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTutors.map((tutor) => (
              <AppleCard
                key={tutor._id}
                className="p-5 flex flex-col justify-between"
                moveOnHover
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar size="lg" className="size-14 rounded-lg overflow-hidden flex-shrink-0">
                      <AvatarImage src={tutor.photoURL} alt={tutor.displayName} />
                      <AvatarFallback className="text-muted-foreground text-sm font-heading font-bold uppercase rounded-lg">
                        {tutor.displayName?.charAt(0)?.toUpperCase() || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wide truncate">
                        {tutor.displayName}
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest truncate mt-0.5">
                        {tutor.qualification || "Tutor"}
                      </p>
                      {tutor.location && (
                        <p className="text-[10px] text-muted-foreground font-medium truncate mt-1">
                          {tutor.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {tutor.subjects && tutor.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tutor.subjects.slice(0, 3).map((sub, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-muted text-muted-foreground text-[9px] font-semibold rounded-lg border border-border/45"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  {tutor.expectedSalary ? (
                    <span className="text-xs font-heading font-bold text-primary tracking-wide">
                      ৳{tutor.expectedSalary.toLocaleString()}/mo
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Negotiable</span>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/tutor/${tutor._id}`)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/20 transition-all active:scale-[0.98]"
                      title="View Profile"
                    >
                      <ExternalLink size={15} />
                    </button>
                    <button
                      onClick={() => removeTutor(tutor._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all active:scale-[0.98]"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </AppleCard>
            ))}
          </div>
        )
      ) : savedTuitions.length === 0 ? (
        <AppleCard className="p-16 text-center border-dashed" hover={false}>
          <Bookmark size={40} className="mx-auto text-muted-foreground/30 mb-5" strokeWidth={1.5} />
          <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-2">
            No saved tuitions yet
          </h3>
          <p className="text-xs text-muted-foreground mb-6">
            Browse active tuition listings and bookmark them to apply later.
          </p>
          <button
            onClick={() => navigate("/tuitions")}
            className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-heading font-bold uppercase tracking-widest rounded-lg transition-colors active:scale-[0.98]"
          >
            Browse Tuitions
          </button>
        </AppleCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTuitions.map((tuition) => (
            <AppleCard
              key={tuition._id}
              className="p-5 flex flex-col justify-between"
              moveOnHover
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/25">
                    <Bookmark size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wide truncate">
                      {tuition.subject}
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest truncate mt-0.5">
                      {tuition.class_name || "N/A"}
                    </p>
                    {tuition.location && (
                      <p className="text-[10px] text-muted-foreground font-medium truncate mt-1">
                        {tuition.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                {tuition.salary ? (
                  <span className="text-xs font-heading font-bold text-primary tracking-wide">
                    ৳{tuition.salary.toLocaleString()}/mo
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Negotiable</span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/tuition/${tuition._id}`)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/20 transition-all active:scale-[0.98]"
                    title="View Details"
                  >
                    <ExternalLink size={15} />
                  </button>
                  <button
                    onClick={() => removeTuition(tuition._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all active:scale-[0.98]"
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </AppleCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
