import React from 'react';
import { motion } from 'framer-motion';
import { AppleBadge } from '../shared/AppleUI';

const MissionStatement = () => {
    return (
        <section className="py-40 bg-white dark:bg-apple-gray-950 overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="flex flex-col md:flex-row items-start gap-20">
                    <div className="w-full md:w-1/3" data-aos="fade-right">
                        <AppleBadge variant="primary" className="mb-6">Our Philosophy</AppleBadge>
                        <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white leading-tight">
                            Education is a dialogue, not a transaction.
                        </h2>
                    </div>
                    <div className="w-full md:w-2/3" data-aos="fade-left" data-aos-delay="200">
                        <p className="text-2xl md:text-3xl text-black/40 dark:text-white/40 font-medium leading-relaxed italic">
                            "We believe the right mentor doesn't just teach a subject; they ignite a curiosity that lasts a lifetime. Our mission is to build the bridges that make these connections possible, across every corner of Bangladesh."
                        </p>
                        <div className="mt-12 flex items-center gap-4">
                            <div className="h-[1px] w-12 bg-black/10 dark:bg-white/10"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-black/30 dark:text-white/30">The e-TuitionBD Mission</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionStatement;
