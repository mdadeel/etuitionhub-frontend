import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

/**
 * HomeBanner Component
 * Refactored to "Apple macOS Cinematic Layout"
 * Features: High-precision typography, compact status badges, Apple Blue accents.
 */
const HomeBanner = () => {
    return (
        <section className="bg-white dark:bg-apple-gray-900 pt-16 pb-24 md:pt-24 md:pb-32 border-b border-apple-gray-200/50 dark:border-apple-gray-800/50 relative overflow-hidden">
            {/* Subtle Apple Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-apple-blue/5 blur-[120px] -mr-64 -mt-64 rounded-full"></div>

            <div className="container mx-auto px-6 md:px-12 max-w-[1400px] relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 mb-8 bg-apple-gray-100 dark:bg-apple-gray-800 px-3 py-1 rounded-full border border-apple-gray-200 dark:border-apple-gray-700">
                        <ShieldCheck size={12} className="text-apple-blue" />
                        <span className="text-[10px] font-bold text-apple-gray-500 uppercase tracking-widest">
                            Verified Expert Network
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-apple-gray-900 dark:text-white mb-8 leading-[1.05] text-balance">
                        Precision learning. <br />
                        <span className="text-apple-blue">Specialized results.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-apple-gray-500 dark:text-apple-gray-400 mb-12 max-w-2xl font-medium leading-tight tracking-tight">
                        Connect with the most qualified academic professionals across the nation.
                        A high-fidelity platform for students who demand excellence.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start mb-20">
                        <Button asChild className="mac-pill h-12 px-8 text-[11px] font-bold uppercase tracking-widest bg-apple-blue hover:bg-apple-blue/90 text-white border-none shadow-apple-md">
                            <Link to="/tutors" className="flex items-center gap-2">
                                Find a Specialist <ArrowRight size={14} className="opacity-70" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="mac-pill h-12 px-8 text-[11px] font-bold uppercase tracking-widest bg-white dark:bg-transparent border-apple-gray-200 dark:border-apple-gray-700 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-800 transition-all">
                            <Link to="/tuitions">
                                Browse Openings
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-12 md:gap-20 pt-10 border-t border-apple-gray-100 dark:border-apple-gray-800">
                        <div>
                            <p className="text-3xl font-bold text-apple-gray-900 dark:text-white tracking-tighter">1,200+</p>
                            <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest mt-1">Verified Nodes</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-apple-gray-900 dark:text-white tracking-tighter">850+</p>
                            <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest mt-1">Active Streams</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-apple-blue tracking-tighter">4.9/5</p>
                            <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest mt-1">Satisfaction Rate</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeBanner;
