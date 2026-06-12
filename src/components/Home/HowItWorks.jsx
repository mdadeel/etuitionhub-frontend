import { Search, Star, Users } from 'lucide-react';

const steps = [
    {
        id: "step1",
        icon: Search,
        title: "Find",
        description: "Search tutors by subject, class, and location with our simple search filters."
    },
    {
        id: "step2",
        icon: Star,
        title: "Compare",
        description: "Review profiles, ratings, and teaching experience to find the perfect teacher."
    },
    {
        id: "step3",
        icon: Users,
        title: "Connect",
        description: "Contact tutors directly through our platform and start learning immediately."
    }
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden border-b border-border/50">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-24 space-y-4 animate-in fade-in zoom-in-95 duration-700 ease-out">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full">
                        <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-xs font-bold text-primary tracking-widest uppercase">How It Works</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tight mb-4">
                        How It <span className="text-primary">Works</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body leading-relaxed">
                        Three simple steps to find your perfect tutor. No paperwork, no middlemen, just learning.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {steps.map((step, idx) => (
                        <div
                            key={step.id}
                            className="relative group animate-in fade-in zoom-in-95 duration-700 ease-out"
                            style={{ animationDelay: `${150 + idx * 150}ms` }}
                        >
                            <div className="relative bg-card/40 border border-border/40 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                                {/* Top gradient line on hover */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Step Number - Gradient Circle */}
                                <div className="w-13 h-13 rounded-full mb-6 flex items-center justify-center font-heading text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25"
                                    style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))' }}
                                >
                                    {idx + 1}
                                </div>

                                {/* Icon */}
                                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <step.icon size={24} />
                                </div>

                                {/* Content */}
                                <div className="space-y-3 relative z-10">
                                    <h3 className="text-2xl font-heading font-black text-foreground tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-base text-muted-foreground leading-relaxed font-body">
                                        {step.description}
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

export default HowItWorks;
