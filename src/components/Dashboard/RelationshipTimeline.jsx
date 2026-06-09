import { useEffect, useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Printer,
  History,
} from 'lucide-react';
import api from '../../services/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const EVENT_CONFIG = {
  session_logged: {
    icon: Calendar,
    label: 'Session Logged',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    border: 'border-blue-200',
  },
  session_confirmed: {
    icon: CheckCircle,
    label: 'Session Confirmed',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    border: 'border-emerald-200',
  },
  session_disputed: {
    icon: AlertTriangle,
    label: 'Session Disputed',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    border: 'border-red-200',
  },
  payment_generated: {
    icon: DollarSign,
    label: 'Payment Generated',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    border: 'border-amber-200',
  },
  payment_verified: {
    icon: ShieldCheck,
    label: 'Payment Verified',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    border: 'border-emerald-200',
  },
  status_change: {
    icon: ArrowRight,
    label: 'Status Changed',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-100',
    border: 'border-teal-200',
  },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_BADGE_MAP = {
  pending: { variant: 'warning', label: 'Pending' },
  confirmed: { variant: 'success', label: 'Confirmed' },
  completed: { variant: 'success', label: 'Completed' },
  disputed: { variant: 'error', label: 'Disputed' },
  cancelled: { variant: 'error', label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const s = STATUS_BADGE_MAP[status] || { variant: 'subtle', label: status };
  return (
    <Badge variant={s.variant} size="sm">
      {s.label}
    </Badge>
  );
}

function TimelineEvent({ event, isLast }) {
  const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.session_logged;
  const Icon = config.icon;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'size-10 rounded-full flex items-center justify-center shrink-0',
            config.iconBg
          )}
        >
          <Icon size={18} className={config.iconColor} />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
      </div>

      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(event.date)}
          </span>
          {event.date && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(event.date)}
              </span>
            </>
          )}
        </div>

        <div className={cn('border rounded-xl p-4', config.border)}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground">
                {config.label}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {event.detail}
              </p>
              {event.meta && (
                <p className="text-xs text-muted-foreground mt-2">
                  {event.meta}
                </p>
              )}
            </div>
            {event.status && (
              <StatusBadge status={event.status} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <Skeleton className="size-10 rounded-full shrink-0" />
            {i < 3 && <Skeleton className="w-0.5 flex-1 mt-2" />}
          </div>
          <div className="flex-1 space-y-2 pb-8">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function sessionToEvents(sessions) {
  return (sessions || []).flatMap((session) => {
    const events = [];

    const typeMap = {
      confirmed: 'session_confirmed',
      disputed: 'session_disputed',
      completed: 'session_logged',
    };
    const type = typeMap[session.status] || 'session_logged';

    const detail = session.topics
      ? `Session on ${formatDate(session.meetingDate)} — ${session.topics}`
      : `Session on ${formatDate(session.meetingDate)}`;

    const meta = [];
    if (session.duration) meta.push(`Duration: ${session.duration}`);
    if (session.slot) meta.push(`Slot: ${session.slot}`);

    events.push({
      id: `session-${session._id}`,
      type,
      date: session.createdAt || session.meetingDate,
      status: session.status,
      detail,
      meta: meta.length > 0 ? meta.join(' · ') : null,
    });

    return events;
  });
}

export default function RelationshipTimeline({ connectionId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!connectionId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/api/sessions`, {
          params: { connectionId },
        });
        if (!cancelled) {
          setSessions(res.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load timeline:', err);
          setError('Failed to load timeline data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [connectionId]);

  const events = useMemo(() => {
    const result = sessionToEvents(sessions);
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    return result;
  }, [sessions]);

  if (!connectionId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <History
          size={40}
          className="text-muted-foreground mb-4"
          strokeWidth={1.5}
        />
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Select a Connection
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Choose a connection to view its activity timeline.
        </p>
      </div>
    );
  }

  if (loading) {
    return <TimelineSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle
          size={36}
          className="text-destructive mb-4"
          strokeWidth={1.5}
        />
        <p className="text-sm text-destructive">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Activity Timeline
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="print:hidden gap-2"
          onClick={() => window.print()}
        >
          <Printer size={14} />
          Export PDF
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <History
            size={40}
            className="text-muted-foreground mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-base font-semibold text-foreground mb-1">
            No activity recorded yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Events will appear here once sessions and payments are logged.
          </p>
        </div>
      ) : (
        <div className="relative">
          {events.map((event, idx) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isLast={idx === events.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
