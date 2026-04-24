import { useRef } from 'react';
import { AppleCard, AppleBadge } from '../shared/AppleUI';
import { Shield, Zap, Globe, Target } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const features = [
    { icon: Shield, title: "Verified Credentials", description: "Every tutor's academic records and national ID are verified before joining." },
    { icon: Zap, title: "Quick Response", description: "Most tutors respond within 2 hours. Start learning faster." },
    { icon: Globe, title: "Nationwide Coverage", description: "From Dhaka to Sylhet, covering all 8 education boards." },
    { icon: Target, title: "Board-Specific Prep", description: "Tutors specialized in your specific education board." }
];

const FeatureSpotlight = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-16 md:py-24 bg-muted/30">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="mb-10 text-center">
                    <AppleBadge variant="secondary" className="mb-3">Why e-TuitionBD</AppleBadge>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Built for Bangladeshi Students</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                        >
                            <AppleCard className="p-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <feature.icon className="text-primary" size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </AppleCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSpotlight;
