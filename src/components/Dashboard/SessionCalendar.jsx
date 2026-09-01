import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertTriangle, Users } from "lucide-react";
import api from "../../services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardPageHeader from "@/components/shared/DashboardPageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { CardSkeleton, LineSkeleton } from "@/components/shared/skeletons";
import { WEEKDAYS, DAYS_IN_GRID, dayKey, monthStart, monthEnd, buildGridDays, groupByDay } from "@/lib/sessionCalendar";

const SessionCalendar = () => {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState(() => monthStart(new Date()));
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/sessions", {
        params: {
          status: "scheduled",
          startDate: monthStart(cursor).toISOString(),
          endDate: monthEnd(cursor).toISOString(),
          limit: 100,
        },
      });
      setSessions(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load calendar sessions", err);
      setError(err.response?.data?.error || "Could not load your session calendar");
    } finally {
      setLoading(false);
    }
  }, [cursor]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const byDay = useMemo(() => groupByDay(sessions), [sessions]);

  const gridDays = useMemo(() => buildGridDays(cursor), [cursor]);

  const todayKey = dayKey(new Date());
  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
  const inMonth = (d) => d.getMonth() === cursor.getMonth();
  const sessionCount = Object.values(byDay).reduce((n, list) => n + list.length, 0);

  const goMonth = (delta) => setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  const goToday = () => setCursor(() => monthStart(new Date()));

  /** Other party's name: a student sees the tutor, a tutor sees the student. */
  const counterpartName = (session) => {
    const tutorName = session.tutorId?.displayName;
    const studentName = session.studentId?.displayName;
    return tutorName || studentName || "Tutor";
  };

  const timeLabel = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const pendingCount = sessions.filter((s) => s.studentStatus === "pending").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <LineSkeleton width="1/3" className="h-6" />
            <LineSkeleton width="1/4" className="h-8" />
          </div>
          <div className="grid grid-cols-7 gap-px bg-border">
            {Array.from({ length: DAYS_IN_GRID }).map((_, i) => (
              <div key={i} className="h-24 bg-card p-2">
                <LineSkeleton width="1/2" className="h-3" />
                <LineSkeleton width="3/4" className="h-3 mt-2" />
              </div>
            ))}
          </div>
        </CardSkeleton>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <DashboardPageHeader
        category="Engagements"
        title="My Calendar"
        subtitle="Your confirmed tutoring sessions, month by month"
        action={
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={goToday} className="rounded-lg">
              Today
            </Button>
            <Button variant="outline" size="icon-sm" onClick={() => goMonth(-1)} aria-label="Previous month" className="rounded-lg">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon-sm" onClick={() => goMonth(1)} aria-label="Next month" className="rounded-lg">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />

      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-primary" />
          {sessionCount} session{sessionCount === 1 ? "" : "s"} in {monthLabel}
        </span>
        {pendingCount > 0 && (
          <span className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-warning" />
            {pendingCount} awaiting your confirmation
          </span>
        )}
      </div>

      {error ? (
        <Card className="p-8 text-center" hover={false}>
          <AlertTriangle className="size-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">Could not load your calendar</p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
          <Button variant="primary" size="sm" className="mt-4 rounded-lg" onClick={fetchSessions}>
            Retry
          </Button>
        </Card>
      ) : sessionCount === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="No sessions this month"
          description="Book a tutor to see your confirmed sessions here."
        />
      ) : (
        <Card className="overflow-hidden" hover={false}>
          {/* Weekday header row */}
          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-r border-border last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {gridDays.map((d) => {
              const key = dayKey(d);
              const daySessions = byDay[key] || [];
              const isToday = key === todayKey;
              const isCurrentMonth = inMonth(d);
              const visible = daySessions.slice(0, 2);
              const overflow = daySessions.length - visible.length;

              return (
                <div
                  key={d.getTime()}
                  className={cn(
                    "min-h-24 p-1.5 border-b border-r border-border last:border-r-0",
                    !isCurrentMonth && "bg-muted/40",
                    isToday && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "size-6 flex items-center justify-center rounded-md text-xs font-semibold",
                        isToday ? "bg-primary text-primary-foreground" : isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {d.getDate()}
                    </span>
                    {daySessions.length > 0 && (
                      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                    )}
                  </div>

                  <div className="space-y-1">
                    {visible.map((s) => (
                      <button
                        key={s._id}
                        type="button"
                        onClick={() => navigate("/dashboard/relationships")}
                        className="w-full text-left px-1.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors group"
                        title={`${timeLabel(s.scheduledAt)} — ${counterpartName(s)}${s.topic ? ` — ${s.topic}` : ""}`}
                      >
                        <span className="block text-[10px] font-semibold text-primary leading-none">
                          {timeLabel(s.scheduledAt)}
                        </span>
                        <span className="block text-[10px] text-muted-foreground leading-tight truncate mt-0.5">
                          {counterpartName(s)}
                        </span>
                      </button>
                    ))}
                    {overflow > 0 && (
                      <button
                        type="button"
                        onClick={() => navigate("/dashboard/relationships")}
                        className="w-full text-left px-1.5 py-1 rounded-md text-[10px] font-medium text-muted-foreground hover:bg-muted transition-colors"
                      >
                        +{overflow} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Upcoming list for the month */}
      {!error && sessionCount > 0 && (
        <Card className="p-5" hover={false}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Upcoming this month</h3>
          </div>
          <ul className="space-y-2">
            {sessions
              .filter((s) => new Date(s.scheduledAt) >= new Date())
              .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
              .slice(0, 5)
              .map((s) => (
                <li key={s._id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Users className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{counterpartName(s)}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{s.topic || "Tutoring session"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.studentStatus === "pending" && (
                      <span className="text-[10px] font-semibold text-warning">Pending</span>
                    )}
                    <span className="text-xs font-medium text-muted-foreground">{timeLabel(s.scheduledAt)}</span>
                  </div>
                </li>
              ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default SessionCalendar;
