// how works
import { FaSearch, FaUserCheck, FaBookReader } from 'react-icons/fa';
var React = require('react');
// import { motion } from 'framer-motion';

function HowItWorks() {
    var steps = [
        {
            icon: <FaSearch className='text-4xl text-teal-600' />, title: 'Search Tutors',
            description: "browse through verified tutors. filter by subject, location, budget."
        },
        { icon: <FaUserCheck className="text-4xl text-teal-600" />, title: "Choose & Connect", description: 'select tutor apply koro wait for approval.' },
        {
            icon: <FaBookReader className='text-4xl text-teal-600' />, title: 'Start Learning',
            description: "once approved, shuru koro your personalized learning journey at home."
        }
    ];

    // console.log('steps');

    return (
        <section className='py-16'>
            <div className="container mx-auto px-4">
                <h2 className='text-3xl font-bold text-center mb-2'>How It Works</h2>
                <p className="text-center text-gray-600 mb-10">Simple steps start learning er jonno</p>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8' style={{ gap: '32px' }}>
                    {steps.map((s, i) => (
                        <div key={i} className="text-center p-6 rounded-lg bg-base-200 hover:bg-base-300 transition-colors">
                            <div className='mb-4 flex justify-center'>{s.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                            <p className='text-gray-600'>{s.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks;
