import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TutorCard from './TutorCard';
import demoTutors from '../../data/demoTutors.json';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star } from "lucide-react";
import { AppleBadge, AppleCard } from "../shared/AppleUI";

const PopularTutors = () => {
    const [tutors, setTutors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (demoTutors && Array.isArray(demoTutors)) {
                const sorted = [...demoTutors].sort((a, b) => b.ratings - a.ratings).slice(0, 6);
                setTutors(sorted);
            }
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <section className="py-32 bg-apple-gray-50 dark:bg-apple-gray-950/50">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <AppleCard key={i} className="p-4 bg-white dark:bg-apple-gray-900">
                                <Skeleton className="aspect-video w-full rounded-2xl bg-black/5 dark:bg-white/5" />
                                <div className="mt-4 space-y-3">
                                    <Skeleton className="h-5 w-3/4 bg-black/5 dark:bg-white/5" />
                                    <Skeleton className="h-4 w-1/2 bg-black/5 dark:bg-white/5" />
                                </div>
                            </AppleCard>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-32 bg-apple-gray-50 dark:bg-apple-gray-950/50">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl" data-aos="fade-right">
                        <div className="flex items-center gap-2 mb-4">
                            <Star size={12} className="text-primary fill-primary" />
                            <AppleBadge variant="primary">Chapter 4: The Mentors</AppleBadge>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-[1.1]">
                            Expert Guidance. <br />
                            <span className="text-black/20 dark:text-white/20">Human Connection.</span>
                        </h2>
                    </div>
                    <Button variant="ghost" asChild className="p-0 h-auto text-xs font-bold tracking-widest uppercase text-primary hover:text-primary/80 hover:bg-transparent group" data-aos="fade-left">
                        <Link to="/tutors" className="flex items-center gap-2">
                            Browse All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutors.map((tutor, idx) => (
                        <div key={tutor._id} data-aos="fade-up" data-aos-delay={idx * 100}>
                            <TutorCard tutor={tutor} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularTutors;
