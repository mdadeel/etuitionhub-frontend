import { useState } from 'react';
import { Plus } from "lucide-react";

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
        <section className="py-16 bg-white border-b border-slate-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-12 space-y-4 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 text-slate-900 rounded-none border border-slate-200">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Questions & Answers</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                        Frequently Asked <br />
                        <span className="text-blue-600">Questions</span>
                    </h2>
                    <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em]">Got questions? We've got answers.</p>
                </div>

                <div className="max-w-4xl mx-auto space-y-px bg-slate-200 border border-slate-200 w-full">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-none transition-all ${
                                activeIndex === idx ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                            }`}
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left outline-none"
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                            >
                                <span className={`text-sm font-black uppercase tracking-tight transition-colors ${
                                    activeIndex === idx ? 'text-blue-600' : 'text-slate-900'
                                }`}>
                                    {faq.question}
                                </span>
                                <div className={`w-8 h-8 flex items-center justify-center rounded-none transition-all shrink-0 border ${
                                    activeIndex === idx ? 'bg-blue-600 border-blue-600 text-white rotate-45' : 'bg-slate-100 border-slate-200 text-slate-400'
                                }`}>
                                    <Plus size={16} strokeWidth={3} />
                                </div>
                            </button>

                            {activeIndex === idx && (
                                <div className="px-6 pb-6 text-xs text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-2xl border-t border-slate-100 pt-4">
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