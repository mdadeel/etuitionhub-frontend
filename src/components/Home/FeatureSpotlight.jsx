import React from 'react';
import { AppleCard, AppleBadge } from '../shared/AppleUI';
import { Shield, Zap, Globe, Target } from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: "Verified Credentials",
        description: "Every tutor's academic records and national ID are verified before joining our platform."
    },
    {
        icon: Zap,
        title: "Quick Response",
        description: "Most tutors respond to inquiries within 2 hours. Start your learning journey faster."
    },
    {
        icon: Globe,
        title: "Nationwide Coverage",
        description: "From Dhaka to Cox's Bazar, we have tutors covering all 8 education boards of Bangladesh."
    },
    {
        icon: Target,
        title: "Board-Specific Prep",
        description: "Our tutors specialize in your specific board—Dhaka, Chittagong, Rajshahi, Sylhet, and more."
    }
];

const FeatureSpotlight = () => {
    return (
        <section className="py-32 bg-muted/30">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="mb-20 text-center" data-aos="fade-up">
                    <AppleBadge variant="secondary" className="mb-4">What Sets Us Apart</AppleBadge>
                    <h2 className="text-4xl font-bold tracking-tight text-foreground">Built for Bangladeshi Students.</h2>
                    <p className="text-muted-foreground mt-4 max-w-lg mx-auto">We understand the Bangladeshi education system inside out. That's why every feature is designed for your specific needs.</p>
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
