import { useState } from 'react';
import { X, Loader2, Calendar } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const SessionLogModal = ({ connectionId, isOpen, onClose, onLogged }) => {
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [topicsCovered, setTopicsCovered] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledAt) {
      toast.error('Please select a date');
      return;
    }
    if (!durationMinutes || Number(durationMinutes) < 1) {
      toast.error('Please enter a valid duration');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/api/connections/${connectionId}/sessions`, {
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes),
        topicsCovered: topicsCovered.trim()
      });
      toast.success('Session logged — student has 24hr to confirm');
      onLogged?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to log session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground">Log Session</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Record a completed tutoring session</p>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Session Date <span className="text-destructive">*</span></label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Duration (minutes) <span className="text-destructive">*</span></label>
            <input
              type="number"
              value={durationMinutes}
              onChange={e => setDurationMinutes(e.target.value)}
              min={1}
              max={480}
              placeholder="e.g. 60"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Topics Covered</label>
            <textarea
              value={topicsCovered}
              onChange={e => setTopicsCovered(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="What was covered in this session?"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="text-xs text-muted-foreground text-right mt-1">{topicsCovered.length}/1000</div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting && <Loader2 className="size-4 animate-spin mr-2" />}
              {submitting ? 'Logging...' : 'Log Session'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionLogModal;
