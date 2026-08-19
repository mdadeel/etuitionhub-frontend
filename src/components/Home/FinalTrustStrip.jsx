import { ShieldCheck, MessageCircle } from 'lucide-react';

const trustItems = [
  { icon: ShieldCheck, label: 'Verified', description: 'All tutors verified by our team' },
  { icon: MessageCircle, label: 'Direct contact', description: 'Message tutors directly, no middlemen' },
];

const FinalTrustStrip = () => {
  return (
    <section className="border-t border-border/40 bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm">
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="size-4 text-primary" />
              </div>
              <div>
                <span className="font-semibold text-foreground">{item.label}</span>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalTrustStrip;
