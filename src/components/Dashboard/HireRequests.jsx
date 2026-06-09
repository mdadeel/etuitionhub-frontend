import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2, Check, X, Send, Inbox, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import ImportantMails from './ImportantMails';

const statusConfig = {
  pending: { variant: 'warning', label: 'Pending' },
  accepted: { variant: 'success', label: 'Accepted' },
  declined: { variant: 'destructive', label: 'Declined' },
  expired: { variant: 'ghost', label: 'Expired' },
};

const HireRequests = () => {
  const [tab, setTab] = useState('inbox');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt) - Date.now();
    if (diff <= 0) return 'Expired';
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hrs}h ${mins}m remaining`;
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-3">
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
            const otherUser = req.fromUserId || req.toUserId || {};
            const displayName = otherUser.displayName || 'Unknown';
            const photoURL = otherUser.photoURL;
            const cfg = statusConfig[req.status] || statusConfig.pending;

            return (
              <div key={req._id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Avatar */}
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
                        {req.status === 'pending' && req.expiresAt && (
                          <span className="text-[10px] text-muted-foreground">
                            {getTimeRemaining(req.expiresAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{req.message}</p>
                      {req.proposedRate && (
                        <p className="text-xs text-foreground mt-1">Proposed: ৳{req.proposedRate}/month</p>
                      )}
                    </div>
                  </div>

                  {/* Actions (inbox + pending only) */}
                  {tab === 'inbox' && req.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="size-9 flex items-center justify-center rounded-lg bg-success/10 text-success hover:bg-success/20 active:scale-[0.98] transition-all"
                        title="Accept"
                      >
                        <Check className="size-4" />
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HireRequests;
