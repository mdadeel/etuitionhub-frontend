import { GraduationCap } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MissionStatement = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section ref={ref} className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <motion.div 
                        className="flex-1 text-center lg:text-left"
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-foreground mb-8">
                            QUALITY EDUCATION <br />
                            <span className="text-primary italic">FOR EVERYONE.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl lg:mx-0 mx-auto font-medium opacity-80">
                            Whether you're preparing for <span className="text-foreground font-bold italic">SSC, HSC, or O-Levels</span>—we connect you with educators who don't just teach, but inspire academic breakthroughs across Bangladesh.
                        </p>
                    </motion.div>

                    <motion.div 
                        className="flex-1 flex justify-center lg:justify-end"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <div className="relative">
                            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-primary/5 flex items-center justify-center relative z-10 border border-primary/10">
                                <GraduationCap className="w-24 h-24 md:w-32 md:h-32 text-primary" strokeWidth={1.5} />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-blue-100/50 blur-xl animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-primary/10 blur-2xl animate-pulse delay-700" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MissionStatement;

