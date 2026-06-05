import { useState } from 'react';
import { Pause, CheckCircle2 } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ActivePanel = ({ connection, onPaused, onCompleted, onCancel }) => {
  const [submitting, setSubmitting] = useState(false);
  const [showPauseReason, setShowPauseReason] = useState(false);
  const [pauseReason, setPauseReason] = useState('');

  const handlePause = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/api/connections/${connection._id}/pause`, { reason: pauseReason });
      toast.success('Tutoring paused');
      onPaused?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to pause');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await api.put(`/api/connections/${connection._id}/complete`);
      toast.success('Tutoring completed');
      onCompleted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-emerald-700 font-medium">
        ✓ Tutoring is {connection.relationshipStatus}
      </p>
      {connection.firstSessionAt && (
        <p className="text-xs text-muted-foreground">
          First session: {new Date(connection.firstSessionAt).toLocaleString()}
        </p>
      )}
      <div className="flex gap-2 flex-wrap">
        {['scheduled','active'].includes(connection.relationshipStatus) && (
          <button
            type="button"
            onClick={() => setShowPauseReason(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-violet-300 text-violet-700 rounded-md hover:bg-violet-50"
          >
            <Pause size={12} /> Pause
          </button>
        )}
        {connection.relationshipStatus === 'active' && (
          <button
            type="button"
            onClick={handleComplete}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <CheckCircle2 size={12} /> Mark complete
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md"
        >
          Cancel relationship
        </button>
      </div>
      {showPauseReason && (
        <form onSubmit={handlePause} className="border border-border rounded-md p-3 space-y-2">
          <input
            type="text" value={pauseReason} onChange={(e) => setPauseReason(e.target.value)}
            placeholder="Reason for pausing"
            className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="px-3 py-1.5 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700">Confirm pause</button>
            <button type="button" onClick={() => setShowPauseReason(false)} className="px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-md">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ActivePanel;
