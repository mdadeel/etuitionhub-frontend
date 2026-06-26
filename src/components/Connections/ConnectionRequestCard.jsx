import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { X, CheckCheck, Loader2 } from 'lucide-react';
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
    <div className="flex items-start gap-4 bg-card p-4 rounded-xl border border-border">
      <Avatar size="sm" className="w-10 h-10 flex-shrink-0 rounded-full">
        <AvatarImage src={request.otherUser.photoURL} alt={request.otherUser.displayName} />
        <AvatarFallback className="rounded-full">
          {request.otherUser.displayName?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-foreground">{request.otherUser.displayName}</h3>
          <div className="text-xs text-muted-foreground">{request.status}</div>
        </div>
        <p className="text-sm text-muted-foreground">
          {request.otherUser.role === 'tutor' 
            ? `Tutor • ${request.otherUser.subjects?.join(', ') || 'Various Subjects'}` 
            : `Student • ${request.otherUser.qualification || 'Seeking Tutoring'}`}
        </p>
        {request.otherUser.location && (
          <p className="text-xs text-muted-foreground">
            📍 {request.otherUser.location}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-4">
          {!loading && request.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                onClick={handleReject}
                size="sm"
              >
                Reject
              </Button>
              <Button 
                onClick={handleAccept}
                size="sm"
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
               className="text-red-500 border-red-500/30 hover:bg-red-500/10 hover:text-red-600"
             >
               File Dispute
             </Button>
          )}
          {loading && (
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="mr-2" />
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
