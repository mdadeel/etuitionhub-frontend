import { useState } from 'react';
import { Plus, Minus } from "lucide-react";
import { AppleBadge } from '../shared/AppleUI';

const FAQ = () => {
    const faqs = [
        {
            question: "How do you verify your mentors?",
            answer: "We manually verify every tutor's background, including academic records and national ID, before profile activation to ensure the highest quality of education."
        },
        {
            question: "Is there a fee for students or parents?",
            answer: "No, posting a tuition requirement and browsing our database of mentors is completely free for students and parents."
        },
        {
            question: "How does the payment system work?",
            answer: "We support secure payments via bKash, Nagad, and bank transfers. For your security, funds are held in escrow until the first month of tutoring is successfully completed."
        },
        {
            question: "What if I'm not satisfied with the tutor?",
            answer: "Your satisfaction is our priority. You can request a tutor replacement within the first week of sessions at no extra cost."
        },
        {
            question: "Can I negotiate the monthly salary?",
            answer: "Yes. While we provide indicative rates based on subject and level, final salary negotiation between you and the mentor is encouraged before confirmation."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="py-32 bg-white dark:bg-apple-gray-950">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    <div className="lg:col-span-5" data-aos="fade-right">
                        <AppleBadge variant="secondary" className="mb-6">Assurance</AppleBadge>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-8">
                            Everything you <br />
                            <span className="text-black/20 dark:text-white/20">need to know.</span>
                        </h2>
                        <p className="text-lg text-black/50 dark:text-white/50 leading-relaxed max-w-sm">
                            Clear answers to common questions about our platform and operational standards.
                        </p>
                    </div>

                    <div className="lg:col-span-7" data-aos="fade-left">
                        <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05] border-y border-black/[0.05] dark:border-white/[0.05]">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="group">
                                    <button
                                        className="w-full flex items-center justify-between py-8 text-left transition-all"
                                        onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                    >
                                        <span className={`text-lg font-bold tracking-tight transition-colors ${activeIndex === idx ? 'text-primary' : 'text-black dark:text-white'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`transition-all duration-300 ${activeIndex === idx ? 'rotate-180 text-primary' : 'text-black/20 dark:text-white/20'}`}>
                                            {activeIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                                        </div>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === idx ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="text-base text-black/50 dark:text-white/50 leading-relaxed pr-10">
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
