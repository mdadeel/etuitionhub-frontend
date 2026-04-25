import { useRef } from 'react';
import { ShieldCheck, Banknote, Clock, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const features = [
    { 
        icon: ShieldCheck, 
        title: "TRUSTED EXPERTS", 
        description: "Carefully verified and experienced tutors.",
        color: "bg-blue-50 text-blue-600"
    },
    { 
        icon: Banknote, 
        title: "FAIR PRICING", 
        description: "Affordable for all, no hidden charges.",
        color: "bg-emerald-50 text-emerald-600"
    },
    { 
        icon: Clock, 
        title: "ON YOUR TERMS", 
        description: "Flexible schedules that fit your life.",
        color: "bg-orange-50 text-orange-600"
    },
    { 
        icon: Zap, 
        title: "RAPID MATCH", 
        description: "Get matched with the right tutor quickly.",
        color: "bg-pink-50 text-pink-600"
    }
];

const WhyChooseUs = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <section ref={ref} className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                    
                    {/* Left Column: Heading */}
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-8">
                            WHY THE <span className="text-primary italic">BEST</span> <br />
                            CHOOSE US.
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium max-w-lg leading-relaxed opacity-80">
                            We don't just match tutors and students. We build long-term academic success through trust and quality.
                        </p>
                    </motion.div>

                    {/* Right Column: Features Grid */}
                    <motion.div 
                        className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group p-8 rounded-[2rem] bg-white border border-border/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20"
                            >
                                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-current/10`}>
                                    <feature.icon size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-sm font-black tracking-tight mb-3 uppercase">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;

