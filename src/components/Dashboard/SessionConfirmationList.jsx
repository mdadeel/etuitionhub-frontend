import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Check, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SessionConfirmationList = () => {
  const { dbUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [disputingId, setDisputingId] = useState(null);
  const [disputeReasons, setDisputeReasons] = useState({});

  useEffect(() => {
    if (!dbUser?._id) return;
    setLoading(true);
    setError(null);
    api.get('/api/sessions', { params: { studentStatus: 'pending', studentId: dbUser._id } })
      .then(res => setSessions(res.data || []))
      .catch(err => {
        console.error(err);
        setError('Failed to load sessions');
        setSessions([]);
      })
      .finally(() => setLoading(false));
  }, [dbUser?._id]);

  const handleConfirm = async (id) => {
    setConfirmingId(id);
    try {
      await api.patch(`/api/sessions/${id}/confirm`);
      setSessions(prev => prev.filter(s => s._id !== id));
      toast.success('Session confirmed!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to confirm session');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleDispute = async (id) => {
    const reason = disputeReasons[id]?.trim();
    if (!reason) {
      toast.error('Please provide a reason for disputing');
      return;
    }
    setDisputingId(id);
    try {
      await api.patch(`/api/sessions/${id}/dispute`, { reason });
      setSessions(prev => prev.filter(s => s._id !== id));
      toast.success('Session disputed — admin will review');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to dispute session');
    } finally {
      setDisputingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 py-16 justify-center text-muted-foreground">
        <AlertCircle className="size-4" />
        <span className="text-sm">{error}</span>
        <Button variant="outline" size="xs" onClick={() => window.location.reload()} className="ml-2">Retry</Button>
      </div>
    );
  }

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground">Pending Session Confirmations</h3>
        <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-800 rounded-full">{sessions.length}</span>
      </div>

      <div className="divide-y divide-border border border-border rounded-lg">
        {sessions.map(session => (
          <div key={session._id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {session.tutorName || session.tutorId?.displayName || 'Tutor'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(session.scheduledAt).toLocaleDateString('en-BD', {
                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                  })}
                  {session.durationMinutes && ` · ${session.durationMinutes} min`}
                </p>
              </div>
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
            </div>

            {session.topicsCovered && (
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "{session.topicsCovered}"
              </p>
            )}

            <div className="flex gap-2">
              <Button
                size="xs"
                onClick={() => handleConfirm(session._id)}
                disabled={confirmingId === session._id || disputingId === session._id}
                className="h-7 px-3 text-xs"
              >
                {confirmingId === session._id ? (
                  <Loader2 className="size-3 animate-spin mr-1" />
                ) : (
                  <Check className="size-3 mr-1" />
                )}
                Confirm
              </Button>

              <div className="flex-1 flex gap-2 items-center">
                {disputeReasons[session._id] !== undefined ? (
                  <>
                    <input
                      type="text"
                      value={disputeReasons[session._id] || ''}
                      onChange={e => setDisputeReasons(prev => ({ ...prev, [session._id]: e.target.value }))}
                      placeholder="Reason for dispute..."
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      disabled={disputingId === session._id}
                    />
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() => handleDispute(session._id)}
                      disabled={disputingId === session._id || confirmingId === session._id}
                      className="h-7 px-3 text-xs shrink-0"
                    >
                      {disputingId === session._id ? (
                        <Loader2 className="size-3 animate-spin mr-1" />
                      ) : (
                        <X className="size-3 mr-1" />
                      )}
                      Submit
                    </Button>
                    <button
                      type="button"
                      onClick={() => setDisputeReasons(prev => { const next = { ...prev }; delete next[session._id]; return next; })}
                      className="text-xs text-muted-foreground hover:text-foreground shrink-0"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setDisputeReasons(prev => ({ ...prev, [session._id]: '' }))}
                    disabled={confirmingId === session._id}
                    className="h-7 px-3 text-xs"
                  >
                    <X className="size-3 mr-1" />
                    Dispute
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionConfirmationList;
