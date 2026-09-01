import { Check, Circle } from 'lucide-react';
import { cn } from "@/lib/utils";

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  let score = 0;
  const checks = {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  if (checks.length) score++;
  if (checks.letter) score++;
  if (checks.number) score++;

  const strength = score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong';
  const colors = {
    weak: { bar: 'bg-destructive', text: 'text-destructive', label: 'Weak' },
    medium: { bar: 'bg-warning', text: 'text-warning', label: 'Fair' },
    strong: { bar: 'bg-success', text: 'text-success', label: 'Strong' },
  };
  const { bar, text, label } = colors[strength];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        <div className={cn("h-1 flex-1 rounded-full transition-colors", score >= 1 ? bar : "bg-muted")} />
        <div className={cn("h-1 flex-1 rounded-full transition-colors", score >= 2 ? bar : "bg-muted")} />
        <div className={cn("h-1 flex-1 rounded-full transition-colors", score >= 3 ? bar : "bg-muted")} />
      </div>
      <div className="flex items-center justify-between">
        <span className={cn("text-[11px] font-medium", text)}>{label}</span>
        <span className="text-[11px] text-muted-foreground">{password.length}/8 chars</span>
      </div>
      <div className="flex gap-3 text-[11px]">
        <span className={`flex items-center gap-1 ${checks.length ? "text-success" : "text-muted-foreground"}`}>
          {checks.length ? <Check size={12} className="text-success" /> : <Circle size={12} />} 8+ chars
        </span>
        <span className={`flex items-center gap-1 ${checks.letter ? "text-success" : "text-muted-foreground"}`}>
          {checks.letter ? <Check size={12} className="text-success" /> : <Circle size={12} />} Letter
        </span>
        <span className={`flex items-center gap-1 ${checks.number ? "text-success" : "text-muted-foreground"}`}>
          {checks.number ? <Check size={12} className="text-success" /> : <Circle size={12} />} Number
        </span>
      </div>
    </div>
  );
};

export default PasswordStrength;
