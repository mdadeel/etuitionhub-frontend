import { Search, Star, Users } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "Find",
        description: "Search tutors by subject, class, location"
    },
    {
        icon: Star,
        title: "Compare",
        description: "Review profiles, ratings, experience"
    },
    {
        icon: Users,
        title: "Connect",
        description: "Contact directly and start learning"
    }
];

const HowItWorks = () => {
    return (
        <section className="py-12 bg-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-8 text-center">
                    How it works
                </h2>

                <div className="grid grid-cols-3 gap-6">
                    {steps.map((step, idx) => (
                        <div key={idx} className="text-center">
                            <div className="w-14 h-14 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mb-4 text-lg">
                                {idx + 1}
                            </div>
                            <h3 className="font-medium text-slate-900 text-base mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;