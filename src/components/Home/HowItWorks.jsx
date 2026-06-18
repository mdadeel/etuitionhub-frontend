import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Star, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Search,
    title: "Find",
    description: "Search tutors by subject, class, and location with our simple search filters.",
  },
  {
    icon: Star,
    title: "Compare",
    description: "Review profiles, ratings, and teaching experience to find the perfect teacher.",
  },
  {
    icon: Users,
    title: "Connect",
    description: "Contact tutors directly through our platform and start learning immediately.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          if (prefersReducedMotion) {
            gsap.set(headingRef.current, { opacity: 1, y: 0 });
            const items = gsap.utils.toArray('.step-item');
            gsap.set(items, { opacity: 1, y: 0 });
          } else {
            gsap.fromTo(headingRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
            );

            const items = gsap.utils.toArray('.step-item');
            gsap.fromTo(items,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.2 }
            );
          }
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95] text-wrap-balance">
            Three simple steps to find your perfect tutor
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
            No paperwork, no middlemen, just learning.
          </p>
        </div>

        {/* Mobile step indicator: dots showing progression - Hidden since all steps fit inline now */}
        <div className="hidden justify-center gap-2 mt-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className="size-2 rounded-full transition-colors"
              style={{
                backgroundColor: idx === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)',
              }}
            />
          ))}
        </div>

        <div ref={trackRef} className="relative">
          <div className="hidden md:block absolute top-16 left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-px bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 pointer-events-none" />

          <div className="grid grid-cols-3 gap-3 md:gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="step-item relative flex flex-col items-center text-center">
                <div className="relative mb-4 md:mb-8">
                  <span className="text-[60px] md:text-[160px] font-heading text-primary/[0.06] md:text-primary/[0.04] leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="size-12 md:size-20 rounded-full bg-primary/[0.06] border border-primary/10 flex items-center justify-center relative">
                    <step.icon className="size-5 md:size-8 text-primary" />
                  </div>
                </div>

                <h3 className="text-sm md:text-2xl font-heading text-foreground tracking-tight mb-1 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-[11px] md:text-base text-muted-foreground leading-normal md:leading-relaxed max-w-xs">
                  {step.description}
                </p>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-[calc(24px+1.5rem)] top-16 text-primary/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
