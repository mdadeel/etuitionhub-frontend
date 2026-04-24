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
        <section ref={ref} className="py-16 md:py-24 bg-background">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        <AppleBadge variant="secondary" className="mb-3">FAQ</AppleBadge>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
                            Got questions? We've got answers.
                        </h2>
                        <p className="text-muted-foreground">
                            Everything you need to know about finding a tutor in Bangladesh.
                        </p>
                    </motion.div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="border rounded-xl overflow-hidden"
                            >
                                <button
                                    className="w-full flex items-center justify-between p-4 text-left"
                                    onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                >
                                    <span className={`font-medium ${activeIndex === idx ? 'text-primary' : ''}`}>{faq.question}</span>
                                    <div className={activeIndex === idx ? 'text-primary' : 'text-muted-foreground'}>
                                        {activeIndex === idx ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                </button>
                                {activeIndex === idx && (
                                    <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
