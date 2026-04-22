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
        <section className="py-32 bg-apple-gray-50 dark:bg-black/20">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="mb-20 text-center">
                    <AppleBadge variant="secondary" className="mb-4">The Infrastructure</AppleBadge>
                    <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white">Built for Excellence.</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <AppleCard key={i} className="p-8 hover:bg-white dark:hover:bg-apple-gray-900 transition-all duration-500" data-aos="fade-up" data-aos-delay={i * 100}>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <feature.icon className="text-primary" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-black dark:text-white mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed">
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
