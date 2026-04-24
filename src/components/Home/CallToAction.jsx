import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AppleCard } from '../shared/AppleUI';
import { motion, useInView } from 'framer-motion';

const CallToAction = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-16 md:py-24 bg-background">
            <div className="max-w-[1200px] mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <AppleCard className="p-8 md:p-12 bg-foreground text-background">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                Ready to find your perfect tutor?
                            </h2>
                            <p className="text-lg opacity-70 mb-8">
                                Join thousands of students and tutors across Bangladesh who have found their perfect match.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild className="h-12 px-8 rounded-xl font-semibold bg-background text-foreground hover:opacity-90">
                                    <Link to="/register">Get Started</Link>
                                </Button>
                                <Button variant="ghost" asChild className="h-12 px-8 rounded-xl font-semibold text-background/70 hover:text-background hover:bg-background/10">
                                    <Link to="/about">Learn More</Link>
                                </Button>
                            </div>
                        </div>
                    </AppleCard>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;
