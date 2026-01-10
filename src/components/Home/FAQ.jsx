import { useState } from 'react';

const FAQ = () => {
    const faqs = [
        {
            question: "How do I verify a tutor's credentials?",
            answer: "We manually verify every tutor's background, including their academic records and national ID, before their profile goes live."
        },
        {
            question: "Is there a fee for students to post tuitions?",
            answer: "No, posting a tuition requirement is completely free for students and parents."
        },
        {
            question: "How does the payment system work?",
            answer: "We support secure payments via bKash, Nagad, and bank transfers. Payments are held in escrow until the first month is successfully completed."
        },
        {
            question: "Can I switch tutors if I'm not satisfied?",
            answer: "Yes, you can request a replacement within the first week of classes at no extra charge."
        },
        {
            question: "Are the tuition rates fixed?",
            answer: "Rates shown are indicative. You can negotiate the final salary with the tutor before confirming the appointment."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Common Queries</span>
                    <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                            <button
                                className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-white transition-colors text-left"
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                            >
                                <span className="font-bold text-gray-800">{faq.question}</span>
                                <span className={`transform transition-transform duration-300 ${activeIndex === idx ? 'rotate-180' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div 
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 text-sm text-gray-600 leading-relaxed bg-gray-50">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
