import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { X, CheckCheck, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import DisputeModal from '../Dashboard/DisputeModal';

const ConnectionRequestCard = ({ request, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const handleAccept = async () => {
    setLoading(true);
    try {
      await api.post(`/api/connections/${request._id}/respond`, { status: 'accepted' });
      toast.success('Connection request accepted');
      if (onUpdate) onUpdate();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error('Failed to accept connection request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await api.post(`/api/connections/${request._id}/respond`, { status: 'rejected' });
      toast.success('Connection request rejected');
      if (onUpdate) onUpdate();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error('Failed to reject connection request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-3 sm:gap-4 bg-card p-3.5 sm:p-4 rounded-xl border border-border">
      <Avatar size="sm" className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-full">
        <AvatarImage src={request.otherUser.photoURL} alt={request.otherUser.displayName} />
        <AvatarFallback className="rounded-full">
          {request.otherUser.displayName?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
        <div className="flex justify-between items-start gap-2 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{request.otherUser.displayName}</h3>
          <div className="text-[11px] sm:text-xs text-muted-foreground capitalize shrink-0">{request.status}</div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {request.otherUser.role === 'tutor' 
            ? `Tutor • ${request.otherUser.subjects?.join(', ') || 'Various Subjects'}` 
            : `Student • ${request.otherUser.qualification || 'Seeking Tutoring'}`}
        </p>
        {request.otherUser.location && (
          <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 min-w-0">
            <MapPin size={12} className="text-muted-foreground/70 shrink-0" />
            <span className="truncate">{request.otherUser.location}</span>
          </p>
        )}
        <div className="flex flex-wrap items-center justify-end gap-2 mt-3 sm:mt-4">
          {!loading && request.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                onClick={handleReject}
                size="sm"
                className="h-8 text-xs px-3"
              >
                Reject
              </Button>
              <Button 
                onClick={handleAccept}
                size="sm"
                className="h-8 text-xs px-3"
              >
                Accept
              </Button>
            </>
          )}
          {!loading && request.status === 'accepted' && (
             <Button
               variant="outline"
               onClick={() => setShowDispute(true)}
               size="sm"
               className="h-8 text-xs px-3 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
             >
               File Dispute
             </Button>
          )}
          {loading && (
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs">Processing...</span>
            </div>
          )}
        </div>
      </div>

      <DisputeModal 
        open={showDispute}
        onOpenChange={setShowDispute}
        connectionId={request._id}
      />
    </div>
  );
};

export default ConnectionRequestCard;
