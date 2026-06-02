import { User, Star } from 'lucide-react';

const testimonials = [
    {
        id: "t1",
        text: "We tried three different coaching centers before finding a tutor here. The difference was night and day - my daughter went from failing physics to scoring 85 in her HSC.",
        name: "Fatima Rahman",
        role: "Parent",
        location: "Dhaka, Mirpur",
        rating: 5
    },
    {
        id: "t2",
        text: "Needed a tutor for my younger brother urgently before finals. Got connected within a day. The tutor was verified, which made us feel comfortable letting him teach online.",
        name: "Arif Hassan",
        role: "Student",
        location: "Chittagong",
        rating: 5
    },
    {
        id: "t3",
        text: "Better than traditional tutoring agencies - no hidden fees, you talk directly to the tutor before committing. Found someone who actually matched my learning style.",
        name: "Nusrat Jahan",
        role: "Student",
        location: "Sylhet",
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 animate-in fade-in zoom-in-95 duration-700 ease-out">
                    <h2 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tight mb-4">
                        Stories from <span className="text-primary">real families</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
                        Authentic experiences from parents and students who found their perfect tutor match through our platform.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="group flex flex-col p-8 bg-card border border-border/60 rounded-2xl hover:border-primary/30 hover:shadow-xl transition-all duration-300 active:scale-[0.98] cursor-default"
                        >
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={`${t.id}-star-${i}`} className="size-4 fill-amber-500 text-amber-500" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-base text-foreground leading-relaxed font-body mb-8 flex-1">
                                "{t.text}"
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                                <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                                    <User className="size-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground truncate">{t.name}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{t.role} {t.location && `• ${t.location}`}</p>
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
