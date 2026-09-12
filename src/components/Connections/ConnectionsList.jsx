import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useConnectionsQuery } from '@/hooks/queries/useStudentQuery';
import ConnectionRequestCard from './ConnectionRequestCard';
import { Loader2, RefreshCw, MessageCircleWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConnectionsList = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, pending, accepted
  const navigate = useNavigate();

  // Batch 4c: cached, cancellable list (same ?status= semantics as before).
  const { data: connections = [], isLoading: loading } = useConnectionsQuery(filter === 'all' ? '' : filter);

  const handleUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['connections'] });
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
