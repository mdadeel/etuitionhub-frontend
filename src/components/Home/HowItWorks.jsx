import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Star, Users } from 'lucide-react';

const steps = [
    { 
        icon: Search, 
        title: "DISCOVER", 
        description: "Find the perfect tutor that fits your needs.",
        color: "bg-blue-600",
        shadow: "shadow-blue-500/20"
    },
    { 
        icon: Star, 
        title: "EVALUATE", 
        description: "Review profiles, ratings, and student feedback.",
        color: "bg-indigo-600",
        shadow: "shadow-indigo-500/20"
    },
    { 
        icon: Users, 
        title: "CONNECT", 
        description: "Start learning and achieve your goals.",
        color: "bg-emerald-600",
        shadow: "shadow-emerald-500/20"
    }
];

const HowItWorks = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section ref={ref} className="py-24 bg-[#0a0a0a] text-white overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
                        THREE STEPS TO <br/>
                        <span className="text-primary italic">MASTERY.</span>
                    </h2>
                </motion.div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Connecting Dotted Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-px border-t-2 border-dashed border-white/10" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 relative z-10">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.2 + (i * 0.2) }}
                                className="group flex flex-col items-center text-center"
                            >
                                <div className="relative mb-10">
                                    <div className={`w-28 h-28 rounded-full ${step.color} ${step.shadow} flex items-center justify-center relative z-10 border-4 border-white/5 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-white/5 group-hover:border-white/10`}>
                                        <step.icon className="w-10 h-10 text-white" strokeWidth={2} />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-black text-sm shadow-xl z-20">
                                        0{i + 1}
                                    </div>
                                    {/* Pulse Effect */}
                                    <div className={`absolute inset-0 rounded-full ${step.color} opacity-20 blur-2xl animate-pulse`} />
                                </div>
                                
                                <h3 className="text-xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors uppercase">{step.title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed max-w-[200px] group-hover:text-white/60 transition-colors">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

