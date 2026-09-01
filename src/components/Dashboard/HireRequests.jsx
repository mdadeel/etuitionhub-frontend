import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2, Check, X, Send, Inbox, User, Mail, ArrowRightLeft, Eye, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import DashboardPageHeader from '@/components/shared/DashboardPageHeader';
import ImportantMails from './ImportantMails';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const statusConfig = {
  pending: { variant: 'warning', label: 'Pending' },
  countered: { variant: 'outline', label: 'Countered' },
  accepted: { variant: 'success', label: 'Accepted' },
  declined: { variant: 'destructive', label: 'Declined' },
  expired: { variant: 'ghost', label: 'Expired' },
  cancelled: { variant: 'ghost', label: 'Cancelled' },
};

const HireRequests = () => {
  const [tab, setTab] = useState('inbox');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [counterModal, setCounterModal] = useState({ open: false, requestId: null, originalRate: 0 });
  const [counterRate, setCounterRate] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [submittingCounter, setSubmittingCounter] = useState(false);
  const navigate = useNavigate();

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (tab === 'important') return; // ImportantMails handles its own data
    setLoading(true);
    api.get(`/api/hire-requests/${tab}`)
      .then(res => setRequests(res.data?.data || res.data || []))
      .catch(() => toast.error('Failed to load requests'))
      .finally(() => setLoading(false));
  }, [tab]);

  const handleAccept = async (id) => {
    try {
      await api.patch(`/api/hire-requests/${id}/accept`);
      toast.success('Request accepted — connection created');
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'accepted' } : r));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept');
    }
  };

  const handleDecline = async (id) => {
    try {
      await api.patch(`/api/hire-requests/${id}/decline`);
      toast.success('Request declined');
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'declined' } : r));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to decline');
    }
  };

  const handleCounter = async () => {
    if (!counterRate || Number(counterRate) <= 0) {
      toast.error('Please enter a valid counter rate');
      return;
    }
    setSubmittingCounter(true);
    try {
      await api.patch(`/api/hire-requests/${counterModal.requestId}/counter`, {
        counterRate: Number(counterRate),
        counterMessage
      });
      toast.success('Counter-offer sent');
      setRequests(prev => prev.map(r =>
        r._id === counterModal.requestId
          ? { ...r, status: 'countered', counterRate: Number(counterRate), counterMessage }
          : r
      ));
      setCounterModal({ open: false, requestId: null, originalRate: 0 });
      setCounterRate('');
      setCounterMessage('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send counter');
    } finally {
      setSubmittingCounter(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.delete(`/api/hire-requests/${id}`);
      toast.success('Request cancelled');
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel');
    }
  };

  const handleViewProfile = (req) => {
    const otherUser = tab === 'inbox' ? req.fromUserId : req.toUserId;
    if (otherUser?._id) {
      navigate(`/tutor/${otherUser._id}`);
    }
  };

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - now;
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${hrs}h left`;
    if (hrs > 0) return `${hrs}h ${mins}m left`;
    return `${mins}m left`;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <DashboardPageHeader
        title="Hire Requests"
        subtitle="Manage incoming and outgoing tutoring requests"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
        <button
          onClick={() => setTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'inbox' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Inbox className="size-4" /> Incoming
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'sent' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Send className="size-4" /> Sent
        </button>
        <button
          onClick={() => setTab('important')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'important' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Mail className="size-4" /> Important Inbox
        </button>
      </div>

      {/* Content */}
      {tab === 'important' ? (
        <ImportantMails />
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20">
          <Mail className="size-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No {tab} requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const otherUser = tab === 'inbox' ? req.fromUserId : req.toUserId;
            const displayName = otherUser?.displayName || 'Unknown';
            const photoURL = otherUser?.photoURL;
            const cfg = statusConfig[req.status] || statusConfig.pending;
            const isPending = req.status === 'pending';
            const isCountered = req.status === 'countered';
            const canAct = (tab === 'inbox' && isPending) || (tab === 'sent' && isCountered);

            return (
              <div key={req._id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-colors">
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
                        {(isPending || isCountered) && req.expiresAt && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" /> {getTimeRemaining(req.expiresAt)}
                          </span>
                        )}
                      </div>

                      {req.subjects && req.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {req.subjects.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-muted text-xs text-muted-foreground rounded">{s}</span>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{req.message}</p>

                      {req.preferredSlot && (
                        <p className="text-xs text-foreground mt-1 flex items-center gap-1">
                          <Clock className="size-3 text-primary" /> Requested slot: {req.preferredSlot}
                        </p>
                      )}

                      {req.proposedRate && !isCountered && (
                        <p className="text-xs text-foreground mt-1">Proposed: ৳{req.proposedRate.toLocaleString()}/mo</p>
                      )}

                      {isCountered && (
                        <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                            Original offer: ৳{req.proposedRate?.toLocaleString()} → Counter: ৳{req.counterRate?.toLocaleString()}/mo
                          </p>
                          {req.counterMessage && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 italic">"{req.counterMessage}"</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {canAct && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="size-9 flex items-center justify-center rounded-lg bg-success/10 text-success hover:bg-success/20 active:scale-[0.98] transition-all"
                        title="Accept"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        onClick={() => setCounterModal({ open: true, requestId: req._id, originalRate: isCountered ? req.counterRate : req.proposedRate })}
                        className="size-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 active:scale-[0.98] transition-all"
                        title="Counter"
                      >
                        <ArrowRightLeft className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDecline(req._id)}
                        className="size-9 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 active:scale-[0.98] transition-all"
                        title="Decline"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}

                  {tab === 'sent' && (isPending || isCountered) && (
                    <button
                      onClick={() => handleCancel(req._id)}
                      className="size-9 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground active:scale-[0.98] transition-all"
                      title="Cancel"
                    >
                      <X className="size-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleViewProfile(req)}
                    className="size-9 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground active:scale-[0.98] transition-all"
                    title="View Profile"
                  >
                    <Eye className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Counter-Offer Modal */}
      <Dialog open={counterModal.open} onOpenChange={(open) => {
        if (!open) {
          setCounterModal({ open: false, requestId: null, originalRate: 0 });
          setCounterRate('');
          setCounterMessage('');
        }
      }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Counter Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Original offer: ৳{counterModal.originalRate?.toLocaleString()}/mo
            </p>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Your counter rate (৳)</label>
              <input
                type="number"
                value={counterRate}
                onChange={(e) => setCounterRate(e.target.value)}
                placeholder="e.g. 6000"
                className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Message (optional)</label>
              <textarea
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                placeholder="I can do ৳6,000 given the distance..."
                maxLength={500}
                className="w-full h-20 bg-background border border-border rounded-xl p-3 text-sm text-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCounterModal({ open: false, requestId: null, originalRate: 0 });
              setCounterRate('');
              setCounterMessage('');
            }}>Cancel</Button>
            <Button onClick={handleCounter} disabled={submittingCounter || !counterRate}>
              {submittingCounter ? 'Sending…' : 'Send Counter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HireRequests;
