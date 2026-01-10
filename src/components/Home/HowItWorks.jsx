// how it works - step by step guide
import { FaSearch, FaUserCheck, FaBookReader } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            title: "Search & Filter",
            description: "Locate the exact expertise you need using our high-signal discovery tools."
        },
        {
            title: "Review & Connect",
            description: "Analyze verified profiles and establish contact with the most qualified talent."
        },
        {
            title: "Commence Session",
            description: "Begin a structured, result-oriented learning process at your preferred location."
        }
    ];

    return (
        <section className="py-32 bg-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 max-w-xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600 mb-2 block">The Process</span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">A structured approach to finding expertise.</h2>
                    <p className="text-gray-500 text-sm">We've removed the noise, leaving only the essential steps to connect you with the right tutor.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col">
                            <div className="text-4xl font-black text-gray-200 mb-6 font-mono">0{i + 1}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
