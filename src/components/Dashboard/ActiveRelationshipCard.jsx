import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { User, Pause, Play, CheckCircle, Clock, BookOpen } from 'lucide-react';

const statusConfig = {
  active: { variant: 'success', label: 'Active' },
  paused: { variant: 'warning', label: 'Paused' },
  payment_due: { variant: 'destructive', label: 'Payment Due' },
  billing_frozen: { variant: 'ghost', label: 'Disputed' },
  waiting_for_payment: { variant: 'warning', label: 'Awaiting Payment' },
  completed: { variant: 'secondary', label: 'Completed' },
};

const ActiveRelationshipCard = ({ connection, onUpdate }) => {
  const { dbUser } = useAuth();
  const [actionLoading, setActionLoading] = useState(null);

  const currentUserId = dbUser?._id;
  const isTutor = currentUserId === connection.tutorId?._id;
  const isStudent = currentUserId === connection.studentId?._id;
  const other = isTutor ? connection.studentId : connection.tutorId;

  const displayName = other?.displayName || 'Unknown';
  const photoURL = other?.photoURL;

  const cfg = statusConfig[connection.relationshipStatus] || statusConfig.active;

  const handleAction = async (endpoint, successMsg, actionKey) => {
    setActionLoading(actionKey);
    try {
      await api.put(`/api/connections/${connection._id}${endpoint}`);
      toast.success(successMsg);
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEnd = () => {
    if (!confirm('Are you sure you want to end this tutoring relationship?')) return;
    handleAction('/complete', 'Connection ended', 'complete');
  };

  const isActive = connection.relationshipStatus === 'active';
  const isPaused = connection.relationshipStatus === 'paused';
  const isEnded = connection.relationshipStatus === 'completed';

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {photoURL ? (
            <img src={photoURL} alt="" className="size-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-foreground">{displayName}</h4>
              <Badge variant={cfg.variant} size="xs">{cfg.label}</Badge>
            </div>

            {connection.proposedDetails?.subject && (
              <p className="text-sm text-muted-foreground mt-1">
                <BookOpen className="size-3.5 inline mr-1.5" />
                {connection.proposedDetails.subject}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              {connection.agreedRate && (
                <span className="tabular-nums">৳{connection.agreedRate}/month</span>
              )}
              {connection.sessionsPerMonth && (
                <span>{connection.sessionsPerMonth} sessions/mo</span>
              )}
              {connection.billingStartDate && (
                <span>Billing from {new Date(connection.billingStartDate).toLocaleDateString()}</span>
              )}
              {isPaused && connection.pausedAt && (
                <span className="flex items-center gap-1 text-warning">
                  <Clock className="size-3" /> Paused {new Date(connection.pausedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {!isEnded && (
          <div className="flex gap-2 shrink-0">
            {isTutor && (
              <button
                onClick={() => toast('Session logging coming soon')}
                className="size-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                title="Log Session"
              >
                <BookOpen className="size-4" />
              </button>
            )}

            {isActive && (
              <button
                onClick={() => handleAction('/pause', 'Relationship paused', 'pause')}
                disabled={actionLoading !== null}
                className="size-9 flex items-center justify-center rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors disabled:opacity-50"
                title="Pause"
              >
                <Pause className="size-4" />
              </button>
            )}

            {isPaused && (
              <button
                onClick={() => handleAction('/resume', 'Relationship resumed', 'resume')}
                disabled={actionLoading !== null}
                className="size-9 flex items-center justify-center rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50"
                title="Resume"
              >
                <Play className="size-4" />
              </button>
            )}

            <button
              onClick={handleEnd}
              disabled={actionLoading !== null}
              className="size-9 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
              title="End"
            >
              <CheckCircle className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRelationshipCard;
