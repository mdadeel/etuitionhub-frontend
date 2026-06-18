import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import { 
  BookOpen, 
  MapPin, 
  Clock, 
  Banknote,
  Loader2,
  PlusCircle,
  MoreVertical,
  ExternalLink
} from "lucide-react";

const OrgTuitions = () => {
  const { orgId } = useParams();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/organizations/${orgId}/tuitions`);
        setTuitions(res.data.data);
      } catch (error) {
        toast.error("Failed to load tuitions");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTuitions();
  }, [orgId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tuitions Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your organization's course offerings and tutoring sessions.
          </p>
        </div>
        <Link
          to={`/post-tuition?orgId=${orgId}`}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Create Tuition
        </Link>
      </div>

      {tuitions.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Tuitions Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Your organization hasn't posted any tuitions. Create your first course or session to get started!
          </p>
          <Link
            to={`/post-tuition?orgId=${orgId}`}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <PlusCircle className="w-5 h-5" />
            Create First Tuition
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tuitions.map((tuition) => (
            <div key={tuition._id} className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border bg-muted/30 flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      tuition.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      tuition.status === 'matched' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      tuition.status === 'completed' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {tuition.status.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight mt-2">
                      {tuition.subject}
                    </h3>
                    <p className="text-sm font-medium text-primary">
                      Class: {tuition.class_name} • {tuition.curriculum?.toUpperCase()}
                    </p>
                  </div>
                  <button className="p-1.5 text-muted-foreground hover:bg-background rounded-md transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tuition.location || 'Online'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{tuition.days_per_week ? `${tuition.days_per_week} days/week` : 'Negotiable'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 shrink-0" />
                    <span className="font-medium text-foreground">{tuition.salary ? `৳${tuition.salary}` : 'Negotiable'}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-background flex items-center justify-between">
                <div className="text-xs text-muted-foreground font-medium">
                  Visibility: <span className="text-foreground capitalize">{tuition.visibility || 'Public'}</span>
                </div>
                <Link 
                  to={`/tuitions/${tuition._id}`} 
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  View Details <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgTuitions;
