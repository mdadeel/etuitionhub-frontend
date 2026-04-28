import { useNavigate } from 'react-router-dom';
import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Sparkles, CheckCircle2, Star, Users, Briefcase } from "lucide-react";
import CountUp from 'react-countup';

const HomeBanner = () => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    // Animated Title Logic
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["DEDICATED", "EXPERT", "VERIFIED", "PASSIONATE", "RELIABLE"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
        },
    };

    return (
        <section ref={ref} className="relative w-full overflow-hidden bg-background pt-24 pb-16 lg:pt-32 lg:pb-24">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left Column: Content */}
                    <motion.div 
                        className="flex-1 text-center lg:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        <motion.div variants={itemVariants} className="mb-6 inline-flex">
                            <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-bold tracking-wide flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                #1 TUITION PLATFORM IN BANGLADESH
                            </Badge>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground mb-6">
                            CONNECT WITH THE <br />
                            <span className="relative inline-block h-[1.1em] overflow-hidden align-bottom">
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute top-0 left-0 text-primary"
                                        initial={{ opacity: 0, y: "100%" }}
                                        animate={
                                            titleNumber === index
                                                ? { y: "0%", opacity: 1 }
                                                : { y: titleNumber > index ? "-100%" : "100%", opacity: 0 }
                                        }
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    >
                                        {title}.
                                    </motion.span>
                                ))}
                                <span className="invisible pointer-events-none">{titles[0]}.</span>
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl lg:mx-0 mx-auto mb-10 font-medium opacity-90">
                            The nation's reliable way to teach, learn, and excel. <br className="hidden md:block" />
                            For SSC, HSC, O-Level, A-Level, and beyond.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <Button
                                size="lg"
                                onClick={() => navigate('/tutors')}
                                className="h-14 px-8 rounded-xl text-sm font-bold bg-black text-white hover:bg-black/90 shadow-lg shadow-black/10 transition-all hover:shadow-xl active:scale-[0.98] gap-3"
                            >
                                <Search className="w-4.5 h-4.5" />
                                Find a Tutor
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/register')}
                                className="h-14 px-8 rounded-xl text-sm font-bold border-2 border-border/60 bg-transparent hover:bg-muted/50 transition-all active:scale-[0.98] gap-3"
                            >
                                Post a Tuition
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Integrated Image with Glow & Shape */}
                    <motion.div 
                        className="flex-1 relative w-full max-w-[700px] lg:max-w-none flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        {/* Adaptive Background Shape */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-[4rem] border border-border/40 bg-muted/20 rotate-6 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] aspect-square rounded-[5rem] border border-border/20 -rotate-3 pointer-events-none" />

                        {/* Soft Glow Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                        
                        {/* Main Image Container with Masking */}
                        <div 
                            className="relative z-10 mx-auto max-w-xl lg:max-w-2xl overflow-hidden"
                            style={{
                                maskImage: 'radial-gradient(circle at center, black 50%, transparent 98%)',
                                WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 98%)'
                            }}
                        >
                            <img 
                                src="/hero-student.png" 
                                alt="Student Learning" 
                                className="w-full h-auto drop-shadow-sm opacity-95 transition-transform duration-1000"
                            />
                        </div>

                        {/* Decorative background elements */}
                        <div className="absolute top-1/2 left-[-15%] w-4 h-4 rounded-full bg-blue-400/10 blur-sm animate-pulse" />
                        <div className="absolute bottom-[20%] right-[-15%] w-6 h-6 rounded-full bg-primary/10 blur-md animate-pulse" />
                    </motion.div>


                </div>

                {/* Stats Section at Bottom */}
                <motion.div 
                    className="mt-24 pt-12 grid grid-cols-2 md:grid-cols-3 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <div className="flex items-center gap-5 justify-center lg:justify-start">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-foreground tracking-tight">
                                <CountUp end={1200} duration={2} separator="," />+
                            </div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Expert Tutors</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 justify-center lg:justify-start">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-foreground tracking-tight">
                                <CountUp end={98} duration={2} />%
                            </div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Success Rate</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 justify-center lg:justify-start col-span-2 md:col-span-1">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-foreground tracking-tight">
                                <CountUp end={8} duration={2} />
                            </div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Subjects</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeBanner;


