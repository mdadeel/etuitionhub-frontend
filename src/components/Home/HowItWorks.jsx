// how it works - step by step guide
import { FaSearch, FaUserCheck, FaBookReader } from 'react-icons/fa';

let steps = [
    {
        icon: <FaSearch className="text-4xl text-teal-600" />, title: "Search Tutors",
        description: "Browse through verified tutors. Filter by subject, location, budget."
    },
    {
        icon: <FaUserCheck className="text-4xl text-teal-600" />, title: "Choose & Connect",
        description: "Select a tutor and apply. Wait for approval from the student."
    },
    {
        icon: <FaBookReader className="text-4xl text-teal-600" />,
        title: "Start Learning", description: "Once approved, begin your personalized learning journey at home."
    }
];

// using function style here
function HowItWorks() {
    // console.log('how it works'); // debug
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">How It Works</h2>
                <p className="text-center text-gray-600 mb-10">Simple steps to start learning</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map(function (step, i) {
                        // old function style in map
                        return (
                            <div key={i} className="text-center p-6 rounded-lg bg-base-200 hover:bg-base-300 transition-colors">
                                <div className="mb-4 flex justify-center">{step.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
