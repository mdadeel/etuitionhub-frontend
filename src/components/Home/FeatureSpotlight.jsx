import { useRef } from 'react';
import { Target, Bell, Headphones } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const features = [
    { 
        icon: Target, 
        title: "TRACK YOUR GROWTH", 
        description: "Monitor performance and improvements." 
    },
    { 
        icon: Bell, 
        title: "REAL-TIME UPDATES", 
        description: "Stay informed with instant notifications." 
    },
    { 
        icon: Headphones, 
        title: "DEDICATED SUPPORT", 
        description: "We're here to help you succeed." 
    }
];

const FeatureSpotlight = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section ref={ref} className="py-24 bg-muted/20 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Mockup Column */}
                    <motion.div 
                        className="lg:w-1/2 relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50 bg-white">
                            <img 
                                src="/dashboard-mockup-new.png" 
                                alt="Managed Progress Dashboard" 
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        {/* Decorative background elements */}
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                    </motion.div>

                    {/* Features Column */}
                    <div className="lg:w-1/2">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-12"
                        >
                            MANAGED <span className="text-primary italic">PROGRESS.</span>
                        </motion.h2>
                        
                        <div className="space-y-12">
                            {features.map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
                                    className="flex gap-6 items-center group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-primary/5 flex items-center justify-center shrink-0 border border-border/50 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-primary/10">
                                        <feature.icon size={28} className="text-primary" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black tracking-tight mb-1 uppercase">{feature.title}</h3>
                                        <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
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

