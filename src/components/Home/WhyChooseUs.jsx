import { useRef } from 'react';
import { ShieldCheck, Banknote, Clock, Zap } from 'lucide-react';
import { AppleBadge, AppleCard } from '../shared/AppleUI';
import { motion, useInView } from 'framer-motion';

const features = [
    { icon: ShieldCheck, title: "Verified Tutors", description: "Every tutor is background-checked with verified credentials." },
    { icon: Banknote, title: "Transparent Pricing", description: "Clear monthly rates upfront. bKash, Nagad accepted." },
    { icon: Clock, title: "Flexible Scheduling", description: "Morning, evening, or weekend sessions." },
    { icon: Zap, title: "Quick Match", description: "Find a tutor in your area within 24 hours." }
];

const WhyChooseUs = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-16 md:py-24 bg-background">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="mb-10">
                    <AppleBadge variant="primary" className="mb-3">Why e-TuitionBD</AppleBadge>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                        Bangladesh's trusted tutoring platform
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                        >
                            <AppleCard className="p-6">
                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                                    <feature.icon size={24} strokeWidth={1.5} className="text-primary" />
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
}

export default WhyChooseUs;
