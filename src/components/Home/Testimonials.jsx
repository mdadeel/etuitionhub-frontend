import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

const Testimonials = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          if (prefersReducedMotion) {
            gsap.set(headingRef.current, { opacity: 1, y: 0 });
            const items = gsap.utils.toArray('.testimonial-item');
            gsap.set(items, { opacity: 1, y: 0 });
          } else {
            gsap.fromTo(headingRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
            );
            const items = gsap.utils.toArray('.testimonial-item');
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
    <section ref={sectionRef} className="relative overflow-hidden py-20 md:py-28 bg-background">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95] text-wrap-balance">
            Stories from <span className="text-primary">real families</span>
          </h2>
        </div>

        <div className="divide-y divide-border/20">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-item grid md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 first:pt-0 last:pb-0">
              <div className={`md:col-span-4 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-500 text-amber-500" />
                    ))}
                    {t.rating < 5 && (
                      <span className="text-xs text-muted-foreground ml-1">{t.rating}/5</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}{t.location && ` · ${t.location}`}</p>
                  </div>
                </div>
              </div>
              <div className={`md:col-span-8 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="relative pl-0 md:pl-4">
                  <div className="absolute top-0 left-[-8px] md:left-0 w-[2px] h-full bg-gradient-to-b from-primary/30 via-accent/20 to-transparent" />
                  <p className="text-base md:text-lg text-foreground leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
