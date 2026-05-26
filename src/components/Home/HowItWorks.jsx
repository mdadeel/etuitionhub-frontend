import { Search, Star, Users } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "Find",
        description: "Search tutors by subject, class, and location with our simple search filters."
    },
    {
        icon: Star,
        title: "Compare",
        description: "Review profiles, ratings, and teaching experience to find the perfect teacher."
    },
    {
        icon: Users,
        title: "Connect",
        description: "Contact tutors directly through our platform and start learning immediately."
    }
];

const HowItWorks = () => {
    return (
        <section className="py-20 bg-background relative overflow-hidden border-b border-border">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-3xl md:text-4xl font-heading text-foreground tracking-tight leading-tight">
                        How It <span className="text-primary">Works</span>
                    </h2>
                    <p className="text-muted-foreground text-base font-body">Three simple steps to find your tutor.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div 
                            key={idx} 
                            className="relative flex flex-col items-center text-center p-8 bg-card border border-border/60 rounded hover:shadow-premium hover:border-primary/20 transition-all duration-300 opacity-0 animate-scale-in"
                            style={{ animationDelay: `${150 + idx * 100}ms` }}
                        >
                            {/* Step Number Badge */}
                            <div className="absolute top-4 left-4 w-8 h-8 bg-primary/10 border border-primary/20 text-primary rounded flex items-center justify-center font-heading text-xs">
                                0{idx + 1}
                            </div>

                            <div className="w-12 h-12 rounded bg-muted border border-border text-primary flex items-center justify-center mb-6 mt-4">
                                <step.icon size={22} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-foreground tracking-tight">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto font-body">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;