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
    weak: { bar: 'bg-red-500', text: 'text-red-500', label: 'Weak' },
    medium: { bar: 'bg-orange-500', text: 'text-orange-500', label: 'Fair' },
    strong: { bar: 'bg-green-500', text: 'text-green-500', label: 'Strong' },
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
        <span className={cn("text-[10px] font-medium", text)}>{label}</span>
        <span className="text-[10px] text-muted-foreground">{password.length}/8 chars</span>
      </div>
      <div className="flex gap-3 text-[10px]">
        <span className={checks.length ? "text-green-500" : "text-muted-foreground"}>
          {checks.length ? "✓" : "○"} 8+ chars
        </span>
        <span className={checks.letter ? "text-green-500" : "text-muted-foreground"}>
          {checks.letter ? "✓" : "○"} Letter
        </span>
        <span className={checks.number ? "text-green-500" : "text-muted-foreground"}>
          {checks.number ? "✓" : "○"} Number
        </span>
      </div>
    </div>
  );
};

export default PasswordStrength;
