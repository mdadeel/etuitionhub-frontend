import { useRef } from 'react';
import { ShieldCheck, Banknote, Clock, Zap } from 'lucide-react';
import { AppleBadge, AppleCard } from '../shared/AppleUI';
import { motion, useInView } from 'framer-motion';

const features = [
    { 
        icon: ShieldCheck, 
        title: "TRUSTED EXPERTISE", 
        description: "Every educator on our platform undergoes a rigorous 5-step verification process, ensuring only the top 5% of candidates are accepted.",
        badge: "VERIFIED"
    },
    { 
        icon: Banknote, 
        title: "FLAT PRICING", 
        description: "No hidden fees. Pay your tutor directly or through our secure escrow system with bKash, Nagad, or Bank Transfer.",
        badge: "SECURE"
    },
    { 
        icon: Clock, 
        title: "ON YOUR TERMS", 
        description: "Choose your preferred schedule. Early morning, late evening, or intensive weekend bootcamps.",
        badge: "FLEXIBLE"
    },
    { 
        icon: Zap, 
        title: "RAPID MATCH", 
        description: "Our AI-powered matching algorithm connects you with the perfect tutor in your specific area within 24 hours.",
        badge: "INSTANT"
    }
];

const WhyChooseUs = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 bg-background border-y border-border/40">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    
                    {/* Sticky Side Header */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32">
                        <AppleBadge variant="primary" className="mb-6">THE STANDARD</AppleBadge>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-8 uppercase">
                            WHY THE <span className="text-primary italic">BEST</span> CHOOSE US.
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium max-w-sm leading-relaxed">
                            We don't just find tutors. We build the infrastructure for academic breakthroughs across Bangladesh.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                                className="group relative p-8 rounded-[2rem] bg-white border border-border/60 hover:border-black transition-all hover:shadow-apple-xl overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-apple-md group-hover:scale-110 transition-transform">
                                            <feature.icon size={24} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-[9px] font-black tracking-[0.2em] px-3 py-1 rounded-full border border-border/60 uppercase">
                                            {feature.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight mb-3 uppercase">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                                
                                {/* Hover Gradient Decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
