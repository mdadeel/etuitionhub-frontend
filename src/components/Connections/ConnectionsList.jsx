import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConnectionRequestCard from './ConnectionRequestCard';
import { Loader2, RefreshCw, MessageCircleWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConnectionsList = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted
  const navigate = useNavigate();

  useEffect(() => {
    loadConnections();
  }, [filter]);

  const loadConnections = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/connections?status=${filter !== 'all' ? filter : ''}`);
      setConnections(res.data || []);
    } catch (err) {
      console.error('Failed to load connections:', err);
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    loadConnections();
  };

  const handleNavigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="mr-2" />
        <span>Loading connections...</span>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircleWarning size={48} className="mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="font-semibold text-foreground">No connections found</h3>
        <p className="text-muted-foreground">
          You don't have any {filter === 'pending' ? 'connection requests' : 
            filter === 'accepted' ? 'accepted connections' : 
            'connections'} yet.
        </p>
        {filter !== 'pending' && (
          <Button 
            onClick={() => navigate('/tutors')}
            variant="outline"
          >
            Browse Tutors
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-border">
        <h2 className="font-semibold text-foreground">Connections</h2>
        <div className="flex items-center gap-3">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="xs"
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            size="xs"
          >
            Pending ({connections.filter(c => c.status === 'pending').length})
          </Button>
          <Button
            variant={filter === 'accepted' ? 'default' : 'outline'}
            onClick={() => setFilter('accepted')}
            size="xs"
          >
            Accepted ({connections.filter(c => c.status === 'accepted').length})
          </Button>
          <Button
            onClick={handleUpdate}
            variant="ghost"
            size="xs"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {connections.map(connection => (
          <ConnectionRequestCard
            key={connection._id}
            request={connection}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default ConnectionsList;
