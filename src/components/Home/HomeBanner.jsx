import { useNavigate } from 'react-router-dom';
import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, ShieldCheck, Sparkles, MoveRight, PhoneCall } from "lucide-react";
import CountUp from 'react-countup';
import { AppleBadge } from '../shared/AppleUI';

const HomeBanner = () => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    // Animated Title Logic
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["VERIFIED", "EXPERT", "DEDICATED", "PASSIONATE", "RELIABLE"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
        },
    };

    return (
        <section ref={ref} className="relative w-full overflow-hidden min-h-[80vh] flex items-center pt-20 pb-24 md:pt-32 md:pb-32 bg-background">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            </div>

            {/* Floating 3D Illustration (Subtle Background) */}
            <motion.div 
                className="absolute top-1/2 right-10 -translate-y-1/2 w-1/4 opacity-10 lg:opacity-20 pointer-events-none hidden lg:block"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 0.2, x: 0 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <img 
                    src="/home/adeel/.gemini/antigravity/brain/1935b5f0-b1a0-4430-8e79-dbd856222bfa/hero_educational_illustration_1777027702693.png" 
                    alt="" 
                    className="w-full h-auto grayscale select-none"
                />
            </motion.div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
                <div className="flex flex-col items-center text-center gap-10">
                    
                    {/* Top Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <Button variant="secondary" size="sm" className="rounded-full h-10 px-6 border border-border/50 bg-white/50 backdrop-blur-md gap-3 font-bold uppercase tracking-widest text-[10px] shadow-apple-sm hover:bg-white transition-all">
                            <Sparkles className="w-3 h-3 text-primary" />
                            AI-Powered Tutor Matching <MoveRight className="w-3 h-3" />
                        </Button>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        className="max-w-5xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground mb-10 flex flex-col items-center text-center">
                            <span className="block mb-2">CONNECT WITH THE</span>
                            <span className="relative inline-block h-[1.1em] overflow-hidden transition-all duration-300">
                                <span className="invisible pointer-events-none whitespace-nowrap italic text-primary">{titles[titleNumber]}.</span>
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute top-0 left-0 w-full text-center text-primary italic whitespace-nowrap"
                                        initial={{ opacity: 0, y: "-100%" }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: "0%",
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? "-150%" : "150%",
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}.
                                    </motion.span>
                                ))}
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10 font-medium opacity-80">
                            The nation's elite tutoring network. Verified credentials, board-specific curriculum, and academic breakthroughs on demand.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Button
                                size="lg"
                                onClick={() => navigate('/tutors')}
                                className="h-14 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-black/90 shadow-apple-lg transition-all active:scale-[0.98] gap-3"
                            >
                                <Search className="w-4 h-4" />
                                Start Learning
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/register')}
                                className="h-14 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-border/40 bg-white/50 backdrop-blur-md hover:bg-white transition-all active:scale-[0.98] gap-3"
                            >
                                <PhoneCall className="w-4 h-4" />
                                Jump on a Call
                            </Button>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants} 
                            className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 pt-10 border-t border-border/10"
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-black text-foreground tracking-tighter">
                                    <CountUp end={1200} duration={2} separator="," />+
                                </span>
                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Verified Tutors</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-black text-foreground tracking-tighter">
                                    <CountUp end={98} duration={2} />%
                                </span>
                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Success Rate</span>
                            </div>
                            <div className="flex flex-col items-center col-span-2 md:col-span-1">
                                <span className="text-2xl font-black text-foreground tracking-tighter">
                                    <CountUp end={8} duration={2} />
                                </span>
                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Divisions</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;

