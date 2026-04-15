/**
 * HowItWorks Component
 * Technical Emerald Minimalism Refactor
 */
const HowItWorks = () => {
    const steps = [
        {
            title: "DISCOVERY",
            description: "Locate exact expertise using our high-signal discovery tools."
        },
        {
            title: "VERIFICATION",
            description: "Analyze verified profiles and establish contact with top talent."
        },
        {
            title: "COMMENCEMENT",
            description: "Begin structured, result-oriented learning sessions anywhere."
        }
    ];

    return (
        <section className="py-32 bg-background border-b border-border relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="mb-24 max-w-2xl">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">The Pipeline</span>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground uppercase leading-[0.9] mb-8">
                        Engineered <br />
                        <span className="text-muted-foreground">Expert Matching</span>
                    </h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground leading-relaxed">
                        We have eliminated the noise, leaving only the essential steps to connect you with the right specialist.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-32">
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col group">
                            <div className="text-8xl font-black text-muted tracking-tighter mb-8 group-hover:text-primary/10 transition-colors duration-500 tabular-nums">
                                0{i + 1}
                            </div>
                            <h3 className="text-lg font-black text-foreground mb-4 uppercase tracking-[0.15em]">
                                {step.title}
                            </h3>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-muted/30 -skew-x-12 translate-x-1/2 z-0 pointer-events-none"></div>
        </section>
    );
};

export default HowItWorks;
