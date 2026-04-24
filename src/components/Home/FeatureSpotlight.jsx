import { useRef } from 'react';
import { AppleCard, AppleBadge } from '../shared/AppleUI';
import { Shield, Zap, Globe, Target } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const features = [
    { 
        icon: Shield, 
        title: "VERIFIED EXPERTS", 
        description: "Background-checked educators with proven track records." 
    },
    { 
        icon: Zap, 
        title: "REAL-TIME MATCHING", 
        description: "Connect with tutors in your area within minutes, not days." 
    },
    { 
        icon: Globe, 
        title: "BOARD SPECIALISTS", 
        description: "Curriculum-aligned teaching for all 8 education boards." 
    }
];

const FeatureSpotlight = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 bg-muted/30 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Mockup Column */}
                    <motion.div 
                        className="lg:w-3/5 relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                        <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-apple-2xl border-8 border-white bg-white">
                            <img 
                                src="/dashboard-mockup.png" 
                                alt="Dashboard Mockup" 
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    </motion.div>

                    {/* Features Column */}
                    <div className="lg:w-2/5">
                        <AppleBadge variant="secondary" className="mb-6">Advanced Infrastructure</AppleBadge>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-12 uppercase">
                            MANAGED <span className="text-primary italic">PROGRESS.</span>
                        </h2>
                        
                        <div className="space-y-10">
                            {features.map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
                                    className="flex gap-6 items-start group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-apple-md flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <feature.icon size={24} className="text-primary" strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight mb-2 uppercase">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default FeatureSpotlight;
