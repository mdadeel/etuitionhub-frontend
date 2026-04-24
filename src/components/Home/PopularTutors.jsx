import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TutorCard from '../shared/TutorCard';
import demoTutors from '../../data/demoTutors.json';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star } from "lucide-react";
import { AppleBadge, AppleCard, AppleButton } from "../shared/AppleUI";
import { motion } from 'framer-motion';

const PopularTutors = () => {
    const [tutors, setTutors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (demoTutors && Array.isArray(demoTutors)) {
                const sorted = [...demoTutors].sort((a, b) => (b.rating || 5) - (a.rating || 5)).slice(0, 6);
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
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }
    };

    if (isLoading) {
        return (
            <section className="py-32 bg-muted/30">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <AppleCard key={i} className="p-4 bg-card">
                                <Skeleton className="aspect-video w-full rounded-2xl bg-muted" />
                                <div className="mt-4 space-y-3">
                                    <Skeleton className="h-5 w-3/4 bg-muted" />
                                    <Skeleton className="h-4 w-1/2 bg-muted" />
                                </div>
                            </AppleCard>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-32 bg-muted/30 overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Star size={12} className="text-primary fill-primary" />
                            <AppleBadge variant="primary">Top Rated Tutors</AppleBadge>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                            Meet Bangladesh's <br />
                            <span className="text-muted-foreground/30">best tutors.</span>
                        </h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                        <AppleButton variant="ghost" asChild className="group text-xs font-bold tracking-widest uppercase text-primary">
                            <Link to="/tutors" className="flex items-center gap-2">
                                Browse All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </AppleButton>
                    </motion.div>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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

