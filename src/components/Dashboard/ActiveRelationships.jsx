import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useConnectionsQuery } from '@/hooks/queries/useStudentQuery';
import { Loader2, UserX } from 'lucide-react';
import ActiveRelationshipCard from './ActiveRelationshipCard';
import DashboardPageHeader from '@/components/shared/DashboardPageHeader';
import EmptyState from '@/components/shared/EmptyState';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'payment_due', label: 'Payment Due' },
];

const ActiveRelationships = () => {
  const queryClient = useQueryClient();
  const { data: connections = [], isLoading: loading } = useConnectionsQuery('accepted');
  const [tab, setTab] = useState('all');

  const handleUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['connections', 'accepted'] });
  };

  const filtered = tab === 'all'
    ? connections
    : connections.filter(c => c.relationshipStatus === tab);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <DashboardPageHeader
        title="Active Relationships"
        subtitle="Manage your tutoring connections"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
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
        <EmptyState
          icon={UserX}
          title={tab === 'all' ? 'No relationships yet' : `No ${tab.replace('_', ' ')} relationships`}
          description="Start by finding a tutor or posting a tuition request."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(conn => (
            <ActiveRelationshipCard
              key={conn._id}
              connection={conn}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveRelationships;
