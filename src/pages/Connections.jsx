import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import ConnectionsList from '../components/Connections/ConnectionsList';
import ConnectionRequestCard from '../components/Connections/ConnectionRequestCard';
import OnboardingWizard from '../components/Connections/OnboardingWizard';
import { Mail, UserPlus } from 'lucide-react';
import { AppleHeader } from "@/components/shared/AppleUI";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SEO from '@/components/shared/SEO';

const ConnectionsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('requests'); // requests, connections
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [viewerRole] = useState('student');  // could be 'tutor' or 'student' (placeholder)
  const navigate = useNavigate();

  const loadPendingRequests = useCallback(async () => {
    try {
      const res = await api.get(`/api/connections?status=pending`);
      setPendingRequests(res.data || []);
      return null;
    } catch (err) {
      console.error('Failed to load pending requests:', err);
      return err;
    }
  }, []);

  const loadAcceptedConnections = useCallback(async () => {
    try {
      const res = await api.get('/api/connections?status=accepted');
      setAcceptedConnections(res.data || []);
      return null;
    } catch (err) {
      console.error('Failed to load accepted connections:', err);
      return err;
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const [pendingErr, acceptedErr] = await Promise.all([loadPendingRequests(), loadAcceptedConnections()]);
    if (pendingErr || acceptedErr) {
      setLoadError(t('connections.load_error'));
    }
    setLoading(false);
  }, [loadPendingRequests, loadAcceptedConnections, t]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="bg-background min-h-screen">
      <SEO title={t('connections.seo_title')} description={t('connections.seo_desc')} />
      <AppleHeader 
        title={t('connections.title')} 
        subtitle={t('connections.subtitle')}
        badge={<span className="px-3 py-1 text-xs font-semibold rounded-none bg-primary/10 text-primary border border-primary/20">{t('connections.badge')}</span>}
      />

      <div className="flex items-center border-b border-border pb-4">
        <button
          onClick={() => setActiveTab('requests')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-300 rounded-none",
            activeTab === 'requests'
              ? "bg-card text-primary shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          )}
        >
          <UserPlus size={16} />
          {t('connections.tab_requests')}
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-300 rounded-none ml-4",
            activeTab === 'connections'
              ? "bg-card text-primary shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          )}
        >
          <Mail size={16} />
          {t('connections.tab_connections')}
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
              <h3 className="font-semibold text-foreground">{t('connections.error_title')}</h3>
              <p className="text-muted-foreground mt-1">{loadError}</p>
              <Button
                onClick={loadAll}
                className="mt-6"
              >
                {t('connections.error_try_again')}
              </Button>
            </div>
          ) : pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <ConnectionRequestCard
                  key={request._id}
                  request={request}
                  onUpdate={() => {
                    loadPendingRequests();
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserPlus size={48} className="mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="font-semibold text-foreground">{t('connections.no_requests_title')}</h3>
              <p className="text-muted-foreground">
                {t('connections.no_requests_desc')}
              </p>
              <Button
                onClick={() => navigate('/tutors')}
                className="mt-6"
              >
                {t('connections.browse_tutors')}
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="p-6 space-y-6">
          <ConnectionsList />
          {acceptedConnections.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">{t('connections.manage_title')}</h2>
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

export default ConnectionsPage;
