import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TutorCard from './TutorCard';
import demoTutors from '../../data/demoTutors.json';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star } from "lucide-react";

/**
 * PopularTutors Component
 * Refactored to "Apple macOS Grid Display"
 * Features: High-precision header, balanced density, Apple Card integration.
 */
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
            <section className="py-24 bg-apple-gray-100 dark:bg-apple-gray-950 border-b border-apple-gray-200/50 dark:border-apple-gray-800/50">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-4 apple-card p-4 bg-white dark:bg-apple-gray-900">
                                <Skeleton className="aspect-video w-full rounded-xl bg-apple-gray-200 dark:bg-apple-gray-800" />
                                <Skeleton className="h-5 w-3/4 bg-apple-gray-200 dark:bg-apple-gray-800" />
                                <Skeleton className="h-4 w-1/2 bg-apple-gray-200 dark:bg-apple-gray-800" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-apple-gray-100 dark:bg-apple-gray-950 border-b border-apple-gray-200/50 dark:border-apple-gray-800/50">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-apple-blue">Curated Selection</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-apple-gray-900 dark:text-white leading-tight">
                            Elite Specialists. <br />
                            <span className="text-apple-gray-400">Available now.</span>
                        </h2>
                    </div>
                    <Button variant="ghost" asChild className="p-0 h-auto text-[11px] font-bold tracking-widest uppercase text-apple-blue hover:text-apple-blue/80 hover:bg-transparent group">
                        <Link to="/tutors" className="flex items-center gap-2">
                            Browse All Specialists <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {tutors.map(tutor => (
                        <div key={tutor._id} className="transform hover:scale-[1.01] transition-all duration-300">
                            <TutorCard tutor={tutor} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularTutors;
