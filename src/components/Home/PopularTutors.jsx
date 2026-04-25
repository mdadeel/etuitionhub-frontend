import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TutorCard from '../shared/TutorCard';
import demoTutors from '../../data/demoTutors.json';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star } from "lucide-react";
import { AppleCard } from "../shared/AppleUI";
import { motion, useInView } from 'framer-motion';

const PopularTutors = () => {
    const [tutors, setTutors] = useState([]);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        // Direct assignment to avoid sorting issues if data structure varies
        if (demoTutors && Array.isArray(demoTutors)) {
            setTutors(demoTutors.slice(0, 6));
        } else {
            console.warn("PopularTutors: demoTutors is not an array", demoTutors);
        }
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <section ref={ref} className="py-20 bg-muted/20">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="max-w-xl">
                        
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight uppercase">
                            LEARN FROM <span className="text-primary italic">THE BEST.</span>
                        </h2>
                    </div>
                    <Button variant="ghost" asChild className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0">
                        <Link to="/tutors" className="flex items-center gap-2 group">
                            Explore All <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><ArrowRight className="w-4 h-4" /></div>
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
                        <motion.div key={tutor._id || tutor.id} variants={itemVariants}>
                            <TutorCard tutor={tutor} />
                        </motion.div>
                    ))}
                </motion.div>
                
                {tutors.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed">
                        <p className="text-muted-foreground font-medium">Updating elite tutor listings...</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularTutors;

