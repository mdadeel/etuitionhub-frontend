import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Pause, Play, CheckCircle, Clock, BookOpen, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import SessionLogModal from './SessionLogModal';
import ConnectionPrivacySettings from '../Connections/ConnectionPrivacySettings';

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
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const currentUserId = dbUser?._id;
  const isTutor = currentUserId === connection.tutorId?._id;
  // eslint-disable-next-line no-unused-vars
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
    <div className="bg-card border border-border rounded-xl p-3.5 sm:p-4 hover:border-primary/20 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Avatar size="sm" className="size-9 sm:size-10 rounded-full shrink-0">
            <AvatarImage src={photoURL} alt={displayName} />
            <AvatarFallback className="rounded-full">
              <User className="size-4 sm:size-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm sm:text-base text-foreground">{displayName}</h4>
              <Badge variant={cfg.variant} size="xs">{cfg.label}</Badge>
            </div>

            {connection.proposedDetails?.subject && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                <BookOpen className="size-3.5 inline mr-1.5" />
                {connection.proposedDetails.subject}
              </p>
            )}

            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
              {connection.agreedRate && (
                <span className="tabular-nums font-medium text-foreground">৳{connection.agreedRate.toLocaleString()}/month</span>
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
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-start">
            {isTutor && (
              <button
                type="button"
                onClick={() => setShowLogModal(true)}
                className="size-8 sm:size-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                title="Log Session"
              >
                <BookOpen className="size-3.5 sm:size-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPrivacy(!showPrivacy)}
              className="size-8 sm:size-9 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              title="Privacy Settings"
            >
              <Settings className="size-3.5 sm:size-4" />
            </button>

            {isActive && (
              <button
                type="button"
                onClick={() => handleAction('/pause', 'Relationship paused', 'pause')}
                disabled={actionLoading !== null}
                className="size-8 sm:size-9 flex items-center justify-center rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors disabled:opacity-50"
                title="Pause"
              >
                <Pause className="size-3.5 sm:size-4" />
              </button>
            )}

            {isPaused && (
              <button
                type="button"
                onClick={() => handleAction('/resume', 'Relationship resumed', 'resume')}
                disabled={actionLoading !== null}
                className="size-8 sm:size-9 flex items-center justify-center rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50"
                title="Resume"
              >
                <Play className="size-3.5 sm:size-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleEnd}
              disabled={actionLoading !== null}
              className="size-8 sm:size-9 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
              title="End"
            >
              <CheckCircle className="size-3.5 sm:size-4" />
            </button>
          </div>
        )}
      </div>

      {showPrivacy && (
        <div className="mt-4 pt-4 border-t border-border">
          <ConnectionPrivacySettings
            connectionId={connection._id}
            onClose={() => setShowPrivacy(false)}
          />
        </div>
      )}

      <SessionLogModal
        connectionId={connection._id}
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onLogged={() => { setShowLogModal(false); onUpdate?.(); }}
      />
    </div>
  );
};

export default ActiveRelationshipCard;
