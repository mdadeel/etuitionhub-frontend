import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
    { title: "Search", description: "Search by subject, class, and education board." },
    { title: "Review", description: "Browse verified tutors with real credentials and reviews." },
    { title: "Connect", description: "Contact your tutor and start learning." }
];

const HowItWorks = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-16 md:py-24 bg-background border-b border-border">
            <div className="max-w-[1200px] mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 block">How It Works</span>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Three steps to better grades</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="flex flex-col"
                        >
                            <div className="text-5xl font-bold text-muted/30 mb-4 tabular-nums">0{i + 1}</div>
                            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
