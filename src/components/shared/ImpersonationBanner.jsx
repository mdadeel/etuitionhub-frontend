import { useState, useEffect } from 'react';
import { ShieldAlert, LogOut, Loader2, Eye } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

/**
 * ImpersonationBanner — persistent top banner rendered whenever a Super Admin
 * is viewing the application in shadow/impersonation mode.
 */
export default function ImpersonationBanner() {
  const [session, setSession] = useState(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const raw = localStorage.getItem('impersonator-session');
      if (raw) {
        try {
          setSession(JSON.parse(raw));
        } catch {
          setSession(null);
        }
      } else {
        setSession(null);
      }
    };

    checkSession();
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  if (!session) return null;

  const handleExit = async () => {
    setExiting(true);
    try {
      const res = await api.post('/api/admin/impersonate/exit');
      localStorage.removeItem('impersonator-session');
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      } else if (session.adminToken) {
        localStorage.setItem('token', session.adminToken);
      }
      toast.success('Exited shadow login mode');
      window.location.href = '/super-admin/users';
    } catch {
      if (session.adminToken) {
        localStorage.setItem('token', session.adminToken);
      }
      localStorage.removeItem('impersonator-session');
      toast.success('Restored Super Admin session');
      window.location.href = '/super-admin/users';
    } finally {
      setExiting(false);
    }
  };

  return (
    <div className="sticky top-0 z-[99999] w-full bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between border-b border-amber-600/30">
      <div className="flex items-center gap-2 max-w-[80%] truncate">
        <Eye className="w-4 h-4 shrink-0 animate-pulse text-amber-950" />
        <span className="font-bold uppercase tracking-wider bg-amber-600/20 px-1.5 py-0.5 rounded text-[10px]">
          Shadow Mode
        </span>
        <span className="truncate">
          Viewing as <strong className="underline">{session.targetName || session.targetEmail}</strong> ({session.targetRole || 'User'}) — All actions are audited.
        </span>
      </div>
      <button
        onClick={handleExit}
        disabled={exiting}
        className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950 text-amber-50 font-bold hover:bg-black transition-colors disabled:opacity-50 shrink-0 ml-2"
        title="Exit shadow mode and restore Super Admin session"
      >
        {exiting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <LogOut className="w-3.5 h-3.5" />
        )}
        <span>Exit Shadow Mode</span>
      </button>
    </div>
  );
}
