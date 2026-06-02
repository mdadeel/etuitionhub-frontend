import { CheckCircle, ShieldCheck, MessageCircle } from 'lucide-react';

const MissionStatement = () => {
    return (
        <section className="py-12 md:py-16 bg-card relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Content Side */}
                    <div className="space-y-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
                            <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-xs font-medium text-primary uppercase tracking-wider">Our Mission</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-foreground tracking-tight leading-tight">
                            We're not another tutoring marketplace. <br />
                            <span className="text-primary">We're built on trust.</span>
                        </h2>

                        <div className="space-y-3">
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex items-start gap-3">
                                <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                                <span>
                                    We built this because finding a good teacher in Bangladesh shouldn't feel like gambling.
                                    The current system is broken - filled with fake credentials and middleman fees.
                                </span>
                            </p>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex items-start gap-3">
                                <MessageCircle className="size-5 text-accent shrink-0 mt-0.5" />
                                <span>
                                    Every profile on our platform is verified, every fee is transparent, and every parent can speak directly to the tutor.
                                    No agents, no guesswork.
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Stats Side - Compact Card */}
                    <div className="bg-gradient-to-br from-background to-card/50 border border-border/60 rounded-2xl p-6 md:p-8 shadow-premium-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="grid grid-cols-3 gap-6 text-center">
                            {[
                                { value: "100%", label: "Verified", icon: CheckCircle, sub: "Profiles" },
                                { value: "0৳", label: "Agent", icon: ShieldCheck, sub: "Commission" },
                                { value: "Direct", label: "Contact", icon: MessageCircle, sub: "" }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="size-10 mx-auto bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-2">
                                        <item.icon size={20} />
                                    </div>
                                    <div className="text-lg md:text-xl font-heading text-foreground tracking-tight">{item.value}</div>
                                    <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</div>
                                    {item.sub && <div className="text-[9px] text-muted-foreground/70">{item.sub}</div>}
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
