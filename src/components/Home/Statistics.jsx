import CountUp from 'react-countup';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
    { value: 1200, label: 'Verified Tutors', suffix: '+' },
    { value: 850, label: 'Active Students', suffix: '+' },
    { value: 100, label: 'Specializations', suffix: '+' },
    { value: 4.9, label: 'Satisfaction', suffix: '/5', decimals: 1 }
];

const Statistics = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <section ref={ref} className="py-20 bg-white/50">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="flex flex-col items-center lg:items-start text-center lg:text-left"
                        >
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl md:text-6xl font-black tracking-tight tabular-nums">
                                    {isInView ? (
                                        <CountUp end={stat.value} duration={2} decimals={stat.decimals || 0} separator="," />
                                    ) : (
                                        0
                                    )}
                                </span>
                                <span className="text-xl md:text-2xl font-black text-primary">{stat.suffix}</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mt-4">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Statistics;

