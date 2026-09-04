import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Bookmark, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { TutorCardGridSkeleton, TuitionCardGridSkeleton } from "@/components/shared/skeletons";
import DashboardPageHeader from "@/components/shared/DashboardPageHeader";
import TutorCard from "@/components/shared/TutorCard";
import TuitionCard from "@/components/shared/TuitionCard";

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

  const tabs = [
    { id: "tutors", label: "Saved Tutors", icon: Users, count: savedTutors.length },
    { id: "tuitions", label: "Saved Tuitions", icon: BookOpen, count: savedTuitions.length },
  ];

  const isLoading = activeTab === "tutors" ? loadingTutors : loadingTuitions;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 animate-fade-in-up">
      <DashboardPageHeader
        title="Bookmarks"
        subtitle="Manage all your saved tutors and tuition listings in one place."
        category="Saved Items"
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
          <Card className="p-16 text-center border-dashed" >
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
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} initialIsSaved={true} />
            ))}
          </div>
        )
      ) : savedTuitions.length === 0 ? (
        <Card className="p-16 text-center border-dashed" >
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
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTuitions.map((tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} initialIsSaved={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
