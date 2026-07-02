import { Star, ShieldCheck, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import api from '../../services/api';
import TestimonialVideo from './TestimonialVideo';

const avatarColors = [
  'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'bg-amber-500/10 text-amber-600 border-amber-500/20',
];

const testimonialIcons = [Star, ShieldCheck, Award];

const MOCK_TESTIMONIALS = [
  {
    _id: "mock-1",
    name: "Farhana Rahman",
    role: "Parent",
    school: "Viqarunnisa Noon School",
    rating: 5,
    quote: "Finding a qualified physics tutor for my daughter in HSC was so stressful. Through this platform, we connected with a brilliant teacher from BUET. Her grades improved from B to A+ in months!",
  },
  {
    _id: "mock-2",
    name: "Sajid Mahmud",
    role: "HSC Student",
    school: "Notre Dame College",
    rating: 5,
    quote: "I was struggling with math concepts for university admission prep. The tutor I found here is incredibly patient and explains complex calculus problems using real-world examples. Highly recommended!",
  },
  {
    _id: "mock-3",
    name: "Dr. Imtiaz Ahmed",
    role: "Parent",
    school: "Scholastica",
    rating: 5,
    quote: "Excellent experience. The platform made it simple to find an experienced English medium tutor for my son. The direct messaging and verified credential checks give absolute peace of mind.",
  }
];

const Testimonials = () => {
  const headingRef = useAnimateOnScroll();
  const listRef = useAnimateOnScroll();

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials', 'featured'],
    queryFn: async () => {
      const res = await api.get('/api/testimonials/featured?limit=3');
      const raw = res.data?.data || res.data?.testimonials || res.data || [];
      return Array.isArray(raw) ? raw.slice(0, 3) : [];
    },
    staleTime: 120_000,
  });

  const items = data && data.length > 0 ? data : MOCK_TESTIMONIALS;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/[0.01] to-background py-16 md:py-24">
      {/* Large quote marks — meaningful framing for testimonials */}
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="absolute top-12 left-[3%] size-28 text-primary/[0.05] dark:text-primary/[0.02] z-0 pointer-events-none select-none">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="absolute bottom-16 right-[3%] size-28 text-primary/[0.05] dark:text-primary/[0.02] z-0 rotate-180 pointer-events-none select-none">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="animate-in-up text-center mb-16">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Testimonials</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold tracking-tight text-foreground mt-2 text-wrap-balance">
            Real outcomes from real families
          </h2>
          <p className="text-sm text-muted-foreground mt-2">Hear from students and parents who found perfect tutors</p>
        </div>

        <div ref={listRef} className="animate-in-up animate-stagger">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-[20px] border border-border/50 bg-card/50">
                  <div className="space-y-3 animate-pulse">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="size-3 rounded bg-muted" />
                      ))}
                    </div>
                    <div className="h-16 bg-muted rounded" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {items.slice(0, 3).map((t, idx) => {
                if (idx === 1) return null;
                const Icon = testimonialIcons[idx];
                const color = avatarColors[idx] || avatarColors[0];
                const name = t.name || 'Anonymous';
                const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const role = t.role || 'Parent';
                const school = t.school || '';
                const rating = t.rating || 5;

                return (
                  <div key={t._id || idx} className="animate-in-up-child relative p-6 rounded-[20px] border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-premium-md hover:border-primary/20 transition-all duration-300 group flex flex-col justify-between min-h-[250px] z-10">
                    <div className="absolute top-4 right-4 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity">
                      <Icon size={36} />
                    </div>

                    <div>
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed italic mb-6">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="border-t border-border/40 pt-4 flex items-center gap-3">
                      <Avatar className={`size-10 rounded-full border ${color}`}>
                        <AvatarFallback className="font-bold text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-bold text-foreground leading-tight">{name}</p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5" title={school}>
                          {role}{school ? ` · ${school}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Video Testimonial Spotlit Card */}
              {items.length >= 2 && (
                <div className="relative p-1.5 rounded-[22px] bg-gradient-to-br from-primary/20 to-accent/20 shadow-xl ring-4 ring-primary/10 overflow-hidden transform lg:scale-105 transition-all duration-300 z-10">
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full z-20 shadow-sm animate-pulse">
                    Video Spotlight
                  </div>
                  <TestimonialVideo videoUrl={items[1]?.videoURL} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
