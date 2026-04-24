import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TutorCard from '../shared/TutorCard';
import demoTutors from '../../data/demoTutors.json';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star } from "lucide-react";
import { AppleBadge, AppleCard } from "../shared/AppleUI";
import { motion, useInView } from 'framer-motion';

const PopularTutors = () => {
    const [tutors, setTutors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (demoTutors && Array.isArray(demoTutors)) {
                const sorted = [...demoTutors].sort((a, b) => (b.ratings || b.rating || 5) - (a.ratings || a.rating || 5)).slice(0, 6);
                setTutors(sorted);
            }
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
    };

    if (isLoading) {
        return (
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <AppleCard key={i} className="p-4">
                                <Skeleton className="aspect-[4/3] w-full rounded-xl bg-muted" />
                                <div className="mt-4 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </AppleCard>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={ref} className="py-16 md:py-24 bg-muted/30">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Star size={12} className="text-primary fill-primary" />
                            <AppleBadge variant="primary">Top Tutors</AppleBadge>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                            Bangladesh's best tutors
                        </h2>
                    </div>
                    <Button variant="ghost" asChild className="text-sm text-primary">
                        <Link to="/tutors" className="flex items-center gap-2">
                            View All <ArrowRight size={14} />
                        </Link>
                    </Button>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {tutors.map((tutor) => (
                        <motion.div key={tutor._id} variants={itemVariants}>
                            <TutorCard tutor={tutor} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default PopularTutors;

