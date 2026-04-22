import React from 'react';
import { AppleCard, AppleBadge } from '../shared/AppleUI';
import { Shield, Zap, Globe, Target } from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: "Verified Nodes",
        description: "Every tutor undergoes a rigorous verification process to ensure academic integrity."
    },
    {
        icon: Zap,
        title: "Instant Connection",
        description: "Our high-speed matching algorithm connects you with the right mentor in minutes."
    },
    {
        icon: Globe,
        title: "Nationwide Reach",
        description: "From Dhaka to Sylhet, access the best educational talent regardless of your location."
    },
    {
        icon: Target,
        title: "Goal-Oriented",
        description: "Set your targets and track your progress with data-driven learning paths."
    }
];

const FeatureSpotlight = () => {
    return (
        <section className="py-32 bg-muted/30">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="mb-20 text-center" data-aos="fade-up">
                    <AppleBadge variant="secondary" className="mb-4">The Infrastructure</AppleBadge>
                    <h2 className="text-4xl font-bold tracking-tight text-foreground">Built for Excellence.</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <AppleCard key={i} className="p-10 group" data-aos="fade-up" data-aos-delay={i * 100}>
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <feature.icon className="text-primary" size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </AppleCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSpotlight;
