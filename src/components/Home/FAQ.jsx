import { useState, useRef } from 'react';
import { Plus, Minus } from "lucide-react";
import { motion, useInView, AnimatePresence } from 'framer-motion';

const faqs = [
    { question: "How do you verify tutors?", answer: "Every tutor submits their academic certificates and national ID. We verify all documents manually before activating their profile." },
    { question: "What boards and classes do you cover?", answer: "We cover all 8 education boards of Bangladesh. Our tutors teach from Class 1 to HSC level for all subjects." },
    { question: "How much does tutoring cost?", answer: "On average, SSC tutors charge ৳3,000-৳8,000/month and HSC tutors ৳5,000-৳15,000/month." },
    { question: "How do payments work?", answer: "Parents pay directly to tutors via bKash, Nagad, or bank transfer. We recommend paying monthly after the first satisfactory session." },
    { question: "Can I change tutors if not satisfied?", answer: "Yes. If you're not happy within the first week, we help you find a replacement at no extra cost." }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(0); // Start with first open
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section ref={ref} className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                    
                    {/* Left Column: Heading */}
                    <motion.div 
                        className="lg:w-1/3 lg:sticky lg:top-32"
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-8 uppercase">
                            STILL <span className="text-primary italic">CURIOUS?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium max-w-sm leading-relaxed opacity-70">
                            Everything you need to know about Bangladesh's leading educator platform.
                        </p>
                    </motion.div>

                    {/* Right Column: Accordion List */}
                    <motion.div 
                        className="lg:w-2/3 space-y-6"
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`group rounded-[2rem] border transition-all duration-300 ${
                                    activeIndex === idx 
                                    ? 'border-primary/30 bg-primary/5 shadow-xl shadow-primary/5' 
                                    : 'border-border/50 bg-white hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5'
                                }`}
                            >
                                <button
                                    className="w-full flex items-center justify-between p-8 text-left outline-none"
                                    onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                >
                                    <span className={`text-xl font-bold tracking-tight transition-colors ${
                                        activeIndex === idx ? 'text-foreground' : 'text-foreground/80'
                                    }`}>
                                        {faq.question}
                                    </span>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        activeIndex === idx ? 'bg-primary text-white rotate-180' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                                    }`}>
                                        {activeIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>
                                </button>
                                
                                <AnimatePresence>
                                    {activeIndex === idx && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-8 pb-8 text-base text-muted-foreground font-medium leading-relaxed max-w-3xl border-t border-primary/10 pt-4 mt-2">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;

