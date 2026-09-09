import { useState, useEffect } from 'react';
import { Send, Loader2, ShieldCheck, Check } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const HireRequestModal = ({ 
  isOpen, 
  onClose, 
  tutor, 
  tutorId, 
  tutorName, 
  tuition,
  onSuccess,
  onOpenLogin
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [proposedRate, setProposedRate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const targetId = tutor?._id || tutorId || tuition?.poster?.userId;
  const displayName = tutor?.displayName || tutorName || tuition?.poster?.name || 'Tutor';
  const availableSubjects = Array.isArray(tutor?.subjects) 
    ? tutor.subjects 
    : (tuition?.subject ? [tuition.subject] : []);
  const defaultRate = tutor?.expectedSalary || tuition?.salary || '';

  // Restore draft from sessionStorage
  useEffect(() => {
    if (!isOpen) return;
    try {
      const savedDraft = sessionStorage.getItem('draft_hire_request');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.targetId === targetId) {
          if (parsed.message) setMessage(parsed.message);
          if (Array.isArray(parsed.selectedSubjects)) setSelectedSubjects(parsed.selectedSubjects);
          if (parsed.proposedRate) setProposedRate(parsed.proposedRate);
          if (parsed.preferredSlot) setPreferredSlot(parsed.preferredSlot);
          return;
        }
      }
    } catch {
      // Ignore sessionStorage read errors
    }

    // Default rate initialization
    if (defaultRate && !proposedRate) {
      setProposedRate(String(defaultRate));
    }
  }, [isOpen, targetId, defaultRate, proposedRate]);

  // Persist draft changes
  useEffect(() => {
    if (isOpen && (message || selectedSubjects.length > 0 || proposedRate || preferredSlot)) {
      sessionStorage.setItem('draft_hire_request', JSON.stringify({
        targetId,
        message,
        selectedSubjects,
        proposedRate,
        preferredSlot
      }));
    }
  }, [isOpen, message, selectedSubjects, proposedRate, preferredSlot, targetId]);

  const toggleSubject = (subj) => {
    setSelectedSubjects(prev =>
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onClose();
      if (onOpenLogin) onOpenLogin();
      else toast.error('Please sign in to send a hire request');
      return;
    }

    if (!message.trim()) {
      toast.error('Please describe your requirements and student details');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        toUserId: targetId,
        tuitionPostId: tuition?._id || null,
        message: message.trim(),
        proposedRate: proposedRate ? Number(proposedRate) : (defaultRate ? Number(defaultRate) : undefined),
        subjects: selectedSubjects.length > 0 ? selectedSubjects : (availableSubjects.slice(0, 1)),
        preferredSlot: preferredSlot.trim() || undefined
      };

      const res = await api.post('/api/hire-requests', payload);
      sessionStorage.removeItem('draft_hire_request');
      toast.success('Hire request sent! Tutor has 48 hours to respond.');
      
      if (onSuccess) {
        onSuccess(res.data?.data || payload);
      }
      onClose();
      setMessage('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send hire request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Request to Hire {displayName}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Send your learning requirements, student class, and budget. Zero upfront charge.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Subjects Selection (if available) */}
          {availableSubjects.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Subjects Needed ({selectedSubjects.length || 1} selected)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto custom-scrollbar p-1">
                {availableSubjects.map((subj) => {
                  const isSelected = selectedSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md border transition-all flex items-center gap-1",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isSelected && <Check size={12} />}
                      {subj}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message / Requirements */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Requirements &amp; Student Class <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Need HSC Physics tutor 3 days/week in Dhanmondi. Student is in English Version..."
              maxLength={500}
              className="w-full bg-background border border-border rounded-lg p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary resize-none leading-relaxed transition-colors"
            />
            <div className="text-[11px] text-muted-foreground text-right">{message.length}/500</div>
          </div>

          {/* Proposed Rate & Preferred Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Proposed Monthly Budget (BDT)
              </label>
              <input
                type="number"
                value={proposedRate}
                onChange={(e) => setProposedRate(e.target.value)}
                placeholder={defaultRate ? String(defaultRate) : "5000"}
                className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary transition-colors"
              />
              {defaultRate ? (
                <p className="text-[10px] text-muted-foreground">
                  Expected fee: ৳{Number(defaultRate).toLocaleString()}/mo
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Preferred Schedule / Time
              </label>
              <input
                type="text"
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value)}
                placeholder="e.g. Mon/Wed 4:00 PM"
                maxLength={60}
                className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* SafePay Escrow Guarantee Banner */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex items-start gap-2.5 text-xs">
            <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">SafePay™ Escrow Protection</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                First session is a 30-min evaluation demo. Tuition fees are held in safe escrow and released only after your confirmation.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting || !message.trim()} className="gap-2">
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send Hire Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HireRequestModal;
