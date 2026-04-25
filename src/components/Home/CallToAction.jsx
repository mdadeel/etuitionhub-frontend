import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { motion, useInView } from 'framer-motion';

const CallToAction = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section ref={ref} className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative rounded-[3rem] bg-black overflow-hidden py-16 px-10 md:py-24 md:px-20"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Side: Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-8 uppercase">
                                READY TO TRANSFORM <br />
                                <span className="text-primary italic">YOUR FUTURE?</span>
                            </h2>
                            <p className="text-lg text-white/50 font-medium max-w-xl lg:mx-0 mx-auto">
                                Join the leading platform connecting students with elite educators across Bangladesh. Start your journey today.
                            </p>
                        </div>

                        {/* Right Side: CTA & Metric */}
                        <div className="flex-1 flex flex-col items-center lg:items-end gap-10">
                            <Button asChild size="lg" className="h-20 px-12 rounded-2xl font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-lg">
                                <Link to="/register" className="flex items-center gap-3">
                                    Get Started Now <ArrowRight className="w-6 h-6" />
                                </Link>
                            </Button>

                            {/* Floating Metric Card */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 shadow-2xl"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white">98%</p>
                                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Success Rate</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;

