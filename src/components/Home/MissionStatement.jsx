import React from 'react';
import { motion } from 'framer-motion';
import { AppleBadge } from '../shared/AppleUI';

const MissionStatement = () => {
    return (
        <section className="py-40 bg-background overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="flex flex-col md:flex-row items-start gap-20">
                    <div className="w-full md:w-1/3" data-aos="fade-right">
                        <AppleBadge variant="primary" className="mb-6">Our Mission</AppleBadge>
                        <h2 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                            Quality education for every student in Bangladesh.
                        </h2>
                    </div>
                    <div className="w-full md:w-2/3" data-aos="fade-left" data-aos-delay="200">
                        <p className="text-2xl md:text-3xl text-muted-foreground font-medium leading-relaxed italic">
                            "Whether you're preparing for PSC, JSC, SSC, or HSC exams—we connect you with the right tutor who understands your board, your curriculum, and your goals. Quality education should be accessible to every student, in every corner of Bangladesh."
                        </p>
                        <div className="mt-12 flex items-center gap-4">
                            <div className="h-[1px] w-12 bg-border"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/30">The e-TuitionBD Promise</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionStatement;
