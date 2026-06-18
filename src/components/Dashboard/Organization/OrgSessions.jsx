import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Loader2,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";

const OrgSessions = () => {
  const { orgId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Fetch tuitions for this org, then derive sessions from bookings
        const tuitionsRes = await api.get(`/api/v1/organizations/${orgId}/tuitions`).catch(() => ({ data: { data: [] } }));
        const tuitions = tuitionsRes.data.data || [];

        // Fetch bookings for each tuition
        const bookingPromises = tuitions.map(t =>
          api.get(`/api/bookings/tuition/${t._id}`).catch(() => ({ data: [] }))
        );
        const bookingResults = await Promise.all(bookingPromises);

        const allSessions = [];
        bookingResults.forEach((res, idx) => {
          const bookings = res.data || [];
          bookings.forEach(b => {
            allSessions.push({
              ...b,
              tuitionSubject: tuitions[idx]?.subject || "Unknown",
              tuitionClass: tuitions[idx]?.class_name || "",
            });
          });
        });

        setSessions(allSessions);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [orgId]);

  const filtered = filter === "all" ? sessions : sessions.filter(s => s.status === filter);

  const statusIcon = (status) => {
    switch (status) {
      case "confirmed": return <CheckCircle2 size={14} className="text-emerald-500" />;
      case "cancelled": return <XCircle size={14} className="text-red-500" />;
      default: return <Hourglass size={14} className="text-amber-500" />;
    }
  };

  const filters = ["all", "pending", "confirmed", "cancelled"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-1.5 bg-primary rounded-lg"></div>
          <span className="text-[9px] font-label font-semibold uppercase tracking-wider text-primary">Sessions</span>
        </div>
        <h1 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">Organization Sessions</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {sessions.length} total session{sessions.length !== 1 ? 's' : ''} across all tuitions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            className={`px-4 py-2 text-[9px] font-heading font-semibold uppercase tracking-widest rounded-lg border transition-all duration-300 ${
              filter === f
                ? "bg-primary border-primary text-primary-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted"
            }`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-16 text-center">
          <Calendar size={40} className="text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
          <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
            No sessions found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((session) => (
            <div
              key={session._id}
              className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="size-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-heading font-bold text-foreground">{session.tuitionSubject}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{session.tuitionClass}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users size={10} /> {session.studentEmail || session.tutorName}
                    </span>
                    {session.isAccepted && (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <Video size={10} /> Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {statusIcon(session.status)}
                <span className={`px-2.5 py-1 text-[9px] font-label font-semibold uppercase tracking-wider rounded-lg border ${
                  session.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
                  session.status === 'cancelled' ? 'bg-red-500/10 text-red-700 border-red-500/20' :
                  'bg-amber-500/10 text-amber-700 border-amber-500/20'
                }`}>
                  {session.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgSessions;
