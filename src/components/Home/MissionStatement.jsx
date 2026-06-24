import { ShieldCheck, MessageCircle } from 'lucide-react';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const stats = [
  { value: "100%", label: "Verified Profiles", sub: "Document & background verified" },
  { value: "0৳", label: "Agent Commission", sub: "Zero middleman fees" },
  { value: "Direct", sub: "Contact tutors directly" },
];

const MissionStatement = () => {
  const contentRef = useAnimateOnScroll();
  const statsRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/[0.02] to-background py-20 md:py-28">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={contentRef} className="animate-in-left space-y-8">
            <div>
              <span className="text-xs font-medium text-primary/70 uppercase tracking-[0.18em]">
                Our Mission
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-foreground tracking-tight leading-[1.05] mt-2 max-w-xl text-wrap-balance">
                Every student deserves access to great tutoring
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
              We're building Bangladesh's most trusted tutoring marketplace. Our mission is to connect parents with verified, qualified tutors — without the hassle of agencies, hidden fees, or fake profiles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground block">100% Verified</span>
                  <span className="text-[11px] text-muted-foreground">Tutors manually checked</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30">
                <div className="size-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <MessageCircle size={18} className="text-accent-foreground" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground block">Direct Contact</span>
                  <span className="text-[11px] text-muted-foreground">No middlemen involved</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={statsRef} className="animate-in-right space-y-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="group relative p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-card/60">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl md:text-3xl font-heading text-foreground tracking-tight block">
                      {stat.value}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground/70 text-right max-w-[180px] leading-snug">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionStatement;
