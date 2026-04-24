import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, FileText, MessageCircle, ArrowRight } from 'lucide-react';
import { AppleBadge } from '../shared/AppleUI';

const steps = [
    { 
        icon: Search, 
        title: "DISCOVER", 
        description: "Filter by subject, class, and board to find your ideal match.",
        color: "bg-blue-500"
    },
    { 
        icon: FileText, 
        title: "EVALUATE", 
        description: "Review verified credentials and previous student feedback.",
        color: "bg-purple-500"
    },
    { 
        icon: MessageCircle, 
        title: "CONNECT", 
        description: "Message directly and start your personalized learning journey.",
        color: "bg-green-500"
    }
];

const HowItWorks = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 bg-black text-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="text-center mb-20">
                    <AppleBadge variant="outline" className="mb-6 border-white/20 text-white">The Process</AppleBadge>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                        THREE STEPS TO <br/>
                        <span className="text-primary italic">MASTERY.</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: i * 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                                className="group flex flex-col items-center text-center px-8"
                            >
                                <div className="relative mb-10">
                                    <div className={`w-24 h-24 rounded-[2rem] ${step.color} flex items-center justify-center shadow-2xl relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                        <step.icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black text-xl shadow-xl">
                                        0{i + 1}
                                    </div>
                                    {/* Pulse Effect */}
                                    <div className={`absolute inset-0 rounded-[2rem] ${step.color} opacity-20 blur-xl animate-pulse`} />
                                </div>
                                
                                <h3 className="text-2xl font-black tracking-widest mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed max-w-[240px]">
                                    {step.description}
                                </p>
                                
                                {i < steps.length - 1 && (
                                    <div className="md:hidden my-8 opacity-20">
                                        <ArrowRight className="rotate-90 w-8 h-8" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
