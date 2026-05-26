import { useState } from 'react';
import { Plus } from "lucide-react";
import { SectionHeader } from '@/components/ui';
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
        <section className="py-20 bg-card border-b border-border relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <SectionHeader
                    badge="Questions & Answers"
                    title={<>Frequently Asked <span className="text-primary font-semibold">Questions</span></>}
                    subtitle="Got questions? We've got answers."
                    align="center"
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
                />

                <div className="max-w-3xl mx-auto divide-y divide-border/60 border-t border-b border-border/60 mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
                    {faqs.map((faq, idx) => {
                        const isOpen = activeIndex === idx;
                        return (
                            <div key={idx} className="py-2 transition-colors">
                                <button
                                    className="w-full flex items-center justify-between py-5 text-left outline-none group"
                                    onClick={() => setActiveIndex(isOpen ? null : idx)}
                                >
                                    <span className={cn(
                                        "text-[15px] sm:text-base font-heading font-medium tracking-tight transition-colors duration-250",
                                        isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary/90'
                                    )}>
                                        {faq.question}
                                    </span>
                                    <div className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 shrink-0",
                                        isOpen 
                                            ? 'bg-primary/10 border-primary/20 text-primary rotate-45' 
                                            : 'bg-muted/50 border-border/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
                                    )}>
                                        <Plus size={16} />
                                    </div>
                                </button>

                                <div className={cn(
                                    "grid transition-all duration-300 ease-in-out",
                                    isOpen ? "grid-rows-[1fr] opacity-100 mb-5" : "grid-rows-[0fr] opacity-0"
                                )}>
                                    <div className="overflow-hidden">
                                        <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
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