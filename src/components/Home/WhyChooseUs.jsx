import { ShieldCheck, Banknote, Clock, Star, Zap } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: ShieldCheck,
        title: "VERIFIED EXPERTISE",
        description: "Every tutor undergoes a rigorous vetting process before platform inclusion."
    },
    {
        icon: Banknote,
        title: "TRANSPARENT RATES",
        description: "Clear, upfront pricing structures with zero hidden administrative fees."
    },
    { 
        icon: Clock, 
        title: "TEMPORAL FLEXIBILITY", 
        description: "Schedule sessions around your specific availability and time constraints." 
    },
    {
        icon: Zap,
        title: "HIGH-SIGNAL MATCH",
        description: "Advanced filtering to connect you with the precise expertise required."
    }
];

/**
 * WhyChooseUs Component
 * Technical Emerald Minimalism Refactor
 */
function WhyChooseUs() {
    return (
        <section className="py-32 bg-background border-b border-border">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="mb-24 text-center">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">Values</span>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground uppercase leading-[0.9]">
                        Operational <br />
                        <span className="text-muted-foreground">Excellence</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-border">
                    {features.map((feature, idx) => (
                        <div key={idx} className="p-12 border-r border-b border-border hover:bg-muted/50 transition-colors group">
                            <div className="mb-8 p-3 w-fit border border-border bg-muted group-hover:border-primary/50 transition-colors">
                                <feature.icon size={28} strokeWidth={1.5} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-sm font-black text-foreground mb-4 uppercase tracking-widest">{feature.title}</h3>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
