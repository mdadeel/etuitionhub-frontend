import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ConnectionsList from '../components/Connections/ConnectionsList';
import ConnectionRequestCard from '../components/Connections/ConnectionRequestCard';
import OnboardingWizard from '../components/Connections/OnboardingWizard';
import ConnectionStatusBadge from '../components/Connections/ConnectionStatusBadge';
import { Mail, UserPlus } from 'lucide-react';
import { AppleHeader } from "@/components/shared/AppleUI";

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState('requests'); // requests, connections
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [viewerRole] = useState('student');  // could be 'tutor' or 'student' (placeholder)
  const navigate = useNavigate();

  const loadPendingRequests = async () => {
    try {
      const res = await api.get(`/api/connections?status=pending`);
      setPendingRequests(res.data || []);
      return null;
    } catch (err) {
      console.error('Failed to load pending requests:', err);
      return err;
    }
  };

  const loadAcceptedConnections = async () => {
    try {
      const res = await api.get('/api/connections?status=accepted');
      setAcceptedConnections(res.data || []);
      return null;
    } catch (err) {
      console.error('Failed to load accepted connections:', err);
      return err;
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setLoadError(null);
    const [pendingErr, acceptedErr] = await Promise.all([loadPendingRequests(), loadAcceptedConnections()]);
    if (pendingErr || acceptedErr) {
      setLoadError('Could not load your connections. Check your connection and try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <AppleHeader 
        title="Connections" 
        subtitle="Manage your tutoring connections and requests"
        badge={<span className="px-3 py-1 text-xs font-semibold rounded-none bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">My Network</span>}
      />

      <div className="flex items-center border-b border-border pb-4">
        <button
          onClick={() => setActiveTab('requests')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-300 rounded-none",
            activeTab === 'requests'
              ? "bg-card text-[#2563EB] shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          )}
        >
          <UserPlus size={16} />
          Connection Requests
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-300 rounded-none ml-4",
            activeTab === 'connections'
              ? "bg-card text-[#2563EB] shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          )}
        >
          <Mail size={16} />
          My Connections
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 rounded-lg border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : loadError ? (
            <div className="text-center py-12">
              <h3 className="font-semibold text-foreground">Something went wrong</h3>
              <p className="text-muted-foreground mt-1">{loadError}</p>
              <button
                onClick={loadAll}
                className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <ConnectionRequestCard
                  key={request._id}
                  request={request}
                  onUpdate={() => {
                    // Reload pending requests when a request is updated
                    loadPendingRequests();
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserPlus size={48} className="mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="font-semibold text-foreground">No connection requests</h3>
              <p className="text-muted-foreground">
                You haven't received any connection requests yet.
              </p>
              <button
                onClick={() => navigate('/tutors')}
                className="mt-6 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] text-sm font-medium"
              >
                Browse Tutors to Connect
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="p-6 space-y-6">
          <ConnectionsList />
          {acceptedConnections.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Manage your tutoring</h2>
              <div className="space-y-4">
                {acceptedConnections.map(c => (
                  <OnboardingWizard
                    key={c._id}
                    connection={c}
                    viewerRole={viewerRole}
                    onChange={() => { loadAcceptedConnections(); }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function for conditional class names (since we can't import cn in this context)
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default ConnectionsPage;
