import { Star, ShieldCheck, Award } from 'lucide-react';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const testimonials = [
  {
    text: "We tried three different coaching centers before finding a tutor here. The difference was night and day — my daughter went from failing physics to scoring 85 in her HSC.",
    name: "Fatima Rahman",
    role: "Parent",
    location: "Dhaka, Mirpur",
    rating: 5,
  },
  {
    text: "Needed a tutor for my younger brother urgently before finals. Got connected within a day. The tutor was verified, which made us feel comfortable letting him teach online.",
    name: "Arif Hassan",
    role: "Student",
    location: "Chittagong",
    rating: 4,
  },
  {
    text: "Better than traditional tutoring agencies — no hidden fees, you talk directly to the tutor before committing. Found someone who actually matched my learning style.",
    name: "Nusrat Jahan",
    role: "Student",
    location: "Sylhet",
    rating: 5,
  },
];

const testimonialIcons = [Star, ShieldCheck, Award];

const Testimonials = () => {
  const headingRef = useAnimateOnScroll();
  const listRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/[0.02] to-background py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,hsl(var(--primary)/0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="animate-in-up text-center mb-16">
          <span className="text-xs font-medium text-primary/70 uppercase tracking-[0.18em]">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95] mt-2 text-wrap-balance">
            Real results from real families
          </h2>
        </div>

        <div ref={listRef} className="animate-in-up animate-stagger grid md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((t, idx) => {
            const Icon = testimonialIcons[idx];
            return (
              <div key={idx} className="animate-in-up-child relative p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
                <div className="absolute -top-2 -right-2 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity">
                  <Icon size={48} />
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic font-light tracking-wide">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="border-t border-border/20 pt-4 mt-auto">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{t.role}</span>
                    <span className="text-[10px] text-muted-foreground/40">·</span>
                    <span className="text-[11px] text-muted-foreground">{t.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
