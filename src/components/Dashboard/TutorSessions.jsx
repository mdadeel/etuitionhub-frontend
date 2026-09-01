import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, LineSkeleton } from "@/components/shared/skeletons";
import DashboardPageHeader from "@/components/shared/DashboardPageHeader";
import toast from 'react-hot-toast';
import { Calendar, Clock, Video, MapPin, Loader2, Users } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'outline', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  accepted: { label: 'Confirmed', variant: 'outline', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
  completed: { label: 'Completed', variant: 'outline', className: 'bg-primary/10 text-primary border-primary/20' },
  cancelled: { label: 'Cancelled', variant: 'outline', className: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
];

function SessionCardSkeleton() {
  return (
    <CardSkeleton className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <LineSkeleton width="2/3" className="h-3" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-24 rounded-lg" />
        <Skeleton className="h-3 w-16 rounded-lg" />
      </div>
    </CardSkeleton>
  );
}

export default function TutorSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/api/sessions', { params: { scope: 'tutor' } });
        setSessions(res.data.data || res.data || []);
      } catch {
        toast.error('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const filtered = useMemo(() => {
    if (tab === 'all') return sessions;
    return sessions.filter(s => s.status === tab);
  }, [sessions, tab]);

  const counts = useMemo(() => ({
    all: sessions.length,
    pending: sessions.filter(s => s.status === 'pending').length,
    accepted: sessions.filter(s => s.status === 'accepted').length,
    completed: sessions.filter(s => s.status === 'completed').length,
  }), [sessions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <DashboardPageHeader
        title="My Sessions"
        subtitle="View and manage your tutoring sessions"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              tab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                tab === t.key ? 'bg-primary-foreground/20' : 'bg-muted'
              }`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="size-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {tab === 'all' ? 'No sessions yet' : `No ${tab} sessions`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(session => {
            const statusConfig = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending;
            return (
              <Card key={session._id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm leading-tight">{session.studentEmail || session.studentName || 'Student'}</p>
                      {session.topic && (
                        <p className="text-xs text-muted-foreground mt-0.5">{session.topic}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={statusConfig.variant} className={`text-[10px] ${statusConfig.className}`}>
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3.5" />
                    <span>{session.meetingDate ? new Date(session.meetingDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5" />
                    <span>{session.slot || session.durationMinutes ? `${session.durationMinutes || 60} min` : 'TBD'}</span>
                  </div>
                  {session.mode && (
                    <div className="flex items-center gap-2">
                      {session.mode === 'online' ? <Video className="size-3.5" /> : <MapPin className="size-3.5" />}
                      <span className="capitalize">{session.mode}</span>
                    </div>
                  )}
                </div>

                {session.status === 'pending' && (
                  <div className="mt-4 pt-3 border-t border-border flex gap-2">
                    <button className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                      Confirm
                    </button>
                    <button className="px-3 py-1.5 text-xs text-muted-foreground hover:text-red-500 border border-border rounded-lg hover:bg-red-500/5 transition-colors">
                      Decline
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
