import { User, Star, Quote } from 'lucide-react';
import { Card, Avatar, SectionHeader } from '@/components/ui';

const testimonials = [
    {
        text: "We tried three different coaching centers before finding a tutor here. The difference was night and day — my daughter went from failing physics to scoring 85 in her HSC. The direct contact with the tutor helped us track her progress ourselves.",
        name: "Fatima Rahman",
        role: "Parent",
        location: "Dhaka, Mirpur",
        rating: 5
    },
    {
        text: "Needed a tutor for my younger brother urgently before finals. Got connected within a day. The tutor was verified, which made us feel comfortable letting him teach online.",
        name: "Arif Hassan",
        role: "Student",
        location: "Chittagong",
        rating: 5
    },
    {
        text: "Better than traditional tutoring agencies — no hidden fees, you talk directly to the tutor before committing. Found someone who actually matched my learning style.",
        name: "Nusrat Jahan",
        role: "Student",
        location: "Sylhet",
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-background overflow-hidden relative border-b border-border/50">
            <div className="max-w-7xl mx-auto px-6">
                <SectionHeader
                    title={<>Stories from <span className="text-primary font-semibold">real families</span></>}
                    subtitle="Authentic experiences from parents and students who found their perfect tutor match through our platform."
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <div 
                            key={idx} 
                            className="opacity-0 animate-fade-in-up" 
                            style={{ 
                                animationDelay: `${200 + idx * 150}ms`,
                                animationFillMode: 'forwards'
                            }}
                        >
                            <Card hover className="p-8 h-full flex flex-col justify-between">
                                <div>
                                    <Quote className="w-8 h-8 text-primary/10 mb-6" />

                                    <div className="flex items-center gap-1 mb-5">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                                        ))}
                                    </div>

                                    <p className="text-[15px] text-muted-foreground leading-relaxed font-body mb-8 italic">
                                        "{t.text}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-6 border-t border-border/60">
                                    <Avatar size="md" alt={t.name}>
                                        <User className="w-5 h-5 text-muted-foreground" />
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-heading text-foreground mb-0.5">{t.name}</p>
                                        <p className="text-xs text-muted-foreground font-body">{t.role} · {t.location}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
