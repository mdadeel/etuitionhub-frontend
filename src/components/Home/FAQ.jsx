import { useState } from 'react';
import { Plus, Minus, HelpCircle } from "lucide-react";

/**
 * FAQ Component
 * Technical Emerald Minimalism Refactor
 */
const FAQ = () => {
    const faqs = [
        {
            question: "CREDENTIAL_VERIFICATION_PROCESS",
            answer: "We manually verify every tutor's background, including academic records and national ID, before profile activation."
        },
        {
            question: "TUITION_POSTING_FEES",
            answer: "No, initializing a tuition requirement is completely free for students and parents."
        },
        {
            question: "TRANSACTION_AND_ESCROW_SYSTEM",
            answer: "We support secure payments via bKash, Nagad, and bank transfers. Funds are held in escrow until the first month is completed."
        },
        {
            question: "SATISFACTION_GUARANTEE_REPLACEMENT",
            answer: "You can request a tutor replacement within the first week of sessions at no extra cost."
        },
        {
            question: "NEGOTIATION_OF_INDICATIVE_RATES",
            answer: "Rates shown are indicative. Final salary negotiation with the tutor is encouraged before confirmation."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="py-32 bg-background border-b border-border">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    <div className="lg:col-span-5">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-6 block">Queries</span>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground uppercase leading-[0.9] mb-10">
                            Common <br />
                            <span className="text-muted-foreground italic">Protocols</span>
                        </h2>
                        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground leading-relaxed max-w-sm">
                            Technical specifications and operational standards for the e-tuitionBD platform ecosystem.
                        </p>
                    </div>

                    <div className="lg:col-span-7 border-l border-border pl-0 lg:pl-12">
                        <div className="divide-y divide-border border-y border-border">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="group overflow-hidden">
                                    <button
                                        className="w-full flex items-center justify-between py-10 text-left transition-all"
                                        onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className="text-[10px] font-black text-primary opacity-50 tabular-nums tracking-widest">
                                                0{idx + 1}
                                            </span>
                                            <span className={`text-sm font-black tracking-[0.05em] uppercase transition-colors ${activeIndex === idx ? 'text-primary' : 'text-foreground'}`}>
                                                {faq.question}
                                            </span>
                                        </div>
                                        <div className={`transition-all duration-300 ${activeIndex === idx ? 'rotate-180 text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                            {activeIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                                        </div>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === idx ? 'max-h-96 opacity-100 mb-10' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="pl-16 pr-10 text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                            <div className="p-8 bg-muted/50 border-l-4 border-primary">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
