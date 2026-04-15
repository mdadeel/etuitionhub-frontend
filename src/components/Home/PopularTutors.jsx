import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TutorCard from './TutorCard';
import demoTutors from '../../data/demoTutors.json';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

/**
 * PopularTutors Component
 * Technical Emerald Minimalism Refactor
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
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <section className="py-32 bg-background border-b border-border">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-video w-full rounded-lg" />
                                <Skeleton className="h-6 w-3/4 rounded-md" />
                                <Skeleton className="h-4 w-1/2 rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-32 bg-background border-b border-border">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
                    <div className="max-w-xl">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4 block">Selection</span>
                        <h2 className='text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase leading-[0.9]'>
                            Verified <br />
                            <span className="text-muted-foreground">Expert Tutors</span>
                        </h2>
                    </div>
                    <Button variant="link" asChild className="p-0 h-auto text-xs font-bold tracking-widest uppercase text-foreground hover:text-primary transition-colors group">
                        <Link to="/tutors" className="flex items-center gap-2">
                            View All Tutors <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutors.map(tutor => (
                        <TutorCard key={tutor._id} tutor={tutor} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularTutors;
