import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const REASONS = [
  { value: 'no_payment',   label: 'No payment received' },
  { value: 'mutual',       label: 'Mutual agreement' },
  { value: 'incompatible', label: 'Schedule/personality mismatch' },
  { value: 'other',        label: 'Other' }
];

const CancelConnectionDialog = ({ open, onClose, connectionId, onCancelled }) => {
  const [reason, setReason] = useState('no_payment');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/api/connections/${connectionId}/cancel`, { reason, note });
      toast.success('Connection cancelled');
      onCancelled?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-lg border border-border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Cancel connection</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-2">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-border rounded-md p-2 mb-3 bg-background text-foreground text-sm"
            required
          >
            {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <label className="block text-sm font-medium mb-2">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border border-border rounded-md p-2 mb-4 bg-background text-foreground text-sm"
            placeholder="Anything else the other party should know?"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md"
            >
              Keep connection
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {submitting ? 'Cancelling…' : 'Cancel connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelConnectionDialog;
