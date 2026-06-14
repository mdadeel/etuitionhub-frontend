import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "100%", label: "Verified Profiles", sub: "Document & background verified" },
  { value: "0৳", label: "Agent Commission", sub: "Zero middleman fees" },
  { value: "Direct", sub: "Contact tutors directly" },
];

const MissionStatement = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const statsRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(contentRef.current,
            { opacity: 0, x: -60 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
          );
          gsap.fromTo(statsRef.current,
            { opacity: 0, x: 60 },
            { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
          );
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-br from-background via-primary/[0.02] to-background py-20 md:py-28">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={contentRef} className="space-y-8">
            <div>
              <span className="text-xs font-medium text-primary/70 uppercase tracking-[0.18em]">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95] mt-4">
                We're not another tutoring marketplace.
                <span className="text-primary block mt-2">We're built on trust.</span>
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed flex items-start gap-4">
                <ShieldCheck className="size-5 text-primary shrink-0 mt-1" />
                <span>
                  We built this because finding a good teacher in Bangladesh shouldn't feel like gambling.
                  The current system is broken - filled with fake credentials and middleman fees.
                </span>
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed flex items-start gap-4">
                <MessageCircle className="size-5 text-accent shrink-0 mt-1" />
                <span>
                  Every profile on our platform is verified, every fee is transparent, and every parent can speak directly to the tutor.
                  No agents, no guesswork.
                </span>
              </p>
            </div>
          </div>

          <div ref={statsRef} className="relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/[0.04] to-accent/[0.02] rounded-[40px] blur-sm pointer-events-none" />
            <div className="relative divide-y divide-border/40">
              {stats.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-6 first:pt-0 last:pb-0">
                  <div>
                    <span className="text-3xl md:text-4xl font-heading text-foreground tracking-tight">
                      {item.value}
                    </span>
                    {item.label && (
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-medium">
                        {item.label}
                      </p>
                    )}
                  </div>
                  {item.sub && (
                    <span className="text-xs md:text-sm text-muted-foreground/60 text-right max-w-[180px] leading-relaxed">
                      {item.sub}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionStatement;
