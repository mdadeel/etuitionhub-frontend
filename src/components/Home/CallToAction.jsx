import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AppleCard, AppleBadge } from '../shared/AppleUI';
import { motion, useInView } from 'framer-motion';

const CallToAction = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="relative rounded-[4rem] bg-black overflow-hidden py-24 px-12 md:px-24"
                >
                    {/* Abstract Light Orbs */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <AppleBadge variant="outline" className="mb-8 border-white/20 text-white">GET STARTED</AppleBadge>
                        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-12 uppercase">
                            READY TO FIND <span className="text-primary italic">YOUR PERFECT MATCH?</span>
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Button asChild className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 shadow-2xl transition-all active:scale-[0.98]">
                                <Link to="/register">Join the Platform</Link>
                            </Button>
                            <Button variant="outline" asChild className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest border-2 border-white/20 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all active:scale-[0.98]">
                                <Link to="/about">How it Works <ArrowRight className="ml-2 w-5 h-5" /></Link>
                            </Button>
                        </div>

                        <p className="mt-12 text-white/40 font-bold uppercase tracking-widest text-[10px]">
                            Join 10,000+ Students & Tutors Across Bangladesh
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;
