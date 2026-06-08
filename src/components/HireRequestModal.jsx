import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const HireRequestModal = ({ tuition, tutorId, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [preferredTime, setPreferredTime] = useState('');
  const [proposedRate, setProposedRate] = useState(tuition?.salary || '');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

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
      toast.success('Request sent — tutor has 48 hours to respond');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground">Request Tutor</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tuition?.subject ? `For ${tuition.subject}` : 'Send a tutoring request'}
            </p>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
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

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-4 mr-2" />}
              {submitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HireRequestModal;
