import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * HomeBanner Component
 * Refactored to "Figma-inspired Human Crafted"
 * Features: Restrained typography, left-aligned flow, nuanced spacing
 */
const HomeBanner = () => {
    return (
        <section className="bg-background pt-10 pb-16 md:pt-18 md:pb-24 border-b border-border/40">
            <div className="container mx-auto px-6 md:px-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary/80"></span>
                        <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                            Trusted by 10,000+ Students
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6 leading-[1.1] text-balance">
                        Find the perfect private tutor for your success.
                    </h1>

                    <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
                        Connect with verified, specialized tutors across Bangladesh. 
                        A smart, calm way to discover learning experiences that drive real results.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 items-start mb-16">
                        <Button asChild className="h-11 px-6 text-sm font-medium rounded-lg shadow-sm transition-all">
                            <Link to="/tutors" className="flex items-center gap-2">
                                Find a Tutor <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="h-11 px-6 text-sm font-medium rounded-lg border-border/80 hover:bg-muted/30 transition-all">
                            <Link to="/tuitions">
                                Browse Jobs
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-8 md:gap-16 pt-8 border-t border-border/40">
                        <div>
                            <p className="text-2xl font-semibold text-foreground tracking-tight">1,200+</p>
                            <p className="text-sm text-muted-foreground mt-1">Verified Tutors</p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-foreground tracking-tight">850+</p>
                            <p className="text-sm text-muted-foreground mt-1">Active Jobs</p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-foreground tracking-tight">4.9/5</p>
                            <p className="text-sm text-muted-foreground mt-1">Student Satisfaction</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeBanner;
