import { useState, useRef } from 'react';
import { Plus, Minus } from "lucide-react";
import { AppleBadge } from '../shared/AppleUI';
import { motion, useInView } from 'framer-motion';

const faqs = [
    { question: "How do you verify tutors?", answer: "Every tutor submits their academic certificates and national ID. We verify all documents manually before activating their profile." },
    { question: "What boards and classes do you cover?", answer: "We cover all 8 education boards of Bangladesh. Our tutors teach from Class 1 to HSC level for all subjects." },
    { question: "How much does tutoring cost?", answer: "On average, SSC tutors charge ৳3,000-৳8,000/month and HSC tutors ৳5,000-৳15,000/month." },
    { question: "How do payments work?", answer: "Parents pay directly to tutors via bKash, Nagad, or bank transfer. We recommend paying monthly after the first satisfactory session." },
    { question: "Can I change tutors if not satisfied?", answer: "Yes. If you're not happy within the first week, we help you find a replacement at no extra cost." }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 bg-background border-t border-border/40">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    
                    {/* Sticky Side Header */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32">
                        <AppleBadge variant="secondary" className="mb-6">FAQ</AppleBadge>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-8 uppercase">
                            STILL <span className="text-primary italic">CURIOUS?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium max-w-sm leading-relaxed">
                            Everything you need to know about Bangladesh's leading educator platform.
                        </p>
                    </div>

                    {/* Accordion List */}
                    <div className="lg:w-2/3 space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className={`group border rounded-[2rem] transition-all duration-500 overflow-hidden ${
                                    activeIndex === idx ? 'border-black bg-muted/20' : 'border-border/60 bg-white hover:border-black/30'
                                }`}
                            >
                                <button
                                    className="w-full flex items-center justify-between p-8 text-left outline-none"
                                    onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                >
                                    <span className={`text-xl font-black tracking-tight transition-colors ${
                                        activeIndex === idx ? 'text-black' : 'text-foreground/80'
                                    }`}>
                                        {faq.question}
                                    </span>
                                    <div className={`transition-transform duration-500 ${activeIndex === idx ? 'rotate-180 text-primary' : 'text-muted-foreground'}`}>
                                        <Plus size={24} strokeWidth={3} />
                                    </div>
                                </button>
                                
                                <motion.div 
                                    initial={false}
                                    animate={{ height: activeIndex === idx ? "auto" : 0, opacity: activeIndex === idx ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-8 pb-8 text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
