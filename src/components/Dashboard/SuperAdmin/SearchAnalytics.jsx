import { useQuery } from '@tanstack/react-query';
import { Search, AlertTriangle } from 'lucide-react';
import api from '../../../services/api';
import EmptyState from '../../shared/EmptyState';

const Section = ({ title, icon: Icon, items, colorClass, emptyText, loading, error, onRetry }) => (
  <section className="bg-card border border-border rounded-xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Icon className={`size-5 ${colorClass}`} />
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
    {loading ? (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 bg-muted rounded animate-pulse" />
        ))}
      </div>
    ) : error ? (
      <div className="text-sm text-destructive">
        <p>{error.response?.data?.error || error.message || 'Failed to load'}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-2 text-primary underline">
            Retry
          </button>
        )}
      </div>
    ) : items.length === 0 ? (
      <EmptyState icon={Icon} title={emptyText} />
    ) : (
      <ol className="space-y-2">
        {items.map((it, i) => (
          <li
            key={it._id || `${it.term}-${i}`}
            className="flex items-center justify-between p-2 rounded hover:bg-muted/50 text-sm"
          >
            <span className="font-mono">{it.term || it.query || it._id || '—'}</span>
            <span className="text-muted-foreground">{it.count ?? it.frequency ?? ''}</span>
          </li>
        ))}
      </ol>
    )}
  </section>
);

const SearchAnalytics = () => {
  const popular = useQuery({
    queryKey: ['analytics', 'popular-searches'],
    queryFn: async () => {
      const res = await api.get('/api/analytics/popular-searches?limit=20');
      return res.data || [];
    },
  });

  const zero = useQuery({
    queryKey: ['analytics', 'zero-result-searches'],
    queryFn: async () => {
      const res = await api.get('/api/analytics/zero-result-searches?limit=20');
      return res.data || [];
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Search Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          What users search for — and where they find nothing.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Section
          title="Popular searches"
          icon={Search}
          colorClass="text-primary"
          items={popular.data || []}
          loading={popular.isLoading}
          error={popular.error}
          onRetry={() => popular.refetch()}
          emptyText="No searches yet"
        />
        <Section
          title="Zero-result searches"
          icon={AlertTriangle}
          colorClass="text-warning"
          items={zero.data || []}
          loading={zero.isLoading}
          error={zero.error}
          onRetry={() => zero.refetch()}
          emptyText="No zero-result searches"
        />
      </div>
    </div>
  );
};

export default SearchAnalytics;
