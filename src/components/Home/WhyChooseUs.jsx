import { ShieldCheck, Banknote, Clock, Zap } from 'lucide-react';
import { AppleBadge, AppleCard } from '../shared/AppleUI';

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Expertise",
        description: "Every tutor undergoes a rigorous vetting process before platform inclusion."
    },
    {
        icon: Banknote,
        title: "Transparent Rates",
        description: "Clear, upfront pricing structures with zero hidden administrative fees."
    },
    { 
        icon: Clock, 
        title: "Flexible Scheduling", 
        description: "Schedule sessions around your specific availability and time constraints." 
    },
    {
        icon: Zap,
        title: "Smart Matching",
        description: "Advanced filtering to connect you with the precise expertise required."
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-32 bg-background">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="mb-24" data-aos="fade-right">
                    <AppleBadge variant="primary" className="mb-4">Chapter 5: The Edge</AppleBadge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                        Operational excellence. <br />
                        <span className="text-muted-foreground/30">Built for you.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <AppleCard key={idx} className="p-10 group" data-aos="fade-up" data-aos-delay={idx * 100}>
                            <div className="mb-10 w-14 h-14 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <feature.icon size={28} strokeWidth={1.5} className="text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </AppleCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
