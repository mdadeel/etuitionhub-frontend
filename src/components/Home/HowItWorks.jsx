// How It Works Section - 3 steps visual grid (from req.md)
// Keeping this simple - no fancy animations needed here
// data-aos might be removed later, causes weird jumps sometimes
import { FaSearch, FaUserCheck, FaBookReader } from 'react-icons/fa';
// import { useState } from 'react';  // dont need this for now

function HowItWorks() {
    // Hardcoded steps - could move to config but its fine
    const steps = [
        {
            icon: <FaSearch className="text-4xl text-teal-600" />,
            title: "Search Tutors",
            description: "Browse through our verified tutors. Filter by subject, location, and budget."
        },
        {
            icon: <FaUserCheck className="text-4xl text-teal-600" />,
            title: "Choose & Connect",
            description: "Select the perfect tutor for your needs. Apply and wait for approval."
        },
        {
            icon: <FaBookReader className="text-4xl text-teal-600" />,
            title: "Start Learning",
            description: "Once approved, begin your personalized learning journey at home."
        }
    ];

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">How It Works</h2>
                <p className="text-center text-gray-600 mb-10">Simple steps to start learning</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center p-6 rounded-lg bg-base-200 hover:bg-base-300 transition-colors">
                            <div className="mb-4 flex justify-center">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
