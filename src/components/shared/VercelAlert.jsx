import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import API_URL from '../../config/api';

const VercelAlert = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const apiUrl = API_URL;
    const isVercel = apiUrl.includes('vercel');
    const dismissed = localStorage.getItem('vercelAlertDismissed');
    if (isVercel && !dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-warning/10 border-b border-warning/20 text-warning text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-start gap-3">
        <AlertTriangle size={18} className="shrink-0 mt-0.5 text-warning" />
        <p className="flex-1">
          This site is running on a <strong>free Vercel tier</strong>. Real-time features like chat,
          video sessions, and instant notifications are unavailable. Some data may reset after redeploys.
          Upgrade to a production server for full functionality.
        </p>
        <button
          onClick={() => {
            setVisible(false);
            localStorage.setItem('vercelAlertDismissed', 'true');
          }}
          className="shrink-0 p-1 rounded hover:bg-warning/20 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default VercelAlert;
