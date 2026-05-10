import { useState } from 'react';
import { Plus, Minus } from "lucide-react";

const faqs = [
    { question: "How do you verify tutors?", answer: "Every tutor submits their academic certificates and national ID. We verify all documents manually before activating their profile." },
    { question: "What boards and classes do you cover?", answer: "We cover all 8 education boards of Bangladesh. Our tutors teach from Class 1 to HSC level for all subjects." },
    { question: "How much does tutoring cost?", answer: "On average, SSC tutors charge ৳3,000-৳8,000/month and HSC tutors ৳5,000-৳15,000/month." },
    { question: "How do payments work?", answer: "Parents pay directly to tutors via bKash, Nagad, or bank transfer. We recommend paying monthly after the first satisfactory session." },
    { question: "Can I change tutors if not satisfied?", answer: "Yes. If you're not happy within the first week, we help you find a replacement at no extra cost." }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="py-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-8 text-center">
                    Frequently Asked Questions
                </h2>

                <div className="max-w-2xl mx-auto space-y-3">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                        >
                            <button
                                className="w-full flex items-center justify-between p-5 text-left"
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                            >
                                <span className="text-sm font-medium text-slate-900 pr-4">
                                    {faq.question}
                                </span>
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors shrink-0 ${
                                    activeIndex === idx ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {activeIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                                </div>
                            </button>

                            {activeIndex === idx && (
                                <div className="px-5 pb-5 text-sm text-slate-600 border-t border-slate-100 pt-4">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;