import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ShieldCheck, Award } from 'lucide-react';

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
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95] text-wrap-balance">
            Stories from <span className="text-primary">real families</span>
          </h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full mt-12 md:mt-16">
          
          {/* Testimonial 1 */}
          <div className="testimonial-item break-inside-avoid mb-6 p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`size-3.5 ${i < testimonials[0].rating ? 'fill-amber-500 text-amber-500' : 'text-muted/20'}`} />
              ))}
            </div>
            <p className="text-sm md:text-base text-foreground leading-relaxed italic">
              "{testimonials[0].text}"
            </p>
            <div className="flex items-center gap-3 mt-2 pt-3 border-t border-border/10">
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs uppercase">
                {testimonials[0].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground leading-none">{testimonials[0].name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-none">{testimonials[0].role}{testimonials[0].location && ` · ${testimonials[0].location}`}</p>
              </div>
            </div>
          </div>

          {/* Reward Card 1 (Verification) */}
          <div className="testimonial-item break-inside-avoid mb-6 p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm shadow-sm flex flex-col gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground tracking-tight">100% Verified Profiles</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every tutor's national ID, university documents, and background checks are manually checked by our team.
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="testimonial-item break-inside-avoid mb-6 p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`size-3.5 ${i < testimonials[1].rating ? 'fill-amber-500 text-amber-500' : 'text-muted/20'}`} />
              ))}
            </div>
            <p className="text-sm md:text-base text-foreground leading-relaxed italic">
              "{testimonials[1].text}"
            </p>
            <div className="flex items-center gap-3 mt-2 pt-3 border-t border-border/10">
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs uppercase">
                {testimonials[1].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground leading-none">{testimonials[1].name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-none">{testimonials[1].role}{testimonials[1].location && ` · ${testimonials[1].location}`}</p>
              </div>
            </div>
          </div>

          {/* Reward Card 2 (Platform Rating) */}
          <div className="testimonial-item break-inside-avoid mb-6 p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm shadow-sm flex flex-col gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Award className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground tracking-tight">4.9/5 Parent Rating</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Direct feedback collected from thousands of parents across Dhaka, Chittagong, and Sylhet.
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="testimonial-item break-inside-avoid mb-6 p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`size-3.5 ${i < testimonials[2].rating ? 'fill-amber-500 text-amber-500' : 'text-muted/20'}`} />
              ))}
            </div>
            <p className="text-sm md:text-base text-foreground leading-relaxed italic">
              "{testimonials[2].text}"
            </p>
            <div className="flex items-center gap-3 mt-2 pt-3 border-t border-border/10">
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs uppercase">
                {testimonials[2].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground leading-none">{testimonials[2].name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-none">{testimonials[2].role}{testimonials[2].location && ` · ${testimonials[2].location}`}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
