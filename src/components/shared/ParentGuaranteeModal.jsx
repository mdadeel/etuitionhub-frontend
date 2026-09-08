import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Lock, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const GUARANTEE_PILLARS = [
  {
    icon: CheckCircle2,
    title: 'Free 1st Demo Session',
    description: 'Evaluate tutor fit, curriculum familiarity, and teaching chemistry with zero upfront payment commitment.',
    tag: 'Zero Risk',
  },
  {
    icon: Lock,
    title: 'Escrow Payment Security',
    description: 'Tuition fees paid via bKash, Nagad, Rocket, or Bank are held safely in platform escrow and only disbursed after you confirm verified attendance.',
    tag: 'Protected Funds',
  },
  {
    icon: RefreshCw,
    title: '100% Replacement or Refund',
    description: "If a tutor doesn't meet expectations during the trial period, our academic team assigns an immediate replacement or issues a full refund.",
    tag: 'Guaranteed Fit',
  },
];

const ParentGuaranteeModal = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    onOpenChange?.(false);
    navigate('/tutors');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-card border-border">
        {/* Header banner */}
        <div className="bg-primary/10 border-b border-primary/20 p-6 flex items-start gap-4">
          <div className="size-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-primary">
            <ShieldCheck size={26} strokeWidth={2.2} />
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary mb-1.5">
              Parent Peace of Mind
            </span>
            <DialogTitle className="text-xl font-heading font-bold text-foreground">
              The eTuitionBD Parent Guarantee
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Finding the right tutor for your child shouldn't feel like a gamble. Every tuition arranged through our platform is protected end-to-end.
            </DialogDescription>
          </div>
        </div>

        {/* Pillars List */}
        <div className="p-6 space-y-4">
          {GUARANTEE_PILLARS.map(({ icon: Icon, title, description, tag }) => (
            <div
              key={title}
              className="flex items-start gap-3.5 p-3.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/30 transition-colors"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-heading font-semibold text-foreground">{title}</h4>
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider shrink-0 bg-primary/10 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-muted/40 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Backed by manual MFS verification & verified tutor credentials.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange?.(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleExplore}
              className="gap-1.5"
            >
              <span>Find Verified Tutors</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParentGuaranteeModal;
