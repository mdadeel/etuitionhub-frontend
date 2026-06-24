import { Star, ShieldCheck, Award } from 'lucide-react';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    text: "We tried three different coaching centers before finding a physics tutor here. My daughter went from failing to scoring GPA 5.00 in her HSC exam!",
    name: "Fatima Rahman",
    role: "Parent",
    school: "Viqarunnisa Noon School & College",
    location: "Dhaka",
    rating: 5,
    avatarColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    text: "Needed a chemistry tutor urgently before finals. Got connected with a verified tutor within 24 hours. The direct contact saved us so much time.",
    name: "Arif Hassan",
    role: "Student",
    school: "Notre Dame College, Dhaka",
    location: "Dhaka",
    rating: 5,
    avatarColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    text: "No hidden agency fees and direct communication. I found an ICT tutor who matches my learning pace perfectly. Highly recommended!",
    name: "Nusrat Jahan",
    role: "Student",
    school: "Chittagong College",
    location: "Chittagong",
    rating: 5,
    avatarColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
];

const testimonialIcons = [Star, ShieldCheck, Award];

const Testimonials = () => {
  const headingRef = useAnimateOnScroll();
  const listRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/[0.01] to-background py-16 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,hsl(var(--primary)/0.03)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="animate-in-up text-center mb-12">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Testimonials</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold tracking-tight text-foreground mt-2 text-wrap-balance">
            Real outcomes from real families
          </h2>
          <p className="text-sm text-muted-foreground mt-2">Hear from students and parents who found perfect tutors</p>
        </div>

        <div ref={listRef} className="animate-in-up animate-stagger grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => {
            const Icon = testimonialIcons[idx];
            return (
              <div key={idx} className="animate-in-up-child relative p-6 rounded-[20px] border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-premium-md hover:border-primary/20 transition-all duration-300 group flex flex-col justify-between">
                <div className="absolute top-4 right-4 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity">
                  <Icon size={36} />
                </div>
                
                <div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed italic mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="border-t border-border/40 pt-4 flex items-center gap-3">
                  <Avatar className={`size-10 rounded-full border ${t.avatarColor}`}>
                    <AvatarFallback className="font-bold text-xs">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-bold text-foreground leading-tight">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5" title={t.school}>
                      {t.role} · {t.school}
                    </p>
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
