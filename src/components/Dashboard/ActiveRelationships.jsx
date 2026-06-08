import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Loader2, Users, UserX } from 'lucide-react';
import ActiveRelationshipCard from './ActiveRelationshipCard';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'payment_due', label: 'Payment Due' },
];

const ActiveRelationships = () => {
  const { dbUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/connections?status=accepted');
      setConnections(res.data?.data || res.data || []);
    } catch {
      toast.error('Failed to load relationships');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const filtered = tab === 'all'
    ? connections
    : connections.filter(c => c.relationshipStatus === tab);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-3">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <UserX className="size-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No {tab === 'all' ? '' : tab} relationships</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(conn => (
            <ActiveRelationshipCard
              key={conn._id}
              connection={conn}
              onUpdate={fetchConnections}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveRelationships;
