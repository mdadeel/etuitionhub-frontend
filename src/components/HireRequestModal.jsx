import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const HireRequestModal = ({ tuition, tutorId, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [preferredTime, setPreferredTime] = useState('');
  const [proposedRate, setProposedRate] = useState(tuition?.salary || '');
  const [submitting, setSubmitting] = useState(false);

  // Restore draft from sessionStorage on mount/open
  useEffect(() => {
    if (!isOpen) return;
    try {
      const savedDraft = sessionStorage.getItem('draft_hire_request');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.tutorId === tutorId || parsed.tuitionId === tuition?._id) {
          if (parsed.message) setMessage(parsed.message);
          if (Array.isArray(parsed.selectedDays)) setSelectedDays(parsed.selectedDays);
          if (parsed.preferredTime) setPreferredTime(parsed.preferredTime);
          if (parsed.proposedRate) setProposedRate(parsed.proposedRate);
        }
      }
    } catch {
      // Ignore sessionStorage read errors
    }
  }, [isOpen, tutorId, tuition?._id]);

  // Persist draft changes
  useEffect(() => {
    if (message || selectedDays.length > 0 || preferredTime || proposedRate) {
      sessionStorage.setItem('draft_hire_request', JSON.stringify({
        tutorId,
        tuitionId: tuition?._id,
        message,
        selectedDays,
        preferredTime,
        proposedRate
      }));
    }
  }, [message, selectedDays, preferredTime, proposedRate, tutorId, tuition?._id]);

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please write a message');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/api/hire-requests', {
        toUserId: tutorId || tuition?.poster?.userId,
        tuitionPostId: tuition?._id || null,
        message: message.trim(),
        proposedSchedule: {
          days: selectedDays,
          preferredTime
        },
        proposedRate: proposedRate ? Number(proposedRate) : undefined
      });
      sessionStorage.removeItem('draft_hire_request');
      toast.success('Request sent — tutor has 48 hours to respond');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Tutor</DialogTitle>
          <DialogDescription>
            {tuition?.subject ? `For ${tuition.subject}` : 'Send a tutoring request'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Message <span className="text-destructive">*</span></label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Describe what you're looking for in a tutor..."
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="text-xs text-muted-foreground text-right mt-1">{message.length}/500</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    selectedDays.includes(day)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/30'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Time</label>
            <input
              type="text"
              value={preferredTime}
              onChange={e => setPreferredTime(e.target.value)}
              placeholder="e.g. After 4 PM, Weekend mornings"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Proposed Rate (BDT/month)</label>
            <input
              type="number"
              value={proposedRate}
              onChange={e => setProposedRate(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-4 mr-2" />}
              {submitting ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HireRequestModal;
