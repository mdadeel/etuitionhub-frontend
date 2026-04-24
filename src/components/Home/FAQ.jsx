import { useState } from 'react';
import { Plus, Minus } from "lucide-react";
import { AppleBadge } from '../shared/AppleUI';

const FAQ = () => {
    const faqs = [
        {
            question: "How do you verify tutors?",
            answer: "Every tutor submits their academic certificates and national ID. We verify all documents manually before activating their profile. Only verified tutors appear in search results."
        },
        {
            question: "What boards and classes do you cover?",
            answer: "We cover all 8 education boards of Bangladesh including Dhaka, Chittagong, Rajshahi, Sylhet, Barisal, Khulna, Rangpur, and Mymensingh. Our tutors teach from Class 1 to HSC level for all subjects."
        },
        {
            question: "How much does tutoring cost?",
            answer: "Tutoring fees vary by subject, class level, and location. On average, SSC tutors charge ৳3,000-৳8,000/month and HSC tutors ৳5,000-৳15,000/month. Exact rates are discussed directly with the tutor."
        },
        {
            question: "How do payments work?",
            answer: "Parents pay directly to tutors via bKash, Nagad, or bank transfer. We recommend paying monthly after the first satisfactory session. e-TuitionBD does not hold funds in escrow."
        },
        {
            question: "Can I change tutors if not satisfied?",
            answer: "Yes. If you're not happy with your tutor within the first week, we help you find a replacement at no extra cost. Your satisfaction is our priority."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="py-32 bg-background">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    <div className="lg:col-span-5" data-aos="fade-right">
                        <AppleBadge variant="secondary" className="mb-6">FAQ</AppleBadge>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-8">
                            Got questions? <br />
                            <span className="text-muted-foreground/30">We've got answers.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                            Everything you need to know about finding a tutor in Bangladesh.
                        </p>
                    </div>

                    <div className="lg:col-span-7" data-aos="fade-left">
                        <div className="divide-y divide-border border-y border-border">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="group">
                                    <button
                                        className="w-full flex items-center justify-between py-8 text-left transition-all"
                                        onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                    >
                                        <span className={`text-lg font-bold tracking-tight transition-colors ${activeIndex === idx ? 'text-primary' : 'text-foreground'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`transition-all duration-300 ${activeIndex === idx ? 'rotate-180 text-primary' : 'text-muted-foreground/30'}`}>
                                            {activeIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                                        </div>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === idx ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="text-base text-muted-foreground leading-relaxed pr-10">
                                            {faq.answer}
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
