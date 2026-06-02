import { useState } from 'react';
import { Plus, Minus } from "lucide-react";
import SectionHeader from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

const faqs = [
    { question: "How do you verify tutors?", answer: "Every tutor submits their academic certificates and national ID. We verify all documents manually before activating their profile to ensure 100% academic integrity." },
    { question: "What boards and classes do you cover?", answer: "We cover all education boards in Bangladesh, including National Curriculum (English & Bangla Version). Our tutors specialize from primary levels to university admission coaching." },
    { question: "How much does tutoring cost?", answer: "Fees are transparent and set by tutors. Typically, primary levels range from ৳2,000-৳4,000, while HSC and Admission levels range from ৳6,000-৳15,000 per month." },
    { question: "How do payments work?", answer: "Parents pay tutors directly through secure channels like bKash, Nagad, or Bank Transfer. There are zero middleman fees on our platform." },
    { question: "Can I change tutors if not satisfied?", answer: "Absolutely. Your satisfaction is our priority. If the tutor is not a perfect fit, our support team will help you find a replacement immediately." }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="py-12 md:py-16 bg-card relative overflow-hidden border-b border-border/50">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <SectionHeader
                    badge="Questions & Answers"
                    title={<>Frequently Asked <span className="text-primary font-semibold">Questions</span></>}
                    subtitle="Got questions? We've got answers."
                    align="center"
                />

                <div className="mt-10 md:mt-12 space-y-3">
                    {faqs.map((faq, idx) => {
                        const isOpen = activeIndex === idx;
                        return (
                            <div key={idx} className="bg-background rounded-xl border border-border/60 overflow-hidden transition-colors">
                                <button
                                    className="w-full flex items-center justify-between p-4 md:p-5 text-left outline-none hover:bg-muted/30 transition-colors"
                                    onClick={() => setActiveIndex(isOpen ? null : idx)}
                                >
                                    <span className={cn(
                                        "text-sm md:text-base font-heading font-medium tracking-tight transition-colors",
                                        isOpen ? 'text-primary' : 'text-foreground'
                                    )}>
                                        {faq.question}
                                    </span>
                                    <div className={cn(
                                        "size-8 flex items-center justify-center rounded-lg transition-all duration-300 shrink-0",
                                        isOpen
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-muted/50 text-muted-foreground'
                                    )}>
                                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                </button>

                                <div className={cn(
                                    "grid transition-all duration-500 ease-in-out overflow-hidden",
                                    isOpen ? "grid-rows-[1fr] max-h-96" : "grid-rows-[0fr] max-h-0"
                                )}>
                                    <div className="min-w-0">
                                        <p className="px-4 pb-4 text-sm text-muted-foreground font-body leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
