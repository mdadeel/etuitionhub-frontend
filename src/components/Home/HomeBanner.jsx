import { useNavigate } from 'react-router-dom';
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

const HomeBanner = () => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <section ref={ref} className="relative overflow-hidden py-16 md:py-24">
            <motion.div
                className="max-w-3xl mx-auto px-6 text-center"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <motion.div variants={itemVariants}>
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-6">
                        Bangladesh's #1 Tutoring Platform
                    </span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                    Find the perfect tutor for{" "}
                    <span className="text-primary">your child</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                    Connect with verified tutors across Bangladesh. Expert help for SSC, HSC, and all education boards.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        onClick={() => navigate('/tutors')}
                        className="h-12 px-8 rounded-xl text-base font-semibold"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Find a Tutor
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/tuitions')}
                        className="h-12 px-8 rounded-xl text-base font-semibold"
                    >
                        Browse Tuitions
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        1,200+ Verified Tutors
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        All 8 Education Boards
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HomeBanner;

