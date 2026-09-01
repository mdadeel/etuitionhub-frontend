import { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';

const fmt = (mins) => {
  if (mins == null) return null;
  if (mins < 60) return `Usually replies within ${mins} min`;
  const h = Math.round(mins / 60);
  return `Usually replies within ${h} hour${h === 1 ? '' : 's'}`;
};

const ResponseTimeIndicator = ({ tutor }) => {
  const [activeRecently, setActiveRecently] = useState(false);

  useEffect(() => {
    if (!tutor?.lastActive) {
      setActiveRecently(false);
      return;
    }
    setActiveRecently(Date.now() - new Date(tutor.lastActive).getTime() < 24 * 3600 * 1000);
  }, [tutor?.lastActive]);

  const replyText = fmt(tutor?.responseTimeMinutes);

  if (!activeRecently && !replyText) return null;

  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      {activeRecently && (
        <span className="flex items-center gap-1">
          <Circle size={8} className="fill-emerald-500 text-success" /> Active recently
        </span>
      )}
      {replyText && <span>· {replyText}</span>}
    </div>
  );
};

export default ResponseTimeIndicator;
